import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  TenantOrganization,
  StaffMember,
  Shift,
  AttendanceRecord,
  IncidentReport,
  PolicyDocument,
  Announcement,
  VirtualRoom,
  ChatMessage,
  AuditLogEntry,
  UserRole,
  StaffPresenceStatus,
  SupportedLanguage,
  EmployeeOnboardingRecord,
  OnboardingDocumentStatus,
  TrainingModuleStatus,
  TimeOffRequest,
  TimeOffReason
} from '../types';
import {
  mockTenants,
  mockStaffMembers,
  mockVirtualRooms,
  mockShifts,
  mockAttendanceRecords,
  mockIncidents,
  mockPolicies,
  mockAnnouncements,
  mockChatMessages,
  mockAuditLogs,
  getTodayDateString,
  languageTranslations,
  mockTimeOffRequests
} from '../data/mockData';
import {
  mockOnboardingRecords,
  standardCareDocuments,
  standardCareTrainingModules
} from '../data/mockOnboardingData';

export interface ToastItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
}

interface AppContextType {
  // Tenant
  tenants: TenantOrganization[];
  activeTenant: TenantOrganization;
  setActiveTenantId: (tenantId: string) => void;

  // Current User & RBAC
  currentUser: StaffMember;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  staffList: StaffMember[];
  switchUser: (staffId: string) => void;
  updatePresence: (status: StaffPresenceStatus, note?: string) => void;
  joinRoom: (roomId: string) => void;
  updateStaff: (staffId: string, updates: Partial<StaffMember>) => void;

  // Virtual Rooms
  virtualRooms: VirtualRoom[];
  activeHuddleRoomId: string | null;
  toggleHuddle: (roomId: string) => void;
  addWhiteboardNote: (roomId: string, note: string) => void;

  // Rota Engine
  shifts: Shift[];
  addShift: (shift: Omit<Shift, 'id' | 'tenantId'>) => void;
  updateShift: (shiftId: string, updates: Partial<Shift>) => void;
  deleteShift: (shiftId: string) => void;
  claimOpenShift: (shiftId: string) => void;
  broadcastOpenShift: (shiftId: string) => void;
  autoGenerateRota: (startDate: string, options?: { balanceHours?: boolean; safeStaffingFloor?: boolean }) => { generatedCount: number; conflictsCount: number };
  safeStaffingAnalysis: {
    status: 'compliant' | 'shortage' | 'critical';
    totalShiftsToday: number;
    filledShiftsToday: number;
    seniorsOnDuty: number;
    carersOnDuty: number;
    recommendedMinimum: string;
  };

  // Attendance & Clocking
  attendanceRecords: AttendanceRecord[];
  isClockedIn: boolean;
  activeClockRecord: AttendanceRecord | null;
  clockIn: (coords?: { lat: number; lng: number }, ip?: string) => Promise<boolean>;
  clockOut: (notes?: string) => Promise<boolean>;
  approveAttendance: (recordId: string) => void;

  // HR & Compliance
  incidents: IncidentReport[];
  logIncident: (incident: Omit<IncidentReport, 'id' | 'referenceNumber' | 'tenantId' | 'createdAt'>) => void;
  updateIncidentStatus: (incidentId: string, status: IncidentReport['status'], investigationNotes?: string) => void;
  policies: PolicyDocument[];
  acknowledgePolicy: (policyId: string) => void;
  onboardingRecords: EmployeeOnboardingRecord[];
  updateOnboardingDocumentStatus: (candidateId: string, docId: string, newStatus: OnboardingDocumentStatus, notes?: string) => void;
  updateOnboardingTrainingStatus: (candidateId: string, moduleId: string, newStatus: TrainingModuleStatus, score?: number) => void;
  enrollNewStarter: (candidate: {
    employeeName: string;
    employeeRole: UserRole;
    jobTitle: string;
    department: 'Nursing' | 'Care' | 'Administration' | 'Management' | 'Housekeeping';
    email: string;
    phone: string;
    startDate: string;
    targetCompletionDate: string;
    mentorName: string;
    notes?: string;
  }) => void;
  signoffOnboardingClearance: (candidateId: string) => void;
  logShadowShift: (candidateId: string) => void;
  toggleInductionStep: (candidateId: string, step: 'inductionTour' | 'uniformBadge') => void;
  bulkVerifyDocuments: (candidateId: string) => void;
  bulkCompleteTraining: (candidateId: string) => void;

  // Time Off & Absence Requests
  timeOffRequests: TimeOffRequest[];
  requestTimeOff: (requestData: {
    staffId: string;
    startDate: string;
    endDate: string;
    reason: TimeOffReason;
    notes: string;
    emergencyCoverNotes?: string;
    attachmentName?: string;
  }) => void;
  reviewTimeOffRequest: (requestId: string, status: 'approved' | 'rejected', reviewNotes?: string) => void;
  deleteTimeOffRequest: (requestId: string) => void;

  // Comms
  announcements: Announcement[];
  addAnnouncement: (announcement: Omit<Announcement, 'id' | 'tenantId' | 'createdAt' | 'acknowledgedCount'>) => void;
  acknowledgeAnnouncement: (announcementId: string) => void;
  chatMessages: ChatMessage[];
  sendChatMessage: (channel: string, text: string, isUrgent?: boolean) => void;

  // Audit Logs & Security
  auditLogs: AuditLogEntry[];
  logAudit: (action: string, resource: string, details: string, severity?: AuditLogEntry['severity']) => void;
  biometricsEnabled: boolean;
  setBiometricsEnabled: (enabled: boolean) => void;
  mfaEnabled: boolean;
  setMfaEnabled: (enabled: boolean) => void;
  offlineMode: boolean;
  toggleOfflineMode: () => void;
  syncQueue: number;

  // Preferences & Localization
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string) => string;
  darkMode: boolean;
  toggleDarkMode: () => void;

  // Toasts
  toasts: ToastItem[];
  addToast: (title: string, message: string, type?: ToastItem['type']) => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // 1. Tenants
  const [tenants] = useState<TenantOrganization[]>(mockTenants);
  const [activeTenantId, setActiveTenantIdState] = useState<string>('org-meadowbrook');

  const activeTenant = tenants.find((t) => t.id === activeTenantId) || tenants[0];

  // 2. Staff & Current User
  const [staffList, setStaffList] = useState<StaffMember[]>(mockStaffMembers);
  const [currentUserId, setCurrentUserId] = useState<string>('staff-1'); // Default Elena Vance (Admin)

  const currentUser = staffList.find((s) => s.id === currentUserId) || staffList[0];
  const [userRole, setUserRoleState] = useState<UserRole>(currentUser.role);

  // Sync role when user changes
  const switchUser = (staffId: string) => {
    const found = staffList.find((s) => s.id === staffId);
    if (found) {
      setCurrentUserId(staffId);
      setUserRoleState(found.role);
      addToast('User Switched', `Logged in as ${found.name} (${found.jobTitle})`, 'info');
    }
  };

  const setUserRole = (newRole: UserRole) => {
    setUserRoleState(newRole);
    logAudit('RBAC_ROLE_CHANGE', 'Current Session', `User ${currentUser.name} simulated role switch to ${newRole}`, 'info');
    addToast('Role Switched', `Active view updated to ${newRole} access level`, 'info');
  };

  // 3. Virtual Rooms
  const [virtualRooms, setVirtualRooms] = useState<VirtualRoom[]>(mockVirtualRooms);
  const [activeHuddleRoomId, setActiveHuddleRoomId] = useState<string | null>('room-managers');

  const toggleHuddle = (roomId: string) => {
    setVirtualRooms((prev) =>
      prev.map((r) => (r.id === roomId ? { ...r, activeHuddle: !r.activeHuddle } : r))
    );
    setActiveHuddleRoomId((prev) => (prev === roomId ? null : roomId));
    addToast('Huddle Status Changed', `Audio/Video intercom updated for room`, 'info');
  };

  const addWhiteboardNote = (roomId: string, note: string) => {
    if (!note.trim()) return;
    setVirtualRooms((prev) =>
      prev.map((r) => (r.id === roomId ? { ...r, whiteboardNotes: [note.trim(), ...r.whiteboardNotes] } : r))
    );
    addToast('Whiteboard Updated', 'New note posted on room digital board', 'success');
  };

  const joinRoom = (roomId: string) => {
    setVirtualRooms((prev) =>
      prev.map((room) => {
        const withoutCurrent = room.occupants.filter((id) => id !== currentUser.id);
        if (room.id === roomId) {
          return { ...room, occupants: [...withoutCurrent, currentUser.id] };
        }
        return { ...room, occupants: withoutCurrent };
      })
    );
    setStaffList((prev) =>
      prev.map((s) => (s.id === currentUser.id ? { ...s, currentRoomId: roomId } : s))
    );
    const targetRoom = virtualRooms.find((r) => r.id === roomId);
    addToast('Entered Virtual Room', `Moved to ${targetRoom?.name || 'new room'}`, 'info');
  };

  const updatePresence = (status: StaffPresenceStatus, note?: string) => {
    setStaffList((prev) =>
      prev.map((s) =>
        s.id === currentUser.id
          ? { ...s, presenceStatus: status, statusNote: note !== undefined ? note : s.statusNote }
          : s
      )
    );
    addToast('Status Updated', `Presence set to ${status.replace('_', ' ').toUpperCase()}`, 'info');
  };

  const updateStaff = (staffId: string, updates: Partial<StaffMember>) => {
    setStaffList((prev) => prev.map((s) => (s.id === staffId ? { ...s, ...updates } : s)));
    logAudit('STAFF_PROFILE_UPDATE', `Staff ID: ${staffId}`, 'Profile and certification data amended', 'info');
    addToast('Staff Updated', 'Changes saved successfully', 'success');
  };

  // 4. Shifts & Smart Rota Engine
  const [shifts, setShifts] = useState<Shift[]>(mockShifts);

  const isManagerOrAdminRole = () => {
    return userRole === 'Admin' || userRole === 'Manager';
  };

  const addShift = (shiftData: Omit<Shift, 'id' | 'tenantId'>) => {
    if (!isManagerOrAdminRole()) {
      addToast('Permission Denied', 'Staff roles are restricted to viewing only. Only Managers & Admins have scheduling rights to add shifts.', 'error');
      return;
    }
    const newShift: Shift = {
      ...shiftData,
      id: `shift-${Date.now()}`,
      tenantId: activeTenant.id
    };
    setShifts((prev) => [...prev, newShift]);
    logAudit('SHIFT_CREATED', `Shift: ${newShift.shiftTitle}`, `Created for ${newShift.date} in ${newShift.unitOrWing}`, 'info');
    addToast('Shift Created', `${newShift.shiftTitle} scheduled for ${newShift.date}`, 'success');
  };

  const updateShift = (shiftId: string, updates: Partial<Shift>) => {
    if (!isManagerOrAdminRole()) {
      addToast('Permission Denied', 'Staff roles are restricted to viewing only. Only Managers & Admins have permission to edit rota shifts.', 'error');
      return;
    }
    setShifts((prev) => prev.map((s) => (s.id === shiftId ? { ...s, ...updates } : s)));
    logAudit('SHIFT_UPDATED', `Shift ID: ${shiftId}`, 'Shift parameters or staff allocation updated', 'info');
    addToast('Shift Updated', 'Rota changes successfully saved', 'info');
  };

  const deleteShift = (shiftId: string) => {
    if (!isManagerOrAdminRole()) {
      addToast('Permission Denied', 'Staff roles are restricted to viewing only. Only Managers & Admins can delete shifts.', 'error');
      return;
    }
    setShifts((prev) => prev.filter((s) => s.id !== shiftId));
    logAudit('SHIFT_DELETED', `Shift ID: ${shiftId}`, 'Shift removed from rota', 'warning');
    addToast('Shift Removed', 'Shift removed from rota', 'warning');
  };

  const claimOpenShift = (shiftId: string) => {
    if (!isManagerOrAdminRole()) {
      addToast('Permission Denied', 'Staff roles are restricted to viewing only. Only Managers and Admins can assign or alter rota shifts.', 'error');
      return;
    }
    setShifts((prev) =>
      prev.map((s) => {
        if (s.id === shiftId) {
          return {
            ...s,
            status: 'assigned',
            assignedStaffId: currentUser.id,
            assignedStaffName: currentUser.name,
            assignedStaffRole: currentUser.role,
            isOpenBroadcast: false
          };
        }
        return s;
      })
    );
    logAudit('SHIFT_CLAIMED', `Shift ID: ${shiftId}`, `${currentUser.name} allocated open shift`, 'info');
    addToast('Shift Assigned', `Shift allocated to ${currentUser.name}. Added to schedule.`, 'success');
  };

  const broadcastOpenShift = (shiftId: string) => {
    if (!isManagerOrAdminRole()) {
      addToast('Permission Denied', 'Staff roles cannot broadcast shifts. Only Managers & Admins have broadcast permissions.', 'error');
      return;
    }
    setShifts((prev) =>
      prev.map((s) => (s.id === shiftId ? { ...s, isOpenBroadcast: true, status: 'open' } : s))
    );
    // Also post to urgent channel
    sendChatMessage('#urgent-coverage', `🚨 Open Shift Broadcast: Urgent cover needed for shift on ${getTodayDateString(0)}! 1.25x enhanced weekend/urgent rate applies. Claim in Smart Rota.`, true);
    addToast('Shift Broadcasted', 'Instant push notification dispatched to eligible available carers', 'warning');
  };

  const autoGenerateRota = (startDate: string, options = { balanceHours: true, safeStaffingFloor: true }) => {
    if (!isManagerOrAdminRole()) {
      addToast('Permission Denied', 'Staff roles are restricted to viewing only. Automated rota generation requires Manager or Admin authorization.', 'error');
      return { generatedCount: 0, conflictsCount: 0 };
    }
    const carers = staffList.filter((s) => s.role === 'Staff');
    const seniors = staffList.filter((s) => s.role === 'Senior' || s.role === 'Manager');
    let generatedCount = 0;
    let conflictsCount = 0;

    const newShifts: Shift[] = [];
    // Generate for 7 days
    for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
      const targetDate = getTodayDateString(dayOffset);

      // Morning Lead (Senior)
      const seniorCandidate = seniors[dayOffset % seniors.length];
      newShifts.push({
        id: `gen-m-lead-${dayOffset}-${Date.now()}`,
        tenantId: activeTenant.id,
        date: targetDate,
        shiftTypeId: 'shift-morning',
        shiftTitle: 'Morning Senior Lead',
        startTime: '07:00',
        endTime: '15:00',
        unitOrWing: 'Unit A - Dementia Haven',
        assignedStaffId: seniorCandidate.id,
        assignedStaffName: seniorCandidate.name,
        assignedStaffRole: seniorCandidate.role,
        status: 'assigned',
        requiresMedCert: true
      });
      generatedCount++;

      // Morning Carers (2 Carers)
      for (let c = 0; c < 2; c++) {
        const carerCandidate = carers[(dayOffset * 2 + c) % carers.length];
        newShifts.push({
          id: `gen-m-carer-${dayOffset}-${c}-${Date.now()}`,
          tenantId: activeTenant.id,
          date: targetDate,
          shiftTypeId: 'shift-morning',
          shiftTitle: `Morning Carer #${c + 1}`,
          startTime: '07:00',
          endTime: '15:00',
          unitOrWing: c === 0 ? 'Unit A - Dementia Haven' : 'Unit B - Residential Wing',
          assignedStaffId: carerCandidate.id,
          assignedStaffName: carerCandidate.name,
          assignedStaffRole: carerCandidate.role,
          status: 'assigned',
          requiresMedCert: false
        });
        generatedCount++;
      }

      // Afternoon Shift
      const pmSenior = seniors[(dayOffset + 1) % seniors.length];
      newShifts.push({
        id: `gen-pm-lead-${dayOffset}-${Date.now()}`,
        tenantId: activeTenant.id,
        date: targetDate,
        shiftTypeId: 'shift-afternoon',
        shiftTitle: 'Afternoon Senior Lead',
        startTime: '14:30',
        endTime: '22:00',
        unitOrWing: 'Facility Wide',
        assignedStaffId: pmSenior.id,
        assignedStaffName: pmSenior.name,
        assignedStaffRole: pmSenior.role,
        status: 'assigned',
        requiresMedCert: true
      });
      generatedCount++;

      // Afternoon Carer
      const pmCarer = carers[(dayOffset * 2 + 1) % carers.length];
      newShifts.push({
        id: `gen-pm-carer-${dayOffset}-${Date.now()}`,
        tenantId: activeTenant.id,
        date: targetDate,
        shiftTypeId: 'shift-afternoon',
        shiftTitle: 'Afternoon Carer',
        startTime: '14:30',
        endTime: '22:00',
        unitOrWing: 'Unit A - Dementia Haven',
        assignedStaffId: pmCarer.id,
        assignedStaffName: pmCarer.name,
        assignedStaffRole: pmCarer.role,
        status: 'assigned'
      });
      generatedCount++;

      // Waking Night Shift
      const nightStaff = staffList.find((s) => s.name.includes('Liam')) || carers[0];
      newShifts.push({
        id: `gen-night-${dayOffset}-${Date.now()}`,
        tenantId: activeTenant.id,
        date: targetDate,
        shiftTypeId: 'shift-night',
        shiftTitle: 'Waking Night Support',
        startTime: '21:45',
        endTime: '07:15',
        unitOrWing: 'All Wings (Night Cover)',
        assignedStaffId: nightStaff.id,
        assignedStaffName: nightStaff.name,
        assignedStaffRole: nightStaff.role,
        status: 'assigned',
        requiresMedCert: true
      });
      generatedCount++;
    }

    setShifts((prev) => {
      // Keep existing today's shifts, append or replace week
      const existingToday = prev.filter((s) => s.date === getTodayDateString(0));
      const futureNew = newShifts.filter((s) => s.date !== getTodayDateString(0));
      return [...existingToday, ...futureNew];
    });

    logAudit('ROTA_AUTO_GENERATION', 'Rota Engine', `Algorithmic auto-scheduler compiled 7-day rota matrix with ${generatedCount} shifts`, 'info');
    addToast('Rota Generated', `Compiled ${generatedCount} shifts across 7 days. Safe staffing ratios enforced.`, 'success');
    return { generatedCount, conflictsCount };
  };

  // Safe staffing calculation for today
  const todayStr = getTodayDateString(0);
  const todayShifts = shifts.filter((s) => s.date === todayStr);
  const filledToday = todayShifts.filter((s) => !!s.assignedStaffId);
  const seniorsOnDuty = filledToday.filter((s) => s.assignedStaffRole === 'Senior' || s.assignedStaffRole === 'Manager').length;
  const carersOnDuty = filledToday.filter((s) => s.assignedStaffRole === 'Staff').length;

  const safeStaffingAnalysis = {
    status: todayShifts.some((s) => s.status === 'open') ? ('shortage' as const) : ('compliant' as const),
    totalShiftsToday: todayShifts.length,
    filledShiftsToday: filledToday.length,
    seniorsOnDuty,
    carersOnDuty,
    recommendedMinimum: '1 Senior + 3 Carers per active wing'
  };

  // 5. Attendance & Clocking
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(mockAttendanceRecords);

  const activeClockRecord = attendanceRecords.find(
    (a) => a.staffId === currentUser.id && a.date === todayStr && !a.clockOutTime
  ) || null;
  const isClockedIn = !!activeClockRecord;

  const clockIn = async (coords?: { lat: number; lng: number }, ip = '192.168.10.42 (Site Wi-Fi)') => {
    const now = new Date();
    const clockTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const lat = coords?.lat || activeTenant.coordinates.lat + 0.0001;
    const lng = coords?.lng || activeTenant.coordinates.lng + 0.0001;

    // Calculate simulated distance in meters
    const dist = Math.floor(Math.random() * 35) + 8; // 8-43 meters
    const isValidGps = dist <= activeTenant.geofenceRadiusMeters;

    const newRecord: AttendanceRecord = {
      id: `att-${Date.now()}`,
      tenantId: activeTenant.id,
      staffId: currentUser.id,
      staffName: currentUser.name,
      staffRole: currentUser.role,
      date: todayStr,
      clockInTime: clockTime,
      scheduledStart: '07:00',
      scheduledEnd: '15:00',
      gpsCoordinates: { lat, lng },
      gpsValidated: isValidGps,
      distanceFromSiteMeters: dist,
      ipAddress: ip,
      status: 'active_now',
      varianceMinutes: 0
    };

    setAttendanceRecords((prev) => [newRecord, ...prev]);
    updatePresence('on_rounds', 'Shift active on care floor');
    logAudit('ATTENDANCE_CLOCK_IN', `Staff: ${currentUser.name}`, `Clock-in validated via Geofence GPS (${dist}m) & Care Wi-Fi`, 'info');
    addToast('Clocked In Successfully', `Recorded at ${clockTime}. GPS Geofence verified (${dist}m from site).`, 'success');
    return true;
  };

  const clockOut = async (notes = 'Shift completed without incidents') => {
    const now = new Date();
    const clockTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    setAttendanceRecords((prev) =>
      prev.map((rec) => {
        if (rec.staffId === currentUser.id && rec.date === todayStr && !rec.clockOutTime) {
          return {
            ...rec,
            clockOutTime: clockTime,
            status: 'pending_approval',
            managerNotes: notes
          };
        }
        return rec;
      })
    );

    updatePresence('off_duty', 'Signed off shift');
    logAudit('ATTENDANCE_CLOCK_OUT', `Staff: ${currentUser.name}`, `Clock-out recorded at ${clockTime}. Timesheet submitted for manager review.`, 'info');
    addToast('Clocked Out', `Shift signed off at ${clockTime}. Timesheet sent for manager sign-off.`, 'info');
    return true;
  };

  const approveAttendance = (recordId: string) => {
    setAttendanceRecords((prev) =>
      prev.map((r) => (r.id === recordId ? { ...r, status: 'approved', approvedBy: currentUser.name } : r))
    );
    logAudit('TIMESHEET_APPROVED', `Timesheet: ${recordId}`, `Approved by manager ${currentUser.name}`, 'info');
    addToast('Timesheet Approved', 'Record verified and exported to payroll register', 'success');
  };

  // 6. HR & Incidents
  const [incidents, setIncidents] = useState<IncidentReport[]>(mockIncidents);
  const [policies, setPolicies] = useState<PolicyDocument[]>(mockPolicies);

  const logIncident = (incidentData: Omit<IncidentReport, 'id' | 'referenceNumber' | 'tenantId' | 'createdAt'>) => {
    const refNum = `INC-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const newInc: IncidentReport = {
      ...incidentData,
      id: `inc-${Date.now()}`,
      referenceNumber: refNum,
      tenantId: activeTenant.id,
      createdAt: new Date().toISOString()
    };
    setIncidents((prev) => [newInc, ...prev]);
    logAudit(
      'INCIDENT_LOGGED',
      `Incident ${refNum}`,
      `Category: ${newInc.category}, Severity: ${newInc.severity}, Resident: ${newInc.clientOrResidentName}. Logged by ${newInc.reportedByStaffName}`,
      newInc.severity === 'Critical' || newInc.severity === 'High' ? 'critical' : 'warning'
    );
    addToast(
      'Incident Logged',
      `${refNum} saved. Manager and Safeguarding lead notified immediately.`,
      newInc.severity === 'Critical' ? 'error' : 'warning'
    );
  };

  const updateIncidentStatus = (incidentId: string, status: IncidentReport['status'], investigationNotes?: string) => {
    setIncidents((prev) =>
      prev.map((inc) =>
        inc.id === incidentId
          ? {
              ...inc,
              status,
              investigatingManager: currentUser.name,
              immediateActionsTaken: investigationNotes
                ? `${inc.immediateActionsTaken}\n[Update]: ${investigationNotes}`
                : inc.immediateActionsTaken
            }
          : inc
      )
    );
    logAudit('INCIDENT_STATUS_CHANGE', `Incident ID: ${incidentId}`, `Status updated to ${status} by ${currentUser.name}`, 'info');
    addToast('Incident Updated', `Status changed to ${status}`, 'info');
  };

  const acknowledgePolicy = (policyId: string) => {
    setPolicies((prev) =>
      prev.map((p) => (p.id === policyId ? { ...p, acknowledgedStaffCount: p.acknowledgedStaffCount + 1 } : p))
    );
    logAudit('POLICY_ACKNOWLEDGED', `Policy ID: ${policyId}`, `${currentUser.name} signed digital compliance acknowledgement`, 'info');
    addToast('Policy Signed', 'Your digital acknowledgement has been recorded in your personnel file', 'success');
  };

  // 6b. Employee Onboarding & Compliance Sub-Module
  const [onboardingRecords, setOnboardingRecords] = useState<EmployeeOnboardingRecord[]>(mockOnboardingRecords);

  const recalculateRecord = (record: EmployeeOnboardingRecord): EmployeeOnboardingRecord => {
    const totalDocs = record.documents.length || 1;
    const verifiedDocs = record.documents.filter((d) => d.status === 'verified').length;
    const docScore = (verifiedDocs / totalDocs) * 45;

    const totalTraining = record.trainingModules.length || 1;
    const completedTraining = record.trainingModules.filter((t) => t.status === 'completed').length;
    const trainingScore = (completedTraining / totalTraining) * 40;

    const totalShadow = record.shadowShiftsRequired || 3;
    const completedShadow = Math.min(record.shadowShiftsCompleted, totalShadow);
    const shadowScore = (completedShadow / totalShadow) * 15;

    const progress = Math.min(100, Math.round(docScore + trainingScore + shadowScore));

    let status = record.status;
    if (record.cqcRegistrationSignoff && progress === 100) {
      status = 'completed';
    } else if (verifiedDocs === totalDocs && completedTraining >= totalTraining - 1 && record.shadowShiftsCompleted >= record.shadowShiftsRequired) {
      status = 'ready_for_duty';
    } else if (record.documents.some((d) => d.status === 'rejected')) {
      status = 'action_required';
    } else if (record.status !== 'completed') {
      status = 'in_progress';
    }

    return {
      ...record,
      progressPercent: progress,
      status
    };
  };

  const updateOnboardingDocumentStatus = (
    candidateId: string,
    docId: string,
    newStatus: OnboardingDocumentStatus,
    notes?: string
  ) => {
    setOnboardingRecords((prev) =>
      prev.map((record) => {
        if (record.id !== candidateId) return record;

        const updatedDocs = record.documents.map((doc) => {
          if (doc.id !== docId) return doc;
          return {
            ...doc,
            status: newStatus,
            verifiedDate: newStatus === 'verified' ? getTodayDateString(0) : doc.verifiedDate,
            verifiedBy: newStatus === 'verified' ? currentUser.name : doc.verifiedBy,
            notes: notes !== undefined ? notes : doc.notes
          };
        });

        const updatedRecord = recalculateRecord({ ...record, documents: updatedDocs });
        logAudit(
          'ONBOARDING_DOC_STATUS_CHANGE',
          `${record.employeeName} - ${docId}`,
          `Document status set to ${newStatus} by ${currentUser.name}`,
          newStatus === 'rejected' ? 'warning' : 'info'
        );
        addToast(
          'Document Updated',
          `${record.employeeName}: Document marked as ${newStatus.toUpperCase()}`,
          newStatus === 'verified' ? 'success' : newStatus === 'rejected' ? 'error' : 'info'
        );
        return updatedRecord;
      })
    );
  };

  const updateOnboardingTrainingStatus = (
    candidateId: string,
    moduleId: string,
    newStatus: TrainingModuleStatus,
    score?: number
  ) => {
    setOnboardingRecords((prev) =>
      prev.map((record) => {
        if (record.id !== candidateId) return record;

        const updatedTraining = record.trainingModules.map((mod) => {
          if (mod.id !== moduleId) return mod;
          return {
            ...mod,
            status: newStatus,
            completedDate: newStatus === 'completed' ? getTodayDateString(0) : mod.completedDate,
            score: score !== undefined ? score : newStatus === 'completed' ? 100 : mod.score,
            certifiedBy: newStatus === 'completed' ? currentUser.name : mod.certifiedBy
          };
        });

        const updatedRecord = recalculateRecord({ ...record, trainingModules: updatedTraining });
        logAudit(
          'ONBOARDING_TRAINING_UPDATE',
          `${record.employeeName} - ${moduleId}`,
          `Training status updated to ${newStatus}`,
          'info'
        );
        addToast(
          'Training Progress Logged',
          `${record.employeeName}: Course marked as ${newStatus.replace('_', ' ').toUpperCase()}`,
          'success'
        );
        return updatedRecord;
      })
    );
  };

  const enrollNewStarter = (candidate: {
    employeeName: string;
    employeeRole: UserRole;
    jobTitle: string;
    department: 'Nursing' | 'Care' | 'Administration' | 'Management' | 'Housekeeping';
    email: string;
    phone: string;
    startDate: string;
    targetCompletionDate: string;
    mentorName: string;
    notes?: string;
  }) => {
    const newId = `onb-${Date.now()}`;
    const initialDocs = standardCareDocuments.map((doc, idx) => ({
      ...doc,
      id: `doc-${newId}-${idx + 1}`,
      status: 'pending' as OnboardingDocumentStatus
    }));

    const initialTraining = standardCareTrainingModules.map((trn, idx) => ({
      ...trn,
      id: `trn-${newId}-${idx + 1}`,
      status: 'not_started' as TrainingModuleStatus
    }));

    const newRecord: EmployeeOnboardingRecord = {
      id: newId,
      staffId: `staff-gen-${Date.now()}`,
      employeeName: candidate.employeeName,
      employeeRole: candidate.employeeRole,
      jobTitle: candidate.jobTitle,
      department: candidate.department,
      avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
      email: candidate.email,
      phone: candidate.phone,
      startDate: candidate.startDate,
      targetCompletionDate: candidate.targetCompletionDate,
      mentorName: candidate.mentorName,
      status: 'in_progress',
      progressPercent: 0,
      documents: initialDocs,
      trainingModules: initialTraining,
      shadowShiftsCompleted: 0,
      shadowShiftsRequired: 3,
      inductionTourCompleted: false,
      uniformAndBadgeIssued: false,
      cqcRegistrationSignoff: false,
      notes: candidate.notes || 'Newly enrolled starter. Pre-employment checks initiated.'
    };

    setOnboardingRecords((prev) => [newRecord, ...prev]);
    logAudit('NEW_STARTER_ENROLLED', newRecord.employeeName, `Enrolled into CQC Onboarding Track by ${currentUser.name}`, 'info');
    addToast('Candidate Enrolled', `${candidate.employeeName} added to HR onboarding pipeline`, 'success');
  };

  const signoffOnboardingClearance = (candidateId: string) => {
    setOnboardingRecords((prev) =>
      prev.map((record) => {
        if (record.id !== candidateId) return record;

        // Also update staff member in staffList if matching
        if (record.staffId) {
          setStaffList((staffPrev) =>
            staffPrev.map((s) =>
              s.id === record.staffId
                ? {
                    ...s,
                    rightToWorkStatus: 'verified',
                    mandatoryTrainingStatus: 'compliant',
                    dbsStatus: 'valid'
                  }
                : s
            )
          );
        }

        logAudit(
          'ONBOARDING_FINAL_SIGNOFF',
          record.employeeName,
          `Regulation 19 Fit & Proper Person signoff granted by ${currentUser.name}`,
          'security'
        );
        addToast(
          'Cleared for Duty!',
          `${record.employeeName} has completed onboarding and is authorized for active rota assignment.`,
          'success'
        );

        return {
          ...record,
          status: 'completed',
          progressPercent: 100,
          cqcRegistrationSignoff: true
        };
      })
    );
  };

  const logShadowShift = (candidateId: string) => {
    setOnboardingRecords((prev) =>
      prev.map((record) => {
        if (record.id !== candidateId) return record;
        const nextCount = Math.min(record.shadowShiftsRequired + 1, record.shadowShiftsCompleted + 1);
        const updated = recalculateRecord({ ...record, shadowShiftsCompleted: nextCount });
        addToast('Shadow Shift Logged', `${record.employeeName}: ${nextCount}/${record.shadowShiftsRequired} completed`, 'info');
        return updated;
      })
    );
  };

  const toggleInductionStep = (candidateId: string, step: 'inductionTour' | 'uniformBadge') => {
    setOnboardingRecords((prev) =>
      prev.map((record) => {
        if (record.id !== candidateId) return record;
        const updated = {
          ...record,
          inductionTourCompleted: step === 'inductionTour' ? !record.inductionTourCompleted : record.inductionTourCompleted,
          uniformAndBadgeIssued: step === 'uniformBadge' ? !record.uniformAndBadgeIssued : record.uniformAndBadgeIssued
        };
        addToast('Induction Step Updated', 'Checklist amended successfully', 'info');
        return updated;
      })
    );
  };

  const bulkVerifyDocuments = (candidateId: string) => {
    setOnboardingRecords((prev) =>
      prev.map((record) => {
        if (record.id !== candidateId) return record;
        const verifiedDocs = record.documents.map((d) => ({
          ...d,
          status: 'verified' as OnboardingDocumentStatus,
          verifiedDate: getTodayDateString(0),
          verifiedBy: currentUser.name
        }));
        const updated = recalculateRecord({ ...record, documents: verifiedDocs });
        logAudit('BULK_DOCS_VERIFIED', record.employeeName, `All compliance documents verified by ${currentUser.name}`, 'info');
        addToast('All Documents Verified', `${record.employeeName}: All compliance files cleared`, 'success');
        return updated;
      })
    );
  };

  const bulkCompleteTraining = (candidateId: string) => {
    setOnboardingRecords((prev) =>
      prev.map((record) => {
        if (record.id !== candidateId) return record;
        const completedMods = record.trainingModules.map((t) => ({
          ...t,
          status: 'completed' as TrainingModuleStatus,
          completedDate: getTodayDateString(0),
          score: t.score || 100,
          certifiedBy: currentUser.name
        }));
        const updated = recalculateRecord({ ...record, trainingModules: completedMods });
        logAudit('BULK_TRAINING_PASSED', record.employeeName, `All mandatory care modules certified by ${currentUser.name}`, 'info');
        addToast('Training Certified', `${record.employeeName}: All mandatory modules marked completed`, 'success');
        return updated;
      })
    );
  };

  // 6b. Time Off & Absence Management
  const [timeOffRequests, setTimeOffRequests] = useState<TimeOffRequest[]>(mockTimeOffRequests);

  const requestTimeOff = (requestData: {
    staffId: string;
    startDate: string;
    endDate: string;
    reason: TimeOffReason;
    notes: string;
    emergencyCoverNotes?: string;
    attachmentName?: string;
  }) => {
    const staff = staffList.find((s) => s.id === requestData.staffId) || currentUser;
    const start = new Date(requestData.startDate);
    const end = new Date(requestData.endDate);
    const diffTime = Math.max(0, end.getTime() - start.getTime());
    const totalDays = Math.max(1, Math.round(diffTime / (1000 * 60 * 60 * 24)) + 1);

    const newRequest: TimeOffRequest = {
      id: `leave-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      staffId: staff.id,
      staffName: staff.name,
      staffRole: staff.role,
      staffAvatar: staff.avatar,
      department: staff.department,
      startDate: requestData.startDate,
      endDate: requestData.endDate,
      totalDays,
      reason: requestData.reason,
      notes: requestData.notes,
      emergencyCoverNotes: requestData.emergencyCoverNotes,
      status: 'pending',
      requestedAt: new Date().toISOString(),
      attachmentName: requestData.attachmentName,
      tenantId: activeTenant.id
    };

    setTimeOffRequests((prev) => [newRequest, ...prev]);

    // Check if staff has shifts during requested absence dates to update Rota engine with pending absence flag
    const overlappingShifts = shifts.filter(
      (s) => s.assignedStaffId === staff.id && s.date >= requestData.startDate && s.date <= requestData.endDate
    );

    if (overlappingShifts.length > 0) {
      setShifts((prev) =>
        prev.map((s) => {
          if (s.assignedStaffId === staff.id && s.date >= requestData.startDate && s.date <= requestData.endDate) {
            const conflictNotice = `Pending Absence: ${staff.name} requested ${requestData.reason} (${requestData.startDate} to ${requestData.endDate})`;
            const existingConflicts = s.conflicts || [];
            if (!existingConflicts.includes(conflictNotice)) {
              return {
                ...s,
                conflicts: [...existingConflicts, conflictNotice]
              };
            }
          }
          return s;
        })
      );
    }

    logAudit(
      'TIME_OFF_REQUESTED',
      `Leave for ${staff.name}`,
      `${requestData.reason} from ${requestData.startDate} to ${requestData.endDate} (${totalDays} days). ${overlappingShifts.length} shift(s) flagged on Rota.`,
      'info'
    );

    addToast(
      'Time Off Requested',
      `Submitted ${requestData.reason} for ${staff.name}. Rota engine updated with pending absences.`,
      'success'
    );
  };

  const reviewTimeOffRequest = (requestId: string, status: 'approved' | 'rejected', reviewNotes?: string) => {
    if (userRole !== 'Admin' && userRole !== 'Manager' && userRole !== 'HR') {
      addToast('Permission Denied', 'Only Managers or HR administrators can approve or reject time off requests.', 'error');
      return;
    }

    const req = timeOffRequests.find((r) => r.id === requestId);
    if (!req) return;

    setTimeOffRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? {
              ...r,
              status,
              reviewedBy: `${currentUser.name} (${userRole})`,
              reviewedAt: new Date().toISOString(),
              reviewNotes
            }
          : r
      )
    );

    if (status === 'approved') {
      // If approved, mark overlapping shifts as open cover so other carers can claim or managers reassign
      setShifts((prev) =>
        prev.map((s) => {
          if (s.assignedStaffId === req.staffId && s.date >= req.startDate && s.date <= req.endDate) {
            return {
              ...s,
              status: 'open',
              isOpenBroadcast: true,
              notes: `${s.notes ? s.notes + ' • ' : ''}Unfilled: ${req.staffName} on Approved Leave (${req.reason})`,
              conflicts: [`Approved Leave: ${req.staffName} is absent. Cover required.`]
            };
          }
          return s;
        })
      );
    } else if (status === 'rejected') {
      // If rejected, clear pending absence conflict notices from shifts
      setShifts((prev) =>
        prev.map((s) => {
          if (s.assignedStaffId === req.staffId && s.date >= req.startDate && s.date <= req.endDate) {
            return {
              ...s,
              conflicts: (s.conflicts || []).filter((c) => !c.includes('Pending Absence'))
            };
          }
          return s;
        })
      );
    }

    logAudit(
      status === 'approved' ? 'TIME_OFF_APPROVED' : 'TIME_OFF_REJECTED',
      `Leave for ${req.staffName}`,
      `Marked as ${status} by ${currentUser.name}. ${reviewNotes || ''}`,
      status === 'approved' ? 'info' : 'warning'
    );

    addToast(
      `Leave Request ${status === 'approved' ? 'Approved' : 'Rejected'}`,
      `${req.staffName}'s ${req.reason} has been ${status}. Rota engine updated.`,
      status === 'approved' ? 'success' : 'info'
    );
  };

  const deleteTimeOffRequest = (requestId: string) => {
    setTimeOffRequests((prev) => prev.filter((r) => r.id !== requestId));
    addToast('Request Removed', 'Time off record deleted.', 'info');
  };

  // 7. Announcements & Chat
  const [announcements, setAnnouncements] = useState<Announcement[]>(mockAnnouncements);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(mockChatMessages);

  const addAnnouncement = (annData: Omit<Announcement, 'id' | 'tenantId' | 'createdAt' | 'acknowledgedCount'>) => {
    const newAnn: Announcement = {
      ...annData,
      id: `ann-${Date.now()}`,
      tenantId: activeTenant.id,
      createdAt: 'Just now',
      acknowledgedCount: 1
    };
    setAnnouncements((prev) => [newAnn, ...prev]);
    logAudit('ANNOUNCEMENT_POSTED', `Title: ${newAnn.title}`, `Priority: ${newAnn.priority}`, 'info');
    addToast('Announcement Broadcasted', 'Notification sent to all active team members', 'info');
  };

  const acknowledgeAnnouncement = (annId: string) => {
    setAnnouncements((prev) =>
      prev.map((a) => (a.id === annId ? { ...a, acknowledgedCount: a.acknowledgedCount + 1 } : a))
    );
    addToast('Acknowledged', 'Read receipt confirmed', 'info');
  };

  const sendChatMessage = (channel: string, text: string, isUrgent = false) => {
    if (!text.trim()) return;
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      tenantId: activeTenant.id,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: currentUser.role,
      senderAvatar: currentUser.avatar,
      channel,
      text: text.trim(),
      timestamp: timeStr,
      isUrgent
    };
    setChatMessages((prev) => [...prev, newMsg]);
    if (isUrgent) {
      logAudit('URGENT_MESSAGE_DISPATCH', channel, `Urgent broadcast sent by ${currentUser.name}: "${text.slice(0, 40)}..."`, 'warning');
      addToast('Urgent Broadcast Sent', 'Audio chime and priority notification delivered to care staff', 'warning');
    }
  };

  // 8. Audit Logs & Security
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(mockAuditLogs);
  const [biometricsEnabled, setBiometricsEnabled] = useState<boolean>(true);
  const [mfaEnabled, setMfaEnabled] = useState<boolean>(true);
  const [offlineMode, setOfflineMode] = useState<boolean>(false);
  const [syncQueue, setSyncQueue] = useState<number>(0);

  const logAudit = (action: string, resource: string, details: string, severity: AuditLogEntry['severity'] = 'info') => {
    const newEntry: AuditLogEntry = {
      id: `audit-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      tenantId: activeTenant.id,
      actorId: currentUser.id,
      actorName: currentUser.name,
      actorRole: userRole,
      action,
      resource,
      details,
      severity,
      timestamp: new Date().toISOString(),
      ipAddress: '192.168.10.42'
    };
    setAuditLogs((prev) => [newEntry, ...prev]);
    if (offlineMode) {
      setSyncQueue((c) => c + 1);
    }
  };

  const toggleOfflineMode = () => {
    setOfflineMode((prev) => {
      const next = !prev;
      if (!next && syncQueue > 0) {
        addToast('Online Sync Complete', `Synchronized ${syncQueue} cached actions to CareVerse cloud`, 'success');
        setSyncQueue(0);
      } else if (next) {
        addToast('Offline Mode Active', 'Local data caching enabled. Changes will queue for re-connection.', 'warning');
      }
      return next;
    });
  };

  // 9. Preferences & Localization
  const [language, setLanguageState] = useState<SupportedLanguage>('en');
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('careverse_dark_mode');
      if (stored !== null) {
        return stored === 'true';
      }
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    if (darkMode) {
      root.classList.add('dark');
      body.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
      root.style.colorScheme = 'dark';
      localStorage.setItem('careverse_dark_mode', 'true');
    } else {
      root.classList.remove('dark');
      body.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
      root.style.colorScheme = 'light';
      localStorage.setItem('careverse_dark_mode', 'false');
    }
  }, [darkMode]);

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    addToast('Language Changed', `Interface set to ${lang.toUpperCase()}`, 'info');
  };

  const t = (key: string): string => {
    const dict = languageTranslations[language] || languageTranslations.en;
    return dict[key] || languageTranslations.en[key] || key;
  };

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const next = !prev;
      addToast('Theme Updated', next ? 'Night mode enabled' : 'Light mode enabled', 'info');
      return next;
    });
  };

  // 10. Toasts
  const [toasts, setToasts] = useState<ToastItem[]>([
    {
      id: 'init-toast',
      title: 'CareVerse Virtual HQ Online',
      message: 'Connected to Meadowbrook Care Home (Outstanding CQC). Safe staffing verified.',
      type: 'success',
      timestamp: 'Now'
    }
  ]);

  const addToast = (title: string, message: string, type: ToastItem['type'] = 'info') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [{ id, title, message, type, timestamp: 'Just now' }, ...prev.slice(0, 4)]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const setActiveTenantId = (tenantId: string) => {
    setActiveTenantIdState(tenantId);
    const tenant = tenants.find((t) => t.id === tenantId);
    logAudit('SITE_SWITCH', `Site ${tenant?.name}`, 'Switched active care site boundary', 'security');
    addToast('Care Site Switched', `Now operating at: ${tenant?.name} (CQC: ${tenant?.cqcRating})`, 'success');
  };

  return (
    <AppContext.Provider
      value={{
        tenants,
        activeTenant,
        setActiveTenantId,
        currentUser,
        userRole,
        setUserRole,
        staffList,
        switchUser,
        updatePresence,
        joinRoom,
        updateStaff,
        virtualRooms,
        activeHuddleRoomId,
        toggleHuddle,
        addWhiteboardNote,
        shifts,
        addShift,
        updateShift,
        deleteShift,
        claimOpenShift,
        broadcastOpenShift,
        autoGenerateRota,
        safeStaffingAnalysis,
        attendanceRecords,
        isClockedIn,
        activeClockRecord,
        clockIn,
        clockOut,
        approveAttendance,
        incidents,
        logIncident,
        updateIncidentStatus,
        policies,
        acknowledgePolicy,
        onboardingRecords,
        updateOnboardingDocumentStatus,
        updateOnboardingTrainingStatus,
        enrollNewStarter,
        signoffOnboardingClearance,
        logShadowShift,
        toggleInductionStep,
        bulkVerifyDocuments,
        bulkCompleteTraining,
        timeOffRequests,
        requestTimeOff,
        reviewTimeOffRequest,
        deleteTimeOffRequest,
        announcements,
        addAnnouncement,
        acknowledgeAnnouncement,
        chatMessages,
        sendChatMessage,
        auditLogs,
        logAudit,
        biometricsEnabled,
        setBiometricsEnabled,
        mfaEnabled,
        setMfaEnabled,
        offlineMode,
        toggleOfflineMode,
        syncQueue,
        language,
        setLanguage,
        t,
        darkMode,
        toggleDarkMode,
        toasts,
        addToast,
        removeToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
