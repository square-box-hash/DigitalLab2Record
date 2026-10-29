import React, { useState } from 'react';
import { Sparkles, Check, Power, ZoomIn } from 'lucide-react';
import { roundTo } from '../../utils/math';

interface BeamBalanceSimProps {
  onRecordRow: (row: {
    gramWeights: number;
    mgWeights: number;
    l1: number;
    l2: number;
    r1: number;
    r2: number;
  }) => void;
  zeroRestingPoint: number;
}

/** Pointer deflection in scale divisions per milligram of imbalance. */
const SENSITIVITY_DIV_PER_MG = 0.02;
const MAX_DEFLECTION_DIV = 6;

export const BeamBalanceSim: React.FC<BeamBalanceSimProps> = ({
  onRecordRow,
  zeroRestingPoint,
}) => {
  // The unknown body is generated once per session and never displayed: the whole
  // point of the practical is that its mass is found from the deflection readings.
  const [targetMassG] = useState<number>(() => roundTo(20 + Math.random() * 8, 3));
  // Slots (indices into the weight box) so two identical 2 g weights toggle independently.
  const [gramSlots, setGramSlots] = useState<number[]>([]);
  const [mgSlots, setMgSlots] = useState<number[]>([]);
  const [isArrested, setIsArrested] = useState<boolean>(false);
  const [justRecorded, setJustRecorded] = useState(false);
  const [warning, setWarning] = useState<string | null>(null);

  const availableGrams = [20, 10, 5, 2, 2, 1];
  const availableMgs = [500, 200, 100, 50, 20, 10, 5];

  const gramWeights = gramSlots.map((slot) => availableGrams[slot]);
  const mgWeights = mgSlots.map((slot) => availableMgs[slot]);

  const totalGramsInPan = gramWeights.reduce((a, b) => a + b, 0);
  const totalMgsInPan = mgWeights.reduce((a, b) => a + b, 0);
  const totalRightMass = roundTo(totalGramsInPan + totalMgsInPan / 1000, 3);

  // Deflection of the pointer about the zero resting point (positive = right pan heavier).
  const imbalanceMg = roundTo((totalRightMass - targetMassG) * 1000, 1);
  const deflectionDiv = isArrested
    ? 0
    : roundTo(
        Math.max(-MAX_DEFLECTION_DIV, Math.min(MAX_DEFLECTION_DIV, imbalanceMg * SENSITIVITY_DIV_PER_MG)),
        1
      );
  const tiltDeg = Math.max(-12, Math.min(12, deflectionDiv * 2));
  const pointerPos = roundTo(zeroRestingPoint + deflectionDiv, 1);

  // Turning points read off the swinging pointer; they average back to pointerPos.
  const leftTurnL1 = roundTo(pointerPos - 0.3, 1);
  const leftTurnL2 = roundTo(pointerPos + 0.3, 1);
  const rightTurnR1 = roundTo(pointerPos + 0.2, 1);
  const rightTurnR2 = roundTo(pointerPos - 0.2, 1);

  const toggleSlot = (
    slot: number,
    setSlots: React.Dispatch<React.SetStateAction<number[]>>
  ) => {
    if (isArrested) {
      setWarning('Arrest the balance (turn the knob OFF) before adding or removing weights.');
      return;
    }
    setWarning(null);
    setSlots((prev) => (prev.includes(slot) ? prev.filter((i) => i !== slot) : [...prev, slot]));
  };

  const clearRightPan = () => {
    setGramSlots([]);
    setMgSlots([]);
    setWarning(null);
  };

  const handleRecord = () => {
    if (isArrested) {
      setWarning('Release the beam (knob ON) and let it swing before recording the turning points.');
      return;
    }
    if (totalGramsInPan + totalMgsInPan === 0) {
      setWarning('Place some standard weights in the right pan first.');
      return;
    }
    setWarning(null);
    onRecordRow({
      gramWeights: totalGramsInPan,
      mgWeights: totalMgsInPan,
      l1: leftTurnL1,
      l2: leftTurnL2,
      r1: rightTurnR1,
      r2: rightTurnR2,
    });
    setJustRecorded(true);
    setTimeout(() => setJustRecorded(false), 1800);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-5 sm:p-6 space-y-6 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-3">
        <div>
          <div className="flex items-center space-x-2.5">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              Interactive Physical Beam Balance Simulator
            </h3>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              Method of Swings & Agate Knife-Edges
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Unknown body in left pan. Add weights in right pan. Turn Arrest Knob to test horizontal equilibrium.
          </p>
        </div>

        <button
          onClick={() => setIsArrested(!isArrested)}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-md self-start sm:self-auto ${
            isArrested
              ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-200 dark:shadow-none'
              : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200 dark:shadow-none'
          }`}
        >
          <Power className="w-4 h-4" />
          <span>Arrest Knob: {isArrested ? 'ARRESTED (OFF)' : 'RELEASED (ON)'}</span>
        </button>
      </div>

      {/* Enlarged Visual Balance Screen (ViewBox 720 x 240) */}
      <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 rounded-2xl p-5 text-white shadow-xl border border-slate-800/80 overflow-hidden select-none">
        <div className="flex flex-wrap justify-between items-center text-xs sm:text-sm text-slate-400 mb-3 gap-2">
          <span className="font-medium text-slate-300 flex items-center gap-1.5">
            <ZoomIn className="w-4 h-4 text-indigo-400" />
            Left Pan: Unknown Body (mass to be determined)
          </span>
          <div className="flex items-center space-x-3 bg-slate-900/80 px-3.5 py-1.5 rounded-xl border border-slate-700">
            <span className="text-slate-400 text-xs">Right Pan:</span>
            <span className="font-mono text-emerald-400 font-extrabold text-base">
              {totalRightMass.toFixed(3)} g
            </span>
            <span className="text-slate-400 text-xs font-mono">
              pointer {deflectionDiv === 0 ? 'at 0' : deflectionDiv > 0 ? 'right of 0' : 'left of 0'}
            </span>
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          <svg viewBox="0 0 720 240" className="w-full min-w-[650px] h-64 sm:h-72">
            <defs>
              <linearGradient id="beamMetalLg" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#cbd5e1" />
                <stop offset="50%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#94a3b8" />
              </linearGradient>
            </defs>

            {/* Central Pillar V */}
            <rect x="350" y="55" width="20" height="155" fill="#475569" stroke="#334155" strokeWidth="1.5" rx="3" />
            {/* Wooden Baseboard W */}
            <rect x="180" y="210" width="360" height="18" fill="#78350f" stroke="#451a03" strokeWidth="2" rx="4" />
            {/* Levelling screws */}
            <rect x="210" y="228" width="26" height="8" fill="#94a3b8" rx="2" />
            <rect x="484" y="228" width="26" height="8" fill="#94a3b8" rx="2" />

            {/* Central Pointer Scale G at foot of pillar */}
            <rect x="330" y="172" width="60" height="24" fill="#f8fafc" stroke="#334155" strokeWidth="1.5" rx="2" />
            {[-4, -2, 0, 2, 4].map((div, i) => (
              <line key={i} x1={338 + i * 11} y1="172" x2={338 + i * 11} y2="182" stroke="#0f172a" strokeWidth={1.2} />
            ))}
            <text x="360" y="191" fill="#ef4444" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
              0
            </text>

            {/* Tilting Beam & Pans Group */}
            <g transform={`rotate(${tiltDeg}, 360, 52)`}>
              {/* Main Horizontal Beam B */}
              <rect x="130" y="46" width="460" height="14" fill="url(#beamMetalLg)" stroke="#475569" strokeWidth="1.5" rx="3" />
              
              {/* Central Agate Knife-Edge E */}
              <polygon points="354,58 366,58 360,52" fill="#ca8a04" />

              {/* Long Pointer P swinging down to Scale G */}
              <line x1="360" y1="52" x2="360" y2="176" stroke="#ef4444" strokeWidth="2.5" />
              <polygon points="357,176 363,176 360,182" fill="#ef4444" />

              {/* Left Stirrup S1 & Pan P1 */}
              <g transform={`rotate(${-tiltDeg}, 150, 52)`}>
                <line x1="150" y1="52" x2="120" y2="140" stroke="#cbd5e1" strokeWidth="1.8" />
                <line x1="150" y1="52" x2="180" y2="140" stroke="#cbd5e1" strokeWidth="1.8" />
                {/* Left Pan */}
                <path d="M 110 140 Q 150 160 190 140 Z" fill="#94a3b8" stroke="#475569" strokeWidth="2" />
                
                {/* Unknown Object in Left Pan */}
                <rect x="135" y="118" width="30" height="28" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="2" rx="4" />
                <text x="150" y="136" fill="#ffffff" fontSize="12" fontWeight="extrabold" textAnchor="middle">
                  M
                </text>
              </g>

              {/* Right Stirrup S2 & Pan P2 */}
              <g transform={`rotate(${-tiltDeg}, 570, 52)`}>
                <line x1="570" y1="52" x2="540" y2="140" stroke="#cbd5e1" strokeWidth="1.8" />
                <line x1="570" y1="52" x2="600" y2="140" stroke="#cbd5e1" strokeWidth="1.8" />
                {/* Right Pan */}
                <path d="M 530 140 Q 570 160 610 140 Z" fill="#94a3b8" stroke="#475569" strokeWidth="2" />

                {/* Weights stacked in Right Pan */}
                {gramWeights.map((w, idx) => (
                  <rect
                    key={idx}
                    x={546 + (idx % 3) * 15}
                    y={128 - Math.floor(idx / 3) * 11}
                    width="14"
                    height="16"
                    fill="#eab308"
                    stroke="#a16207"
                    strokeWidth="1.2"
                    rx="2"
                  />
                ))}
                {mgWeights.map((w, idx) => (
                  <circle
                    key={idx}
                    cx={560 + (idx % 4) * 8}
                    cy={143 - Math.floor(idx / 4) * 6}
                    r="3.5"
                    fill="#e2e8f0"
                    stroke="#94a3b8"
                    strokeWidth="1"
                  />
                ))}
              </g>
            </g>
          </svg>
        </div>
      </div>

      {/* Weight Box Tray */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
            Standard Weight Box (Click to toggle weights into Right Pan):
          </span>
          <div className="flex items-center space-x-3">
            <button
              onClick={clearRightPan}
              className="text-xs text-slate-500 hover:text-rose-600 hover:underline"
            >
              Clear Pan
            </button>
          </div>
        </div>

        {/* Gram Weights Buttons */}
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs font-semibold text-slate-500 w-16">Brass (g):</span>
          {availableGrams.map((w, idx) => {
            const inPan = gramSlots.includes(idx);
            return (
              <button
                key={`gram-${idx}`}
                onClick={() => toggleSlot(idx, setGramSlots)}
                className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-mono font-bold transition-all border ${
                  inPan
                    ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                    : 'bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 border-amber-200 dark:border-amber-800 hover:bg-amber-100'
                }`}
              >
                {w}g {inPan ? '✓' : '+'}
              </button>
            );
          })}
        </div>

        {/* Milligram Fractional Weights */}
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs font-semibold text-slate-500 w-16">Al (mg):</span>
          {availableMgs.map((w, idx) => {
            const inPan = mgSlots.includes(idx);
            return (
              <button
                key={`mg-${idx}`}
                onClick={() => toggleSlot(idx, setMgSlots)}
                className={`px-3 py-1 rounded-xl text-xs font-mono font-semibold transition-all border ${
                  inPan
                    ? 'bg-indigo-600 text-white border-indigo-700 shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
                }`}
              >
                {w}mg {inPan ? '✓' : '+'}
              </button>
            );
          })}
        </div>
      </div>

      {/* Summary Footer */}
      {warning && (
        <div className="px-4 py-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs font-medium text-amber-800 dark:text-amber-200">
          {warning}
        </div>
      )}
      <div className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs sm:text-sm space-y-1 w-full sm:w-auto font-mono">
          <div className="flex items-center space-x-2">
            <span className="text-slate-500 dark:text-slate-400">Total Standard Mass in Pan:</span>
            <strong className="text-slate-900 dark:text-white text-base">{totalRightMass.toFixed(3)} g</strong>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-slate-500 dark:text-slate-400">Pointer:</span>
            {isArrested ? (
              <span className="text-slate-500 dark:text-slate-400 font-medium font-sans">
                Beam arrested — release the knob to read the deflection
              </span>
            ) : Math.abs(deflectionDiv) < 0.05 ? (
              <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 font-sans">
                <Check className="w-4 h-4" /> Resting on the zero mark
              </span>
            ) : deflectionDiv > 0 ? (
              <span className="text-amber-600 dark:text-amber-400 font-medium font-sans">
                Resting right of zero — right pan is heavier
              </span>
            ) : (
              <span className="text-rose-600 dark:text-rose-400 font-medium font-sans">
                Resting left of zero — right pan is lighter
              </span>
            )}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-sans">
            Record one reading below and one above the unknown mass, then interpolate.
          </div>
        </div>

        <button
          onClick={handleRecord}
          className={`py-3 px-5 rounded-xl text-xs sm:text-sm font-bold flex items-center space-x-2 transition-all shrink-0 shadow-md ${
            justRecorded
              ? 'bg-emerald-600 text-white shadow-emerald-200'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200 dark:shadow-none'
          }`}
        >
          {justRecorded ? (
            <>
              <Check className="w-4 h-4" />
              <span>Transferred to Table!</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Record Mass to Table</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
