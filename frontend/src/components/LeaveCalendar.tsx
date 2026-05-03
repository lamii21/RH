"use client";

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface LeaveCalendarProps {
  leaves: any[];
}

export default function LeaveCalendar({ leaves }: LeaveCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();

  const getLeavesForDay = (day: number) => {
    const dateStr = `${year}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return leaves.filter(l => {
      const start = new Date(l.startDate);
      const end = new Date(l.endDate);
      const current = new Date(dateStr);
      return current >= start && current <= end;
    });
  };

  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(<div key={`empty-${i}`} className="h-24 border-r border-b border-gray-100 dark:border-slate-800 bg-gray-50/30 dark:bg-slate-900/10" />);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const dayLeaves = getLeavesForDay(d);
    calendarDays.push(
      <div key={d} className="h-24 border-r border-b border-gray-100 dark:border-slate-800 p-1 overflow-y-auto">
        <span className="text-xs font-bold text-gray-400 p-1">{d}</span>
        <div className="flex flex-col gap-1 mt-1">
          {dayLeaves.map((l, i) => (
            <div 
              key={i} 
              className={`text-[9px] px-1.5 py-0.5 rounded-sm truncate text-white shadow-sm ${
                l.status === 'APPROVED' ? 'bg-emerald-500' : l.status === 'REJECTED' ? 'bg-rose-500' : 'bg-amber-500'
              }`}
              title={`${l.employeeName}: ${l.type}`}
            >
              {l.employeeName.split(' ')[0]}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="card p-0 overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-slate-800">
        <h3 className="font-bold text-lg">{monthName} {year}</h3>
        <div className="flex gap-2">
          <button onClick={prevMonth} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
            <ChevronLeft size={18} />
          </button>
          <button onClick={nextMonth} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 bg-gray-50 dark:bg-slate-900/50">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <div key={d} className="text-center py-2 text-[10px] font-bold text-gray-400 uppercase border-r border-b border-gray-100 dark:border-slate-800">
            {d}
          </div>
        ))}
        {calendarDays}
      </div>
    </div>
  );
}
