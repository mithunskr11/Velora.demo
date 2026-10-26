import React from 'react';
import { TrendingUp, Calendar, Zap, Leaf } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const WeeklyActivityChart: React.FC = () => {
  const { navigate } = useApp();

  const weekData = [
    { day: 'Mon', habits: 5, target: 5, km: 4.2, eco: 18 },
    { day: 'Tue', habits: 4, target: 5, km: 3.5, eco: 15 },
    { day: 'Wed', habits: 5, target: 5, km: 12.4, eco: 30 },
    { day: 'Thu', habits: 3, target: 5, km: 2.1, eco: 12 },
    { day: 'Fri', habits: 5, target: 5, km: 4.8, eco: 20 },
    { day: 'Sat', habits: 4, target: 5, km: 6.5, eco: 22 },
    { day: 'Sun', habits: 4, target: 5, km: 5.2, eco: 25 },
  ];

  const maxKm = 14;

  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#102A24] border border-emerald-100/80 dark:border-emerald-900/40 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-extrabold text-[#173B32] dark:text-emerald-100 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#39A96B]" />
            Weekly Activity & Habit Flow
          </h3>
          <p className="text-xs text-slate-500 dark:text-emerald-300/70">
            38.7 km moved • 85% habit consistency this week
          </p>
        </div>
        <button
          onClick={() => navigate('/progress')}
          className="text-xs font-bold text-[#087F5B] dark:text-[#7BC96F] hover:underline"
        >
          Detailed Analytics →
        </button>
      </div>

      {/* Responsive Bar Grid */}
      <div className="grid grid-cols-7 gap-2 sm:gap-4 pt-4 pb-2 items-end h-44">
        {weekData.map((item, i) => {
          const heightPercent = Math.round((item.km / maxKm) * 100);
          const isToday = i === 6; // Sunday/Today

          return (
            <div key={item.day} className="flex flex-col items-center gap-2 h-full justify-end group">
              {/* Tooltip on hover */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] bg-slate-800 text-white px-1.5 py-0.5 rounded shadow pointer-events-none whitespace-nowrap">
                {item.km} km
              </div>

              {/* Bar container */}
              <div className="w-full max-w-[28px] bg-emerald-50 dark:bg-emerald-950/60 rounded-xl h-28 relative flex items-end overflow-hidden">
                <div
                  className={`w-full rounded-xl transition-all duration-500 ${
                    isToday
                      ? 'bg-gradient-to-t from-[#087F5B] to-[#39A96B]'
                      : 'bg-gradient-to-t from-[#4DA3D9] to-sky-300 group-hover:from-[#087F5B] group-hover:to-[#39A96B]'
                  }`}
                  style={{ height: `${Math.max(15, heightPercent)}%` }}
                />
              </div>

              {/* Day label & habit dot */}
              <div className="text-center">
                <span className={`text-[11px] font-bold block ${
                  isToday ? 'text-[#087F5B] dark:text-[#7BC96F]' : 'text-slate-500 dark:text-emerald-300/70'
                }`}>
                  {item.day}
                </span>
                <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold">
                  {item.habits}/5
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between pt-3 mt-2 border-t border-emerald-50 dark:border-emerald-900/40 text-[11px] text-slate-500 dark:text-emerald-300/70">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#4DA3D9]" /> Activity Distance
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#39A96B]" /> Today
          </span>
        </div>
        <span className="font-semibold text-emerald-800 dark:text-emerald-200">
          +85 XP earned this week
        </span>
      </div>
    </div>
  );
};
