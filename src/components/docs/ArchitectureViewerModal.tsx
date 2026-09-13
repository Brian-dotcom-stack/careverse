import React, { useState } from 'react';
import {
  Server,
  Database,
  Layers,
  Shield,
  Code2,
  Cpu,
  Workflow,
  Globe,
  CheckCircle2,
  Copy,
  Terminal
} from 'lucide-react';

interface ArchitectureViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureViewerModal: React.FC<ArchitectureViewerModalProps> = ({ isOpen, onClose }) => {
  const [activeSection, setActiveSection] = useState<'overview' | 'database' | 'api' | 'rbac' | 'deploy'>('overview');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(label);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const prismaSchemaCode = `// CareVerse Multi-Tenant PostgreSQL Schema (Prisma ORM)
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model Tenant {
  id                    String            @id @default(uuid())
  code                  String            @unique
  name                  String
  domain                String            @unique
  organizationType      String            // CARE_HOME, SUPPORTED_LIVING, DOMICILIARY, AGENCY
  planTier              String            @default("ENTERPRISE")
  geofenceRadiusMeters  Int               @default(250)
  latitude              Float
  longitude             Float
  createdAt             DateTime          @default(now())
  updatedAt             DateTime          @updatedAt

  users                 User[]
  shifts                Shift[]
  attendanceRecords     Attendance[]
  incidentReports       IncidentReport[]
  policies              PolicyDocument[]
  auditLogs             AuditLog[]
}

model User {
  id                    String            @id @default(uuid())
  tenantId              String
  tenant                Tenant            @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  email                 String            @unique
  name                  String
  role                  String            // ADMIN, HR, MANAGER, SENIOR_CARER, CARER
  jobTitle              String
  department            String
  contractedHours       Int               @default(37)
  hourlyRate            Decimal           @db.Decimal(10, 2)
  dbsCertificateNumber  String
  dbsExpiryDate         DateTime
  dbsStatus             String            // VALID, EXPIRING_SOON, EXPIRED
  biometricKeyHandle    String?           // FIDO2 WebAuthn credential ID
  createdAt             DateTime          @default(now())

  assignedShifts        Shift[]           @relation("AssignedStaff")
  attendanceRecords     Attendance[]
  reportedIncidents     IncidentReport[]  @relation("IncidentReporter")
  signedPolicies        PolicySignature[]

  @@index([tenantId, role])
}

model Shift {
  id                    String            @id @default(uuid())
  tenantId              String
  tenant                Tenant            @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  date                  DateTime
  startTime             String
  endTime               String
  unitOrWing            String
  status                String            // OPEN, ASSIGNED, COMPLETED, CANCELLED
  requiresMedCert       Boolean           @default(false)
  assignedStaffId       String?
  assignedStaff         User?             @relation("AssignedStaff", fields: [assignedStaffId], references: [id])
  isOpenBroadcast       Boolean           @default(false)

  @@index([tenantId, date])
}

model Attendance {
  id                    String            @id @default(uuid())
  tenantId              String
  tenant                Tenant            @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  userId                String
  user                  User              @relation(fields: [userId], references: [id])
  date                  DateTime
  clockInTime           DateTime
  clockOutTime          DateTime?
  distanceMeters        Int
  ipAddress             String
  biometricVerified     Boolean           @default(true)
  status                String            // ACTIVE, COMPLETED, LATE, PENDING_APPROVAL, APPROVED
  approvedBy            String?
}

model IncidentReport {
  id                    String            @id @default(uuid())
  tenantId              String
  tenant                Tenant            @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  referenceNumber       String            @unique
  title                 String
  category              String            // FALL, MED_ERROR, SAFEGUARDING, NEAR_MISS, BEHAVIOURAL
  severity              String            // LOW, MEDIUM, HIGH, CRITICAL
  cqcNotifiable         Boolean           @default(false)
  description           String
  actionsTaken          String
  status                String            // LOGGED, UNDER_INVESTIGATION, REMEDIATED
  reporterId            String
  reporter              User              @relation("IncidentReporter", fields: [reporterId], references: [id])
  createdAt             DateTime          @default(now())
}`;

  const apiSpecCode = `// CareVerse RESTful & Real-time Engine Endpoints

GET    /api/v1/tenants/current              // Active care facility profile & geofence metadata
GET    /api/v1/rotas?start={date}&end={date} // Multi-wing shifts with conflict flags
POST   /api/v1/rotas/auto-generate          // AI/algorithmic constraint satisfaction engine
POST   /api/v1/rotas/shifts                 // Create new shift allocation
POST   /api/v1/rotas/shifts/:id/claim       // Carer self-service shift claim
POST   /api/v1/rotas/shifts/:id/broadcast   // Broadcast vacant shift to bank carers

POST   /api/v1/attendance/clock-in          // GPS + WebAuthn FIDO2 verification
POST   /api/v1/attendance/clock-out         // Timesheet finalization & handover notes
GET    /api/v1/attendance/timesheets        // Historical timesheet registry
POST   /api/v1/attendance/:id/approve       // Manager electronic sign-off

GET    /api/v1/compliance/matrix            // Staff DBS & mandatory training status
POST   /api/v1/compliance/incidents         // Statutory incident reporting (CQC flags)
PATCH  /api/v1/compliance/incidents/:id     // Investigation & remediation logs
POST   /api/v1/compliance/policies/:id/sign // Electronic policy acknowledgement

WS     /ws/v1/intercom                      // Spatial audio room WebRTC mesh & team chat`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-4xl rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-600 dark:bg-teal-950 dark:text-teal-300">
              <Server className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                CareVerse Architecture & Enterprise Specification
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Multi-Tenant SaaS • Database Schema • REST API • Security Model • Vercel Ready
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            ✕
          </button>
        </div>

        {/* Section Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 px-6 space-x-4 bg-slate-50/50 dark:bg-slate-900/50">
          {[
            { id: 'overview', label: 'System Overview' },
            { id: 'database', label: 'PostgreSQL / Prisma Schema' },
            { id: 'api', label: 'API Routes Specification' },
            { id: 'rbac', label: 'RBAC Permission Matrix' },
            { id: 'deploy', label: 'Vercel & Cloud Run Deployment' }
          ].map((sec) => (
            <button
              key={sec.id}
              onClick={() => setActiveSection(sec.id as any)}
              className={`py-3 text-xs font-semibold border-b-2 transition-all ${
                activeSection === sec.id
                  ? 'border-teal-600 text-teal-700 dark:border-teal-400 dark:text-teal-300'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400'
              }`}
            >
              {sec.label}
            </button>
          ))}
        </div>

        {/* Tab 1: System Overview */}
        {activeSection === 'overview' && (
          <div className="flex-1 p-6 overflow-y-auto space-y-6 text-xs text-slate-600 dark:text-slate-300">
            <div className="rounded-xl border border-teal-200 bg-teal-50/50 p-4 dark:border-teal-900/50 dark:bg-teal-950/30 text-teal-950 dark:text-teal-200">
              <h3 className="font-bold text-sm mb-1">Architectural Philosophy: Remio for Care Operations</h3>
              <p className="leading-relaxed">
                CareVerse replaces disjointed rotas, paper incident sheets, and standalone clocking systems with an immersive, spatial digital HQ. Care teams visualize floor occupancy in real-time, resolve safe-staffing gaps with algorithmic automation, and maintain statutory audit-readiness for the Care Quality Commission (CQC) and healthcare regulators.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                <Globe className="h-5 w-5 text-teal-600 mb-2" />
                <h4 className="font-bold text-slate-900 dark:text-white text-xs mb-1">Multi-Tenancy Isolation</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Shared database with row-level security (RLS) and logical tenant isolation. Each care agency or care home chain maintains an independent workforce registry, rotas, and documents.
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                <Cpu className="h-5 w-5 text-indigo-600 mb-2" />
                <h4 className="font-bold text-slate-900 dark:text-white text-xs mb-1">Constraint Satisfaction Engine</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Auto-allocation algorithm enforces Working Time Directive (WTD 48h), mandatory 11h rest periods, and skill ratios (medication administrators per wing).
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                <Shield className="h-5 w-5 text-emerald-600 mb-2" />
                <h4 className="font-bold text-slate-900 dark:text-white text-xs mb-1">Biometric Anti-Tamper Clocking</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  FIDO2 WebAuthn passkeys combined with GPS geofencing (250m perimeter) and local IP validation guarantee verified physical shift presence.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Database Schema */}
        {activeSection === 'database' && (
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400">PostgreSQL Relational DDL (Prisma ORM)</span>
              <button
                onClick={() => handleCopy(prismaSchemaCode, 'prisma')}
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                <Copy className="h-3.5 w-3.5" />
                <span>{copiedSection === 'prisma' ? 'Copied!' : 'Copy Schema'}</span>
              </button>
            </div>
            <pre className="p-4 rounded-xl bg-slate-950 text-slate-300 font-mono text-xs overflow-x-auto border border-slate-800">
              {prismaSchemaCode}
            </pre>
          </div>
        )}

        {/* Tab 3: API Specification */}
        {activeSection === 'api' && (
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400">OpenAPI 3.0 / REST & WebSocket Specification</span>
              <button
                onClick={() => handleCopy(apiSpecCode, 'api')}
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                <Copy className="h-3.5 w-3.5" />
                <span>{copiedSection === 'api' ? 'Copied!' : 'Copy API'}</span>
              </button>
            </div>
            <pre className="p-4 rounded-xl bg-slate-950 text-emerald-400 font-mono text-xs overflow-x-auto border border-slate-800">
              {apiSpecCode}
            </pre>
          </div>
        )}

        {/* Tab 4: RBAC Matrix */}
        {activeSection === 'rbac' && (
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-slate-400 uppercase font-semibold">
                    <th className="py-2.5 px-3">Permission / Capability</th>
                    <th className="py-2.5 px-3 text-center">Admin</th>
                    <th className="py-2.5 px-3 text-center">HR</th>
                    <th className="py-2.5 px-3 text-center">Manager</th>
                    <th className="py-2.5 px-3 text-center">Senior Carer</th>
                    <th className="py-2.5 px-3 text-center">Carer</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  {[
                    { perm: 'Create / Auto-generate Rotas', admin: true, hr: true, mgr: true, snr: false, stf: false },
                    { perm: 'Claim Open Broadcast Shifts', admin: true, hr: false, mgr: true, snr: true, stf: true },
                    { perm: 'Sign-off Timesheets & Handover', admin: true, hr: true, mgr: true, snr: true, stf: false },
                    { perm: 'Log Safeguarding Incidents', admin: true, hr: true, mgr: true, snr: true, stf: true },
                    { perm: 'Close CQC Investigation Reports', admin: true, hr: true, mgr: true, snr: false, stf: false },
                    { perm: 'Access DBS Records & Passports', admin: true, hr: true, mgr: false, snr: false, stf: false },
                    { perm: 'Switch Multi-Tenant Organizations', admin: true, hr: false, mgr: false, snr: false, stf: false }
                  ].map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">{row.perm}</td>
                      <td className="py-2.5 px-3 text-center">{row.admin ? '✅' : '—'}</td>
                      <td className="py-2.5 px-3 text-center">{row.hr ? '✅' : '—'}</td>
                      <td className="py-2.5 px-3 text-center">{row.mgr ? '✅' : '—'}</td>
                      <td className="py-2.5 px-3 text-center">{row.snr ? '✅' : '—'}</td>
                      <td className="py-2.5 px-3 text-center">{row.stf ? '✅' : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 5: Deployment */}
        {activeSection === 'deploy' && (
          <div className="flex-1 p-6 overflow-y-auto space-y-4 text-xs">
            <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-2">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">Vercel Deployment Configuration</h4>
              <p className="text-slate-600 dark:text-slate-300">
                CareVerse is packaged as an optimized single-page web app with zero external server dependencies for instantaneous edge delivery.
              </p>
              <div className="p-3 rounded-lg bg-slate-950 font-mono text-[11px] text-teal-400">
                npm run build<br />
                vercel --prod
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-2">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">Environment Variables</h4>
              <div className="p-3 rounded-lg bg-slate-950 font-mono text-[11px] text-slate-300 space-y-1">
                <div>DATABASE_URL="postgresql://user:pass@host:5432/careverse"</div>
                <div>NEXTAUTH_SECRET="super-secret-care-key"</div>
                <div>CQC_API_SYNC_KEY="cqc_prod_live_auth"</div>
                <div>WEBAUTHN_RP_ID="careverse.app"</div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-xl bg-slate-900 px-5 py-2 text-xs font-bold text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
