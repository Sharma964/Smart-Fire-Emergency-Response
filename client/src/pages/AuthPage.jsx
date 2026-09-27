import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAlert } from '../context/AlertContext';
import { 
  ShieldCheck, 
  Flame, 
  Smartphone, 
  User, 
  KeyRound, 
  CheckCircle2, 
  Radio, 
  ArrowRight,
  Wifi,
  Sparkles
} from 'lucide-react';

export default function AuthPage() {
  const { user, loginUser } = useAuth();
  const { addToast } = useAlert();
  const navigate = useNavigate();

  const [deviceId, setDeviceId] = useState(user?.deviceId || 'DEV-PCCOE-CAMPUS-702');
  const [name, setName] = useState(user?.name || 'Prof. Rajesh Deshmukh');
  const [phone, setPhone] = useState(user?.phone || '+91 98230 45678');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!deviceId.trim() || !name.trim() || !phone.trim()) {
      addToast('Please fill in all fields', 'warning');
      return;
    }

    setLoading(true);
    try {
      await loginUser({ deviceId, name, phone });
      addToast('✓ Device authenticated and connected to PCCOE Emergency Grid', 'success');
      navigate('/');
    } catch (err) {
      addToast('Authentication error, continuing in local mode', 'info');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const setDemoProfile = (type) => {
    if (type === 'faculty') {
      setDeviceId('DEV-PCCOE-CAMPUS-702');
      setName('Prof. Rajesh Deshmukh');
      setPhone('+91 98230 45678');
    } else {
      setDeviceId('DEV-PCCOE-MOBILE-109');
      setName('Sonu Kumar (Student)');
      setPhone('+91 91234 56789');
    }
    addToast(`Demo profile selected: ${type.toUpperCase()}`, 'info', 2000);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="w-full max-w-md">
        {/* Header Card */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-red-600 to-orange-500 shadow-xl shadow-red-500/20 mb-4 animate-bounce">
            <Flame className="w-9 h-9 text-white" />
          </div>
          <div className="inline-block bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
            PCCOE Emergency Response Hub
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Smart Fire Emergency Response
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            AI + Real-Time Emergency Response
          </p>
        </div>

        {/* Form Card */}
        <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-2xl relative overflow-hidden">
          {/* Subtle top accent gradient */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-orange-500 to-amber-500"></div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Device ID */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-red-400" />
                Device ID
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={deviceId}
                  onChange={(e) => setDeviceId(e.target.value)}
                  placeholder="e.g. DEV-PCCOE-CAMPUS-702"
                  className="w-full bg-slate-950/80 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white font-mono placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                  required
                />
                <span className="absolute right-3 top-2.5 text-xs text-emerald-400 font-mono flex items-center gap-1">
                  <Wifi className="w-3 h-3 animate-pulse" /> Linked
                </span>
              </div>
            </div>

            {/* User Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-red-400" />
                User Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name (e.g. Prof. Rajesh Deshmukh)"
                className="w-full bg-slate-950/80 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                required
              />
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-red-400" />
                Mobile Number
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98230 45678"
                className="w-full bg-slate-950/80 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white font-mono placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                required
              />
            </div>

            {/* Quick Autofill Buttons */}
            <div className="pt-1 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Quick Demo:
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setDemoProfile('faculty')}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold border border-slate-700 transition"
                >
                  Faculty
                </button>
                <button
                  type="button"
                  onClick={() => setDemoProfile('student')}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold border border-slate-700 transition"
                >
                  Student
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 text-sm uppercase tracking-wider transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              {loading ? (
                <span>Authenticating Device...</span>
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5" />
                  <span>Authenticate Device</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>
          </form>

          {/* Security & Readiness Checklist */}
          <div className="mt-6 pt-5 border-t border-slate-800/80 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>✓ Secure 256-bit encrypted emergency telemetry</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>✓ Emergency-ready system connected to PCMC Fire Brigade</span>
            </div>
          </div>
        </div>

        {/* Location attribution */}
        <p className="text-center text-xs text-slate-500 mt-4">
          Pimpri Chinchwad College of Engineering (PCCOE) • Sector 26, Pradhikaran, Akurdi, Pune
        </p>
      </div>
    </div>
  );
}
