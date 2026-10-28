import React, { useState } from 'react';
import { VivaQuestion } from '../types/experiment';
import {
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  Filter,
  CheckCircle2,
} from 'lucide-react';

interface VivaVoceAccordionProps {
  questions: VivaQuestion[];
  experimentTitle: string;
}

export const VivaVoceAccordion: React.FC<VivaVoceAccordionProps> = ({
  questions,
  experimentTitle,
}) => {
  const [openIndices, setOpenIndices] = useState<number[]>([0, 1]);
  const [quizMode, setQuizMode] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [revealedQuizAnswers, setRevealedQuizAnswers] = useState<Record<number, boolean>>({});

  const categories = ['All', 'Core Theory', 'Apparatus & Errors', 'Precautions', 'Calculations'];

  const filteredQuestions = questions.filter((q) => {
    if (selectedCategory === 'All') return true;
    return q.category === selectedCategory;
  });

  const toggleAccordion = (idx: number) => {
    setOpenIndices((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const toggleAll = () => {
    if (openIndices.length === filteredQuestions.length) {
      setOpenIndices([]);
    } else {
      setOpenIndices(filteredQuestions.map((_, i) => i));
    }
  };

  const toggleQuizAnswer = (idx: number) => {
    setRevealedQuizAnswers((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden transition-colors">
      {/* Top Banner */}
      <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-xs">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                CBSE Viva Voce Examiner Question Bank
              </h3>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                {questions.length} High-Yield Questions
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Frequently asked external examiner viva questions with model textbook explanations.
            </p>
          </div>
        </div>

        {/* Mode controls */}
        <div className="flex items-center space-x-2 flex-wrap gap-y-2">
          <button
            onClick={() => setQuizMode(!quizMode)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              quizMode
                ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
          >
            {quizMode ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{quizMode ? 'Exit Quiz Mode' : 'Self-Test (Hide Answers)'}</span>
          </button>

          <button
            onClick={toggleAll}
            className="px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl transition-colors"
          >
            {openIndices.length === filteredQuestions.length ? 'Collapse All' : 'Expand All'}
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="px-5 py-3 bg-slate-50/60 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 flex items-center space-x-2 overflow-x-auto text-xs">
        <span className="text-slate-400 dark:text-slate-500 font-medium flex items-center gap-1 shrink-0">
          <Filter className="w-3.5 h-3.5" />
          Filter:
        </span>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded-full whitespace-nowrap transition-all font-medium text-xs ${
              selectedCategory === cat
                ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Accordion List */}
      <div className="p-4 sm:p-6 divide-y divide-slate-100 dark:divide-slate-800">
        {filteredQuestions.map((item, idx) => {
          const isOpen = openIndices.includes(idx);
          const isRevealed = revealedQuizAnswers[idx];

          return (
            <div key={idx} className="py-3 first:pt-0 last:pb-0">
              <button
                onClick={() => toggleAccordion(idx)}
                className="w-full text-left flex items-start justify-between py-2 group"
              >
                <div className="flex items-start space-x-3 pr-4">
                  <span className="w-6 h-6 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800 font-bold font-mono text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <div className="space-y-1">
                    <span className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {item.q}
                    </span>
                    {item.category && (
                      <div>
                        <span className="inline-block text-[10px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                          {item.category}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-1 rounded-lg text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300">
                  {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {isOpen && (
                <div className="mt-2 pl-9 pr-2">
                  {quizMode && !isRevealed ? (
                    <div className="p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-dashed border-amber-300 dark:border-amber-700 text-center space-y-2">
                      <p className="text-xs text-amber-800 dark:text-amber-300 font-medium">
                        Answer hidden for recall practice. Formulate your response first!
                      </p>
                      <button
                        onClick={() => toggleQuizAnswer(idx)}
                        className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-amber-600 text-white rounded-lg text-xs font-semibold hover:bg-amber-700 transition-colors shadow-2xs"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Reveal Model Answer</span>
                      </button>
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                          Model Answer
                        </span>
                        {quizMode && (
                          <button
                            onClick={() => toggleQuizAnswer(idx)}
                            className="text-[11px] text-amber-700 dark:text-amber-400 hover:underline font-medium"
                          >
                            Hide Answer
                          </button>
                        )}
                      </div>
                      <p className="text-slate-800 dark:text-slate-200">{item.a}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
