import React, { useState } from 'react';
import { 
  Bell, 
  Volume2, 
  VolumeX, 
  Radio, 
  Flame, 
  ShieldAlert, 
  Building2, 
  CheckCircle2, 
  AlertOctagon, 
  Square,
  Sliders
} from 'lucide-react';
import { useAlert } from '../context/AlertContext';
import { sirenEngine } from '../utils/sirenAudio';

export default function EmergencyAlarmPage() {
  const { alarmActive, activateAlarm, stopAlarm, muteAlarm } = useAlert();
  const [volume, setVolume] = useState(80);

  const handleVolumeChange = (e) => {
    const val = Number(e.target.value);
    setVolume(val);
    sirenEngine.setVolume(val);
  };

  return (
    <div className={`min-h-screen pb-16 transition-colors duration-500 p-4 sm:p-6 lg:p-8 ${
      alarmActive ? 'siren-active-backdrop bg-slate-950' : 'bg-slate-950 text-slate-100'
    }`}>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2 pb-4 border-b border-slate-800">
          <div className="inline-flex p-3 rounded-2xl bg-red-600/20 text-red-500 border border-red-500/30 mb-2">
            <Bell className={`w-8 h-8 ${alarmActive ? 'animate-bounce text-red-400' : 'text-slate-400'}`} />
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            EMERGENCY ALARM
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
            High-decibel synthesized evacuation siren beacon with simultaneous alert transmission to nearby emergency services.
          </p>
        </div>

        {/* ALARM MAIN STATUS HUD */}
        <div className={`glass-panel p-8 sm:p-12 rounded-3xl border text-center transition-all shadow-2xl relative overflow-hidden ${
          alarmActive
            ? 'border-red-500 bg-red-950/40 shadow-red-900/60'
            : 'border-slate-800'
        }`}>
          {/* Strobe background pulse if active */}
          {alarmActive && (
            <div className="absolute inset-0 bg-red-600/10 animate-ping pointer-events-none"></div>
          )}

          <div className="relative z-10 max-w-md mx-auto space-y-6">
            {alarmActive ? (
              <>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-600 text-white text-xs font-black tracking-widest uppercase animate-pulse">
                  <AlertOctagon className="w-4 h-4 animate-spin" />
                  🔊 ALARM ACTIVATED
                </div>

                <h2 className="text-3xl sm:text-4xl font-black text-red-400">
                  SIREN SOUNDING
                </h2>

                <p className="text-sm text-red-200 font-medium">
                  "Nearby emergency services have been notified."
                </p>

                {/* Animated Audio Wave Graphic */}
                <div className="flex items-center justify-center gap-1.5 h-16 my-4">
                  {[40, 75, 95, 60, 100, 80, 50, 90, 65, 85, 45, 95].map((h, i) => (
                    <div
                      key={i}
                      style={{ height: `${h}%` }}
                      className="w-2 rounded-full bg-gradient-to-t from-red-600 to-yellow-300 animate-pulse"
                    ></div>
                  ))}
                </div>

                {/* Alarm Controls */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={muteAlarm}
                    className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs uppercase flex items-center justify-center gap-2 border border-slate-700 transition"
                  >
                    <VolumeX className="w-4 h-4 text-amber-400" />
                    Mute Siren
                  </button>
                  <button
                    onClick={stopAlarm}
                    className="py-3 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase flex items-center justify-center gap-2 shadow-lg shadow-red-600/40 transition"
                  >
                    <Square className="w-4 h-4" />
                    Stop Alarm
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800 text-slate-300 text-xs font-bold uppercase">
                  <Radio className="w-4 h-4 text-emerald-400" />
                  STANDBY MODE
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                  Sound Campus Fire Siren
                </h2>

                <p className="text-xs sm:text-sm text-slate-400">
                  Broadcasts a multi-frequency audio siren through the browser audio synthesizer and triggers immediate responder notifications.
                </p>

                <button
                  onClick={activateAlarm}
                  className="w-full py-4 px-8 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-500 text-white font-black text-base uppercase tracking-widest shadow-2xl shadow-red-600/40 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 cursor-pointer"
                >
                  <Volume2 className="w-6 h-6 animate-pulse" />
                  <span>ACTIVATE ALARM</span>
                </button>
              </>
            )}

            {/* Volume Control */}
            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5" /> Siren Volume:
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-28 accent-red-500 cursor-pointer"
                />
                <span className="font-mono text-slate-200">{volume}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* NEARBY SERVICES DISPATCH SUMMARY */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Radio className="w-4 h-4 text-red-400" />
            Nearby Emergency Services Linked to Alarm
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Fire Service */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-red-400 font-bold text-xs uppercase">
                <Flame className="w-4 h-4" />
                Fire Service
              </div>
              <h4 className="font-bold text-white text-sm">
                PCMC Fire Sub-Station Akurdi
              </h4>
              <p className="text-xs text-slate-400">Distance: 1.2 km • Akurdi Rly Stn Rd</p>
              <div className="text-[10px] font-mono text-emerald-400 flex items-center gap-1 pt-1 border-t border-slate-800">
                <CheckCircle2 className="w-3 h-3" /> Auto-Alert Frequency Synced
              </div>
            </div>

            {/* Police */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase">
                <ShieldAlert className="w-4 h-4" />
                Police
              </div>
              <h4 className="font-bold text-white text-sm">
                Nigdi Police Station
              </h4>
              <p className="text-xs text-slate-400">Distance: 1.5 km • Sector 24 Pradhikaran</p>
              <div className="text-[10px] font-mono text-emerald-400 flex items-center gap-1 pt-1 border-t border-slate-800">
                <CheckCircle2 className="w-3 h-3" /> Dial 112 Gateway Armed
              </div>
            </div>

            {/* Hospital */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase">
                <Building2 className="w-4 h-4" />
                Hospital
              </div>
              <h4 className="font-bold text-white text-sm">
                Star Hospital / YCM Hospital
              </h4>
              <p className="text-xs text-slate-400">Distance: 0.6 km • Pradhikaran Flyover</p>
              <div className="text-[10px] font-mono text-emerald-400 flex items-center gap-1 pt-1 border-t border-slate-800">
                <CheckCircle2 className="w-3 h-3" /> Ambulance Triage on Standby
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
