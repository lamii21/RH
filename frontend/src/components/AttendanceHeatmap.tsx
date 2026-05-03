"use client";

import { motion } from 'framer-motion';

interface AttendanceHeatmapProps {
  data: any[];
  employees: any[];
}

export default function AttendanceHeatmap({ data, employees }: AttendanceHeatmapProps) {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay() + 1); // Get Monday

  const getStatusColor = (empId: number, dayIdx: number) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + dayIdx);
    const dateStr = date.toISOString().split('T')[0];

    const record = data.find(r => r.employeeId === empId && r.date === dateStr);
    
    if (!record) return 'bg-gray-100 dark:bg-slate-800';
    
    switch (record.status) {
      case 'PRESENT': return 'bg-emerald-500';
      case 'LATE': return 'bg-amber-500';
      case 'ABSENT': return 'bg-rose-500';
      case 'HALF_DAY': return 'bg-indigo-400';
      default: return 'bg-gray-100 dark:bg-slate-800';
    }
  };

  return (
    <div className="card overflow-x-auto">
      <h3 className="font-bold text-lg mb-4">Weekly Attendance Heatmap</h3>
      <div className="min-w-[600px]">
        <div className="flex border-b border-gray-100 dark:border-slate-800 pb-2 mb-2">
          <div className="w-40 flex-shrink-0 text-xs font-bold text-gray-400 uppercase">Employee</div>
          <div className="flex-1 flex justify-around">
            {days.map(day => (
              <div key={day} className="text-xs font-bold text-gray-400 uppercase w-full text-center">{day}</div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {employees.map((emp, i) => (
            <motion.div 
              key={emp.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center"
            >
              <div className="w-40 flex-shrink-0 text-sm font-medium text-gray-700 dark:text-gray-300 truncate pr-2">
                {emp.firstName} {emp.lastName}
              </div>
              <div className="flex-1 flex justify-around gap-1">
                {[0, 1, 2, 3, 4].map(dayIdx => (
                  <div 
                    key={dayIdx} 
                    className={`h-8 w-full rounded-md transition-all hover:scale-105 cursor-pointer ${getStatusColor(emp.id, dayIdx)}`}
                    title={`${days[dayIdx]}`}
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <div className="mt-6 flex gap-4 text-[10px] font-medium text-gray-400 uppercase justify-center">
        <div className="flex items-center gap-1"><div className="w-3 h-3 bg-emerald-500 rounded-sm" /> Present</div>
        <div className="flex items-center gap-1"><div className="w-3 h-3 bg-amber-500 rounded-sm" /> Late</div>
        <div className="flex items-center gap-1"><div className="w-3 h-3 bg-rose-500 rounded-sm" /> Absent</div>
        <div className="flex items-center gap-1"><div className="w-3 h-3 bg-indigo-400 rounded-sm" /> Half Day</div>
        <div className="flex items-center gap-1"><div className="w-3 h-3 bg-gray-200 dark:bg-slate-800 rounded-sm" /> No Data</div>
      </div>
    </div>
  );
}
