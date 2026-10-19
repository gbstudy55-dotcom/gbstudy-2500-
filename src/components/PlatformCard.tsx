import React from 'react';
import { ExternalLink } from 'lucide-react';
import { Platform } from '../types';

interface PlatformCardProps {
  platform: Platform;
  onClick: () => void;
}

export const PlatformCard: React.FC<PlatformCardProps> = ({ platform, onClick }) => {
  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      className="group relative flex flex-col items-center justify-between p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-[#0c140f]/90 hover:bg-[#111c15] border border-[#182a1e] hover:border-emerald-500/50 transition-all duration-300 transform hover:-translate-y-1.5 hover:shadow-[0_12px_30px_rgba(0,0,0,0.6)] cursor-pointer text-center select-none overflow-hidden"
    >
      {/* Subtle dynamic glow matching card's accent color */}
      <div
        className="absolute -top-10 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full blur-2xl opacity-10 group-hover:opacity-30 transition-opacity pointer-events-none"
        style={{ backgroundColor: platform.glowColor || '#22c55e' }}
      />

      {/* Top external link hint on hover */}
      <div className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 group-hover:text-emerald-400">
        <ExternalLink className="w-3.5 h-3.5" />
      </div>

      {/* Platform Icon with Colored Glowing Ring */}
      <div className="relative mt-2 mb-3">
        <div
          className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl p-1 bg-[#070b09] border-2 transition-all duration-300 group-hover:scale-105 flex items-center justify-center overflow-hidden"
          style={{
            borderColor: platform.glowColor || '#22c55e',
            boxShadow: `0 0 15px ${platform.glowColor}25`,
          }}
        >
          <img
            src={platform.icon}
            alt={platform.name}
            className="w-full h-full object-cover rounded-xl"
            onError={(e) => {
              // Fallback to text initials icon if custom URL fails
              const target = e.currentTarget as HTMLImageElement;
              target.onerror = null;
              target.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="20" fill="%23111827"/><text x="50" y="58" font-family="sans-serif" font-weight="bold" font-size="28" fill="%2322c55e" text-anchor="middle">${encodeURIComponent(
                platform.name.substring(0, 2).toUpperCase()
              )}</text></svg>`;
            }}
          />
        </div>
      </div>

      {/* Platform Name */}
      <div className="w-full">
        <h3 className="font-bold text-sm sm:text-base text-gray-100 group-hover:text-emerald-300 transition-colors tracking-tight line-clamp-1">
          {platform.name}
        </h3>
        {platform.category && (
          <p className="text-[11px] text-gray-400 mt-0.5 line-clamp-1 font-medium">
            {platform.category}
          </p>
        )}
      </div>
    </div>
  );
};
