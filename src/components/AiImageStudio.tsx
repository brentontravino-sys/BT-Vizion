import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import {
  Image as ImageIcon,
  Wand2,
  Upload,
  Download,
  Sparkles,
  RefreshCw,
  Sliders,
  Layers,
  CheckCircle2,
  AlertCircle,
  Maximize2,
  Trash2,
} from 'lucide-react';

const ASPECT_RATIOS = [
  { label: '1:1 Square', value: '1:1', desc: 'Social & Avatars' },
  { label: '16:9 Landscape', value: '16:9', desc: 'Hero Banners & Web' },
  { label: '9:16 Portrait', value: '9:16', desc: 'Mobile Stories & Reels' },
  { label: '4:3 Standard', value: '4:3', desc: 'Editorial Media' },
  { label: '3:4 Vertical', value: '3:4', desc: 'Product Cards' },
];

const PRESET_PROMPTS = [
  'Futuristic glassmorphic analytics dashboard with holographic neon blue charts and dark obsidian textures',
  'Minimalist 3D isometric representation of an enterprise cloud infrastructure node in chrome and matte black',
  'High-speed fiber optic data flow across Johannesburg skyline at twilight, cinematic editorial lighting',
  'Autonomous AI neural core processor floating in zero-gravity with crystalline refraction',
];

export default function AiImageStudio() {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [imageSize, setImageSize] = useState('1K');
  const [baseImage, setBaseImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [description, setDescription] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please upload a valid image file (PNG, JPG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const result = uploadEvent.target?.result as string;
      setBaseImage(result);
      setErrorMessage(null);
    };
    reader.readAsDataURL(file);
  };

  const handleClearBaseImage = () => {
    setBaseImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          baseImage,
          aspectRatio,
          imageSize,
        }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || 'Failed to generate image.');
      }

      if (data.imageUrl) {
        setGeneratedImage(data.imageUrl);
        setDescription(data.description || 'Generated with gemini-3.1-flash-image');
      } else {
        throw new Error(data.message || 'Model did not return image data.');
      }
    } catch (err: any) {
      console.error('Image Studio Error:', err);
      // If error indicates billing/quota limitation, provide informative resolution
      const isQuotaOrPaid =
        err.message?.includes('quota') ||
        err.message?.includes('paid') ||
        err.message?.includes('429') ||
        err.message?.includes('RESOURCE_EXHAUSTED');

      setErrorMessage(
        isQuotaOrPaid
          ? 'Image generation with gemini-3.1-flash-image requires active API quota. You can select your project API key from the top AI Studio settings to enable unlimited generations.'
          : err.message || 'Failed to generate image. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!generatedImage) return;
    const a = document.createElement('a');
    a.href = generatedImage;
    a.download = `bt-vizion-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="w-full bg-[#0d0d0f] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl">
      {/* Studio Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-purple-950/60 border border-purple-500/40 text-purple-400">
              <Wand2 className="w-4 h-4" />
            </span>
            <h3 className="text-lg font-bold text-white tracking-tight">
              Visual Creation & Image Editing Studio
            </h3>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Engineered with <span className="text-white font-mono">gemini-3.1-flash-image</span> for high-resolution asset generation and multi-modal image manipulation.
          </p>
        </div>

        {/* Model Spec Badge */}
        <div className="flex items-center space-x-2 text-xs font-mono bg-neutral-900 border border-white/10 px-3 py-1.5 rounded-lg text-neutral-300">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>RESOLUTION: {imageSize} • {aspectRatio}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
        {/* Left Form Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Base Image Upload Zone (Optional Image-to-Image editing) */}
          <div>
            <label className="block text-xs font-mono uppercase text-neutral-400 mb-2 flex items-center justify-between">
              <span>Source Image (Optional for Editing)</span>
              {baseImage && (
                <button
                  type="button"
                  onClick={handleClearBaseImage}
                  className="text-red-400 hover:text-red-300 flex items-center space-x-1 text-[11px]"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Remove</span>
                </button>
              )}
            </label>

            {baseImage ? (
              <div className="relative rounded-xl overflow-hidden border border-purple-500/40 bg-black/40 h-36 flex items-center justify-center">
                <img
                  src={baseImage}
                  alt="Base to edit"
                  className="h-full w-full object-contain"
                />
                <div className="absolute top-2 left-2 bg-black/70 backdrop-blur px-2 py-0.5 rounded text-[10px] font-mono text-purple-300 border border-purple-500/30">
                  Editing Source
                </div>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-white/15 hover:border-purple-500/50 rounded-xl p-4 text-center cursor-pointer bg-neutral-900/40 hover:bg-neutral-900 transition-all flex flex-col items-center justify-center h-32 group"
              >
                <Upload className="w-6 h-6 text-neutral-400 group-hover:text-purple-400 transition-colors mb-1.5" />
                <span className="text-xs font-medium text-neutral-300 group-hover:text-white">
                  Drop photo here or click to upload
                </span>
                <span className="text-[10px] text-neutral-400 mt-1">
                  Leave empty to generate brand new image from text
                </span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            )}
          </div>

          {/* Prompt Textarea */}
          <div>
            <label className="block text-xs font-mono uppercase text-neutral-400 mb-2">
              {baseImage ? 'Instruction for Editing' : 'Text Prompt'}
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={
                baseImage
                  ? 'e.g., "Transform the lighting into a futuristic neon night scene and add sleek holographic HUD overlays"'
                  : 'Describe what you want to create in vivid detail...'
              }
              rows={4}
              className="w-full bg-[#0a0a0d] border border-white/15 focus:border-purple-500/50 rounded-xl p-3 text-sm text-white placeholder-neutral-500 focus:outline-none resize-none font-sans"
            />
          </div>

          {/* Preset Prompts Chips */}
          <div>
            <span className="block text-[11px] font-mono uppercase text-neutral-400 mb-1.5">
              Quick Concept Presets:
            </span>
            <div className="flex flex-col gap-1.5">
              {PRESET_PROMPTS.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setPrompt(p)}
                  className="text-left text-[11px] bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white p-2 rounded-lg border border-white/5 hover:border-white/15 transition-all truncate"
                  title={p}
                >
                  "{p}"
                </button>
              ))}
            </div>
          </div>

          {/* Aspect Ratio Selector */}
          <div>
            <label className="block text-xs font-mono uppercase text-neutral-400 mb-2">
              Aspect Ratio
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {ASPECT_RATIOS.map((ratio) => (
                <button
                  key={ratio.value}
                  type="button"
                  onClick={() => setAspectRatio(ratio.value)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    aspectRatio === ratio.value
                      ? 'bg-purple-950/40 border-purple-500/60 text-white shadow-[0_0_15px_rgba(168,85,247,0.15)]'
                      : 'bg-neutral-900 border-white/10 text-neutral-400 hover:text-white'
                  }`}
                >
                  <div className="text-xs font-semibold">{ratio.label}</div>
                  <div className="text-[10px] text-neutral-400 truncate">{ratio.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <button
            type="button"
            onClick={handleGenerate}
            disabled={!prompt.trim() || isLoading}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs uppercase tracking-wider disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Synthesizing Image...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>{baseImage ? 'Apply AI Edit' : 'Generate High-Res Asset'}</span>
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

        {/* Right Preview Canvas (7 cols) */}
        <div className="lg:col-span-7 flex flex-col">
          <div className="w-full flex-1 min-h-[420px] rounded-2xl bg-[#09090b] border border-white/10 flex flex-col items-center justify-center relative overflow-hidden p-4">
            {generatedImage ? (
              <div className="relative w-full h-full flex flex-col items-center justify-center">
                <img
                  src={generatedImage}
                  alt="Generated asset"
                  className="max-h-[480px] w-auto max-w-full rounded-xl object-contain shadow-2xl border border-white/10"
                />

                <div className="mt-4 flex items-center justify-between w-full pt-3 border-t border-white/10">
                  <span className="text-xs text-neutral-400 font-mono">
                    Aspect Ratio: {aspectRatio}
                  </span>

                  <button
                    type="button"
                    onClick={handleDownload}
                    className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-white text-black font-semibold text-xs uppercase tracking-wider hover:bg-neutral-200 transition-all shadow-lg"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PNG</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center p-8 max-w-sm">
                <div className="w-16 h-16 rounded-2xl bg-neutral-900 border border-white/10 flex items-center justify-center mx-auto mb-4 text-neutral-400">
                  <ImageIcon className="w-8 h-8" />
                </div>
                <h4 className="text-sm font-semibold text-white">Visual Stage Ready</h4>
                <p className="text-xs text-neutral-400 mt-1.5 leading-relaxed">
                  Enter a text prompt on the left or upload an image to begin creative synthesis.
                </p>
                <div className="mt-4 flex justify-center space-x-2">
                  <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-neutral-400">
                    512px
                  </span>
                  <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-purple-300">
                    1K Res
                  </span>
                  <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-neutral-400">
                    2K / 4K
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
