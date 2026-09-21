import { useState } from 'react';
import { Lock, RotateCw, ExternalLink, Maximize2 } from 'lucide-react';

export interface BrowserView {
  id: string;
  name: string;
  urlPath?: string;
  image: string;
  badge?: string;
  description?: string;
}

interface BrowserMockupProps {
  title: string;
  domain: string;
  views: BrowserView[];
  aspectRatio?: string;
  className?: string;
  onExpand?: () => void;
  interactive?: boolean;
  seamless?: boolean;
}

export default function BrowserMockup({
  title,
  domain,
  views,
  aspectRatio = 'aspect-[16/10]',
  className = '',
  onExpand,
  interactive = true,
  seamless = false,
}: BrowserMockupProps) {
  const [activeViewIndex, setActiveViewIndex] = useState(0);
  const currentView = views[activeViewIndex] || views[0];
  const fullUrl = `https://${domain}${currentView?.urlPath ? `/${currentView.urlPath}` : ''}`;

  return (
    <div
      className={`${
        seamless
          ? 'w-full overflow-hidden group/browser'
          : `rounded-lg border border-blue-500/25 bg-[#0a0d14]/95 shadow-xl overflow-hidden transition-all duration-300 hover:border-blue-400/50 group/browser ${className}`
      }`}
    >
      {/* Minimal Browser Top Bar */}
      <div className="bg-[#0b0f19] px-3.5 py-2.5 border-b border-white/10 flex items-center justify-between gap-3 text-xs select-none">
        {/* Window Controls (Traffic Dots) */}
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 group-hover/browser:bg-rose-500 transition-colors"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 group-hover/browser:bg-amber-500 transition-colors"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 group-hover/browser:bg-emerald-500 transition-colors"></span>
        </div>

        {/* View / Tab Switchers (if multiple views available) */}
        {interactive && views.length > 1 && (
          <div className="hidden sm:flex items-center gap-1 overflow-x-auto no-scrollbar max-w-[40%]">
            {views.map((view, idx) => (
              <button
                key={view.id || idx}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveViewIndex(idx);
                }}
                className={`px-2 py-0.5 text-[10px] font-mono tracking-wider rounded transition-all whitespace-nowrap cursor-pointer ${
                  activeViewIndex === idx
                    ? 'bg-blue-500/25 text-blue-300 font-semibold border border-blue-400/40'
                    : 'text-neutral-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
                title={view.description || view.name}
              >
                {view.name}
              </button>
            ))}
          </div>
        )}

        {/* URL Pill */}
        <div className="flex-1 max-w-sm mx-auto flex items-center justify-center gap-1.5 px-3 py-1 rounded bg-[#05070c] border border-white/10 text-[11px] font-mono text-neutral-300 truncate">
          <Lock className="w-3 h-3 text-emerald-400 shrink-0" />
          <span className="truncate text-neutral-200 font-medium">{fullUrl}</span>
        </div>

        {/* Browser Right Action Icons */}
        <div className="flex items-center gap-2 shrink-0 text-neutral-400">
          <RotateCw className="w-3 h-3 hover:text-blue-300 transition-colors cursor-pointer hidden xs:block" />
          {onExpand ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onExpand();
              }}
              className="p-0.5 hover:text-blue-300 transition-colors cursor-pointer"
              title="Expand view"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          ) : (
            <ExternalLink className="w-3 h-3 hover:text-blue-300 transition-colors opacity-70" />
          )}
        </div>
      </div>

      {/* Screen Viewport - Crisp raw UI display without darkening gradients */}
      <div className={`relative ${aspectRatio} w-full overflow-hidden bg-[#040608]`}>
        <img
          src={currentView?.image}
          alt={`${title} - ${currentView?.name || 'Screen'}`}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-top transition-transform duration-500 ease-out group-hover/browser:scale-[1.02]"
        />

        {/* Current View Badge */}
        {currentView?.badge && (
          <div className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded bg-black/90 border border-blue-500/30 text-[10px] font-mono text-blue-300 uppercase backdrop-blur-md shadow-md">
            {currentView.badge}
          </div>
        )}

        {/* Multi-view indicator dots for mobile */}
        {views.length > 1 && (
          <div className="sm:hidden absolute bottom-2.5 right-2.5 flex items-center gap-1.5 px-2 py-1 rounded bg-black/85 border border-white/10 backdrop-blur-sm">
            {views.map((_, idx) => (
              <span
                key={idx}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  activeViewIndex === idx ? 'bg-blue-400 w-3' : 'bg-neutral-600'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
