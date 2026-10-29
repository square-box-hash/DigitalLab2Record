import React, { useState } from 'react';
import { Sparkles, Check, ZoomIn } from 'lucide-react';
import { roundTo } from '../../utils/math';

interface ParallelogramSimProps {
  onRecordRow: (row: { p: number; q: number; theta: number }) => void;
  actualWeight: number;
}

export const ParallelogramSim: React.FC<ParallelogramSimProps> = ({
  onRecordRow,
  actualWeight,
}) => {
  const [pForce, setPForce] = useState<number>(100);
  const [qForce, setQForce] = useState<number>(100);
  const [justRecorded, setJustRecorded] = useState(false);

  const W = actualWeight || 150;
  const cosTheta = Math.max(-1, Math.min(1, (W * W - pForce * pForce - qForce * qForce) / (2 * pForce * qForce)));
  const thetaRad = Math.acos(cosTheta);
  const thetaDeg = roundTo((thetaRad * 180) / Math.PI, 1);
  const rTheor = roundTo(Math.sqrt(Math.max(0, pForce * pForce + qForce * qForce + 2 * pForce * qForce * Math.cos(thetaRad))), 1);

  const handleRecord = () => {
    onRecordRow({ p: pForce, q: qForce, theta: thetaDeg });
    setJustRecorded(true);
    setTimeout(() => setJustRecorded(false), 1800);
  };

  const vectorPresets = [
    { label: 'Equal Forces (100, 100)', p: 100, q: 100 },
    { label: 'Asymmetric (120, 100)', p: 120, q: 100 },
    { label: 'High Tension (110, 110)', p: 110, q: 110 },
    { label: 'Right Heavy (90, 130)', p: 90, q: 130 },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-5 sm:p-6 space-y-6 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-2">
        <div>
          <div className="flex items-center space-x-2.5">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              Interactive Gravesand’s Apparatus (Vector Addition)
            </h3>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              R = √(P² + Q² + 2PQ cos θ)
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Adjust tensions P and Q. The junction knot O automatically settles into equilibrium with body W.
          </p>
        </div>
      </div>

      {/* Enlarged Visual Gravesand Apparatus Board (ViewBox 720 x 240) */}
      <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 rounded-2xl p-5 text-white shadow-xl border border-slate-800/80 overflow-hidden select-none">
        <div className="flex flex-wrap justify-between items-center text-xs sm:text-sm text-slate-400 mb-3 gap-2">
          <span className="font-medium text-slate-300 flex items-center gap-1.5">
            <ZoomIn className="w-4 h-4 text-indigo-400" />
            Vertical Drawing Board, Pulleys P₁ & P₂, and Vector Parallelogram
          </span>
          <div className="flex items-center space-x-3 bg-slate-900/80 px-3.5 py-1.5 rounded-xl border border-slate-700">
            <span className="text-slate-400 text-xs">Equilibrium Angle θ:</span>
            <span className="font-mono text-emerald-400 font-extrabold text-base">
              {thetaDeg}°
            </span>
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          <svg viewBox="0 0 720 240" className="w-full min-w-[520px] sm:min-w-[650px] h-64 sm:h-72">
            <defs>
              <linearGradient id="boardGradLg" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#fef3c7" />
                <stop offset="100%" stopColor="#fde68a" />
              </linearGradient>
            </defs>

            {/* Drawing Board */}
            <rect x="110" y="20" width="500" height="190" fill="url(#boardGradLg)" stroke="#b45309" strokeWidth="2.5" rx="5" />
            
            {/* Pulleys P1 and P2 */}
            <circle cx="150" cy="38" r="18" fill="#64748b" stroke="#334155" strokeWidth="2.5" />
            <circle cx="150" cy="38" r="5" fill="#0f172a" />
            <text x="125" y="35" fill="#0284c7" fontSize="13" fontWeight="bold">P₁</text>

            <circle cx="570" cy="38" r="18" fill="#64748b" stroke="#334155" strokeWidth="2.5" />
            <circle cx="570" cy="38" r="5" fill="#0f172a" />
            <text x="592" y="35" fill="#0284c7" fontSize="13" fontWeight="bold">P₂</text>

            {/* Central Knot O & Strings */}
            {(() => {
              const knotX = 360;
              const knotY = 125;
              const halfThetaRad = (thetaDeg * Math.PI) / 360;
              const scale = 0.55;
              const lenP = pForce * scale;
              const lenQ = qForce * scale;

              const pEndX = knotX - lenP * Math.sin(halfThetaRad);
              const pEndY = knotY - lenP * Math.cos(halfThetaRad);

              const qEndX = knotX + lenQ * Math.sin(halfThetaRad);
              const qEndY = knotY - lenQ * Math.cos(halfThetaRad);

              const cX = knotX;
              const cY = knotY - (lenP + lenQ) * Math.cos(halfThetaRad) * 0.9;

              return (
                <g>
                  {/* String to Pulley 1 */}
                  <line x1={knotX} y1={knotY} x2="150" y2="38" stroke="#475569" strokeWidth="2" />
                  {/* Left Hanger */}
                  <line x1="132" y1="38" x2="132" y2="185" stroke="#475569" strokeWidth="1.5" />
                  <rect x="118" y="185" width="28" height="30" fill="#38bdf8" stroke="#0284c7" strokeWidth="1.5" rx="3" />
                  <text x="132" y="204" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">
                    {pForce}gf
                  </text>

                  {/* String to Pulley 2 */}
                  <line x1={knotX} y1={knotY} x2="570" y2="38" stroke="#475569" strokeWidth="2" />
                  {/* Right Hanger */}
                  <line x1="588" y1="38" x2="588" y2="185" stroke="#475569" strokeWidth="1.5" />
                  <rect x="574" y="185" width="28" height="30" fill="#38bdf8" stroke="#0284c7" strokeWidth="1.5" rx="3" />
                  <text x="588" y="204" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">
                    {qForce}gf
                  </text>

                  {/* Vertical String to Body W */}
                  <line x1={knotX} y1={knotY} x2={knotX} y2="195" stroke="#475569" strokeWidth="2" />
                  <rect x={knotX - 22} y="195" width="44" height="36" fill="#a855f7" stroke="#7e22ce" strokeWidth="2" rx="4" />
                  <text x={knotX} y="218" fill="#ffffff" fontSize="12" fontWeight="extrabold" textAnchor="middle">
                    W ({W}gf)
                  </text>

                  {/* Parallelogram OACB */}
                  <polygon
                    points={`${knotX},${knotY} ${pEndX},${pEndY} ${cX},${cY} ${qEndX},${qEndY}`}
                    fill="#3b82f6"
                    fillOpacity="0.25"
                    stroke="#2563eb"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                  />

                  {/* Vector P (OA) */}
                  <line x1={knotX} y1={knotY} x2={pEndX} y2={pEndY} stroke="#dc2626" strokeWidth="3" />
                  <text x={pEndX - 10} y={pEndY - 6} fill="#991b1b" fontSize="12" fontWeight="extrabold">P</text>

                  {/* Vector Q (OB) */}
                  <line x1={knotX} y1={knotY} x2={qEndX} y2={qEndY} stroke="#dc2626" strokeWidth="3" />
                  <text x={qEndX + 6} y={qEndY - 6} fill="#991b1b" fontSize="12" fontWeight="extrabold">Q</text>

                  {/* Resultant Vector R (OC) */}
                  <line x1={knotX} y1={knotY} x2={cX} y2={cY} stroke="#059669" strokeWidth="3.5" />
                  <polygon points={`${cX},${cY} ${cX - 4},${cY + 8} ${cX + 4},${cY + 8}`} fill="#059669" />
                  <text x={cX + 8} y={cY + 14} fill="#065f46" fontSize="11" fontWeight="extrabold">R (Resultant)</text>

                  {/* Knot O */}
                  <circle cx={knotX} cy={knotY} r="5" fill="#ef4444" stroke="#ffffff" strokeWidth="2" />
                  <text x={knotX + 8} y={knotY + 16} fill="#78350f" fontSize="11" fontWeight="bold">O</text>
                </g>
              );
            })()}
          </svg>
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-center">
        <div className="space-y-2.5 md:col-span-1">
          <div>
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="font-bold text-slate-700 dark:text-slate-300">Tension Force P:</span>
              <strong className="text-indigo-600 dark:text-indigo-400 font-mono text-base">{pForce} gf</strong>
            </div>
            <input
              type="range"
              min="80"
              max="150"
              step="5"
              value={pForce}
              onChange={(e) => setPForce(parseInt(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer h-2 bg-slate-200 dark:bg-slate-700 rounded-lg"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="font-bold text-slate-700 dark:text-slate-300">Tension Force Q:</span>
              <strong className="text-indigo-600 dark:text-indigo-400 font-mono text-base">{qForce} gf</strong>
            </div>
            <input
              type="range"
              min="80"
              max="150"
              step="5"
              value={qForce}
              onChange={(e) => setQForce(parseInt(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer h-2 bg-slate-200 dark:bg-slate-700 rounded-lg"
            />
          </div>

          <div className="flex flex-wrap gap-1.5">
            {vectorPresets.map((pr) => (
              <button
                key={pr.label}
                onClick={() => {
                  setPForce(pr.p);
                  setQForce(pr.q);
                }}
                className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-slate-700 hover:text-indigo-700 dark:hover:text-indigo-300 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 font-medium transition-colors"
              >
                {pr.label}
              </button>
            ))}
          </div>
        </div>

        {/* Live Vector Calculations */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 text-xs sm:text-sm space-y-1.5 font-mono md:col-span-1 shadow-2xs">
          <div className="flex justify-between text-slate-600 dark:text-slate-400">
            <span>Equilibrium Angle θ:</span>
            <strong className="text-rose-600 dark:text-rose-400 font-bold">{thetaDeg}°</strong>
          </div>
          <div className="flex justify-between text-slate-600 dark:text-slate-400">
            <span>Resultant R = √(P²+Q²+2PQ cosθ):</span>
            <strong className="text-emerald-700 dark:text-emerald-400 font-bold">{rTheor} gf</strong>
          </div>
          <div className="flex justify-between text-slate-600 dark:text-slate-400">
            <span>Actual Body Weight W:</span>
            <span className="text-slate-900 dark:text-white font-semibold">{W} gf</span>
          </div>
          <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between font-bold text-slate-900 dark:text-white">
            <span>Discrepancy |R - W|:</span>
            <span className="text-indigo-600 dark:text-indigo-400">{roundTo(Math.abs(rTheor - W), 1)} gf ({(Math.abs(rTheor - W) / W * 100).toFixed(1)}%)</span>
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
                <span>Log Force Row to Table</span>
              </>
            )}
          </button>
          <span className="text-[11px] text-center text-slate-400 dark:text-slate-500 mt-1.5 font-mono">
            Logs P = {pForce} gf, Q = {qForce} gf, θ = {thetaDeg}°
          </span>
        </div>
      </div>
    </div>
  );
};
