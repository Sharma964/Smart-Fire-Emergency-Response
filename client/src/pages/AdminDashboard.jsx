import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Flame, 
  Building2, 
  Users, 
  BookOpen, 
  Plus, 
  Edit2, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Activity, 
  MapPin, 
  Phone, 
  X, 
  RefreshCw,
  LogOut,
  Radio
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAlert } from '../context/AlertContext';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const { admin, logoutAdmin } = useAuth();
  const { alerts, refreshAlerts, addToast, cancelEmergency } = useAlert();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('alerts'); // 'alerts' | 'fire' | 'police' | 'hospitals' | 'guidelines'
  const [fireServices, setFireServices] = useState([]);
  const [policeStations, setPoliceStations] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [guidelines, setGuidelines] = useState([]);
  const [users, setUsers] = useState([]);

  // Modal states
  const [modalType, setModalType] = useState(null); // 'fire' | 'police' | 'hospital' | 'guideline'
  const [editItem, setEditItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null); // { type, id, name }

  // Generic form state
  const [formData, setFormData] = useState({});

  const loadAllData = async () => {
    try {
      const [fRes, pRes, hRes, gRes, uRes] = await Promise.all([
        fetch('/api/fire-services'),
        fetch('/api/police-stations'),
        fetch('/api/hospitals'),
        fetch('/api/guidelines'),
        fetch('/api/users')
      ]);
      if (fRes.ok) setFireServices(await fRes.json());
      if (pRes.ok) setPoliceStations(await pRes.json());
      if (hRes.ok) setHospitals(await hRes.json());
      if (gRes.ok) setGuidelines(await gRes.json());
      if (uRes.ok) setUsers(await uRes.json());
    } catch (e) {
      console.warn('Error loading admin datasets:', e);
    }
  };

  useEffect(() => {
    loadAllData();
    refreshAlerts();
  }, []);

  const handleLogout = () => {
    logoutAdmin();
    addToast('Admin logged out', 'info');
    navigate('/admin/login');
  };

  // Change alert status (ACTIVE -> RESPONDING -> RESOLVED)
  const handleUpdateAlertStatus = async (alertId, newStatus) => {
    try {
      const res = await fetch(`/api/alerts/${alertId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        addToast(`Alert ${alertId} status changed to ${newStatus}`, 'success');
        refreshAlerts();
      }
    } catch (e) {
      addToast('Failed to update alert', 'error');
    }
  };

  // Generic Create / Update handler
  const handleSaveItem = async (e) => {
    e.preventDefault();
    let endpoint = '';
    if (modalType === 'fire') endpoint = '/api/fire-services';
    if (modalType === 'police') endpoint = '/api/police-stations';
    if (modalType === 'hospital') endpoint = '/api/hospitals';
    if (modalType === 'guideline') endpoint = '/api/guidelines';

    try {
      const url = editItem ? `${endpoint}/${editItem.id}` : endpoint;
      const method = editItem ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        addToast(`✓ Item ${editItem ? 'updated' : 'created'} successfully`, 'success');
        loadAllData();
        setModalType(null);
        setEditItem(null);
        setFormData({});
      }
    } catch (err) {
      addToast('Error saving record', 'error');
    }
  };

  // Generic Delete handler
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    const { type, id } = deleteTarget;
    let endpoint = '';
    if (type === 'fire') endpoint = `/api/fire-services/${id}`;
    if (type === 'police') endpoint = `/api/police-stations/${id}`;
    if (type === 'hospital') endpoint = `/api/hospitals/${id}`;
    if (type === 'guideline') endpoint = `/api/guidelines/${id}`;
    if (type === 'alert') endpoint = `/api/alerts/${id}`;

    try {
      const res = await fetch(endpoint, { method: 'DELETE' });
      if (res.ok) {
        addToast('Record deleted successfully', 'info');
        loadAllData();
        refreshAlerts();
      }
    } catch (e) {
      addToast('Error deleting item', 'error');
    } finally {
      setDeleteTarget(null);
    }
  };

  const openAddModal = (type) => {
    setModalType(type);
    setEditItem(null);
    if (type === 'fire') {
      setFormData({ name: '', location: '', phone: '', distance: '2.0 km', latitude: 18.65, longitude: 73.76, status: 'Available' });
    } else if (type === 'police') {
      setFormData({ name: '', location: '', phone: '', distance: '2.0 km', latitude: 18.65, longitude: 73.76, status: 'Available' });
    } else if (type === 'hospital') {
      setFormData({ name: '', location: '', phone: '', distance: '2.0 km', burnUnit: 'Yes', latitude: 18.65, longitude: 73.76, status: 'Available' });
    } else if (type === 'guideline') {
      setFormData({ title: '', category: 'Fire Safety Tips', content: '', importance: 'HIGH' });
    }
  };

  const openEditModal = (type, item) => {
    setModalType(type);
    setEditItem(item);
    setFormData({ ...item });
  };

  // Statistics
  const activeEmergenciesCount = alerts.filter(a => a.status === 'ACTIVE' || a.status === 'DISPATCHED' || a.status === 'RESPONDING').length;
  const resolvedEmergenciesCount = alerts.filter(a => a.status === 'RESOLVED').length;

  return (
    <div className="min-h-screen pb-16 bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <Activity className="w-5 h-5" />
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                PCCOE Emergency Command Center
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Admin Portal • Incident Dispatch, Services Master Data & Safety Knowledge Base
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => { loadAllData(); refreshAlerts(); addToast('Data refreshed', 'info'); }}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition"
              title="Refresh Data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={handleLogout}
              className="px-3.5 py-2 rounded-xl bg-red-600/20 hover:bg-red-600 hover:text-white text-red-300 text-xs font-bold border border-red-500/30 transition flex items-center gap-1.5"
            >
              <LogOut className="w-4 h-4" />
              Exit Admin
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* TOP STATISTICS METRICS BAR */}
        {/* ======================================================== */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          <div className="glass-panel p-4 rounded-2xl border border-red-500/40 bg-red-950/20">
            <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider block">
              ACTIVE EMERGENCIES
            </span>
            <span className="text-2xl sm:text-3xl font-black text-white mt-1 block">
              {String(activeEmergenciesCount).padStart(2, '0')}
            </span>
            <span className="text-[10px] text-red-300 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span> Live Broadcast
            </span>
          </div>

          <div className="glass-panel p-4 rounded-2xl border border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              RESOLVED
            </span>
            <span className="text-2xl sm:text-3xl font-black text-white mt-1 block">
              {String(resolvedEmergenciesCount).padStart(2, '0')}
            </span>
            <span className="text-[10px] text-emerald-400">Total Cleared</span>
          </div>

          <div className="glass-panel p-4 rounded-2xl border border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              FIRE STATIONS
            </span>
            <span className="text-2xl sm:text-3xl font-black text-white mt-1 block">
              {String(fireServices.length).padStart(2, '0')}
            </span>
            <span className="text-[10px] text-slate-400">PCMC Fire Units</span>
          </div>

          <div className="glass-panel p-4 rounded-2xl border border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              POLICE STATIONS
            </span>
            <span className="text-2xl sm:text-3xl font-black text-white mt-1 block">
              {String(policeStations.length).padStart(2, '0')}
            </span>
            <span className="text-[10px] text-slate-400">Patrol Units</span>
          </div>

          <div className="glass-panel p-4 rounded-2xl border border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              HOSPITALS
            </span>
            <span className="text-2xl sm:text-3xl font-black text-white mt-1 block">
              {String(hospitals.length).padStart(2, '0')}
            </span>
            <span className="text-[10px] text-emerald-400">Burn Units Ready</span>
          </div>

          <div className="glass-panel p-4 rounded-2xl border border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              REGISTERED USERS
            </span>
            <span className="text-2xl sm:text-3xl font-black text-white mt-1 block">
              {String(users.length || 12).padStart(2, '0')}
            </span>
            <span className="text-[10px] text-blue-400">Faculty & Students</span>
          </div>
        </div>

        {/* ======================================================== */}
        {/* TABS NAVIGATION */}
        {/* ======================================================== */}
        <div className="flex items-center gap-2 border-b border-slate-800 overflow-x-auto pb-2 scrollbar-none text-xs font-bold">
          <button
            onClick={() => setActiveTab('alerts')}
            className={`px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'alerts' ? 'bg-red-600 text-white shadow' : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <ShieldAlert className="w-4 h-4" /> Emergency Alerts ({alerts.length})
          </button>
          <button
            onClick={() => setActiveTab('fire')}
            className={`px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'fire' ? 'bg-red-600 text-white shadow' : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <Flame className="w-4 h-4" /> Fire Services ({fireServices.length})
          </button>
          <button
            onClick={() => setActiveTab('police')}
            className={`px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'police' ? 'bg-blue-600 text-white shadow' : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <ShieldAlert className="w-4 h-4" /> Police Stations ({policeStations.length})
          </button>
          <button
            onClick={() => setActiveTab('hospitals')}
            className={`px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'hospitals' ? 'bg-emerald-600 text-white shadow' : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <Building2 className="w-4 h-4" /> Hospitals ({hospitals.length})
          </button>
          <button
            onClick={() => setActiveTab('guidelines')}
            className={`px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'guidelines' ? 'bg-purple-600 text-white shadow' : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4" /> Guidelines ({guidelines.length})
          </button>
        </div>

        {/* ======================================================== */}
        {/* TAB 1: EMERGENCY ALERTS TABLE & LIVE STATUS DISPATCH */}
        {/* ======================================================== */}
        {activeTab === 'alerts' && (
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Emergency Incident Feed</h3>
                <p className="text-xs text-slate-400">Real-time alerts broadcast from devices and campus sensors</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900 text-slate-400 font-mono text-[11px] uppercase border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-3">Alert ID</th>
                    <th className="py-3 px-3">Location</th>
                    <th className="py-3 px-3">Type & User</th>
                    <th className="py-3 px-3">Timestamp</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-sans">
                  {alerts.map((alt) => {
                    const isActive = alt.status === 'ACTIVE' || alt.status === 'DISPATCHED' || alt.status === 'RESPONDING';
                    return (
                      <tr key={alt.id} className={`hover:bg-slate-900/50 ${isActive ? 'bg-red-950/20' : ''}`}>
                        <td className="py-3.5 px-3 font-mono font-bold text-red-400">
                          {alt.id}
                        </td>
                        <td className="py-3.5 px-3 max-w-xs truncate">
                          <div className="font-semibold text-slate-200">{alt.location}</div>
                          <div className="text-[10px] text-slate-500 font-mono">{alt.latitude}° N, {alt.longitude}° E</div>
                        </td>
                        <td className="py-3.5 px-3">
                          <div className="font-bold text-white">{alt.emergencyType}</div>
                          <div className="text-[11px] text-slate-400">{alt.userName} ({alt.userPhone})</div>
                        </td>
                        <td className="py-3.5 px-3 font-mono text-slate-400">
                          {new Date(alt.timestamp).toLocaleTimeString()}
                          <div className="text-[10px] text-slate-500">{new Date(alt.timestamp).toLocaleDateString()}</div>
                        </td>
                        <td className="py-3.5 px-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            isActive
                              ? 'bg-red-600 text-white animate-pulse'
                              : 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                          }`}>
                            {alt.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-right space-x-1.5">
                          {isActive ? (
                            <>
                              <button
                                onClick={() => handleUpdateAlertStatus(alt.id, 'RESPONDING')}
                                className="px-2 py-1 rounded bg-amber-600 text-white text-[10px] font-bold hover:bg-amber-500"
                              >
                                Set Responding
                              </button>
                              <button
                                onClick={() => handleUpdateAlertStatus(alt.id, 'RESOLVED')}
                                className="px-2 py-1 rounded bg-emerald-600 text-white text-[10px] font-bold hover:bg-emerald-500"
                              >
                                Resolve
                              </button>
                            </>
                          ) : (
                            <span className="text-[10px] text-slate-500 font-mono">Closed</span>
                          )}
                          <button
                            onClick={() => setDeleteTarget({ type: 'alert', id: alt.id, name: alt.id })}
                            className="p-1 text-slate-500 hover:text-red-400 transition"
                            title="Delete Record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: FIRE SERVICES MANAGEMENT */}
        {/* ======================================================== */}
        {activeTab === 'fire' && (
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Fire Services Management</h3>
                <p className="text-xs text-slate-400">PCMC fire brigades and auxiliary sub-stations on the emergency grid</p>
              </div>
              <button
                onClick={() => openAddModal('fire')}
                className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-1.5 shadow"
              >
                <Plus className="w-4 h-4" /> Add Fire Service
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {fireServices.map((fs) => (
                <div key={fs.id} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between">
                      <h4 className="font-bold text-white text-sm">{fs.name}</h4>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                        {fs.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{fs.location}</p>
                    <div className="text-xs font-mono text-slate-300 mt-2 space-y-0.5">
                      <div>Distance: {fs.distance}</div>
                      <div>Phone: {fs.phone}</div>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                    <button onClick={() => openEditModal('fire', fs)} className="p-1.5 text-slate-400 hover:text-white">
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => setDeleteTarget({ type: 'fire', id: fs.id, name: fs.name })} className="p-1.5 text-slate-400 hover:text-red-400">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: POLICE STATIONS MANAGEMENT */}
        {/* ======================================================== */}
        {activeTab === 'police' && (
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Police Stations Management</h3>
                <p className="text-xs text-slate-400">Law enforcement units for perimeter isolation and crowd management</p>
              </div>
              <button
                onClick={() => openAddModal('police')}
                className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow"
              >
                <Plus className="w-4 h-4" /> Add Police Station
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {policeStations.map((ps) => (
                <div key={ps.id} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between">
                      <h4 className="font-bold text-white text-sm">{ps.name}</h4>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                        {ps.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{ps.location}</p>
                    <div className="text-xs font-mono text-slate-300 mt-2 space-y-0.5">
                      <div>Distance: {ps.distance}</div>
                      <div>Phone: {ps.phone}</div>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                    <button onClick={() => openEditModal('police', ps)} className="p-1.5 text-slate-400 hover:text-white">
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => setDeleteTarget({ type: 'police', id: ps.id, name: ps.name })} className="p-1.5 text-slate-400 hover:text-red-400">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: HOSPITALS MANAGEMENT */}
        {/* ======================================================== */}
        {activeTab === 'hospitals' && (
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Hospitals & Medical Centers</h3>
                <p className="text-xs text-slate-400">Trauma centers and dedicated burn facilities near PCCOE</p>
              </div>
              <button
                onClick={() => openAddModal('hospital')}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow"
              >
                <Plus className="w-4 h-4" /> Add Hospital
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {hospitals.map((hp) => (
                <div key={hp.id} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between">
                      <h4 className="font-bold text-white text-sm">{hp.name}</h4>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                        {hp.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{hp.location}</p>
                    <div className="text-xs font-mono text-slate-300 mt-2 space-y-0.5">
                      <div>Distance: {hp.distance}</div>
                      <div>Burn Unit: <span className="text-emerald-400">{hp.burnUnit}</span></div>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                    <button onClick={() => openEditModal('hospital', hp)} className="p-1.5 text-slate-400 hover:text-white">
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => setDeleteTarget({ type: 'hospital', id: hp.id, name: hp.name })} className="p-1.5 text-slate-400 hover:text-red-400">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 5: GUIDELINES MANAGEMENT */}
        {/* ======================================================== */}
        {activeTab === 'guidelines' && (
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Emergency Guidelines Management</h3>
                <p className="text-xs text-slate-400">Standard operating procedures and first-aid instructions</p>
              </div>
              <button
                onClick={() => openAddModal('guideline')}
                className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 shadow"
              >
                <Plus className="w-4 h-4" /> Add Guideline
              </button>
            </div>

            <div className="divide-y divide-slate-800/80">
              {guidelines.map((gdl) => (
                <div key={gdl.id} className="py-3.5 flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">
                        {gdl.category}
                      </span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                        {gdl.importance}
                      </span>
                    </div>
                    <h4 className="font-bold text-white text-sm">{gdl.title}</h4>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">{gdl.content}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => openEditModal('guideline', gdl)} className="p-1.5 text-slate-400 hover:text-white">
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => setDeleteTarget({ type: 'guideline', id: gdl.id, name: gdl.title })} className="p-1.5 text-slate-400 hover:text-red-400">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* GENERIC ADD / EDIT MODAL */}
      {/* ======================================================== */}
      {modalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white uppercase tracking-wider">
                {editItem ? `Edit ${modalType}` : `Add New ${modalType}`}
              </h3>
              <button onClick={() => setModalType(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="space-y-3">
              {modalType === 'guideline' ? (
                <>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 uppercase mb-1">Title</label>
                    <input
                      type="text"
                      value={formData.title || ''}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 uppercase mb-1">Category</label>
                    <select
                      value={formData.category || 'Fire Safety Tips'}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none"
                    >
                      <option value="Fire Safety Tips">Fire Safety Tips</option>
                      <option value="First Aid">First Aid</option>
                      <option value="Evacuation Instructions">Evacuation Instructions</option>
                      <option value="Emergency Rules">Emergency Rules</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 uppercase mb-1">Importance</label>
                    <select
                      value={formData.importance || 'HIGH'}
                      onChange={(e) => setFormData({ ...formData, importance: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none"
                    >
                      <option value="CRITICAL">CRITICAL</option>
                      <option value="HIGH">HIGH</option>
                      <option value="MEDIUM">MEDIUM</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 uppercase mb-1">Content</label>
                    <textarea
                      rows={4}
                      value={formData.content || ''}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none"
                      required
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 uppercase mb-1">Name</label>
                    <input
                      type="text"
                      value={formData.name || ''}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 uppercase mb-1">Location Address</label>
                    <input
                      type="text"
                      value={formData.location || ''}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 uppercase mb-1">Phone</label>
                      <input
                        type="text"
                        value={formData.phone || ''}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 uppercase mb-1">Distance</label>
                      <input
                        type="text"
                        value={formData.distance || '1.5 km'}
                        onChange={(e) => setFormData({ ...formData, distance: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none"
                        required
                      />
                    </div>
                  </div>
                  {modalType === 'hospital' && (
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 uppercase mb-1">Burn Unit Facility</label>
                      <input
                        type="text"
                        value={formData.burnUnit || 'Yes'}
                        onChange={(e) => setFormData({ ...formData, burnUnit: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none"
                      />
                    </div>
                  )}
                </>
              )}

              <div className="grid grid-cols-2 gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setModalType(null)}
                  className="py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* DELETE CONFIRMATION DIALOG */}
      {/* ======================================================== */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center">
            <Trash2 className="w-10 h-10 text-red-500 mx-auto mb-3" />
            <h4 className="text-base font-bold text-white">Delete "{deleteTarget.name}"?</h4>
            <p className="text-xs text-slate-400 mt-1">
              This will permanently delete this record from the emergency database.
            </p>
            <div className="grid grid-cols-2 gap-3 mt-5">
              <button
                onClick={() => setDeleteTarget(null)}
                className="py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
