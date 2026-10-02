import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TenantOrganization, CareSector } from '../../types';
import {
  Building2,
  MapPin,
  CheckCircle2,
  Search,
  X,
  Users,
  Bed,
  ShieldCheck,
  Compass,
  Layers,
  ArrowRight,
  Phone,
  UserCheck
} from 'lucide-react';

interface SwitchSiteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SwitchSiteModal: React.FC<SwitchSiteModalProps> = ({ isOpen, onClose }) => {
  const { tenants, activeTenant, setActiveTenantId } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState<'ALL' | CareSector>('ALL');

  if (!isOpen) return null;

  const filteredTenants = tenants.filter((tenant) => {
    const matchesSearch =
      tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tenant.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tenant.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tenant.managerName && tenant.managerName.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesSector = selectedSector === 'ALL' || tenant.sector === selectedSector;

    return matchesSearch && matchesSector;
  });

  const handleSelectSite = (tenantId: string) => {
    setActiveTenantId(tenantId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-2xl rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 flex flex-col max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/10 text-teal-600 dark:bg-teal-500/20 dark:text-teal-400">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Switch Care Site & Service
                </h2>
                <span className="rounded-full bg-teal-100 px-2 py-0.5 text-[10px] font-bold text-teal-800 dark:bg-teal-950 dark:text-teal-300">
                  {tenants.length} Sites
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Log my Care Multi-Site Service • Select your working facility location
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Current Active Site Bar */}
        <div className="bg-teal-50/70 dark:bg-teal-950/40 border-b border-teal-100 dark:border-teal-900/50 px-5 py-2.5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-teal-950 dark:text-teal-200">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-semibold">Current Active Site:</span>
            <span className="font-bold underline decoration-teal-500/50">{activeTenant.name}</span>
          </div>
          <span className="rounded bg-teal-200/60 dark:bg-teal-900/80 px-1.5 py-0.5 font-mono text-[10px] font-bold text-teal-800 dark:text-teal-200">
            {activeTenant.code}
          </span>
        </div>

        {/* Search & Sector Filters */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by care home name, town, postcode, manager..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-xs text-slate-900 placeholder-slate-400 focus:border-teal-500 focus:bg-white focus:outline-hidden dark:border-slate-700 dark:bg-slate-800/80 dark:text-white dark:focus:bg-slate-800"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setSelectedSector('ALL')}
              className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors shrink-0 ${
                selectedSector === 'ALL'
                  ? 'bg-teal-600 text-white font-semibold'
                  : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              All Services ({tenants.length})
            </button>
            <button
              onClick={() => setSelectedSector('Care Home')}
              className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors shrink-0 ${
                selectedSector === 'Care Home'
                  ? 'bg-teal-600 text-white font-semibold'
                  : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              Care Homes ({tenants.filter((t) => t.sector === 'Care Home').length})
            </button>
            <button
              onClick={() => setSelectedSector('Supported Living')}
              className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors shrink-0 ${
                selectedSector === 'Supported Living'
                  ? 'bg-teal-600 text-white font-semibold'
                  : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              Supported Living ({tenants.filter((t) => t.sector === 'Supported Living').length})
            </button>
            <button
              onClick={() => setSelectedSector('Domiciliary Care')}
              className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors shrink-0 ${
                selectedSector === 'Domiciliary Care'
                  ? 'bg-teal-600 text-white font-semibold'
                  : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              Domiciliary ({tenants.filter((t) => t.sector === 'Domiciliary Care').length})
            </button>
          </div>
        </div>

        {/* Sites List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredTenants.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <Building2 className="mx-auto h-8 w-8 text-slate-300 dark:text-slate-600 mb-2" />
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">No care sites match your search</p>
              <p className="text-xs text-slate-400 mt-1">Try changing keywords or clearing the sector filter.</p>
            </div>
          ) : (
            filteredTenants.map((site) => {
              const isActive = site.id === activeTenant.id;
              return (
                <div
                  key={site.id}
                  className={`rounded-xl border p-4 transition-all ${
                    isActive
                      ? 'border-teal-500 bg-teal-50/50 dark:border-teal-500/80 dark:bg-teal-950/30 ring-2 ring-teal-500/20 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-800/60 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                          {site.name}
                        </h3>
                        <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                          {site.code}
                        </span>
                        <span className="rounded bg-teal-50 px-2 py-0.5 text-[10px] font-semibold text-teal-700 dark:bg-teal-950 dark:text-teal-300 border border-teal-200/50 dark:border-teal-800/50">
                          {site.sector}
                        </span>
                        <span
                          className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                            site.cqcRating === 'Outstanding'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                          }`}
                        >
                          CQC: {site.cqcRating}
                        </span>
                        {isActive && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            Active Site
                          </span>
                        )}
                      </div>

                      {/* Address */}
                      <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
                        <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span>{site.address}</span>
                      </div>

                      {/* Manager & Phone */}
                      {(site.managerName || site.phone) && (
                        <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 pt-0.5">
                          {site.managerName && (
                            <span className="flex items-center gap-1">
                              <UserCheck className="h-3 w-3 text-slate-400" />
                              <span>Registered Lead: <strong>{site.managerName}</strong></span>
                            </span>
                          )}
                          {site.phone && (
                            <span className="flex items-center gap-1">
                              <Phone className="h-3 w-3 text-slate-400" />
                              <span>{site.phone}</span>
                            </span>
                          )}
                        </div>
                      )}

                      {/* Live Metrics */}
                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 dark:text-slate-400 pt-1">
                        <span className="flex items-center gap-1">
                          <Users className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
                          <span><strong>{site.activeStaffCount}</strong> Staff on Duty</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Bed className="h-3.5 w-3.5 text-indigo-500" />
                          <span><strong>{site.currentOccupancyOrVisits || site.totalBedsOrClients}</strong> / {site.totalBedsOrClients} {site.sector === 'Domiciliary Care' ? 'Active Clients' : 'Beds Occupied'}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Compass className="h-3.5 w-3.5 text-amber-500" />
                          <span>{site.geofenceRadiusMeters}m GPS Radius</span>
                        </span>
                      </div>

                      {/* Care Zones / Wings */}
                      {site.zones && site.zones.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1 pt-1.5">
                          <span className="text-[10px] uppercase font-bold text-slate-400 mr-1 flex items-center gap-1">
                            <Layers className="h-3 w-3" /> Zones:
                          </span>
                          {site.zones.map((zone, idx) => (
                            <span
                              key={idx}
                              className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600 dark:bg-slate-700/60 dark:text-slate-300"
                            >
                              {zone}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Action Button */}
                    <div className="shrink-0 pt-2 sm:pt-0 self-end sm:self-center">
                      {isActive ? (
                        <button
                          disabled
                          className="flex items-center gap-1.5 rounded-xl border border-emerald-300 bg-emerald-50 px-3.5 py-2 text-xs font-bold text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 opacity-90 cursor-default"
                        >
                          <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                          <span>Active Service</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleSelectSite(site.id)}
                          className="flex items-center gap-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 px-3.5 py-2 text-xs font-bold text-white shadow-xs transition-all hover:scale-[1.02] cursor-pointer"
                        >
                          <span>Switch to this Site</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="border-t border-slate-200 bg-slate-50 px-5 py-3 dark:border-slate-800 dark:bg-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
            <span>Site switching updates your geofenced clock-in validation, live rota shifts & safeguarding boundary.</span>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-700 dark:text-slate-200 transition-colors cursor-pointer self-end sm:self-auto"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
