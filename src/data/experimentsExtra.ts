import { ExperimentConfig } from '../types/experiment';
import { roundTo, calculateMean, computeLinearRegression, calculatePercentageError } from '../utils/math';
import { buildMeanErrorAnalysis } from '../utils/errorAnalysis';

/*
  Experiments E8 to E12, taken from the NCERT Class XI Laboratory Manual:
  the inclined plane, Young's modulus by Searle's apparatus, the helical spring
  by oscillation, Boyle's law, and surface tension by capillary rise.
*/

export const EXTRA_EXPERIMENTS: ExperimentConfig[] = [
  // ---------------------------------------------------------------------------
  // EXPERIMENT 8: INCLINED PLANE — FORCE vs sin θ
  // ---------------------------------------------------------------------------
  {
    id: 'inclined-plane',
    section: 'Section A',
    categoryTitle: 'Section A: Mechanics & Measurements',
    title: 'Inclined Plane: Downward Force vs sin θ',
    aim: 'To find the downward force along an inclined plane acting on a roller due to gravity, and to study its relationship with the angle of inclination by plotting a graph between force and sin θ.',
    ncertReference: 'NCERT Class XI Physics Lab Manual, Experiment E8, pp. 74–76',
    apparatus: [
      'Inclined plane with protractor and pulley',
      'Roller (small cylinder)',
      'Weight box with slotted weights',
      'Spring balance',
      'Spirit level',
      'Pan, thread and metre scale',
    ],
    theory:
      'A roller of mass M₁ rests on a plane inclined at θ. A string over a frictionless pulley at the top attaches it to a pan carrying a total mass (M₂ + M₃), so the tension in the string is W = (M₂ + M₃)g.\n\n' +
      'Let the pan be loaded so heavily that the roller stays at the top, then lightened in small steps until the roller just begins to move down the plane at constant velocity. At constant velocity the forces along the plane balance:\n\n' +
      'W = M₁g sin θ − fᵣ\n\n' +
      'where fᵣ is the force of rolling friction. If friction is small, W ∝ sin θ: a graph of W against sin θ is a straight line through (nearly) the origin, with slope M₁g and a small negative intercept equal to fᵣ.',
    formula:
      'W = (M₂ + M₃) g  (tension in the string)\n' +
      'W = M₁ g sin θ − fᵣ  (constant velocity, along the plane)\n' +
      'Slope of W vs sin θ = M₁ g  ⇒  M₁ = Slope / g\n' +
      'Intercept of W vs sin θ = −fᵣ',
    constants: [
      { id: 'g', label: 'Acceleration due to gravity', defaultValue: 9.8, unit: 'm/s²', step: 0.1 },
      { id: 'rollerMass', label: 'Mass of roller (M₁)', defaultValue: 100, unit: 'g', step: 1 },
      { id: 'panMass', label: 'Mass of pan (M₂)', defaultValue: 10, unit: 'g', step: 1 },
    ],
    columns: [
      { id: 'obs', label: 'S. No.', unit: '#', showMean: false },
      { id: 'theta', label: 'Angle of inclination θ', unit: '°', decimalPlaces: 0, placeholder: '30' },
      { id: 'sinTheta', label: 'sin θ', isDerived: true, decimalPlaces: 3, showMean: false },
      { id: 'm3', label: 'Mass added to pan (M₃)', unit: 'g', decimalPlaces: 1, placeholder: '38.0' },
      { id: 'force', label: 'Force W = (M₂+M₃)g', unit: 'N', isDerived: true, decimalPlaces: 3 },
    ],
    initialRows: [
      { obs: 1, theta: 15, m3: 13.8 },
      { obs: 2, theta: 20, m3: 22.2 },
      { obs: 3, theta: 25, m3: 30.2 },
      { obs: 4, theta: 30, m3: 38.0 },
      { obs: 5, theta: 35, m3: 45.3 },
      { obs: 6, theta: 40, m3: 52.2 },
    ],
    calculateRow: (row, constants) => {
      const g = Number(constants.g) || 9.8;
      const panMass = Number(constants.panMass) || 10;
      const theta = Number(row.theta) || 0;
      const m3 = Number(row.m3) || 0;

      const sinTheta = roundTo(Math.sin((theta * Math.PI) / 180), 4);
      const force = roundTo(((panMass + m3) * g) / 1000, 3);

      return { ...row, sinTheta, force };
    },
    calculateResult: (rows, constants) => {
      const g = Number(constants.g) || 9.8;
      const rollerMass = Number(constants.rollerMass) || 100;

      const valid = rows.filter(
        (r) => typeof r.sinTheta === 'number' && typeof r.force === 'number' && r.force > 0 && r.sinTheta > 0
      );
      const regression = computeLinearRegression(valid.map((r) => ({ x: r.sinTheta, y: r.force })));

      const slope = regression ? regression.slope : 0;
      const intercept = regression ? regression.intercept : 0;
      const massFromSlope = slope > 0 ? roundTo((slope / g) * 1000, 1) : 0;
      const friction = roundTo(Math.abs(intercept), 3);
      const expectedSlope = roundTo((rollerMass * g) / 1000, 3);
      const slopeError = expectedSlope > 0 ? roundTo((Math.abs(slope - expectedSlope) / expectedSlope) * 100, 2) : 0;

      return {
        steps: [
          {
            label: 'Tension in the string',
            formula: 'W = (M₂ + M₃) g / 1000',
            substitution: valid.length
              ? `For row 1: (${constants.panMass ?? 10} + ${valid[0].m3 ?? 0}) × ${g} / 1000`
              : '—',
            result: valid.length ? `${valid[0].force.toFixed(3)} N` : '—',
          },
          {
            label: 'Balancing forces along the plane',
            formula: 'W = M₁ g sin θ − fᵣ',
            substitution: 'At constant velocity the pull up the plane equals the component of weight down it, less rolling friction',
            result: 'W ∝ sin θ if friction is small',
          },
          {
            label: 'Slope of the W vs sin θ line',
            formula: 'Slope = ΔW / Δ(sin θ)',
            substitution: regression
              ? `Fitted over ${valid.length} readings`
              : 'Need at least two readings with different angles',
            result: regression ? `${slope.toFixed(3)} N` : '—',
          },
          {
            label: 'Mass of the roller from the slope',
            formula: 'M₁ = Slope / g',
            substitution: regression ? `${slope.toFixed(3)} / ${g} × 1000` : '—',
            result: slope > 0 ? `${massFromSlope.toFixed(1)} g (set value ${rollerMass} g)` : '—',
          },
        ],
        finalResult: regression
          ? `W = ${slope.toFixed(3)} sin θ ${intercept < 0 ? '−' : '+'} ${Math.abs(intercept).toFixed(3)} N — the downward force along the plane is proportional to sin θ, with rolling friction ≈ ${friction.toFixed(3)} N`
          : 'Add readings at two or more angles to fit the line',
        summaryCards: [
          { label: 'Slope (M₁g)', value: slope.toFixed(3), unit: 'N' },
          { label: 'Roller mass from slope', value: massFromSlope ? massFromSlope.toFixed(1) : '—', unit: 'g', subtext: `Slope differs from set value by ${slopeError.toFixed(2)} %` },
          { label: 'Rolling friction', value: friction.toFixed(3), unit: 'N', subtext: 'Magnitude of the intercept' },
          { label: 'Fit quality (R²)', value: regression ? regression.r2.toFixed(4) : '—' },
        ],
      };
    },
    graphConfig: {
      xAxisKey: 'sinTheta',
      yAxisKey: 'force',
      xLabel: 'sin θ',
      yLabel: 'Force (W)',
      xUnit: '',
      yUnit: 'N',
      calculateSlope: true,
      slopeFormula: 'Slope = ΔW / Δ(sin θ)',
      slopePhysicalMeaning: 'Slope = M₁ g, so the roller mass is Slope / g',
      expectedSlopeRange: '0.90 to 1.10 N for a 100 g roller',
      yInterceptOrigin: false,
    },
    precautions: [
      'Level the inclined plane with the spirit level before starting; a tilted bench makes θ meaningless.',
      'The pulley must turn freely — lubricate its axle, or the tension you read is not the tension in the string.',
      'Lighten the pan in small steps and note the load at which the roller just starts moving; do not push it.',
      'The roller must roll without slipping; a slipping roller gives static friction instead of rolling friction.',
      'See that the suspended pan hangs free and never touches the table or the bench edge.',
    ],
    sourcesOfError: [
      'Judging "constant velocity" by eye is the largest uncertainty in this experiment.',
      'Friction in the pulley adds to the tension, so W reads higher than the true pull on the roller.',
      'The surface of the inclined plane may not be uniformly smooth along its length.',
      'Slotted weights are rarely standardised to better than a few per cent.',
    ],
    vivaQuestions: [
      {
        category: 'Core Theory',
        q: 'Why is the graph plotted between W and sin θ rather than between W and θ?',
        a: 'Because the component of weight along the plane is M₁g sin θ. Plotting against sin θ linearises the relationship, so a straight line can be fitted and its slope read as M₁g. A plot against θ would be a sine curve, from which no slope can be taken.',
      },
      {
        category: 'Core Theory',
        q: 'What does the intercept of your graph represent?',
        a: 'A small negative intercept equal in magnitude to the force of rolling friction. At sin θ = 0 the plane is horizontal and the roller needs no pull to keep moving, but friction still has to be overcome, which shifts the line off the origin.',
      },
      {
        category: 'Precautions',
        q: 'Why must the roller move with constant velocity?',
        a: 'Only at constant velocity is the acceleration zero, so the forces along the plane balance exactly. If it accelerates, the net force is non-zero and the tension no longer equals M₁g sin θ − fᵣ.',
      },
      {
        category: 'Precautions',
        q: 'How would the result change on the Moon?',
        a: 'Both the component of weight and the tension scale with g, so the slope would fall to about one-sixth of its value and the derived mass would stay the same. The graph would simply be less steep.',
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // EXPERIMENT 9: YOUNG'S MODULUS — SEARLE'S APPARATUS
  // ---------------------------------------------------------------------------
  {
    id: 'youngs-modulus',
    section: 'Section A',
    categoryTitle: 'Section A: Mechanics & Measurements',
    title: "Young's Modulus: Searle's Apparatus",
    aim: "To determine Young's modulus of the material of a given wire using Searle's apparatus.",
    ncertReference: 'NCERT Class XI Physics Lab Manual, Experiment E9, pp. 78–81',
    apparatus: [
      "Searle's apparatus with two frames and a spirit level",
      'Experimental wire and identical reference wire',
      'Slotted weights (0.5 kg each) and hanger',
      'Screw gauge for the wire diameter',
      'Micrometer screw with 100 circular divisions',
      'Metre scale and spirit level',
    ],
    theory:
      "Searle's apparatus hangs two identical wires of the same material from one rigid support. The reference wire carries a constant weight to keep it taut; the experimental wire carries a hanger to which slotted weights are added. A spirit level rests on a crossbar supported between a knife edge on one frame and a micrometer screw on the other.\n\n" +
      'When the experimental wire extends, the frame drops, the crossbar tilts and the bubble moves off centre. Turning the micrometer screw brings the bubble back to the centre, and the distance the screw had to move is exactly the extension of the wire. Because the reference wire compensates for any sag of the support or change of temperature, only the extension of the experimental wire is measured.\n\n' +
      'For a wire of length L and radius r extending by l under a load M:\n\n' +
      'Y = MgL / (π r² l)\n\n' +
      'A graph of extension l against load M is a straight line through the origin whose slope is l/M, so Y = gL / (π r² × slope).',
    formula:
      "Y = M g L / (π r² l)\n" +
      'Slope of l vs M = l / M  (m per kg)\n' +
      'Y = g L / (π r² × slope)',
    constants: [
      { id: 'g', label: 'Acceleration due to gravity', defaultValue: 9.8, unit: 'm/s²', step: 0.1 },
      { id: 'wireLength', label: 'Length of experimental wire (L)', defaultValue: 2.0, unit: 'm', step: 0.01 },
      { id: 'wireDiameter', label: 'Mean diameter of wire (d)', defaultValue: 0.5, unit: 'mm', step: 0.001 },
      { id: 'zeroReading', label: 'Micrometer reading at zero load', defaultValue: 5.0, unit: 'mm', step: 0.01 },
    ],
    columns: [
      { id: 'obs', label: 'S. No.', unit: '#', showMean: false },
      { id: 'load', label: 'Load M', unit: 'kg', decimalPlaces: 2, placeholder: '1.00' },
      { id: 'reading', label: 'Micrometer reading', unit: 'mm', decimalPlaces: 2, placeholder: '5.50' },
      { id: 'extension', label: 'Extension l', unit: 'mm', isDerived: true, decimalPlaces: 2 },
    ],
    initialRows: [
      { obs: 1, load: 0.5, reading: 5.25 },
      { obs: 2, load: 1.0, reading: 5.5 },
      { obs: 3, load: 1.5, reading: 5.75 },
      { obs: 4, load: 2.0, reading: 6.0 },
      { obs: 5, load: 2.5, reading: 6.25 },
      { obs: 6, load: 3.0, reading: 6.49 },
    ],
    calculateRow: (row, constants) => {
      const zeroReading = Number(constants.zeroReading) || 0;
      const reading = Number(row.reading) || 0;
      return { ...row, extension: roundTo(reading - zeroReading, 2) };
    },
    calculateResult: (rows, constants) => {
      const g = Number(constants.g) || 9.8;
      const L = Number(constants.wireLength) || 2.0;
      const dMm = Number(constants.wireDiameter) || 0.5;

      const valid = rows.filter(
        (r) => typeof r.load === 'number' && r.load > 0 && typeof r.extension === 'number' && r.extension > 0
      );
      const regression = computeLinearRegression(
        valid.map((r) => ({ x: r.load, y: r.extension })),
        { throughOrigin: true }
      );

      const slopeMmPerKg = regression ? regression.slope : 0; // mm per kg
      const slopeMPerKg = slopeMmPerKg / 1000; // m per kg
      const rM = dMm / 2000; // radius in metres
      const area = Math.PI * rM * rM;
      const Y = slopeMPerKg > 0 ? (g * L) / (area * slopeMPerKg) : 0;
      const steelRef = 2.0e11;

      return {
        steps: [
          {
            label: 'Extension for each load',
            formula: 'l = micrometer reading − reading at zero load',
            substitution: `Reading at zero load = ${constants.zeroReading ?? 5} mm`,
            result: valid.length ? `l ranges from ${valid[0].extension.toFixed(2)} mm to ${valid[valid.length - 1].extension.toFixed(2)} mm` : '—',
          },
          {
            label: 'Slope of the extension–load line',
            formula: 'Slope = Δl / ΔM',
            substitution: regression ? `Fitted through the origin over ${valid.length} readings` : 'Need two or more readings',
            result: regression ? `${slopeMmPerKg.toFixed(4)} mm/kg` : '—',
          },
          {
            label: 'Cross-sectional area of the wire',
            formula: 'A = π r²,  r = d / 2',
            substitution: `r = ${dMm.toFixed(3)} / 2 mm = ${(rM * 1000).toFixed(4)} mm = ${rM.toExponential(2)} m`,
            result: `${area.toExponential(3)} m²`,
          },
          {
            label: "Young's modulus",
            formula: 'Y = g L / (π r² × slope)',
            substitution: `${g} × ${L} / (${area.toExponential(3)} × ${slopeMPerKg.toExponential(3)})`,
            result: Y > 0 ? `${Y.toExponential(3)} N/m²` : '—',
          },
        ],
        finalResult:
          Y > 0
            ? `Young's modulus Y = ${Y.toExponential(3)} N/m² (${(Y / 1e11).toFixed(2)} × 10¹¹ N/m²)`
            : 'Add readings to fit the extension–load line',
        percentageError:
          Y > 0
            ? {
                theoretical: steelRef,
                calculated: roundTo(Y, 0),
                errorPercent: calculatePercentageError(Y, steelRef).errorPercent,
                standardRef: 'Steel: 2.0 × 10¹¹ N/m²',
              }
            : undefined,
        summaryCards: [
          { label: "Young's modulus", value: Y > 0 ? Y.toExponential(2) : '—', unit: 'N/m²' },
          { label: 'Slope (l/M)', value: slopeMmPerKg ? slopeMmPerKg.toFixed(4) : '—', unit: 'mm/kg' },
          { label: 'Wire area', value: area.toExponential(2), unit: 'm²', subtext: `d = ${dMm.toFixed(3)} mm` },
          { label: 'Against steel', value: Y > 0 ? `${(Y / 1e11).toFixed(2)}` : '—', unit: '×10¹¹ N/m²', subtext: 'Reference 2.0 × 10¹¹ N/m²' },
        ],
      };
    },
    graphConfig: {
      xAxisKey: 'load',
      yAxisKey: 'extension',
      xLabel: 'Load (M)',
      yLabel: 'Extension (l)',
      xUnit: 'kg',
      yUnit: 'mm',
      calculateSlope: true,
      slopeFormula: 'Slope = Δl / ΔM',
      slopePhysicalMeaning: 'Y = gL / (π r² × slope)',
      expectedSlopeRange: '0.3 to 0.8 mm/kg for a 0.5 mm steel wire of 2 m',
      yInterceptOrigin: true,
    },
    precautions: [
      'Measure the diameter of the wire at five places and in two perpendicular directions at each place; a wire is never perfectly round.',
      'Add the load in steps of 0.5 kg and bring the bubble back to the centre each time before reading the micrometer.',
      'Always approach the final position of the micrometer screw from the same direction to avoid backlash error.',
      'Keep the reference wire loaded with its constant weight throughout so that both wires remain taut and straight.',
      'Do not exceed the elastic limit — if the wire does not return to its original length on unloading, the readings are void.',
    ],
    sourcesOfError: [
      'The wire may not be of uniform cross-section along its length.',
      'Backlash in the micrometer screw shifts the zero between the loading and unloading runs.',
      'The extension measured is very small (fractions of a millimetre), so the least count of the micrometer dominates the uncertainty.',
      'Slipping of the wire in its clamp adds an apparent extension that is not elastic.',
    ],
    vivaQuestions: [
      {
        category: 'Core Theory',
        q: "Why are two wires used in Searle's apparatus instead of one?",
        a: 'The reference wire carries a constant weight and supports the other end of the crossbar. Any sag of the support, change of temperature or yielding of the clamp affects both wires equally, so the spirit level only responds to the difference between them — the extension of the experimental wire alone.',
      },
      {
        category: 'Core Theory',
        q: "Why is Young's modulus called a modulus of elasticity and not a coefficient?",
        a: 'It is the ratio of longitudinal stress to longitudinal strain within the elastic limit, and for a given material it is a constant independent of the dimensions of the wire. That is what makes it a property of the material rather than of the sample.',
      },
      {
        category: 'Precautions',
        q: 'What is backlash error and how is it avoided?',
        a: 'When the direction of rotation of a screw is reversed, the nut and screw threads do not engage immediately, so the screw turns without advancing. It is avoided by always turning the screw the same way and reaching the reading from one side.',
      },
      {
        category: 'Precautions',
        q: 'What happens if the load exceeds the elastic limit?',
        a: 'The wire deforms plastically and does not recover its original length when the load is removed. The extension is then no longer proportional to the load, the graph stops being a straight line, and the value of Y obtained is meaningless.',
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // EXPERIMENT 10: HELICAL SPRING BY OSCILLATION — T² vs m
  // ---------------------------------------------------------------------------
  {
    id: 'spring-oscillation',
    section: 'Section B',
    categoryTitle: 'Section B: Oscillations & Gravitation',
    title: 'Helical Spring by Oscillation: T² vs m',
    aim: 'To find the force constant and the effective mass of a helical spring by plotting a T² – m graph using the method of oscillation.',
    ncertReference: 'NCERT Class XI Physics Lab Manual, Experiment E10, pp. 83–86',
    apparatus: [
      'Light helical spring with a pointer and hanger',
      'Rigid support and clamp stand',
      'Five slotted weights of 10 g (or 20 g)',
      'Balance to find the mass of the loads',
      'Measuring scale (15–30 cm)',
      'Stop-watch with a least count of 0.1 s',
    ],
    theory:
      'A load m hung from a spring of force constant K, pulled down slightly and released, oscillates with simple harmonic motion. The period is\n\n' +
      'T = 2π √(m / K)\n\n' +
      'if the spring itself is massless. A real spring has mass, and it behaves as if an extra effective mass m₀ were added to the load, so\n\n' +
      'T = 2π √((m + m₀) / K)\n\n' +
      'Squaring: T² = (4π²/K)(m + m₀). A graph of T² against m is therefore a straight line of slope 4π²/K and intercept 4π²m₀/K. The force constant follows from the slope, and the effective mass of the spring from intercept ÷ slope.',
    formula:
      'T = 2π √((m + m₀) / K)\n' +
      'T² = (4π²/K) m + (4π² m₀/K)\n' +
      'K = 4π² / slope\n' +
      'm₀ = intercept / slope',
    constants: [
      { id: 'oscillations', label: 'Oscillations timed (n)', defaultValue: 20, unit: 'count', step: 1 },
    ],
    columns: [
      { id: 'obs', label: 'S. No.', unit: '#', showMean: false },
      { id: 'mass', label: 'Load m', unit: 'kg', decimalPlaces: 3, placeholder: '0.040' },
      { id: 'time', label: 'Time for n oscillations (t)', unit: 's', decimalPlaces: 2, placeholder: '15.39' },
      { id: 'period', label: 'Period T = t/n', unit: 's', isDerived: true, decimalPlaces: 4, showMean: false },
      { id: 'tSquared', label: 'T²', unit: 's²', isDerived: true, decimalPlaces: 4, showMean: false },
    ],
    initialRows: [
      { obs: 1, mass: 0.02, time: 11.47 },
      { obs: 2, mass: 0.03, time: 13.57 },
      { obs: 3, mass: 0.04, time: 15.39 },
      { obs: 4, mass: 0.05, time: 17.02 },
      { obs: 5, mass: 0.06, time: 18.49 },
    ],
    calculateRow: (row, constants) => {
      const n = Number(constants.oscillations) || 20;
      const time = Number(row.time) || 0;
      const period = n > 0 ? roundTo(time / n, 4) : 0;
      return { ...row, period, tSquared: roundTo(period * period, 4) };
    },
    calculateResult: (rows, constants) => {
      const valid = rows.filter(
        (r) => typeof r.mass === 'number' && r.mass > 0 && typeof r.tSquared === 'number' && r.tSquared > 0
      );
      const regression = computeLinearRegression(valid.map((r) => ({ x: r.mass, y: r.tSquared })));

      const slope = regression ? regression.slope : 0;
      const intercept = regression ? regression.intercept : 0;
      const K = slope > 0 ? roundTo((4 * Math.PI * Math.PI) / slope, 2) : 0;
      const m0 = slope > 0 ? roundTo((intercept / slope) * 1000, 1) : 0; // grams

      return {
        steps: [
          {
            label: 'Period of oscillation',
            formula: 'T = t / n',
            substitution: `For row 1: ${valid[0]?.time?.toFixed(2) ?? '—'} s / ${constants.oscillations ?? 20}`,
            result: valid.length ? `${valid[0].period.toFixed(4)} s` : '—',
          },
          {
            label: 'Square of the period',
            formula: 'T² = (4π²/K)(m + m₀)',
            substitution: 'Plotting T² against m gives a straight line',
            result: 'Slope = 4π²/K, intercept = 4π²m₀/K',
          },
          {
            label: 'Slope of the T² – m line',
            formula: 'Slope = ΔT² / Δm',
            substitution: regression ? `Fitted over ${valid.length} readings` : 'Need two or more readings',
            result: regression ? `${slope.toFixed(3)} s²/kg` : '—',
          },
          {
            label: 'Force constant',
            formula: 'K = 4π² / slope',
            substitution: slope > 0 ? `4π² / ${slope.toFixed(3)}` : '—',
            result: K > 0 ? `${K.toFixed(2)} N/m` : '—',
          },
          {
            label: 'Effective mass of the spring',
            formula: 'm₀ = intercept / slope',
            substitution: slope > 0 ? `${intercept.toFixed(4)} / ${slope.toFixed(3)} × 1000` : '—',
            result: K > 0 ? `${m0.toFixed(1)} g` : '—',
          },
        ],
        finalResult:
          K > 0
            ? `Force constant K = ${K.toFixed(2)} N/m · effective mass of the spring m₀ = ${m0.toFixed(1)} g`
            : 'Add readings to fit the T² – m line',
        summaryCards: [
          { label: 'Force constant', value: K ? K.toFixed(2) : '—', unit: 'N/m' },
          { label: 'Effective mass m₀', value: K ? m0.toFixed(1) : '—', unit: 'g', subtext: 'Intercept ÷ slope' },
          { label: 'Slope (T²/m)', value: slope ? slope.toFixed(3) : '—', unit: 's²/kg' },
          { label: 'Fit quality (R²)', value: regression ? regression.r2.toFixed(4) : '—' },
        ],
      };
    },
    graphConfig: {
      xAxisKey: 'mass',
      yAxisKey: 'tSquared',
      xLabel: 'Load (m)',
      yLabel: 'Square of Period (T²)',
      xUnit: 'kg',
      yUnit: 's²',
      calculateSlope: true,
      slopeFormula: 'Slope = ΔT² / Δm',
      slopePhysicalMeaning: 'K = 4π² / slope; m₀ = intercept / slope',
      expectedSlopeRange: '10 to 16 s²/kg for a 3 N/m spring',
      yInterceptOrigin: false,
    },
    precautions: [
      'Pull the load down only slightly and release gently, so that the oscillation stays vertical and does not swing like a pendulum.',
      'Time a large number of oscillations (say 20) and divide, rather than timing one — the reaction-time error is then divided by n.',
      'Start the stop-watch as the pointer crosses the mean position, which is where it moves fastest and the timing error is smallest.',
      'The pointer must move freely over the scale without touching it, and the support must be truly rigid.',
      'Do not exceed the elastic limit; the spring must return to the same length after each load is removed.',
    ],
    sourcesOfError: [
      'Human reaction time at the start and stop of the stop-watch, divided over n oscillations.',
      'The spring may oscillate with a slight sideways swing, which changes the period.',
      'The scale and the eye may not be at the same level, giving a parallax error in the amplitude.',
      'If the spring is soft, the coils may close up under large loads and the motion stops being simple harmonic.',
    ],
    vivaQuestions: [
      {
        category: 'Core Theory',
        q: 'Why does the graph of T² against m not pass through the origin?',
        a: 'Because the spring itself has mass, and part of it moves with the load. It behaves as though an extra mass m₀ were added, so T² is proportional to (m + m₀), which shifts the line to the left of the origin by m₀.',
      },
      {
        category: 'Core Theory',
        q: 'What is the physical meaning of the intercept on the m-axis?',
        a: 'The negative intercept on the mass axis is the effective mass of the spring, m₀ — the part of the spring’s own mass that participates in the oscillation, roughly one third of the spring mass.',
      },
      {
        category: 'Precautions',
        q: 'Why is the time for 20 oscillations measured rather than the time for one?',
        a: 'The reaction-time error of a stop-watch is roughly constant at about 0.2 s. Timing twenty oscillations and dividing by twenty reduces that error per oscillation to about 0.01 s.',
      },
      {
        category: 'Precautions',
        q: 'How does the period change if the same load is hung from a stiffer spring?',
        a: 'The period falls, since T = 2π√((m + m₀)/K) — a larger K means a smaller T. The slope of the T² – m line would be smaller, which is exactly how the stiffer spring reveals its larger force constant.',
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // EXPERIMENT 11: BOYLE'S LAW — P vs V
  // ---------------------------------------------------------------------------
  {
    id: 'boyles-law',
    section: 'Section B',
    categoryTitle: 'Section B: Properties of Matter',
    title: "Boyle's Law: Volume vs Pressure of Air",
    aim: 'To study the variation in volume with pressure for a sample of air at constant temperature, by plotting graphs between P and V and between P and 1/V.',
    ncertReference: 'NCERT Class XI Physics Lab Manual, Experiment E11, pp. 89–93',
    apparatus: [
      "Boyle's law apparatus with two glass tubes",
      "Fortin's barometer",
      'Vernier callipers',
      'Thermometer',
      'Set square and spirit level',
    ],
    theory:
      "The apparatus has a closed tube AB and an open tube CD, joined at the bottom by pressure tubing and partly filled with mercury. Air is trapped above the mercury in the closed tube; its volume is proportional to the length of the trapped column, since the bore is uniform.\n\n" +
      'Raising or lowering the open tube changes the pressure on the enclosed air. If the mercury level in the open limb is h cm above that in the closed limb, the pressure of the enclosed air is\n\n' +
      'P = P₀ + h\n\n' +
      'where P₀ is the atmospheric pressure read from the barometer. Because the tube is of uniform cross-section, V = A × l, so the volume is proportional to the length of the air column.\n\n' +
      "Boyle's law states that at constant temperature PV = constant. A plot of P against V is therefore a hyperbola, while a plot of P against 1/V is a straight line through the origin whose slope is the constant PV.",
    formula:
      'P = P₀ + h  (cm of mercury)\n' +
      'V = A × l  (cm³), A = area of cross-section\n' +
      'PV = constant  (Boyle’s law, constant temperature)\n' +
      'Slope of P vs 1/V = PV',
    constants: [
      { id: 'atmPressure', label: 'Atmospheric pressure (P₀)', defaultValue: 76.0, unit: 'cm Hg', step: 0.1 },
      { id: 'tubeArea', label: 'Area of cross-section (A)', defaultValue: 0.196, unit: 'cm²', step: 0.001 },
    ],
    columns: [
      { id: 'obs', label: 'S. No.', unit: '#', showMean: false },
      { id: 'length', label: 'Length of air column (l)', unit: 'cm', decimalPlaces: 1, placeholder: '20.0' },
      { id: 'head', label: 'Mercury level difference (h)', unit: 'cm', decimalPlaces: 1, placeholder: '-6.9' },
      { id: 'volume', label: 'Volume V = A × l', unit: 'cm³', isDerived: true, decimalPlaces: 3 },
      { id: 'pressure', label: 'Pressure P = P₀ + h', unit: 'cm Hg', isDerived: true, decimalPlaces: 1 },
      { id: 'invV', label: '1/V', unit: 'cm⁻³', isDerived: true, decimalPlaces: 4, showMean: false },
      { id: 'pv', label: 'PV', unit: 'cm Hg·cm³', isDerived: true, decimalPlaces: 2, showMean: false },
    ],
    initialRows: [
      { obs: 1, length: 20.0, head: 0.0 },
      { obs: 2, length: 21.0, head: -3.5 },
      { obs: 3, length: 22.0, head: -6.9 },
      { obs: 4, length: 23.0, head: -10.1 },
      { obs: 5, length: 24.0, head: -13.2 },
    ],
    calculateRow: (row, constants) => {
      const P0 = Number(constants.atmPressure) || 76;
      const A = Number(constants.tubeArea) || 0.196;
      const length = Number(row.length) || 0;
      const head = Number(row.head) || 0;

      const volume = roundTo(A * length, 3);
      const pressure = roundTo(P0 + head, 1);
      const invV = volume > 0 ? roundTo(1 / volume, 4) : 0;
      const pv = roundTo(pressure * volume, 2);

      return { ...row, volume, pressure, invV, pv };
    },
    calculateResult: (rows) => {
      const valid = rows.filter(
        (r) => typeof r.volume === 'number' && r.volume > 0 && typeof r.pressure === 'number' && r.pressure > 0
      );
      const pvValues = valid.map((r) => r.pv).filter((v) => typeof v === 'number' && v > 0);
      const meanPV = calculateMean(pvValues, 2);
      const spread =
        meanPV > 0 ? roundTo(((Math.max(...pvValues) - Math.min(...pvValues)) / meanPV) * 100, 2) : 0;

      const regression = computeLinearRegression(
        valid.map((r) => ({ x: r.invV, y: r.pressure })),
        { throughOrigin: true }
      );

      return {
        steps: [
          {
            label: 'Pressure of the enclosed air',
            formula: 'P = P₀ + h',
            substitution: valid.length
              ? `P₀ = ${valid[0] ? (valid[0].pressure - (valid[0].head ?? 0)).toFixed(1) : '76.0'} cm Hg, with h taken positive when the open limb is higher`
              : '—',
            result: valid.length ? `${valid[0].pressure.toFixed(1)} cm Hg for the first reading` : '—',
          },
          {
            label: 'Volume of the enclosed air',
            formula: 'V = A × l',
            substitution: valid.length ? `A = ${valid[0].volume && valid[0].length ? (valid[0].volume / valid[0].length).toFixed(3) : '0.196'} cm² × l` : '—',
            result: valid.length ? `${valid[0].volume.toFixed(3)} cm³ for the first reading` : '—',
          },
          {
            label: 'Test of Boyle’s law',
            formula: 'PV = constant',
            substitution: `PV for all readings: ${pvValues.map((v) => v.toFixed(1)).join(', ')}`,
            result: `Mean PV = ${meanPV.toFixed(2)}, spread ${spread.toFixed(2)} %`,
          },
          {
            label: 'Slope of the P vs 1/V line',
            formula: 'Slope = ΔP / Δ(1/V) = PV',
            substitution: regression ? `Fitted through the origin over ${valid.length} readings` : 'Need two or more readings',
            result: regression ? `${regression.slope.toFixed(2)} cm Hg·cm³` : '—',
          },
        ],
        finalResult:
          meanPV > 0
            ? `PV = ${meanPV.toFixed(1)} cm Hg·cm³, constant to within ${spread.toFixed(1)} % — the volume of a fixed mass of air at constant temperature is inversely proportional to its pressure`
            : 'Add readings to test Boyle’s law',
        summaryCards: [
          { label: 'Mean PV', value: meanPV ? meanPV.toFixed(1) : '—', unit: 'cm Hg·cm³' },
          { label: 'Spread in PV', value: meanPV ? spread.toFixed(2) : '—', unit: '%', subtext: 'A measure of how constant PV really is' },
          { label: 'Slope (P vs 1/V)', value: regression ? regression.slope.toFixed(1) : '—', unit: 'cm Hg·cm³' },
          { label: 'Fit quality (R²)', value: regression ? regression.r2.toFixed(4) : '—' },
        ],
      };
    },
    graphConfig: {
      xAxisKey: 'invV',
      yAxisKey: 'pressure',
      xLabel: '1/V',
      yLabel: 'Pressure (P)',
      xUnit: 'cm⁻³',
      yUnit: 'cm Hg',
      calculateSlope: true,
      slopeFormula: 'Slope = ΔP / Δ(1/V)',
      slopePhysicalMeaning: 'Slope = PV, the constant in Boyle’s law',
      expectedSlopeRange: '250 to 350 cm Hg·cm³ for this apparatus',
      yInterceptOrigin: true,
    },
    precautions: [
      'Keep the temperature constant — do not handle the tubes with warm hands, and let the apparatus stand before reading.',
      'Check that the apparatus is vertical with a spirit level and set square, or the mercury levels will be misread.',
      'Tap the tubes gently before reading so that the mercury meniscus settles.',
      'Read both mercury levels with the eye level with the meniscus to avoid parallax.',
      'Move the open tube slowly; a sudden change compresses the air and heats it.',
    ],
    sourcesOfError: [
      'The trapped air is not perfectly dry; water vapour behaves as though it had its own pressure.',
      'The bore of the tube may not be exactly uniform, so V is not strictly proportional to l.',
      'Parallax in reading the two mercury levels.',
      'A slow leak past the rubber tubing or the closed end.',
    ],
    vivaQuestions: [
      {
        category: 'Core Theory',
        q: 'Why is a graph of P against 1/V plotted as well as P against V?',
        a: 'The P–V graph is a hyperbola, and it is hard to establish by eye whether a curve is a true rectangular hyperbola. Plotting P against 1/V converts the relationship into a straight line, whose straightness and slope are easy to check and to measure.',
      },
      {
        category: 'Core Theory',
        q: 'What does the slope of the P vs 1/V graph represent?',
        a: 'It equals PV, the constant in Boyle’s law for that sample of air at that temperature. Its constancy across all readings is the experimental proof that PV does not change.',
      },
      {
        category: 'Precautions',
        q: 'Why is the volume taken as proportional to the length of the air column?',
        a: 'Because the tube has a uniform bore, V = A × l with A constant. Only a change in length matters, so the volume can be measured with a scale instead of by collecting the gas.',
      },
      {
        category: 'Precautions',
        q: 'Why must the temperature be kept constant in this experiment?',
        a: 'Boyle’s law is a special case of the gas law at fixed temperature. If the air warms as it is compressed, the pressure rises for a second reason and PV is no longer constant.',
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // EXPERIMENT 12: SURFACE TENSION — CAPILLARY RISE
  // ---------------------------------------------------------------------------
  {
    id: 'surface-tension',
    section: 'Section B',
    categoryTitle: 'Section B: Properties of Matter',
    title: 'Surface Tension of Water: Capillary Rise',
    aim: 'To determine the surface tension of water by the capillary rise method.',
    ncertReference: 'NCERT Class XI Physics Lab Manual, Experiment E12, pp. 95–98',
    apparatus: [
      'Glass capillary tube',
      'Travelling microscope',
      'Beaker, cork with a pin, clamps and stand',
      'Thermometer',
      'Dilute nitric acid and caustic soda for cleaning',
      'Water and a plumb line',
    ],
    theory:
      'When a clean capillary tube is dipped into water, the liquid rises in it until the weight of the column is balanced by the upward force of surface tension acting round the circumference of the meniscus.\n\n' +
      'Weight of the column = π r² h ρ g\n' +
      'Upward force = 2 π r T cos θ\n\n' +
      'Water wets glass almost completely, so the angle of contact θ is close to zero and cos θ ≈ 1. Equating the two:\n\n' +
      'T = ρ g r h / 2\n\n' +
      'where r is the inner radius of the tube, h the height of the liquid column and ρ the density of water. The radius is found from the diameter of the bore, measured with a travelling microscope.',
    formula:
      '2 π r T cos θ = π r² h ρ g\n' +
      'For water, θ ≈ 0 so cos θ ≈ 1\n' +
      'T = ρ g r h / 2,  with r = d / 2',
    constants: [
      { id: 'rho', label: 'Density of water (ρ)', defaultValue: 1000, unit: 'kg/m³', step: 1 },
      { id: 'g', label: 'Acceleration due to gravity', defaultValue: 9.8, unit: 'm/s²', step: 0.1 },
      { id: 'tubeDiameter', label: 'Inner diameter of capillary (d)', defaultValue: 0.4, unit: 'mm', step: 0.01 },
      { id: 'temperature', label: 'Temperature of water', defaultValue: 20, unit: '°C', step: 1 },
    ],
    columns: [
      { id: 'obs', label: 'S. No.', unit: '#', showMean: false },
      { id: 'rise', label: 'Capillary rise (h)', unit: 'cm', decimalPlaces: 2, placeholder: '7.43' },
      { id: 'rise_m', label: 'Rise in metres (h)', unit: 'm', isDerived: true, decimalPlaces: 5 },
      { id: 'tension', label: 'Surface tension (T = ρgrh/2)', unit: 'N/m', isDerived: true, decimalPlaces: 5 },
    ],
    initialRows: [
      { obs: 1, rise: 7.42 },
      { obs: 2, rise: 7.45 },
      { obs: 3, rise: 7.43 },
      { obs: 4, rise: 7.44 },
      { obs: 5, rise: 7.43 },
    ],
    calculateRow: (row, constants) => {
      const rho = Number(constants.rho) || 1000;
      const g = Number(constants.g) || 9.8;
      const rM = (Number(constants.tubeDiameter) || 0.4) / 2000; // bore diameter in mm → radius in m
      const rise = Number(row.rise) || 0;
      const riseM = rise / 100; // cm → m
      const tension = roundTo((rho * g * rM * riseM) / 2, 5);

      return { ...row, rise_m: roundTo(riseM, 5), tension };
    },
    calculateResult: (rows, constants) => {
      const rho = Number(constants.rho) || 1000;
      const g = Number(constants.g) || 9.8;
      const dMm = Number(constants.tubeDiameter) || 0.4;
      const temperature = Number(constants.temperature) || 20;

      const rises = rows.map((r) => r.rise).filter((v) => typeof v === 'number' && v > 0);
      const meanH = calculateMean(rises, 3); // cm
      const meanHm = meanH / 100; // m
      const rM = dMm / 2000; // m
      const T = roundTo((rho * g * rM * meanHm) / 2, 5);

      // Surface tension of water falls with temperature; 0.0728 N/m at 20 °C.
      const standardT = roundTo(0.0756 - 0.00014 * temperature, 4);

      const errorAnalysis = buildMeanErrorAnalysis({
        symbol: 'h',
        quantity: 'Capillary rise',
        unit: 'cm',
        values: rises,
        decimals: 3,
        derived: [
          {
            symbol: 'T',
            quantity: 'Surface tension',
            unit: 'N/m',
            value: T,
            decimals: 5,
            factor: 1,
            basis: 'T ∝ h, so ΔT/T = Δh/h',
          },
        ],
        note: 'The radius of the bore is measured once with a travelling microscope, so its uncertainty is not propagated here.',
      });

      return {
        steps: [
          {
            label: 'Mean capillary rise',
            formula: 'h̄ = Σhᵢ / n',
            substitution: `(${rises.map((v) => v.toFixed(2)).join(' + ')}) / ${rises.length}`,
            result: `${meanH.toFixed(3)} cm`,
          },
          {
            label: 'Radius of the capillary bore',
            formula: 'r = d / 2',
            substitution: `${dMm.toFixed(3)} mm / 2`,
            result: `${(rM * 1000).toFixed(4)} mm = ${rM.toExponential(2)} m`,
          },
          {
            label: 'Surface tension',
            formula: 'T = ρ g r h / 2',
            substitution: `${rho} × ${g} × ${rM.toExponential(2)} × ${meanHm.toFixed(4)} / 2`,
            result: `${T.toFixed(5)} N/m`,
          },
          {
            label: 'Comparison with the standard value',
            formula: 'Percentage error = |T − T₀| / T₀ × 100',
            substitution: `T₀ at ${temperature} °C ≈ ${standardT.toFixed(4)} N/m`,
            result: `${calculatePercentageError(T, standardT).errorPercent}`,
          },
        ],
        finalResult: `Surface tension of water at ${temperature} °C = ${T.toFixed(4)} N/m (standard value ≈ ${standardT.toFixed(4)} N/m)`,
        percentageError: {
          theoretical: standardT,
          calculated: T,
          errorPercent: calculatePercentageError(T, standardT).errorPercent,
          standardRef: `Water at ${temperature} °C`,
        },
        summaryCards: [
          { label: 'Surface tension', value: T.toFixed(4), unit: 'N/m' },
          { label: 'Mean rise', value: meanH.toFixed(3), unit: 'cm' },
          { label: 'Bore radius', value: (rM * 1000).toFixed(4), unit: 'mm' },
          { label: 'Against standard', value: calculatePercentageError(T, standardT).errorPercent, subtext: `Reference ${standardT.toFixed(4)} N/m at ${temperature} °C` },
        ],
        errorAnalysis,
      };
    },
    precautions: [
      'Clean the capillary and the beaker with caustic soda and nitric acid, then rinse thoroughly with water; grease on the glass changes the angle of contact.',
      'Hold the tube vertical — check with a plumb line — otherwise the rise measured is not the true vertical rise.',
      'Read both the bottom of the meniscus and its top with the travelling microscope, and take the mean, because the meniscus is curved.',
      'Do not let the tube touch the bottom or the walls of the beaker.',
      'Note the temperature of the water; surface tension falls as the water warms.',
    ],
    sourcesOfError: [
      'The angle of contact is taken as zero, which is only approximately true even for clean water on clean glass.',
      'The bore of the capillary may not be circular or uniform along its length.',
      'The weight of the liquid in the meniscus above the flat level is neglected in the simple formula.',
      'The rise depends strongly on cleanliness; a trace of grease reduces it markedly.',
    ],
    vivaQuestions: [
      {
        category: 'Core Theory',
        q: 'Why does water rise in a capillary tube but mercury fall?',
        a: 'It depends on the angle of contact. Water wets glass with θ close to 0°, so cos θ is positive and the surface tension pulls the liquid up. Mercury does not wet glass, θ is about 140°, cos θ is negative, and the liquid is depressed.',
      },
      {
        category: 'Core Theory',
        q: 'Why does the rise decrease as the tube gets wider?',
        a: 'The upward force is proportional to the circumference (2πrT) while the weight of the column is proportional to the area (πr²hρg). Equating them gives h ∝ 1/r, so a wider tube rises less.',
      },
      {
        category: 'Precautions',
        q: 'Why is the capillary tube cleaned with acid and alkali before use?',
        a: 'To remove grease and dust from the inner wall. A greasy surface changes the angle of contact, which changes cos θ and therefore the height of the rise.',
      },
      {
        category: 'Precautions',
        q: 'Why is a travelling microscope used to measure the diameter?',
        a: 'The bore is well under a millimetre across, far too small for a vernier calipers to reach into. A travelling microscope can be focused on the bore and its cross-wire moved across it with a micrometer scale.',
      },
    ],
  },
];
