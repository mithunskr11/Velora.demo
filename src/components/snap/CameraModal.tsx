import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, 
  RotateCcw, 
  SwitchCamera, 
  Zap, 
  ZapOff, 
  Image as ImageIcon, 
  X, 
  AlertCircle, 
  Sparkles,
  UploadCloud,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PhotoEditor } from './PhotoEditor';

interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Built-in high-quality demo shots for environments without webcam access
const DEMO_PRESET_SHOTS = [
  {
    id: 'trail',
    title: 'Forest Trail Run',
    url: 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?auto=format&fit=crop&w=1200&q=80',
    description: 'Crisp morning jog through pine woods'
  },
  {
    id: 'cycle',
    title: 'Green Commute',
    url: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=1200&q=80',
    description: 'Zero-emission ride to the workspace'
  },
  {
    id: 'hydration',
    title: 'Hydration & Mind',
    url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&q=80',
    description: 'Post-yoga hydration check'
  },
  {
    id: 'walk',
    title: 'Sunny Stride',
    url: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=1200&q=80',
    description: 'Golden hour step goal conquered'
  }
];

export const CameraModal: React.FC<CameraModalProps> = ({ isOpen, onClose }) => {
  const { initialSnapActivity } = useApp();

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [torchOn, setTorchOn] = useState(false);
  const [hasTorch, setHasTorch] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize and clean up live camera stream
  useEffect(() => {
    if (!isOpen || capturedImage) {
      stopCameraStream();
      return;
    }

    startCamera();

    return () => {
      stopCameraStream();
    };
  }, [isOpen, facingMode, capturedImage]);

  const stopCameraStream = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const startCamera = async () => {
    setIsInitializing(true);
    setCameraError(null);
    stopCameraStream();

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError('Camera API is not supported in this browser environment. You can upload an image or select a sample photo below.');
      setIsInitializing(false);
      return;
    }

    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play().catch(() => {});
      }

      // Check for torch capability
      const track = mediaStream.getVideoTracks()[0];
      if (track && typeof track.getCapabilities === 'function') {
        const capabilities = track.getCapabilities() as any;
        if (capabilities.torch) {
          setHasTorch(true);
        }
      }

      setIsInitializing(false);
    } catch (err: any) {
      console.warn('Camera access issue:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraError('Camera permission was denied. Please allow camera permissions in your browser or select an image from your gallery.');
      } else {
        setCameraError('Webcam not detected or unavailable. You can upload an image or choose one of our high-resolution demo shots.');
      }
      setIsInitializing(false);
    }
  };

  const toggleFacingMode = () => {
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
  };

  const toggleTorch = async () => {
    if (!stream) return;
    const track = stream.getVideoTracks()[0];
    if (track && typeof track.applyConstraints === 'function') {
      try {
        await track.applyConstraints({
          advanced: [{ torch: !torchOn } as any],
        });
        setTorchOn(!torchOn);
      } catch (e) {
        console.warn('Could not toggle flash:', e);
      }
    }
  };

  const handleCapture = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Flip horizontal if front camera
    if (facingMode === 'user') {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
    setCapturedImage(dataUrl);
    stopCameraStream();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setCapturedImage(reader.result);
        stopCameraStream();
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSelectPreset = (url: string) => {
    setCapturedImage(url);
    stopCameraStream();
  };

  if (!isOpen) return null;

  // If photo is captured or selected, show full Photo Editor
  if (capturedImage) {
    return (
      <PhotoEditor
        photoUrl={capturedImage}
        initialActivity={initialSnapActivity}
        onRetake={() => {
          setCapturedImage(null);
        }}
        onClose={() => {
          setCapturedImage(null);
          onClose();
        }}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between select-none animate-in fade-in duration-200">
      {/* Top Controls Bar */}
      <div className="relative z-10 flex items-center justify-between px-5 pt-6 pb-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent">
        <button
          onClick={onClose}
          className="p-2.5 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-md transition-all active:scale-90"
          aria-label="Close Camera"
        >
          <X className="w-5 h-5 stroke-[2.5]" />
        </button>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-[#087F5B]/80 text-white text-xs font-bold tracking-wider backdrop-blur-md border border-white/20 flex items-center gap-1.5">
            <Camera className="w-3.5 h-3.5" />
            VELORA SNAP
          </span>
          {initialSnapActivity && (
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300 text-xs font-medium border border-emerald-400/30">
              <CheckCircle2 className="w-3 h-3" />
              Activity Attached
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {hasTorch && (
            <button
              onClick={toggleTorch}
              className={`p-2.5 rounded-full text-white backdrop-blur-md transition-all active:scale-90 ${
                torchOn ? 'bg-amber-400 text-slate-900 shadow-md shadow-amber-400/50' : 'bg-white/20 hover:bg-white/30'
              }`}
              aria-label="Toggle Flash"
            >
              {torchOn ? <Zap className="w-5 h-5 fill-current" /> : <ZapOff className="w-5 h-5" />}
            </button>
          )}

          <button
            onClick={toggleFacingMode}
            className="p-2.5 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-md transition-all active:scale-90"
            aria-label="Flip Camera"
          >
            <SwitchCamera className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Viewport */}
      <div className="relative flex-1 flex items-center justify-center overflow-hidden px-2 sm:px-4">
        {/* Hidden File Input for Gallery */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileUpload}
        />

        {/* Video stream container */}
        <div className="relative w-full max-w-md aspect-[9/16] sm:aspect-[3/4] bg-[#173B32] rounded-3xl overflow-hidden shadow-2xl border border-emerald-950/40 flex items-center justify-center">
          <video
            ref={videoRef}
            playsInline
            muted
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              isInitializing || cameraError ? 'opacity-0' : 'opacity-100'
            } ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
          />

          {/* Initializing Spinner */}
          {isInitializing && !cameraError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#173B32] text-white">
              <div className="w-12 h-12 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin mb-3" />
              <p className="text-sm font-medium text-emerald-200">Opening Camera lens...</p>
            </div>
          )}

          {/* Friendly Fallback / Permission UI */}
          {cameraError && (
            <div className="absolute inset-0 p-6 flex flex-col justify-between bg-gradient-to-b from-[#173B32] to-[#0A1F1A] text-white overflow-y-auto">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-[#7BC96F] border border-emerald-500/30 flex items-center justify-center">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold tracking-tight">Camera Unavailable</h3>
                  <p className="text-xs text-emerald-200/80 mt-1 leading-relaxed">
                    {cameraError}
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#087F5B] to-[#39A96B] hover:brightness-110 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#087F5B]/30 transition-transform active:scale-95"
                  >
                    <UploadCloud className="w-4 h-4" />
                    Upload from Photo Library
                  </button>
                </div>
              </div>

              {/* Sample Quick Preset Photos */}
              <div className="pt-4 border-t border-emerald-800/40 mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-emerald-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#F4C95D]" />
                    Try with Demo Photo
                  </span>
                  <span className="text-[10px] text-emerald-400/60">Tap any to test editor</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {DEMO_PRESET_SHOTS.map((shot) => (
                    <button
                      key={shot.id}
                      onClick={() => handleSelectPreset(shot.url)}
                      className="group relative rounded-xl overflow-hidden aspect-[4/3] border border-emerald-700/50 hover:border-[#7BC96F] text-left transition-all"
                    >
                      <img 
                        src={shot.url} 
                        alt={shot.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-2 flex flex-col justify-end">
                        <span className="text-xs font-bold text-white leading-tight">{shot.title}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Focus target reticle overlay (cosmetic) */}
          {!cameraError && !isInitializing && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="w-48 h-48 border border-white/25 rounded-2xl flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-white/40" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Shutter & Gallery Controls */}
      <div className="relative z-10 px-6 pt-4 pb-8 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex items-center justify-around max-w-md mx-auto w-full">
        {/* Gallery / Library Upload */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex flex-col items-center gap-1.5 p-2 rounded-2xl hover:bg-white/10 text-white/90 transition-colors active:scale-95"
          title="Upload from library"
        >
          <div className="w-12 h-12 rounded-2xl bg-white/15 border border-white/20 backdrop-blur-md flex items-center justify-center">
            <ImageIcon className="w-6 h-6 text-emerald-300" />
          </div>
          <span className="text-[11px] font-medium text-slate-300">Gallery</span>
        </button>

        {/* Big Shutter Button */}
        <button
          onClick={handleCapture}
          disabled={Boolean(cameraError || isInitializing)}
          className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all ${
            cameraError || isInitializing
              ? 'opacity-40 cursor-not-allowed border-4 border-slate-600'
              : 'border-4 border-white hover:scale-105 active:scale-90 shadow-2xl shadow-emerald-500/20'
          }`}
          aria-label="Take Photo"
        >
          <div className="w-16 h-16 rounded-full bg-white shadow-inner flex items-center justify-center">
            <div className="w-14 h-14 rounded-full border-2 border-[#087F5B]" />
          </div>
        </button>

        {/* Retry / Switch Mode */}
        <button
          onClick={() => startCamera()}
          className="flex flex-col items-center gap-1.5 p-2 rounded-2xl hover:bg-white/10 text-white/90 transition-colors active:scale-95"
          title="Reload camera"
        >
          <div className="w-12 h-12 rounded-2xl bg-white/15 border border-white/20 backdrop-blur-md flex items-center justify-center">
            <RotateCcw className="w-5 h-5 text-emerald-300" />
          </div>
          <span className="text-[11px] font-medium text-slate-300">Refresh</span>
        </button>
      </div>
    </div>
  );
};
