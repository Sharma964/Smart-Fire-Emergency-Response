import React from 'react';
import { useAlert } from '../context/AlertContext';
import { AlertTriangle, CheckCircle, Info, XCircle, X } from 'lucide-react';

export default function ToastContainer() {
  const { toasts, removeToast } = useAlert();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none px-4">
      {toasts.map((toast) => {
        let bg = 'bg-slate-900 border-slate-700 text-white';
        let icon = <Info className="w-5 h-5 text-blue-400 shrink-0" />;

        if (toast.type === 'error') {
          bg = 'bg-red-950/95 border-red-500/80 text-red-100 shadow-lg shadow-red-900/50';
          icon = <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 animate-pulse" />;
        } else if (toast.type === 'warning') {
          bg = 'bg-amber-950/95 border-amber-500/80 text-amber-100 shadow-lg shadow-amber-900/40';
          icon = <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />;
        } else if (toast.type === 'success') {
          bg = 'bg-emerald-950/95 border-emerald-500/80 text-emerald-100 shadow-lg shadow-emerald-900/40';
          icon = <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />;
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border backdrop-blur-md shadow-2xl transition-all duration-300 animate-slide-in ${bg}`}
          >
            {icon}
            <div className="flex-1 text-sm font-medium leading-snug">
              {toast.message}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
