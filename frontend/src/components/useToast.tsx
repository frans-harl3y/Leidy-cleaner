"use client";
import { useState, useCallback } from 'react';
import { ToastType, SimpleToast } from './ui/Toast';

export default function useToast() {
  const [toasts, setToasts] = useState<ToastType[]>([]);

  const show = useCallback((
    message: string,
    type: 'info' | 'success' | 'error' | 'warning' = 'info',
    title?: string,
    duration: number = 4000
  ) => {
    const id = Math.random().toString(36).substring(2, 9);
    const variant = type === 'error' ? 'destructive' : type;

    const newToast: ToastType = {
      id,
      title,
      description: message,
      variant: variant as any,
      duration,
    };

    setToasts((prev) => [...prev, newToast]);

    // Auto remove after duration
    setTimeout(() => {
      remove(id);
    }, duration);

    return id;
  }, []);

  const remove = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const success = useCallback((message: string, title?: string) => {
    return show(message, 'success', title);
  }, [show]);

  const error = useCallback((message: string, title?: string) => {
    return show(message, 'error', title);
  }, [show]);

  const warning = useCallback((message: string, title?: string) => {
    return show(message, 'warning', title);
  }, [show]);

  const info = useCallback((message: string, title?: string) => {
    return show(message, 'info', title);
  }, [show]);

  function ToastContainer() {
    if (toasts.length === 0) return null;

    return (
      <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-sm">
        {toasts.map((toast) => (
          <SimpleToast
            key={toast.id}
            toast={toast}
            onClose={remove}
          />
        ))}
      </div>
    );
  }

  return {
    show,
    success,
    error,
    warning,
    info,
    remove,
    Toast: ToastContainer
  };
}
