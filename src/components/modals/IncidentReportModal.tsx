import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AlertOctagon, ShieldAlert, Check } from 'lucide-react';

interface IncidentReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const IncidentReportModal: React.FC<IncidentReportModalProps> = ({ isOpen, onClose }) => {
  const { logIncident, currentUser } = useApp();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<any>('Fall');
  const [severity, setSeverity] = useState<any>('Medium');
  const [cqcNotifiable, setCqcNotifiable] = useState(false);
  const [residentName, setResidentName] = useState('');
  const [location, setLocation] = useState('Unit A - Dementia Haven Lounge');
  const [description, setDescription] = useState('');
  const [actionsTaken, setActionsTaken] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    logIncident({
      title,
      category,
      severity,
      cqcNotifiable,
      clientOrResidentName: residentName || 'Resident Unnamed',
      location,
      description,
      immediateActionsTaken: actionsTaken || 'First aid administered and recorded in daily handover'
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
        
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5 text-red-600">
            <AlertOctagon className="h-6 w-6" />
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Statutory Incident & Safeguarding Log
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Logged under Caldicott Principles • Reporter: {currentUser.name}
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

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Incident Summary Headline *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Unwitnessed resident slip near dining room entrance"
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:border-red-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value="Fall">Fall / Mobility Slip</option>
                <option value="Medication Error">Medication Administration Error</option>
                <option value="Challenging Behaviour">Challenging / Distressed Behaviour</option>
                <option value="Safeguarding Alert">Safeguarding Alert</option>
                <option value="Near Miss">Near Miss Observation</option>
                <option value="Infection Control">Infection Control Outbreak</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Severity Rating
              </label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as any)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value="Low">Low (No harm/Minor scrape)</option>
                <option value="Medium">Medium (First aid required)</option>
                <option value="High">High (Medical review needed)</option>
                <option value="Critical">Critical (Hospital transfer / Major injury)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Resident / Service User Name
              </label>
              <input
                type="text"
                value={residentName}
                onChange={(e) => setResidentName(e.target.value)}
                placeholder="e.g. Arthur Pendelton"
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Location on Premises
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Detailed Narrative & Observations *
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="State exactly what was seen, environmental conditions, footwear, vitals recorded..."
              className="w-full rounded-xl border border-slate-300 p-3 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:border-red-500"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Immediate Corrective Actions Taken
            </label>
            <textarea
              rows={2}
              value={actionsTaken}
              onChange={(e) => setActionsTaken(e.target.value)}
              placeholder="e.g., Blood pressure checked, ice pack applied, GP notified, senior on duty alerted..."
              className="w-full rounded-xl border border-slate-300 p-3 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:border-red-500"
            />
          </div>

          <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50">
            <input
              type="checkbox"
              id="cqc-notifiable"
              checked={cqcNotifiable}
              onChange={(e) => setCqcNotifiable(e.target.checked)}
              className="rounded border-red-300 text-red-600 focus:ring-red-500"
            />
            <label htmlFor="cqc-notifiable" className="text-xs font-semibold text-red-900 dark:text-red-200">
              Statutory CQC Regulation 18 Notifiable Incident (requires regulatory reporting within 24h)
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
              type="submit"
              className="rounded-xl bg-red-600 px-5 py-2 text-xs font-bold text-white hover:bg-red-700 transition-colors shadow-md"
            >
              Submit Official Incident Log
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
