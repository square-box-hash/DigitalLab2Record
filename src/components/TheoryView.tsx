import React from 'react';
import { ExperimentConfig } from '../types/experiment';
import { BookOpen, ShieldAlert, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface TheoryViewProps {
  experiment: ExperimentConfig;
}

export const TheoryView: React.FC<TheoryViewProps> = ({ experiment }) => {
  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs p-6 sm:p-8 space-y-4 transition-colors">
        <div className="flex items-center space-x-2.5">
          <span className="px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800 font-bold text-xs uppercase tracking-wider">
            {experiment.section}
          </span>
          {experiment.ncertReference && (
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Ref: {experiment.ncertReference}
            </span>
          )}
        </div>

        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {experiment.title}
        </h1>

        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
          <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
            Aim of the Experiment
          </h3>
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-relaxed">
            {experiment.aim}
          </p>
        </div>

        {/* Apparatus */}
        <div>
          <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
            Apparatus and Materials Required
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {experiment.apparatus.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center space-x-2 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-50/80 dark:bg-slate-800/60 px-3 py-2 rounded-lg border border-slate-200/60 dark:border-slate-700"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Core Theory */}
        <div className="space-y-2 pt-2">
          <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Principle and Working Theory
          </h3>
          <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line bg-slate-50/50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
            {experiment.theory}
          </div>
        </div>

        {/* Formula */}
        <div className="p-4 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 space-y-1.5">
          <h3 className="text-xs font-bold text-indigo-900 dark:text-indigo-300 uppercase tracking-wider">
            Governing Physics Formulae
          </h3>
          <pre className="font-mono text-xs sm:text-sm text-indigo-950 dark:text-indigo-200 whitespace-pre-line leading-relaxed">
            {experiment.formula}
          </pre>
        </div>
      </div>

      {/* Precautions and Sources of Error Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Precautions */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs p-5 sm:p-6 space-y-3 transition-colors">
          <div className="flex items-center space-x-2 text-emerald-700 dark:text-emerald-400 font-bold text-sm">
            <ShieldAlert className="w-4 h-4" />
            <span>Essential CBSE Precautions</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {experiment.precautions.map((p, idx) => (
              <li key={idx} className="flex items-start space-x-2 bg-emerald-50/30 dark:bg-emerald-950/20 p-2.5 rounded-lg border border-emerald-100 dark:border-emerald-900/40">
                <span className="font-bold text-emerald-700 dark:text-emerald-400 shrink-0">{idx + 1}.</span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Sources of Error */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs p-5 sm:p-6 space-y-3 transition-colors">
          <div className="flex items-center space-x-2 text-rose-700 dark:text-rose-400 font-bold text-sm">
            <AlertTriangle className="w-4 h-4" />
            <span>Common Sources of Error</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {experiment.sourcesOfError.map((err, idx) => (
              <li key={idx} className="flex items-start space-x-2 bg-rose-50/30 dark:bg-rose-950/20 p-2.5 rounded-lg border border-rose-100 dark:border-rose-900/40">
                <span className="font-bold text-rose-700 dark:text-rose-400 shrink-0">{idx + 1}.</span>
                <span>{err}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
