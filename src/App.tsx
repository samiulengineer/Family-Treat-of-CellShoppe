/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AdminSetup } from './components/AdminSetup';
import { GameBoard } from './components/GameBoard';
import { decodeGameData, GamePayload } from './utils/codec';
import { Wrench, AlertCircle, ArrowLeft } from 'lucide-react';

export default function App() {
  const [gamePayload, setGamePayload] = useState<GamePayload | null>(null);
  const [rawSeedKey, setRawSeedKey] = useState<string>('');
  const [hasCheckedUrl, setHasCheckedUrl] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Check URL search parameters on mount
  useEffect(() => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const gameDataParam = searchParams.get('gameData');

      if (gameDataParam) {
        const decoded = decodeGameData(gameDataParam);
        if (decoded && decoded.members.length > 0) {
          setGamePayload(decoded);
          setRawSeedKey(gameDataParam);
        } else {
          setLoadError('The shared game link data appears to be corrupted or incomplete.');
        }
      }
    } catch (err) {
      console.error('Error parsing gameData URL parameter:', err);
      setLoadError('Failed to read configuration from URL parameter.');
    } finally {
      setHasCheckedUrl(true);
    }

    // Listen to popstate (back/forward navigation)
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const data = params.get('gameData');
      if (data) {
        const dec = decodeGameData(data);
        if (dec) {
          setGamePayload(dec);
          setRawSeedKey(data);
        }
      } else {
        setGamePayload(null);
        setRawSeedKey('');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Handler when launched from Phase 1 Admin Setup
  const handleLaunchFromAdmin = (payload: GamePayload, shareUrl: string) => {
    try {
      const params = new URLSearchParams(new URL(shareUrl).search);
      const paramVal = params.get('gameData') || '';
      setRawSeedKey(paramVal);
    } catch {
      setRawSeedKey(Date.now().toString());
    }
    setGamePayload(payload);
  };

  // Handler to return to Admin Setup
  const handleBackToAdmin = () => {
    // Clean URL search param without reloading
    const cleanUrl = window.location.origin + window.location.pathname;
    try {
      window.history.pushState({}, '', cleanUrl);
    } catch {
      // ignore
    }
    setGamePayload(null);
    setRawSeedKey('');
    setLoadError(null);
  };

  if (!hasCheckedUrl) {
    return (
      <div className="min-h-screen bg-[#090d16] flex items-center justify-center font-mono-code text-cyan-400 text-sm">
        <div className="flex items-center gap-2">
          <Wrench className="w-4 h-4 animate-spin" />
          <span>INITIALIZING CELLSHOPPE WORKBENCH...</span>
        </div>
      </div>
    );
  }

  // Error screen for corrupt URL data
  if (loadError) {
    return (
      <div className="min-h-screen bg-[#090d16] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#101726] border border-rose-800/80 rounded-2xl p-6 text-center shadow-2xl">
          <div className="w-12 h-12 rounded-full bg-rose-950/80 border border-rose-700/80 flex items-center justify-center mx-auto mb-3 text-rose-400">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold font-tech text-white mb-2">
            Invalid Workbench Data
          </h2>
          <p className="text-sm text-slate-400 mb-6 font-sans">
            {loadError}
          </p>
          <button
            onClick={handleBackToAdmin}
            className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-tech font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Go to Admin Setup
          </button>
        </div>
      </div>
    );
  }

  // Phase 2, 3, 4: Game Board if gameData is present
  if (gamePayload) {
    return (
      <GameBoard
        payload={gamePayload}
        rawSeedKey={rawSeedKey}
        onBackToAdmin={handleBackToAdmin}
      />
    );
  }

  // Phase 1: Admin Setup GUI if no gameData
  return <AdminSetup onLaunchGame={handleLaunchFromAdmin} />;
}
