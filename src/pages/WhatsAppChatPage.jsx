import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  BellOff,
  Camera,
  ChevronDown,
  ChevronUp,
  FileText,
  Headphones,
  Image as ImageIcon,
  Keyboard,
  Lock,
  Mic,
  MoreVertical,
  Paperclip,
  Send,
  Smile,
  Trash2,
  X,
} from "lucide-react";
import apLogo from "@/assets/ap-govt-logo.png";
import PushkarAvatar from "../components/PushkarAvatar";
import WhatsAppProfile from "../components/WhatsAppProfile";
import { FALLBACK_GUIDE, GUIDES, VOICE_GUIDE, matchGuide } from "../data/chatGuides";
import { users as familyUsers } from "../data/family";

const OPENING_TEXT = "Welcome to the Government of Andhra Pradesh citizen assistance service for Pushkaralu 2027.\n\nFor information in Telugu, type TE.\nFor information in English, type EN.";
const mainContact = familyUsers[0];
const EMERGENCY_TYPES = [
  { id: "medical", label: "Medical", labelTe: "వైద్యం", team: "Ambulance team", teamTe: "అంబులెన్స్ బృందం", phone: "108" },
  { id: "accident", label: "Accident", labelTe: "ప్రమాదం", team: "Rescue team", teamTe: "రెస్క్యూ బృందం", phone: "108" },
  { id: "police", label: "Police", labelTe: "పోలీసు", team: "Police team", teamTe: "పోలీసు బృందం", phone: "100" },
];
const ADMIN = {
  title: "Missing Person Main Admin",
  titleTe: "మిస్సింగ్ వ్యక్తి ప్రధాన అడ్మిన్",
  name: mainContact.name,
  nameTe: mainContact.nameTe,
  relation: mainContact.relation,
  relationTe: mainContact.relationTe,
  phone: "9959401213",
};
const TYPING_DELAY_MS = 500;
const REPLY_PAUSE_MS = 500;

const EMOJI_GROUPS = [
  {
    id: "smileys",
    label: "Smileys",
    emojis: ["😀", "😁", "😂", "🤣", "😃", "😄", "😅", "😆", "😉", "😊", "😋", "😎", "😍", "😘", "🥰", "😗", "🙂", "🤗", "🤩", "🤔", "😐", "😑", "🙄", "😏", "😣", "😮", "🤐", "😯", "😪", "😫", "😴", "😌", "😛", "😜", "😒", "😓", "😔", "😕", "🙃", "😲", "🙁", "😖", "😞", "😟", "😤", "😢", "😭", "😨", "😩", "🤯", "😬", "😱", "😳", "🤪", "😵", "😡", "😠", "😷", "🤒", "🤧", "😇", "🥳", "🥺"],
  },
  {
    id: "people",
    label: "People",
    emojis: ["👋", "🤚", "✋", "👌", "✌️", "🤞", "🤟", "🤘", "🤙", "👈", "👉", "👆", "👇", "👍", "👎", "✊", "👊", "👏", "🙌", "👐", "🤲", "🤝", "🙏", "💪", "👀", "👶", "🧒", "👦", "👧", "👨", "👩", "🧓", "👴", "👵"],
  },
  {
    id: "symbols",
    label: "Symbols",
    emojis: ["❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "💔", "❣️", "💕", "💞", "💓", "💗", "💖", "💘", "💝", "🔥", "✨", "⭐", "🌟", "✅", "❌", "💯", "🎉", "🙏", "💐", "🌸", "🌺"],
  },
];

const ATTACH_OPTIONS = [
  { id: "document", label: "Document", icon: FileText, color: "bg-[#7f66ff]" },
  { id: "camera", label: "Camera", icon: Camera, color: "bg-[#ff2e74]" },
  { id: "gallery", label: "Gallery", icon: ImageIcon, color: "bg-[#007bfc]" },
  { id: "audio", label: "Audio", icon: Headphones, color: "bg-[#ff8a3d]" },
];

function formatTime(date) {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatDuration(totalSeconds) {
  const seconds = Math.max(0, Math.round(totalSeconds || 0));
  const minutes = Math.floor(seconds / 60);
  const remain = seconds % 60;
  return `${minutes}:${String(remain).padStart(2, "0")}`;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function highlightText(text, query) {
  const value = text || "";
  const needle = query.trim();
  if (!needle) return value;
  const pattern = new RegExp(`(${escapeRegExp(needle)})`, "ig");
  return value.split(pattern).map((part, index) => (
    part.toLowerCase() === needle.toLowerCase() ? (
      <mark key={`${part}-${index}`} className="rounded-sm bg-[#ffe08a] text-inherit">{part}</mark>
    ) : (
      <span key={`${part}-${index}`}>{part}</span>
    )
  ));
}

function searchableText(message) {
  if (message.kind === "image") return `Photo ${message.name || ""} ${message.text || ""}`;
  if (message.kind === "location") return `Location ${message.latitude} ${message.longitude}`;
  if (message.kind === "audio") return `Voice message ${message.name || ""}`;
  if (message.kind === "file") return message.name || "";
  return message.text || "";
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function readAudioDuration(url) {
  return new Promise((resolve) => {
    const audio = document.createElement("audio");
    audio.preload = "metadata";
    audio.src = url;
    audio.onloadedmetadata = () => {
      resolve(Number.isFinite(audio.duration) ? audio.duration : 0);
    };
    audio.onerror = () => resolve(0);
  });
}

function MetaTick({ className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 40 40" className={`${className} shrink-0 overflow-visible`} aria-label="Verified">
      <path
        fill="#0095F6"
        d="M19.998 3.094 14.638 0l-2.972 5.15H5.432v6.354L0 14.64 3.094 20 0 25.359l5.432 3.137v5.905h5.975L14.638 40l5.36-3.094L25.359 40l3.137-5.433h6.078v-6.06L40 25.364l-3.094-5.363L40 14.64l-5.426-3.135V5.15h-6.08L25.359 0l-5.361 3.094z"
      />
      <path fill="#fff" d="M16.3 26.4 11.2 21.3l2.1-2.1 3 3 8.4-8.4 2.1 2.1z" />
    </svg>
  );
}

function ReadTicks() {
  return (
    <svg viewBox="0 0 16 15" className="mb-px h-[13px] w-[16px] shrink-0 overflow-visible" aria-hidden="true">
      <path
        fill="#53bdeb"
        d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.879a.32.32 0 0 1-.484.033l-.358-.325a.319.319 0 0 0-.484.032l-.378.483a.418.418 0 0 0 .036.541l1.32 1.266c.143.14.361.125.484-.033l6.272-8.048a.366.366 0 0 0-.064-.512zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.879a.32.32 0 0 1-.484.033L1.891 7.769a.366.366 0 0 0-.515.006l-.423.433a.364.364 0 0 0 .006.514l3.258 3.185c.143.14.361.125.484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z"
      />
    </svg>
  );
}

function BubbleTail({ side }) {
  const isUser = side === "user";

  return (
    <svg viewBox="0 0 8 13" className={`h-3 w-2 shrink-0 ${isUser ? "text-[#d9fdd3]" : "text-white"}`} aria-hidden="true">
      <path d={isUser ? "M0 0 L8 0 L0 13 Z" : "M8 0 L0 0 L8 13 Z"} fill="currentColor" />
    </svg>
  );
}

function TimeMark({ time, isUser }) {
  return (
    <span className="mb-px flex shrink-0 items-end gap-1 pr-0.5 text-[11px] leading-none text-[#667781]">
      {time}
      {isUser && <ReadTicks />}
    </span>
  );
}

function buildWaveform(seed) {
  let state = 17;
  for (const char of String(seed)) state = (state + char.charCodeAt(0) * 19) % 997;
  return Array.from({ length: 32 }, (_, index) => {
    state = (state * 37 + index * 13) % 997;
    const wave = Math.abs(Math.sin((index + state) / 2.7));
    return 4 + Math.round(wave * 18);
  });
}

function VoiceGlyph({ playing }) {
  if (playing) {
    return (
      <svg viewBox="0 0 16 16" className="h-4 w-4" aria-hidden="true">
        <path d="M3.6 3h2.7v10H3.6V3Zm6.1 0h2.7v10H9.7V3Z" fill="#008069" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 16 16" className="ml-0.5 h-4 w-4" aria-hidden="true">
      <path d="M4.2 2.6v10.8c0 .7.8 1.1 1.3.7l7.4-5.4c.5-.4.5-1.1 0-1.4L5.5 1.9c-.5-.4-1.3 0-1.3.7Z" fill="#008069" />
    </svg>
  );
}

function VoiceNote({ url, duration, time, isUser, seed }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [current, setCurrent] = useState(0);
  const [knownDuration, setKnownDuration] = useState(duration || 0);
  const bars = useMemo(() => buildWaveform(seed), [seed]);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
      return;
    }
    audio.play();
    setPlaying(true);
  };

  const seek = (event) => {
    const audio = audioRef.current;
    const total = audio?.duration || knownDuration;
    if (!audio || !total) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
    audio.currentTime = ratio * total;
    setProgress(ratio);
    setCurrent(ratio * total);
  };

  const shownTime = playing || current > 0.2 ? current : knownDuration;

  return (
    <div className="flex w-[244px] items-center gap-2">
      <button
        type="button"
        onClick={toggle}
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white"
        aria-label={playing ? "Pause voice message" : "Play voice message"}
      >
        <VoiceGlyph playing={playing} />
      </button>
      <div className="min-w-0 flex-1">
        <button
          type="button"
          onClick={seek}
          className="flex h-7 w-full items-center gap-[2px]"
          aria-label="Voice message progress"
        >
          {bars.map((height, index) => {
            const played = (index + 0.5) / bars.length <= progress;
            return (
              <span
                key={`${seed}-${index}`}
                className="w-[3px] rounded-full"
                style={{ height, backgroundColor: played ? "#02735e" : "#93b3a4" }}
              />
            );
          })}
        </button>
        <div className="mt-1 flex items-end justify-between">
          <span className="text-[11px] leading-none text-[#667781]">{formatDuration(shownTime)}</span>
          <TimeMark time={time} isUser={isUser} />
        </div>
      </div>
      <audio
        ref={audioRef}
        src={url}
        preload="metadata"
        onLoadedMetadata={(event) => {
          if (Number.isFinite(event.target.duration)) setKnownDuration(event.target.duration);
        }}
        onTimeUpdate={(event) => {
          const total = event.target.duration || knownDuration;
          setCurrent(event.target.currentTime || 0);
          setProgress(total ? event.target.currentTime / total : 0);
        }}
        onEnded={() => {
          setPlaying(false);
          setProgress(0);
          setCurrent(0);
          if (audioRef.current) audioRef.current.currentTime = 0;
        }}
      />
    </div>
  );
}

function MessageBody({ message, highlight }) {
  if (message.kind === "location") {
    return (
      <a href={message.url} target="_blank" rel="noreferrer" className="block py-1 text-[15px] leading-snug text-slate-900">
        <span className="block font-medium">Exact location</span>
        <span className="block text-[13px] text-[#667781]">
          {message.latitude}, {message.longitude}
        </span>
        <span className="mt-1 block text-[14px] font-medium text-[#008069]">Open in Maps</span>
      </a>
    );
  }

  if (message.kind === "image") {
    return (
      <div>
        <img src={message.url} alt={message.name || "Photo"} className="max-h-64 w-full rounded-md object-cover" />
        {message.text ? <p className="px-1 pt-1 text-[15px] leading-snug text-slate-900">{message.text}</p> : null}
      </div>
    );
  }

  if (message.kind === "file") {
    return (
      <a href={message.url} download={message.name} className="flex items-center gap-2 py-1">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white">
          <FileText className="h-5 w-5 text-[#7f66ff]" />
        </span>
        <span className="min-w-0">
          <span className="block max-w-[160px] truncate text-[14px] text-slate-900">{highlightText(message.name, highlight)}</span>
          <span className="text-[11px] text-[#667781]">{formatBytes(message.size || 0)}</span>
        </span>
      </a>
    );
  }

  if (message.kind === "audio") {
    return (
      <VoiceNote
        url={message.url}
        duration={message.duration}
        time={message.time}
        isUser={message.from === "user"}
        seed={message.id}
      />
    );
  }

  const lines = (message.text || "").split("\n");
  const lastIndex = lines.length - 1;

  return lines.map((line, index) => {
    const isLast = index === lastIndex;
    return (
      <div key={`${message.id}-${index}`} className="flex items-end justify-end gap-2">
        <p className="mr-auto text-[15px] leading-snug text-slate-900">{highlightText(line, highlight)}</p>
        {isLast && <TimeMark time={message.time} isUser={message.from === "user"} />}
      </div>
    );
  });
}

function SosHold({ onSent }) {
  const [holding, setHolding] = useState(false);
  const [sent, setSent] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const start = (event) => {
    event.preventDefault();
    if (sent) return;
    clearTimeout(timerRef.current);
    setHolding(true);
    timerRef.current = setTimeout(() => {
      setSent(true);
      setHolding(false);
      onSent();
    }, 3000);
  };

  const stop = () => {
    if (sent) return;
    clearTimeout(timerRef.current);
    setHolding(false);
  };

  return (
    <button
      type="button"
      onPointerDown={start}
      onPointerUp={stop}
      onPointerLeave={stop}
      onPointerCancel={stop}
      className={`-mx-3 mt-1.5 block w-[calc(100%+1.5rem)] border-t border-black/10 px-3 py-2 text-center text-[14px] font-medium ${
        sent ? "text-emerald-600" : "text-red-600"
      }`}
    >
      {sent ? "SOS sent" : holding ? "Hold..." : "Hold for SOS"}
    </button>
  );
}

function pickFamilyMatch(seed) {
  const value = String(seed).split("").reduce((total, char, index) => total + char.charCodeAt(0) * (index + 1), 0);
  return familyUsers[value % familyUsers.length];
}

function MessageBubble({ message, highlight = "", onAction }) {
  if (message.kind === "note") {
    return (
      <p className="mx-auto w-fit max-w-[90%] rounded-lg bg-white/80 px-3 py-1 text-center text-[12.5px] text-[#667781] shadow-sm">
        {message.text}
      </p>
    );
  }
  if (message.kind === "system") {
    return (
      <p className="mx-4 rounded-lg bg-[#fff4cc] px-3 py-2 text-center text-[12.5px] leading-snug text-[#54656f] shadow-sm">
        {highlightText(message.text, highlight)}
      </p>
    );
  }

  const isUser = message.from === "user";
  const isText = !message.kind || message.kind === "text";

  return (
    <div className={`flex px-1 ${isUser ? "justify-end" : "justify-start"}`}>
      <div className="flex max-w-[82%] items-start">
        {!isUser && <BubbleTail side="assistant" />}
        <div
          className={`min-w-0 shadow-sm ${
            isUser ? "-mr-px rounded-lg rounded-tr-none bg-[#d9fdd3]" : "-ml-px rounded-lg rounded-tl-none bg-white"
          } ${
            message.kind === "image" ? "p-1" : message.kind === "audio" ? "py-2 pl-1.5 pr-2" : "px-3 pb-1.5 pt-1.5"
          }`}
        >
          <MessageBody message={message} highlight={highlight} />
          {!isText && message.kind !== "audio" && (
            <div className="flex justify-end px-1 pt-0.5">
              <TimeMark time={message.time} isUser={isUser} />
            </div>
          )}
          {message.hold && <SosHold onSent={() => onAction("sos")} />}
          {message.buttons?.map((button) => {
            const rowClass = `-mx-3 mt-1.5 flex w-[calc(100%+1.5rem)] items-center justify-center gap-2 border-t border-black/10 px-3 py-2 text-[15px] font-medium ${
              button.id === "no" ? "text-red-600" : "text-[#008069]"
            }`;
            const arrow = (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" className="h-4 w-4 shrink-0" fill="currentColor" aria-hidden="true">
                <path d="M6.598 5.013a.144.144 0 0 1 .202.134V6.3a.5.5 0 0 0 .5.5c.667 0 2.013.005 3.3.822.984.624 1.99 1.76 2.595 3.876-1.02-.983-2.185-1.516-3.205-1.799a8.7 8.7 0 0 0-1.921-.306 7 7 0 0 0-.798.008h-.013l-.005.001h-.001L7.3 9.9l-.05-.498a.5.5 0 0 0-.45.498v1.153c0 .108-.11.176-.202.134L2.614 8.254l-.042-.028a.147.147 0 0 1 0-.252l.042-.028zM7.8 10.386q.103 0 .223.006c.434.02 1.034.086 1.7.271 1.326.368 2.896 1.202 3.94 3.08a.5.5 0 0 0 .933-.305c-.464-3.71-1.886-5.662-3.46-6.66-1.245-.79-2.527-.942-3.336-.971v-.66a1.144 1.144 0 0 0-1.767-.96l-3.994 2.94a1.147 1.147 0 0 0 0 1.946l3.994 2.94a1.144 1.144 0 0 0 1.767-.96z" />
              </svg>
            );
            return button.phone ? (
              <a key={button.id} href={`tel:${button.phone}`} className={rowClass}>
                {arrow}
                <span>{button.label}</span>
              </a>
            ) : (
              <button key={button.id} type="button" onClick={() => onAction(button.id)} className={rowClass}>
                {arrow}
                <span>{button.label}</span>
              </button>
            );
          })}
        </div>
        {isUser && <BubbleTail side="user" />}
      </div>
    </div>
  );
}

function EncryptionNotice() {
  return (
    <p className="mx-auto mb-1 max-w-[92%] shrink-0 rounded-lg bg-[#fff4cc] px-3 py-1.5 text-center text-[12.5px] leading-snug text-[#54656f] shadow-[0_1px_0.5px_rgba(11,20,26,0.13)]">
      <Lock className="mr-1 inline h-3 w-3 align-[-2px]" aria-hidden="true" />
      Messages and calls are end-to-end encrypted. Only people in this chat can read, listen to, or share them. Learn more.
    </p>
  );
}

function OpeningSeal() {
  return (
    <div className="flex shrink-0 justify-center py-1" aria-label="Andhra Pradesh Government">
      <span className="wa-gov-seal inline-flex">
        <img src={apLogo} alt="" className="h-24 w-24 object-contain" />
      </span>
    </div>
  );
}

function TypingBubble() {
  return (
    <div className="flex shrink-0 justify-start px-1" aria-label="typing">
      <div className="flex items-start">
        <BubbleTail side="assistant" />
        <div className="-ml-px flex h-8 items-center gap-1 rounded-lg rounded-tl-none bg-white px-3 shadow-sm">
          <span className="wa-typing-dot" />
          <span className="wa-typing-dot" />
          <span className="wa-typing-dot" />
        </div>
      </div>
    </div>
  );
}

function EmojiPanel({ onPick }) {
  const [groupId, setGroupId] = useState(EMOJI_GROUPS[0].id);
  const group = EMOJI_GROUPS.find((item) => item.id === groupId) || EMOJI_GROUPS[0];

  return (
    <div className="border-t border-black/5 bg-[#f0f2f5] px-2 pt-2">
      <div className="mb-1 flex gap-1">
        {EMOJI_GROUPS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setGroupId(item.id)}
            className={`rounded-full px-3 py-1 text-[12px] ${
              item.id === group.id ? "bg-white text-[#008069] shadow-sm" : "text-slate-500"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="grid max-h-40 grid-cols-8 gap-1 overflow-y-auto pb-2">
        {group.emojis.map((emoji) => (
          <button
            key={emoji}
            type="button"
            onClick={() => onPick(emoji)}
            className="flex h-9 items-center justify-center rounded-md text-[22px] hover:bg-white"
            aria-label={emoji}
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
}

function AttachMenu({ onPick }) {
  return (
    <div className="absolute bottom-full right-3 z-20 mb-2 w-44 overflow-hidden rounded-xl bg-white py-1 shadow-xl">
      {ATTACH_OPTIONS.map((option) => {
        const Icon = option.icon;
        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onPick(option.id)}
            className="flex w-full items-center gap-3 px-3 py-2 text-left text-[14px] text-slate-800 hover:bg-slate-50"
          >
            <span className={`flex h-8 w-8 items-center justify-center rounded-full text-white ${option.color}`}>
              <Icon className="h-4 w-4" />
            </span>
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

function CameraSheet({ stream, onClose, onSend }) {
  const videoRef = useRef(null);
  const [shotUrl, setShotUrl] = useState("");

  useEffect(() => {
    const video = videoRef.current;
    if (!video || shotUrl) return undefined;
    video.srcObject = stream;
    video.play().catch(() => {});
    return undefined;
  }, [stream, shotUrl]);

  useEffect(() => {
    if (!shotUrl) return undefined;
    return () => URL.revokeObjectURL(shotUrl);
  }, [shotUrl]);

  const shoot = () => {
    const video = videoRef.current;
    if (!video) return;
    const width = video.videoWidth || 720;
    const height = video.videoHeight || 1280;
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    context.fillStyle = "#111";
    context.fillRect(0, 0, width, height);
    if (video.readyState >= 2 && video.videoWidth > 0) {
      context.drawImage(video, 0, 0, width, height);
    }
    canvas.toBlob((blob) => {
      if (!blob) return;
      setShotUrl(URL.createObjectURL(blob));
    }, "image/jpeg", 0.92);
  };

  const sendShot = async () => {
    const response = await fetch(shotUrl);
    const blob = await response.blob();
    onSend(blob);
  };

  return (
    <div className="absolute inset-0 z-30 flex flex-col bg-black">
      <div className="flex items-center justify-between px-2 py-2 text-white">
        <button type="button" onClick={onClose} className="flex h-10 w-10 items-center justify-center" aria-label="Close camera">
          <X className="h-6 w-6" />
        </button>
        <span className="text-sm">Camera</span>
        <span className="w-10" />
      </div>
      <div className="relative min-h-0 flex-1">
        {shotUrl ? (
          <img src={shotUrl} alt="Captured" className="h-full w-full object-contain" />
        ) : (
          <video ref={videoRef} className="h-full w-full object-cover" autoPlay playsInline muted />
        )}
      </div>
      <div className="flex items-center justify-center gap-8 px-4 py-5">
        {shotUrl ? (
          <>
            <button type="button" onClick={() => setShotUrl("")} className="text-sm text-white">
              Retake
            </button>
            <button
              type="button"
              onClick={sendShot}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-[#008069] text-white"
              aria-label="Send photo"
            >
              <Send className="h-5 w-5" />
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={shoot}
            className="h-16 w-16 rounded-full border-4 border-white bg-white/30"
            aria-label="Take photo"
          />
        )}
      </div>
    </div>
  );
}

function WhatsAppChatPage({ onBack, onNavigate }) {
  const [view, setView] = useState("chat");
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(true);
  const [draft, setDraft] = useState("");
  const [notificationsOn, setNotificationsOn] = useState(true);
  const [mediaVisible, setMediaVisible] = useState(true);
  const [disappearing, setDisappearing] = useState("off");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [matchIndex, setMatchIndex] = useState(0);
  const [missingReport, setMissingReport] = useState(null);
  const matchRef = useRef(null);
  const [emergencyCase, setEmergencyCase] = useState(null);
  const [lang, setLang] = useState("en");
  const langRef = useRef("en");
  langRef.current = lang;
  const [panel, setPanel] = useState(null);
  const [notice, setNotice] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [cameraStream, setCameraStream] = useState(null);
  const endRef = useRef(null);
  const wallRef = useRef(null);
  const inputRef = useRef(null);
  const urlsRef = useRef([]);
  const galleryRef = useRef(null);
  const documentRef = useRef(null);
  const audioFileRef = useRef(null);
  const cameraFileRef = useRef(null);
  const recorderRef = useRef(null);
  const streamRef = useRef(null);
  const cameraStreamRef = useRef(null);
  const recordActionRef = useRef("cancel");
  const replyTimerRef = useRef(null);
  const searchTimerRef = useRef(null);
  const recordSecondsRef = useRef(0);
  const canSend = draft.trim().length > 0;
  const searchMatches = useMemo(() => {
    const needle = searchQuery.trim().toLowerCase();
    if (!needle) return [];
    return messages.filter((message) => searchableText(message).toLowerCase().includes(needle));
  }, [messages, searchQuery]);

  const pushMessage = (fields) => {
    setMessages((current) => [
      ...current,
      {
        id: `m-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        from: "user",
        text: "",
        time: formatTime(new Date()),
        kind: "text",
        ...fields,
      },
    ]);
  };

  const rememberUrl = (url) => {
    urlsRef.current.push(url);
    return url;
  };

  const showNotice = (text) => {
    setNotice(text);
  };

  const queueReplies = (guides) => {
    const pending = guides.filter((guide) => guide.reply);
    if (!pending.length) return;
    clearTimeout(replyTimerRef.current);
    let index = 0;
    const step = () => {
      setIsTyping(true);
      replyTimerRef.current = setTimeout(() => {
        const guide = pending[index];
        setMessages((current) => [
          ...current,
          {
            id: `a-${Date.now()}-${index}`,
            from: "assistant",
            kind: "text",
            text: guide.reply,
            time: formatTime(new Date()),
            hold: Boolean(guide.hold),
            buttons: guide.buttons || null,
          },
        ]);
        index += 1;
        if (index < pending.length) {
          step();
          return;
        }
        setIsTyping(false);
      }, REPLY_PAUSE_MS);
    };
    step();
  };

  const L = (en, te) => (langRef.current === "te" ? te : en);

  const pack = (guide) => ({
    reply: guide.reply?.[langRef.current] || guide.reply?.en || guide.reply,
    hold: guide.hold,
    buttons: (guide.buttons || []).map((button) => ({
      ...button,
      label: langRef.current === "te" && button.labelTe ? button.labelTe : button.label,
    })),
  });

  const say = (text) => {
    queueReplies([{ reply: text }]);
  };

  const chooseServiceButton = () => ({
    id: "choose-service",
    label: L("Choose Service", "సేవను ఎంచుకోండి"),
  });

  const serviceBusy = () => (
    (missingReport && missingReport.waiting !== "done")
    || (emergencyCase && emergencyCase.waiting !== "done")
  );

  const replyWith = (guide) => {
    if (guide.collect === "missing") {
      setMissingReport({ photo: false, waiting: "photo" });
    }
    if (guide.id === "emergency") {
      setEmergencyCase({ waiting: "type" });
    }
    queueReplies([pack(guide)]);
  };

  const showAdminCall = (again) => {
    const person = matchRef.current || {
      name: ADMIN.name,
      nameTe: ADMIN.nameTe,
      relation: ADMIN.relation,
      relationTe: ADMIN.relationTe,
    };
    setMissingReport((current) => ({ ...(current || {}), photo: true, waiting: "location", match: person }));
    const te = langRef.current === "te";
    const details = te
      ? `పేరు: ${person.nameTe}\nసంబంధం: ${person.relationTe}\n${ADMIN.phone}`
      : `Name: ${person.name}\nRelation: ${person.relation}\n${ADMIN.phone}`;
    queueReplies([
      {
        reply: again
          ? L(`Please call the admin again.\n${details}`, `దయచేసి అడ్మిన్‌కు మళ్లీ కాల్ చేయండి.\n${details}`)
          : `${te ? ADMIN.titleTe : ADMIN.title}\n${details}`,
        buttons: [{ id: "call", label: L("Call", "కాల్"), phone: ADMIN.phone }],
      },
      {
        reply: L(
          "Please share your location so the admin can reach you.",
          "అడ్మిన్ మీ దగ్గరికి రావడానికి మీ స్థానం పంపండి."
        ),
        buttons: [{ id: "location", label: L("Send location", "స్థానం పంపండి") }],
      },
    ]);
  };

  const completeMissing = () => {
    finishHelp();
  };

  const finishHelp = () => {
    setMissingReport((current) => (current ? { ...current, waiting: "done" } : current));
    setEmergencyCase((current) => (current ? { ...current, waiting: "done" } : current));
    queueReplies([
      { reply: L("Thank you. This service is complete.", "ధన్యవాదాలు. ఈ సేవ పూర్తయింది.") },
      {
        reply: L("Please choose a service.", "దయచేసి ఒక సేవను ఎంచుకోండి."),
        buttons: [chooseServiceButton()],
      },
    ]);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setMessages((current) => {
        if (current.some((message) => message.id === "opening")) return current;
        return [
          ...current,
          {
            id: "opening",
            from: "assistant",
            text: OPENING_TEXT,
            time: formatTime(new Date()),
            buttons: [{ id: "choose-service", label: "Choose Service" }],
          },
        ];
      });
      setIsTyping(false);
    }, TYPING_DELAY_MS);

    return () => {
      clearTimeout(timer);
      clearTimeout(replyTimerRef.current);
      clearTimeout(searchTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (searchOpen) return;
    const hasConversation = messages.some((message) => message.id !== "opening");
    if (!hasConversation) {
      if (wallRef.current) wallRef.current.scrollTop = 0;
      return;
    }
    endRef.current?.scrollIntoView({ block: "end" });
  }, [messages, isTyping, view, searchOpen]);

  useEffect(() => {
    setMatchIndex(0);
  }, [searchQuery]);

  useEffect(() => {
    const match = searchMatches[matchIndex];
    if (!match) return;
    document.getElementById(`msg-${match.id}`)?.scrollIntoView({ block: "center" });
  }, [matchIndex, searchMatches]);

  useEffect(() => {
    if (!notice) return undefined;
    const timer = setTimeout(() => setNotice(""), 3200);
    return () => clearTimeout(timer);
  }, [notice]);

  useEffect(() => {
    if (!isRecording) return undefined;
    const timer = setInterval(() => {
      recordSecondsRef.current += 1;
      setRecordSeconds(recordSecondsRef.current);
    }, 1000);
    return () => clearInterval(timer);
  }, [isRecording]);

  useEffect(() => {
    cameraStreamRef.current = cameraStream;
  }, [cameraStream]);

  useEffect(() => () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    cameraStreamRef.current?.getTracks().forEach((track) => track.stop());
    urlsRef.current.forEach((url) => URL.revokeObjectURL(url));
  }, []);

  useEffect(() => {
    if (view === "chat") return;
    cameraStreamRef.current?.getTracks().forEach((track) => track.stop());
    if (cameraStreamRef.current) setCameraStream(null);
    if (recorderRef.current && recorderRef.current.state !== "inactive") {
      recordActionRef.current = "cancel";
      recorderRef.current.stop();
    }
  }, [view]);

  const closeCamera = () => {
    cameraStream?.getTracks().forEach((track) => track.stop());
    setCameraStream(null);
  };

  const handleSend = (event) => {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;
    pushMessage({ kind: "text", text });
    setDraft("");
    setPanel(null);
    const code = text.toUpperCase();
    if (code === "TE" || code === "EN") {
      const next = code === "TE" ? "te" : "en";
      langRef.current = next;
      setLang(next);
      queueReplies([{
        reply: next === "te"
          ? "తెలుగు ఎంపిక చేయబడింది. తర్వాతి సందేశాలు తెలుగులో ఉంటాయి."
          : "English selected. Further messages will be in English.",
        buttons: serviceBusy() ? null : [chooseServiceButton()],
      }]);
      return;
    }
    if (!serviceBusy() && /^(hi|hello|hey|హాయ్|నమస్తే)$/i.test(text)) {
      queueReplies([{
        reply: L(
          "Welcome to the Government of Andhra Pradesh citizen assistance service for Pushkaralu 2027.",
          "పుష్కరాలు 2027 కోసం ఆంధ్రప్రదేశ్ ప్రభుత్వ పౌర సేవకు స్వాగతం."
        ),
        buttons: [chooseServiceButton()],
      }]);
      return;
    }
    if (emergencyCase && emergencyCase.waiting !== "done") {
      if (emergencyCase.waiting === "type") {
        say(L("Please select Medical, Accident, or Police.", "దయచేసి వైద్యం, ప్రమాదం లేదా పోలీసు ఎంచుకోండి."));
        return;
      }
      if (emergencyCase.waiting === "location") {
        say(L("Please send your location with the button above.", "పైన ఉన్న బటన్‌తో మీ స్థానం పంపండి."));
        return;
      }
      say(L("Please tap Yes if the team reached you, or No to call them.", "బృందం వస్తే అవును, లేకపోతే కాదు నొక్కండి."));
      return;
    }
    if (missingReport && missingReport.waiting !== "done") {
      if (missingReport.waiting === "photo") {
        say(L("Please open the camera and send your photo.", "దయచేసి కెమెరా తెరిచి మీ ఫోటో పంపండి."));
      } else if (missingReport.waiting === "search") {
        say(L("Government records are still being searched.", "ప్రభుత్వ రికార్డులు ఇంకా వెతకబడుతున్నాయి."));
      } else if (missingReport.waiting === "location") {
        say(L("Please call the admin, then send your location.", "దయచేసి అడ్మిన్‌కు కాల్ చేసి మీ స్థానం పంపండి."));
      } else {
        say(L("Please tap Yes if the admin reached you, or No to call again.", "అడ్మిన్ వచ్చి ఉంటే అవును, లేకపోతే కాదు నొక్కండి."));
      }
      return;
    }
    const guide = matchGuide(text);
    replyWith(guide || FALLBACK_GUIDE);
  };

  const insertEmoji = (emoji) => {
    const input = inputRef.current;
    const start = input?.selectionStart ?? draft.length;
    const end = input?.selectionEnd ?? draft.length;
    const next = `${draft.slice(0, start)}${emoji}${draft.slice(end)}`;
    setDraft(next);
    const caret = start + emoji.length;
    requestAnimationFrame(() => {
      input?.focus();
      input?.setSelectionRange(caret, caret);
    });
  };

  const sendImageFile = (file) => {
    if (!file || !file.type.startsWith("image/")) {
      showNotice("Choose a photo to send.");
      return;
    }
    pushMessage({
      kind: "image",
      url: rememberUrl(URL.createObjectURL(file)),
      name: file.name || "Photo",
    });
    if (missingReport?.waiting !== "photo") return;
    const match = pickFamilyMatch(`${file.name}-${file.size}`);
    matchRef.current = match;
    setMissingReport({ photo: true, waiting: "search", match });
    const noteId = `search-${Date.now()}`;
    pushMessage({
      id: noteId,
      from: "system",
      kind: "note",
      text: L("Searching…", "వెతుకుతున్నాం…"),
    });
    clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => {
      setMessages((current) =>
        current.map((message) =>
          message.id === noteId ? { ...message, text: L("Match found", "మ్యాచ్ దొరికింది") } : message
        )
      );
      searchTimerRef.current = setTimeout(() => showAdminCall(false), REPLY_PAUSE_MS);
    }, 1200);
  };

  const sendDocument = (file) => {
    if (!file) return;
    pushMessage({
      kind: "file",
      url: rememberUrl(URL.createObjectURL(file)),
      name: file.name,
      size: file.size,
    });
  };

  const sendAudioFile = async (file) => {
    if (!file) return;
    const url = rememberUrl(URL.createObjectURL(file));
    const duration = await readAudioDuration(url);
    pushMessage({
      kind: "audio",
      url,
      name: file.name,
      duration,
    });
  };

  const onFileChosen = (event, sender) => {
    const files = [...event.target.files];
    event.target.value = "";
    files.forEach((file) => sender(file));
  };

  const openCamera = async (facingMode = "environment") => {
    setPanel(null);
    if (!navigator.mediaDevices?.getUserMedia) {
      cameraFileRef.current?.click();
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode },
        audio: false,
      });
      setCameraStream(stream);
    } catch {
      showNotice("Camera is blocked. Choose a photo instead.");
      cameraFileRef.current?.click();
    }
  };

  const sendLocation = () => {
    if (!navigator.geolocation) {
      showNotice("Location is not available on this phone.");
      return;
    }
    showNotice("Getting your location...");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude.toFixed(5);
        const longitude = position.coords.longitude.toFixed(5);
        pushMessage({
          kind: "location",
          latitude,
          longitude,
          url: `https://maps.google.com/?q=${latitude},${longitude}`,
          text: "Exact location",
        });
        setNotice("");
        const type = EMERGENCY_TYPES.find((item) => item.id === emergencyCase?.typeId);
        const yesNo = [
          { id: "yes", label: L("Yes", "అవును") },
          { id: "no", label: L("No", "కాదు") },
        ];
        if (emergencyCase?.waiting === "location" && type) {
          setEmergencyCase((current) => ({ ...current, waiting: "reached" }));
          const team = L(type.team, type.teamTe);
          queueReplies([
            {
              reply: L(
                `${team} is on the way.\nWill the team reach you?`,
                `${team} దారిలో ఉంది.\nబృందం మీ దగ్గరికి వస్తుందా?`
              ),
              buttons: yesNo,
            },
          ]);
          return;
        }
        setMissingReport((current) => ({ ...(current || {}), waiting: "reached" }));
        queueReplies([
          {
            reply: L(
              "The admin has your location and is on the way.\nHas the admin reached you?",
              "అడ్మిన్ మీ స్థానం అందుకున్నారు. దారిలో ఉన్నారు.\nఅడ్మిన్ మీ దగ్గరికి వచ్చారా?"
            ),
            buttons: yesNo,
          },
        ]);
      },
      () => showNotice(L("Allow location so the admin can reach you.", "అడ్మిన్ మీ దగ్గరికి రావడానికి లొకేషన్ అనుమతించండి.")),
      { enableHighAccuracy: true, timeout: 12000 }
    );
  };

  const handleBubbleAction = (action) => {
    if (action === "choose-service") {
      if (serviceBusy()) {
        say(L("Please complete the current service first.", "దయచేసి ప్రస్తుత సేవను ముందు పూర్తి చేయండి."));
        return;
      }
      queueReplies([{
        reply: L("Please select one service.", "ఒక సేవను ఎంచుకోండి."),
        buttons: [
          { id: "service-missing", label: L("Missing person", "మిస్సింగ్ వ్యక్తి") },
          { id: "service-emergency", label: L("Emergency", "అత్యవసరం") },
        ],
      }]);
      return;
    }
    if (action === "service-missing" || action === "service-emergency") {
      if (serviceBusy()) {
        say(L("Please complete the current service first.", "దయచేసి ప్రస్తుత సేవను ముందు పూర్తి చేయండి."));
        return;
      }
      const guide = GUIDES.find((item) => item.id === (action === "service-missing" ? "missing" : "emergency"));
      pushMessage({ kind: "text", text: L(guide.chip, guide.chipTe) });
      replyWith(guide);
      return;
    }
    if (action === "search-done") return;
    if (action.startsWith("type-")) {
      const type = EMERGENCY_TYPES.find((item) => item.id === action.slice(5));
      if (!type) return;
      setEmergencyCase({ waiting: "location", typeId: type.id });
      pushMessage({ kind: "text", text: L(type.label, type.labelTe) });
      const team = L(type.team, type.teamTe);
      queueReplies([
        {
          reply: L(
            `Please share your location so the ${team} can be sent.`,
            `${team} రావడానికి మీ స్థానం పంపండి.`
          ),
          buttons: [{ id: "location", label: L("Send location", "స్థానం పంపండి") }],
        },
      ]);
      return;
    }
    if (action === "camera") {
      openCamera("user");
      return;
    }
    if (action === "location") {
      sendLocation();
      return;
    }
    if (action === "yes") {
      if (emergencyCase?.waiting === "reached" || missingReport?.waiting === "reached") finishHelp();
      return;
    }
    if (action === "no") {
      if (emergencyCase?.waiting === "reached") {
        const type = EMERGENCY_TYPES.find((item) => item.id === emergencyCase.typeId);
        const team = L(type.team, type.teamTe);
        queueReplies([
          {
            reply: L(
              `Please call the ${team}.\n${type.phone}`,
              `${team} వారికి కాల్ చేయండి.\n${type.phone}`
            ),
            buttons: [{ id: "call", label: L("Call", "కాల్"), phone: type.phone }],
          },
        ]);
        return;
      }
      if (missingReport?.waiting !== "reached") return;
      showAdminCall(true);
    }
  };

  const handleAttach = (id) => {
    setPanel(null);
    if (id === "document") documentRef.current?.click();
    if (id === "gallery") galleryRef.current?.click();
    if (id === "audio") audioFileRef.current?.click();
    if (id === "camera") openCamera();
  };

  const stopRecorder = (action) => {
    recordActionRef.current = action;
    const recorder = recorderRef.current;
    if (recorder && recorder.state !== "inactive") {
      recorder.stop();
      return;
    }
    streamRef.current?.getTracks().forEach((track) => track.stop());
    setIsRecording(false);
  };

  const startRecording = async () => {
    if (isRecording || canSend) return;
    setPanel(null);
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      showNotice("Voice messages are not available in this browser.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const recorder = new MediaRecorder(stream);
      const chunks = [];
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunks.push(event.data);
      };
      recorder.onstop = () => {
        stream.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
        setIsRecording(false);
        if (recordActionRef.current !== "send" || chunks.length === 0) return;
        const blob = new Blob(chunks, { type: recorder.mimeType || "audio/webm" });
        pushMessage({
          kind: "audio",
          url: rememberUrl(URL.createObjectURL(blob)),
          name: "Voice message",
          duration: recordSecondsRef.current,
        });
        replyWith(VOICE_GUIDE);
      };
      recorderRef.current = recorder;
      recordActionRef.current = "cancel";
      recordSecondsRef.current = 0;
      setRecordSeconds(0);
      setIsRecording(true);
      recorder.start();
    } catch {
      showNotice("Allow the microphone to send a voice message.");
    }
  };

  const sendCameraPhoto = (blob) => {
    const file = new File([blob], `photo-${Date.now()}.jpg`, { type: "image/jpeg" });
    sendImageFile(file);
    closeCamera();
  };

  const stepMatch = (direction) => {
    if (!searchMatches.length) return;
    setMatchIndex((current) => (current + direction + searchMatches.length) % searchMatches.length);
  };

  const changeDisappearing = (option) => {
    setDisappearing(option.id);
    pushMessage({ kind: "system", from: "system", text: option.notice });
  };

  if (view === "profile") {
    return (
      <WhatsAppProfile
        onBack={() => setView("chat")}
        notificationsOn={notificationsOn}
        onToggleNotifications={() => setNotificationsOn((current) => !current)}
        messages={messages}
        onSearch={() => {
          setSearchQuery("");
          setSearchOpen(true);
          setView("chat");
        }}
        onClearChat={() => {
          setMessages([]);
          setIsTyping(false);
          setSearchQuery("");
        }}
        disappearing={disappearing}
        onDisappearingChange={changeDisappearing}
        mediaVisible={mediaVisible}
        onToggleMedia={() => setMediaVisible((current) => !current)}
      />
    );
  }

  const roundLabel = isRecording || canSend ? "Send" : "Voice message";

  return (
    <div className="wa-wall relative mx-auto flex h-dvh max-h-dvh w-full max-w-sm flex-col shadow-2xl">
      <header className="flex items-center gap-1 bg-[#008069] px-1 py-1.5 text-white">
        {searchOpen ? (
          <>
            <button
              type="button"
              onClick={() => {
                setSearchOpen(false);
                setSearchQuery("");
              }}
              className="flex h-10 w-9 items-center justify-center"
              aria-label="Close search"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search..."
              aria-label="Search messages"
              className="h-10 min-w-0 flex-1 bg-transparent text-[16px] text-white outline-none placeholder:text-white/70"
              autoFocus
            />
            <span className="shrink-0 text-[12px] text-white/80">
              {searchQuery.trim() ? (searchMatches.length ? `${matchIndex + 1} of ${searchMatches.length}` : "0") : ""}
            </span>
            <button type="button" onClick={() => stepMatch(-1)} className="flex h-10 w-8 items-center justify-center" aria-label="Previous match">
              <ChevronUp className="h-5 w-5" />
            </button>
            <button type="button" onClick={() => stepMatch(1)} className="flex h-10 w-8 items-center justify-center" aria-label="Next match">
              <ChevronDown className="h-5 w-5" />
            </button>
          </>
        ) : (
          <>
        <button
          type="button"
          onClick={onBack}
          className="flex h-10 w-9 items-center justify-center"
          aria-label="Back"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
        <button
          type="button"
          onClick={() => setView("profile")}
          className="flex min-w-0 flex-1 items-center gap-2 text-left"
          aria-label="Open Pushkar AI profile"
        >
          <PushkarAvatar className="h-10 w-10" />
          <span className="min-w-0">
            <span className="flex items-center gap-1">
              <span className="truncate text-[16px] font-medium leading-tight">Pushkar AI</span>
              <MetaTick className="h-[15px] w-[15px]" />
            </span>
            <span className="flex items-center gap-1 text-[12px] leading-tight text-white/85">
              {isTyping ? "typing..." : notificationsOn ? "online" : "muted"}
              {!notificationsOn && !isTyping && <BellOff className="h-3 w-3" />}
            </span>
          </span>
        </button>
        <button
          type="button"
          onClick={() => setView("profile")}
          className="flex h-10 w-10 items-center justify-center"
          aria-label="More"
        >
          <MoreVertical className="h-5 w-5" />
        </button>
          </>
        )}
      </header>

      <div
        className="scrollbar-hide relative flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto px-3 py-3"
        ref={wallRef}
        onClick={() => setPanel(null)}
      >
        <EncryptionNotice />
        <p className="mx-auto mb-1 shrink-0 rounded-lg bg-white/80 px-3 py-1 text-[12px] text-slate-500 shadow-sm">
          Today
        </p>
        <OpeningSeal />
        {messages.map((message) => (
          <div
            id={`msg-${message.id}`}
            key={message.id}
            className={`shrink-0 ${searchMatches[matchIndex]?.id === message.id && searchQuery.trim() ? "rounded-md bg-black/5" : ""}`}
          >
            <MessageBubble message={message} highlight={searchQuery} onAction={handleBubbleAction} />
          </div>
        ))}
        {isTyping && <TypingBubble />}
        <div ref={endRef} />
      </div>

      {notice && <p className="px-4 pb-1 text-center text-[12px] text-slate-600">{notice}</p>}
      {panel === "emoji" && <EmojiPanel onPick={insertEmoji} />}

      <div className="relative">
        {panel === "attach" && <AttachMenu onPick={handleAttach} />}
        <form
          onSubmit={handleSend}
          className="grid w-full grid-cols-[minmax(0,1fr)_3rem] items-end gap-2 px-3 py-2"
        >
          {isRecording ? (
            <div className="flex min-h-12 min-w-0 items-center gap-2 rounded-full bg-white px-3 shadow-sm">
              <button
                type="button"
                onClick={() => stopRecorder("cancel")}
                className="flex h-9 w-9 items-center justify-center text-red-500"
                aria-label="Delete recording"
              >
                <Trash2 className="h-5 w-5" />
              </button>
              <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-red-500" />
              <span className="text-[15px] text-slate-800">{formatDuration(recordSeconds)}</span>
              <span className="ml-auto text-[12px] text-slate-400">Recording</span>
            </div>
          ) : (
            <div className="flex min-h-12 min-w-0 items-center gap-1 overflow-hidden rounded-full bg-white px-2 shadow-sm">
              <button
                type="button"
                onClick={() => setPanel((current) => (current === "emoji" ? null : "emoji"))}
                className="flex h-9 w-9 items-center justify-center text-slate-500"
                aria-label={panel === "emoji" ? "Keyboard" : "Emoji"}
              >
                {panel === "emoji" ? <Keyboard className="h-6 w-6" /> : <Smile className="h-6 w-6" />}
              </button>
              <label htmlFor="wa-draft" className="sr-only">
                Type a message
              </label>
              <input
                id="wa-draft"
                ref={inputRef}
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                onFocus={() => {
                  if (panel === "attach") setPanel(null);
                }}
                placeholder="Type a message..."
                className="h-10 min-w-0 flex-1 bg-transparent text-[16px] text-slate-900 outline-none placeholder:text-slate-400"
              />
              <button
                type="button"
                onClick={() => setPanel((current) => (current === "attach" ? null : "attach"))}
                className="flex h-9 w-9 items-center justify-center text-slate-500"
                aria-label="Attach"
              >
                <Paperclip className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={openCamera}
                className="flex h-9 w-9 items-center justify-center text-slate-500"
                aria-label="Camera"
              >
                <Camera className="h-5 w-5" />
              </button>
            </div>
          )}
          <button
            type={canSend && !isRecording ? "submit" : "button"}
            onClick={isRecording ? () => stopRecorder("send") : canSend ? undefined : startRecording}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#008069] text-white"
            aria-label={roundLabel}
          >
            {isRecording || canSend ? <Send className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </button>
        </form>
      </div>

      <input
        ref={galleryRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(event) => onFileChosen(event, sendImageFile)}
      />
      <input
        ref={cameraFileRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(event) => onFileChosen(event, sendImageFile)}
      />
      <input
        ref={documentRef}
        type="file"
        className="hidden"
        onChange={(event) => onFileChosen(event, sendDocument)}
      />
      <input
        ref={audioFileRef}
        type="file"
        accept="audio/*"
        className="hidden"
        onChange={(event) => onFileChosen(event, sendAudioFile)}
      />

      {cameraStream && (
        <CameraSheet stream={cameraStream} onClose={closeCamera} onSend={sendCameraPhoto} />
      )}
    </div>
  );
}

export default WhatsAppChatPage;
