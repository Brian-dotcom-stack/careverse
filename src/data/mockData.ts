import {
  TenantOrganization,
  StaffMember,
  ShiftDefinition,
  Shift,
  AttendanceRecord,
  IncidentReport,
  PolicyDocument,
  Announcement,
  VirtualRoom,
  ChatMessage,
  AuditLogEntry
} from '../types';

export const mockTenants: TenantOrganization[] = [
  {
    id: 'org-meadowbrook',
    name: 'Meadowbrook Residential & Dementia Care',
    code: 'MBR-CARE',
    sector: 'Care Home',
    cqcRating: 'Outstanding',
    address: '42 Meadowbrook Lane, Harrogate, HG2 8QT, UK',
    coordinates: { lat: 53.9872, lng: -1.5394 },
    geofenceRadiusMeters: 250,
    totalBedsOrClients: 48,
    activeStaffCount: 28,
    logoColor: 'emerald'
  },
  {
    id: 'org-stjudes',
    name: "St. Jude's Supported Living Suites",
    code: 'STJ-SL',
    sector: 'Supported Living',
    cqcRating: 'Good',
    address: '14 Saint Jude Avenue, Bristol, BS5 0TW, UK',
    coordinates: { lat: 51.4584, lng: -2.5719 },
    geofenceRadiusMeters: 180,
    totalBedsOrClients: 18,
    activeStaffCount: 16,
    logoColor: 'blue'
  },
  {
    id: 'org-oakridge',
    name: 'Oakridge Domiciliary & Community Care',
    code: 'OAK-DOM',
    sector: 'Domiciliary Care',
    cqcRating: 'Good',
    address: '88 Oakridge Gateway, Manchester, M15 4PB, UK',
    coordinates: { lat: 53.4682, lng: -2.2478 },
    geofenceRadiusMeters: 500,
    totalBedsOrClients: 95,
    activeStaffCount: 34,
    logoColor: 'indigo'
  }
];

export const mockShiftDefinitions: ShiftDefinition[] = [
  {
    id: 'shift-morning',
    name: 'Morning Shift',
    type: 'morning',
    startTime: '07:00',
    endTime: '15:00',
    durationHours: 8,
    color: '#0284c7', // sky-600
    requiredRole: 'Any'
  },
  {
    id: 'shift-afternoon',
    name: 'Late / Afternoon Shift',
    type: 'afternoon',
    startTime: '14:30',
    endTime: '22:00',
    durationHours: 7.5,
    color: '#0d9488', // teal-600
    requiredRole: 'Any'
  },
  {
    id: 'shift-night',
    name: 'Waking Night Shift',
    type: 'waking_night',
    startTime: '21:45',
    endTime: '07:15',
    durationHours: 9.5,
    color: '#4f46e5', // indigo-600
    requiredRole: 'Senior'
  },
  {
    id: 'shift-longday',
    name: 'Long Day Care',
    type: 'long_day',
    startTime: '07:30',
    endTime: '20:00',
    durationHours: 12.5,
    color: '#d97706', // amber-600
    requiredRole: 'Any'
  }
];

export const mockStaffMembers: StaffMember[] = [
  {
    id: 'staff-1',
    tenantId: 'org-meadowbrook',
    name: 'Elena Vance, RN',
    avatar: 'https://images.unsplash.com/photo-1594824813576-90e9d34346b9?w=150&auto=format&fit=crop&q=80',
    email: 'elena.vance@meadowbrook-care.org',
    phone: '+44 7700 900123',
    role: 'Admin',
    jobTitle: 'Registered General Manager & Nominated Individual',
    department: 'Management',
    currentRoomId: 'room-admin',
    presenceStatus: 'at_desk',
    statusNote: 'Reviewing CQC inspection readiness & staffing ratios',
    hourlyRate: 34.50,
    contractedHours: 37.5,
    assignedHoursThisWeek: 37.5,
    dbsCertificateNumber: 'DBS-0098231920',
    dbsIssueDate: '2025-01-15',
    dbsExpiryDate: '2028-01-15',
    dbsStatus: 'valid',
    rightToWorkStatus: 'verified',
    mandatoryTrainingStatus: 'compliant',
    certifications: [
      { id: 'c1', title: 'Level 5 Diploma in Leadership for Health & Social Care', completedDate: '2024-03-10', expiryDate: '2027-03-10', status: 'valid' },
      { id: 'c2', title: 'Safeguarding Adults Level 4 (Lead Practitioner)', completedDate: '2025-02-14', expiryDate: '2026-02-14', status: 'valid' },
      { id: 'c3', title: 'Medication Administration Assessor', completedDate: '2024-11-20', expiryDate: '2025-11-20', status: 'valid' }
    ],
    emergencyContact: { name: 'David Vance', relation: 'Spouse', phone: '+44 7700 900888' }
  },
  {
    id: 'staff-2',
    tenantId: 'org-meadowbrook',
    name: 'Marcus Thorne',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
    email: 'marcus.t@meadowbrook-care.org',
    phone: '+44 7700 900456',
    role: 'HR',
    jobTitle: 'Head of People, Compliance & Workforce',
    department: 'Administration',
    currentRoomId: 'room-hr',
    presenceStatus: 'at_desk',
    statusNote: 'Auditing right to work and annual DBS renewals',
    hourlyRate: 26.00,
    contractedHours: 37.5,
    assignedHoursThisWeek: 37.5,
    dbsCertificateNumber: 'DBS-0044192033',
    dbsIssueDate: '2024-06-20',
    dbsExpiryDate: '2027-06-20',
    dbsStatus: 'valid',
    rightToWorkStatus: 'verified',
    mandatoryTrainingStatus: 'compliant',
    certifications: [
      { id: 'c4', title: 'CIPD Level 5 People Management', completedDate: '2023-09-01', expiryDate: '2028-09-01', status: 'valid' },
      { id: 'c5', title: 'GDPR & Caldicott Guardian Principles', completedDate: '2024-10-10', expiryDate: '2025-10-10', status: 'valid' }
    ],
    emergencyContact: { name: 'Sarah Thorne', relation: 'Sister', phone: '+44 7700 900222' }
  },
  {
    id: 'staff-3',
    tenantId: 'org-meadowbrook',
    name: 'Kofi Mensah',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    email: 'kofi.mensah@meadowbrook-care.org',
    phone: '+44 7700 900789',
    role: 'Manager',
    jobTitle: 'Clinical Deputy Manager & Rota Coordinator',
    department: 'Management',
    currentRoomId: 'room-managers',
    presenceStatus: 'in_huddle',
    statusNote: 'Running morning handover huddle on Unit A',
    hourlyRate: 28.50,
    contractedHours: 40.0,
    assignedHoursThisWeek: 39.0,
    dbsCertificateNumber: 'DBS-0019283746',
    dbsIssueDate: '2024-04-12',
    dbsExpiryDate: '2027-04-12',
    dbsStatus: 'valid',
    rightToWorkStatus: 'verified',
    mandatoryTrainingStatus: 'compliant',
    certifications: [
      { id: 'c6', title: 'Safe Handling of Medicines & Controlled Drugs', completedDate: '2025-01-08', expiryDate: '2026-01-08', status: 'valid' },
      { id: 'c7', title: 'Advanced Dementia Care & Behaviour Support', completedDate: '2024-05-18', expiryDate: '2026-05-18', status: 'valid' }
    ],
    emergencyContact: { name: 'Amina Mensah', relation: 'Spouse', phone: '+44 7700 900333' }
  },
  {
    id: 'staff-4',
    tenantId: 'org-meadowbrook',
    name: 'Claire Beauchamp',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    email: 'claire.b@meadowbrook-care.org',
    phone: '+44 7700 900341',
    role: 'Senior',
    jobTitle: 'Senior Care Practitioner & Medication Lead',
    department: 'Care',
    currentRoomId: 'room-clinical',
    presenceStatus: 'on_rounds',
    statusNote: 'Conducting 12:00 medication administration round (Bluebell Wing)',
    hourlyRate: 17.50,
    contractedHours: 36.0,
    assignedHoursThisWeek: 38.0,
    dbsCertificateNumber: 'DBS-0081726354',
    dbsIssueDate: '2024-08-10',
    dbsExpiryDate: '2027-08-10',
    dbsStatus: 'valid',
    rightToWorkStatus: 'verified',
    mandatoryTrainingStatus: 'compliant',
    certifications: [
      { id: 'c8', title: 'Medication Administration Level 3', completedDate: '2024-11-05', expiryDate: '2025-11-05', status: 'valid' },
      { id: 'c9', title: 'First Aid at Work & CPR', completedDate: '2024-09-12', expiryDate: '2026-09-12', status: 'valid' },
      { id: 'c10', title: 'Moving & Handling Trainer Assessor', completedDate: '2025-02-01', expiryDate: '2026-02-01', status: 'valid' }
    ],
    emergencyContact: { name: 'Patrick Beauchamp', relation: 'Partner', phone: '+44 7700 900111' }
  },
  {
    id: 'staff-5',
    tenantId: 'org-meadowbrook',
    name: 'Priya Sharma',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    email: 'priya.s@meadowbrook-care.org',
    phone: '+44 7700 900992',
    role: 'Staff',
    jobTitle: 'Healthcare Assistant (HCA)',
    department: 'Care',
    currentRoomId: 'room-breakroom',
    presenceStatus: 'on_break',
    statusNote: '15 min tea break until 13:30',
    hourlyRate: 13.80,
    contractedHours: 35.0,
    assignedHoursThisWeek: 35.0,
    dbsCertificateNumber: 'DBS-0033991827',
    dbsIssueDate: '2023-11-15',
    dbsExpiryDate: '2026-11-15',
    dbsStatus: 'valid',
    rightToWorkStatus: 'verified',
    mandatoryTrainingStatus: 'compliant',
    certifications: [
      { id: 'c11', title: 'Care Certificate (Standard 1-15)', completedDate: '2024-01-20', expiryDate: '2027-01-20', status: 'valid' },
      { id: 'c12', title: 'Infection Prevention & Control v4', completedDate: '2025-01-10', expiryDate: '2026-01-10', status: 'valid' }
    ],
    emergencyContact: { name: 'Ravi Sharma', relation: 'Father', phone: '+44 7700 900555' }
  },
  {
    id: 'staff-6',
    tenantId: 'org-meadowbrook',
    name: 'Tomasz Nowak',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    email: 'tomasz.n@meadowbrook-care.org',
    phone: '+44 7700 900654',
    role: 'Staff',
    jobTitle: 'Senior Care Support Worker',
    department: 'Care',
    currentRoomId: 'room-staff-hub',
    presenceStatus: 'on_rounds',
    statusNote: 'Assisting Resident Room 14 with hydration and mobility',
    hourlyRate: 15.20,
    contractedHours: 37.5,
    assignedHoursThisWeek: 42.0,
    dbsCertificateNumber: 'DBS-0022883391',
    dbsIssueDate: '2023-04-10',
    dbsExpiryDate: '2026-04-10',
    dbsStatus: 'expiring_soon',
    rightToWorkStatus: 'verified',
    mandatoryTrainingStatus: 'warning',
    certifications: [
      { id: 'c13', title: 'Fire Safety Awareness', completedDate: '2024-04-02', expiryDate: '2025-04-02', status: 'expiring' },
      { id: 'c14', title: 'Food Hygiene & Nutrition in Care', completedDate: '2024-05-15', expiryDate: '2026-05-15', status: 'valid' }
    ],
    emergencyContact: { name: 'Magda Nowak', relation: 'Wife', phone: '+44 7700 900777' }
  },
  {
    id: 'staff-7',
    tenantId: 'org-meadowbrook',
    name: 'Amara Okafor',
    avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80',
    email: 'amara.o@meadowbrook-care.org',
    phone: '+44 7700 900481',
    role: 'Staff',
    jobTitle: 'Care Assistant & Nutrition Champion',
    department: 'Care',
    currentRoomId: 'room-breakroom',
    presenceStatus: 'at_desk',
    statusNote: 'Completing dietary intake logs in electronic care charts',
    hourlyRate: 14.10,
    contractedHours: 30.0,
    assignedHoursThisWeek: 30.0,
    dbsCertificateNumber: 'DBS-0077123490',
    dbsIssueDate: '2024-09-01',
    dbsExpiryDate: '2027-09-01',
    dbsStatus: 'valid',
    rightToWorkStatus: 'verified',
    mandatoryTrainingStatus: 'compliant',
    certifications: [
      { id: 'c15', title: 'Moving & Handling People', completedDate: '2024-09-10', expiryDate: '2025-09-10', status: 'valid' },
      { id: 'c16', title: 'Dementia Awareness & Validation Therapy', completedDate: '2024-10-18', expiryDate: '2026-10-18', status: 'valid' }
    ],
    emergencyContact: { name: 'Chidi Okafor', relation: 'Brother', phone: '+44 7700 900444' }
  },
  {
    id: 'staff-8',
    tenantId: 'org-meadowbrook',
    name: 'Liam Gallagher',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    email: 'liam.g@meadowbrook-care.org',
    phone: '+44 7700 900192',
    role: 'Staff',
    jobTitle: 'Night Care Support Worker',
    department: 'Care',
    currentRoomId: undefined,
    presenceStatus: 'off_duty',
    statusNote: 'Scheduled for tonight waking shift (21:45)',
    hourlyRate: 16.00,
    contractedHours: 28.5,
    assignedHoursThisWeek: 28.5,
    dbsCertificateNumber: 'DBS-0099443311',
    dbsIssueDate: '2023-01-20',
    dbsExpiryDate: '2026-01-20',
    dbsStatus: 'expiring_soon',
    rightToWorkStatus: 'verified',
    mandatoryTrainingStatus: 'compliant',
    certifications: [
      { id: 'c17', title: 'Managing Challenging Situations (PBS)', completedDate: '2024-06-11', expiryDate: '2026-06-11', status: 'valid' }
    ],
    emergencyContact: { name: 'Karen Gallagher', relation: 'Mother', phone: '+44 7700 900666' }
  }
];

export const mockVirtualRooms: VirtualRoom[] = [
  {
    id: 'room-admin',
    tenantId: 'org-meadowbrook',
    name: 'Executive & CQC Compliance Suite',
    type: 'admin',
    description: 'Executive governance, CQC inspection evidence vault, and operational audits.',
    capacity: 6,
    activeHuddle: false,
    huddleTopic: 'Quarterly Quality Review prep',
    occupants: ['staff-1'],
    whiteboardNotes: [
      'CQC Provider Portal submission completed on Friday',
      'Ensure all shift coordinators double check fire door log'
    ]
  },
  {
    id: 'room-hr',
    tenantId: 'org-meadowbrook',
    name: 'People & HR Operations Office',
    type: 'hr',
    description: 'Workforce onboarding, recruitment pipelines, DBS renewals, and training matrices.',
    capacity: 8,
    activeHuddle: false,
    huddleTopic: 'Agency staff reduction strategy',
    occupants: ['staff-2'],
    whiteboardNotes: [
      'Reminder: 2 staff due for annual Moving & Handling refresher this week',
      'Send onboarding pack to incoming Weekend Senior Carer'
    ]
  },
  {
    id: 'room-managers',
    tenantId: 'org-meadowbrook',
    name: "Managers' Command Hub",
    type: 'management',
    description: 'Real-time rota adjustments, safe staffing oversight, and cross-wing coordination.',
    capacity: 10,
    activeHuddle: true,
    huddleTopic: 'Afternoon handover & staffing coverage for Bluebell Wing',
    occupants: ['staff-3'],
    whiteboardNotes: [
      'Minimum Safe Staffing: 1 Senior + 3 Carers active per floor',
      'Watch: Liam covering tonight waking shift; handover at 21:45 sharp'
    ]
  },
  {
    id: 'room-clinical',
    tenantId: 'org-meadowbrook',
    name: 'Clinical & Medication Station',
    type: 'clinical',
    description: 'MAR chart reconciliations, GP call rounds, pharmacy deliveries, and vitals review.',
    capacity: 8,
    activeHuddle: false,
    huddleTopic: 'Controlled drugs daily inventory count',
    occupants: ['staff-4'],
    whiteboardNotes: [
      'Boots Pharmacy delivery received and locked in safe at 10:30',
      'Dr. Henderson ward round scheduled Wednesday 11:00'
    ]
  },
  {
    id: 'room-staff-hub',
    tenantId: 'org-meadowbrook',
    name: 'Care Floor Central Station',
    type: 'staff_hub',
    description: 'Care charts, daily handovers, fluid balances, and team communication base.',
    capacity: 16,
    activeHuddle: false,
    huddleTopic: 'Resident hydration focus for hot weather',
    occupants: ['staff-6', 'staff-7'],
    whiteboardNotes: [
      'Target: Every resident offered hydration round every 90 minutes',
      'Room 08 physiotherapy walking plan updated'
    ]
  },
  {
    id: 'room-breakroom',
    tenantId: 'org-meadowbrook',
    name: 'Team Lounge & Wellbeing Hub',
    type: 'breakroom',
    description: 'Relaxation lounge, wellbeing check-ins, peer recognition, and informal chat.',
    capacity: 20,
    activeHuddle: false,
    huddleTopic: 'Friday carer appreciation cake!',
    occupants: ['staff-5'],
    whiteboardNotes: [
      'Shoutout to Priya for supporting family visiting in Rose Cottage yesterday',
      'Mental Health First Aider on duty today: Kofi Mensah'
    ]
  }
];

export const getTodayDateString = (offsetDays = 0): string => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
};

export const mockShifts: Shift[] = [
  {
    id: 'shift-today-1',
    tenantId: 'org-meadowbrook',
    date: getTodayDateString(0),
    shiftTypeId: 'shift-morning',
    shiftTitle: 'Morning Care Lead',
    startTime: '07:00',
    endTime: '15:00',
    unitOrWing: 'Unit A - Dementia Haven',
    assignedStaffId: 'staff-4',
    assignedStaffName: 'Claire Beauchamp',
    assignedStaffRole: 'Senior',
    status: 'assigned',
    requiresMedCert: true,
    conflicts: []
  },
  {
    id: 'shift-today-2',
    tenantId: 'org-meadowbrook',
    date: getTodayDateString(0),
    shiftTypeId: 'shift-morning',
    shiftTitle: 'Morning Carer #1',
    startTime: '07:00',
    endTime: '15:00',
    unitOrWing: 'Unit A - Dementia Haven',
    assignedStaffId: 'staff-5',
    assignedStaffName: 'Priya Sharma',
    assignedStaffRole: 'Staff',
    status: 'assigned',
    requiresMedCert: false,
    conflicts: []
  },
  {
    id: 'shift-today-3',
    tenantId: 'org-meadowbrook',
    date: getTodayDateString(0),
    shiftTypeId: 'shift-morning',
    shiftTitle: 'Morning Carer #2',
    startTime: '07:00',
    endTime: '15:00',
    unitOrWing: 'Unit B - Residential Wing',
    assignedStaffId: 'staff-7',
    assignedStaffName: 'Amara Okafor',
    assignedStaffRole: 'Staff',
    status: 'assigned',
    requiresMedCert: false,
    conflicts: []
  },
  {
    id: 'shift-today-4',
    tenantId: 'org-meadowbrook',
    date: getTodayDateString(0),
    shiftTypeId: 'shift-afternoon',
    shiftTitle: 'Afternoon Senior',
    startTime: '14:30',
    endTime: '22:00',
    unitOrWing: 'Unit A - Dementia Haven',
    assignedStaffId: 'staff-3',
    assignedStaffName: 'Kofi Mensah',
    assignedStaffRole: 'Manager',
    status: 'assigned',
    requiresMedCert: true,
    conflicts: []
  },
  {
    id: 'shift-today-5',
    tenantId: 'org-meadowbrook',
    date: getTodayDateString(0),
    shiftTypeId: 'shift-afternoon',
    shiftTitle: 'Afternoon Carer #1',
    startTime: '14:30',
    endTime: '22:00',
    unitOrWing: 'Unit B - Residential Wing',
    assignedStaffId: 'staff-6',
    assignedStaffName: 'Tomasz Nowak',
    assignedStaffRole: 'Staff',
    status: 'assigned',
    requiresMedCert: false,
    conflicts: ['Overtime alert: Tomasz scheduled 42 hrs this week (approaching 48h limit)']
  },
  {
    id: 'shift-today-6',
    tenantId: 'org-meadowbrook',
    date: getTodayDateString(0),
    shiftTypeId: 'shift-afternoon',
    shiftTitle: 'Afternoon Support Carer',
    startTime: '14:30',
    endTime: '22:00',
    unitOrWing: 'Unit A - Dementia Haven',
    assignedStaffId: undefined,
    assignedStaffName: undefined,
    status: 'open',
    isOpenBroadcast: true,
    requiresMedCert: false,
    notes: 'Urgent cover needed due to sickness cover request'
  },
  {
    id: 'shift-today-7',
    tenantId: 'org-meadowbrook',
    date: getTodayDateString(0),
    shiftTypeId: 'shift-night',
    shiftTitle: 'Waking Night Senior Lead',
    startTime: '21:45',
    endTime: '07:15',
    unitOrWing: 'Facility-wide Night Cover',
    assignedStaffId: 'staff-8',
    assignedStaffName: 'Liam Gallagher',
    assignedStaffRole: 'Staff',
    status: 'assigned',
    requiresMedCert: true,
    conflicts: []
  },
  {
    id: 'shift-tomorrow-1',
    tenantId: 'org-meadowbrook',
    date: getTodayDateString(1),
    shiftTypeId: 'shift-morning',
    shiftTitle: 'Morning Care Lead',
    startTime: '07:00',
    endTime: '15:00',
    unitOrWing: 'Unit A - Dementia Haven',
    assignedStaffId: 'staff-4',
    assignedStaffName: 'Claire Beauchamp',
    assignedStaffRole: 'Senior',
    status: 'assigned',
    requiresMedCert: true
  },
  {
    id: 'shift-tomorrow-2',
    tenantId: 'org-meadowbrook',
    date: getTodayDateString(1),
    shiftTypeId: 'shift-morning',
    shiftTitle: 'Morning Carer #1',
    startTime: '07:00',
    endTime: '15:00',
    unitOrWing: 'Unit A - Dementia Haven',
    assignedStaffId: 'staff-5',
    assignedStaffName: 'Priya Sharma',
    assignedStaffRole: 'Staff',
    status: 'assigned'
  },
  {
    id: 'shift-tomorrow-3',
    tenantId: 'org-meadowbrook',
    date: getTodayDateString(1),
    shiftTypeId: 'shift-morning',
    shiftTitle: 'Morning Carer #2',
    startTime: '07:00',
    endTime: '15:00',
    unitOrWing: 'Unit B - Residential Wing',
    assignedStaffId: undefined,
    status: 'open',
    isOpenBroadcast: true
  }
];

export const mockAttendanceRecords: AttendanceRecord[] = [
  {
    id: 'att-1',
    tenantId: 'org-meadowbrook',
    staffId: 'staff-4',
    staffName: 'Claire Beauchamp',
    staffRole: 'Senior',
    date: getTodayDateString(0),
    clockInTime: '06:54',
    scheduledStart: '07:00',
    scheduledEnd: '15:00',
    gpsCoordinates: { lat: 53.9873, lng: -1.5393 },
    gpsValidated: true,
    distanceFromSiteMeters: 14,
    ipAddress: '192.168.10.42 (Internal Care Wi-Fi)',
    status: 'active_now',
    varianceMinutes: -6
  },
  {
    id: 'att-2',
    tenantId: 'org-meadowbrook',
    staffId: 'staff-5',
    staffName: 'Priya Sharma',
    staffRole: 'Staff',
    date: getTodayDateString(0),
    clockInTime: '07:02',
    scheduledStart: '07:00',
    scheduledEnd: '15:00',
    gpsCoordinates: { lat: 53.9871, lng: -1.5395 },
    gpsValidated: true,
    distanceFromSiteMeters: 28,
    ipAddress: '192.168.10.45 (Internal Care Wi-Fi)',
    status: 'active_now',
    varianceMinutes: 2
  },
  {
    id: 'att-3',
    tenantId: 'org-meadowbrook',
    staffId: 'staff-7',
    staffName: 'Amara Okafor',
    staffRole: 'Staff',
    date: getTodayDateString(0),
    clockInTime: '07:18',
    scheduledStart: '07:00',
    scheduledEnd: '15:00',
    gpsCoordinates: { lat: 53.9870, lng: -1.5392 },
    gpsValidated: true,
    distanceFromSiteMeters: 35,
    ipAddress: '192.168.10.60 (Internal Care Wi-Fi)',
    status: 'late',
    varianceMinutes: 18,
    managerNotes: 'Reported heavy traffic due to roadworks on Harrogate bypass.'
  },
  {
    id: 'att-4',
    tenantId: 'org-meadowbrook',
    staffId: 'staff-6',
    staffName: 'Tomasz Nowak',
    staffRole: 'Staff',
    date: getTodayDateString(-1),
    clockInTime: '06:58',
    clockOutTime: '15:04',
    scheduledStart: '07:00',
    scheduledEnd: '15:00',
    gpsCoordinates: { lat: 53.9872, lng: -1.5394 },
    gpsValidated: true,
    distanceFromSiteMeters: 10,
    ipAddress: '192.168.10.42 (Internal Care Wi-Fi)',
    status: 'approved',
    varianceMinutes: -2,
    approvedBy: 'Kofi Mensah'
  },
  {
    id: 'att-5',
    tenantId: 'org-meadowbrook',
    staffId: 'staff-8',
    staffName: 'Liam Gallagher',
    staffRole: 'Staff',
    date: getTodayDateString(-1),
    clockInTime: '21:40',
    clockOutTime: '07:18',
    scheduledStart: '21:45',
    scheduledEnd: '07:15',
    gpsCoordinates: { lat: 53.9874, lng: -1.5391 },
    gpsValidated: true,
    distanceFromSiteMeters: 22,
    ipAddress: '192.168.10.42 (Internal Care Wi-Fi)',
    status: 'approved',
    varianceMinutes: -5,
    approvedBy: 'Kofi Mensah'
  }
];

export const mockIncidents: IncidentReport[] = [
  {
    id: 'inc-01',
    tenantId: 'org-meadowbrook',
    referenceNumber: 'INC-2026-089',
    title: 'Unwitnessed slip in corridor near Room 11',
    category: 'Fall',
    severity: 'Medium',
    location: 'Unit A - Dementia Haven Corridor',
    clientOrResidentName: 'Arthur Pendelton (Room 11)',
    date: getTodayDateString(0),
    time: '09:45',
    reportedByStaffId: 'staff-4',
    reportedByStaffName: 'Claire Beauchamp',
    description: 'Resident found on floor in sitting position with walking frame nearby. Vital signs checked immediately: BP 128/78, Pulse 74, SpO2 97%. No obvious deformities, swelling or pain reported.',
    immediateActionsTaken: 'Assisted using HoverJack lifting cushion by two trained staff. Full post-fall neurological observations initiated for 24h. Next of kin and duty GP notified.',
    witnesses: ['Priya Sharma (HCA)', 'Claire Beauchamp (Senior)'],
    status: 'Under Investigation',
    isCqcNotifiable: false,
    investigatingManager: 'Elena Vance, RN',
    createdAt: new Date().toISOString()
  },
  {
    id: 'inc-02',
    tenantId: 'org-meadowbrook',
    referenceNumber: 'INC-2026-084',
    title: 'Missed dose recording during morning round',
    category: 'Medication Error',
    severity: 'Low',
    location: 'Clinical Room Unit B',
    clientOrResidentName: 'Dorothy Miller (Room 04)',
    date: getTodayDateString(-2),
    time: '08:30',
    reportedByStaffId: 'staff-3',
    reportedByStaffName: 'Kofi Mensah',
    description: 'Morning Omeprazole 20mg was administered correctly at breakfast but signing on eMAR was omitted until 10:15 audit.',
    immediateActionsTaken: 'Cross-checked blister pack count with MAR chart. Confirmed resident consumed medication safely. Staff reminded of real-time signoff protocol.',
    witnesses: ['Claire Beauchamp'],
    status: 'Remediated',
    isCqcNotifiable: false,
    investigatingManager: 'Elena Vance, RN',
    createdAt: new Date(Date.now() - 172800000).toISOString()
  },
  {
    id: 'inc-03',
    tenantId: 'org-meadowbrook',
    referenceNumber: 'INC-2026-079',
    title: 'Safeguarding: Unexplained skin marking on left forearm',
    category: 'Safeguarding',
    severity: 'High',
    location: 'Room 22',
    clientOrResidentName: 'Margaret Thatcher (Room 22)',
    date: getTodayDateString(-5),
    time: '14:00',
    reportedByStaffId: 'staff-5',
    reportedByStaffName: 'Priya Sharma',
    description: 'During personal care assistance, noticed 3cm light bruise on left forearm. Resident unable to recall event due to cognitive impairment.',
    immediateActionsTaken: 'Body map completed and photographed securely. Incident escalated to Registered Manager and local authority safeguarding triage team. Body map logged in file.',
    witnesses: ['Tomasz Nowak'],
    status: 'Under Investigation',
    isCqcNotifiable: true,
    investigatingManager: 'Marcus Thorne',
    createdAt: new Date(Date.now() - 432000000).toISOString()
  }
];

export const mockPolicies: PolicyDocument[] = [
  {
    id: 'pol-1',
    tenantId: 'org-meadowbrook',
    title: 'Infection Prevention & Outbreak Control v5.1',
    category: 'Clinical',
    version: 'v5.1 (Revised 2026)',
    lastUpdated: '2026-02-10',
    mandatoryForRoles: ['Staff', 'Senior', 'Manager', 'HR', 'Admin'],
    acknowledgedStaffCount: 26,
    totalTargetStaffCount: 28,
    fileSize: '1.8 MB PDF',
    summary: 'Standard precautions, PPE escalation triggers, enhanced sanitation, norovirus and respiratory isolation guidelines.'
  },
  {
    id: 'pol-2',
    tenantId: 'org-meadowbrook',
    title: 'Safe Administration of Medicines & Controlled Drugs',
    category: 'Clinical',
    version: 'v4.0',
    lastUpdated: '2026-01-14',
    mandatoryForRoles: ['Senior', 'Manager', 'Admin'],
    acknowledgedStaffCount: 8,
    totalTargetStaffCount: 8,
    fileSize: '3.2 MB PDF',
    summary: 'CQC Regulation 12 compliant procedures for ordering, receiving, storing, administering and disposing of medicines.'
  },
  {
    id: 'pol-3',
    tenantId: 'org-meadowbrook',
    title: 'Data Protection, GDPR & Caldicott Guardian Compliance',
    category: 'GDPR & Confidentiality',
    version: 'v3.2',
    lastUpdated: '2025-11-20',
    mandatoryForRoles: ['Staff', 'Senior', 'Manager', 'HR', 'Admin'],
    acknowledgedStaffCount: 27,
    totalTargetStaffCount: 28,
    fileSize: '2.1 MB PDF',
    summary: 'Staff duties regarding confidential resident records, electronic care planning security, and incident data handling.'
  },
  {
    id: 'pol-4',
    tenantId: 'org-meadowbrook',
    title: 'Adult Safeguarding & Duty of Candour Protocol',
    category: 'Safeguarding',
    version: 'v4.4',
    lastUpdated: '2025-12-05',
    mandatoryForRoles: ['Staff', 'Senior', 'Manager', 'HR', 'Admin'],
    acknowledgedStaffCount: 28,
    totalTargetStaffCount: 28,
    fileSize: '2.5 MB PDF',
    summary: 'Recognising signs of abuse or neglect, local authority reporting pathways, whistleblowing protections, and statutory notifications.'
  }
];

export const mockAnnouncements: Announcement[] = [
  {
    id: 'ann-1',
    tenantId: 'org-meadowbrook',
    title: '🚨 Heatwave Health Plan: Hydration rounds escalated to 60-min intervals',
    content: 'Due to amber weather warning temperatures this week, all carers on duty must ensure fluid intake charts are updated in real-time. Ice lollies, chilled cordial, and fresh water jugs are stocked in every kitchenette.',
    authorName: 'Elena Vance, RN',
    authorRole: 'Admin',
    priority: 'critical',
    pinned: true,
    createdAt: '2 hours ago',
    acknowledgedCount: 24,
    targetDepartments: ['Care', 'Nursing', 'Management']
  },
  {
    id: 'ann-2',
    tenantId: 'org-meadowbrook',
    title: '🎉 Meadowbrook awarded Outstanding for Responsiveness by CQC',
    content: 'Massive congratulations to all our incredible healthcare assistants, seniors, and nurses! Our updated CQC rating report has just been published with special praise for our person-centred dementia approach.',
    authorName: 'Marcus Thorne',
    authorRole: 'HR',
    priority: 'important',
    pinned: true,
    createdAt: 'Yesterday',
    acknowledgedCount: 27,
    targetDepartments: ['All']
  },
  {
    id: 'ann-3',
    tenantId: 'org-meadowbrook',
    title: 'Upcoming Moving & Handling Refresher Workshop - Thursday 14:00',
    content: 'Practical hoist and slide sheet competency assessments will take place in the Training Suite with Claire Beauchamp.',
    authorName: 'Marcus Thorne',
    authorRole: 'HR',
    priority: 'normal',
    pinned: false,
    createdAt: '3 days ago',
    acknowledgedCount: 19,
    targetDepartments: ['Care']
  }
];

export const mockChatMessages: ChatMessage[] = [
  {
    id: 'msg-1',
    tenantId: 'org-meadowbrook',
    senderId: 'staff-3',
    senderName: 'Kofi Mensah',
    senderRole: 'Manager',
    senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    channel: '#shift-handovers',
    text: 'Good morning team! Morning handover complete for Unit A & B. Mr. Pendelton is resting comfortably after his breakfast.',
    timestamp: '07:15 AM'
  },
  {
    id: 'msg-2',
    tenantId: 'org-meadowbrook',
    senderId: 'staff-4',
    senderName: 'Claire Beauchamp',
    senderRole: 'Senior',
    senderAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    channel: '#shift-handovers',
    text: 'Copy that Kofi. Med round 1 is progressing smoothly. All MAR charts up to date.',
    timestamp: '08:40 AM'
  },
  {
    id: 'msg-3',
    tenantId: 'org-meadowbrook',
    senderId: 'staff-5',
    senderName: 'Priya Sharma',
    senderRole: 'Staff',
    senderAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    channel: '#general-announcements',
    text: 'Resident gardening activity starting in the sensory courtyard at 14:00 if anyone has residents who wish to join! 🌱🌸',
    timestamp: '10:05 AM'
  },
  {
    id: 'msg-4',
    tenantId: 'org-meadowbrook',
    senderId: 'staff-1',
    senderName: 'Elena Vance, RN',
    senderRole: 'Admin',
    senderAvatar: 'https://images.unsplash.com/photo-1594824813576-90e9d34346b9?w=150&auto=format&fit=crop&q=80',
    channel: '#urgent-coverage',
    text: 'Attention team: We have an open afternoon support shift today (14:30 - 22:00) with 1.25x enhanced rate. You can claim it directly in Smart Rota!',
    timestamp: '11:10 AM',
    isUrgent: true
  }
];

export const mockAuditLogs: AuditLogEntry[] = [
  {
    id: 'audit-01',
    tenantId: 'org-meadowbrook',
    actorId: 'staff-1',
    actorName: 'Elena Vance, RN',
    actorRole: 'Admin',
    action: 'ROTA_AUTOGENERATE',
    resource: 'Weekly Rota Schedule (Week 38)',
    details: 'Auto-generated 42 shifts with AI optimization applying minimum safe staffing rules and skill mix.',
    severity: 'info',
    timestamp: '2026-09-13T06:30:15Z',
    ipAddress: '192.168.10.15'
  },
  {
    id: 'audit-02',
    tenantId: 'org-meadowbrook',
    actorId: 'staff-4',
    actorName: 'Claire Beauchamp',
    actorRole: 'Senior',
    action: 'ATTENDANCE_CLOCK_IN',
    resource: 'Timesheet Entry #att-1',
    details: 'Biometric fingerprint verified with GPS validation (14m from site center).',
    severity: 'info',
    timestamp: '2026-09-13T06:54:02Z',
    ipAddress: '192.168.10.42'
  },
  {
    id: 'audit-03',
    tenantId: 'org-meadowbrook',
    actorId: 'staff-4',
    actorName: 'Claire Beauchamp',
    actorRole: 'Senior',
    action: 'INCIDENT_LOGGED',
    resource: 'Incident Report INC-2026-089',
    details: 'Unwitnessed fall logged for Arthur Pendelton. Safeguarding triage alert dispatched.',
    severity: 'warning',
    timestamp: '2026-09-13T09:48:19Z',
    ipAddress: '192.168.10.42'
  },
  {
    id: 'audit-04',
    tenantId: 'org-meadowbrook',
    actorId: 'staff-2',
    actorName: 'Marcus Thorne',
    actorRole: 'HR',
    action: 'DBS_EXPIRY_NOTIFICATION',
    resource: 'Staff #staff-6 Tomasz Nowak',
    details: 'Automated 60-day renewal alert dispatched via email & SMS to employee.',
    severity: 'warning',
    timestamp: '2026-09-12T14:22:00Z',
    ipAddress: '10.0.4.88'
  },
  {
    id: 'audit-05',
    tenantId: 'org-meadowbrook',
    actorId: 'staff-1',
    actorName: 'Elena Vance, RN',
    actorRole: 'Admin',
    action: 'RBAC_SECURITY_AUDIT',
    resource: 'Tenant Security Matrix',
    details: 'Annual SOC2 & GDPR data access review completed. Zero permission anomalies detected.',
    severity: 'security',
    timestamp: '2026-09-11T16:00:00Z',
    ipAddress: '192.168.10.15'
  }
];

export const languageTranslations: Record<string, any> = {
  en: {
    workspace: 'Virtual Workspace Hub',
    smartRota: 'Smart Rota Engine',
    attendance: 'Attendance & Clock',
    hrCompliance: 'HR & Compliance Suite',
    communications: 'Comms & Intercom',
    analytics: 'Analytics & Insights',
    clockIn: 'Clock In Now',
    clockOut: 'Clock Out',
    virtualFloorplan: 'Digital Office Floorplan',
    activityFeed: 'Live Operations Feed',
    autoGenerateRota: 'Auto-Generate Rota',
    safeStaffingStatus: 'Safe Staffing Ratio: Compliant',
    incidents: 'Incident & Safeguarding Logs',
    trainingCompliance: 'Training Compliance: 94.2%'
  },
  es: {
    workspace: 'Espacio de Trabajo Virtual',
    smartRota: 'Motor Inteligente de Turnos',
    attendance: 'Asistencia y Fichaje',
    hrCompliance: 'RRHH y Cumplimiento',
    communications: 'Comunicaciones e Intercom',
    analytics: 'Analítica y Rendimiento',
    clockIn: 'Registrar Entrada',
    clockOut: 'Registrar Salida',
    virtualFloorplan: 'Plano de Oficina Digital',
    activityFeed: 'Feed de Operaciones en Vivo',
    autoGenerateRota: 'Autogenerar Cuadrante',
    safeStaffingStatus: 'Ratio Seguro: Conforme',
    incidents: 'Incidentes y Protección',
    trainingCompliance: 'Cumplimiento de Formación: 94.2%'
  },
  fr: {
    workspace: 'Espace de Travail Virtuel',
    smartRota: 'Moteur de Planning Intelligent',
    attendance: 'Pointage et Présence',
    hrCompliance: 'RH & Conformité',
    communications: 'Communications & Interphone',
    analytics: 'Analyses & Perspectives',
    clockIn: 'Pointer Arrivée',
    clockOut: 'Pointer Départ',
    virtualFloorplan: 'Plan du Bureau Numérique',
    activityFeed: 'Fil d’Opérations en Direct',
    autoGenerateRota: 'Générer le Planning',
    safeStaffingStatus: 'Effectif de Sécurité: Conforme',
    incidents: 'Rapports d’Incidents',
    trainingCompliance: 'Conformité Formations: 94.2%'
  },
  pl: {
    workspace: 'Wirtualne Biuro',
    smartRota: 'Inteligentny Grafik Pracy',
    attendance: 'Rejestracja Czasu Pracy',
    hrCompliance: 'Kadry i Zgodność CQC',
    communications: 'Komunikacja i Interkom',
    analytics: 'Analityka i Statystyki',
    clockIn: 'Zaloguj Rozpoczęcie',
    clockOut: 'Zakończ Zmianę',
    virtualFloorplan: 'Cyfrowy Plan Placówki',
    activityFeed: 'Działania na Żywo',
    autoGenerateRota: 'Generuj Grafik',
    safeStaffingStatus: 'Obsada Bezpieczna: Spełniona',
    incidents: 'Zgłoszenia Incydentów',
    trainingCompliance: 'Zgodność Szkoleń: 94.2%'
  },
  tl: {
    workspace: 'Sentro ng Virtual Workspace',
    smartRota: 'Matalinong Rota Engine',
    attendance: 'Pagsubaybay sa Oras',
    hrCompliance: 'HR at Pagsunod sa Regulasyon',
    communications: 'Komunikasyon at Intercom',
    analytics: 'Pagsusuri at Pananaw',
    clockIn: 'Mag-Clock In',
    clockOut: 'Mag-Clock Out',
    virtualFloorplan: 'Plano ng Digital Office',
    activityFeed: 'Live na Gawain ng Koponan',
    autoGenerateRota: 'Bumuo ng Rota',
    safeStaffingStatus: 'Ligtas na Tauhan: Sang-ayon',
    incidents: 'Ulat sa Insidente',
    trainingCompliance: 'Pagsasanay: 94.2%'
  }
};
