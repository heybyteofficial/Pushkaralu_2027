import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  Camera,
  CameraOff,
  CheckCircle2,
  Clock3,
  Eye,
  FileImage,
  MapPin,
  UploadCloud,
  WandSparkles,
  X,
} from "lucide-react";
import Navbar from "../layouts/Navbar";
import apLogo from "@/assets/ap-govt-logo.png";
import { users as initialFamilyUsers } from "../data/family";

const STORAGE_KEY = "pushkaralu_missing_reports";
const FAMILY_STORAGE_KEY = "pushkaralu_family_members";
const MATCH_STEPS = [
  "Searching the database",
  "Finding the nearest matches",
  "Getting the closest match",
  "Match found",
];

const DEFAULT_FORM = {
  personName: "",
  age: "",
  gender: "",
  relation: "",
  identifyingMarks: "",
  lastSeenLocation: "",
  lastSeenTime: "",
  description: "",
};

const RADIAL_TICKS = Array.from({ length: 100 }, (_, index) => index);

function ScanCard({ progress, stepIndex, phase }) {
  const tickThreshold = Math.max(0, Math.min(100, progress));
  const branches = [25, 50, 75];
  const branchTopClasses = ["top-8", "top-16", "top-24"];
  const stepRevealThresholds = [1, 25, 50, 75];
  const steps = [
    {
      title: "Application initialized",
      description: "Preparing the scan and aligning the submitted photo.",
    },
    {
      title: "Finding matches",
      description: "Reviewing nearby registry records and visual markers.",
    },
    {
      title: "Getting closest matches",
      description: "Measuring the closest verified family profile.",
    },
    {
      title: "Match found",
      description: "Locking the best local match for review.",
    },
  ];
  const centralValue = Math.round(progress);

  const nodeProgressClass =
    progress < 25 ? "opacity-35" : progress < 50 ? "opacity-60" : progress < 75 ? "opacity-80" : "opacity-100";

  return (
    <motion.section
      layout
      initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="mt-4 relative w-full min-w-0 overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white/85 p-4 shadow-[0_18px_45px_rgba(15,23,42,0.10)] backdrop-blur-xl"
    >
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-sky-50/70 via-white/20 to-emerald-50/80"
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === "finishing" ? 1 : 0.55 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      />

      <motion.div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-emerald-100/70 via-sky-100/20 to-transparent"
        initial={{ scaleY: 0, transformOrigin: "bottom" }}
        animate={{ scaleY: Math.max(0.2, Math.min(1, progress / 100)) }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      />

      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[9px] font-black uppercase tracking-[0.18em] text-slate-500">Registry scan</p>
          <h2 className="mt-1 text-sm font-black leading-snug text-slate-900 sm:text-[0.98rem]">
            Reviewing the closest family match
          </h2>
        </div>
        <motion.div
          className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-50 text-brand-700 shadow-sm"
          animate={{ scale: phase === "finishing" ? [1, 1.08, 1] : 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <Clock3 className="h-5 w-5" />
        </motion.div>
      </div>

      <div className="relative mt-4 flex flex-col items-center gap-4">
        <div className="flex w-full justify-center">
          <div className="relative h-44 w-44 sm:h-48 sm:w-48">
            <motion.div
              className="absolute inset-5 flex items-center justify-center overflow-hidden rounded-full border border-brand-100 bg-white/80 shadow-inner backdrop-blur-md"
              animate={{ scale: phase === "finishing" ? 1.03 : 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <motion.img
                src={apLogo}
                alt="Andhra Pradesh Emblem"
                className="h-24 w-24 object-contain"
                animate={{ opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>

            <svg viewBox="0 0 220 220" className="absolute inset-0 h-full w-full -rotate-90">
              <defs>
                <linearGradient id="scanRingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
              </defs>

              {RADIAL_TICKS.map((tick) => {
                const active = tick < tickThreshold;
                const angle = (360 / RADIAL_TICKS.length) * tick;
                const isMilestone = tick % 10 === 0;

                return (
                  <line
                    key={tick}
                    x1="110"
                    y1="20"
                    x2="110"
                    y2={isMilestone ? "34" : "30"}
                    stroke={active ? "url(#scanRingGradient)" : "#cbd5e1"}
                    strokeWidth={isMilestone ? 3 : 2}
                    strokeLinecap="round"
                    opacity={active ? 1 : 0.4}
                    transform={`rotate(${angle} 110 110)`}
                    style={{ filter: active ? "drop-shadow(0 0 4px rgba(16,185,129,0.35))" : "none" }}
                  />
                );
              })}

              <circle cx="110" cy="110" r="72" fill="none" stroke="rgba(191,219,254,0.35)" strokeWidth="1" />
              <circle cx="110" cy="110" r="60" fill="none" stroke="rgba(148,163,184,0.18)" strokeWidth="1" />
            </svg>

            <motion.div
              className="scan-orb absolute left-1/2 top-1/2 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-[0_16px_45px_rgba(59,130,246,0.14)]"
              animate={{ scale: phase === "finishing" ? [1, 1.05, 1] : 1 }}
              transition={{ duration: 3.5, ease: [0.16, 1, 0.3, 1], repeat: phase === "finishing" ? 0 : Infinity, repeatType: "mirror" }}
            >
              <div className="text-center">
                <motion.div
                  key={centralValue}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.28, ease: "easeOut" }}
                  className="text-2xl font-black tracking-tight text-slate-900"
                >
                  {centralValue}%
                </motion.div>
                <p className="mt-1 text-[9px] font-black uppercase tracking-[0.18em] text-slate-500">Match confidence</p>
              </div>
            </motion.div>

            <motion.div
              aria-hidden="true"
              className="absolute inset-0 rounded-full"
              animate={{ opacity: [0.25, 0.55, 0.25], scale: [0.98, 1.03, 0.98] }}
              transition={{ duration: 2.8, ease: "easeInOut", repeat: Infinity }}
              style={{
                background:
                  "radial-gradient(circle at 50% 50%, rgba(56,189,248,0.18) 0%, rgba(59,130,246,0.08) 34%, rgba(16,185,129,0.05) 60%, transparent 72%)",
              }}
            />
          </div>
        </div>

        <div className="relative w-full min-w-0 rounded-[1.5rem] border border-slate-200/80 bg-white/80 p-3 backdrop-blur-md">
          <div className="relative min-h-[11.5rem] overflow-hidden rounded-[1.2rem] border border-slate-100 bg-gradient-to-b from-slate-50 to-white p-3">
            <div className="absolute left-6 top-8 bottom-8 w-px bg-gradient-to-b from-slate-200 via-sky-300 to-emerald-400/80" />

            {branches.map((threshold, index) =>
              progress >= threshold ? (
                <motion.div
                  key={threshold}
                  initial={{ opacity: 0, x: -8, scaleX: 0.85 }}
                  animate={{ opacity: 1, x: 0, scaleX: 1 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className={`absolute left-6 ${branchTopClasses[index]} h-px w-[calc(100%-4rem)] origin-left bg-gradient-to-r from-sky-300 via-cyan-400 to-emerald-400`}
                />
              ) : null,
            )}

            <motion.div
              className={`relative z-10 flex min-w-0 items-start gap-3 rounded-2xl border p-3 transition-all duration-500 ${
                stepIndex === 0 ? "border-brand-100 bg-brand-50/70" : "border-slate-100 bg-white"
              }`}
              initial={{ opacity: 0, y: 14 }}
              animate={{
                opacity: progress >= stepRevealThresholds[0] ? 1 : 0,
                y: progress >= stepRevealThresholds[0] ? 0 : 14,
                boxShadow: stepIndex === 0 ? "0 0 0 1px rgba(59,130,246,0.14)" : "0 0 0 0 rgba(0,0,0,0)",
              }}
              transition={{ duration: 0.75, delay: 0.04, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className={`mt-0.5 h-3 w-3 rounded-full ${progress > 10 ? "bg-brand-600" : "bg-slate-300"}`} />
              <div>
                <p className="text-[11px] font-black text-slate-900">{steps[0].title}</p>
                <p className="mt-0.5 text-[10px] text-slate-500">{steps[0].description}</p>
              </div>
            </motion.div>

            <motion.div
              className={`relative z-10 mt-2 flex min-w-0 items-start gap-3 rounded-2xl border p-3 transition-all duration-500 ${
                stepIndex === 1 ? "border-brand-100 bg-brand-50/70" : "border-slate-100 bg-white"
              }`}
              initial={{ opacity: 0, y: 14 }}
              animate={{
                opacity: progress >= stepRevealThresholds[1] ? 1 : 0,
                y: progress >= stepRevealThresholds[1] ? 0 : 14,
              }}
              transition={{ duration: 0.75, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className={`mt-0.5 h-3 w-3 rounded-full ${progress > 35 ? "bg-brand-600" : "bg-slate-300"}`} />
              <div>
                <p className="text-[11px] font-black text-slate-900">{steps[1].title}</p>
                <p className="mt-0.5 text-[10px] text-slate-500">{steps[1].description}</p>
              </div>
            </motion.div>

            <motion.div
              className={`relative z-10 mt-2 flex min-w-0 items-start gap-3 rounded-2xl border p-3 transition-all duration-500 ${
                stepIndex === 2 ? "border-brand-100 bg-brand-50/70" : "border-slate-100 bg-white"
              }`}
              initial={{ opacity: 0, y: 14 }}
              animate={{
                opacity: progress >= stepRevealThresholds[2] ? 1 : 0,
                y: progress >= stepRevealThresholds[2] ? 0 : 14,
              }}
              transition={{ duration: 0.75, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className={`mt-0.5 h-3 w-3 rounded-full ${progress > 60 ? "bg-brand-600" : "bg-slate-300"}`} />
              <div>
                <p className="text-[11px] font-black text-slate-900">{steps[2].title}</p>
                <p className="mt-0.5 text-[10px] text-slate-500">{steps[2].description}</p>
              </div>
            </motion.div>

            <motion.div
              className={`relative z-10 mt-2 flex min-w-0 items-start gap-3 rounded-2xl border p-3 transition-all duration-500 ${
                phase === "finishing"
                  ? "border-emerald-100 bg-emerald-50/80"
                  : "border-slate-100 bg-white"
              }`}
              initial={{ opacity: 0, y: 14 }}
              animate={{
                opacity: phase === "finishing" ? 1 : 0,
                y: phase === "finishing" ? 0 : 14,
              }}
              transition={{ duration: 0.9, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className={`mt-0.5 h-3 w-3 rounded-full ${progress > 85 ? "bg-emerald-500" : "bg-slate-300"}`} />
              <div>
                <p className="text-[11px] font-black text-slate-900">{steps[3].title}</p>
                <p className="mt-0.5 text-[10px] text-slate-500">{steps[3].description}</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {phase === "finishing" && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-y-0 left-[-30%] w-[45%] bg-gradient-to-r from-transparent via-white/75 to-transparent"
            animate={{ x: [0, 520] }}
            transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
          />
        </motion.div>
      )}
    </motion.section>
  );
}

function MissingPersonPage({ onBack }) {
  const [reports, setReports] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });
  const [photoPreview, setPhotoPreview] = useState("");
  const [cameraMode, setCameraMode] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [captureHint, setCaptureHint] = useState("Upload or capture a clear face photo");
  const [searchState, setSearchState] = useState("idle");
  const [searchStepIndex, setSearchStepIndex] = useState(0);
  const [matchedFamily, setMatchedFamily] = useState(null);
  const [searchProgress, setSearchProgress] = useState(0);
  const [scanPhase, setScanPhase] = useState("idle");

  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const matchTimersRef = useRef([]);
  const progressFrameRef = useRef(null);
  const finishTimerRef = useRef(null);
  const scanCardRef = useRef(null);
  const matchedCardRef = useRef(null);
  const autoScrollStageRef = useRef("idle");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
  }, [reports]);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    return () => {
      matchTimersRef.current.forEach((timerId) => window.clearTimeout(timerId));
      if (progressFrameRef.current) {
        window.cancelAnimationFrame(progressFrameRef.current);
      }
      if (finishTimerRef.current) {
        window.clearTimeout(finishTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    // Instead of auto-scrolling, focus the in-place containers without moving
    if ((searchState === "loading" || scanPhase === "finishing") && autoScrollStageRef.current !== "scan") {
      autoScrollStageRef.current = "scan";
      window.setTimeout(() => {
        try {
          scanCardRef.current?.focus({ preventScroll: true });
        } catch (e) {
          // fallback for older browsers
          if (scanCardRef.current) scanCardRef.current.focus();
        }
      }, 180);
      return;
    }

    if (searchState === "matched" && matchedFamily && autoScrollStageRef.current !== "result") {
      autoScrollStageRef.current = "result";
      window.setTimeout(() => {
        try {
          matchedCardRef.current?.focus({ preventScroll: true });
        } catch (e) {
          if (matchedCardRef.current) matchedCardRef.current.focus();
        }
      }, 220);
      return;
    }

    if (searchState === "idle") {
      autoScrollStageRef.current = "idle";
    }
  }, [matchedFamily, scanPhase, searchState]);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const startCamera = async (facingMode = "environment") => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError("Camera is not supported on this device or browser.");
      return;
    }

    try {
      setCameraError("");
      setCameraMode(true);
      setCaptureHint(facingMode === "user" ? "Frame the face clearly for a selfie and tap Capture" : "Frame the face clearly and tap Capture");
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: facingMode } },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch {
      setCameraError("Unable to access the camera. Please allow permission and try again.");
      setCameraMode(false);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const readFileAsDataUrl = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error("Unable to read file"));
      reader.readAsDataURL(file);
    });
  };

  const handlePhotoChange = async (event) => {
    if (!event.target.files?.[0]) return;

    const selectedFile = event.target.files[0];
    event.target.value = "";

    if (!selectedFile.type.startsWith("image/")) {
      setCameraError("Please upload a valid image file.");
      return;
    }

    try {
      setCameraError("");
      const preview = await readFileAsDataUrl(selectedFile);
      if (typeof preview === "string") {
        setPhotoPreview(preview);
        setCaptureHint("Photo ready for report");
        setSearchState("idle");
        setScanPhase("idle");
        setSearchProgress(0);
        setMatchedFamily(null);
        setSearchStepIndex(0);
      }
    } catch {
      setCameraError("Could not process the selected image.");
    }
  };

  const handleCameraOpen = async () => {
    setCameraError("");
    setCameraMode(true);
    await startCamera("environment");
  };

  const handleSelfieCam = async () => {
    setCameraError("");
    setCameraMode(true);
    await startCamera("user");
  };

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    if (!context) {
      setCameraError("Could not capture the photo. Please try again.");
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const preview = canvas.toDataURL("image/jpeg", 0.9);
    stopCamera();
    setPhotoPreview(preview);
    setCameraMode(false);
    setCaptureHint("Photo captured successfully");
    setSearchState("idle");
    setScanPhase("idle");
    setSearchProgress(0);
    setMatchedFamily(null);
    setSearchStepIndex(0);
  };

  const clearMatchTimers = () => {
    matchTimersRef.current.forEach((timerId) => window.clearTimeout(timerId));
    matchTimersRef.current = [];

    if (progressFrameRef.current) {
      window.cancelAnimationFrame(progressFrameRef.current);
      progressFrameRef.current = null;
    }

    if (finishTimerRef.current) {
      window.clearTimeout(finishTimerRef.current);
      finishTimerRef.current = null;
    }
  };

  const readFamilyRegistry = () => {
    try {
      const saved = localStorage.getItem(FAMILY_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((member) => ({
            ...member,
              phone: member.phone || "Not provided",
          }));
        }
      }
    } catch {
      // fallback below
    }

    return initialFamilyUsers.map((member) => ({
      ...member,
      phone: member.phone || "Not provided",
    }));
  };

  const pickClosestMatch = (imageData) => {
    const registry = readFamilyRegistry();
    if (registry.length === 0) return null;

    const fingerprint = imageData.split("").reduce((total, character, index) => {
      return total + character.charCodeAt(0) * (index + 1);
    }, 0);

    return registry[fingerprint % registry.length];
  };

  const handleSubmitSearch = () => {
    if (!photoPreview) {
      setCameraError("Please capture or upload a photo before submitting.");
      return;
    }

    clearMatchTimers();
    setCameraError("");
    setSearchState("loading");
    setSearchStepIndex(0);
    setMatchedFamily(null);
    setSearchProgress(0);
    setScanPhase("loading");

    const matched = pickClosestMatch(photoPreview);

    const duration = 7600;
    const startTime = performance.now();

    const easeOutExpo = (value) => {
      if (value >= 1) return 1;
      return 1 - 2 ** (-10 * value);
    };

    const frame = (now) => {
      const rawProgress = Math.min(1, (now - startTime) / duration);
      const easedProgress = easeOutExpo(rawProgress);
      const nextProgress = Math.round(easedProgress * 100);

      setSearchProgress(nextProgress);

      if (nextProgress < 25) {
        setSearchStepIndex(0);
      } else if (nextProgress < 50) {
        setSearchStepIndex(1);
      } else if (nextProgress < 75) {
        setSearchStepIndex(2);
      } else if (nextProgress < 100) {
        setSearchStepIndex(3);
      }

      if (rawProgress < 1) {
        progressFrameRef.current = window.requestAnimationFrame(frame);
        return;
      }

      setSearchProgress(100);
      setSearchStepIndex(3);
      setScanPhase("finishing");

      // Immediately show the matched view as soon as progress reaches 100%
      finishTimerRef.current = null;
      setMatchedFamily(matched);
      setSearchState("matched");
      setReports((prev) => [
        {
          id: String(Date.now()),
          photo: photoPreview,
          matchedName: matched?.name || "Unknown",
          matchedRelation: matched?.relation || "Family",
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ]);
    };

    progressFrameRef.current = window.requestAnimationFrame(frame);
  };

  const handleClearPhoto = () => {
    setPhotoPreview("");
    setCaptureHint("Upload or capture a clear face photo");
    setCameraError("");
    setSearchState("idle");
    setScanPhase("idle");
    setSearchProgress(0);
    setSearchStepIndex(0);
    setMatchedFamily(null);
  };

const heroStats = [
  { label: "REPORTS FILED", value: reports.length.toString().padStart(2, "0") },
  { label: "FIELD READY", value: "24/7" },
  { label: "LIVE RESPONSE", value: "On" },
];

return (
  <div className="max-w-sm mx-auto min-h-screen bg-slate-50 flex flex-col relative shadow-2xl border-x border-slate-200 select-none pb-4">
    <Navbar showBack={true} onBack={onBack} />

    <div className="flex-1 overflow-y-auto px-4 pt-4 pb-6">
      {/* Main Header Card */}
      <section className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-3 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <div className="inline-flex items-center gap-1 rounded-full border border-rose-200 bg-rose-50 px-2 py-1 text-[8px] font-black uppercase tracking-widest text-rose-700">
            <AlertTriangle className="w-2.5 h-2.5" /> Missing Person Report
          </div>
          <div className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-[8px] font-black uppercase tracking-widest text-slate-500">
            <WandSparkles className="w-2.5 h-2.5" /> Priority Main Feature
          </div>
        </div>

        <h1 className="text-[20px] font-extrabold leading-tight text-slate-900 mb-2">
          One scan-<span className="text-brand-700">Instant family access</span>
        </h1>
        {/* Integrated Stats Row */}
        <div className="grid grid-cols-3 gap-2">
          {heroStats.map((stat) => (
            <div key={stat.label} className="rounded-xl border border-slate-100 bg-slate-50 p-2.5 text-center">
              <p className="text-[7px] font-black uppercase tracking-wider text-slate-400 mb-0.5">{stat.label}</p>
              <p className="text-[11px] font-black text-slate-900">{stat.value}</p>
            </div>
          ))}
        </div>
      </section>
    
      {cameraError && (
        <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-3 py-2 text-[11px] font-semibold text-rose-700">
          {cameraError}
        </div>
      )}
      
        {(searchState !== "loading" && scanPhase !== "finishing" && searchState !== "matched") && (
          <section className="mt-4 rounded-[2rem] border border-slate-200 bg-white backdrop-blur-xl p-4 shadow-[0_18px_45px_rgba(15,23,42,0.10)]">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.18em] text-slate-500">Photo section</p>
              <h2 className="text-sm font-black text-slate-900 mt-1">Upload or capture the missing person’s photo</h2>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.16em] text-brand-700 border border-brand-100">
              <Eye className="w-3 h-3" />
              Visible
            </span>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3">
            <button
              type="button"
              onClick={handleCameraOpen}
              className="rounded-[1.4rem] border border-brand-100 bg-brand-50 px-3 py-4 flex flex-col items-center justify-center gap-2 shadow-sm active:scale-[0.98] transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-2xl bg-brand-700 text-white flex items-center justify-center shadow-lg shadow-brand-600/20">
                <Camera className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-black text-brand-900">Open Camera</span>
            </button>

            <button
              type="button"
              onClick={handleSelfieCam}
              className="rounded-[1.4rem] border border-emerald-100 bg-emerald-50 px-3 py-4 flex flex-col items-center justify-center gap-2 shadow-sm active:scale-[0.98] transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-600/20">
                <Camera className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-black text-emerald-900">Selfie Cam</span>
            </button>

            <button
              type="button"
              onClick={handleUploadClick}
              className="rounded-[1.4rem] border border-slate-200 bg-slate-50 px-3 py-4 flex flex-col items-center justify-center gap-2 shadow-sm active:scale-[0.98] transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-lg shadow-slate-500/20">
                <UploadCloud className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-black text-slate-800">Upload Photo</span>
            </button>
          </div>
          <p className="mt-3 text-[10px] font-semibold text-slate-500">{captureHint}</p>

          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handlePhotoChange}
          />

          <canvas ref={canvasRef} className="hidden" />

          <div className="mt-4 rounded-[1.6rem] border border-dashed border-slate-300 bg-slate-50 p-3">
            {cameraMode ? (
              <div className="overflow-hidden rounded-[1.4rem] border border-slate-200 bg-slate-950 shadow-inner">
                <video ref={videoRef} playsInline muted className="h-60 w-full object-cover" />
              </div>
            ) : photoPreview ? (
              <div className="relative overflow-hidden rounded-[1.4rem] border border-slate-200 bg-white">
                <img src={photoPreview} alt="Missing person preview" className="h-60 w-full object-cover" />
                <button
                  type="button"
                  onClick={handleClearPhoto}
                  className="absolute top-3 right-3 h-9 w-9 rounded-full bg-black/70 text-white flex items-center justify-center backdrop-blur-md"
                  aria-label="Remove photo"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="h-60 rounded-[1.4rem] bg-gradient-to-br from-slate-100 to-slate-50 flex flex-col items-center justify-center text-center px-6">
                <div className="w-14 h-14 rounded-full bg-white shadow-md flex items-center justify-center text-slate-400">
                  <CameraOff className="w-6 h-6" />
                </div>
                <p className="mt-3 text-sm font-black text-slate-800">No photo selected</p>
                <p className="mt-1 text-[11px] font-medium text-slate-500">
                  Add a clear image first so the report feels immediate and recognizable.
                </p>
              </div>
            )}
          </div>

          {cameraMode && (
            <div className="mt-3 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  stopCamera();
                  setCameraMode(false);
                }}
                className="h-11 rounded-2xl border border-slate-200 bg-slate-100 text-slate-700 text-[11px] font-black"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCapture}
                className="h-11 rounded-2xl bg-sky-600 text-white text-[11px] font-black flex items-center justify-center gap-1.5 shadow-lg shadow-sky-500/20"
              >
                <Camera className="w-4 h-4" />
                Capture Photo
              </button>
            </div>
          )}
          </section>
        )}

          {photoPreview && (searchState !== "loading" && scanPhase !== "finishing" && searchState !== "matched") && (
          <section className="mt-4 rounded-[2rem] border border-slate-200 bg-white p-4 shadow-[0_18px_45px_rgba(15,23,42,0.10)] transition-all duration-500 ease-out">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.18em] text-slate-500">Ready to match</p>
                <h2 className="mt-1 text-sm font-black text-slate-900">Submit the photo to begin the database search</h2>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full border border-brand-100 bg-brand-50 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.14em] text-brand-700">
                <FileImage className="w-3 h-3" />
                Submit
              </span>
            </div>

            <button
              type="button"
              onClick={handleSubmitSearch}
              disabled={searchState === "loading"}
              className="mt-4 h-12 w-full rounded-2xl bg-gradient-to-r from-brand-700 to-brand-600 text-white text-[11px] font-black flex items-center justify-center gap-1.5 shadow-lg shadow-brand-600/20 disabled:opacity-60"
            >
              <FileImage className="w-4 h-4" />
              {searchState === "loading" ? "Searching..." : "Submit Photo"}
            </button>
          </section>
          )}

        <AnimatePresence mode="sync" initial={false}>
          {(searchState === "loading" || (scanPhase === "finishing" && searchState !== "matched")) && (
            <motion.div
              key="scan"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              <div
                ref={scanCardRef}
                tabIndex={-1}
                role="status"
                aria-live="polite"
                aria-atomic="true"
                aria-busy={searchState === "loading" || scanPhase === "finishing"}
              >
                <span className="sr-only" aria-live="polite">Scanning {searchProgress}%</span>
                {searchProgress === 100 && <span className="sr-only" aria-live="polite">Scan complete — preparing match</span>}
                <ScanCard progress={searchProgress} stepIndex={searchStepIndex} phase={scanPhase} />
              </div>
            </motion.div>
          )}

          {searchState === "matched" && matchedFamily && (
            <motion.div
              key="matched"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            >
              <section
                ref={matchedCardRef}
                tabIndex={-1}
                role="region"
                aria-live="polite"
                className="mt-4 rounded-[2rem] border border-emerald-200 bg-white p-4 shadow-[0_18px_45px_rgba(15,23,42,0.10)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-[0.18em] text-emerald-600">Match found</p>
                    <h2 className="mt-1 text-sm font-black text-slate-900">Closest registry match located</h2>
                  </div>
                  <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.14em] text-emerald-700">
                    Verified local match
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-3">
                    <p className="text-[9px] font-black uppercase tracking-[0.16em] text-slate-500">Recently captured</p>
                    <img
                      src={photoPreview}
                      alt="Recently captured missing person"
                      className="mt-2 h-40 w-full rounded-2xl object-cover border border-white shadow-sm"
                    />
                  </div>

                  <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-3">
                    <p className="text-[9px] font-black uppercase tracking-[0.16em] text-slate-500">Database image</p>
                    <img
                      src={matchedFamily.avatar}
                      alt={matchedFamily.name}
                      className="mt-2 h-40 w-full rounded-2xl object-cover border border-white shadow-sm"
                    />
                  </div>
                </div>

                <div className="mt-4 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-[0.16em] text-slate-500">Family contact details</p>
                      <h3 className="mt-1 text-base font-black text-slate-900">{matchedFamily.name}</h3>
                    </div>
                    <div className="rounded-full bg-brand-50 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.14em] text-brand-700 border border-brand-100">
                      {Math.min(99, 88 + (matchedFamily.name.length % 10))}% match
                    </div>
                  </div>

                  <div className="mt-3 grid gap-2 text-[11px]">
                    <div className="flex items-center justify-between rounded-2xl bg-white px-3 py-2 border border-slate-200">
                      <span className="font-semibold text-slate-500">Relation</span>
                      <span className="font-black text-slate-900">{matchedFamily.relation}</span>
                    </div>
                    <div className="flex items-center justify-between rounded-2xl bg-white px-3 py-2 border border-slate-200">
                      <span className="font-semibold text-slate-500">Contact Number</span>
                      <span className="font-black text-slate-900">{matchedFamily.phone || "Not provided"}</span>
                    </div>
                    <div className="flex items-center justify-between rounded-2xl bg-white px-3 py-2 border border-slate-200">
                      <span className="font-semibold text-slate-500">ID Number</span>
                      <span className="font-black text-slate-900">{matchedFamily.idCardNumber || "Not provided"}</span>
                    </div>
                  </div>
                </div>
              </section>
            </motion.div>
          )}
        </AnimatePresence>

        <section className="mt-4 rounded-[2rem] border border-slate-200 bg-white p-4 shadow-[0_18px_45px_rgba(15,23,42,0.10)] transition-all duration-700 ease-out">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.18em] text-slate-500">Recent reports</p>
              <h2 className="mt-1 text-sm font-black text-slate-900">Saved for app representation</h2>
            </div>
            <span className="text-[9px] font-black uppercase tracking-[0.16em] text-slate-500">
              {reports.length} stored
            </span>
          </div>

          <div className="mt-3 flex flex-col gap-3">
            {reports.length === 0 ? (
              <div className="rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50 px-4 py-5 text-center">
                <p className="text-sm font-black text-slate-800">No reports yet</p>
                <p className="mt-1 text-[11px] text-slate-500 font-medium">
                  Submit a missing person report and it will appear here immediately.
                </p>
              </div>
            ) : (
              reports.slice(0, 2).map((report) => (
                <article key={report.id} className="flex items-center gap-3 rounded-[1.4rem] border border-slate-200 bg-slate-50 p-3 shadow-sm">
                  <img src={report.photo} alt={report.personName} className="h-14 w-14 rounded-2xl object-cover border border-white shadow-sm" />
                  <div className="flex-1 text-left">
                    <h3 className="text-xs font-black text-slate-900">{report.personName}</h3>
                    <p className="mt-1 text-[10px] font-semibold text-slate-500"> • {report.lastSeenLocation}</p>
                  </div>
                  <div className="rounded-full bg-brand-50 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.14em] text-brand-700 border border-brand-100">
                    Active
                  </div>
                </article>
              ))
            )}
          </div>
        </section>
      </div>

      {cameraMode && (
        <div className="fixed inset-0 z-50 bg-slate-900/55 backdrop-blur-md flex flex-col justify-end">
          <div className="flex-1 flex items-center justify-center px-4 py-6">
            <div className="w-full max-w-sm rounded-[2rem] border border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.25)] overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Camera mode</p>
                  <h3 className="text-sm font-black text-slate-900">Capture missing person photo</h3>
                </div>
                <button onClick={() => { stopCamera(); setCameraMode(false); }} className="w-9 h-9 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center" aria-label="Close camera">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-3">
                <div className="overflow-hidden rounded-[1.4rem] border border-slate-200 bg-slate-950">
                  <video ref={videoRef} playsInline muted className="h-[420px] w-full object-cover" />
                </div>
                <div className="grid grid-cols-2 gap-3 mt-3">
                  <button
                    type="button"
                    onClick={() => { stopCamera(); setCameraMode(false); }}
                    className="h-11 rounded-2xl border border-slate-200 bg-slate-100 text-slate-700 text-[11px] font-black"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleCapture}
                    className="h-11 rounded-2xl bg-brand-700 text-white text-[11px] font-black flex items-center justify-center gap-1.5 shadow-lg shadow-brand-600/20"
                  >
                    <Camera className="w-4 h-4" />
                    Capture
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default MissingPersonPage;