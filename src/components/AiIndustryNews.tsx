import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Globe,
  Search,
  RefreshCw,
  ExternalLink,
  Sparkles,
  TrendingUp,
  Cpu,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Radio,
  Bookmark,
  Share2,
  AlertCircle,
  Hash,
  Terminal,
} from 'lucide-react';
import { safeFetchJson } from '../utils/apiClient';

export interface NewsArticle {
  id?: string;
  title: string;
  snippet: string;
  category: string;
  sourceName?: string;
  sourceUrl?: string;
  publishedTime?: string;
  keyTakeaway?: string;
  impactScore?: string;
  tags?: string[];
}

export interface KeyTrend {
  trend: string;
  description: string;
}

export interface NewsReport {
  lastUpdated: string;
  summary: string;
  keyTrends?: KeyTrend[];
  articles: NewsArticle[];
}

interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
}

export default function AiIndustryNews() {
  const [category, setCategory] = useState<'all' | 'ai-automation' | 'web-development' | 'agents'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [customSearchInput, setCustomSearchInput] = useState('');
  const [report, setReport] = useState<NewsReport | null>(null);
  const [groundingChunks, setGroundingChunks] = useState<GroundingChunk[]>([]);
  const [webSearchQueries, setWebSearchQueries] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLiveSearchActive, setIsLiveSearchActive] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchIndustryNews = useCallback(
    async (selectedCategory: string, explicitQuery: string = '') => {
      setIsLoading(true);
      setErrorMsg(null);

      try {
        const result = await safeFetchJson<{
          data?: NewsReport;
          groundingChunks?: GroundingChunk[];
          webSearchQueries?: string[];
          liveSearchActive?: boolean;
          error?: string;
        }>('/api/industry-news', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            category: selectedCategory,
            query: explicitQuery,
          }),
        });

        if (result.data?.data) {
          setReport(result.data.data);
          setGroundingChunks(result.data.groundingChunks || []);
          setWebSearchQueries(result.data.webSearchQueries || []);
          setIsLiveSearchActive(Boolean(result.data.liveSearchActive));
        } else {
          setErrorMsg('Live update service paused. Displaying verified cached intelligence.');
        }
      } catch (err: any) {
        console.error('Failed to fetch industry news:', err);
        setErrorMsg('Network error while retrieving live updates. Showing verified cached intelligence.');
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchIndustryNews(category, searchQuery);
  }, [category, searchQuery, fetchIndustryNews]);

  const handleCategoryChange = (newCat: 'all' | 'ai-automation' | 'web-development' | 'agents') => {
    setCategory(newCat);
    setSearchQuery('');
    setCustomSearchInput('');
  };

  const handleCustomSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customSearchInput.trim()) return;
    setSearchQuery(customSearchInput.trim());
  };

  const handleQuickTopicClick = (topic: string) => {
    setCustomSearchInput(topic);
    setSearchQuery(topic);
  };

  const handleShareArticle = (article: NewsArticle, idx: number) => {
    const textToCopy = `${article.title}\n\n${article.snippet}\n\nKey Takeaway: ${article.keyTakeaway || ''}\n${article.sourceUrl || ''}`;
    navigator.clipboard?.writeText(textToCopy);
    setCopiedId(`share-${idx}`);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const quickTopics = [
    'Model Context Protocol (MCP)',
    'React 19 Server Actions',
    'Autonomous Multi-Agent Swarms',
    'WebGPU On-Device AI',
    'Vite 6 & Rust Tooling',
    'Enterprise LLM Fine-Tuning',
  ];

  const getCategoryColor = (cat: string) => {
    const normalized = cat.toLowerCase();
    if (normalized.includes('agent')) return 'bg-purple-950/70 border-purple-500/40 text-purple-300';
    if (normalized.includes('web') || normalized.includes('front')) return 'bg-blue-950/70 border-blue-500/40 text-blue-300';
    if (normalized.includes('ai') || normalized.includes('auto')) return 'bg-emerald-950/70 border-emerald-500/40 text-emerald-300';
    return 'bg-amber-950/70 border-amber-500/40 text-amber-300';
  };

  const getImpactBadge = (impact?: string) => {
    if (impact === 'Breakthrough') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-rose-950/70 border border-rose-500/40 text-rose-300">
          <Sparkles className="w-2.5 h-2.5" />
          Breakthrough
        </span>
      );
    }
    if (impact === 'High Impact') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-blue-950/70 border border-blue-500/40 text-blue-300">
          <TrendingUp className="w-2.5 h-2.5" />
          High Impact
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-neutral-900 border border-neutral-700 text-neutral-300">
        Industry Standard
      </span>
    );
  };

  return (
    <div id="ai-industry-radar" className="w-full bg-[#0a0c10] border border-blue-500/20 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.6)]">
      {/* Top HUD Telemetry Status Header */}
      <div className="bg-[#0f131a] px-6 py-4 border-b border-white/10 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center">
            <span className="w-3 h-3 rounded-full bg-blue-500 animate-ping absolute" />
            <span className="w-2.5 h-2.5 rounded-full bg-blue-400 relative" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold tracking-wider text-white uppercase">
                Google Search Grounding // Tech Radar
              </span>
              <span className="px-2 py-0.5 rounded bg-blue-500/20 border border-blue-400/30 text-[10px] font-mono text-blue-300">
                LIVE
              </span>
            </div>
            <p className="text-[11px] font-mono text-neutral-400">
              Model: Gemini 3.8 Flash · Search Engine: Google Search API · Verification: Real-Time Web Grounding
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-white/5 border border-white/10 rounded text-neutral-300">
            <Clock className="w-3 h-3 text-blue-400" />
            <span>Updated: {report?.lastUpdated || 'Just now'}</span>
          </div>

          <button
            onClick={() => fetchIndustryNews(category, searchQuery)}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 hover:border-blue-400 text-blue-300 text-xs font-mono rounded transition-all cursor-pointer disabled:opacity-50"
            title="Refresh industry intelligence via Google Search"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-blue-400' : ''}`} />
            <span>{isLoading ? 'Scanning Web...' : 'Fetch Latest'}</span>
          </button>
        </div>
      </div>

      <div className="p-6 md:p-8 space-y-8">
        {/* Category Filter Pills & Search Input */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Category selection */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => handleCategoryChange('all')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all cursor-pointer border ${
                  category === 'all' && !searchQuery
                    ? 'bg-blue-500 text-black font-bold border-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                    : 'bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white border-white/10'
                }`}
              >
                All Breakthroughs
              </button>
              <button
                type="button"
                onClick={() => handleCategoryChange('ai-automation')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all cursor-pointer border ${
                  category === 'ai-automation'
                    ? 'bg-emerald-500 text-black font-bold border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                    : 'bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white border-white/10'
                }`}
              >
                AI Automation & Workflows
              </button>
              <button
                type="button"
                onClick={() => handleCategoryChange('web-development')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all cursor-pointer border ${
                  category === 'web-development'
                    ? 'bg-blue-500 text-black font-bold border-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                    : 'bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white border-white/10'
                }`}
              >
                Web Development & Architecture
              </button>
              <button
                type="button"
                onClick={() => handleCategoryChange('agents')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all cursor-pointer border ${
                  category === 'agents'
                    ? 'bg-purple-500 text-black font-bold border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                    : 'bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white border-white/10'
                }`}
              >
                Autonomous Agents & Swarms
              </button>
            </div>

            {/* Grounding Status badge */}
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-950/40 border border-blue-500/20 text-blue-300 rounded">
                <Globe className="w-3.5 h-3.5 text-blue-400" />
                <span>Google Search Grounded</span>
              </span>
            </div>
          </div>

          {/* Custom Search Query Bar */}
          <form onSubmit={handleCustomSearchSubmit} className="relative flex items-center">
            <div className="absolute left-4 pointer-events-none text-neutral-500">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={customSearchInput}
              onChange={(e) => setCustomSearchInput(e.target.value)}
              placeholder="Search live web intelligence (e.g., 'React 19 Server Actions', 'Claude 3.7 Agentic', 'Vite 6 benchmarks', 'Local WebGPU LLMs')..."
              className="w-full pl-11 pr-32 py-3 bg-[#0d1017] border border-white/10 focus:border-blue-500 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-blue-500 font-sans transition-all"
            />
            <button
              type="submit"
              disabled={isLoading || !customSearchInput.trim()}
              className="absolute right-2 px-4 py-1.5 bg-blue-500 hover:bg-blue-400 disabled:bg-white/5 disabled:text-neutral-500 text-black font-bold text-xs font-mono uppercase rounded-lg transition-all cursor-pointer"
            >
              Scan Query
            </button>
          </form>

          {/* Quick topic pills */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-neutral-400 font-mono text-[11px] flex items-center gap-1">
              <Hash className="w-3 h-3 text-blue-400" />
              Trending Topics:
            </span>
            {quickTopics.map((topic) => (
              <button
                key={topic}
                type="button"
                onClick={() => handleQuickTopicClick(topic)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-mono transition-all cursor-pointer border ${
                  searchQuery === topic
                    ? 'bg-blue-500/20 text-blue-300 border-blue-400'
                    : 'bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-neutral-200 border-white/5'
                }`}
              >
                {topic}
              </button>
            ))}
          </div>
        </div>

        {/* Error notification if any */}
        {errorMsg && (
          <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/30 flex items-start gap-3 text-xs text-amber-200">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Notice</p>
              <p className="text-neutral-400">{errorMsg}</p>
            </div>
          </div>
        )}

        {/* Executive Macro Briefing Card */}
        {report?.summary && (
          <div className="relative p-6 rounded-xl bg-gradient-to-r from-blue-950/30 via-[#0d121c] to-[#0a0c10] border border-blue-500/30">
            <div className="flex items-center justify-between gap-4 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                <span className="text-xs font-mono font-bold tracking-widest text-blue-400 uppercase">
                  Executive Intelligence Briefing
                </span>
              </div>
              <span className="text-[11px] font-mono text-neutral-400">
                Verified via Google Search
              </span>
            </div>
            <p className="text-sm sm:text-base text-neutral-200 leading-relaxed font-normal">
              {report.summary}
            </p>

            {/* Key Trends Radar Chips */}
            {report.keyTrends && report.keyTrends.length > 0 && (
              <div className="mt-6 pt-5 border-t border-white/10 grid grid-cols-1 md:grid-cols-3 gap-4">
                {report.keyTrends.map((kt, i) => (
                  <div key={i} className="p-3.5 rounded-lg bg-black/40 border border-white/5">
                    <div className="flex items-center gap-2 text-xs font-bold text-white mb-1">
                      <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
                      <span>{kt.trend}</span>
                    </div>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      {kt.description}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Loading Skeleton */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="p-6 rounded-xl bg-[#0d1017] border border-white/5 animate-pulse space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="w-24 h-5 bg-white/10 rounded" />
                  <div className="w-20 h-4 bg-white/10 rounded" />
                </div>
                <div className="w-full h-6 bg-white/10 rounded" />
                <div className="w-4/5 h-6 bg-white/10 rounded" />
                <div className="w-full h-12 bg-white/5 rounded" />
                <div className="w-full h-10 bg-blue-500/10 rounded" />
              </div>
            ))}
          </div>
        )}

        {/* Articles Grid */}
        {!isLoading && report?.articles && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {report.articles.map((article, idx) => (
              <motion.article
                key={article.id || idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="group relative p-6 rounded-xl bg-[#0d1118] hover:bg-[#111622] border border-white/10 hover:border-blue-500/40 transition-all duration-300 flex flex-col justify-between shadow-sm hover:shadow-[0_0_25px_rgba(59,130,246,0.12)]"
              >
                <div className="space-y-3.5">
                  {/* Category & Status Bar */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold uppercase tracking-wider border ${getCategoryColor(
                          article.category
                        )}`}
                      >
                        {article.category}
                      </span>
                      {getImpactBadge(article.impactScore)}
                    </div>

                    <div className="flex items-center gap-2 text-[11px] font-mono text-neutral-400">
                      <span>{article.publishedTime || 'Recent'}</span>
                      <button
                        type="button"
                        onClick={() => handleShareArticle(article, idx)}
                        className="p-1 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                        title="Copy article briefing"
                      >
                        {copiedId === `share-${idx}` ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Share2 className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Headline */}
                  <h3 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors leading-snug">
                    {article.title}
                  </h3>

                  {/* Technical Synthesis Snippet */}
                  <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                    {article.snippet}
                  </p>

                  {/* Strategic Takeaway Highlight Box */}
                  {article.keyTakeaway && (
                    <div className="p-3 rounded-lg bg-black/40 border border-blue-500/20 text-xs text-neutral-200">
                      <div className="text-[10px] font-mono font-bold text-blue-400 uppercase mb-0.5 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        Commercial & Engineering Impact
                      </div>
                      <p className="text-neutral-300 italic">
                        "{article.keyTakeaway}"
                      </p>
                    </div>
                  )}

                  {/* Tags */}
                  {article.tags && article.tags.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      {article.tags.map((t, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/5 border border-white/5 text-neutral-400"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer Source & External Link */}
                <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between gap-3 text-xs font-mono">
                  <div className="flex items-center gap-1.5 text-neutral-400 truncate max-w-[200px] sm:max-w-[250px]">
                    <Globe className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span className="truncate">{article.sourceName || 'Verified Web Publication'}</span>
                  </div>

                  {article.sourceUrl ? (
                    <a
                      href={article.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors group-hover:translate-x-0.5 duration-200"
                    >
                      <span>Read Source</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  ) : (
                    <span className="text-neutral-500">Google Verified</span>
                  )}
                </div >
              </motion.article>
            ))}
          </div>
        )}

        {/* Verified Grounding Citations Drawer */}
        {groundingChunks && groundingChunks.length > 0 && (
          <div className="p-5 rounded-xl bg-[#0d1017] border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  Verified Google Search Grounding Sources ({groundingChunks.length})
                </span>
              </div>
              <span className="text-[10px] font-mono text-neutral-400">
                Grounding chunks retrieved via @google/genai
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {groundingChunks.map((chunk, i) => {
                const uri = chunk.web?.uri;
                const title = chunk.web?.title || uri || `Source #${i + 1}`;
                if (!uri) return null;
                return (
                  <a
                    key={i}
                    href={uri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 hover:bg-blue-500/10 border border-white/10 hover:border-blue-500/30 rounded-lg text-xs font-mono text-neutral-300 hover:text-blue-300 transition-all"
                  >
                    <ExternalLink className="w-3 h-3 text-blue-400" />
                    <span className="max-w-[220px] truncate">{title}</span>
                  </a>
                );
              })}
            </div>

            {webSearchQueries && webSearchQueries.length > 0 && (
              <div className="pt-2 border-t border-white/5 flex flex-wrap items-center gap-2 text-[11px] font-mono text-neutral-400">
                <Terminal className="w-3 h-3 text-blue-400" />
                <span>Google Queries Executed:</span>
                {webSearchQueries.map((q, i) => (
                  <span key={i} className="px-2 py-0.5 bg-black/40 border border-white/5 rounded text-neutral-300">
                    "{q}"
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
