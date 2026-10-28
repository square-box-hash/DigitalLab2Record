import React from 'react';
import { ExperimentConfig, CalculationResult } from '../types/experiment';
import { Printer, Award, FileText } from 'lucide-react';
import { formatNumber } from '../utils/math';

interface CbseRecordViewProps {
  experiment: ExperimentConfig;
  rows: Array<Record<string, number>>;
  constants: Record<string, number>;
  calculation: CalculationResult;
  onPrint: () => void;
}

export const CbseRecordView: React.FC<CbseRecordViewProps> = ({
  experiment,
  rows,
  constants,
  calculation,
  onPrint,
}) => {
  const currentDate = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="space-y-6">
      {/* Top Banner with Print Button */}
      <div className="no-print bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-indigo-950 dark:text-indigo-200 flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            Standard CBSE Class 11 Lab Record Page
          </h3>
          <p className="text-xs text-indigo-700/80 dark:text-indigo-300/80 mt-0.5">
            Formatted strictly in accordance with NCERT / CBSE Physics Laboratory Manual guidelines. Ready for physical submission.
          </p>
        </div>

        <button
          onClick={onPrint}
          className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 shadow-sm shadow-indigo-200 dark:shadow-none transition-all self-start sm:self-auto print-include"
        >
          <Printer className="w-4 h-4" />
          <span>Print / Save as PDF</span>
        </button>
      </div>

      {/* The Printable A4 Sheet Container (kept crisp white for submission) */}
      <div className="print-container bg-white border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6 sm:p-10 text-slate-900 max-w-4xl mx-auto space-y-6">
        {/* Record Page Header Meta */}
        <div className="border-b-2 border-slate-900 pb-4">
          <div className="flex justify-between items-start text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
            <span>CBSE Physics Laboratory Record</span>
            <span>Class XI – Term Practicals</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-xs border-t border-slate-200">
            <div>
              <span className="text-slate-500">Exp No:</span>{' '}
              <strong className="text-slate-900 font-mono">
                {experiment.id.toUpperCase().slice(0, 6)}
              </strong>
            </div>
            <div>
              <span className="text-slate-500">Date:</span>{' '}
              <strong className="text-slate-900 font-mono">{currentDate}</strong>
            </div>
            <div>
              <span className="text-slate-500">Section:</span>{' '}
              <strong className="text-slate-900">{experiment.section}</strong>
            </div>
            <div>
              <span className="text-slate-500">Page No:</span>{' '}
              <strong className="text-slate-900 font-mono">01</strong>
            </div>
          </div>
        </div>

        {/* 1. AIM */}
        <div className="space-y-1.5">
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-indigo-900 bg-indigo-50/60 px-2 py-1 rounded inline-block border border-indigo-100">
            1. Aim of the Experiment
          </h2>
          <p className="text-sm font-semibold text-slate-800 leading-relaxed pl-1">
            {experiment.aim}
          </p>
        </div>

        {/* 2. APPARATUS REQUIRED */}
        <div className="space-y-1.5">
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-indigo-900 bg-indigo-50/60 px-2 py-1 rounded inline-block border border-indigo-100">
            2. Apparatus and Material Required
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-slate-700 pl-3">
            {experiment.apparatus.map((item, idx) => (
              <li key={idx} className="flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 shrink-0"></span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 3. PRINCIPLE & THEORY */}
        <div className="space-y-2">
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-indigo-900 bg-indigo-50/60 px-2 py-1 rounded inline-block border border-indigo-100">
            3. Principle & Working Theory
          </h2>
          <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line pl-1">
            {experiment.theory}
          </p>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs text-slate-800">
            <strong>Governing Mathematical Formulae:</strong>
            <pre className="mt-1 font-sans text-xs whitespace-pre-line text-slate-700">
              {experiment.formula}
            </pre>
          </div>
        </div>

        {/* 4. OBSERVATION TABLE */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-indigo-900 bg-indigo-50/60 px-2 py-1 rounded inline-block border border-indigo-100">
              4. Observations
            </h2>
            <div className="text-[11px] text-slate-500 font-mono">
              Least Count & Constants applied
            </div>
          </div>

          {/* Instrument Constants Summary */}
          <div className="flex flex-wrap gap-2 text-[11px] bg-slate-50 p-2.5 rounded-lg border border-slate-200">
            {experiment.constants.map((c) => (
              <span key={c.id} className="bg-white px-2 py-0.5 rounded border border-slate-200">
                {c.label}: <strong>{constants[c.id] ?? c.defaultValue} {c.unit}</strong>
              </span>
            ))}
          </div>

          {/* Table */}
          <div className="overflow-x-auto border border-slate-900 rounded-lg">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-900 font-bold">
                  {experiment.columns.map((col) => (
                    <th key={col.id} className="p-2 border-r border-slate-300 last:border-r-0">
                      <div>{col.label}</div>
                      {col.unit && <span className="font-normal text-slate-500">[{col.unit}]</span>}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-300 font-mono">
                {rows.map((row, rIdx) => (
                  <tr key={rIdx}>
                    {experiment.columns.map((col) => {
                      const isObs = col.id === 'obs';
                      const val = isObs ? rIdx + 1 : row[col.id];
                      return (
                        <td
                          key={col.id}
                          className={`p-2 border-r border-slate-300 last:border-r-0 ${
                            col.isDerived ? 'bg-slate-50 font-semibold' : ''
                          }`}
                        >
                          {isObs ? val : formatNumber(val, col.decimalPlaces ?? 2)}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 5. CALCULATIONS */}
        <div className="space-y-2">
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-indigo-900 bg-indigo-50/60 px-2 py-1 rounded inline-block border border-indigo-100">
            5. Calculations & Arithmetic Proof
          </h2>
          <div className="space-y-1.5 pl-1 text-xs">
            {calculation.steps.map((st, i) => (
              <div key={i} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 space-y-0.5">
                <div className="font-bold text-slate-900">
                  Step {i + 1}: {st.label}
                </div>
                <div className="font-mono text-slate-600">Formula: {st.formula}</div>
                <div className="font-mono text-slate-700">Substituted: {st.substitution}</div>
                <div className="font-mono font-bold text-indigo-900">Result: {st.result}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 6. RESULT */}
        <div className="space-y-1.5 p-4 rounded-xl bg-slate-50 border-2 border-slate-900">
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-900 flex items-center gap-1.5">
            <Award className="w-4 h-4 text-emerald-600" />
            6. Result
          </h2>
          <p className="text-sm font-bold text-slate-900 font-mono leading-relaxed">
            {calculation.finalResult}
          </p>
          {calculation.percentageError && (
            <p className="text-xs text-slate-700 mt-1">
              Percentage Experimental Error: <strong>{calculation.percentageError.errorPercent}</strong> (against standard theoretical reference of {calculation.percentageError.theoretical}).
            </p>
          )}
        </div>

        {/* 7. PRECAUTIONS */}
        <div className="space-y-1.5">
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-indigo-900 bg-indigo-50/60 px-2 py-1 rounded inline-block border border-indigo-100">
            7. Precautions (Minimum 4 Points)
          </h2>
          <ol className="list-decimal list-inside text-xs text-slate-700 space-y-1 pl-1">
            {experiment.precautions.map((p, idx) => (
              <li key={idx} className="leading-relaxed">
                {p}
              </li>
            ))}
          </ol>
        </div>

        {/* 8. SOURCES OF ERROR */}
        <div className="space-y-1.5">
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-indigo-900 bg-indigo-50/60 px-2 py-1 rounded inline-block border border-indigo-100">
            8. Sources of Error (Minimum 3 Points)
          </h2>
          <ol className="list-decimal list-inside text-xs text-slate-700 space-y-1 pl-1">
            {experiment.sourcesOfError.map((err, idx) => (
              <li key={idx} className="leading-relaxed">
                {err}
              </li>
            ))}
          </ol>
        </div>

        {/* Teacher Signature Footer */}
        <div className="pt-8 border-t border-slate-300 flex justify-between items-end text-xs text-slate-600">
          <div>
            <div className="h-10 border-b border-dashed border-slate-400 w-48 mb-1"></div>
            <span>Student Signature</span>
          </div>

          <div className="text-right">
            <div className="h-10 border-b border-dashed border-slate-400 w-48 mb-1"></div>
            <span>Teacher / Examiner Signature & Date</span>
          </div>
        </div>
      </div>
    </div>
  );
};
