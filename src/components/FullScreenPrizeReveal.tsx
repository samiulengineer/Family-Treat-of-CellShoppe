import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  Share2, 
  Copy, 
  Check, 
  Award, 
  RotateCcw, 
  Smartphone, 
  Users, 
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { AssignedDevice, GamePayload } from '../utils/codec';
import { playRepairTriumph, playRelayClick } from '../utils/sound';

interface FullScreenPrizeRevealProps {
  device: AssignedDevice;
  allDevices: AssignedDevice[];
  onNextPlayer: () => void;
  onViewWorkbench: () => void;
}

export const FullScreenPrizeReveal: React.FC<FullScreenPrizeRevealProps> = ({
  device,
  allDevices,
  onNextPlayer,
  onViewWorkbench,
}) => {
  const [copied, setCopied] = useState(false);
  const [shareFeedback, setShareFeedback] = useState<string | null>(null);

  useEffect(() => {
    // Play triumphant victory sound
    playRepairTriumph();

    // Fire festive celebration confetti burst
    try {
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#00f3ff', '#10b981', '#38bdf8', '#fbbf24', '#f43f5e']
      });

      const timer1 = setTimeout(() => {
        confetti({
          particleCount: 60,
          angle: 60,
          spread: 60,
          origin: { x: 0, y: 0.6 },
          colors: ['#00f3ff', '#10b981', '#ffffff']
        });
        confetti({
          particleCount: 60,
          angle: 120,
          spread: 60,
          origin: { x: 1, y: 0.6 },
          colors: ['#00f3ff', '#10b981', '#ffffff']
        });
      }, 350);

      const timer2 = setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 100,
          origin: { y: 0.4 },
        });
      }, 700);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    } catch (err) {
      console.warn('Confetti error', err);
    }
  }, []);

  // Format group chat text
  const generateShareMessage = () => {
    return `🎉 Family Treat of CellShoppe Results! 🎉\n• ${device.member}: ${device.prize}\n\nCongratulations ${device.member}!`;
  };

  const generateFullRosterMessage = () => {
    const list = allDevices.map(d => `• ${d.member}: ${d.prize}`);
    return `🎉 Family Treat of CellShoppe Results! 🎉\n${list.join('\n')}\nCongratulations everyone!`;
  };

  // Share via navigator.share() with fallback
  const handleShare = async () => {
    playRelayClick();
    const text = generateFullRosterMessage();

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Family Treat of CellShoppe Results',
          text,
        });
        return;
      } catch (err: unknown) {
        if ((err as Error)?.name !== 'AbortError') {
          console.warn('Native share failed, falling back to clipboard', err);
        } else {
          return;
        }
      }
    }

    // Fallback: Copy to clipboard and show alert
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setShareFeedback('Results copied to clipboard!');
      alert('Results copied to clipboard!');
      setTimeout(() => setCopied(false), 3500);
    } catch {
      alert('Results:\n\n' + text);
    }
  };

  const handleCopyOnly = async () => {
    playRelayClick();
    const text = generateShareMessage();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setShareFeedback('Prize copied to clipboard!');
      setTimeout(() => {
        setCopied(false);
        setShareFeedback(null);
      }, 3000);
    } catch {
      alert(text);
    }
  };

  return (
    <div className="fixed inset-0 z-50 min-h-screen bg-[#070b14] overflow-y-auto flex flex-col justify-between p-4 sm:p-6 workbench-grid text-white">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/15 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Banner */}
      <div className="max-w-3xl w-full mx-auto flex items-center justify-between pb-3 border-b border-slate-800/80 relative z-10">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-cyan-400" />
          <span className="text-xs uppercase font-mono-code tracking-widest text-cyan-300">
            CellShoppe Official Prize Certificate
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-mono-code text-emerald-400">
          <ShieldCheck className="w-4 h-4" />
          <span>HARDWARE REPAIRED & VERIFIED</span>
        </div>
      </div>

      {/* Main Full Screen Prize Showcase */}
      <div className="max-w-2xl w-full mx-auto my-auto py-6 relative z-10 flex flex-col items-center text-center">
        {/* Congratulatory badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/60 text-emerald-300 text-xs font-mono-code mb-4 shadow-[0_0_20px_rgba(16,185,129,0.3)] animate-bounce">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>Screen Replaced & Restored · Prize Unlocked!</span>
        </div>

        {/* Player Name Title */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold font-tech tracking-tight text-white mb-2">
          {device.member}
        </h1>
        <p className="text-sm font-mono-code text-cyan-400 mb-6 flex items-center gap-2 justify-center">
          <Smartphone className="w-4 h-4" />
          <span>{device.modelName}</span>
          <span>·</span>
          <span>{device.serialNumber}</span>
        </p>

        {/* FULL SCREEN REPAIRED DEVICE SCREEN PRESENTATION */}
        <div className="w-full max-w-lg bg-gradient-to-b from-[#0a1829] via-[#052b36] to-[#041d24] border-2 border-cyan-400 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(6,182,212,0.45)] relative overflow-hidden mb-8 scanlines">
          {/* AMOLED Glass sheen */}
          <div className="absolute -top-12 -left-12 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10">
            <div className="text-xs uppercase font-mono-code text-emerald-300 tracking-widest mb-3 flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              OFFICIAL WINNING TREAT
            </div>

            {/* Giant Prize Text */}
            <div className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-tech text-white leading-tight drop-shadow-[0_0_25px_rgba(34,211,238,0.9)] py-2">
              {device.prize}
            </div>

            <div className="mt-4 pt-3 border-t border-cyan-800/60 text-[11px] font-mono-code text-cyan-200/80">
              Valid for redemption during Family Treat · CellShoppe Lab
            </div>
          </div>
        </div>

        {/* ACTION BUTTONS (Share, Copy, Next Player) */}
        <div className="flex flex-wrap items-center justify-center gap-3 w-full max-w-md">
          {/* Phase 4 Native Share to Group Chat */}
          <button
            onClick={handleShare}
            className="flex-1 min-w-[180px] px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-tech font-bold text-sm tracking-wide rounded-2xl shadow-[0_0_25px_rgba(16,185,129,0.4)] flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            Share Results to Family
          </button>

          {/* Copy prize text */}
          <button
            onClick={handleCopyOnly}
            className="px-4 py-3.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-2xl text-xs font-mono-code text-slate-200 flex items-center gap-1.5 transition-colors"
            title="Copy prize to clipboard"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied!' : 'Copy Prize'}</span>
          </button>
        </div>

        {shareFeedback && (
          <div className="mt-2 text-xs font-mono-code text-emerald-400 animate-pulse">
            ✓ {shareFeedback}
          </div>
        )}

        {/* Secondary options */}
        <div className="flex items-center gap-4 mt-6">
          <button
            onClick={onNextPlayer}
            className="text-xs font-mono-code text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 underline"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Next Player's Turn
          </button>

          <span className="text-slate-600">·</span>

          <button
            onClick={onViewWorkbench}
            className="text-xs font-mono-code text-slate-400 hover:text-white flex items-center gap-1.5"
          >
            <Users className="w-3.5 h-3.5" />
            View All Devices
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-3xl w-full mx-auto text-center pt-3 border-t border-slate-900 text-xs font-mono-code text-slate-500 relative z-10">
        CellShoppe Diagnostics · Seeded Deterministic Prize Verification Complete
      </div>
    </div>
  );
};
