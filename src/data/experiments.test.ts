import { describe, expect, it } from 'vitest';
import { EXPERIMENTS } from './experiments';
import type { ExperimentConfig } from '../types/experiment';

/**
 * The arithmetic is the product. These tests pin it.
 *
 * Every practical ships with seed readings. Those readings, run through the
 * same `calculateRow` → `calculateResult` pipeline the UI uses, produce the
 * numbers a student writes into their record. If a formula, a rounding call or
 * a column order changes, the printed record changes silently — this file is
 * what notices.
 *
 * The viva bank cannot do this job: its model answers are authored strings, not
 * computed values, so it would keep revealing confident answers while the
 * observation table printed the wrong figure.
 */

const EXPECTED_IDS = [
  'vernier-calipers',
  'screw-gauge',
  'spherometer',
  'beam-balance',
  'parallelogram-law',
  'helical-spring',
  'simple-pendulum',
  'inclined-plane',
  'youngs-modulus',
  'spring-oscillation',
  'boyles-law',
  'surface-tension',
];

const defaultsOf = (exp: ExperimentConfig): Record<string, number> =>
  Object.fromEntries(exp.constants.map((c) => [c.id, c.defaultValue]));

/** Runs the seed readings through the real pipeline, exactly as the UI does. */
const seeded = (exp: ExperimentConfig) => {
  const constants = defaultsOf(exp);
  const rows = exp.initialRows.map((row) => exp.calculateRow({ ...row }, constants));
  const result = exp.calculateResult(
    rows.map((r) => ({ ...r })),
    constants
  );
  return { rows, result };
};

/** Only the columns the app derives — the typed-in readings are the fixture. */
const derivedCells = (exp: ExperimentConfig, rows: Array<Record<string, number>>) => {
  const derived = exp.columns.filter((c) => c.isDerived).map((c) => c.id);
  return rows.map((row) => Object.fromEntries(derived.map((id) => [id, row[id]])));
};

const byId = (id: string): ExperimentConfig => {
  const exp = EXPERIMENTS.find((e) => e.id === id);
  if (!exp) throw new Error(`experiment "${id}" is missing from EXPERIMENTS`);
  return exp;
};

const cardValue = (id: string, label: string): string => {
  const { result } = seeded(byId(id));
  const card = (result.summaryCards ?? []).find((c) => c.label === label);
  if (!card) {
    throw new Error(
      `"${id}" has no summary card labelled "${label}". If it was renamed on purpose, update this test.`
    );
  }
  return card.value;
};

describe('the Class XI practicals', () => {
  it('are all twelve, in the documented order', () => {
    expect(EXPERIMENTS.map((exp) => exp.id)).toEqual(EXPECTED_IDS);
  });

  it('have unique ids', () => {
    expect(new Set(EXPECTED_IDS).size).toBe(EXPECTED_IDS.length);
  });

  it('all carry the sections the README claims', () => {
    const sectionA = EXPERIMENTS.filter((e) => e.section === 'Section A').map((e) => e.id);
    const sectionB = EXPERIMENTS.filter((e) => e.section === 'Section B').map((e) => e.id);
    expect(sectionA.length).toBe(8);
    expect(sectionB.length).toBe(4);
  });
});

describe.each(EXPERIMENTS.map((exp) => [exp.id, exp] as [string, ExperimentConfig]))(
  '%s',
  (_id, exp) => {
    it('produces the seeded numbers last reviewed', () => {
      const { rows, result } = seeded(exp);

      expect({
        derivedRows: derivedCells(exp, rows),
        finalResult: result.finalResult,
        summaryCards: result.summaryCards ?? null,
        percentageError: result.percentageError ?? null,
        errorEntries: result.errorAnalysis?.entries ?? null,
        stepResults: result.steps.map((step) => [step.label, step.result]),
      }).toMatchSnapshot();
    });

    it('returns one row per seeded reading, with finite cells', () => {
      const { rows } = seeded(exp);
      expect(rows.length).toBe(exp.initialRows.length);

      // Surface tension has no derived columns — every cell is typed in — so
      // this only asserts over whatever each practical actually computes.
      const derived = exp.columns.filter((c) => c.isDerived).map((c) => c.id);
      for (const row of rows) {
        for (const id of derived) {
          expect(typeof row[id], `${exp.id}.${id}`).toBe('number');
          expect(Number.isFinite(row[id]), `${exp.id}.${id} is not finite`).toBe(true);
        }
      }
    });

    it('states a final result and shows its working', () => {
      const { result } = seeded(exp);
      expect(result.finalResult.trim().length).toBeGreaterThan(0);
      expect(result.steps.length).toBeGreaterThan(0);
      for (const step of result.steps) {
        expect(step.result.trim().length).toBeGreaterThan(0);
      }
    });
  }
);

/**
 * Anchors. The snapshot above would happily accept a wrong number if someone
 * regenerated it with `-u`; these assert the handful of values a student or a
 * teacher would immediately recognise as wrong.
 */
describe('numbers a student would notice', () => {
  it('Vernier calipers: mean diameter, area and volume of the seeded cylinder', () => {
    expect(cardValue('vernier-calipers', 'Mean Diameter')).toBe('2.15');
    expect(cardValue('vernier-calipers', 'Cross-sectional Area')).toBe('3.631');
    expect(cardValue('vernier-calipers', 'Calculated Volume')).toBe('17.608');
  });

  it('Vernier calipers: propagates the mean absolute error into a CBSE notation', () => {
    const { result } = seeded(byId('vernier-calipers'));
    const d = (result.errorAnalysis?.entries ?? []).find((e) => e.symbol === 'D');
    expect(d?.notation).toBe('D = (2.148 ± 0.006) cm');
  });

  it('Simple pendulum: g comes out at 9.80 m/s² from the L–T² slope', () => {
    expect(cardValue('simple-pendulum', 'Calculated g')).toBe('9.80');
  });

  it("Simple pendulum: a second's pendulum is about 99.3 cm", () => {
    expect(cardValue('simple-pendulum', 'Second’s Pendulum Length')).toBe('99.3');
  });

  it("Young's modulus: steel-like 2.00 × 10¹¹ N/m²", () => {
    expect(cardValue('youngs-modulus', "Young's modulus")).toBe('2.00e+11');
  });

  it('Surface tension: water at 20 °C comes out at 0.0728 N/m', () => {
    expect(cardValue('surface-tension', 'Surface tension')).toBe('0.0728');
  });

  it("Boyle's law: PV stays constant across the seeded column", () => {
    expect(cardValue('boyles-law', 'Mean PV')).toBe('297.4');
  });
});
