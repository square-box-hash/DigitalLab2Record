import React, { useState } from 'react';
import { Sparkles, Check, ZoomIn, AlertTriangle } from 'lucide-react';
import { roundTo } from '../../utils/math';

interface ParallelogramSimProps {
  onRecordRow: (row: { p: number; q: number; theta: number }) => void;
  actualWeight: number;
}

/** Slotted weights available on each hanger, on top of the 50 gf hanger itself. */
const HANGER_GF = 50;
const SLOT_WEIGHTS = [50, 20, 20, 10];

const totalFor = (slots: number[]): number =>
  HANGER_GF + slots.reduce((sum, index) => sum + SLOT_WEIGHTS[index], 0);

/** Greedy decomposition of a target tension into available slots (used by the presets). */
const slotsForTotal = (total: number): number[] => {
  let remaining = Math.max(0, total - HANGER_GF);
  const chosen: number[] = [];
  SLOT_WEIGHTS.forEach((weight, index) => {
    if (remaining >= weight) {
      chosen.push(index);
      remaining -= weight;
    }
  });
  return chosen;
};

/** Total slotted weight one hanger can carry, and how far it travels when fully loaded. */
const MAX_SLOT_GF = SLOT_WEIGHTS.reduce((sum, weight) => sum + weight, 0);
const MAX_DROP = 18;

export const ParallelogramSim: React.FC<ParallelogramSimProps> = ({
  onRecordRow,
  actualWeight,
}) => {
  const [pSlots, setPSlots] = useState<number[]>([0]);
  const [qSlots, setQSlots] = useState<number[]>([0]);
  const [justRecorded, setJustRecorded] = useState(false);

  const pForce = totalFor(pSlots);
  const qForce = totalFor(qSlots);

  const W = actualWeight || 150;
  const cosTheta = Math.max(
    -1,
    Math.min(1, (W * W - pForce * pForce - qForce * qForce) / (2 * pForce * qForce))
  );
  const thetaRad = Math.acos(cosTheta);
  const thetaDeg = roundTo((thetaRad * 180) / Math.PI, 1);
  const rTheor = roundTo(
    Math.sqrt(Math.max(0, pForce * pForce + qForce * qForce + 2 * pForce * qForce * Math.cos(thetaRad))),
    1
  );

  // Equilibrium is only possible when P + Q can carry W and neither side runs away.
  const canEquilibrate = pForce + qForce >= W && Math.abs(pForce - qForce) <= W;

  // Hanger travel: more slotted weight pays more string out, so the hanger sinks.
  const pDrop = roundTo(((pForce - HANGER_GF) / MAX_SLOT_GF) * MAX_DROP, 1);
  const qDrop = roundTo(((qForce - HANGER_GF) / MAX_SLOT_GF) * MAX_DROP, 1);

  const toggleSlot = (
    index: number,
    setSlots: React.Dispatch<React.SetStateAction<number[]>>
  ) => {
    setSlots((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]));
  };

  const handleRecord = () => {
    onRecordRow({ p: pForce, q: qForce, theta: thetaDeg });
    setJustRecorded(true);
    setTimeout(() => setJustRecorded(false), 1800);
  };

  const vectorPresets = [
    { label: 'Equal (100 / 100)', p: 100, q: 100 },
    { label: 'P heavy (130 / 100)', p: 130, q: 100 },
    { label: 'Both heavy (140 / 140)', p: 140, q: 140 },
    { label: 'Right heavy (90 / 130)', p: 90, q: 130 },
  ];

  /** One hanger's weight box: independent slotted weights, toggled one at a time. */
  const renderHangerControls = (
    name: string,
    total: number,
    slots: number[],
    setSlots: React.Dispatch<React.SetStateAction<number[]>>,
    accent: 'indigo' | 'sky'
  ) => (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between">
        <span className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300">
          Hanger {name}
        </span>
        <strong
          className={`font-mono text-base ${
            accent === 'indigo'
              ? 'text-indigo-600 dark:text-indigo-400'
              : 'text-sky-600 dark:text-sky-400'
          }`}
        >
          {total} gf
        </strong>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 w-full sm:w-auto">
          hanger {HANGER_GF} +
        </span>
        {SLOT_WEIGHTS.map((weight, index) => {
          const inPan = slots.includes(index);
          return (
            <button
              key={`${name}-${index}`}
              onClick={() => toggleSlot(index, setSlots)}
              aria-pressed={inPan}
              aria-label={`${inPan ? 'Remove' : 'Add'} ${weight} gf slotted weight on hanger ${name}`}
              className={`h-8 min-w-[46px] px-2 rounded-lg text-xs font-mono font-bold border transition-all active:scale-95 ${
                inPan
                  ? accent === 'indigo'
                    ? 'bg-indigo-600 text-white border-indigo-700 shadow-sm'
                    : 'bg-sky-600 text-white border-sky-700 shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700'
              }`}
            >
              {inPan ? '✓ ' : '+ '}
              {weight}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-5 sm:p-6 space-y-6 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-2">
        <div>
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              Interactive Gravesand’s Apparatus (Vector Addition)
            </h3>
            <span className="shrink-0 whitespace-nowrap text-[11px] sm:text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              R = √(P² + Q² + 2PQ cos θ)
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Add or remove slotted weights on either hanger — each pulley is loaded independently. The
            knot O settles into equilibrium with body W.
          </p>
        </div>
      </div>

      {/* Drawing board */}
      <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 rounded-2xl p-5 text-white shadow-xl border border-slate-800/80 overflow-hidden select-none">
        <div className="flex flex-wrap justify-between items-center text-xs sm:text-sm text-slate-400 mb-3 gap-2">
          <span className="font-medium text-slate-300 flex items-center gap-1.5">
            <ZoomIn className="w-4 h-4 text-indigo-400" />
            Vertical Drawing Board, Pulleys P₁ &amp; P₂, and Vector Parallelogram
          </span>
          <div className="flex items-center space-x-3 bg-slate-900/80 px-3.5 py-1.5 rounded-xl border border-slate-700">
            <span className="text-slate-400 text-xs">Equilibrium Angle θ:</span>
            <span className="font-mono text-emerald-400 font-extrabold text-base">{thetaDeg}°</span>
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

            {/* Drawing board */}
            <rect x="110" y="20" width="500" height="190" fill="url(#boardGradLg)" stroke="#b45309" strokeWidth="2.5" rx="5" />

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

              const hangerTop = 176;
              const hangerHeight = 30;

              // Strings, hangers and the vector construction sit under the pulleys.
              return (
                <g>
                  {/* Diagonal strings from the knot to each pulley */}
                  <line x1={knotX} y1={knotY} x2="150" y2="38" stroke="#475569" strokeWidth="2" />
                  <line x1={knotX} y1={knotY} x2="570" y2="38" stroke="#475569" strokeWidth="2" />

                  {/* Left hanger: the whole group slides as weight is added or removed */}
                  <g
                    style={{
                      transform: `translateY(${pDrop}px)`,
                      transition: 'transform 320ms cubic-bezier(0.22, 1, 0.36, 1)',
                    }}
                  >
                    <line x1="150" y1="38" x2="150" y2={hangerTop} stroke="#475569" strokeWidth="1.5" />
                    <rect
                      x={150 - 16}
                      y={hangerTop}
                      width="32"
                      height={hangerHeight}
                      fill="#38bdf8"
                      stroke="#0284c7"
                      strokeWidth="1.5"
                      rx="3"
                    />
                    <text x="150" y={hangerTop + 19} fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">
                      {pForce}gf
                    </text>
                  </g>

                  {/* Right hanger */}
                  <g
                    style={{
                      transform: `translateY(${qDrop}px)`,
                      transition: 'transform 320ms cubic-bezier(0.22, 1, 0.36, 1)',
                    }}
                  >
                    <line x1="570" y1="38" x2="570" y2={hangerTop} stroke="#475569" strokeWidth="1.5" />
                    <rect
                      x={570 - 16}
                      y={hangerTop}
                      width="32"
                      height={hangerHeight}
                      fill="#38bdf8"
                      stroke="#0284c7"
                      strokeWidth="1.5"
                      rx="3"
                    />
                    <text x="570" y={hangerTop + 19} fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">
                      {qForce}gf
                    </text>
                  </g>

                  {/* Vertical string to body W */}
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

                  {/* Resultant R (OC) */}
                  <line x1={knotX} y1={knotY} x2={cX} y2={cY} stroke="#059669" strokeWidth="3.5" />
                  <polygon points={`${cX},${cY} ${cX - 4},${cY + 8} ${cX + 4},${cY + 8}`} fill="#059669" />
                  <text x={cX + 8} y={cY + 14} fill="#065f46" fontSize="11" fontWeight="extrabold">R (Resultant)</text>

                  {/* Knot O */}
                  <circle cx={knotX} cy={knotY} r="5" fill="#ef4444" stroke="#ffffff" strokeWidth="2" />
                  <text x={knotX + 8} y={knotY + 16} fill="#78350f" fontSize="11" fontWeight="bold">O</text>
                </g>
              );
            })()}

            {/* Pulleys are drawn on top, so the string always meets the wheel cleanly */}
            {[
              { cx: 150, label: 'P₁', labelX: 125, drop: pDrop },
              { cx: 570, label: 'P₂', labelX: 592, drop: qDrop },
            ].map(({ cx, label, labelX, drop }) => (
              <g key={label}>
                <circle cx={cx} cy="38" r="18" fill="#64748b" stroke="#334155" strokeWidth="2.5" />
                {/* Spokes turn as the string pays out or is hauled back in */}
                <g
                  style={{
                    transform: `rotate(${-drop * 5}deg)`,
                    transformOrigin: `${cx}px 38px`,
                    transition: 'transform 380ms ease-out',
                  }}
                >
                  <line x1={cx - 12} y1="38" x2={cx + 12} y2="38" stroke="#334155" strokeWidth="2" />
                  <line x1={cx} y1="26" x2={cx} y2="50" stroke="#334155" strokeWidth="2" />
                </g>
                <circle cx={cx} cy="38" r="5" fill="#0f172a" />
                <text x={labelX} y="35" fill="#0284c7" fontSize="13" fontWeight="bold">
                  {label}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
        <div className="space-y-4 md:col-span-1">
          {renderHangerControls('P₁', pForce, pSlots, setPSlots, 'indigo')}
          {renderHangerControls('P₂', qForce, qSlots, setQSlots, 'sky')}

          <div className="flex flex-wrap gap-1.5 pt-1">
            {vectorPresets.map((preset) => (
              <button
                key={preset.label}
                onClick={() => {
                  setPSlots(slotsForTotal(preset.p));
                  setQSlots(slotsForTotal(preset.q));
                }}
                className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-slate-700 hover:text-indigo-700 dark:hover:text-indigo-300 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 font-medium transition-colors"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Live vector calculations */}
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
            <span>Discrepancy |R − W|:</span>
            <span className="text-indigo-600 dark:text-indigo-400">
              {roundTo(Math.abs(rTheor - W), 1)} gf ({((Math.abs(rTheor - W) / W) * 100).toFixed(1)}%)
            </span>
          </div>

          {!canEquilibrate && (
            <div className="flex items-start gap-1.5 pt-2 border-t border-amber-200 dark:border-amber-800/60 text-[11px] font-sans font-medium text-amber-700 dark:text-amber-400">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span>
                P + Q must be at least W for the knot to hold. Add slotted weights until P + Q ≥ {W} gf.
              </span>
            </div>
          )}
        </div>

        {/* Record button */}
        <div className="md:col-span-1 flex flex-col justify-center">
          <button
            onClick={handleRecord}
            disabled={!canEquilibrate}
            className={`w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center space-x-2 transition-all shadow-md ${
              justRecorded
                ? 'bg-emerald-600 text-white shadow-emerald-200'
                : canEquilibrate
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200 dark:shadow-none'
                  : 'bg-slate-300 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed shadow-none'
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
