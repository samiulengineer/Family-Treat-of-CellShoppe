import React from 'react';

interface TechnicianSvgProps {
  phase: number; // 0 to 4
  progress: number; // 0 to 100
  secondsLeft: number;
}

export const TechnicianSvg: React.FC<TechnicianSvgProps> = ({ phase, progress, secondsLeft }) => {
  return (
    <div className="relative w-full max-w-lg mx-auto aspect-[16/11] select-none">
      <svg
        viewBox="0 0 640 440"
        className="w-full h-full drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Workbench table gradient */}
          <linearGradient id="benchGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>

          {/* Cutting Mat Green Grid */}
          <linearGradient id="matGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#064e3b" />
            <stop offset="100%" stopColor="#022c22" />
          </linearGradient>

          {/* Visor glowing glass gradient (NO EYES - sleek reflective tech visor) */}
          <linearGradient id="visorGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="50%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>

          {/* Technician coat gradient */}
          <linearGradient id="coatGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="100%" stopColor="#1e293b" />
          </linearGradient>

          {/* Laser beam gradient */}
          <linearGradient id="laserBeam" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#00f3ff" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.1" />
          </linearGradient>

          {/* Soldering tip heat glow */}
          <radialGradient id="heatGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffedd5" />
            <stop offset="40%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#ea580c" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* WORKBENCH BACKGROUND & WALL MOUNT */}
        <rect x="0" y="0" width="640" height="440" rx="16" fill="#0b0f19" />
        
        {/* Pegboard wall holes */}
        <g opacity="0.15" fill="#38bdf8">
          {[...Array(6)].map((_, r) => (
            <g key={r}>
              {[...Array(14)].map((_, c) => (
                <circle key={c} cx={45 + c * 42} cy={30 + r * 28} r="2.5" />
              ))}
            </g>
          ))}
        </g>

        {/* Oscilloscope / Waveform Monitor on shelf */}
        <g transform="translate(40, 25)">
          <rect x="0" y="0" width="130" height="85" rx="8" fill="#111827" stroke="#334155" strokeWidth="2" />
          <rect x="10" y="10" width="110" height="65" rx="4" fill="#022c22" stroke="#047857" strokeWidth="1" />
          {/* Waveform line */}
          <path
            d="M 12 42 Q 25 25 38 42 T 64 42 Q 78 15 88 58 T 118 42"
            stroke="#10b981"
            strokeWidth="2"
            fill="none"
            className="animate-pulse"
          />
          <text x="14" y="22" fill="#34d399" fontSize="8" fontFamily="monospace" fontWeight="bold">
            OSC 120Hz · ACTIVE
          </text>
        </g>

        {/* Tool rack on shelf: Screwdrivers & tweezers */}
        <g transform="translate(480, 25)">
          <rect x="0" y="0" width="120" height="85" rx="8" fill="#111827" stroke="#334155" strokeWidth="2" />
          <text x="12" y="20" fill="#94a3b8" fontSize="8" fontFamily="monospace">CELLSHOPPE LAB</text>
          {/* Tool silhouettes */}
          <rect x="15" y="30" width="6" height="42" rx="2" fill="#0ea5e9" />
          <rect x="35" y="26" width="6" height="46" rx="2" fill="#f59e0b" />
          <rect x="55" y="32" width="6" height="40" rx="2" fill="#10b981" />
          <path d="M 78 30 L 84 72 M 88 30 L 84 72" stroke="#cbd5e1" strokeWidth="2" />
          <rect x="100" y="34" width="8" height="38" rx="2" fill="#64748b" />
        </g>

        {/* WORKBENCH TABLE SURFACE */}
        <polygon points="0,210 640,210 640,440 0,440" fill="url(#benchGrad)" />
        <line x1="0" y1="210" x2="640" y2="210" stroke="#334155" strokeWidth="2" />

        {/* ESD Anti-Static Cutting Mat */}
        <polygon points="60,230 580,230 610,430 30,430" fill="url(#matGrad)" stroke="#047857" strokeWidth="2" />
        {/* Mat grid lines */}
        <g opacity="0.3" stroke="#10b981" strokeWidth="1">
          <line x1="120" y1="230" x2="100" y2="430" />
          <line x1="220" y1="230" x2="200" y2="430" />
          <line x1="320" y1="230" x2="320" y2="430" />
          <line x1="420" y1="230" x2="440" y2="430" />
          <line x1="520" y1="230" x2="540" y2="430" />
          <line x1="50" y1="280" x2="590" y2="280" />
          <line x1="40" y1="340" x2="600" y2="340" />
          <line x1="35" y1="390" x2="605" y2="390" />
        </g>

        {/* TECHNICIAN (VECTOR ARTWORK - NO EYES, WEARING PROTECTIVE VISOR) */}
        <g transform="translate(230, 40)">
          {/* Technician Head & Hair / Cap */}
          <path
            d="M 60 70 C 60 40, 120 40, 120 70 C 120 85, 115 110, 90 115 C 65 110, 60 85, 60 70 Z"
            fill="#e2e8f0"
          />
          {/* Modern Tech Cap */}
          <path
            d="M 54 62 C 54 36, 126 36, 126 62 C 126 68, 54 68, 54 62 Z"
            fill="#0f172a"
          />
          <path
            d="M 45 64 Q 90 60 135 64 Q 90 68 45 64"
            fill="#0284c7"
          />

          {/* TECHNICIAN FACE - NO EYES! Sleek continuous panoramic protective visor */}
          {/* Jaw & neck */}
          <path d="M 72 90 L 72 120 L 108 120 L 108 90 Z" fill="#cbd5e1" />
          <path d="M 68 115 Q 90 128 112 115 L 105 135 L 75 135 Z" fill="#94a3b8" />

          {/* PROTECTIVE DIAGNOSTIC VISOR / GOGGLES (NO EYES DRAWN) */}
          <rect
            x="62"
            y="70"
            width="56"
            height="18"
            rx="5"
            fill="url(#visorGrad)"
            stroke="#e0f2fe"
            strokeWidth="1.5"
            className="filter drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]"
          />
          {/* Visor HUD reflection streak */}
          <path d="M 66 73 L 78 73 L 72 84 L 64 84 Z" fill="#ffffff" opacity="0.65" />
          <line x1="86" y1="79" x2="112" y2="79" stroke="#ffffff" strokeWidth="1" strokeDasharray="3 2" opacity="0.8" />

          {/* Clean sterile face mask covering nose/mouth */}
          <path
            d="M 68 88 Q 90 92 112 88 L 108 112 Q 90 122 72 112 Z"
            fill="#1e293b"
            stroke="#38bdf8"
            strokeWidth="1"
          />
          {/* CellShoppe micro logo on mask */}
          <circle cx="90" cy="102" r="3" fill="#06b6d4" />

          {/* Technician Shoulders & Tech Coat */}
          <path
            d="M 20 155 C 25 130, 65 125, 90 125 C 115 125, 155 130, 160 155 L 175 220 L 5 220 Z"
            fill="url(#coatGrad)"
            stroke="#475569"
            strokeWidth="1.5"
          />
          {/* Collar & CellShoppe repair technician badge */}
          <polygon points="90,128 75,155 105,155" fill="#0ea5e9" />
          <rect x="115" y="145" width="28" height="14" rx="2" fill="#0f172a" stroke="#38bdf8" strokeWidth="0.8" />
          <text x="118" y="155" fill="#38bdf8" fontSize="6" fontFamily="monospace" fontWeight="bold">TECH</text>

          {/* LEFT ARM & HAND holding precision tweezers / suction lifter */}
          <path
            d="M 30 160 Q 20 200, 65 240 Q 75 245, 85 240 L 95 210 Q 55 190, 50 165 Z"
            fill="#334155"
          />
          {/* Left Hand with anti-static ESD glove */}
          <circle cx="85" cy="245" r="12" fill="#0284c7" />
          {/* Tool: Suction Lifter or Tweezers */}
          <g transform="translate(85, 245)">
            <rect x="-3" y="0" width="6" height="32" rx="2" fill="#94a3b8" />
            <path d="M -8 30 Q 0 38 8 30 Z" fill="#38bdf8" opacity="0.9" />
          </g>

          {/* RIGHT ARM & HAND holding micro-soldering pen / hot air pencil */}
          <path
            d="M 150 160 Q 165 200, 125 240 Q 115 245, 105 240 L 95 210 Q 135 190, 140 165 Z"
            fill="#334155"
          />
          {/* Right Hand with anti-static glove */}
          <circle cx="115" cy="245" r="12" fill="#0284c7" />
          {/* Soldering Iron Pen */}
          <g transform="translate(108, 240) rotate(-28)">
            <rect x="0" y="0" width="8" height="38" rx="3" fill="#1e293b" stroke="#0ea5e9" strokeWidth="1" />
            <rect x="2" y="38" width="4" height="24" fill="#cbd5e1" />
            {/* Heated Copper Tip */}
            <polygon points="2,62 6,62 4,72" fill="#f97316" />
            {/* Solder spark/heat glow */}
            <circle cx="4" cy="72" r="10" fill="url(#heatGlow)" className="animate-ping" />
          </g>
        </g>

        {/* CLAMP FIXTURE HOLDING THE REPAIRED DEVICE ON WORKBENCH */}
        <g transform="translate(250, 260)">
          {/* Clamp Base */}
          <rect x="-20" y="100" width="180" height="18" rx="4" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
          <circle cx="-10" cy="109" r="4" fill="#64748b" />
          <circle cx="150" cy="109" r="4" fill="#64748b" />

          {/* DEVICE BODY */}
          <rect
            x="0"
            y="0"
            width="140"
            height="100"
            rx="12"
            fill="#090d16"
            stroke="#38bdf8"
            strokeWidth="3"
            className="filter drop-shadow-[0_0_15px_rgba(6,182,212,0.4)]"
          />

          {/* DEVICE DISPLAY SCREEN (SHOWING ACTIVE REPAIR STATUS) */}
          <rect
            x="8"
            y="8"
            width="124"
            height="84"
            rx="6"
            fill={phase >= 4 ? '#052e2b' : phase >= 2 ? '#082f49' : '#030712'}
            stroke={phase >= 4 ? '#10b981' : '#0284c7'}
            strokeWidth="1"
          />

          {/* CRACK PATTERNS (Vanish as repair progresses) */}
          {phase < 3 && (
            <g opacity={phase === 0 ? 0.9 : phase === 1 ? 0.6 : 0.25} stroke="#38bdf8" strokeWidth="1.5">
              <path d="M 20 8 L 55 45 L 75 30 L 110 70 M 55 45 L 40 85 M 75 30 L 120 35" />
              <circle cx="55" cy="45" r="3" fill="#f43f5e" />
            </g>
          )}

          {/* LASER SCANNING BEAM (Phases 3 & 4) */}
          {(phase === 2 || phase === 3) && (
            <g className="animate-pulse">
              <line x1="8" y1={20 + (progress % 50)} x2="132" y2={20 + (progress % 50)} stroke="#00f3ff" strokeWidth="2" />
              <rect x="8" y={10 + (progress % 50)} width="124" height="20" fill="url(#laserBeam)" />
            </g>
          )}

          {/* REPAIRED DISPLAY GLOW (Phase 4 / Complete) */}
          {phase >= 4 && (
            <g>
              <rect x="8" y="8" width="124" height="84" rx="6" fill="#047857" opacity="0.3" />
              <text x="70" y="46" textAnchor="middle" fill="#34d399" fontSize="11" fontFamily="monospace" fontWeight="bold">
                ✓ 100% RESTORED
              </text>
              <text x="70" y="62" textAnchor="middle" fill="#a7f3d0" fontSize="9" fontFamily="monospace">
                AMOLED CALIBRATED
              </text>
            </g>
          )}

          {/* Solder micro-sparks animation */}
          {phase < 4 && (
            <g transform="translate(68, 42)">
              <circle cx="-5" cy="-5" r="2" fill="#fbbf24" className="animate-ping" />
              <circle cx="10" cy="5" r="1.5" fill="#38bdf8" className="animate-ping" />
              <circle cx="-2" cy="8" r="1" fill="#f97316" className="animate-pulse" />
            </g>
          )}
        </g>

        {/* MAGNIFIER INSPECTION LAMP ON BENCH (Right Side) */}
        <g transform="translate(480, 160)">
          {/* Base */}
          <rect x="30" y="160" width="60" height="15" rx="3" fill="#1e293b" />
          {/* Articulated Arm */}
          <line x1="60" y1="160" x2="40" y2="90" stroke="#64748b" strokeWidth="4" />
          <line x1="40" y1="90" x2="-20" y2="60" stroke="#64748b" strokeWidth="4" />
          <circle cx="40" cy="90" r="6" fill="#334155" />
          {/* Magnifier Ring Lamp */}
          <circle cx="-20" cy="60" r="28" fill="none" stroke="#e2e8f0" strokeWidth="6" />
          <circle cx="-20" cy="60" r="22" fill="#38bdf8" opacity="0.25" />
          <circle cx="-20" cy="60" r="28" fill="none" stroke="#00f3ff" strokeWidth="2" className="animate-pulse" />
        </g>

        {/* HUD TELEMETRY BADGE ON TOP */}
        <g transform="translate(20, 400)">
          <rect x="0" y="0" width="220" height="28" rx="6" fill="#0f172a" stroke="#0284c7" strokeWidth="1" />
          <circle cx="14" cy="14" r="4" fill="#10b981" className="animate-pulse" />
          <text x="26" y="18" fill="#38bdf8" fontSize="10" fontFamily="monospace" fontWeight="bold">
            STAGE {phase + 1}/5: {secondsLeft}s REMAINING
          </text>
        </g>
      </svg>
    </div>
  );
};
