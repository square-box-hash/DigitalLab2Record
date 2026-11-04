import React, { useState } from 'react';
import { CalculationResult } from '../types/experiment';
import { Check, ChevronDown, Copy } from 'lucide-react';

interface CalculationEngineProps {
  calculation: CalculationResult;
  formulaLatex?: string;
  title: string;
}

/**
 * The result, quietly.
 *
 * One line of figures, one line of the result, and everything else — the
 * substitutions, the error working, the percentage banner — folded away behind
 * a disclosure. The record page still prints all of it.
 */
export const CalculationEngine: React.FC<CalculationEngineProps> = ({ calculation }) => {
  const [copied, setCopied] = useState(false);

  const entries = calculation.errorAnalysis?.entries ?? [];
  const cards = calculation.summaryCards ?? [];
  const pct = calculation.percentageError;
  const errorSteps = calculation.errorAnalysis?.steps ?? [];

  const handleCopyResult = () => {
    navigator.clipboard.writeText(calculation.finalResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <section className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800">
      {/* Header */}
      <div className="px-4 sm:px-5 py-3 flex items-center justify-between gap-3">
        <div className="flex items-baseline gap-2 min-w-0">
          <h3 className="text-[13px] font-semibold tracking-tight text-stone-900 dark:text-stone-100">
            Result
          </h3>
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-emerald-700 dark:text-emerald-400">
            computed
          </span>
        </div>
        <button
          onClick={handleCopyResult}
          aria-label="Copy the final result"
          className="inline-flex items-center gap-1.5 h-8 px-2.5 rounded-lg text-[11.5px] font-medium text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>

      {/* Figures — the numbers, without boxes around them */}
      <div className="px-4 sm:px-5 pb-4 flex flex-wrap gap-x-9 gap-y-4">
        {entries.length > 0
          ? entries.map((entry) => (
              <div key={entry.symbol} className="min-w-0">
                <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-stone-400 dark:text-stone-500">
                  {entry.quantity}
                </div>
                <div className="font-mono text-[17px] leading-tight font-medium text-stone-900 dark:text-stone-100 mt-0.5">
                  {entry.mean}
                  <span className="text-[11px] text-stone-400 dark:text-stone-500 ml-1">{entry.unit}</span>
                </div>
                <div className="font-mono text-[11px] text-stone-500 dark:text-stone-500 mt-0.5">
                  ± {entry.meanAbsError} · {entry.percentageError}
                </div>
              </div>
            ))
          : cards.map((card) => (
              <div key={card.label} className="min-w-0">
                <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-stone-400 dark:text-stone-500">
                  {card.label}
                </div>
                <div className="font-mono text-[17px] leading-tight font-medium text-stone-900 dark:text-stone-100 mt-0.5">
                  {card.value}
                  {card.unit && <span className="text-[11px] text-stone-400 dark:text-stone-500 ml-1">{card.unit}</span>}
                </div>
                {card.subtext && (
                  <div className="text-[11px] text-stone-500 dark:text-stone-500 mt-0.5 max-w-[22ch] leading-snug">
                    {card.subtext}
                  </div>
                )}
              </div>
            ))}
      </div>

      {/* The statement of the result */}
      <p className="px-4 sm:px-5 pb-4 font-mono text-[11.5px] leading-relaxed text-stone-600 dark:text-stone-400">
        {calculation.finalResult}
      </p>

      {/* Everything else, folded */}
      <details
        className="group border-t border-stone-100 dark:border-stone-800"
        onToggle={(event) => {
          const el = event.currentTarget;
          if (el.open) {
            window.setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 60);
          }
        }}
      >
        <summary className="flex items-center justify-between gap-3 px-4 sm:px-5 py-3 cursor-pointer list-none select-none">
          <span className="text-[12px] font-medium text-stone-600 dark:text-stone-300">
            Working &amp; error analysis
          </span>
          <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-stone-400 dark:text-stone-500">
            <span className="group-open:hidden">show</span>
            <span className="hidden group-open:inline">hide</span>
            <ChevronDown className="w-3.5 h-3.5 transition-transform group-open:rotate-180" />
          </span>
        </summary>

        <div className="px-4 sm:px-5 pb-5 pt-1 space-y-5">
          {pct && (
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 font-mono text-[11.5px]">
              <span className="text-stone-500 dark:text-stone-500">Percentage error</span>
              <span className="font-semibold text-stone-900 dark:text-stone-100">{pct.errorPercent} %</span>
              <span className="text-stone-400 dark:text-stone-500">
                against {pct.theoretical}
                {pct.standardRef ? ` (${pct.standardRef})` : ''}
              </span>
            </div>
          )}

          {calculation.steps.length > 0 && (
            <ol className="space-y-2">
              {calculation.steps.map((step, idx) => (
                <li key={idx} className="grid grid-cols-[18px_1fr] gap-x-3 gap-y-0.5">
                  <span className="font-mono text-[10px] text-stone-400 dark:text-stone-600 pt-0.5">{idx + 1}</span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                      <span className="text-[12px] font-medium text-stone-800 dark:text-stone-200">{step.label}</span>
                      <span className="font-mono text-[12px] font-semibold text-stone-900 dark:text-stone-100">
                        {step.result}
                      </span>
                    </div>
                    <div className="font-mono text-[10.5px] text-stone-500 dark:text-stone-500 break-words">
                      {step.formula}
                    </div>
                    <div className="font-mono text-[10.5px] text-stone-400 dark:text-stone-600 break-words">
                      {step.substitution}
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          )}

          {errorSteps.length > 0 && (
            <div className="pt-3 border-t border-stone-100 dark:border-stone-800 space-y-2">
              <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-stone-400 dark:text-stone-500">
                Error analysis
              </div>
              <ol className="space-y-2">
                {errorSteps.map((step, idx) => (
                  <li key={idx} className="grid grid-cols-[18px_1fr] gap-x-3">
                    <span className="font-mono text-[10px] text-stone-400 dark:text-stone-600 pt-0.5">{idx + 1}</span>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                        <span className="text-[12px] font-medium text-stone-800 dark:text-stone-200">{step.label}</span>
                        <span className="font-mono text-[12px] font-semibold text-stone-900 dark:text-stone-100">
                          {step.result}
                        </span>
                      </div>
                      <div className="font-mono text-[10.5px] text-stone-400 dark:text-stone-600 break-words">
                        {step.substitution}
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {calculation.errorAnalysis?.note && (
            <p className="text-[11px] text-stone-500 dark:text-stone-500 leading-relaxed">
              {calculation.errorAnalysis.note}
            </p>
          )}
        </div>
      </details>
    </section>
  );
};
