import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole, SupportedLanguage } from '../types';
import {
  Building2,
  Clock,
  Shield,
  Wifi,
  WifiOff,
  Moon,
  Sun,
  Globe,
  AlertTriangle,
  Fingerprint,
  FileCode2,
  ChevronDown,
  CheckCircle2
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
    isClockedIn,
    activeClockRecord,
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
  const [showUserMenu, setShowUserMenu] = useState(false);

  const tenantMenuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tenantMenuRef.current && !tenantMenuRef.current.contains(event.target as Node)) {
        setShowTenantMenu(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const roles: UserRole[] = ['Admin', 'HR', 'Manager', 'Senior', 'Staff'];

  return (
    <header className="sticky top-0 z-30 w-full border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95 transition-colors">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8">
        
        {/* Left: Minimalist Brand & Organization Selector */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-600 text-white shadow-xs">
              <Building2 className="h-4 w-4" />
            </div>
            <span className="font-bold tracking-tight text-slate-900 text-base dark:text-white">
              CareVerse
            </span>
          </div>

          <span className="text-slate-300 dark:text-slate-700">/</span>

          {/* Minimal Organization Selector */}
          <div className="relative" ref={tenantMenuRef}>
            <button
              id="tenant-switcher-button"
              onClick={() => {
                setShowTenantMenu(!showTenantMenu);
                setShowUserMenu(false);
              }}
              className="flex items-center gap-1.5 rounded-lg py-1 px-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
              title="Switch Organization"
            >
              <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
              <span className="max-w-[100px] sm:max-w-[180px] md:max-w-[220px] truncate">
                {activeTenant.name}
              </span>
              <ChevronDown className="h-3 w-3 text-slate-400 shrink-0" />
            </button>

            {showTenantMenu && (
              <div className="absolute left-0 mt-1.5 w-72 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl dark:border-slate-800 dark:bg-slate-800 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Switch Care Organization
                </div>
                {tenants.map((tItem) => (
                  <button
                    key={tItem.id}
                    onClick={() => {
                      setActiveTenantId(tItem.id);
                      setShowTenantMenu(false);
                    }}
                    className={`flex w-full items-start gap-2.5 rounded-lg p-2 text-left text-xs transition-colors ${
                      tItem.id === activeTenant.id
                        ? 'bg-teal-50 font-semibold text-teal-900 dark:bg-teal-950/50 dark:text-teal-200'
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
                      <p className="text-[11px] text-slate-400">{tItem.sector}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Minimalist Controls (Theme Toggle, Clock In Pill, User Menu) */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          
          {/* Night / Light Mode Toggle Button */}
          <button
            id="theme-toggle-btn"
            onClick={toggleDarkMode}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition-all cursor-pointer"
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Night Mode'}
            aria-label="Toggle theme"
          >
            {darkMode ? (
              <Sun className="h-4 w-4 text-amber-400" />
            ) : (
              <Moon className="h-4 w-4 text-slate-600 dark:text-slate-300" />
            )}
          </button>

          {/* Clock In / Out Pill */}
          <button
            id="header-clock-action-btn"
            onClick={onOpenClockModal}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 sm:px-3 py-1.5 text-xs font-semibold shadow-xs transition-all cursor-pointer ${
              isClockedIn
                ? 'bg-amber-600 text-white hover:bg-amber-700'
                : 'bg-teal-600 text-white hover:bg-teal-700'
            }`}
          >
            <Clock className="h-3.5 w-3.5" />
            <span>
              {isClockedIn
                ? activeClockRecord?.clockInTime
                  ? `Clocked In (${activeClockRecord.clockInTime})`
                  : 'Clocked In'
                : t('clockIn')}
            </span>
          </button>

          {/* User Profile & Unified Workspace Tools Menu */}
          <div className="relative" ref={userMenuRef}>
            <button
              id="workspace-user-menu-btn"
              onClick={() => {
                setShowUserMenu(!showUserMenu);
                setShowTenantMenu(false);
              }}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white p-1 sm:pr-2 text-xs hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800/90 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Workspace Menu, RBAC & Settings"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="h-6 w-6 rounded-md object-cover ring-1 ring-teal-500/40 shrink-0"
              />
              <span className="hidden sm:inline-block font-semibold text-slate-800 dark:text-slate-200 max-w-[80px] truncate">
                {currentUser.name.split(' ')[0]}
              </span>
              <span className="rounded bg-teal-100 px-1 py-0.2 text-[10px] font-bold text-teal-800 dark:bg-teal-950 dark:text-teal-300">
                {userRole}
              </span>
              <ChevronDown className="h-3 w-3 text-slate-400 shrink-0" />
            </button>

            {/* Unified Workspace Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-1.5 w-80 rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl dark:border-slate-800 dark:bg-slate-900 z-50 animate-in fade-in slide-in-from-top-2 duration-150 space-y-3">
                {/* User Info Header */}
                <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="h-10 w-10 rounded-xl object-cover ring-2 ring-teal-500"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-xs text-slate-900 dark:text-white truncate">
                      {currentUser.name}
                    </div>
                    <div className="text-[11px] text-slate-400 truncate">
                      {currentUser.jobTitle}
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="rounded bg-teal-100 px-1.5 py-0.2 text-[9px] font-bold text-teal-800 dark:bg-teal-950 dark:text-teal-300">
                        {userRole} Role
                      </span>
                      <span className={`text-[9px] font-medium px-1 rounded ${
                        userRole === 'Admin' || userRole === 'Manager'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                      }`}>
                        {userRole === 'Admin' || userRole === 'Manager' ? 'Rota Editor' : 'Rota View Only'}
                      </span>
                      <span className="text-[10px] text-slate-400">• {activeTenant.code}</span>
                    </div>
                  </div>
                </div>

                {/* RBAC Role Selector */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Simulate RBAC Access
                    </span>
                    <span className="text-[9px] text-slate-400">
                      {userRole === 'Admin' || userRole === 'Manager' ? 'Can Edit Rota' : 'View-Only Rota'}
                    </span>
                  </div>
                  <div className="grid grid-cols-5 gap-1">
                    {roles.map((r) => (
                      <button
                        key={r}
                        onClick={() => setUserRole(r)}
                        title={r === 'Admin' || r === 'Manager' ? `${r}: Can edit & generate rotas` : `${r}: View-only rota`}
                        className={`rounded-md py-1 text-[11px] font-semibold text-center transition-colors cursor-pointer ${
                          userRole === r
                            ? 'bg-teal-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                  <p className="mt-1 text-[10px] text-slate-400 italic">
                    * Only Admin & Manager can edit or generate rotas. Staff is view-only.
                  </p>
                </div>

                {/* Staff Profile Switcher */}
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Impersonate Staff Profile
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {staffList.slice(0, 6).map((s) => (
                      <button
                        key={s.id}
                        onClick={() => {
                          switchUser(s.id);
                          setShowUserMenu(false);
                        }}
                        className={`flex items-center gap-1.5 rounded-lg p-1.5 text-xs text-left border cursor-pointer ${
                          currentUser.id === s.id
                            ? 'border-teal-500 bg-teal-50/70 font-semibold text-teal-950 dark:bg-teal-950/40 dark:text-teal-200 dark:border-teal-600'
                            : 'border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-800/80 dark:text-slate-300'
                        }`}
                      >
                        <img src={s.avatar} alt={s.name} className="h-5 w-5 rounded-full object-cover shrink-0" />
                        <div className="min-w-0 flex-1 truncate">
                          <div className="font-medium text-[11px] truncate">{s.name.split(',')[0]}</div>
                          <div className="text-[9px] text-slate-400 flex items-center justify-between">
                            <span>{s.role}</span>
                            <span className={s.role === 'Admin' || s.role === 'Manager' ? 'text-teal-600 dark:text-teal-400 font-semibold' : 'text-slate-400'}>
                              {s.role === 'Admin' || s.role === 'Manager' ? 'Edit' : 'View'}
                            </span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Operational Quick Actions */}
                <div className="space-y-1 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Care Operations & Specs
                  </div>

                  <button
                    onClick={() => {
                      onOpenIncidentModal();
                      setShowUserMenu(false);
                    }}
                    className="flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs text-red-700 hover:bg-red-50 dark:text-red-300 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <AlertTriangle className="h-3.5 w-3.5 text-red-500" />
                      <span>Log Care Incident / Safeguarding</span>
                    </span>
                    <span className="text-[10px] font-semibold uppercase">Alert</span>
                  </button>

                  <button
                    onClick={toggleOfflineMode}
                    className="flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      {offlineMode ? <WifiOff className="h-3.5 w-3.5 text-amber-500" /> : <Wifi className="h-3.5 w-3.5 text-emerald-500" />}
                      <span>Offline Operations Mode</span>
                    </span>
                    <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded ${
                      offlineMode ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' : 'text-slate-400'
                    }`}>
                      {offlineMode ? `${syncQueue} Queued` : 'Cloud Active'}
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      onOpenSecurityModal();
                      setShowUserMenu(false);
                    }}
                    className="flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <Fingerprint className="h-3.5 w-3.5 text-teal-600" />
                      <span>Security & Biometrics Center</span>
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">SOC2 / HIPAA</span>
                  </button>

                  <button
                    onClick={() => {
                      onOpenDocsModal();
                      setShowUserMenu(false);
                    }}
                    className="flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <FileCode2 className="h-3.5 w-3.5 text-indigo-500" />
                      <span>System Specs & PostgreSQL Schema</span>
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">Prisma</span>
                  </button>
                </div>

                {/* Language Selector in Dropdown */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                    <Globe className="h-3.5 w-3.5" />
                    <span>Language:</span>
                  </div>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
                    className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 cursor-pointer"
                  >
                    <option value="en">English (EN)</option>
                    <option value="es">Español (ES)</option>
                    <option value="fr">Français (FR)</option>
                    <option value="pl">Polski (PL)</option>
                    <option value="tl">Tagalog (TL)</option>
                  </select>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
