import React from 'react';
import { ExperimentConfig } from '../../types/experiment';
import { VernierCalipersSim } from './VernierCalipersSim';
import { ScrewGaugeSim } from './ScrewGaugeSim';
import { SpherometerSim } from './SpherometerSim';
import { BeamBalanceSim } from './BeamBalanceSim';
import { ParallelogramSim } from './ParallelogramSim';
import { HelicalSpringSim } from './HelicalSpringSim';
import { SimplePendulumSim } from './SimplePendulumSim';
import { FlaskConical, Sparkles, CheckCircle2 } from 'lucide-react';

interface SimulatorContainerProps {
  experiment: ExperimentConfig;
  constants: Record<string, number>;
  onLogSimulatedRow: (newRowValues: Record<string, number>) => void;
}

const RIG_IDS = [
  'vernier-calipers',
  'screw-gauge',
  'spherometer',
  'beam-balance',
  'parallelogram-law',
  'helical-spring',
  'simple-pendulum',
];

export const SimulatorContainer: React.FC<SimulatorContainerProps> = ({
  experiment,
  constants,
  onLogSimulatedRow,
}) => {
  return (
    <div className="space-y-4">
      {experiment.id === 'vernier-calipers' && (
        <VernierCalipersSim
          zeroError={constants.zeroError || 0}
          onRecordRow={(row) => onLogSimulatedRow(row)}
        />
      )}

      {experiment.id === 'screw-gauge' && (
        <ScrewGaugeSim
          pitch={constants.pitch || 1.0}
          divisions={constants.circularDivisions || 100}
          zeroError={constants.zeroError || 0}
          onRecordRow={(row) => onLogSimulatedRow(row)}
        />
      )}

      {experiment.id === 'spherometer' && (
        <SpherometerSim
          pitch={constants.pitch || 1.0}
          divisions={constants.divisions || 100}
          legDistance={constants.legDistance || 4.25}
          onRecordRow={(row) => onLogSimulatedRow(row)}
        />
      )}

      {experiment.id === 'beam-balance' && (
        <BeamBalanceSim
          zeroRestingPoint={constants.zeroRestingPoint || 10.0}
          onRecordRow={(row) => onLogSimulatedRow(row)}
        />
      )}

      {experiment.id === 'parallelogram-law' && (
        <ParallelogramSim
          actualWeight={constants.actualWeight || 150}
          onRecordRow={(row) => onLogSimulatedRow(row)}
        />
      )}

      {experiment.id === 'helical-spring' && (
        <HelicalSpringSim
          initialReading={constants.initialReading || 14.5}
          g={constants.g || 9.8}
          onRecordRow={(row) => onLogSimulatedRow(row)}
        />
      )}

      {experiment.id === 'simple-pendulum' && (
        <SimplePendulumSim
          bobRadius={constants.bobRadius || 1.25}
          hookLength={constants.hookLength || 0.85}
          onRecordRow={(row) => onLogSimulatedRow(row)}
        />
      )}

      {!RIG_IDS.includes(experiment.id) && (
        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-5 sm:p-6 space-y-3">
          <div className="flex items-center gap-2">
            <FlaskConical className="w-4 h-4 text-stone-400" />
            <h3 className="text-sm sm:text-[15px] font-semibold tracking-tight">
              No virtual rig for this practical
            </h3>
          </div>
          <p className="text-[13px] text-stone-600 dark:text-stone-400 max-w-[70ch] leading-relaxed">
            {experiment.title.split(':')[0]} needs the real apparatus to take readings. The app still
            builds the table, the arithmetic, the error analysis and the record — enter your
            observations in the Observations tab, or log rows here as you take them.
          </p>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {experiment.apparatus.slice(0, 6).map((item) => (
              <span
                key={item}
                className="inline-flex items-center h-6 px-2.5 rounded-full border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-950 text-[11px] text-stone-600 dark:text-stone-400"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
