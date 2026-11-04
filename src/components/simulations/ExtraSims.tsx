import React, { useState } from 'react';
import { Check, Sparkles } from 'lucide-react';
import { roundTo } from '../../utils/math';

/* -------------------------------------------------------------------------- */
/*  Shared frame                                                              */
/* -------------------------------------------------------------------------- */

interface SimFrameProps {
  title: string;
  chip: string;
  hint: string;
  svg: React.ReactNode;
  controls: React.ReactNode;
  readout: React.ReactNode;
  recordLabel: string;
  recordNote: string;
  onRecord: () => void;
  justRecorded: boolean;
}

const SimFrame: React.FC<SimFrameProps> = ({
  title,
  chip,
  hint,
  svg,
  controls,
  readout,
  recordLabel,
  recordNote,
  onRecord,
  justRecorded,
}) => (
  <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-5 sm:p-6 space-y-5">
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 pb-4 border-b border-stone-100 dark:border-stone-800">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
          <h3 className="text-sm sm:text-[15px] font-semibold tracking-tight">{title}</h3>
          <span className="shrink-0 whitespace-nowrap font-mono text-[10.5px] text-stone-500 dark:text-stone-500">
            {chip}
          </span>
        </div>
        <p className="text-[11.5px] text-stone-500 dark:text-stone-400 mt-0.5">{hint}</p>
      </div>
    </div>

    <div className="w-full overflow-x-auto">
      <div className="py-1">{svg}</div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-4 items-center">
      <div className="space-y-2">{controls}</div>
      <div className="space-y-1.5 font-mono text-[12px]">
        {readout}
      </div>
      <div>
        <button
          onClick={onRecord}
          className={`w-full md:w-auto px-4 h-10 rounded-lg text-[13px] font-medium inline-flex items-center justify-center gap-2 transition-colors ${
            justRecorded
              ? 'bg-emerald-600 text-white'
              : 'bg-stone-900 dark:bg-stone-100 text-stone-50 dark:text-stone-900 hover:bg-black dark:hover:bg-white'
          }`}
        >
          {justRecorded ? <Check className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
          {justRecorded ? 'Logged' : recordLabel}
        </button>
        <p className="mt-1.5 text-[10.5px] text-center md:text-left text-stone-400 dark:text-stone-500 font-mono">
          {recordNote}
        </p>
      </div>
    </div>
  </div>
);

const Row: React.FC<{ label: string; value: string; strong?: boolean }> = ({ label, value, strong }) => (
  <div className="flex justify-between gap-3">
    <span className="text-stone-500 dark:text-stone-500">{label}</span>
    <span className={strong ? 'font-semibold text-stone-900 dark:text-stone-100' : 'text-stone-700 dark:text-stone-300'}>
      {value}
    </span>
  </div>
);

const Slider: React.FC<{
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  display: string;
  onChange: (v: number) => void;
}> = ({ label, value, min, max, step, display, onChange }) => (
  <div className="space-y-1.5">
    <div className="flex justify-between items-baseline text-[12px]">
      <span className="font-medium text-stone-700 dark:text-stone-300">{label}</span>
      <span className="font-mono font-semibold text-stone-900 dark:text-stone-100">{display}</span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      className="w-full accent-stone-900 dark:accent-stone-100 cursor-pointer"
      aria-label={label}
    />
  </div>
);

/* -------------------------------------------------------------------------- */
/*  E8 — inclined plane                                                       */
/* -------------------------------------------------------------------------- */

export const InclinedPlaneSim: React.FC<{
  g: number;
  panMass: number;
  rollerMass: number;
  onRecordRow: (row: { theta: number; m3: number }) => void;
}> = ({ g, panMass, rollerMass, onRecordRow }) => {
  const [theta, setTheta] = useState(25);
  const [m3, setM3] = useState(30.2);
  const [justRecorded, setJustRecorded] = useState(false);

  const FRICTION_N = 0.02;
  const sinT = Math.sin((theta * Math.PI) / 180);
  const neededTotalMass = ((rollerMass * g * sinT) / 1000 - FRICTION_N) / g * 1000; // g
  const requiredM3 = roundTo(neededTotalMass - panMass, 1);
  const diff = roundTo(m3 - requiredM3, 1);
  const state = Math.abs(diff) < 0.6 ? 'steady' : diff > 0 ? 'up' : 'down';

  const tan = Math.tan((theta * Math.PI) / 180);
  const baseY = 170;
  const leftX = 60;
  const rightX = 470;
  const rampTopY = baseY - (rightX - leftX) * tan;

  const record = () => {
    onRecordRow({ theta, m3 });
    setJustRecorded(true);
    setTimeout(() => setJustRecorded(false), 1600);
  };

  return (
    <SimFrame
      title="Inclined plane rig"
      chip={`θ = ${theta}°`}
      hint="Lighten the pan until the roller just starts moving down at constant velocity."
      svg={
        <svg viewBox="0 0 560 220" className="w-full min-w-[460px] h-auto" role="img" aria-label="Roller on an inclined plane with a pan over a pulley">
          <line x1={leftX} y1={baseY} x2={rightX} y2={rampTopY} stroke="#78716c" strokeWidth="3" />
          <line x1={leftX} y1={baseY} x2={rightX} y2={baseY} stroke="#d6d3d1" strokeWidth="1.5" strokeDasharray="4 4" />
          <path d={`M ${leftX} ${baseY} L ${rightX} ${baseY} L ${rightX} ${rampTopY} Z`} fill="#f5f3ef" opacity="0.5" />
          {/* angle arc */}
          <path d={`M ${leftX + 46} ${baseY} A 46 46 0 0 0 ${leftX + 46 * Math.cos((theta * Math.PI) / 180)} ${baseY - 46 * Math.sin((theta * Math.PI) / 180)}`} fill="none" stroke="#a8a29e" strokeWidth="1.5" />
          <text x={leftX + 54} y={baseY - 10} fontSize="11" fill="#78716c" fontFamily="JetBrains Mono, monospace">{theta}°</text>

          {/* roller */}
          <g transform={`translate(${(leftX + rightX) / 2}, ${baseY - ((rightX - leftX) / 2) * tan - 9})`}>
            <circle r="9" fill="#a8a29e" stroke="#57534e" strokeWidth="1.5" />
          </g>

          {/* pulley + string + pan */}
          <circle cx={rightX + 6} cy={rampTopY - 16} r="9" fill="#e7e5e4" stroke="#57534e" strokeWidth="1.5" />
          <line x1={(leftX + rightX) / 2} y1={baseY - ((rightX - leftX) / 2) * tan - 9} x2={rightX + 6} y2={rampTopY - 16} stroke="#57534e" strokeWidth="1.5" />
          <line x1={rightX + 15} y1={rampTopY - 16} x2={rightX + 15} y2={rampTopY + 40} stroke="#57534e" strokeWidth="1.5" />
          <rect x={rightX + 1} y={rampTopY + 40} width="28" height="22" rx="3" fill="#d6d3d1" stroke="#78716c" />
          <text x={rightX + 15} y={rampTopY + 55} fontSize="9" textAnchor="middle" fill="#44403c" fontFamily="JetBrains Mono, monospace">{m3.toFixed(0)}g</text>

          <text x={leftX} y={baseY + 26} fontSize="10" fill="#78716c" fontFamily="JetBrains Mono, monospace">
            roller {rollerMass} g · pan {panMass} g
          </text>
        </svg>
      }
      controls={
        <>
          <Slider label="Angle of inclination θ" value={theta} min={10} max={35} step={1} display={`${theta}°`} onChange={setTheta} />
          <Slider label="Mass in the pan M₃" value={m3} min={0} max={90} step={0.1} display={`${m3.toFixed(1)} g`} onChange={setM3} />
        </>
      }
      readout={
        <>
          <Row label="sin θ" value={sinT.toFixed(3)} />
          <Row label="W = (M₂+M₃)g" value={`${(((panMass + m3) * g) / 1000).toFixed(3)} N`} />
          <Row label="Roller" value={state === 'steady' ? 'just moving down' : state === 'up' ? 'pulled up the plane' : 'accelerating down'} strong />
        </>
      }
      recordLabel="Record this reading"
      recordNote={`θ = ${theta}°, M₃ = ${m3.toFixed(1)} g`}
      onRecord={record}
      justRecorded={justRecorded}
    />
  );
};

/* -------------------------------------------------------------------------- */
/*  E9 — Young's modulus                                                      */
/* -------------------------------------------------------------------------- */

export const YoungsModulusSim: React.FC<{
  g: number;
  wireLength: number;
  diameter: number;
  zeroReading: number;
  onRecordRow: (row: { load: number; reading: number }) => void;
}> = ({ g, wireLength, diameter, zeroReading, onRecordRow }) => {
  const [load, setLoad] = useState(1.0);
  const [justRecorded, setJustRecorded] = useState(false);

  const Y_TRUE = 2.0e11;
  const rM = diameter / 2000;
  const area = Math.PI * rM * rM;
  const extensionMm = ((load * g * wireLength) / (area * Y_TRUE)) * 1000;
  const reading = roundTo(zeroReading + extensionMm, 2);
  const tilt = Math.min(14, extensionMm * 7);

  const record = () => {
    onRecordRow({ load, reading });
    setJustRecorded(true);
    setTimeout(() => setJustRecorded(false), 1600);
  };

  return (
    <SimFrame
      title="Searle's apparatus"
      chip={`L = ${wireLength} m · d = ${diameter} mm`}
      hint="Add the load, then turn the micrometer until the spirit level is level again."
      svg={
        <svg viewBox="0 0 560 230" className="w-full min-w-[460px] h-auto" role="img" aria-label="Searle's apparatus with two wires and a spirit level">
          <rect x="60" y="14" width="440" height="10" rx="2" fill="#a8a29e" />
          {/* reference wire */}
          <line x1="170" y1="24" x2="170" y2="120" stroke="#78716c" strokeWidth="2" />
          <rect x="156" y="120" width="28" height="12" rx="2" fill="#d6d3d1" stroke="#78716c" />
          {/* experimental wire */}
          <line x1="390" y1="24" x2="390" y2={120 + tilt} stroke="#78716c" strokeWidth="2" />
          <rect x="376" y={120 + tilt} width="28" height="12" rx="2" fill="#d6d3d1" stroke="#78716c" />
          {/* frames + crossbar */}
          <line x1="170" y1="132" x2="390" y2={132 + tilt} stroke="#57534e" strokeWidth="3" />
          <rect x="270" y={126 + tilt / 2} width="34" height="26" rx="3" fill="#e7e5e4" stroke="#57534e" />
          <line x1="287" y1={152 + tilt / 2} x2="287" y2="196" stroke="#57534e" strokeWidth="2" />
          <rect x="272" y="196" width="30" height="18" rx="2" fill="#d6d3d1" stroke="#78716c" />
          <text x="287" y="209" fontSize="9" textAnchor="middle" fill="#44403c" fontFamily="JetBrains Mono, monospace">{load.toFixed(1)} kg</text>
          {/* spirit level */}
          <g transform={`rotate(${tilt} 280 116)`}>
            <rect x="222" y="108" width="116" height="14" rx="7" fill="#f5f5f4" stroke="#78716c" />
            <circle cx={280 + tilt * 2} cy="115" r="4.5" fill="#0f7b53" />
            <line x1="266" y1="108" x2="266" y2="122" stroke="#a8a29e" />
            <line x1="294" y1="108" x2="294" y2="122" stroke="#a8a29e" />
          </g>
          <text x="60" y="220" fontSize="10" fill="#78716c" fontFamily="JetBrains Mono, monospace">
            extension {extensionMm.toFixed(2)} mm
          </text>
        </svg>
      }
      controls={
        <Slider label="Load on the experimental wire" value={load} min={0.5} max={3} step={0.5} display={`${load.toFixed(1)} kg`} onChange={setLoad} />
      }
      readout={
        <>
          <Row label="Extension l" value={`${extensionMm.toFixed(3)} mm`} />
          <Row label="Zero-load reading" value={`${zeroReading.toFixed(2)} mm`} />
          <Row label="Micrometer reading" value={`${reading.toFixed(2)} mm`} strong />
        </>
      }
      recordLabel="Record this load"
      recordNote={`M = ${load.toFixed(1)} kg → ${reading.toFixed(2)} mm`}
      onRecord={record}
      justRecorded={justRecorded}
    />
  );
};

/* -------------------------------------------------------------------------- */
/*  E10 — spring by oscillation                                               */
/* -------------------------------------------------------------------------- */

export const SpringOscillationSim: React.FC<{
  oscillations: number;
  onRecordRow: (row: { mass: number; time: number }) => void;
}> = ({ oscillations, onRecordRow }) => {
  const [massG, setMassG] = useState(40);
  const [justRecorded, setJustRecorded] = useState(false);

  const K = 3.0; // N/m, the spring in the sim
  const M0 = 0.005; // kg, its effective mass
  const mKg = massG / 1000;
  const period = 2 * Math.PI * Math.sqrt((mKg + M0) / K);
  const totalTime = period * oscillations;

  const record = () => {
    onRecordRow({ mass: roundTo(mKg, 3), time: roundTo(totalTime, 2) });
    setJustRecorded(true);
    setTimeout(() => setJustRecorded(false), 1600);
  };

  return (
    <SimFrame
      title="Spring on a stand"
      chip={`n = ${oscillations} oscillations`}
      hint="Pull the load down slightly and release. Time a full set of oscillations from the mean position."
      svg={
        <svg viewBox="0 0 560 230" className="w-full min-w-[460px] h-auto" role="img" aria-label="Helical spring oscillating with a load">
          <style>{`@keyframes simBob { from { transform: translateY(0px); } to { transform: translateY(16px); } }`}</style>
          <rect x="150" y="16" width="260" height="8" rx="2" fill="#a8a29e" />
          <line x1="150" y1="16" x2="150" y2="40" stroke="#a8a29e" strokeWidth="3" />
          <path
            d="M 280 24 L 280 40 L 268 48 L 292 56 L 268 64 L 292 72 L 268 80 L 292 88 L 268 96 L 292 104 L 280 112"
            fill="none"
            stroke="#78716c"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <g style={{ animation: `simBob ${period}s ease-in-out infinite alternate` }}>
            <line x1="280" y1="112" x2="280" y2="140" stroke="#78716c" strokeWidth="1.5" />
            <circle cx="280" cy="152" r="13" fill="#d6d3d1" stroke="#57534e" strokeWidth="1.5" />
            <text x="280" y="156" fontSize="9" textAnchor="middle" fill="#44403c" fontFamily="JetBrains Mono, monospace">{massG}g</text>
            <line x1="304" y1="152" x2="330" y2="152" stroke="#57534e" strokeWidth="1.5" />
          </g>
          <line x1="330" y1="60" x2="330" y2="200" stroke="#d6d3d1" strokeWidth="1.5" />
          {[80, 110, 140, 170, 200].map((y) => (
            <line key={y} x1="326" y1={y} x2="334" y2={y} stroke="#a8a29e" />
          ))}
          <text x="340" y="206" fontSize="10" fill="#78716c" fontFamily="JetBrains Mono, monospace">scale</text>
        </svg>
      }
      controls={
        <Slider label="Load on the hanger" value={massG} min={10} max={60} step={5} display={`${massG} g`} onChange={setMassG} />
      }
      readout={
        <>
          <Row label="Period T" value={`${period.toFixed(3)} s`} />
          <Row label={`Time for ${oscillations}`} value={`${totalTime.toFixed(2)} s`} strong />
        </>
      }
      recordLabel="Record this run"
      recordNote={`m = ${mKg.toFixed(3)} kg → t = ${totalTime.toFixed(2)} s`}
      onRecord={record}
      justRecorded={justRecorded}
    />
  );
};

/* -------------------------------------------------------------------------- */
/*  E11 — Boyle's law                                                         */
/* -------------------------------------------------------------------------- */

export const BoylesLawSim: React.FC<{
  atmPressure: number;
  tubeArea: number;
  onRecordRow: (row: { length: number; head: number }) => void;
}> = ({ atmPressure, tubeArea, onRecordRow }) => {
  const [head, setHead] = useState(0);
  const [justRecorded, setJustRecorded] = useState(false);

  const referenceLength = 20; // cm of trapped air when the levels are equal
  const constant = atmPressure * referenceLength; // P × l
  const pressure = atmPressure + head;
  const length = pressure > 0 ? constant / pressure : referenceLength;
  const volume = roundTo(tubeArea * length, 3);

  const record = () => {
    onRecordRow({ length: roundTo(length, 1), head: roundTo(head, 1) });
    setJustRecorded(true);
    setTimeout(() => setJustRecorded(false), 1600);
  };

  // mercury levels
  const closedTop = 60;
  const closedLevel = closedTop + Math.min(110, length * 4);
  const openLevel = closedLevel - head * 1.6;
  const scale = (v: number) => Math.max(24, Math.min(190, v));

  return (
    <SimFrame
      title="Boyle's law apparatus"
      chip={`P₀ = ${atmPressure} cm Hg`}
      hint="Raise or lower the open limb and watch the trapped air change length."
      svg={
        <svg viewBox="0 0 560 230" className="w-full min-w-[460px] h-auto" role="img" aria-label="Two connected tubes with mercury and trapped air">
          {/* closed tube */}
          <rect x="196" y={closedTop - 16} width="26" height="150" fill="#f5f5f4" stroke="#78716c" strokeWidth="1.5" />
          <rect x="196" y={closedTop - 16} width="26" height={Math.min(110, length * 4)} fill="#bfdbfe" opacity="0.7" />
          <rect x="196" y={closedLevel} width="26" height={134 - (closedLevel - closedTop)} fill="#a8a29e" />
          {/* open tube */}
          <rect x="330" y="30" width="26" height="120" fill="#f5f5f4" stroke="#78716c" strokeWidth="1.5" />
          <rect x="330" y={scale(openLevel)} width="26" height={150 - (scale(openLevel) - 30)} fill="#a8a29e" />
          {/* connection */}
          <path d={`M 209 ${closedLevel + 20} L 209 200 L 343 200 L 343 ${scale(openLevel) + 20}`} fill="none" stroke="#78716c" strokeWidth="8" opacity="0.35" />
          <line x1="222" y1={closedLevel} x2="330" y2={scale(openLevel)} stroke="#9a3412" strokeWidth="1" strokeDasharray="4 3" />
          <text x="250" y={Math.min(closedLevel, scale(openLevel)) - 8} fontSize="10" fill="#9a3412" fontFamily="JetBrains Mono, monospace">
            h = {head.toFixed(1)} cm
          </text>
          <text x="196" y={closedTop - 24} fontSize="10" fill="#78716c" fontFamily="JetBrains Mono, monospace">trapped air</text>
          <text x="366" y="46" fontSize="10" fill="#78716c" fontFamily="JetBrains Mono, monospace">open</text>
        </svg>
      }
      controls={
        <Slider label="Level difference h (open limb higher = +)" value={head} min={-25} max={10} step={0.5} display={`${head.toFixed(1)} cm`} onChange={setHead} />
      }
      readout={
        <>
          <Row label="Pressure P" value={`${pressure.toFixed(1)} cm Hg`} />
          <Row label="Length l" value={`${length.toFixed(2)} cm`} />
          <Row label="Volume V" value={`${volume.toFixed(3)} cm³`} strong />
        </>
      }
      recordLabel="Record this reading"
      recordNote={`l = ${length.toFixed(1)} cm, h = ${head.toFixed(1)} cm`}
      onRecord={record}
      justRecorded={justRecorded}
    />
  );
};

/* -------------------------------------------------------------------------- */
/*  E12 — capillary rise                                                      */
/* -------------------------------------------------------------------------- */

export const CapillaryRiseSim: React.FC<{
  rho: number;
  g: number;
  temperature: number;
  onRecordRow: (row: { rise: number }) => void;
}> = ({ rho, g, temperature, onRecordRow }) => {
  const [diameterMm, setDiameterMm] = useState(0.4);
  const [justRecorded, setJustRecorded] = useState(false);

  const surfaceTension = 0.0756 - 0.00014 * temperature; // N/m, water at this temperature
  const rM = diameterMm / 2000;
  const riseM = (2 * surfaceTension) / (rho * g * rM);
  const riseCm = roundTo(riseM * 100, 2);

  const record = () => {
    onRecordRow({ rise: riseCm });
    setJustRecorded(true);
    setTimeout(() => setJustRecorded(false), 1600);
  };

  const waterTop = 150;
  const columnTop = Math.max(50, waterTop - Math.min(110, riseCm * 6));

  return (
    <SimFrame
      title="Capillary rise"
      chip={`water at ${temperature} °C`}
      hint="A narrower bore lifts the water higher — the rise goes as 1/r."
      svg={
        <svg viewBox="0 0 560 230" className="w-full min-w-[460px] h-auto" role="img" aria-label="Capillary tube dipped in a beaker of water">
          {/* beaker */}
          <path d="M 170 120 L 170 200 L 390 200 L 390 120" fill="none" stroke="#78716c" strokeWidth="2" />
          <rect x="172" y={waterTop} width="216" height={48} fill="#bfdbfe" opacity="0.65" />
          {/* capillary */}
          <rect x="274" y={columnTop - 10} width="14" height={waterTop - columnTop + 60} fill="#f5f5f4" stroke="#78716c" strokeWidth="1.2" />
          <rect x="275.5" y={columnTop} width="11" height={waterTop - columnTop} fill="#3b82f6" opacity="0.75" />
          <path d={`M 275.5 ${columnTop} Q 281 ${columnTop - 5} 286.5 ${columnTop}`} fill="none" stroke="#1d4ed8" strokeWidth="1.5" />
          <line x1="300" y1={columnTop} x2="380" y2={columnTop} stroke="#a8a29e" strokeDasharray="3 3" />
          <line x1="300" y1={waterTop} x2="380" y2={waterTop} stroke="#a8a29e" strokeDasharray="3 3" />
          <line x1="356" y1={columnTop} x2="356" y2={waterTop} stroke="#57534e" strokeWidth="1" />
          <text x="360" y={(columnTop + waterTop) / 2} fontSize="10" fill="#44403c" fontFamily="JetBrains Mono, monospace">h = {riseCm.toFixed(2)} cm</text>
          <text x="170" y="220" fontSize="10" fill="#78716c" fontFamily="JetBrains Mono, monospace">
            bore {diameterMm.toFixed(2)} mm
          </text>
        </svg>
      }
      controls={
        <Slider label="Inner diameter of the capillary" value={diameterMm} min={0.2} max={0.8} step={0.02} display={`${diameterMm.toFixed(2)} mm`} onChange={setDiameterMm} />
      }
      readout={
        <>
          <Row label="Surface tension" value={`${surfaceTension.toFixed(4)} N/m`} />
          <Row label="Bore radius" value={`${(rM * 1000).toFixed(3)} mm`} />
          <Row label="Rise h" value={`${riseCm.toFixed(2)} cm`} strong />
        </>
      }
      recordLabel="Record this rise"
      recordNote={`h = ${riseCm.toFixed(2)} cm at d = ${diameterMm.toFixed(2)} mm`}
      onRecord={record}
      justRecorded={justRecorded}
    />
  );
};
