import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Shift, UserRole, ShiftType } from '../../types';
import { mockShiftDefinitions, getTodayDateString } from '../../data/mockData';
import {
  CalendarDays,
  Plus,
  Sparkles,
  AlertTriangle,
  Users,
  Clock,
  Send,
  CheckCircle2,
  FileSpreadsheet,
  Filter,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  UserCheck,
  UserPlus,
  Trash2,
  Edit2,
  Info
} from 'lucide-react';

interface SmartRotaEngineProps {
  onOpenAutoRotaModal: () => void;
}

export const SmartRotaEngine: React.FC<SmartRotaEngineProps> = ({ onOpenAutoRotaModal }) => {
  const {
    activeTenant,
    shifts,
    staffList,
    currentUser,
    userRole,
    addShift,
    updateShift,
    deleteShift,
    claimOpenShift,
    broadcastOpenShift,
    addToast
  } = useApp();

  const [currentDayOffset, setCurrentDayOffset] = useState(0);
  const [selectedWing, setSelectedWing] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'week' | 'day'>('week');
  const [showAddShiftModal, setShowAddShiftModal] = useState(false);

  // New shift form state
  const [newShiftDate, setNewShiftDate] = useState(getTodayDateString(0));
  const [newShiftTypeId, setNewShiftTypeId] = useState('shift-morning');
  const [newShiftWing, setNewShiftWing] = useState('Unit A - Dementia Haven');
  const [newShiftStaffId, setNewShiftStaffId] = useState<string>('');
  const [newShiftRequiresMed, setNewShiftRequiresMed] = useState(false);

  const isManagerOrAdmin = userRole === 'Admin' || userRole === 'Manager' || userRole === 'HR';

  // Generate 7 days for the week view
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const offset = currentDayOffset + i;
    return getTodayDateString(offset);
  });

  const activeDayDate = getTodayDateString(currentDayOffset);

  // Filter shifts
  const filteredShifts = shifts.filter((s) => {
    if (selectedWing !== 'all' && !s.unitOrWing.toLowerCase().includes(selectedWing.toLowerCase())) {
      return false;
    }
    return true;
  });

  // Shortage and conflict detectors
  const shiftsWithConflicts = filteredShifts.filter((s) => (s.conflicts && s.conflicts.length > 0));
  const openShifts = filteredShifts.filter((s) => s.status === 'open' || !s.assignedStaffId);

  const handleCreateShift = (e: React.FormEvent) => {
    e.preventDefault();
    const shiftDef = mockShiftDefinitions.find((def) => def.id === newShiftTypeId) || mockShiftDefinitions[0];
    const assignedStaff = staffList.find((s) => s.id === newShiftStaffId);

    addShift({
      date: newShiftDate,
      shiftTypeId: shiftDef.id,
      shiftTitle: `${shiftDef.name} (${newShiftWing})`,
      startTime: shiftDef.startTime,
      endTime: shiftDef.endTime,
      unitOrWing: newShiftWing,
      assignedStaffId: assignedStaff?.id,
      assignedStaffName: assignedStaff?.name,
      assignedStaffRole: assignedStaff?.role,
      status: assignedStaff ? 'assigned' : 'open',
      requiresMedCert: newShiftRequiresMed,
      isOpenBroadcast: !assignedStaff
    });

    setShowAddShiftModal(false);
  };

  const handleExportCSV = () => {
    const csvHeader = 'Shift ID,Date,Shift,Start Time,End Time,Wing/Unit,Assigned Staff,Role,Status,Med Cert Required\n';
    const csvRows = filteredShifts
      .map(
        (s) =>
          `"${s.id}","${s.date}","${s.shiftTitle}","${s.startTime}","${s.endTime}","${s.unitOrWing}","${
            s.assignedStaffName || 'Unassigned'
          }","${s.assignedStaffRole || 'N/A'}","${s.status}","${s.requiresMedCert ? 'Yes' : 'No'}"`
      )
      .join('\n');

    const blob = new Blob([csvHeader + csvRows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CareVerse_Rota_${activeTenant.code}_${getTodayDateString(0)}.csv`;
    a.click();
    addToast('Rota Exported', 'CSV roster downloaded for payroll & scheduling compliance', 'success');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header & Engine Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded bg-teal-100 px-2 py-0.5 text-xs font-semibold uppercase tracking-wider text-teal-800 dark:bg-teal-950 dark:text-teal-300">
              Smart Rota Engine
            </span>
            <span className="text-xs text-slate-400 font-mono">Tenant: {activeTenant.name}</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            Dynamic Staff Roster & Scheduling
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Intelligent staff allocation balancing working time directives (WTD 48h), skill mixes (Medication administration), and CQC safe staffing minimums.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          {isManagerOrAdmin && (
            <button
              id="open-auto-rota-btn"
              onClick={onOpenAutoRotaModal}
              className="flex items-center gap-1.5 rounded-lg bg-teal-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-teal-700 transition-colors"
            >
              <Sparkles className="h-4 w-4" />
              <span>Auto-Generate Rota (AI)</span>
            </button>
          )}

          {isManagerOrAdmin && (
            <button
              id="add-manual-shift-btn"
              onClick={() => setShowAddShiftModal(true)}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 transition-colors"
            >
              <Plus className="h-4 w-4 text-teal-600" />
              <span>Add Shift</span>
            </button>
          )}

          <button
            id="export-rota-csv-btn"
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 transition-colors"
            title="Download CSV for payroll audit"
          >
            <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
            <span>Export Roster</span>
          </button>
        </div>
      </div>

      {/* Real-time Shortage & Overtime Alert Bar */}
      {(openShifts.length > 0 || shiftsWithConflicts.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {openShifts.length > 0 && (
            <div className="flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50/80 p-3.5 text-xs text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-200">
              <div className="flex items-center gap-2.5">
                <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
                <div>
                  <span className="font-bold">{openShifts.length} Unfilled Shift Gaps</span>
                  <p className="text-[11px] text-amber-700 dark:text-amber-300">
                    Safe staffing ratios risk alert. Broadcast to available bank carers.
                  </p>
                </div>
              </div>
              {isManagerOrAdmin && (
                <button
                  onClick={() => broadcastOpenShift(openShifts[0].id)}
                  className="rounded bg-amber-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-amber-700"
                >
                  Broadcast All
                </button>
              )}
            </div>
          )}

          {shiftsWithConflicts.length > 0 && (
            <div className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50/80 p-3.5 text-xs text-red-900 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200">
              <div className="flex items-center gap-2.5">
                <ShieldAlert className="h-4 w-4 text-red-600 shrink-0" />
                <div>
                  <span className="font-bold">{shiftsWithConflicts.length} Compliance Conflict Detected</span>
                  <p className="text-[11px] text-red-700 dark:text-red-300">
                    {shiftsWithConflicts[0].conflicts?.[0]}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Rota Filter & Timeline Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-800">
        
        {/* Date Navigation */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentDayOffset((o) => o - 7)}
            className="rounded p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700"
            title="Previous Week"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => setCurrentDayOffset(0)}
            className="rounded px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            Current Week
          </button>
          <button
            onClick={() => setCurrentDayOffset((o) => o + 7)}
            className="rounded p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700"
            title="Next Week"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <span className="text-xs font-mono font-medium text-slate-500 dark:text-slate-400 pl-2">
            Starting: {weekDays[0]}
          </span>
        </div>

        {/* View & Department Filters */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
            <Filter className="h-3.5 w-3.5 text-slate-400" />
            <span>Wing:</span>
            <select
              value={selectedWing}
              onChange={(e) => setSelectedWing(e.target.value)}
              className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-700 dark:text-slate-200"
            >
              <option value="all">All Wings & Units</option>
              <option value="Unit A">Unit A - Dementia Haven</option>
              <option value="Unit B">Unit B - Residential</option>
              <option value="Night">Night Cover</option>
            </select>
          </div>

          <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 p-0.5 dark:border-slate-700 dark:bg-slate-700 text-xs">
            <button
              onClick={() => setViewMode('week')}
              className={`rounded-md px-2.5 py-1 font-medium transition-colors ${
                viewMode === 'week'
                  ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-800 dark:text-white'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              7-Day Roster
            </button>
            <button
              onClick={() => setViewMode('day')}
              className={`rounded-md px-2.5 py-1 font-medium transition-colors ${
                viewMode === 'day'
                  ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-800 dark:text-white'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              Today's Board
            </button>
          </div>
        </div>

      </div>

      {/* Main Rota Schedule Grid (Week View) */}
      {viewMode === 'week' ? (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-800">
          <div className="min-w-[900px]">
            {/* Header: Days of the week */}
            <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50/80 dark:border-slate-700 dark:bg-slate-900/40 text-center">
              {weekDays.map((dateStr, idx) => {
                const isToday = dateStr === getTodayDateString(0);
                const d = new Date(dateStr);
                const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
                return (
                  <div
                    key={dateStr}
                    className={`p-3 border-r border-slate-200 last:border-r-0 dark:border-slate-700 ${
                      isToday ? 'bg-teal-50/60 dark:bg-teal-950/30' : ''
                    }`}
                  >
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      {dayName}
                    </div>
                    <div className={`text-sm font-bold ${isToday ? 'text-teal-700 dark:text-teal-300 font-extrabold' : 'text-slate-900 dark:text-white'}`}>
                      {dateStr}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Grid Days Columns */}
            <div className="grid grid-cols-7 divide-x divide-slate-200 dark:divide-slate-700 min-h-[500px]">
              {weekDays.map((dateStr) => {
                const dayShifts = filteredShifts.filter((s) => s.date === dateStr);
                const isToday = dateStr === getTodayDateString(0);

                return (
                  <div
                    key={dateStr}
                    className={`p-2.5 space-y-2.5 ${isToday ? 'bg-teal-50/20 dark:bg-teal-950/10' : ''}`}
                  >
                    {dayShifts.map((shift) => {
                      const isAssignedToMe = shift.assignedStaffId === currentUser.id;
                      const isOpen = shift.status === 'open' || !shift.assignedStaffId;
                      const hasConflict = shift.conflicts && shift.conflicts.length > 0;

                      return (
                        <div
                          key={shift.id}
                          className={`rounded-xl border p-2.5 text-xs shadow-2xs transition-all relative ${
                            isOpen
                              ? 'border-dashed border-amber-300 bg-amber-50/60 dark:border-amber-800 dark:bg-amber-950/30'
                              : hasConflict
                              ? 'border-red-300 bg-red-50/60 dark:border-red-900 dark:bg-red-950/30'
                              : isAssignedToMe
                              ? 'border-teal-400 bg-teal-50/70 dark:border-teal-600 dark:bg-teal-950/40 ring-1 ring-teal-500/30'
                              : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800'
                          }`}
                        >
                          {/* Shift Header & Wing */}
                          <div className="flex items-start justify-between gap-1 mb-1">
                            <span className="font-bold text-slate-900 dark:text-white leading-tight">
                              {shift.shiftTitle}
                            </span>
                            {shift.requiresMedCert && (
                              <span
                                className="shrink-0 rounded bg-indigo-100 px-1 py-0.2 text-[9px] font-bold text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300"
                                title="Requires Medication Administration Certificate"
                              >
                                Med
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 mb-2">
                            <Clock className="h-3 w-3" />
                            <span>
                              {shift.startTime} - {shift.endTime}
                            </span>
                          </div>

                          {/* Assigned Staff or Open Status */}
                          <div className="pt-1.5 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                            {shift.assignedStaffName ? (
                              <div className="flex items-center gap-1.5 truncate">
                                <div className="h-5 w-5 rounded-full bg-teal-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                                  {shift.assignedStaffName.charAt(0)}
                                </div>
                                <span className="font-medium text-slate-800 dark:text-slate-200 truncate text-[11px]">
                                  {shift.assignedStaffName}
                                </span>
                              </div>
                            ) : (
                              <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-400 flex items-center gap-1">
                                <AlertTriangle className="h-3 w-3" /> Unfilled
                              </span>
                            )}

                            {/* Claim / Actions */}
                            {isOpen && (
                              <button
                                id={`claim-shift-btn-${shift.id}`}
                                onClick={() => claimOpenShift(shift.id)}
                                className="rounded bg-teal-600 px-2 py-0.5 text-[10px] font-bold text-white hover:bg-teal-700"
                              >
                                Claim
                              </button>
                            )}

                            {isManagerOrAdmin && !isOpen && (
                              <button
                                onClick={() => deleteShift(shift.id)}
                                className="text-slate-400 hover:text-red-500 p-0.5"
                                title="Delete Shift"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            )}
                          </div>

                          {/* Conflict badge */}
                          {hasConflict && (
                            <div className="mt-1.5 rounded bg-red-100 px-1.5 py-0.5 text-[9px] font-bold text-red-800 dark:bg-red-950 dark:text-red-300">
                              Overtime warning (WTD)
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {dayShifts.length === 0 && (
                      <div className="py-12 text-center text-xs text-slate-400 italic">
                        No shifts scheduled
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* Day View Board */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mockShiftDefinitions.map((def) => {
            const shiftTypeShifts = filteredShifts.filter(
              (s) => s.date === activeDayDate && s.shiftTypeId === def.id
            );

            return (
              <div
                key={def.id}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-800"
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700 mb-3">
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm">{def.name}</h3>
                    <p className="text-xs text-slate-400">
                      {def.startTime} - {def.endTime} ({def.durationHours}h)
                    </p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-700 dark:bg-slate-700 dark:text-slate-200">
                    {shiftTypeShifts.length} shifts
                  </span>
                </div>

                <div className="space-y-2">
                  {shiftTypeShifts.map((shift) => (
                    <div
                      key={shift.id}
                      className="rounded-xl border border-slate-200 p-3 text-xs dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30"
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-bold text-slate-900 dark:text-white">{shift.shiftTitle}</span>
                        <span className="rounded bg-teal-50 px-1.5 py-0.5 text-[10px] font-bold text-teal-800 dark:bg-teal-950 dark:text-teal-300">
                          {shift.unitOrWing}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-slate-500 dark:text-slate-400 mt-2">
                        <span>Staff: {shift.assignedStaffName || 'Unassigned'}</span>
                        {shift.status === 'open' && (
                          <button
                            onClick={() => claimOpenShift(shift.id)}
                            className="rounded bg-teal-600 px-2 py-0.5 text-[10px] font-bold text-white"
                          >
                            Claim
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                  {shiftTypeShifts.length === 0 && (
                    <div className="py-8 text-center text-xs text-slate-400 italic">
                      No shifts allocated for this period today
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Manual Shift Creation Modal */}
      {showAddShiftModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-800 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
              Schedule New Shift
            </h3>

            <form onSubmit={handleCreateShift} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Shift Date
                </label>
                <input
                  type="date"
                  value={newShiftDate}
                  onChange={(e) => setNewShiftDate(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Shift Type
                </label>
                <select
                  value={newShiftTypeId}
                  onChange={(e) => setNewShiftTypeId(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                >
                  {mockShiftDefinitions.map((def) => (
                    <option key={def.id} value={def.id}>
                      {def.name} ({def.startTime} - {def.endTime})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Unit / Wing
                </label>
                <select
                  value={newShiftWing}
                  onChange={(e) => setNewShiftWing(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                >
                  <option value="Unit A - Dementia Haven">Unit A - Dementia Haven</option>
                  <option value="Unit B - Residential Wing">Unit B - Residential Wing</option>
                  <option value="Facility-wide Night Cover">Facility-wide Night Cover</option>
                  <option value="Community Domiciliary Cluster">Community Domiciliary Cluster</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Assign Staff (Optional)
                </label>
                <select
                  value={newShiftStaffId}
                  onChange={(e) => setNewShiftStaffId(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                >
                  <option value="">-- Leave Open for Broadcast --</option>
                  {staffList.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.role} - {s.jobTitle})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="req-med-cert"
                  checked={newShiftRequiresMed}
                  onChange={(e) => setNewShiftRequiresMed(e.target.checked)}
                  className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                />
                <label htmlFor="req-med-cert" className="text-xs text-slate-700 dark:text-slate-300">
                  Requires Certified Medication Practitioner (Level 3)
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setShowAddShiftModal(false)}
                  className="rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-teal-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-teal-700"
                >
                  Save Shift
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
