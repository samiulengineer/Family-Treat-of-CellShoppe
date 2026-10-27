/**
 * Web Audio API synthesizer for CellShoppe workbench sound effects.
 * Client-side procedural audio - no external sound files required.
 */

let audioCtx: AudioContext | null = null;
let isMuted = false;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function toggleMute(): boolean {
  isMuted = !isMuted;
  return isMuted;
}

export function getIsMuted(): boolean {
  return isMuted;
}

export function playRelayClick(): void {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const now = ctx.currentTime;

  osc.type = 'triangle';
  osc.frequency.setValueAtTime(1400, now);
  osc.frequency.exponentialRampToValueAtTime(300, now + 0.04);

  gain.gain.setValueAtTime(0.12, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.045);
}

export function playBeep(): void {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const now = ctx.currentTime;

  osc.type = 'sine';
  osc.frequency.setValueAtTime(880, now);

  gain.gain.setValueAtTime(0.08, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.08);
}

export function playSolderSpark(): void {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(180, now);
  osc.frequency.exponentialRampToValueAtTime(820, now + 0.06);

  gain.gain.setValueAtTime(0.06, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.07);
}

export function playLaserPulse(): void {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(1200, now);
  osc.frequency.exponentialRampToValueAtTime(400, now + 0.15);

  gain.gain.setValueAtTime(0.07, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.16);
}

export function playPowerOnSurge(): void {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  // Low frequency power hum
  const hum = ctx.createOscillator();
  const humGain = ctx.createGain();
  hum.type = 'sawtooth';
  hum.frequency.setValueAtTime(60, now);
  hum.frequency.exponentialRampToValueAtTime(220, now + 0.6);

  humGain.gain.setValueAtTime(0.12, now);
  humGain.gain.exponentialRampToValueAtTime(0.01, now + 0.7);

  hum.connect(humGain);
  humGain.connect(ctx.destination);
  hum.start(now);
  hum.stop(now + 0.75);

  // High sweep chime
  const sweep = ctx.createOscillator();
  const sweepGain = ctx.createGain();
  sweep.type = 'sine';
  sweep.frequency.setValueAtTime(300, now + 0.1);
  sweep.frequency.exponentialRampToValueAtTime(1800, now + 0.5);

  sweepGain.gain.setValueAtTime(0.08, now + 0.1);
  sweepGain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

  sweep.connect(sweepGain);
  sweepGain.connect(ctx.destination);
  sweep.start(now + 0.1);
  sweep.stop(now + 0.75);
}

export function playRepairTriumph(): void {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const notes = [440, 554.37, 659.25, 880, 1108.73, 1318.51]; // A major triumphant chord
  const now = ctx.currentTime;

  notes.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const startTime = now + idx * 0.1;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, startTime);

    gain.gain.setValueAtTime(0.15, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.6);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + 0.65);
  });
}
