import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AlertProvider } from './context/AlertContext';
import Navbar from './components/Navbar';
import ToastContainer from './components/ToastContainer';

// Pages
import AuthPage from './pages/AuthPage';
import HomeDashboard from './pages/HomeDashboard';
import SosEmergencyPage from './pages/SosEmergencyPage';
import EmergencyContactsPage from './pages/EmergencyContactsPage';
import NearbyServicesPage from './pages/NearbyServicesPage';
import AiVideoDehazingPage from './pages/AiVideoDehazingPage';
import EmergencyAlarmPage from './pages/EmergencyAlarmPage';
import SafetyGuidelinesPage from './pages/SafetyGuidelinesPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboard from './pages/AdminDashboard';
import AgentTelemetryPage from './pages/AgentTelemetryPage';

export default function App() {
  return (
    <AuthProvider>
      <AlertProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans overflow-x-hidden w-full max-w-full">
            <Navbar />
            <main className="flex-1 w-full max-w-full overflow-x-hidden">
              <Routes>
                <Route path="/" element={<HomeDashboard />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/sos" element={<SosEmergencyPage />} />
                <Route path="/contacts" element={<EmergencyContactsPage />} />
                <Route path="/services" element={<NearbyServicesPage />} />
                <Route path="/dehazing" element={<AiVideoDehazingPage />} />
                <Route path="/alarm" element={<EmergencyAlarmPage />} />
                <Route path="/guidelines" element={<SafetyGuidelinesPage />} />
                <Route path="/admin/login" element={<AdminLoginPage />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/agent-telemetry" element={<AgentTelemetryPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <ToastContainer />
          </div>
        </BrowserRouter>
      </AlertProvider>
    </AuthProvider>
  );
}
