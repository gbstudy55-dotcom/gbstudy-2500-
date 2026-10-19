import React, { useState } from 'react';
import { X, KeyRound, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { SiteSettings } from '../types';

interface AccessKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: SiteSettings;
  onKeyValidated: (key: string) => void;
  currentKey: string;
}

export const AccessKeyModal: React.FC<AccessKeyModalProps> = ({
  isOpen,
  onClose,
  settings,
  onKeyValidated,
  currentKey,
}) => {
  const [inputKey, setInputKey] = useState(currentKey || '');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const validKeys = settings.accessKeySettings.validKeys || [];

  const handleValidate = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmed = inputKey.trim().toUpperCase();
    if (!trimmed) {
      setError('Please enter a valid key');
      return;
    }

    // Check if key is in valid keys list or matches admin override
    if (validKeys.map((k) => k.toUpperCase()).includes(trimmed) || trimmed === 'GBSTUDY' || trimmed === 'FREE') {
      setSuccess(true);
      setTimeout(() => {
        onKeyValidated(trimmed);
        onClose();
      }, 700);
    } else {
      setError('Invalid Access Key. Please get the latest key from our Telegram.');
    }
  };

  const handleGetTelegramKey = () => {
    window.open(settings.accessKeySettings.getKeyUrl || settings.telegramChannelUrl, '_blank');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm rounded-[24px] bg-[#0c140f] border border-[#1b3122] p-6 shadow-2xl text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:text-white bg-white/5 hover:bg-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center mb-4">
          <KeyRound className="w-7 h-7" />
        </div>

        <h3 className="text-xl font-bold text-white mb-1.5">Access Key Required</h3>
        <p className="text-xs text-gray-400 mb-5 leading-relaxed">
          Access keys are provided 100% free inside our official Telegram channel to keep servers active.
        </p>

        {error && (
          <div className="flex items-center gap-2 p-2.5 mb-4 rounded-xl bg-red-950/60 border border-red-800/80 text-red-300 text-xs text-left">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 p-2.5 mb-4 rounded-xl bg-emerald-950/60 border border-emerald-800/80 text-emerald-300 text-xs text-left">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>Access Key Verified! Unlocking...</span>
          </div>
        )}

        <form onSubmit={handleValidate} className="space-y-3">
          <div>
            <input
              type="text"
              value={inputKey}
              onChange={(e) => {
                setInputKey(e.target.value);
                setError('');
              }}
              placeholder="Enter Access Key (e.g. GBFREE)"
              className="w-full px-4 py-2.5 rounded-xl bg-[#121c16] border border-[#233a2a] focus:border-emerald-500 text-sm text-center font-mono tracking-widest text-emerald-300 placeholder-gray-500 outline-none uppercase"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-emerald-500 hover:bg-emerald-400 text-black shadow-[0_0_15px_rgba(34,197,94,0.3)] transition-all cursor-pointer"
          >
            Unlock Access
          </button>
        </form>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#182a1e]"></div>
          </div>
          <div className="relative flex justify-center text-[10px] uppercase">
            <span className="bg-[#0c140f] px-2 text-gray-500 font-semibold">Or</span>
          </div>
        </div>

        <button
          onClick={handleGetTelegramKey}
          className="w-full py-2.5 rounded-xl text-xs font-semibold text-sky-400 hover:text-white bg-[#0e1f2b] hover:bg-[#103045] border border-sky-500/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <Send className="w-3.5 h-3.5 fill-current" />
          <span>Get Free Key on Telegram</span>
        </button>
      </div>
    </div>
  );
};
