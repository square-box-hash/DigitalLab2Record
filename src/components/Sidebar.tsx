import React from 'react';
import { ExperimentConfig } from '../types/experiment';
import { X } from 'lucide-react';

interface SidebarProps {
  experiments: ExperimentConfig[];
  activeId: string;
  onSelectExperiment: (id: string) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

/** "Vernier Calipers: Dimensions & Volume" → "Vernier Calipers" */
const shortTitle = (title: string): string => title.split(':')[0];

export const Sidebar: React.FC<SidebarProps> = ({
  experiments,
  activeId,
  onSelectExperiment,
  isOpenMobile,
  onCloseMobile,
}) => {
  const sectionA = experiments.filter((exp) => exp.section === 'Section A');
  const sectionB = experiments.filter((exp) => exp.section === 'Section B');

  const renderList = (items: ExperimentConfig[], offset: number) => (
    <ul className="space-y-0.5">
      {items.map((exp, idx) => {
        const isActive = exp.id === activeId;
        return (
          <li key={exp.id}>
            <button
              onClick={() => {
                onSelectExperiment(exp.id);
                onCloseMobile();
              }}
              aria-current={isActive ? 'page' : undefined}
              className={`w-full flex items-baseline gap-2.5 px-2 py-1.5 rounded-lg text-left text-[13px] transition-colors ${
                isActive
                  ? 'bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 font-medium'
                  : 'border border-transparent text-stone-600 dark:text-stone-400 hover:bg-stone-200/50 dark:hover:bg-stone-900/60 hover:text-stone-900 dark:hover:text-stone-100'
              }`}
            >
              <span className="font-mono text-[10px] text-stone-400 dark:text-stone-600 shrink-0">
                {String(idx + offset).padStart(2, '0')}
              </span>
              <span className="truncate">{shortTitle(exp.title)}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-stone-950/60 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 lg:top-16 left-0 h-full lg:h-[calc(100vh-4rem)] w-64 bg-stone-100/60 dark:bg-stone-950 border-r border-stone-200 dark:border-stone-800 z-50 lg:z-10 flex flex-col transition-transform duration-300 ease-in-out ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="px-4 pt-4 pb-2 flex items-center justify-between">
          <h2 className="font-mono text-[10px] uppercase tracking-[0.12em] text-stone-500 dark:text-stone-500">
            Practicals
          </h2>
          <button
            onClick={onCloseMobile}
            aria-label="Close practicals"
            className="lg:hidden p-1 rounded-md text-stone-400 hover:text-stone-700 dark:hover:text-stone-100 hover:bg-stone-200/60 dark:hover:bg-stone-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-2 pb-4 space-y-4">
          <div>
            <div className="px-2 pb-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-stone-400 dark:text-stone-600">
              Section A
            </div>
            {renderList(sectionA, 1)}
          </div>
          <div>
            <div className="px-2 pb-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-stone-400 dark:text-stone-600">
              Section B
            </div>
            {renderList(sectionB, sectionA.length + 1)}
          </div>
        </nav>

        <div className="px-4 py-3 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between font-mono text-[10px] text-stone-400 dark:text-stone-600">
          <span>CBSE 2025–26</span>
          <span>NCERT manual</span>
        </div>
      </aside>
    </>
  );
};
