"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, CheckCircle, AlertCircle, Info, XCircle } from 'lucide-react';
import { useNotifications } from './NotificationProvider';

export default function ToastNotification() {
  const { notifications } = useNotifications();
  const [latest, setLatest] = useState<any>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (notifications.length > 0) {
      setLatest(notifications[0]);
      setShow(true);
      const timer = setTimeout(() => setShow(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [notifications]);

  if (!latest) return null;

  const icons = {
    success: <CheckCircle className="text-emerald-500" size={20} />,
    error: <XCircle className="text-rose-500" size={20} />,
    warning: <AlertCircle className="text-amber-500" size={20} />,
    info: <Info className="text-blue-500" size={20} />,
  };

  return (
    <div className="fixed top-6 right-6 z-[100] pointer-events-none">
      <AnimatePresence>
        {show && (latest) && (
          <motion.div
            initial={{ opacity: 0, x: 100, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.9 }}
            className="pointer-events-auto w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-slate-800 p-4 flex gap-4 overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-1 h-full bg-primary-color" />
            <div className="flex-shrink-0 mt-1">
              {icons[latest.type as keyof typeof icons] || <Bell className="text-primary-color" size={20} />}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-gray-900 dark:text-white">Notification</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                {latest.message}
              </p>
            </div>
            <button 
              onClick={() => setShow(false)}
              className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
