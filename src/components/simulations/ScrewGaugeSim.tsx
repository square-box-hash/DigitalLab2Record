import React, { useState } from 'react';
import { Sparkles, Check, RotateCw, ZoomIn } from 'lucide-react';
import { roundTo } from '../../utils/math';

interface ScrewGaugeSimProps {
  onRecordRow: (row: { psr: number; csr: number }) => void;
  pitch: number;
  divisions: number;
  zeroError: number;
}

export const ScrewGaugeSim: React.FC<ScrewGaugeSimProps> = ({
  onRecordRow,
  pitch,
  divisions,
  zeroError,
}) => {
  const [wireDiameterMm, setWireDiameterMm] = useState<number>(0.82);
  const [justRecorded, setJustRecorded] = useState(false);

  const lc = (pitch || 1.0) / (divisions || 100);
  const psr = Math.floor(wireDiameterMm / pitch) * pitch;
  const remainderMm = wireDiameterMm - psr;
  const csr = Math.round(remainderMm / lc);
  const observedReading = roundTo(psr + csr * lc, 2);
  const correctedReading = roundTo(observedReading - zeroError, 2);

  const handleRecord = () => {
    onRecordRow({ psr, csr });
    setJustRecorded(true);
    setTimeout(() => setJustRecorded(false), 1800);
  };

  const wirePresets = [
    { label: 'Thin Copper (30 SWG)', val: 0.31 },
    { label: 'Eureka Wire (24 SWG)', val: 0.56 },
    { label: 'Constantan (22 SWG)', val: 0.71 },
    { label: 'Brass Wire (21 SWG)', val: 0.82 },
    { label: 'Aluminium Sheet', val: 1.24 },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-5 sm:p-6 space-y-6 transition-colors">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-2">
        <div>
          <div className="flex items-center space-x-2.5">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              Interactive Micrometer Screw Gauge Simulator
            </h3>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              LC = {lc.toFixed(2)} mm
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Rotate the thimble to grip the wire between stud A and spindle B. Observe the circular scale division aligning with the baseline.
          </p>
        </div>
      </div>

      {/* Enlarged Visual Screw Gauge (ViewBox 720 x 220) */}
      <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 rounded-2xl p-5 text-white shadow-xl border border-slate-800/80 overflow-hidden select-none">
        <div className="flex flex-wrap justify-between items-center text-xs sm:text-sm text-slate-400 mb-3 gap-2">
          <span className="font-medium text-slate-300 flex items-center gap-1.5">
            <ZoomIn className="w-4 h-4 text-indigo-400" />
            Heavy U-Frame & Micrometer Spindle / Thimble
          </span>
          <div className="flex items-center space-x-3 bg-slate-900/80 px-3.5 py-1.5 rounded-xl border border-slate-700">
            <span className="text-slate-400 text-xs">Observed:</span>
            <span className="font-mono text-emerald-400 font-extrabold text-base">
              {observedReading.toFixed(2)} mm
            </span>
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          <svg viewBox="0 0 720 220" className="w-full min-w-[520px] sm:min-w-[650px] h-56 sm:h-64">
            <defs>
              <linearGradient id="frameGradLg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#334155" />
                <stop offset="50%" stopColor="#1e293b" />
                <stop offset="100%" stopColor="#0f172a" />
              </linearGradient>
              <linearGradient id="steelGradLg" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="50%" stopColor="#cbd5e1" />
                <stop offset="100%" stopColor="#94a3b8" />
              </linearGradient>
              <filter id="screwShadow" x="-10%" y="-10%" width="120%" height="120%">
                <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000" floodOpacity="0.4" />
              </filter>
            </defs>

            {/* Heavy Cast-Iron U-Frame */}
            <path
              d="M 130 50 L 60 50 Q 25 50 25 105 Q 25 185 130 185 Q 235 185 235 105 L 235 50 L 190 50 Q 190 150 130 150 Q 70 150 70 105 Q 70 70 130 70 Z"
              fill="url(#frameGradLg)"
              stroke="#64748b"
              strokeWidth="2.5"
              filter="url(#screwShadow)"
            />
            <text x="130" y="125" fill="#cbd5e1" fontSize="11" fontWeight="extrabold" textAnchor="middle" fontFamily="sans-serif">
              CBSE CLASS XI
            </text>

            {/* Fixed Stud A */}
            <rect x="120" y="80" width="16" height="28" fill="url(#steelGradLg)" stroke="#475569" strokeWidth="1.5" />
            <text x="128" y="74" fill="#94a3b8" fontSize="12" fontWeight="bold" textAnchor="middle">A</text>

            {/* Specimen Wire between Stud A and Spindle B */}
            <rect
              x="136"
              y="75"
              width={Math.max(4, wireDiameterMm * 18)}
              height="38"
              fill="#fbbf24"
              stroke="#d97706"
              strokeWidth="2"
              rx="2"
            />

            {/* Movable Spindle B */}
            {(() => {
              const spindleX = 136 + wireDiameterMm * 18;
              return (
                <g>
                  <rect x={spindleX} y="80" width={255 - spindleX} height="28" fill="url(#steelGradLg)" stroke="#475569" strokeWidth="1.5" />
                  <text x={spindleX + 8} y="74" fill="#94a3b8" fontSize="12" fontWeight="bold" textAnchor="middle">B</text>

                  {/* Main Sleeve (Barrel Scale) */}
                  <rect x="255" y="74" width="145" height="40" fill="url(#steelGradLg)" stroke="#475569" strokeWidth="2" filter="url(#screwShadow)" />
                  
                  {/* Linear Reference Datum Line */}
                  <line x1="255" y1="94" x2="390" y2="94" stroke="#0f172a" strokeWidth="2" />

                  {/* Pitch Scale Markings (0 to 10 mm) */}
                  {Array.from({ length: 11 }).map((_, mm) => {
                    const xMark = 265 + mm * 11;
                    return (
                      <g key={mm}>
                        <line x1={xMark} y1="80" x2={xMark} y2="94" stroke="#0f172a" strokeWidth={1.5} />
                        {mm % 2 === 0 && (
                          <text x={xMark} y="77" fontSize="11" fill="#0f172a" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                            {mm}
                          </text>
                        )}
                        {/* 0.5 mm line below datum */}
                        {mm < 10 && (
                          <line x1={xMark + 5.5} y1="94" x2={xMark + 5.5} y2="105" stroke="#0f172a" strokeWidth={1.2} />
                        )}
                      </g>
                    );
                  })}
                  <text x="390" y="87" fill="#0f172a" fontSize="10" fontWeight="bold" fontFamily="monospace">
                    mm
                  </text>

                  {/* Circular Thimble & Ratchet Head */}
                  {(() => {
                    const thimbleX = 275 + wireDiameterMm * 18;
                    return (
                      <g transform={`translate(${thimbleX - 275}, 0)`} filter="url(#screwShadow)">
                        {/* Beveled edge */}
                        <polygon
                          points="275,66 295,62 295,126 275,122"
                          fill="#38bdf8"
                          stroke="#0284c7"
                          strokeWidth="1.5"
                        />
                        {/* Circular thimble body */}
                        <rect x="295" y="62" width="115" height="64" fill="#0284c7" stroke="#0369a1" strokeWidth="1.5" rx="3" />
                        
                        {/* Circular Scale Divisions on Bevel (centered on CSR) */}
                        {[-4, -3, -2, -1, 0, 1, 2, 3, 4].map((offset) => {
                          const divVal = (csr + offset + 100) % 100;
                          const yPos = 94 - offset * 5.6;
                          const isAlign = offset === 0;
                          return (
                            <g key={offset}>
                              <line
                                x1="275"
                                y1={yPos}
                                x2={isAlign ? '287' : '282'}
                                stroke={isAlign ? '#ef4444' : '#ffffff'}
                                strokeWidth={isAlign ? 2.5 : 1.3}
                              />
                              <text
                                x="289"
                                y={yPos + 4}
                                fontSize="10"
                                fill={isAlign ? '#ef4444' : '#ffffff'}
                                fontWeight={isAlign ? 'bold' : '600'}
                                fontFamily="monospace"
                              >
                                {divVal}
                              </text>
                            </g>
                          );
                        })}

                        {/* Knurled Ratchet R */}
                        <rect x="410" y="74" width="45" height="40" fill="url(#steelGradLg)" stroke="#475569" strokeWidth="1.5" rx="3" />
                        <line x1="422" y1="74" x2="422" y2="114" stroke="#64748b" strokeDasharray="3 3" />
                        <line x1="434" y1="74" x2="434" y2="114" stroke="#64748b" strokeDasharray="3 3" />
                        <text x="432" y="98" fill="#1e293b" fontSize="12" fontWeight="bold" textAnchor="middle">
                          R
                        </text>
                      </g>
                    );
                  })()}
                </g>
              );
            })()}
          </svg>
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-center">
        <div className="space-y-2 md:col-span-1">
          <div className="flex justify-between items-center text-xs sm:text-sm">
            <span className="font-bold text-slate-700 dark:text-slate-300">Turn Ratchet (Diameter):</span>
            <span className="font-mono font-extrabold text-indigo-600 dark:text-indigo-400 text-base">{wireDiameterMm.toFixed(2)} mm</span>
          </div>
          <input
            type="range"
            min="0.10"
            max="2.50"
            step="0.01"
            value={wireDiameterMm}
            onChange={(e) => setWireDiameterMm(parseFloat(e.target.value))}
            className="w-full accent-indigo-600 cursor-pointer h-2 bg-slate-200 dark:bg-slate-700 rounded-lg"
          />
          <div className="flex flex-wrap gap-1.5 pt-1">
            {wirePresets.map((p) => (
              <button
                key={p.label}
                onClick={() => setWireDiameterMm(p.val)}
                className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-slate-700 hover:text-indigo-700 dark:hover:text-indigo-300 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 font-medium transition-colors"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Live Calculation Card */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 text-xs sm:text-sm space-y-1.5 font-mono md:col-span-1 shadow-2xs">
          <div className="flex justify-between text-slate-600 dark:text-slate-400">
            <span>Pitch Scale (PSR):</span>
            <strong className="text-slate-900 dark:text-white font-bold">{psr} mm</strong>
          </div>
          <div className="flex justify-between text-slate-600 dark:text-slate-400">
            <span>Circular Scale (CSR):</span>
            <strong className="text-rose-600 dark:text-rose-400 font-bold">{csr} div</strong>
          </div>
          <div className="flex justify-between text-slate-600 dark:text-slate-400">
            <span>Observed (PSR + CSR·LC):</span>
            <span className="text-slate-700 dark:text-slate-300">{observedReading.toFixed(2)} mm</span>
          </div>
          <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between font-bold text-slate-900 dark:text-white">
            <span>Corrected Diameter (d):</span>
            <span className="text-indigo-600 dark:text-indigo-400 text-base">{correctedReading.toFixed(2)} mm</span>
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
                <span>Logged to Table!</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Log Reading to Table</span>
              </>
            )}
          </button>
          <span className="text-[11px] text-center text-slate-400 dark:text-slate-500 mt-1.5 font-mono">
            Transfers PSR = {psr} mm, CSR = {csr}
          </span>
        </div>
      </div>
    </div>
  );
};
