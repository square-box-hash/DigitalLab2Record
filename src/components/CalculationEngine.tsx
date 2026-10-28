import React, { useState } from 'react';
import { CalculationResult } from '../types/experiment';
import { Calculator, CheckCircle2, ChevronDown, ChevronUp, Copy, Check, ArrowRight, Percent, Award } from 'lucide-react';

interface CalculationEngineProps {
  calculation: CalculationResult;
  formulaLatex?: string;
  title: string;
}

export const CalculationEngine: React.FC<CalculationEngineProps> = ({
  calculation,
  formulaLatex,
  title,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [copied, setCopied] = useState(false);

  const handleCopyResult = () => {
    navigator.clipboard.writeText(calculation.finalResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const pct = calculation.percentageError;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden transition-colors">
      {/* Header bar */}
      <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-slate-50 via-white to-indigo-50/20 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/20">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-xs">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                Step-by-Step Calculations & Proof
              </h3>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                Auto Evaluated
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Rigorous CBSE standard arithmetic substitution and unit propagation
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopyResult}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-2xs"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-emerald-700 dark:text-emerald-300 font-semibold">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>Copy Result</span>
              </>
            )}
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      {calculation.summaryCards && calculation.summaryCards.length > 0 && (
        <div className="p-4 sm:p-5 bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 grid grid-cols-2 lg:grid-cols-4 gap-3">
          {calculation.summaryCards.map((card, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 shadow-2xs"
            >
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">{card.label}</div>
              <div className="flex items-baseline space-x-1">
                <span className="text-xl font-extrabold text-slate-900 dark:text-white font-mono tracking-tight">
                  {card.value}
                </span>
                {card.unit && (
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 font-mono">
                    {card.unit}
                  </span>
                )}
              </div>
              {card.subtext && (
                <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 truncate">{card.subtext}</div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Expandable Step-by-Step Breakdown */}
      {isExpanded && (
        <div className="p-4 sm:p-6 space-y-5">
          {/* Percentage Error Highlight Banner */}
          {pct && (
            <div className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
              parseFloat(pct.errorPercent) <= 5.0
                ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200'
                : 'bg-amber-50/70 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-950 dark:text-amber-200'
            }`}>
              <div className="flex items-center space-x-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                  parseFloat(pct.errorPercent) <= 5.0
                    ? 'bg-emerald-600 text-white'
                    : 'bg-amber-600 text-white'
                }`}>
                  <Percent className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider">
                    Experimental Error Analysis
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                    Calculated: <strong className="font-mono text-slate-900 dark:text-white">{pct.calculated}</strong> vs Theoretical: <strong className="font-mono text-slate-900 dark:text-white">{pct.theoretical}</strong>
                    {pct.standardRef && <span className="text-slate-500 dark:text-slate-400"> ({pct.standardRef})</span>}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2 self-start sm:self-auto">
                <span className={`text-base font-extrabold font-mono px-3 py-1 rounded-lg border ${
                  parseFloat(pct.errorPercent) <= 5.0
                    ? 'bg-emerald-100/80 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 border-emerald-300 dark:border-emerald-700'
                    : 'bg-amber-100/80 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200 border-amber-300 dark:border-amber-700'
                }`}>
                  {pct.errorPercent} Error
                </span>
                {parseFloat(pct.errorPercent) <= 5.0 && (
                  <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-white/80 dark:bg-slate-900 px-2 py-1 rounded-md border border-emerald-200 dark:border-emerald-800">
                    High Accuracy (≤5%)
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Sequential Steps */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Mathematical Derivation & Substitution Steps
            </h4>

            <div className="space-y-2.5">
              {calculation.steps.map((step, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-start space-x-3">
                    <span className="w-6 h-6 rounded-md bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold font-mono flex items-center justify-center shrink-0 text-xs">
                      {idx + 1}
                    </span>
                    <div className="space-y-1">
                      <div className="font-bold text-slate-900 dark:text-white">{step.label}</div>
                      <div className="font-mono text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 px-2 py-1 rounded border border-slate-200 dark:border-slate-700 inline-block text-[11px]">
                        {step.formula}
                      </div>
                      <div className="text-slate-500 dark:text-slate-400 text-[11px] font-mono">
                        Sub: {step.substitution}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 md:self-center pl-9 md:pl-0">
                    <ArrowRight className="w-4 h-4 text-slate-300 dark:text-slate-600 hidden md:block" />
                    <span className="font-mono font-bold text-slate-900 dark:text-white text-sm bg-white dark:bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-2xs">
                      = {step.result}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Final Result Card */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent dark:from-emerald-950/40 dark:via-emerald-950/20 border border-emerald-300/80 dark:border-emerald-800">
            <div className="flex items-center space-x-2 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider mb-1">
              <Award className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Final CBSE Practical Statement</span>
            </div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white font-mono leading-relaxed">
              {calculation.finalResult}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
