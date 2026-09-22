import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Film,
  Play,
  Upload,
  Download,
  Sparkles,
  RefreshCw,
  AlertCircle,
  Clock,
  Video,
  Layers,
  CheckCircle2,
  Trash2,
} from 'lucide-react';
import { safeFetchJson } from '../utils/apiClient';

const REASSURING_MESSAGES = [
  'Initializing Veo neural motion models...',
  'Analyzing spatial layers & optical flow vectors...',
  'Calculating 3D camera trajectory and parallax depth...',
  'Synthesizing photorealistic temporal motion frames...',
  'Ensuring visual consistency across lighting and textures...',
  'Encoding 720p/1080p MP4 stream with high dynamic range...',
  'Finalizing video render. Almost ready for preview...',
];

const MOTION_PRESETS = [
  'Subtle cinematic camera dolly forward with ambient volumetric light rays',
  'Dynamic 360-degree orbital rotation with smooth motion blur',
  'Slow-motion breathing atmospheric depth with floating particles',
  'Speed-ramp hyperlapse zoom through the central subject',
];

export default function AiVideoStudio() {
  const [photo, setPhoto] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const stepTimerRef = useRef<any>(null);

  useEffect(() => {
    if (isGenerating) {
      setCurrentStepIndex(0);
      stepTimerRef.current = setInterval(() => {
        setCurrentStepIndex((prev) => (prev + 1) % REASSURING_MESSAGES.length);
      }, 7000);
    } else {
      if (stepTimerRef.current) {
        clearInterval(stepTimerRef.current);
      }
    }
    return () => {
      if (stepTimerRef.current) clearInterval(stepTimerRef.current);
    };
  }, [isGenerating]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please upload a valid image file (PNG, JPG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const result = uploadEvent.target?.result as string;
      setPhoto(result);
      setErrorMessage(null);
    };
    reader.readAsDataURL(file);
  };

  const handleClearPhoto = () => {
    setPhoto(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleGenerateVideo = async () => {
    if (!photo || isGenerating) return;

    setIsGenerating(true);
    setErrorMessage(null);
    setVideoUrl(null);

    try {
      // Step 1: Start video generation
      const startResult = await safeFetchJson<{
        operationName?: string;
        status?: string;
        error?: string;
      }>('/api/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt || 'Animate this photo with cinematic camera movement and ambient lighting',
          imageBase64: photo,
          aspectRatio,
        }),
      });

      if (!startResult.ok || startResult.error || !startResult.data?.operationName) {
        if (startResult.isQuota) {
          throw new Error(
            'Veo Quota Exceeded (429): Google Veo video generation requires active paid quota. Please configure a paid API key in Settings > Secrets.'
          );
        }
        throw new Error(startResult.error || 'Failed to initialize Veo video generation.');
      }

      const operationName = startResult.data.operationName;

      // Step 2: Poll operation status every 5 seconds until done
      let isDone = false;
      let attempts = 0;
      const maxAttempts = 60; // 5 minutes max

      while (!isDone && attempts < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, 5000));
        attempts++;

        const pollResult = await safeFetchJson<{
          done?: boolean;
          error?: any;
        }>('/api/video-status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ operationName }),
        });

        if (pollResult.data?.error) {
          throw new Error(pollResult.data.error.message || 'Error occurred during Veo rendering.');
        }

        if (pollResult.data?.done) {
          isDone = true;
          break;
        }
      }

      if (!isDone) {
        throw new Error('Video generation timed out. Please try again.');
      }

      // Step 3: Download the video blob via backend proxy
      const downloadRes = await fetch('/api/video-download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ operationName }),
      });

      if (!downloadRes.ok) {
        let errMessage = 'Failed to retrieve rendered video stream.';
        try {
          const errJson = await downloadRes.json();
          if (errJson.error) errMessage = errJson.error;
        } catch {
          // ignore
        }
        throw new Error(errMessage);
      }

      const blob = await downloadRes.blob();
      const localUrl = URL.createObjectURL(blob);
      setVideoUrl(localUrl);
    } catch (err: any) {
      console.error('Veo video generation error:', err);
      const isQuota =
        err.message?.includes('quota') ||
        err.message?.includes('paid') ||
        err.message?.includes('429') ||
        err.message?.includes('RESOURCE_EXHAUSTED');

      setErrorMessage(
        isQuota
          ? 'Veo video generation requires active API quota (429). You can select an authorized billing API key in Settings > Secrets.'
          : err.message || 'Failed to animate video. Please try again.'
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full bg-[#0d0d0f] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-blue-950/60 border border-blue-500/40 text-blue-400">
              <Film className="w-4 h-4" />
            </span>
            <h3 className="text-lg font-bold text-white tracking-tight">
              Veo Motion Animation Engine
            </h3>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Transform static still photography into cinematic video using{' '}
            <span className="text-white font-mono">veo-3.1-fast-generate-preview</span>.
          </p>
        </div>

        {/* Aspect Ratio Badge */}
        <div className="flex items-center space-x-2 text-xs font-mono bg-neutral-900 border border-white/10 px-3 py-1.5 rounded-lg text-neutral-300">
          <Video className="w-3.5 h-3.5 text-blue-400" />
          <span>ASPECT RATIO: {aspectRatio}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
        {/* Left Inputs (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Photo Upload Zone */}
          <div>
            <label className="block text-xs font-mono uppercase text-neutral-400 mb-2 flex items-center justify-between">
              <span>Upload Photo to Animate *</span>
              {photo && (
                <button
                  type="button"
                  onClick={handleClearPhoto}
                  className="text-red-400 hover:text-red-300 flex items-center space-x-1 text-[11px]"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Remove</span>
                </button>
              )}
            </label>

            {photo ? (
              <div className="relative rounded-xl overflow-hidden border border-blue-500/40 bg-black/40 h-44 flex items-center justify-center">
                <img
                  src={photo}
                  alt="Source for animation"
                  className="h-full w-full object-contain"
                />
                <div className="absolute top-2 left-2 bg-black/75 backdrop-blur px-2.5 py-0.5 rounded text-[10px] font-mono text-blue-300 border border-blue-500/30">
                  Ready to Animate
                </div>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-white/15 hover:border-blue-500/50 rounded-xl p-5 text-center cursor-pointer bg-neutral-900/40 hover:bg-neutral-900 transition-all flex flex-col items-center justify-center h-44 group"
              >
                <Upload className="w-7 h-7 text-neutral-400 group-hover:text-blue-400 transition-colors mb-2" />
                <span className="text-xs font-semibold text-neutral-200 group-hover:text-white">
                  Upload a photo to animate
                </span>
                <span className="text-[10px] text-neutral-400 mt-1 max-w-xs">
                  PNG, JPEG, WebP. High resolution portraits or architectural shots work best.
                </span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </div>
            )}
          </div>

          {/* Motion Directive Prompt */}
          <div>
            <label className="block text-xs font-mono uppercase text-neutral-400 mb-2">
              Motion Directive (Optional)
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Smooth cinematic drone pull-back revealing ambient golden-hour sunlight and gentle particle drift..."
              rows={3}
              className="w-full bg-[#0a0a0d] border border-white/15 focus:border-blue-500/50 rounded-xl p-3 text-sm text-white placeholder-neutral-500 focus:outline-none resize-none font-sans"
            />
          </div>

          {/* Quick Motion Presets */}
          <div>
            <span className="block text-[11px] font-mono uppercase text-neutral-400 mb-1.5">
              Cinematic Motion Presets:
            </span>
            <div className="flex flex-col gap-1.5">
              {MOTION_PRESETS.map((m, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setPrompt(m)}
                  className="text-left text-[11px] bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white p-2 rounded-lg border border-white/5 hover:border-white/15 transition-all truncate"
                  title={m}
                >
                  "{m}"
                </button>
              ))}
            </div>
          </div>

          {/* Aspect Ratio Toggle (16:9 Landscape vs 9:16 Portrait) */}
          <div>
            <label className="block text-xs font-mono uppercase text-neutral-400 mb-2">
              Veo Aspect Ratio
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setAspectRatio('16:9')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  aspectRatio === '16:9'
                    ? 'bg-blue-950/40 border-blue-500/60 text-white shadow-[0_0_15px_rgba(59,130,246,0.2)]'
                    : 'bg-neutral-900 border-white/10 text-neutral-400 hover:text-white'
                }`}
              >
                <div className="text-xs font-semibold">16:9 Landscape</div>
                <div className="text-[10px] text-neutral-400">Desktop, Web & TV</div>
              </button>

              <button
                type="button"
                onClick={() => setAspectRatio('9:16')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  aspectRatio === '9:16'
                    ? 'bg-blue-950/40 border-blue-500/60 text-white shadow-[0_0_15px_rgba(59,130,246,0.2)]'
                    : 'bg-neutral-900 border-white/10 text-neutral-400 hover:text-white'
                }`}
              >
                <div className="text-xs font-semibold">9:16 Portrait</div>
                <div className="text-[10px] text-neutral-400">Mobile, Stories & Reels</div>
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="button"
            onClick={handleGenerateVideo}
            disabled={!photo || isGenerating}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs uppercase tracking-wider disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg flex items-center justify-center space-x-2"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Generating Video with Veo...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Video with Veo</span>
              </>
            )}
          </button>

          {errorMessage && (
            <div className="p-3.5 bg-red-950/40 border border-red-500/30 rounded-xl text-xs text-red-200 flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed">{errorMessage}</div>
            </div>
          )}
        </div>

        {/* Right Video Display Canvas (7 cols) */}
        <div className="lg:col-span-7 flex flex-col">
          <div className="w-full flex-1 min-h-[460px] rounded-2xl bg-[#09090b] border border-white/10 flex flex-col items-center justify-center relative overflow-hidden p-4">
            {isGenerating ? (
              <div className="text-center p-8 max-w-md">
                <div className="relative w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-2 border-blue-500/20 border-t-blue-500 animate-spin" />
                  <Film className="w-8 h-8 text-blue-400" />
                </div>

                <h4 className="text-base font-bold text-white tracking-tight">
                  Veo Video Synthesis in Progress
                </h4>

                {/* Reassuring step indicator */}
                <div className="mt-3 p-3 bg-neutral-900/80 border border-white/10 rounded-xl">
                  <p className="text-xs text-blue-300 font-mono transition-all duration-500">
                    {REASSURING_MESSAGES[currentStepIndex]}
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-center space-x-1.5 text-[11px] text-neutral-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Veo generation typically completes in 60-90 seconds</span>
                </div>
              </div>
            ) : videoUrl ? (
              <div className="relative w-full h-full flex flex-col items-center justify-center">
                <video
                  src={videoUrl}
                  controls
                  autoPlay
                  loop
                  playsInline
                  className="max-h-[480px] w-auto max-w-full rounded-xl shadow-2xl border border-white/10"
                />

                <div className="mt-4 flex items-center justify-between w-full pt-3 border-t border-white/10">
                  <span className="text-xs text-neutral-400 font-mono">
                    Aspect Ratio: {aspectRatio} • Format: MP4
                  </span>

                  <a
                    href={videoUrl}
                    download={`veo-animation-${Date.now()}.mp4`}
                    className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-white text-black font-semibold text-xs uppercase tracking-wider hover:bg-neutral-200 transition-all shadow-lg"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download MP4</span>
                  </a>
                </div>
              </div>
            ) : (
              <div className="text-center p-8 max-w-sm">
                <div className="w-16 h-16 rounded-2xl bg-neutral-900 border border-white/10 flex items-center justify-center mx-auto mb-4 text-neutral-400">
                  <Film className="w-8 h-8" />
                </div>
                <h4 className="text-sm font-semibold text-white">Veo Stage Standby</h4>
                <p className="text-xs text-neutral-400 mt-1.5 leading-relaxed">
                  Upload a photo on the left and select your preferred aspect ratio (16:9 or 9:16) to generate video motion.
                </p>
                <div className="mt-4 flex justify-center space-x-2">
                  <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-neutral-400">
                    veo-3.1-fast-generate-preview
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
