import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Flame, 
  ShieldAlert, 
  MapPin, 
  Video, 
  Bell, 
  BookOpen, 
  Users, 
  CheckCircle2, 
  Radio, 
  AlertTriangle, 
  Activity, 
  ArrowRight,
  ShieldCheck,
  Building2,
  Clock,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAlert } from '../context/AlertContext';

export default function HomeDashboard() {
  const { user } = useAuth();
  const { activeAlert, triggerSos, cancelEmergency, alerts } = useAlert();
  const navigate = useNavigate();

  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [submittingSos, setSubmittingSos] = useState(false);

  const handleConfirmSos = async () => {
    setSubmittingSos(true);
    await triggerSos({
      userId: user?.id || 'usr-pccoe-001',
      userName: user?.name || 'Prof. Rajesh Deshmukh',
      userPhone: user?.phone || '+91 98230 45678',
      location: 'PCCOE Campus, Sector 26, Pradhikaran, Akurdi, Pune - 411044',
      emergencyType: 'Fire & Smoke Emergency',
      severity: 'CRITICAL'
    });
    setSubmittingSos(false);
    setConfirmModalOpen(false);
    navigate('/sos');
  };

  const featureCards = [
    {
      id: 'sos',
      title: 'SOS Emergency',
      desc: 'Activate instantaneous multi-agency panic response',
      icon: ShieldAlert,
      path: '/sos',
      badge: 'URGENT',
      color: 'from-red-600 to-rose-700',
      iconColor: 'text-red-400'
    },
    {
      id: 'nearby',
      title: 'Nearby Services',
      desc: 'Fire Stations, Police, and Hospitals near PCCOE',
      icon: MapPin,
      path: '/services',
      badge: '5 Available',
      color: 'from-blue-600 to-indigo-700',
      iconColor: 'text-blue-400'
    },
    {
      id: 'dehazing',
      title: 'AI Video Dehazing',
      desc: 'Deep learning smoke removal & real-time CCTV clarity',
      icon: Video,
      path: '/dehazing',
      badge: 'AI Powered',
      color: 'from-purple-600 to-violet-700',
      iconColor: 'text-purple-400'
    },
    {
      id: 'alarm',
      title: 'Emergency Alarm',
      desc: 'Sound the emergency siren & strobe beacon',
      icon: Bell,
      path: '/alarm',
      badge: 'Siren Audio',
      color: 'from-amber-600 to-orange-700',
      iconColor: 'text-amber-400'
    },
    {
      id: 'guidelines',
      title: 'Safety Guidelines',
      desc: 'PASS technique, evacuation drills & burn first aid',
      icon: BookOpen,
      path: '/guidelines',
      badge: '10 Guides',
      color: 'from-emerald-600 to-teal-700',
      iconColor: 'text-emerald-400'
    },
    {
      id: 'contacts',
      title: 'Emergency Contacts',
      desc: 'Direct dispatch to family, security & campus doctor',
      icon: Users,
      path: '/contacts',
      badge: '5 Linked',
      color: 'from-cyan-600 to-blue-700',
      iconColor: 'text-cyan-400'
    }
  ];

  return (
    <div className="min-h-screen pb-16 bg-slate-950 text-slate-100 overflow-x-hidden w-full max-w-full">
      {/* Top Banner / System Ribbon */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border-b border-slate-800 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">🔥</span>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                SMART FIRE RESPONSE
              </h1>
              <span className="text-xs bg-red-600/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded font-mono font-bold">
                AI + REAL-TIME ALERTING
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Welcome, <span className="text-slate-200 font-semibold">{user?.name || 'Authorized User'}</span> • Device: <span className="font-mono text-emerald-400">{user?.deviceId || 'DEV-PCCOE-CAMPUS-702'}</span>
            </p>
          </div>

          {/* Diagnostic Status Pills */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              DEVICE: AUTHENTICATED
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400 font-semibold">
              <Radio className="w-3.5 h-3.5" />
              SYSTEM: ONLINE
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-red-400" />
              <span>PCCOE, Akurdi, Pune</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 sm:mt-8 space-y-8">
        {/* ======================================================== */}
        {/* MAIN FEATURE: HERO EMERGENCY SOS CALLOUT */}
        {/* ======================================================== */}
        <div className="relative rounded-3xl overflow-hidden border border-red-500/30 bg-gradient-to-b from-red-950/40 via-slate-900/90 to-slate-950 p-6 sm:p-10 text-center shadow-2xl shadow-red-950/60">
          {/* Background decorative pulse circles */}
          <div className="absolute inset-0 flex items-center justify-center -z-0 pointer-events-none opacity-20">
            <div className="w-96 h-96 rounded-full border border-red-500 animate-ping"></div>
          </div>

          <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-bold uppercase tracking-widest mb-4">
              <ShieldAlert className="w-4 h-4 text-red-400 animate-pulse" />
              Instant Multi-Agency Emergency Dispatch
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
              Are You Facing a Fire Hazard?
            </h2>
            <p className="text-sm sm:text-base text-slate-300 mb-8 max-w-lg">
              Press the SOS button below to immediately broadcast your location, alert your designated emergency contacts, and dispatch PCMC Fire, Nigdi Police & Medical Services.
            </p>

            {/* Giant Red Interactive SOS Button */}
            <div className="relative flex items-center justify-center my-2">
              {/* Pulsing ring */}
              <div className="absolute w-44 h-44 sm:w-52 sm:h-52 rounded-full bg-red-600/30 animate-ping pointer-events-none"></div>
              <div className="absolute w-40 h-40 sm:w-48 sm:h-48 rounded-full bg-red-600/50 animate-pulse pointer-events-none"></div>

              <button
                onClick={() => setConfirmModalOpen(true)}
                className="relative z-10 w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-gradient-to-tr from-red-700 via-red-600 to-rose-500 text-white font-black text-2xl sm:text-3xl tracking-widest shadow-2xl flex flex-col items-center justify-center gap-1 border-4 border-white/20 active:scale-95 transition-all hover:scale-105 cursor-pointer sos-button-glow"
              >
                <Flame className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-200 animate-bounce" />
                <span>PRESS SOS</span>
                <span className="text-[10px] sm:text-xs font-normal tracking-normal text-red-100 opacity-90">
                  TAP FOR HELP
                </span>
              </button>
            </div>

            <p className="text-xs sm:text-sm text-red-300/80 font-medium mt-6">
              "Send emergency alert to contacts and nearby services"
            </p>

            {/* Active alert indicator if already active */}
            {activeAlert && activeAlert.status !== 'RESOLVED' && (
              <div className="mt-6 w-full bg-red-900/70 border border-red-500 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center shrink-0">
                    <ShieldAlert className="w-6 h-6 text-white animate-spin" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                      Active Emergency in Progress ({activeAlert.id})
                    </h4>
                    <p className="text-xs text-red-200">
                      Dispatched to Akurdi Fire Brigade • Phase: <span className="font-bold underline">{activeAlert.dispatchPhase || 'RESPONDING'}</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    to="/sos"
                    className="px-4 py-2 rounded-xl bg-white text-red-700 font-bold text-xs uppercase shadow hover:bg-slate-100 transition"
                  >
                    View Status
                  </Link>
                  <button
                    onClick={() => cancelEmergency()}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold text-xs hover:bg-slate-700 transition"
                  >
                    Resolve
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ======================================================== */}
        {/* 6 FEATURE CARDS GRID */}
        {/* ======================================================== */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <Activity className="w-5 h-5 text-red-400" />
                Emergency Command Features
              </h3>
              <p className="text-xs text-slate-400">Direct tools to monitor, signal, and manage fire risks</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {featureCards.map((card) => {
              const Icon = card.icon;
              return (
                <Link
                  key={card.id}
                  to={card.path}
                  className="group relative glass-panel p-5 sm:p-6 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center ${card.iconColor} group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      {card.badge}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-white group-hover:text-red-400 transition-colors">
                    {card.title}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {card.desc}
                  </p>
                  <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-slate-400 group-hover:text-white transition-colors">
                    <span>Access Module</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* ======================================================== */}
        {/* SYSTEM STATUS & RECENT ALERTS */}
        {/* ======================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* System Status Card */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Radio className="w-4 h-4 text-emerald-400" />
              System Status
            </h4>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Sensors Online
                </div>
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded">
                  48 Nodes Active
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Database Connected
                </div>
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded">
                  PCCOE Grid Synced
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Alert Service Online
                </div>
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded">
                  PCMC 101/112 Live
                </span>
              </div>
            </div>

            <div className="pt-2 text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-800">
              <span>Geo Anchor: Sector 26, Akurdi</span>
              <span className="font-mono text-slate-300">18.6517° N, 73.7615° E</span>
            </div>
          </div>

          {/* Recent Alert Log Card */}
          <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-400" />
                  Recent Alert Status
                </h4>
                <Link to="/admin/dashboard" className="text-xs text-red-400 hover:text-red-300 font-semibold">
                  View Full Logs →
                </Link>
              </div>

              {activeAlert && activeAlert.status !== 'RESOLVED' ? (
                <div className="bg-red-950/60 border border-red-500/70 p-4 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-red-200 uppercase flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-red-400 animate-bounce" />
                      {activeAlert.emergencyType}
                    </span>
                    <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                      ACTIVE EMERGENCY
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">
                    <strong className="text-white">Location:</strong> {activeAlert.location}
                  </p>
                  <p className="text-xs text-slate-400">
                    Notified: {activeAlert.notifiedContacts?.length || 4} Contacts • Akurdi Fire Brigade • Nigdi Police
                  </p>
                </div>
              ) : (
                <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-slate-200">No active emergency</h5>
                    <p className="text-xs text-slate-400">
                      All campus zones clear. Optical smoke sensors operating within normal baseline limits.
                    </p>
                  </div>
                </div>
              )}

              {/* Past incidents teaser */}
              <div className="mt-4 space-y-2">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Past Incidents
                </span>
                <div className="divide-y divide-slate-800/80">
                  {alerts.slice(0, 2).map((alt) => (
                    <div key={alt.id} className="py-2 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-semibold text-slate-200">{alt.emergencyType}</span>
                        <p className="text-[11px] text-slate-400">{alt.location}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-emerald-400 border border-emerald-500/30">
                          {alt.status}
                        </span>
                        <p className="text-[10px] text-slate-500 mt-0.5">{new Date(alt.timestamp).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
              <span>PCCOE Campus Safety Protocol v2.4</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> All Systems Operational
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* SOS CONFIRMATION MODAL */}
      {/* ======================================================== */}
      {confirmModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-slate-900 border-2 border-red-600 rounded-3xl p-6 sm:p-8 text-center shadow-2xl shadow-red-950 relative overflow-hidden">
            <button
              onClick={() => setConfirmModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 rounded-2xl bg-red-600/20 border border-red-500/40 text-red-500 flex items-center justify-center mx-auto mb-4 animate-pulse">
              <ShieldAlert className="w-8 h-8 text-red-500" />
            </div>

            <span className="text-xs font-black text-red-500 tracking-widest uppercase bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20">
              EMERGENCY ALERT CONFIRMATION
            </span>

            <h3 className="text-xl sm:text-2xl font-black text-white mt-3">
              Are you sure you want to send an emergency alert?
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 mt-2">
              This will broadcast your coordinates at <strong className="text-white">PCCOE Campus Akurdi</strong> to PCMC Fire Brigade (101), Nigdi Police (112), and notify all designated emergency contacts.
            </p>

            {/* Simulation Safety Badge */}
            <div className="mt-3 p-2 rounded-xl bg-slate-950/80 border border-emerald-500/40 text-[11px] text-emerald-300 font-medium">
              🛡️ <strong>Safe Prototype Mode:</strong> All alert transmissions and agency dispatches are securely simulated within this system. No real telecom SMS or external 101/112 calls will be placed.
            </div>

            <div className="grid grid-cols-2 gap-3 mt-6">
              <button
                onClick={() => setConfirmModalOpen(false)}
                className="py-3 px-4 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm transition"
              >
                CANCEL
              </button>
              <button
                onClick={handleConfirmSos}
                disabled={submittingSos}
                className="py-3 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-sm shadow-lg shadow-red-600/40 transition flex items-center justify-center gap-2"
              >
                {submittingSos ? 'SENDING...' : 'SEND SOS'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
