import React from 'react';
import { InteractiveMapHUD } from '../components/map/InteractiveMapHUD';
import { Sparkles, Navigation, Flame, Compass } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Activity } from '../types';

interface MapPageProps {
  onOpenProofModal?: (activity: Activity) => void;
}

export const MapPage: React.FC<MapPageProps> = ({ onOpenProofModal }) => {
  const { navigate } = useApp();

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 dark:bg-sky-950/60 text-[#4DA3D9] text-xs font-bold mb-2">
            <Compass className="w-3.5 h-3.5" />
            <span>Interactive GPS & Demo Tracking Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#173B32] dark:text-emerald-50">
            GPS Activity Map
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-emerald-300/80 mt-1">
            Track walks, runs, and rides with live pace, elevation, calories, and verified route proof.
          </p>
        </div>

        <button
          onClick={() => navigate('/progress')}
          className="text-xs font-bold text-[#087F5B] dark:text-[#7BC96F] hover:underline self-start sm:self-auto"
        >
          View Activity History →
        </button>
      </div>

      {/* Main Interactive Map HUD */}
      <InteractiveMapHUD onOpenProofModal={onOpenProofModal} />
    </div>
  );
};
