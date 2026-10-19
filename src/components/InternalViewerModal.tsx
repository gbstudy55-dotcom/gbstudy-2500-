import React, { useState } from 'react';
import { X, ExternalLink, RefreshCw, Globe, AlertTriangle } from 'lucide-react';
import { Platform } from '../types';

interface InternalViewerModalProps {
  platform: Platform | null;
  onClose: () => void;
}

export const InternalViewerModal: React.FC<InternalViewerModalProps> = ({
  platform,
  onClose,
}) => {
  const [iframeKey, setIframeKey] = useState(1);
  const [hasLoadError, setHasLoadError] = useState(false);

  if (!platform) return null;

  const handleRefresh = () => {
    setIframeKey((prev) => prev + 1);
    setHasLoadError(false);
  };

  const handleOpenExternal = () => {
    window.open(platform.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/95 backdrop-blur-md">
      {/* Top Controls Bar */}
      <div className="h-14 bg-[#0a120d] border-b border-[#1b3122] px-3 sm:px-4 flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-8 h-8 rounded-lg bg-[#070b09] border p-0.5 flex items-center justify-center shrink-0 overflow-hidden"
            style={{ borderColor: platform.glowColor || '#22c55e' }}
          >
            <img src={platform.icon} alt={platform.name} className="w-full h-full object-cover rounded-md" />
          </div>
          <div className="min-w-0">
            <h4 className="text-sm font-bold text-white truncate">{platform.name}</h4>
            <p className="text-[11px] text-gray-400 truncate flex items-center gap-1">
              <Globe className="w-3 h-3 text-emerald-400 shrink-0" />
              <span className="truncate">{platform.url}</span>
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={handleRefresh}
            title="Reload frame"
            className="p-2 rounded-xl text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={handleOpenExternal}
            title="Open in Browser / New Tab"
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 text-xs font-bold transition-colors border border-emerald-500/30"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Open in New Tab</span>
          </button>
          <button
            onClick={onClose}
            title="Close"
            className="p-2 rounded-xl text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Embedded Iframe View */}
      <div className="flex-1 relative w-full h-full bg-[#050806] overflow-hidden">
        {hasLoadError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-4 border border-amber-500/40">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Notice: External Website Protection</h3>
            <p className="text-xs text-gray-400 max-w-md mb-5 leading-relaxed">
              This platform ({platform.name}) restricts direct in-app embedding for security. You can open it smoothly in a new browser tab with one click.
            </p>
            <button
              onClick={handleOpenExternal}
              className="px-6 py-3 rounded-xl bg-emerald-500 text-black font-bold text-sm shadow-lg hover:bg-emerald-400 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Launch {platform.name}</span>
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <iframe
            key={iframeKey}
            src={platform.url}
            title={platform.name}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            onError={() => setHasLoadError(true)}
          />
        )}
      </div>
    </div>
  );
};
