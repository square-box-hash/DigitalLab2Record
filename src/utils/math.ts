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

export interface RegressionOptions {
  /**
   * Force the best-fit line through the origin (y = m*x). CBSE graph work for
   * load-extension and L-T^2 expects a line through the origin, and an
   * unconstrained intercept otherwise skews the derived physical constant.
   */
  throughOrigin?: boolean;
}

/**
 * Computes Least Squares Linear Regression: y = m*x + c
 * (or y = m*x when `throughOrigin` is set).
 */
export function computeLinearRegression(
  data: Array<{ x: number; y: number }>,
  options: RegressionOptions = {}
): RegressionResult | null {
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

  let minX = Infinity;
  let maxX = -Infinity;

  for (const p of validPoints) {
    sumX += p.x;
    sumY += p.y;
    sumXY += p.x * p.y;
    sumX2 += p.x * p.x;
    if (p.x < minX) minX = p.x;
    if (p.x > maxX) maxX = p.x;
  }

  const throughOrigin = options.throughOrigin === true;

  let slope: number;
  let intercept: number;

  if (throughOrigin) {
    // y = m*x, least squares: m = sum(x*y) / sum(x^2)
    if (sumX2 < 1e-12) {
      return null;
    }
    slope = sumXY / sumX2;
    intercept = 0;
  } else {
    const denominator = n * sumX2 - sumX * sumX;
    if (Math.abs(denominator) < 1e-12) {
      return null;
    }
    slope = (n * sumXY - sumX * sumY) / denominator;
    intercept = (sumY - slope * sumX) / n;
  }

  // Coefficient of determination, valid for both the free and the origin-constrained fit:
  // R^2 = 1 - SS_res / SS_tot
  const meanY = sumY / n;
  let ssTot = 0;
  let ssRes = 0;
  for (const p of validPoints) {
    const predicted = slope * p.x + intercept;
    ssTot += (p.y - meanY) * (p.y - meanY);
    ssRes += (p.y - predicted) * (p.y - predicted);
  }
  const r2 = ssTot > 1e-12 ? Math.max(0, Math.min(1, 1 - ssRes / ssTot)) : 1;
  const r = slope >= 0 ? Math.sqrt(r2) : -Math.sqrt(r2);

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
