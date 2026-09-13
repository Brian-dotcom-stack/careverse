import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole, StaffPresenceStatus, SupportedLanguage } from '../types';
import {
  Building2,
  Clock,
  Shield,
  Wifi,
  WifiOff,
  Moon,
  Sun,
  Globe,
  Bell,
  CheckCircle2,
  AlertTriangle,
  Fingerprint,
  FileCode2,
  ChevronDown,
  UserCheck,
  Radio,
  MapPin
} from 'lucide-react';

interface HeaderProps {
  onOpenClockModal: () => void;
  onOpenSecurityModal: () => void;
  onOpenDocsModal: () => void;
  onOpenIncidentModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenClockModal,
  onOpenSecurityModal,
  onOpenDocsModal,
  onOpenIncidentModal
}) => {
  const {
    tenants,
    activeTenant,
    setActiveTenantId,
    currentUser,
    userRole,
    setUserRole,
    staffList,
    switchUser,
    updatePresence,
    isClockedIn,
    activeClockRecord,
    safeStaffingAnalysis,
    offlineMode,
    toggleOfflineMode,
    syncQueue,
    language,
    setLanguage,
    darkMode,
    toggleDarkMode,
    t
  } = useApp();

  const [showTenantMenu, setShowTenantMenu] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showPresenceMenu, setShowPresenceMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);

  const roles: UserRole[] = ['Admin', 'HR', 'Manager', 'Senior', 'Staff'];

  const presenceConfig: Record<StaffPresenceStatus, { label: string; color: string; bg: string }> = {
    at_desk: { label: 'At Desk', color: 'text-blue-500', bg: 'bg-blue-500' },
    on_rounds: { label: 'On Rounds', color: 'text-emerald-500', bg: 'bg-emerald-500' },
    in_huddle: { label: 'In Huddle', color: 'text-purple-500', bg: 'bg-purple-500' },
    on_break: { label: 'On Break', color: 'text-amber-500', bg: 'bg-amber-500' },
    in_training: { label: 'In Training', color: 'text-indigo-500', bg: 'bg-indigo-500' },
    off_duty: { label: 'Off Duty', color: 'text-slate-400', bg: 'bg-slate-400' }
  };

  const currentPresence = presenceConfig[currentUser.presenceStatus] || presenceConfig.at_desk;

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95 transition-colors">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Left: Brand + Multi-Tenant Switcher */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-600 text-white shadow-sm ring-1 ring-teal-500/30">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold tracking-tight text-slate-900 text-lg dark:text-white">CareVerse</span>
                <span className="rounded bg-teal-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-teal-800 dark:bg-teal-950 dark:text-teal-300">
                  Virtual HQ
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-none">
                Care Operations & Workforce OS
              </p>
            </div>
          </div>

          <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block" />

          {/* Tenant Selector */}
          <div className="relative">
            <button
              id="tenant-switcher-button"
              onClick={() => setShowTenantMenu(!showTenantMenu)}
              className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-800 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 transition-colors"
              title="Switch Organization / Tenant"
            >
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="max-w-[150px] truncate font-semibold sm:max-w-[200px]">
                {activeTenant.name}
              </span>
              <span className="rounded bg-slate-200 px-1 py-0.2 text-[9px] font-mono text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                {activeTenant.sector}
              </span>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </button>

            {showTenantMenu && (
              <div className="absolute left-0 mt-1.5 w-72 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl dark:border-slate-800 dark:bg-slate-800 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Active Care Organizations (Multi-Tenant)
                </div>
                {tenants.map((tItem) => (
                  <button
                    key={tItem.id}
                    id={`tenant-option-${tItem.id}`}
                    onClick={() => {
                      setActiveTenantId(tItem.id);
                      setShowTenantMenu(false);
                    }}
                    className={`flex w-full items-start gap-2.5 rounded-lg p-2 text-left text-xs transition-colors ${
                      tItem.id === activeTenant.id
                        ? 'bg-teal-50 font-medium text-teal-900 dark:bg-teal-950/50 dark:text-teal-200'
                        : 'text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-700/50'
                    }`}
                  >
                    <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-teal-600 dark:text-teal-400" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium truncate">{tItem.name}</span>
                        <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                          {tItem.cqcRating}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">{tItem.sector} • {tItem.activeStaffCount} staff</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Center: Live Safe Staffing & Geofence Status */}
        <div className="hidden lg:flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/70 px-3 py-1 text-xs text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="font-semibold">Safe Staffing:</span>
            <span>{safeStaffingAnalysis.seniorsOnDuty} Senior • {safeStaffingAnalysis.carersOnDuty} Carers</span>
            <span className="rounded bg-emerald-200/80 px-1 py-0.2 text-[10px] font-bold uppercase text-emerald-900 dark:bg-emerald-900 dark:text-emerald-100">
              CQC Safe
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <MapPin className="h-3.5 w-3.5 text-teal-600" />
            <span>Geofence: <strong>{activeTenant.geofenceRadiusMeters}m</strong> active</span>
          </div>
        </div>

        {/* Right: Quick Clock, Role Switcher, Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Clock In / Out Button */}
          <button
            id="header-clock-action-btn"
            onClick={onOpenClockModal}
            className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold shadow-sm transition-all ${
              isClockedIn
                ? 'bg-amber-600 text-white hover:bg-amber-700 ring-2 ring-amber-400/30'
                : 'bg-teal-600 text-white hover:bg-teal-700 ring-2 ring-teal-500/30'
            }`}
          >
            <Clock className="h-3.5 w-3.5" />
            <span>{isClockedIn ? `Clocked In (${activeClockRecord?.clockInTime})` : t('clockIn')}</span>
          </button>

          {/* Quick Incident Log */}
          <button
            id="header-incident-btn"
            onClick={onOpenIncidentModal}
            className="hidden sm:flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50/70 px-2.5 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-300 transition-colors"
            title="Log Care Incident or Safeguarding Alert"
          >
            <AlertTriangle className="h-3.5 w-3.5 text-red-600" />
            <span>Log Incident</span>
          </button>

          {/* Role Switcher (RBAC) */}
          <div className="relative">
            <button
              id="rbac-role-switcher-btn"
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs font-semibold text-slate-800 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 transition-colors"
              title="Switch RBAC Role Simulation"
            >
              <Shield className="h-3.5 w-3.5 text-teal-600" />
              <span className="hidden md:inline text-slate-500 dark:text-slate-400 font-normal">Role:</span>
              <span className="rounded bg-teal-100 px-1.5 py-0.5 text-[10px] text-teal-800 dark:bg-teal-950 dark:text-teal-300">
                {userRole}
              </span>
              <ChevronDown className="h-3 w-3 text-slate-400" />
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 mt-1.5 w-52 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl dark:border-slate-800 dark:bg-slate-800 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Role-Based Access Control (RBAC)
                </div>
                {roles.map((r) => (
                  <button
                    key={r}
                    id={`rbac-option-${r}`}
                    onClick={() => {
                      setUserRole(r);
                      setShowRoleMenu(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs transition-colors ${
                      userRole === r
                        ? 'bg-teal-50 font-bold text-teal-900 dark:bg-teal-950/60 dark:text-teal-200'
                        : 'text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-700/50'
                    }`}
                  >
                    <span>{r}</span>
                    {userRole === r && <CheckCircle2 className="h-3.5 w-3.5 text-teal-600" />}
                  </button>
                ))}

                <div className="my-1 border-t border-slate-200 dark:border-slate-700" />
                <div className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Impersonate Staff Profile
                </div>
                {staffList.slice(0, 4).map((s) => (
                  <button
                    key={s.id}
                    id={`switch-staff-${s.id}`}
                    onClick={() => {
                      switchUser(s.id);
                      setShowRoleMenu(false);
                    }}
                    className={`flex w-full items-center gap-2 rounded-lg px-2 py-1 text-xs text-left ${
                      currentUser.id === s.id
                        ? 'bg-slate-100 font-medium text-slate-900 dark:bg-slate-700 dark:text-white'
                        : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700/30'
                    }`}
                  >
                    <img src={s.avatar} alt={s.name} className="h-5 w-5 rounded-full object-cover" />
                    <div className="min-w-0 flex-1 truncate">
                      <div className="font-medium text-[11px] truncate">{s.name}</div>
                      <div className="text-[10px] text-slate-400 truncate">{s.jobTitle}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Presence Dropdown */}
          <div className="relative hidden sm:block">
            <button
              id="presence-toggle-btn"
              onClick={() => setShowPresenceMenu(!showPresenceMenu)}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 transition-colors"
              title="Change Virtual Presence"
            >
              <div className={`h-2.5 w-2.5 rounded-full ${currentPresence.bg}`} />
              <span className="hidden xl:inline">{currentPresence.label}</span>
              <ChevronDown className="h-3 w-3 text-slate-400" />
            </button>

            {showPresenceMenu && (
              <div className="absolute right-0 mt-1.5 w-48 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl dark:border-slate-800 dark:bg-slate-800 z-50">
                <div className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Virtual Presence Status
                </div>
                {(Object.keys(presenceConfig) as StaffPresenceStatus[]).map((statusKey) => {
                  const conf = presenceConfig[statusKey];
                  return (
                    <button
                      key={statusKey}
                      id={`presence-option-${statusKey}`}
                      onClick={() => {
                        updatePresence(statusKey);
                        setShowPresenceMenu(false);
                      }}
                      className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-700/50"
                    >
                      <div className={`h-2.5 w-2.5 rounded-full ${conf.bg}`} />
                      <span>{conf.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Offline Mode Toggle & Queue */}
          <button
            id="offline-mode-toggle-btn"
            onClick={toggleOfflineMode}
            className={`relative flex items-center gap-1 rounded-lg p-1.5 text-xs transition-colors ${
              offlineMode
                ? 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300'
                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
            }`}
            title={offlineMode ? `Offline Mode (Sync queue: ${syncQueue})` : 'Connected to Cloud'}
          >
            {offlineMode ? <WifiOff className="h-4 w-4" /> : <Wifi className="h-4 w-4 text-emerald-600" />}
            {syncQueue > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-600 text-[9px] font-bold text-white">
                {syncQueue}
              </span>
            )}
          </button>

          {/* Security & Audit Modal Link */}
          <button
            id="header-security-audit-btn"
            onClick={onOpenSecurityModal}
            className="flex items-center rounded-lg p-1.5 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
            title="HIPAA, GDPR & Biometric Security Center"
          >
            <Fingerprint className="h-4 w-4 text-teal-600" />
          </button>

          {/* Architecture Docs Button */}
          <button
            id="header-architecture-btn"
            onClick={onOpenDocsModal}
            className="flex items-center rounded-lg p-1.5 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
            title="CareVerse System Architecture, Database & API Specs"
          >
            <FileCode2 className="h-4 w-4 text-indigo-600" />
          </button>

          {/* Dark Mode Toggle */}
          <button
            id="theme-toggle-btn"
            onClick={toggleDarkMode}
            className="flex items-center rounded-lg p-1.5 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
            title="Toggle Theme"
          >
            {darkMode ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4" />}
          </button>

          {/* Multi-Language Dropdown */}
          <div className="relative">
            <button
              id="language-switcher-btn"
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="flex items-center gap-1 rounded-lg border border-slate-200 px-1.5 py-1 text-xs uppercase font-mono font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              title="Change Interface Language"
            >
              <Globe className="h-3 w-3" />
              <span>{language}</span>
            </button>
            {showLangMenu && (
              <div className="absolute right-0 mt-1.5 w-32 rounded-xl border border-slate-200 bg-white p-1 shadow-xl dark:border-slate-800 dark:bg-slate-800 z-50">
                {[
                  { code: 'en', label: 'English' },
                  { code: 'es', label: 'Español' },
                  { code: 'fr', label: 'Français' },
                  { code: 'pl', label: 'Polski' },
                  { code: 'tl', label: 'Tagalog' }
                ].map((item) => (
                  <button
                    key={item.code}
                    id={`lang-option-${item.code}`}
                    onClick={() => {
                      setLanguage(item.code as SupportedLanguage);
                      setShowLangMenu(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-md px-2 py-1 text-xs ${
                      language === item.code ? 'font-bold text-teal-600' : 'text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    <span>{item.label}</span>
                    <span className="text-[10px] uppercase font-mono text-slate-400">{item.code}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* User Profile Thumbnail */}
          <div className="flex items-center gap-2 pl-1 border-l border-slate-200 dark:border-slate-700">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="h-8 w-8 rounded-full ring-2 ring-teal-500/40 object-cover"
            />
          </div>

        </div>
      </div>
    </header>
  );
};
