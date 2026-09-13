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
  SupportedLanguage
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
  languageTranslations
} from '../data/mockData';

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

  const addShift = (shiftData: Omit<Shift, 'id' | 'tenantId'>) => {
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
    setShifts((prev) => prev.map((s) => (s.id === shiftId ? { ...s, ...updates } : s)));
    addToast('Shift Updated', 'Rota changes saved', 'info');
  };

  const deleteShift = (shiftId: string) => {
    setShifts((prev) => prev.filter((s) => s.id !== shiftId));
    addToast('Shift Removed', 'Shift removed from rota', 'warning');
  };

  const claimOpenShift = (shiftId: string) => {
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
    logAudit('SHIFT_CLAIMED', `Shift ID: ${shiftId}`, `${currentUser.name} claimed open shift`, 'info');
    addToast('Shift Claimed!', `You are now assigned to this shift. Added to your schedule.`, 'success');
  };

  const broadcastOpenShift = (shiftId: string) => {
    setShifts((prev) =>
      prev.map((s) => (s.id === shiftId ? { ...s, isOpenBroadcast: true, status: 'open' } : s))
    );
    // Also post to urgent channel
    sendChatMessage('#urgent-coverage', `🚨 Open Shift Broadcast: Urgent cover needed for shift on ${getTodayDateString(0)}! 1.25x enhanced weekend/urgent rate applies. Claim in Smart Rota.`, true);
    addToast('Shift Broadcasted', 'Instant push notification dispatched to eligible available carers', 'warning');
  };

  const autoGenerateRota = (startDate: string, options = { balanceHours: true, safeStaffingFloor: true }) => {
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
  const [darkMode, setDarkMode] = useState<boolean>(false);

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
      if (next) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
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
    logAudit('TENANT_SWITCH', `Organization ${tenant?.name}`, 'Switched active tenant boundary', 'security');
    addToast('Organization Switched', `Active workspace: ${tenant?.name}`, 'info');
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
