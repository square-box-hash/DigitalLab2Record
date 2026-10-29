import React, { useState } from 'react';
import { GraphConfig } from '../types/experiment';
import { computeLinearRegression } from '../utils/math';
import {
  ResponsiveContainer,
  ComposedChart,
  Scatter,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { TrendingUp, Award, Activity, Compass } from 'lucide-react';

interface RegressionGraphProps {
  graphConfig: GraphConfig;
  rows: Array<Record<string, number>>;
  experimentId: string;
  constants?: Record<string, number>;
}

export const RegressionGraph: React.FC<RegressionGraphProps> = ({
  graphConfig,
  rows,
  experimentId,
  constants,
}) => {
  const [showSlopeTriangle, setShowSlopeTriangle] = useState(true);

  const rawData = rows
    .filter((r) => {
      const x = r[graphConfig.xAxisKey];
      const y = r[graphConfig.yAxisKey];
      // Both coordinates must be positive: a zero-extension or zero-load row is
      // not a valid data point and would drag the fitted slope towards zero.
      return typeof x === 'number' && typeof y === 'number' && !isNaN(x) && !isNaN(y) && isFinite(x) && isFinite(y) && x > 0 && y > 0;
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

  const gValue = constants?.g ?? 9.8;

  let physicsDerivedText = '';
  if (regression && experimentId === 'helical-spring') {
    const factor = 0.1 * gValue;
    const k = (regression.slope * factor).toFixed(1);
    physicsDerivedText = `Force Constant k = Slope × 0.1 × g = ${regression.slope.toFixed(2)} × ${factor.toFixed(2)} = ${k} N/m`;
  } else if (regression && experimentId === 'simple-pendulum') {
    const gVal = (39.4784 / regression.slope).toFixed(2);
    const secLen = (4 / regression.slope * 100).toFixed(1);
    physicsDerivedText = `g = 4π² / Slope = 39.4784 / ${regression.slope.toFixed(4)} = ${gVal} m/s² | Seconds Pendulum L_sec = ${secLen} cm`;
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden transition-colors">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-xs">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                Linear Regression & Best-Fit Graph
              </h3>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                y = mx + c
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Interactive scatter plot with Least-Squares best-fit regression line and slope triangulation.
            </p>
          </div>
        </div>

        {/* Slope & Correlation Highlights */}
        {regression && (
          <div className="flex items-center space-x-2 flex-wrap gap-y-2">
            <div className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono">
              <span className="text-slate-500 dark:text-slate-400 mr-1.5 font-sans font-medium">Slope (m):</span>
              <strong className="text-indigo-600 dark:text-indigo-400 font-bold text-sm">
                {regression.slope.toFixed(4)}
              </strong>
              <span className="text-slate-400 dark:text-slate-500 ml-1">
                {graphConfig.yUnit}/{graphConfig.xUnit}
              </span>
            </div>

            <div className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono">
              <span className="text-slate-500 dark:text-slate-400 mr-1.5 font-sans font-medium">Fit R²:</span>
              <strong className="text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                {regression.r2.toFixed(4)}
              </strong>
            </div>
          </div>
        )}
      </div>

      {/* Physics Interpretation Banner */}
      {physicsDerivedText && (
        <div className="px-5 py-3 bg-gradient-to-r from-emerald-50 via-indigo-50/40 to-white dark:from-emerald-950/40 dark:via-indigo-950/20 dark:to-slate-900 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2 text-slate-800 dark:text-slate-200">
            <Award className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="font-semibold">{physicsDerivedText}</span>
          </div>

          <button
            onClick={() => setShowSlopeTriangle(!showSlopeTriangle)}
            className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline ml-2"
          >
            {showSlopeTriangle ? 'Hide Δy/Δx Triangle' : 'Show Δy/Δx Triangle'}
          </button>
        </div>
      )}

      {/* Chart Canvas */}
      <div className="p-4 sm:p-6 bg-slate-50/30 dark:bg-slate-950/40">
        <div className="h-80 sm:h-96 w-full bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          {chartData.length < 2 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 text-sm">
              <Activity className="w-8 h-8 mb-2 animate-bounce text-slate-300 dark:text-slate-600" />
              <span>Enter at least 2 valid observation rows to plot best-fit graph</span>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 10, bottom: 25 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#94a3b833" />
                <XAxis
                  dataKey="x"
                  type="number"
                  name={graphConfig.xLabel}
                  unit={` ${graphConfig.xUnit}`}
                  tick={{ fill: '#64748b' }}
                  label={{
                    value: `${graphConfig.xLabel} [${graphConfig.xUnit}]`,
                    position: 'insideBottom',
                    offset: -15,
                    style: { fontSize: '12px', fill: '#64748b', fontWeight: 600 },
                  }}
                  domain={['dataMin - 0.05', 'dataMax + 0.05']}
                />
                <YAxis
                  dataKey="y"
                  type="number"
                  name={graphConfig.yLabel}
                  unit={` ${graphConfig.yUnit}`}
                  tick={{ fill: '#64748b' }}
                  label={{
                    value: `${graphConfig.yLabel} [${graphConfig.yUnit}]`,
                    angle: -90,
                    position: 'insideLeft',
                    offset: 5,
                    style: { fontSize: '12px', fill: '#64748b', fontWeight: 600 },
                  }}
                  domain={['dataMin - 0.1', 'dataMax + 0.1']}
                />
                <Tooltip
                  formatter={(value: any, name: any) => [
                    `${Number(value).toFixed(3)} ${name === 'Observed Point' ? graphConfig.yUnit : ''}`,
                    name,
                  ]}
                  labelFormatter={(xVal) => `${graphConfig.xLabel}: ${Number(xVal).toFixed(3)} ${graphConfig.xUnit}`}
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderColor: '#334155',
                    color: '#f8fafc',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontFamily: 'monospace',
                  }}
                />
                <Legend verticalAlign="top" height={36} />

                {/* Best Fit Line */}
                <Line
                  type="linear"
                  dataKey="fitY"
                  stroke="#6366f1"
                  strokeWidth={2.5}
                  dot={false}
                  name="Best-Fit Line (Least Squares)"
                  isAnimationActive={false}
                />

                {/* Experimental Scatter Points */}
                <Scatter
                  name="Observed Point"
                  dataKey="y"
                  fill="#10b981"
                  stroke="#059669"
                  strokeWidth={2}
                />
              </ComposedChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Slope Triangle Proof */}
        {regression && showSlopeTriangle && (
          <div className="mt-4 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                CBSE Slope Triangulation Proof
              </span>
              <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                {graphConfig.yInterceptOrigin
                  ? `Line Eq: y = ${regression.slope.toFixed(4)}x (through origin)`
                  : `Line Eq: y = ${regression.slope.toFixed(4)}x ${regression.intercept >= 0 ? `+ ${regression.intercept.toFixed(4)}` : `- ${Math.abs(regression.intercept).toFixed(4)}`}`}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <div className="text-[11px] text-slate-500 dark:text-slate-400">Selected Point A (x₁, y₁)</div>
                <div className="font-mono font-bold text-slate-900 dark:text-white mt-0.5">
                  ({regression.x1.toFixed(3)}, {regression.y1.toFixed(3)})
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <div className="text-[11px] text-slate-500 dark:text-slate-400">Selected Point B (x₂, y₂)</div>
                <div className="font-mono font-bold text-slate-900 dark:text-white mt-0.5">
                  ({regression.x2.toFixed(3)}, {regression.y2.toFixed(3)})
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                <div className="text-[11px] text-emerald-700 dark:text-emerald-300 font-semibold">
                  Slope m = Δy / Δx
                </div>
                <div className="font-mono font-extrabold text-emerald-900 dark:text-emerald-200 mt-0.5 text-sm">
                  {regression.slope.toFixed(4)} {graphConfig.yUnit}/{graphConfig.xUnit}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
