import React from 'react';
import { X, Send, Users } from 'lucide-react';
import { SiteSettings } from '../types';

interface TelegramModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: SiteSettings;
}

export const TelegramModal: React.FC<TelegramModalProps> = ({
  isOpen,
  onClose,
  settings,
}) => {
  if (!isOpen) return null;

  const { telegramPopup, telegramChannelUrl, logoUrl } = settings;

  const handleJoinClick = () => {
    window.open(telegramChannelUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md transition-all duration-300"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm rounded-[28px] bg-[#0c130f] border border-[#1e3425] p-6 text-center shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient Top Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Community Mascot / Logo */}
        <div className="flex justify-center mb-5 mt-2">
          <div className="relative">
            <div className="w-24 h-24 rounded-2xl bg-[#08100b] border-2 border-[#22c55e] p-1.5 shadow-[0_0_25px_rgba(34,197,94,0.4)] flex items-center justify-center overflow-hidden">
              <img
                src={logoUrl || '/logo.png'}
                alt="Community Logo"
                className="w-full h-full object-cover rounded-xl"
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  target.onerror = null;
                  target.src = '/logo.png';
                }}
              />
            </div>
            {/* Telegram Mini Icon Badge */}
            <div className="absolute -bottom-2 -right-2 bg-[#29b6f6] text-white p-1.5 rounded-full shadow-lg border-2 border-[#0c130f]">
              <Send className="w-3.5 h-3.5 fill-current" />
            </div>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-2xl font-bold tracking-tight text-white mb-2">
          {telegramPopup.title || "Join Community!"}
        </h3>

        {/* Description */}
        <p className="text-sm leading-relaxed text-gray-300 px-2 mb-5">
          {telegramPopup.description ||
            "This site can be banned anytime. Please join our channel for latest updates and direct support."}
        </p>

        {/* Members Status Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#132218] border border-[#23422d] text-xs font-semibold text-emerald-400 mb-6">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <Users className="w-3.5 h-3.5 text-emerald-400 inline" />
          <span>{telegramPopup.membersText || "88,874 Members"}</span>
        </div>

        {/* Join Telegram Button */}
        <button
          onClick={handleJoinClick}
          className="w-full py-3.5 px-6 rounded-xl font-bold text-sm tracking-wider uppercase text-white bg-gradient-to-r from-[#29b6f6] to-[#0288d1] hover:from-[#38bdf8] hover:to-[#039be5] shadow-[0_4px_20px_rgba(14,165,233,0.45)] hover:shadow-[0_6px_25px_rgba(14,165,233,0.7)] flex items-center justify-center gap-2.5 transition-all duration-200 active:scale-95 animate-telegram-btn cursor-pointer"
        >
          <span>{telegramPopup.btnText || "JOIN TELEGRAM"}</span>
          <Send className="w-4 h-4 fill-current transform rotate-12" />
        </button>

        {/* Footer quiet close text */}
        <button
          onClick={onClose}
          className="mt-3 text-xs text-gray-500 hover:text-gray-300 transition-colors"
        >
          Maybe later
        </button>
      </div>
    </div>
  );
};
