import React, { useEffect, useRef, useState } from "react";
import { compressImage } from "../../utils/media";
import {
  AppAvatar,
  BackIcon,
  CheckIcon,
  CloseIcon,
  CropIcon,
  EmojiIcon,
  FlashAutoIcon,
  FlashOffIcon,
  FlashOnIcon,
  FlipCameraIcon,
  ForwardIcon,
  GalleryIcon,
  HdIcon,
  MoreIcon,
  PencilIcon,
  SendIcon,
  StarIcon,
  TextIcon,
  UndoIcon,
  ViewOnceIcon,
} from "./icons";

// Realistic sample pilgrim photo for instant testing when no camera is available
const SAMPLE_PILGRIM_PHOTO =
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=720&q=80";

// Authentic WhatsApp doodle color palette
const WHATSAPP_COLORS = [
  { name: "Emerald", hex: "#00a884" },
  { name: "Yellow", hex: "#facc15" },
  { name: "Red", hex: "#ef4444" },
  { name: "White", hex: "#ffffff" },
  { name: "Black", hex: "#111b21" },
  { name: "Blue", hex: "#3b82f6" },
];

// WhatsApp photo filters
const PHOTO_FILTERS = [
  { id: "none", name: "Normal", filter: "none" },
  { id: "pop", name: "Pop", filter: "contrast(1.18) saturate(1.25) brightness(1.03)" },
  { id: "bw", name: "B&W", filter: "grayscale(100%) contrast(1.15)" },
  { id: "cool", name: "Cool", filter: "hue-rotate(170deg) saturate(0.9) brightness(1.05)" },
  { id: "warm", name: "Warm", filter: "sepia(0.35) saturate(1.25) brightness(1.02)" },
  { id: "chrome", name: "Chrome", filter: "contrast(1.25) saturate(1.35)" },
];

// Quick WhatsApp sticker emojis
const QUICK_STICKERS = ["😀", "❤️", "🙏", "🚩", "👍", "⚠️", "🔥", "🌸", "🕊️", "⭐", "🎉", "🇮🇳"];

export function WhatsAppCameraModal({
  initialMode = "camera", // 'camera' | 'preview' | 'lightbox'
  initialImage = null,
  initialCaption = "",
  senderName = "PushkarAI Safe Desk",
  timestamp = Date.now(),
  onClose,
  onSend,
}) {
  const [mode, setMode] = useState(initialMode);
  const [photoData, setPhotoData] = useState(initialImage);
  const [caption, setCaption] = useState(initialCaption);
  const [facingMode, setFacingMode] = useState("environment"); // 'environment' | 'user'
  const [flash, setFlash] = useState("off"); // 'off' | 'auto' | 'on'
  const [rotation, setRotation] = useState(0);
  const [viewOnce, setViewOnce] = useState(false);
  const [hd, setHd] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("none");
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [activeTool, setActiveTool] = useState(null); // null | 'draw' | 'text' | 'sticker'
  const [brushColor, setBrushColor] = useState("#00a884");
  const [doodlePaths, setDoodlePaths] = useState([]);
  const [textOverlays, setTextOverlays] = useState([]);
  const [tempText, setTempText] = useState("");
  const [textBg, setTextBg] = useState(true);
  const [stickers, setStickers] = useState([]);
  const [warnings, setWarnings] = useState([]);
  const [cameraError, setCameraError] = useState(null);
  const [shutterFlash, setShutterFlash] = useState(false);
  const [toast, setToast] = useState(null);
  const [lightboxZoom, setLightboxZoom] = useState(false);
  const [lightboxStarred, setLightboxStarred] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const galleryInputRef = useRef(null);
  const captionInputRef = useRef(null);
  const drawCanvasRef = useRef(null);
  const isDrawingRef = useRef(false);
  const toastTimerRef = useRef(null);

  // Show temporary WhatsApp floating toast badge
  const showToast = (msg) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast(msg);
    toastTimerRef.current = setTimeout(() => {
      setToast(null);
    }, 1800);
  };

  // Switch or Initialize live webcam stream
  useEffect(() => {
    if (mode !== "camera") {
      stopCameraStream();
      return;
    }

    let active = true;

    async function initCamera() {
      stopCameraStream();
      setCameraError(null);

      if (!navigator.mediaDevices?.getUserMedia) {
        setCameraError("Camera is not supported on this device. Tap the Gallery icon below to select a photo.");
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: facingMode },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });

        if (!active) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
      } catch (err) {
        if (!active) return;
        setCameraError("Camera access is not permitted or unavailable. Tap Gallery to upload an image.");
      }
    }

    initCamera();

    return () => {
      active = false;
      stopCameraStream();
    };
  }, [mode, facingMode]);

  const stopCameraStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  };

  // Toggle Flash state (off -> auto -> on -> off)
  const handleToggleFlash = () => {
    if (flash === "off") {
      setFlash("auto");
      showToast("Flash Auto");
    } else if (flash === "auto") {
      setFlash("on");
      showToast("Flash On");
    } else {
      setFlash("off");
      showToast("Flash Off");
    }
  };

  // Flip front/rear camera
  const handleFlipCamera = () => {
    setFacingMode((prev) => (prev === "environment" ? "user" : "environment"));
  };

  // Shutter action: snap photo
  const handleShutter = () => {
    const video = videoRef.current;
    if (!video) return;

    // Trigger visual shutter flash
    setShutterFlash(true);
    setTimeout(() => setShutterFlash(false), 120);

    const width = video.videoWidth || 720;
    const height = video.videoHeight || 1280;
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");

    // Mirror image if selfie camera
    if (facingMode === "user") {
      ctx.translate(width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, 0, 0, width, height);

    const dataUrl = canvas.toDataURL("image/jpeg", 0.88);

    // Run illumination / face quality check
    try {
      const sample = ctx.getImageData(0, 0, width, height).data;
      let lum = 0;
      let n = 0;
      for (let i = 0; i < sample.length; i += 4 * 60) {
        lum += 0.299 * sample[i] + 0.587 * sample[i + 1] + 0.114 * sample[i + 2];
        n++;
      }
      const avg = lum / (n || 1);
      const warns = [];
      if (avg < 45) warns.push("Photo appears dark. Ensure face is well-lit for facial matching.");
      else if (avg > 235) warns.push("Photo appears overexposed. Avoid glare or harsh backlight.");
      setWarnings(warns);
    } catch (e) {
      setWarnings([]);
    }

    stopCameraStream();
    setPhotoData(dataUrl);
    setRotation(0);
    setDoodlePaths([]);
    setTextOverlays([]);
    setStickers([]);
    setSelectedFilter("none");
    setMode("preview");
  };

  // Gallery file picked handler
  const handleGalleryFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      return;
    }

    stopCameraStream();
    const { dataUrl, warnings: qualityWarns } = await compressImage(file, hd ? 1600 : 1024);
    setPhotoData(dataUrl);
    setWarnings(qualityWarns || []);
    setRotation(0);
    setDoodlePaths([]);
    setTextOverlays([]);
    setStickers([]);
    setSelectedFilter("none");
    setMode("preview");
  };

  // Use instant sample photo (for quick desktop testing)
  const handleUseSamplePhoto = () => {
    stopCameraStream();
    setPhotoData(SAMPLE_PILGRIM_PHOTO);
    setWarnings([]);
    setRotation(0);
    setDoodlePaths([]);
    setTextOverlays([]);
    setStickers([]);
    setSelectedFilter("none");
    setMode("preview");
  };

  // Rotate photo 90 degrees
  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  // Toggle HD quality
  const handleToggleHd = () => {
    const next = !hd;
    setHd(next);
    showToast(next ? "Photo quality set to HD" : "Standard quality");
  };

  // Toggle View Once
  const handleToggleViewOnce = () => {
    const next = !viewOnce;
    setViewOnce(next);
    showToast(next ? "Photo set to view once" : "Photo set to view repeatedly");
  };

  // Doodle drawing handlers
  const handleStartDraw = (e) => {
    if (activeTool !== "draw") return;
    const canvas = drawCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX || e.touches?.[0]?.clientX;
    const clientY = e.clientY || e.touches?.[0]?.clientY;
    const x = (clientX - rect.left) * (canvas.width / rect.width);
    const y = (clientY - rect.top) * (canvas.height / rect.height);

    isDrawingRef.current = true;
    const newPath = {
      color: brushColor,
      width: 4,
      points: [{ x, y }],
    };
    setDoodlePaths((prev) => [...prev, newPath]);
  };

  const handleMoveDraw = (e) => {
    if (!isDrawingRef.current || activeTool !== "draw") return;
    const canvas = drawCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX || e.touches?.[0]?.clientX;
    const clientY = e.clientY || e.touches?.[0]?.clientY;
    const x = (clientX - rect.left) * (canvas.width / rect.width);
    const y = (clientY - rect.top) * (canvas.height / rect.height);

    setDoodlePaths((prev) => {
      const next = [...prev];
      const curr = next[next.length - 1];
      if (curr) {
        curr.points.push({ x, y });
      }
      return next;
    });

    // Draw live stroke on canvas
    const ctx = canvas.getContext("2d");
    ctx.strokeStyle = brushColor;
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    const currPath = doodlePaths[doodlePaths.length - 1];
    if (currPath && currPath.points.length > 1) {
      const p1 = currPath.points[currPath.points.length - 2];
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const handleEndDraw = () => {
    isDrawingRef.current = false;
  };

  // Repaint canvas when doodle paths change (e.g. on Undo)
  useEffect(() => {
    const canvas = drawCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    doodlePaths.forEach((path) => {
      if (path.points.length < 2) return;
      ctx.strokeStyle = path.color;
      ctx.lineWidth = path.width || 4;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      ctx.moveTo(path.points[0].x, path.points[0].y);
      for (let i = 1; i < path.points.length; i++) {
        ctx.lineTo(path.points[i].x, path.points[i].y);
      }
      ctx.stroke();
    });
  }, [doodlePaths]);

  // Undo last doodle stroke
  const handleUndoDoodle = () => {
    if (doodlePaths.length > 0) {
      setDoodlePaths((prev) => prev.slice(0, -1));
    } else if (stickers.length > 0) {
      setStickers((prev) => prev.slice(0, -1));
    } else if (textOverlays.length > 0) {
      setTextOverlays((prev) => prev.slice(0, -1));
    }
  };

  // Add text overlay
  const handleSaveTextOverlay = () => {
    if (!tempText.trim()) {
      setActiveTool(null);
      return;
    }
    setTextOverlays((prev) => [
      ...prev,
      {
        id: Date.now(),
        text: tempText.trim(),
        color: brushColor,
        bg: textBg,
        x: 50, // % from left
        y: 50, // % from top
      },
    ]);
    setTempText("");
    setActiveTool(null);
  };

  // Add sticker overlay
  const handleAddSticker = (emoji) => {
    setStickers((prev) => [
      ...prev,
      {
        id: Date.now(),
        emoji,
        x: 40 + Math.random() * 20,
        y: 40 + Math.random() * 20,
      },
    ]);
    setActiveTool(null);
  };

  // Bake final photo onto canvas and send
  const handleSendPhoto = async () => {
    if (!photoData) return;

    // Offscreen render to bake rotation, filter, doodles, text, and stickers
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = photoData;
    await new Promise((res) => {
      img.onload = res;
      img.onerror = res;
    });

    const isQuarter = rotation === 90 || rotation === 270;
    const origW = img.naturalWidth || 720;
    const origH = img.naturalHeight || 1280;
    const outW = isQuarter ? origH : origW;
    const outH = isQuarter ? origW : origH;

    const canvas = document.createElement("canvas");
    canvas.width = outW;
    canvas.height = outH;
    const ctx = canvas.getContext("2d");

    // Apply rotation
    ctx.save();
    ctx.translate(outW / 2, outH / 2);
    ctx.rotate((rotation * Math.PI) / 180);

    // Apply selected filter
    const activeFilterObj = PHOTO_FILTERS.find((f) => f.id === selectedFilter);
    if (activeFilterObj && activeFilterObj.filter !== "none") {
      ctx.filter = activeFilterObj.filter;
    }
    ctx.drawImage(img, -origW / 2, -origH / 2, origW, origH);
    ctx.restore();

    // Bake doodles if any
    if (doodlePaths.length > 0 && drawCanvasRef.current) {
      const dCanvas = drawCanvasRef.current;
      ctx.drawImage(dCanvas, 0, 0, outW, outH);
    }

    // Bake text overlays
    textOverlays.forEach((t) => {
      ctx.save();
      const fontSize = Math.max(24, Math.round(outW * 0.05));
      ctx.font = `bold ${fontSize}px sans-serif`;
      const textX = (outW * t.x) / 100;
      const textY = (outH * t.y) / 100;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      if (t.bg) {
        const textMetrics = ctx.measureText(t.text);
        const padding = 12;
        ctx.fillStyle = "rgba(0, 0, 0, 0.65)";
        ctx.roundRect?.(
          textX - textMetrics.width / 2 - padding,
          textY - fontSize / 2 - padding / 2,
          textMetrics.width + padding * 2,
          fontSize + padding,
          8
        );
        ctx.fill();
      }

      ctx.fillStyle = t.color || "#ffffff";
      ctx.fillText(t.text, textX, textY);
      ctx.restore();
    });

    // Bake stickers
    stickers.forEach((s) => {
      ctx.save();
      const stickerSize = Math.max(36, Math.round(outW * 0.09));
      ctx.font = `${stickerSize}px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(s.emoji, (outW * s.x) / 100, (outH * s.y) / 100);
      ctx.restore();
    });

    const finalDataUrl = canvas.toDataURL("image/jpeg", hd ? 0.92 : 0.82);

    onSend?.({
      dataUrl: finalDataUrl,
      caption: caption.trim(),
      viewOnce,
    });
    onClose();
  };

  return (
    <div className="absolute inset-0 z-50 flex flex-col bg-black text-white select-none animate-in fade-in duration-150 overflow-hidden">
      {/* Hidden file picker for gallery selection */}
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleGalleryFile}
      />

      {/* Floating WhatsApp Toast Notification */}
      {toast && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 bg-[#1f2c34]/95 text-white text-[13px] font-medium px-4 py-2 rounded-full shadow-2xl backdrop-blur border border-white/10 animate-in fade-in zoom-in-95 duration-150 pointer-events-none">
          {toast}
        </div>
      )}

      {/* ==================================================================== */}
      {/* 1. CAMERA VIEWFINDER MODE                                            */}
      {/* ==================================================================== */}
      {mode === "camera" && (
        <div className="relative w-full h-full flex flex-col justify-between overflow-hidden">
          {/* Shutter snap white flash animation */}
          {shutterFlash && (
            <div className="absolute inset-0 bg-white z-40 animate-out fade-out duration-150 pointer-events-none" />
          )}

          {/* Top Camera Controls */}
          <div className="relative z-20 flex items-center justify-between px-3.5 pt-[max(0.75rem,env(safe-area-inset-top))] pb-3 bg-gradient-to-b from-black/70 to-transparent">
            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="w-10 h-10 rounded-full flex items-center justify-center text-white/90 hover:bg-white/10 active:scale-90 transition-all"
              aria-label="Close camera"
            >
              <CloseIcon size={24} />
            </button>

            {/* Flash Toggle Button */}
            <button
              type="button"
              onClick={handleToggleFlash}
              className={`w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10 active:scale-90 transition-all ${
                flash === "on" ? "text-[#facc15]" : flash === "auto" ? "text-[#53bdeb]" : "text-white/90"
              }`}
              aria-label={`Flash: ${flash}`}
              title={`Flash ${flash}`}
            >
              {flash === "on" ? (
                <FlashOnIcon size={22} />
              ) : flash === "auto" ? (
                <FlashAutoIcon size={22} />
              ) : (
                <FlashOffIcon size={22} />
              )}
            </button>
          </div>

          {/* Viewfinder Video Stream / Permission Denied Screen */}
          <div className="absolute inset-0 flex items-center justify-center bg-[#111] overflow-hidden">
            {cameraError ? (
              <div className="p-6 text-center max-w-xs flex flex-col items-center gap-3 z-10 animate-in fade-in duration-200">
                <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center text-white/70">
                  <GalleryIcon size={32} />
                </div>
                <h3 className="text-[16px] font-semibold text-white">Camera Access</h3>
                <p className="text-[13.5px] text-white/70 leading-relaxed">{cameraError}</p>
                <div className="flex flex-col gap-2 w-full mt-2">
                  <button
                    type="button"
                    onClick={() => galleryInputRef.current?.click()}
                    className="w-full py-2.5 rounded-full bg-[#00a884] text-white font-medium text-[14px] hover:bg-[#008069] active:scale-95 transition-all shadow-md"
                  >
                    Choose from Gallery
                  </button>
                  <button
                    type="button"
                    onClick={handleUseSamplePhoto}
                    className="w-full py-2 rounded-full bg-white/15 text-white/90 font-medium text-[13px] hover:bg-white/20 active:scale-95 transition-all border border-white/20"
                  >
                    📷 Use Sample Pilgrim Photo
                  </button>
                </div>
              </div>
            ) : (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {/* Bottom Camera Action Bar */}
          <div className="relative z-20 flex flex-col items-center gap-3 px-6 pt-3 pb-[max(1.25rem,env(safe-area-inset-bottom))] bg-gradient-to-t from-black/85 via-black/50 to-transparent">
            {/* WhatsApp camera guidance */}
            <span className="text-[12px] text-white/70 tracking-wide select-none drop-shadow">
              Tap for photo
            </span>

            <div className="w-full flex items-center justify-between">
              {/* Gallery Thumbnail Button */}
              <button
                type="button"
                onClick={() => galleryInputRef.current?.click()}
                className="w-12 h-12 rounded-xl bg-white/15 border border-white/30 flex items-center justify-center text-white hover:bg-white/25 active:scale-90 transition-all shadow-md"
                aria-label="Open gallery"
                title="Select photo from gallery"
              >
                <GalleryIcon size={24} />
              </button>

              {/* Iconic WhatsApp Shutter Button */}
              <button
                type="button"
                onClick={cameraError ? handleUseSamplePhoto : handleShutter}
                className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center p-1 group active:scale-90 transition-transform shadow-2xl"
                aria-label="Take photo"
              >
                <div className="w-full h-full rounded-full bg-white/95 group-hover:bg-white transition-colors" />
              </button>

              {/* Flip Camera Button */}
              <button
                type="button"
                onClick={handleFlipCamera}
                className="w-12 h-12 rounded-full bg-white/15 flex items-center justify-center text-white hover:bg-white/25 active:scale-90 active:rotate-180 transition-all shadow-md"
                aria-label="Flip camera"
                title="Switch front / rear camera"
              >
                <FlipCameraIcon size={24} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 2. PHOTO PRE-SEND EDITOR (WhatsApp Post-Capture Editor)              */}
      {/* ==================================================================== */}
      {mode === "preview" && (
        <div className="relative w-full h-full flex flex-col justify-between overflow-hidden bg-[#0b141a]">
          {/* Top Editor Toolbar */}
          <header className="relative z-30 flex items-center justify-between px-3 pt-[max(0.75rem,env(safe-area-inset-top))] pb-2 bg-gradient-to-b from-black/80 to-transparent">
            {/* Back Button */}
            <button
              type="button"
              onClick={() => {
                if (activeTool) {
                  setActiveTool(null);
                } else if (initialMode === "camera") {
                  setMode("camera");
                } else {
                  onClose();
                }
              }}
              className="w-10 h-10 rounded-full flex items-center justify-center text-white/90 hover:bg-white/10 active:scale-90 transition-transform"
              aria-label="Back"
            >
              <BackIcon size={24} />
            </button>

            {/* Right Editing Tools */}
            <div className="flex items-center gap-1">
              {/* HD Quality Toggle */}
              <button
                type="button"
                onClick={handleToggleHd}
                className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-white/10 active:scale-90 transition-transform"
                title="Toggle HD quality"
                aria-label="HD quality"
              >
                <HdIcon active={hd} />
              </button>

              {/* Crop / Rotate */}
              <button
                type="button"
                onClick={handleRotate}
                className="w-9 h-9 rounded-full flex items-center justify-center text-white/80 hover:bg-white/10 active:scale-90 transition-transform"
                title="Rotate 90°"
                aria-label="Rotate"
              >
                <CropIcon size={20} />
              </button>

              {/* Stickers / Emoji Drawer Toggle */}
              <button
                type="button"
                onClick={() => setActiveTool(activeTool === "sticker" ? null : "sticker")}
                className={`w-9 h-9 rounded-full flex items-center justify-center active:scale-90 transition-all ${
                  activeTool === "sticker" ? "bg-white/20 text-[#00a884]" : "text-white/80 hover:bg-white/10"
                }`}
                title="Add stickers or emoji"
                aria-label="Stickers"
              >
                <EmojiIcon size={20} />
              </button>

              {/* Text Tool ("T") */}
              <button
                type="button"
                onClick={() => setActiveTool(activeTool === "text" ? null : "text")}
                className={`w-9 h-9 rounded-full flex items-center justify-center active:scale-90 transition-all ${
                  activeTool === "text" ? "bg-white/20 text-[#00a884]" : "text-white/80 hover:bg-white/10"
                }`}
                title="Add text overlay"
                aria-label="Text"
              >
                <TextIcon size={20} />
              </button>

              {/* Pencil / Doodle Tool */}
              <button
                type="button"
                onClick={() => setActiveTool(activeTool === "draw" ? null : "draw")}
                className={`w-9 h-9 rounded-full flex items-center justify-center active:scale-90 transition-all ${
                  activeTool === "draw" ? "bg-white/20 text-[#00a884]" : "text-white/80 hover:bg-white/10"
                }`}
                title="Draw on photo"
                aria-label="Doodle"
              >
                <PencilIcon size={20} />
              </button>

              {/* Undo Button (if edits made) */}
              {(doodlePaths.length > 0 || stickers.length > 0 || textOverlays.length > 0) && (
                <button
                  type="button"
                  onClick={handleUndoDoodle}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white/80 hover:bg-white/10 active:scale-90 transition-transform"
                  title="Undo last edit"
                  aria-label="Undo"
                >
                  <UndoIcon size={20} />
                </button>
              )}
            </div>
          </header>

          {/* Color Palette Bar (when Drawing or Text is active) */}
          {(activeTool === "draw" || activeTool === "text") && (
            <div className="relative z-30 flex items-center justify-center gap-3 py-1.5 px-4 bg-black/60 backdrop-blur border-y border-white/10 animate-in slide-in-from-top duration-150">
              {WHATSAPP_COLORS.map((c) => (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => setBrushColor(c.hex)}
                  style={{ backgroundColor: c.hex }}
                  className={`w-7 h-7 rounded-full shadow-md transition-transform ${
                    brushColor === c.hex ? "scale-125 ring-2 ring-white" : "hover:scale-110"
                  }`}
                  aria-label={`Color ${c.name}`}
                />
              ))}

              {activeTool === "text" && (
                <button
                  type="button"
                  onClick={() => setTextBg(!textBg)}
                  className={`ml-2 px-2.5 py-1 rounded-md text-[11px] font-semibold border ${
                    textBg ? "bg-white text-black border-white" : "text-white border-white/50"
                  }`}
                >
                  {textBg ? "Solid" : "Plain"}
                </button>
              )}
            </div>
          )}

          {/* Quick Sticker Drawer */}
          {activeTool === "sticker" && (
            <div className="relative z-30 flex items-center justify-center gap-2 py-2 px-3 bg-black/75 backdrop-blur border-b border-white/10 overflow-x-auto scrollbar-hide animate-in slide-in-from-top duration-150">
              {QUICK_STICKERS.map((stk) => (
                <button
                  key={stk}
                  type="button"
                  onClick={() => handleAddSticker(stk)}
                  className="text-[24px] hover:scale-125 active:scale-95 transition-transform p-1"
                >
                  {stk}
                </button>
              ))}
            </div>
          )}

          {/* Text Input Modal when "T" tool active */}
          {activeTool === "text" && (
            <div className="absolute inset-0 z-40 bg-black/70 flex flex-col items-center justify-center p-4">
              <input
                value={tempText}
                onChange={(e) => setTempText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSaveTextOverlay()}
                placeholder="Type text overlay…"
                autoFocus
                style={{ color: brushColor }}
                className={`w-full max-w-xs text-center text-[22px] font-bold p-3 outline-none rounded-xl transition-all ${
                  textBg ? "bg-black/60 shadow-2xl" : "bg-transparent"
                }`}
              />
              <div className="flex items-center gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setActiveTool(null)}
                  className="px-4 py-1.5 rounded-full bg-white/20 text-white text-[13px] font-medium"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveTextOverlay}
                  className="px-5 py-1.5 rounded-full bg-[#00a884] text-white text-[13px] font-semibold shadow-lg"
                >
                  Done
                </button>
              </div>
            </div>
          )}

          {/* Photo Center with interactive drawing canvas & overlays */}
          <div className="flex-1 flex flex-col items-center justify-center p-2 overflow-hidden relative select-none">
            <div className="relative max-h-full max-w-full flex items-center justify-center">
              <img
                src={photoData}
                alt="Captured"
                style={{
                  transform: `rotate(${rotation}deg)`,
                  filter: PHOTO_FILTERS.find((f) => f.id === selectedFilter)?.filter || "none",
                }}
                className="max-h-[68vh] sm:max-h-[70vh] max-w-full object-contain rounded-md shadow-2xl transition-all duration-200"
              />

              {/* Drawing canvas layer matching container */}
              {activeTool === "draw" && (
                <canvas
                  ref={drawCanvasRef}
                  width={720}
                  height={1280}
                  onMouseDown={handleStartDraw}
                  onMouseMove={handleMoveDraw}
                  onMouseUp={handleEndDraw}
                  onTouchStart={handleStartDraw}
                  onTouchMove={handleMoveDraw}
                  onTouchEnd={handleEndDraw}
                  className="absolute inset-0 w-full h-full cursor-crosshair touch-none z-10"
                />
              )}

              {/* Text Overlays */}
              {textOverlays.map((t) => (
                <div
                  key={t.id}
                  style={{
                    left: `${t.x}%`,
                    top: `${t.y}%`,
                    color: t.color || "#fff",
                  }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 px-2.5 py-1 rounded text-[16px] font-bold drop-shadow cursor-move z-20 ${
                    t.bg ? "bg-black/60 backdrop-blur-xs" : ""
                  }`}
                >
                  {t.text}
                </div>
              ))}

              {/* Sticker Overlays */}
              {stickers.map((s) => (
                <div
                  key={s.id}
                  style={{
                    left: `${s.x}%`,
                    top: `${s.y}%`,
                  }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 text-[32px] drop-shadow cursor-move select-none z-20"
                >
                  {s.emoji}
                </div>
              ))}
            </div>

            {/* Quality warnings badge */}
            {warnings.length > 0 && (
              <div className="absolute top-2 left-4 right-4 bg-[#5c3b00]/90 backdrop-blur border border-[#ffe0a3]/30 text-[#ffe0a3] text-[12.5px] px-3.5 py-2 rounded-lg shadow-lg text-center z-20">
                {warnings.map((w, i) => (
                  <p key={i}>⚠️ {w}</p>
                ))}
              </div>
            )}
          </div>

          {/* Filter Bar Slider ("Swipe up for filters" style) */}
          {showFilterDrawer && (
            <div className="relative z-20 px-3 py-2 bg-black/80 backdrop-blur-md border-t border-white/10 flex items-center justify-center gap-2 overflow-x-auto scrollbar-hide animate-in slide-in-from-bottom duration-150">
              {PHOTO_FILTERS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setSelectedFilter(f.id)}
                  className={`px-3 py-1 rounded-full text-[12px] font-medium transition-all ${
                    selectedFilter === f.id
                      ? "bg-[#00a884] text-white shadow-md font-semibold"
                      : "bg-white/15 text-white/80 hover:bg-white/25"
                  }`}
                >
                  {f.name}
                </button>
              ))}
            </div>
          )}

          {/* Bottom WhatsApp Caption & Send Pill */}
          <div className="relative z-20 px-3 pt-2 pb-[max(1rem,env(safe-area-inset-bottom))] bg-gradient-to-t from-black/95 via-black/85 to-transparent flex flex-col gap-2">
            {/* Filter drawer toggle button & Recipient pill */}
            <div className="flex items-center justify-between px-2">
              <button
                type="button"
                onClick={() => setShowFilterDrawer(!showFilterDrawer)}
                className="text-[11.5px] text-white/70 hover:text-white flex items-center gap-1 active:scale-95 transition-transform"
              >
                <span>✨ Filters {selectedFilter !== "none" ? `(${selectedFilter})` : ""}</span>
              </button>

              <span className="px-2.5 py-0.5 rounded-full bg-white/15 text-white/80 text-[11.5px] font-medium flex items-center gap-1">
                <span>🔒 PushkarAI Missing Persons Desk</span>
              </span>
            </div>

            {/* Caption bar */}
            <div className="flex items-center gap-2">
              <div className="flex-1 flex items-center bg-[#202c33] rounded-full px-3 py-1.5 border border-white/10 focus-within:border-[#00a884] transition-colors shadow-inner">
                {/* Emoji button */}
                <button
                  type="button"
                  onClick={() => setCaption((prev) => prev + " 😊")}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-[#8696a0] hover:text-white shrink-0 mr-1"
                  aria-label="Add emoji"
                >
                  <EmojiIcon size={20} />
                </button>

                {/* Input */}
                <input
                  ref={captionInputRef}
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendPhoto()}
                  placeholder="Add a caption…"
                  className="flex-1 bg-transparent text-[15px] text-white placeholder:text-[#8696a0] outline-none min-w-0"
                  autoFocus
                />

                {/* WhatsApp View Once Button */}
                <button
                  type="button"
                  onClick={handleToggleViewOnce}
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                    viewOnce
                      ? "text-[#00a884] bg-[#00a884]/20"
                      : "text-white/70 hover:text-white"
                  }`}
                  title="View once"
                  aria-label="View once"
                >
                  <ViewOnceIcon active={viewOnce} size={20} />
                </button>
              </div>

              {/* Green Circular Send Button */}
              <button
                type="button"
                onClick={handleSendPhoto}
                className="w-12 h-12 rounded-full bg-[#00a884] hover:bg-[#008069] active:scale-90 text-white flex items-center justify-center shadow-lg transition-transform shrink-0"
                aria-label="Send photo"
              >
                <SendIcon size={22} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 3. LIGHTBOX VIEWER MODE (WhatsApp Media Viewer)                      */}
      {/* ==================================================================== */}
      {mode === "lightbox" && (
        <div className="relative w-full h-full flex flex-col justify-between overflow-hidden bg-[#0b141a]">
          {/* Top WhatsApp Media Header */}
          <header className="relative z-20 flex items-center justify-between px-3 pt-[max(0.75rem,env(safe-area-inset-top))] pb-2 bg-gradient-to-b from-black/80 to-transparent">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="w-10 h-10 rounded-full flex items-center justify-center text-white hover:bg-white/10 active:scale-90 transition-transform"
                aria-label="Close"
              >
                <BackIcon size={24} />
              </button>

              <div className="flex items-center gap-2.5">
                <AppAvatar size={34} />
                <div className="flex flex-col text-left">
                  <span className="text-[14.5px] font-semibold text-white leading-tight">
                    {senderName}
                  </span>
                  <span className="text-[11.5px] text-white/60 leading-tight">
                    Today at{" "}
                    {new Date(timestamp).toLocaleTimeString([], {
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Top Right Media Action Icons */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => {
                  setLightboxStarred(!lightboxStarred);
                  showToast(lightboxStarred ? "Removed from starred" : "Starred message");
                }}
                className={`w-9 h-9 rounded-full flex items-center justify-center hover:bg-white/10 active:scale-90 transition-transform ${
                  lightboxStarred ? "text-[#facc15]" : "text-white/80"
                }`}
                title="Star"
                aria-label="Star"
              >
                <StarIcon size={20} />
              </button>

              <button
                type="button"
                onClick={() => showToast("Forwarding media…")}
                className="w-9 h-9 rounded-full flex items-center justify-center text-white/80 hover:bg-white/10 active:scale-90 transition-transform"
                title="Forward"
                aria-label="Forward"
              >
                <ForwardIcon size={20} />
              </button>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowMoreMenu(!showMoreMenu)}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white/80 hover:bg-white/10 active:scale-90 transition-transform"
                  title="More"
                  aria-label="More"
                >
                  <MoreIcon size={20} />
                </button>

                {showMoreMenu && (
                  <div className="absolute right-0 top-10 w-40 bg-[#233138] rounded-xl shadow-2xl py-1.5 border border-white/10 z-30 text-[14px]">
                    <button
                      type="button"
                      onClick={() => {
                        setShowMoreMenu(false);
                        const a = document.createElement("a");
                        a.href = photoData;
                        a.download = `WhatsApp_Photo_${Date.now()}.jpg`;
                        a.click();
                        showToast("Photo saved to downloads");
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-white/10 text-white"
                    >
                      Save photo
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowMoreMenu(false);
                        if (navigator.share) {
                          navigator.share({ title: "Pushkaralu Photo", url: photoData }).catch(() => {});
                        } else {
                          showToast("Sharing not supported in browser");
                        }
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-white/10 text-white"
                    >
                      Share
                    </button>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Centered High-Res Photo View with click to zoom */}
          <div
            className="flex-1 flex items-center justify-center p-2 overflow-hidden cursor-zoom-in"
            onClick={() => setLightboxZoom(!lightboxZoom)}
          >
            <img
              src={photoData}
              alt="Viewing"
              className={`max-h-full max-w-full object-contain rounded shadow-2xl transition-transform duration-200 ${
                lightboxZoom ? "scale-150 cursor-zoom-out" : "scale-100"
              }`}
            />
          </div>

          {/* Bottom WhatsApp Caption Bar (if caption exists) */}
          {caption ? (
            <div className="px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))] bg-black/75 backdrop-blur-md border-t border-white/10 text-[14.5px] text-white/95 leading-relaxed text-center">
              <span>{caption}</span>
            </div>
          ) : (
            <div className="p-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] bg-gradient-to-t from-black/80 to-transparent flex justify-center">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-1.5 rounded-full bg-white/15 hover:bg-white/25 text-white text-[13.5px] font-medium transition-colors"
              >
                Close
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
