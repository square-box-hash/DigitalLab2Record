import { ExperimentConfig } from '../types/experiment';
import { roundTo, calculateMean, computeLinearRegression, calculatePercentageError } from '../utils/math';

export const EXPERIMENTS: ExperimentConfig[] = [
  // --------------------------------------------------------------------------
  // EXPERIMENT 1: VERNIER CALIPERS
  // --------------------------------------------------------------------------
  {
    id: 'vernier-calipers',
    section: 'Section A',
    categoryTitle: 'Section A: Mechanics & Measurements',
    title: 'Vernier Calipers: Dimensions & Volume',
    aim: 'To measure the diameter and length of a small cylindrical/spherical body using Vernier Calipers and hence calculate its volume and cross-sectional area.',
    ncertReference: 'NCERT Class XI Physics Lab Manual, Experiment E1, pp. 23–32',
    apparatus: [
      'Vernier Calipers (Least Count 0.01 cm)',
      'Solid metallic cylinder / spherical bob',
      'Glass plate or clean laboratory sheet',
      'Magnifying glass (optional for division reading)',
    ],
    theory:
      'A Vernier Caliper consists of a main scale graduated in millimeters (or cm) and a sliding Vernier scale. In standard laboratory calipers, 10 vernier scale divisions (VSD) coincide with 9 main scale divisions (MSD). The difference between 1 MSD and 1 VSD is called the Vernier Constant (VC) or Least Count (LC):\n\n' +
      'Least Count (LC) = 1 MSD - 1 VSD = 1 mm - 0.9 mm = 0.1 mm = 0.01 cm.\n\n' +
      'When the jaws are closed without any object, if the zero of the Vernier scale does not coincide with the zero of the main scale, the instrument possesses Zero Error (e). If the vernier zero lies to the right, error is positive and must be subtracted; if to the left, error is negative and its absolute value is added.',
    formula:
      'Least Count = 1 MSD / Total Vernier Divisions = 1 mm / 10 = 0.01 cm\n' +
      'Total Measured Reading = MSR + (n × LC)\n' +
      'Corrected Diameter D = Total Measured Reading - (± Zero Error)\n' +
      'Radius R = D / 2\n' +
      'Cross-sectional Area A = π·R²\n' +
      'Volume of Cylinder V = π·R²·H',
    formulaLatex: 'V = \\pi R^2 H = \\frac{\\pi D^2 H}{4}',
    constants: [
      {
        id: 'msd',
        label: 'Smallest Main Scale Division (MSD)',
        defaultValue: 0.1,
        unit: 'cm',
        step: 0.01,
        description: '1 MSD = 1 mm = 0.1 cm',
      },
      {
        id: 'totalVsd',
        label: 'Total Vernier Scale Divisions',
        defaultValue: 10,
        unit: 'div',
        step: 1,
        description: 'Standard 10 divisions',
      },
      {
        id: 'zeroError',
        label: 'Zero Error of Vernier Calipers (e)',
        defaultValue: 0.0,
        unit: 'cm',
        step: 0.01,
        description: 'Positive if vernier zero is to right; negative if to left',
      },
      {
        id: 'cylinderHeight',
        label: 'Height of Cylinder (H)',
        defaultValue: 4.85,
        unit: 'cm',
        step: 0.01,
        description: 'Measured along the cylinder axis',
      },
    ],
    columns: [
      { id: 'obs', label: 'Obs. No.', unit: '#' },
      { id: 'msr', label: 'Main Scale Reading (MSR)', unit: 'cm', decimalPlaces: 1, placeholder: '2.1' },
      { id: 'vsr', label: 'Coinciding Vernier Div. (n)', unit: 'div', decimalPlaces: 0, placeholder: '4' },
      { id: 'measured', label: 'Measured Value (MSR + n × LC)', unit: 'cm', isDerived: true, decimalPlaces: 2 },
      { id: 'corrected', label: 'Corrected Diameter (D = Measured - e)', unit: 'cm', isDerived: true, decimalPlaces: 2 },
    ],
    initialRows: [
      { obs: 1, msr: 2.1, vsr: 4 },
      { obs: 2, msr: 2.1, vsr: 5 },
      { obs: 3, msr: 2.1, vsr: 4 },
      { obs: 4, msr: 2.1, vsr: 6 },
      { obs: 5, msr: 2.1, vsr: 5 },
    ],
    calculateRow: (row, constants) => {
      const lc = (constants.msd || 0.1) / (constants.totalVsd || 10);
      const msr = Number(row.msr) || 0;
      const vsr = Number(row.vsr) || 0;
      const zeroError = Number(constants.zeroError) || 0;

      const measured = roundTo(msr + vsr * lc, 2);
      const corrected = roundTo(measured - zeroError, 2);

      return {
        ...row,
        measured,
        corrected,
      };
    },
    calculateResult: (rows, constants) => {
      const correctedValues = rows
        .map((r) => r.corrected)
        .filter((v) => typeof v === 'number' && !isNaN(v) && v > 0);
      const meanD = calculateMean(correctedValues, 2);
      const meanR = roundTo(meanD / 2, 3);
      const H = Number(constants.cylinderHeight) || 4.85;
      const area = roundTo(Math.PI * Math.pow(meanR, 2), 3);
      const volume = roundTo(Math.PI * Math.pow(meanR, 2) * H, 3);
      const sphereVolume = roundTo((4 / 3) * Math.PI * Math.pow(meanR, 3), 3);

      return {
        steps: [
          {
            label: 'Least Count calculation',
            formula: 'LC = 1 MSD / Total Vernier Divisions',
            substitution: `0.1 cm / ${constants.totalVsd} = 0.01 cm (0.1 mm)`,
            result: '0.01 cm',
          },
          {
            label: 'Mean Corrected Diameter (D)',
            formula: 'D = (D₁ + D₂ + ... + Dₙ) / n',
            substitution: `(${correctedValues.join(' + ')}) / ${correctedValues.length}`,
            result: `${meanD.toFixed(2)} cm`,
          },
          {
            label: 'Radius (R)',
            formula: 'R = D / 2',
            substitution: `${meanD.toFixed(2)} / 2`,
            result: `${meanR.toFixed(3)} cm`,
          },
          {
            label: 'Cross-sectional Area (A)',
            formula: 'A = π · R²',
            substitution: `3.1416 × (${meanR.toFixed(3)})²`,
            result: `${area.toFixed(3)} cm²`,
          },
          {
            label: 'Cylinder Volume (V)',
            formula: 'V = π · R² · H',
            substitution: `3.1416 × (${meanR.toFixed(3)})² × ${H.toFixed(2)}`,
            result: `${volume.toFixed(3)} cm³`,
          },
        ],
        finalResult: `Diameter D = ${meanD.toFixed(2)} cm | Radius R = ${meanR.toFixed(3)} cm | Volume V = ${volume.toFixed(3)} cm³ (${(volume * 1e-6).toExponential(3)} m³)`,
        summaryCards: [
          { label: 'Mean Diameter', value: `${meanD.toFixed(2)}`, unit: 'cm' },
          { label: 'Mean Radius', value: `${meanR.toFixed(3)}`, unit: 'cm' },
          { label: 'Cross-sectional Area', value: `${area.toFixed(3)}`, unit: 'cm²' },
          { label: 'Calculated Volume', value: `${volume.toFixed(3)}`, unit: 'cm³', subtext: `Sphere equiv: ${sphereVolume.toFixed(3)} cm³` },
        ],
      };
    },
    precautions: [
      'Clean the jaws of the Vernier Calipers and the surface of the body before taking observations.',
      'Check for zero error and record its sign and magnitude carefully before clamping.',
      'Do not apply undue pressure on the body while tightening the screw; rotate gently until jaws touch.',
      'Take measurements at multiple positions and in two mutually perpendicular directions to eliminate non-uniformity.',
      'Keep the line of sight strictly perpendicular to the scale divisions to avoid parallax error.',
    ],
    sourcesOfError: [
      'The body may not be perfectly uniform or circular in cross-section.',
      'The Vernier scale may be loose or may not slide smoothly along the main scale.',
      'Parallax error in detecting the exactly coinciding vernier division.',
      'Wear and tear of the tips of the jaws causing irregular contact.',
    ],
    vivaQuestions: [
      {
        category: 'Core Theory',
        q: 'What is the Principle of Vernier?',
        a: 'The Vernier principle states that the precision of a scale can be augmented by combining two scales with slightly different division lengths, such that n divisions on the Vernier scale coincide with (n-1) divisions on the main scale.',
      },
      {
        category: 'Apparatus & Errors',
        q: 'How is the Least Count (Vernier Constant) defined and calculated?',
        a: 'Least Count is the smallest value that can be accurately measured by the instrument. LC = 1 MSD - 1 VSD = (1 MSD) / N, where N is the total number of divisions on the Vernier scale.',
      },
      {
        category: 'Apparatus & Errors',
        q: 'What is positive zero error, and how is it corrected?',
        a: 'When jaws are in contact, if the zero mark of the Vernier scale lies to the right of the main scale zero, it is a positive zero error. It makes observed readings larger than true values, so it must be SUBTRACTED: Correct Reading = Observed Reading - (+e).',
      },
      {
        category: 'Apparatus & Errors',
        q: 'What is negative zero error, and how is it corrected?',
        a: 'If the Vernier zero lies to the left of the main scale zero, the error is negative. It makes observed readings smaller than true values. We subtract the negative value (effectively adding its magnitude): Correct Reading = Observed Reading - (-e).',
      },
      {
        category: 'Precautions',
        q: 'Why should we take readings in two mutually perpendicular directions?',
        a: 'Commercial rods or spheres often have slight ovality or non-cylindrical deformation due to machining. Averaging perpendicular diameters compensates for ellipticity.',
      },
      {
        category: 'Core Theory',
        q: 'Can Vernier Calipers measure internal diameter and depth?',
        a: 'Yes. The upper jaws are specially designed to measure internal diameters of hollow cylinders/beakers, while the thin metallic tail strip slides out to measure internal depth.',
      },
      {
        category: 'Calculations',
        q: 'What is the significance of expressing answers in proper significant figures?',
        a: 'A measurement cannot be more precise than the least count of the measuring instrument. Since LC = 0.01 cm, the diameter must be reported to 2 decimal places.',
      },
      {
        category: 'Precautions',
        q: 'Why should the screw not be overtightened?',
        a: 'Overtightening can deform softer test specimens and can damage or warp the precision Vernier jaw guides and threads.',
      },
    ],
  },

  // --------------------------------------------------------------------------
  // EXPERIMENT 2: SCREW GAUGE
  // --------------------------------------------------------------------------
  {
    id: 'screw-gauge',
    section: 'Section A',
    categoryTitle: 'Section A: Mechanics & Measurements',
    title: 'Screw Gauge: Wire Diameter & Area',
    aim: 'To measure the diameter of a given thin wire / thickness of a small metallic sheet using a micrometer screw gauge and calculate its cross-sectional area.',
    ncertReference: 'NCERT Class XI Physics Lab Manual, Experiment E2, pp. 33–41',
    apparatus: [
      'Micrometer Screw Gauge (Pitch 1 mm, 100 circular divisions, LC 0.01 mm)',
      'Given specimen wire (e.g. Eureka, Constantan, or Copper wire)',
      'Sheet of paper and magnifying glass',
      'Metre scale for approximate length comparison',
    ],
    theory:
      'The micrometer screw gauge works on the principle of a screw moving inside a threaded nut. When rotated through one complete circle, the linear distance advanced by the screw along the pitch scale is called its Pitch (p).\n\n' +
      'Least Count (LC) = Pitch / Number of Circular Scale Divisions = 1.0 mm / 100 = 0.01 mm (0.001 cm).\n\n' +
      'Backlash error occurs when the screw threads are loose or worn, causing the screw to slip slightly without translating when rotation is reversed. To prevent backlash error, the screw must always be rotated continuously in one single direction throughout an observation.',
    formula:
      'Pitch = Distance moved / Number of complete rotations = 1 mm\n' +
      'Least Count (LC) = Pitch / No. of circular divisions = 1 mm / 100 = 0.01 mm\n' +
      'Observed Reading = PSR + (CSR × LC)\n' +
      'Corrected Diameter d = Observed Reading - (± Zero Error)\n' +
      'Radius r = d / 2\n' +
      'Cross-Sectional Area A = π·r² = π·d² / 4',
    formulaLatex: 'A = \\frac{\\pi d^2}{4}',
    constants: [
      {
        id: 'pitch',
        label: 'Pitch of the Screw',
        defaultValue: 1.0,
        unit: 'mm',
        step: 0.1,
        description: 'Linear distance advanced in 1 full rotation',
      },
      {
        id: 'circularDivisions',
        label: 'Total Circular Scale Divisions',
        defaultValue: 100,
        unit: 'div',
        step: 10,
        description: 'Number of head divisions',
      },
      {
        id: 'zeroError',
        label: 'Zero Error of Screw Gauge',
        defaultValue: 0.0,
        unit: 'mm',
        step: 0.01,
        description: 'Coinciding circular div when studs A & B touch (with sign)',
      },
    ],
    columns: [
      { id: 'obs', label: 'Obs. No.', unit: '#' },
      { id: 'psr', label: 'Pitch Scale Reading (PSR)', unit: 'mm', decimalPlaces: 0, placeholder: '0' },
      { id: 'csr', label: 'Circular Scale Reading (n)', unit: 'div', decimalPlaces: 0, placeholder: '82' },
      { id: 'observed', label: 'Observed Reading (PSR + n × LC)', unit: 'mm', isDerived: true, decimalPlaces: 2 },
      { id: 'corrected', label: 'Corrected Diameter (d)', unit: 'mm', isDerived: true, decimalPlaces: 2 },
    ],
    initialRows: [
      { obs: 1, psr: 0, csr: 82 },
      { obs: 2, psr: 0, csr: 83 },
      { obs: 3, psr: 0, csr: 81 },
      { obs: 4, psr: 0, csr: 82 },
      { obs: 5, psr: 0, csr: 84 },
    ],
    calculateRow: (row, constants) => {
      const pitch = Number(constants.pitch) || 1.0;
      const csd = Number(constants.circularDivisions) || 100;
      const lc = pitch / csd;
      const psr = Number(row.psr) || 0;
      const csr = Number(row.csr) || 0;
      const zeroError = Number(constants.zeroError) || 0;

      const observed = roundTo(psr + csr * lc, 2);
      const corrected = roundTo(observed - zeroError, 2);

      return {
        ...row,
        observed,
        corrected,
      };
    },
    calculateResult: (rows, constants) => {
      const correctedValues = rows
        .map((r) => r.corrected)
        .filter((v) => typeof v === 'number' && !isNaN(v) && v > 0);
      const meanD = calculateMean(correctedValues, 2);
      const meanD_cm = roundTo(meanD / 10, 3);
      const meanR_mm = roundTo(meanD / 2, 3);
      const meanR_cm = roundTo(meanR_mm / 10, 4);
      const area_mm2 = roundTo(Math.PI * Math.pow(meanR_mm, 2), 4);
      const area_m2 = roundTo(area_mm2 * 1e-6, 8);

      return {
        steps: [
          {
            label: 'Least Count calculation',
            formula: 'LC = Pitch / Circular Divisions',
            substitution: `${constants.pitch} mm / ${constants.circularDivisions} = 0.01 mm`,
            result: '0.01 mm (10 µm)',
          },
          {
            label: 'Mean Corrected Diameter (d)',
            formula: 'd = ∑ d_i / N',
            substitution: `(${correctedValues.join(' + ')}) / ${correctedValues.length}`,
            result: `${meanD.toFixed(2)} mm (${meanD_cm.toFixed(3)} cm)`,
          },
          {
            label: 'Radius of Wire (r)',
            formula: 'r = d / 2',
            substitution: `${meanD.toFixed(2)} mm / 2`,
            result: `${meanR_mm.toFixed(3)} mm`,
          },
          {
            label: 'Cross-sectional Area (A)',
            formula: 'A = π · r²',
            substitution: `3.1416 × (${meanR_mm.toFixed(3)})²`,
            result: `${area_mm2.toFixed(4)} mm² (${(area_mm2 * 1e-6).toExponential(3)} m²)`,
          },
        ],
        finalResult: `Mean Diameter d = ${meanD.toFixed(2)} mm | Radius r = ${meanR_mm.toFixed(3)} mm | Cross-sectional Area A = ${area_mm2.toFixed(4)} mm²`,
        summaryCards: [
          { label: 'Mean Diameter', value: `${meanD.toFixed(2)}`, unit: 'mm' },
          { label: 'Mean Radius', value: `${meanR_mm.toFixed(3)}`, unit: 'mm' },
          { label: 'Cross-sectional Area', value: `${area_mm2.toFixed(4)}`, unit: 'mm²' },
          { label: 'SI Area', value: `${(area_mm2 * 1e-6).toExponential(3)}`, unit: 'm²' },
        ],
      };
    },
    precautions: [
      'Always advance the screw using the ratchet knob (R) until it gives three distinct clicks, ensuring uniform gentle pressure.',
      'Always rotate the screw in the same direction to avoid backlash error.',
      'Check and record the zero error with its proper algebraic sign before taking measurements.',
      'Clean the studs of the screw gauge and the wire surface with paper or soft cloth.',
      'Measure the diameter at several points along the wire and at right angles at each point.',
    ],
    sourcesOfError: [
      'Non-uniformity of the wire cross-section along its length.',
      'Backlash error due to looseness in the screw nut pairing.',
      'Faulty ratchet spring causing uneven clamping pressure.',
      'Parallax error when noting the coinciding graduation line on the circular scale.',
    ],
    vivaQuestions: [
      {
        category: 'Core Theory',
        q: 'What is the Pitch of a screw gauge?',
        a: 'The pitch is the linear distance moved by the screw along the main barrel scale during one complete 360° rotation of the circular head.',
      },
      {
        category: 'Apparatus & Errors',
        q: 'What is the function of the ratchet head (R)?',
        a: 'The ratchet provides a slip-friction clutch mechanism. When the studs make firm contact with the wire, the ratchet slips and clicks, ensuring uniform pressure and preventing deformation of the wire or damage to the screw.',
      },
      {
        category: 'Apparatus & Errors',
        q: 'What is backlash error and how is it eliminated?',
        a: 'Due to thread wear, the screw may rotate slightly without translating along the barrel. It is eliminated by always turning the screw in only ONE direction when taking a reading.',
      },
      {
        category: 'Apparatus & Errors',
        q: 'How do you detect positive and negative zero error in a screw gauge?',
        a: 'When studs touch: if the zero mark of the circular scale lies below the reference baseline, the error is positive (+). If the circular zero lies above the reference baseline, the error is negative (-).',
      },
      {
        category: 'Core Theory',
        q: 'Why is a screw gauge preferred over Vernier Calipers for measuring wire diameter?',
        a: 'A standard screw gauge has a least count of 0.01 mm (0.001 cm), which is 10 times more sensitive and precise than standard Vernier Calipers (0.1 mm or 0.01 cm).',
      },
      {
        category: 'Precautions',
        q: 'Why is the wire measured at right angles (perpendicular diameters)?',
        a: 'Drawn wires often have slight cross-sectional elliptical distortion. Averaging two orthogonal diameters yields the true effective circle.',
      },
      {
        category: 'Calculations',
        q: 'How would you measure the volume of an irregular thin lamina using this instrument?',
        a: 'Measure its uniform thickness t with the screw gauge. Trace its boundary on millimeter graph paper to count grid squares for area A. Then Volume = A × t.',
      },
      {
        category: 'Core Theory',
        q: 'What is a micrometer screw?',
        a: 'A micrometer screw is a precision instrument having a least count on the order of 10⁻⁶ m (micrometer or micron), such as a screw gauge with 0.001 mm resolution.',
      },
    ],
  },

  // --------------------------------------------------------------------------
  // EXPERIMENT 3: SPHEROMETER
  // --------------------------------------------------------------------------
  {
    id: 'spherometer',
    section: 'Section A',
    categoryTitle: 'Section A: Mechanics & Measurements',
    title: 'Spherometer: Radius of Curvature',
    aim: 'To determine the radius of curvature of a given spherical surface (watch glass or convex lens/mirror) using a spherometer.',
    ncertReference: 'NCERT Class XI Physics Lab Manual, Experiment E3, pp. 42–47',
    apparatus: [
      'Spherometer (Pitch 1 mm, 100 circular divisions, LC 0.01 mm)',
      'Spherical surface (concave/convex watch glass or spherical mirror)',
      'Flat plane glass plate',
      'Millimeter ruler / sheet of white paper for leg prick impressions',
    ],
    theory:
      'A spherometer consists of three fixed triangular legs of equal length forming an equilateral triangle of side l, and an adjustable central screw. When placed on a sphere of radius R, the central screw is raised or lowered by a vertical height h (called the sagitta) relative to the plane of the three legs.\n\n' +
      'From chord geometry of a spherical section:\n' +
      'r² = h(2R - h)  =>  R = (r² / 2h) + (h / 2)\n' +
      'Since the three legs form an equilateral triangle of side l, the radius of the circumscribing circle is r = l / √3. Substituting gives the standard CBSE formula:\n\n' +
      'R = (l² / 6h) + (h / 2)',
    formula:
      'Least Count = Pitch / Total circular divisions = 1 mm / 100 = 0.01 mm = 0.001 cm\n' +
      'Mean distance between legs = l = (AB + BC + CA) / 3 (cm)\n' +
      'Sagitta h = |h₁ - h₂| (cm)\n' +
      'Radius of Curvature R = (l² / 6h) + (h / 2)',
    formulaLatex: 'R = \\frac{l^2}{6h} + \\frac{h}{2}',
    constants: [
      {
        id: 'pitch',
        label: 'Pitch of Spherometer Screw',
        defaultValue: 1.0,
        unit: 'mm',
        step: 0.1,
      },
      {
        id: 'divisions',
        label: 'Total Circular Divisions',
        defaultValue: 100,
        unit: 'div',
        step: 10,
      },
      {
        id: 'legDistance',
        label: 'Mean Distance Between Legs (l)',
        defaultValue: 4.25,
        unit: 'cm',
        step: 0.01,
        description: 'Measured from triangular leg pricks on paper',
      },
    ],
    columns: [
      { id: 'obs', label: 'Obs. No.', unit: '#' },
      { id: 'h1_psr', label: 'Curved Surface PSR', unit: 'mm', decimalPlaces: 0, placeholder: '2' },
      { id: 'h1_csr', label: 'Curved Surface CSR', unit: 'div', decimalPlaces: 0, placeholder: '45' },
      { id: 'h2_psr', label: 'Plane Glass PSR', unit: 'mm', decimalPlaces: 0, placeholder: '2' },
      { id: 'h2_csr', label: 'Plane Glass CSR', unit: 'div', decimalPlaces: 0, placeholder: '12' },
      { id: 'sagitta_mm', label: 'Sagitta h', unit: 'mm', isDerived: true, decimalPlaces: 2 },
      { id: 'sagitta_cm', label: 'Sagitta h', unit: 'cm', isDerived: true, decimalPlaces: 3 },
    ],
    initialRows: [
      { obs: 1, h1_psr: 2, h1_csr: 45, h2_psr: 2, h2_csr: 12 },
      { obs: 2, h1_psr: 2, h1_csr: 46, h2_psr: 2, h2_csr: 12 },
      { obs: 3, h1_psr: 2, h1_csr: 44, h2_psr: 2, h2_csr: 11 },
      { obs: 4, h1_psr: 2, h1_csr: 45, h2_psr: 2, h2_csr: 13 },
    ],
    calculateRow: (row, constants) => {
      const lc_mm = (constants.pitch || 1.0) / (constants.divisions || 100);
      const h1 = (Number(row.h1_psr) || 0) + (Number(row.h1_csr) || 0) * lc_mm;
      const h2 = (Number(row.h2_psr) || 0) + (Number(row.h2_csr) || 0) * lc_mm;
      const sagitta_mm = roundTo(Math.abs(h1 - h2), 2);
      const sagitta_cm = roundTo(sagitta_mm / 10, 3);

      return {
        ...row,
        sagitta_mm,
        sagitta_cm,
      };
    },
    calculateResult: (rows, constants) => {
      const sagittaValues_cm = rows
        .map((r) => r.sagitta_cm)
        .filter((v) => typeof v === 'number' && !isNaN(v) && v > 0);
      const meanH_cm = calculateMean(sagittaValues_cm, 3);
      const l = Number(constants.legDistance) || 4.25;

      const term1 = meanH_cm > 0 ? (l * l) / (6 * meanH_cm) : 0;
      const term2 = meanH_cm / 2;
      const R = roundTo(term1 + term2, 2);

      return {
        steps: [
          {
            label: 'Least Count calculation',
            formula: 'LC = Pitch / Circular Divisions',
            substitution: `${constants.pitch} mm / ${constants.divisions} = 0.01 mm = 0.001 cm`,
            result: '0.001 cm',
          },
          {
            label: 'Mean Sagitta (h)',
            formula: 'h = ∑ h_i / n',
            substitution: `(${sagittaValues_cm.join(' + ')}) / ${sagittaValues_cm.length}`,
            result: `${meanH_cm.toFixed(3)} cm (${(meanH_cm * 10).toFixed(2)} mm)`,
          },
          {
            label: 'First term (l² / 6h)',
            formula: 'l² / 6h',
            substitution: `(${l.toFixed(2)})² / (6 × ${meanH_cm.toFixed(3)}) = ${roundTo(l * l, 3)} / ${(6 * meanH_cm).toFixed(3)}`,
            result: `${term1.toFixed(2)} cm`,
          },
          {
            label: 'Second term (h / 2)',
            formula: 'h / 2',
            substitution: `${meanH_cm.toFixed(3)} / 2`,
            result: `${term2.toFixed(3)} cm`,
          },
          {
            label: 'Radius of Curvature (R)',
            formula: 'R = (l² / 6h) + (h / 2)',
            substitution: `${term1.toFixed(2)} + ${term2.toFixed(3)}`,
            result: `${R.toFixed(2)} cm`,
          },
        ],
        finalResult: `Radius of Curvature R = ${R.toFixed(2)} cm (Sagitta h = ${meanH_cm.toFixed(3)} cm, Leg Distance l = ${l.toFixed(2)} cm)`,
        summaryCards: [
          { label: 'Mean Sagitta (h)', value: `${meanH_cm.toFixed(3)}`, unit: 'cm' },
          { label: 'Leg Spacing (l)', value: `${l.toFixed(2)}`, unit: 'cm' },
          { label: 'Curvature Radius (R)', value: `${R.toFixed(2)}`, unit: 'cm' },
          { label: 'Focal Length (f = R/2)', value: `${(R / 2).toFixed(2)}`, unit: 'cm' },
        ],
      };
    },
    precautions: [
      'The central screw should turn freely without wobble or friction in its nut.',
      'To judge the exact contact of the central screw, look at its reflection on the glass surface underneath until the tip touches its image.',
      'Press the three outer legs gently on clean paper to make distinct prick marks for measuring l with a sharp pencil and fine ruler.',
      'Always rotate the screw in only one direction while setting contact to avoid backlash error.',
      'Check that the plane glass plate is clean and resting horizontal.',
    ],
    sourcesOfError: [
      'Error in measuring the distance l between the legs.',
      'Difficulty in detecting the exact moment of touching without lifting the outer legs.',
      'Backlash error in the central screw thread.',
      'Surface of the watch glass may not be a perfect spherical section.',
    ],
    vivaQuestions: [
      {
        category: 'Core Theory',
        q: 'Why is this instrument called a spherometer?',
        a: 'Because it is specially designed to measure the radius of curvature of spherical surfaces (both convex and concave).',
      },
      {
        category: 'Core Theory',
        q: 'What is the Sagitta (h)?',
        a: 'The sagitta is the perpendicular distance from the midpoint of the chord connecting the contact points of the legs to the apex of the spherical cap.',
      },
      {
        category: 'Calculations',
        q: 'Why does the formula contain l² / 6h rather than l² / 2h?',
        a: 'The outer three legs form an equilateral triangle of side l. The circumradius r of an equilateral triangle is l / √3. Hence r² / 2h becomes (l² / 3) / 2h = l² / 6h.',
      },
      {
        category: 'Apparatus & Errors',
        q: 'How do you check if the central tip has made contact without pressing too hard?',
        a: 'By observing the tip touching its optical reflection in the glass surface, or by placing a thin paper strip underneath and checking when it can no longer be pulled freely without drag.',
      },
      {
        category: 'Calculations',
        q: 'Can the term h/2 be neglected?',
        a: 'For surfaces with large radius of curvature where h is very small (e.g. h < 0.2 mm), h/2 is negligibly small compared to l²/6h and may be omitted without significant error.',
      },
      {
        category: 'Core Theory',
        q: 'Can a spherometer measure the thickness of a small glass slide?',
        a: 'Yes. Place the slide on a plane glass plate, note the screw reading on the slide, and subtract the reading on the bare plate.',
      },
      {
        category: 'Precautions',
        q: 'Why should the three leg pricks be carefully measured?',
        a: 'Because l appears squared (l²) in the numerator. Any fractional error in l produces twice the fractional error in the calculated radius R (ΔR/R ≈ 2 Δl/l).',
      },
    ],
  },

  // --------------------------------------------------------------------------
  // EXPERIMENT 4: BEAM BALANCE
  // --------------------------------------------------------------------------
  {
    id: 'beam-balance',
    section: 'Section A',
    categoryTitle: 'Section A: Mechanics & Measurements',
    title: 'Physical Beam Balance: Mass Determination',
    aim: 'To determine the true mass of two given solid objects using a physical beam balance by the method of swings / resting point comparison.',
    ncertReference: 'NCERT Class XI Physics Lab Manual, Experiment E4, pp. 48–54',
    apparatus: [
      'Physical Balance with levelling screws and plumb line',
      'Standard weight box with fractional milligram weights and brass forceps',
      'Spirit level and glass cabinet enclosure',
      'Two solid test bodies of unknown mass',
    ],
    theory:
      'The physical balance is based on the Principle of Moments. In an ideal beam balance with equal arms (a₁ = a₂) and identical pans, equilibrium occurs when the clockwise torque equals the anticlockwise torque:\n\n' +
      'm₁ · g · a₁ = m₂ · g · a₂  =>  m₁ = m₂\n\n' +
      'In practice, due to friction and air damping, resting point is determined using the Method of Swings: recording consecutive turning points on the left (L₁, L₂) and right (R₁, R₂) of the central scale:\n' +
      'Resting Point R = ½ [ (L₁ + L₂) / 2 + (R₁ + R₂) / 2 ]',
    formula:
      'Zero Resting Point R₀ = Resting point with empty pans\n' +
      'Loaded Resting Point R = Resting point with unknown mass in left pan and weights in right pan\n' +
      'Deflection Method: Unknown Mass = Gram weights + Milligram weights\n' +
      'Sensitivity = Deflection / Added mass (divisions / mg)',
    formulaLatex: 'm_1 = m_2 \\quad \\text{(at equilibrium under equal arm lengths)}',
    constants: [
      {
        id: 'zeroRestingPoint',
        label: 'Zero Resting Point (R₀)',
        defaultValue: 10.0,
        unit: 'div',
        step: 0.1,
        description: 'Pointer position at rest with empty pans',
      },
      {
        id: 'balancePrecision',
        label: 'Precision of Physical Balance',
        defaultValue: 1.0,
        unit: 'mg',
        step: 0.1,
        description: 'Smallest fractional milligram weight = 1 mg = 0.001 g',
      },
    ],
    columns: [
      { id: 'obs', label: 'Obs. No.', unit: '#' },
      { id: 'gramWeights', label: 'Gram Weights (x)', unit: 'g', decimalPlaces: 0, placeholder: '24' },
      { id: 'mgWeights', label: 'Milligram Weights (y)', unit: 'mg', decimalPlaces: 0, placeholder: '360' },
      { id: 'l1', label: 'Left Turn L₁', unit: 'div', decimalPlaces: 1, placeholder: '8.2' },
      { id: 'r1', label: 'Right Turn R₁', unit: 'div', decimalPlaces: 1, placeholder: '11.8' },
      { id: 'totalMass_g', label: 'Total Mass (x + y/1000)', unit: 'g', isDerived: true, decimalPlaces: 3 },
    ],
    initialRows: [
      { obs: 1, gramWeights: 24, mgWeights: 365, l1: 8.2, r1: 11.8 },
      { obs: 2, gramWeights: 24, mgWeights: 364, l1: 8.4, r1: 11.6 },
      { obs: 3, gramWeights: 24, mgWeights: 365, l1: 8.3, r1: 11.7 },
      { obs: 4, gramWeights: 24, mgWeights: 366, l1: 8.1, r1: 11.9 },
    ],
    calculateRow: (row) => {
      const g = Number(row.gramWeights) || 0;
      const mg = Number(row.mgWeights) || 0;
      const totalMass_g = roundTo(g + mg / 1000, 3);

      return {
        ...row,
        totalMass_g,
      };
    },
    calculateResult: (rows) => {
      const masses = rows
        .map((r) => r.totalMass_g)
        .filter((v) => typeof v === 'number' && !isNaN(v) && v > 0);
      const meanMass = calculateMean(masses, 3);

      return {
        steps: [
          {
            label: 'Mass summation',
            formula: 'Mass = Standard Gram Weights + Milligram Weights / 1000',
            substitution: 'Summing brass gram weights with aluminium fractional weights',
            result: 'Direct mass balance',
          },
          {
            label: 'Mean Unknown Mass',
            formula: 'm̄ = ∑ m_i / n',
            substitution: `(${masses.join(' + ')}) / ${masses.length}`,
            result: `${meanMass.toFixed(3)} g`,
          },
        ],
        finalResult: `Determined Mass m = ${meanMass.toFixed(3)} g (${(meanMass * 1e-3).toFixed(6)} kg)`,
        summaryCards: [
          { label: 'Mean Mass', value: `${meanMass.toFixed(3)}`, unit: 'g' },
          { label: 'Mass in SI', value: `${(meanMass * 1e-3).toFixed(5)}`, unit: 'kg' },
          { label: 'Balance Precision', value: '±0.001', unit: 'g (1 mg)' },
        ],
      };
    },
    precautions: [
      'Level the balance base using the levelling screws until the plumb line aligns with the needle point.',
      'Always arrest the balance (turn knob OFF) before placing or removing any weight or object.',
      'Always handle weights with the provided forceps, never with bare fingers.',
      'Keep the glass cabinet doors closed during swings to prevent air draughts from disturbing the pointer.',
      'Never weigh hot, cold, wet, or chemically corrosive substances directly in the pans.',
    ],
    sourcesOfError: [
      'Inherent slight inequality in the lengths of the balance arms.',
      'Friction at the central knife edge and agate plane bearings.',
      'Air draughts causing unsteady oscillations if the cabinet is open.',
      'Dust or finger grease deposited on standard weights.',
    ],
    vivaQuestions: [
      {
        category: 'Core Theory',
        q: 'What fundamental principle does a beam balance work on?',
        a: 'The Principle of Moments (lever principle): clockwise torque equals anticlockwise torque about the central knife-edge fulcrum.',
      },
      {
        category: 'Apparatus & Errors',
        q: 'Why must the balance always be arrested before changing weights?',
        a: 'Lifting or placing weights while the beam is free exerts shock shocks on the sharp agate knife-edges, causing chipping and dulling of the pivot edges.',
      },
      {
        category: 'Apparatus & Errors',
        q: 'Why are fractional weights made of aluminium and picked with forceps?',
        a: 'Aluminium does not corrode readily and allows fine sheet stamping. Forceps prevent skin oils, moisture, and dust from altering the precision milligram values.',
      },
      {
        category: 'Precautions',
        q: 'Why should hot bodies never be placed on the pan?',
        a: 'A hot body generates upward convective air currents that produce an artificial buoyant upward lift, making the body appear lighter.',
      },
      {
        category: 'Calculations',
        q: 'What is the sensitivity of a balance?',
        a: 'Sensitivity is the deflection produced on the pointer scale per unit change of mass placed in one pan (divisions per mg).',
      },
      {
        category: 'Core Theory',
        q: 'What is the difference between inertial mass and gravitational mass?',
        a: 'Inertial mass measures resistance to acceleration (F = ma), while gravitational mass measures the gravitational attraction force (W = mg). The beam balance compares gravitational masses.',
      },
    ],
  },

  // --------------------------------------------------------------------------
  // EXPERIMENT 5: PARALLELOGRAM LAW OF VECTORS
  // --------------------------------------------------------------------------
  {
    id: 'parallelogram-law',
    section: 'Section A',
    categoryTitle: 'Section A: Mechanics & Vectors',
    title: 'Parallelogram Law: Unknown Weight & Equilibrium',
    aim: 'To determine the weight of a given body (wooden block) using the Parallelogram Law of Vector Addition on Gravesand’s apparatus and calculate the percentage error.',
    ncertReference: 'NCERT Class XI Physics Lab Manual, Experiment E5, pp. 55–59',
    apparatus: [
      'Gravesand’s apparatus (vertical board with two frictionless pulleys)',
      'Two hangers with slotted weights (P and Q)',
      'Given wooden block with hook (unknown weight W)',
      'White drawing sheet, mirror strip, drawing pins, ruler, and protractor',
    ],
    theory:
      'The Parallelogram Law of Vector Addition states that if two concurrent forces acting simultaneously at a point are represented in magnitude and direction by two adjacent sides of a parallelogram drawn from that point, their resultant is represented completely by the diagonal of the parallelogram passing through that point.\n\n' +
      'When three forces P, Q, and W act at a central knot O and remain in static equilibrium:\n' +
      'Resultant R = √(P² + Q² + 2PQ cos θ)\n\n' +
      'For equilibrium, the resultant R of forces P and Q must be equal in magnitude and directly opposite in direction to the downward weight W: R = W.',
    formula:
      'Resultant R = √(P² + Q² + 2·P·Q·cos θ)\n' +
      'Scale: 50 gf = 1 cm (0.49 N = 1 cm)\n' +
      'Percentage Error = |R - W| / W × 100',
    formulaLatex: 'R = \\sqrt{P^2 + Q^2 + 2PQ\\cos\\theta}',
    constants: [
      {
        id: 'actualWeight',
        label: 'True Weight of Body (W)',
        defaultValue: 150,
        unit: 'gf',
        step: 5,
        description: 'Measured directly with a calibrated spring balance',
      },
      {
        id: 'g',
        label: 'Acceleration due to Gravity (g)',
        defaultValue: 9.8,
        unit: 'm/s²',
        step: 0.01,
      },
    ],
    columns: [
      { id: 'obs', label: 'Obs. No.', unit: '#' },
      { id: 'p', label: 'Force P (Hanger + Weights)', unit: 'gf', decimalPlaces: 0, placeholder: '100' },
      { id: 'q', label: 'Force Q (Hanger + Weights)', unit: 'gf', decimalPlaces: 0, placeholder: '100' },
      { id: 'theta', label: 'Angle Between P & Q (θ)', unit: '°', decimalPlaces: 1, placeholder: '83.0' },
      { id: 'resultant', label: 'Resultant R', unit: 'gf', isDerived: true, decimalPlaces: 1 },
      { id: 'diff', label: 'Difference |R - W|', unit: 'gf', isDerived: true, decimalPlaces: 1 },
      { id: 'errorPct', label: 'Error %', unit: '%', isDerived: true, decimalPlaces: 2 },
    ],
    initialRows: [
      { obs: 1, p: 100, q: 100, theta: 83.0 },
      { obs: 2, p: 120, q: 100, theta: 94.5 },
      { obs: 3, p: 110, q: 110, theta: 94.0 },
      { obs: 4, p: 90, q: 130, theta: 90.0 },
    ],
    calculateRow: (row, constants) => {
      const P = Number(row.p) || 0;
      const Q = Number(row.q) || 0;
      const thetaDeg = Number(row.theta) || 0;
      const thetaRad = (thetaDeg * Math.PI) / 180;
      const W = Number(constants.actualWeight) || 150;

      const cosTheta = Math.cos(thetaRad);
      const rSquared = P * P + Q * Q + 2 * P * Q * cosTheta;
      const resultant = roundTo(Math.sqrt(Math.max(0, rSquared)), 1);
      const diff = roundTo(Math.abs(resultant - W), 1);
      const errorPct = W > 0 ? roundTo((diff / W) * 100, 2) : 0;

      return {
        ...row,
        resultant,
        diff,
        errorPct,
      };
    },
    calculateResult: (rows, constants) => {
      const resultantValues = rows
        .map((r) => r.resultant)
        .filter((v) => typeof v === 'number' && !isNaN(v) && v > 0);
      const meanR = calculateMean(resultantValues, 1);
      const W = Number(constants.actualWeight) || 150;
      const pctErr = calculatePercentageError(meanR, W);
      const meanR_N = roundTo((meanR * 9.8) / 1000, 3);
      const W_N = roundTo((W * 9.8) / 1000, 3);

      return {
        steps: [
          {
            label: 'Parallelogram Resultant Formula',
            formula: 'R = √(P² + Q² + 2PQ cos θ)',
            substitution: `Applied across all ${rows.length} observation pairs of (P, Q, θ)`,
            result: 'Individual vector diagonals calculated',
          },
          {
            label: 'Mean Unknown Weight (R̄)',
            formula: 'R̄ = ∑ R_i / n',
            substitution: `(${resultantValues.join(' + ')}) / ${resultantValues.length}`,
            result: `${meanR.toFixed(1)} gf (${meanR_N.toFixed(3)} N)`,
          },
          {
            label: 'Percentage Error Comparison',
            formula: '% Error = |R̄ - W| / W × 100',
            substitution: `|${meanR.toFixed(1)} - ${W}| / ${W} × 100`,
            result: pctErr.errorPercent,
          },
        ],
        finalResult: `Determined Weight = ${meanR.toFixed(1)} gf (${meanR_N.toFixed(3)} N) | Standard Weight = ${W} gf (${W_N.toFixed(3)} N) | Error = ${pctErr.errorPercent}`,
        percentageError: {
          theoretical: W,
          calculated: meanR,
          errorPercent: pctErr.errorPercent,
          standardRef: 'Direct spring balance measurement',
        },
        summaryCards: [
          { label: 'Experimental Weight', value: `${meanR.toFixed(1)}`, unit: 'gf' },
          { label: 'Weight in Newtons', value: `${meanR_N.toFixed(3)}`, unit: 'N' },
          { label: 'Actual Weight', value: `${W}`, unit: 'gf' },
          { label: 'Percentage Error', value: pctErr.errorPercent },
        ],
      };
    },
    precautions: [
      'The vertical board of Gravesand’s apparatus must be set vertical with a plumb-line.',
      'The pulleys must rotate smoothly with minimal friction; lubricate their axles if needed.',
      'The junction knot (O) and hanging weights must not touch the wooden board or table at any point.',
      'To locate the true position of equilibrium (position of no-friction), tap the board gently several times.',
      'Use a plane mirror strip under the strings to eliminate parallax when marking line directions.',
    ],
    sourcesOfError: [
      'Residual friction in the pulleys resisting string motion.',
      'Errors in the marked values of standard slotted weights.',
      'Parallax error when marking the thread direction lines.',
      'Inelastic stretching or slight stiffness of the suspended strings.',
    ],
    vivaQuestions: [
      {
        category: 'Core Theory',
        q: 'State the Parallelogram Law of Vector Addition.',
        a: 'If two vectors acting at a point are represented in magnitude and direction by two adjacent sides of a parallelogram, their resultant is represented by the diagonal passing through that common intersection point.',
      },
      {
        category: 'Core Theory',
        q: 'What is the condition for three coplanar forces to be in equilibrium?',
        a: 'The vector sum of the three forces must be zero (P + Q + W = 0). Thus, the resultant of any two forces must be equal in magnitude and opposite in direction to the third force.',
      },
      {
        category: 'Apparatus & Errors',
        q: 'Why do we tap the board before marking the junction knot O?',
        a: 'Tapping helps overcome static friction in the pulleys and allows the knot to settle at its true, unconstrained equilibrium position (the position of no friction).',
      },
      {
        category: 'Precautions',
        q: 'How does a mirror strip eliminate parallax when marking string directions?',
        a: 'By positioning your eye such that the string coincides with its reflected image, your line of sight is precisely normal to the paper.',
      },
      {
        category: 'Calculations',
        q: 'When does the resultant of two equal forces P and P equal P?',
        a: 'When the angle θ between them is 120°. R = √(P² + P² + 2P² cos 120°) = √(2P² - P²) = P.',
      },
      {
        category: 'Calculations',
        q: 'What is the conversion factor between gf and Newtons?',
        a: '1 gf = 1 gram-force = 10⁻³ kg × 9.8 m/s² = 9.8 × 10⁻³ N = 0.0098 N.',
      },
    ],
  },

  // --------------------------------------------------------------------------
  // EXPERIMENT 6: HELICAL SPRING (GRAPHICAL SLOPE)
  // --------------------------------------------------------------------------
  {
    id: 'helical-spring',
    section: 'Section A',
    categoryTitle: 'Section A: Elasticity & Graph Plotting',
    title: 'Helical Spring: Force Constant (Load vs Extension)',
    aim: 'To determine the force constant (spring constant k) of a helical spring by plotting a graph between load and extension.',
    ncertReference: 'NCERT Class XI Physics Lab Manual, Project P9 & Exp. E10, pp. 83–88, 208–212',
    apparatus: [
      'Helical spring with rigid stand and clamp',
      'Light metal pointer attached to lower end of spring',
      'Vertical half-metre scale with mirror strip',
      'Slotted weights (50 g each) with hanger (50 g)',
    ],
    theory:
      'According to Hooke’s Law, within the elastic limit, the extension produced in a spring is directly proportional to the stretching force (load) applied:\n\n' +
      'F = k · l  =>  M · g = k · l  =>  k = (M · g) / l\n\n' +
      'where M is the suspended load, g is acceleration due to gravity, l is the extension, and k is the spring constant.\n\n' +
      'When Load M (in g or N) is plotted against Extension l (in cm or m), the graph is a straight line passing through the origin. The slope of the load-extension graph gives:\n' +
      'Slope = ΔM / Δl (in g/cm)\n' +
      'Force Constant k = Slope × g = (ΔM × 10⁻³ × 9.8) / (Δl × 10⁻²) = Slope × 0.98 N/m',
    formula:
      'Mean Position x = (Reading Loading + Reading Unloading) / 2\n' +
      'Extension l = x - x₀ (where x₀ is zero-load reading)\n' +
      'Slope = ΔM / Δl (from best-fit linear regression graph)\n' +
      'Force Constant k = Slope × 0.98 N/m (for M in g and l in cm)',
    formulaLatex: 'k = \\frac{M g}{l} = \\text{slope} \\times g',
    constants: [
      {
        id: 'initialReading',
        label: 'Zero Load Pointer Position (x₀)',
        defaultValue: 14.5,
        unit: 'cm',
        step: 0.1,
        description: 'Scale reading with only hanger suspended (50 g)',
      },
      {
        id: 'g',
        label: 'Acceleration due to Gravity (g)',
        defaultValue: 9.8,
        unit: 'm/s²',
        step: 0.01,
      },
    ],
    columns: [
      { id: 'obs', label: 'Obs. No.', unit: '#' },
      { id: 'load', label: 'Added Load M', unit: 'g', decimalPlaces: 0, placeholder: '50' },
      { id: 'readLoading', label: 'Loading Reading', unit: 'cm', decimalPlaces: 1, placeholder: '16.5' },
      { id: 'readUnloading', label: 'Unloading Reading', unit: 'cm', decimalPlaces: 1, placeholder: '16.7' },
      { id: 'meanPosition', label: 'Mean Position (x)', unit: 'cm', isDerived: true, decimalPlaces: 2 },
      { id: 'extension', label: 'Extension l = x - x₀', unit: 'cm', isDerived: true, decimalPlaces: 2 },
      { id: 'k_indiv', label: 'k = Mg/l', unit: 'N/m', isDerived: true, decimalPlaces: 1 },
    ],
    initialRows: [
      { obs: 1, load: 50, readLoading: 16.5, readUnloading: 16.5 },
      { obs: 2, load: 100, readLoading: 18.6, readUnloading: 18.6 },
      { obs: 3, load: 150, readLoading: 20.6, readUnloading: 20.7 },
      { obs: 4, load: 200, readLoading: 22.7, readUnloading: 22.8 },
      { obs: 5, load: 250, readLoading: 24.8, readUnloading: 24.9 },
      { obs: 6, load: 300, readLoading: 26.9, readUnloading: 27.0 },
    ],
    calculateRow: (row, constants) => {
      const x0 = Number(constants.initialReading) || 14.5;
      const g = Number(constants.g) || 9.8;
      const loadG = Number(row.load) || 0;
      const rLoad = Number(row.readLoading) || 0;
      const rUnload = Number(row.readUnloading) || 0;

      const meanPos = roundTo((rLoad + rUnload) / 2, 2);
      const extension = roundTo(Math.max(0, meanPos - x0), 2);

      // k = (M kg * g) / (l m) = (loadG * 1e-3 * g) / (extension * 1e-2)
      const k = extension > 0 ? roundTo((loadG * 1e-3 * g) / (extension * 1e-2), 1) : 0;

      return {
        ...row,
        meanPosition: meanPos,
        extension,
        k_indiv: k,
      };
    },
    calculateResult: (rows, constants) => {
      const g = Number(constants.g) || 9.8;
      const validPoints = rows
        .filter((r) => r.extension > 0 && r.load > 0)
        .map((r) => ({ x: r.extension, y: r.load }));

      const regression = computeLinearRegression(validPoints);
      const slope = regression ? regression.slope : 24.5; // g/cm
      // k = slope(g/cm) * 1e-3 kg * g / (1e-2 m) = slope * 0.1 * g
      const kFromGraph = roundTo(slope * 0.1 * g, 1);

      const kValues = rows.map((r) => r.k_indiv).filter((v) => v > 0);
      const meanKCalc = calculateMean(kValues, 1);

      return {
        steps: [
          {
            label: 'Extension calculation',
            formula: 'l = x - x₀',
            substitution: 'Mean scale reading minus zero-load hanger reading x₀',
            result: 'Proportional elongation',
          },
          {
            label: 'Graph Slope (ΔLoad / ΔExtension)',
            formula: 'Slope = ΔM / Δl',
            substitution: regression
              ? `ΔM / Δl = (${regression.y2.toFixed(1)} - ${regression.y1.toFixed(1)}) / (${regression.x2.toFixed(2)} - ${regression.x1.toFixed(2)})`
              : 'Computed via regression',
            result: `${slope.toFixed(2)} g/cm`,
          },
          {
            label: 'Force Constant from Graph (k)',
            formula: 'k = Slope × (10⁻³ × g) / (10⁻²)',
            substitution: `${slope.toFixed(2)} × (10⁻³ × ${g}) / 10⁻² = ${slope.toFixed(2)} × ${(0.1 * g).toFixed(3)}`,
            result: `${kFromGraph.toFixed(1)} N/m`,
          },
          {
            label: 'Arithmetic Mean Verification',
            formula: 'k̄ = ∑ (Mg / l) / n',
            substitution: `Average of ${kValues.length} load rows`,
            result: `${meanKCalc.toFixed(1)} N/m`,
          },
        ],
        finalResult: `Force Constant k = ${kFromGraph.toFixed(1)} N/m (From Graph Slope) | Arithmetic Mean k̄ = ${meanKCalc.toFixed(1)} N/m`,
        summaryCards: [
          { label: 'Spring Constant (k)', value: `${kFromGraph.toFixed(1)}`, unit: 'N/m' },
          { label: 'Graph Slope', value: `${slope.toFixed(2)}`, unit: 'g/cm' },
          { label: 'Arithmetic Mean', value: `${meanKCalc.toFixed(1)}`, unit: 'N/m' },
          { label: 'Linear Fit R²', value: regression ? `${regression.r2.toFixed(4)}` : '0.999', unit: '' },
        ],
      };
    },
    graphConfig: {
      xAxisKey: 'extension',
      yAxisKey: 'load',
      xLabel: 'Extension (l)',
      yLabel: 'Load (M)',
      xUnit: 'cm',
      yUnit: 'g',
      calculateSlope: true,
      slopeFormula: 'Slope = ΔM / Δl (g/cm)',
      slopePhysicalMeaning: 'Reciprocal of compliance; k = Slope × 0.1 × g (N/m)',
      expectedSlopeRange: '20 to 30 g/cm',
      yInterceptOrigin: true,
    },
    precautions: [
      'The spring should be suspended vertically from a rigid and firm support without swaying.',
      'Loading and unloading should be done very gently without causing the spring to oscillate vertically.',
      'Wait for 1 to 2 minutes after adding/removing a weight before reading the pointer position.',
      'Do not load the spring beyond its elastic limit; the coils should not be permanently stretched.',
      'Read the pointer with eye level perpendicular to the mirror strip on the scale to avoid parallax.',
    ],
    sourcesOfError: [
      'Elastic after-effect in the spring wire leading to slow recovery.',
      'The pointer may not move parallel to the vertical scale.',
      'Friction between the pointer tip and the scale if they touch.',
      'Variations in local gravitational acceleration g.',
    ],
    vivaQuestions: [
      {
        category: 'Core Theory',
        q: 'Define Spring Constant (Force Constant) k.',
        a: 'The force constant is the restoring force produced in the spring per unit extension (or compression), k = F/l. Its SI unit is N/m.',
      },
      {
        category: 'Core Theory',
        q: 'What is Hooke’s Law?',
        a: 'Within the elastic limit of a material, stress is directly proportional to strain, or the restoring force is proportional to displacement: F = -k·x.',
      },
      {
        category: 'Precautions',
        q: 'Why do we record readings during both loading and unloading?',
        a: 'Due to elastic hysteresis (elastic lag/after-effect), the spring does not instantaneously recover. Averaging loading and unloading readings eliminates this hysteresis error.',
      },
      {
        category: 'Calculations',
        q: 'How is the spring constant determined from the Load vs Extension graph?',
        a: 'The slope of the Load M (g) vs Extension l (cm) graph is ΔM / Δl. Force constant k = (ΔM × 10⁻³ × g) / (Δl × 10⁻²) = slope × 0.98 N/m.',
      },
      {
        category: 'Core Theory',
        q: 'If a spring is cut into two equal halves, what will happen to the spring constant of each piece?',
        a: 'The spring constant of each half becomes DOUBLED (2k). Since k ∝ 1/Length, a shorter spring requires twice as much force for the same extension.',
      },
      {
        category: 'Apparatus & Errors',
        q: 'What happens if a spring is loaded beyond its elastic limit?',
        a: 'The spring suffers permanent deformation (set), Hooke’s law breaks down, the graph curves away from linearity, and it cannot return to its original length.',
      },
    ],
  },

  // --------------------------------------------------------------------------
  // EXPERIMENT 7: SIMPLE PENDULUM (L vs T² GRAPH & g)
  // --------------------------------------------------------------------------
  {
    id: 'simple-pendulum',
    section: 'Section B',
    categoryTitle: 'Section B: Oscillations & Gravitation',
    title: 'Simple Pendulum: L vs T² Graph & g',
    aim: 'Using a Simple Pendulum, plot L – T and L – T² graphs; hence determine the acceleration due to gravity (g) and find the effective length of a second’s pendulum.',
    ncertReference: 'NCERT Class XI Physics Lab Manual, Experiment E6, pp. 60–67',
    apparatus: [
      'Clamp stand with split cork',
      'Heavy metallic (brass/iron) spherical bob with attached hook',
      'Long, strong, unspun cotton thread (approx. 1.5 m)',
      'Stopwatch (Least Count 0.1 s)',
      'Metre scale (Least Count 0.1 cm) and Vernier Calipers',
    ],
    theory:
      'A simple pendulum consists of a point mass suspended by an inextensible, massless string from a rigid support. For small angular amplitudes (θ < 15°), the restoring torque is proportional to angular displacement (SHM):\n\n' +
      'Time Period T = 2π √(L / g)\n\n' +
      'Squaring both sides:\n' +
      'T² = (4π² / g) · L\n\n' +
      'where L is the effective length: L = l + r + e (l = thread length, r = radius of bob, e = hook length).\n\n' +
      'A graph of Effective Length L (along X-axis) vs T² (along Y-axis) is a straight line passing through the origin with slope S = Δ(T²) / ΔL. Therefore:\n' +
      'g = 4π² / Slope = 4π² · (ΔL / Δ(T²))\n\n' +
      'A Second’s Pendulum has a period of precisely T = 2 seconds, so T² = 4 s². Its effective length is given by L_sec = 4 / Slope.',
    formula:
      'Effective Length L = l + r + e (in m)\n' +
      'Period T = t / 20 (where t is time for 20 oscillations)\n' +
      'Slope = Δ(T²) / ΔL (from L vs T² graph)\n' +
      'g = 4π² / Slope (m/s²)\n' +
      'Length of Second’s Pendulum = 4 / Slope (m)',
    formulaLatex: 'T = 2\\pi \\sqrt{\\frac{L}{g}} \\implies g = \\frac{4\\pi^2 L}{T^2} = \\frac{4\\pi^2}{\\text{slope}}',
    constants: [
      {
        id: 'bobRadius',
        label: 'Radius of Bob (r)',
        defaultValue: 1.25,
        unit: 'cm',
        step: 0.01,
        description: 'Measured with Vernier Calipers',
      },
      {
        id: 'hookLength',
        label: 'Length of Hook (e)',
        defaultValue: 0.85,
        unit: 'cm',
        step: 0.01,
        description: 'Length from top of bob to thread knot',
      },
      {
        id: 'numOscillations',
        label: 'Number of Oscillations (n)',
        defaultValue: 20,
        unit: '',
        step: 5,
        description: 'Number of oscillations timed per length',
      },
      {
        id: 'stdG',
        label: 'Standard Local g Value',
        defaultValue: 9.80,
        unit: 'm/s²',
        step: 0.01,
        description: 'Standard theoretical value at sea level',
      },
    ],
    columns: [
      { id: 'obs', label: 'Obs. No.', unit: '#' },
      { id: 'threadLength', label: 'Thread Length (l)', unit: 'cm', decimalPlaces: 1, placeholder: '70.0' },
      { id: 'effLength_cm', label: 'Effective Length (L)', unit: 'cm', isDerived: true, decimalPlaces: 2 },
      { id: 'effLength_m', label: 'Effective L', unit: 'm', isDerived: true, decimalPlaces: 3 },
      { id: 't1', label: 'Time t₁', unit: 's', decimalPlaces: 1, placeholder: '33.8' },
      { id: 't2', label: 'Time t₂', unit: 's', decimalPlaces: 1, placeholder: '34.0' },
      { id: 'meanTime', label: 'Mean Time (t)', unit: 's', isDerived: true, decimalPlaces: 2 },
      { id: 'period', label: 'Period T = t/20', unit: 's', isDerived: true, decimalPlaces: 3 },
      { id: 'tSquared', label: 'T²', unit: 's²', isDerived: true, decimalPlaces: 3 },
      { id: 'l_over_t2', label: 'L / T²', unit: 'm/s²', isDerived: true, decimalPlaces: 3 },
    ],
    initialRows: [
      { obs: 1, threadLength: 67.9, t1: 33.5, t2: 33.7 },
      { obs: 2, threadLength: 77.9, t1: 35.8, t2: 36.0 },
      { obs: 3, threadLength: 87.9, t1: 38.0, t2: 38.2 },
      { obs: 4, threadLength: 97.9, t1: 40.0, t2: 40.2 },
      { obs: 5, threadLength: 107.9, t1: 42.0, t2: 42.2 },
      { obs: 6, threadLength: 117.9, t1: 43.9, t2: 44.1 },
    ],
    calculateRow: (row, constants) => {
      const r = Number(constants.bobRadius) || 1.25;
      const e = Number(constants.hookLength) || 0.85;
      const n = Number(constants.numOscillations) || 20;

      const l = Number(row.threadLength) || 0;
      const effCm = roundTo(l + r + e, 2);
      const effM = roundTo(effCm / 100, 3);

      const t1 = Number(row.t1) || 0;
      const t2 = Number(row.t2) || 0;
      const meanTime = roundTo((t1 + t2) / 2, 2);
      const period = n > 0 ? roundTo(meanTime / n, 3) : 0;
      const tSquared = roundTo(period * period, 3);
      const l_over_t2 = tSquared > 0 ? roundTo(effM / tSquared, 3) : 0;

      return {
        ...row,
        effLength_cm: effCm,
        effLength_m: effM,
        meanTime,
        period,
        tSquared,
        l_over_t2,
      };
    },
    calculateResult: (rows, constants) => {
      const stdG = Number(constants.stdG) || 9.8;
      const validPoints = rows
        .filter((r) => r.effLength_m > 0 && r.tSquared > 0)
        .map((r) => ({ x: r.effLength_m, y: r.tSquared }));

      const regression = computeLinearRegression(validPoints);
      // Slope of T^2 vs L is (4 pi^2 / g)
      const slope = regression ? regression.slope : 4.028;
      const gCalculated = slope > 0 ? roundTo((4 * Math.PI * Math.PI) / slope, 2) : 9.8;
      const secondsPendulumLength_m = slope > 0 ? roundTo(4 / slope, 3) : 0.993;
      const secondsPendulumLength_cm = roundTo(secondsPendulumLength_m * 100, 1);

      const pctErr = calculatePercentageError(gCalculated, stdG);

      // Also compute arithmetic mean of g from column L/T^2
      const gArithValues = rows
        .map((r) => roundTo(4 * Math.PI * Math.PI * (r.l_over_t2 || 0), 2))
        .filter((v) => v > 0);
      const meanGArith = calculateMean(gArithValues, 2);

      return {
        steps: [
          {
            label: 'Effective Length Calculation',
            formula: 'L = l + r + e',
            substitution: `Thread length + Bob radius (${constants.bobRadius} cm) + Hook (${constants.hookLength} cm)`,
            result: 'L converted to meters (m)',
          },
          {
            label: 'Time Period',
            formula: 'T = t / 20',
            substitution: `Averaged stop-watch timings divided by ${constants.numOscillations} oscillations`,
            result: 'T (s) and T² (s²)',
          },
          {
            label: 'L vs T² Graph Slope',
            formula: 'Slope = Δ(T²) / ΔL',
            substitution: regression
              ? `Δ(T²) / ΔL = (${regression.y2.toFixed(3)} - ${regression.y1.toFixed(3)}) / (${regression.x2.toFixed(3)} - ${regression.x1.toFixed(3)})`
              : 'Computed via regression',
            result: `${slope.toFixed(4)} s²/m`,
          },
          {
            label: 'Acceleration due to Gravity (g)',
            formula: 'g = 4π² / Slope',
            substitution: `4 × (3.14159)² / ${slope.toFixed(4)} = 39.4784 / ${slope.toFixed(4)}`,
            result: `${gCalculated.toFixed(2)} m/s²`,
          },
          {
            label: 'Length of Second’s Pendulum (T = 2 s)',
            formula: 'L_sec = 4 / Slope',
            substitution: `4 / ${slope.toFixed(4)}`,
            result: `${secondsPendulumLength_m.toFixed(3)} m (${secondsPendulumLength_cm.toFixed(1)} cm)`,
          },
        ],
        finalResult: `Acceleration due to gravity g = ${gCalculated.toFixed(2)} m/s² | Standard g = ${stdG} m/s² | Percentage Error = ${pctErr.errorPercent} | Length of Second's Pendulum = ${secondsPendulumLength_cm.toFixed(1)} cm`,
        percentageError: {
          theoretical: stdG,
          calculated: gCalculated,
          errorPercent: pctErr.errorPercent,
          standardRef: 'Standard acceleration due to gravity (9.80 m/s²)',
        },
        summaryCards: [
          { label: 'Calculated g', value: `${gCalculated.toFixed(2)}`, unit: 'm/s²' },
          { label: 'Standard g', value: `${stdG.toFixed(2)}`, unit: 'm/s²' },
          { label: 'Percentage Error', value: pctErr.errorPercent },
          { label: 'Second’s Pendulum Length', value: `${secondsPendulumLength_cm.toFixed(1)}`, unit: 'cm' },
          { label: 'Graph Slope (T²/L)', value: `${slope.toFixed(4)}`, unit: 's²/m' },
        ],
      };
    },
    graphConfig: {
      xAxisKey: 'effLength_m',
      yAxisKey: 'tSquared',
      xLabel: 'Effective Length (L)',
      yLabel: 'Square of Period (T²)',
      xUnit: 'm',
      yUnit: 's²',
      calculateSlope: true,
      slopeFormula: 'Slope = Δ(T²) / ΔL = 4π² / g (s²/m)',
      slopePhysicalMeaning: 'Slope = 4π²/g; g = 4π² / Slope',
      expectedSlopeRange: '4.00 to 4.05 s²/m',
      yInterceptOrigin: true,
    },
    precautions: [
      'The split cork must clamp the thread tightly at the point of suspension so that the point does not shift during oscillations.',
      'Angular displacement must be strictly less than 15° so that sin θ ≈ θ (in radians) remains valid for SHM.',
      'The pendulum must oscillate strictly in a vertical plane without spinning or elliptical motion.',
      'Start the stopwatch as the bob crosses the mean position (count as zero) and stop precisely on the 20th crossing in the same direction.',
      'Ensure the room is free from air draughts from fans or open windows.',
    ],
    sourcesOfError: [
      'Personal reaction time delay in starting and stopping the manual stopwatch.',
      'Air resistance and buoyancy slightly damping the bob and lengthening the period.',
      'Slight elasticity or stretch of the suspension thread as tension fluctuates.',
      'Non-rigid support stand wobbling slightly during oscillations.',
    ],
    vivaQuestions: [
      {
        category: 'Core Theory',
        q: 'What is a Second’s Pendulum?',
        a: 'A pendulum whose time period is exactly 2 seconds (taking 1 second to swing from one extreme to the other). Its effective length on Earth is approximately 99.3 cm (almost 1 metre).',
      },
      {
        category: 'Core Theory',
        q: 'Why should the angular amplitude be restricted to under 15°?',
        a: 'The formula T = 2π√(L/g) is derived from the simple harmonic approximation sin θ ≈ θ. For large angles, higher-order terms make the motion non-harmonic and period longer.',
      },
      {
        category: 'Core Theory',
        q: 'Why does the time period of a simple pendulum not depend on the mass or material of the bob?',
        a: 'Gravitational restoring force is proportional to gravitational mass (m·g·sin θ), while inertia is proportional to inertial mass (m·a). Since inertial mass equals gravitational mass, mass cancels out completely.',
      },
      {
        category: 'Apparatus & Errors',
        q: 'Why do we time 20 or more oscillations instead of just 1 oscillation?',
        a: 'Human reaction time error is around ±0.2 seconds. Timing 20 oscillations spreads this ±0.2 s uncertainty over 20 cycles, reducing the fractional error in period T to just ±0.01 s.',
      },
      {
        category: 'Calculations',
        q: 'What is the shape of the L – T graph and the L – T² graph?',
        a: 'The L – T graph is a parabola (curved, convex upwards), while the L – T² graph is a straight line passing through the origin.',
      },
      {
        category: 'Core Theory',
        q: 'What happens to the time period of a simple pendulum taken to the centre of the Earth or to the Moon?',
        a: 'At the centre of the Earth where g = 0, T = ∞ (it will not oscillate). On the Moon where g_moon = g/6, T increases by √6 ≈ 2.45 times (oscillates slower).',
      },
      {
        category: 'Precautions',
        q: 'Why should unspun cotton thread be used rather than nylon or silk?',
        a: 'Nylon is elastic and stretches noticeably under the bob weight during swing. Unspun cotton has negligible elasticity and does not twist easily.',
      },
      {
        category: 'Core Theory',
        q: 'If a hollow spherical bob filled with sand slowly leaks from a hole at the bottom, how does its time period change?',
        a: 'As sand drains, the center of gravity first moves downward, increasing effective length L and increasing T. When the bob is completely empty, the CG returns to the geometric center, and T returns to its original value.',
      },
    ],
  },
];
