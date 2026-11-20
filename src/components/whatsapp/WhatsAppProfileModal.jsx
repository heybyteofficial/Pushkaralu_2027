import React, { useState } from "react";
import apLogo from "@/assets/ap-govt-logo.png";
import swiggyMap from "@/assets/swiggy_map.png";
import templeCover from "@/assets/temple_cover.png";
import waterCover from "@/assets/water_cover.png";
import foodCover from "@/assets/food_cover.png";
import photoMetric from "@/assets/PhotoMetric.png";
import {
  AppAvatar,
  BackIcon,
  BellIcon,
  BellOffIcon,
  BlockIcon,
  BuildingIcon,
  CallIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  ClockIcon,
  CloseIcon,
  ForwardIcon,
  GlobeIcon,
  LockIcon,
  MailIcon,
  MoreIcon,
  PinIcon,
  ReportIcon,
  SearchIcon,
  VerifiedIcon,
  VideoIcon,
} from "./icons";

// Authentic WhatsApp 60-digit security code
const SECURITY_DIGITS = [
  "84729", "10635", "48291", "74650",
  "38291", "07465", "91827", "36450",
  "55281", "64039", "27184", "90316",
];

// WhatsApp Business Catalog Items
const CATALOG_ITEMS = [
  {
    id: "missing-reg",
    title: "Missing Person Registration",
    subtitle: "Instant facial AI match & alert",
    image: photoMetric,
    badge: "Official Bureau",
    description: "Upload pilgrim photo once. If separated, 100+ volunteer patrol units match faces instantly.",
  },
  {
    id: "ghat-nav",
    title: "Live Ghat Crowd & Navigation",
    subtitle: "Real-time bathing ghat queue status",
    image: swiggyMap,
    badge: "Live GPS",
    description: "Check live occupancy, parking availability, and fastest walking routes to Pushkar ghats.",
  },
  {
    id: "emergency-dispatch",
    title: "Ambulance & Police Patrol",
    subtitle: "Emergency rapid response units",
    image: templeCover,
    badge: "24x7 Active",
    description: "Direct dispatch for 108 ambulances, river rescue boats, and police fast-response teams.",
  },
  {
    id: "amenities",
    title: "Annaprasadam & Drinking Water",
    subtitle: "Free food and hydration points",
    image: waterCover,
    badge: "Citizen Welfare",
    description: "Verified locations of continuous water stalls, first aid kiosks, and prasadam centers.",
  },
];

export function WhatsAppProfileModal({
  onClose,
  onOpenSearch,
  onClearChat,
  onExportChat,
}) {
  const [screen, setScreen] = useState("main"); // 'main' | 'security' | 'avatar' | 'catalog-item'
  const [selectedCatalog, setSelectedCatalog] = useState(null);
  const [muted, setMuted] = useState(false);
  const [disappearing, setDisappearing] = useState("Off");
  const [chatLocked, setChatLocked] = useState(false);
  const [hoursExpanded, setHoursExpanded] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [toast, setToast] = useState("");

  const triggerToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2400);
  };

  const handleShare = async () => {
    setShowMenu(false);
    const shareData = {
      title: "Pushkaralu Help — Official Business Account",
      text: "Government of Andhra Pradesh Pushkaralu 2027 Missing Persons & Citizen Assistance Helpline: +91 99594 01213",
      url: window.location.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        if (err.name === "AbortError") return;
      }
    }
    try {
      await navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`);
      triggerToast("Contact link copied to clipboard");
    } catch {
      triggerToast("Unable to share from this browser");
    }
  };

  const handleCall = () => {
    window.location.href = "tel:112";
  };

  const handleVideoCall = () => {
    triggerToast("Video calls are not supported by this business account");
  };

  // =========================================================================
  // SUB-SCREEN 1: WhatsApp 60-Digit Security Code & QR Verification Screen
  // =========================================================================
  if (screen === "security") {
    return (
      <div className="absolute inset-0 z-50 flex flex-col bg-[#f0f2f5] select-none animate-in fade-in duration-150 overflow-hidden">
        {/* Header */}
        <header className="flex items-center gap-3 px-3 pt-[max(0.6rem,env(safe-area-inset-top))] pb-2.5 bg-[#008069] text-white shrink-0 shadow-sm">
          <button
            type="button"
            onClick={() => setScreen("main")}
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-white/10 active:scale-95 transition-all"
            aria-label="Back"
          >
            <BackIcon size={22} />
          </button>
          <span className="font-semibold text-[17px]">Verify security code</span>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto scrollbar-hide p-4 flex flex-col items-center">
          {/* QR Box */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-black/5 flex flex-col items-center max-w-xs w-full mt-2">
            {/* SVG QR Code Simulation */}
            <div className="w-48 h-48 bg-[#f5f6f6] rounded-xl p-3 flex flex-col items-center justify-center border border-black/10 relative">
              <svg viewBox="0 0 24 24" className="w-40 h-40 text-[#111b21]" fill="currentColor">
                <path d="M3 3h8v8H3zm2 2v4h4V5zm8-2h8v8h-8zm2 2v4h4V5zM3 13h8v8H3zm2 2v4h4v-4zm13-2h3v2h-3zm-5 0h3v3h-3zm2 3h3v2h-3zm-2 2h2v3h-2zm3 0h3v3h-3zm2-2h3v3h-3zM5 5h4v4H5zm10 0h4v4h-4zM5 15h4v4H5z" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-white p-0.5 shadow-sm border border-black/10 flex items-center justify-center">
                  <AppAvatar size={34} />
                </div>
              </div>
            </div>

            <p className="text-[12.5px] text-[#54656f] text-center mt-4 leading-relaxed">
              Scan this code on another device or compare the 60-digit number below to verify that messages and calls with Pushkaralu Help are end-to-end encrypted.
            </p>
          </div>

          {/* 60-digit security numbers */}
          <div className="bg-white rounded-2xl shadow-sm border border-black/5 p-4 max-w-xs w-full mt-3">
            <div className="grid grid-cols-4 gap-y-2 gap-x-1 text-center font-mono text-[13.5px] font-semibold text-[#111b21] tracking-wide">
              {SECURITY_DIGITS.map((block, idx) => (
                <span key={idx}>{block}</span>
              ))}
            </div>
          </div>

          <div className="mt-4 max-w-xs text-center text-[12px] text-[#54656f] pb-6">
            <p>
              Learn more about WhatsApp end-to-end encryption at{" "}
              <span className="text-[#008069] font-medium">whatsapp.com/security</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // SUB-SCREEN 2: Full Screen Profile Avatar Lightbox
  // =========================================================================
  if (screen === "avatar") {
    return (
      <div className="absolute inset-0 z-50 flex flex-col bg-black select-none animate-in fade-in duration-150">
        <header className="flex items-center justify-between px-3 pt-[max(0.6rem,env(safe-area-inset-top))] pb-2 text-white shrink-0 bg-black/60 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setScreen("main")}
              className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-white/10 active:scale-95 text-white"
              aria-label="Back"
            >
              <BackIcon size={22} />
            </button>
            <span className="font-semibold text-[16px]">Pushkaralu Help</span>
          </div>
          <button
            type="button"
            onClick={handleShare}
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-white/10 active:scale-95 text-white"
            aria-label="Share"
          >
            <ForwardIcon size={20} />
          </button>
        </header>
        <div className="flex-1 flex items-center justify-center p-4">
          <img
            src={apLogo}
            alt="Pushkaralu Help AP Government"
            className="w-72 h-72 object-contain bg-white rounded-full p-2 shadow-2xl border-2 border-white/20"
          />
        </div>
      </div>
    );
  }

  // =========================================================================
  // SUB-SCREEN 3: WhatsApp Catalog Item Detail Modal
  // =========================================================================
  if (screen === "catalog-item" && selectedCatalog) {
    return (
      <div className="absolute inset-0 z-50 flex flex-col bg-[#f0f2f5] select-none animate-in fade-in duration-150 overflow-hidden">
        <header className="flex items-center justify-between px-3 pt-[max(0.6rem,env(safe-area-inset-top))] pb-2.5 bg-[#008069] text-white shrink-0 shadow-sm">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setScreen("main");
                setSelectedCatalog(null);
              }}
              className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-white/10 active:scale-95 transition-all"
              aria-label="Back"
            >
              <BackIcon size={22} />
            </button>
            <span className="font-semibold text-[17px]">Service Details</span>
          </div>
          <button
            type="button"
            onClick={handleShare}
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-white/10 active:scale-95"
          >
            <ForwardIcon size={20} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto scrollbar-hide pb-6">
          <div className="w-full h-56 bg-black relative">
            <img
              src={selectedCatalog.image}
              alt={selectedCatalog.title}
              className="w-full h-full object-cover"
            />
            <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full bg-[#00a884] text-white text-[11px] font-bold shadow-md">
              {selectedCatalog.badge}
            </span>
          </div>

          <div className="bg-white p-4 border-b border-[#e9edef]">
            <h2 className="text-[19px] font-bold text-[#111b21]">{selectedCatalog.title}</h2>
            <p className="text-[13.5px] font-medium text-[#008069] mt-0.5">{selectedCatalog.subtitle}</p>
          </div>

          <div className="bg-white p-4 mt-2.5 border-y border-[#e9edef] space-y-2">
            <h4 className="text-[12px] font-bold uppercase tracking-wider text-[#54656f]">Description</h4>
            <p className="text-[14.5px] text-[#111b21] leading-relaxed">{selectedCatalog.description}</p>
          </div>

          <div className="p-4 mt-3">
            <button
              type="button"
              onClick={() => {
                setScreen("main");
                onClose();
              }}
              className="w-full py-3 rounded-full bg-[#00a884] hover:bg-[#008069] active:scale-95 text-white font-medium text-[15px] shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <span>Message Business About This Service</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // MAIN SCREEN: Authentic WhatsApp Official Business Profile
  // =========================================================================
  return (
    <div className="absolute inset-0 z-50 flex flex-col bg-[#f0f2f5] select-none animate-in fade-in duration-150 overflow-hidden">
      {/* Toast Notification */}
      {toast && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 bg-[#111b21]/95 text-white text-[13px] font-medium px-4 py-2 rounded-full shadow-xl animate-in fade-in duration-150 pointer-events-none">
          {toast}
        </div>
      )}

      {/* Top Navigation Bar */}
      <header className="flex items-center justify-between px-2 sm:px-3 pt-[max(0.6rem,env(safe-area-inset-top))] pb-2.5 bg-[#008069] text-white shrink-0 shadow-sm z-30">
        <button
          type="button"
          onClick={onClose}
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center hover:bg-white/10 active:scale-95 transition-all text-white"
          aria-label="Back to chat"
        >
          <BackIcon size={22} />
        </button>

        <span className="font-semibold text-[17px] text-white truncate max-w-[220px]">
          Business Details
        </span>

        {/* 3-Dots More Options Menu */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowMenu(!showMenu)}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center hover:bg-white/10 active:scale-95 transition-all text-white"
            aria-label="More options"
          >
            <MoreIcon size={20} />
          </button>

          {showMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
              <div className="absolute right-0 top-full mt-1 w-52 bg-white rounded-xl shadow-2xl py-1.5 z-50 text-[#111b21] border border-black/5 animate-in fade-in zoom-in-95 duration-100">
                <button
                  type="button"
                  onClick={handleShare}
                  className="w-full text-left px-4 py-2.5 text-[14px] hover:bg-[#f5f6f6]"
                >
                  Share contact
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowMenu(false);
                    setScreen("security");
                  }}
                  className="w-full text-left px-4 py-2.5 text-[14px] hover:bg-[#f5f6f6]"
                >
                  Verify security code
                </button>
                <div className="h-px bg-[#e9edef] my-1" />
                <button
                  type="button"
                  onClick={() => {
                    setShowMenu(false);
                    onExportChat?.();
                    triggerToast("Chat exported");
                  }}
                  className="w-full text-left px-4 py-2.5 text-[14px] hover:bg-[#f5f6f6]"
                >
                  Export chat (.txt)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowMenu(false);
                    if (confirm("Are you sure you want to clear this chat?")) {
                      onClearChat?.();
                      triggerToast("Chat cleared");
                    }
                  }}
                  className="w-full text-left px-4 py-2.5 text-[14px] text-red-600 hover:bg-red-50"
                >
                  Clear chat
                </button>
              </div>
            </>
          )}
        </div>
      </header>

      {/* Scrollable Profile Body */}
      <div className="flex-1 overflow-y-auto scrollbar-hide pb-[max(2rem,env(safe-area-inset-bottom))]">
        {/* ================================================================= */}
        {/* 1. TOP HEADER & IDENTITY CARD                                     */}
        {/* ================================================================= */}
        <div className="bg-white pt-6 pb-5 px-4 flex flex-col items-center text-center border-b border-[#e9edef] shadow-xs">
          {/* Avatar with tap-to-view */}
          <button
            type="button"
            onClick={() => setScreen("avatar")}
            className="relative group active:scale-95 transition-transform"
            title="Click to view full image"
          >
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden bg-white p-1 shadow-md border border-black/10">
              <img
                src={apLogo}
                alt="Pushkaralu Help"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/10 transition-colors" />
          </button>

          {/* Business Name with Verified Badge */}
          <div className="flex items-center justify-center gap-1.5 mt-3 max-w-full">
            <h1 className="text-[21px] font-bold text-[#111b21] truncate">
              Pushkaralu Help
            </h1>
            <VerifiedIcon size={20} className="shrink-0" />
          </div>

          {/* Official Business Account Tag */}
          <span className="text-[13px] text-[#008069] font-semibold mt-0.5">
            Official Business Account
          </span>

          {/* Primary Phone */}
          <p className="text-[14.5px] text-[#54656f] mt-1 font-mono">
            +91 99594 01213
          </p>

          {/* =============================================================== */}
          {/* 2. WHATSAPP 4-ACTION QUICK ROW                                  */}
          {/* =============================================================== */}
          <div className="grid grid-cols-4 gap-2 w-full max-w-xs mt-4 pt-3 border-t border-[#f0f2f5]">
            {/* Audio Call */}
            <button
              type="button"
              onClick={handleCall}
              className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-[#f5f6f6] active:scale-95 transition-all text-[#008069]"
              title="Audio call"
            >
              <div className="w-10 h-10 rounded-full border border-[#00a884]/30 bg-[#e7f6ef] flex items-center justify-center">
                <CallIcon size={19} />
              </div>
              <span className="text-[12px] font-medium text-[#111b21]">Audio</span>
            </button>

            {/* Video Call */}
            <button
              type="button"
              onClick={handleVideoCall}
              className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-[#f5f6f6] active:scale-95 transition-all text-[#008069]"
              title="Video call"
            >
              <div className="w-10 h-10 rounded-full border border-[#00a884]/30 bg-[#e7f6ef] flex items-center justify-center">
                <VideoIcon size={19} />
              </div>
              <span className="text-[12px] font-medium text-[#111b21]">Video</span>
            </button>

            {/* Search */}
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenSearch?.();
              }}
              className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-[#f5f6f6] active:scale-95 transition-all text-[#008069]"
              title="Search chat"
            >
              <div className="w-10 h-10 rounded-full border border-[#00a884]/30 bg-[#e7f6ef] flex items-center justify-center">
                <SearchIcon size={19} />
              </div>
              <span className="text-[12px] font-medium text-[#111b21]">Search</span>
            </button>

            {/* Share */}
            <button
              type="button"
              onClick={handleShare}
              className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-[#f5f6f6] active:scale-95 transition-all text-[#008069]"
              title="Share profile"
            >
              <div className="w-10 h-10 rounded-full border border-[#00a884]/30 bg-[#e7f6ef] flex items-center justify-center">
                <ForwardIcon size={19} />
              </div>
              <span className="text-[12px] font-medium text-[#111b21]">Share</span>
            </button>
          </div>
        </div>

        {/* ================================================================= */}
        {/* 3. OFFICIAL BUSINESS VERIFICATION BANNER                          */}
        {/* ================================================================= */}
        <div className="bg-[#e7f6ef] border border-[#00a884]/20 rounded-2xl p-3.5 mx-3 mt-3 flex items-start gap-3">
          <VerifiedIcon size={20} className="shrink-0 mt-0.5" />
          <div className="flex-1 text-[13px] leading-relaxed text-[#111b21]">
            <span className="font-bold text-[#008069]">Official business account</span>
            <p className="text-[#54656f] mt-0.5">
              WhatsApp has verified that this is the official account of the Government of Andhra Pradesh for Godavari & Krishna Pushkaralu 2027 Missing Persons & Citizen Safety Helpline.
            </p>
          </div>
        </div>

        {/* ================================================================= */}
        {/* 4. BUSINESS DETAILS CARD                                          */}
        {/* ================================================================= */}
        <div className="bg-white rounded-2xl mx-3 mt-3 p-4 shadow-xs border border-black/5 divide-y divide-[#f0f2f5]">
          {/* About */}
          <div className="pb-3.5 flex items-start gap-3.5">
            <div className="text-[#54656f] mt-0.5 shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 12h-2v-2h2v2zm0-4h-2V6h2v4z" />
              </svg>
            </div>
            <div className="flex-1">
              <span className="text-[12px] font-semibold uppercase tracking-wider text-[#667781]">
                About & Services
              </span>
              <p className="text-[14px] text-[#111b21] leading-relaxed mt-1">
                Official 24x7 Government of Andhra Pradesh citizen assistance, pilgrim crowd safety, ghat density tracking, and missing person reunification bureau for Pushkaralu 2027.
              </p>
            </div>
          </div>

          {/* Category */}
          <div className="py-3.5 flex items-start gap-3.5">
            <BuildingIcon size={20} className="text-[#54656f] mt-0.5 shrink-0" />
            <div className="flex-1">
              <span className="text-[12px] font-semibold uppercase tracking-wider text-[#667781]">
                Category
              </span>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                <span className="px-2.5 py-0.5 rounded-full bg-[#f0f2f5] text-[#111b21] text-[12px] font-medium">
                  Government Organization
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#f0f2f5] text-[#111b21] text-[12px] font-medium">
                  Public Safety Service
                </span>
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="py-3.5 flex items-start gap-3.5">
            <PinIcon size={20} className="text-[#54656f] mt-0.5 shrink-0" />
            <div className="flex-1">
              <span className="text-[12px] font-semibold uppercase tracking-wider text-[#667781]">
                Address
              </span>
              <p className="text-[14px] text-[#111b21] mt-0.5 leading-snug">
                Central Police Command Centre, Riverfront Promenade, Vijayawada, Andhra Pradesh - 520001
              </p>
              <a
                href="https://maps.google.com/?q=Vijayawada+Riverfront+Promenade"
                target="_blank"
                rel="noreferrer"
                className="inline-block text-[#008069] text-[13px] font-semibold mt-1 hover:underline"
              >
                Get directions
              </a>
            </div>
          </div>

          {/* Business Hours */}
          <div className="py-3.5 flex items-start gap-3.5">
            <ClockIcon size={20} className="text-[#54656f] mt-0.5 shrink-0" />
            <div className="flex-1">
              <span className="text-[12px] font-semibold uppercase tracking-wider text-[#667781]">
                Hours
              </span>
              <button
                type="button"
                onClick={() => setHoursExpanded(!hoursExpanded)}
                className="w-full flex items-center justify-between text-left mt-0.5 group"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#00a884] animate-pulse" />
                  <span className="text-[14px] font-semibold text-[#00a884]">
                    Open 24 hours
                  </span>
                  <span className="text-[12.5px] text-[#54656f]">(Always open)</span>
                </div>
                {hoursExpanded ? (
                  <ChevronUpIcon size={18} className="text-[#54656f]" />
                ) : (
                  <ChevronDownIcon size={18} className="text-[#54656f]" />
                )}
              </button>

              {/* Expandable Weekly Schedule */}
              {hoursExpanded && (
                <div className="mt-2.5 pt-2 border-t border-[#f0f2f5] space-y-1 text-[13px] text-[#111b21]">
                  {[
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                    "Sunday",
                  ].map((day) => (
                    <div key={day} className="flex justify-between py-0.5">
                      <span className="text-[#54656f]">{day}</span>
                      <span className="font-medium text-[#00a884]">Open 24 hours</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Websites */}
          <div className="py-3.5 flex items-start gap-3.5">
            <GlobeIcon size={20} className="text-[#54656f] mt-0.5 shrink-0" />
            <div className="flex-1">
              <span className="text-[12px] font-semibold uppercase tracking-wider text-[#667781]">
                Websites
              </span>
              <div className="flex flex-col gap-1 mt-1 text-[14px]">
                <a
                  href="https://pushkaralu2027.ap.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#008069] hover:underline truncate"
                >
                  https://pushkaralu2027.ap.gov.in
                </a>
                <a
                  href="https://ap.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#008069] hover:underline truncate"
                >
                  https://ap.gov.in
                </a>
              </div>
            </div>
          </div>

          {/* Email */}
          <div className="pt-3.5 flex items-start gap-3.5">
            <MailIcon size={20} className="text-[#54656f] mt-0.5 shrink-0" />
            <div className="flex-1">
              <span className="text-[12px] font-semibold uppercase tracking-wider text-[#667781]">
                Email
              </span>
              <a
                href="mailto:helpdesk@pushkaralu2027.ap.gov.in"
                className="block text-[14px] text-[#008069] hover:underline mt-0.5 truncate"
              >
                helpdesk@pushkaralu2027.ap.gov.in
              </a>
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* 5. WHATSAPP BUSINESS CATALOG CAROUSEL                             */}
        {/* ================================================================= */}
        <div className="bg-white rounded-2xl mx-3 mt-3 p-4 shadow-xs border border-black/5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[14px] font-bold text-[#111b21]">
              Catalog · 4 services
            </span>
            <span className="text-[12px] text-[#008069] font-semibold">
              Official Bureau
            </span>
          </div>

          {/* Horizontal scroll cards */}
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1 -mx-1 px-1">
            {CATALOG_ITEMS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setSelectedCatalog(item);
                  setScreen("catalog-item");
                }}
                className="flex-shrink-0 w-44 rounded-xl border border-[#e9edef] overflow-hidden hover:shadow-md transition-all text-left bg-white group active:scale-95"
              >
                <div className="w-full h-24 bg-gray-100 overflow-hidden relative">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-white text-[10px] font-medium">
                    {item.badge}
                  </span>
                </div>
                <div className="p-2.5">
                  <h4 className="text-[13px] font-bold text-[#111b21] line-clamp-1">
                    {item.title}
                  </h4>
                  <p className="text-[11.5px] text-[#54656f] line-clamp-1 mt-0.5">
                    {item.subtitle}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ================================================================= */}
        {/* 6. MEDIA, LINKS, AND DOCS                                         */}
        {/* ================================================================= */}
        <div className="bg-white rounded-2xl mx-3 mt-3 p-4 shadow-xs border border-black/5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[14px] font-bold text-[#111b21]">
              Media, links, and docs
            </span>
            <span className="text-[13px] text-[#54656f] font-medium flex items-center">
              14 <ChevronRightIcon size={16} className="inline ml-0.5" />
            </span>
          </div>

          {/* 4 Media Previews */}
          <div className="grid grid-cols-4 gap-2">
            <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 border border-black/5">
              <img src={swiggyMap} alt="Media 1" className="w-full h-full object-cover" />
            </div>
            <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 border border-black/5">
              <img src={templeCover} alt="Media 2" className="w-full h-full object-cover" />
            </div>
            <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 border border-black/5">
              <img src={foodCover} alt="Media 3" className="w-full h-full object-cover" />
            </div>
            <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 border border-black/5">
              <img src={waterCover} alt="Media 4" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* 7. CHAT SETTINGS & PRIVACY (MUTE, ENCRYPTION, DISAPPEARING)       */}
        {/* ================================================================= */}
        <div className="bg-white rounded-2xl mx-3 mt-3 overflow-hidden shadow-xs border border-black/5 divide-y divide-[#f0f2f5]">
          {/* Mute Notifications */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {muted ? (
                <BellOffIcon size={20} className="text-[#54656f]" />
              ) : (
                <BellIcon size={20} className="text-[#54656f]" />
              )}
              <span className="text-[14.5px] font-medium text-[#111b21]">
                Mute notifications
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                const next = !muted;
                setMuted(next);
                triggerToast(next ? "Notifications muted" : "Notifications unmuted");
              }}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                muted ? "bg-[#00a884]" : "bg-[#aebac1]"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                  muted ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Media Visibility */}
          <button
            type="button"
            onClick={() => triggerToast("Media visibility set to Default (Yes)")}
            className="w-full p-4 flex items-center justify-between text-left hover:bg-[#f5f6f6]"
          >
            <div className="flex items-center gap-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-[#54656f]">
                <path d="M21 19V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
              </svg>
              <div className="flex flex-col">
                <span className="text-[14.5px] font-medium text-[#111b21]">
                  Media visibility
                </span>
                <span className="text-[12.5px] text-[#54656f]">Default (Yes)</span>
              </div>
            </div>
            <ChevronRightIcon size={18} className="text-[#54656f]" />
          </button>

          {/* Disappearing Messages */}
          <button
            type="button"
            onClick={() => {
              const next = disappearing === "Off" ? "24 hours" : disappearing === "24 hours" ? "7 days" : "Off";
              setDisappearing(next);
              triggerToast(`Disappearing messages: ${next}`);
            }}
            className="w-full p-4 flex items-center justify-between text-left hover:bg-[#f5f6f6]"
          >
            <div className="flex items-center gap-3">
              <ClockIcon size={20} className="text-[#54656f]" />
              <div className="flex flex-col">
                <span className="text-[14.5px] font-medium text-[#111b21]">
                  Disappearing messages
                </span>
                <span className="text-[12.5px] text-[#54656f]">{disappearing}</span>
              </div>
            </div>
            <ChevronRightIcon size={18} className="text-[#54656f]" />
          </button>

          {/* Chat Lock */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <LockIcon size={20} className="text-[#54656f]" />
              <div className="flex flex-col">
                <span className="text-[14.5px] font-medium text-[#111b21]">
                  Lock chat
                </span>
                <span className="text-[12px] text-[#54656f]">
                  Lock and hide this chat on this device
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                const next = !chatLocked;
                setChatLocked(next);
                triggerToast(next ? "Chat locked with device passcode" : "Chat unlocked");
              }}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 shrink-0 ${
                chatLocked ? "bg-[#00a884]" : "bg-[#aebac1]"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                  chatLocked ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Encryption (Clickable -> Opens 60-digit WhatsApp security code sheet) */}
          <button
            type="button"
            onClick={() => setScreen("security")}
            className="w-full p-4 flex items-start gap-3 text-left hover:bg-[#f5f6f6] active:bg-[#e9edef] transition-colors"
          >
            <LockIcon size={20} className="text-[#008069] mt-0.5 shrink-0" />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-[14.5px] font-semibold text-[#111b21]">
                  Encryption
                </span>
                <ChevronRightIcon size={18} className="text-[#54656f]" />
              </div>
              <p className="text-[12.5px] text-[#54656f] leading-relaxed mt-0.5">
                Messages and calls are end-to-end encrypted. Tap to verify with 60-digit security code.
              </p>
            </div>
          </button>
        </div>

        {/* ================================================================= */}
        {/* 8. EMERGENCY 24X7 HOTLINES DIRECT ACCESS                          */}
        {/* ================================================================= */}
        <div className="bg-white rounded-2xl mx-3 mt-3 p-4 shadow-xs border border-black/5">
          <div className="text-[12px] font-bold uppercase tracking-wider text-[#008069] mb-3">
            Emergency Direct Dispatch
          </div>
          <div className="grid grid-cols-2 gap-2 text-[13px]">
            <a
              href="tel:112"
              className="p-2.5 rounded-xl bg-[#f5f6f6] hover:bg-[#e7f6ef] border border-black/5 flex flex-col no-underline text-inherit active:scale-95 transition-all"
            >
              <span className="font-bold text-[#008069]">🚨 112</span>
              <span className="text-[12px] text-[#54656f]">National Emergency</span>
            </a>
            <a
              href="tel:100"
              className="p-2.5 rounded-xl bg-[#f5f6f6] hover:bg-[#e7f6ef] border border-black/5 flex flex-col no-underline text-inherit active:scale-95 transition-all"
            >
              <span className="font-bold text-[#008069]">🚓 100</span>
              <span className="text-[12px] text-[#54656f]">Police Patrol</span>
            </a>
            <a
              href="tel:108"
              className="p-2.5 rounded-xl bg-[#f5f6f6] hover:bg-[#e7f6ef] border border-black/5 flex flex-col no-underline text-inherit active:scale-95 transition-all"
            >
              <span className="font-bold text-[#008069]">🚑 108</span>
              <span className="text-[12px] text-[#54656f]">Ambulance / Medical</span>
            </a>
            <a
              href="tel:1098"
              className="p-2.5 rounded-xl bg-[#f5f6f6] hover:bg-[#e7f6ef] border border-black/5 flex flex-col no-underline text-inherit active:scale-95 transition-all"
            >
              <span className="font-bold text-[#008069]">👶 1098</span>
              <span className="text-[12px] text-[#54656f]">Child Helpline</span>
            </a>
          </div>
        </div>

        {/* ================================================================= */}
        {/* 9. REPORT & BLOCK DANGER ZONE                                     */}
        {/* ================================================================= */}
        <div className="bg-white rounded-2xl mx-3 mt-3 mb-6 overflow-hidden shadow-xs border border-black/5 divide-y divide-[#f0f2f5]">
          <button
            type="button"
            onClick={() => {
              if (confirm("Block Pushkaralu Help? Blocked contacts cannot call or send you messages.")) {
                triggerToast("Contact blocked");
              }
            }}
            className="w-full p-4 flex items-center gap-3 text-left hover:bg-red-50 text-[#ea0038] active:scale-98 transition-all"
          >
            <BlockIcon size={20} className="shrink-0" />
            <span className="text-[14.5px] font-semibold">Block Pushkaralu Help</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (confirm("Report Pushkaralu Help to WhatsApp? The last 5 messages from this business will be forwarded.")) {
                triggerToast("Report sent to WhatsApp");
              }
            }}
            className="w-full p-4 flex items-center gap-3 text-left hover:bg-red-50 text-[#ea0038] active:scale-98 transition-all"
          >
            <ReportIcon size={20} className="shrink-0" />
            <span className="text-[14.5px] font-semibold">Report business</span>
          </button>
        </div>
      </div>
    </div>
  );
}
