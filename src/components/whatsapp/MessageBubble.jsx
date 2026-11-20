import React, { useMemo, useRef, useState } from "react";
import { formatTime } from "../../utils/media";
import { FormattedText, highlightSubstrings } from "./FormattedText";
import {
  CameraIcon,
  ListIcon,
  PinIcon,
  ReplyIcon,
  Ticks,
  ViewOnceIcon,
} from "./icons";
import { LocationCard } from "./LocationCard";

/**
 * Meta component for timestamp and delivery ticks.
 */
function Meta({ at, status, overlay = false }) {
  return (
    <span
      className={`meta text-[11px] leading-none shrink-0 inline-flex items-center gap-1 select-none ${
        overlay
          ? "absolute right-2.5 bottom-2 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] z-10"
          : "float-right ml-2 mt-1.5 text-[#667781]"
      }`}
    >
      <span>{formatTime(at)}</span>
      {status && <Ticks status={status} />}
    </span>
  );
}

/**
 * Authentic WhatsApp Voice Note Waveform Player.
 * Matches real WhatsApp voice notes with:
 * - Profile avatar with green microphone badge
 * - Interactive scrubbable waveform with moving dot scrubber
 * - Playback speed multiplier toggle (1x / 1.5x / 2x)
 * - Time elapsed counter & read receipts
 */
function VoiceNoteBubble({ url, duration = 3, at, status, isUser = true }) {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [speed, setSpeed] = useState(1); // 1 | 1.5 | 2
  const audioRef = useRef(null);
  const waveTrackRef = useRef(null);

  // 28 realistic voice frequency heights
  const bars = useMemo(() => {
    return [
      8, 14, 20, 10, 16, 24, 12, 18, 22, 14, 26, 18, 10, 15, 20, 28, 14, 8, 18, 24,
      16, 12, 22, 14, 18, 10, 14, 8,
    ];
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play().catch(() => {});
      setPlaying(true);
    }
  };

  const handleSpeedToggle = () => {
    const nextSpeed = speed === 1 ? 1.5 : speed === 1.5 ? 2 : 1;
    setSpeed(nextSpeed);
    if (audioRef.current) {
      audioRef.current.playbackRate = nextSpeed;
    }
  };

  const handleWaveSeek = (e) => {
    if (!waveTrackRef.current || !audioRef.current) return;
    const rect = waveTrackRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newProgress = Math.max(0, Math.min(1, clickX / rect.width));
    setProgress(newProgress);
    if (audioRef.current.duration) {
      audioRef.current.currentTime = newProgress * audioRef.current.duration;
    }
  };

  const currentSecs = Math.round(progress * (duration || 3));

  return (
    <div className="flex items-center gap-2.5 py-1 min-w-[210px] sm:min-w-[240px] max-w-full select-none">
      {/* Profile Avatar with WhatsApp Green Mic Badge */}
      <div className="relative w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 border border-black/10 shadow-xs">
        <span className="text-[17px]">{isUser ? "👤" : "🏛️"}</span>
        <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#00a884] text-white flex items-center justify-center shadow-xs">
          <CameraIcon size={9} className="hidden" />
          <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 14a3 3 0 0 0 3-3V5a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3zm5.3-3a5.3 5.3 0 0 1-10.6 0H5a7 7 0 0 0 6 6.9V21h2v-3.1a7 7 0 0 0 6-6.9z" />
          </svg>
        </div>
      </div>

      {/* Play / Pause Circular Button */}
      <button
        type="button"
        onClick={togglePlay}
        className="w-9 h-9 rounded-full bg-[#00a884] hover:bg-[#008069] text-white flex items-center justify-center shrink-0 shadow-xs active:scale-90 transition-all"
        aria-label={playing ? "Pause voice note" : "Play voice note"}
      >
        {playing ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="4" width="4" height="16" rx="1" />
            <rect x="14" y="4" width="4" height="16" rx="1" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="ml-0.5">
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
        )}
      </button>

      {/* Waveform & Timing Center */}
      <div className="flex-1 flex flex-col justify-center min-w-0">
        {/* Interactive Waveform Track with Scrubber Dot */}
        <div
          ref={waveTrackRef}
          onClick={handleWaveSeek}
          className="relative flex items-center gap-[2px] h-6 py-1 cursor-pointer group"
          title="Click to seek"
        >
          {bars.map((h, i) => {
            const isPlayed = i / bars.length <= progress;
            return (
              <span
                key={i}
                className="w-[2.5px] rounded-full transition-colors pointer-events-none"
                style={{
                  height: `${h}px`,
                  backgroundColor: isPlayed ? "#008069" : "#aebac1",
                }}
              />
            );
          })}

          {/* WhatsApp Scrubber Dot */}
          <div
            style={{ left: `${progress * 100}%` }}
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#008069] shadow-sm pointer-events-none transition-all duration-75"
          />
        </div>

        {/* Bottom Metadata Row: Timer, Speed Pill, and Read Ticks */}
        <div className="flex items-center justify-between mt-0.5 text-[11px] text-[#667781] leading-none">
          <div className="flex items-center gap-2">
            <span className="font-mono">
              0:{String(playing ? currentSecs : Math.round(duration || 3)).padStart(2, "0")}
            </span>

            {/* Speed Multiplier Pill (1x -> 1.5x -> 2x) */}
            <button
              type="button"
              onClick={handleSpeedToggle}
              className="px-1.5 py-0.5 rounded-full bg-black/5 hover:bg-black/10 active:scale-95 text-[10px] font-bold text-[#54656f] transition-all"
              title="Change playback speed"
            >
              {speed}x
            </button>
          </div>

          <Meta at={at} status={status} />
        </div>
      </div>

      {url && (
        <audio
          ref={audioRef}
          src={url}
          onTimeUpdate={(e) => {
            const el = e.target;
            setProgress(el.currentTime / (el.duration || 1));
          }}
          onEnded={() => {
            setPlaying(false);
            setProgress(0);
          }}
        />
      )}
    </div>
  );
}

/**
 * Single WhatsApp Message Bubble.
 */
export function MessageBubble({
  m,
  active = true,
  tail = true,
  highlight = "",
  isCurrentMatch = false,
  onReply,
  onOpenList,
  onRequestImage,
  onRequestLocation,
  onImageClick,
}) {
  const isUser = m.from === "user";

  // ---------------- USER MESSAGE ----------------
  if (isUser) {
    const r = m.reply || {};
    const hasMedia = r.type === "image" || r.type === "location";

    return (
      <div className="row out flex justify-end my-1 pl-1.5 pr-2.5 sm:pr-3 select-text">
        <div
          className={`bubble out relative max-w-[84%] sm:max-w-[78%] rounded-lg px-2.5 py-1.5 bg-[#d9fdd3] text-[#111b21] text-[14.5px] leading-snug shadow-[0_1px_0.5px_rgba(11,20,26,0.13)] ${
            tail ? "tail rounded-tr-none" : ""
          } ${hasMedia ? "p-1 overflow-hidden" : ""} ${
            isCurrentMatch ? "ring-2 ring-[#ff9e00]/70" : ""
          }`}
        >
          {/* Authentic WhatsApp speech bubble tail on top-right */}
          {tail && (
            <svg
              className="absolute -top-0 -right-[8px] w-2 h-3 text-[#d9fdd3] overflow-visible pointer-events-none"
              viewBox="0 0 8 13"
              fill="currentColor"
            >
              <path d="M0 0 L8 0 L0 13 Z" />
            </svg>
          )}

          {r.type === "image" && (
            <div>
              {r.viewOnce ? (
                /* Authentic WhatsApp View-Once Bubble */
                <button
                  type="button"
                  onClick={() =>
                    onImageClick?.({
                      url: r.previewUrl,
                      caption: r.caption || r.text,
                      sender: "You",
                      at: m.at,
                    })
                  }
                  className="flex items-center gap-2.5 py-1 px-1 rounded-md hover:bg-black/5 active:scale-95 transition-all text-left"
                >
                  <div className="w-8 h-8 rounded-full bg-[#00a884]/10 flex items-center justify-center shrink-0">
                    <ViewOnceIcon active={false} size={22} className="text-[#00a884]" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[14.5px] font-medium text-[#111b21] leading-tight">
                      Photo
                    </span>
                    <span className="text-[11px] text-[#667781] leading-tight">View once</span>
                  </div>
                  <Meta at={m.at} status={m.status} />
                </button>
              ) : (
                /* Standard WhatsApp Outgoing Image Bubble */
                <div className="relative rounded-md overflow-hidden bg-black/5">
                  <img
                    src={r.previewUrl}
                    alt="Sent attachment"
                    onClick={() =>
                      onImageClick?.({
                        url: r.previewUrl,
                        caption: r.caption || r.text,
                        sender: "You",
                        at: m.at,
                      })
                    }
                    className="block max-h-64 sm:max-h-72 w-full object-cover cursor-zoom-in rounded-md"
                  />
                  {r.caption || r.text ? (
                    <div className="px-1.5 pt-1.5 pb-0.5 text-[14px]">
                      <span className="text whitespace-pre-wrap break-words">
                        {highlightSubstrings(r.caption || r.text, highlight, isCurrentMatch)}
                      </span>
                      <Meta at={m.at} status={m.status} />
                    </div>
                  ) : (
                    <Meta at={m.at} status={m.status} overlay />
                  )}
                </div>
              )}
            </div>
          )}

          {r.type === "location" && (
            <div className="relative rounded-md overflow-hidden">
              <LocationCard
                lat={r.lat}
                lng={r.lng}
                name="📍 Shared Location"
                address={r.approx ? "Approximate GPS coordinate" : undefined}
              />
              <Meta at={m.at} status={m.status} overlay />
            </div>
          )}

          {r.type === "audio" && (
            <VoiceNoteBubble
              url={r.previewUrl}
              duration={r.duration}
              at={m.at}
              status={m.status}
              isUser={true}
            />
          )}

          {r.type !== "image" && r.type !== "location" && r.type !== "audio" && (
            <div>
              {(r.type === "button_reply" || r.type === "list_reply") && (
                <span className="block text-[11px] font-medium text-[#008069] mb-0.5">
                  ↩︎ selected
                </span>
              )}
              <span className="text whitespace-pre-wrap break-words">
                {highlightSubstrings(r.title || r.text, highlight, isCurrentMatch)}
              </span>
              <Meta at={m.at} status={m.status} />
            </div>
          )}
        </div>
      </div>
    );
  }

  // ---------------- BOT MESSAGE ----------------
  const b = m.msg;
  const isMedia = b.type === "image" || b.type === "location";
  const isInteractive =
    b.type === "buttons" ||
    b.type === "list" ||
    b.type === "request_location" ||
    b.type === "request_image";

  return (
    <div className="row in flex justify-start my-1 pl-2.5 sm:pl-3 pr-1.5 select-text">
      <div
        className={`bubble in relative max-w-[84%] sm:max-w-[78%] rounded-lg bg-white text-[#111b21] text-[14.5px] leading-snug shadow-[0_1px_0.5px_rgba(11,20,26,0.13)] ${
          tail ? "tail rounded-tl-none" : ""
        } ${isMedia ? "p-1 overflow-hidden" : isInteractive ? "p-0 w-fit max-w-full" : "px-2.5 py-1.5"} ${
          isCurrentMatch ? "ring-2 ring-[#ff9e00]/70" : ""
        }`}
      >
        {/* Authentic WhatsApp speech bubble tail on top-left */}
        {tail && (
          <svg
            className="absolute -top-0 -left-[8px] w-2 h-3 text-white overflow-visible pointer-events-none"
            viewBox="0 0 8 13"
            fill="currentColor"
          >
            <path d="M8 0 L0 0 L8 13 Z" />
          </svg>
        )}

        {/* Media: Image */}
        {b.type === "image" && (
          <div className="relative rounded-md overflow-hidden bg-black/5">
            <img
              src={b.url}
              alt={b.caption || "Image"}
              onClick={() =>
                onImageClick?.({
                  url: b.url,
                  caption: b.caption,
                  sender: "PushkarAI Safe Desk",
                  at: m.at,
                })
              }
              className="block max-h-64 sm:max-h-72 w-full object-cover cursor-zoom-in rounded-md"
            />
            {b.caption ? (
              <div className="p-2 text-[14px]">
                <FormattedText text={b.caption} highlight={highlight} isCurrentMatch={isCurrentMatch} />
                <Meta at={m.at} />
              </div>
            ) : (
              <Meta at={m.at} overlay />
            )}
          </div>
        )}

        {/* Media: Location */}
        {b.type === "location" && (
          <div className="relative rounded-md overflow-hidden">
            <LocationCard lat={b.lat} lng={b.lng} name={b.name} address={b.address} />
            <Meta at={m.at} overlay />
          </div>
        )}

        {/* Media: Audio Voice Note */}
        {b.type === "audio" && (
          <div className="px-2 py-1">
            <VoiceNoteBubble
              url={b.url}
              duration={b.duration}
              at={m.at}
              isUser={false}
            />
          </div>
        )}

        {/* Plain Text Message */}
        {b.type === "text" && (
          <div>
            <span className="text whitespace-pre-wrap break-words">
              <FormattedText text={b.text} highlight={highlight} isCurrentMatch={isCurrentMatch} />
            </span>
            <Meta at={m.at} />
          </div>
        )}

        {/* Interactive Message Container (Buttons, Lists, Actions) */}
        {isInteractive && (
          <div className="flex flex-col">
            <div className="p-2.5 pb-2">
              {b.header && (
                <div className="font-bold text-[14.5px] text-[#111b21] mb-1">
                  {highlightSubstrings(b.header, highlight, isCurrentMatch)}
                </div>
              )}
              <div className="whitespace-pre-wrap break-words text-[14.5px]">
                <FormattedText text={b.text} highlight={highlight} isCurrentMatch={isCurrentMatch} />
              </div>
              {b.footer && (
                <div className="text-[12px] text-[#667781] mt-1.5">{b.footer}</div>
              )}
              <Meta at={m.at} />
            </div>

            {/* Action Buttons */}
            {b.type === "buttons" &&
              b.buttons?.map((btn) => (
                <button
                  key={btn.id}
                  type="button"
                  disabled={!active}
                  onClick={() =>
                    onReply({
                      type: "button_reply",
                      buttonId: btn.id,
                      title: btn.title,
                    })
                  }
                  className={`w-full py-2.5 px-3 border-t border-[#e9edef] flex items-center justify-center gap-2 font-medium text-[14px] transition-colors ${
                    active
                      ? "text-[#027eb5] hover:bg-[#f5f6f6] active:bg-[#e9edef]"
                      : "text-[#a6b3ba] cursor-not-allowed"
                  }`}
                >
                  <ReplyIcon size={16} />
                  <span>{btn.title}</span>
                </button>
              ))}

            {b.type === "list" && (
              <button
                type="button"
                disabled={!active}
                onClick={() => onOpenList(m.id)}
                className={`w-full py-2.5 px-3 border-t border-[#e9edef] flex items-center justify-center gap-2 font-medium text-[14px] transition-colors ${
                  active
                    ? "text-[#027eb5] hover:bg-[#f5f6f6] active:bg-[#e9edef]"
                    : "text-[#a6b3ba] cursor-not-allowed"
                }`}
              >
                <ListIcon size={18} />
                <span>{b.buttonLabel || "Select an option"}</span>
              </button>
            )}

            {b.type === "request_location" && (
              <button
                type="button"
                disabled={!active}
                onClick={onRequestLocation}
                className={`w-full py-2.5 px-3 border-t border-[#e9edef] flex items-center justify-center gap-2 font-medium text-[14px] transition-colors ${
                  active
                    ? "text-[#008069] hover:bg-[#f5f6f6] active:bg-[#e9edef]"
                    : "text-[#a6b3ba] cursor-not-allowed"
                }`}
              >
                <PinIcon size={18} />
                <span>Send location</span>
              </button>
            )}

            {b.type === "request_image" && (
              <button
                type="button"
                disabled={!active}
                onClick={onRequestImage}
                className={`w-full py-2.5 px-3 border-t border-[#e9edef] flex items-center justify-center gap-2 font-medium text-[14px] transition-colors ${
                  active
                    ? "text-[#008069] hover:bg-[#f5f6f6] active:bg-[#e9edef]"
                    : "text-[#a6b3ba] cursor-not-allowed"
                }`}
              >
                <CameraIcon size={18} />
                <span>{b.buttonLabel || "Upload photo"}</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Authentic WhatsApp Animated Typing Indicator Bubble.
 * Medium-sized floating incoming bubble with 3 smooth jumping dots.
 */
export function TypingBubble() {
  return (
    <div className="flex justify-start my-1.5 ml-1 select-none animate-in fade-in duration-150">
      <div className="relative rounded-[16px] rounded-tl-[4px] bg-white px-3.5 py-2.5 shadow-[0_1px_0.5px_rgba(11,20,26,0.13)] inline-flex items-center gap-[5px]">
        <span className="wa-typing-dot" />
        <span className="wa-typing-dot" />
        <span className="wa-typing-dot" />
      </div>
    </div>
  );
}
