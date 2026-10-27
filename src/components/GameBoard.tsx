import React, { useState, useMemo } from 'react';
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
  Info,
  UserPlus
} from 'lucide-react';
import { DeviceCard } from './DeviceCard';
import { InspectionModal } from './InspectionModal';
import { TechnicianRepairView } from './TechnicianRepairView';
import { FullScreenPrizeReveal } from './FullScreenPrizeReveal';
import { PlayerNameStart } from './PlayerNameStart';
import { 
  GamePayload, 
  AssignedDevice, 
  assignPrizes 
} from '../utils/codec';
import { 
  playRelayClick, 
  toggleMute, 
  getIsMuted 
} from '../utils/sound';

interface GameBoardProps {
  payload: GamePayload;
  rawSeedKey: string;
  onBackToAdmin: () => void;
}

export type ViewMode = 'PLAYER_START' | 'TECHNICIAN_REPAIR' | 'FULLSCREEN_PRIZE' | 'WORKBENCH_OVERVIEW';

export const GameBoard: React.FC<GameBoardProps> = ({
  payload,
  rawSeedKey,
  onBackToAdmin,
}) => {
  // Start game with the player name input as requested:
  // "Game will start with the player name. After the payer input his name, the game will start immediately and follow the above steps."
  const [viewMode, setViewMode] = useState<ViewMode>('PLAYER_START');
  const [activeDevice, setActiveDevice] = useState<AssignedDevice | null>(null);
  
  // Track which devices have been repaired during the session
  const [repairedDeviceIds, setRepairedDeviceIds] = useState<Set<string>>(new Set());

  const [selectedInspectDevice, setSelectedInspectDevice] = useState<AssignedDevice | null>(null);
  const [muted, setMuted] = useState(getIsMuted());
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  // Deterministically compute device assignments using seeded PRNG
  const assignedDevices: AssignedDevice[] = useMemo(() => {
    return assignPrizes(payload.members, payload.prizes, rawSeedKey);
  }, [payload.members, payload.prizes, rawSeedKey]);

  // Handle when player inputs or selects their name on the start screen
  const handlePlayerStart = (playerName: string) => {
    // Find matching device in assigned devices or assign closest match
    let target = assignedDevices.find(
      (d) => d.member.toLowerCase().trim() === playerName.toLowerCase().trim()
    );

    // If not found in default list, pick an unrepaired device or the first one
    if (!target) {
      target = assignedDevices.find((d) => !repairedDeviceIds.has(d.id)) || assignedDevices[0];
    }

    setActiveDevice(target);
    // Start immediately into technician repair animation!
    setViewMode('TECHNICIAN_REPAIR');
  };

  // Called when 30-second technician repair finishes
  const handleRepairComplete = () => {
    if (activeDevice) {
      setRepairedDeviceIds((prev) => new Set(prev).add(activeDevice.id));
    }
    // Transition to full-screen prize reveal!
    setViewMode('FULLSCREEN_PRIZE');
  };

  // Start individual repair directly from workbench grid
  const handleStartIndividualRepair = (device: AssignedDevice) => {
    setActiveDevice(device);
    setViewMode('TECHNICIAN_REPAIR');
  };

  // View full screen prize for an already repaired device
  const handleViewFullScreen = (device: AssignedDevice) => {
    setActiveDevice(device);
    setViewMode('FULLSCREEN_PRIZE');
  };

  // Sound toggle
  const handleToggleSound = () => {
    const isNowMuted = toggleMute();
    setMuted(isNowMuted);
  };

  // Format share text
  const generateShareText = (): string => {
    const lines = assignedDevices.map((d) => {
      const isDone = repairedDeviceIds.has(d.id);
      return `• ${d.member}: ${isDone ? d.prize : '🔒 [Pending Screen Repair]'}`;
    });
    return `🎉 Family Treat of CellShoppe Results! 🎉\n${lines.join('\n')}\nCongratulations everyone!`;
  };

  // Share results to family group chat
  const handleShareResults = async () => {
    playRelayClick();
    const text = generateShareText();

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Family Treat of CellShoppe Results',
          text,
        });
        return;
      } catch (err: unknown) {
        if ((err as Error)?.name !== 'AbortError') {
          console.warn('Share error', err);
        } else {
          return;
        }
      }
    }

    // Fallback: Copy to clipboard & alert
    try {
      await navigator.clipboard.writeText(text);
      setCopyFeedback('Results copied to clipboard!');
      alert('Results copied to clipboard!');
      setTimeout(() => setCopyFeedback(null), 3500);
    } catch {
      alert(text);
    }
  };

  const handleCopyOnly = async () => {
    playRelayClick();
    const text = generateShareText();
    try {
      await navigator.clipboard.writeText(text);
      setCopyFeedback('Results copied to clipboard!');
      setTimeout(() => setCopyFeedback(null), 3000);
    } catch {
      alert(text);
    }
  };

  // ==========================================
  // RENDER CONDITIONAL SCREENS
  // ==========================================

  // 1. Initial Player Name Screen
  if (viewMode === 'PLAYER_START') {
    return (
      <PlayerNameStart
        members={payload.members}
        onStartPlayer={handlePlayerStart}
        onViewWorkbench={() => setViewMode('WORKBENCH_OVERVIEW')}
      />
    );
  }

  // 2. 30-Second Technician Screen Repair Animation
  if (viewMode === 'TECHNICIAN_REPAIR' && activeDevice) {
    return (
      <TechnicianRepairView
        device={activeDevice}
        onRepairComplete={handleRepairComplete}
        onCancel={() => setViewMode('WORKBENCH_OVERVIEW')}
      />
    );
  }

  // 3. Full-Screen Prize Reveal
  if (viewMode === 'FULLSCREEN_PRIZE' && activeDevice) {
    return (
      <FullScreenPrizeReveal
        device={activeDevice}
        allDevices={assignedDevices}
        onNextPlayer={() => {
          setActiveDevice(null);
          setViewMode('PLAYER_START');
        }}
        onViewWorkbench={() => setViewMode('WORKBENCH_OVERVIEW')}
      />
    );
  }

  // 4. Workbench Overview (All devices, with individual repair buttons)
  return (
    <div className="min-h-screen workbench-grid pb-20">
      {/* Workbench Top Bar */}
      <header className="sticky top-0 z-40 bg-[#090d16]/90 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 py-3.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-cyan-950/80 border border-cyan-700/60 flex items-center justify-center text-cyan-400">
              <Wrench className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-tech font-bold text-base sm:text-lg text-white tracking-wide">
                  CellShoppe Workbench
                </h1>
                <span className="text-[10px] font-mono-code px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700 hidden sm:inline-block">
                  INDIVIDUAL REPAIR MODE
                </span>
              </div>
              <div className="text-[11px] font-mono-code text-cyan-400/80 flex items-center gap-2">
                <span>{assignedDevices.length} Family Devices</span>
                <span>·</span>
                <span>{repairedDeviceIds.size} of {assignedDevices.length} Repaired</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Enter New Player */}
            <button
              onClick={() => setViewMode('PLAYER_START')}
              className="px-3 py-1.5 rounded-xl bg-cyan-950/70 hover:bg-cyan-900/80 border border-cyan-700/70 text-cyan-300 font-tech text-xs flex items-center gap-1.5 transition-colors"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Switch Player</span>
            </button>

            {/* Audio Toggle */}
            <button
              onClick={handleToggleSound}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-colors"
              title={muted ? 'Unmute' : 'Mute'}
            >
              {muted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
            </button>

            {/* Workbench Setup */}
            <button
              onClick={onBackToAdmin}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white font-tech text-xs flex items-center gap-1.5 transition-colors"
              title="Admin Setup"
            >
              <Sliders className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Setup</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 pt-6 sm:pt-8">
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-950/60 border border-cyan-800/60 rounded-full text-xs font-mono-code text-cyan-300 mb-2.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Family Treat of CellShoppe</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-tech text-white tracking-tight mb-2">
            Mystery Device Workbench
          </h2>

          <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
            Each family member can click <strong>"Repair Screen"</strong> on their device to launch the 30-second technician repair animation and reveal their prize in full screen!
          </p>
        </div>

        {/* Global Action Bar */}
        <div className="bg-[#0f1728]/80 border border-slate-800/90 rounded-2xl p-4 sm:p-5 mb-8 shadow-xl relative overflow-hidden backdrop-blur-sm">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-left w-full sm:w-auto">
              <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-800/70 text-cyan-400 flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-mono-code uppercase text-slate-400 tracking-wider">
                  Workbench Status
                </div>
                <div className="text-sm sm:text-base font-tech font-bold text-white">
                  {repairedDeviceIds.size === assignedDevices.length
                    ? '🎉 All Family Devices Successfully Repaired!'
                    : `${repairedDeviceIds.size} of ${assignedDevices.length} devices repaired`}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-end">
              <button
                onClick={handleShareResults}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-tech font-bold text-sm tracking-wide shadow-[0_0_20px_rgba(16,185,129,0.3)] flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                Share Results to Family
              </button>

              <button
                onClick={handleCopyOnly}
                className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-mono-code text-xs flex items-center justify-center gap-1.5 transition-colors"
                title="Copy formatted text"
              >
                {copyFeedback ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copyFeedback || 'Copy Results'}</span>
              </button>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-[11px] font-mono-code text-slate-400 gap-2">
            <span className="flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-cyan-400" />
              Click any device's screen or button to launch the 30s technician repair animation.
            </span>
            {copyFeedback && (
              <span className="text-emerald-400 font-semibold animate-pulse">
                ✓ {copyFeedback}
              </span>
            )}
          </div>
        </div>

        {/* Grid of Mystery Devices */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5 sm:gap-6">
          {assignedDevices.map((device, index) => {
            const isDeviceRepaired = repairedDeviceIds.has(device.id);
            return (
              <DeviceCard
                key={device.id}
                device={device}
                index={index}
                isRevealing={false}
                isRevealed={isDeviceRepaired}
                onInspect={(dev) => setSelectedInspectDevice(dev)}
                onStartIndividualRepair={handleStartIndividualRepair}
                onViewFullScreen={handleViewFullScreen}
              />
            );
          })}
        </div>
      </main>

      {/* Inspection Modal for Device Voucher */}
      <InspectionModal
        device={selectedInspectDevice}
        onClose={() => setSelectedInspectDevice(null)}
      />
    </div>
  );
};
