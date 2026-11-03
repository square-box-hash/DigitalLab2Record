import { CalculationStep, ErrorAnalysis, ErrorAnalysisEntry } from '../types/experiment';
import { roundTo } from './math';

/**
 * CBSE error analysis for a set of repeated readings:
 *
 *   mean               x̄  = Σxᵢ / n
 *   mean absolute error Δx̄ = Σ|xᵢ − x̄| / n
 *   percentage error        = (Δx̄ / x̄) × 100
 *
 * The result is then written as x = x̄ ± Δx̄, which is what a lab record expects
 * in place of a bare mean.
 */
export interface MeanStats {
  mean: number;
  meanAbsError: number;
  relativeError: number;
  percentageError: number;
  readings: number;
}

export function analyseReadings(values: number[], decimals = 3): MeanStats | null {
  const valid = values.filter((v) => typeof v === 'number' && Number.isFinite(v));
  if (valid.length === 0) return null;

  const n = valid.length;
  const mean = valid.reduce((acc, v) => acc + v, 0) / n;
  const meanAbsError = valid.reduce((acc, v) => acc + Math.abs(v - mean), 0) / n;
  const relativeError = mean !== 0 ? meanAbsError / Math.abs(mean) : 0;

  return {
    mean: roundTo(mean, decimals),
    meanAbsError: roundTo(meanAbsError, decimals),
    relativeError: roundTo(relativeError, 4),
    percentageError: roundTo(relativeError * 100, 2),
    readings: n,
  };
}

export interface DerivedQuantity {
  symbol: string;
  quantity: string;
  unit: string;
  /** Already-computed value of the derived quantity. */
  value: number;
  decimals?: number;
  /**
   * Exponent of the measured quantity in the derived formula, used for
   * propagation: ΔQ/Q = factor · Δx/x. Area ∝ D² → factor 2.
   */
  factor: number;
  basis?: string;
}

export interface BuildErrorAnalysisOptions {
  symbol: string;
  quantity: string;
  unit: string;
  values: number[];
  decimals?: number;
  derived?: DerivedQuantity[];
  note?: string;
}

const meanErrorSteps = (
  symbol: string,
  unit: string,
  values: number[],
  stats: MeanStats,
  decimals: number,
  displayedPercentage: number
): CalculationStep[] => {
  const meanText = stats.mean.toFixed(decimals);
  const absText = stats.meanAbsError.toFixed(decimals);
  const deviations = values
    .filter((v) => Number.isFinite(v))
    .map((v) => `|${v.toFixed(decimals)} − ${meanText}|`)
    .join(' + ');

  return [
    {
      label: `Mean ${symbol}`,
      formula: `${symbol}̄ = (${symbol}₁ + ${symbol}₂ + … + ${symbol}ₙ) / n`,
      substitution: `(${values.map((v) => v.toFixed(decimals)).join(' + ')}) / ${stats.readings}`,
      result: `${meanText} ${unit}`,
    },
    {
      label: 'Mean absolute error',
      formula: `Δ${symbol}̄ = (|${symbol}₁ − ${symbol}̄| + … + |${symbol}ₙ − ${symbol}̄|) / n`,
      substitution: `(${deviations}) / ${stats.readings}`,
      result: `${absText} ${unit}`,
    },
    {
      label: 'Percentage error',
      formula: `(Δ${symbol}̄ / ${symbol}̄) × 100`,
      substitution: `(${absText} / ${meanText}) × 100`,
      result: `${displayedPercentage.toFixed(2)} %`,
    },
  ];
};

/**
 * Builds the full error-analysis block for an experiment that measures one
 * quantity repeatedly and then derives others from it.
 */
export function buildMeanErrorAnalysis(options: BuildErrorAnalysisOptions): ErrorAnalysis | undefined {
  const { symbol, quantity, unit, values, derived = [], note } = options;
  const decimals = options.decimals ?? 3;

  const stats = analyseReadings(values, decimals);
  if (!stats || stats.readings === 0) return undefined;

  const meanText = stats.mean.toFixed(decimals);
  const meanAbsText = stats.meanAbsError.toFixed(decimals);

  // The percentage is computed from the numbers as printed, not from the raw
  // values: a reader who divides the two figures on the card must get the
  // printed percentage back. (Dividing a rounded Δ by a rounded mean and
  // printing a percentage from the unrounded pair is how "±0.01 cm, 0.30 %"
  // ends up on a page that does not add up.)
  const displayedPercentage =
    Number(meanText) !== 0 ? roundTo((Number(meanAbsText) / Number(meanText)) * 100, 2) : 0;

  const entries: ErrorAnalysisEntry[] = [
    {
      symbol,
      quantity,
      unit,
      mean: meanText,
      meanAbsError: meanAbsText,
      percentageError: `${displayedPercentage.toFixed(2)} %`,
      notation: `${symbol} = (${meanText} ± ${meanAbsText}) ${unit}`,
      basis: `Mean of ${stats.readings} readings`,
    },
  ];

  const steps = meanErrorSteps(symbol, unit, values, stats, decimals, displayedPercentage);

  derived.forEach((d) => {
    const dec = d.decimals ?? decimals;
    const pct = d.factor * displayedPercentage;
    // Absolute error follows from the printed percentage, so ± and % agree here too.
    const absoluteError = Math.abs(d.value) * (pct / 100);

    entries.push({
      symbol: d.symbol,
      quantity: d.quantity,
      unit: d.unit,
      mean: d.value.toFixed(dec),
      meanAbsError: absoluteError.toFixed(dec),
      percentageError: `${pct.toFixed(2)} %`,
      notation: `${d.symbol} = (${d.value.toFixed(dec)} ± ${absoluteError.toFixed(dec)}) ${d.unit}`,
      basis: d.basis ?? `Δ${d.symbol}/${d.symbol} = ${d.factor} × Δ${symbol}/${symbol}`,
    });

    steps.push({
      label: `Error in ${d.quantity.toLowerCase()} (${d.symbol})`,
      formula: `Δ${d.symbol}/${d.symbol} = ${d.factor} × Δ${symbol}/${symbol}`,
      substitution: `${d.factor} × ${displayedPercentage.toFixed(2)} %`,
      result: `${pct.toFixed(2)} %  ⇒  ±${absoluteError.toFixed(dec)} ${d.unit}`,
    });
  });

  return {
    readings: stats.readings,
    entries,
    steps,
    note,
  };
}
