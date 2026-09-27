import React from 'react';
import { 
  AlertTriangle, 
  Radio, 
  Send, 
  Users, 
  Truck, 
  CheckCircle2, 
  Clock, 
  ShieldCheck 
} from 'lucide-react';

export default function EmergencyTimeline({ timeline = [], currentPhase = 'DISPATCHED' }) {
  const steps = [
    {
      id: 'USER_IN_DANGER',
      title: 'USER IN DANGER',
      desc: 'Fire / smoke hazard or distress detected',
      icon: AlertTriangle,
      color: 'text-red-400',
      border: 'border-red-500'
    },
    {
      id: 'PRESS_SOS',
      title: 'PRESS SOS',
      desc: 'Manual or automated panic trigger engaged',
      icon: Radio,
      color: 'text-orange-400',
      border: 'border-orange-500'
    },
    {
      id: 'ALERT_SENT',
      title: 'ALERT SENT',
      desc: 'Central Emergency Cloud & Gateway notified',
      icon: Send,
      color: 'text-amber-400',
      border: 'border-amber-500'
    },
    {
      id: 'CONTACTS_NOTIFIED',
      title: 'CONTACTS + SERVICES NOTIFIED',
      desc: 'Family, Akurdi Fire, Nigdi Police & Ambulance alerted',
      icon: Users,
      color: 'text-blue-400',
      border: 'border-blue-500'
    },
    {
      id: 'SERVICES_DISPATCHED',
      title: 'EMERGENCY TEAM RESPONDS',
      desc: 'PCMC Fire brigade & patrol units in transit',
      icon: Truck,
      color: 'text-indigo-400',
      border: 'border-indigo-500'
    },
    {
      id: 'HELP_REACHED',
      title: 'HELP REACHES VICTIM',
      desc: 'On-scene evacuation & fire suppression initiated',
      icon: ShieldCheck,
      color: 'text-emerald-400',
      border: 'border-emerald-500'
    }
  ];

  // Match timeline data from alert or fallback
  const getStepStatus = (index) => {
    if (timeline && timeline[index]) {
      return timeline[index];
    }
    return { completed: index <= 3, time: index <= 3 ? 'Completed' : 'Pending' };
  };

  return (
    <div className="w-full py-2">
      <div className="relative">
        {/* Desktop / Tablet Timeline (Horizontal) */}
        <div className="hidden md:grid grid-cols-6 gap-2 relative">
          {/* Connector Line behind steps */}
          <div className="absolute top-5 left-8 right-8 h-1 bg-slate-800 -z-0"></div>

          {steps.map((step, idx) => {
            const data = getStepStatus(idx);
            const isDone = data.completed;
            const isCurrent = isDone && (!timeline[idx + 1] || !timeline[idx + 1].completed);
            const Icon = step.icon;

            return (
              <div key={step.id} className="flex flex-col items-center text-center relative z-10">
                {/* Node Icon */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                    isDone
                      ? isCurrent
                        ? `${step.border} bg-red-600 text-white shadow-lg shadow-red-500/50 animate-pulse`
                        : 'border-emerald-500 bg-emerald-950/80 text-emerald-400 shadow'
                      : 'border-slate-700 bg-slate-900 text-slate-500'
                  }`}
                >
                  {isDone && !isCurrent ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </div>

                {/* Title */}
                <h4 className="text-[11px] font-bold text-slate-200 mt-2 uppercase tracking-wide leading-tight">
                  {step.title}
                </h4>

                {/* Subtitle */}
                <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-2 px-1">
                  {step.desc}
                </p>

                {/* Time Badge */}
                <span
                  className={`mt-1.5 text-[9px] font-mono px-1.5 py-0.5 rounded ${
                    isDone
                      ? 'bg-slate-800 text-emerald-300 border border-emerald-500/30'
                      : 'bg-slate-900 text-slate-600'
                  }`}
                >
                  {data.time || 'Pending'}
                </span>
              </div>
            );
          })}
        </div>

        {/* Mobile Timeline (Vertical) */}
        <div className="md:hidden space-y-4 relative pl-6 border-l-2 border-slate-800 ml-3">
          {steps.map((step, idx) => {
            const data = getStepStatus(idx);
            const isDone = data.completed;
            const isCurrent = isDone && (!timeline[idx + 1] || !timeline[idx + 1].completed);
            const Icon = step.icon;

            return (
              <div key={step.id} className="relative">
                {/* Pin indicator */}
                <div
                  className={`absolute -left-[31px] top-0 w-6 h-6 rounded-full flex items-center justify-center border-2 ${
                    isDone
                      ? isCurrent
                        ? 'border-red-500 bg-red-600 text-white animate-pulse'
                        : 'border-emerald-500 bg-emerald-900 text-emerald-300'
                      : 'border-slate-700 bg-slate-900 text-slate-600'
                  }`}
                >
                  <Icon className="w-3 h-3" />
                </div>

                <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-100">{step.title}</span>
                    <span className="text-[10px] font-mono text-slate-400">{data.time || 'Pending'}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
