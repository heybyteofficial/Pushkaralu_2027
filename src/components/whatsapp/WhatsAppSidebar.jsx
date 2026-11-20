import React from "react";
import { AppAvatar, SearchIcon, VerifiedIcon } from "./icons";

const CONVERSATIONS = [
  {
    id: "pushkaralu_help",
    title: "Pushkaralu 2027 Help",
    verified: true,
    preview: "🙏 Welcome to Andhra Pradesh Pushkaralu 2027 Missing Persons…",
    time: "Just now",
    unread: 0,
    active: true,
  },
  {
    id: "police_control",
    title: "AP Police Control Room",
    verified: true,
    preview: "Patrol unit deployed at Durga Ghat sector 4.",
    time: "10:14 am",
    unread: 2,
    active: false,
  },
  {
    id: "ghat_emergency",
    title: "Ghat Medical & Rescue",
    verified: false,
    preview: "First-aid station active near bathing zone B.",
    time: "Yesterday",
    unread: 0,
    active: false,
  },
  {
    id: "family_circle",
    title: "Family Pilgrimage Group",
    verified: false,
    preview: "Father: Meeting near the temple gopuram by 4 PM.",
    time: "Yesterday",
    unread: 0,
    active: false,
  },
];

/**
 * Authentic WhatsApp Web Left Sidebar for Desktop layout.
 */
export function WhatsAppSidebar({ onSelectChat, activeChat = "pushkaralu_help" }) {
  return (
    <aside className="w-80 lg:w-96 h-full flex flex-col bg-white border-r border-[#e9edef] select-none shrink-0">
      {/* Top Header */}
      <header className="h-[60px] bg-[#f0f2f5] px-4 flex items-center justify-between border-b border-[#e9edef]">
        <div className="w-10 h-10 rounded-full bg-[#d1d7db] flex items-center justify-center font-bold text-[#54656f] text-sm overflow-hidden">
          <span>AP</span>
        </div>

        <div className="flex items-center gap-3 text-[#54656f]">
          {/* Status stories icon */}
          <button
            type="button"
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/5"
            aria-label="Status"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
          </button>
          {/* New chat icon */}
          <button
            type="button"
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/5"
            aria-label="New chat"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
            </svg>
          </button>
        </div>
      </header>

      {/* Search Bar */}
      <div className="p-2 border-b border-[#e9edef]">
        <div className="flex items-center gap-2 bg-[#f0f2f5] rounded-lg px-3 py-1.5 focus-within:bg-white focus-within:ring-1 focus-within:ring-[#00a884]">
          <SearchIcon size={18} className="text-[#54656f]" />
          <input
            placeholder="Search or start new chat"
            className="bg-transparent text-[14px] text-[#111b21] placeholder:text-[#8696a0] outline-none flex-1 min-w-0"
          />
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-1.5 mt-2 px-1">
          <span className="px-3 py-0.5 rounded-full bg-[#e7f6ef] text-[#008069] text-[12.5px] font-semibold cursor-pointer">
            All
          </span>
          <span className="px-3 py-0.5 rounded-full bg-[#f0f2f5] text-[#54656f] hover:bg-[#e9edef] text-[12.5px] cursor-pointer">
            Unread
          </span>
          <span className="px-3 py-0.5 rounded-full bg-[#f0f2f5] text-[#54656f] hover:bg-[#e9edef] text-[12.5px] cursor-pointer">
            Favorites
          </span>
          <span className="px-3 py-0.5 rounded-full bg-[#f0f2f5] text-[#54656f] hover:bg-[#e9edef] text-[12.5px] cursor-pointer">
            Groups
          </span>
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto divide-y divide-[#e9edef]/50">
        {CONVERSATIONS.map((c) => {
          const isCurrent = c.id === activeChat;
          return (
            <div
              key={c.id}
              onClick={() => onSelectChat?.(c.id)}
              className={`flex items-center gap-3 p-3 cursor-pointer transition-colors ${
                isCurrent ? "bg-[#f0f2f5]" : "hover:bg-[#f5f6f6]"
              }`}
            >
              <AppAvatar size={48} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 font-semibold text-[15.5px] text-[#111b21] truncate">
                    <span>{c.title}</span>
                    {c.verified && <VerifiedIcon size={15} />}
                  </div>
                  <span className="text-[12px] text-[#667781] shrink-0">{c.time}</span>
                </div>
                <div className="flex items-center justify-between mt-0.5">
                  <p className="text-[13px] text-[#667781] truncate">{c.preview}</p>
                  {c.unread > 0 && (
                    <span className="ml-1 w-5 h-5 rounded-full bg-[#25d366] text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                      {c.unread}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
