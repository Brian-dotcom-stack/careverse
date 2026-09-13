import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Fingerprint, Clock, MapPin, ShieldCheck, Timer } from 'lucide-react';

interface ClockInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ClockInModal: React.FC<ClockInModalProps> = ({ isOpen, onClose }) => {
  const {
    activeTenant,
    currentUser,
    isClockedIn,
    activeClockRecord,
    clockIn,
    clockOut
  } = useApp();

  const [handoverNotes, setHandoverNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleAction = async () => {
    setIsProcessing(true);
    if (isClockedIn) {
      await clockOut(handoverNotes || 'Handover completed via quick clock terminal');
    } else {
      await clockIn();
    }
    setIsProcessing(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 animate-in fade-in zoom-in-95 duration-150 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-600 dark:bg-teal-950 dark:text-teal-300 mb-3">
          <Fingerprint className="h-8 w-8" />
        </div>

        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          {isClockedIn ? 'Clock Out from Active Shift' : 'Biometric Shift Clock-In'}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {currentUser.name} • {currentUser.jobTitle}
        </p>

        <div className="my-4 rounded-xl border border-slate-100 bg-slate-50 p-3 text-xs dark:border-slate-800 dark:bg-slate-800/60 text-left space-y-1.5">
          <div className="flex justify-between">
            <span className="text-slate-400">Facility:</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">{activeTenant.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">GPS Validation:</span>
            <span className="text-emerald-600 font-semibold flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5" /> Inside Geofence
            </span>
          </div>
          {isClockedIn && (
            <div className="flex justify-between">
              <span className="text-slate-400">Clocked In At:</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">
                {activeClockRecord?.clockInTime}
              </span>
            </div>
          )}
        </div>

        {isClockedIn && (
          <div className="mb-4 text-left">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Shift Handover Summary
            </label>
            <textarea
              rows={2}
              value={handoverNotes}
              onChange={(e) => setHandoverNotes(e.target.value)}
              placeholder="Key updates, medication given, fluids balanced..."
              className="w-full rounded-xl border border-slate-300 p-2 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>
        )}

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleAction}
            disabled={isProcessing}
            className={`flex-1 rounded-xl py-2.5 text-xs font-bold text-white shadow-md transition-colors ${
              isClockedIn ? 'bg-amber-600 hover:bg-amber-700' : 'bg-teal-600 hover:bg-teal-700'
            }`}
          >
            {isProcessing ? 'Processing...' : isClockedIn ? 'Confirm Clock Out' : 'Authenticate & Clock In'}
          </button>
        </div>
      </div>
    </div>
  );
};
