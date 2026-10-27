import React, { useState, useEffect, useRef } from 'react';
import { TechnicianSvg } from './TechnicianSvg';
import { AssignedDevice } from '../utils/codec';
import { 
  playRelayClick, 
  playBeep, 
  playSolderSpark, 
  playLaserPulse, 
  playPowerOnSurge,
  toggleMute,
  getIsMuted
} from '../utils/sound';
import { 
  Wrench, 
  Flame, 
  Layers, 
  Cpu, 
  Zap, 
  CheckCircle2, 
  Volume2, 
  VolumeX, 
  FastForward,
  Timer
} from 'lucide-react';

interface TechnicianRepairViewProps {
  device: AssignedDevice;
  onRepairComplete: () => void;
  onCancel: () => void;
}

const TOTAL_REPAIR_SECONDS = 30; // Strictly at least 30 seconds as specified

const REPAIR_STAGES = [
  {
    title: 'Precision Thermal De-bonding',
    desc: 'Softening perimeter adhesive using regulated 85°C heat gun...',
    icon: Flame,
    color: 'text-amber-400',
    borderColor: 'border-amber-500/50',
    bgColor: 'bg-amber-950/40'
  },
  {
    title: 'Damaged Digitizer Extraction',
    desc: 'Lifting cracked glass layer with micro-suction clamp fixture...',
    icon: Layers,
    color: 'text-sky-400',
    borderColor: 'border-sky-500/50',
    bgColor: 'bg-sky-950/40'
  },
  {
    title: 'Micro-Soldering Flex Connectors',
    desc: 'Soldering 40-pin gold display bus ribbons with rosin-core wire...',
    icon: Cpu,
    color: 'text-cyan-400',
    borderColor: 'border-cyan-500/50',
    bgColor: 'bg-cyan-950/40'
  },
  {
    title: 'UV Optical Bonding & Curing',
    desc: 'Laminating fresh Gorilla Glass with high-intensity UV laser beam...',
    icon: Zap,
    color: 'text-purple-400',
    borderColor: 'border-purple-500/50',
    bgColor: 'bg-purple-950/40'
  },
  {
    title: 'Display Boot & Prize Calibration',
    desc: 'Flashing kernel firmware, verifying 120Hz refresh & decrypting prize...',
    icon: CheckCircle2,
    color: 'text-emerald-400',
    borderColor: 'border-emerald-500/50',
    bgColor: 'bg-emerald-950/40'
  }
];

export const TechnicianRepairView: React.FC<TechnicianRepairViewProps> = ({
  device,
  onRepairComplete,
  onCancel,
}) => {
  const [secondsRemaining, setSecondsRemaining] = useState(TOTAL_REPAIR_SECONDS);
  const [muted, setMuted] = useState(getIsMuted());
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Calculate elapsed progress and current active phase
  const elapsed = TOTAL_REPAIR_SECONDS - secondsRemaining;
  const progressPct = Math.min(100, Math.round((elapsed / TOTAL_REPAIR_SECONDS) * 100));
  // 5 phases: 0-5s, 6-11s, 12-17s, 18-23s, 24-30s
  const currentPhaseIndex = Math.min(
    REPAIR_STAGES.length - 1, 
    Math.floor((elapsed / TOTAL_REPAIR_SECONDS) * REPAIR_STAGES.length)
  );

  // Audio & Countdown Timer Loop
  useEffect(() => {
    // Initial start sound
    playPowerOnSurge();

    timerRef.current = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        const nextVal = prev - 1;

        // Play procedural audio based on stage
        const currentElapsed = TOTAL_REPAIR_SECONDS - nextVal;
        if (currentElapsed % 6 === 0) {
          playRelayClick();
        } else if (currentElapsed >= 12 && currentElapsed <= 18 && currentElapsed % 2 === 0) {
          playSolderSpark();
        } else if (currentElapsed >= 18 && currentElapsed <= 24 && currentElapsed % 3 === 0) {
          playLaserPulse();
        } else if (nextVal <= 3) {
          playBeep(); // Final countdown beeps
        }

        return nextVal;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // When timer reaches 0, trigger completion after a short 600ms transition
  useEffect(() => {
    if (secondsRemaining === 0) {
      const timeout = setTimeout(() => {
        onRepairComplete();
      }, 700);
      return () => clearTimeout(timeout);
    }
  }, [secondsRemaining, onRepairComplete]);

  // Fast forward skip button for convenience
  const handleSkip = () => {
    playRelayClick();
    if (timerRef.current) clearInterval(timerRef.current);
    setSecondsRemaining(0);
  };

  const handleToggleSound = () => {
    const isNowMuted = toggleMute();
    setMuted(isNowMuted);
  };

  const currentStage = REPAIR_STAGES[currentPhaseIndex];
  const StageIcon = currentStage.icon;

  return (
    <div className="min-h-screen bg-[#080d1a] workbench-grid flex flex-col justify-between p-4 sm:p-6 text-white select-none relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] bg-cyan-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Top Header Bar */}
      <div className="max-w-4xl w-full mx-auto flex items-center justify-between pb-3 border-b border-slate-800 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-cyan-950/80 border border-cyan-700/60 flex items-center justify-center text-cyan-400">
            <Wrench className="w-4 h-4 animate-spin" />
          </div>
          <div>
            <div className="text-xs uppercase font-mono-code text-cyan-400 tracking-wider">
              CellShoppe Lab · Bench #04
            </div>
            <div className="text-sm sm:text-base font-bold font-tech text-white">
              Screen Replacement In Progress for <span className="text-cyan-300 font-extrabold">{device.member}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Mute toggle */}
          <button
            onClick={handleToggleSound}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-colors"
            title={muted ? 'Unmute' : 'Mute'}
          >
            {muted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
          </button>

          {/* Skip button for convenience */}
          <button
            onClick={handleSkip}
            className="px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-cyan-600 text-slate-300 hover:text-cyan-300 text-xs font-mono-code flex items-center gap-1.5 transition-colors"
            title="Fast-forward repair to reveal prize immediately"
          >
            <FastForward className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Skip to Reveal</span>
          </button>
        </div>
      </div>

      {/* Main Repair Workbench Centerpiece */}
      <div className="max-w-4xl w-full mx-auto my-auto py-4 relative z-10 flex flex-col items-center">
        {/* Device & Hardware Tag */}
        <div className="text-center mb-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-xs font-mono-code text-slate-300 mb-1">
            <span>DEVICE: <strong className="text-cyan-300">{device.modelName}</strong></span>
            <span>·</span>
            <span>SN: <strong className="text-slate-400">{device.serialNumber}</strong></span>
          </div>
        </div>

        {/* TECHNICIAN VECTOR ARTWORK (NO EYES, AT WORKBENCH WITH TOOLS) */}
        <div className="w-full max-w-xl mx-auto mb-4">
          <TechnicianSvg 
            phase={currentPhaseIndex} 
            progress={progressPct} 
            secondsLeft={secondsRemaining} 
          />
        </div>

        {/* 30-SECOND TIMER & REAL-TIME PROGRESS BAR */}
        <div className="w-full max-w-xl bg-slate-950/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-2xl backdrop-blur-md">
          {/* Timer readout */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-cyan-400">
              <Timer className="w-5 h-5 animate-pulse" />
              <span className="text-xs uppercase font-mono-code tracking-widest text-slate-400">
                Repair Calibration Timer
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-tech font-bold text-white tracking-wider tabular-nums flex items-center gap-1.5">
              <span className="text-cyan-400">00:</span>
              <span>{secondsRemaining.toString().padStart(2, '0')}</span>
              <span className="text-xs font-mono-code text-slate-500">/ 30s</span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800 mb-4">
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 rounded-full transition-all duration-1000 ease-linear shadow-[0_0_12px_rgba(6,182,212,0.8)]"
              style={{ width: `${progressPct}%` }}
            />
          </div>

          {/* Current Diagnostic Stage Information */}
          <div className={`p-3.5 rounded-xl border ${currentStage.borderColor} ${currentStage.bgColor} transition-colors flex items-start gap-3`}>
            <div className={`p-2 rounded-lg bg-black/40 ${currentStage.color} shrink-0 mt-0.5`}>
              <StageIcon className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono-code uppercase px-1.5 py-0.2 bg-black/60 rounded text-slate-300">
                  Step {currentPhaseIndex + 1} of 5
                </span>
                <h4 className={`text-sm sm:text-base font-bold font-tech ${currentStage.color}`}>
                  {currentStage.title}
                </h4>
              </div>
              <p className="text-xs text-slate-300 mt-1 font-sans">
                {currentStage.desc}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="max-w-4xl w-full mx-auto text-center pt-2 border-t border-slate-900 text-xs font-mono-code text-slate-500 relative z-10 flex flex-wrap items-center justify-between gap-2">
        <span>CellShoppe Precision Screen Repair Workshop</span>
        <button 
          onClick={onCancel}
          className="hover:text-slate-300 underline"
        >
          Cancel & Return to Device Selection
        </button>
      </div>
    </div>
  );
};
