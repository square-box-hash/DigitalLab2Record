import React from 'react';
import { BookOpen, FileCheck, FlaskConical, HelpCircle, Table2 } from 'lucide-react';

type TabId = 'simulation' | 'workspace' | 'record' | 'viva' | 'theory';

interface MobileTabBarProps {
  currentTab: TabId;
  onTabChange: (tab: TabId) => void;
  hasGraph: boolean;
}

const TABS: Array<{ id: TabId; label: string; icon: React.ElementType }> = [
  { id: 'simulation', label: 'Rig', icon: FlaskConical },
  { id: 'workspace', label: 'Table', icon: Table2 },
  { id: 'record', label: 'Record', icon: FileCheck },
  { id: 'viva', label: 'Viva', icon: HelpCircle },
  { id: 'theory', label: 'Theory', icon: BookOpen },
];

/**
 * Phone navigation. The five-tab dock in the header cannot fit below ~1024px,
 * so on small screens the sections move to a thumb-reachable bar fixed to the
 * bottom of the viewport, with 44px touch targets and safe-area padding.
 */
export const MobileTabBar: React.FC<MobileTabBarProps> = ({ currentTab, onTabChange, hasGraph }) => {
  return (
    <nav
      aria-label="Experiment sections"
      className="no-print lg:hidden fixed bottom-0 inset-x-0 z-30 bg-white/95 dark:bg-stone-950/95 backdrop-blur-md border-t border-stone-200 dark:border-stone-800"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex items-stretch justify-around px-1">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`relative flex-1 min-h-[52px] flex flex-col items-center justify-center gap-0.5 py-2 rounded-lg transition-colors ${
                isActive
                  ? 'text-amber-700 dark:text-amber-400'
                  : 'text-stone-500 dark:text-stone-400 active:bg-stone-100 dark:active:bg-stone-800'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-amber-600 dark:text-amber-400' : ''}`} />
              <span className={`text-[10px] leading-none ${isActive ? 'font-bold' : 'font-medium'}`}>
                {tab.label}
              </span>
              {tab.id === 'workspace' && hasGraph && (
                <span className="absolute top-1.5 right-1/2 translate-x-4 w-1.5 h-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
