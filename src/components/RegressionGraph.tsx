import React, { useRef, useState } from 'react';
import { GraphConfig } from '../types/experiment';
import { computeLinearRegression } from '../utils/math';
import { exportChartPng } from '../utils/chartExport';
import {
  ResponsiveContainer,
  ComposedChart,
  Scatter,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ReferenceDot,
} from 'recharts';
import { TrendingUp, Award, Activity, Compass, Download, Loader2 } from 'lucide-react';

interface RegressionGraphProps {
  graphConfig: GraphConfig;
  rows: Array<Record<string, number>>;
  experimentId: string;
  constants?: Record<string, number>;
  experimentTitle?: string;
}

const AXIS_TEXT = '#475569';
const AXIS_LINE = '#cbd5e1';

/** Compact tick labels: units live in the axis title, not on every tick. */
const formatTick = (value: number): string => {
  const abs = Math.abs(value);
  const decimals = abs >= 100 ? 0 : abs >= 10 ? 1 : 2;
  return value.toFixed(decimals);
};

export const RegressionGraph: React.FC<RegressionGraphProps> = ({
  graphConfig,
  rows,
  experimentId,
  constants,
  experimentTitle,
}) => {
  const [showSlopeTriangle, setShowSlopeTriangle] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const chartRef = useRef<HTMLDivElement>(null);

  const rawData = rows
    .filter((r) => {
      const x = r[graphConfig.xAxisKey];
      const y = r[graphConfig.yAxisKey];
      // Both coordinates must be positive: a zero-extension or zero-load row is
      // not a valid data point and would drag the fitted slope towards zero.
      return (
        typeof x === 'number' &&
        typeof y === 'number' &&
        !isNaN(x) &&
        !isNaN(y) &&
        isFinite(x) &&
        isFinite(y) &&
        x > 0 &&
        y > 0
      );
    })
    .map((r, i) => ({
      obs: i + 1,
      x: r[graphConfig.xAxisKey],
      y: r[graphConfig.yAxisKey],
    }));

  const regression = computeLinearRegression(rawData, {
    throughOrigin: graphConfig.yInterceptOrigin === true,
  });

  const chartData = rawData.map((d) => {
    const fitY = regression ? regression.slope * d.x + regression.intercept : d.y;
    return {
      obs: d.obs,
      x: d.x,
      y: d.y,
      fitY: Number(fitY.toFixed(4)),
    };
  });

  // Breathing room around the plotted points, so markers never sit on the axis.
  const xs = chartData.map((d) => d.x);
  const ys = chartData.map((d) => d.y);
  const xSpan = xs.length ? Math.max(...xs) - Math.min(...xs) : 1;
  const ySpan = ys.length ? Math.max(...ys) - Math.min(...ys) : 1;
  const xPad = xSpan > 0 ? xSpan * 0.08 : Math.abs(Math.min(...xs, 1)) * 0.2 || 1;
  const yPad = ySpan > 0 ? ySpan * 0.1 : Math.abs(Math.min(...ys, 1)) * 0.2 || 1;
  const xDomain: [number, number] = [
    Math.min(...xs, 0) - xPad,
    Math.max(...xs, 0) + xPad,
  ];
  const yDomain: [number, number] = [
    Math.min(...ys, 0) - yPad,
    Math.max(...ys, 0) + yPad,
  ];

  const gValue = constants?.g ?? 9.8;

  let physicsDerivedText = '';
  if (regression && experimentId === 'helical-spring') {
    const factor = 0.1 * gValue;
    const k = (regression.slope * factor).toFixed(1);
    physicsDerivedText = `Force Constant k = Slope × 0.1 × g = ${regression.slope.toFixed(2)} × ${factor.toFixed(2)} = ${k} N/m`;
  } else if (regression && experimentId === 'simple-pendulum') {
    const gVal = (39.4784 / regression.slope).toFixed(2);
    const secLen = ((4 / regression.slope) * 100).toFixed(1);
    physicsDerivedText = `g = 4π² / Slope = 39.4784 / ${regression.slope.toFixed(4)} = ${gVal} m/s² | Second's pendulum L = ${secLen} cm`;
  }

  const showTriangle = Boolean(regression) && showSlopeTriangle;

  const handleDownload = async () => {
    const svg = chartRef.current?.querySelector('svg');
    if (!svg || !regression) return;
    setIsExporting(true);
    setExportError(null);
    try {
      await exportChartPng(svg as SVGSVGElement, {
        title: experimentTitle ?? `${graphConfig.yLabel} vs ${graphConfig.xLabel}`,
        subtitle: `${graphConfig.yLabel} [${graphConfig.yUnit}] vs ${graphConfig.xLabel} [${graphConfig.xUnit}]  ·  slope = ${regression.slope.toFixed(4)} ${graphConfig.yUnit}/${graphConfig.xUnit}  ·  R² = ${regression.r2.toFixed(4)}`,
        legend: [
          { label: 'Observed points', color: '#10b981', kind: 'dot' },
          { label: 'Best-fit line (least squares)', color: '#6366f1', kind: 'line' },
        ],
        fileName: `${experimentId}-graph.png`,
      });
    } catch {
      setExportError('Could not create the image — try again, or take a screenshot of the graph.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden transition-colors">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-3 min-w-0">
          <div className="w-9 h-9 shrink-0 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-xs">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white tracking-tight leading-snug">
                Linear Regression &amp; Best-Fit Graph
              </h3>
              <span className="shrink-0 whitespace-nowrap text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                y = mx + c
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Least-squares fit with slope triangulation. Download the graph on a white sheet for your record.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-start md:self-auto">
          {regression && (
            <div className="flex items-center gap-2">
              <div className="px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-mono whitespace-nowrap">
                <span className="text-slate-500 dark:text-slate-400 font-sans">Slope</span>{' '}
                <strong className="text-indigo-600 dark:text-indigo-400">
                  {regression.slope.toFixed(3)}
                </strong>
              </div>
              <div className="px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-mono whitespace-nowrap">
                <span className="text-slate-500 dark:text-slate-400 font-sans">R²</span>{' '}
                <strong className="text-emerald-600 dark:text-emerald-400">
                  {regression.r2.toFixed(4)}
                </strong>
              </div>
            </div>
          )}

          <button
            onClick={handleDownload}
            disabled={!regression || isExporting || chartData.length < 2}
            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-xs"
          >
            {isExporting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
            <span>{isExporting ? 'Saving…' : 'Download'}</span>
            <span className="hidden sm:inline">PNG</span>
          </button>
        </div>
      </div>

      {/* Physics interpretation banner */}
      {physicsDerivedText && (
        <div className="px-4 sm:px-5 py-2.5 bg-gradient-to-r from-emerald-50 via-indigo-50/40 to-white dark:from-emerald-950/40 dark:via-indigo-950/20 dark:to-slate-900 border-b border-slate-100 dark:border-slate-800 flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-2 text-[11px] sm:text-xs text-slate-800 dark:text-slate-200">
            <Award className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <span className="font-semibold leading-snug">{physicsDerivedText}</span>
          </div>
          <button
            onClick={() => setShowSlopeTriangle((prev) => !prev)}
            className="self-start sm:self-auto shrink-0 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            {showSlopeTriangle ? 'Hide Δy/Δx triangle' : 'Show Δy/Δx triangle'}
          </button>
        </div>
      )}

      {/* Chart */}
      <div className="p-3 sm:p-6">
        {chartData.length < 2 ? (
          <div className="h-64 flex flex-col items-center justify-center text-slate-400 text-sm gap-2">
            <Activity className="w-8 h-8 text-slate-300 dark:text-slate-600" />
            <span>Enter at least 2 valid observation rows to plot the best-fit graph</span>
          </div>
        ) : (
          <>
            {/* Legend + axis titles live in HTML, so they never collide with the plot */}
            <div className="flex flex-wrap items-center justify-between gap-2 px-1 pb-2">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] font-mono text-slate-600 dark:text-slate-300">
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-[3px] w-5 rounded-full bg-indigo-500" />
                  Best-fit line
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  Observed points
                </span>
              </div>
              <span className="text-[11px] font-mono font-semibold text-slate-500 dark:text-slate-400">
                ↑ {graphConfig.yLabel} [{graphConfig.yUnit}]
              </span>
            </div>

            <div
              ref={chartRef}
              className="h-[300px] sm:h-[380px] w-full bg-white rounded-xl p-1 sm:p-2"
            >
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData} margin={{ top: 12, right: 16, left: 4, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#94a3b833" />
                  <XAxis
                    dataKey="x"
                    type="number"
                    domain={xDomain}
                    tickFormatter={formatTick}
                    tick={{ fill: AXIS_TEXT, fontSize: 11 }}
                    tickMargin={8}
                    minTickGap={26}
                    axisLine={{ stroke: AXIS_LINE }}
                    tickLine={{ stroke: AXIS_LINE }}
                  />
                  <YAxis
                    dataKey="y"
                    type="number"
                    domain={yDomain}
                    tickFormatter={formatTick}
                    tick={{ fill: AXIS_TEXT, fontSize: 11 }}
                    tickMargin={6}
                    width={46}
                    minTickGap={18}
                    axisLine={{ stroke: AXIS_LINE }}
                    tickLine={{ stroke: AXIS_LINE }}
                  />
                  <Tooltip
                    formatter={(value: any, name: any) => [
                      `${Number(value).toFixed(3)} ${name === 'Observed point' ? graphConfig.yUnit : ''}`.trim(),
                      name,
                    ]}
                    labelFormatter={(xVal) =>
                      `${graphConfig.xLabel}: ${Number(xVal).toFixed(3)} ${graphConfig.xUnit}`
                    }
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      borderColor: '#334155',
                      color: '#f8fafc',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontFamily: 'ui-monospace, SFMono-Regular, monospace',
                    }}
                  />

                  {/* Δy / Δx triangulation drawn on the line itself */}
                  {showTriangle && regression && (
                    <>
                      <ReferenceLine
                        segment={[
                          { x: regression.x1, y: regression.y1 },
                          { x: regression.x2, y: regression.y1 },
                        ]}
                        stroke="#94a3b8"
                        strokeDasharray="4 4"
                        strokeWidth={1.5}
                      />
                      <ReferenceLine
                        segment={[
                          { x: regression.x2, y: regression.y1 },
                          { x: regression.x2, y: regression.y2 },
                        ]}
                        stroke="#94a3b8"
                        strokeDasharray="4 4"
                        strokeWidth={1.5}
                      />
                      <ReferenceDot
                        x={regression.x1}
                        y={regression.y1}
                        r={3.5}
                        fill="#6366f1"
                        stroke="#ffffff"
                        strokeWidth={1.5}
                      />
                      <ReferenceDot
                        x={regression.x2}
                        y={regression.y2}
                        r={3.5}
                        fill="#6366f1"
                        stroke="#ffffff"
                        strokeWidth={1.5}
                      />
                    </>
                  )}

                  <Line
                    type="linear"
                    dataKey="fitY"
                    stroke="#6366f1"
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={false}
                    name="Best-fit line"
                    isAnimationActive={false}
                  />

                  <Scatter
                    name="Observed point"
                    dataKey="y"
                    fill="#10b981"
                    stroke="#ffffff"
                    strokeWidth={1.5}
                    isAnimationActive={false}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            <div className="text-center text-[11px] font-mono font-semibold text-slate-500 dark:text-slate-400 pt-2">
              {graphConfig.xLabel} [{graphConfig.xUnit}] →
            </div>

            {exportError && (
              <p className="mt-2 text-[11px] text-rose-600 dark:text-rose-400 text-center">
                {exportError}
              </p>
            )}
          </>
        )}
      </div>

      {/* Slope triangle proof */}
      {regression && showSlopeTriangle && (
        <div className="mx-3 sm:mx-6 mb-4 sm:mb-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              CBSE slope triangulation
            </span>
            <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
              {graphConfig.yInterceptOrigin
                ? `y = ${regression.slope.toFixed(4)}x (through origin)`
                : `y = ${regression.slope.toFixed(4)}x ${regression.intercept >= 0 ? '+' : '−'} ${Math.abs(regression.intercept).toFixed(4)}`}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
              <div className="text-[10px] text-slate-500 dark:text-slate-400">Point A (x₁, y₁)</div>
              <div className="font-mono font-bold text-slate-900 dark:text-white mt-0.5 text-[11px]">
                ({regression.x1.toFixed(2)}, {regression.y1.toFixed(2)})
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
              <div className="text-[10px] text-slate-500 dark:text-slate-400">Point B (x₂, y₂)</div>
              <div className="font-mono font-bold text-slate-900 dark:text-white mt-0.5 text-[11px]">
                ({regression.x2.toFixed(2)}, {regression.y2.toFixed(2)})
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
              <div className="text-[10px] text-slate-500 dark:text-slate-400">Δx, Δy</div>
              <div className="font-mono font-bold text-slate-900 dark:text-white mt-0.5 text-[11px]">
                {regression.deltaX.toFixed(2)}, {regression.deltaY.toFixed(2)}
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
              <div className="text-[10px] text-emerald-700 dark:text-emerald-300 font-semibold">
                Slope = Δy / Δx
              </div>
              <div className="font-mono font-extrabold text-emerald-900 dark:text-emerald-200 mt-0.5 text-[11px]">
                {regression.slope.toFixed(4)} {graphConfig.yUnit}/{graphConfig.xUnit}
              </div>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            {graphConfig.slopePhysicalMeaning}
            {graphConfig.expectedSlopeRange ? ` · Expected range: ${graphConfig.expectedSlopeRange}` : ''}
          </p>
        </div>
      )}
    </div>
  );
};
