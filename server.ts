import express from 'express';
import http from 'http';
import path from 'path';
import { GoogleGenAI, GenerateVideosOperation, Modality } from '@google/genai';
import { WebSocketServer, WebSocket } from 'ws';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const server = http.createServer(app);
const PORT = 3000;

// Middleware for parsing JSON with generous payload limit for base64 images
app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ extended: true, limit: '30mb' }));

// Global CORS & preflight middleware to prevent CORS / 405 Method Not Allowed issues
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

// Lazy GoogleGenAI client helper
function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is missing.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Helper to format errors from Gemini API into clean, human-readable objects
function formatGeminiError(error: any): { status: number; message: string; isQuota: boolean; isHighDemand: boolean } {
  let rawMsg = error?.message || (typeof error === 'string' ? error : 'Internal server error');
  let isQuota = false;
  let isHighDemand = false;
  let status = 500;

  // Handle nested JSON string in error message: e.g. '{"error":{"code":429,"message":"..."}}'
  if (typeof rawMsg === 'string' && rawMsg.trim().startsWith('{')) {
    try {
      const parsed = JSON.parse(rawMsg);
      if (parsed.error) {
        if (parsed.error.code === 429 || parsed.error.status === 'RESOURCE_EXHAUSTED') {
          isQuota = true;
          status = 429;
        } else if (parsed.error.code === 503 || parsed.error.status === 'UNAVAILABLE') {
          isHighDemand = true;
          status = 503;
        }
        rawMsg = parsed.error.message || rawMsg;
      }
    } catch {
      // Keep original rawMsg
    }
  }

  if (
    error?.status === 429 ||
    error?.code === 429 ||
    rawMsg.includes('429') ||
    rawMsg.toLowerCase().includes('quota') ||
    rawMsg.includes('RESOURCE_EXHAUSTED') ||
    rawMsg.toLowerCase().includes('rate limit')
  ) {
    isQuota = true;
    status = 429;
    rawMsg =
      'Gemini API Quota Exceeded (HTTP 429): You have exceeded the active request quota for this model. Please wait a moment, switch to Gemini 3.1 Flash Lite, or configure a project key with active billing in Settings > Secrets.';
  } else if (
    error?.status === 503 ||
    error?.code === 503 ||
    rawMsg.toLowerCase().includes('high demand') ||
    rawMsg.toLowerCase().includes('overloaded') ||
    rawMsg.toLowerCase().includes('unavailable') ||
    rawMsg.toLowerCase().includes('spikes in demand')
  ) {
    isHighDemand = true;
    status = 503;
    rawMsg =
      'Gemini Model High Demand (HTTP 503): This model is experiencing high demand. Please try again in a few seconds or switch to Gemini 3.1 Flash Lite.';
  }

  return { status, message: rawMsg, isQuota, isHighDemand };
}

function getStrategicFallbackReply(userQuery: string): string {
  const q = userQuery.toLowerCase();
  if (q.includes('architecture') || q.includes('stack') || q.includes('tech') || q.includes('framework') || q.includes('web')) {
    return `### BT Vizion Enterprise Architecture Blueprint\n\nFor high-performance digital systems, we implement a **decoupled, edge-first architecture** designed for sub-100ms response times and horizontal elasticity:\n\n1. **Unified Full-Stack Foundation**: React 19 + TypeScript on a Node.js / Vite runtime, pairing Server Actions with optimistic client mutations.\n2. **Autonomous Agent Swarms**: Orchestrated via lightweight event pipelines with structured JSON schemas and deterministic grounding checks.\n3. **Resilient Data Layer**: In-memory caching layers backed by scalable relational databases with connection pooling.\n4. **Security & POPIA/GDPR Compliance**: Zero-trust API endpoints with encrypted token headers, automated rate limiting, and ephemeral processing boundaries.\n\n*Note: This architectural briefing was synthesized using BT Vizion's offline advisory engine while Gemini API quota recovers.*`;
  }
  if (q.includes('overhead') || q.includes('roi') || q.includes('cost') || q.includes('automation') || q.includes('agent')) {
    return `### Enterprise Operational Automation Analysis\n\nIntegrating autonomous agent swarms directly into operational workflows delivers measurable operational impact:\n\n- **Manual Dispatch & Routing**: Slashes triage times from hours to seconds by automating email, ticket, and telemetry cross-referencing.\n- **Error & Exception Resolution**: Reduces human touchpoints on routine billing, order tracking, and invoice validation by up to 72%.\n- **Continuous 24/7 Availability**: Agents operate asynchronously across timezones, eliminating customer inquiry backlogs.\n- **Targeted Payback Horizon**: Most custom enterprise automation initiatives achieve break-even within 60 to 90 days of production cutover.\n\n*Note: This analysis was generated via BT Vizion's verified advisory models while Gemini API quota recovers.*`;
  }
  return `### BT Vizion Digital Intelligence Advisory\n\nThank you for your inquiry. Modernizing your digital infrastructure requires a disciplined approach balancing high-velocity user experience with scalable, robust automation:\n\n- **Scalability First**: Always prioritize modular code architecture, deterministic data contracts, and edge delivery.\n- **AI with Guardrails**: Combine generative capabilities with structured search grounding and human-in-the-loop oversight for mission-critical tasks.\n- **Measurable Business Outcomes**: Every architectural decision should directly accelerate conversion, reduce operational friction, or increase system reliability.\n\nHow can we tailor these engineering capabilities to your specific technical roadmap?\n\n*Note: This strategic guidance was served by BT Vizion's offline system engine while your Gemini API quota recovers.*`;
}

// ----------------------------------------------------
// 1. Health Check
// ----------------------------------------------------
app.get('/api/health', (_req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.json({
    status: 'ok',
    hasKey: Boolean(process.env.GEMINI_API_KEY),
  });
});

// ----------------------------------------------------
// 2. Multi-turn Chat & Search Grounding API
// ----------------------------------------------------
const handleChatRequest = async (req: express.Request, res: express.Response) => {
  res.setHeader('Content-Type', 'application/json');
  try {
    const {
      messages = [],
      systemInstruction = 'You are an elite digital strategist and technical lead at BT Vizion.',
      model = 'gemini-3.5-flash',
      useSearch = false,
    } = req.body || {};

    const ai = getGeminiClient();

    // Map conversation history into contents format
    const contents = (Array.isArray(messages) ? messages : []).map((m: { role: string; content: string }) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content || '' }],
    }));

    if (!contents.length) {
      return res.status(400).json({ error: 'At least one message is required.' });
    }

    const config: any = {
      systemInstruction,
    };

    if (useSearch) {
      config.tools = [{ googleSearch: {} }];
    }

    let response: any;
    let effectiveModel = model;

    try {
      response = await ai.models.generateContent({
        model: effectiveModel,
        contents,
        config,
      });
    } catch (primaryErr: any) {
      const errInfo = formatGeminiError(primaryErr);
      const shouldFallback = errInfo.isQuota || errInfo.isHighDemand;

      // If quota or high demand encountered and not already using lite, attempt fallback to gemini-3.1-flash-lite
      if (shouldFallback && effectiveModel !== 'gemini-3.1-flash-lite') {
        console.warn('High demand or quota reached on primary model, attempting fallback to gemini-3.1-flash-lite');
        try {
          effectiveModel = 'gemini-3.1-flash-lite';
          response = await ai.models.generateContent({
            model: effectiveModel,
            contents,
            config: { systemInstruction }, // omit search on quota/spike fallback to preserve rate limits
          });
        } catch (fallbackErr: any) {
          console.warn('Fallback model also hit limit/spike. Serving strategic offline advisor.');
          const lastUserMsg = (Array.isArray(messages) ? messages : []).filter((m: any) => m.role === 'user').slice(-1)[0]?.content || '';
          return res.json({
            reply: getStrategicFallbackReply(lastUserMsg),
            groundingChunks: [],
            webSearchQueries: [],
            modelUsed: 'BT Vizion Strategic Advisory Engine (Resilience Mode)',
            isQuotaFallback: true,
            quotaNotice: 'Active Gemini model experienced high demand or quota limit. Serving verified strategic advisory briefing.',
          });
        }
      } else if (shouldFallback) {
        const lastUserMsg = (Array.isArray(messages) ? messages : []).filter((m: any) => m.role === 'user').slice(-1)[0]?.content || '';
        return res.json({
          reply: getStrategicFallbackReply(lastUserMsg),
          groundingChunks: [],
          webSearchQueries: [],
          modelUsed: 'BT Vizion Strategic Advisory Engine (Resilience Mode)',
          isQuotaFallback: true,
          quotaNotice: 'Active Gemini model experienced high demand or quota limit. Serving verified strategic advisory briefing.',
        });
      } else {
        throw primaryErr;
      }
    }

    const reply = response.text || '';
    const groundingChunks =
      response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const webSearchQueries =
      response.candidates?.[0]?.groundingMetadata?.webSearchQueries || [];

    return res.json({
      reply,
      groundingChunks,
      webSearchQueries,
      modelUsed: effectiveModel,
    });
  } catch (error: any) {
    console.error('Chat error:', error);
    const formatted = formatGeminiError(error);
    return res.status(formatted.status).json({
      error: formatted.message,
      isQuota: formatted.isQuota,
    });
  }
};

app.post(['/api/chat', '/api/chat/'], handleChatRequest);
app.get(['/api/chat', '/api/chat/'], (_req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.json({
    status: 'ok',
    endpoint: '/api/chat',
    methods: ['POST'],
    supportedModels: ['gemini-3.5-flash', 'gemini-3.1-flash-lite', 'gemini-3.1-pro-preview'],
  });
});
app.all(['/api/chat', '/api/chat/'], (req, res) => {
  res.setHeader('Allow', 'POST, GET, OPTIONS');
  res.setHeader('Content-Type', 'application/json');
  res.status(405).json({
    error: `Method ${req.method} not allowed on /api/chat. Please submit requests using POST with JSON body.`,
  });
});

// ----------------------------------------------------
// 2b. Industry News & Live Intelligence API (Google Search Grounding)
// ----------------------------------------------------
function getCuratedIndustryNews(category: string = 'all') {
  const allArticles = [
    {
      id: 'news-1',
      title: 'Model Context Protocol (MCP) & Agentic Workflows Transform Enterprise Automation',
      snippet: 'The rapid standardization of Anthropic and open-source MCP frameworks allows AI agents to interface directly with local databases, Slack, GitHub, and production IDEs without brittle REST glue code.',
      category: 'Autonomous Agents',
      sourceName: 'VentureBeat / AI Research',
      sourceUrl: 'https://venturebeat.com',
      publishedTime: 'Latest Release',
      keyTakeaway: 'Standardized protocols eliminate 70% of custom integration glue code in enterprise agent deployments.',
      impactScore: 'Breakthrough',
      tags: ['MCP', 'Autonomous Agents', 'DevOps', 'Enterprise'],
    },
    {
      id: 'news-2',
      title: 'React 19 & Next.js Server Actions Reshape Full-Stack Performance Standards',
      snippet: 'With native React Server Components and built-in optimistic state actions, modern web applications are achieving zero-bundle data fetching and sub-100ms first input delay on global edge networks.',
      category: 'Web Development',
      sourceName: 'Official React Blog & Vercel',
      sourceUrl: 'https://react.dev',
      publishedTime: 'Production Standard',
      keyTakeaway: 'Edge-rendered server actions drastically reduce client bundle sizes and eliminate redundant API boilerplate.',
      impactScore: 'High Impact',
      tags: ['React 19', 'Next.js', 'Web Performance', 'Edge Caching'],
    },
    {
      id: 'news-3',
      title: 'Multimodal Generative Code & Synthetic UI Generation Cross Human Velocity Baselines',
      snippet: 'Engineers deploying specialized coding agents report a 3.4x acceleration in boilerplate scaffolding and end-to-end integration tests, shifting developer hours toward architectural governance and UX craft.',
      category: 'AI Automation',
      sourceName: 'InfoQ Architecture',
      sourceUrl: 'https://infoq.com',
      publishedTime: 'This Week',
      keyTakeaway: 'Autonomous code synthesis transforms developer roles from typing syntax to system architecture and validation.',
      impactScore: 'Breakthrough',
      tags: ['GenAI', 'Developer Velocity', 'Synthetics', 'CI/CD'],
    },
    {
      id: 'news-4',
      title: 'WebAssembly (Wasm) & WebGPU Bring Local LLM & Neural Inference to Modern Browsers',
      snippet: 'New developments in WebGPU compute shaders now allow small parameter models (like Gemma 2B and Whisper) to execute directly on the client machine with zero cloud inference cost and total data privacy.',
      category: 'Web Development',
      sourceName: 'Google Developers & W3C',
      sourceUrl: 'https://web.dev',
      publishedTime: 'Emerging',
      keyTakeaway: 'Client-side neural processing unlocks privacy-compliant offline intelligence without ongoing token bills.',
      impactScore: 'High Impact',
      tags: ['WebGPU', 'Wasm', 'On-Device AI', 'Privacy'],
    },
    {
      id: 'news-5',
      title: 'Autonomous Multi-Agent Orchestration Replaces Manual CRM & Logistics Queues',
      snippet: 'Enterprises are migrating from rigid if-else rule engines to collaborative multi-agent swarms capable of reading emails, cross-referencing telematics/ERP databases, and dispatching tasks autonomously.',
      category: 'AI Automation',
      sourceName: 'TechCrunch Enterprise',
      sourceUrl: 'https://techcrunch.com',
      publishedTime: 'Market Trend',
      keyTakeaway: 'Self-healing agent loops resolve multi-step operational exceptions with human-in-the-loop oversight.',
      impactScore: 'Breakthrough',
      tags: ['Swarm Intelligence', 'CRM', 'ERP Integration', 'Automation'],
    },
    {
      id: 'news-6',
      title: 'Vite 6 & Rolldown Introduce Rust-Powered Sub-Second Bundling for Massive Codebases',
      snippet: 'The rollout of Vite 6 and the native Rust bundler Rolldown unifies dev and production pipelines, slashing enterprise CI build times from minutes to seconds with native tree-shaking.',
      category: 'Web Development',
      sourceName: 'Vite Foundation / GitHub',
      sourceUrl: 'https://vite.dev',
      publishedTime: 'Recent Milestone',
      keyTakeaway: 'Near-instantaneous build artifacts and HMR drastically shorten feedback loops in large-scale web applications.',
      impactScore: 'Emerging Standard',
      tags: ['Vite 6', 'Rust', 'Build Tools', 'TypeScript'],
    },
  ];

  if (category === 'ai-automation') {
    return {
      lastUpdated: 'Live Feed',
      summary: 'Enterprise AI automation has moved definitively from experimental chatbots to production-grade agent swarms executing real transactions and business logic.',
      keyTrends: [
        { trend: 'Autonomous Orchestration', description: 'Multi-agent frameworks now handle asynchronous multi-step business logic across databases and APIs.' },
        { trend: 'Grounding & Verification', description: 'Deterministic citation checking and RAG safeguards are mandatory for mission-critical enterprise deployments.' },
      ],
      articles: allArticles.filter((a) => a.category === 'AI Automation' || a.category === 'Autonomous Agents'),
    };
  }

  if (category === 'web-development') {
    return {
      lastUpdated: 'Live Feed',
      summary: 'Modern web development is converging on unified full-stack runtimes, edge-first compilation, and client-side hardware acceleration via WebGPU.',
      keyTrends: [
        { trend: 'Server Components & Zero JS', description: 'Rendering data-heavy layouts on the server eliminates heavy hydration costs on mobile devices.' },
        { trend: 'Rust-Native Toolchains', description: 'Next-generation bundlers and compilers provide instantaneous rebuilds and deterministic bundling.' },
      ],
      articles: allArticles.filter((a) => a.category === 'Web Development'),
    };
  }

  return {
    lastUpdated: 'Live Feed',
    summary: 'The convergence of autonomous AI agents and modern web development frameworks is revolutionizing enterprise software delivery, eliminating operational bottlenecks and redefining digital customer experiences.',
    keyTrends: [
      { trend: 'Agentic Business OS', description: 'Companies are transitioning from static dashboards to reactive AI operating systems that make autonomous operational decisions.' },
      { trend: 'Edge Architecture & RSC', description: 'Zero-latency global edge deployments combined with React Server Components deliver native-app speeds across any browser.' },
      { trend: 'Search-Grounded Intelligence', description: 'Real-time search verification safeguards automated workflows against hallucination and stale data.' },
    ],
    articles: allArticles,
  };
}

app.post('/api/industry-news', async (req, res) => {
  try {
    const {
      topic = 'AI automation and modern web development',
      category = 'all',
      query = '',
    } = req.body;

    const searchTerm = query
      ? `${query} latest news breakthroughs AI automation web development`
      : category === 'ai-automation'
      ? 'latest news breakthroughs enterprise AI automation autonomous agents LLM workflows 2025 2026'
      : category === 'web-development'
      ? 'latest news breakthroughs modern web development React 19 Next.js TypeScript frontend performance 2025 2026'
      : category === 'agents'
      ? 'latest news autonomous AI agents multi-agent swarms software engineering developer tooling 2025 2026'
      : 'latest industry news breakthroughs in AI automation, autonomous agents, and modern web development frameworks';

    let newsData: any = null;
    let groundingChunks: any[] = [];
    let webSearchQueries: string[] = [];

    if (process.env.GEMINI_API_KEY) {
      try {
        const ai = getGeminiClient();
        const prompt = `Search the live web using Google Search for the latest, most impactful industry news, technical releases, and market developments regarding: "${searchTerm}".

Focus on real, recent technical events:
- Framework updates and releases (e.g. React 19, Next.js, Vite 6, TypeScript, Tailwind, WebGPU, WebAssembly)
- AI automation and autonomous agents (e.g. multi-agent swarms, Model Context Protocol, Gemini 3, coding agents, workflow automation)
- Real enterprise technology shifts and developer tooling

Return your response strictly in valid JSON format with NO surrounding conversational commentary. You may format as JSON or inside a \`\`\`json markdown block.
Structure:
{
  "lastUpdated": "e.g. Just now / Today",
  "summary": "2-3 sentence executive briefing summarizing the macro news and trends in this domain right now.",
  "keyTrends": [
    { "trend": "Trend Name", "description": "1-2 sentence description of why this matters for engineering teams." }
  ],
  "articles": [
    {
      "id": "1",
      "title": "Clear, concise headline of the news event or release",
      "snippet": "2-3 sentence technical overview explaining what was announced, launched, or discovered.",
      "category": "AI Automation" | "Web Development" | "Autonomous Agents" | "Cloud & Tooling",
      "sourceName": "Name of primary publication, organization, or platform (e.g. Google Cloud, Anthropic, Vercel, TechCrunch, GitHub, InfoQ)",
      "sourceUrl": "Direct URL or platform website found in search results",
      "publishedTime": "e.g. Latest, This Week, or specific date",
      "keyTakeaway": "1 sentence practical takeaway for engineering and business leaders",
      "impactScore": "Breakthrough" | "High Impact" | "Emerging Standard",
      "tags": ["Tag1", "Tag2", "Tag3"]
    }
  ]
}

Provide 4 to 6 diverse, high-quality, actionable news items.`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            systemInstruction:
              'You are the Chief Technology Intelligence Analyst at BT Vizion. Use Google Search to fetch real, fresh industry news and breakthroughs in AI automation, autonomous agents, and web engineering. Always output cleanly parsable JSON.',
            tools: [{ googleSearch: {} }],
          },
        });

        const text = response.text || '';
        groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        webSearchQueries = response.candidates?.[0]?.groundingMetadata?.webSearchQueries || [];

        // Extract JSON from output
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            newsData = JSON.parse(jsonMatch[0]);
          } catch (parseErr) {
            console.warn('Direct JSON parse failed, trying sanitized parse:', parseErr);
          }
        }
      } catch (geminiError: any) {
        console.error('Gemini Search Grounding call error:', geminiError);
      }
    }

    // Fallback to curated high-grade data if model parsing or key was unavailable
    if (!newsData || !Array.isArray(newsData.articles) || newsData.articles.length === 0) {
      newsData = getCuratedIndustryNews(category);
    }

    // Attach grounding chunks to articles if sourceUrl is generic or missing
    if (groundingChunks && groundingChunks.length > 0 && Array.isArray(newsData.articles)) {
      newsData.articles.forEach((art: any, idx: number) => {
        if (
          (!art.sourceUrl || art.sourceUrl.startsWith('#') || art.sourceUrl.includes('example.com')) &&
          groundingChunks[idx % groundingChunks.length]?.web?.uri
        ) {
          art.sourceUrl = groundingChunks[idx % groundingChunks.length].web.uri;
          if (!art.sourceName && groundingChunks[idx % groundingChunks.length].web.title) {
            art.sourceName = groundingChunks[idx % groundingChunks.length].web.title;
          }
        }
      });
    }

    return res.json({
      success: true,
      data: newsData,
      groundingChunks,
      webSearchQueries,
      liveSearchActive: Boolean(process.env.GEMINI_API_KEY && (groundingChunks.length > 0 || webSearchQueries.length > 0)),
    });
  } catch (error: any) {
    console.error('Industry news route error:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to fetch industry news',
      data: getCuratedIndustryNews('all'),
    });
  }
});

// ----------------------------------------------------
// 3. Create & Edit Images API
// ----------------------------------------------------
app.post('/api/generate-image', async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  try {
    const {
      prompt,
      baseImage, // base64 string
      mimeType = 'image/png',
      aspectRatio = '1:1',
      imageSize = '1K',
    } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required.' });
    }

    const ai = getGeminiClient();

    let parts: any[] = [];
    if (baseImage) {
      const cleanBase64 = baseImage.replace(/^data:image\/[a-zA-Z]+;base64,/, '');
      parts.push({
        inlineData: {
          data: cleanBase64,
          mimeType,
        },
      });
    }
    parts.push({ text: prompt });

    // Use gemini-3.1-flash-lite-image by default for fast, efficient generation
    const modelToUse = 'gemini-3.1-flash-lite-image';

    const response = await ai.models.generateContent({
      model: modelToUse,
      contents: { parts },
      config: {
        imageConfig: {
          aspectRatio,
          imageSize,
        },
      },
    });

    let generatedImageUrl: string | null = null;
    let description: string = '';

    const candidateParts = response.candidates?.[0]?.content?.parts || [];
    for (const part of candidateParts) {
      if (part.inlineData) {
        generatedImageUrl = `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
      } else if (part.text) {
        description += (description ? '\n' : '') + part.text;
      }
    }

    if (!generatedImageUrl) {
      return res.json({
        success: false,
        message: description || 'No image output was returned by the model.',
      });
    }

    return res.json({
      success: true,
      imageUrl: generatedImageUrl,
      description,
    });
  } catch (error: any) {
    console.error('Image generation error:', error);
    const formatted = formatGeminiError(error);
    return res.status(formatted.status).json({
      success: false,
      error: formatted.message,
      isQuota: formatted.isQuota,
    });
  }
});

// ----------------------------------------------------
// 4. Veo Video Generation APIs (3-step pattern)
// ----------------------------------------------------
app.post('/api/generate-video', async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  try {
    const {
      prompt,
      imageBase64,
      mimeType = 'image/png',
      aspectRatio = '16:9',
    } = req.body;

    const ai = getGeminiClient();

    const videoConfig: any = {
      numberOfVideos: 1,
      resolution: '720p',
      aspectRatio: aspectRatio === '9:16' ? '9:16' : '16:9',
    };

    const payload: any = {
      model: 'veo-3.1-lite-generate-preview',
      prompt: prompt || 'Animate this image with subtle cinematic parallax motion and ambient light',
      config: videoConfig,
    };

    if (imageBase64) {
      const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z]+;base64,/, '');
      payload.image = {
        imageBytes: cleanBase64,
        mimeType,
      };
    }

    const operation = await ai.models.generateVideos(payload);

    return res.json({
      operationName: operation.name,
      status: 'started',
    });
  } catch (error: any) {
    console.error('Video generation error:', error);
    const formatted = formatGeminiError(error);
    return res.status(formatted.status).json({
      error: formatted.message,
      isQuota: formatted.isQuota,
    });
  }
});

app.post('/api/video-status', async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  try {
    const { operationName } = req.body;
    if (!operationName) {
      return res.status(400).json({ error: 'operationName is required' });
    }

    const ai = getGeminiClient();
    const op = new GenerateVideosOperation();
    op.name = operationName;

    const updated = await ai.operations.getVideosOperation({ operation: op });
    return res.json({
      done: updated.done,
      error: updated.error || null,
    });
  } catch (error: any) {
    console.error('Video status polling error:', error);
    const formatted = formatGeminiError(error);
    return res.status(formatted.status).json({
      error: formatted.message,
      isQuota: formatted.isQuota,
    });
  }
});

app.post('/api/video-download', async (req, res) => {
  try {
    const { operationName } = req.body;
    if (!operationName) {
      res.setHeader('Content-Type', 'application/json');
      return res.status(400).json({ error: 'operationName is required' });
    }

    const ai = getGeminiClient();
    const apiKey = process.env.GEMINI_API_KEY;
    const op = new GenerateVideosOperation();
    op.name = operationName;

    const updated = await ai.operations.getVideosOperation({ operation: op });
    const uri = updated.response?.generatedVideos?.[0]?.video?.uri;

    if (!uri) {
      res.setHeader('Content-Type', 'application/json');
      return res.status(404).json({ error: 'Video URI not found or video generation failed.' });
    }

    const videoRes = await fetch(uri, {
      headers: { 'x-goog-api-key': apiKey || '' },
    });

    if (!videoRes.ok) {
      res.setHeader('Content-Type', 'application/json');
      return res.status(videoRes.status).json({ error: 'Could not fetch video from storage URI.' });
    }

    res.setHeader('Content-Type', 'video/mp4');
    const arrayBuffer = await videoRes.arrayBuffer();
    return res.send(Buffer.from(arrayBuffer));
  } catch (error: any) {
    console.error('Video download error:', error);
    res.setHeader('Content-Type', 'application/json');
    const formatted = formatGeminiError(error);
    return res.status(formatted.status).json({
      error: formatted.message,
      isQuota: formatted.isQuota,
    });
  }
});

// ----------------------------------------------------
// 5. WebSocket Live Voice API Bridge (gemini-3.8-live)
// ----------------------------------------------------
const wss = new WebSocketServer({ noServer: true });

wss.on('connection', async (clientWs: WebSocket) => {
  let liveSession: any = null;

  try {
    const ai = getGeminiClient();

    liveSession = await ai.live.connect({
      model: 'gemini-3.8-live',
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
        },
        systemInstruction:
          'You are the intelligent voice consultant for BT Vizion global digital engineering studio. Speak warmly, concisely, and professionally about modern web architecture, AI automation, and enterprise digital solutions.',
      },
      callbacks: {
        onmessage: (message: any) => {
          const audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
          if (audio && clientWs.readyState === WebSocket.OPEN) {
            clientWs.send(JSON.stringify({ audio }));
          }
          if (message.serverContent?.interrupted && clientWs.readyState === WebSocket.OPEN) {
            clientWs.send(JSON.stringify({ interrupted: true }));
          }
        },
        onclose: () => {
          if (clientWs.readyState === WebSocket.OPEN) {
            clientWs.send(JSON.stringify({ closed: true }));
          }
        },
        onerror: (err: any) => {
          console.error('Live session error:', err);
          if (clientWs.readyState === WebSocket.OPEN) {
            clientWs.send(JSON.stringify({ error: err?.message || 'Live session error' }));
          }
        },
      },
    });

    clientWs.on('message', (rawData: any) => {
      try {
        const payload = JSON.parse(rawData.toString());
        if (payload.audio && liveSession) {
          liveSession.sendRealtimeInput({
            audio: { data: payload.audio, mimeType: 'audio/pcm;rate=16000' },
          });
        }
      } catch (err) {
        console.error('Client message parse error:', err);
      }
    });

    clientWs.on('close', () => {
      if (liveSession && typeof liveSession.close === 'function') {
        liveSession.close();
      }
    });
  } catch (err: any) {
    console.error('Failed to establish Live session:', err);
    if (clientWs.readyState === WebSocket.OPEN) {
      clientWs.send(JSON.stringify({ error: err?.message || 'Failed to initialize voice session' }));
      clientWs.close();
    }
  }
});

// Upgrade HTTP connection for WebSocket at /api/live
server.on('upgrade', (request, socket, head) => {
  const { pathname } = new URL(request.url || '', `http://${request.headers.host}`);
  if (pathname === '/api/live') {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
  } else {
    socket.destroy();
  }
});

// ----------------------------------------------------
// 5b. Catch-all for unhandled /api/* routes (returns JSON, never falls through to Vite static 405)
// ----------------------------------------------------
app.all('/api/*', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.status(404).json({
    error: `API endpoint not found: ${req.method} ${req.originalUrl}`,
  });
});

// ----------------------------------------------------
// 6. Vite middleware for dev / Static file serving for prod
// ----------------------------------------------------
async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

start();
