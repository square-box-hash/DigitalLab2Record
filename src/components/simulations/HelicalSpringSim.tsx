import React, { useState } from 'react';
import { Sparkles, Check, Plus, Minus, ZoomIn } from 'lucide-react';
import { roundTo } from '../../utils/math';

interface HelicalSpringSimProps {
  onRecordRow: (row: { load: number; readLoading: number; readUnloading: number }) => void;
  initialReading: number;
  g: number;
}

export const HelicalSpringSim: React.FC<HelicalSpringSimProps> = ({
  onRecordRow,
  initialReading,
  g,
}) => {
  const [currentLoadG, setCurrentLoadG] = useState<number>(100);
  const [cycle, setCycle] = useState<'loading' | 'unloading'>('loading');
  const [justRecorded, setJustRecorded] = useState(false);

  const springSensitivity = 0.041; // cm per gram of load
  const x0 = initialReading || 14.5; // cm

  const loadingPointer = roundTo(x0 + currentLoadG * springSensitivity, 1);
  const unloadingPointer = roundTo(loadingPointer + 0.1, 1);
  const currentPointer = cycle === 'loading' ? loadingPointer : unloadingPointer;
  const currentExtension = roundTo(Math.max(0, currentPointer - x0), 2);

  const addWeight = (w: number) => {
    setCurrentLoadG((prev) => Math.min(400, prev + w));
  };

  const removeWeight = (w: number) => {
    setCurrentLoadG((prev) => Math.max(0, prev - w));
  };

  const handleRecord = () => {
    onRecordRow({
      load: currentLoadG,
      readLoading: loadingPointer,
      readUnloading: unloadingPointer,
    });
    setJustRecorded(true);
    setTimeout(() => setJustRecorded(false), 1800);
  };

  const springCoilCount = 15;
  const baseSpringLen = 65;
  const stretchPixels = currentLoadG * 0.45;
  const springHeight = baseSpringLen + stretchPixels;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-5 sm:p-6 space-y-6 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-3">
        <div>
          <div className="flex items-center space-x-2.5">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              Interactive Helical Spring & Hooke’s Law Rig
            </h3>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              Hooke's Law: F = -k·x
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Click weights onto the hanger. Watch the helical coils elongate and pointer move down the vertical scale.
          </p>
        </div>

        {/* Loading / Unloading Cycle Switch */}
        <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl text-xs font-medium self-start sm:self-auto border border-slate-200/50 dark:border-slate-700">
          <button
            onClick={() => setCycle('loading')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              cycle === 'loading'
                ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Loading (Adding Weights)
          </button>
          <button
            onClick={() => setCycle('unloading')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              cycle === 'unloading'
                ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Unloading (Removing)
          </button>
        </div>
      </div>

      {/* Enlarged Visual Spring Stand (ViewBox 720 x 260) */}
      <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 rounded-2xl p-5 text-white shadow-xl border border-slate-800/80 overflow-hidden select-none">
        <div className="flex flex-wrap justify-between items-center text-xs sm:text-sm text-slate-400 mb-3 gap-2">
          <span className="font-medium text-slate-300 flex items-center gap-1.5">
            <ZoomIn className="w-4 h-4 text-indigo-400" />
            Rigid Stand, Helical Coils, Pointer, and Vertical Scale
          </span>
          <div className="flex items-center space-x-3 bg-slate-900/80 px-3.5 py-1.5 rounded-xl border border-slate-700">
            <span className="text-slate-400 text-xs">Total Slotted Load:</span>
            <span className="font-mono text-emerald-400 font-extrabold text-base">
              {currentLoadG} g (+50g hanger)
            </span>
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          <svg viewBox="0 0 720 260" className="w-full min-w-[650px] h-72 sm:h-80">
            <defs>
              <linearGradient id="springMetalLg" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#94a3b8" />
                <stop offset="40%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#64748b" />
              </linearGradient>
            </defs>

            {/* Heavy Stand */}
            <rect x="70" y="235" width="130" height="15" fill="#475569" rx="3" />
            <rect x="125" y="15" width="14" height="225" fill="#64748b" rx="2" />
            <rect x="125" y="15" width="170" height="14" fill="#64748b" rx="2" />
            <line x1="250" y1="28" x2="250" y2="45" stroke="#cbd5e1" strokeWidth="3" />

            {/* Vertical Scale alongside */}
            <g transform="translate(320, 30)">
              <rect x="0" y="0" width="36" height="215" fill="#f8fafc" stroke="#334155" strokeWidth="2" rx="3" />
              <rect x="12" y="6" width="8" height="203" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="0.8" />
              {Array.from({ length: 26 }).map((_, cmIdx) => {
                const yPos = cmIdx * 8;
                const cmNum = 10 + cmIdx;
                return (
                  <g key={cmIdx}>
                    <line x1="0" y1={yPos} x2="12" stroke="#0f172a" strokeWidth={cmIdx % 5 === 0 ? 2 : 1} />
                    {cmIdx % 5 === 0 && (
                      <text x="32" y={yPos + 4} fill="#0f172a" fontSize="10" fontWeight="bold" textAnchor="end" fontFamily="monospace">
                        {cmNum}
                      </text>
                    )}
                  </g>
                );
              })}
            </g>

            {/* Helical Spring Coils */}
            {(() => {
              const startX = 250;
              const startY = 45;
              const stepY = springHeight / springCoilCount;
              const coilRadius = 18;

              let pathD = `M ${startX} ${startY}`;
              for (let i = 0; i < springCoilCount; i++) {
                const y1 = startY + (i + 0.25) * stepY;
                const y2 = startY + (i + 0.75) * stepY;
                const y3 = startY + (i + 1) * stepY;
                pathD += ` C ${startX + coilRadius} ${y1}, ${startX - coilRadius} ${y2}, ${startX} ${y3}`;
              }

              const hangerTopY = startY + springHeight;
              const pointerY = hangerTopY;

              return (
                <g>
                  {/* Coiled spring line */}
                  <path d={pathD} fill="none" stroke="url(#springMetalLg)" strokeWidth="3.8" strokeLinecap="round" />

                  {/* Horizontal Red Pointer pointing to scale */}
                  <line x1={startX} y1={pointerY} x2="320" y2={pointerY} stroke="#ef4444" strokeWidth="2.5" />
                  <polygon points={`312,${pointerY - 4} 320,${pointerY} 312,${pointerY + 4}`} fill="#ef4444" />

                  {/* Pointer Readout Badge */}
                  <rect x="256" y={pointerY - 18} width="60" height="16" fill="#0f172a" fillOpacity="0.85" rx="3" stroke="#ef4444" strokeWidth="1" />
                  <text x="286" y={pointerY - 6} fill="#f87171" fontSize="10" fontWeight="extrabold" textAnchor="middle" fontFamily="monospace">
                    {currentPointer.toFixed(1)} cm
                  </text>

                  {/* Hanger stem */}
                  <line x1={startX} y1={hangerTopY} x2={startX} y2={hangerTopY + 28} stroke="#cbd5e1" strokeWidth="3" />
                  {/* Base disc of hanger (50g) */}
                  <ellipse cx={startX} cy={hangerTopY + 28} rx="24" ry="6" fill="#ca8a04" stroke="#a16207" strokeWidth="1.5" />
                  <text x={startX} y={hangerTopY + 40} fill="#eab308" fontSize="9" fontWeight="bold" textAnchor="middle">
                    Hanger (50g)
                  </text>

                  {/* Slotted Weights (each 50g) stacked on the hanger */}
                  {Array.from({ length: Math.floor(currentLoadG / 50) }).map((_, wIdx) => {
                    const slotY = hangerTopY + 20 - wIdx * 8;
                    return (
                      <g key={wIdx}>
                        <rect x={startX - 20} y={slotY} width="40" height="7" fill="#38bdf8" stroke="#0284c7" strokeWidth="1.5" rx="2" />
                        <line x1={startX} y1={slotY} x2={startX} y2={slotY + 7} stroke="#0284c7" strokeWidth="1.5" />
                      </g>
                    );
                  })}
                </g>
              );
            })()}

            {/* Zero load reference line x0 */}
            {(() => {
              const x0PixelY = 30 + (x0 - 10) * 8;
              return (
                <g>
                  <line x1="310" y1={x0PixelY} x2="370" y2={x0PixelY} stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3 3" />
                  <text x="376" y={x0PixelY + 4} fill="#38bdf8" fontSize="10" fontWeight="bold" fontFamily="monospace">
                    x₀ = {x0.toFixed(1)} cm
                  </text>
                </g>
              );
            })()}
          </svg>
        </div>
      </div>

      {/* Slotted Weights Control Tray */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
            Slotted Weights on Hanger (Click to add/remove load):
          </span>
          <span className="text-xs sm:text-sm font-mono font-bold text-indigo-600 dark:text-indigo-400">
            Load M = {currentLoadG} g
          </span>
        </div>

        <div className="flex flex-wrap gap-2.5 items-center">
          <button
            onClick={() => addWeight(50)}
            disabled={currentLoadG >= 350}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 text-xs sm:text-sm font-bold border border-indigo-200 dark:border-indigo-800 transition-all shadow-2xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add +50 g Weight</span>
          </button>

          <button
            onClick={() => addWeight(100)}
            disabled={currentLoadG >= 300}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 text-xs sm:text-sm font-bold border border-indigo-200 dark:border-indigo-800 transition-all shadow-2xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add +100 g Weight</span>
          </button>

          <button
            onClick={() => removeWeight(50)}
            disabled={currentLoadG <= 0}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs sm:text-sm font-medium border border-slate-200 dark:border-slate-700 transition-all"
          >
            <Minus className="w-4 h-4" />
            <span>Remove -50 g</span>
          </button>

          <button
            onClick={() => setCurrentLoadG(50)}
            className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 px-2 py-1"
          >
            Reset to 50g
          </button>
        </div>
      </div>

      {/* Real-time Readings Card & Send to Table Button */}
      <div className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs sm:text-sm font-mono w-full sm:w-auto">
          <div>
            <span className="text-slate-500 dark:text-slate-400 block text-xs">Loading x₁:</span>
            <strong className="text-slate-900 dark:text-white font-bold">{loadingPointer.toFixed(1)} cm</strong>
          </div>
          <div>
            <span className="text-slate-500 dark:text-slate-400 block text-xs">Unloading x₂:</span>
            <strong className="text-slate-900 dark:text-white font-bold">{unloadingPointer.toFixed(1)} cm</strong>
          </div>
          <div>
            <span className="text-slate-500 dark:text-slate-400 block text-xs">Extension l:</span>
            <strong className="text-emerald-700 dark:text-emerald-400 font-bold">{currentExtension.toFixed(2)} cm</strong>
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
              <span>Logged to Spring Table!</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Log Load & Extension to Table</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
