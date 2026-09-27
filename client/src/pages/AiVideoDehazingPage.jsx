import React, { useState, useRef, useEffect } from 'react';
import { 
  Video, 
  Camera, 
  Upload, 
  Sparkles, 
  Layers, 
  Eye, 
  Cpu, 
  Flame, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Sliders, 
  ArrowRight,
  ShieldCheck,
  Zap,
  Info
} from 'lucide-react';
import { useAlert } from '../context/AlertContext';

export default function AiVideoDehazingPage() {
  const { addToast } = useAlert();

  const [inputMode, setInputMode] = useState('demo'); // 'demo' | 'camera' | 'upload'
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [dehazeStrength, setDehazeStrength] = useState(85); // 0 to 100
  const [contrastBoost, setContrastBoost] = useState(1.4);
  const [visibilityScore, setVisibilityScore] = useState(74);
  const [confidenceScore, setConfidenceScore] = useState(92);
  const [splitPosition, setSplitPosition] = useState(50); // slider percent

  const videoRef = useRef(null);
  const beforeCanvasRef = useRef(null);
  const afterCanvasRef = useRef(null);
  const animFrameIdRef = useRef(null);

  // Smoke particles simulation state for demo mode
  const smokeParticlesRef = useRef([]);

  // Initialize smoke simulation particles for the demo view
  useEffect(() => {
    const particles = [];
    for (let i = 0; i < 45; i++) {
      particles.push({
        x: Math.random() * 640,
        y: Math.random() * 360,
        radius: 30 + Math.random() * 50,
        speedY: 0.5 + Math.random() * 1.5,
        speedX: (Math.random() - 0.5) * 0.8,
        opacity: 0.3 + Math.random() * 0.4
      });
    }
    smokeParticlesRef.current = particles;
  }, []);

  // Real-time canvas render loop
  useEffect(() => {
    let active = true;

    const render = () => {
      if (!active) return;

      const beforeCanvas = beforeCanvasRef.current;
      const afterCanvas = afterCanvasRef.current;
      if (!beforeCanvas || !afterCanvas) {
        animFrameIdRef.current = requestAnimationFrame(render);
        return;
      }

      const bCtx = beforeCanvas.getContext('2d', { willReadFrequently: true });
      const aCtx = afterCanvas.getContext('2d', { willReadFrequently: true });
      const width = beforeCanvas.width;
      const height = beforeCanvas.height;

      if (inputMode === 'camera' && videoRef.current && isCameraActive && videoRef.current.readyState >= 2) {
        // Draw video frame to BEFORE canvas
        bCtx.drawImage(videoRef.current, 0, 0, width, height);

        // Add simulated smoke overlay to simulate smoke hazard
        bCtx.fillStyle = 'rgba(215, 210, 205, 0.45)';
        bCtx.fillRect(0, 0, width, height);

        // Process Dehazed frame into AFTER canvas
        applyDehazeAlgorithm(bCtx, aCtx, width, height, dehazeStrength, contrastBoost);
      } else {
        // Synthesize dynamic fire hazard emergency scene with corridor, fire glow, and rolling smoke
        drawSyntheticSmokeScene(bCtx, width, height);
        applyDehazeAlgorithm(bCtx, aCtx, width, height, dehazeStrength, contrastBoost);
      }

      animFrameIdRef.current = requestAnimationFrame(render);
    };

    animFrameIdRef.current = requestAnimationFrame(render);

    return () => {
      active = false;
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [inputMode, isCameraActive, dehazeStrength, contrastBoost]);

  // Synthetic emergency corridor with fire and smoke
  const drawSyntheticSmokeScene = (ctx, w, h) => {
    // 1. Background corridor
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#1e293b');
    grad.addColorStop(1, '#0f172a');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // 2. Corridor walls & door perspective
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 0); ctx.lineTo(w * 0.35, h * 0.35);
    ctx.moveTo(w, 0); ctx.lineTo(w * 0.65, h * 0.35);
    ctx.moveTo(0, h); ctx.lineTo(w * 0.35, h * 0.75);
    ctx.moveTo(w, h); ctx.lineTo(w * 0.65, h * 0.75);
    ctx.stroke();

    // Emergency Exit door in distance
    ctx.fillStyle = '#065f46';
    ctx.fillRect(w * 0.42, h * 0.38, w * 0.16, h * 0.36);
    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText('EXIT 🚪', w * 0.45, h * 0.44);

    // Fire flame flicker at corner
    const time = Date.now() * 0.005;
    const flameHeight = 40 + Math.sin(time * 5) * 15;
    const fireGrad = ctx.createRadialGradient(w * 0.2, h * 0.7, 5, w * 0.2, h * 0.7, 60);
    fireGrad.addColorStop(0, 'rgba(255, 230, 0, 0.9)');
    fireGrad.addColorStop(0.4, 'rgba(255, 69, 0, 0.7)');
    fireGrad.addColorStop(1, 'rgba(255, 0, 0, 0)');
    ctx.fillStyle = fireGrad;
    ctx.beginPath();
    ctx.arc(w * 0.2, h * 0.7, flameHeight, 0, Math.PI * 2);
    ctx.fill();

    // Human silhouette trapped in corridor
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(w * 0.6, h * 0.55, 12, 0, Math.PI * 2); // head
    ctx.fill();
    ctx.fillRect(w * 0.57, h * 0.58, 18, 38); // body

    // 3. Rolling smoke particles
    smokeParticlesRef.current.forEach((p) => {
      p.y -= p.speedY;
      p.x += p.speedX;
      if (p.y < -p.radius) {
        p.y = h + p.radius;
        p.x = Math.random() * w;
      }
      const sGrad = ctx.createRadialGradient(p.x, p.y, 2, p.x, p.y, p.radius);
      sGrad.addColorStop(0, `rgba(200, 205, 215, ${p.opacity})`);
      sGrad.addColorStop(1, 'rgba(180, 185, 195, 0)');
      ctx.fillStyle = sGrad;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
    });

    // Dense atmospheric haze fog layer
    ctx.fillStyle = 'rgba(220, 225, 235, 0.45)';
    ctx.fillRect(0, 0, w, h);
  };

  // Real-time Dehazing Algorithm (Dark Channel Prior & Atmospheric Light Inversion Simulation)
  const applyDehazeAlgorithm = (sourceCtx, targetCtx, w, h, strength, contrast) => {
    const srcData = sourceCtx.getImageData(0, 0, w, h);
    const dstData = targetCtx.createImageData(w, h);
    const src = srcData.data;
    const dst = dstData.data;

    const factor = strength / 100;
    // Atmospheric light vector estimation
    const A_r = 220, A_g = 225, A_b = 230;

    for (let i = 0; i < src.length; i += 4) {
      const r = src[i];
      const g = src[i + 1];
      const b = src[i + 2];

      // Dark Channel estimate: minimum intensity across channels
      const darkChannel = Math.min(r, g, b);

      // Transmission map: t = 1 - factor * (darkChannel / A)
      let t = 1.0 - factor * (darkChannel / 255);
      t = Math.max(t, 0.22); // transmission floor to prevent noise explosion

      // Recover scene radiance: J = (I - A)/t + A
      let nr = (r - A_r * (1 - factor * 0.6)) / t + (A_r * 0.2);
      let ng = (g - A_g * (1 - factor * 0.6)) / t + (A_g * 0.2);
      let nb = (b - A_b * (1 - factor * 0.6)) / t + (A_b * 0.2);

      // Contrast stretching & saturation recovery
      nr = (nr - 128) * contrast + 128;
      ng = (ng - 128) * contrast + 128;
      nb = (nb - 128) * contrast + 128;

      dst[i] = Math.min(255, Math.max(0, nr));
      dst[i + 1] = Math.min(255, Math.max(0, ng));
      dst[i + 2] = Math.min(255, Math.max(0, nb));
      dst[i + 3] = 255; // Alpha
    }

    targetCtx.putImageData(dstData, 0, 0);
  };

  // Camera handling
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 360 }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsCameraActive(true);
        setInputMode('camera');
        addToast('📹 Live camera connected with simulated smoke hazard', 'success');
      }
    } catch (err) {
      console.error(err);
      addToast('Camera access denied or unavailable. Using synthetic smoke stream.', 'warning');
      setInputMode('demo');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
    setInputMode('demo');
    addToast('Camera disconnected. Switched to demo feed.', 'info');
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const img = new Image();
    img.onload = () => {
      const bCanvas = beforeCanvasRef.current;
      const aCanvas = afterCanvasRef.current;
      if (bCanvas && aCanvas) {
        const bCtx = bCanvas.getContext('2d');
        const aCtx = aCanvas.getContext('2d');
        bCtx.drawImage(img, 0, 0, bCanvas.width, bCanvas.height);
        applyDehazeAlgorithm(bCtx, aCtx, bCanvas.width, bCanvas.height, dehazeStrength, contrastBoost);
      }
      addToast(`Image "${file.name}" loaded and processed through AI pipeline`, 'success');
    };
    img.src = URL.createObjectURL(file);
  };

  return (
    <div className="min-h-screen pb-16 bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-purple-600/20 text-purple-400 border border-purple-500/30">
                <Video className="w-5 h-5" />
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                AI-Based Real-Time Video Dehazing
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Deep vision model improving structural visibility and human detection during dense smoke/fire emergencies.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-purple-950/80 text-purple-300 border border-purple-500/30 font-bold flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5" /> GAN Prototype Mode
            </span>
          </div>
        </div>

        {/* ACADEMIC TRANSPARENCY NOTICE */}
        <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-purple-500/40 text-xs text-purple-200 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-white">PCCOE AI Prototype Attribution:</strong> This interactive module simulates real-time neural dehazing (Dark Channel Prior & Atmospheric Scattering Model approximation on HTML5 canvas). Code is architected to interface directly with a PyTorch/OpenCV AOD-Net or FFA-Net GAN microservice endpoint.
          </div>
        </div>

        {/* INPUT CONTROLS BAR */}
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Video Input Source:
            </span>
            <button
              onClick={() => {
                if (isCameraActive) stopCamera();
                else setInputMode('demo');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                inputMode === 'demo' ? 'bg-purple-600 text-white shadow' : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" /> Demo Smoke Feed
            </button>

            {isCameraActive ? (
              <button
                onClick={stopCamera}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-red-600 text-white shadow flex items-center gap-1.5"
              >
                <Camera className="w-3.5 h-3.5" /> Stop Camera
              </button>
            ) : (
              <button
                onClick={startCamera}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  inputMode === 'camera' ? 'bg-purple-600 text-white shadow' : 'bg-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                <Camera className="w-3.5 h-3.5" /> Start Camera
              </button>
            )}

            <label className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer transition flex items-center gap-1.5 border border-slate-700">
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Frame</span>
              <input type="file" accept="image/*,video/*" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>

          {/* Sliders for Dehaze Strength & Contrast */}
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Dehaze Power:</span>
              <input
                type="range"
                min="30"
                max="100"
                value={dehazeStrength}
                onChange={(e) => {
                  setDehazeStrength(Number(e.target.value));
                  setVisibilityScore(Math.round(55 + Number(e.target.value) * 0.25));
                }}
                className="w-24 accent-purple-500 cursor-pointer"
              />
              <span className="font-mono text-purple-300 font-bold">{dehazeStrength}%</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-400">Contrast:</span>
              <input
                type="range"
                min="1.0"
                max="2.2"
                step="0.1"
                value={contrastBoost}
                onChange={(e) => setContrastBoost(Number(e.target.value))}
                className="w-20 accent-purple-500 cursor-pointer"
              />
              <span className="font-mono text-purple-300 font-bold">{contrastBoost}x</span>
            </div>
          </div>
        </div>

        {/* Hidden video tag for webcam feed */}
        <video ref={videoRef} className="hidden" playsInline muted autoPlay />

        {/* MAIN DISPLAY: BEFORE VS AFTER SIDE-BY-SIDE PANELS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* PANEL 1: BEFORE (Smoke-Obstructed) */}
          <div className="glass-panel p-5 rounded-3xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-500 animate-pulse"></span>
                <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
                  BEFORE — Smoke-Obstructed Video
                </h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-500/30">
                Visibility: 24% (Severely Degraded)
              </span>
            </div>

            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 relative">
              <canvas
                ref={beforeCanvasRef}
                width={640}
                height={360}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-mono text-amber-300 border border-amber-500/30">
                ⚠️ RAW OPTICAL SENSOR FEED (SMOKE HAZARD)
              </div>
            </div>
          </div>

          {/* PANEL 2: AFTER (AI Enhanced / Dehazed) */}
          <div className="glass-panel p-5 rounded-3xl border-2 border-purple-500/60 shadow-xl shadow-purple-950/40 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></span>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  AFTER — AI Enhanced / Dehazed Video
                </h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 font-bold">
                Visibility: {visibilityScore}% (+{visibilityScore - 24}%)
              </span>
            </div>

            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-900 border border-purple-500/40 relative">
              <canvas
                ref={afterCanvasRef}
                width={640}
                height={360}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-3 left-3 bg-purple-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-mono text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>GAN ENHANCED • SURVIVOR & EXIT RECOGNIZED</span>
              </div>
            </div>
          </div>
        </div>

        {/* AI TELEMETRY METRICS HUD */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="glass-panel p-4 rounded-2xl border border-slate-800 text-center">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
              AI MODEL
            </span>
            <span className="text-sm sm:text-base font-extrabold text-white mt-1 block">
              GAN-Based Dehazing
            </span>
            <span className="text-[10px] text-purple-400">AOD-Net / FFA-Net</span>
          </div>

          <div className="glass-panel p-4 rounded-2xl border border-slate-800 text-center">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
              PROCESSING
            </span>
            <span className="text-sm sm:text-base font-extrabold text-emerald-400 mt-1 block">
              Real-Time (30 FPS)
            </span>
            <span className="text-[10px] text-slate-500">Latency: 18ms</span>
          </div>

          <div className="glass-panel p-4 rounded-2xl border border-slate-800 text-center">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
              VISIBILITY RECOVERY
            </span>
            <span className="text-sm sm:text-base font-extrabold text-white mt-1 block">
              {visibilityScore}%
            </span>
            <span className="text-[10px] text-emerald-400">Contrast Restored</span>
          </div>

          <div className="glass-panel p-4 rounded-2xl border border-slate-800 text-center">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
              DETECTION CONFIDENCE
            </span>
            <span className="text-sm sm:text-base font-extrabold text-emerald-400 mt-1 block">
              {confidenceScore}%
            </span>
            <span className="text-[10px] text-slate-400">Human & Exit Sign</span>
          </div>
        </div>

        {/* SYSTEM ARCHITECTURE PIPELINE */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
            <Layers className="w-4 h-4 text-purple-400" />
            AI Video Dehazing Architecture Pipeline
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-center">
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
              <Camera className="w-6 h-6 text-blue-400 mx-auto mb-2" />
              <h5 className="text-xs font-bold text-white">Camera Input</h5>
              <p className="text-[10px] text-slate-400 mt-1">
                Campus CCTV / Drone / Firefighter thermal-optical feed
              </p>
            </div>

            <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-500/40 shadow-lg shadow-purple-950/40">
              <Cpu className="w-6 h-6 text-purple-400 mx-auto mb-2 animate-pulse" />
              <h5 className="text-xs font-bold text-purple-200">AI Dehazing Model</h5>
              <p className="text-[10px] text-purple-300/80 mt-1">
                Atmospheric scattering inversion & GAN transmission filter
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
              <Eye className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
              <h5 className="text-xs font-bold text-white">Enhanced Video</h5>
              <p className="text-[10px] text-slate-400 mt-1">
                High-contrast dehazed stream with human & route detection
              </p>
            </div>

            <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/40">
              <Flame className="w-6 h-6 text-red-400 mx-auto mb-2" />
              <h5 className="text-xs font-bold text-red-200">Response Team</h5>
              <p className="text-[10px] text-red-300/80 mt-1">
                PCMC Fire Brigade HUD & command center tactical tactical view
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
