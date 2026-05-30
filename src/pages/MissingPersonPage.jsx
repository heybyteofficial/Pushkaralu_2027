import { useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
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

const STORAGE_KEY = "pushkaralu_missing_reports";

const DEFAULT_FORM = {
  personName: "",
  age: "",
  gender: "",
  identifyingMarks: "",
  lastSeenLocation: "",
  lastSeenTime: "",
  description: "",
};

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
  const [formData, setFormData] = useState(DEFAULT_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitState, setSubmitState] = useState("idle");
  const [photoPreview, setPhotoPreview] = useState("");
  const [cameraMode, setCameraMode] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [captureHint, setCaptureHint] = useState("Upload or capture a clear face photo");

  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

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

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const startCamera = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError("Camera is not supported on this device or browser.");
      return;
    }

    try {
      setCameraError("");
      setCameraMode(true);
      setCaptureHint("Frame the face clearly and tap Capture");
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
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
      }
    } catch {
      setCameraError("Could not process the selected image.");
    }
  };

  const handleCameraOpen = async () => {
    setCameraError("");
    setCameraMode(true);
    await startCamera();
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
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const errors = {};

    if (!photoPreview) errors.photo = "Missing person photo is required";
    if (!formData.personName.trim()) errors.personName = "Name is required";
    if (!formData.identifyingMarks.trim()) errors.identifyingMarks = "Identifying marks are required";
    if (!formData.lastSeenLocation.trim()) errors.lastSeenLocation = "Location is required";
    if (!formData.description.trim()) errors.description = "Description is required";

    return errors;
  };

  const validationMessages = [
    formErrors.photo,
    formErrors.personName,
    formErrors.identifyingMarks,
    formErrors.lastSeenLocation,
    formErrors.description,
  ].filter(Boolean);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);
    setSubmitState("submitting");

    const newReport = {
      id: String(Date.now()),
      photo: photoPreview,
      ...formData,
      age: formData.age ? Number(formData.age) : "",
      createdAt: new Date().toISOString(),
    };

    setTimeout(() => {
      setReports((prev) => [newReport, ...prev]);
      setFormData(DEFAULT_FORM);
      setPhotoPreview("");
      setFormErrors({});
      setSubmitState("success");
      setIsSubmitting(false);

      window.setTimeout(() => setSubmitState("idle"), 2600);
    }, 900);
  };

  const handleClearPhoto = () => {
    setPhotoPreview("");
    setCaptureHint("Upload or capture a clear face photo");
  };

  const heroStats = [
    { label: "Reports Filed", value: reports.length.toString().padStart(2, "0") },
    { label: "Field Ready", value: "24/7" },
    { label: "Live Response", value: "On" },
  ];

  return (
    <div className="max-w-sm mx-auto min-h-screen bg-slate-50 flex flex-col relative shadow-2xl border-x border-slate-200 select-none pb-4 overflow-hidden">
      <Navbar showBack={true} onBack={onBack} />

      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-6">
        <section className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-5 shadow-[0_20px_45px_rgba(15,23,42,0.08)]">
          <div className="absolute inset-0 opacity-70 bg-[linear-gradient(135deg,rgba(239,246,255,0.9),rgba(255,255,255,0.8))]" />
          <div className="absolute -top-16 right-2 w-36 h-36 rounded-full bg-sky-100 blur-3xl" />
          <div className="absolute -bottom-16 left-0 w-40 h-40 rounded-full bg-rose-100 blur-3xl" />

          <div className="relative flex items-start justify-between gap-4">
            <div className="max-w-[190px]">
              <div className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-[9px] font-black uppercase tracking-[0.18em] text-rose-700">
                <AlertTriangle className="w-3 h-3" />
                Missing Person Report
              </div>
              <h1 className="mt-3 text-3xl font-black leading-[0.96] tracking-tight text-slate-900">
                Post the photo.
                <span className="block text-brand-700">Add the marks. Share the location.</span>
              </h1>
              <p className="mt-3 text-[12px] leading-relaxed text-slate-600 font-medium">
                A focused, high-trust missing person report built for quick action, clear identification, and fast response.
              </p>
            </div>

            <div className="shrink-0 rounded-[1.5rem] border border-slate-200 bg-slate-50 px-3 py-3 backdrop-blur-md shadow-sm">
              <WandSparkles className="w-5 h-5 text-brand-700" />
              <p className="mt-2 text-[9px] font-bold uppercase tracking-[0.16em] text-slate-500">
                Priority
              </p>
              <p className="text-xs font-black text-slate-900">Main Feature</p>
            </div>
          </div>

          <div className="relative mt-5 grid grid-cols-3 gap-2">
            {heroStats.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm backdrop-blur-md">
                <p className="text-[8px] font-black uppercase tracking-[0.18em] text-slate-400">{stat.label}</p>
                <p className="mt-1 text-sm font-black text-slate-900">{stat.value}</p>
              </div>
            ))}
          </div>
        </section>

        {cameraError && (
          <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-3 py-2 text-[11px] font-semibold text-rose-700">
            {cameraError}
          </div>
        )}

        {validationMessages.length > 0 && (
          <div className="mt-4 rounded-[1.5rem] border border-amber-200 bg-amber-50 p-4 shadow-sm">
            <div className="flex items-center gap-2 text-amber-800">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-[11px] font-black uppercase tracking-[0.16em]">Action required</span>
            </div>
            <p className="mt-2 text-[12px] font-medium text-amber-800/90">
              Please complete the required fields below before submitting the report.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {validationMessages.map((message) => (
                <span
                  key={message}
                  className="rounded-full border border-amber-200 bg-white px-3 py-1 text-[10px] font-semibold text-amber-800"
                >
                  {message}
                </span>
              ))}
            </div>
          </div>
        )}

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

          <div className="mt-4 grid grid-cols-2 gap-3">
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

          {formErrors.photo && <p className="mt-2 text-[10px] font-semibold text-rose-600">{formErrors.photo}</p>}

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

        <section className="mt-4 rounded-[2rem] border border-slate-200 bg-white p-4 shadow-[0_18px_45px_rgba(15,23,42,0.10)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.18em] text-slate-500">Report details</p>
              <h2 className="mt-1 text-sm font-black text-slate-900">Add description, identifying marks, and location</h2>
            </div>
            <div className="rounded-2xl bg-rose-50 border border-rose-100 px-3 py-2 text-[9px] font-black uppercase tracking-[0.14em] text-rose-700">
              Main Report
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3">
            <div className="grid grid-cols-1 gap-3">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="personName" className="text-[11px] font-bold text-slate-700">Name</label>
                <input
                  id="personName"
                  name="personName"
                  value={formData.personName}
                  onChange={handleFormChange}
                  placeholder="Full name"
                  className="h-11 rounded-2xl border border-slate-200 bg-white px-3 text-[11px] font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-brand-100 focus:border-brand-300"
                />
                {formErrors.personName && <p className="text-[10px] font-semibold text-rose-600">{formErrors.personName}</p>}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="age" className="text-[11px] font-bold text-slate-700">Age</label>
                <input
                  id="age"
                  name="age"
                  type="number"
                  min="1"
                  value={formData.age}
                  onChange={handleFormChange}
                  placeholder="Age"
                  className="h-11 rounded-2xl border border-slate-200 bg-white px-3 text-[11px] font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-brand-100 focus:border-brand-300"
                />
              </div>

              <div className="flex flex-col gap-1.5 col-span-2">
                <label htmlFor="gender" className="text-[11px] font-bold text-slate-700">Gender</label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleFormChange}
                  className="h-11 rounded-2xl border border-slate-200 bg-white px-3 text-[11px] font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-brand-100 focus:border-brand-300"
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                {formErrors.gender && <p className="text-[10px] font-semibold text-rose-600">{formErrors.gender}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="identifyingMarks" className="text-[11px] font-bold text-slate-700">Identifying Marks</label>
                <textarea
                  id="identifyingMarks"
                  name="identifyingMarks"
                  value={formData.identifyingMarks}
                  onChange={handleFormChange}
                  rows="3"
                  placeholder="Tattoos, scars, clothing, height, complexion, glasses, or any unique marks"
                  className="rounded-2xl border border-slate-200 bg-white px-3 py-3 text-[11px] font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-brand-100 focus:border-brand-300 resize-none"
                />
                {formErrors.identifyingMarks && <p className="text-[10px] font-semibold text-rose-600">{formErrors.identifyingMarks}</p>}
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="lastSeenLocation" className="text-[11px] font-bold text-slate-700">Last Seen Location</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="lastSeenLocation"
                    name="lastSeenLocation"
                    value={formData.lastSeenLocation}
                    onChange={handleFormChange}
                    placeholder="Street, temple, ghat, city, landmark"
                    className="h-11 w-full rounded-2xl border border-slate-200 bg-white pl-9 pr-3 text-[11px] font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-brand-100 focus:border-brand-300"
                  />
                </div>
                {formErrors.lastSeenLocation && <p className="text-[10px] font-semibold text-rose-600">{formErrors.lastSeenLocation}</p>}
              </div>
              
              <div className="flex flex-col gap-1.5">
                <label htmlFor="description" className="text-[11px] font-bold text-slate-700">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  rows="4"
                  placeholder="Briefly describe the situation, last clothing, contact clues, urgency, or any helpful context"
                  className="rounded-2xl border border-slate-200 bg-white px-3 py-3 text-[11px] font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-brand-100 focus:border-brand-300 resize-none"
                />
                {formErrors.description && <p className="text-[10px] font-semibold text-rose-600">{formErrors.description}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                type="button"
                onClick={onBack}
                className="h-12 rounded-2xl border border-slate-200 bg-slate-100 text-slate-700 text-[11px] font-black flex items-center justify-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="h-12 rounded-2xl bg-gradient-to-r from-brand-700 to-brand-600 text-white text-[11px] font-black flex items-center justify-center gap-1.5 shadow-lg shadow-brand-600/20 disabled:opacity-60"
              >
                <FileImage className="w-4 h-4" />
                {isSubmitting ? "Submitting..." : "Submit Report"}
              </button>
            </div>
          </form>
        </section>

        <section className="mt-4 rounded-[2rem] border border-slate-200 bg-white p-4 shadow-[0_18px_45px_rgba(15,23,42,0.10)]">
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

      {submitState === "success" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 px-4 backdrop-blur-md">
          <div className="w-full max-w-sm rounded-[2rem] border border-slate-200 bg-white shadow-[0_30px_90px_rgba(15,23,42,0.28)] overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-brand-700 via-sky-600 to-emerald-500" />
            <div className="p-5 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 shadow-sm">
                <CheckCircle2 className="h-7 w-7" />
              </div>
              <p className="mt-4 text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">
                Acknowledgement received
              </p>
              <h3 className="mt-2 text-xl font-black tracking-tight text-slate-900">
                Report Received
              </h3>
              <p className="mt-3 text-[13px] leading-relaxed text-slate-600 font-medium">
                Your report has been securely submitted. Our team will review the details and keep you informed as soon as there is an update.
              </p>

              <div className="mt-4 rounded-[1.3rem] border border-slate-200 bg-slate-50 px-4 py-3 text-left">
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">Next step</p>
                <p className="mt-1 text-[12px] font-semibold text-slate-700">
                  Please stay reachable for any follow-up from the response team.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSubmitState("idle")}
                className="mt-5 h-11 w-full rounded-2xl bg-gradient-to-r from-brand-700 to-brand-600 text-white text-[11px] font-black shadow-lg shadow-brand-600/20"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MissingPersonPage;