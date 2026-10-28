import React, { useState } from 'react';
import { Sparkles, Check, ZoomIn } from 'lucide-react';
import { roundTo } from '../../utils/math';

interface VernierCalipersSimProps {
  onRecordRow: (row: { msr: number; vsr: number }) => void;
  zeroError: number;
}

export const VernierCalipersSim: React.FC<VernierCalipersSimProps> = ({ onRecordRow, zeroError }) => {
  const [mode, setMode] = useState<'diameter' | 'internal' | 'depth'>('diameter');
  const [readingCm, setReadingCm] = useState<number>(2.14);
  const [justRecorded, setJustRecorded] = useState(false);

  const msr = Math.floor(readingCm * 10) / 10;
  const remainderMm = (readingCm - msr) * 10;
  const vsr = Math.round(remainderMm / 0.1);
  const actualReading = roundTo(msr + vsr * 0.01, 2);
  const correctedReading = roundTo(actualReading - zeroError, 2);

  const handleRecord = () => {
    onRecordRow({ msr: roundTo(msr, 1), vsr });
    setJustRecorded(true);
    setTimeout(() => setJustRecorded(false), 1800);
  };

  const presets = [
    { label: 'Cylinder A', val: 2.14 },
    { label: 'Cylinder B', val: 2.15 },
    { label: 'Brass Sphere', val: 1.86 },
    { label: 'Calorimeter', val: 4.32 },
    { label: 'Beaker Depth', val: 5.48 },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-5 sm:p-6 space-y-6 transition-colors">
      {/* Simulation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-3">
        <div>
          <div className="flex items-center space-x-2.5">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              Interactive Vernier Calipers Laboratory Apparatus
            </h3>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              LC = 0.01 cm (0.1 mm)
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Slide the movable jaw or depth gauge. Note the exactly coinciding division in the magnified Vernier window.
          </p>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl text-xs font-medium self-start sm:self-auto border border-slate-200/50 dark:border-slate-700">
          <button
            onClick={() => setMode('diameter')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              mode === 'diameter'
                ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Lower Jaws (Ext. Diameter)
          </button>
          <button
            onClick={() => setMode('internal')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              mode === 'internal'
                ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Upper Jaws (Int. Diameter)
          </button>
          <button
            onClick={() => setMode('depth')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              mode === 'depth'
                ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Depth Gauge Strip
          </button>
        </div>
      </div>

      {/* Enlarged SVG Simulation Screen (+30% bigger with bold legible numbers) */}
      <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 rounded-2xl p-5 text-white shadow-xl border border-slate-800/80 overflow-hidden select-none">
        <div className="flex flex-wrap justify-between items-center text-xs sm:text-sm text-slate-400 mb-3 gap-2">
          <span className="font-medium text-slate-300 flex items-center gap-1.5">
            <ZoomIn className="w-4 h-4 text-indigo-400" />
            {mode === 'depth' ? 'Depth Measurement Strip inside Beaker' : 'Main Scale (cm/mm) & Vernier Scale (10 Divisions)'}
          </span>
          <div className="flex items-center space-x-3 bg-slate-900/80 px-3.5 py-1.5 rounded-xl border border-slate-700">
            <span className="text-slate-400 text-xs">Observed:</span>
            <span className="font-mono text-emerald-400 font-extrabold text-base">
              {actualReading.toFixed(2)} cm
            </span>
          </div>
        </div>

        {/* SVG Drawing - High Res & Large (ViewBox 740 x 230) */}
        <div className="w-full overflow-x-auto">
          <svg viewBox="0 0 740 230" className="w-full min-w-[650px] h-56 sm:h-64">
            <defs>
              <linearGradient id="metalGradLg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f1f5f9" />
                <stop offset="40%" stopColor="#cbd5e1" />
                <stop offset="100%" stopColor="#94a3b8" />
              </linearGradient>
              <linearGradient id="vernierMetalLg" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#e2e8f0" />
              </linearGradient>
              <filter id="shadowGlow" x="-10%" y="-10%" width="120%" height="120%">
                <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000" floodOpacity="0.4" />
              </filter>
            </defs>

            {/* Main Beam (Fixed Scale) */}
            <rect x="50" y="70" width="640" height="55" fill="url(#metalGradLg)" stroke="#475569" strokeWidth="2" rx="3" filter="url(#shadowGlow)" />
            
            {/* Fixed Left Jaws */}
            {mode === 'diameter' && (
              <path d="M 50 70 L 50 195 Q 56 210 70 210 L 80 180 L 80 125 L 50 125 Z" fill="url(#metalGradLg)" stroke="#475569" strokeWidth="2" />
            )}
            {mode === 'internal' && (
              <path d="M 50 70 L 50 15 Q 56 0 70 0 L 80 20 L 80 70 Z" fill="url(#metalGradLg)" stroke="#475569" strokeWidth="2" />
            )}
            {mode === 'depth' && (
              <rect x="50" y="70" width="30" height="55" fill="url(#metalGradLg)" stroke="#475569" strokeWidth="2" />
            )}

            {/* Main Scale Markings (0 to 6 cm, with 1mm marks) */}
            {Array.from({ length: 61 }).map((_, i) => {
              const xPos = 85 + i * 9.5; // 9.5px per mm
              const isCm = i % 10 === 0;
              const isHalf = i % 5 === 0 && !isCm;
              const lineH = isCm ? 25 : isHalf ? 17 : 11;
              return (
                <g key={i}>
                  <line x1={xPos} y1={70} x2={xPos} y2={70 + lineH} stroke="#0f172a" strokeWidth={isCm ? 2 : 1.1} />
                  {isCm && (
                    <text x={xPos} y={70 + lineH + 16} fontSize="13" fill="#0f172a" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                      {i / 10}
                    </text>
                  )}
                </g>
              );
            })}
            <text x="670" y="96" fill="#1e293b" fontSize="13" fontWeight="bold" fontFamily="monospace">
              cm
            </text>

            {/* Specimen Object between jaws or inside beaker */}
            {mode === 'diameter' && (
              <rect
                x="80"
                y="130"
                width={Math.max(6, readingCm * 95 - 2)}
                height="60"
                fill="#38bdf8"
                fillOpacity="0.85"
                stroke="#0284c7"
                strokeWidth="2"
                rx="4"
              />
            )}
            {mode === 'depth' && (
              <g>
                {/* Hollow Beaker */}
                <rect x="500" y="35" width="120" height="160" fill="none" stroke="#38bdf8" strokeWidth="3.5" rx="3" />
                <rect x="505" y="42" width="110" height="150" fill="#38bdf8" fillOpacity="0.25" />
                <text x="560" y="125" fill="#bae6fd" fontSize="11" fontWeight="bold" textAnchor="middle">
                  Beaker Depth
                </text>
                {/* Depth Strip extending inside */}
                <rect x="670" y="92" width={readingCm * 95} height="8" fill="#f59e0b" stroke="#b45309" strokeWidth="1.5" />
              </g>
            )}

            {/* Sliding Vernier Unit */}
            {(() => {
              const sliderX = 85 + readingCm * 95;
              return (
                <g transform={`translate(${sliderX - 85}, 0)`} filter="url(#shadowGlow)">
                  {/* Sliding carriage body */}
                  <rect x="85" y="58" width="115" height="78" fill="url(#vernierMetalLg)" stroke="#2563eb" strokeWidth="2.2" rx="4" />
                  
                  {/* Movable Lower Jaw */}
                  {mode === 'diameter' && (
                    <path d="M 85 125 L 85 180 Q 79 210 65 210 L 65 195 L 75 125 Z" fill="url(#metalGradLg)" stroke="#2563eb" strokeWidth="2" />
                  )}
                  {/* Movable Upper Jaw */}
                  {mode === 'internal' && (
                    <path d="M 85 70 L 85 20 Q 79 0 65 0 L 65 15 L 75 70 Z" fill="url(#metalGradLg)" stroke="#2563eb" strokeWidth="2" />
                  )}

                  {/* Vernier Scale 10 divisions (each division = 0.9 MSD = 8.55px) */}
                  {Array.from({ length: 11 }).map((_, v) => {
                    const vx = 85 + v * 8.55;
                    const isEnd = v === 0 || v === 10;
                    const isMid = v === 5;
                    const vh = isEnd ? 20 : isMid ? 15 : 10;
                    const isCoinciding = v === vsr;
                    return (
                      <g key={v}>
                        <line
                          x1={vx}
                          y1={58}
                          x2={vx}
                          y2={58 + vh}
                          stroke={isCoinciding ? '#ef4444' : '#1e293b'}
                          strokeWidth={isCoinciding ? 3 : 1.3}
                        />
                        {(isEnd || isMid) && (
                          <text x={vx} y={58 + vh + 13} fontSize="11" fill={isCoinciding ? '#ef4444' : '#1e293b'} fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                            {v}
                          </text>
                        )}
                        {/* Red Coincidence Marker Arrow */}
                        {isCoinciding && (
                          <polygon points={`${vx - 4},54 ${vx + 4},54 ${vx},60`} fill="#ef4444" />
                        )}
                      </g>
                    );
                  })}

                  {/* Vernier scale label */}
                  <text x="142" y="112" fontSize="9" fill="#1e40af" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                    VERNIER (LC 0.01cm)
                  </text>
                </g>
              );
            })()}
          </svg>
        </div>
      </div>

      {/* Interactive Controls & Live Readings */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-center">
        {/* Slider & Presets */}
        <div className="space-y-2 md:col-span-1">
          <div className="flex justify-between items-center text-xs sm:text-sm">
            <span className="font-bold text-slate-700 dark:text-slate-300">Adjust Caliper Jaws:</span>
            <span className="font-mono font-extrabold text-indigo-600 dark:text-indigo-400 text-base">{readingCm.toFixed(2)} cm</span>
          </div>
          <input
            type="range"
            min="0.50"
            max="5.50"
            step="0.01"
            value={readingCm}
            onChange={(e) => setReadingCm(parseFloat(e.target.value))}
            className="w-full accent-indigo-600 cursor-pointer h-2 bg-slate-200 dark:bg-slate-700 rounded-lg"
          />
          <div className="flex flex-wrap gap-1.5 pt-1">
            {presets.map((p) => (
              <button
                key={p.label}
                onClick={() => setReadingCm(p.val)}
                className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-slate-700 hover:text-indigo-700 dark:hover:text-indigo-300 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 font-medium transition-colors"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Live Reading Breakdown Card */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 text-xs sm:text-sm space-y-1.5 font-mono md:col-span-1 shadow-2xs">
          <div className="flex justify-between text-slate-600 dark:text-slate-400">
            <span>Main Scale (MSR):</span>
            <strong className="text-slate-900 dark:text-white font-bold">{msr.toFixed(1)} cm</strong>
          </div>
          <div className="flex justify-between text-slate-600 dark:text-slate-400">
            <span>Vernier Coincidence (n):</span>
            <strong className="text-rose-600 dark:text-rose-400 font-bold">{vsr} div</strong>
          </div>
          <div className="flex justify-between text-slate-600 dark:text-slate-400">
            <span>VSR = n × LC:</span>
            <span className="text-slate-700 dark:text-slate-300">{(vsr * 0.01).toFixed(2)} cm</span>
          </div>
          <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between font-bold text-slate-900 dark:text-white">
            <span>Total Measured:</span>
            <span className="text-indigo-600 dark:text-indigo-400 text-base">{actualReading.toFixed(2)} cm</span>
          </div>
        </div>

        {/* Record Button */}
        <div className="md:col-span-1 flex flex-col justify-center">
          <button
            onClick={handleRecord}
            className={`w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center space-x-2 transition-all shadow-md ${
              justRecorded
                ? 'bg-emerald-600 text-white shadow-emerald-200'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200 dark:shadow-none'
            }`}
          >
            {justRecorded ? (
              <>
                <Check className="w-4 h-4" />
                <span>Recorded to Table!</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Record this Observation</span>
              </>
            )}
          </button>
          <span className="text-[11px] text-center text-slate-400 dark:text-slate-500 mt-1.5 font-mono">
            Transfers MSR = {msr.toFixed(1)} cm, VSR = {vsr}
          </span>
        </div>
      </div>
    </div>
  );
};
