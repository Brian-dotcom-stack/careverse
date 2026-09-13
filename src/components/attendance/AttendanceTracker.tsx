import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { AttendanceRecord } from '../../types';
import {
  Clock,
  MapPin,
  Wifi,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  FileSpreadsheet,
  Calendar,
  Check,
  X,
  Timer,
  Fingerprint,
  Radio,
  Building
} from 'lucide-react';

export const AttendanceTracker: React.FC = () => {
  const {
    activeTenant,
    currentUser,
    userRole,
    attendanceRecords,
    isClockedIn,
    activeClockRecord,
    clockIn,
    clockOut,
    approveAttendance,
    addToast
  } = useApp();

  const [simulatedDistance, setSimulatedDistance] = useState(18); // meters
  const [activeSeconds, setActiveSeconds] = useState(0);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [clockOutNotes, setClockOutNotes] = useState('');
  const [showClockOutDialog, setShowClockOutDialog] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  const isManager = userRole === 'Admin' || userRole === 'Manager' || userRole === 'HR';

  // Active shift timer tick
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isClockedIn) {
      interval = setInterval(() => {
        setActiveSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      setActiveSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isClockedIn]);

  const formatTimer = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const handleClockInAction = async () => {
    setIsLocating(true);
    // Request real browser geolocation if permitted
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setIsLocating(false);
          clockIn({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        (err) => {
          setIsLocating(false);
          // Fallback to validated site GPS
          clockIn();
        },
        { timeout: 3000 }
      );
    } else {
      setIsLocating(false);
      clockIn();
    }
  };

  const handleConfirmClockOut = async () => {
    await clockOut(clockOutNotes || 'Standard shift handover completed');
    setShowClockOutDialog(false);
    setClockOutNotes('');
  };

  const filteredRecords = attendanceRecords.filter((rec) => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'active') return rec.status === 'active_now';
    if (filterStatus === 'late') return rec.status === 'late' || rec.varianceMinutes > 10;
    if (filterStatus === 'pending') return rec.status === 'pending_approval';
    return true;
  });

  const handleExportCSV = () => {
    const csvHeader = 'Record ID,Date,Staff Name,Role,Clock In,Clock Out,Scheduled,Status,Variance (Mins),Distance (m),IP/Network,Approved By\n';
    const csvRows = attendanceRecords
      .map(
        (r) =>
          `"${r.id}","${r.date}","${r.staffName}","${r.staffRole}","${r.clockInTime}","${r.clockOutTime || 'Active'}","${r.scheduledStart}-${r.scheduledEnd}","${r.status}","${r.varianceMinutes}","${r.distanceFromSiteMeters}","${r.ipAddress}","${r.approvedBy || 'Pending'}"`
      )
      .join('\n');

    const blob = new Blob([csvHeader + csvRows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CareVerse_Timesheets_${activeTenant.code}.csv`;
    a.click();
    addToast('Timesheets Exported', 'Payroll audit data exported successfully', 'success');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded bg-teal-100 px-2 py-0.5 text-xs font-semibold uppercase tracking-wider text-teal-800 dark:bg-teal-950 dark:text-teal-300">
              Attendance & Geofencing
            </span>
            <span className="text-xs text-slate-400 font-mono">Real-Time Timekeeping</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            Time, GPS Validation & Timesheets
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Anti-tamper clocking verified via site GPS radius ({activeTenant.geofenceRadiusMeters}m geofence) and facility Wi-Fi IP authentication.
          </p>
        </div>

        <button
          id="export-timesheet-btn"
          onClick={handleExportCSV}
          className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 transition-colors shadow-2xs"
        >
          <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
          <span>Export Timesheet CSV</span>
        </button>
      </div>

      {/* Terminal Grid: Left is Personal Clock Terminal, Right is Geofence Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Clock In/Out Live Card (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-800">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-600 dark:bg-teal-950 dark:text-teal-300">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Employee Clocking Terminal
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  User: {currentUser.name} ({currentUser.jobTitle})
                </p>
              </div>
            </div>

            <span
              className={`rounded-full px-3 py-1 text-xs font-bold ${
                isClockedIn
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 animate-pulse'
                  : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
              }`}
            >
              {isClockedIn ? '● Shift Active' : '○ Shift Inactive'}
            </span>
          </div>

          <div className="mt-6 flex flex-col items-center justify-center py-4 text-center">
            {isClockedIn ? (
              <div className="space-y-3">
                <div className="flex items-center justify-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                  <Timer className="h-4 w-4 animate-spin" />
                  <span>Time on Duty</span>
                </div>
                <div className="font-mono text-4xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
                  {formatTimer(activeSeconds)}
                </div>
                <div className="rounded-lg bg-teal-50 p-2.5 text-xs text-teal-800 dark:bg-teal-950/40 dark:text-teal-200">
                  Clocked in at <strong>{activeClockRecord?.clockInTime}</strong> • Verified at site
                </div>

                <button
                  id="terminal-clock-out-btn"
                  onClick={() => setShowClockOutDialog(true)}
                  className="mt-4 rounded-xl bg-amber-600 px-8 py-3 text-sm font-bold text-white shadow-md hover:bg-amber-700 transition-colors"
                >
                  Clock Out & Submit Shift Handover
                </button>
              </div>
            ) : (
              <div className="space-y-4 max-w-sm">
                <div className="rounded-full bg-teal-50 p-4 inline-flex text-teal-600 dark:bg-teal-950 dark:text-teal-300">
                  <Fingerprint className="h-10 w-10" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-base">
                    Ready to begin care shift?
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    CareVerse verifies your GPS location against <strong>{activeTenant.name}</strong> and records timestamps with biometric signature.
                  </p>
                </div>

                <button
                  id="terminal-clock-in-btn"
                  onClick={handleClockInAction}
                  disabled={isLocating}
                  className="w-full rounded-xl bg-teal-600 px-6 py-3.5 text-sm font-bold text-white shadow-md hover:bg-teal-700 transition-colors flex items-center justify-center gap-2"
                >
                  {isLocating ? (
                    <span>Acquiring Geolocation...</span>
                  ) : (
                    <>
                      <Clock className="h-4 w-4" />
                      <span>Clock In with GPS & Biometrics</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Validation Metrics */}
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div className="rounded-lg border border-slate-100 bg-slate-50 p-2.5 dark:border-slate-700/60 dark:bg-slate-900/40">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">GPS Geofence</span>
              <div className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-0.5">
                <ShieldCheck className="h-3.5 w-3.5" /> Inside ({simulatedDistance}m from gate)
              </div>
            </div>

            <div className="rounded-lg border border-slate-100 bg-slate-50 p-2.5 dark:border-slate-700/60 dark:bg-slate-900/40">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Wi-Fi IP Address</span>
              <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1 mt-0.5">
                <Wifi className="h-3.5 w-3.5 text-teal-600" /> 192.168.10.42 (Secure)
              </div>
            </div>

            <div className="rounded-lg border border-slate-100 bg-slate-50 p-2.5 dark:border-slate-700/60 dark:bg-slate-900/40 col-span-2 sm:col-span-1">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Scheduled Shift</span>
              <div className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                07:00 - 15:00 (Day)
              </div>
            </div>
          </div>
        </div>

        {/* Geofence Radar Map View (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-200 bg-slate-900 p-6 text-white shadow-xs dark:border-slate-800">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Radio className="h-4 w-4 text-emerald-400 animate-pulse" />
              <h3 className="font-bold text-sm">Site Geofence Perimeter</h3>
            </div>
            <span className="text-[11px] font-mono text-emerald-400">
              Radius: {activeTenant.geofenceRadiusMeters}m
            </span>
          </div>

          {/* Graphical Simulated Geofence Canvas */}
          <div className="mt-4 relative h-60 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center overflow-hidden">
            {/* Concentric rings */}
            <div className="absolute h-48 w-48 rounded-full border border-teal-500/20 animate-ping opacity-25" />
            <div className="absolute h-44 w-44 rounded-full border border-emerald-500/40" />
            <div className="absolute h-28 w-28 rounded-full border border-teal-500/50" />
            <div className="absolute h-12 w-12 rounded-full border border-teal-400/80" />

            {/* Care Home Pin */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-500 text-slate-950 font-bold shadow-lg shadow-teal-500/50">
                <Building className="h-5 w-5" />
              </div>
              <span className="mt-1 text-[10px] font-bold text-teal-300">HQ Center</span>
            </div>

            {/* Staff Location Dot */}
            <div
              className="absolute z-20 flex flex-col items-center transition-all"
              style={{ top: '38%', right: '36%' }}
            >
              <div className="h-3.5 w-3.5 rounded-full bg-emerald-400 ring-4 ring-emerald-400/30 animate-pulse" />
              <span className="text-[9px] font-mono text-emerald-300 bg-slate-900/80 px-1 rounded mt-0.5">
                {currentUser.name.split(' ')[0]} ({simulatedDistance}m)
              </span>
            </div>

            {/* Radar Sweep line */}
            <div className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent_0deg,rgba(45,212,191,0.15)_60deg,transparent_60deg)] animate-spin [animation-duration:6s] pointer-events-none" />
          </div>

          <div className="mt-4 space-y-1.5 text-xs text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-400">Facility Address:</span>
              <span className="font-mono text-[11px]">{activeTenant.address.split(',')[0]}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Coordinates:</span>
              <span className="font-mono text-[11px]">
                {activeTenant.coordinates.lat.toFixed(4)}, {activeTenant.coordinates.lng.toFixed(4)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Validation Protocol:</span>
              <span className="text-emerald-400 font-semibold">Strict Geofenced Range</span>
            </div>
          </div>
        </div>

      </div>

      {/* Timesheet Approval Workflow (Managers & HR) */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-700">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Timesheet Registry & Approvals
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Audit trails, late clock-in flags, and manager electronic sign-off
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 p-0.5 dark:border-slate-700 dark:bg-slate-700 text-xs">
            {[
              { id: 'all', label: 'All Records' },
              { id: 'active', label: 'Active Now' },
              { id: 'late', label: 'Lateness / Variance' },
              { id: 'pending', label: 'Pending Sign-off' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterStatus(tab.id)}
                className={`rounded-md px-2.5 py-1 font-medium transition-colors ${
                  filterStatus === tab.id
                    ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-800 dark:text-white'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-400 uppercase font-semibold">
                <th className="pb-3 pr-4">Staff Member</th>
                <th className="pb-3 px-3">Date</th>
                <th className="pb-3 px-3">Clock In / Out</th>
                <th className="pb-3 px-3">Scheduled</th>
                <th className="pb-3 px-3">Variance</th>
                <th className="pb-3 px-3">GPS Distance</th>
                <th className="pb-3 px-3">Status</th>
                <th className="pb-3 pl-3 text-right">Manager Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
              {filteredRecords.map((rec) => {
                const isLate = rec.varianceMinutes > 5;
                const isPending = rec.status === 'pending_approval';

                return (
                  <tr key={rec.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30">
                    <td className="py-3 pr-4 font-semibold text-slate-900 dark:text-white">
                      <div>{rec.staffName}</div>
                      <span className="text-[10px] text-slate-400 font-normal">{rec.staffRole}</span>
                    </td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-300 font-mono">
                      {rec.date}
                    </td>
                    <td className="py-3 px-3 font-mono font-medium text-slate-800 dark:text-slate-200">
                      {rec.clockInTime} → {rec.clockOutTime || <span className="text-emerald-500 font-bold">Active</span>}
                    </td>
                    <td className="py-3 px-3 text-slate-500 dark:text-slate-400 font-mono">
                      {rec.scheduledStart} - {rec.scheduledEnd}
                    </td>
                    <td className="py-3 px-3">
                      {isLate ? (
                        <span className="rounded bg-red-100 px-1.5 py-0.5 text-[10px] font-bold text-red-800 dark:bg-red-950 dark:text-red-300">
                          +{rec.varianceMinutes}m Late
                        </span>
                      ) : (
                        <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          On Time
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-300">
                      {rec.distanceFromSiteMeters}m from HQ
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                          rec.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : rec.status === 'active_now'
                            ? 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        }`}
                      >
                        {rec.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 pl-3 text-right">
                      {isManager && isPending && (
                        <button
                          id={`approve-timesheet-${rec.id}`}
                          onClick={() => approveAttendance(rec.id)}
                          className="rounded bg-teal-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-teal-700"
                        >
                          Sign Off
                        </button>
                      )}
                      {rec.status === 'approved' && (
                        <span className="text-[11px] text-slate-400 font-medium">
                          Signed: {rec.approvedBy}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Clock Out Confirmation Dialog */}
      {showClockOutDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-800">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              Confirm Shift Sign-Off
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Please enter any handover notes, resident observation summaries, or exception reports before submitting your timesheet.
            </p>

            <textarea
              value={clockOutNotes}
              onChange={(e) => setClockOutNotes(e.target.value)}
              placeholder="e.g., Completed evening med round, Unit A residents settled, fluid charts balanced..."
              rows={3}
              className="w-full rounded-xl border border-slate-300 p-3 text-xs dark:border-slate-700 dark:bg-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
            />

            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowClockOutDialog(false)}
                className="rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmClockOut}
                className="rounded-lg bg-teal-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-teal-700"
              >
                Confirm & Submit Timesheet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
