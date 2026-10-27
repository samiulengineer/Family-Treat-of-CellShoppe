import React from 'react';
import { 
  Smartphone, 
  Laptop, 
  Tablet, 
  Watch, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle,
  Zap,
  Cpu
} from 'lucide-react';
import { AssignedDevice, DeviceCategory } from '../utils/codec';

interface DeviceCardProps {
  device: AssignedDevice;
  index: number;
  isRevealing: boolean;
  isRevealed: boolean;
  onInspect: (device: AssignedDevice) => void;
}

export const DeviceCard: React.FC<DeviceCardProps> = ({
  device,
  index,
  isRevealing,
  isRevealed,
  onInspect,
}) => {
  // Stagger animation timing based on index
  const animationDelayMs = index * 220;

  const renderDeviceIcon = (category: DeviceCategory) => {
    switch (category) {
      case 'smartphone':
        return <Smartphone className="w-4 h-4 text-cyan-400" />;
      case 'laptop':
        return <Laptop className="w-4 h-4 text-sky-400" />;
      case 'tablet':
        return <Tablet className="w-4 h-4 text-emerald-400" />;
      case 'smartwatch':
        return <Watch className="w-4 h-4 text-amber-400" />;
    }
  };

  return (
    <div 
      className={`relative group rounded-2xl p-4 transition-all duration-300 border flex flex-col justify-between select-none ${
        isRevealed 
          ? 'bg-slate-900/90 border-cyan-500/50 shadow-lg shadow-cyan-950/40 neon-glow-cyan' 
          : isRevealing
          ? 'bg-slate-900/80 border-amber-500/60 shadow-lg shadow-amber-950/30'
          : 'bg-[#101624] border-slate-800 hover:border-slate-700 hover:shadow-md'
      }`}
      style={{
        transitionDelay: `${isRevealing ? animationDelayMs : 0}ms`,
      }}
    >
      {/* Corner Hex Bolts & PCB Accents */}
      <div className="absolute top-2 left-2 w-1.5 h-1.5 rounded-full bg-slate-700/60 border border-slate-600/50" />
      <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-slate-700/60 border border-slate-600/50" />
      <div className="absolute bottom-2 left-2 w-1.5 h-1.5 rounded-full bg-slate-700/60 border border-slate-600/50" />
      <div className="absolute bottom-2 right-2 w-1.5 h-1.5 rounded-full bg-slate-700/60 border border-slate-600/50" />

      {/* Top Bar: Device Model & Status Indicator */}
      <div className="flex items-center justify-between gap-2 mb-3 px-1">
        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono-code truncate">
          {renderDeviceIcon(device.deviceType)}
          <span className="font-semibold text-slate-300 truncate">{device.modelName}</span>
        </div>

        {/* LED Status Indicator */}
        <div className="flex items-center gap-1.5 shrink-0">
          <div 
            className={`w-2 h-2 rounded-full transition-colors duration-500 ${
              isRevealed 
                ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' 
                : isRevealing 
                ? 'bg-amber-400 animate-ping' 
                : 'bg-rose-500/80'
            }`} 
          />
          <span className="text-[10px] font-mono-code tracking-wider uppercase text-slate-400">
            {isRevealed ? 'REPAIRED' : isRevealing ? 'BOOTING' : 'OFFLINE'}
          </span>
        </div>
      </div>

      {/* Device Hardware Bezel / Enclosure */}
      <div className="relative rounded-xl overflow-hidden bg-black p-2 border border-slate-800 shadow-inner">
        {/* Speaker notch / Camera punch-hole simulation */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1 opacity-70">
          <div className="w-1.5 h-1.5 rounded-full bg-slate-900 border border-slate-700" />
          <div className="w-8 h-1 rounded-full bg-slate-800" />
        </div>

        {/* SCREEN AREA */}
        <div 
          className={`relative min-h-[190px] rounded-lg p-4 flex flex-col justify-between overflow-hidden transition-all duration-700 scanlines ${
            isRevealed 
              ? 'bg-gradient-to-b from-slate-950 via-[#061826] to-[#04202c] text-white animate-screen-boot' 
              : isRevealing 
              ? 'bg-slate-950 text-cyan-200' 
              : 'bg-[#080b12] text-slate-600'
          }`}
        >
          {/* Unrevealed: Broken / Powered-Off Screen */}
          {!isRevealed && !isRevealing && (
            <div className="relative z-10 flex flex-col items-center justify-center text-center h-full my-auto py-4">
              {/* Shattered Glass SVG Overlay */}
              <svg 
                className="absolute inset-0 w-full h-full pointer-events-none opacity-45 stroke-cyan-500/40 fill-none" 
                viewBox="0 0 200 200" 
                preserveAspectRatio="none"
              >
                <path d="M 20 0 L 85 70 L 110 50 L 180 120 L 200 110 M 85 70 L 60 140 L 120 180 M 85 70 L 140 80 L 160 30 M 60 140 L 10 180 M 140 80 L 190 190" strokeWidth="1.2" />
                <circle cx="85" cy="70" r="3" fill="#38bdf8" fillOpacity="0.4" />
                <path d="M 85 70 L 95 90 L 80 110" strokeWidth="0.8" />
              </svg>

              <div className="w-10 h-10 rounded-full bg-slate-900/80 border border-slate-700/80 flex items-center justify-center mb-3">
                <AlertTriangle className="w-5 h-5 text-amber-500/80" />
              </div>

              <div className="text-xs font-mono-code text-slate-400 tracking-wider uppercase mb-1">
                Display Damaged
              </div>
              <div className="text-[11px] text-slate-500">
                Awaiting Diagnostic Power-On
              </div>
            </div>
          )}

          {/* Revealing / Boot Sequence State */}
          {isRevealing && !isRevealed && (
            <div className="relative z-10 flex flex-col items-center justify-center text-center h-full my-auto py-4 font-mono-code">
              <Zap className="w-8 h-8 text-cyan-400 animate-bounce mb-2" />
              <div className="text-xs text-cyan-400 tracking-widest uppercase mb-1">
                ⚡ Flashing Kernel...
              </div>
              <div className="text-[10px] text-slate-400">
                Calibrating OLED Display matrix
              </div>
              <div className="w-32 h-1 bg-slate-800 rounded-full mt-3 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 w-full animate-pulse" />
              </div>
            </div>
          )}

          {/* Revealed / Repaired Screen Content */}
          {isRevealed && (
            <div className="relative z-10 flex flex-col justify-between h-full">
              {/* Screen Header */}
              <div className="flex items-center justify-between text-[10px] font-mono-code text-cyan-400/90 border-b border-cyan-900/50 pb-1.5 mb-2">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-emerald-400" />
                  REPAIR COMPLETE
                </span>
                <span className="text-slate-400">{device.batteryPct}% BATTERY</span>
              </div>

              {/* Main Winning Prize Announcement */}
              <div className="text-center py-2 px-1 my-auto">
                <div className="text-[11px] font-mono-code uppercase tracking-wider text-emerald-400 mb-1 flex items-center justify-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Winner Prize
                </div>
                <div className="text-base sm:text-lg font-bold font-tech text-white leading-snug drop-shadow-[0_0_12px_rgba(34,211,238,0.7)] px-1">
                  {device.prize}
                </div>
              </div>

              {/* Screen Footer */}
              <div className="text-center pt-2 border-t border-cyan-900/40 text-[10px] font-mono-code text-slate-400">
                CellShoppe Diagnostics · Verified
              </div>
            </div>
          )}
        </div>

        {/* Home Indicator Bar */}
        <div className="w-16 h-1 rounded-full bg-slate-700/60 mx-auto mt-2" />
      </div>

      {/* Device Assignment Label (Family Member's Name) */}
      <div className="mt-3.5 pt-2 border-t border-slate-800/80 flex items-center justify-between">
        <div>
          <div className="text-[10px] uppercase font-mono-code text-slate-400 tracking-wider">
            Device Assigned To
          </div>
          <div className="text-base sm:text-lg font-bold font-tech text-cyan-300 tracking-wide">
            {device.member}
          </div>
        </div>

        {/* Action / Inspect Voucher button */}
        {isRevealed && (
          <button
            onClick={() => onInspect(device)}
            className="px-2.5 py-1 text-xs font-mono-code text-cyan-300 bg-cyan-950/60 hover:bg-cyan-900/80 border border-cyan-700/60 rounded-lg transition-colors flex items-center gap-1"
            title="Inspect Voucher & Specs"
          >
            <Cpu className="w-3 h-3" />
            Inspect
          </button>
        )}
      </div>
    </div>
  );
};
