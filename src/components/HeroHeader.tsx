import React from 'react';
import { Search } from 'lucide-react';
import { SiteSettings } from '../types';

interface HeroHeaderProps {
  settings: SiteSettings;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  categories: string[];
  onTriggerSecretAdmin: () => void;
}

export const HeroHeader: React.FC<HeroHeaderProps> = ({
  settings,
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  categories,
  onTriggerSecretAdmin,
}) => {
  const [tapCount, setTapCount] = React.useState(0);
  const [lastTapTime, setLastTapTime] = React.useState(0);
  const [showSecretHint, setShowSecretHint] = React.useState(false);

  const handleMascotTap = () => {
    const now = Date.now();
    // If more than 1.8 seconds between taps, reset count
    let newCount = 1;
    if (now - lastTapTime < 1800) {
      newCount = tapCount + 1;
    }
    setLastTapTime(now);
    setTapCount(newCount);

    // Show subtle hint if user is actively tapping (e.g. at 12+ taps)
    if (newCount >= 10 && newCount < 20) {
      setShowSecretHint(true);
    }
    if (newCount >= 20) {
      setTapCount(0);
      setShowSecretHint(false);
      onTriggerSecretAdmin();
    }
  };

  return (
    <div className="relative pt-6 pb-8 px-4 text-center flex flex-col items-center">
      {/* Radial green ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Floating Animated Mascot / Logo with 20-tap secret trigger */}
      <div className="relative mb-5 z-10 flex flex-col items-center">
        <div
          onClick={handleMascotTap}
          role="button"
          tabIndex={0}
          title="GB STUDY"
          className="w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1 bg-gradient-to-b from-[#22c55e]/60 via-[#10b981]/30 to-transparent shadow-[0_0_35px_rgba(34,197,94,0.35)] animate-float cursor-pointer active:scale-90 transition-transform select-none"
        >
          <div className="w-full h-full rounded-full bg-[#08120c] p-2 flex items-center justify-center overflow-hidden border border-[#22c55e]/40">
            <img
              src={settings.logoUrl || '/logo.png'}
              alt={settings.siteName}
              className="w-full h-full object-cover rounded-full pointer-events-none"
              onError={(e) => {
                const target = e.currentTarget as HTMLImageElement;
                target.onerror = null;
                target.src = '/logo.png';
              }}
            />
          </div>
        </div>

        {/* Secret tap indicator shown only when tapping consecutively 10+ times */}
        {showSecretHint && tapCount >= 10 && tapCount < 20 && (
          <div className="absolute -bottom-7 px-2.5 py-0.5 rounded-full bg-[#122419] border border-emerald-500/40 text-[10px] text-emerald-400 font-mono tracking-wider animate-pulse">
            Unlock in {20 - tapCount} taps...
          </div>
        )}
      </div>

      {/* Heading matching the video layout: "Welcome to Study Panda" -> "Welcome to GB STUDY" */}
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-2.5 z-10">
        Welcome to{' '}
        <span className="bg-gradient-to-r from-[#22c55e] via-[#4ade80] to-[#10b981] bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(34,197,94,0.4)]">
          {settings.siteName}
        </span>
      </h1>

      {/* Subtitle matching video: "Education Must be Free For Everyone" */}
      <p className="text-sm sm:text-base text-gray-300 font-medium max-w-md mx-auto mb-6 z-10">
        Education Must be{' '}
        <span className="text-emerald-400 font-bold underline decoration-emerald-500/50 underline-offset-4">
          Free
        </span>{' '}
        For Everyone
      </p>

      {/* Search Input */}
      <div className="w-full max-w-md relative z-10 mb-4">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-emerald-400 absolute left-4 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search platform or course (PW, JEE, NEET...)"
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#0d1611]/90 border border-[#1b3123] focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/50 text-sm text-white placeholder-gray-500 outline-none transition-all shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 text-xs text-gray-400 hover:text-white px-2 py-1 rounded bg-white/5"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Category Filter Tabs */}
      {categories.length > 1 && (
        <div className="flex flex-wrap items-center justify-center gap-1.5 max-w-xl mx-auto z-10">
          <button
            onClick={() => onSelectCategory('all')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-emerald-500 text-black shadow-[0_0_12px_rgba(34,197,94,0.4)]'
                : 'bg-[#0f1712] text-gray-400 hover:text-white border border-[#192b1f]'
            }`}
          >
            All Platforms
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-emerald-500 text-black shadow-[0_0_12px_rgba(34,197,94,0.4)]'
                  : 'bg-[#0f1712] text-gray-400 hover:text-white border border-[#192b1f]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
