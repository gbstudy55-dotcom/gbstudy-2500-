import React from 'react';
import { Send, Shield } from 'lucide-react';
import { SiteSettings } from '../types';

interface NavbarProps {
  onOpenSidebar: () => void;
  onOpenAdmin: () => void;
  onOpenTelegram: () => void;
  settings: SiteSettings;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenSidebar,
  onOpenAdmin,
  onOpenTelegram,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full px-4 py-3 sm:px-6 bg-[#070b09]/80 backdrop-blur-md border-b border-[#132218]/40">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        {/* Top-Left Hamburger Menu Button (styled exactly like the video) */}
        <button
          onClick={onOpenSidebar}
          aria-label="Open menu"
          className="w-11 h-11 rounded-xl bg-[#0d1611] border border-emerald-500/40 hover:border-emerald-400 p-2.5 flex flex-col justify-center items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(34,197,94,0.15)] hover:shadow-[0_0_20px_rgba(34,197,94,0.3)] active:scale-95 cursor-pointer group"
        >
          <span className="w-5 h-0.5 bg-emerald-400 group-hover:bg-emerald-300 transition-colors rounded-full" />
          <span className="w-5 h-0.5 bg-emerald-400 group-hover:bg-emerald-300 transition-colors rounded-full" />
          <span className="w-5 h-0.5 bg-emerald-400 group-hover:bg-emerald-300 transition-colors rounded-full" />
        </button>

        {/* Right side quick actions */}
        <div className="flex items-center gap-2">
          {/* Telegram Community Quick Button */}
          <button
            onClick={onOpenTelegram}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#0e1813] border border-[#1d3625] hover:border-sky-500/50 text-sky-400 text-xs font-semibold transition-all hover:bg-[#12221b] cursor-pointer"
          >
            <Send className="w-3.5 h-3.5 fill-current" />
            <span className="hidden sm:inline">Community</span>
          </button>
        </div>
      </div>
    </header>
  );
};
