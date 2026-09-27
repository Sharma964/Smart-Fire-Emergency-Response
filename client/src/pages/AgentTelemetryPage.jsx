import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  Activity, 
  Radio, 
  ShieldCheck, 
  Flame, 
  Wind, 
  Thermometer, 
  Eye, 
  Compass, 
  BellRing, 
  Send, 
  Zap, 
  Layers, 
  RefreshCw,
  Sliders,
  CheckCircle2
} from 'lucide-react';

export default function AgentTelemetryPage() {
  const [telemetry, setTelemetry] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchTelemetry = async () => {
    try {
      const res = await fetch('/api/agent/telemetry');
      if (res.ok) {
        setTelemetry(await res.json());
      }
    } catch (e) {
      console.warn('Telemetry fetch error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen pb-16 bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
                <Cpu className="w-5 h-5" />
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                AI Agent Architecture & PEAS Telemetry
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Autonomous Sensing, Perception, Decision Making & Multi-Agency Actuation System
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-emerald-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              Agent State: ACTIVE LOOP
            </span>
          </div>
        </div>

        {/* PEAS 4-PILLAR GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* P - PERFORMANCE */}
          <div className="glass-panel p-5 rounded-3xl border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>[P] Performance Measure</span>
            </div>
            <div className="space-y-2 pt-1">
              {(telemetry?.peas?.performance || [
                { metric: "Detection Accuracy", value: "96.4%", target: ">95%" },
                { metric: "Time-to-Alert", value: "1.2s", target: "<3.0s" },
                { metric: "False Alarm Rate", value: "1.8%", target: "<3.0%" },
                { metric: "Campus Coverage", value: "98.2%", target: ">95%" },
                { metric: "Dispatch Latency", value: "2.4s", target: "<5.0s" }
              ]).map((p, i) => (
                <div key={i} className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium">{p.metric}</span>
                  <div className="text-right font-mono">
                    <span className="text-emerald-400 font-bold block">{p.value}</span>
                    <span className="text-[10px] text-slate-500">Goal: {p.target}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* E - ENVIRONMENT */}
          <div className="glass-panel p-5 rounded-3xl border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
              <Wind className="w-4 h-4" />
              <span>[E] Environment</span>
            </div>
            <div className="space-y-2 pt-1 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80">
                <span className="text-slate-500 block text-[10px]">OPERATING TERRITORY</span>
                <span className="text-slate-200 font-semibold">{telemetry?.peas?.environment?.type || 'PCCOE Academic Blocks, Labs & Hostels'}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80 flex items-center justify-between">
                <span className="text-slate-400">Ambient Temp:</span>
                <span className="font-mono text-emerald-400 font-bold">{telemetry?.peas?.environment?.ambientTemperature || '28.4°C'}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80 flex items-center justify-between">
                <span className="text-slate-400">Smoke Particle PPM:</span>
                <span className="font-mono text-emerald-400 font-bold">{telemetry?.peas?.environment?.smokePpm || '68 ppm'}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80 flex items-center justify-between">
                <span className="text-slate-400">Hazard Risk:</span>
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-bold text-[10px]">
                  {telemetry?.peas?.environment?.riskLevel || 'NORMAL'}
                </span>
              </div>
            </div>
          </div>

          {/* A - ACTUATORS */}
          <div className="glass-panel p-5 rounded-3xl border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-red-400 font-bold text-xs uppercase tracking-wider">
              <Zap className="w-4 h-4" />
              <span>[A] Actuators</span>
            </div>
            <div className="space-y-2 pt-1 text-xs">
              {(telemetry?.peas?.actuators || [
                { name: "Siren Synthesizer", status: "STANDBY" },
                { name: "SMS / Push Gateway", status: "READY" },
                { name: "Authority Dispatch API", status: "CONNECTED" },
                { name: "PA Evacuation Broadcast", status: "READY" },
                { name: "Sprinkler Solenoids", status: "MONITORED" }
              ]).map((act, i) => (
                <div key={i} className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80 flex items-center justify-between">
                  <span className="text-slate-300 font-medium truncate max-w-[130px]">{act.name}</span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">
                    {act.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* S - SENSORS */}
          <div className="glass-panel p-5 rounded-3xl border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider">
              <Eye className="w-4 h-4" />
              <span>[S] Sensors</span>
            </div>
            <div className="space-y-2 pt-1 text-xs">
              {(telemetry?.peas?.sensors || [
                { name: "MQ-2 Smoke Sensor", status: "ONLINE", value: "72 ppm" },
                { name: "IR Flame Detector", status: "ONLINE", value: "Normal" },
                { name: "DHT22 Temp & Humidity", status: "ONLINE", value: "28°C / 60%" },
                { name: "CCTV AI Vision Feed", status: "STREAMING", value: "30 FPS" },
                { name: "GPS Anchor", status: "LOCKED", value: "PCCOE Akurdi" }
              ]).map((sens, i) => (
                <div key={i} className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80 flex items-center justify-between">
                  <span className="text-slate-300 font-medium truncate max-w-[120px]">{sens.name}</span>
                  <span className="font-mono text-cyan-300 text-[10px]">{sens.value || sens.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AGENT DECISION CYCLE DIAGRAM */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-400" />
            Autonomous AI Agent Closed-Loop Decision Cycle
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-center">
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
              <span className="text-[10px] font-mono text-cyan-400 block mb-1">STEP 1</span>
              <h4 className="font-bold text-white text-xs">Perception</h4>
              <p className="text-[10px] text-slate-400 mt-1">Multi-sensor data fusion (Optical smoke, IR flame, Temp, Video)</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
              <span className="text-[10px] font-mono text-purple-400 block mb-1">STEP 2</span>
              <h4 className="font-bold text-white text-xs">Dehazing & Vision</h4>
              <p className="text-[10px] text-slate-400 mt-1">Neural dehazing pipeline reveals blocked exits & victims in smoke</p>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/40 shadow">
              <span className="text-[10px] font-mono text-indigo-300 block mb-1">STEP 3</span>
              <h4 className="font-bold text-white text-xs">Risk Inference</h4>
              <p className="text-[10px] text-indigo-200 mt-1">Bayesian hazard assessment verifies threat vs false trigger</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
              <span className="text-[10px] font-mono text-amber-400 block mb-1">STEP 4</span>
              <h4 className="font-bold text-white text-xs">Action Selection</h4>
              <p className="text-[10px] text-slate-400 mt-1">Priority dispatch algorithm identifies nearest fire & medical units</p>
            </div>

            <div className="p-4 rounded-2xl bg-red-950/40 border border-red-500/40">
              <span className="text-[10px] font-mono text-red-400 block mb-1">STEP 5</span>
              <h4 className="font-bold text-white text-xs">Actuation</h4>
              <p className="text-[10px] text-red-200 mt-1">Simultaneous alarm sounding, contact alerts & PCMC 101 dispatch</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
