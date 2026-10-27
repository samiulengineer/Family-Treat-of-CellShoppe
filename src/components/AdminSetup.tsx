import React, { useState } from 'react';
import { 
  Users, 
  Gift, 
  Plus, 
  Trash2, 
  Share2, 
  Play, 
  RotateCcw, 
  Copy, 
  Check, 
  Wrench,
  Smartphone,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { encodeGameData, GamePayload } from '../utils/codec';
import { playRelayClick, playBeep } from '../utils/sound';

interface AdminSetupProps {
  onLaunchGame: (payload: GamePayload, shareUrl: string) => void;
}

const DEFAULT_MEMBERS = ['Samiul', 'Rabeya', 'Sabbir', 'Shajjad', 'Kaniz'];

const DEFAULT_PRIZES = [
  'Grand Dinner Buffet Treat at The Peninsula',
  'Smart Fitness Watch / Band',
  'Wireless ANC Noise-Canceling Earbuds',
  'Family Pizza, Wings & Ice Cream Feast',
  'Cold Hard Cash Treat (৳2,000)',
  'Premium Power Bank 20,000mAh Supercharge'
];

const SUGGESTED_PRIZES = [
  'Mystery Gadget Tech Box',
  'Coffee & Artisan Dessert Voucher',
  'Cinema VIP Ticket & Popcorn Feast',
  'Luxury Smartphone Case & Screen Guard Upgrade',
  'Amazon / Shopping Voucher'
];

export const AdminSetup: React.FC<AdminSetupProps> = ({ onLaunchGame }) => {
  const [members, setMembers] = useState<string[]>(DEFAULT_MEMBERS);
  const [newMemberName, setNewMemberName] = useState('');
  
  const [prizes, setPrizes] = useState<string[]>(DEFAULT_PRIZES);
  const [newPrizeTitle, setNewPrizeTitle] = useState('');

  const [copiedLink, setCopiedLink] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState('');

  // Handle adding member
  const handleAddMember = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = newMemberName.trim();
    if (!trimmed) return;
    if (members.some(m => m.toLowerCase() === trimmed.toLowerCase())) {
      alert('This family member is already on the roster.');
      return;
    }
    playRelayClick();
    setMembers([...members, trimmed]);
    setNewMemberName('');
  };

  // Handle removing member
  const handleRemoveMember = (indexToRemove: number) => {
    if (members.length <= 1) {
      alert('Keep at least 1 family member.');
      return;
    }
    playRelayClick();
    setMembers(members.filter((_, idx) => idx !== indexToRemove));
  };

  // Handle adding prize
  const handleAddPrize = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = newPrizeTitle.trim();
    if (!trimmed) return;
    playRelayClick();
    setPrizes([...prizes, trimmed]);
    setNewPrizeTitle('');
  };

  // Quick add suggestion
  const handleAddSuggestedPrize = (suggestion: string) => {
    playRelayClick();
    setPrizes([...prizes, suggestion]);
  };

  // Handle removing prize
  const handleRemovePrize = (indexToRemove: number) => {
    if (prizes.length <= 1) {
      alert('Keep at least 1 prize.');
      return;
    }
    playRelayClick();
    setPrizes(prizes.filter((_, idx) => idx !== indexToRemove));
  };

  // Reset to defaults
  const handleResetDefaults = () => {
    if (confirm('Reset family members and secret prizes to default CellShoppe setup?')) {
      playRelayClick();
      setMembers(DEFAULT_MEMBERS);
      setPrizes(DEFAULT_PRIZES);
      setGeneratedUrl('');
    }
  };

  // Helper to construct shareable URL with Base64 gameData
  const buildShareUrl = (): { url: string; payload: GamePayload } => {
    const payload: GamePayload = {
      members,
      prizes,
      title: 'Family Treat of CellShoppe',
      timestamp: Date.now()
    };
    const encoded = encodeGameData(payload);
    const origin = window.location.origin + window.location.pathname;
    const shareableUrl = `${origin}?gameData=${encoded}`;
    return { url: shareableUrl, payload };
  };

  // Phase 1 "Generate Share Link" action
  const handleGenerateShareLink = async () => {
    playBeep();
    const { url, payload } = buildShareUrl();
    setGeneratedUrl(url);

    // Update browser URL without reload so admin can also bookmark or test
    try {
      window.history.pushState({ path: url }, '', url);
    } catch {
      // ignore
    }

    // Copy to clipboard
    try {
      await navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3500);
    } catch (err) {
      console.warn('Clipboard write failed, showing input', err);
    }
  };

  // Launch Game Directly on this device
  const handleLaunchDirectly = () => {
    playBeep();
    const { url, payload } = buildShareUrl();
    try {
      window.history.pushState({ path: url }, '', url);
    } catch {
      // ignore
    }
    onLaunchGame(payload, url);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Workbench Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-950/70 border border-cyan-800/80 rounded-full text-xs font-mono-code text-cyan-400 mb-3 shadow-[0_0_12px_rgba(6,182,212,0.25)]">
          <Wrench className="w-3.5 h-3.5 text-cyan-400" />
          <span>CellShoppe Workbench · Phase 1 Admin Configuration</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-tech tracking-tight text-white mb-2">
          Family Treat of CellShoppe
        </h1>
        <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto">
          Configure family members and secret prizes. Generate a sealed game link where mystery devices get assigned and repaired with deterministic prizes!
        </p>
      </div>

      {/* Main Admin Setup Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* SECTION 1: Family Members */}
        <div className="bg-[#101726] border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800/80">
              <div className="flex items-center gap-2 text-cyan-400">
                <Users className="w-5 h-5" />
                <h2 className="font-tech font-bold text-lg text-slate-100">
                  Family Members
                </h2>
              </div>
              <span className="text-xs font-mono-code px-2 py-0.5 rounded bg-slate-800/80 text-cyan-300">
                {members.length} {members.length === 1 ? 'Person' : 'People'}
              </span>
            </div>

            {/* Input & Add Button */}
            <form onSubmit={handleAddMember} className="flex gap-2 mb-4">
              <input
                type="text"
                value={newMemberName}
                onChange={(e) => setNewMemberName(e.target.value)}
                placeholder="Enter member name (e.g. Samiul)..."
                className="flex-1 bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 font-sans"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1 transition-colors shrink-0"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </form>

            {/* Member List */}
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {members.map((member, idx) => (
                <div
                  key={`${member}-${idx}`}
                  className="flex items-center justify-between bg-slate-900/70 border border-slate-800/80 hover:border-slate-700 px-3 py-2 rounded-xl text-sm transition-colors group"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-cyan-950/80 border border-cyan-800/70 text-[11px] font-mono-code flex items-center justify-center text-cyan-400">
                      {idx + 1}
                    </span>
                    <span className="font-medium text-slate-200">{member}</span>
                  </div>
                  <button
                    onClick={() => handleRemoveMember(idx)}
                    className="text-slate-500 hover:text-rose-400 p-1 rounded transition-colors"
                    title={`Remove ${member}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-500">
            <span>Defaults: Samiul, Rabeya, Sabbir, Shajjad, Kaniz</span>
          </div>
        </div>

        {/* SECTION 2: Secret Prizes */}
        <div className="bg-[#101726] border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800/80">
              <div className="flex items-center gap-2 text-amber-400">
                <Gift className="w-5 h-5" />
                <h2 className="font-tech font-bold text-lg text-slate-100">
                  Secret Prizes
                </h2>
              </div>
              <span className="text-xs font-mono-code px-2 py-0.5 rounded bg-slate-800/80 text-amber-300">
                {prizes.length} {prizes.length === 1 ? 'Prize' : 'Prizes'}
              </span>
            </div>

            {/* Input & Add Button */}
            <form onSubmit={handleAddPrize} className="flex gap-2 mb-3">
              <input
                type="text"
                value={newPrizeTitle}
                onChange={(e) => setNewPrizeTitle(e.target.value)}
                placeholder="Enter secret prize (e.g. Dinner Buffet)..."
                className="flex-1 bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 font-sans"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1 transition-colors shrink-0"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </form>

            {/* Quick Add Suggestions */}
            <div className="mb-3">
              <span className="text-[11px] font-mono-code text-slate-400 block mb-1.5 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" /> Quick Add Suggestions:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {SUGGESTED_PRIZES.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => handleAddSuggestedPrize(item)}
                    className="text-xs text-slate-300 bg-slate-800/90 hover:bg-amber-950/60 hover:text-amber-300 border border-slate-700/60 hover:border-amber-700/60 rounded-lg px-2.5 py-1 transition-colors"
                  >
                    + {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Prizes List */}
            <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
              {prizes.map((prize, idx) => (
                <div
                  key={`${prize}-${idx}`}
                  className="flex items-center justify-between bg-slate-900/70 border border-slate-800/80 hover:border-slate-700 px-3 py-2 rounded-xl text-sm transition-colors group"
                >
                  <div className="flex items-center gap-2 truncate pr-2">
                    <span className="w-5 h-5 rounded-full bg-amber-950/80 border border-amber-800/70 text-[11px] font-mono-code flex items-center justify-center text-amber-400 shrink-0">
                      {idx + 1}
                    </span>
                    <span className="font-medium text-slate-200 truncate">{prize}</span>
                  </div>
                  <button
                    onClick={() => handleRemovePrize(idx)}
                    className="text-slate-500 hover:text-rose-400 p-1 rounded transition-colors shrink-0"
                    title={`Remove ${prize}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
            <span>
              {prizes.length >= members.length 
                ? '✓ Enough prizes for everyone' 
                : 'ℹ Prizes will cycle deterministically'}
            </span>
            <button
              onClick={handleResetDefaults}
              className="text-slate-400 hover:text-slate-200 flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset All Defaults
            </button>
          </div>
        </div>
      </div>

      {/* PHASE 1 ACTION BAR: Generate Share Link & Launch Preview */}
      <div className="bg-[#101726]/90 border border-cyan-800/60 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-5">
          <div>
            <h3 className="text-xl font-bold font-tech text-white flex items-center gap-2">
              <Share2 className="w-5 h-5 text-cyan-400" />
              Generate Encoded Game Link
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-lg mt-1">
              Encodes all family members and prizes into a URL-safe Base64 hash. Family members opening this link on their phones will see the Mystery Devices ready to be revealed!
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Primary Action Button */}
            <button
              onClick={handleGenerateShareLink}
              className="flex-1 md:flex-none px-6 py-3 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white font-tech font-bold text-sm tracking-wide rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-200" /> : <Copy className="w-4 h-4" />}
              {copiedLink ? 'Copied to Clipboard!' : 'Generate Share Link'}
            </button>

            {/* Launch Game Board Directly */}
            <button
              onClick={handleLaunchDirectly}
              className="flex-1 md:flex-none px-5 py-3 bg-slate-800 hover:bg-slate-700 text-cyan-300 font-tech font-semibold text-sm rounded-xl border border-cyan-700/50 hover:border-cyan-500 transition-all flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 text-cyan-400" />
              Launch Workbench
            </button>
          </div>
        </div>

        {/* Display generated link if ready */}
        {generatedUrl && (
          <div className="mt-5 pt-4 border-t border-slate-800 relative z-10">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-mono-code text-cyan-400 flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5" />
                Shareable Game Link (Send to WhatsApp / Family Group):
              </span>
              {copiedLink && (
                <span className="text-xs font-mono-code text-emerald-400 animate-pulse">
                  ✓ Link Copied to Clipboard
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={generatedUrl}
                className="w-full bg-black/60 border border-cyan-900/60 rounded-xl px-3 py-2 text-xs font-mono-code text-slate-300 select-all focus:outline-none"
              />
              <button
                onClick={handleGenerateShareLink}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-mono-code flex items-center gap-1 shrink-0"
              >
                <Copy className="w-3.5 h-3.5" />
                Copy
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
