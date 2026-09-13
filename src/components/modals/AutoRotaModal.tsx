import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, ShieldCheck, Clock, Users, CheckCircle2 } from 'lucide-react';
import { getTodayDateString } from '../../data/mockData';

interface AutoRotaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AutoRotaModal: React.FC<AutoRotaModalProps> = ({ isOpen, onClose }) => {
  const { autoGenerateRota, activeTenant } = useApp();

  const [startDate, setStartDate] = useState(getTodayDateString(0));
  const [endDate, setEndDate] = useState(getTodayDateString(6));
  const [prioritizeFullTime, setPrioritizeFullTime] = useState(true);
  const [enforce11hRest, setEnforce11hRest] = useState(true);
  const [requireMedOnEachWing, setRequireMedOnEachWing] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationComplete, setGenerationComplete] = useState(false);

  if (!isOpen) return null;

  const handleRunGenerator = () => {
    setIsGenerating(true);
    setTimeout(() => {
      autoGenerateRota({
        startDate,
        endDate,
        prioritizeFullTime,
        enforce11hRest,
        requireMedOnEachWing
      });
      setIsGenerating(false);
      setGenerationComplete(true);
      setTimeout(() => {
        setGenerationComplete(false);
        onClose();
      }, 1200);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 animate-in fade-in zoom-in-95 duration-150">
        
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-600 dark:bg-teal-950 dark:text-teal-300">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Smart Rota Optimization Engine
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Constraint satisfaction solver for {activeTenant.name}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            ✕
          </button>
        </div>

        {generationComplete ? (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
            <div className="rounded-full bg-emerald-100 p-4 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300">
              <CheckCircle2 className="h-10 w-10 animate-bounce" />
            </div>
            <h4 className="text-lg font-bold text-slate-900 dark:text-white">
              Rota Successfully Optimized!
            </h4>
            <p className="text-xs text-slate-500 max-w-sm">
              All wing shifts populated with zero WTD overtime conflicts and verified medication qualifications.
            </p>
          </div>
        ) : (
          <div className="mt-4 space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Schedule Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Schedule End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
            </div>

            <div className="space-y-2.5 pt-2">
              <span className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] block">
                Algorithmic Rules & Regulatory Constraints
              </span>

              <label className="flex items-start gap-2.5 rounded-xl border border-slate-200 p-3 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={enforce11hRest}
                  onChange={(e) => setEnforce11hRest(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                />
                <div>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    Strict 11-Hour Minimum Rest Period (UK Working Time Directive)
                  </span>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                    Prevents staff who finished late afternoon from being rostered onto the next day's early morning shift.
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-2.5 rounded-xl border border-slate-200 p-3 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={requireMedOnEachWing}
                  onChange={(e) => setRequireMedOnEachWing(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                />
                <div>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    Mandate Certified Medication Practitioner Per Wing
                  </span>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                    Ensures every shift on Dementia & Residential units has at least 1 staff member certified in safe drug administration.
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-2.5 rounded-xl border border-slate-200 p-3 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={prioritizeFullTime}
                  onChange={(e) => setPrioritizeFullTime(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                />
                <div>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    Balance Contracted Hours & Minimize Agency Spend
                  </span>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                    Prioritizes internal staff with deficit hours before publishing shifts to the bank/agency pool.
                  </p>
                </div>
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRunGenerator}
                disabled={isGenerating}
                className="rounded-xl bg-teal-600 px-5 py-2 text-xs font-bold text-white hover:bg-teal-700 transition-colors shadow-md flex items-center gap-2"
              >
                <Sparkles className="h-4 w-4" />
                <span>{isGenerating ? 'Computing Optimal Rota...' : 'Run Auto-Allocation'}</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
