import React from 'react';
import {
  X,
  Home,
  Send,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
  KeyRound,
  BookOpen,
} from 'lucide-react';
import { Platform, SiteSettings } from '../types';

interface SidebarDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  platforms: Platform[];
  settings: SiteSettings;
  onSelectPlatform: (platform: Platform) => void;
  onOpenAdmin: () => void;
  onOpenAccessKey: () => void;
  hasAccessKey: boolean;
}

export const SidebarDrawer: React.FC<SidebarDrawerProps> = ({
  isOpen,
  onClose,
  platforms,
  settings,
  onSelectPlatform,
  onOpenAdmin,
  onOpenAccessKey,
  hasAccessKey,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-72 sm:w-80 max-w-[85vw] bg-[#09100c] border-r border-[#1a2d20] h-full flex flex-col justify-between z-10 shadow-2xl animate-in slide-in-from-left duration-300">
        {/* Drawer Header */}
        <div className="p-4 border-b border-[#16251b] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0e1812] border border-[#22c55e]/50 p-1 flex items-center justify-center overflow-hidden shadow-[0_0_12px_rgba(34,197,94,0.3)]">
              <img
                src={settings.logoUrl || '/logo.png'}
                alt="Logo"
                className="w-full h-full object-cover rounded-lg"
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  target.onerror = null;
                  target.src = '/logo.png';
                }}
              />
            </div>
            <div>
              <span className="text-lg font-black tracking-wide text-white">
                {settings.siteName.split(' ')[0]}{' '}
                <span className="text-emerald-400">
                  {settings.siteName.split(' ').slice(1).join(' ')}
                </span>
              </span>
              <p className="text-[11px] text-gray-400 font-medium leading-none">Free Learning Hub</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="p-2 rounded-xl text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Navigation List */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5">
          {/* Home Active Button */}
          <button
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              onClose();
            }}
            className="w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl bg-[#122318] border border-[#22c55e]/50 text-emerald-300 font-semibold text-sm transition-colors text-left"
          >
            <Home className="w-4 h-4 text-emerald-400" />
            <span>Home</span>
          </button>

          {/* Telegram Channel Button */}
          <a
            href={settings.telegramChannelUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 border border-transparent hover:border-[#1e3425] transition-all text-sm group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-6 h-6 rounded-lg bg-[#0088cc]/20 text-[#0088cc] flex items-center justify-center">
                <Send className="w-3.5 h-3.5 fill-current" />
              </div>
              <span className="font-medium">Telegram Channel</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-gray-500 group-hover:text-gray-300" />
          </a>

          {/* Platforms Section Divider */}
          <div className="pt-3 pb-1 px-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 flex items-center gap-2">
              <BookOpen className="w-3 h-3 text-emerald-500" />
              All Platforms ({platforms.length})
            </span>
          </div>

          {/* Platforms List */}
          <div className="space-y-1">
            {platforms.map((platform) => (
              <button
                key={platform.id}
                onClick={() => {
                  onSelectPlatform(platform);
                  onClose();
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-gray-300 hover:text-white hover:bg-[#121c15] border border-transparent hover:border-[#1b3021] transition-all text-left text-sm group"
              >
                <div
                  className="w-7 h-7 rounded-lg overflow-hidden border p-0.5 flex items-center justify-center bg-[#070d09] shrink-0"
                  style={{ borderColor: `${platform.glowColor}50` }}
                >
                  <img
                    src={platform.icon}
                    alt={platform.name}
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>
                <span className="font-medium truncate group-hover:text-emerald-400 transition-colors">
                  {platform.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Bar matching video at 00:10 */}
        <div className="p-3.5 border-t border-[#18281e] bg-[#0c130f]">
          <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-[#141d17] border border-[#1f3325]">
            <div className="flex items-center gap-2.5 min-w-0">
              {hasAccessKey ? (
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
                  <KeyRound className="w-4 h-4" />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center shrink-0 border border-red-500/30">
                  <AlertCircle className="w-4 h-4" />
                </div>
              )}
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`text-[11px] font-black tracking-wider uppercase ${
                      hasAccessKey ? 'text-emerald-400' : 'text-red-400'
                    }`}
                  >
                    {hasAccessKey ? 'VIP ACCESS' : 'NO ACCESS'}
                  </span>
                </div>
                <p className="text-[11px] text-gray-400 truncate">
                  {hasAccessKey ? 'Access Unlocked' : 'No Access Key'}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                onClose();
                onOpenAccessKey();
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-bold text-black bg-emerald-400 hover:bg-emerald-300 transition-colors shadow-sm shrink-0 cursor-pointer active:scale-95"
            >
              {hasAccessKey ? 'Change' : 'Get Key'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
