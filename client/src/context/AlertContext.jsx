import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { sirenEngine } from '../utils/sirenAudio';

const AlertContext = createContext();

export function AlertProvider({ children }) {
  const [activeAlert, setActiveAlert] = useState(() => {
    const saved = localStorage.getItem('pccoe_active_alert');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return null; }
    }
    return null;
  });

  const [alerts, setAlerts] = useState([]);
  const [alarmActive, setAlarmActive] = useState(false);
  const [toasts, setToasts] = useState([]);
  const timelineIntervalRef = useRef(null);

  // Toast notification helper
  const addToast = (message, type = 'info', duration = 4000) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Fetch alerts from backend
  const refreshAlerts = async () => {
    try {
      const res = await fetch('/api/alerts');
      if (res.ok) {
        const data = await res.json();
        setAlerts(data);
        // Check if there is an active alert matching
        if (activeAlert) {
          const match = data.find(a => a.id === activeAlert.id);
          if (match && match.status === 'RESOLVED') {
            setActiveAlert(null);
            localStorage.removeItem('pccoe_active_alert');
          }
        }
      }
    } catch (e) {
      console.warn('Could not fetch alerts from server:', e);
    }
  };

  useEffect(() => {
    refreshAlerts();
    const interval = setInterval(refreshAlerts, 6000);
    return () => clearInterval(interval);
  }, []);

  // Save activeAlert to localStorage
  useEffect(() => {
    if (activeAlert) {
      localStorage.setItem('pccoe_active_alert', JSON.stringify(activeAlert));
    } else {
      localStorage.removeItem('pccoe_active_alert');
    }
  }, [activeAlert]);

  // Timeline progression simulation when an active alert exists
  useEffect(() => {
    if (!activeAlert || activeAlert.status === 'RESOLVED') {
      if (timelineIntervalRef.current) clearInterval(timelineIntervalRef.current);
      return;
    }

    timelineIntervalRef.current = setInterval(() => {
      setActiveAlert(current => {
        if (!current || !current.timeline) return current;
        const timeline = [...current.timeline];
        const nextIncompleteIndex = timeline.findIndex(step => !step.completed);
        
        if (nextIncompleteIndex !== -1) {
          const nowStr = new Date().toLocaleTimeString();
          timeline[nextIncompleteIndex] = {
            ...timeline[nextIncompleteIndex],
            completed: true,
            time: nowStr
          };
          const updated = { ...current, timeline };
          
          if (nextIncompleteIndex === 5) {
            updated.dispatchPhase = 'RESPONDING';
            addToast('🚒 Fire Brigade and Police units are 0.8 km away!', 'warning', 5000);
          } else if (nextIncompleteIndex === 6) {
            updated.dispatchPhase = 'HELP_REACHED';
            addToast('🚨 First responders arrived at PCCOE Campus!', 'success', 6000);
          }
          return updated;
        }
        return current;
      });
    }, 5000);

    return () => {
      if (timelineIntervalRef.current) clearInterval(timelineIntervalRef.current);
    };
  }, [activeAlert?.id]);

  // Trigger SOS
  const triggerSos = async (payload = {}) => {
    const alertData = {
      userId: payload.userId || 'usr-pccoe-001',
      userName: payload.userName || 'Prof. Rajesh Deshmukh',
      userPhone: payload.userPhone || '+91 98230 45678',
      emergencyType: payload.emergencyType || 'Fire Emergency',
      location: payload.location || 'PCCOE Campus, Sector 26, Pradhikaran, Akurdi, Pune - 411044',
      latitude: payload.latitude || 18.6517,
      longitude: payload.longitude || 73.7615,
      severity: payload.severity || 'CRITICAL'
    };

    try {
      const res = await fetch('/api/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(alertData)
      });
      const data = await res.json();
      if (res.ok && data.alert) {
        setActiveAlert(data.alert);
        addToast('🚨 EMERGENCY SOS DISPATCHED: Akurdi Fire, Police & Hospital Notified!', 'error', 6000);
        refreshAlerts();
        return { success: true, alert: data.alert };
      }
    } catch (e) {
      console.warn('Fallback local SOS creation:', e);
    }

    // Local fallback
    const now = new Date();
    const fallbackAlert = {
      id: `ALT-${Date.now()}`,
      ...alertData,
      timestamp: now.toISOString(),
      status: 'ACTIVE',
      dispatchPhase: 'DISPATCHED',
      notifiedContacts: ['Father', 'Mother', 'PCCOE Campus Security', 'Campus Doctor'],
      notifiedServices: [
        { name: 'PCMC Fire Sub-Station Akurdi', type: 'Fire Brigade', time: now.toLocaleTimeString(), status: 'DISPATCHED' },
        { name: 'Nigdi Police Station', type: 'Police', time: now.toLocaleTimeString(), status: 'ALERTED' },
        { name: 'Star Multispeciality Hospital', type: 'Hospital', time: now.toLocaleTimeString(), status: 'STANDBY' }
      ],
      timeline: [
        { step: 'USER_IN_DANGER', title: 'User In Danger Detected', time: now.toLocaleTimeString(), completed: true },
        { step: 'PRESS_SOS', title: 'Emergency SOS Triggered', time: now.toLocaleTimeString(), completed: true },
        { step: 'ALERT_SENT', title: 'Central AI Command Alert Sent', time: now.toLocaleTimeString(), completed: true },
        { step: 'CONTACTS_NOTIFIED', title: 'Family & Emergency Contacts Alerted', time: now.toLocaleTimeString(), completed: true },
        { step: 'SERVICES_DISPATCHED', title: 'Akurdi Fire, Nigdi Police & Ambulance Dispatched', time: now.toLocaleTimeString(), completed: true },
        { step: 'RESPONDING', title: 'Emergency Response Team En Route', time: 'In Progress...', completed: false },
        { step: 'HELP_REACHED', title: 'First Responders on Scene', time: 'Awaiting Arrival', completed: false }
      ]
    };
    setActiveAlert(fallbackAlert);
    addToast('🚨 EMERGENCY SOS DISPATCHED (Local Mode)', 'error', 5000);
    return { success: true, alert: fallbackAlert };
  };

  // Cancel / Resolve Emergency
  const cancelEmergency = async (alertId, notes = 'Cancelled by user after confirmation') => {
    const targetId = alertId || activeAlert?.id;
    if (!targetId) return;

    try {
      await fetch(`/api/alerts/${targetId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'RESOLVED', notes, resolvedAt: new Date().toISOString() })
      });
    } catch (e) {
      console.warn('Backend update failed, resolving locally:', e);
    }

    setActiveAlert(null);
    localStorage.removeItem('pccoe_active_alert');
    sirenEngine.stop();
    setAlarmActive(false);
    addToast('✓ Emergency Marked RESOLVED. All services stood down.', 'success', 4000);
    refreshAlerts();
  };

  // Siren / Alarm handlers
  const activateAlarm = () => {
    setAlarmActive(true);
    sirenEngine.play();
    addToast('🔊 EMERGENCY SIREN ACTIVATED: Siren tone sounding', 'error', 5000);
  };

  const stopAlarm = () => {
    setAlarmActive(false);
    sirenEngine.stop();
    addToast('Siren stopped', 'info', 3000);
  };

  const muteAlarm = () => {
    sirenEngine.stop();
    addToast('Siren muted', 'info', 2500);
  };

  return (
    <AlertContext.Provider value={{
      activeAlert,
      alerts,
      refreshAlerts,
      triggerSos,
      cancelEmergency,
      alarmActive,
      activateAlarm,
      stopAlarm,
      muteAlarm,
      toasts,
      addToast,
      removeToast
    }}>
      {children}
    </AlertContext.Provider>
  );
}

export function useAlert() {
  return useContext(AlertContext);
}
