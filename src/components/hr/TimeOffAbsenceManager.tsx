import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TimeOffReason, TimeOffStatus, TimeOffRequest } from '../../types';
import { getTodayDateString } from '../../data/mockData';
import {
  Calendar,
  CalendarDays,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Plus,
  Search,
  Filter,
  Users,
  Shield,
  FileText,
  UserCheck,
  Check,
  X,
  ChevronRight,
  Info,
  CalendarX,
  Plane,
  HeartPulse,
  GraduationCap,
  Baby,
  Briefcase
} from 'lucide-react';

export const TimeOffAbsenceManager: React.FC = () => {
  const {
    currentUser,
    userRole,
    staffList,
    shifts,
    timeOffRequests,
    requestTimeOff,
    reviewTimeOffRequest,
    deleteTimeOffRequest
  } = useApp();

  const isManagerOrAdminOrHR = userRole === 'Admin' || userRole === 'Manager' || userRole === 'HR';

  // Modal & Form State
  const [showModal, setShowModal] = useState(false);
  const [selectedStaffId, setSelectedStaffId] = useState(currentUser.id);
  const [startDate, setStartDate] = useState(getTodayDateString(1));
  const [endDate, setEndDate] = useState(getTodayDateString(2));
  const [reason, setReason] = useState<TimeOffReason>('Annual Leave');
  const [notes, setNotes] = useState('');
  const [emergencyCoverNotes, setEmergencyCoverNotes] = useState('');

  // Filter State
  const [statusFilter, setStatusFilter] = useState<'ALL' | TimeOffStatus>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRequestDetails, setSelectedRequestDetails] = useState<TimeOffRequest | null>(null);

  // Review Modal State
  const [reviewModalRequest, setReviewModalRequest] = useState<TimeOffRequest | null>(null);
  const [reviewAction, setReviewAction] = useState<'approved' | 'rejected'>('approved');
  const [reviewNotesInput, setReviewNotesInput] = useState('');

  // Calculate duration in days
  const calculateDays = (startStr: string, endStr: string) => {
    const s = new Date(startStr);
    const e = new Date(endStr);
    if (isNaN(s.getTime()) || isNaN(e.getTime()) || e < s) return 1;
    const diff = Math.max(0, e.getTime() - s.getTime());
    return Math.round(diff / (1000 * 60 * 60 * 24)) + 1;
  };

  const requestedDays = calculateDays(startDate, endDate);

  // Overlapping shifts preview for the selected staff and dates
  const overlappingShifts = shifts.filter(
    (s) => s.assignedStaffId === selectedStaffId && s.date >= startDate && s.date <= endDate
  );

  const selectedStaffMember = staffList.find((s) => s.id === selectedStaffId) || currentUser;

  // Filter requests
  const filteredRequests = timeOffRequests.filter((req) => {
    const matchesStatus = statusFilter === 'ALL' || req.status === statusFilter;
    const matchesSearch =
      req.staffName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.notes.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.department.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  const pendingCount = timeOffRequests.filter((r) => r.status === 'pending').length;
  const approvedCount = timeOffRequests.filter((r) => r.status === 'approved').length;

  // Staff on leave today
  const todayStr = getTodayDateString(0);
  const onLeaveToday = timeOffRequests.filter(
    (r) => r.status === 'approved' && todayStr >= r.startDate && todayStr <= r.endDate
  );

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate) return;

    requestTimeOff({
      staffId: selectedStaffId,
      startDate,
      endDate,
      reason,
      notes,
      emergencyCoverNotes: emergencyCoverNotes || undefined
    });

    // Reset and close
    setShowModal(false);
    setNotes('');
    setEmergencyCoverNotes('');
    setStartDate(getTodayDateString(1));
    setEndDate(getTodayDateString(2));
  };

  const handleOpenReview = (req: TimeOffRequest, action: 'approved' | 'rejected') => {
    setReviewModalRequest(req);
    setReviewAction(action);
    setReviewNotesInput(
      action === 'approved'
        ? 'Approved. Rota cover arranged / shifts updated to open cover.'
        : 'Unfortunately cannot approve due to minimum safe staffing ratios for this wing.'
    );
  };

  const handleConfirmReview = () => {
    if (!reviewModalRequest) return;
    reviewTimeOffRequest(reviewModalRequest.id, reviewAction, reviewNotesInput);
    setReviewModalRequest(null);
  };

  const getReasonIcon = (reasonType: TimeOffReason) => {
    switch (reasonType) {
      case 'Annual Leave':
        return <Plane className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />;
      case 'Sick Leave / Medical':
        return <HeartPulse className="h-4 w-4 text-red-600 dark:text-red-400" />;
      case 'Study / Training Leave':
        return <GraduationCap className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />;
      case 'Parental / Family Care':
        return <Baby className="h-4 w-4 text-amber-600 dark:text-amber-400" />;
      case 'Compassionate / Bereavement':
        return <Briefcase className="h-4 w-4 text-purple-600 dark:text-purple-400" />;
      default:
        return <Calendar className="h-4 w-4 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & KPI Metrics */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Staff Leave & Absence Management
            </h2>
            <span className="rounded bg-teal-100 px-2 py-0.5 text-[10px] font-bold text-teal-800 dark:bg-teal-950 dark:text-teal-300">
              Connected to Rota Engine
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Submit time off requests, audit planned leaves, and dynamically synchronize safe staffing coverage with the Smart Rota engine.
          </p>
        </div>

        <button
          id="open-request-timeoff-modal-btn"
          onClick={() => {
            setSelectedStaffId(currentUser.id);
            setShowModal(true);
          }}
          className="flex items-center justify-center gap-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 px-4 py-2 text-xs font-bold text-white shadow-xs transition-colors cursor-pointer shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Request Time Off</span>
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="rounded-xl border border-amber-200/80 bg-amber-50/60 p-3.5 dark:border-amber-900/60 dark:bg-amber-950/30">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
              Pending Requests
            </span>
            <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="mt-1 text-2xl font-extrabold text-amber-950 dark:text-amber-200">
            {pendingCount}
          </div>
          <div className="mt-1 text-[11px] text-amber-700 dark:text-amber-300">
            Awaiting manager rota clearance
          </div>
        </div>

        <div className="rounded-xl border border-emerald-200/80 bg-emerald-50/60 p-3.5 dark:border-emerald-900/60 dark:bg-emerald-950/30">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
              Approved Leaves
            </span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="mt-1 text-2xl font-extrabold text-emerald-950 dark:text-emerald-200">
            {approvedCount}
          </div>
          <div className="mt-1 text-[11px] text-emerald-700 dark:text-emerald-300">
            Processed & cover allocated
          </div>
        </div>

        <div className="rounded-xl border border-indigo-200/80 bg-indigo-50/60 p-3.5 dark:border-indigo-900/60 dark:bg-indigo-950/30">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-800 dark:text-indigo-300">
              On Leave Today
            </span>
            <CalendarX className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="mt-1 text-2xl font-extrabold text-indigo-950 dark:text-indigo-200">
            {onLeaveToday.length}
          </div>
          <div className="mt-1 text-[11px] text-indigo-700 dark:text-indigo-300">
            {onLeaveToday.length > 0 ? onLeaveToday.map((r) => r.staffName).join(', ') : 'All carers active'}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-3.5 dark:border-slate-800 dark:bg-slate-800/80">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Holiday Allowance
            </span>
            <Shield className="h-4 w-4 text-teal-600 dark:text-teal-400" />
          </div>
          <div className="mt-1 text-2xl font-extrabold text-slate-900 dark:text-white">
            28 Days
          </div>
          <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            UK Statutory 5.6 wks standard
          </div>
        </div>
      </div>

      {/* User Leave Allowance Quick Dossier */}
      <div className="rounded-xl border border-teal-200 bg-teal-50/50 p-4 dark:border-teal-900/60 dark:bg-teal-950/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="h-10 w-10 rounded-full object-cover ring-2 ring-teal-500 shrink-0"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-slate-900 dark:text-white">
                {currentUser.name}
              </span>
              <span className="rounded bg-teal-100 px-1.5 py-0.2 text-[10px] font-bold text-teal-800 dark:bg-teal-950 dark:text-teal-300">
                {currentUser.jobTitle}
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
              Personal Holiday Balance: <strong>21.0 Days Remaining</strong> (4.0 Days Taken, 3.0 Days Pending Clearance)
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setSelectedStaffId(currentUser.id);
            setShowModal(true);
          }}
          className="flex items-center gap-1.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white px-3 py-1.5 text-xs font-semibold shadow-xs transition-colors self-start md:self-auto cursor-pointer"
        >
          <CalendarDays className="h-3.5 w-3.5" />
          <span>Book Annual Leave</span>
        </button>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer shrink-0 ${
              statusFilter === 'ALL'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            All Requests ({timeOffRequests.length})
          </button>
          <button
            onClick={() => setStatusFilter('pending')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer shrink-0 ${
              statusFilter === 'pending'
                ? 'bg-amber-600 text-white font-bold'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100 dark:bg-amber-950/60 dark:text-amber-300'
            }`}
          >
            <Clock className="h-3.5 w-3.5" />
            <span>Pending Review ({pendingCount})</span>
          </button>
          <button
            onClick={() => setStatusFilter('approved')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer shrink-0 ${
              statusFilter === 'approved'
                ? 'bg-emerald-600 text-white font-bold'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300'
            }`}
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Approved ({approvedCount})</span>
          </button>
          <button
            onClick={() => setStatusFilter('rejected')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer shrink-0 ${
              statusFilter === 'rejected'
                ? 'bg-red-600 text-white font-bold'
                : 'bg-red-50 text-red-800 hover:bg-red-100 dark:bg-red-950/60 dark:text-red-300'
            }`}
          >
            <XCircle className="h-3.5 w-3.5" />
            <span>Rejected ({timeOffRequests.filter((r) => r.status === 'rejected').length})</span>
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search staff, reason, notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-1.5 pl-8 pr-3 text-xs text-slate-900 placeholder-slate-400 focus:border-teal-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
        </div>
      </div>

      {/* Requests Table / Cards */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden dark:border-slate-800 dark:bg-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50/80 dark:border-slate-700 dark:bg-slate-900/50">
              <tr>
                <th className="py-3 px-4 font-semibold text-slate-600 dark:text-slate-300">Staff Member</th>
                <th className="py-3 px-4 font-semibold text-slate-600 dark:text-slate-300">Absence Dates & Duration</th>
                <th className="py-3 px-4 font-semibold text-slate-600 dark:text-slate-300">Category & Reason</th>
                <th className="py-3 px-4 font-semibold text-slate-600 dark:text-slate-300">Cover / Notes</th>
                <th className="py-3 px-4 font-semibold text-slate-600 dark:text-slate-300">Status & Rota State</th>
                <th className="py-3 px-4 font-semibold text-slate-600 dark:text-slate-300 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <CalendarDays className="mx-auto h-8 w-8 text-slate-300 dark:text-slate-600 mb-2" />
                    <p className="font-medium text-slate-600 dark:text-slate-300">No time off requests found</p>
                    <p className="text-xs text-slate-400 mt-1">Submit a new request or adjust your search filter.</p>
                  </td>
                </tr>
              ) : (
                filteredRequests.map((req) => {
                  const isPending = req.status === 'pending';
                  const isApproved = req.status === 'approved';
                  const isRejected = req.status === 'rejected';

                  // Check if any shifts overlap on rota
                  const affectedShifts = shifts.filter(
                    (s) => s.assignedStaffId === req.staffId && s.date >= req.startDate && s.date <= req.endDate
                  );

                  return (
                    <tr
                      key={req.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-700/40 transition-colors"
                    >
                      {/* Staff Member */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={req.staffAvatar}
                            alt={req.staffName}
                            className="h-8 w-8 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700 shrink-0"
                          />
                          <div className="min-w-0">
                            <div className="font-bold text-slate-900 dark:text-white truncate">
                              {req.staffName}
                            </div>
                            <div className="text-[11px] text-slate-400 flex items-center gap-1">
                              <span>{req.department}</span>
                              <span>•</span>
                              <span>{req.staffRole}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Dates & Duration */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
                            <span>
                              {req.startDate} {req.startDate !== req.endDate ? `to ${req.endDate}` : ''}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                            {req.totalDays} {req.totalDays === 1 ? 'day' : 'days'} requested
                          </div>
                        </div>
                      </td>

                      {/* Reason */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          {getReasonIcon(req.reason)}
                          <span className="font-semibold text-slate-900 dark:text-white">
                            {req.reason}
                          </span>
                        </div>
                        {req.notes && (
                          <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400 max-w-xs truncate" title={req.notes}>
                            {req.notes}
                          </p>
                        )}
                      </td>

                      {/* Cover & Notes */}
                      <td className="py-3.5 px-4">
                        {req.emergencyCoverNotes ? (
                          <div className="text-[11px] text-slate-600 dark:text-slate-300">
                            <span className="font-semibold">Cover: </span>
                            {req.emergencyCoverNotes}
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">No handover notes</span>
                        )}
                        {affectedShifts.length > 0 && (
                          <div className="mt-1 flex items-center gap-1 text-[10px] font-bold text-amber-700 dark:text-amber-300">
                            <AlertTriangle className="h-3 w-3 text-amber-600" />
                            <span>{affectedShifts.length} shift(s) on Rota</span>
                          </div>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        {isPending && (
                          <div className="space-y-1">
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300/60 dark:border-amber-800/60">
                              <Clock className="h-3 w-3" />
                              <span>Pending Review</span>
                            </span>
                            <div className="text-[10px] text-slate-400">
                              Flagged on Rota
                            </div>
                          </div>
                        )}
                        {isApproved && (
                          <div className="space-y-1">
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300/60 dark:border-emerald-800/60">
                              <CheckCircle2 className="h-3 w-3" />
                              <span>Approved</span>
                            </span>
                            {req.reviewedBy && (
                              <div className="text-[10px] text-slate-400">
                                by {req.reviewedBy.split(' ')[0]}
                              </div>
                            )}
                          </div>
                        )}
                        {isRejected && (
                          <div className="space-y-1">
                            <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-800 dark:bg-red-950 dark:text-red-300 border border-red-300/60 dark:border-red-800/60">
                              <XCircle className="h-3 w-3" />
                              <span>Declined</span>
                            </span>
                            {req.reviewNotes && (
                              <div className="text-[10px] text-slate-400 max-w-[120px] truncate" title={req.reviewNotes}>
                                {req.reviewNotes}
                              </div>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {isPending && isManagerOrAdminOrHR && (
                            <>
                              <button
                                onClick={() => handleOpenReview(req, 'approved')}
                                className="flex items-center gap-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 px-2 py-1 text-[11px] font-bold text-white transition-colors cursor-pointer"
                                title="Approve Request & Update Rota"
                              >
                                <Check className="h-3 w-3" />
                                <span>Approve</span>
                              </button>
                              <button
                                onClick={() => handleOpenReview(req, 'rejected')}
                                className="flex items-center gap-1 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 dark:bg-red-950/60 dark:hover:bg-red-900/60 dark:text-red-300 px-2 py-1 text-[11px] font-bold border border-red-200 dark:border-red-800 transition-colors cursor-pointer"
                                title="Decline Request"
                              >
                                <X className="h-3 w-3" />
                                <span>Decline</span>
                              </button>
                            </>
                          )}

                          <button
                            onClick={() => setSelectedRequestDetails(req)}
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
                            title="Inspect Request Dossier"
                          >
                            <FileText className="h-4 w-4" />
                          </button>

                          {(req.staffId === currentUser.id || isManagerOrAdminOrHR) && (
                            <button
                              onClick={() => deleteTimeOffRequest(req.id)}
                              className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40 dark:hover:text-red-400 transition-colors cursor-pointer"
                              title="Delete Request"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* REQUEST TIME OFF MODAL FORM */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-500/10 text-teal-600 dark:bg-teal-500/20 dark:text-teal-400">
                  <CalendarDays className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">
                    Request Time Off / Absence
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Submitting will update the Rota engine to reflect pending absence.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitRequest} className="space-y-4 pt-4">
              {/* Staff Member Selector (Self or On Behalf if Admin/Manager) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Staff Member
                </label>
                {isManagerOrAdminOrHR ? (
                  <select
                    value={selectedStaffId}
                    onChange={(e) => setSelectedStaffId(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white cursor-pointer focus:border-teal-500 focus:outline-hidden"
                  >
                    {staffList.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.jobTitle} • {s.department}) {s.id === currentUser.id ? '— (Myself)' : ''}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50 p-2.5 dark:border-slate-800 dark:bg-slate-800/80">
                    <img
                      src={selectedStaffMember.avatar}
                      alt={selectedStaffMember.name}
                      className="h-8 w-8 rounded-full object-cover ring-1 ring-teal-500"
                    />
                    <div>
                      <div className="font-bold text-xs text-slate-900 dark:text-white">
                        {selectedStaffMember.name}
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">
                        {selectedStaffMember.jobTitle} • {selectedStaffMember.department}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Leave Reason / Category */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Absence Category & Reason
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(
                    [
                      'Annual Leave',
                      'Sick Leave / Medical',
                      'Study / Training Leave',
                      'Parental / Family Care',
                      'Compassionate / Bereavement',
                      'Unpaid Leave'
                    ] as TimeOffReason[]
                  ).map((r) => (
                    <button
                      type="button"
                      key={r}
                      onClick={() => setReason(r)}
                      className={`flex items-center gap-2 rounded-xl p-2.5 text-xs text-left border transition-all cursor-pointer ${
                        reason === r
                          ? 'border-teal-500 bg-teal-50 text-teal-950 font-bold dark:border-teal-500 dark:bg-teal-950/60 dark:text-teal-200 ring-1 ring-teal-500/20'
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800/80 dark:text-slate-300'
                      }`}
                    >
                      {getReasonIcon(r)}
                      <span className="truncate">{r}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Date Selection */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => {
                      setStartDate(e.target.value);
                      if (e.target.value > endDate) {
                        setEndDate(e.target.value);
                      }
                    }}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:border-teal-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    required
                    min={startDate}
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:border-teal-500 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Live Conflict Warning & Rota Impact */}
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs dark:border-slate-800 dark:bg-slate-800/60 space-y-1.5">
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-slate-700 dark:text-slate-300">Total Requested Duration:</span>
                  <span className="font-bold text-teal-700 dark:text-teal-300 font-mono">
                    {requestedDays} {requestedDays === 1 ? 'Working Day' : 'Working Days'}
                  </span>
                </div>

                {overlappingShifts.length > 0 ? (
                  <div className="mt-1 flex items-start gap-2 rounded-lg bg-amber-100/70 p-2 text-amber-900 dark:bg-amber-950/60 dark:text-amber-200">
                    <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
                    <div>
                      <span className="font-bold">Rota Schedule Conflict: </span>
                      {selectedStaffMember.name} has <strong>{overlappingShifts.length} assigned shift(s)</strong> during these dates.
                      Submitting will update the Rota engine to display pending absence indicators.
                    </div>
                  </div>
                ) : (
                  <div className="mt-1 flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300 text-[11px]">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>No active roster conflicts found for these dates.</span>
                  </div>
                )}
              </div>

              {/* Notes / Explanation */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Reason & Details (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Attending family wedding, medical appointment, or course study module..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 placeholder-slate-400 focus:border-teal-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              {/* Handover & Emergency Cover */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Shift Cover / Handover Arrangement (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Shift swap discussed with Liam Gallagher for Thursday afternoon"
                  value={emergencyCoverNotes}
                  onChange={(e) => setEmergencyCoverNotes(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-teal-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-teal-600 hover:bg-teal-700 px-4 py-2 text-xs font-bold text-white shadow-xs transition-colors cursor-pointer"
                >
                  Submit Time Off Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REVIEW & APPROVAL MODAL */}
      {reviewModalRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl dark:border-slate-800 dark:bg-slate-900 overflow-hidden space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <div className="flex items-center gap-2">
                {reviewAction === 'approved' ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                )}
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  {reviewAction === 'approved' ? 'Approve Time Off Request' : 'Decline Time Off Request'}
                </h3>
              </div>
              <button
                onClick={() => setReviewModalRequest(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 text-xs dark:border-slate-800 dark:bg-slate-800/60 space-y-1">
              <div className="flex justify-between font-semibold">
                <span className="text-slate-500">Employee:</span>
                <span className="text-slate-900 dark:text-white font-bold">{reviewModalRequest.staffName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Dates:</span>
                <span className="text-slate-700 dark:text-slate-300">
                  {reviewModalRequest.startDate} to {reviewModalRequest.endDate} ({reviewModalRequest.totalDays} days)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Category:</span>
                <span className="text-slate-700 dark:text-slate-300">{reviewModalRequest.reason}</span>
              </div>
            </div>

            {reviewAction === 'approved' && (
              <p className="text-xs text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 p-2.5 rounded-xl border border-emerald-200 dark:border-emerald-900">
                Approving will automatically convert assigned shifts on these dates to open cover slots on the Rota engine for relief carers to claim.
              </p>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Manager Decision Notes
              </label>
              <textarea
                rows={2}
                value={reviewNotesInput}
                onChange={(e) => setReviewNotesInput(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-teal-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setReviewModalRequest(null)}
                className="rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReview}
                className={`rounded-xl px-4 py-1.5 text-xs font-bold text-white transition-colors cursor-pointer ${
                  reviewAction === 'approved' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                Confirm {reviewAction === 'approved' ? 'Approval' : 'Decline'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* INSPECT DETAILS MODAL */}
      {selectedRequestDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl dark:border-slate-800 dark:bg-slate-900 overflow-hidden space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Time Off Dossier #{selectedRequestDetails.id}
              </h3>
              <button
                onClick={() => setSelectedRequestDetails(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex items-center gap-3">
              <img
                src={selectedRequestDetails.staffAvatar}
                alt={selectedRequestDetails.staffName}
                className="h-10 w-10 rounded-full object-cover ring-2 ring-teal-500"
              />
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  {selectedRequestDetails.staffName}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {selectedRequestDetails.department} • {selectedRequestDetails.staffRole}
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs dark:border-slate-800 dark:bg-slate-800/60 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Reason Category:</span>
                <span className="font-semibold text-slate-900 dark:text-white">{selectedRequestDetails.reason}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Dates Requested:</span>
                <span className="font-mono text-slate-900 dark:text-white">
                  {selectedRequestDetails.startDate} → {selectedRequestDetails.endDate} ({selectedRequestDetails.totalDays} days)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Status:</span>
                <span className="font-bold capitalize">{selectedRequestDetails.status}</span>
              </div>
              {selectedRequestDetails.notes && (
                <div className="pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-slate-500 block mb-0.5">Staff Notes:</span>
                  <p className="text-slate-700 dark:text-slate-300 italic">{selectedRequestDetails.notes}</p>
                </div>
              )}
              {selectedRequestDetails.emergencyCoverNotes && (
                <div className="pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-slate-500 block mb-0.5">Cover Plan:</span>
                  <p className="text-slate-700 dark:text-slate-300">{selectedRequestDetails.emergencyCoverNotes}</p>
                </div>
              )}
              {selectedRequestDetails.reviewNotes && (
                <div className="pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-slate-500 block mb-0.5">Manager Feedback:</span>
                  <p className="text-slate-700 dark:text-slate-300 font-semibold">{selectedRequestDetails.reviewNotes}</p>
                </div>
              )}
            </div>

            <button
              onClick={() => setSelectedRequestDetails(null)}
              className="w-full rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors"
            >
              Close Dossier
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
