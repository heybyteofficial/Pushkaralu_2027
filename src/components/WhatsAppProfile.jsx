import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Bell,
  Check,
  ChevronRight,
  Clock3,
  Image,
  Lock,
  MoreVertical,
  Search,
  Share2,
} from "lucide-react";
import PushkarAvatar from "./PushkarAvatar";

const ACTIONS = [
  { id: "share", label: "Share", icon: Share2 },
  { id: "search", label: "Search", icon: Search },
];

const DISAPPEARING_OPTIONS = [
  {
    id: "off",
    label: "Off",
    notice: "You turned off disappearing messages.",
  },
  {
    id: "24h",
    label: "24 hours",
    notice: "You turned on disappearing messages. New messages will disappear from this chat 24 hours after they are sent.",
  },
  {
    id: "7d",
    label: "7 days",
    notice: "You turned on disappearing messages. New messages will disappear from this chat 7 days after they are sent.",
  },
  {
    id: "90d",
    label: "90 days",
    notice: "You turned on disappearing messages. New messages will disappear from this chat 90 days after they are sent.",
  },
];

const SECURITY_CODE = [
  "84729", "10635", "48291", "74650",
  "38291", "07465", "91827", "36450",
  "55281", "64039", "27184", "90316",
];

function messageExportLine(message) {
  if (message.kind === "system") return message.text;
  const who = message.from === "user" ? "You" : "Pushkar AI";
  if (message.kind === "image") return `[${message.time}] ${who}: Photo`;
  if (message.kind === "audio") return `[${message.time}] ${who}: Voice message`;
  if (message.kind === "file") return `[${message.time}] ${who}: ${message.name}`;
  return `[${message.time}] ${who}: ${message.text || ""}`;
}

function WhatsAppProfile({
  onBack,
  notificationsOn,
  onToggleNotifications,
  messages,
  onSearch,
  onClearChat,
  disappearing,
  onDisappearingChange,
  mediaVisible,
  onToggleMedia,
}) {
  const [screen, setScreen] = useState("main");
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirm, setConfirm] = useState(null);
  const [toast, setToast] = useState("");
  const disappearingLabel = DISAPPEARING_OPTIONS.find((option) => option.id === disappearing)?.label || "Off";

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(""), 2200);
    return () => clearTimeout(timer);
  }, [toast]);

  const shareProfile = async () => {
    const payload = {
      title: "Pushkar AI",
      text: "Pushkar AI — Your AI assistant for learning, productivity and more.",
      url: window.location.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(payload);
        return;
      } catch (error) {
        if (error.name === "AbortError") return;
      }
    }
    try {
      await navigator.clipboard.writeText(`${payload.text} ${payload.url}`);
      setToast("Link copied");
    } catch {
      setToast("Unable to share from this browser");
    }
  };

  const exportChat = () => {
    const lines = ["Pushkar AI chat", "", ...messages.map(messageExportLine)];
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "Pushkar AI.txt";
    link.click();
    URL.revokeObjectURL(url);
    setMenuOpen(false);
    setToast("Chat exported");
  };

  const askClear = () => {
    setMenuOpen(false);
    setConfirm({
      title: "Clear this chat?",
      body: "Messages will be removed from this device.",
      action: "Clear",
      onConfirm: () => {
        onClearChat();
        setConfirm(null);
        setToast("Chat cleared");
      },
    });
  };

  const askReport = () => {
    setMenuOpen(false);
    setConfirm({
      title: "Report Pushkar AI?",
      body: "The latest messages in this chat will be sent for review. This person will not be notified.",
      action: "Report",
      onConfirm: () => {
        setConfirm(null);
        setToast("Report sent");
      },
    });
  };

  const chooseDisappearing = (option) => {
    if (option.id !== disappearing) onDisappearingChange(option);
    setScreen("main");
  };

  let title = "Pushkar AI";
  let back = onBack;
  if (screen === "media") {
    title = "Media visibility";
    back = () => setScreen("main");
  }
  if (screen === "encryption") {
    title = "Encryption";
    back = () => setScreen("main");
  }
  if (screen === "disappearing") {
    title = "Disappearing messages";
    back = () => setScreen("main");
  }

  return (
    <div className="relative mx-auto flex min-h-screen w-full max-w-sm flex-col bg-white shadow-2xl">
      <header className="flex items-center justify-between px-2 pt-3">
        <button
          type="button"
          onClick={back}
          className="flex h-10 w-10 items-center justify-center text-slate-800"
          aria-label={screen === "main" ? "Back to chat" : "Back"}
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
        {screen !== "main" && <h1 className="text-[17px] font-medium text-slate-900">{title}</h1>}
        {screen === "main" ? (
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="flex h-10 w-10 items-center justify-center text-slate-800"
            aria-label="More"
            aria-expanded={menuOpen}
          >
            <MoreVertical className="h-5 w-5" />
          </button>
        ) : (
          <span className="w-10" />
        )}
      </header>

      {menuOpen && (
        <>
          <button type="button" className="absolute inset-0 z-20" aria-label="Close menu" onClick={() => setMenuOpen(false)} />
          <div className="absolute right-3 top-14 z-30 w-44 overflow-hidden rounded-lg bg-white py-1 shadow-xl">
            <button type="button" onClick={exportChat} className="block w-full px-4 py-2.5 text-left text-[15px] text-slate-800 hover:bg-slate-50">
              Export chat
            </button>
            <button type="button" onClick={askClear} className="block w-full px-4 py-2.5 text-left text-[15px] text-slate-800 hover:bg-slate-50">
              Clear chat
            </button>
            <button type="button" onClick={askReport} className="block w-full px-4 py-2.5 text-left text-[15px] text-slate-800 hover:bg-slate-50">
              Report
            </button>
          </div>
        </>
      )}

      <div className="flex-1 overflow-y-auto">
        {screen === "main" && (
          <>
            <div className="flex flex-col items-center px-4 pb-4">
              <PushkarAvatar className="h-28 w-28" />
              <div className="mt-3 flex items-center gap-1.5">
                <h1 className="text-[22px] font-semibold text-slate-900">Pushkar AI</h1>
                <svg viewBox="0 0 40 40" className="h-[18px] w-[18px] overflow-visible" aria-label="Verified">
                  <path
                    fill="#0095F6"
                    d="M19.998 3.094 14.638 0l-2.972 5.15H5.432v6.354L0 14.64 3.094 20 0 25.359l5.432 3.137v5.905h5.975L14.638 40l5.36-3.094L25.359 40l3.137-5.433h6.078v-6.06L40 25.364l-3.094-5.363L40 14.64l-5.426-3.135V5.15h-6.08L25.359 0l-5.361 3.094z"
                  />
                  <path fill="#fff" d="M16.3 26.4 11.2 21.3l2.1-2.1 3 3 8.4-8.4 2.1 2.1z" />
                </svg>
              </div>
              <p className="text-sm text-slate-500">Business Account</p>
            </div>

            <div className="mx-auto grid w-full max-w-[220px] grid-cols-2 gap-2 px-4">
              {ACTIONS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={id === "share" ? shareProfile : onSearch}
                  className="flex flex-col items-center gap-1 rounded-xl border border-slate-200 py-2.5 text-[11px] text-slate-600"
                >
                  <Icon className="h-5 w-5 text-[#008069]" />
                  {label}
                </button>
              ))}
            </div>

            <div className="mt-5 border-t border-slate-100 px-4 py-4">
              <p className="text-xs text-slate-400">About</p>
              <p className="mt-1 text-[15px] leading-snug text-slate-800">
                Your AI assistant for learning, productivity and more.
              </p>
            </div>

            <ul className="border-t border-slate-100">
              <li className="flex items-center gap-4 px-4 py-3.5">
                <Bell className="h-5 w-5 shrink-0 text-slate-500" />
                <span className="flex-1 text-[15px] text-slate-800">
                  Notifications
                  <span className="mt-0.5 block text-[12px] text-slate-400">{notificationsOn ? "On" : "Muted"}</span>
                </span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={notificationsOn}
                  aria-label="Notifications"
                  onClick={onToggleNotifications}
                  className={`relative h-6 w-11 rounded-full transition-colors ${notificationsOn ? "bg-[#25d366]" : "bg-slate-300"}`}
                >
                  <span
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${notificationsOn ? "left-5" : "left-0.5"}`}
                  />
                </button>
              </li>
              <li>
                <button type="button" onClick={() => setScreen("media")} className="flex w-full items-center gap-4 px-4 py-3.5 text-left">
                  <Image className="h-5 w-5 shrink-0 text-slate-500" />
                  <span className="flex-1 text-[15px] text-slate-800">Media visibility</span>
                  <span className="text-sm text-slate-400">{mediaVisible ? "On" : "Off"}</span>
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                </button>
              </li>
              <li>
                <button type="button" onClick={() => setScreen("encryption")} className="flex w-full items-start gap-4 px-4 py-3.5 text-left">
                  <Lock className="mt-0.5 h-5 w-5 shrink-0 text-slate-500" />
                  <span>
                    <span className="block text-[15px] text-slate-800">Encryption</span>
                    <span className="mt-0.5 block text-[13px] leading-snug text-slate-500">
                      Messages and calls are end-to-end encrypted. Tap to verify.
                    </span>
                  </span>
                </button>
              </li>
              <li>
                <button type="button" onClick={() => setScreen("disappearing")} className="flex w-full items-center gap-4 px-4 py-3.5 text-left">
                  <Clock3 className="h-5 w-5 shrink-0 text-slate-500" />
                  <span className="flex-1 text-[15px] text-slate-800">Disappearing messages</span>
                  <span className="text-sm text-slate-400">{disappearingLabel}</span>
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                </button>
              </li>
            </ul>
          </>
        )}

        {screen === "media" && (
          <div className="px-4 py-4">
            <div className="flex items-center gap-4">
              <span className="flex-1 text-[15px] leading-snug text-slate-800">
                Show newly downloaded media in your device&apos;s gallery
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={mediaVisible}
                aria-label="Media visibility"
                onClick={onToggleMedia}
                className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${mediaVisible ? "bg-[#25d366]" : "bg-slate-300"}`}
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${mediaVisible ? "left-5" : "left-0.5"}`}
                />
              </button>
            </div>
            <p className="mt-4 text-[13px] leading-snug text-slate-500">
              {mediaVisible
                ? "Media you receive in this chat can be saved to your phone gallery."
                : "Media from this chat will not be saved to your phone gallery."}
            </p>
          </div>
        )}

        {screen === "encryption" && (
          <div className="flex flex-col items-center px-6 py-6 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#e7f8ef] text-[#008069]">
              <Lock className="h-8 w-8" />
            </span>
            <p className="mt-4 text-[15px] leading-snug text-slate-700">
              Messages in this chat are secured with end-to-end encryption. No one outside this chat can read or listen to them.
            </p>
            <div className="mt-6 grid grid-cols-4 gap-x-4 gap-y-2 font-mono text-[15px] tracking-wide text-slate-800">
              {SECURITY_CODE.map((group) => (
                <span key={group}>{group}</span>
              ))}
            </div>
            <p className="mt-4 text-[12px] text-slate-400">Security code for Pushkar AI</p>
          </div>
        )}

        {screen === "disappearing" && (
          <ul>
            {DISAPPEARING_OPTIONS.map((option) => {
              const selected = option.id === disappearing;
              return (
                <li key={option.id}>
                  <button
                    type="button"
                    onClick={() => chooseDisappearing(option)}
                    className="flex w-full items-center gap-3 px-4 py-3.5 text-left"
                    aria-pressed={selected}
                  >
                    <span className="flex h-5 w-5 items-center justify-center text-[#008069]">
                      {selected && <Check className="h-5 w-5" />}
                    </span>
                    <span className="text-[15px] text-slate-800">{option.label}</span>
                  </button>
                </li>
              );
            })}
            <li className="px-4 py-3 text-[13px] leading-snug text-slate-500">
              When turned on, new messages disappear from this chat after the time you choose.
            </li>
          </ul>
        )}
      </div>

      {confirm && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/40 px-8">
          <div className="w-full rounded-2xl bg-white p-5 shadow-xl">
            <p className="text-[17px] font-medium text-slate-900">{confirm.title}</p>
            <p className="mt-2 text-[14px] leading-snug text-slate-500">{confirm.body}</p>
            <div className="mt-5 flex justify-end gap-5">
              <button type="button" onClick={() => setConfirm(null)} className="text-[15px] text-slate-500">
                Cancel
              </button>
              <button type="button" onClick={confirm.onConfirm} className="text-[15px] font-medium text-[#008069]">
                {confirm.action}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <p className="absolute bottom-6 left-1/2 z-40 -translate-x-1/2 rounded-full bg-slate-800 px-4 py-2 text-sm text-white">
          {toast}
        </p>
      )}
    </div>
  );
}

export default WhatsAppProfile;
