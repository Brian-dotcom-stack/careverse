import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Shift, UserRole } from '../../types';
import { mockShiftDefinitions, getTodayDateString } from '../../data/mockData';
import {
  Sparkles,
  AlertTriangle,
  Clock,
  FileSpreadsheet,
  Filter,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  Trash2,
  Edit2,
  Lock,
  Plus,
  Eye,
  CheckCircle2,
  UserCheck
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
    broadcastOpenShift,
    addToast
  } = useApp();

  const [currentDayOffset, setCurrentDayOffset] = useState(0);
  const [selectedWing, setSelectedWing] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'week' | 'day'>('week');
  const [showAddShiftModal, setShowAddShiftModal] = useState(false);
  const [editingShift, setEditingShift] = useState<Shift | null>(null);
  const [viewingShift, setViewingShift] = useState<Shift | null>(null);

  // New shift form state
  const [newShiftDate, setNewShiftDate] = useState(getTodayDateString(0));
  const [newShiftTypeId, setNewShiftTypeId] = useState('shift-morning');
  const [newShiftWing, setNewShiftWing] = useState('Unit A - Dementia Haven');
  const [newShiftStaffId, setNewShiftStaffId] = useState<string>('');
  const [newShiftRequiresMed, setNewShiftRequiresMed] = useState(false);
  const [newShiftNotes, setNewShiftNotes] = useState('');

  // Strictly enforce that ONLY Admin and Manager roles can edit or generate rotas
  const isManagerOrAdmin = userRole === 'Admin' || userRole === 'Manager';

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
  const shiftsWithConflicts = filteredShifts.filter((s) => s.conflicts && s.conflicts.length > 0);
  const openShifts = filteredShifts.filter((s) => s.status === 'open' || !s.assignedStaffId);

  const handleCreateShift = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isManagerOrAdmin) {
      addToast('Permission Denied', 'Staff roles are restricted to viewing only. Only Managers and Admins can create rota shifts.', 'error');
      return;
    }

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
      isOpenBroadcast: !assignedStaff,
      notes: newShiftNotes.trim() || undefined
    });

    setShowAddShiftModal(false);
    setNewShiftNotes('');
  };

  const handleUpdateShiftSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isManagerOrAdmin || !editingShift) {
      addToast('Permission Denied', 'Staff roles are restricted to viewing only. Only Managers and Admins can edit rota shifts.', 'error');
      return;
    }

    const shiftDef = mockShiftDefinitions.find((def) => def.id === editingShift.shiftTypeId) || mockShiftDefinitions[0];
    const assignedStaff = staffList.find((s) => s.id === editingShift.assignedStaffId);

    updateShift(editingShift.id, {
      date: editingShift.date,
      shiftTypeId: shiftDef.id,
      shiftTitle: `${shiftDef.name} (${editingShift.unitOrWing})`,
      startTime: shiftDef.startTime,
      endTime: shiftDef.endTime,
      unitOrWing: editingShift.unitOrWing,
      assignedStaffId: assignedStaff?.id,
      assignedStaffName: assignedStaff?.name,
      assignedStaffRole: assignedStaff?.role,
      status: assignedStaff ? 'assigned' : 'open',
      requiresMedCert: editingShift.requiresMedCert,
      notes: editingShift.notes
    });

    setEditingShift(null);
  };

  const handleDeleteShift = (shift: Shift) => {
    if (!isManagerOrAdmin) {
      addToast('Permission Denied', 'Staff roles are restricted to viewing only. Only Managers and Admins can delete shifts.', 'error');
      return;
    }
    deleteShift(shift.id);
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
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded bg-teal-100 px-2 py-0.5 text-xs font-semibold uppercase tracking-wider text-teal-800 dark:bg-teal-950 dark:text-teal-300">
              Smart Rota Engine
            </span>
            <span className="text-xs text-slate-400 font-mono">Tenant: {activeTenant.name}</span>
            {isManagerOrAdmin ? (
              <span className="rounded bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold uppercase text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950 dark:text-emerald-300 flex items-center gap-1">
                <UserCheck className="h-3 w-3" />
                Scheduling & Editing Rights ({userRole})
              </span>
            ) : (
              <span className="rounded bg-amber-50 border border-amber-200 px-2 py-0.5 text-[10px] font-bold uppercase text-amber-800 dark:border-amber-900/60 dark:bg-amber-950 dark:text-amber-300 flex items-center gap-1">
                <Lock className="h-3 w-3" />
                View-Only Mode ({userRole})
              </span>
            )}
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
              className="flex items-center gap-1.5 rounded-lg bg-teal-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-teal-700 transition-colors cursor-pointer"
            >
              <Sparkles className="h-4 w-4" />
              <span>Auto-Generate Rota (AI)</span>
            </button>
          )}

          {isManagerOrAdmin && (
            <button
              id="add-manual-shift-btn"
              onClick={() => setShowAddShiftModal(true)}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 transition-colors cursor-pointer"
            >
              <Plus className="h-4 w-4 text-teal-600" />
              <span>Add Shift</span>
            </button>
          )}

          <button
            id="export-rota-csv-btn"
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 transition-colors cursor-pointer"
            title="Download CSV for payroll audit"
          >
            <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
            <span>Export Roster</span>
          </button>
        </div>
      </div>

      {/* Staff View-Only Advisory Notice */}
      {!isManagerOrAdmin && (
        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/90 p-3.5 text-xs text-slate-700 dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-300">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400 shrink-0">
            <Lock className="h-4 w-4 text-slate-500" />
          </div>
          <div className="flex-1">
            <div className="font-semibold text-slate-900 dark:text-white">
              Staff Restricted Access: View-Only Mode
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              You are currently viewing the roster with the <strong>{userRole}</strong> role. You can inspect shift times, assigned carers, and unit coverage. Creating, modifying, self-assigning, or auto-generating rotas is strictly restricted to <strong>Manager</strong> and <strong>Admin</strong> roles.
            </p>
          </div>
        </div>
      )}

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
                    Safe staffing ratios risk alert. {isManagerOrAdmin ? 'Broadcast to available carers or assign.' : 'Manager allocation in progress.'}
                  </p>
                </div>
              </div>
              {isManagerOrAdmin && (
                <button
                  onClick={() => broadcastOpenShift(openShifts[0].id)}
                  className="rounded bg-amber-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-amber-700 cursor-pointer"
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
            className="rounded p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
            title="Previous Week"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => setCurrentDayOffset(0)}
            className="rounded px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700 cursor-pointer"
          >
            Current Week
          </button>
          <button
            onClick={() => setCurrentDayOffset((o) => o + 7)}
            className="rounded p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
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
              className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-700 dark:text-slate-200 cursor-pointer"
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
              className={`rounded-md px-2.5 py-1 font-medium transition-colors cursor-pointer ${
                viewMode === 'week'
                  ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-800 dark:text-white'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              7-Day Roster
            </button>
            <button
              onClick={() => setViewMode('day')}
              className={`rounded-md px-2.5 py-1 font-medium transition-colors cursor-pointer ${
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
              {weekDays.map((dateStr) => {
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
                          <div className="pt-1.5 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between gap-1">
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

                            {/* Manager & Admin Editing Controls */}
                            {isManagerOrAdmin ? (
                              <div className="flex items-center gap-1">
                                {isOpen && (
                                  <button
                                    id={`assign-shift-btn-${shift.id}`}
                                    onClick={() => setEditingShift(shift)}
                                    className="rounded bg-teal-600 px-2 py-0.5 text-[10px] font-bold text-white hover:bg-teal-700 cursor-pointer"
                                    title="Assign Staff to Shift"
                                  >
                                    Assign
                                  </button>
                                )}
                                <button
                                  id={`edit-shift-btn-${shift.id}`}
                                  onClick={() => setEditingShift(shift)}
                                  className="text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 p-0.5 cursor-pointer"
                                  title="Edit Shift"
                                >
                                  <Edit2 className="h-3 w-3" />
                                </button>
                                <button
                                  id={`delete-shift-btn-${shift.id}`}
                                  onClick={() => handleDeleteShift(shift)}
                                  className="text-slate-400 hover:text-red-500 p-0.5 cursor-pointer"
                                  title="Delete Shift"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </button>
                              </div>
                            ) : (
                              /* Staff View-Only: Cannot edit or claim */
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => setViewingShift(shift)}
                                  className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-0.5 cursor-pointer"
                                  title="View Shift Details"
                                >
                                  <Eye className="h-3 w-3" />
                                </button>
                                {isOpen && (
                                  <span className="rounded bg-amber-100/70 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 px-1.5 py-0.2 text-[9px] font-medium">
                                    Open
                                  </span>
                                )}
                              </div>
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
                        
                        {isManagerOrAdmin ? (
                          <div className="flex items-center gap-1.5">
                            {shift.status === 'open' && (
                              <button
                                onClick={() => setEditingShift(shift)}
                                className="rounded bg-teal-600 px-2 py-0.5 text-[10px] font-bold text-white hover:bg-teal-700 cursor-pointer"
                              >
                                Assign
                              </button>
                            )}
                            <button
                              onClick={() => setEditingShift(shift)}
                              className="text-slate-400 hover:text-teal-600 p-1 cursor-pointer"
                              title="Edit Shift"
                            >
                              <Edit2 className="h-3 w-3" />
                            </button>
                            <button
                              onClick={() => handleDeleteShift(shift)}
                              className="text-slate-400 hover:text-red-500 p-1 cursor-pointer"
                              title="Delete Shift"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setViewingShift(shift)}
                            className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 text-[10px] flex items-center gap-1 cursor-pointer"
                          >
                            <Eye className="h-3 w-3" /> Details
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

      {/* Manual Shift Creation Modal (Managers & Admins only) */}
      {showAddShiftModal && isManagerOrAdmin && (
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

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Shift Notes & Handover Instructions
                </label>
                <input
                  type="text"
                  placeholder="e.g. 1-to-1 care handover, fluid chart review"
                  value={newShiftNotes}
                  onChange={(e) => setNewShiftNotes(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                />
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
                  className="rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-teal-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-teal-700 cursor-pointer"
                >
                  Save Shift
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Shift Modal (Managers & Admins only) */}
      {editingShift && isManagerOrAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-800 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700 mb-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-300">
                  <Edit2 className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Edit Rota Shift
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Modify shift timings, wing, and staff assignment
                  </p>
                </div>
              </div>
              <button
                onClick={() => setEditingShift(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateShiftSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Shift Date
                </label>
                <input
                  type="date"
                  value={editingShift.date}
                  onChange={(e) => setEditingShift({ ...editingShift, date: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Shift Type
                </label>
                <select
                  value={editingShift.shiftTypeId}
                  onChange={(e) => setEditingShift({ ...editingShift, shiftTypeId: e.target.value })}
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
                  value={editingShift.unitOrWing}
                  onChange={(e) => setEditingShift({ ...editingShift, unitOrWing: e.target.value })}
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
                  Assigned Staff
                </label>
                <select
                  value={editingShift.assignedStaffId || ''}
                  onChange={(e) => setEditingShift({ ...editingShift, assignedStaffId: e.target.value || undefined })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                >
                  <option value="">-- Unassigned (Open Shift) --</option>
                  {staffList.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.role} - {s.jobTitle})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Notes
                </label>
                <input
                  type="text"
                  value={editingShift.notes || ''}
                  onChange={(e) => setEditingShift({ ...editingShift, notes: e.target.value })}
                  placeholder="Operational notes"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="edit-req-med-cert"
                  checked={editingShift.requiresMedCert || false}
                  onChange={(e) => setEditingShift({ ...editingShift, requiresMedCert: e.target.checked })}
                  className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                />
                <label htmlFor="edit-req-med-cert" className="text-xs text-slate-700 dark:text-slate-300">
                  Requires Certified Medication Practitioner (Level 3)
                </label>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => {
                    handleDeleteShift(editingShift);
                    setEditingShift(null);
                  }}
                  className="text-xs font-semibold text-red-600 hover:text-red-700 flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Delete Shift</span>
                </button>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingShift(null)}
                    className="rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-teal-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-teal-700 cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Staff Read-Only Shift Inspection Modal */}
      {viewingShift && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-800 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700 mb-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                  <Eye className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Shift Details
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Read-only schedule information
                  </p>
                </div>
              </div>
              <button
                onClick={() => setViewingShift(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-700/60">
                <span className="text-slate-400">Shift Name:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{viewingShift.shiftTitle}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-700/60">
                <span className="text-slate-400">Date & Hours:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {viewingShift.date} ({viewingShift.startTime} - {viewingShift.endTime})
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-700/60">
                <span className="text-slate-400">Unit / Wing:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{viewingShift.unitOrWing}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-700/60">
                <span className="text-slate-400">Assigned Carer:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {viewingShift.assignedStaffName || 'Unassigned (Open Cover)'}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-700/60">
                <span className="text-slate-400">Medication Cert Required:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {viewingShift.requiresMedCert ? 'Yes (Level 3)' : 'No'}
                </span>
              </div>
              {viewingShift.notes && (
                <div className="py-1.5 border-b border-slate-100 dark:border-slate-700/60">
                  <span className="text-slate-400 block mb-0.5">Notes:</span>
                  <p className="text-slate-700 dark:text-slate-300 italic">{viewingShift.notes}</p>
                </div>
              )}

              <div className="mt-3 rounded-lg bg-amber-50 p-3 text-[11px] text-amber-800 dark:bg-amber-950/40 dark:text-amber-200 flex items-start gap-2 border border-amber-200 dark:border-amber-900/50">
                <Lock className="h-3.5 w-3.5 text-amber-600 mt-0.5 shrink-0" />
                <span>
                  <strong>Read-Only Mode:</strong> Your account role is <strong>{userRole}</strong>. Shifts can only be scheduled, reallocated, or modified by Managers and Admins.
                </span>
              </div>
            </div>

            <div className="flex justify-end pt-4 mt-2">
              <button
                onClick={() => setViewingShift(null)}
                className="rounded-lg bg-slate-100 dark:bg-slate-700 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-200 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
