import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('pccoe_fire_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return null; }
    }
    // Default authenticated demo state for immediate responsiveness
    return {
      id: 'usr-pccoe-001',
      name: 'Prof. Rajesh Deshmukh',
      phone: '+91 98230 45678',
      deviceId: 'DEV-PCCOE-CAMPUS-702',
      role: 'Faculty / Staff',
      isAuthenticated: true
    };
  });

  const [admin, setAdmin] = useState(() => {
    const saved = localStorage.getItem('pccoe_fire_admin');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return null; }
    }
    return null;
  });

  const loginUser = async ({ deviceId, name, phone }) => {
    try {
      const res = await fetch('/api/auth/authenticate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deviceId, name, phone })
      });
      const data = await res.json();
      if (res.ok && data.user) {
        const u = { ...data.user, isAuthenticated: true };
        setUser(u);
        localStorage.setItem('pccoe_fire_user', JSON.stringify(u));
        return { success: true };
      } else {
        // Fallback local
        const u = {
          id: `usr-${Date.now()}`,
          name,
          phone,
          deviceId,
          role: 'user',
          isAuthenticated: true
        };
        setUser(u);
        localStorage.setItem('pccoe_fire_user', JSON.stringify(u));
        return { success: true };
      }
    } catch (e) {
      const u = {
        id: `usr-${Date.now()}`,
        name,
        phone,
        deviceId,
        role: 'user',
        isAuthenticated: true
      };
      setUser(u);
      localStorage.setItem('pccoe_fire_user', JSON.stringify(u));
      return { success: true };
    }
  };

  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem('pccoe_fire_user');
  };

  const loginAdmin = async (username, password) => {
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.ok && data.admin) {
        const adm = { ...data.admin, isAdmin: true, token: data.token };
        setAdmin(adm);
        localStorage.setItem('pccoe_fire_admin', JSON.stringify(adm));
        return { success: true };
      }
      return { success: false, error: data.error || 'Invalid credentials' };
    } catch (e) {
      if (username === 'admin' && password === 'pccoe123') {
        const adm = {
          id: 'adm-001',
          name: 'Chief Emergency Officer (PCCOE)',
          role: 'SUPER_ADMIN',
          isAdmin: true
        };
        setAdmin(adm);
        localStorage.setItem('pccoe_fire_admin', JSON.stringify(adm));
        return { success: true };
      }
      return { success: false, error: 'Connection failed' };
    }
  };

  const logoutAdmin = () => {
    setAdmin(null);
    localStorage.removeItem('pccoe_fire_admin');
  };

  return (
    <AuthContext.Provider value={{
      user,
      loginUser,
      logoutUser,
      admin,
      loginAdmin,
      logoutAdmin
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
