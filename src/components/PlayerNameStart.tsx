import React, { useState } from 'react';
import { 
  Wrench, 
  User, 
  ArrowRight, 
  Sparkles, 
  Smartphone, 
  ShieldCheck, 
  Layers,
  Check
} from 'lucide-react';
import { playRelayClick, playBeep } from '../utils/sound';

interface PlayerNameStartProps {
  members: string[];
  onStartPlayer: (name: string) => void;
  onViewWorkbench: () => void;
}

export const PlayerNameStart: React.FC<PlayerNameStartProps> = ({
  members,
  onStartPlayer,
  onViewWorkbench,
}) => {
  const [inputName, setInputName] = useState('');

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = inputName.trim();
    if (!trimmed) {
      alert('Please enter or select your name to start.');
      return;
    }
    playBeep();
    onStartPlayer(trimmed);
  };

  const handleSelectMember = (name: string) => {
    playBeep();
    onStartPlayer(name);
  };

  return (
    <div className="min-h-screen workbench-grid flex flex-col justify-between p-4 sm:p-6 text-white select-none relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Header */}
      <div className="max-w-2xl w-full mx-auto flex items-center justify-between pb-3 border-b border-slate-800 relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-cyan-950/80 border border-cyan-700/60 flex items-center justify-center text-cyan-400">
            <Wrench className="w-4 h-4" />
          </div>
          <span className="font-tech font-bold text-sm tracking-wide text-white">
            CellShoppe Diagnostics · Screen Repair Game
          </span>
        </div>

        <button
          onClick={onViewWorkbench}
          className="text-xs font-mono-code text-cyan-400 hover:text-cyan-300 underline"
        >
          View Full Workbench
        </button>
      </div>

      {/* Central Interactive Player Name Portal */}
      <div className="max-w-xl w-full mx-auto my-auto py-8 relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-800 text-xs font-mono-code text-cyan-300 mb-3 shadow-[0_0_15px_rgba(6,182,212,0.25)]">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Family Treat of CellShoppe</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-tech tracking-tight text-white mb-3">
            Who is playing?
          </h1>

          <p className="text-sm sm:text-base text-slate-400 max-w-md mx-auto">
            Input your name to initiate your personal screen repair sequence. Our technician will restore your device to reveal your secret treat!
          </p>
        </div>

        {/* Input Card */}
        <div className="bg-[#101726]/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
          {/* Direct Input Form */}
          <form onSubmit={handleSubmit} className="mb-6">
            <label className="block text-xs uppercase font-mono-code text-slate-400 tracking-wider mb-2">
              Enter Your Name:
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <User className="w-5 h-5 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={inputName}
                  onChange={(e) => setInputName(e.target.value)}
                  placeholder="Type your name (e.g. Samiul)..."
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-2xl pl-11 pr-4 py-3.5 text-base text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 font-sans"
                  autoFocus
                />
              </div>

              <button
                type="submit"
                className="px-6 py-3.5 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-tech font-bold text-sm tracking-wide rounded-2xl shadow-[0_0_20px_rgba(6,182,212,0.4)] flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shrink-0"
              >
                <span>Start</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Quick Select from Roster */}
          {members.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="h-px bg-slate-800 flex-1" />
                <span className="text-xs font-mono-code text-slate-500 uppercase tracking-wider">
                  Or select your name:
                </span>
                <div className="h-px bg-slate-800 flex-1" />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {members.map((name) => (
                  <button
                    key={name}
                    onClick={() => handleSelectMember(name)}
                    className="p-3 rounded-2xl bg-slate-900/80 hover:bg-cyan-950/70 border border-slate-800 hover:border-cyan-600 text-slate-200 hover:text-cyan-300 font-tech font-semibold text-sm flex items-center justify-between transition-all group active:scale-95"
                  >
                    <span className="truncate">{name}</span>
                    <Smartphone className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 transition-colors shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-3 gap-3 mt-6 text-center text-slate-400 text-xs font-mono-code">
          <div className="p-2.5 rounded-xl bg-slate-900/50 border border-slate-800/60">
            <Layers className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
            <span>Individual Reveal</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/50 border border-slate-800/60">
            <Wrench className="w-4 h-4 text-amber-400 mx-auto mb-1" />
            <span>30s Technician Repair</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/50 border border-slate-800/60">
            <ShieldCheck className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
            <span>Full-Screen Prize</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-2xl w-full mx-auto text-center pt-3 border-t border-slate-900 text-xs font-mono-code text-slate-500 relative z-10">
        CellShoppe Diagnostics · Seeded Deterministic Mystery Lottery
      </div>
    </div>
  );
};
