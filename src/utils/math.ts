/**
 * Mathematics & Statistics Utilities for CBSE Physics Practicals
 */

export function roundTo(val: number, decimalPlaces = 2): number {
  if (isNaN(val) || !isFinite(val)) return 0;
  const factor = Math.pow(10, decimalPlaces);
  return Math.round((val + Number.EPSILON) * factor) / factor;
}

export function formatNumber(val: number | undefined | null, decimalPlaces = 2): string {
  if (val === undefined || val === null || isNaN(val) || !isFinite(val)) return '-';
  return roundTo(val, decimalPlaces).toFixed(decimalPlaces);
}

export function calculateMean(values: number[], decimalPlaces = 3): number {
  const valid = values.filter((v) => !isNaN(v) && isFinite(v));
  if (valid.length === 0) return 0;
  const sum = valid.reduce((acc, curr) => acc + curr, 0);
  return roundTo(sum / valid.length, decimalPlaces);
}

export interface RegressionResult {
  slope: number;
  intercept: number;
  r2: number;
  r: number;
  points: Array<{ x: number; y: number; fitY: number }>;
  minX: number;
  maxX: number;
  deltaX: number;
  deltaY: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

/**
 * Computes Least Squares Linear Regression: y = m*x + c
 */
export function computeLinearRegression(data: Array<{ x: number; y: number }>): RegressionResult | null {
  const validPoints = data.filter(
    (p) => p && !isNaN(p.x) && !isNaN(p.y) && isFinite(p.x) && isFinite(p.y)
  );

  if (validPoints.length < 2) {
    return null;
  }

  const n = validPoints.length;
  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumX2 = 0;
  let sumY2 = 0;

  let minX = Infinity;
  let maxX = -Infinity;

  for (const p of validPoints) {
    sumX += p.x;
    sumY += p.y;
    sumXY += p.x * p.y;
    sumX2 += p.x * p.x;
    sumY2 += p.y * p.y;
    if (p.x < minX) minX = p.x;
    if (p.x > maxX) maxX = p.x;
  }

  const denominator = n * sumX2 - sumX * sumX;
  if (Math.abs(denominator) < 1e-12) {
    return null;
  }

  const slope = (n * sumXY - sumX * sumY) / denominator;
  const intercept = (sumY - slope * sumX) / n;

  // Correlation coefficient r and R^2
  const numeratorR = n * sumXY - sumX * sumY;
  const denomR = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
  const r = denomR !== 0 ? numeratorR / denomR : 0;
  const r2 = r * r;

  // Pick 2 representative points on the line for standard CBSE slope triangle (A & B)
  const x1 = minX + 0.15 * (maxX - minX);
  const x2 = minX + 0.85 * (maxX - minX);
  const y1 = slope * x1 + intercept;
  const y2 = slope * x2 + intercept;
  const deltaX = x2 - x1;
  const deltaY = y2 - y1;

  const points = validPoints.map((p) => ({
    x: p.x,
    y: p.y,
    fitY: roundTo(slope * p.x + intercept, 4),
  }));

  return {
    slope: roundTo(slope, 5),
    intercept: roundTo(intercept, 5),
    r2: roundTo(r2, 4),
    r: roundTo(r, 4),
    points,
    minX,
    maxX,
    deltaX: roundTo(deltaX, 4),
    deltaY: roundTo(deltaY, 4),
    x1: roundTo(x1, 3),
    y1: roundTo(y1, 3),
    x2: roundTo(x2, 3),
    y2: roundTo(y2, 3),
  };
}

/**
 * Calculates percentage experimental error
 */
export function calculatePercentageError(experimental: number, standard: number): {
  errorPercent: string;
  isClose: boolean;
} {
  if (standard === 0) return { errorPercent: '0.00%', isClose: true };
  const diff = Math.abs(experimental - standard);
  const pct = (diff / standard) * 100;
  return {
    errorPercent: `${roundTo(pct, 2).toFixed(2)}%`,
    isClose: pct <= 5.0,
  };
}
