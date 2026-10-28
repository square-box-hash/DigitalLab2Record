import React, { useState, useMemo, useEffect } from 'react';
import { EXPERIMENTS } from './data/experiments';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { InstrumentSetupCard } from './components/InstrumentSetupCard';
import { ObservationTable } from './components/ObservationTable';
import { CalculationEngine } from './components/CalculationEngine';
import { RegressionGraph } from './components/RegressionGraph';
import { CbseRecordView } from './components/CbseRecordView';
import { VivaVoceAccordion } from './components/VivaVoceAccordion';
import { TheoryView } from './components/TheoryView';
import { SimulatorContainer } from './components/simulations/SimulatorContainer';
import {
  Menu,
  TrendingUp,
  FlaskConical,
  ArrowRight,
  Table2,
  Sparkles,
  BookOpen,
} from 'lucide-react';

export default function App() {
  const [activeExpId, setActiveExpId] = useState<string>('vernier-calipers');
  const [currentTab, setCurrentTab] = useState<'simulation' | 'workspace' | 'record' | 'viva' | 'theory'>('simulation');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [showSimInWorkspace, setShowSimInWorkspace] = useState<boolean>(true);

  // Light / Dark Theme State (synced with HTML root class)
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('cbse_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('cbse_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('cbse_theme', 'light');
    }
  }, [isDark]);

  const handleToggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  // Per-experiment dynamic constants state
  const [constantsState, setConstantsState] = useState<Record<string, Record<string, number>>>(() => {
    const init: Record<string, Record<string, number>> = {};
    EXPERIMENTS.forEach((exp) => {
      init[exp.id] = {};
      exp.constants.forEach((c) => {
        init[exp.id][c.id] = c.defaultValue;
      });
    });
    return init;
  });

  // Per-experiment rows state
  const [rowsState, setRowsState] = useState<Record<string, Array<Record<string, number>>>>(() => {
    const init: Record<string, Array<Record<string, number>>> = {};
    EXPERIMENTS.forEach((exp) => {
      init[exp.id] = [...exp.initialRows];
    });
    return init;
  });

  const activeExp = useMemo(() => {
    return EXPERIMENTS.find((e) => e.id === activeExpId) || EXPERIMENTS[0];
  }, [activeExpId]);

  const activeConstants = constantsState[activeExp.id] || {};
  const activeRawRows = rowsState[activeExp.id] || [];

  const computedRows = useMemo(() => {
    return activeRawRows.map((row) => activeExp.calculateRow(row, activeConstants));
  }, [activeRawRows, activeConstants, activeExp]);

  const calculationResult = useMemo(() => {
    return activeExp.calculateResult(computedRows, activeConstants);
  }, [computedRows, activeConstants, activeExp]);

  const handleConstantChange = (id: string, value: number) => {
    setConstantsState((prev) => ({
      ...prev,
      [activeExp.id]: {
        ...(prev[activeExp.id] || {}),
        [id]: value,
      },
    }));
  };

  const handleResetConstants = () => {
    const resetVals: Record<string, number> = {};
    activeExp.constants.forEach((c) => {
      resetVals[c.id] = c.defaultValue;
    });
    setConstantsState((prev) => ({
      ...prev,
      [activeExp.id]: resetVals,
    }));
  };

  const handleRowChange = (rowIndex: number, columnId: string, value: number) => {
    setRowsState((prev) => {
      const currentList = [...(prev[activeExp.id] || [])];
      currentList[rowIndex] = {
        ...currentList[rowIndex],
        [columnId]: value,
      };
      return {
        ...prev,
        [activeExp.id]: currentList,
      };
    });
  };

  const handleAddRow = () => {
    setRowsState((prev) => {
      const currentList = [...(prev[activeExp.id] || [])];
      const nextObs = currentList.length + 1;
      const newRow: Record<string, number> = { obs: nextObs };

      if (currentList.length > 0) {
        const lastRow = currentList[currentList.length - 1];
        activeExp.columns.forEach((col) => {
          if (!col.isDerived && col.id !== 'obs') {
            newRow[col.id] = lastRow[col.id] ?? 0;
          }
        });
      }

      return {
        ...prev,
        [activeExp.id]: [...currentList, newRow],
      };
    });
  };

  const handleDeleteRow = (rowIndex: number) => {
    setRowsState((prev) => {
      const currentList = [...(prev[activeExp.id] || [])];
      if (currentList.length <= 1) return prev;
      currentList.splice(rowIndex, 1);
      const reindexed = currentList.map((r, i) => ({ ...r, obs: i + 1 }));
      return {
        ...prev,
        [activeExp.id]: reindexed,
      };
    });
  };

  const handleResetRows = () => {
    setRowsState((prev) => ({
      ...prev,
      [activeExp.id]: [...activeExp.initialRows],
    }));
  };

  const handleLogSimulatedRow = (newValues: Record<string, number>) => {
    setRowsState((prev) => {
      const currentList = [...(prev[activeExp.id] || [])];
      const nextObs = currentList.length + 1;
      const newRow: Record<string, number> = {
        obs: nextObs,
        ...newValues,
      };
      return {
        ...prev,
        [activeExp.id]: [...currentList, newRow],
      };
    });
  };

  const handlePrint = () => {
    if (currentTab !== 'record') {
      setCurrentTab('record');
      setTimeout(() => {
        window.print();
      }, 300);
    } else {
      window.print();
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] dark:bg-[#0c0e14] text-stone-800 dark:text-stone-100 flex flex-col transition-colors duration-200">
      {/* Global Header */}
      <Header
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        onResetData={handleResetRows}
        onPrint={handlePrint}
        activeExperimentTitle={activeExp.title}
        hasGraph={Boolean(activeExp.graphConfig)}
        isDark={isDark}
        onToggleTheme={handleToggleTheme}
      />

      {/* Main Layout Area */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        {/* Sidebar */}
        <Sidebar
          experiments={EXPERIMENTS}
          activeId={activeExp.id}
          onSelectExperiment={(id) => {
            setActiveExpId(id);
          }}
          isOpenMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* Content Pane */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Mobile Top Bar */}
          <div className="no-print lg:hidden flex items-center justify-between bg-white dark:bg-stone-900 p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 shadow-2xs">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="flex items-center space-x-2 text-xs font-bold text-stone-700 dark:text-stone-200 hover:text-amber-600"
            >
              <Menu className="w-4 h-4 text-amber-500" />
              <span>Select Practical ({activeExp.section})</span>
            </button>
            <span className="text-xs font-mono font-medium text-stone-500 dark:text-stone-400 truncate max-w-[150px]">
              {activeExp.title}
            </span>
          </div>

          {/* Editorial Annual Report Hero Banner */}
          <div className="no-print bg-white dark:bg-[#12151e] rounded-2xl border border-stone-200/90 dark:border-stone-800/90 shadow-sm p-6 sm:p-7 space-y-3 transition-colors">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center space-x-2 text-xs font-mono">
                <span className="px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-800 dark:text-amber-400 font-bold uppercase tracking-widest text-[10px] border border-amber-500/20">
                  {activeExp.section}
                </span>
                <span className="text-stone-300 dark:text-stone-700">•</span>
                <span className="font-sans font-medium text-stone-500 dark:text-stone-400 text-xs">
                  {activeExp.categoryTitle}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                {activeExp.graphConfig && (
                  <span className="inline-flex items-center text-[10px] font-mono font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    LINEAR FIT GRAPH
                  </span>
                )}
                <span className="text-[10px] font-mono font-semibold text-amber-700 dark:text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20 flex items-center gap-1">
                  <FlaskConical className="w-3 h-3" />
                  VIRTUAL RIG
                </span>
              </div>
            </div>

            {/* Editorial Serif Title */}
            <h1 className="font-serif italic font-bold text-2xl sm:text-3xl text-stone-900 dark:text-stone-50 tracking-tight leading-snug">
              {activeExp.title}
            </h1>
            
            {/* Elegant Aim callout box */}
            <div className="p-3.5 bg-[#faf9f6] dark:bg-stone-900/60 rounded-xl border-l-2 border-amber-500 text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-sans">
              <strong className="text-stone-900 dark:text-white font-semibold">Objective:</strong> {activeExp.aim}
            </div>
          </div>

          {/* TAB 1: VIRTUAL SIMULATOR */}
          {currentTab === 'simulation' && (
            <div className="space-y-6">
              <SimulatorContainer
                experiment={activeExp}
                constants={activeConstants}
                onLogSimulatedRow={handleLogSimulatedRow}
              />

              {/* Navigation Pill to Observations */}
              <div className="p-4 bg-stone-100/80 dark:bg-stone-900/60 rounded-2xl border border-stone-200/80 dark:border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-xl bg-stone-900 dark:bg-stone-100 text-amber-400 dark:text-stone-950 flex items-center justify-center shrink-0">
                    <Table2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-stone-900 dark:text-white font-sans">
                      Observations Logged: {computedRows.length} Data Rows
                    </h4>
                    <p className="text-xs text-stone-500 dark:text-stone-400 font-sans">
                      Readings taken from this rig are instantly propagated to the observation spreadsheet and graph.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setCurrentTab('workspace')}
                  className="flex items-center space-x-1.5 px-4 py-2 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 rounded-xl text-xs font-bold hover:bg-stone-800 dark:hover:bg-white transition-all shadow-xs self-start sm:self-auto"
                >
                  <span>View Observations & Proofs</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Calculation Summary Card */}
              <CalculationEngine
                calculation={calculationResult}
                formulaLatex={activeExp.formulaLatex}
                title={activeExp.title}
              />
            </div>
          )}

          {/* TAB 2: LAB SHEET */}
          {currentTab === 'workspace' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center space-x-2">
                  <span className="text-[11px] font-mono font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest">
                    Laboratory Workspace & Analysis
                  </span>
                </div>
                <button
                  onClick={() => setShowSimInWorkspace(!showSimInWorkspace)}
                  className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:text-amber-700 flex items-center gap-1 hover:underline"
                >
                  <FlaskConical className="w-3.5 h-3.5" />
                  <span>{showSimInWorkspace ? 'Hide Virtual Rig' : 'Show Virtual Rig'}</span>
                </button>
              </div>

              {showSimInWorkspace && (
                <SimulatorContainer
                  experiment={activeExp}
                  constants={activeConstants}
                  onLogSimulatedRow={handleLogSimulatedRow}
                />
              )}

              <InstrumentSetupCard
                constants={activeExp.constants}
                values={activeConstants}
                onChange={handleConstantChange}
                onResetConstants={handleResetConstants}
              />

              <ObservationTable
                columns={activeExp.columns}
                rows={computedRows}
                onRowChange={handleRowChange}
                onAddRow={handleAddRow}
                onDeleteRow={handleDeleteRow}
                onResetRows={handleResetRows}
              />

              <CalculationEngine
                calculation={calculationResult}
                formulaLatex={activeExp.formulaLatex}
                title={activeExp.title}
              />

              {activeExp.graphConfig && (
                <RegressionGraph
                  graphConfig={activeExp.graphConfig}
                  rows={computedRows}
                  experimentId={activeExp.id}
                />
              )}
            </div>
          )}

          {/* TAB 3: CBSE RECORD VIEW */}
          {currentTab === 'record' && (
            <CbseRecordView
              experiment={activeExp}
              rows={computedRows}
              constants={activeConstants}
              calculation={calculationResult}
              onPrint={handlePrint}
            />
          )}

          {/* TAB 4: VIVA VOCE BANK */}
          {currentTab === 'viva' && (
            <VivaVoceAccordion
              questions={activeExp.vivaQuestions}
              experimentTitle={activeExp.title}
            />
          )}

          {/* TAB 5: THEORY & MANUAL */}
          {currentTab === 'theory' && (
            <TheoryView experiment={activeExp} />
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="no-print bg-white dark:bg-[#0c0e14] border-t border-stone-200/80 dark:border-stone-800/80 py-7 mt-12 text-center text-xs text-stone-500 dark:text-stone-400 transition-colors">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-serif italic text-sm text-stone-700 dark:text-stone-300">
            CBSE Physics Practicals Companion • Class 11 Laboratory Manual
          </p>
          <p className="text-[11px] font-mono text-stone-400 dark:text-stone-500">
            Based on NCERT Practical Curriculum & Examination Standards
          </p>
        </div>
      </footer>
    </div>
  );
}
