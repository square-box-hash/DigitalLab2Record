import React from 'react';
import { ExperimentConstant } from '../types/experiment';
import { Sliders, AlertCircle, ChevronDown } from 'lucide-react';
import { NumberInput } from './ui/NumberInput';

interface InstrumentSetupCardProps {
  constants: ExperimentConstant[];
  values: Record<string, number>;
  onChange: (id: string, value: number) => void;
  onResetConstants: () => void;
}

export const InstrumentSetupCard: React.FC<InstrumentSetupCardProps> = ({
  constants,
  values,
  onChange,
  onResetConstants,
}) => {
  const zeroError = constants.find((c) => c.id.toLowerCase().includes('zeroerror'));
  const summary = zeroError
    ? `zero error ${values[zeroError.id] ?? zeroError.defaultValue} ${zeroError.unit}`
    : `${constants.length} constants`;

  return (
    <details className="group bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800">
      <summary className="flex items-center justify-between gap-3 px-4 py-3 cursor-pointer list-none select-none">
        <span className="flex items-center gap-2 min-w-0">
          <Sliders className="w-4 h-4 text-stone-400 shrink-0" />
          <span className="text-[13px] font-medium text-stone-900 dark:text-stone-100">Instrument &amp; calibration</span>
          <span className="font-mono text-[11px] text-stone-500 dark:text-stone-500 truncate">{summary}</span>
        </span>
        <ChevronDown className="w-4 h-4 shrink-0 text-stone-400 transition-transform group-open:rotate-180" />
      </summary>

      <div className="px-4 pb-4">
        <div className="flex justify-end pb-3">
          <button
            onClick={onResetConstants}
            className="text-[11px] font-medium text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 underline underline-offset-2"
          >
            Reset defaults
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
        {constants.map((c) => {
          const val = values[c.id] ?? c.defaultValue;
          const isZeroError = c.id.toLowerCase().includes('zeroerror');

          return (
            <div
              key={c.id}
              className={`p-3.5 rounded-xl border transition-all ${
                isZeroError && Math.abs(val) > 0
                  ? 'bg-amber-50/60 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/80'
                  : 'bg-slate-50/80 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600'
              }`}
            >
              <div className="flex items-start justify-between mb-1.5">
                <label
                  htmlFor={`constant-${c.id}`}
                  className="text-xs font-semibold text-slate-700 dark:text-slate-300 leading-tight"
                >
                  {c.label}
                </label>
                {c.unit && (
                  <span className="text-[11px] font-mono font-medium text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 shrink-0 ml-1">
                    {c.unit}
                  </span>
                )}
              </div>

              <div className="mt-2 flex items-center space-x-2">
                <NumberInput
                  id={`constant-${c.id}`}
                  value={val}
                  step={c.step ?? 0.01}
                  ariaLabel={`${c.label}${c.unit ? ` in ${c.unit}` : ''}`}
                  placeholder={String(c.defaultValue)}
                  onCommit={(next) => onChange(c.id, next)}
                  className="w-full px-3 py-1.5 text-sm font-mono font-semibold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900 dark:text-white shadow-xs"
                />
              </div>

              {c.description && (
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 leading-snug">
                  {c.description}
                </p>
              )}

              {isZeroError && Math.abs(val) > 0 && (
                <div className="flex items-center space-x-1 mt-1 text-[11px] font-medium text-amber-700 dark:text-amber-400">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  <span>
                    {val > 0
                      ? `Positive error (+${val}) will be subtracted`
                      : `Negative error (${val}) will be added`}
                  </span>
                </div>
              )}
            </div>
          );
        })}
        </div>
      </div>
    </details>
  );
};
