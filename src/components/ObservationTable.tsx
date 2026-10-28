import React from 'react';
import { ExperimentColumn } from '../types/experiment';
import { Plus, Trash2, RefreshCw } from 'lucide-react';
import { formatNumber } from '../utils/math';

interface ObservationTableProps {
  columns: ExperimentColumn[];
  rows: Array<Record<string, number>>;
  onRowChange: (index: number, columnId: string, value: number) => void;
  onAddRow: () => void;
  onDeleteRow: (index: number) => void;
  onResetRows: () => void;
}

export const ObservationTable: React.FC<ObservationTableProps> = ({
  columns,
  rows,
  onRowChange,
  onAddRow,
  onDeleteRow,
  onResetRows,
}) => {
  const columnAverages: Record<string, string> = {};
  columns.forEach((col) => {
    if (col.id === 'obs') {
      columnAverages[col.id] = 'Mean (X̄)';
      return;
    }
    const values = rows
      .map((r) => r[col.id])
      .filter((v) => typeof v === 'number' && !isNaN(v) && isFinite(v));
    if (values.length > 0) {
      const sum = values.reduce((acc, v) => acc + v, 0);
      const avg = sum / values.length;
      columnAverages[col.id] = formatNumber(avg, col.decimalPlaces ?? 2);
    } else {
      columnAverages[col.id] = '-';
    }
  });

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden transition-colors">
      {/* Table Header Bar */}
      <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
              Observation Table
            </h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              {rows.length} Readings
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Enter raw readings directly or log from the Simulator. Derived columns (highlighted in emerald) auto-compute.
          </p>
        </div>

        <div className="flex items-center space-x-2 self-start sm:self-auto">
          <button
            onClick={onResetRows}
            title="Load benchmark CBSE lab observations"
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shadow-2xs"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
            <span>Sample Data</span>
          </button>

          <button
            onClick={onAddRow}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-100 dark:shadow-none"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Row</span>
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/90 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200">
              {columns.map((col) => (
                <th
                  key={col.id}
                  className={`py-3 px-3 sm:px-4 ${
                    col.isDerived ? 'bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-300 font-bold' : ''
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="flex items-center gap-1">
                      {col.label}
                      {col.isDerived && (
                        <span className="text-[10px] text-emerald-700 dark:text-emerald-300 font-mono font-normal bg-emerald-100/80 dark:bg-emerald-900/60 px-1 py-0.2 rounded">
                          auto
                        </span>
                      )}
                    </span>
                    {col.unit && (
                      <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500 font-medium">
                        [{col.unit}]
                      </span>
                    )}
                  </div>
                </th>
              ))}
              <th className="py-3 px-3 w-12 text-center text-slate-400 font-medium text-[11px] no-print">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm font-mono">
            {rows.map((row, rIdx) => (
              <tr
                key={rIdx}
                className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors group"
              >
                {columns.map((col) => {
                  const val = row[col.id];
                  const isDerived = col.isDerived;
                  const isObs = col.id === 'obs';

                  if (isObs) {
                    return (
                      <td key={col.id} className="py-2.5 px-3 sm:px-4 font-semibold text-slate-500 dark:text-slate-400">
                        {rIdx + 1}
                      </td>
                    );
                  }

                  if (isDerived) {
                    return (
                      <td
                        key={col.id}
                        className="py-2.5 px-3 sm:px-4 bg-emerald-50/30 dark:bg-emerald-950/20 font-semibold text-emerald-800 dark:text-emerald-300"
                      >
                        <span className="px-2 py-1 rounded-md bg-emerald-100/60 dark:bg-emerald-900/40 border border-emerald-200/50 dark:border-emerald-800/60 inline-block text-xs sm:text-sm">
                          {formatNumber(val, col.decimalPlaces ?? 2)}
                        </span>
                      </td>
                    );
                  }

                  return (
                    <td key={col.id} className="py-2 px-2 sm:px-3">
                      <input
                        type="number"
                        step={col.decimalPlaces ? Math.pow(10, -col.decimalPlaces) : 0.01}
                        value={val !== undefined ? val : ''}
                        placeholder={col.placeholder || '0'}
                        onChange={(e) => {
                          const parsed = parseFloat(e.target.value);
                          onRowChange(rIdx, col.id, isNaN(parsed) ? 0 : parsed);
                        }}
                        className="w-full min-w-[70px] max-w-[130px] px-2.5 py-1 text-xs sm:text-sm font-mono font-medium bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800 dark:text-slate-100 shadow-2xs hover:border-slate-300 dark:hover:border-slate-600 transition-all"
                      />
                    </td>
                  );
                })}

                <td className="py-2 px-2 text-center no-print">
                  <button
                    onClick={() => onDeleteRow(rIdx)}
                    disabled={rows.length <= 1}
                    title={rows.length <= 1 ? 'At least one row required' : 'Delete observation row'}
                    className={`p-1.5 rounded-lg transition-colors ${
                      rows.length <= 1
                        ? 'opacity-30 cursor-not-allowed text-slate-400'
                        : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40'
                    }`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

          {/* Table Summary Footer (Means) */}
          <tfoot>
            <tr className="bg-slate-100/90 dark:bg-slate-800/90 border-t-2 border-slate-300 dark:border-slate-700 font-mono font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-100">
              {columns.map((col) => {
                if (col.id === 'obs') {
                  return (
                    <td key={col.id} className="py-3 px-3 sm:px-4 text-slate-900 dark:text-white font-sans font-bold">
                      Mean (X̄)
                    </td>
                  );
                }
                const avg = columnAverages[col.id];
                return (
                  <td
                    key={col.id}
                    className={`py-3 px-3 sm:px-4 ${
                      col.isDerived ? 'text-emerald-900 dark:text-emerald-300 bg-emerald-100/40 dark:bg-emerald-950/40' : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span className="font-semibold">{avg}</span>
                  </td>
                );
              })}
              <td className="py-3 px-3 no-print"></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};
