export interface ExperimentConstant {
  id: string;
  label: string;
  defaultValue: number;
  unit: string;
  step?: number;
  description?: string;
}

export interface ExperimentColumn {
  id: string;
  label: string;
  unit?: string;
  isDerived?: boolean;
  decimalPlaces?: number;
  tooltip?: string;
  placeholder?: string;
  /** Set false for columns whose average is meaningless (error %, T², division counts). */
  showMean?: boolean;
}

export interface CalculationStep {
  label: string;
  formula: string;
  substitution: string;
  result: string;
}

export interface PercentageError {
  theoretical: number;
  calculated: number;
  errorPercent: string;
  standardRef?: string;
}

export interface SummaryCard {
  label: string;
  value: string;
  unit?: string;
  subtext?: string;
}

export interface ErrorAnalysisEntry {
  symbol: string;
  quantity: string;
  unit: string;
  mean: string;
  meanAbsError: string;
  percentageError: string;
  /** CBSE-style statement of the result: "D = (2.15 ± 0.01) cm" */
  notation: string;
  /** How this entry's error was obtained, when it is a propagated one. */
  basis?: string;
}

export interface ErrorAnalysis {
  /** Number of repeated readings the mean and mean absolute error come from. */
  readings: number;
  entries: ErrorAnalysisEntry[];
  steps: CalculationStep[];
  note?: string;
}

export interface CalculationResult {
  steps: CalculationStep[];
  finalResult: string;
  percentageError?: PercentageError;
  summaryCards?: SummaryCard[];
  errorAnalysis?: ErrorAnalysis;
}

export interface GraphConfig {
  xAxisKey: string;
  yAxisKey: string;
  xLabel: string;
  yLabel: string;
  xUnit: string;
  yUnit: string;
  calculateSlope: boolean;
  slopeFormula?: string;
  slopePhysicalMeaning?: string;
  expectedSlopeRange?: string;
  yInterceptOrigin?: boolean;
}

export interface VivaQuestion {
  q: string;
  a: string;
  category?: 'Core Theory' | 'Apparatus & Errors' | 'Precautions' | 'Calculations';
}

export interface ExperimentConfig {
  id: string;
  section: 'Section A' | 'Section B';
  categoryTitle?: string;
  title: string;
  aim: string;
  apparatus: string[];
  theory: string;
  formula: string;
  formulaLatex?: string;
  diagramTitle?: string;
  diagramDescription?: string;
  constants: ExperimentConstant[];
  columns: ExperimentColumn[];
  initialRows: Array<Record<string, number>>;
  calculateRow: (row: Record<string, number>, constants: Record<string, number>) => Record<string, number>;
  calculateResult: (rows: Array<Record<string, number>>, constants: Record<string, number>) => CalculationResult;
  graphConfig?: GraphConfig;
  precautions: string[];
  sourcesOfError: string[];
  vivaQuestions: VivaQuestion[];
  ncertReference?: string;
}
