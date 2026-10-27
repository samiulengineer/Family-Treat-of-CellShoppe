import React, { useState, useEffect, useMemo, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  Wrench, 
  Share2, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Copy, 
  RotateCcw, 
  Check, 
  Sliders, 
  Zap,
  Info
} from 'lucide-react';
import { DeviceCard } from './DeviceCard';
import { InspectionModal } from './InspectionModal';
import { 
  GamePayload, 
  AssignedDevice, 
  assignPrizes 
} from '../utils/codec';
import { 
  playRelayClick, 
  playPowerOnSurge, 
  playRepairTriumph, 
  toggleMute, 
  getIsMuted 
} from '../utils/sound';

interface GameBoardProps {
  payload: GamePayload;
  rawSeedKey: string;
  onBackToAdmin: () => void;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  payload,
  rawSeedKey,
  onBackToAdmin,
}) => {
  const [isRevealing, setIsRevealing] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [showShareButton, setShowShareButton] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<AssignedDevice | null>(null);
  const [muted, setMuted] = useState(getIsMuted());
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  // Deterministically compute device assignments using the seeded PRNG
  // The seed is derived from the URL gameData string
  const assignedDevices: AssignedDevice[] = useMemo(() => {
    return assignPrizes(payload.members, payload.prizes, rawSeedKey);
  }, [payload.members, payload.prizes, rawSeedKey]);

  // Audio mute toggle
  const handleToggleSound = () => {
    const isNowMuted = toggleMute();
    setMuted(isNowMuted);
  };

  // Launch the Reveal Sequence
  const handleRevealPrizes = () => {
    if (isRevealing || isRevealed) return;

    playPowerOnSurge();
    setIsRevealing(true);

    // Stagger animation timing calculation
    const totalDuration = Math.max(1800, assignedDevices.length * 280 + 1000);

    // Trigger triumphant sound & completion
    setTimeout(() => {
      setIsRevealing(false);
      setIsRevealed(true);
      playRepairTriumph();

      // Confetti burst
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#06b6d4', '#10b981', '#38bdf8', '#fbbf24', '#f43f5e']
        });
        setTimeout(() => {
          confetti({
            particleCount: 50,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#06b6d4', '#10b981', '#ffffff']
          });
          confetti({
            particleCount: 50,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#06b6d4', '#10b981', '#ffffff']
          });
        }, 300);
      } catch (err) {
        console.warn('Confetti error', err);
      }

      // Fade in Share Results button
      setTimeout(() => {
        setShowShareButton(true);
      }, 500);
    }, totalDuration);
  };

  // Build the exact required format for group chat sharing
  const generateShareText = (): string => {
    const lines = assignedDevices.map(d => `• ${d.member}: ${d.prize}`);
    return `🎉 Family Treat of CellShoppe Results! 🎉\n${lines.join('\n')}\nCongratulations everyone!`;
  };

  // Phase 4: Share Results to Family (native navigator.share() with fallback)
  const handleShareResults = async () => {
    playRelayClick();
    const shareText = generateShareText();

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Family Treat of CellShoppe Results',
          text: shareText,
        });
        return;
      } catch (err: unknown) {
        // User cancellation or failure, fallback to clipboard
        if ((err as Error)?.name !== 'AbortError') {
          console.warn('Native share failed, falling back to clipboard', err);
        } else {
          return; // User canceled native share sheet
        }
      }
    }

    // Fallback: Copy to clipboard and show alert
    try {
      await navigator.clipboard.writeText(shareText);
      setCopyFeedback('Results copied to clipboard!');
      alert('Results copied to clipboard!');
      setTimeout(() => setCopyFeedback(null), 4000);
    } catch {
      alert('Results:\n\n' + shareText);
    }
  };

  // Copy plain text results
  const handleCopyResultsOnly = async () => {
    playRelayClick();
    const text = generateShareText();
    try {
      await navigator.clipboard.writeText(text);
      setCopyFeedback('Results copied to clipboard!');
      setTimeout(() => setCopyFeedback(null), 3000);
    } catch {
      alert('Results:\n\n' + text);
    }
  };

  // Reset to unrevealed state for testing/replay
  const handleReplay = () => {
    playRelayClick();
    setIsRevealing(false);
    setIsRevealed(false);
    setShowShareButton(false);
  };

  return (
    <div className="min-h-screen workbench-grid pb-20">
      {/* Workbench Top Bar */}
      <header className="sticky top-0 z-40 bg-[#090d16]/90 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 py-3.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          {/* Brand & Diagnostics status */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-cyan-950/80 border border-cyan-700/60 flex items-center justify-center text-cyan-400">
              <Wrench className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-tech font-bold text-base sm:text-lg text-white tracking-wide">
                  CellShoppe Workbench
                </h1>
                <span className="text-[10px] font-mono-code px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/60 hidden sm:inline-block">
                  SEEDED DETERMINISTIC
                </span>
              </div>
              <div className="text-[11px] font-mono-code text-cyan-400/80 flex items-center gap-2">
                <span>{assignedDevices.length} Mystery Devices Loaded</span>
                <span>·</span>
                <span>{isRevealed ? 'All Repaired & Assigned' : 'Awaiting Power-On'}</span>
              </div>
            </div>
          </div>

          {/* Quick HUD controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleSound}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-colors"
              title={muted ? 'Unmute Audio' : 'Mute Audio'}
            >
              {muted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
            </button>

            <button
              onClick={onBackToAdmin}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white font-tech text-xs flex items-center gap-1.5 transition-colors"
              title="Return to Admin Setup"
            >
              <Sliders className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Workbench Setup</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 pt-6 sm:pt-8">
        {/* Title Lockup */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-950/60 border border-cyan-800/60 rounded-full text-xs font-mono-code text-cyan-300 mb-2.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Family Treat of CellShoppe</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-tech text-white tracking-tight mb-2">
            Mystery Device Lottery Board
          </h2>

          <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
            {isRevealed 
              ? '✨ All devices have been repaired and powered on! Check out each family member’s secret treat.'
              : 'Each device holds a secret family treat behind its blank screen. Hit Reveal to power on and repair the devices!'}
          </p>
        </div>

        {/* PHASE 3 & 4 ACTION DOCK */}
        <div className="bg-[#0f1728]/80 border border-slate-800/90 rounded-2xl p-4 sm:p-5 mb-8 shadow-xl relative overflow-hidden backdrop-blur-sm">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Status Info */}
            <div className="flex items-center gap-3 text-left w-full sm:w-auto">
              <div 
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-all ${
                  isRevealed
                    ? 'bg-emerald-950/80 border-emerald-600/70 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                    : isRevealing
                    ? 'bg-amber-950/80 border-amber-600/70 text-amber-400 animate-spin'
                    : 'bg-cyan-950/80 border-cyan-800/70 text-cyan-400'
                }`}
              >
                <Zap className="w-5 h-5" />
              </div>

              <div>
                <div className="text-xs font-mono-code uppercase text-slate-400 tracking-wider">
                  Diagnostic State
                </div>
                <div className="text-sm sm:text-base font-tech font-bold text-white">
                  {isRevealed 
                    ? 'All Hardware Repaired · Prizes Assigned' 
                    : isRevealing 
                    ? 'Power Surge In Progress... Booting Screens' 
                    : 'Offline Diagnostic Standby · Ready for Reveal'}
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-end">
              {/* PHASE 3: Prominent Reveal Prizes Button */}
              {!isRevealed && (
                <button
                  onClick={handleRevealPrizes}
                  disabled={isRevealing}
                  className={`w-full sm:w-auto px-6 py-3.5 rounded-xl font-tech font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-2 transition-all shadow-lg select-none ${
                    isRevealing
                      ? 'bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700'
                      : 'bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 hover:from-cyan-400 hover:via-teal-400 hover:to-emerald-400 text-slate-950 shadow-[0_0_25px_rgba(6,182,212,0.5)] active:scale-95 cursor-pointer'
                  }`}
                >
                  <Zap className={`w-4 h-4 ${isRevealing ? 'animate-bounce' : ''}`} />
                  {isRevealing ? 'Powering On & Repairing...' : 'Reveal Prizes'}
                </button>
              )}

              {/* PHASE 4: Share Results to Family (fades in after reveal animation) */}
              {isRevealed && (
                <>
                  <button
                    onClick={handleShareResults}
                    className="w-full sm:w-auto px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-tech font-bold text-sm tracking-wide shadow-[0_0_20px_rgba(16,185,129,0.4)] flex items-center justify-center gap-2 transition-all active:scale-95 animate-fade-in"
                  >
                    <Share2 className="w-4 h-4" />
                    Share Results to Family
                  </button>

                  <button
                    onClick={handleCopyResultsOnly}
                    className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-mono-code text-xs flex items-center justify-center gap-1.5 transition-colors"
                    title="Copy formatted text to clipboard"
                  >
                    {copyFeedback ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copyFeedback || 'Copy Text'}</span>
                  </button>

                  <button
                    onClick={handleReplay}
                    className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-400 hover:text-white transition-colors"
                    title="Reset Screen Display to Test Again"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Seed indicator info bar */}
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-[11px] font-mono-code text-slate-400 gap-2">
            <span className="flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-cyan-400" />
              Seeded PRNG ensures every family member sees the identical prize mapping on any phone.
            </span>
            {copyFeedback && (
              <span className="text-emerald-400 font-semibold animate-pulse">
                ✓ {copyFeedback}
              </span>
            )}
          </div>
        </div>

        {/* PHASE 2: GRID OF MYSTERY DEVICES */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5 sm:gap-6">
          {assignedDevices.map((device, index) => (
            <DeviceCard
              key={device.id}
              device={device}
              index={index}
              isRevealing={isRevealing}
              isRevealed={isRevealed}
              onInspect={(dev) => setSelectedDevice(dev)}
            />
          ))}
        </div>

        {/* PHASE 4: Bottom Floating Share Bar when revealed */}
        {showShareButton && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 w-full max-w-md px-4 animate-fade-in">
            <div className="bg-[#0f172a]/95 border border-cyan-500/60 rounded-2xl p-3 shadow-2xl backdrop-blur-md flex items-center justify-between gap-3">
              <div className="truncate pl-1">
                <div className="text-[11px] uppercase font-mono-code text-cyan-400 tracking-wider">
                  Treat Allocation Sealed
                </div>
                <div className="text-xs font-semibold text-white truncate">
                  Ready to post in family chat
                </div>
              </div>

              <button
                onClick={handleShareResults}
                className="px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-emerald-400 hover:from-cyan-400 hover:to-emerald-300 text-slate-950 font-tech font-bold text-xs uppercase tracking-wider rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.4)] flex items-center gap-1.5 transition-all shrink-0 active:scale-95"
              >
                <Share2 className="w-3.5 h-3.5" />
                Share Results
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Inspection Modal for Individual Device Voucher */}
      <InspectionModal
        device={selectedDevice}
        onClose={() => setSelectedDevice(null)}
      />
    </div>
  );
};
