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
  Sparkles,
  FileCheck,
} from 'lucide-react';

interface HeaderProps {
  currentTab: 'simulation' | 'workspace' | 'record' | 'viva' | 'theory';
  onTabChange: (tab: 'simulation' | 'workspace' | 'record' | 'viva' | 'theory') => void;
  onResetData: () => void;
  onPrint: () => void;
  activeExperimentTitle: string;
  hasGraph: boolean;
  isDark: boolean;
  onToggleTheme: () => void;
}

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
    <header className="no-print sticky top-0 z-30 bg-[#faf9f6]/90 dark:bg-[#0c0e14]/90 backdrop-blur-md border-b border-stone-200/80 dark:border-stone-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Logo & Subject Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-stone-900 dark:bg-stone-100 flex items-center justify-center text-amber-400 dark:text-stone-900 shadow-sm border border-stone-800 dark:border-white">
              <Atom className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-baseline space-x-2">
                <span className="font-serif font-bold text-stone-900 dark:text-stone-100 tracking-tight text-lg sm:text-xl">
                  CBSE Physics
                </span>
                <span className="text-[10px] font-mono tracking-widest uppercase font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                  Lab Report XI
                </span>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400 hidden sm:block truncate max-w-xs md:max-w-sm font-sans">
                {activeExperimentTitle}
              </p>
            </div>
          </div>

          {/* Navigation Tabs (Refined interactive pill dock) */}
          <nav className="flex items-center space-x-1 bg-stone-200/60 dark:bg-stone-900/90 p-1 rounded-xl border border-stone-300/60 dark:border-stone-800 text-xs sm:text-sm font-medium">
            <button
              onClick={() => onTabChange('simulation')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all ${
                currentTab === 'simulation'
                  ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-white shadow-xs font-semibold'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              <FlaskConical className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>Simulator</span>
              <span className="hidden sm:inline-block px-1.5 py-0.2 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400 text-[9px] font-mono font-bold">
                LIVE
              </span>
            </button>

            <button
              onClick={() => onTabChange('workspace')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all ${
                currentTab === 'workspace'
                  ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-white shadow-xs font-semibold'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              <Table2 className="w-3.5 h-3.5" />
              <span>Observations</span>
              {hasGraph && (
                <span className="hidden md:inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              )}
            </button>

            <button
              onClick={() => onTabChange('record')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all ${
                currentTab === 'record'
                  ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-white shadow-xs font-semibold'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Record File</span>
              <span className="sm:hidden">Record</span>
            </button>

            <button
              onClick={() => onTabChange('viva')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all ${
                currentTab === 'viva'
                  ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-white shadow-xs font-semibold'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Viva Voce</span>
            </button>

            <button
              onClick={() => onTabChange('theory')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all ${
                currentTab === 'theory'
                  ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-white shadow-xs font-semibold'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Theory</span>
            </button>
          </nav>

          {/* Quick Actions & Theme Switcher */}
          <div className="flex items-center space-x-2">
            {/* Theme Toggle Button */}
            <button
              onClick={onToggleTheme}
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              className="p-2 rounded-xl bg-stone-200/70 dark:bg-stone-800/80 text-stone-700 dark:text-stone-300 hover:bg-stone-300 dark:hover:bg-stone-700 border border-stone-300/70 dark:border-stone-700/80 transition-colors shadow-2xs"
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400 hover:rotate-45 transition-transform" />
              ) : (
                <Moon className="w-4 h-4 text-stone-700 hover:-rotate-12 transition-transform" />
              )}
            </button>

            <button
              onClick={onResetData}
              title="Reset observation table to benchmark values"
              className="hidden lg:flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 dark:text-stone-300 bg-white dark:bg-stone-800/90 border border-stone-200 dark:border-stone-700 rounded-xl hover:bg-stone-50 dark:hover:bg-stone-700 transition-colors shadow-2xs"
            >
              <RotateCcw className="w-3 h-3 text-stone-400" />
              <span>Reset</span>
            </button>

            <button
              onClick={onPrint}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-bold text-stone-900 dark:text-stone-950 bg-amber-400 hover:bg-amber-300 dark:bg-amber-400 dark:hover:bg-amber-300 rounded-xl transition-all shadow-sm shadow-amber-200/50 dark:shadow-none"
            >
              <Printer className="w-3.5 h-3.5 text-stone-950" />
              <span>Print A4</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
