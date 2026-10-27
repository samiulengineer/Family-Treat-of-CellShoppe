import React from 'react';
import { X, Cpu, ShieldCheck, Zap, Battery, Sparkles, Award } from 'lucide-react';
import { AssignedDevice } from '../utils/codec';

interface InspectionModalProps {
  device: AssignedDevice | null;
  onClose: () => void;
}

export const InspectionModal: React.FC<InspectionModalProps> = ({ device, onClose }) => {
  if (!device) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-md bg-[#0c1322] border border-cyan-500/50 rounded-2xl shadow-2xl overflow-hidden neon-glow-cyan"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-slate-900 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span className="font-tech font-bold text-sm text-white tracking-wide">
              CellShoppe Workbench · Device Diagnostic
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Certificate Body */}
        <div className="p-6">
          <div className="text-center mb-5">
            <div className="w-12 h-12 rounded-2xl bg-cyan-950/80 border border-cyan-700/60 flex items-center justify-center mx-auto mb-2.5 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              <Award className="w-6 h-6 text-cyan-300" />
            </div>
            <div className="text-xs uppercase font-mono-code text-cyan-400 tracking-wider mb-0.5">
              Official Prize Allocation
            </div>
            <h3 className="text-2xl font-bold font-tech text-white">
              {device.member}
            </h3>
            <div className="text-xs font-mono-code text-slate-400 mt-0.5">
              {device.modelName} · {device.serialNumber}
            </div>
          </div>

          {/* Winning Prize Banner */}
          <div className="bg-gradient-to-br from-cyan-950/90 to-slate-950 border border-cyan-600/60 rounded-xl p-4 text-center mb-5 shadow-inner">
            <div className="text-[11px] font-mono-code text-emerald-400 uppercase tracking-widest mb-1 flex items-center justify-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              Verified Treat
            </div>
            <div className="text-lg font-bold font-tech text-cyan-200">
              {device.prize}
            </div>
          </div>

          {/* Technical Specs List */}
          <div className="space-y-2 text-xs font-mono-code bg-slate-950/60 rounded-xl p-3 border border-slate-800 mb-5">
            <div className="flex justify-between py-1 border-b border-slate-800/80">
              <span className="text-slate-500">Hardware Status</span>
              <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" /> REPAIRED & TESTED
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/80">
              <span className="text-slate-500">Battery Level</span>
              <span className="text-slate-300 flex items-center gap-1">
                <Battery className="w-3.5 h-3.5 text-cyan-400" /> {device.batteryPct}% Healthy
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Diagnostic Verification</span>
              <span className="text-cyan-400 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5" /> Seeded & Authenticated
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-tech font-bold text-sm rounded-xl transition-colors"
          >
            Close Diagnostic
          </button>
        </div>
      </div>
    </div>
  );
};
