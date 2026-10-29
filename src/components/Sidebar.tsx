import React, { useState } from 'react';
import { ExperimentConfig } from '../types/experiment';
import { Search, ChevronRight, TrendingUp, CheckCircle2, FlaskConical, X } from 'lucide-react';

interface SidebarProps {
  experiments: ExperimentConfig[];
  activeId: string;
  onSelectExperiment: (id: string) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  experiments,
  activeId,
  onSelectExperiment,
  isOpenMobile,
  onCloseMobile,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = experiments.filter((exp) => {
    const q = searchQuery.toLowerCase();
    return (
      exp.title.toLowerCase().includes(q) ||
      exp.aim.toLowerCase().includes(q) ||
      exp.section.toLowerCase().includes(q) ||
      exp.apparatus.some((a) => a.toLowerCase().includes(q))
    );
  });

  const sectionA = filtered.filter((exp) => exp.section === 'Section A');
  const sectionB = filtered.filter((exp) => exp.section === 'Section B');

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-stone-950/70 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Sidebar Content */}
      <aside
        className={`fixed lg:sticky top-0 lg:top-16 left-0 h-full lg:h-[calc(100vh-4rem)] w-72 sm:w-80 bg-[#fbf9f5] dark:bg-[#0e1118] border-r border-stone-200/80 dark:border-stone-800/80 z-50 lg:z-10 flex flex-col transition-all duration-300 ease-in-out ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Sidebar Header & Search */}
        <div className="p-4 border-b border-stone-200/80 dark:border-stone-800/80 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="font-serif italic font-bold text-base text-stone-900 dark:text-stone-100">
                Practicals Index
              </span>
              <span className="text-[10px] font-mono uppercase bg-amber-500/10 text-amber-700 dark:text-amber-400 px-1.5 py-0.2 rounded border border-amber-500/20 font-bold">
                7 Labs
              </span>
            </div>
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1 rounded-md text-stone-400 hover:text-stone-700 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Filter by keyword, apparatus..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 transition-all font-sans"
            />
          </div>
        </div>

        {/* Experiment List */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-5">
          {/* Section A */}
          <div>
            <div className="flex items-center justify-between px-2 mb-2">
              <span className="text-[10px] font-mono font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest">
                Section A: Mechanics & Measurements
              </span>
              <span className="text-[10px] bg-stone-200/70 dark:bg-stone-800 text-stone-600 dark:text-stone-400 font-mono font-bold px-1.5 py-0.2 rounded">
                {sectionA.length}
              </span>
            </div>
            <div className="space-y-1">
              {sectionA.map((exp, idx) => {
                const isActive = exp.id === activeId;
                return (
                  <button
                    key={exp.id}
                    onClick={() => {
                      onSelectExperiment(exp.id);
                      onCloseMobile();
                    }}
                    className={`w-full text-left p-3 rounded-xl transition-all flex items-start justify-between group border ${
                      isActive
                        ? 'bg-white dark:bg-stone-900 border-stone-300 dark:border-stone-700 text-stone-950 dark:text-white shadow-xs'
                        : 'hover:bg-stone-200/50 dark:hover:bg-stone-900/40 border-transparent text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    <div className="space-y-1 pr-2">
                      <div className="flex items-center space-x-2">
                        <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-md ${
                          isActive
                            ? 'bg-amber-400 text-stone-950'
                            : 'bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
                        }`}>
                          0{idx + 1}
                        </span>
                        <span className="text-xs font-semibold leading-tight line-clamp-1 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors font-sans">
                          {exp.title}
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-500 dark:text-stone-400 line-clamp-1 pl-7 font-sans">
                        {exp.aim}
                      </p>
                      <div className="flex items-center space-x-2 pl-7 pt-0.5">
                        {exp.graphConfig && (
                          <span className="inline-flex items-center text-[9px] font-mono font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">
                            <TrendingUp className="w-2.5 h-2.5 mr-0.5" />
                            GRAPH
                          </span>
                        )}
                        <span className="text-[10px] font-mono text-stone-400 dark:text-stone-500">
                          {exp.initialRows.length} readings
                        </span>
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 shrink-0 mt-1 transition-transform ${
                      isActive ? 'text-amber-500 translate-x-0.5' : 'text-stone-300 dark:text-stone-600 group-hover:text-stone-400'
                    }`} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section B */}
          <div>
            <div className="flex items-center justify-between px-2 mb-2">
              <span className="text-[10px] font-mono font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest">
                Section B: Oscillations & Gravitation
              </span>
              <span className="text-[10px] bg-stone-200/70 dark:bg-stone-800 text-stone-600 dark:text-stone-400 font-mono font-bold px-1.5 py-0.2 rounded">
                {sectionB.length}
              </span>
            </div>
            <div className="space-y-1">
              {sectionB.map((exp, idx) => {
                const isActive = exp.id === activeId;
                return (
                  <button
                    key={exp.id}
                    onClick={() => {
                      onSelectExperiment(exp.id);
                      onCloseMobile();
                    }}
                    className={`w-full text-left p-3 rounded-xl transition-all flex items-start justify-between group border ${
                      isActive
                        ? 'bg-white dark:bg-stone-900 border-stone-300 dark:border-stone-700 text-stone-950 dark:text-white shadow-xs'
                        : 'hover:bg-stone-200/50 dark:hover:bg-stone-900/40 border-transparent text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    <div className="space-y-1 pr-2">
                      <div className="flex items-center space-x-2">
                        <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-md ${
                          isActive
                            ? 'bg-amber-400 text-stone-950'
                            : 'bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
                        }`}>
                          0{idx + 7}
                        </span>
                        <span className="text-xs font-semibold leading-tight line-clamp-1 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors font-sans">
                          {exp.title}
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-500 dark:text-stone-400 line-clamp-1 pl-7 font-sans">
                        {exp.aim}
                      </p>
                      <div className="flex items-center space-x-2 pl-7 pt-0.5">
                        {exp.graphConfig && (
                          <span className="inline-flex items-center text-[9px] font-mono font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">
                            <TrendingUp className="w-2.5 h-2.5 mr-0.5" />
                            GRAPH
                          </span>
                        )}
                        <span className="text-[10px] font-mono text-stone-400 dark:text-stone-500">
                          {exp.initialRows.length} readings
                        </span>
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 shrink-0 mt-1 transition-transform ${
                      isActive ? 'text-amber-500 translate-x-0.5' : 'text-stone-300 dark:text-stone-600 group-hover:text-stone-400'
                    }`} />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="p-3.5 bg-stone-100/60 dark:bg-stone-900/60 border-t border-stone-200/80 dark:border-stone-800/80 text-[11px] text-stone-500 dark:text-stone-400 flex items-center justify-between">
          <span className="flex items-center gap-1.5 font-medium font-sans">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            CBSE 2025-26 Standard
          </span>
          <span className="text-[10px] text-stone-400 dark:text-stone-500 font-mono">NCERT Manual</span>
        </div>
      </aside>
    </>
  );
};
