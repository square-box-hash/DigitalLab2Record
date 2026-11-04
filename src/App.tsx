import React, { useState, useMemo, useEffect } from 'react';
import { EXPERIMENTS, getExperimentNumber } from './data/experiments';
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
import { MobileTabBar } from './components/MobileTabBar';
import { LandingView } from './components/LandingView';
import { InstrumentExplorerView } from './components/InstrumentExplorerView';
import { buildRowsCsv, downloadCsv } from './utils/export';
import {
  Menu,
  TrendingUp,
  FlaskConical,
  ArrowRight,
  Sparkles,
  BookOpen,
  Code2,
  AtSign,
  ArrowUpRight,
} from 'lucide-react';

type RouteView = 'landing' | 'app' | 'instruments';

const STORAGE_KEY = 'cbse_lab_state_v1';
const THEME_KEY = 'cbse_theme_pref';

/** Dark from 19:00 to 06:00 local time, light through the working day. */
const NIGHT_START_HOUR = 19;
const DAY_START_HOUR = 6;

type ThemePreference = 'auto' | 'light' | 'dark';

const isNightNow = (): boolean => {
  const hour = new Date().getHours();
  return hour < DAY_START_HOUR || hour >= NIGHT_START_HOUR;
};

const readThemePreference = (): ThemePreference => {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'auto' || saved === 'light' || saved === 'dark') return saved;
    // Carry over the old two-state key so nobody loses their choice on upgrade.
    const legacy = localStorage.getItem('cbse_theme');
    if (legacy === 'light' || legacy === 'dark') return legacy;
  } catch {
    // storage blocked — fall through to auto
  }
  return 'auto';
};

type ConstantsMap = Record<string, Record<string, number>>;
type RowsMap = Record<string, Array<Record<string, number>>>;

interface PersistedState {
  version?: number;
  savedAt?: string;
  rows?: RowsMap;
  constants?: ConstantsMap;
}

const defaultConstants = (): ConstantsMap => {
  const init: ConstantsMap = {};
  EXPERIMENTS.forEach((exp) => {
    init[exp.id] = {};
    exp.constants.forEach((c) => {
      init[exp.id][c.id] = c.defaultValue;
    });
  });
  return init;
};

const defaultRows = (): RowsMap => {
  const init: RowsMap = {};
  EXPERIMENTS.forEach((exp) => {
    init[exp.id] = exp.initialRows.map((row) => ({ ...row }));
  });
  return init;
};

const readPersisted = (): PersistedState | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PersistedState;
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch {
    return null;
  }
};

/**
 * Restores the last saved session, discarding anything that no longer matches the
 * current experiment schema (renamed columns, removed experiments, junk values).
 */
const buildInitialState = (): { rows: RowsMap; constants: ConstantsMap; savedAt: string | null } => {
  const rows = defaultRows();
  const constants = defaultConstants();
  const persisted = readPersisted();
  if (!persisted) return { rows, constants, savedAt: null };

  EXPERIMENTS.forEach((exp) => {
    const persistedConstants = persisted.constants?.[exp.id];
    if (persistedConstants && typeof persistedConstants === 'object') {
      exp.constants.forEach((c) => {
        const value = persistedConstants[c.id];
        if (typeof value === 'number' && Number.isFinite(value)) {
          constants[exp.id][c.id] = value;
        }
      });
    }

    const persistedRows = persisted.rows?.[exp.id];
    if (Array.isArray(persistedRows) && persistedRows.length > 0) {
      const cleaned = persistedRows
        .filter((row) => row && typeof row === 'object')
        .map((row, index) => {
          const out: Record<string, number> = { obs: index + 1 };
          exp.columns.forEach((col) => {
            if (col.id === 'obs') return;
            const value = row[col.id];
            if (typeof value === 'number' && Number.isFinite(value)) out[col.id] = value;
          });
          return out;
        });
      if (cleaned.length > 0) rows[exp.id] = cleaned;
    }
  });

  return { rows, constants, savedAt: persisted.savedAt ?? null };
};

export default function App() {
  const [activeExpId, setActiveExpId] = useState<string>('vernier-calipers');
  const [currentTab, setCurrentTab] = useState<'simulation' | 'workspace' | 'record' | 'viva' | 'theory'>('simulation');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [showSimInWorkspace, setShowSimInWorkspace] = useState<boolean>(true);

  // Landing page vs workspace, driven by the URL hash so it can be linked and
  // the browser's back button does the obvious thing.
  //   (nothing)          → landing
  //   #/lab              → workspace
  //   #/lab/<exp-id>     → workspace with that practical selected
  const readRoute = (): { view: RouteView; experimentId?: string } => {
    if (typeof window === 'undefined') return { view: 'landing' };
    const raw = window.location.hash.replace(/^#\/?/, '');
    const [section, experimentId] = raw.split('/');
    const view: RouteView =
      section === 'lab' ? 'app' : section === 'instruments' ? 'instruments' : 'landing';
    return { view, experimentId: experimentId || undefined };
  };

  const [route, setRoute] = useState<{ view: RouteView; experimentId?: string }>(readRoute);

  useEffect(() => {
    const applyHash = () => {
      const next = readRoute();
      setRoute(next);
      if (next.experimentId && EXPERIMENTS.some((exp) => exp.id === next.experimentId)) {
        setActiveExpId(next.experimentId);
      }
    };
    applyHash();
    window.addEventListener('hashchange', applyHash);
    return () => window.removeEventListener('hashchange', applyHash);
  }, []);

  const goToLab = (experimentId?: string) => {
    if (experimentId) setActiveExpId(experimentId);
    window.location.hash = experimentId ? `#/lab/${experimentId}` : '#/lab';
    setRoute({ view: 'app', experimentId });
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const goHome = () => {
    window.history.pushState(null, '', window.location.pathname);
    setRoute({ view: 'landing' });
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const goToInstruments = () => {
    window.location.hash = '#/instruments';
    setRoute({ view: 'instruments' });
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  // Theme follows the clock unless the reader pins one explicitly.
  const [themePreference, setThemePreference] = useState<ThemePreference>(readThemePreference);
  const [isNight, setIsNight] = useState<boolean>(isNightNow);

  // Re-check the clock every minute and whenever the tab comes back into focus,
  // so a page left open across the boundary flips on its own.
  useEffect(() => {
    const tick = () => setIsNight(isNightNow());
    const timer = window.setInterval(tick, 60_000);
    const onVisible = () => {
      if (document.visibilityState === 'visible') tick();
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, []);

  const isDark = themePreference === 'auto' ? isNight : themePreference === 'dark';

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
    try {
      localStorage.setItem(THEME_KEY, themePreference);
    } catch {
      // storage blocked — the theme still applies for this session
    }
  }, [isDark, themePreference]);

  /**
   * One tap always changes what you see: pin the opposite of the automatic
   * theme, and tap again to hand control back to the clock.
   */
  const handleToggleTheme = () => {
    const automatic = isNightNow();
    setThemePreference((prev) => {
      if (prev === 'auto') return automatic ? 'light' : 'dark';
      const showingDark = prev === 'dark';
      return showingDark === automatic ? (showingDark ? 'light' : 'dark') : 'auto';
    });
  };

  // Restored from the last session where available (see buildInitialState).
  const [initial] = useState(buildInitialState);

  // Per-experiment dynamic constants state
  const [constantsState, setConstantsState] = useState<ConstantsMap>(initial.constants);

  // Per-experiment rows state
  const [rowsState, setRowsState] = useState<RowsMap>(initial.rows);

  const [savedAt, setSavedAt] = useState<string | null>(initial.savedAt);

  // Debounced autosave: observations survive a refresh, a back-navigation or a
  // dropped connection instead of disappearing with the tab.
  useEffect(() => {
    const timer = setTimeout(() => {
      const stamp = new Date().toISOString();
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ version: 1, savedAt: stamp, rows: rowsState, constants: constantsState })
        );
        setSavedAt(stamp);
      } catch {
        // Storage full or blocked (private mode) — keep working from memory.
      }
    }, 600);
    return () => clearTimeout(timer);
  }, [rowsState, constantsState]);

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

  const handleExportCsv = () => {
    const csv = buildRowsCsv(activeExp, computedRows, activeConstants, calculationResult);
    downloadCsv(`${activeExp.id}-observations.csv`, csv);
  };

  const handleClearSaved = () => {
    const confirmed = window.confirm(
      'Delete the observations saved in this browser and restore the sample data for every experiment?'
    );
    if (!confirmed) return;
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    setConstantsState(defaultConstants());
    setRowsState(defaultRows());
    setSavedAt(null);
  };

  const savedLabel = savedAt
    ? new Date(savedAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
    : null;

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
    route.view === 'instruments' ? (
      <InstrumentExplorerView
        onHome={goHome}
        onEnterLab={() => goToLab()}
        isDark={isDark}
        onToggleTheme={handleToggleTheme}
      />
    ) : route.view === 'landing' ? (
      <LandingView
        onEnterLab={goToLab}
        onOpenInstruments={goToInstruments}
        isDark={isDark}
        themePreference={themePreference}
        onToggleTheme={handleToggleTheme}
      />
    ) : (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-800 dark:text-stone-100 flex flex-col transition-colors duration-200">
      {/* Global Header */}
      <Header
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        onPrint={handlePrint}
        onHome={goHome}
        hasGraph={Boolean(activeExp.graphConfig)}
        isDark={isDark}
        themePreference={themePreference}
        onToggleTheme={handleToggleTheme}
      />

      {/* Main Layout Area */}
      <div className="flex-1 max-w-[1440px] w-full mx-auto flex">
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
        <main className="flex-1 min-w-0 px-3 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8 space-y-5 sm:space-y-6 pb-24 lg:pb-8">
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

          {/* Experiment header */}
          <div className="no-print space-y-1.5">
            <p className="font-mono text-[11px] tracking-[0.04em] text-stone-500 dark:text-stone-500">
              {activeExp.section} · {(activeExp.categoryTitle || '').replace(/^Section [AB]:\s*/, '')} · Experiment{' '}
              {getExperimentNumber(activeExp.id)}
            </p>
            <h1 className="text-[clamp(26px,3.2vw,38px)] leading-[1.06]">{activeExp.title}</h1>
            <p className="text-[14px] text-stone-600 dark:text-stone-400 max-w-[72ch] leading-relaxed">
              {activeExp.aim}
            </p>
          </div>

          {/* TAB 1: VIRTUAL SIMULATOR */}
          {currentTab === 'simulation' && (
            <div className="space-y-6">
              <SimulatorContainer
                experiment={activeExp}
                constants={activeConstants}
                onLogSimulatedRow={handleLogSimulatedRow}
              />

              {/* Slim link through to the observations */}
              <div className="flex flex-wrap items-center justify-between gap-2 px-1">
                <p className="text-[12px] text-stone-500 dark:text-stone-500 font-sans">
                  <span className="font-mono text-stone-700 dark:text-stone-300">{computedRows.length}</span>{' '}
                  readings logged — they feed the table, the graph and the record.
                </p>

                <button
                  onClick={() => setCurrentTab('workspace')}
                  className="inline-flex items-center gap-1.5 text-[12px] font-medium text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
                >
                  <span>Open observations</span>
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
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-mono text-stone-400 dark:text-stone-500">
                    {savedLabel ? `Saved locally at ${savedLabel}` : 'Not saved yet'}
                  </span>
                  <button
                    onClick={() => setShowSimInWorkspace(!showSimInWorkspace)}
                    className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:text-amber-700 flex items-center gap-1 hover:underline"
                  >
                    <FlaskConical className="w-3.5 h-3.5" />
                    <span>{showSimInWorkspace ? 'Hide Virtual Rig' : 'Show Virtual Rig'}</span>
                  </button>
                </div>
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
                onExportCsv={handleExportCsv}
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
                  constants={activeConstants}
                  experimentTitle={activeExp.title}
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
      <footer className="no-print bg-white dark:bg-stone-950 border-t border-stone-200/80 dark:border-stone-800/80 py-7 mt-12 mb-16 lg:mb-0 text-center text-xs text-stone-500 dark:text-stone-400 transition-colors">
        <div className="max-w-[1440px] mx-auto px-4 flex flex-col items-center gap-4 sm:gap-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 w-full">
            <p className="font-serif italic text-sm text-stone-700 dark:text-stone-300 text-center sm:text-left">
              DigitalLab2Record · CBSE Physics Practicals Companion · Class XI
            </p>

            <div className="flex flex-wrap items-center justify-center gap-2">
              <a
                href="https://github.com/square-box-hash"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg text-[11px] font-mono font-semibold text-stone-600 dark:text-stone-300 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 hover:border-amber-400 hover:text-amber-700 dark:hover:text-amber-400 transition-colors"
              >
                <AtSign className="w-3.5 h-3.5" />
                square-box-hash
              </a>
              <a
                href="https://github.com/square-box-hash/DigitalLab2Record"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg text-[11px] font-mono font-semibold text-stone-600 dark:text-stone-300 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 hover:border-amber-400 hover:text-amber-700 dark:hover:text-amber-400 transition-colors"
              >
                <Code2 className="w-3.5 h-3.5" />
                DigitalLab2Record
                <ArrowUpRight className="w-3 h-3 opacity-60" />
              </a>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-[11px] font-mono text-stone-400 dark:text-stone-500">
            <span>Based on NCERT Practical Curriculum & Examination Standards</span>
            {savedLabel && <span className="hidden sm:inline">•</span>}
            {savedLabel && <span>Autosaved {savedLabel}</span>}
            <button
              onClick={handleClearSaved}
              className="text-stone-400 dark:text-stone-500 hover:text-rose-600 dark:hover:text-rose-400 underline underline-offset-2"
            >
              Clear saved data
            </button>
          </div>
        </div>
      </footer>

      {/* Phone navigation: the header dock only fits from lg upwards. */}
      <MobileTabBar
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        hasGraph={Boolean(activeExp.graphConfig)}
      />
    </div>
    )
  );
}
