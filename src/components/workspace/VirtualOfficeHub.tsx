import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { VirtualRoom, StaffMember } from '../../types';
import {
  Users,
  Radio,
  Plus,
  Pin,
  Clock,
  Calendar,
  AlertTriangle,
  ArrowRightLeft,
  CheckCircle2,
  Volume2,
  VolumeX,
  MessageSquare,
  Sparkles,
  MapPin,
  ShieldCheck,
  Building,
  Headphones,
  Check,
  Send,
  Eye
} from 'lucide-react';

interface VirtualOfficeHubProps {
  onOpenClockModal: () => void;
  onOpenIncidentModal: () => void;
  onNavigateToRota: () => void;
  onOpenAutoRota: () => void;
}

export const VirtualOfficeHub: React.FC<VirtualOfficeHubProps> = ({
  onOpenClockModal,
  onOpenIncidentModal,
  onNavigateToRota,
  onOpenAutoRota
}) => {
  const {
    activeTenant,
    currentUser,
    userRole,
    staffList,
    virtualRooms,
    joinRoom,
    toggleHuddle,
    activeHuddleRoomId,
    addWhiteboardNote,
    announcements,
    acknowledgeAnnouncement,
    isClockedIn,
    shifts,
    safeStaffingAnalysis,
    addToast
  } = useApp();

  const [viewMode, setViewMode] = useState<'floorplan' | 'cards'>('floorplan');
  const [selectedRoomId, setSelectedRoomId] = useState<string>('room-managers');
  const [newNoteText, setNewNoteText] = useState('');
  const [activeIntercomAudio, setActiveIntercomAudio] = useState(false);

  const selectedRoom = virtualRooms.find((r) => r.id === selectedRoomId) || virtualRooms[0];

  const getStaffInRoom = (roomId: string): StaffMember[] => {
    return staffList.filter((s) => s.currentRoomId === roomId);
  };

  const myShifts = shifts.filter((s) => s.assignedStaffId === currentUser.id);

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    addWhiteboardNote(selectedRoom.id, newNoteText.trim());
    setNewNoteText('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner: Virtual HQ Overview & Quick Actions */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-r from-teal-900 via-slate-900 to-teal-950 p-6 text-white shadow-md dark:border-slate-800">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                CareVerse Virtual Office HQ • Live Space
              </span>
              <span className="rounded bg-teal-800/80 px-2 py-0.5 text-[10px] font-mono text-teal-200">
                {activeTenant.code}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              {activeTenant.name}
            </h1>
            <p className="text-sm text-slate-300">
              Interactive Remio-style care operations environment. Collaborate in dedicated digital rooms, monitor live floor presence, and synchronize daily care routines.
            </p>
          </div>

          {/* Quick Action Matrix */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <button
              id="hub-clock-quick-action"
              onClick={onOpenClockModal}
              className={`flex flex-col items-center justify-center rounded-xl p-3 text-center transition-all ${
                isClockedIn
                  ? 'bg-amber-500/20 border border-amber-400/40 text-amber-300 hover:bg-amber-500/30'
                  : 'bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 hover:bg-emerald-500/30'
              }`}
            >
              <Clock className="h-5 w-5 mb-1" />
              <span className="text-xs font-bold">{isClockedIn ? 'Clock Out' : 'Clock In'}</span>
              <span className="text-[10px] opacity-80">{isClockedIn ? 'Active Shift' : 'GPS Verified'}</span>
            </button>

            <button
              id="hub-view-rota-quick-action"
              onClick={onNavigateToRota}
              className="flex flex-col items-center justify-center rounded-xl border border-white/10 bg-white/10 p-3 text-center text-white hover:bg-white/20 transition-all"
            >
              <Calendar className="h-5 w-5 mb-1 text-teal-300" />
              <span className="text-xs font-bold">Shift Rota</span>
              <span className="text-[10px] text-slate-300">{myShifts.length} Assigned</span>
            </button>

            <button
              id="hub-log-incident-quick-action"
              onClick={onOpenIncidentModal}
              className="flex flex-col items-center justify-center rounded-xl border border-red-400/30 bg-red-500/20 p-3 text-center text-red-200 hover:bg-red-500/30 transition-all"
            >
              <AlertTriangle className="h-5 w-5 mb-1 text-red-400" />
              <span className="text-xs font-bold">Log Incident</span>
              <span className="text-[10px] text-red-300">Safeguarding</span>
            </button>

            <button
              id="hub-auto-rota-quick-action"
              onClick={onOpenAutoRota}
              className="flex flex-col items-center justify-center rounded-xl border border-indigo-400/30 bg-indigo-500/20 p-3 text-center text-indigo-200 hover:bg-indigo-500/30 transition-all"
            >
              <Sparkles className="h-5 w-5 mb-1 text-indigo-300" />
              <span className="text-xs font-bold">Auto-Rota</span>
              <span className="text-[10px] text-indigo-300">AI Staffing</span>
            </button>
          </div>
        </div>

        {/* Ambient subtle grid pattern */}
        <div className="absolute inset-0 -z-0 opacity-15 bg-[radial-gradient(#2dd4bf_1px,transparent_1px)] [background-size:16px_16px]" />
      </div>

      {/* Main Virtual Office Workplace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left / Main Column: Digital Office Floorplan & Rooms (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building className="h-5 w-5 text-teal-600 dark:text-teal-400" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Digital Office & Team Rooms
              </h2>
              <span className="rounded-full bg-teal-100 px-2 py-0.5 text-xs font-semibold text-teal-800 dark:bg-teal-950 dark:text-teal-300">
                {virtualRooms.length} Rooms Active
              </span>
            </div>

            {/* View Switcher */}
            <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 p-0.5 dark:border-slate-800 dark:bg-slate-800 text-xs">
              <button
                onClick={() => setViewMode('floorplan')}
                className={`rounded-md px-2.5 py-1 font-medium transition-colors ${
                  viewMode === 'floorplan'
                    ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-700 dark:text-white'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
                }`}
              >
                Floorplan View
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`rounded-md px-2.5 py-1 font-medium transition-colors ${
                  viewMode === 'cards'
                    ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-700 dark:text-white'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
                }`}
              >
                Room Cards
              </button>
            </div>
          </div>

          {/* Interactive 2D Spatial Floorplan View */}
          {viewMode === 'floorplan' ? (
            <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5 dark:border-slate-800 dark:bg-slate-900/60 shadow-xs">
              <div className="mb-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1.5 font-medium">
                  <MapPin className="h-3.5 w-3.5 text-teal-600" />
                  Click any room to enter, view occupants or inspect whiteboard notes
                </span>
                <span className="font-mono">Spatial Grid: Ground Floor Care HQ</span>
              </div>

              {/* Spatial Floorplan Grid layout mimicking a care facility HQ */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                {virtualRooms.map((room) => {
                  const occupants = getStaffInRoom(room.id);
                  const isCurrentRoom = currentUser.currentRoomId === room.id;
                  const isSelected = selectedRoomId === room.id;
                  const isHuddleActive = room.activeHuddle;

                  return (
                    <div
                      key={room.id}
                      id={`virtual-room-${room.id}`}
                      onClick={() => setSelectedRoomId(room.id)}
                      className={`relative flex flex-col justify-between rounded-xl border p-4 cursor-pointer transition-all ${
                        isSelected
                          ? 'border-teal-500 bg-white ring-2 ring-teal-500/20 shadow-sm dark:bg-slate-800 dark:border-teal-500'
                          : 'border-slate-200 bg-white/90 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800/80'
                      }`}
                    >
                      {/* Top Header of Room */}
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                              {room.type.replace('_', ' ')}
                            </span>
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                              {room.name}
                            </h3>
                          </div>
                          {isCurrentRoom && (
                            <span className="rounded-full bg-teal-100 px-2 py-0.5 text-[10px] font-bold text-teal-800 dark:bg-teal-950 dark:text-teal-300 shrink-0">
                              You're Here
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                          {room.description}
                        </p>
                      </div>

                      {/* Room Occupants Avatars */}
                      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                        <div className="flex items-center -space-x-2 overflow-hidden">
                          {occupants.length > 0 ? (
                            occupants.map((occ) => (
                              <img
                                key={occ.id}
                                src={occ.avatar}
                                alt={occ.name}
                                title={`${occ.name} (${occ.jobTitle}) - ${occ.presenceStatus}`}
                                className="inline-block h-7 w-7 rounded-full ring-2 ring-white dark:ring-slate-800 object-cover"
                              />
                            ))
                          ) : (
                            <span className="text-[11px] text-slate-400 italic">Empty room</span>
                          )}
                        </div>

                        {/* Huddle Indicator & Enter Button */}
                        <div className="flex items-center gap-1.5">
                          {isHuddleActive && (
                            <span className="flex items-center gap-1 rounded bg-purple-100 px-1.5 py-0.5 text-[10px] font-bold text-purple-700 dark:bg-purple-950 dark:text-purple-300 animate-pulse">
                              <Radio className="h-3 w-3" /> Huddle
                            </span>
                          )}
                          {!isCurrentRoom && (
                            <button
                              id={`join-room-btn-${room.id}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                joinRoom(room.id);
                              }}
                              className="rounded bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-700 hover:bg-teal-600 hover:text-white dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-teal-600 transition-colors"
                            >
                              Enter
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Cards View */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {virtualRooms.map((room) => {
                const occupants = getStaffInRoom(room.id);
                return (
                  <div
                    key={room.id}
                    className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-800"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-slate-900 dark:text-white text-sm">{room.name}</h3>
                      <button
                        onClick={() => joinRoom(room.id)}
                        className="rounded-md bg-teal-50 px-2 py-1 text-xs font-semibold text-teal-700 hover:bg-teal-100 dark:bg-teal-950 dark:text-teal-300"
                      >
                        Enter Room
                      </button>
                    </div>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{room.description}</p>
                    <div className="mt-3 flex items-center justify-between text-xs">
                      <span className="text-slate-400">{occupants.length} staff inside</span>
                      {room.activeHuddle && (
                        <span className="text-purple-600 font-medium">Huddle Active</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Selected Room Inspector: Whiteboard, Intercom & Live Huddle */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-800 transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-700">
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded bg-teal-100 px-2 py-0.5 text-xs font-semibold uppercase text-teal-800 dark:bg-teal-950 dark:text-teal-300">
                    Active Room Terminal
                  </span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {selectedRoom.name}
                  </h3>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {selectedRoom.description}
                </p>
              </div>

              {/* Intercom / Audio Huddle Controls */}
              <div className="flex items-center gap-2">
                <button
                  id="toggle-huddle-btn"
                  onClick={() => toggleHuddle(selectedRoom.id)}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                    selectedRoom.activeHuddle
                      ? 'bg-purple-600 text-white hover:bg-purple-700 shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-200'
                  }`}
                >
                  <Headphones className="h-4 w-4" />
                  <span>{selectedRoom.activeHuddle ? 'Leave Huddle' : 'Start Team Huddle'}</span>
                </button>

                {selectedRoom.activeHuddle && (
                  <button
                    onClick={() => {
                      setActiveIntercomAudio(!activeIntercomAudio);
                      addToast('Intercom', activeIntercomAudio ? 'Microphone muted' : 'Microphone unmuted', 'info');
                    }}
                    className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium ${
                      activeIntercomAudio
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {activeIntercomAudio ? <Volume2 className="h-4 w-4 animate-bounce" /> : <VolumeX className="h-4 w-4" />}
                    <span>{activeIntercomAudio ? 'Mic Live' : 'Muted'}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Room Whiteboard / Operational Notes */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <Pin className="h-3.5 w-3.5 text-teal-600" />
                    Room Whiteboard & Handover Notes
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {selectedRoom.whiteboardNotes.length} notes
                  </span>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {selectedRoom.whiteboardNotes.map((note, idx) => (
                    <div
                      key={idx}
                      className="rounded-lg border border-amber-200/70 bg-amber-50/50 p-2.5 text-xs text-amber-950 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-200 shadow-2xs"
                    >
                      <p>{note}</p>
                    </div>
                  ))}
                </div>

                {/* Add Whiteboard note form */}
                <form onSubmit={handleAddNote} className="mt-3 flex gap-2">
                  <input
                    type="text"
                    id="whiteboard-note-input"
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    placeholder="Pin quick note or handover item to room..."
                    className="flex-1 rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  />
                  <button
                    type="submit"
                    className="rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-teal-700"
                  >
                    Pin Note
                  </button>
                </form>
              </div>

              {/* Room Occupants & Presence */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5 text-teal-600" />
                    Staff Currently in {selectedRoom.name}
                  </span>
                  <span className="text-[11px] text-teal-600 font-medium">
                    {getStaffInRoom(selectedRoom.id).length} Active
                  </span>
                </div>

                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {getStaffInRoom(selectedRoom.id).map((s) => (
                    <div
                      key={s.id}
                      className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50/60 p-2 text-xs dark:border-slate-700/60 dark:bg-slate-900/40"
                    >
                      <div className="flex items-center gap-2.5">
                        <img src={s.avatar} alt={s.name} className="h-7 w-7 rounded-full object-cover ring-1 ring-teal-500/50" />
                        <div>
                          <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                            {s.name}
                            <span className="rounded bg-slate-200 px-1 py-0.2 text-[9px] font-bold text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                              {s.role}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400">{s.jobTitle}</div>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="inline-block rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          {s.presenceStatus.replace('_', ' ')}
                        </span>
                        {s.statusNote && (
                          <p className="text-[10px] text-slate-400 max-w-[140px] truncate">{s.statusNote}</p>
                        )}
                      </div>
                    </div>
                  ))}

                  {getStaffInRoom(selectedRoom.id).length === 0 && (
                    <div className="py-6 text-center text-xs text-slate-400">
                      No staff currently stationed in this room. Click "Enter" above to join.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Announcements, Safe Staffing & Live Feed (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Safe Staffing Real-Time Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                  Safe Staffing Monitor
                </h3>
              </div>
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                100% Compliant
              </span>
            </div>

            <div className="mt-4 space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-600 dark:text-slate-300">Today's Shift Fill Rate</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {safeStaffingAnalysis.filledShiftsToday} / {safeStaffingAnalysis.totalShiftsToday} shifts
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                  <div
                    className="h-full bg-teal-500 rounded-full"
                    style={{
                      width: `${(safeStaffingAnalysis.filledShiftsToday / (safeStaffingAnalysis.totalShiftsToday || 1)) * 100}%`
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center pt-2">
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-2.5 dark:border-slate-700 dark:bg-slate-900/50">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Seniors On Duty</span>
                  <p className="text-lg font-bold text-teal-700 dark:text-teal-400">
                    {safeStaffingAnalysis.seniorsOnDuty}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-2.5 dark:border-slate-700 dark:bg-slate-900/50">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Carers Active</span>
                  <p className="text-lg font-bold text-emerald-700 dark:text-emerald-400">
                    {safeStaffingAnalysis.carersOnDuty}
                  </p>
                </div>
              </div>

              <div className="rounded-lg bg-teal-50/70 p-2.5 text-xs text-teal-900 dark:bg-teal-950/40 dark:text-teal-200">
                <p className="font-medium">Ratio Requirement:</p>
                <p className="text-[11px] text-teal-700 dark:text-teal-300">{safeStaffingAnalysis.recommendedMinimum}</p>
              </div>
            </div>
          </div>

          {/* Announcements Board */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <Pin className="h-4 w-4 text-teal-600" />
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                  Agency Announcements
                </h3>
              </div>
              <span className="text-[11px] text-slate-400">{announcements.length} updates</span>
            </div>

            <div className="mt-3 space-y-3">
              {announcements.map((ann) => (
                <div
                  key={ann.id}
                  className={`rounded-xl border p-3 text-xs transition-all ${
                    ann.priority === 'critical'
                      ? 'border-red-200 bg-red-50/70 dark:border-red-900/50 dark:bg-red-950/30'
                      : ann.priority === 'important'
                      ? 'border-amber-200 bg-amber-50/60 dark:border-amber-900/40 dark:bg-amber-950/30'
                      : 'border-slate-200 bg-slate-50/60 dark:border-slate-700 dark:bg-slate-900/40'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="font-bold text-slate-900 dark:text-white line-clamp-1">{ann.title}</span>
                    <span className="shrink-0 text-[10px] text-slate-400">{ann.createdAt}</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 text-[11px] line-clamp-3 mb-2">
                    {ann.content}
                  </p>
                  <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                    <span className="text-[10px] text-slate-400 font-medium">By {ann.authorName} ({ann.authorRole})</span>
                    <button
                      id={`ack-ann-btn-${ann.id}`}
                      onClick={() => acknowledgeAnnouncement(ann.id)}
                      className="flex items-center gap-1 text-[11px] font-semibold text-teal-700 hover:text-teal-800 dark:text-teal-400"
                    >
                      <Check className="h-3 w-3" />
                      <span>Read ({ann.acknowledgedCount})</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Shift Status & My Next Rota */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                <Calendar className="h-4 w-4 text-teal-600" />
                My Upcoming Schedule
              </h3>
              <button
                onClick={onNavigateToRota}
                className="text-xs font-semibold text-teal-600 hover:underline dark:text-teal-400"
              >
                Full Rota →
              </button>
            </div>

            <div className="mt-3 space-y-2">
              {myShifts.length > 0 ? (
                myShifts.slice(0, 3).map((shift) => (
                  <div
                    key={shift.id}
                    className="flex items-center justify-between rounded-lg border border-slate-200 p-2.5 text-xs dark:border-slate-700"
                  >
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">{shift.shiftTitle}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        {shift.date} • {shift.startTime} - {shift.endTime}
                      </div>
                    </div>
                    <span className="rounded bg-teal-50 px-2 py-0.5 text-[10px] font-bold text-teal-800 dark:bg-teal-950 dark:text-teal-300">
                      {shift.unitOrWing}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 italic py-2 text-center">
                  No shifts currently assigned to your profile this week.
                </p>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
