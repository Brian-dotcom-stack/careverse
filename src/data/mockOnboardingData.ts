import { EmployeeOnboardingRecord, OnboardingDocument, OnboardingTrainingModule } from '../types';

export const standardCareDocuments: Omit<OnboardingDocument, 'id' | 'status' | 'submittedDate' | 'verifiedDate' | 'verifiedBy'>[] = [
  {
    name: 'Right to Work Verification (Passport / BRP / Share Code)',
    category: 'identity',
    required: true,
    notes: 'Home Office employer online check verified'
  },
  {
    name: 'Enhanced DBS Certificate with Barred List Check',
    category: 'compliance',
    required: true,
    notes: 'DBS Update Service consent enrolled'
  },
  {
    name: 'Primary Professional Reference (Previous Healthcare Employer)',
    category: 'references',
    required: true,
    notes: 'Direct telephone & written email verification'
  },
  {
    name: 'Secondary Professional / Character Reference',
    category: 'references',
    required: true,
    notes: 'Verified previous care supervisor or professional'
  },
  {
    name: 'Proof of Address (Utility Bill / Bank Statement < 3 Months)',
    category: 'identity',
    required: true,
    notes: 'Matches address on DBS application'
  },
  {
    name: 'Signed Employment Contract & Job Description',
    category: 'contracts',
    required: true,
    notes: 'Electronic signature via CareVerse HR vault'
  },
  {
    name: 'Occupational Health & Immunization Declaration',
    category: 'health',
    required: true,
    notes: 'Hep B titre, TB screening, and fit-to-work self assessment'
  },
  {
    name: 'Payroll Direct Debit Mandate & Emergency Contacts',
    category: 'contracts',
    required: true,
    notes: 'Next-of-kin contact verified'
  }
];

export const standardCareTrainingModules: Omit<OnboardingTrainingModule, 'id' | 'status' | 'completedDate' | 'score' | 'certifiedBy'>[] = [
  {
    title: 'The Care Certificate (Standards 1–15 Core Foundations)',
    category: 'care_certificate',
    durationHours: 12
  },
  {
    title: 'Moving & Handling of People (Practical Hoist & Biomechanics)',
    category: 'health_safety',
    durationHours: 6
  },
  {
    title: 'Safeguarding Adults at Risk (Level 2/3 & DoLS Alerting)',
    category: 'statutory',
    durationHours: 4
  },
  {
    title: 'Infection Prevention & Control (IPC Level 2 & Sepsis)',
    category: 'statutory',
    durationHours: 3
  },
  {
    title: 'Basic Life Support (BLS, CPR & Automated Defibrillator)',
    category: 'statutory',
    durationHours: 4
  },
  {
    title: 'Safe Handling & Administration of Medicines (Level 2/3)',
    category: 'clinical',
    durationHours: 6
  },
  {
    title: 'Fire Safety, Extinguishers & Horizontal Evacuation Plan',
    category: 'health_safety',
    durationHours: 2.5
  },
  {
    title: 'Food Hygiene, Nutrition & Swallowing / Dysphagia (IDDSI)',
    category: 'statutory',
    durationHours: 3
  },
  {
    title: 'Mental Capacity Act 2005 & Best Interests Decision Making',
    category: 'statutory',
    durationHours: 3
  },
  {
    title: 'GDPR, Person-Centred Records & Caldicott Guardian Principles',
    category: 'statutory',
    durationHours: 2
  }
];

export const mockOnboardingRecords: EmployeeOnboardingRecord[] = [
  {
    id: 'onb-1',
    staffId: 'staff-new-1',
    employeeName: 'Liam Evans',
    employeeRole: 'Staff',
    jobTitle: 'Healthcare Assistant (HCA)',
    department: 'Care',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    email: 'liam.evans@meadowbrook-care.org',
    phone: '+44 7700 900512',
    startDate: '2026-09-22',
    targetCompletionDate: '2026-10-10',
    mentorName: 'Claire Beauchamp (Senior Carer)',
    status: 'in_progress',
    progressPercent: 75,
    shadowShiftsCompleted: 2,
    shadowShiftsRequired: 3,
    inductionTourCompleted: true,
    uniformAndBadgeIssued: true,
    cqcRegistrationSignoff: false,
    notes: 'Exceeding expectations on Unit A. Friendly bedside manner. Completing final shadow shift this Thursday.',
    documents: [
      {
        id: 'doc-1-1',
        name: 'Right to Work Verification (Passport / BRP)',
        category: 'identity',
        required: true,
        status: 'verified',
        submittedDate: '2026-09-15',
        verifiedDate: '2026-09-16',
        verifiedBy: 'Marcus Thorne (HR)',
        fileName: 'evans_uk_passport_scan.pdf'
      },
      {
        id: 'doc-1-2',
        name: 'Enhanced DBS Certificate with Barred List Check',
        category: 'compliance',
        required: true,
        status: 'verified',
        submittedDate: '2026-09-14',
        verifiedDate: '2026-09-18',
        verifiedBy: 'Marcus Thorne (HR)',
        fileName: 'dbs_0099812451_verified.pdf',
        expiryDate: '2029-09-18'
      },
      {
        id: 'doc-1-3',
        name: 'Primary Professional Reference (Oakwood Care)',
        category: 'references',
        required: true,
        status: 'verified',
        submittedDate: '2026-09-16',
        verifiedDate: '2026-09-17',
        verifiedBy: 'Marcus Thorne (HR)',
        fileName: 'ref_oakwood_care_signed.pdf'
      },
      {
        id: 'doc-1-4',
        name: 'Secondary Character Reference',
        category: 'references',
        required: true,
        status: 'verified',
        submittedDate: '2026-09-16',
        verifiedDate: '2026-09-17',
        verifiedBy: 'Marcus Thorne (HR)',
        fileName: 'ref_college_tutor.pdf'
      },
      {
        id: 'doc-1-5',
        name: 'Proof of Address (Council Tax Statement)',
        category: 'identity',
        required: true,
        status: 'verified',
        submittedDate: '2026-09-15',
        verifiedDate: '2026-09-16',
        verifiedBy: 'Marcus Thorne (HR)',
        fileName: 'proof_address_sept26.pdf'
      },
      {
        id: 'doc-1-6',
        name: 'Signed Employment Contract & Job Description',
        category: 'contracts',
        required: true,
        status: 'verified',
        submittedDate: '2026-09-20',
        verifiedDate: '2026-09-20',
        verifiedBy: 'Elena Vance (Admin)',
        fileName: 'contract_hca_signed.pdf'
      },
      {
        id: 'doc-1-7',
        name: 'Occupational Health & Immunization Record',
        category: 'health',
        required: true,
        status: 'submitted',
        submittedDate: '2026-09-28',
        notes: 'Awaiting GP lab confirmation of Hep B immunity booster'
      },
      {
        id: 'doc-1-8',
        name: 'Payroll Direct Debit & Emergency Contacts',
        category: 'contracts',
        required: true,
        status: 'verified',
        submittedDate: '2026-09-21',
        verifiedDate: '2026-09-21',
        verifiedBy: 'Marcus Thorne (HR)'
      }
    ],
    trainingModules: [
      {
        id: 'trn-1-1',
        title: 'The Care Certificate (Standards 1–15 Core Foundations)',
        category: 'care_certificate',
        durationHours: 12,
        status: 'completed',
        completedDate: '2026-09-24',
        score: 96,
        certifiedBy: 'Skills for Care Assessor'
      },
      {
        id: 'trn-1-2',
        title: 'Moving & Handling of People (Practical Hoist & Biomechanics)',
        category: 'health_safety',
        durationHours: 6,
        status: 'completed',
        completedDate: '2026-09-25',
        score: 100,
        certifiedBy: 'Claire Beauchamp (Trainer)'
      },
      {
        id: 'trn-1-3',
        title: 'Safeguarding Adults at Risk (Level 2/3 & DoLS Alerting)',
        category: 'statutory',
        durationHours: 4,
        status: 'completed',
        completedDate: '2026-09-26',
        score: 94
      },
      {
        id: 'trn-1-4',
        title: 'Infection Prevention & Control (IPC Level 2 & Sepsis)',
        category: 'statutory',
        durationHours: 3,
        status: 'completed',
        completedDate: '2026-09-27',
        score: 98
      },
      {
        id: 'trn-1-5',
        title: 'Basic Life Support (BLS, CPR & Automated Defibrillator)',
        category: 'statutory',
        durationHours: 4,
        status: 'in_progress'
      },
      {
        id: 'trn-1-6',
        title: 'Safe Handling & Administration of Medicines (Level 2/3)',
        category: 'clinical',
        durationHours: 6,
        status: 'not_started'
      },
      {
        id: 'trn-1-7',
        title: 'Fire Safety, Extinguishers & Horizontal Evacuation Plan',
        category: 'health_safety',
        durationHours: 2.5,
        status: 'completed',
        completedDate: '2026-09-23',
        score: 100
      },
      {
        id: 'trn-1-8',
        title: 'Food Hygiene, Nutrition & Swallowing / Dysphagia (IDDSI)',
        category: 'statutory',
        durationHours: 3,
        status: 'completed',
        completedDate: '2026-09-29',
        score: 92
      },
      {
        id: 'trn-1-9',
        title: 'Mental Capacity Act 2005 & Best Interests Decision Making',
        category: 'statutory',
        durationHours: 3,
        status: 'in_progress'
      },
      {
        id: 'trn-1-10',
        title: 'GDPR, Person-Centred Records & Caldicott Guardian Principles',
        category: 'statutory',
        durationHours: 2,
        status: 'completed',
        completedDate: '2026-09-23',
        score: 95
      }
    ]
  },
  {
    id: 'onb-2',
    staffId: 'staff-new-2',
    employeeName: 'Maya Patel, RN',
    employeeRole: 'Staff',
    jobTitle: 'Staff Nurse (Registered Adult Nurse)',
    department: 'Nursing',
    avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&auto=format&fit=crop&q=80',
    email: 'maya.patel@meadowbrook-care.org',
    phone: '+44 7700 900871',
    startDate: '2026-09-28',
    targetCompletionDate: '2026-10-18',
    mentorName: 'Kofi Mensah (Clinical Deputy Manager)',
    status: 'action_required',
    progressPercent: 50,
    shadowShiftsCompleted: 1,
    shadowShiftsRequired: 3,
    inductionTourCompleted: true,
    uniformAndBadgeIssued: true,
    cqcRegistrationSignoff: false,
    notes: 'Blocked: Secondary clinical reference pending from Royal Infirmary HR. NMC registration verified and active.',
    documents: [
      {
        id: 'doc-2-1',
        name: 'NMC Professional Registration PIN Check',
        category: 'compliance',
        required: true,
        status: 'verified',
        submittedDate: '2026-09-22',
        verifiedDate: '2026-09-22',
        verifiedBy: 'Elena Vance (Admin)',
        fileName: 'nmc_pin_active_check.pdf',
        notes: 'PIN: 22E0911A - No restrictions on practice'
      },
      {
        id: 'doc-2-2',
        name: 'Right to Work Verification (BRP / Share Code)',
        category: 'identity',
        required: true,
        status: 'verified',
        submittedDate: '2026-09-22',
        verifiedDate: '2026-09-23',
        verifiedBy: 'Marcus Thorne (HR)',
        fileName: 'home_office_share_code_verified.pdf'
      },
      {
        id: 'doc-2-3',
        name: 'Enhanced DBS Certificate with Barred List Check',
        category: 'compliance',
        required: true,
        status: 'submitted',
        submittedDate: '2026-09-24',
        notes: 'Application stage 4 with local police force review'
      },
      {
        id: 'doc-2-4',
        name: 'Primary Clinical Reference (NHS Trust Ward Sister)',
        category: 'references',
        required: true,
        status: 'verified',
        submittedDate: '2026-09-25',
        verifiedDate: '2026-09-26',
        verifiedBy: 'Marcus Thorne (HR)',
        fileName: 'ref_nhs_ward_sister.pdf'
      },
      {
        id: 'doc-2-5',
        name: 'Secondary Clinical Reference (Previous Care Home)',
        category: 'references',
        required: true,
        status: 'pending',
        notes: 'Automated reminder dispatched to referee on 01 Oct 2026'
      },
      {
        id: 'doc-2-6',
        name: 'Proof of Address (Bank Statement < 3 Months)',
        category: 'identity',
        required: true,
        status: 'verified',
        submittedDate: '2026-09-22',
        verifiedDate: '2026-09-23',
        verifiedBy: 'Marcus Thorne (HR)'
      },
      {
        id: 'doc-2-7',
        name: 'Signed Employment Contract & Job Description',
        category: 'contracts',
        required: true,
        status: 'verified',
        submittedDate: '2026-09-27',
        verifiedDate: '2026-09-27',
        verifiedBy: 'Elena Vance (Admin)'
      },
      {
        id: 'doc-2-8',
        name: 'Occupational Health & Immunization Record',
        category: 'health',
        required: true,
        status: 'verified',
        submittedDate: '2026-09-25',
        verifiedDate: '2026-09-26',
        verifiedBy: 'Elena Vance (Admin)',
        fileName: 'occ_health_clearance_fit.pdf'
      }
    ],
    trainingModules: [
      {
        id: 'trn-2-1',
        title: 'Safe Handling & Administration of Medicines (Level 3 Clinical)',
        category: 'clinical',
        durationHours: 6,
        status: 'completed',
        completedDate: '2026-09-29',
        score: 100,
        certifiedBy: 'Kofi Mensah (Assessor)'
      },
      {
        id: 'trn-2-2',
        title: 'Basic Life Support (BLS, Advanced Airway & CPR)',
        category: 'statutory',
        durationHours: 4,
        status: 'completed',
        completedDate: '2026-09-29',
        score: 98
      },
      {
        id: 'trn-2-3',
        title: 'Safeguarding Adults at Risk (Level 3 Lead Practitioner)',
        category: 'statutory',
        durationHours: 4,
        status: 'completed',
        completedDate: '2026-09-30',
        score: 96
      },
      {
        id: 'trn-2-4',
        title: 'Moving & Handling of People (Practical Hoist & Biomechanics)',
        category: 'health_safety',
        durationHours: 6,
        status: 'in_progress'
      },
      {
        id: 'trn-2-5',
        title: 'Infection Prevention & Control (IPC Level 2 & Sepsis)',
        category: 'statutory',
        durationHours: 3,
        status: 'completed',
        completedDate: '2026-09-30',
        score: 100
      },
      {
        id: 'trn-2-6',
        title: 'Fire Safety, Extinguishers & Horizontal Evacuation Plan',
        category: 'health_safety',
        durationHours: 2.5,
        status: 'not_started'
      },
      {
        id: 'trn-2-7',
        title: 'Mental Capacity Act 2005 & Deprivation of Liberty (DoLS)',
        category: 'statutory',
        durationHours: 3,
        status: 'completed',
        completedDate: '2026-10-01',
        score: 96
      },
      {
        id: 'trn-2-8',
        title: 'GDPR, Clinical Records & Syringe Driver Competency',
        category: 'clinical',
        durationHours: 3,
        status: 'in_progress'
      }
    ]
  },
  {
    id: 'onb-3',
    staffId: 'staff-new-3',
    employeeName: 'Oliver Green',
    employeeRole: 'Staff',
    jobTitle: 'Senior Healthcare Assistant (Medication Lead)',
    department: 'Care',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    email: 'oliver.green@meadowbrook-care.org',
    phone: '+44 7700 900632',
    startDate: '2026-09-12',
    targetCompletionDate: '2026-10-05',
    mentorName: 'Elena Vance, RN (Registered Manager)',
    status: 'ready_for_duty',
    progressPercent: 95,
    shadowShiftsCompleted: 3,
    shadowShiftsRequired: 3,
    inductionTourCompleted: true,
    uniformAndBadgeIssued: true,
    cqcRegistrationSignoff: false,
    notes: 'All compliance checks and shadow shifts fully validated. Pending final Registered Manager green-light authorization.',
    documents: [
      {
        id: 'doc-3-1',
        name: 'Right to Work Verification (UK Passport)',
        category: 'identity',
        required: true,
        status: 'verified',
        submittedDate: '2026-09-08',
        verifiedDate: '2026-09-09',
        verifiedBy: 'Marcus Thorne (HR)',
        fileName: 'green_passport.pdf'
      },
      {
        id: 'doc-3-2',
        name: 'Enhanced DBS Certificate with Barred List Check',
        category: 'compliance',
        required: true,
        status: 'verified',
        submittedDate: '2026-09-08',
        verifiedDate: '2026-09-10',
        verifiedBy: 'Marcus Thorne (HR)',
        fileName: 'dbs_clear_cert.pdf'
      },
      {
        id: 'doc-3-3',
        name: 'Primary Professional Reference (Sunridge Nursing Home)',
        category: 'references',
        required: true,
        status: 'verified',
        submittedDate: '2026-09-09',
        verifiedDate: '2026-09-11',
        verifiedBy: 'Marcus Thorne (HR)'
      },
      {
        id: 'doc-3-4',
        name: 'Secondary Professional Reference (Meadow Lodge)',
        category: 'references',
        required: true,
        status: 'verified',
        submittedDate: '2026-09-09',
        verifiedDate: '2026-09-11',
        verifiedBy: 'Marcus Thorne (HR)'
      },
      {
        id: 'doc-3-5',
        name: 'Proof of Address (Mortgage Statement)',
        category: 'identity',
        required: true,
        status: 'verified',
        submittedDate: '2026-09-08',
        verifiedDate: '2026-09-09',
        verifiedBy: 'Marcus Thorne (HR)'
      },
      {
        id: 'doc-3-6',
        name: 'Signed Employment Contract & Job Description',
        category: 'contracts',
        required: true,
        status: 'verified',
        submittedDate: '2026-09-11',
        verifiedDate: '2026-09-12',
        verifiedBy: 'Elena Vance (Admin)'
      },
      {
        id: 'doc-3-7',
        name: 'Occupational Health & Immunization Record',
        category: 'health',
        required: true,
        status: 'verified',
        submittedDate: '2026-09-10',
        verifiedDate: '2026-09-11',
        verifiedBy: 'Marcus Thorne (HR)'
      },
      {
        id: 'doc-3-8',
        name: 'Payroll Direct Debit & Emergency Contacts',
        category: 'contracts',
        required: true,
        status: 'verified',
        submittedDate: '2026-09-10',
        verifiedDate: '2026-09-11',
        verifiedBy: 'Marcus Thorne (HR)'
      }
    ],
    trainingModules: [
      {
        id: 'trn-3-1',
        title: 'The Care Certificate (Standards 1–15 Core Foundations)',
        category: 'care_certificate',
        durationHours: 12,
        status: 'completed',
        completedDate: '2026-09-14',
        score: 98,
        certifiedBy: 'Skills for Care Assessor'
      },
      {
        id: 'trn-3-2',
        title: 'Moving & Handling of People (Practical Hoist & Biomechanics)',
        category: 'health_safety',
        durationHours: 6,
        status: 'completed',
        completedDate: '2026-09-15',
        score: 96
      },
      {
        id: 'trn-3-3',
        title: 'Safeguarding Adults at Risk (Level 2/3 & DoLS Alerting)',
        category: 'statutory',
        durationHours: 4,
        status: 'completed',
        completedDate: '2026-09-16',
        score: 100
      },
      {
        id: 'trn-3-4',
        title: 'Infection Prevention & Control (IPC Level 2 & Sepsis)',
        category: 'statutory',
        durationHours: 3,
        status: 'completed',
        completedDate: '2026-09-17',
        score: 97
      },
      {
        id: 'trn-3-5',
        title: 'Basic Life Support (BLS, CPR & Automated Defibrillator)',
        category: 'statutory',
        durationHours: 4,
        status: 'completed',
        completedDate: '2026-09-18',
        score: 100
      },
      {
        id: 'trn-3-6',
        title: 'Safe Handling & Administration of Medicines (Level 2/3)',
        category: 'clinical',
        durationHours: 6,
        status: 'completed',
        completedDate: '2026-09-19',
        score: 98,
        certifiedBy: 'Elena Vance, RN'
      },
      {
        id: 'trn-3-7',
        title: 'Fire Safety, Extinguishers & Horizontal Evacuation Plan',
        category: 'health_safety',
        durationHours: 2.5,
        status: 'completed',
        completedDate: '2026-09-20',
        score: 94
      },
      {
        id: 'trn-3-8',
        title: 'Food Hygiene, Nutrition & Swallowing / Dysphagia (IDDSI)',
        category: 'statutory',
        durationHours: 3,
        status: 'completed',
        completedDate: '2026-09-21',
        score: 96
      },
      {
        id: 'trn-3-9',
        title: 'Mental Capacity Act 2005 & Best Interests Decision Making',
        category: 'statutory',
        durationHours: 3,
        status: 'completed',
        completedDate: '2026-09-22',
        score: 100
      },
      {
        id: 'trn-3-10',
        title: 'GDPR, Person-Centred Records & Caldicott Guardian Principles',
        category: 'statutory',
        durationHours: 2,
        status: 'completed',
        completedDate: '2026-09-23',
        score: 95
      }
    ]
  },
  {
    id: 'onb-4',
    staffId: 'staff-new-4',
    employeeName: 'Hannah Ward',
    employeeRole: 'Staff',
    jobTitle: 'Infection Control & Housekeeping Assistant',
    department: 'Housekeeping',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    email: 'hannah.ward@meadowbrook-care.org',
    phone: '+44 7700 900441',
    startDate: '2026-09-29',
    targetCompletionDate: '2026-10-15',
    mentorName: 'Marcus Thorne (HR & Operations)',
    status: 'in_progress',
    progressPercent: 40,
    shadowShiftsCompleted: 1,
    shadowShiftsRequired: 2,
    inductionTourCompleted: true,
    uniformAndBadgeIssued: false,
    cqcRegistrationSignoff: false,
    notes: 'COSHH training scheduled for tomorrow morning. Reference 2 collected.',
    documents: [
      {
        id: 'doc-4-1',
        name: 'Right to Work Verification (UK Passport)',
        category: 'identity',
        required: true,
        status: 'verified',
        submittedDate: '2026-09-25',
        verifiedDate: '2026-09-26',
        verifiedBy: 'Marcus Thorne (HR)'
      },
      {
        id: 'doc-4-2',
        name: 'Standard DBS Certificate',
        category: 'compliance',
        required: true,
        status: 'verified',
        submittedDate: '2026-09-25',
        verifiedDate: '2026-09-28',
        verifiedBy: 'Marcus Thorne (HR)'
      },
      {
        id: 'doc-4-3',
        name: 'Primary Professional Reference (Premier Clean)',
        category: 'references',
        required: true,
        status: 'verified',
        submittedDate: '2026-09-27',
        verifiedDate: '2026-09-28',
        verifiedBy: 'Marcus Thorne (HR)'
      },
      {
        id: 'doc-4-4',
        name: 'Secondary Character Reference',
        category: 'references',
        required: true,
        status: 'verified',
        submittedDate: '2026-09-27',
        verifiedDate: '2026-09-28',
        verifiedBy: 'Marcus Thorne (HR)'
      },
      {
        id: 'doc-4-5',
        name: 'Proof of Address (Utility Bill)',
        category: 'identity',
        required: true,
        status: 'verified',
        submittedDate: '2026-09-25',
        verifiedDate: '2026-09-26',
        verifiedBy: 'Marcus Thorne (HR)'
      },
      {
        id: 'doc-4-6',
        name: 'Signed Employment Contract',
        category: 'contracts',
        required: true,
        status: 'submitted',
        submittedDate: '2026-09-29',
        notes: 'Awaiting countersignature from Registered Manager'
      },
      {
        id: 'doc-4-7',
        name: 'Health & COSHH Assessment',
        category: 'health',
        required: true,
        status: 'pending'
      }
    ],
    trainingModules: [
      {
        id: 'trn-4-1',
        title: 'COSHH (Control of Substances Hazardous to Health)',
        category: 'health_safety',
        durationHours: 3,
        status: 'in_progress'
      },
      {
        id: 'trn-4-2',
        title: 'Infection Prevention & Control (IPC Level 2 Clinical Cleaning)',
        category: 'statutory',
        durationHours: 3,
        status: 'completed',
        completedDate: '2026-10-01',
        score: 95
      },
      {
        id: 'trn-4-3',
        title: 'Fire Safety, Extinguishers & Evacuation',
        category: 'health_safety',
        durationHours: 2.5,
        status: 'completed',
        completedDate: '2026-10-01',
        score: 92
      },
      {
        id: 'trn-4-4',
        title: 'Moving & Handling of Inanimate Loads',
        category: 'health_safety',
        durationHours: 3,
        status: 'in_progress'
      },
      {
        id: 'trn-4-5',
        title: 'Safeguarding Adults at Risk (Level 1 Awareness)',
        category: 'statutory',
        durationHours: 2,
        status: 'completed',
        completedDate: '2026-10-02',
        score: 90
      },
      {
        id: 'trn-4-6',
        title: 'Food Hygiene & Kitchen Sanitation Protocols',
        category: 'statutory',
        durationHours: 3,
        status: 'not_started'
      }
    ]
  },
  {
    id: 'onb-5',
    staffId: 'staff-5',
    employeeName: 'Priya Sharma',
    employeeRole: 'Staff',
    jobTitle: 'Healthcare Assistant (HCA)',
    department: 'Care',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    email: 'priya.s@meadowbrook-care.org',
    phone: '+44 7700 900992',
    startDate: '2026-08-10',
    targetCompletionDate: '2026-08-31',
    mentorName: 'Kofi Mensah (Deputy Manager)',
    status: 'completed',
    progressPercent: 100,
    shadowShiftsCompleted: 3,
    shadowShiftsRequired: 3,
    inductionTourCompleted: true,
    uniformAndBadgeIssued: true,
    cqcRegistrationSignoff: true,
    notes: 'Successfully graduated probation and onboarding. Fully active on care roster.',
    documents: [
      {
        id: 'doc-5-1',
        name: 'Right to Work Verification',
        category: 'identity',
        required: true,
        status: 'verified',
        submittedDate: '2026-08-01',
        verifiedDate: '2026-08-02',
        verifiedBy: 'Marcus Thorne (HR)'
      },
      {
        id: 'doc-5-2',
        name: 'Enhanced DBS Certificate',
        category: 'compliance',
        required: true,
        status: 'verified',
        submittedDate: '2026-08-01',
        verifiedDate: '2026-08-05',
        verifiedBy: 'Marcus Thorne (HR)',
        expiryDate: '2027-08-05'
      },
      {
        id: 'doc-5-3',
        name: 'Professional References (2 of 2 Verified)',
        category: 'references',
        required: true,
        status: 'verified',
        submittedDate: '2026-08-02',
        verifiedDate: '2026-08-04',
        verifiedBy: 'Marcus Thorne (HR)'
      },
      {
        id: 'doc-5-4',
        name: 'Proof of Address',
        category: 'identity',
        required: true,
        status: 'verified',
        submittedDate: '2026-08-01',
        verifiedDate: '2026-08-02',
        verifiedBy: 'Marcus Thorne (HR)'
      },
      {
        id: 'doc-5-5',
        name: 'Signed Employment Contract',
        category: 'contracts',
        required: true,
        status: 'verified',
        submittedDate: '2026-08-05',
        verifiedDate: '2026-08-06',
        verifiedBy: 'Elena Vance (Admin)'
      },
      {
        id: 'doc-5-6',
        name: 'Occupational Health Clearance',
        category: 'health',
        required: true,
        status: 'verified',
        submittedDate: '2026-08-03',
        verifiedDate: '2026-08-04',
        verifiedBy: 'Marcus Thorne (HR)'
      }
    ],
    trainingModules: [
      {
        id: 'trn-5-1',
        title: 'The Care Certificate (Standards 1–15)',
        category: 'care_certificate',
        durationHours: 12,
        status: 'completed',
        completedDate: '2026-08-15',
        score: 95
      },
      {
        id: 'trn-5-2',
        title: 'Moving & Handling of People (Practical)',
        category: 'health_safety',
        durationHours: 6,
        status: 'completed',
        completedDate: '2026-08-16',
        score: 98
      },
      {
        id: 'trn-5-3',
        title: 'Safeguarding Adults at Risk Level 2',
        category: 'statutory',
        durationHours: 4,
        status: 'completed',
        completedDate: '2026-08-17',
        score: 96
      },
      {
        id: 'trn-5-4',
        title: 'Infection Prevention & Control Level 2',
        category: 'statutory',
        durationHours: 3,
        status: 'completed',
        completedDate: '2026-08-18',
        score: 100
      },
      {
        id: 'trn-5-5',
        title: 'Basic Life Support & First Aid',
        category: 'statutory',
        durationHours: 4,
        status: 'completed',
        completedDate: '2026-08-19',
        score: 94
      }
    ]
  }
];
