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
    </div>
  );
};
