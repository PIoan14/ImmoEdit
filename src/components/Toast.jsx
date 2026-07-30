import { useState, useEffect } from 'react';

let toastId = 0;

export function useToast() {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'default', duration = 3500) => {
    const id = ++toastId;
    setToasts(p => [...p, { id, message, type, show: false }]);
    // Make visible after mount
    setTimeout(() => setToasts(p => p.map(t => t.id === id ? { ...t, show: true } : t)), 10);
    // Remove after duration
    setTimeout(() => setToasts(p => p.map(t => t.id === id ? { ...t, show: false } : t)), duration);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), duration + 400);
  };

  return { toasts, addToast };
}

export function ToastContainer({ toasts }) {
  const icons = { default: '✨', success: '✅', error: '❌', info: 'ℹ️' };
  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast ${t.type} ${t.show ? 'show' : ''}`}>
          <span>{icons[t.type] || icons.default}</span>
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
}
