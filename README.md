<div align="center">

# CareVerse 🏥

### The Virtual Workspace & Operations Operating System for Modern Care Teams

An immersive, multi-tenant digital workplace engineered specifically for care homes, supported living, domiciliary care providers, and healthcare staffing agencies.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18+-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.0+-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0+-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Compliance](https://img.shields.io/badge/Compliance-CQC_|_HIPAA_|_GDPR_|_SOC2-emerald?style=for-the-badge&logo=shield&logoColor=white)](#-security-governance--regulatory-compliance)
[![Authentication](https://img.shields.io/badge/Security-FIDO2_WebAuthn_Passkeys-teal?style=for-the-badge&logo=fingerprint&logoColor=white)](#-biometrics--anti-tamper-clocking)

[Live Demo](https://ais-pre-6png2lwcifeib6ecvmwhnx-757117031328.europe-west2.run.app) • [Architecture Specs](#-system-architecture) • [Database Schema](#-relational-database-schema) • [Quick Start](#-quick-start)

---

</div>

## 📌 Executive Summary

Social care operations are hindered by fragmented tooling: paper communication books, disconnected spreadsheet rotas, proxy clock-ins, missed compliance renewals, and exorbitant agency recruitment fees.

**CareVerse** replaces legacy, disparate workflows with an **interactive virtual headquarters**. Designed with a spatial layout inspired by high-productivity virtual office paradigms, CareVerse delivers real-time floor awareness, algorithmic shift optimization, anti-tamper biometric timekeeping, and continuous regulatory audit-readiness for healthcare standards (including UK Care Quality Commission & HIPAA guidelines).

---

## 🚀 Key Modules & Capabilities

### 1. 🏢 Virtual Workspace Hub (Spatial Digital HQ)
* **Interactive Floorplan**: Spatial floor layout mapping physical operations into digital collaborative rooms (*Admin Suite, HR Office, Managers Office, Staff Hub, Medication Room, and Training Room*).
* **Live Staff Presence**: Real-time staff tracking with visual indicators (*At Desk, On Rounds, In Huddle, On Break, In Training, Off Duty*).
* **Room Whiteboards & Handover Notes**: Digital sticky-note boards per room for asynchronous handover briefings between shifts.
* **CQC Safe Staffing Telemetry**: Live ratio analysis checking registered nurses, senior carers, and care practitioners against active resident occupancy.

### 2. 📅 Smart Rota Engine & Scheduling
* **Algorithmic Constraint Satisfaction**: Auto-generates conflict-free rotas adhering to:
  * Maximum 48-hour working week limits (UK Working Time Directive).
  * Mandatory 11-hour rest intervals between shifts.
  * Required Level 3 Medication Administration certified staff quotas per wing.
* **Multi-Wing Scheduling**: 7-day master roster and single-day breakdown filtering across specialized wings (*Dementia Haven, Residential, Night Cover*).
* **Instant Shift Broadcast & Claiming**: Unfilled shift alerts broadcast directly to internal bank staff with one-click self-service claiming to curb costly agency spend.
* **Payroll Export**: Instant CSV export formatted for payroll systems.

### 3. ⏱️ Attendance & Geofenced Timekeeping
* **Perimeter GPS Validation**: Enforces clock-in/out within the care facility’s designated boundary (e.g., 250m geofence radius) with browser geolocation coordinates.
* **Visual Radar Sweep**: Real-time radar visualization displaying on-site staff proximity.
* **IP & Network Authentication**: Verifies clock-ins match verified facility Wi-Fi subnets to prevent remote buddy-punching.
* **Handover & Timesheet Sign-Off**: Running duty timers with mandatory clinical handovers and manager sign-off workflows.

### 4. 📋 HR & Regulatory Compliance Suite
* **Comprehensive Staff Profiles**: Centralized records covering job roles, contracted hours, hourly pay rates, and verified competencies.
* **DBS Expiry & Training Matrix**: Automated 60-day renewal warnings for statutory Disclosure and Barring Service (DBS) checks and mandatory training.
* **Statutory Safeguarding Incident Log**: Structured reporting for slips/falls, medication errors, challenging behaviour, and CQC Regulation 18 notifiable events.
* **Document Vault & Policy Signatures**: End-to-end encrypted storage for facility certifications, with digital acknowledgements for handbooks and infection control policies.

### 5. 📻 Real-Time Comms & Spatial Intercom
* **Contextual Channels**: Encrypted feeds for `#shift-handovers`, `#urgent-coverage`, `#incident-response`, and `#general-announcements`.
* **Urgent Broadcast System**: High-priority alert dispatches triggering visual alert cues.
* **Virtual Intercom Audio**: Interactive waveform visualizer simulating floor-wide intercom huddles between management and care practitioners.

### 6. 📊 Operations & Quality Intelligence Dashboard
* **Performance Telemetry**: Continuous tracking of 96.8% punctuality rates, safe staffing benchmarks, and agency cost savings.
* **Absence & Lateness Heatmap**: 7-day variance visualizer mapping peak attendance friction across Morning, Afternoon, and Waking Night shifts.

---

## 🏛️ System Architecture

CareVerse is built as a cloud-native, modular web platform designed for multi-tenant isolation, high concurrency, and zero downtime.

```
┌────────────────────────────────────────────────────────────────────────┐
│                          CAREVERSE CLIENT (SPA)                        │
│   React 18  •  TypeScript  •  Tailwind CSS  •  Lucide Icons  •  Vite   │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │ HTTPS / TLS 1.3 / WSS
┌──────────────────────────────────▼─────────────────────────────────────┐
│                           API GATEWAY / ROUTER                         │
│       Multi-Tenant Resolution  •  RBAC Middleware  •  Rate Limiting     │
└──────┬───────────────────────────┬───────────────────────────────┬─────┘
       │                           │                               │
┌──────▼──────────────┐   ┌────────▼──────────────┐   ┌────────────▼─────┐
│   CORE SCHEDULER    │   │  GEO-AUTHENTICATOR    │   │ COMPLIANCE ENGINE│
│ Constraint Solver   │   │  WebAuthn / FIDO2     │   │ CQC Reg 18 Flags │
│ WTD & Rest Rules    │   │  GPS Haversine Engine │   │ DBS Renewal Cron │
└──────┬──────────────┘   └────────┬──────────────┘   └────────────┬─────┘
       │                           │                               │
┌──────▼───────────────────────────▼───────────────────────────────▼─────┐
│                   PERSISTENCE LAYER (PostgreSQL)                       │
│    Row-Level Security (RLS)  •  Tenant Isolation  •  Immutable Audit   │
└────────────────────────────────────────────────────────────────────────┘
```

### Multi-Tenancy Model
CareVerse enforces strict logical tenant isolation. Each care agency or care home group operates inside a distinct tenant boundary:
* Isolated rotas, shifts, staff directories, and timesheets.
* Configurable geofence coordinates and organizational sector tags (*Care Home, Supported Living, Domiciliary Care, Staffing Agency*).
* Zero cross-tenant data leakage.

### Role-Based Access Control (RBAC)

| Capability / Action | Admin | HR | Manager | Senior Carer | Carer |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Manage & Auto-Generate Rotas** | ✅ | ✅ | ✅ | — | — |
| **Claim Open Broadcast Shifts** | ✅ | — | ✅ | ✅ | ✅ |
| **Electronic Timesheet Sign-Off** | ✅ | ✅ | ✅ | ✅ | — |
| **Log Statutory Safeguarding Incidents** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Close CQC Investigation Reports** | ✅ | ✅ | ✅ | — | — |
| **Access DBS Records & Passports** | ✅ | ✅ | — | — | — |
| **Multi-Tenant Switcher** | ✅ | — | — | — | — |

---

## 🗄️ Relational Database Schema

CareVerse utilizes a relational architecture designed for ACID compliance and auditability. Below is the core schema definition (Prisma / PostgreSQL):

```prisma
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
}
```

---

## 🔒 Security, Governance & Regulatory Compliance

* **UK GDPR & Data Protection Act 2018**: Strict data minimization, individual rights execution, and pseudonymized audit trails.
* **Caldicott Principles**: Resident and service-user identifiable data is safeguarded by role access barriers.
* **HIPAA Security Rule**: AES-256 encryption for data at rest, TLS 1.3 in transit, and immutable access logging.
* **FIDO2 / WebAuthn Biometrics**: Hardware security key authentication eliminating credential-sharing risks.
* **Offline Resiliency**: Client-side state caching with a synchronous queue for intermittent connectivity in care home dead zones.
* **Internationalization**: Full interface localization supporting English, Spanish, French, Polish, and Tagalog.

---

## 🛠️ Quick Start

### Prerequisites
* **Node.js**: v18.0.0 or later
* **npm** or **pnpm**

### Installation

```bash
# 1. Clone repository
git clone https://github.com/your-username/careverse.git

# 2. Navigate to project directory
cd careverse

# 3. Install dependencies
npm install

# 4. Start local development server
npm run dev
```

The application will be accessible at `http://localhost:3000`.

### Building for Production

```bash
# Compile and build production assets
npm run build

# Run linter and type-checks
npm run lint
```

---

## 🚢 Deployment

### Deploying to Vercel
CareVerse is optimized for seamless deployment to Vercel or any static edge infrastructure:

```bash
npm i -g vercel
vercel --prod
```

### Deploying via Docker / Cloud Run
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## 📄 License

Distributed under the **Apache-2.0 License**. See `LICENSE` for details.

---

<div align="center">
  <sub>Engineered with dedication for frontline care workers, managers, and directors shaping modern social care.</sub>
</div>
