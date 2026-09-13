import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StaffMember, IncidentReport, PolicyDocument } from '../../types';
import {
  ShieldAlert,
  Users,
  Award,
  AlertOctagon,
  FileCheck,
  Upload,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  FileText,
  Building,
  Check,
  Phone,
  Mail,
  Shield,
  Eye,
  Plus
} from 'lucide-react';

interface HRComplianceSuiteProps {
  onOpenIncidentModal: () => void;
}

export const HRComplianceSuite: React.FC<HRComplianceSuiteProps> = ({ onOpenIncidentModal }) => {
  const {
    activeTenant,
    staffList,
    incidents,
    updateIncidentStatus,
    policies,
    acknowledgePolicy,
    currentUser,
    userRole,
    addToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<'staff' | 'dbs' | 'incidents' | 'policies' | 'vault'>('staff');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [selectedIncident, setSelectedIncident] = useState<IncidentReport | null>(null);
  const [investigationNotes, setInvestigationNotes] = useState('');

  const isManager = userRole === 'Admin' || userRole === 'Manager' || userRole === 'HR';

  // Filter staff
  const filteredStaff = staffList.filter((s) => {
    return (
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.department.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // DBS Alerts count
  const dbsExpiringCount = staffList.filter((s) => s.dbsStatus === 'expiring_soon' || s.dbsStatus === 'expired').length;

  const handleUpdateStatus = (status: IncidentReport['status']) => {
    if (!selectedIncident) return;
    updateIncidentStatus(selectedIncident.id, status, investigationNotes);
    setSelectedIncident({ ...selectedIncident, status });
    setInvestigationNotes('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded bg-teal-100 px-2 py-0.5 text-xs font-semibold uppercase tracking-wider text-teal-800 dark:bg-teal-950 dark:text-teal-300">
              HR & Regulatory Compliance
            </span>
            <span className="text-xs text-slate-400 font-mono">CQC & HIPAA Ready</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            Workforce Governance & Incident Safeguarding
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time tracking of DBS checks, mandatory care certifications, statutory safeguarding incidents, and policy acknowledgements.
          </p>
        </div>

        <button
          id="hr-log-incident-btn"
          onClick={onOpenIncidentModal}
          className="flex items-center gap-1.5 rounded-lg bg-red-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-red-700 transition-colors"
        >
          <AlertOctagon className="h-4 w-4" />
          <span>Log Safeguarding Incident</span>
        </button>
      </div>

      {/* Navigation Sub-tabs */}
      <div className="flex space-x-2 border-b border-slate-200 dark:border-slate-800 overflow-x-auto">
        {[
          { id: 'staff', label: 'Staff Directory & Profiles', count: staffList.length },
          { id: 'dbs', label: 'DBS & Training Matrix', count: dbsExpiringCount > 0 ? `${dbsExpiringCount} Alerts` : undefined, alert: dbsExpiringCount > 0 },
          { id: 'incidents', label: 'Incidents & Safeguarding', count: incidents.length },
          { id: 'policies', label: 'Policy Acknowledgements', count: policies.length },
          { id: 'vault', label: 'Secure Document Vault' }
        ].map((tab) => (
          <button
            key={tab.id}
            id={`hr-tab-${tab.id}`}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 border-b-2 py-2.5 px-3 text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-teal-600 text-teal-700 dark:border-teal-400 dark:text-teal-300'
                : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                  tab.alert
                    ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 font-bold'
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab 1: Staff Profiles Directory */}
      {activeTab === 'staff' && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search staff by name, role, department..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-4 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
            <span className="text-xs text-slate-400">
              Showing {filteredStaff.length} of {staffList.length} staff
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredStaff.map((staff) => (
              <div
                key={staff.id}
                onClick={() => setSelectedStaff(staff)}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-800 hover:border-teal-500/50 cursor-pointer transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={staff.avatar}
                      alt={staff.name}
                      className="h-12 w-12 rounded-xl object-cover ring-2 ring-slate-100 dark:ring-slate-700"
                    />
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                        {staff.name}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                        {staff.jobTitle}
                      </p>
                      <span className="inline-block mt-1 rounded bg-teal-50 px-1.5 py-0.2 text-[10px] font-semibold text-teal-800 dark:bg-teal-950 dark:text-teal-300">
                        {staff.department} • {staff.role}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      staff.dbsStatus === 'valid'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    }`}
                  >
                    DBS {staff.dbsStatus.replace('_', ' ')}
                  </span>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Rate / Hour</span>
                    <span className="font-bold">£{staff.hourlyRate.toFixed(2)}/h</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Contract Hours</span>
                    <span className="font-bold">{staff.contractedHours}h / week</span>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                  <span>{staff.certifications.length} Certifications on file</span>
                  <span className="text-teal-600 font-semibold">View Profile →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: DBS Expiry & Training Matrix */}
      {activeTab === 'dbs' && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-800">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700 mb-4">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                DBS & Mandatory Training Matrix
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Automated 60-day renewal warnings for Care Quality Commission audit readiness
              </p>
            </div>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              94.2% Fleet Compliance
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-400 uppercase font-semibold">
                  <th className="pb-3 pr-4">Staff Member</th>
                  <th className="pb-3 px-3">DBS Certificate #</th>
                  <th className="pb-3 px-3">DBS Expiry</th>
                  <th className="pb-3 px-3">Right To Work</th>
                  <th className="pb-3 px-3">Mandatory Training</th>
                  <th className="pb-3 pl-3 text-right">Renewal Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                {staffList.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30">
                    <td className="py-3 pr-4 font-semibold text-slate-900 dark:text-white">
                      <div>{s.name}</div>
                      <span className="text-[10px] text-slate-400">{s.jobTitle}</span>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-600 dark:text-slate-300">
                      {s.dbsCertificateNumber}
                    </td>
                    <td className="py-3 px-3 font-mono">
                      <span
                        className={
                          s.dbsStatus === 'expiring_soon'
                            ? 'text-amber-600 font-bold'
                            : 'text-slate-700 dark:text-slate-300'
                        }
                      >
                        {s.dbsExpiryDate}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Verified
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          s.mandatoryTrainingStatus === 'compliant'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        }`}
                      >
                        {s.mandatoryTrainingStatus.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 pl-3 text-right">
                      {s.dbsStatus === 'expiring_soon' ? (
                        <button
                          onClick={() => addToast('DBS Renewal Dispatched', `Alert sent to ${s.name} via email & SMS`, 'warning')}
                          className="rounded bg-amber-600 px-2 py-1 text-[10px] font-bold text-white hover:bg-amber-700"
                        >
                          Send Renewal Alert
                        </button>
                      ) : (
                        <span className="text-[11px] text-emerald-600 font-medium">Current</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Incidents & Safeguarding */}
      {activeTab === 'incidents' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {incidents.map((inc) => (
              <div
                key={inc.id}
                onClick={() => setSelectedIncident(inc)}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-800 hover:border-red-400/60 cursor-pointer transition-all"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="font-mono text-[10px] font-bold text-slate-400">
                    {inc.referenceNumber}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                      inc.severity === 'Critical'
                        ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 animate-pulse'
                        : inc.severity === 'High'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        : 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300'
                    }`}
                  >
                    {inc.severity}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 dark:text-white text-sm mt-2 line-clamp-1">
                  {inc.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                  {inc.description}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs text-slate-400">
                  <span>{inc.category}</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">{inc.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Policy Acknowledgements */}
      {activeTab === 'policies' && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-800">
          <div className="pb-3 border-b border-slate-100 dark:border-slate-700 mb-4">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Care Home Operational Policies & Statutory Handbooks
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Mandatory digital signatures tracked for every care practitioner and senior lead
            </p>
          </div>

          <div className="space-y-3">
            {policies.map((pol) => {
              const compliancePct = Math.round(
                (pol.acknowledgedStaffCount / (pol.totalTargetStaffCount || 1)) * 100
              );

              return (
                <div
                  key={pol.id}
                  className="rounded-xl border border-slate-200 p-4 text-xs dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/40 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1 max-w-xl">
                    <div className="flex items-center gap-2">
                      <span className="rounded bg-teal-100 px-1.5 py-0.2 text-[10px] font-bold text-teal-800 dark:bg-teal-950 dark:text-teal-300">
                        {pol.category}
                      </span>
                      <span className="font-mono text-slate-400">{pol.version}</span>
                    </div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">{pol.title}</h4>
                    <p className="text-slate-500 dark:text-slate-400">{pol.summary}</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="text-slate-400 block text-[10px]">Staff Signed</span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {pol.acknowledgedStaffCount} / {pol.totalTargetStaffCount} ({compliancePct}%)
                      </span>
                    </div>

                    <button
                      id={`ack-policy-btn-${pol.id}`}
                      onClick={() => acknowledgePolicy(pol.id)}
                      className="rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-teal-700"
                    >
                      Sign / Acknowledge
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 5: Secure Document Vault */}
      {activeTab === 'vault' && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-800">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700 mb-6">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                HIPAA & GDPR Compliant Care Document Vault
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                End-to-end encrypted storage for certificates, contracts, and CQC audit filings
              </p>
            </div>
            <button
              onClick={() => addToast('Document Uploaded', 'Encrypted file stored in CareVault', 'success')}
              className="flex items-center gap-1.5 rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-teal-700"
            >
              <Upload className="h-4 w-4" />
              <span>Upload Document</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { title: 'CQC Inspection Report 2026', type: 'Official Audit PDF', size: '2.4 MB', date: 'Yesterday' },
              { title: 'Fire Safety & Evacuation Map', type: 'Health & Safety Plan', size: '4.8 MB', date: 'Last week' },
              { title: 'Staff Immunization Register', type: 'Clinical Records', size: '1.1 MB', date: '2 weeks ago' },
              { title: 'Local Authority Contract SLA', type: 'Commercial Agreement', size: '3.0 MB', date: '1 month ago' },
              { title: 'Controlled Drugs Keyholder Register', type: 'Security Audit', size: '850 KB', date: 'Yesterday' },
              { title: 'Emergency Contingency Matrix', type: 'Operational Protocol', size: '1.6 MB', date: '3 days ago' }
            ].map((doc, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-slate-200 p-3.5 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/40 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <FileText className="h-8 w-8 text-teal-600" />
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-xs">{doc.title}</h4>
                    <p className="text-[11px] text-slate-400">{doc.type} • {doc.size}</p>
                  </div>
                </div>
                <button
                  onClick={() => addToast('Download Vault File', `Decrypted & downloaded ${doc.title}`, 'info')}
                  className="rounded px-2 py-1 text-xs font-semibold text-teal-600 hover:bg-teal-50 dark:text-teal-400"
                >
                  Download
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Staff Profile Inspector Modal */}
      {selectedStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-800 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={selectedStaff.avatar}
                  alt={selectedStaff.name}
                  className="h-14 w-14 rounded-2xl object-cover ring-2 ring-teal-500"
                />
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{selectedStaff.name}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{selectedStaff.jobTitle}</p>
                  <span className="rounded bg-teal-100 px-2 py-0.5 text-[10px] font-bold text-teal-800 dark:bg-teal-950 dark:text-teal-300">
                    {selectedStaff.department} • {selectedStaff.role}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedStaff(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                ✕
              </button>
            </div>

            <div className="mt-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-900/50">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Contact Email</span>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 truncate mt-0.5">
                    {selectedStaff.email}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-900/50">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Emergency Phone</span>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                    {selectedStaff.phone}
                  </p>
                </div>
              </div>

              {/* Certifications list */}
              <div>
                <span className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] block mb-2">
                  Verified Certifications & Competencies
                </span>
                <div className="space-y-2">
                  {selectedStaff.certifications.map((cert) => (
                    <div
                      key={cert.id}
                      className="rounded-lg border border-slate-200 p-2.5 dark:border-slate-700 flex items-center justify-between"
                    >
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">{cert.title}</div>
                        <div className="text-[10px] text-slate-400">
                          Valid until: {cert.expiryDate} (Completed {cert.completedDate})
                        </div>
                      </div>
                      <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[9px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        {cert.status.toUpperCase()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedStaff(null)}
                className="rounded-lg bg-teal-600 px-4 py-2 text-xs font-semibold text-white hover:bg-teal-700"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Incident Detail / Investigation Modal */}
      {selectedIncident && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-800 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between">
              <div>
                <span className="font-mono text-xs font-bold text-teal-600">
                  {selectedIncident.referenceNumber}
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                  {selectedIncident.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedIncident(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-900/50 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Resident / Service User:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {selectedIncident.clientOrResidentName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Location:</span>
                  <span>{selectedIncident.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Reported By:</span>
                  <span>{selectedIncident.reportedByStaffName}</span>
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-900 dark:text-white block mb-1">
                  Incident Narrative:
                </span>
                <p className="rounded-lg border border-slate-200 p-2.5 text-slate-700 dark:border-slate-700 dark:text-slate-300">
                  {selectedIncident.description}
                </p>
              </div>

              <div>
                <span className="font-bold text-slate-900 dark:text-white block mb-1">
                  Immediate Actions & Safeguarding Steps:
                </span>
                <p className="rounded-lg border border-slate-200 p-2.5 text-slate-700 dark:border-slate-700 dark:text-slate-300">
                  {selectedIncident.immediateActionsTaken}
                </p>
              </div>

              {isManager && (
                <div>
                  <label className="font-bold text-slate-900 dark:text-white block mb-1">
                    Manager Investigation Note:
                  </label>
                  <textarea
                    value={investigationNotes}
                    onChange={(e) => setInvestigationNotes(e.target.value)}
                    placeholder="Record findings, root-cause analysis, or preventative amendments..."
                    rows={2}
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  />

                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => handleUpdateStatus('Under Investigation')}
                      className="rounded bg-amber-600 px-3 py-1 text-white font-semibold"
                    >
                      Set Under Investigation
                    </button>
                    <button
                      onClick={() => handleUpdateStatus('Remediated')}
                      className="rounded bg-teal-600 px-3 py-1 text-white font-semibold"
                    >
                      Mark Remediated & Close
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedIncident(null)}
                className="rounded-lg bg-slate-200 px-4 py-1.5 text-xs font-semibold text-slate-800 hover:bg-slate-300 dark:bg-slate-700 dark:text-white"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
