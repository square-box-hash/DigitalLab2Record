import React from 'react';
import {
  Atom,
  Printer,
  RotateCcw,
  BookOpen,
  HelpCircle,
  Table2,
  FlaskConical,
  Sun,
  Moon,
  FileCheck,
} from 'lucide-react';

type TabId = 'simulation' | 'workspace' | 'record' | 'viva' | 'theory';

interface HeaderProps {
  currentTab: TabId;
  onTabChange: (tab: TabId) => void;
  onResetData: () => void;
  onPrint: () => void;
  activeExperimentTitle: string;
  hasGraph: boolean;
  isDark: boolean;
  onToggleTheme: () => void;
}

const TABS: Array<{ id: TabId; label: string; shortLabel: string; icon: React.ElementType }> = [
  { id: 'simulation', label: 'Simulator', shortLabel: 'Rig', icon: FlaskConical },
  { id: 'workspace', label: 'Observations', shortLabel: 'Table', icon: Table2 },
  { id: 'record', label: 'Record File', shortLabel: 'Record', icon: FileCheck },
  { id: 'viva', label: 'Viva Voce', shortLabel: 'Viva', icon: HelpCircle },
  { id: 'theory', label: 'Theory', shortLabel: 'Theory', icon: BookOpen },
];

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onTabChange,
  onResetData,
  onPrint,
  activeExperimentTitle,
  hasGraph,
  isDark,
  onToggleTheme,
}) => {
  return (
    <header className="no-print sticky top-0 z-30 bg-[#faf9f6]/95 dark:bg-[#0c0e14]/95 backdrop-blur-md border-b border-stone-200/80 dark:border-stone-800/80 transition-colors">
      <div className="max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-2 sm:gap-4">
          {/* Brand */}
          <div className="flex items-center space-x-2.5 sm:space-x-3 min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 shrink-0 rounded-xl bg-stone-900 dark:bg-stone-100 flex items-center justify-center text-amber-400 dark:text-stone-900 shadow-sm border border-stone-800 dark:border-white">
              <Atom className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" />
            </div>
            <div className="min-w-0">
              <div className="flex items-baseline space-x-2">
                <span className="font-serif font-bold text-stone-900 dark:text-stone-100 tracking-tight text-base sm:text-lg lg:text-xl whitespace-nowrap">
                  CBSE Physics
                </span>
                <span className="hidden sm:inline-block text-[10px] font-mono tracking-widest uppercase font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                  Lab Report XI
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-stone-500 dark:text-stone-400 truncate max-w-[42vw] sm:max-w-xs md:max-w-sm font-sans">
                {activeExperimentTitle}
              </p>
            </div>
          </div>

          {/* Desktop tab dock — hidden on phones, which use the bottom bar instead */}
          <nav
            aria-label="Experiment sections"
            className="hidden lg:flex items-center space-x-1 bg-stone-200/60 dark:bg-stone-900/90 p-1 rounded-xl border border-stone-300/60 dark:border-stone-800 text-xs sm:text-sm font-medium"
          >
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all ${
                    isActive
                      ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-white shadow-xs font-semibold'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  <span>{tab.label}</span>
                  {tab.id === 'simulation' && (
                    <span className="hidden xl:inline-block px-1.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400 text-[9px] font-mono font-bold">
                      LIVE
                    </span>
                  )}
                  {tab.id === 'workspace' && hasGraph && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
            <button
              onClick={onToggleTheme}
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              className="flex items-center justify-center h-9 w-9 rounded-xl bg-stone-200/70 dark:bg-stone-800/80 text-stone-700 dark:text-stone-300 hover:bg-stone-300 dark:hover:bg-stone-700 border border-stone-300/70 dark:border-stone-700/80 transition-colors shadow-2xs"
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-stone-700" />
              )}
            </button>

            <button
              onClick={onResetData}
              title="Reset observation table to benchmark values"
              aria-label="Reset observation table to benchmark values"
              className="hidden lg:flex items-center gap-1.5 h-9 px-3 text-xs font-medium text-stone-700 dark:text-stone-300 bg-white dark:bg-stone-800/90 border border-stone-200 dark:border-stone-700 rounded-xl hover:bg-stone-50 dark:hover:bg-stone-700 transition-colors shadow-2xs"
            >
              <RotateCcw className="w-3 h-3 text-stone-400" />
              <span>Reset</span>
            </button>

            <button
              onClick={onPrint}
              aria-label="Print the A4 record page"
              className="flex items-center justify-center gap-1.5 h-9 w-9 sm:w-auto px-0 sm:px-3.5 text-xs font-bold text-stone-900 dark:text-stone-950 bg-amber-400 hover:bg-amber-300 dark:bg-amber-400 dark:hover:bg-amber-300 rounded-xl transition-all shadow-sm shadow-amber-200/50 dark:shadow-none"
            >
              <Printer className="w-4 h-4 text-stone-950" />
              <span className="hidden sm:inline">Print A4</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
