import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Flame, 
  MapPin, 
  Clock, 
  Radio, 
  CheckCircle2, 
  Users, 
  Truck, 
  Building2, 
  PhoneCall, 
  XOctagon, 
  Bell, 
  Volume2, 
  AlertTriangle, 
  Share2,
  X
} from 'lucide-react';
import { useAlert } from '../context/AlertContext';
import { useAuth } from '../context/AuthContext';
import EmergencyTimeline from '../components/EmergencyTimeline';

export default function SosEmergencyPage() {
  const { activeAlert, triggerSos, cancelEmergency, alarmActive, activateAlarm, stopAlarm } = useAlert();
  const { user } = useAuth();

  const [confirmCancelOpen, setConfirmCancelOpen] = useState(false);
  const [cancelNotes, setCancelNotes] = useState('Situation controlled with fire extinguisher / Drill resolved');
  const [triggering, setTriggering] = useState(false);

  // If no alert is currently active, show a clean SOS trigger view
  const handleQuickSos = async () => {
    setTriggering(true);
    await triggerSos({
      userId: user?.id || 'usr-pccoe-001',
      userName: user?.name || 'Prof. Rajesh Deshmukh',
      userPhone: user?.phone || '+91 98230 45678',
      emergencyType: 'Fire Emergency',
      location: 'PCCOE Campus, Sector 26, Pradhikaran, Akurdi, Pune - 411044',
      latitude: 18.6517,
      longitude: 73.7615
    });
    setTriggering(false);
  };

  const handleResolve = async () => {
    await cancelEmergency(activeAlert?.id, cancelNotes);
    setConfirmCancelOpen(false);
  };

  return (
    <div className="min-h-screen pb-16 bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Title Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-red-600/20 text-red-500 border border-red-500/30">
                <ShieldAlert className="w-5 h-5" />
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                SOS Emergency Dispatch Center
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Real-time multi-agency coordination system • PCCOE Sector 26, Akurdi, Pune
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-block px-2.5 py-1 rounded-full bg-slate-900 border border-slate-700 text-[10px] text-slate-300 font-mono">
              🛡️ Safe Prototype Simulation Mode
            </span>
            {activeAlert ? (
              <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-600 text-white text-xs font-black tracking-wider uppercase animate-pulse shadow-lg shadow-red-600/50">
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-300 animate-ping"></span>
                🚨 SOS ALERT ACTIVE
              </span>
            ) : (
              <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase">
                <CheckCircle2 className="w-4 h-4" />
                STANDBY • NO ACTIVE EMERGENCY
              </span>
            )}
          </div>
        </div>

        {/* If Active Alert: Comprehensive Emergency HUD */}
        {activeAlert && activeAlert.status !== 'RESOLVED' ? (
          <div className="space-y-6">
            {/* Primary Alert Card */}
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border-2 border-red-500/70 relative overflow-hidden shadow-2xl shadow-red-950/80">
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-red-600 via-orange-500 to-red-600 animate-pulse"></div>

              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-red-600/30 border border-red-500/50 text-red-300 text-[11px] font-mono font-bold">
                      {activeAlert.id}
                    </span>
                    <span className="text-xs text-slate-400">
                      Dispatched {new Date(activeAlert.timestamp).toLocaleTimeString()}
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
                    <Flame className="w-8 h-8 text-orange-500 animate-bounce" />
                    {activeAlert.emergencyType}
                  </h2>

                  <div className="mt-3 space-y-1.5 text-xs sm:text-sm text-slate-300">
                    <p className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-red-400 shrink-0" />
                      <strong>Location:</strong> {activeAlert.location}
                    </p>
                    <p className="flex items-center gap-2 text-slate-400 font-mono text-xs">
                      <Radio className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      GPS Coordinates: {activeAlert.latitude}° N, {activeAlert.longitude}° E (Accuracy: ±3m)
                    </p>
                    <p className="flex items-center gap-2 text-slate-400">
                      <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      Reporting Device: {activeAlert.userName} ({activeAlert.userPhone})
                    </p>
                  </div>
                </div>

                {/* Cancel Emergency Action */}
                <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
                  <button
                    onClick={() => setConfirmCancelOpen(true)}
                    className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-red-500/40 text-red-200 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition"
                  >
                    <XOctagon className="w-4 h-4 text-red-400" />
                    Cancel / Stand Down
                  </button>

                  <button
                    onClick={alarmActive ? stopAlarm : activateAlarm}
                    className={`px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition ${
                      alarmActive
                        ? 'bg-red-600 text-white animate-pulse'
                        : 'bg-slate-900 border border-slate-700 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <Volume2 className="w-4 h-4" />
                    {alarmActive ? 'Silence Siren Audio' : 'Sound Siren Horn'}
                  </button>
                </div>
              </div>

              {/* TIMELINE COMPONENT */}
              <div className="mt-8 pt-6 border-t border-slate-800">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                  Emergency Response Progression Timeline
                </h3>
                <EmergencyTimeline timeline={activeAlert.timeline} currentPhase={activeAlert.dispatchPhase} />
              </div>
            </div>

            {/* NOTIFIED SERVICES & CONTACTS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Emergency Contacts Card */}
              <div className="glass-panel p-6 rounded-2xl border border-slate-800">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-400" />
                    Emergency Contacts Notified
                  </h3>
                  <span className="text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded">
                    ✓ SMS & Push Dispatched
                  </span>
                </div>

                <div className="space-y-2.5">
                  {(activeAlert.notifiedContacts || ['Father', 'Mother', 'PCCOE Campus Security', 'Campus Doctor']).map((contact, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center text-xs font-bold">
                          {contact.charAt(0)}
                        </div>
                        <div>
                          <span className="text-xs font-semibold text-slate-200 block">{contact}</span>
                          <span className="text-[10px] text-slate-400">Status: Automated Alert Received</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Delivered
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Emergency Agencies Card */}
              <div className="glass-panel p-6 rounded-2xl border border-slate-800">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Truck className="w-4 h-4 text-red-400" />
                    Nearby Services Dispatched
                  </h3>
                  <span className="text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded">
                    ✓ Priority 1 Dispatched
                  </span>
                </div>

                <div className="space-y-2.5">
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center">
                        <Flame className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-slate-200 block">
                          PCMC Fire Sub-Station Akurdi (1.2 km)
                        </span>
                        <span className="text-[10px] text-red-400 font-semibold">
                          Dispatched: 2 Fire Tenders En Route
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-amber-400">ETA 3 min</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center">
                        <ShieldAlert className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-slate-200 block">
                          Nigdi Police Station (1.5 km)
                        </span>
                        <span className="text-[10px] text-blue-400 font-semibold">
                          Patrol Unit 04 Assigned
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-amber-400">ETA 4 min</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-slate-200 block">
                          Star Multispeciality Hospital (0.6 km)
                        </span>
                        <span className="text-[10px] text-emerald-400 font-semibold">
                          Burn Triage & ICU Beds on Standby
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400">Ready</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* When No Active Alert: Trigger SOS Console */
          <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-slate-800 text-center space-y-6">
            <div className="w-24 h-24 rounded-3xl bg-red-600/10 border border-red-500/30 text-red-500 flex items-center justify-center mx-auto shadow-inner">
              <ShieldAlert className="w-12 h-12 text-red-500 animate-pulse" />
            </div>

            <div className="max-w-md mx-auto">
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                Emergency Panic Trigger Ready
              </h2>
              <p className="text-sm text-slate-400 mt-2">
                Clicking the button below will immediately sound campus alarms, broadcast your location to PCMC fire brigade, and notify your emergency contacts.
              </p>
            </div>

            <button
              onClick={handleQuickSos}
              disabled={triggering}
              className="py-4 px-8 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black text-base uppercase tracking-widest shadow-2xl shadow-red-600/40 hover:scale-105 active:scale-95 transition-all"
            >
              {triggering ? 'TRANSMITTING SOS...' : '🚨 TRIGGER EMERGENCY SOS NOW'}
            </button>

            <div className="pt-6 border-t border-slate-800 text-xs text-slate-400 flex flex-wrap justify-center gap-6">
              <span>📍 PCCOE Akurdi Anchor: 18.6517° N, 73.7615° E</span>
              <span>📡 Gateway: PCMC Emergency Dispatch (101)</span>
              <span>👥 Contacts Auto-Alert: Armed</span>
            </div>
          </div>
        )}
      </div>

      {/* CONFIRM CANCEL / RESOLVE MODAL */}
      {confirmCancelOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                Resolve / Stand Down Emergency
              </h3>
              <button onClick={() => setConfirmCancelOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300 mb-3">
              Please confirm that the fire risk is neutralized or safely handled before standing down responders:
            </p>

            <textarea
              value={cancelNotes}
              onChange={(e) => setCancelNotes(e.target.value)}
              rows={3}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:ring-1 focus:ring-emerald-500 outline-none"
              placeholder="Incident notes (e.g. fire extinguished, false alarm verified)..."
            />

            <div className="grid grid-cols-2 gap-3 mt-4">
              <button
                onClick={() => setConfirmCancelOpen(false)}
                className="py-2.5 px-4 rounded-xl border border-slate-700 bg-slate-800 text-slate-300 font-semibold text-xs"
              >
                Go Back
              </button>
              <button
                onClick={handleResolve}
                className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow"
              >
                Mark RESOLVED
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
