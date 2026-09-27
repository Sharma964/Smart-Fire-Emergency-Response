import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Flame, 
  ShieldAlert, 
  MapPin, 
  Video, 
  Bell, 
  BookOpen, 
  Users, 
  Cpu, 
  Lock, 
  Menu, 
  X, 
  Radio, 
  CheckCircle2, 
  AlertOctagon,
  Volume2,
  VolumeX,
  User
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAlert } from '../context/AlertContext';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, admin } = useAuth();
  const { activeAlert, alarmActive, stopAlarm, activateAlarm } = useAlert();

  const navItems = [
    { label: 'Dashboard', path: '/', icon: Flame },
    { label: 'SOS Alert', path: '/sos', icon: ShieldAlert, highlight: true },
    { label: 'Services', path: '/services', icon: MapPin },
    { label: 'Dehazing', path: '/dehazing', icon: Video },
    { label: 'Alarm', path: '/alarm', icon: Bell },
    { label: 'Guidelines', path: '/guidelines', icon: BookOpen },
    { label: 'Contacts', path: '/contacts', icon: Users },
    { label: 'AI Agent', path: '/agent-telemetry', icon: Cpu },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/95 backdrop-blur-md">
      {/* Top emergency alert banner */}
      {activeAlert && activeAlert.status !== 'RESOLVED' && (
        <div className="bg-red-600 text-white px-4 py-1.5 flex items-center justify-between text-xs font-semibold tracking-wide animate-pulse">
          <div className="flex items-center gap-2 truncate">
            <AlertOctagon className="w-4 h-4 text-yellow-300 shrink-0" />
            <span className="truncate">CRITICAL FIRE ALERT ACTIVE: {activeAlert.emergencyType} — {activeAlert.location}</span>
          </div>
          <button
            onClick={() => navigate('/sos')}
            className="bg-white text-red-700 px-3 py-0.5 rounded-full font-bold text-xs uppercase shadow hover:bg-slate-100 transition shrink-0 ml-2"
          >
            View Dispatch
          </button>
        </div>
      )}

      {/* Main Navigation Bar — full width with responsive padding */}
      <div className="w-full px-3 sm:px-5 lg:px-6">
        <div className="flex items-center justify-between h-16 gap-2">
          
          {/* Brand Logo & College Attribution (Always fully visible) */}
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-red-500 to-orange-600 text-white shadow-md shadow-red-500/30 group-hover:scale-105 transition-transform shrink-0">
              <Flame className="w-5 h-5" />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 border-2 border-slate-950 rounded-full"></div>
            </div>
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-extrabold text-sm sm:text-base tracking-tight text-white whitespace-nowrap">
                  SMART FIRE RESPONSE
                </span>
                <span className="bg-red-500/20 text-red-400 border border-red-500/30 text-[9px] font-black px-1.5 py-0.5 rounded uppercase shrink-0 leading-none">
                  PCCOE
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium whitespace-nowrap leading-tight mt-0.5 hidden sm:block">
                AI + Real-Time Emergency Alerting
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links — Compact & perfectly spaced */}
          <nav className="hidden xl:flex items-center gap-1 shrink-0">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? item.highlight
                        ? 'bg-red-600 text-white shadow-md shadow-red-600/40'
                        : 'bg-slate-800 text-white border border-slate-700'
                      : item.highlight
                      ? 'text-red-400 hover:bg-red-500/10'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${item.highlight && !isActive ? 'text-red-400' : ''}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Actions & Status — Compact, all 100% visible */}
          <div className="hidden sm:flex items-center gap-2 shrink-0">
            {/* Siren Toggle Button */}
            <button
              onClick={alarmActive ? stopAlarm : activateAlarm}
              title={alarmActive ? "Stop Emergency Siren" : "Sound Siren"}
              className={`px-2.5 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition whitespace-nowrap ${
                alarmActive
                  ? 'bg-red-600 text-white border-red-500 animate-pulse'
                  : 'bg-slate-800/90 text-slate-300 border-slate-700 hover:text-white'
              }`}
            >
              {alarmActive ? <Volume2 className="w-3.5 h-3.5 text-yellow-300" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span>{alarmActive ? 'SIREN ON' : 'SIREN'}</span>
            </button>

            {/* Online Status Pill */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-[10px] font-semibold text-slate-300 whitespace-nowrap">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>ONLINE</span>
            </div>

            {/* Admin Portal Button */}
            {admin?.isAdmin ? (
              <Link
                to="/admin/dashboard"
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold hover:bg-amber-500/30 transition whitespace-nowrap"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>ADMIN</span>
              </Link>
            ) : (
              <Link
                to="/admin/login"
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium border border-slate-700 transition whitespace-nowrap"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Admin</span>
              </Link>
            )}

            {/* Device / User Badge (Guaranteed 100% visible) */}
            <Link
              to="/auth"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-200 transition whitespace-nowrap shrink-0"
              title="Device Authentication"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0"></div>
              <span className="font-semibold">{user?.name ? user.name.split(' ')[0] : 'Device'}</span>
            </Link>
          </div>

          {/* Tablet & Mobile Header Actions */}
          <div className="flex xl:hidden items-center gap-2 shrink-0">
            <Link
              to="/sos"
              className="bg-red-600 text-white px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 shadow-md shadow-red-600/30"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>SOS</span>
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-b border-slate-800 bg-slate-950 px-4 pt-2 pb-6 space-y-1 animate-fade-in">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive
                    ? item.highlight
                      ? 'bg-red-600 text-white'
                      : 'bg-slate-800 text-white'
                    : 'text-slate-300 hover:bg-slate-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
          <div className="pt-4 border-t border-slate-800 flex flex-col gap-2">
            <Link
              to="/admin/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 text-sm font-semibold"
            >
              <Lock className="w-4 h-4" />
              Admin Command Center
            </Link>
            <Link
              to="/auth"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-slate-800 text-slate-200 text-sm"
            >
              <Radio className="w-4 h-4 text-emerald-400" />
              Device Verification ({user?.deviceId || 'DEV-PCCOE'})
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
