import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Sparkles, Check, ZoomIn } from 'lucide-react';
import { roundTo } from '../../utils/math';

interface SimplePendulumSimProps {
  onRecordRow: (row: { threadLength: number; t1: number; t2: number }) => void;
  bobRadius: number;
  hookLength: number;
}

export const SimplePendulumSim: React.FC<SimplePendulumSimProps> = ({
  onRecordRow,
  bobRadius,
  hookLength,
}) => {
  const [threadLength, setThreadLength] = useState<number>(77.9);
  const [amplitudeDeg, setAmplitudeDeg] = useState<number>(10);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [oscillationCount, setOscillationCount] = useState<number>(0);
  const [justRecorded, setJustRecorded] = useState(false);

  const effectiveLengthCm = roundTo(threadLength + bobRadius + hookLength, 1);
  const effectiveLengthM = effectiveLengthCm / 100;
  const theoreticalPeriod = roundTo(2 * Math.PI * Math.sqrt(effectiveLengthM / 9.8), 3);
  const theoretical20s = roundTo(theoreticalPeriod * 20, 1);

  const [currentAngleDeg, setCurrentAngleDeg] = useState<number>(0);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    let animId: number;

    if (isPlaying) {
      const animate = (time: number) => {
        if (!startTimeRef.current) startTimeRef.current = time;
        const totalElapsed = (time - startTimeRef.current) / 1000;
        setElapsedTime(totalElapsed);

        const omega = Math.sqrt(9.8 / effectiveLengthM);
        const theta = amplitudeDeg * Math.cos(omega * totalElapsed);
        setCurrentAngleDeg(theta);

        const completedCycles = Math.floor(totalElapsed / theoreticalPeriod);
        setOscillationCount(completedCycles);

        if (completedCycles >= 20) {
          setIsPlaying(false);
          setOscillationCount(20);
          return;
        }

        animId = requestAnimationFrame(animate);
      };
      animId = requestAnimationFrame(animate);
    } else {
      startTimeRef.current = null;
      setCurrentAngleDeg(0);
    }

    return () => cancelAnimationFrame(animId);
  }, [isPlaying, effectiveLengthM, amplitudeDeg, theoreticalPeriod]);

  const handleStartStop = () => {
    if (!isPlaying) {
      setElapsedTime(0);
      setOscillationCount(0);
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
  };

  const handleResetStopwatch = () => {
    setIsPlaying(false);
    setElapsedTime(0);
    setOscillationCount(0);
    setCurrentAngleDeg(0);
  };

  const handleRecord = () => {
    const recordedTime = elapsedTime > 5 ? roundTo(elapsedTime, 1) : theoretical20s;
    onRecordRow({
      threadLength: roundTo(threadLength, 1),
      t1: recordedTime,
      t2: roundTo(recordedTime + 0.2, 1),
    });
    setJustRecorded(true);
    setTimeout(() => setJustRecorded(false), 1800);
  };

  const lengthPresets = [
    { label: '70 cm', val: 67.9 },
    { label: '80 cm', val: 77.9 },
    { label: '90 cm', val: 87.9 },
    { label: '100 cm', val: 97.9 },
    { label: '110 cm', val: 107.9 },
    { label: '120 cm', val: 117.9 },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-5 sm:p-6 space-y-6 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-3">
        <div>
          <div className="flex items-center space-x-2.5">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              Interactive Simple Pendulum & Stopwatch Rig
            </h3>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              T = 2π√(L/g)
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Adjust pendulum length, trigger the stopwatch, and observe harmonic oscillations in real time.
          </p>
        </div>

        {/* Stopwatch Controls */}
        <div className="flex items-center space-x-2.5 self-start sm:self-auto">
          <button
            onClick={handleStartStop}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-md ${
              isPlaying
                ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-200 dark:shadow-none'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200 dark:shadow-none'
            }`}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isPlaying ? 'Pause Timing' : 'Start 20 Osc. Run'}</span>
          </button>

          <button
            onClick={handleResetStopwatch}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700"
            title="Reset Stopwatch"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Enlarged Visual Pendulum Rig (ViewBox 720 x 260) */}
      <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 rounded-2xl p-5 text-white shadow-xl border border-slate-800/80 overflow-hidden select-none">
        <div className="flex flex-wrap justify-between items-center text-xs sm:text-sm text-slate-400 mb-3 gap-2">
          <span className="font-medium text-slate-300 flex items-center gap-1.5">
            <ZoomIn className="w-4 h-4 text-indigo-400" />
            Split Cork Point of Suspension (S) & Heavy Spherical Bob
          </span>
          <div className="flex items-center space-x-4 bg-slate-900/90 px-4 py-2 rounded-xl border border-slate-700">
            <span className="font-mono text-amber-400 font-extrabold text-sm">
              Oscillations: {oscillationCount} / 20
            </span>
            <span className="text-slate-600">|</span>
            <span className="font-mono text-emerald-400 font-extrabold text-base">
              ⏱ {elapsedTime.toFixed(1)} s
            </span>
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          <svg viewBox="0 0 720 260" className="w-full min-w-[650px] h-72 sm:h-80">
            <defs>
              <radialGradient id="bobShineLg" cx="30%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="40%" stopColor="#eab308" />
                <stop offset="100%" stopColor="#854d0e" />
              </radialGradient>
            </defs>

            {/* Rigid Stand & Clamp */}
            <rect x="70" y="235" width="130" height="15" fill="#475569" rx="3" />
            <rect x="130" y="15" width="14" height="225" fill="#64748b" rx="2" />
            <rect x="130" y="15" width="260" height="14" fill="#64748b" rx="2" />

            {/* Split Cork at point of suspension S */}
            <rect x="348" y="22" width="24" height="20" fill="#d97706" rx="3" />
            <line x1="360" y1="22" x2="360" y2="42" stroke="#451a03" strokeWidth="1.5" strokeDasharray="3 3" />
            <text x="360" y="17" fill="#fde68a" fontSize="10" fontWeight="bold" textAnchor="middle">
              Split Cork S
            </text>

            {/* Mean Vertical Position Reference Line OA */}
            <line x1="360" y1="42" x2="360" y2="235" stroke="#475569" strokeWidth="1.5" strokeDasharray="4 4" />
            <text x="360" y="248" fill="#94a3b8" fontSize="10" fontWeight="bold" textAnchor="middle">
              Mean Position (OA)
            </text>

            {/* Swing Group: Pivot point (360, 42) rotated by currentAngleDeg */}
            {(() => {
              const pivotX = 360;
              const pivotY = 42;
              const visualThreadLen = 85 + (effectiveLengthCm / 120) * 105;

              return (
                <g transform={`rotate(${currentAngleDeg}, ${pivotX}, ${pivotY})`}>
                  {/* Cotton Thread */}
                  <line x1={pivotX} y1={pivotY} x2={pivotX} y2={pivotY + visualThreadLen} stroke="#f1f5f9" strokeWidth="2" />
                  
                  {/* Hook on Bob */}
                  <line x1={pivotX} y1={pivotY + visualThreadLen} x2={pivotX} y2={pivotY + visualThreadLen + 8} stroke="#eab308" strokeWidth="2.5" />

                  {/* Heavy Spherical Bob */}
                  <circle
                    cx={pivotX}
                    cy={pivotY + visualThreadLen + 22}
                    r="15"
                    fill="url(#bobShineLg)"
                    stroke="#a16207"
                    strokeWidth="2"
                  />
                  <circle cx={pivotX - 4} cy={pivotY + visualThreadLen + 18} r="3.5" fill="#ffffff" fillOpacity="0.6" />
                </g>
              );
            })()}

            {/* Metre scale indicator */}
            <line x1="490" y1="42" x2="490" y2="230" stroke="#38bdf8" strokeWidth="1.5" />
            <text x="502" y="135" fill="#38bdf8" fontSize="12" fontWeight="bold" fontFamily="monospace">
              Effective L = {effectiveLengthCm} cm ({effectiveLengthM.toFixed(3)} m)
            </text>
          </svg>
        </div>
      </div>

      {/* Control Sliders & Presets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-center">
        {/* Length Slider */}
        <div className="space-y-2 md:col-span-1">
          <div className="flex justify-between items-center text-xs sm:text-sm">
            <span className="font-bold text-slate-700 dark:text-slate-300">Thread Length (l):</span>
            <span className="font-mono font-extrabold text-indigo-600 dark:text-indigo-400 text-base">{threadLength.toFixed(1)} cm</span>
          </div>
          <input
            type="range"
            min="55.0"
            max="125.0"
            step="0.5"
            value={threadLength}
            onChange={(e) => setThreadLength(parseFloat(e.target.value))}
            className="w-full accent-indigo-600 cursor-pointer h-2 bg-slate-200 dark:bg-slate-700 rounded-lg"
          />

          <div className="flex flex-wrap gap-1.5 pt-1">
            {lengthPresets.map((pr) => (
              <button
                key={pr.label}
                onClick={() => setThreadLength(pr.val)}
                className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-slate-700 hover:text-indigo-700 dark:hover:text-indigo-300 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 font-medium transition-colors"
              >
                {pr.label}
              </button>
            ))}
          </div>
        </div>

        {/* Amplitude & Theory */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 text-xs sm:text-sm space-y-1.5 font-mono md:col-span-1 shadow-2xs">
          <div className="flex justify-between text-slate-600 dark:text-slate-400">
            <span>Effective L (l+r+e):</span>
            <strong className="text-slate-900 dark:text-white font-bold">{effectiveLengthCm.toFixed(1)} cm ({effectiveLengthM.toFixed(3)} m)</strong>
          </div>
          <div className="flex justify-between text-slate-600 dark:text-slate-400">
            <span>Theoretical Period T:</span>
            <strong className="text-emerald-700 dark:text-emerald-400 font-bold">{theoreticalPeriod.toFixed(3)} s</strong>
          </div>
          <div className="flex justify-between text-slate-600 dark:text-slate-400">
            <span>Time for 20 Osc:</span>
            <strong className="text-indigo-600 dark:text-indigo-400 font-bold">{theoretical20s.toFixed(1)} s</strong>
          </div>
          <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-sans">Amplitude θ:</span>
            <span className={`text-xs font-bold ${amplitudeDeg > 15 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
              {amplitudeDeg}° {amplitudeDeg <= 15 ? '(Valid SHM)' : '(Exceeds 15°)'}
            </span>
          </div>
        </div>

        {/* Log button */}
        <div className="md:col-span-1 flex flex-col justify-center">
          <button
            onClick={handleRecord}
            className={`w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center space-x-2 transition-all shadow-md ${
              justRecorded
                ? 'bg-emerald-600 text-white shadow-emerald-200'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200 dark:shadow-none'
            }`}
          >
            {justRecorded ? (
              <>
                <Check className="w-4 h-4" />
                <span>Logged to Table!</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Log Length & Timing to Table</span>
              </>
            )}
          </button>
          <span className="text-[11px] text-center text-slate-400 dark:text-slate-500 mt-1.5 font-mono">
            Transfers L = {effectiveLengthCm.toFixed(1)} cm, t = {elapsedTime > 5 ? elapsedTime.toFixed(1) : theoretical20s.toFixed(1)} s
          </span>
        </div>
      </div>
    </div>
  );
};
