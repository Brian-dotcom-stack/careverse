import React from 'react';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  CalendarDays,
  Clock,
  ShieldAlert,
  MessageSquare,
  BarChart3,
  Sparkles,
  AlertCircle
} from 'lucide-react';

export type NavTabId = 'workspace' | 'rota' | 'attendance' | 'hr' | 'comms' | 'analytics';

interface NavigationProps {
  activeTab: NavTabId;
  setActiveTab: (tab: NavTabId) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab }) => {
  const { t, incidents, shifts } = useApp();

  const openIncidentsCount = incidents.filter((i) => i.status === 'Open' || i.status === 'Under Investigation').length;
  const openShiftsCount = shifts.filter((s) => s.status === 'open' || s.isOpenBroadcast).length;

  const navItems: { id: NavTabId; label: string; icon: React.ComponentType<{ className?: string }>; badge?: number }[] = [
    {
      id: 'workspace',
      label: t('workspace'),
      icon: LayoutDashboard
    },
    {
      id: 'rota',
      label: t('smartRota'),
      icon: CalendarDays,
      badge: openShiftsCount > 0 ? openShiftsCount : undefined
    },
    {
      id: 'attendance',
      label: t('attendance'),
      icon: Clock
    },
    {
      id: 'hr',
      label: t('hrCompliance'),
      icon: ShieldAlert,
      badge: openIncidentsCount > 0 ? openIncidentsCount : undefined
    },
    {
      id: 'comms',
      label: t('communications'),
      icon: MessageSquare
    },
    {
      id: 'analytics',
      label: t('analytics'),
      icon: BarChart3
    }
  ];

  return (
    <nav className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-1 sm:space-x-4 overflow-x-auto py-2 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-tab-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`group relative flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-xs sm:text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-teal-600 dark:text-teal-400' : 'text-slate-400 group-hover:text-slate-600 dark:text-slate-500'}`} />
                <span>{item.label}</span>
                {item.badge !== undefined && (
                  <span
                    className={`ml-1 rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                      item.id === 'hr'
                        ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
                        : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
                {isActive && (
                  <span className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-teal-600 dark:bg-teal-400" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
