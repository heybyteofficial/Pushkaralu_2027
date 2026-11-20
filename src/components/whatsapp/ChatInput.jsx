import React, { useRef, useState, useEffect } from "react";
import { createSyntheticVoiceAudio } from "../../utils/media";
import {
  CameraIcon,
  CameraSolidIcon,
  ClipIcon,
  ContactCardIcon,
  DocumentIcon,
  EmojiIcon,
  GalleryIcon,
  HeadphonesIcon,
  MicIcon,
  PauseIcon,
  PinIcon,
  PlayIcon,
  SendIcon,
  TrashIcon,
} from "./icons";

const ATTACH_ITEMS = [
  {
    id: "document",
    label: "Document",
    gradient: "from-[#5f66cd] to-[#7f66ff]",
    icon: DocumentIcon,
  },
  {
    id: "camera",
    label: "Camera",
    gradient: "from-[#ec407a] to-[#ff2e74]",
    icon: CameraSolidIcon,
  },
  {
    id: "gallery",
    label: "Gallery",
    gradient: "from-[#ab47bc] to-[#c861f9]",
    icon: GalleryIcon,
  },
  {
    id: "audio",
    label: "Audio",
    gradient: "from-[#ff7043] to-[#ff8a3d]",
    icon: HeadphonesIcon,
  },
  {
    id: "location",
    label: "Location",
    gradient: "from-[#0eab62] to-[#1fbe71]",
    icon: PinIcon,
  },
  {
    id: "contact",
    label: "Contact",
    gradient: "from-[#0288d1] to-[#02a9eb]",
    icon: ContactCardIcon,
  },
];

export function ChatInput({
  onSend,
  onPickGallery,
  onPickCamera,
  onSendLocation,
  onSendAudio,
  onToggleEmoji,
  emojiOpen = false,
}) {
  const [text, setText] = useState("");
  const [showAttach, setShowAttach] = useState(false);

  // WhatsApp Voice Note Recording States
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordSecs, setRecordSecs] = useState(0);
  const [waveformBars, setWaveformBars] = useState(() => Array(20).fill(6));
  const [previewUrl, setPreviewUrl] = useState(null);
  const [previewPlaying, setPreviewPlaying] = useState(false);
  const [previewProgress, setPreviewProgress] = useState(0);
  const [micError, setMicError] = useState(null);

  const mediaRecorderRef = useRef(null);
  const audioStreamRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animFrameRef = useRef(null);
  const timerRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recordSecsRef = useRef(0);
  const previewAudioRef = useRef(null);

  // Keyboard shortcut to close popups on Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setShowAttach(false);
        setMicError(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cancelAudioStream();
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, []);

  const cancelAudioStream = () => {
    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach((t) => t.stop());
      audioStreamRef.current = null;
    }
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    const t = text.trim();
    if (!t) return;
    onSend(t);
    setText("");
    setShowAttach(false);
  };

  const handleAttachItem = (id) => {
    setShowAttach(false);
    if (id === "gallery") onPickGallery();
    else if (id === "camera") onPickCamera();
    else if (id === "location") onSendLocation();
    else if (id === "document") onPickGallery();
    else if (id === "audio") startRecording();
    else if (id === "contact") {
      onSend("Contact: Pushkaralu Help Control Room (112 / 100)");
    }
  };

  // -------------------------------------------------------------
  // WhatsApp Voice Recording Engine with Real-Time Waveform
  // -------------------------------------------------------------
  const startRecording = async () => {
    if (isRecording) return;
    setShowAttach(false);
    setMicError(null);
    setPreviewUrl(null);
    setIsPaused(false);

    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        setMicError("Microphone is not supported in this browser.");
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true },
      });
      audioStreamRef.current = stream;

      // Initialize Web Audio API Analyser for real-time waveform bars
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        const audioCtx = new AudioCtx();
        const source = audioCtx.createMediaStreamSource(stream);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 64;
        source.connect(analyser);
        audioContextRef.current = audioCtx;
        analyserRef.current = analyser;

        const updateWaveform = () => {
          if (!analyserRef.current) return;
          const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
          analyserRef.current.getByteFrequencyData(dataArray);

          // Sample 20 dynamic heights between 4px and 22px
          const bars = [];
          for (let i = 0; i < 20; i++) {
            const val = dataArray[i % dataArray.length] || 0;
            const h = Math.max(4, Math.min(22, Math.round((val / 255) * 22) + 4));
            bars.push(h);
          }
          setWaveformBars(bars);
          animFrameRef.current = requestAnimationFrame(updateWaveform);
        };
        updateWaveform();
      } catch (e) {
        // Fallback animated sine wave
        startSimulatedWaveform();
      }

      const mr = new MediaRecorder(stream);
      audioChunksRef.current = [];
      mr.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorderRef.current = mr;
      recordSecsRef.current = 0;
      setRecordSecs(0);
      setIsRecording(true);
      mr.start();

      timerRef.current = setInterval(() => {
        recordSecsRef.current += 1;
        setRecordSecs(recordSecsRef.current);
      }, 1000);
    } catch (err) {
      setMicError(
        "Microphone access was denied or is unavailable. You can send a test voice message below."
      );
    }
  };

  // Fallback animated waveform when analyser isn't supported
  const startSimulatedWaveform = () => {
    let step = 0;
    const interval = setInterval(() => {
      step += 0.2;
      const bars = [];
      for (let i = 0; i < 20; i++) {
        const h = Math.round(Math.abs(Math.sin(step + i * 0.35)) * 16) + 4;
        bars.push(h);
      }
      setWaveformBars(bars);
    }, 80);
    animFrameRef.current = { cancel: () => clearInterval(interval) };
  };

  // Pause recording (enters WhatsApp Listen-Back / Preview mode)
  const handlePauseRecording = () => {
    if (!isRecording || isPaused) return;
    setIsPaused(true);
    if (timerRef.current) clearInterval(timerRef.current);
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);

    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.requestData();
      setTimeout(() => {
        if (audioChunksRef.current.length > 0) {
          const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
          setPreviewUrl(URL.createObjectURL(blob));
        }
      }, 50);
    }
  };

  // Resume recording from paused state
  const handleResumeRecording = () => {
    if (!isRecording || !isPaused) return;
    setIsPaused(false);
    setPreviewUrl(null);

    timerRef.current = setInterval(() => {
      recordSecsRef.current += 1;
      setRecordSecs(recordSecsRef.current);
    }, 1000);

    // Resume waveform animation
    if (analyserRef.current) {
      const updateWaveform = () => {
        if (!analyserRef.current) return;
        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(dataArray);
        const bars = [];
        for (let i = 0; i < 20; i++) {
          const val = dataArray[i % dataArray.length] || 0;
          bars.push(Math.max(4, Math.min(22, Math.round((val / 255) * 22) + 4)));
        }
        setWaveformBars(bars);
        animFrameRef.current = requestAnimationFrame(updateWaveform);
      };
      updateWaveform();
    }
  };

  // Cancel & discard recording
  const handleCancelRecording = () => {
    setIsRecording(false);
    setIsPaused(false);
    setPreviewUrl(null);
    if (timerRef.current) clearInterval(timerRef.current);
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    cancelAudioStream();

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    audioChunksRef.current = [];
  };

  // Final Send Voice Note
  const handleSendRecording = () => {
    const duration = Math.max(1, recordSecsRef.current || 2);

    if (previewUrl) {
      onSendAudio?.(previewUrl, duration);
      handleCancelRecording();
      return;
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.onstop = () => {
        cancelAudioStream();
        if (audioChunksRef.current.length > 0) {
          const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
          const url = URL.createObjectURL(blob);
          onSendAudio?.(url, duration);
        } else {
          // Synthetic audio fallback
          const url = createSyntheticVoiceAudio(duration);
          onSendAudio?.(url, duration);
        }
      };
      mediaRecorderRef.current.stop();
    } else {
      const url = createSyntheticVoiceAudio(duration);
      onSendAudio?.(url, duration);
    }

    setIsRecording(false);
    setIsPaused(false);
    setPreviewUrl(null);
    if (timerRef.current) clearInterval(timerRef.current);
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
  };

  // Send simulated voice message (fallback for desktop without a mic)
  const handleSendSimulatedAudio = () => {
    setMicError(null);
    const audioUrl = createSyntheticVoiceAudio(4);
    onSendAudio?.(audioUrl, 4);
  };

  // Preview playback toggle
  const togglePreviewPlay = () => {
    const audio = previewAudioRef.current;
    if (!audio) return;
    if (previewPlaying) {
      audio.pause();
      setPreviewPlaying(false);
    } else {
      audio.play().catch(() => {});
      setPreviewPlaying(true);
    }
  };

  return (
    <div className="relative w-full px-2.5 sm:px-3 pt-2 pb-[max(0.65rem,env(safe-area-inset-bottom))] bg-[#efeae2] border-t border-black/5 select-none shrink-0 z-20">
      {/* Microphone Error / Fallback Card */}
      {micError && (
        <div className="sheet-backdrop fixed inset-0 z-30 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-5 max-w-xs w-full border border-[#e9edef] animate-in zoom-in-95 duration-150 flex flex-col items-center text-center gap-3">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center">
              <MicIcon size={26} />
            </div>
            <h4 className="text-[15px] font-semibold text-[#111b21]">Microphone Access</h4>
            <p className="text-[13px] text-[#667781] leading-relaxed">{micError}</p>
            <div className="flex flex-col gap-2 w-full mt-1">
              <button
                type="button"
                onClick={handleSendSimulatedAudio}
                className="w-full py-2.5 rounded-full bg-[#00a884] text-white font-medium text-[13.5px] hover:bg-[#008069] active:scale-95 transition-all shadow-sm"
              >
                Send Test Voice Message
              </button>
              <button
                type="button"
                onClick={() => setMicError(null)}
                className="w-full py-2 rounded-full text-[#54656f] text-[13px] hover:bg-black/5"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6-icon WhatsApp Attachment Popover */}
      {showAttach && (
        <>
          {/* Click-outside backdrop */}
          <div
            className="fixed inset-0 z-30"
            onClick={() => setShowAttach(false)}
          />

          {/* Authentic WhatsApp Attachment Card (strictly constrained inside phone container) */}
          <div
            className="absolute bottom-full mb-3 left-3 right-3 sm:left-4 sm:right-4 z-40 bg-white rounded-2xl shadow-[0_8px_30px_rgba(11,20,26,0.18)] p-4 border border-[#e9edef] animate-in fade-in slide-in-from-bottom-2 zoom-in-95 duration-150 select-none"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="grid grid-cols-3 gap-y-4 gap-x-2">
              {ATTACH_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleAttachItem(item.id)}
                    className="flex flex-col items-center gap-1.5 p-1 rounded-xl hover:bg-[#f5f6f6] active:scale-90 transition-all text-[#54656f] group"
                  >
                    <div
                      className={`w-[52px] h-[52px] rounded-full bg-gradient-to-tr ${item.gradient} flex items-center justify-center text-white shadow-md group-hover:scale-105 group-active:scale-95 transition-transform`}
                    >
                      <Icon size={24} />
                    </div>
                    <span className="text-[12.5px] font-medium leading-none text-[#54656f]">
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* Main Composer Box */}
      <form onSubmit={handleSubmit} className="flex items-center gap-1.5 sm:gap-2 w-full max-w-full mx-auto">
        {/* ============================================================== */}
        {/* 1. REAL WHATSAPP VOICE RECORDING UI                             */}
        {/* ============================================================== */}
        {isRecording ? (
          <div className="flex-1 flex items-center justify-between bg-white rounded-full px-3 py-1.5 shadow-sm border border-black/5 animate-in fade-in duration-150">
            {/* Trash button (Cancel recording) */}
            <button
              type="button"
              onClick={handleCancelRecording}
              className="text-[#ea0038] hover:text-red-700 active:scale-90 transition-transform p-1.5 rounded-full hover:bg-red-50 shrink-0"
              title="Delete recording"
              aria-label="Delete recording"
            >
              <TrashIcon size={20} />
            </button>

            {/* A. ACTIVE LIVE RECORDING STATE */}
            {!isPaused ? (
              <div className="flex-1 flex items-center justify-between mx-2 min-w-0">
                {/* Red pulsing dot & Timer */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#ea0038] animate-ping" />
                  <span className="font-mono text-[14px] font-semibold text-[#111b21] tracking-tight">
                    0:{String(recordSecs).padStart(2, "0")}
                  </span>
                </div>

                {/* Live dynamic waveform bars */}
                <div className="flex items-center gap-[2.5px] h-6 px-2 overflow-hidden">
                  {waveformBars.map((h, i) => (
                    <span
                      key={i}
                      style={{ height: `${h}px` }}
                      className="w-[2.5px] rounded-full bg-[#ea0038] transition-[height] duration-75 shrink-0"
                    />
                  ))}
                </div>

                {/* Pause / Listen-Back Button */}
                <button
                  type="button"
                  onClick={handlePauseRecording}
                  className="w-8 h-8 rounded-full bg-[#f0f2f5] hover:bg-[#e9edef] text-[#54656f] flex items-center justify-center active:scale-90 transition-all shrink-0"
                  title="Pause and preview"
                  aria-label="Pause"
                >
                  <PauseIcon size={16} />
                </button>
              </div>
            ) : (
              /* B. PAUSED / LISTEN-BACK PREVIEW STATE */
              <div className="flex-1 flex items-center justify-between mx-2 min-w-0">
                {/* Play / Pause Preview Button */}
                <button
                  type="button"
                  onClick={togglePreviewPlay}
                  className="w-8 h-8 rounded-full bg-[#00a884] text-white flex items-center justify-center active:scale-90 transition-all shrink-0 shadow-sm"
                  aria-label={previewPlaying ? "Pause preview" : "Play preview"}
                >
                  {previewPlaying ? <PauseIcon size={16} /> : <PlayIcon size={16} className="ml-0.5" />}
                </button>

                {/* Recorded waveform scrub preview */}
                <div className="flex-1 flex items-center gap-[2px] h-6 px-3">
                  {waveformBars.map((h, i) => {
                    const isPassed = i / waveformBars.length <= previewProgress;
                    return (
                      <span
                        key={i}
                        style={{ height: `${h}px` }}
                        className={`w-[2.5px] rounded-full transition-colors ${
                          isPassed ? "bg-[#00a884]" : "bg-[#aebac1]"
                        }`}
                      />
                    );
                  })}
                </div>

                {/* Duration */}
                <span className="font-mono text-[13px] font-medium text-[#54656f] shrink-0 mr-2">
                  0:{String(recordSecs).padStart(2, "0")}
                </span>

                {/* Red Mic Button to Resume Recording */}
                <button
                  type="button"
                  onClick={handleResumeRecording}
                  className="w-8 h-8 rounded-full bg-red-50 hover:bg-red-100 text-[#ea0038] flex items-center justify-center active:scale-90 transition-all shrink-0"
                  title="Resume recording"
                  aria-label="Resume recording"
                >
                  <MicIcon size={18} />
                </button>

                {previewUrl && (
                  <audio
                    ref={previewAudioRef}
                    src={previewUrl}
                    onTimeUpdate={(e) => {
                      const el = e.target;
                      setPreviewProgress(el.currentTime / (el.duration || 1));
                    }}
                    onEnded={() => {
                      setPreviewPlaying(false);
                      setPreviewProgress(0);
                    }}
                  />
                )}
              </div>
            )}
          </div>
        ) : (
          /* ============================================================== */
          /* 2. NORMAL WHATSAPP COMPOSER PILL                               */
          /* ============================================================== */
          <div className="flex-1 flex items-center bg-white rounded-full px-1.5 sm:px-2 py-1 shadow-sm border border-black/5 focus-within:ring-1 focus-within:ring-[#00a884]/40 transition-all min-w-0">
            {/* Emoji Button */}
            <button
              type="button"
              onClick={onToggleEmoji}
              className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-[#54656f] hover:bg-black/5 active:scale-90 transition-all shrink-0 ${
                emojiOpen ? "text-[#008069] bg-[#e7f6ef]" : ""
              }`}
              aria-label="Emoji"
            >
              <EmojiIcon size={20} />
            </button>

            {/* Input */}
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type a message"
              className="flex-1 bg-transparent px-2 py-2 text-[14.5px] sm:text-[15px] text-[#111b21] placeholder:text-[#8696a0] outline-none min-w-0"
              enterKeyHint="send"
            />

            {/* Attachment Button */}
            <button
              type="button"
              onClick={() => setShowAttach(!showAttach)}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-[#54656f] hover:bg-black/5 active:scale-90 transition-all shrink-0"
              aria-label="Attach media"
            >
              <ClipIcon size={19} />
            </button>

            {/* Camera Button (when no text) */}
            {!text && (
              <button
                type="button"
                onClick={onPickCamera}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-[#54656f] hover:bg-black/5 active:scale-90 transition-all shrink-0"
                aria-label="Camera"
              >
                <CameraIcon size={20} />
              </button>
            )}
          </div>
        )}

        {/* WhatsApp Action FAB (Mic or Green Send Button) */}
        <button
          type={text ? "submit" : "button"}
          onClick={
            isRecording
              ? handleSendRecording
              : text
              ? undefined
              : startRecording
          }
          className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#00a884] hover:bg-[#008069] active:scale-90 text-white flex items-center justify-center shadow-md transition-all shrink-0"
          aria-label={text || isRecording ? "Send message" : "Voice message"}
          title={text || isRecording ? "Send message" : "Hold or tap to record voice note"}
        >
          {text || isRecording ? <SendIcon size={19} className="ml-0.5" /> : <MicIcon size={22} />}
        </button>
      </form>
    </div>
  );
}
