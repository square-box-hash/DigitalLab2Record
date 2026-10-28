import React, { useState } from 'react';
import { Sparkles, Check, ZoomIn } from 'lucide-react';
import { roundTo } from '../../utils/math';

interface SpherometerSimProps {
  onRecordRow: (row: { h1_psr: number; h1_csr: number; h2_psr: number; h2_csr: number }) => void;
  pitch: number;
  divisions: number;
  legDistance: number;
}

export const SpherometerSim: React.FC<SpherometerSimProps> = ({
  onRecordRow,
  pitch,
  divisions,
  legDistance,
}) => {
  const [surfaceType, setSurfaceType] = useState<'curved' | 'plane'>('curved');
  const [h1Mm, setH1Mm] = useState<number>(2.45);
  const [h2Mm, setH2Mm] = useState<number>(2.12);
  const [justRecorded, setJustRecorded] = useState(false);

  const lc = (pitch || 1.0) / (divisions || 100);
  const currentMm = surfaceType === 'curved' ? h1Mm : h2Mm;
  const currentPsr = Math.floor(currentMm / pitch) * pitch;
  const currentCsr = Math.round((currentMm - currentPsr) / lc);

  const sagittaMm = roundTo(Math.abs(h1Mm - h2Mm), 2);
  const sagittaCm = roundTo(sagittaMm / 10, 3);
  const R_cm = sagittaCm > 0 ? roundTo((legDistance * legDistance) / (6 * sagittaCm) + sagittaCm / 2, 2) : 0;

  const handleRecord = () => {
    const h1_psr = Math.floor(h1Mm / pitch) * pitch;
    const h1_csr = Math.round((h1Mm - h1_psr) / lc);
    const h2_psr = Math.floor(h2Mm / pitch) * pitch;
    const h2_csr = Math.round((h2Mm - h2_psr) / lc);

    onRecordRow({ h1_psr, h1_csr, h2_psr, h2_csr });
    setJustRecorded(true);
    setTimeout(() => setJustRecorded(false), 1800);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-5 sm:p-6 space-y-6 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-2">
        <div>
          <div className="flex items-center space-x-2.5">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              Interactive Spherometer & Sagitta Simulator
            </h3>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              LC = {lc.toFixed(2)} mm (0.001 cm)
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Turn central screw disc until tip gently touches surface. Determine sagitta h = |h₁ - h₂|.
          </p>
        </div>

        {/* Surface Toggle */}
        <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl text-xs font-medium self-start sm:self-auto border border-slate-200/50 dark:border-slate-700">
          <button
            onClick={() => setSurfaceType('curved')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              surfaceType === 'curved'
                ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Curved Surface (h₁)
          </button>
          <button
            onClick={() => setSurfaceType('plane')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              surfaceType === 'plane'
                ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Plane Glass Plate (h₂)
          </button>
        </div>
      </div>

      {/* Enlarged Visual Spherometer (ViewBox 720 x 230) */}
      <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 rounded-2xl p-5 text-white shadow-xl border border-slate-800/80 overflow-hidden select-none">
        <div className="flex flex-wrap justify-between items-center text-xs sm:text-sm text-slate-400 mb-3 gap-2">
          <span className="font-medium text-slate-300 flex items-center gap-1.5">
            <ZoomIn className="w-4 h-4 text-indigo-400" />
            Triangular Spherometer Base & Circular Head Disc
          </span>
          <div className="flex items-center space-x-3 bg-slate-900/80 px-3.5 py-1.5 rounded-xl border border-slate-700">
            <span className="text-slate-400 text-xs">Active Surface:</span>
            <span className="font-mono text-emerald-400 font-extrabold text-base">
              {surfaceType === 'curved' ? `h₁ = ${h1Mm.toFixed(2)} mm` : `h₂ = ${h2Mm.toFixed(2)} mm`}
            </span>
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          <svg viewBox="0 0 720 230" className="w-full min-w-[650px] h-60 sm:h-68">
            <defs>
              <linearGradient id="brassGradLg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="50%" stopColor="#eab308" />
                <stop offset="100%" stopColor="#ca8a04" />
              </linearGradient>
            </defs>

            {/* Base Surface */}
            {surfaceType === 'curved' ? (
              <path
                d="M 100 200 Q 360 165 620 200 L 620 220 L 100 220 Z"
                fill="#38bdf8"
                fillOpacity="0.4"
                stroke="#0284c7"
                strokeWidth="2.5"
              />
            ) : (
              <rect x="100" y="195" width="520" height="25" fill="#e2e8f0" fillOpacity="0.6" stroke="#94a3b8" strokeWidth="2.5" />
            )}

            {/* Outer Spherometer Fixed Legs (A, B) */}
            <path d="M 230 95 L 230 194 L 238 196 L 238 95 Z" fill="url(#brassGradLg)" stroke="#a16207" strokeWidth="1.5" />
            <path d="M 482 95 L 482 194 L 490 196 L 490 95 Z" fill="url(#brassGradLg)" stroke="#a16207" strokeWidth="1.5" />
            
            {/* Horizontal Triangular Crossbar */}
            <rect x="195" y="88" width="330" height="20" fill="url(#brassGradLg)" stroke="#a16207" strokeWidth="2" rx="4" />

            {/* Vertical Pitch Scale P attached to frame */}
            <rect x="300" y="25" width="22" height="75" fill="#f8fafc" stroke="#475569" strokeWidth="1.5" rx="2" />
            {[-3, -2, -1, 0, 1, 2, 3].map((val, idx) => (
              <g key={idx}>
                <line x1="300" y1={35 + idx * 10} x2="312" y2={35 + idx * 10} stroke="#0f172a" strokeWidth={1.5} />
                <text x="315" y={39 + idx * 10} fill="#0f172a" fontSize="10" fontWeight="bold" fontFamily="monospace">
                  {val}
                </text>
              </g>
            ))}

            {/* Central Screw Assembly */}
            {(() => {
              const tipY = surfaceType === 'curved' ? 183 : 195;
              const screwTopY = tipY - 145;
              return (
                <g>
                  {/* Central Screw Shaft */}
                  <rect x="350" y={screwTopY + 25} width="20" height="120" fill="#94a3b8" stroke="#475569" strokeWidth="1.5" />
                  {/* Conical pointed tip */}
                  <polygon points={`350,${tipY - 8} 370,${tipY - 8} 360,${tipY}`} fill="#334155" stroke="#1e293b" />

                  {/* Circular Head Disc D */}
                  <ellipse cx="360" cy={screwTopY + 25} rx="88" ry="16" fill="url(#brassGradLg)" stroke="#a16207" strokeWidth="2" />
                  
                  {/* Disc Graduations */}
                  {Array.from({ length: 15 }).map((_, dIdx) => {
                    const angle = (dIdx - 7) * 10;
                    const markX = 360 + angle * 7.5;
                    const isCoincide = dIdx === 7;
                    return (
                      <line
                        key={dIdx}
                        x1={markX}
                        y1={screwTopY + 15}
                        x2={markX}
                        y2={screwTopY + 29}
                        stroke={isCoincide ? '#ef4444' : '#78350f'}
                        strokeWidth={isCoincide ? 3 : 1.5}
                      />
                    );
                  })}
                  
                  {/* Knurled Top Handle */}
                  <rect x="352" y={screwTopY - 4} width="16" height="20" fill="url(#brassGradLg)" stroke="#a16207" rx="2" />
                </g>
              );
            })()}

            {/* Triangle Leg Prick Distance Annotation */}
            <line x1="234" y1="212" x2="486" y2="212" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="4 4" />
            <text x="360" y="222" fill="#38bdf8" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
              Mean Leg Spacing l = {legDistance} cm
            </text>
          </svg>
        </div>
      </div>

      {/* Controls & Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-center">
        <div className="space-y-2 md:col-span-1">
          <div className="flex justify-between items-center text-xs sm:text-sm">
            <span className="font-bold text-slate-700 dark:text-slate-300">
              {surfaceType === 'curved' ? 'Adjust Reading on Curved (h₁):' : 'Adjust Reading on Plane (h₂):'}
            </span>
            <span className="font-mono font-extrabold text-indigo-600 dark:text-indigo-400 text-base">{currentMm.toFixed(2)} mm</span>
          </div>
          <input
            type="range"
            min="1.00"
            max="4.00"
            step="0.01"
            value={surfaceType === 'curved' ? h1Mm : h2Mm}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              if (surfaceType === 'curved') setH1Mm(val);
              else setH2Mm(val);
            }}
            className="w-full accent-indigo-600 cursor-pointer h-2 bg-slate-200 dark:bg-slate-700 rounded-lg"
          />
          <div className="text-xs text-slate-500 dark:text-slate-400 flex justify-between font-mono">
            <span>h₁ = {h1Mm.toFixed(2)} mm</span>
            <span>h₂ = {h2Mm.toFixed(2)} mm</span>
          </div>
        </div>

        {/* Live Sagitta & Radius */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 text-xs sm:text-sm space-y-1.5 font-mono md:col-span-1 shadow-2xs">
          <div className="flex justify-between text-slate-600 dark:text-slate-400">
            <span>Current Scale:</span>
            <strong className="text-slate-900 dark:text-white font-bold">{currentPsr} mm + {currentCsr} div</strong>
          </div>
          <div className="flex justify-between text-slate-600 dark:text-slate-400">
            <span>Sagitta h = |h₁ - h₂|:</span>
            <strong className="text-emerald-700 dark:text-emerald-400 font-bold">{sagittaMm.toFixed(2)} mm ({sagittaCm.toFixed(3)} cm)</strong>
          </div>
          <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between font-bold text-slate-900 dark:text-white">
            <span>Radius R = (l²/6h + h/2):</span>
            <span className="text-indigo-600 dark:text-indigo-400 text-base">{R_cm.toFixed(2)} cm</span>
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
                <span>Record Spherometer Row</span>
              </>
            )}
          </button>
          <span className="text-[11px] text-center text-slate-400 dark:text-slate-500 mt-1.5 font-mono">
            Logs h₁ = {h1Mm.toFixed(2)} mm, h₂ = {h2Mm.toFixed(2)} mm
          </span>
        </div>
      </div>
    </div>
  );
};
