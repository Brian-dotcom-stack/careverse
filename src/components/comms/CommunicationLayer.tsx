import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ChatMessage } from '../../types';
import {
  MessageSquare,
  Send,
  Radio,
  Volume2,
  VolumeX,
  Bell,
  AlertTriangle,
  Hash,
  Users,
  Mic,
  Headphones,
  CheckCheck,
  Sparkles,
  ShieldAlert
} from 'lucide-react';

export const CommunicationLayer: React.FC = () => {
  const {
    activeTenant,
    currentUser,
    userRole,
    staffList,
    chatMessages,
    sendChatMessage,
    virtualRooms,
    activeHuddleRoomId,
    toggleHuddle,
    addToast
  } = useApp();

  const [activeChannel, setActiveChannel] = useState<string>('#shift-handovers');
  const [inputText, setInputText] = useState('');
  const [isUrgentBroadcast, setIsUrgentBroadcast] = useState(false);
  const [intercomActive, setIntercomActive] = useState(false);

  const channels = [
    { id: '#shift-handovers', label: 'Shift Handovers', description: 'Clinical & wing daily briefings' },
    { id: '#urgent-coverage', label: 'Urgent Shift Coverage', description: 'Open shift broadcast & emergency call-in' },
    { id: '#incident-response', label: 'Safeguarding & First Aid', description: 'Immediate emergency alert channel' },
    { id: '#general-announcements', label: 'General Team Lounge', description: 'Care home announcements & peer recognition' }
  ];

  const channelMessages = chatMessages.filter(
    (m) => m.channel === activeChannel || (activeChannel === '#all' ? true : false)
  );

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendChatMessage(activeChannel, inputText.trim(), isUrgentBroadcast);
    setInputText('');
    setIsUrgentBroadcast(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded bg-teal-100 px-2 py-0.5 text-xs font-semibold uppercase tracking-wider text-teal-800 dark:bg-teal-950 dark:text-teal-300">
              Communication & Intercom
            </span>
            <span className="text-xs text-slate-400 font-mono">Encrypted Channels</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            Real-Time Team Comms & Virtual Intercom
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Remio-inspired spatial voice intercom, handovers coordination, and priority broadcasts to active care staff.
          </p>
        </div>

        {/* Live Intercom Huddle Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setIntercomActive(!intercomActive);
              addToast(
                'Intercom Interlock',
                intercomActive ? 'Floor intercom disconnected' : 'Connected to live care floor audio feed',
                intercomActive ? 'info' : 'success'
              );
            }}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
              intercomActive
                ? 'bg-emerald-600 text-white shadow-md animate-pulse'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200'
            }`}
          >
            {intercomActive ? <Mic className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            <span>{intercomActive ? 'Live Floor Intercom: Connected' : 'Connect Intercom Audio'}</span>
          </button>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[600px]">
        
        {/* Left: Channels & Room Huddles (4 cols) */}
        <div className="lg:col-span-4 flex flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-800 overflow-hidden">
          
          <div className="pb-3 border-b border-slate-100 dark:border-slate-700">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Team Channels
            </span>
            <div className="mt-2 space-y-1">
              {channels.map((ch) => (
                <button
                  key={ch.id}
                  id={`channel-btn-${ch.id.replace('#', '')}`}
                  onClick={() => setActiveChannel(ch.id)}
                  className={`flex w-full items-start gap-2.5 rounded-xl p-2.5 text-left text-xs transition-colors ${
                    activeChannel === ch.id
                      ? 'bg-teal-50 font-bold text-teal-900 dark:bg-teal-950 dark:text-teal-200'
                      : 'text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700/50'
                  }`}
                >
                  <Hash className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate">{ch.label}</div>
                    <div className="text-[10px] text-slate-400 font-normal truncate">
                      {ch.description}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Active Virtual Room Audio Huddle Status */}
          <div className="mt-4 flex-1 flex flex-col justify-between pt-2">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Radio className="h-3.5 w-3.5 text-purple-600" />
                Live Spatial Huddles
              </span>

              <div className="mt-2 space-y-2">
                {virtualRooms.map((room) => (
                  <div
                    key={room.id}
                    className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50/80 p-2 text-xs dark:border-slate-700/50 dark:bg-slate-900/40"
                  >
                    <div className="truncate">
                      <div className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                        {room.name}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {room.occupants.length} staff inside
                      </div>
                    </div>

                    <button
                      onClick={() => toggleHuddle(room.id)}
                      className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                        room.activeHuddle
                          ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 animate-pulse'
                          : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {room.activeHuddle ? 'Live' : 'Start'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Intercom Audio Simulation visualizer */}
            {intercomActive && (
              <div className="mt-4 rounded-xl border border-emerald-300 bg-emerald-50/60 p-3 text-xs dark:border-emerald-900/50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200">
                <div className="flex items-center justify-between mb-1.5 font-bold">
                  <span>Care Floor Waveform</span>
                  <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                </div>
                <div className="flex items-center gap-1 h-6">
                  {[40, 75, 20, 90, 60, 100, 45, 80, 30, 95, 50, 70, 85, 25].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-emerald-500 rounded-full animate-pulse"
                      style={{ height: `${h}%`, animationDelay: `${i * 70}ms` }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Right: Message Stream & Input (8 cols) */}
        <div className="lg:col-span-8 flex flex-col rounded-2xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-800 overflow-hidden">
          
          {/* Channel Header */}
          <div className="flex items-center justify-between px-6 py-3.5 border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30">
            <div className="flex items-center gap-2">
              <Hash className="h-5 w-5 text-teal-600" />
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">{activeChannel}</h3>
                <p className="text-[11px] text-slate-400">All shifts on duty are subscribed</p>
              </div>
            </div>
            <span className="text-xs text-slate-400 font-mono">End-to-End Encrypted</span>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            {channelMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 text-xs ${
                  msg.isUrgent
                    ? 'rounded-xl border border-red-200 bg-red-50/50 p-3 dark:border-red-900/40 dark:bg-red-950/20'
                    : ''
                }`}
              >
                <img
                  src={msg.senderAvatar}
                  alt={msg.senderName}
                  className="h-8 w-8 rounded-full object-cover ring-1 ring-teal-500/50 shrink-0"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white">
                      {msg.senderName}
                    </span>
                    <span className="rounded bg-slate-100 px-1.5 py-0.2 text-[9px] font-semibold text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                      {msg.senderRole}
                    </span>
                    <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
                    {msg.isUrgent && (
                      <span className="rounded bg-red-600 px-1.5 py-0.2 text-[9px] font-bold text-white uppercase animate-pulse">
                        Urgent Alert
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-slate-700 dark:text-slate-300 leading-relaxed">
                    {msg.text}
                  </p>
                </div>
              </div>
            ))}

            {channelMessages.length === 0 && (
              <div className="py-24 text-center text-xs text-slate-400 italic">
                No communications yet in this channel. Send the first briefing!
              </div>
            )}
          </div>

          {/* Input Box */}
          <form
            onSubmit={handleSendMessage}
            className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col gap-2"
          >
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isUrgentBroadcast}
                  onChange={(e) => setIsUrgentBroadcast(e.target.checked)}
                  className="rounded border-slate-300 text-red-600 focus:ring-red-500"
                />
                <span className={isUrgentBroadcast ? 'font-bold text-red-600' : ''}>
                  Flag as Urgent Priority Dispatch (Audible Chime to On-Duty Staff)
                </span>
              </label>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                id="comms-message-input"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`Post update to ${activeChannel}...`}
                className="flex-1 rounded-xl border border-slate-300 px-4 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              />
              <button
                type="submit"
                className="rounded-xl bg-teal-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-teal-700 transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <Send className="h-4 w-4" />
                <span>Send</span>
              </button>
            </div>
          </form>

        </div>

      </div>
    </div>
  );
};
