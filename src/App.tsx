import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Navigation, NavTabId } from './components/Navigation';
import { VirtualOfficeHub } from './components/workspace/VirtualOfficeHub';
import { SmartRotaEngine } from './components/rota/SmartRotaEngine';
import { AttendanceTracker } from './components/attendance/AttendanceTracker';
import { HRComplianceSuite } from './components/hr/HRComplianceSuite';
import { CommunicationLayer } from './components/comms/CommunicationLayer';
import { AnalyticsDashboard } from './components/analytics/AnalyticsDashboard';

// Modals
import { ClockInModal } from './components/modals/ClockInModal';
import { SecurityAuditModal } from './components/security/SecurityAuditModal';
import { ArchitectureViewerModal } from './components/docs/ArchitectureViewerModal';
import { IncidentReportModal } from './components/modals/IncidentReportModal';
import { AutoRotaModal } from './components/modals/AutoRotaModal';

import {
  Shield,
  WifiOff,
  CheckCircle2,
  AlertTriangle,
  Info,
  X,
  RefreshCw,
  Server,
  Layers,
  Sparkles
} from 'lucide-react';

const MainAppContent: React.FC = () => {
  const {
    activeTenant,
    offlineMode,
    syncQueue,
    toasts,
    removeToast,
    isClockedIn,
    activeClockRecord
  } = useApp();

  const [activeTab, setActiveTab] = useState<NavTabId>('workspace');

  // Modal visibility states
  const [showClockModal, setShowClockModal] = useState(false);
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [showDocsModal, setShowDocsModal] = useState(false);
  const [showIncidentModal, setShowIncidentModal] = useState(false);
  const [showAutoRotaModal, setShowAutoRotaModal] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 flex flex-col font-sans antialiased selection:bg-teal-500 selection:text-white transition-colors">
      
      {/* Offline Mode Warning Banner */}
      {offlineMode && (
        <div className="bg-amber-600 px-4 py-2 text-center text-xs font-semibold text-white flex items-center justify-center gap-2 shadow-sm animate-pulse z-40">
          <WifiOff className="h-4 w-4" />
          <span>
            Offline Operations Mode Active — Changes are queued in local IndexedDB storage ({syncQueue} transactions pending auto-sync when online reconnects).
          </span>
        </div>
      )}

      {/* Primary Global Navigation Header */}
      <Header
        onOpenClockModal={() => setShowClockModal(true)}
        onOpenSecurityModal={() => setShowSecurityModal(true)}
        onOpenDocsModal={() => setShowDocsModal(true)}
        onOpenIncidentModal={() => setShowIncidentModal(true)}
      />

      {/* Module Tabs Navigation Bar */}
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Workspace Container */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'workspace' && (
          <VirtualOfficeHub
            onOpenClockModal={() => setShowClockModal(true)}
            onOpenIncidentModal={() => setShowIncidentModal(true)}
            onNavigateToRota={() => setActiveTab('rota')}
            onOpenAutoRota={() => setShowAutoRotaModal(true)}
          />
        )}

        {activeTab === 'rota' && (
          <SmartRotaEngine
            onOpenAutoRotaModal={() => setShowAutoRotaModal(true)}
          />
        )}

        {activeTab === 'attendance' && (
          <AttendanceTracker />
        )}

        {activeTab === 'hr' && (
          <HRComplianceSuite
            onOpenIncidentModal={() => setShowIncidentModal(true)}
          />
        )}

        {activeTab === 'comms' && (
          <CommunicationLayer />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsDashboard />
        )}
      </main>

      {/* Bottom Production Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-900 transition-colors">
        <div className="mx-auto flex max-w-7xl flex-col sm:flex-row items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 dark:text-white">CareVerse Platform</span>
            <span className="text-slate-400">v2.4.0 • Enterprise SaaS</span>
            <span className="rounded bg-teal-50 px-1.5 py-0.2 text-[10px] font-bold text-teal-800 dark:bg-teal-950 dark:text-teal-300">
              Multi-Tenant ({activeTenant.name})
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400">
            <button
              onClick={() => setShowSecurityModal(true)}
              className="hover:text-teal-600 transition-colors flex items-center gap-1"
            >
              <Shield className="h-3.5 w-3.5 text-emerald-500" />
              <span>HIPAA / GDPR / SOC2 Certified</span>
            </button>

            <button
              onClick={() => setShowDocsModal(true)}
              className="hover:text-teal-600 transition-colors flex items-center gap-1"
            >
              <Server className="h-3.5 w-3.5 text-indigo-500" />
              <span>Architecture & API Specs</span>
            </button>

            <span>CQC Inspection Safe</span>
          </div>
        </div>
      </footer>

      {/* Global Modals */}
      <ClockInModal
        isOpen={showClockModal}
        onClose={() => setShowClockModal(false)}
      />

      <SecurityAuditModal
        isOpen={showSecurityModal}
        onClose={() => setShowSecurityModal(false)}
      />

      <ArchitectureViewerModal
        isOpen={showDocsModal}
        onClose={() => setShowDocsModal(false)}
      />

      <IncidentReportModal
        isOpen={showIncidentModal}
        onClose={() => setShowIncidentModal(false)}
      />

      <AutoRotaModal
        isOpen={showAutoRotaModal}
        onClose={() => setShowAutoRotaModal(false)}
      />

      {/* Floating Toast Notification Container */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto rounded-xl border p-3.5 shadow-xl transition-all duration-200 flex items-start gap-3 text-xs animate-in slide-in-from-bottom-3 ${
              toast.type === 'success'
                ? 'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900/60 dark:bg-emerald-950 dark:text-emerald-200'
                : toast.type === 'warning'
                ? 'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900/60 dark:bg-amber-950 dark:text-amber-200'
                : toast.type === 'error'
                ? 'border-red-200 bg-red-50 text-red-900 dark:border-red-900/60 dark:bg-red-950 dark:text-red-200'
                : 'border-slate-200 bg-white text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white'
            }`}
          >
            {toast.type === 'success' && <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />}
            {toast.type === 'warning' && <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />}
            {toast.type === 'error' && <AlertTriangle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />}
            {toast.type === 'info' && <Info className="h-4 w-4 text-teal-600 shrink-0 mt-0.5" />}

            <div className="flex-1">
              <div className="font-bold">{toast.title}</div>
              <div className="text-[11px] opacity-90 mt-0.5">{toast.message}</div>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 p-0.5 -mr-1 -mt-1"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>

    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
