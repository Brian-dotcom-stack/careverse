import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  EmployeeOnboardingRecord,
  OnboardingDocumentStatus,
  TrainingModuleStatus,
  UserRole
} from '../../types';
import {
  UserCheck,
  FileCheck2,
  GraduationCap,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Search,
  Plus,
  FileText,
  Shield,
  Eye,
  ChevronRight,
  Filter,
  Download,
  Upload,
  Calendar,
  Award,
  Sparkles,
  Lock,
  ArrowRight,
  Check,
  X,
  FileSpreadsheet,
  AlertOctagon
} from 'lucide-react';
import { getTodayDateString } from '../../data/mockData';

export const EmployeeOnboardingTracker: React.FC = () => {
  const {
    onboardingRecords,
    updateOnboardingDocumentStatus,
    updateOnboardingTrainingStatus,
    enrollNewStarter,
    signoffOnboardingClearance,
    logShadowShift,
    toggleInductionStep,
    bulkVerifyDocuments,
    bulkCompleteTraining,
    staffList,
    currentUser,
    userRole,
    addToast
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStage, setSelectedStage] = useState<string>('all');
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [selectedCandidate, setSelectedCandidate] = useState<EmployeeOnboardingRecord | null>(null);
  const [dossierTab, setDossierTab] = useState<'documents' | 'training' | 'shadowing' | 'signoff'>('documents');
  const [showEnrollModal, setShowEnrollModal] = useState(false);

  // New Starter Form State
  const [newStarterName, setNewStarterName] = useState('');
  const [newStarterEmail, setNewStarterEmail] = useState('');
  const [newStarterPhone, setNewStarterPhone] = useState('');
  const [newStarterRole, setNewStarterRole] = useState<UserRole>('Staff');
  const [newStarterJobTitle, setNewStarterJobTitle] = useState('Healthcare Assistant (HCA)');
  const [newStarterDept, setNewStarterDept] = useState<'Care' | 'Nursing' | 'Housekeeping' | 'Administration'>('Care');
  const [newStarterStartDate, setNewStarterStartDate] = useState(getTodayDateString(0));
  const [newStarterTargetDate, setNewStarterTargetDate] = useState(getTodayDateString(14));
  const [newStarterMentor, setNewStarterMentor] = useState('Claire Beauchamp (Senior Carer)');
  const [newStarterNotes, setNewStarterNotes] = useState('');

  // Rejection prompt state
  const [rejectionDocId, setRejectionDocId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // Filter candidates
  const filteredCandidates = onboardingRecords.filter((cand) => {
    const matchesSearch =
      cand.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cand.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cand.mentorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cand.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStage = selectedStage === 'all' || cand.status === selectedStage;
    const matchesDept = selectedDept === 'all' || cand.department === selectedDept;

    return matchesSearch && matchesStage && matchesDept;
  });

  // KPI Calculations
  const activeStartersCount = onboardingRecords.filter((c) => c.status !== 'completed').length;
  const readyForDutyCount = onboardingRecords.filter((c) => c.status === 'ready_for_duty').length;
  const actionRequiredCount = onboardingRecords.filter((c) => c.status === 'action_required').length;

  const totalDocs = onboardingRecords.reduce((acc, c) => acc + c.documents.length, 0);
  const verifiedDocs = onboardingRecords.reduce(
    (acc, c) => acc + c.documents.filter((d) => d.status === 'verified').length,
    0
  );
  const docVerificationRate = totalDocs > 0 ? Math.round((verifiedDocs / totalDocs) * 100) : 100;

  const totalTrainingModules = onboardingRecords.reduce((acc, c) => acc + c.trainingModules.length, 0);
  const completedTrainingModules = onboardingRecords.reduce(
    (acc, c) => acc + c.trainingModules.filter((t) => t.status === 'completed').length,
    0
  );
  const trainingCompletionRate =
    totalTrainingModules > 0 ? Math.round((completedTrainingModules / totalTrainingModules) * 100) : 100;

  // Sync selected candidate reference with live state
  const liveCandidate = selectedCandidate
    ? onboardingRecords.find((c) => c.id === selectedCandidate.id) || selectedCandidate
    : null;

  const handleEnrollSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStarterName.trim()) return;

    enrollNewStarter({
      employeeName: newStarterName.trim(),
      employeeRole: newStarterRole,
      jobTitle: newStarterJobTitle.trim(),
      department: newStarterDept,
      email: newStarterEmail.trim() || `${newStarterName.toLowerCase().replace(/\s+/g, '.')}@meadowbrook-care.org`,
      phone: newStarterPhone.trim() || '+44 7700 900100',
      startDate: newStarterStartDate,
      targetCompletionDate: newStarterTargetDate,
      mentorName: newStarterMentor,
      notes: newStarterNotes.trim() || undefined
    });

    setShowEnrollModal(false);
    setNewStarterName('');
    setNewStarterEmail('');
    setNewStarterPhone('');
    setNewStarterNotes('');
  };

  const handleExportAuditCSV = () => {
    const headers =
      'Candidate Name,Role,Department,Start Date,Status,Progress %,Verified Docs,Total Docs,Completed Training,Total Training,Shadow Shifts,CQC Signoff,Mentor\n';
    const rows = onboardingRecords
      .map((c) => {
        const vDocs = c.documents.filter((d) => d.status === 'verified').length;
        const cTrn = c.trainingModules.filter((t) => t.status === 'completed').length;
        return `"${c.employeeName}","${c.jobTitle}","${c.department}","${c.startDate}","${c.status}","${c.progressPercent}%","${vDocs}","${c.documents.length}","${cTrn}","${c.trainingModules.length}","${c.shadowShiftsCompleted}/${c.shadowShiftsRequired}","${c.cqcRegistrationSignoff ? 'YES' : 'NO'}","${c.mentorName}"`;
      })
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CareVerse_Onboarding_Audit_${getTodayDateString(0)}.csv`;
    a.click();
    addToast('Audit Report Exported', 'CQC Regulation 19 workforce onboarding audit CSV downloaded', 'success');
  };

  const getStatusBadge = (status: EmployeeOnboardingRecord['status']) => {
    switch (status) {
      case 'ready_for_duty':
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-teal-100 px-2 py-0.5 text-xs font-bold text-teal-800 dark:bg-teal-950 dark:text-teal-300">
            <Sparkles className="h-3 w-3" /> Ready for Duty
          </span>
        );
      case 'action_required':
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-red-100 px-2 py-0.5 text-xs font-bold text-red-800 dark:bg-red-950 dark:text-red-300">
            <AlertTriangle className="h-3 w-3" /> Action Required
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
            <CheckCircle2 className="h-3 w-3" /> Cleared & Active
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
            <Clock className="h-3 w-3" /> In Progress
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Module Overview Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-r from-teal-900 via-slate-900 to-indigo-950 p-5 text-white shadow-md dark:border-slate-800">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="rounded bg-teal-500/20 border border-teal-400/30 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-teal-300">
                HR Sub-Module
              </span>
              <span className="text-xs text-slate-300 font-mono">CQC Regulation 19 Audit Standard</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-white">
              Employee Onboarding & Care Compliance Pipeline
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Automated end-to-end onboarding lifecycle: statutory right to work verification, DBS barred list checks, two professional references, mandatory Skills for Care training curriculum, and supervised shadow shifts.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={handleExportAuditCSV}
              className="flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-3.5 py-2 text-xs font-semibold text-white hover:bg-white/20 transition-all cursor-pointer"
            >
              <FileSpreadsheet className="h-4 w-4 text-teal-300" />
              <span>Export Audit Dossier</span>
            </button>

            <button
              onClick={() => setShowEnrollModal(true)}
              className="flex items-center gap-1.5 rounded-xl bg-teal-500 hover:bg-teal-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition-all cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Enroll New Starter</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Metric Tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Starters in Pipeline</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50 text-teal-600 dark:bg-teal-950 dark:text-teal-300">
              <UserCheck className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">{activeStartersCount}</span>
            <span className="text-xs text-slate-400">active recruits</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between border-t border-slate-100 dark:border-slate-700/60 pt-2">
            <span>Ready for duty:</span>
            <span className="font-bold text-teal-600 dark:text-teal-400">{readyForDutyCount} cleared</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Document Verification</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300">
              <FileCheck2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">{docVerificationRate}%</span>
            <span className="text-xs text-slate-400">
              {verifiedDocs}/{totalDocs} files
            </span>
          </div>
          <div className="mt-2 w-full bg-slate-100 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
            <div className="bg-indigo-500 h-1.5 rounded-full transition-all" style={{ width: `${docVerificationRate}%` }} />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Mandatory Training Pass</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300">
              <GraduationCap className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">{trainingCompletionRate}%</span>
            <span className="text-xs text-slate-400">
              {completedTrainingModules}/{totalTrainingModules} modules
            </span>
          </div>
          <div className="mt-2 w-full bg-slate-100 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
            <div className="bg-emerald-500 h-1.5 rounded-full transition-all" style={{ width: `${trainingCompletionRate}%` }} />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Compliance Blockers</span>
            <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${actionRequiredCount > 0 ? 'bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-300' : 'bg-slate-100 text-slate-600 dark:bg-slate-700'}`}>
              <AlertOctagon className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={`text-2xl font-bold ${actionRequiredCount > 0 ? 'text-red-600 dark:text-red-400' : 'text-slate-900 dark:text-white'}`}>
              {actionRequiredCount}
            </span>
            <span className="text-xs text-slate-400">action required</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between border-t border-slate-100 dark:border-slate-700/60 pt-2">
            <span>DBS & Ref checks:</span>
            <span className={actionRequiredCount > 0 ? 'text-amber-600 font-semibold' : 'text-slate-400'}>
              {actionRequiredCount > 0 ? 'Pending referee response' : 'All clear'}
            </span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-3.5 dark:border-slate-800 dark:bg-slate-800 shadow-xs">
        <div className="flex flex-1 items-center gap-2 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by starter name, role, mentor, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:border-teal-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <Filter className="h-3.5 w-3.5" />
            <span>Stage:</span>
            <select
              value={selectedStage}
              onChange={(e) => setSelectedStage(e.target.value)}
              className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 cursor-pointer"
            >
              <option value="all">All Stages ({onboardingRecords.length})</option>
              <option value="in_progress">In Progress</option>
              <option value="action_required">Action Required</option>
              <option value="ready_for_duty">Ready for Duty</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <span>Dept:</span>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 cursor-pointer"
            >
              <option value="all">All Departments</option>
              <option value="Care">Care</option>
              <option value="Nursing">Nursing</option>
              <option value="Housekeeping">Housekeeping</option>
              <option value="Administration">Administration</option>
            </select>
          </div>
        </div>
      </div>

      {/* Candidates Roster Grid / Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-800 overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <span>Enrolled Starters & Compliance Progress</span>
            <span className="rounded-full bg-slate-100 dark:bg-slate-700 px-2 py-0.5 text-xs text-slate-600 dark:text-slate-300">
              {filteredCandidates.length}
            </span>
          </h3>
          <span className="text-xs text-slate-400">Click candidate row to inspect compliance dossier</span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-700">
          {filteredCandidates.map((candidate) => {
            const vDocs = candidate.documents.filter((d) => d.status === 'verified').length;
            const cTrn = candidate.trainingModules.filter((t) => t.status === 'completed').length;

            return (
              <div
                key={candidate.id}
                onClick={() => setSelectedCandidate(candidate)}
                className="p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-slate-50/80 dark:hover:bg-slate-700/30 transition-all cursor-pointer"
              >
                {/* Starter Identity */}
                <div className="flex items-start gap-3.5 min-w-[260px]">
                  <img
                    src={candidate.avatar}
                    alt={candidate.employeeName}
                    className="h-11 w-11 rounded-xl object-cover ring-2 ring-slate-100 dark:ring-slate-700 shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900 dark:text-white">
                        {candidate.employeeName}
                      </span>
                      {getStatusBadge(candidate.status)}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      {candidate.jobTitle} • {candidate.department}
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                      <Calendar className="h-3 w-3" />
                      <span>Started: {candidate.startDate}</span>
                      <span>•</span>
                      <span>Mentor: {candidate.mentorName.split(' ')[0]}</span>
                    </div>
                  </div>
                </div>

                {/* Progress Indicators */}
                <div className="grid grid-cols-3 gap-3 min-w-[320px] text-xs">
                  {/* Overall Progress */}
                  <div>
                    <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                      <span>Overall Progress</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{candidate.progressPercent}%</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          candidate.progressPercent >= 90
                            ? 'bg-teal-500'
                            : candidate.progressPercent >= 50
                            ? 'bg-indigo-500'
                            : 'bg-amber-500'
                        }`}
                        style={{ width: `${candidate.progressPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Documents Verified */}
                  <div className="rounded-xl border border-slate-100 dark:border-slate-700/60 bg-slate-50/60 dark:bg-slate-900/40 p-2 text-center">
                    <span className="text-[10px] text-slate-400 block uppercase font-medium">Documents</span>
                    <span className="font-bold text-xs text-slate-800 dark:text-slate-200">
                      {vDocs} / {candidate.documents.length}
                    </span>
                  </div>

                  {/* Training Certified */}
                  <div className="rounded-xl border border-slate-100 dark:border-slate-700/60 bg-slate-50/60 dark:bg-slate-900/40 p-2 text-center">
                    <span className="text-[10px] text-slate-400 block uppercase font-medium">Training</span>
                    <span className="font-bold text-xs text-slate-800 dark:text-slate-200">
                      {cTrn} / {candidate.trainingModules.length}
                    </span>
                  </div>
                </div>

                {/* Actions & Next Step */}
                <div className="flex items-center gap-2 justify-end shrink-0">
                  {candidate.status === 'ready_for_duty' ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        signoffOnboardingClearance(candidate.id);
                      }}
                      className="rounded-xl bg-teal-600 hover:bg-teal-700 px-3 py-1.5 text-xs font-bold text-white shadow-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>Grant Signoff</span>
                    </button>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCandidate(candidate);
                      }}
                      className="rounded-xl border border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1 cursor-pointer"
                    >
                      <span>Review Dossier</span>
                      <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {filteredCandidates.length === 0 && (
            <div className="py-12 text-center space-y-2">
              <UserCheck className="mx-auto h-8 w-8 text-slate-300" />
              <div className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                No matching onboarding records
              </div>
              <p className="text-xs text-slate-400">Try adjusting your stage or search filter.</p>
            </div>
          )}
        </div>
      </div>

      {/* Comprehensive Candidate Dossier Modal */}
      {liveCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-5 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-4xl rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 animate-in fade-in zoom-in-95 duration-150 max-h-[92vh] flex flex-col">
            
            {/* Dossier Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
              <div className="flex items-start gap-3.5">
                <img
                  src={liveCandidate.avatar}
                  alt={liveCandidate.employeeName}
                  className="h-14 w-14 rounded-2xl object-cover ring-2 ring-teal-500 shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      {liveCandidate.employeeName}
                    </h3>
                    {getStatusBadge(liveCandidate.status)}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {liveCandidate.jobTitle} • {liveCandidate.department} Department
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 mt-1">
                    <span>Email: {liveCandidate.email}</span>
                    <span>•</span>
                    <span>Phone: {liveCandidate.phone}</span>
                    <span>•</span>
                    <span>Mentor: {liveCandidate.mentorName}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedCandidate(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Dossier Tabs */}
            <div className="flex border-b border-slate-200 dark:border-slate-800 mt-3 overflow-x-auto shrink-0 space-x-1">
              {[
                { id: 'documents', label: '1. Document Collection & Checks', count: `${liveCandidate.documents.filter((d) => d.status === 'verified').length}/${liveCandidate.documents.length}` },
                { id: 'training', label: '2. Mandatory Training Matrix', count: `${liveCandidate.trainingModules.filter((t) => t.status === 'completed').length}/${liveCandidate.trainingModules.length}` },
                { id: 'shadowing', label: '3. Induction & Shadowing Shifts', count: `${liveCandidate.shadowShiftsCompleted}/${liveCandidate.shadowShiftsRequired}` },
                { id: 'signoff', label: '4. CQC Regulation 19 Signoff' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setDossierTab(tab.id as any)}
                  className={`flex items-center gap-2 border-b-2 py-2.5 px-3 text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                    dossierTab === tab.id
                      ? 'border-teal-600 text-teal-700 dark:border-teal-400 dark:text-teal-300'
                      : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400'
                  }`}
                >
                  <span>{tab.label}</span>
                  {tab.count && (
                    <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-1.5 py-0.2 text-[10px] font-bold">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Tab 1: Document Collection & Verification */}
            {dossierTab === 'documents' && (
              <div className="mt-4 flex-1 overflow-y-auto space-y-4 pr-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">
                      Pre-Employment Verification Checklist
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      All care employees require verified identity, DBS, and professional references before unsupervised client contact.
                    </p>
                  </div>
                  <button
                    onClick={() => bulkVerifyDocuments(liveCandidate.id)}
                    className="rounded-lg bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 px-3 py-1.5 text-xs font-semibold text-teal-700 dark:text-teal-300 hover:bg-teal-100 transition-colors cursor-pointer"
                  >
                    Verify All Documents
                  </button>
                </div>

                <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                  {liveCandidate.documents.map((doc) => (
                    <div key={doc.id} className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-900 dark:text-white">{doc.name}</span>
                          {doc.required && (
                            <span className="rounded bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 text-[9px] font-bold px-1.5 py-0.2">
                              Mandatory
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-2">
                          <span className="capitalize">Category: {doc.category}</span>
                          {doc.verifiedBy && <span>• Verified by: {doc.verifiedBy}</span>}
                          {doc.fileName && <span className="font-mono text-teal-600 dark:text-teal-400">[{doc.fileName}]</span>}
                        </div>
                        {doc.notes && (
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 italic">
                            Note: {doc.notes}
                          </div>
                        )}
                      </div>

                      {/* Document Actions */}
                      <div className="flex items-center gap-2 shrink-0">
                        {doc.status === 'verified' ? (
                          <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-xs font-semibold text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950 dark:text-emerald-300">
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                            Verified
                          </span>
                        ) : doc.status === 'rejected' ? (
                          <span className="inline-flex items-center gap-1 rounded-md bg-red-50 border border-red-200 px-2 py-1 text-xs font-semibold text-red-800 dark:bg-red-950 dark:text-red-300">
                            <X className="h-3.5 w-3.5 text-red-600" />
                            Rejected
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 border border-amber-200 px-2 py-1 text-xs font-semibold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                            <Clock className="h-3.5 w-3.5 text-amber-600" />
                            {doc.status === 'submitted' ? 'Under Review' : 'Pending Upload'}
                          </span>
                        )}

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => updateOnboardingDocumentStatus(liveCandidate.id, doc.id, 'verified')}
                            className="rounded p-1 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 cursor-pointer"
                            title="Mark as Verified"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              setRejectionDocId(doc.id);
                              setRejectionReason('');
                            }}
                            className="rounded p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/60 cursor-pointer"
                            title="Reject / Request Re-upload"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Inline Rejection Reason Dialog */}
                {rejectionDocId && (
                  <div className="p-3.5 rounded-xl border border-red-200 bg-red-50/70 dark:border-red-900/60 dark:bg-red-950/40 text-xs space-y-2">
                    <div className="font-bold text-red-900 dark:text-red-200">
                      Specify Document Rejection Reason
                    </div>
                    <input
                      type="text"
                      placeholder="e.g. Proof of address older than 3 months, please provide council tax or bank bill"
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      className="w-full rounded-lg border border-red-300 px-3 py-1.5 text-xs dark:bg-slate-900 dark:border-red-800 dark:text-white"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setRejectionDocId(null)}
                        className="rounded px-2.5 py-1 text-xs text-slate-600 hover:bg-white"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          updateOnboardingDocumentStatus(
                            liveCandidate.id,
                            rejectionDocId,
                            'rejected',
                            rejectionReason || 'Document requires re-submission'
                          );
                          setRejectionDocId(null);
                        }}
                        className="rounded bg-red-600 px-3 py-1 text-xs font-semibold text-white hover:bg-red-700"
                      >
                        Confirm Rejection
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: Mandatory Care Training Matrix */}
            {dossierTab === 'training' && (
              <div className="mt-4 flex-1 overflow-y-auto space-y-4 pr-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">
                      Skills for Care Mandatory Curriculum (CQC Standards)
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Staff must achieve a minimum 80% passing grade in all statutory modules before working independently.
                    </p>
                  </div>
                  <button
                    onClick={() => bulkCompleteTraining(liveCandidate.id)}
                    className="rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 transition-colors cursor-pointer"
                  >
                    Mark All Modules Completed
                  </button>
                </div>

                <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                  {liveCandidate.trainingModules.map((mod) => (
                    <div key={mod.id} className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                          <span>{mod.title}</span>
                          <span className="text-[10px] text-slate-400 font-normal">({mod.durationHours}h)</span>
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                          <span className="capitalize">Category: {mod.category.replace('_', ' ')}</span>
                          {mod.completedDate && <span>• Completed: {mod.completedDate}</span>}
                          {mod.score !== undefined && (
                            <span className="font-bold text-emerald-600 dark:text-emerald-400">
                              • Score: {mod.score}%
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {mod.status === 'completed' ? (
                          <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-xs font-semibold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Passed
                          </span>
                        ) : mod.status === 'in_progress' ? (
                          <span className="inline-flex items-center gap-1 rounded-md bg-indigo-50 border border-indigo-200 px-2 py-1 text-xs font-semibold text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
                            <Clock className="h-3.5 w-3.5 text-indigo-600" /> In Progress
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 border border-slate-200 px-2 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                            Not Started
                          </span>
                        )}

                        <button
                          onClick={() =>
                            updateOnboardingTrainingStatus(
                              liveCandidate.id,
                              mod.id,
                              mod.status === 'completed' ? 'not_started' : 'completed',
                              mod.status === 'completed' ? undefined : 96
                            )
                          }
                          className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 cursor-pointer"
                        >
                          {mod.status === 'completed' ? 'Reset' : 'Pass Module'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 3: Induction & Shadowing Shifts */}
            {dossierTab === 'shadowing' && (
              <div className="mt-4 flex-1 overflow-y-auto space-y-4 pr-1 text-xs">
                <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-900/40">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white">
                        Supervised Shadowing Shifts ({liveCandidate.shadowShiftsCompleted} of {liveCandidate.shadowShiftsRequired} Completed)
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        New recruits work alongside assigned Senior Mentors to learn unit care routines and emergency bells.
                      </p>
                    </div>

                    <button
                      onClick={() => logShadowShift(liveCandidate.id)}
                      className="rounded-lg bg-teal-600 hover:bg-teal-700 px-3 py-1.5 text-xs font-bold text-white transition-colors cursor-pointer"
                    >
                      + Log Shadow Shift
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-3">
                    {[1, 2, 3].map((shiftNum) => {
                      const isDone = shiftNum <= liveCandidate.shadowShiftsCompleted;
                      return (
                        <div
                          key={shiftNum}
                          className={`rounded-xl border p-3 flex items-center justify-between ${
                            isDone
                              ? 'border-emerald-200 bg-emerald-50/70 text-emerald-900 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-200'
                              : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-800 text-slate-500'
                          }`}
                        >
                          <div>
                            <span className="font-bold block">Shadow Shift #{shiftNum}</span>
                            <span className="text-[10px] opacity-80">
                              {shiftNum === 1 ? 'Unit A - Dementia' : shiftNum === 2 ? 'Unit B - Residential' : 'Medication & Handovers'}
                            </span>
                          </div>
                          {isDone ? (
                            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                          ) : (
                            <Clock className="h-4 w-4 text-slate-300" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Practical Induction Checkpoints */}
                <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-800 space-y-3">
                  <h4 className="font-bold text-slate-900 dark:text-white">Facility Induction Protocols</h4>
                  
                  <label className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 dark:border-slate-700/60 hover:bg-slate-50 dark:hover:bg-slate-700/30 cursor-pointer">
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={liveCandidate.inductionTourCompleted}
                        onChange={() => toggleInductionStep(liveCandidate.id, 'inductionTour')}
                        className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                      />
                      <div>
                        <span className="font-semibold text-slate-900 dark:text-white block">
                          Fire Safety Tour & Emergency Exits Walkthrough
                        </span>
                        <span className="text-[11px] text-slate-400">
                          Primary escape corridors, break-glass call points, assembly points.
                        </span>
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${liveCandidate.inductionTourCompleted ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'}`}>
                      {liveCandidate.inductionTourCompleted ? 'Signed Off' : 'Pending'}
                    </span>
                  </label>

                  <label className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 dark:border-slate-700/60 hover:bg-slate-50 dark:hover:bg-slate-700/30 cursor-pointer">
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={liveCandidate.uniformAndBadgeIssued}
                        onChange={() => toggleInductionStep(liveCandidate.id, 'uniformBadge')}
                        className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                      />
                      <div>
                        <span className="font-semibold text-slate-900 dark:text-white block">
                          CareVerse Smart ID Badge & Tunic Uniform Issuance
                        </span>
                        <span className="text-[11px] text-slate-400">
                          Biometric door fob access, care uniform sets, and digital clocking credentials.
                        </span>
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${liveCandidate.uniformAndBadgeIssued ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'}`}>
                      {liveCandidate.uniformAndBadgeIssued ? 'Issued' : 'Pending'}
                    </span>
                  </label>
                </div>
              </div>
            )}

            {/* Tab 4: CQC Signoff & Final Clearance */}
            {dossierTab === 'signoff' && (
              <div className="mt-4 flex-1 overflow-y-auto space-y-4 pr-1 text-xs">
                <div className="rounded-2xl border border-slate-200 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-900/60 p-5 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-300">
                      <Shield className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        CQC Regulation 19: Fit and Proper Persons Compliance Signoff
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        Formal statutory assurance that employee meets all legal requirements for health and social care duty.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                    <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-slate-600 dark:text-slate-300">1. Proof of identity & legal right to work in UK</span>
                      <span className="font-bold text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Verified
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-slate-600 dark:text-slate-300">2. Enhanced DBS certificate & adult barred list search</span>
                      <span className="font-bold text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Cleared
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-slate-600 dark:text-slate-300">3. Two satisfactory care references verified</span>
                      <span className="font-bold text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" /> On File
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-slate-600 dark:text-slate-300">4. Satisfactory evidence of physical & mental fitness</span>
                      <span className="font-bold text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Occ Health Fit
                      </span>
                    </div>
                  </div>

                  {liveCandidate.cqcRegistrationSignoff ? (
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-900 dark:border-emerald-900/60 dark:bg-emerald-950/60 dark:text-emerald-200 flex items-center gap-3">
                      <Award className="h-8 w-8 text-emerald-600 shrink-0" />
                      <div>
                        <div className="font-bold text-sm">Clearance Granted & CQC Audit Certified</div>
                        <p className="text-[11px] text-emerald-700 dark:text-emerald-300">
                          {liveCandidate.employeeName} is registered as fully compliant and active for scheduled shifts on CareVerse Smart Rota.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="pt-2">
                      <button
                        onClick={() => signoffOnboardingClearance(liveCandidate.id)}
                        className="w-full rounded-xl bg-teal-600 hover:bg-teal-700 p-3 text-xs font-bold text-white shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Sparkles className="h-4 w-4" />
                        <span>Grant Final Clearance for Duty (Green Light Signoff)</span>
                      </button>
                      <p className="text-center text-[10px] text-slate-400 mt-2">
                        * Authorized by {currentUser.name} ({userRole}) for Registered Manager oversight.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Dossier Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 mt-4 shrink-0 text-xs">
              <span className="text-slate-400">
                Candidate ID: {liveCandidate.id} • Target: {liveCandidate.targetCompletionDate}
              </span>
              <button
                onClick={() => setSelectedCandidate(null)}
                className="rounded-xl bg-slate-100 dark:bg-slate-800 px-4 py-2 font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Enroll New Starter Modal */}
      {showEnrollModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-300">
                  <UserCheck className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Enroll New Care Employee
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Provisions standard Care Certificate curriculum & statutory compliance dossier
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowEnrollModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleEnrollSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Candidate Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Samuel Adebayo"
                    value={newStarterName}
                    onChange={(e) => setNewStarterName(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Job Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Healthcare Assistant"
                    value={newStarterJobTitle}
                    onChange={(e) => setNewStarterJobTitle(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Department
                  </label>
                  <select
                    value={newStarterDept}
                    onChange={(e) => setNewStarterDept(e.target.value as any)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="Care">Care</option>
                    <option value="Nursing">Nursing</option>
                    <option value="Housekeeping">Housekeeping</option>
                    <option value="Administration">Administration</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Role Tier
                  </label>
                  <select
                    value={newStarterRole}
                    onChange={(e) => setNewStarterRole(e.target.value as UserRole)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="Staff">Staff (Carer / HCA / Domestic)</option>
                    <option value="Senior">Senior (Senior Carer / Lead)</option>
                    <option value="HR">HR Coordinator</option>
                    <option value="Manager">Manager</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Work Email
                  </label>
                  <input
                    type="email"
                    placeholder="samuel.a@meadowbrook-care.org"
                    value={newStarterEmail}
                    onChange={(e) => setNewStarterEmail(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Mobile Phone
                  </label>
                  <input
                    type="text"
                    placeholder="+44 7700 900222"
                    value={newStarterPhone}
                    onChange={(e) => setNewStarterPhone(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Official Start Date
                  </label>
                  <input
                    type="date"
                    required
                    value={newStarterStartDate}
                    onChange={(e) => setNewStarterStartDate(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Target Completion Date
                  </label>
                  <input
                    type="date"
                    required
                    value={newStarterTargetDate}
                    onChange={(e) => setNewStarterTargetDate(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Assigned Senior Mentor
                </label>
                <select
                  value={newStarterMentor}
                  onChange={(e) => setNewStarterMentor(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  {staffList.map((s) => (
                    <option key={s.id} value={`${s.name} (${s.jobTitle})`}>
                      {s.name} ({s.role} - {s.jobTitle})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowEnrollModal(false)}
                  className="rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-teal-600 hover:bg-teal-700 px-4 py-1.5 text-xs font-bold text-white shadow-xs cursor-pointer"
                >
                  Enroll Candidate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
