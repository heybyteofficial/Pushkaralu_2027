import React, { useEffect, useMemo, useRef, useState } from "react";
import { createMockTransport } from "../chat-core/mockTransport";
import { useChat } from "../hooks/useChat";
import { compressImage, getLocation, formatTime } from "../utils/media";
import { ChatHeader } from "../components/whatsapp/ChatHeader";
import { ChatInput } from "../components/whatsapp/ChatInput";
import { EmojiPanel } from "../components/whatsapp/EmojiPanel";
import { ListSheet } from "../components/whatsapp/ListSheet";
import { MessageBubble, TypingBubble } from "../components/whatsapp/MessageBubble";
import { WhatsAppCameraModal } from "../components/whatsapp/WhatsAppCameraModal";
import { WhatsAppProfileModal } from "../components/whatsapp/WhatsAppProfileModal";
import { LockIcon } from "../components/whatsapp/icons";

export default function WhatsAppChatPage({ onBack }) {
  const transport = useMemo(() => createMockTransport(), []);
  const { messages, typing, error, send, clearMessages } = useChat(transport);

  const [listFor, setListFor] = useState(null);
  const [cameraModal, setCameraModal] = useState(null); // { mode: 'camera' | 'preview' | 'lightbox', image: string | null }
  const [profileOpen, setProfileOpen] = useState(false);
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [locating, setLocating] = useState(false);

  // In-chat Search
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [matchIndex, setMatchIndex] = useState(0);

  const scrollRef = useRef(null);
  const galleryRef = useRef(null);

  // Auto-scroll on new message or typing state change
  useEffect(() => {
    if (searchOpen) return;
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages.length, typing, searchOpen]);

  // Active interactive bot messages (tappable only after last user reply)
  const activeFrom = useMemo(() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].from === "user") return i + 1;
    }
    return 0;
  }, [messages]);

  const listMsg = messages.find((m) => m.id === listFor);

  // Search matches
  const searchMatches = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return messages.filter((m) => {
      const text =
        m.from === "user"
          ? m.reply?.text || m.reply?.title || ""
          : m.msg?.text || m.msg?.caption || "";
      return text.toLowerCase().includes(q);
    });
  }, [messages, searchQuery]);

  useEffect(() => {
    setMatchIndex(0);
  }, [searchQuery]);

  useEffect(() => {
    const activeMatch = searchMatches[matchIndex];
    if (activeMatch) {
      const el = document.getElementById(`msg-${activeMatch.id}`);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [matchIndex, searchMatches]);

  const stepMatch = (dir) => {
    if (!searchMatches.length) return;
    setMatchIndex((prev) => (prev + dir + searchMatches.length) % searchMatches.length);
  };

  // Reply dispatcher
  const reply = (r) => send(r);

  // Image file pick from gallery handler
  const onFilePicked = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      return;
    }
    const { dataUrl } = await compressImage(file);
    setCameraModal({ mode: "preview", image: dataUrl });
  };

  // Geolocation sender
  const handleSendLocation = async () => {
    setLocating(true);
    const loc = await getLocation();
    setLocating(false);
    reply({ type: "location", ...loc });
  };

  // Audio voice note sender
  const handleSendAudio = (previewUrl, duration) => {
    reply({ type: "audio", previewUrl, duration });
  };

  // Export chat transcript
  const handleExportChat = () => {
    const lines = messages.map((m) => {
      const sender = m.from === "user" ? "You" : "Pushkaralu Help";
      const timeStr = formatTime(m.at);
      const content =
        m.from === "user"
          ? m.reply?.title || m.reply?.text || `[${m.reply?.type}]`
          : m.msg?.text || m.msg?.caption || `[${m.msg?.type}]`;
      return `[${timeStr}] ${sender}: ${content}`;
    });
    const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `WhatsApp_Chat_Pushkaralu_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-[430px] mx-auto h-[100dvh] max-h-[100dvh] flex flex-col bg-[#efeae2] relative shadow-2xl sm:border-x sm:border-gray-300 overflow-hidden select-none touch-manipulation">
      {/* Real WhatsApp Header (seamlessly transforms into search mode) */}
      <ChatHeader
        typing={typing}
        onBack={onBack}
        onOpenProfile={() => setProfileOpen(true)}
        onClearChat={clearMessages}
        onExportChat={handleExportChat}
        searchOpen={searchOpen}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenSearch={() => {
          setSearchOpen(true);
          setSearchQuery("");
        }}
        onCloseSearch={() => {
          setSearchOpen(false);
          setSearchQuery("");
        }}
        onPrevMatch={() => stepMatch(-1)}
        onNextMatch={() => stepMatch(1)}
        matchIndex={matchIndex}
        matchCount={searchMatches.length}
      />

      {/* WhatsApp Chat Wall with Doodle Wallpaper */}
      <div
        ref={scrollRef}
        className="wa-chat-wall flex-1 overflow-y-auto scrollbar-hide px-2 sm:px-3 pt-2 pb-6 flex flex-col scroll-smooth relative min-h-0"
      >
        {/* End-to-End Encryption Notice (Appears first at top of conversation in WhatsApp) */}
        <div className="mx-auto my-2 max-w-[95%] rounded-lg bg-[#ffeecd] px-3 py-1.5 text-center text-[11.5px] leading-snug text-[#54656f] shadow-[0_1px_0.5px_rgba(11,20,26,0.13)] select-none flex items-center justify-center gap-1.5 shrink-0">
          <LockIcon size={12} className="shrink-0 text-[#54656f]" />
          <span>
            Messages and calls are end-to-end encrypted. Family details and photos are used strictly
            for crowd safety and missing person reunification.
          </span>
        </div>

        {/* Real WhatsApp Date Separator Chip */}
        <div className="flex justify-center my-3 select-none shrink-0">
          <span className="px-3 py-1 rounded-[7.5px] bg-white text-[#54656f] text-[12px] font-medium leading-normal uppercase shadow-[0_1px_0.5px_rgba(11,20,26,0.13)] tracking-[0.2px]">
            TODAY
          </span>
        </div>

        {/* Message List */}
        {messages.map((m, i) => (
          <div
            key={m.id}
            id={`msg-${m.id}`}
            className={
              searchMatches[matchIndex]?.id === m.id && searchQuery
                ? "rounded-lg ring-2 ring-[#00a884] bg-[#00a884]/10 transition-all"
                : ""
            }
          >
            <MessageBubble
              m={m}
              active={m.from === "bot" && i >= activeFrom && !typing}
              tail={i === 0 || messages[i - 1]?.from !== m.from}
              highlight={searchQuery}
              isCurrentMatch={searchMatches[matchIndex]?.id === m.id && Boolean(searchQuery.trim())}
              onReply={reply}
              onOpenList={setListFor}
              onRequestImage={() => setCameraModal({ mode: "camera", image: null })}
              onRequestLocation={handleSendLocation}
              onImageClick={(imgData) => {
                if (typeof imgData === "string") {
                  setCameraModal({
                    mode: "lightbox",
                    image: imgData,
                    caption: "",
                    senderName: "PushkarAI Safe Desk",
                    timestamp: Date.now(),
                  });
                } else {
                  setCameraModal({
                    mode: "lightbox",
                    image: imgData.url,
                    caption: imgData.caption || "",
                    senderName: imgData.sender || "PushkarAI Safe Desk",
                    timestamp: imgData.at || Date.now(),
                  });
                }
              }}
            />
          </div>
        ))}

        {/* Typing indicator */}
        {typing && <TypingBubble />}

        {/* Locating chip */}
        {locating && (
          <div className="mx-auto my-2 px-3 py-1 rounded-lg bg-white text-[#008069] text-[12px] font-medium shadow-sm animate-pulse flex items-center gap-1.5">
            <span>📍 Accessing GPS coordinates…</span>
          </div>
        )}

        {/* Error chip */}
        {error && (
          <div className="mx-auto my-2 px-3 py-1 rounded-lg bg-[#fde2e1] text-[#b3261e] text-[12px] font-medium shadow-sm">
            {error}
          </div>
        )}

        <div className="h-2 shrink-0" />
      </div>

      {/* Emoji Panel */}
      {emojiOpen && (
        <EmojiPanel
          onPick={(emoji) => {
            const activeInput = document.querySelector('input[placeholder="Type a message"]');
            if (activeInput) {
              const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
                window.HTMLInputElement.prototype,
                "value"
              ).set;
              nativeInputValueSetter.call(activeInput, activeInput.value + emoji);
              activeInput.dispatchEvent(new Event("input", { bubbles: true }));
              activeInput.focus();
            }
          }}
        />
      )}

      {/* Real WhatsApp Composer */}
      <ChatInput
        onSend={(text) => reply({ type: "text", text })}
        onPickGallery={() => galleryRef.current?.click()}
        onPickCamera={() => setCameraModal({ mode: "camera", image: null })}
        onSendLocation={handleSendLocation}
        onSendAudio={handleSendAudio}
        onToggleEmoji={() => setEmojiOpen(!emojiOpen)}
        emojiOpen={emojiOpen}
      />

      {/* Hidden Gallery Input */}
      <input
        ref={galleryRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onFilePicked}
      />

      {/* WhatsApp List Bottom Sheet */}
      {listMsg && listMsg.from === "bot" && listMsg.msg.type === "list" && (
        <ListSheet
          title={listMsg.msg.buttonLabel || "Choose an Option"}
          sections={listMsg.msg.sections || []}
          onClose={() => setListFor(null)}
          onSelect={(rowId, title) => {
            setListFor(null);
            reply({ type: "list_reply", rowId, title });
          }}
        />
      )}

      {/* WhatsApp Camera & Photo Upload Pre-Send Modal */}
      {cameraModal && (
        <WhatsAppCameraModal
          initialMode={cameraModal.mode}
          initialImage={cameraModal.image}
          initialCaption={cameraModal.caption || ""}
          senderName={cameraModal.senderName || "PushkarAI Safe Desk"}
          timestamp={cameraModal.timestamp || Date.now()}
          onClose={() => setCameraModal(null)}
          onSend={({ dataUrl, caption, viewOnce }) => {
            reply({
              type: "image",
              previewUrl: dataUrl,
              text: caption,
              caption,
              viewOnce,
            });
          }}
        />
      )}

      {/* Business Profile Modal */}
      {profileOpen && (
        <WhatsAppProfileModal
          onClose={() => setProfileOpen(false)}
          onOpenSearch={() => {
            setProfileOpen(false);
            setSearchOpen(true);
          }}
          onClearChat={clearMessages}
          onExportChat={handleExportChat}
        />
      )}
    </div>
  );
}
