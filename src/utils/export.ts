import { ExperimentConfig, CalculationResult } from '../types/experiment';
import { formatNumber } from './math';

const escapeCell = (value: string): string =>
  /[",\r\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;

/**
 * Builds a CSV of one experiment's observation table.
 *
 * Instrument constants and the final result are written as `#` comment lines
 * above/below the table so the file opens cleanly in Excel or Google Sheets
 * without disturbing the grid.
 */
export function buildRowsCsv(
  experiment: ExperimentConfig,
  rows: Array<Record<string, number>>,
  constants: Record<string, number>,
  calculation: CalculationResult
): string {
  const lines: string[] = [];

  lines.push(`# ${experiment.title}`);
  lines.push(`# ${experiment.section} | ${experiment.aim}`);
  lines.push(`# Exported ${new Date().toISOString()}`);
  experiment.constants.forEach((c) => {
    const value = constants[c.id] ?? c.defaultValue;
    lines.push(`# ${escapeCell(c.label)}: ${value}${c.unit ? ` ${c.unit}` : ''}`);
  });
  lines.push('');

  lines.push(
    experiment.columns
      .map((col) => escapeCell(col.unit ? `${col.label} [${col.unit}]` : col.label))
      .join(',')
  );

  rows.forEach((row, idx) => {
    lines.push(
      experiment.columns
        .map((col) =>
          col.id === 'obs'
            ? String(idx + 1)
            : formatNumber(row[col.id], col.decimalPlaces ?? 2)
        )
        .join(',')
    );
  });

  lines.push('');
  lines.push(`# Result: ${escapeCell(calculation.finalResult)}`);

  if (calculation.errorAnalysis) {
    lines.push('');
    lines.push('# Error analysis');
    calculation.errorAnalysis.entries.forEach((entry) => {
      lines.push(
        `# ${escapeCell(entry.quantity)}: ${escapeCell(entry.notation)} (${entry.percentageError})`
      );
    });
  }

  return lines.join('\r\n');
}

/** Triggers a browser download for generated CSV text (UTF-8 BOM so Excel reads units correctly). */
export function downloadCsv(filename: string, csv: string): void {
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
