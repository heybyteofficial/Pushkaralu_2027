import React, { useState, useRef, useEffect } from "react";
import {
  AppAvatar,
  BackIcon,
  CallIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CloseIcon,
  MoreIcon,
  SearchIcon,
  VerifiedIcon,
  VideoIcon,
} from "./icons";

export function ChatHeader({
  typing = false,
  onBack,
  onOpenProfile,
  onClearChat,
  onExportChat,
  // Exact WhatsApp Search props
  searchOpen = false,
  searchQuery = "",
  onSearchChange,
  onCloseSearch,
  onPrevMatch,
  onNextMatch,
  matchIndex = 0,
  matchCount = 0,
  onOpenSearch,
}) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const searchInputRef = useRef(null);

  useEffect(() => {
    if (searchOpen) {
      const timer = setTimeout(() => searchInputRef.current?.focus(), 50);
      return () => clearTimeout(timer);
    }
  }, [searchOpen]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    if (showMenu) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showMenu]);

  const handleCall = () => {
    window.location.href = "tel:112";
  };

  // ---------------- WHATSAPP ACTIVE SEARCH HEADER ----------------
  if (searchOpen) {
    return (
      <header className="chat-header relative flex items-center gap-1 px-2 sm:px-3 py-2 bg-[#008069] text-white min-h-[60px] pt-[max(0.5rem,env(safe-area-inset-top))] shadow-sm z-30 select-none shrink-0 animate-in fade-in duration-150">
        {/* Back Arrow to exit search mode */}
        <button
          type="button"
          onClick={onCloseSearch}
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center hover:bg-white/10 active:scale-95 transition-all shrink-0 text-white"
          aria-label="Back"
        >
          <BackIcon size={22} />
        </button>

        {/* WhatsApp Search Input Field */}
        <input
          ref={searchInputRef}
          value={searchQuery}
          onChange={(e) => onSearchChange?.(e.target.value)}
          placeholder="Search…"
          className="flex-1 bg-transparent text-[15.5px] text-white placeholder:text-white/70 outline-none min-w-0 font-normal px-1"
          autoFocus
        />

        {/* Result Counter (e.g. "1 of 4" or "0") */}
        {searchQuery.trim() && (
          <span className="text-[12px] font-medium text-white/85 shrink-0 px-1 select-none whitespace-nowrap">
            {matchCount > 0 ? `${matchIndex + 1} of ${matchCount}` : "0"}
          </span>
        )}

        {/* Clear Search Text "X" Button */}
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange?.("")}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center hover:bg-white/10 active:scale-90 text-white/90 shrink-0"
            aria-label="Clear query"
          >
            <CloseIcon size={17} />
          </button>
        )}

        {/* Chevron Up: Previous Match */}
        <button
          type="button"
          onClick={onPrevMatch}
          disabled={matchCount === 0}
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center hover:bg-white/10 active:scale-90 disabled:opacity-30 disabled:pointer-events-none text-white shrink-0"
          aria-label="Previous match"
        >
          <ChevronUpIcon size={20} />
        </button>

        {/* Chevron Down: Next Match */}
        <button
          type="button"
          onClick={onNextMatch}
          disabled={matchCount === 0}
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center hover:bg-white/10 active:scale-90 disabled:opacity-30 disabled:pointer-events-none text-white shrink-0"
          aria-label="Next match"
        >
          <ChevronDownIcon size={20} />
        </button>
      </header>
    );
  }

  // ---------------- STANDARD WHATSAPP CONTACT HEADER ----------------
  return (
    <header className="chat-header relative flex items-center gap-1.5 px-2.5 sm:px-3 py-2 bg-[#008069] text-white min-h-[60px] pt-[max(0.5rem,env(safe-area-inset-top))] shadow-sm z-30 select-none shrink-0">
      {/* Back button */}
      <button
        type="button"
        onClick={onBack}
        className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center hover:bg-white/10 active:scale-95 transition-all shrink-0"
        aria-label="Back"
      >
        <BackIcon size={22} />
      </button>

      {/* Contact Profile Info */}
      <button
        type="button"
        onClick={onOpenProfile}
        className="flex items-center gap-2 flex-1 min-w-0 text-left hover:opacity-90 transition-opacity"
        aria-label="View Business Profile"
      >
        <AppAvatar size={38} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1 min-w-0">
            <span className="font-semibold text-[15.5px] text-white truncate">
              Pushkaralu Help
            </span>
            <VerifiedIcon size={15} className="shrink-0" />
          </div>
          <div className="text-[12px] text-white/85 leading-tight truncate">
            {typing ? "typing…" : "Official Business Account"}
          </div>
        </div>
      </button>

      {/* Action Icons */}
      <div className="flex items-center gap-0.5 shrink-0 pr-0.5">
        <button
          type="button"
          onClick={handleCall}
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center hover:bg-white/10 active:scale-95 transition-all text-white"
          aria-label="Emergency Call 112"
          title="Emergency Call 112"
        >
          <CallIcon size={19} />
        </button>

        <button
          type="button"
          onClick={onOpenSearch}
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center hover:bg-white/10 active:scale-95 transition-all text-white"
          aria-label="Search conversation"
          title="Search"
        >
          <SearchIcon size={19} />
        </button>

        {/* 3-Dots More Menu */}
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setShowMenu(!showMenu)}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center hover:bg-white/10 active:scale-95 transition-all text-white"
            aria-label="More options"
          >
            <MoreIcon size={20} />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-full mt-1 w-52 bg-white rounded-xl shadow-2xl py-1.5 z-50 text-[#111b21] border border-black/5 animate-in fade-in zoom-in-95 duration-100">
              <button
                type="button"
                onClick={() => {
                  setShowMenu(false);
                  onOpenProfile();
                }}
                className="w-full text-left px-4 py-2.5 text-[14.5px] hover:bg-[#f5f6f6] flex items-center justify-between"
              >
                <span>View business profile</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowMenu(false);
                  onOpenSearch();
                }}
                className="w-full text-left px-4 py-2.5 text-[14.5px] hover:bg-[#f5f6f6]"
              >
                Search chat
              </button>

              <div className="h-px bg-[#e9edef] my-1" />

              <button
                type="button"
                onClick={() => {
                  setShowMenu(false);
                  onExportChat();
                }}
                className="w-full text-left px-4 py-2.5 text-[14.5px] hover:bg-[#f5f6f6]"
              >
                Export chat (.txt)
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowMenu(false);
                  if (confirm("Are you sure you want to clear this chat?")) {
                    onClearChat();
                  }
                }}
                className="w-full text-left px-4 py-2.5 text-[14.5px] text-red-600 hover:bg-red-50"
              >
                Clear chat
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
