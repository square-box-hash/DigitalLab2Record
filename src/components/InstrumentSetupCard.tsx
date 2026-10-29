import React from 'react';
import { ExperimentConstant } from '../types/experiment';
import { Sliders, AlertCircle } from 'lucide-react';
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
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs p-5 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-slate-800 gap-2">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Instrument Setup & Calibration Constants</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Fine-tune instrument parameters. Derived columns and calculations update in real-time.
            </p>
          </div>
        </div>

        <button
          onClick={onResetConstants}
          className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-semibold self-start sm:self-auto hover:underline"
        >
          Reset Instrument Defaults
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
  );
};
