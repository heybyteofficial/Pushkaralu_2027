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

const OPENING_TEXT = "Hello! 👋\nHow can I help you?";
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
const TYPING_DELAY_MS = 1400;

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

function SearchCard({ onDone }) {
  const [progress, setProgress] = useState(6);
  const doneRef = useRef(false);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    const duration = 3000 + Math.random() * 2000;
    const started = performance.now();
    const timer = setInterval(() => {
      const next = Math.min(100, Math.round(((performance.now() - started) / duration) * 100));
      setProgress(next);
      if (next >= 100) clearInterval(timer);
    }, 50);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (progress < 100 || doneRef.current) return undefined;
    doneRef.current = true;
    const timer = setTimeout(() => onDoneRef.current(), 450);
    return () => clearTimeout(timer);
  }, [progress]);

  return (
    <div className="w-[230px] py-1">
      <div className="flex items-center gap-2">
        <img src={apLogo} alt="Andhra Pradesh Government" className="h-11 w-11 shrink-0 object-contain" />
        <div className="min-w-0">
          <p className="text-[14px] font-medium text-slate-900">{progress < 100 ? "Searching records" : "Search complete"}</p>
          <p className="text-[12px] text-[#667781]">{progress < 100 ? "ప్రభుత్వ రికార్డులు వెతుకుతున్నాం" : "వెతకడం పూర్తి"}</p>
        </div>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200" aria-hidden="true">
        <div className="h-full rounded-full bg-[#008069] transition-[width] duration-75" style={{ width: `${progress}%` }} />
      </div>
      <p className="mt-1 text-right text-[12px] text-[#667781]">{progress}%</p>
    </div>
  );
}

function MessageBubble({ message, highlight = "", onAction }) {
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
          {message.kind === "search" ? (
            <SearchCard onDone={() => onAction("search-done")} />
          ) : (
            <MessageBody message={message} highlight={highlight} />
          )}
          {!isText && message.kind !== "audio" && message.kind !== "search" && (
            <div className="flex justify-end px-1 pt-0.5">
              <TimeMark time={message.time} isUser={isUser} />
            </div>
          )}
          {message.hold && <SosHold onSent={() => onAction("sos")} />}
          {message.buttons?.map((button) =>
            button.phone ? (
              <a
                key={button.id}
                href={`tel:${button.phone}`}
                className="-mx-3 mt-1.5 block w-[calc(100%+1.5rem)] border-t border-black/10 px-3 py-2 text-center text-[14px] font-medium text-[#008069]"
              >
                {button.label}
              </a>
            ) : (
              <button
                key={button.id}
                type="button"
                onClick={() => onAction(button.id)}
                className={`-mx-3 mt-1.5 block w-[calc(100%+1.5rem)] border-t border-black/10 px-3 py-2 text-center text-[14px] font-medium ${
                  button.id === "no" ? "text-red-600" : "text-[#008069]"
                }`}
              >
                {button.label}
              </button>
            )
          )}
        </div>
        {isUser && <BubbleTail side="user" />}
      </div>
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
  const [selectedGuides, setSelectedGuides] = useState([]);
  const [missingReport, setMissingReport] = useState(null);
  const matchRef = useRef(null);
  const [emergencyCase, setEmergencyCase] = useState(null);
  const [showChoices, setShowChoices] = useState(false);
  const [panel, setPanel] = useState(null);
  const [notice, setNotice] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [cameraStream, setCameraStream] = useState(null);
  const endRef = useRef(null);
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
    setIsTyping(true);
    clearTimeout(replyTimerRef.current);
    let index = 0;
    const step = () => {
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
        replyTimerRef.current = setTimeout(step, 700);
        return;
      }
      setIsTyping(false);
    };
    replyTimerRef.current = setTimeout(step, 700);
  };

  const say = (text) => {
    queueReplies([{ reply: text }]);
  };

  const replyWith = (guide) => {
    setShowChoices(false);
    if (guide.collect === "missing") {
      setMissingReport({ photo: false, waiting: "photo" });
    }
    if (guide.id === "emergency") {
      setEmergencyCase({ waiting: "type" });
    }
    queueReplies([guide]);
  };

  const showAdminCall = (again) => {
    const person = matchRef.current || {
      name: ADMIN.name,
      nameTe: ADMIN.nameTe,
      relation: ADMIN.relation,
      relationTe: ADMIN.relationTe,
    };
    setShowChoices(false);
    setMissingReport((current) => ({ ...(current || {}), photo: true, waiting: "location", match: person }));
    const details = `Name: ${person.name}\nRelation: ${person.relation}\n${ADMIN.phone}\nపేరు: ${person.nameTe}\nసంబంధం: ${person.relationTe}`;
    queueReplies([
      ...(again
        ? []
        : [{ reply: "Match found.\nమ్యాచ్ దొరికింది." }]),
      {
        reply: again
          ? `Call again.\n${details}\nమళ్లీ కాల్ చేయండి.`
          : `${ADMIN.title}\n${details}`,
        buttons: [{ id: "call", label: "Call", phone: ADMIN.phone }],
      },
      {
        reply: "Send your exact location so the admin can come to you.\nఅడ్మిన్ మీ దగ్గరికి రావడానికి మీ స్థానం పంపండి.",
        buttons: [{ id: "location", label: "Send location" }],
      },
    ]);
  };

  const completeMissing = () => {
    finishHelp();
  };

  const finishHelp = () => {
    setMissingReport((current) => (current ? { ...current, waiting: "done" } : current));
    setEmergencyCase((current) => (current ? { ...current, waiting: "done" } : current));
    setSelectedGuides([]);
    setShowChoices(true);
    say("Thank you. This chat is complete.\nHow may I help you?\nధన్యవాదాలు. మళ్లీ మిస్సింగ్ లేదా అత్యవసరం ఎంచుకోండి.");
  };

  const toggleGuide = (id) => {
    setSelectedGuides((current) => (
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    ));
  };

  const askSelected = () => {
    const chosen = GUIDES.filter((guide) => selectedGuides.includes(guide.id));
    if (!chosen.length) return;
    setShowChoices(false);
    if (chosen.some((guide) => guide.collect === "missing")) {
      setMissingReport({ photo: false, waiting: "photo" });
    }
    if (chosen.some((guide) => guide.id === "emergency")) {
      setEmergencyCase({ waiting: "type" });
    }
    pushMessage({ kind: "text", text: chosen.map((guide) => guide.chip).join(", ") });
    setSelectedGuides([]);
    setPanel(null);
    queueReplies(chosen);
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
          },
        ];
      });
      setShowChoices(true);
      setIsTyping(false);
    }, TYPING_DELAY_MS);

    return () => {
      clearTimeout(timer);
      clearTimeout(replyTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (searchOpen) return;
    const hasConversation = messages.some((message) => message.id !== "opening");
    if (!hasConversation) {
      document.getElementById("msg-opening")?.scrollIntoView({ block: "start" });
      return;
    }
    endRef.current?.scrollIntoView({ block: "end" });
  }, [messages, isTyping, view, searchOpen, showChoices]);

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
    if (emergencyCase && emergencyCase.waiting !== "done") {
      setShowChoices(false);
      if (emergencyCase.waiting === "type") {
        say("Tap Medical, Accident, or Police.\nవైద్యం, ప్రమాదం లేదా పోలీసు నొక్కండి.");
        return;
      }
      if (emergencyCase.waiting === "details") {
        const type = EMERGENCY_TYPES.find((item) => item.id === emergencyCase.typeId);
        setEmergencyCase({ ...emergencyCase, waiting: "location", detail: text });
        queueReplies([
          {
            reply: `Send your location so the ${type.team} can come for this ${type.label.toLowerCase()} emergency.\nఈ ${type.labelTe} అత్యవసరానికి మీ స్థానం పంపండి. ${type.teamTe} అక్కడికి వెళ్తారు.`,
            buttons: [{ id: "location", label: "Send location" }],
          },
        ]);
        return;
      }
      if (emergencyCase.waiting === "location") {
        say("Send your location with the button above.\nపైన ఉన్న బటన్‌తో మీ స్థానం పంపండి.");
        return;
      }
      say("Tap Yes if the team reached you, or No to call them.\nబృందం వస్తే Yes, లేకపోతే No నొక్కండి.");
      return;
    }
    if (missingReport && missingReport.waiting !== "done") {
      setShowChoices(false);
      if (missingReport.waiting === "photo") {
        say("Open the camera and send a photo of yourself.\nకెమెరా తెరిచి మీ ఫోటో పంపండి.");
      } else if (missingReport.waiting === "search") {
        say("The search is still running.\nవెతకడం ఇంకా జరుగుతోంది.");
      } else if (missingReport.waiting === "location") {
        say("Call the admin, then send your exact location.\nఅడ్మిన్‌కు కాల్ చేసి మీ స్థానం పంపండి.");
      } else {
        say("Tap Yes if the admin reached you, or No to call again.\nఅడ్మిన్ వచ్చి ఉంటే Yes, లేకపోతే No నొక్కండి.");
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
    pushMessage({ from: "assistant", kind: "search", text: "Searching records" });
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
        setShowChoices(false);
        const type = EMERGENCY_TYPES.find((item) => item.id === emergencyCase?.typeId);
        if (emergencyCase?.waiting === "location" && type) {
          setEmergencyCase((current) => ({ ...current, waiting: "reached" }));
          queueReplies([
            {
              reply: `${type.team} is about 2 minutes away for this ${type.label.toLowerCase()} emergency.\nHas the team reached you?\n${type.teamTe} ఈ ${type.labelTe} అత్యవసరానికి సుమారు 2 నిమిషాల్లో వస్తుంది.\nబృందం మీ దగ్గరికి వచ్చిందా?`,
              buttons: [
                { id: "yes", label: "Yes" },
                { id: "no", label: "No" },
              ],
            },
          ]);
          return;
        }
        setMissingReport((current) => ({ ...(current || {}), waiting: "reached" }));
        queueReplies([
          {
            reply: "The admin can see your location and is coming to you.\nHas the admin reached you?\nఅడ్మిన్ మీ దగ్గరికి వచ్చారా?",
            buttons: [
              { id: "yes", label: "Yes" },
              { id: "no", label: "No" },
            ],
          },
        ]);
      },
      () => showNotice("Allow location so the admin can reach you."),
      { enableHighAccuracy: true, timeout: 12000 }
    );
  };

  const handleBubbleAction = (action) => {
    if (action === "search-done") {
      if (missingReport?.waiting !== "search") return;
      showAdminCall(false);
      return;
    }
    if (action.startsWith("type-")) {
      const type = EMERGENCY_TYPES.find((item) => item.id === action.slice(5));
      if (!type) return;
      setShowChoices(false);
      setEmergencyCase({ waiting: "details", typeId: type.id });
      say(`You chose ${type.label}. Explain what happened.\nమీరు ${type.labelTe} ఎంచుకున్నారు. ఏమైందో చెప్పండి.`);
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
        setShowChoices(false);
        queueReplies([
          {
            reply: `Call the ${type.team}.\n${type.phone}\n${type.teamTe} వారికి కాల్ చేయండి.`,
            buttons: [{ id: "call", label: "Call", phone: type.phone }],
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
    <div className="relative mx-auto flex h-dvh max-h-dvh w-full max-w-sm flex-col bg-[#efeae2] shadow-2xl">
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
              <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#25d366]">
                <svg viewBox="0 0 16 16" className="h-3 w-3 overflow-visible" aria-hidden="true">
                  <path
                    d="M4.2 8.3 6.7 10.8 11.8 5.4"
                    fill="none"
                    stroke="#fff"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
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
        className="wa-wall flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto px-3 py-3"
        onClick={() => setPanel(null)}
      >
        <p className="mx-auto mb-1 rounded-lg bg-white/80 px-3 py-1 text-[12px] text-slate-500 shadow-sm">
          Today
        </p>
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
        {showChoices && messages.some((message) => message.id === "opening") && !isTyping && (
          <div
            className="ml-3 max-w-[82%] shrink-0 overflow-hidden rounded-lg bg-white shadow-sm"
            onClick={(event) => event.stopPropagation()}
          >
            {GUIDES.map((guide, index) => {
              const checked = selectedGuides.includes(guide.id);
              return (
                <label
                  key={guide.id}
                  className={`flex cursor-pointer items-center gap-3 px-3 py-2.5 text-[14px] ${
                    index > 0 ? "border-t border-black/10" : ""
                  } ${guide.id === "emergency" ? "text-red-600" : "text-slate-800"}`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleGuide(guide.id)}
                    className="h-4 w-4 shrink-0 accent-[#008069]"
                  />
                  {guide.chip}
                </label>
              );
            })}
            <button
              type="button"
              onClick={askSelected}
              disabled={selectedGuides.length === 0}
              className="w-full border-t border-black/10 py-2.5 text-center text-[14px] font-medium text-[#008069] disabled:text-slate-300"
            >
              Send
            </button>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {notice && <p className="px-4 pb-1 text-center text-[12px] text-slate-600">{notice}</p>}
      {panel === "emoji" && <EmojiPanel onPick={insertEmoji} />}

      <div className="relative">
        {panel === "attach" && <AttachMenu onPick={handleAttach} />}
        <form
          onSubmit={handleSend}
          className="grid w-full grid-cols-[minmax(0,1fr)_3rem] items-end gap-2 bg-[#efeae2] px-3 py-2"
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
