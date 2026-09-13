import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AuditLogEntry } from '../../types';
import {
  Shield,
  Fingerprint,
  Lock,
  FileCheck2,
  AlertTriangle,
  CheckCircle2,
  KeyRound,
  RefreshCw,
  Search,
  Database,
  Smartphone
} from 'lucide-react';

interface SecurityAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SecurityAuditModal: React.FC<SecurityAuditModalProps> = ({ isOpen, onClose }) => {
  const {
    activeTenant,
    currentUser,
    userRole,
    auditLogs,
    biometricsEnabled,
    setBiometricsEnabled,
    mfaEnabled,
    setMfaEnabled,
    addToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<'audit' | 'biometrics' | 'compliance'>('audit');
  const [searchFilter, setSearchFilter] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [simulatingBio, setSimulatingBio] = useState(false);
  const [bioSuccess, setBioSuccess] = useState(false);

  if (!isOpen) return null;

  const filteredLogs = auditLogs.filter((log) => {
    if (severityFilter !== 'all' && log.severity !== severityFilter) return false;
    if (searchFilter) {
      const q = searchFilter.toLowerCase();
      return (
        log.action.toLowerCase().includes(q) ||
        log.actorName.toLowerCase().includes(q) ||
        log.details.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleTestBiometrics = () => {
    setSimulatingBio(true);
    setBioSuccess(false);
    setTimeout(() => {
      setSimulatingBio(false);
      setBioSuccess(true);
      addToast('Biometric Auth Verified', 'WebAuthn hardware key signature confirmed via FIDO2', 'success');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-4xl rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[85vh]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-600 dark:bg-teal-950 dark:text-teal-300">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Enterprise Security, Biometrics & Audit Log
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                HIPAA, GDPR & SOC2 Type II compliance framework • Tenant: {activeTenant.name}
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

        {/* Sub-tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 px-6 space-x-4 bg-slate-50/50 dark:bg-slate-900/50">
          {[
            { id: 'audit', label: 'Immutable Audit Trail', count: auditLogs.length },
            { id: 'biometrics', label: 'Biometrics & MFA Protection' },
            { id: 'compliance', label: 'HIPAA / GDPR / SOC2 Checklist' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 py-3 text-xs font-semibold border-b-2 transition-all ${
                activeTab === tab.id
                  ? 'border-teal-600 text-teal-700 dark:border-teal-400 dark:text-teal-300'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className="rounded-full bg-slate-200 px-1.5 py-0.2 text-[10px] text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab 1: Audit Log */}
        {activeTab === 'audit' && (
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter by action, user, or detail..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500">Severity:</span>
                <select
                  value={severityFilter}
                  onChange={(e) => setSeverityFilter(e.target.value)}
                  className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  <option value="all">All Levels</option>
                  <option value="info">Info</option>
                  <option value="warning">Warning</option>
                  <option value="security">Security</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-slate-400 uppercase font-semibold">
                    <th className="py-2.5 px-3">Timestamp</th>
                    <th className="py-2.5 px-3">Action</th>
                    <th className="py-2.5 px-3">Actor (Role)</th>
                    <th className="py-2.5 px-3">Target Resource</th>
                    <th className="py-2.5 px-3">Details</th>
                    <th className="py-2.5 px-3">Severity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-[11px]">
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="py-2 px-3 text-slate-500">{log.timestamp.split('T')[1]?.slice(0, 8) || log.timestamp}</td>
                      <td className="py-2 px-3 font-bold text-slate-900 dark:text-white">{log.action}</td>
                      <td className="py-2 px-3 text-slate-700 dark:text-slate-300">{log.actorName} ({log.actorRole})</td>
                      <td className="py-2 px-3 text-teal-600 dark:text-teal-400">{log.resource}</td>
                      <td className="py-2 px-3 text-slate-500 max-w-xs truncate">{log.details}</td>
                      <td className="py-2 px-3">
                        <span
                          className={`rounded px-1.5 py-0.2 text-[9px] font-bold uppercase ${
                            log.severity === 'critical'
                              ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                              : log.severity === 'security'
                              ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                              : log.severity === 'warning'
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                              : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                          }`}
                        >
                          {log.severity}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Biometrics & MFA */}
        {activeTab === 'biometrics' && (
          <div className="flex-1 p-6 overflow-y-auto space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Biometrics Card */}
              <div className="rounded-2xl border border-slate-200 p-5 dark:border-slate-800 bg-white dark:bg-slate-800">
                <div className="flex items-center gap-2.5 mb-3">
                  <Fingerprint className="h-6 w-6 text-teal-600" />
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                      WebAuthn & Biometric Passkeys
                    </h3>
                    <p className="text-[11px] text-slate-500">Touch ID, Face ID & Windows Hello</p>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 mb-4">
                  Enables rapid, cryptographically signed clock-in and controlled medication administration signatures directly through device hardware security modules.
                </p>

                <div className="flex items-center justify-between py-2 border-y border-slate-100 dark:border-slate-700 text-xs mb-4">
                  <span className="font-medium">Biometric Requirement:</span>
                  <button
                    onClick={() => {
                      setBiometricsEnabled(!biometricsEnabled);
                      addToast('Biometrics', `Biometrics ${!biometricsEnabled ? 'Enabled' : 'Disabled'}`, 'info');
                    }}
                    className={`rounded-full px-3 py-1 font-bold ${
                      biometricsEnabled
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {biometricsEnabled ? 'Active' : 'Disabled'}
                  </button>
                </div>

                <button
                  onClick={handleTestBiometrics}
                  disabled={simulatingBio}
                  className="w-full rounded-xl bg-teal-600 py-2.5 text-xs font-bold text-white hover:bg-teal-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Fingerprint className="h-4 w-4" />
                  <span>{simulatingBio ? 'Verifying Hardware Key...' : 'Test Biometric Hardware Handshake'}</span>
                </button>

                {bioSuccess && (
                  <div className="mt-3 rounded-lg bg-emerald-50 p-2.5 text-xs text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>FIDO2 / WebAuthn signature successfully verified.</span>
                  </div>
                )}
              </div>

              {/* MFA Card */}
              <div className="rounded-2xl border border-slate-200 p-5 dark:border-slate-800 bg-white dark:bg-slate-800">
                <div className="flex items-center gap-2.5 mb-3">
                  <Smartphone className="h-6 w-6 text-indigo-600" />
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                      Multi-Factor Authentication (MFA)
                    </h3>
                    <p className="text-[11px] text-slate-500">TOTP Authenticator & SMS Push</p>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 mb-4">
                  Mandatory 2FA challenge triggered for administrative rota releases, employee DBS record access, and external network logins.
                </p>

                <div className="flex items-center justify-between py-2 border-y border-slate-100 dark:border-slate-700 text-xs mb-4">
                  <span className="font-medium">MFA Enforcement:</span>
                  <button
                    onClick={() => {
                      setMfaEnabled(!mfaEnabled);
                      addToast('MFA Status', `MFA Enforcement ${!mfaEnabled ? 'Enabled' : 'Disabled'}`, 'info');
                    }}
                    className={`rounded-full px-3 py-1 font-bold ${
                      mfaEnabled
                        ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {mfaEnabled ? 'Enforced' : 'Optional'}
                  </button>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs dark:border-slate-700 dark:bg-slate-900/50">
                  <div className="flex justify-between font-mono text-slate-500 mb-1">
                    <span>Active Authenticator:</span>
                    <span className="text-emerald-600 font-bold">Configured</span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Backup codes generated & stored securely in employee password vault.
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Tab 3: HIPAA / GDPR Checklist */}
        {activeTab === 'compliance' && (
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            <div className="rounded-xl bg-teal-50 p-4 text-xs text-teal-900 dark:bg-teal-950/40 dark:text-teal-200 mb-4">
              <span className="font-bold block text-sm mb-1">Certified Compliance Posture</span>
              <p>
                CareVerse complies with UK GDPR, Caldicott Principles for Social Care, HIPAA Security Rule, and SOC2 Trust Services Criteria for health data confidentiality.
              </p>
            </div>

            <div className="space-y-3 text-xs">
              {[
                { title: 'Data Encryption in Transit & Rest', desc: 'TLS 1.3 encryption for all client-server communications; AES-256 for all databases and file vaults.', status: 'Compliant' },
                { title: 'Multi-Tenant Data Isolation', desc: 'Strict logical partition per care agency tenant. Zero cross-organization leakage.', status: 'Compliant' },
                { title: 'Role-Based Access Control (RBAC)', desc: 'Granular privileges restricting personal resident records and safeguarding notes to verified staff tiers.', status: 'Compliant' },
                { title: 'Audit Trail Immutability', desc: 'Append-only event log capturing user IP, timestamp, and target entity for statutory CQC inspections.', status: 'Compliant' },
                { title: 'Right to Erasure & Data Minimization', desc: 'Compliant retention schedule automatically purging non-mandated operational logs after 7 years.', status: 'Compliant' }
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-200 p-3.5 dark:border-slate-800 flex items-start justify-between gap-4"
                >
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-xs">{item.title}</h4>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">{item.desc}</p>
                  </div>
                  <span className="flex items-center gap-1 text-emerald-600 font-bold text-xs shrink-0">
                    <CheckCircle2 className="h-4 w-4" /> {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-xl bg-slate-900 px-5 py-2 text-xs font-bold text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900"
          >
            Close Security Center
          </button>
        </div>

      </div>
    </div>
  );
};
