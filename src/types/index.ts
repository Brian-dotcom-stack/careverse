export type UserRole = 'Admin' | 'HR' | 'Manager' | 'Senior' | 'Staff';

export type CareSector = 'Care Home' | 'Supported Living' | 'Domiciliary Care' | 'Healthcare Agency';

export interface TenantOrganization {
  id: string;
  name: string;
  code: string;
  sector: CareSector;
  cqcRating: 'Outstanding' | 'Good' | 'Requires Improvement';
  address: string;
  coordinates: { lat: number; lng: number };
  geofenceRadiusMeters: number;
  totalBedsOrClients: number;
  activeStaffCount: number;
  logoColor: string;
}

export type StaffPresenceStatus = 'at_desk' | 'on_rounds' | 'on_break' | 'in_training' | 'off_duty' | 'in_huddle';

export interface StaffMember {
  id: string;
  tenantId: string;
  name: string;
  avatar: string;
  email: string;
  phone: string;
  role: UserRole;
  jobTitle: string;
  department: 'Nursing' | 'Care' | 'Administration' | 'Management' | 'Housekeeping';
  currentRoomId?: string;
  presenceStatus: StaffPresenceStatus;
  statusNote?: string;
  hourlyRate: number;
  contractedHours: number;
  assignedHoursThisWeek: number;
  dbsCertificateNumber: string;
  dbsIssueDate: string;
  dbsExpiryDate: string;
  dbsStatus: 'valid' | 'expiring_soon' | 'expired';
  rightToWorkStatus: 'verified' | 'pending' | 'review_required';
  mandatoryTrainingStatus: 'compliant' | 'warning' | 'non_compliant';
  certifications: {
    id: string;
    title: string;
    completedDate: string;
    expiryDate: string;
    status: 'valid' | 'expiring' | 'expired';
  }[];
  emergencyContact: {
    name: string;
    relation: string;
    phone: string;
  };
}

export type ShiftType = 'morning' | 'afternoon' | 'long_day' | 'waking_night' | 'sleep_in';

export interface ShiftDefinition {
  id: string;
  name: string;
  type: ShiftType;
  startTime: string; // e.g. "07:00"
  endTime: string;   // e.g. "15:00"
  durationHours: number;
  color: string;
  requiredRole: UserRole | 'Any';
  requiresMedicationCert?: boolean;
}

export type ShiftStatus = 'draft' | 'published' | 'assigned' | 'open' | 'completed' | 'swapped';

export interface Shift {
  id: string;
  tenantId: string;
  date: string; // "YYYY-MM-DD"
  shiftTypeId: string;
  shiftTitle: string;
  startTime: string;
  endTime: string;
  unitOrWing: string;
  assignedStaffId?: string;
  assignedStaffName?: string;
  assignedStaffRole?: UserRole;
  status: ShiftStatus;
  notes?: string;
  rateMultiplier?: number;
  conflicts?: string[];
  requiresMedCert?: boolean;
  isOpenBroadcast?: boolean;
}

export interface AttendanceRecord {
  id: string;
  tenantId: string;
  staffId: string;
  staffName: string;
  staffRole: UserRole;
  shiftId?: string;
  date: string;
  clockInTime: string;
  clockOutTime?: string;
  scheduledStart: string;
  scheduledEnd: string;
  gpsCoordinates?: { lat: number; lng: number };
  gpsValidated: boolean;
  distanceFromSiteMeters: number;
  ipAddress: string;
  status: 'on_time' | 'late' | 'early_departure' | 'active_now' | 'pending_approval' | 'approved';
  varianceMinutes: number; // positive = late, negative = early
  managerNotes?: string;
  approvedBy?: string;
}

export interface IncidentReport {
  id: string;
  tenantId: string;
  referenceNumber: string;
  title: string;
  category: 'Fall' | 'Medication Error' | 'Challenging Behaviour' | 'Safeguarding' | 'Near Miss' | 'Infection Control';
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  location: string;
  clientOrResidentName: string;
  date: string;
  time: string;
  reportedByStaffId: string;
  reportedByStaffName: string;
  description: string;
  immediateActionsTaken: string;
  witnesses: string[];
  status: 'Open' | 'Under Investigation' | 'Remediated' | 'Closed';
  isCqcNotifiable: boolean;
  investigatingManager?: string;
  createdAt: string;
}

export interface PolicyDocument {
  id: string;
  tenantId: string;
  title: string;
  category: 'Clinical' | 'Health & Safety' | 'GDPR & Confidentiality' | 'HR' | 'Safeguarding';
  version: string;
  lastUpdated: string;
  mandatoryForRoles: UserRole[];
  acknowledgedStaffCount: number;
  totalTargetStaffCount: number;
  fileSize: string;
  summary: string;
}

export interface Announcement {
  id: string;
  tenantId: string;
  title: string;
  content: string;
  authorName: string;
  authorRole: UserRole;
  priority: 'normal' | 'important' | 'critical';
  pinned: boolean;
  createdAt: string;
  acknowledgedCount: number;
  targetDepartments: string[];
}

export interface VirtualRoom {
  id: string;
  tenantId: string;
  name: string;
  type: 'admin' | 'hr' | 'management' | 'staff_hub' | 'clinical' | 'breakroom';
  description: string;
  capacity: number;
  activeHuddle: boolean;
  huddleTopic?: string;
  occupants: string[]; // staff IDs
  whiteboardNotes: string[];
}

export interface ChatMessage {
  id: string;
  tenantId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  senderAvatar: string;
  channel: string; // e.g. '#general', '#handovers', '#urgent-coverage'
  text: string;
  timestamp: string;
  isUrgent?: boolean;
}

export interface AuditLogEntry {
  id: string;
  tenantId: string;
  actorId: string;
  actorName: string;
  actorRole: UserRole;
  action: string;
  resource: string;
  details: string;
  severity: 'info' | 'warning' | 'security' | 'critical';
  timestamp: string;
  ipAddress: string;
}

export type SupportedLanguage = 'en' | 'es' | 'fr' | 'pl' | 'tl';

export interface LanguageStrings {
  workspace: string;
  smartRota: string;
  attendance: string;
  hrCompliance: string;
  communications: string;
  analytics: string;
  clockIn: string;
  clockOut: string;
  virtualFloorplan: string;
  activityFeed: string;
  autoGenerateRota: string;
  safeStaffingStatus: string;
  incidents: string;
  trainingCompliance: string;
}
