import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  Square, 
  RotateCcw, 
  Navigation, 
  Flame, 
  Zap, 
  Heart, 
  Mountain, 
  Gauge, 
  Sparkles, 
  CheckCircle,
  Share2,
  Leaf,
  Layers,
  Activity as ActivityIcon,
  Camera
} from 'lucide-react';
import { ActivityType, ActivityCoordinate, Activity } from '../../types';
import { 
  SIMULATED_SCENIC_ROUTE, 
  formatDuration, 
  calculatePace, 
  estimateCalories, 
  activityService,
  TrackingMetrics 
} from '../../services/activity';
import { useApp } from '../../context/AppContext';

interface InteractiveMapHUDProps {
  onOpenProofModal?: (activity: Activity) => void;
}

export const InteractiveMapHUD: React.FC<InteractiveMapHUDProps> = ({ onOpenProofModal }) => {
  const { addActivity, user, navigate, setActiveProofActivity, openCamera } = useApp();

  const [activityType, setActivityType] = useState<ActivityType>('Walking');
  const [trackingState, setTrackingState] = useState<'idle' | 'tracking' | 'paused' | 'completed'>('idle');
  const [demoMode, setDemoMode] = useState<boolean>(true);
  
  // Tracking metrics
  const [duration, setDuration] = useState<number>(0);
  const [distance, setDistance] = useState<number>(0);
  const [elevation, setElevation] = useState<number>(14);
  const [heartRate, setHeartRate] = useState<number>(118);
  const [routeIndex, setRouteIndex] = useState<number>(0);
  const [pathCoordinates, setPathCoordinates] = useState<ActivityCoordinate[]>([SIMULATED_SCENIC_ROUTE[0]]);
  const [completedActivity, setCompletedActivity] = useState<Activity | null>(null);

  const timerRef = useRef<any>(null);

  // Speed and pace derived
  const speed = duration > 0 ? (distance / (duration / 3600)) : 0;
  const pace = calculatePace(duration, distance);
  const calories = estimateCalories(activityType, distance, duration);

  // Heart rate zone label
  const getHeartRateZone = (hr: number) => {
    if (hr < 110) return { label: 'Warmup', color: 'text-sky-500' };
    if (hr < 135) return { label: 'Aerobic / Fat Burn', color: 'text-emerald-500' };
    if (hr < 155) return { label: 'Cardio Base', color: 'text-amber-500' };
    return { label: 'Peak Threshold', color: 'text-rose-500' };
  };
  const hrZone = getHeartRateZone(heartRate);

  // Simulation timer
  useEffect(() => {
    if (trackingState === 'tracking') {
      timerRef.current = setInterval(() => {
        setDuration(prev => prev + 1);

        // Advance simulated route
        setRouteIndex(prevIdx => {
          const nextIdx = (prevIdx + 1) % SIMULATED_SCENIC_ROUTE.length;
          const nextCoord = SIMULATED_SCENIC_ROUTE[nextIdx];
          setPathCoordinates(prev => [...prev, nextCoord]);
          return nextIdx;
        });

        // Increment distance
        const kmPerSec = activityType === 'Running' ? 0.0035 : activityType === 'Cycling' ? 0.0065 : 0.0018;
        setDistance(prev => Number((prev + kmPerSec).toFixed(3)));
        setElevation(prev => Math.min(140, prev + (Math.random() > 0.45 ? 1 : 0)));
        setHeartRate(prev => {
          const target = activityType === 'Running' ? 154 : activityType === 'Cycling' ? 140 : 122;
          return Math.round(target + (Math.sin(Date.now() / 2000) * 5));
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [trackingState, activityType]);

  const handleStart = () => {
    setTrackingState('tracking');
    if (duration === 0) {
      setPathCoordinates([SIMULATED_SCENIC_ROUTE[0]]);
      setDistance(0.05);
    }
  };

  const handlePause = () => {
    setTrackingState('paused');
  };

  const handleResume = () => {
    setTrackingState('tracking');
  };

  const handleEnd = () => {
    setTrackingState('completed');
    const finalMetrics: TrackingMetrics = {
      durationSeconds: Math.max(duration, 45),
      distanceKm: Math.max(distance, 0.8),
      speedKmh: speed > 0 ? speed : 5.8,
      paceFormatted: pace !== "0'00\" /km" ? pace : "5'30\" /km",
      caloriesKcal: Math.max(calories, 45),
      elevationMeters: Math.max(elevation, 18),
      heartRateBpm: heartRate,
      coordinates: pathCoordinates
    };

    const newAct = activityService.createCompletedActivity(
      activityType,
      finalMetrics,
      user.id,
      {
        photoUrl: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=800&q=80',
        caption: `${activityType} session around Emerald Greenbelt Trail 🌿 (+${finalMetrics.distanceKm.toFixed(2)} km)`
      }
    );

    setCompletedActivity(newAct);
    addActivity(newAct);
    setActiveProofActivity(newAct);
  };

  const handleShareProofDirect = () => {
    if (completedActivity && onOpenProofModal) {
      onOpenProofModal(completedActivity);
    } else {
      navigate('/community');
    }
  };

  const handleReset = () => {
    setTrackingState('idle');
    setDuration(0);
    setDistance(0);
    setElevation(14);
    setRouteIndex(0);
    setPathCoordinates([SIMULATED_SCENIC_ROUTE[0]]);
    setCompletedActivity(null);
  };

  const activityOptions: { type: ActivityType; emoji: string }[] = [
    { type: 'Walking', emoji: '🚶' },
    { type: 'Running', emoji: '🏃' },
    { type: 'Cycling', emoji: '🚴' },
    { type: 'Hiking', emoji: '🥾' },
  ];

  // Map projection coordinates
  const minLat = 37.7740;
  const maxLat = 37.7840;
  const minLng = -122.4235;
  const maxLng = -122.4125;

  const projectToSvg = (coord: ActivityCoordinate) => {
    const x = ((coord.lng - minLng) / (maxLng - minLng)) * 560 + 20;
    const y = 380 - (((coord.lat - minLat) / (maxLat - minLat)) * 340 + 20);
    return { x, y };
  };

  const fullPathD = SIMULATED_SCENIC_ROUTE.map((c, i) => {
    const pt = projectToSvg(c);
    return `${i === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`;
  }).join(' ') + ' Z';

  const activePoints = pathCoordinates.map(projectToSvg);
  const activePathD = activePoints.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`).join(' ');
  const currentPt = activePoints[activePoints.length - 1] || projectToSvg(SIMULATED_SCENIC_ROUTE[0]);

  return (
    <div className="space-y-4">
      {/* Activity Selector & Live Status Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-[#102A24] p-3.5 sm:p-4 rounded-3xl border border-emerald-100 dark:border-emerald-900/40 shadow-sm">
        <div className="flex items-center gap-2">
          {activityOptions.map((opt) => (
            <button
              key={opt.type}
              disabled={trackingState === 'tracking'}
              onClick={() => setActivityType(opt.type)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
                activityType === opt.type
                  ? 'bg-[#087F5B] text-white shadow-md shadow-[#087F5B]/25 scale-102'
                  : 'bg-[#F4FAF5] dark:bg-[#173B32] text-slate-600 dark:text-emerald-200 hover:bg-emerald-50 dark:hover:bg-emerald-900/30'
              } ${trackingState === 'tracking' ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              <span>{opt.emoji}</span>
              <span>{opt.type}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-[#087F5B] dark:text-[#7BC96F]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#39A96B] animate-ping" />
            <span>Demo GPS Active (High Precision)</span>
          </div>
        </div>
      </div>

      {/* Main Interactive Map Canvas */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-[#e5f5eb] via-[#d7ede1] to-[#cae7d7] dark:from-[#0d221d] dark:via-[#102a24] dark:to-[#091a16] border-2 border-emerald-200/80 dark:border-emerald-800/40 h-[400px] sm:h-[480px] shadow-inner select-none">
        {/* Top Floating HUD Badges */}
        <div className="absolute top-4 left-4 z-10 flex flex-wrap items-center gap-2">
          <div className="px-3 py-1.5 rounded-2xl bg-white/95 dark:bg-[#102A24]/95 backdrop-blur-md shadow-md text-xs font-bold text-[#087F5B] dark:text-[#7BC96F] flex items-center gap-1.5">
            <Navigation className="w-3.5 h-3.5" />
            <span>Emerald Lake & Pine Loop</span>
          </div>

          {trackingState === 'tracking' && (
            <div className="px-3 py-1.5 rounded-2xl bg-white/95 dark:bg-[#102A24]/95 backdrop-blur-md shadow-md text-xs font-bold text-slate-700 dark:text-emerald-200 flex items-center gap-2">
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-current animate-pulse" />
              <span>{heartRate} BPM</span>
              <span className={`text-[10px] font-semibold ${hrZone.color}`}>({hrZone.label})</span>
            </div>
          )}
        </div>

        {/* Vector Topography & Path Illustration */}
        <svg viewBox="0 0 600 400" className="w-full h-full object-cover">
          <defs>
            <linearGradient id="lakeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4DA3D9" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#2b77a7" stopOpacity="0.75" />
            </linearGradient>

            <linearGradient id="trailGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#087F5B" />
              <stop offset="50%" stopColor="#39A96B" />
              <stop offset="100%" stopColor="#4DA3D9" />
            </linearGradient>
          </defs>

          {/* Organic Parks / Greenery Blobs */}
          <path
            d="M 60,80 Q 140,20 260,60 T 480,90 Q 560,180 510,310 T 300,370 Q 120,380 40,260 Z"
            fill="rgba(57, 169, 107, 0.16)"
          />
          <path
            d="M 120,120 Q 200,80 340,110 T 460,220 Q 420,320 280,310 T 110,240 Z"
            fill="rgba(57, 169, 107, 0.22)"
          />

          {/* Topo lines */}
          <ellipse cx="300" cy="200" rx="240" ry="140" fill="none" stroke="rgba(8,127,91,0.08)" strokeWidth="1" strokeDasharray="4 4" />
          <ellipse cx="300" cy="200" rx="180" ry="100" fill="none" stroke="rgba(8,127,91,0.12)" strokeWidth="1" strokeDasharray="4 4" />

          {/* Emerald Lake */}
          <path
            d="M 230,170 C 290,140 370,150 410,200 C 430,240 380,280 310,270 C 250,260 210,220 230,170 Z"
            fill="url(#lakeGrad)"
          />
          <text x="315" y="222" textAnchor="middle" fill="#1b5275" fontSize="12" fontWeight="bold" opacity="0.85">
            Emerald Lake
          </text>

          {/* Static Scenic Trail Outline */}
          <path
            d={fullPathD}
            fill="none"
            stroke="rgba(8, 127, 91, 0.25)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Active Live Route Line */}
          {activePathD && (
            <path
              d={activePathD}
              fill="none"
              stroke="url(#trailGrad)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="drop-shadow-md"
            />
          )}

          {/* Trail Start Marker Flag */}
          {pathCoordinates.length > 0 && (
            <g transform={`translate(${projectToSvg(SIMULATED_SCENIC_ROUTE[0]).x}, ${projectToSvg(SIMULATED_SCENIC_ROUTE[0]).y})`}>
              <circle r="7" fill="#087F5B" />
              <circle r="3.5" fill="#ffffff" />
            </g>
          )}

          {/* Live Runner / Walker Marker with Glow */}
          <g transform={`translate(${currentPt.x}, ${currentPt.y})`}>
            <circle r="16" fill="#39A96B" opacity="0.35" className="animate-ping" />
            <circle r="8.5" fill="#087F5B" stroke="#ffffff" strokeWidth="2.5" className="shadow-xl" />
            <circle r="3.5" fill="#F4C95D" />
          </g>
        </svg>

        {/* Live Floating Statistics Ribbon */}
        <div className="absolute bottom-4 left-4 right-4 z-10 bg-white/95 dark:bg-[#102A24]/95 backdrop-blur-md rounded-2xl p-3 sm:p-4 shadow-xl border border-emerald-100 dark:border-emerald-800/60">
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center divide-x divide-emerald-100 dark:divide-emerald-900/60">
            {/* TIME */}
            <div className="px-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-emerald-300/70 block">
                TIME
              </span>
              <span className="text-base sm:text-xl font-extrabold text-[#173B32] dark:text-emerald-100 font-mono">
                {formatDuration(duration)}
              </span>
            </div>

            {/* DISTANCE */}
            <div className="px-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-emerald-300/70 block">
                DISTANCE
              </span>
              <span className="text-base sm:text-xl font-extrabold text-[#4DA3D9] font-mono">
                {distance.toFixed(2)} <span className="text-xs font-normal">km</span>
              </span>
            </div>

            {/* PACE */}
            <div className="px-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-emerald-300/70 block">
                PACE
              </span>
              <span className="text-base sm:text-xl font-extrabold text-[#173B32] dark:text-emerald-100 font-mono">
                {pace}
              </span>
            </div>

            {/* SPEED */}
            <div className="px-1 hidden sm:block">
              <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-emerald-300/70 block">
                AVG SPEED
              </span>
              <span className="text-base sm:text-xl font-extrabold text-[#173B32] dark:text-emerald-100 font-mono">
                {speed.toFixed(1)} <span className="text-xs font-normal">km/h</span>
              </span>
            </div>

            {/* CALORIES */}
            <div className="px-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-emerald-300/70 block">
                CALORIES
              </span>
              <span className="text-base sm:text-xl font-extrabold text-[#F4A261] font-mono">
                {calories} <span className="text-xs font-normal">kcal</span>
              </span>
            </div>

            {/* ELEVATION */}
            <div className="px-1 hidden sm:block">
              <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-emerald-300/70 block">
                ELEVATION
              </span>
              <span className="text-base sm:text-xl font-extrabold text-[#087F5B] dark:text-[#7BC96F] font-mono">
                +{elevation} <span className="text-xs font-normal">m</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Action Controls */}
      <div className="flex items-center justify-center gap-4 py-2">
        {trackingState === 'idle' && (
          <button
            onClick={handleStart}
            className="flex items-center gap-3 px-8 py-4 rounded-3xl bg-gradient-to-r from-[#087F5B] to-[#39A96B] text-white font-extrabold text-base shadow-xl shadow-[#087F5B]/30 hover:scale-105 active:scale-95 transition-all"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>START {activityType.toUpperCase()} (DEMO GPS)</span>
          </button>
        )}

        {trackingState === 'tracking' && (
          <div className="flex items-center gap-3">
            <button
              onClick={handlePause}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm shadow-md hover:scale-105 active:scale-95 transition-all"
            >
              <Pause className="w-4 h-4 fill-current" />
              <span>PAUSE</span>
            </button>
            <button
              onClick={handleEnd}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-md hover:scale-105 active:scale-95 transition-all"
            >
              <Square className="w-4 h-4 fill-current" />
              <span>END ACTIVITY</span>
            </button>
          </div>
        )}

        {trackingState === 'paused' && (
          <div className="flex items-center gap-3">
            <button
              onClick={handleResume}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[#087F5B] hover:bg-[#076a4c] text-white font-bold text-sm shadow-md hover:scale-105 active:scale-95 transition-all"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>RESUME</span>
            </button>
            <button
              onClick={handleEnd}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-md hover:scale-105 active:scale-95 transition-all"
            >
              <Square className="w-4 h-4 fill-current" />
              <span>END ACTIVITY</span>
            </button>
          </div>
        )}

        {/* Section 20: Visually Impressive ACTIVITY SUMMARY */}
        {trackingState === 'completed' && completedActivity && (
          <div className="w-full p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#102A24] border-2 border-emerald-300 dark:border-emerald-700 shadow-2xl animate-in zoom-in-95 duration-200 text-center relative overflow-hidden">
            <div className="w-16 h-16 rounded-3xl bg-emerald-100 dark:bg-emerald-900/60 text-[#087F5B] dark:text-[#7BC96F] mx-auto flex items-center justify-center mb-3 shadow-md">
              <CheckCircle className="w-9 h-9" />
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#173B32] dark:text-emerald-100">
              Activity Completed 🎉
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-emerald-300/70 mt-1 max-w-md mx-auto">
              Outstanding consistency! Your movement protected your 7-day streak and lowered carbon emissions.
            </p>

            {/* Impressive Statistics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6 max-w-xl mx-auto">
              <div className="p-3.5 rounded-2xl bg-[#F4FAF5] dark:bg-[#173B32] border border-emerald-100 dark:border-emerald-800/40">
                <span className="text-[10px] text-slate-400 block font-bold uppercase">DISTANCE</span>
                <span className="text-xl sm:text-2xl font-extrabold text-[#4DA3D9] font-mono">{completedActivity.distance} km</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#F4FAF5] dark:bg-[#173B32] border border-emerald-100 dark:border-emerald-800/40">
                <span className="text-[10px] text-slate-400 block font-bold uppercase">DURATION</span>
                <span className="text-xl sm:text-2xl font-extrabold text-[#173B32] dark:text-emerald-100 font-mono">
                  {formatDuration(completedActivity.duration)}
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#F4FAF5] dark:bg-[#173B32] border border-emerald-100 dark:border-emerald-800/40">
                <span className="text-[10px] text-slate-400 block font-bold uppercase">ENERGY BURNED</span>
                <span className="text-xl sm:text-2xl font-extrabold text-[#F4A261] font-mono">{completedActivity.calories} kcal</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#F4FAF5] dark:bg-[#173B32] border border-emerald-100 dark:border-emerald-800/40">
                <span className="text-[10px] text-slate-400 block font-bold uppercase">XP & ECO IMPACT</span>
                <span className="text-xl sm:text-2xl font-extrabold text-[#087F5B] dark:text-[#7BC96F] font-mono">
                  +{completedActivity.xpEarned} XP
                </span>
              </div>
            </div>

            {/* Eco Impact Callout */}
            <div className="max-w-md mx-auto p-3.5 mb-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between text-xs">
              <span className="font-bold text-[#087F5B] dark:text-[#7BC96F] flex items-center gap-1.5">
                <Leaf className="w-4 h-4" /> Avoided ~850g vehicle CO2 emissions
              </span>
              <span className="font-extrabold text-emerald-800 dark:text-emerald-200">
                +{completedActivity.ecoPointsEarned} Eco Points
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => openCamera(completedActivity)}
                className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#087F5B] to-[#39A96B] hover:brightness-110 text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-[#087F5B]/30 hover:scale-105 active:scale-95 transition-all"
              >
                <Camera className="w-4 h-4" />
                <span>Take VELORA Snap Proof</span>
              </button>

              <button
                onClick={handleShareProofDirect}
                className="flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-white dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700 text-[#087F5B] dark:text-emerald-200 font-extrabold text-xs sm:text-sm shadow-md hover:bg-emerald-50 dark:hover:bg-emerald-900/40 transition-all"
              >
                <Share2 className="w-4 h-4" />
                <span>Post to Community (+10 XP)</span>
              </button>

              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 px-4 py-3 rounded-2xl bg-slate-100 dark:bg-emerald-950/60 text-slate-700 dark:text-emerald-200 font-semibold text-xs hover:bg-slate-200 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Track Another Activity</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
