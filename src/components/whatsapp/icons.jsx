import React from "react";
import apLogo from "@/assets/ap-govt-logo.png";

const svg = (d, vb = "0 0 24 24") =>
  ({ size = 24, className = "" }) => (
    <svg
      width={size}
      height={size}
      viewBox={vb}
      className={className}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d={d} />
    </svg>
  );

export const BackIcon = svg(
  "M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"
);

export const VideoIcon = svg(
  "M17 10.5V7a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3.5l4 4v-11l-4 4z"
);

export const CallIcon = svg(
  "M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 0 0-1.01.24l-2.2 2.2a15.05 15.05 0 0 1-6.59-6.59l2.2-2.21a.96.96 0 0 0 .25-1.01A11.36 11.36 0 0 1 8.57 3.9c0-.55-.45-1-1-1H4.02c-.55 0-1 .45-1 1 0 9.39 7.63 17.02 17.02 17.02.55 0 1-.45 1-1v-3.55c0-.55-.45-.99-.99-.99z"
);

export const SearchIcon = svg(
  "M15.9 14.3H15l-.3-.3c1-1.1 1.6-2.6 1.6-4.2C16.3 6.2 13.6 3.5 10.1 3.5S4 6.2 4 9.8s2.7 6.3 6.1 6.3c1.6 0 3.1-.6 4.2-1.6l.3.3v.9l5.7 5.7 1.7-1.7-6.1-5.6zm-5.8 0c-2.5 0-4.5-2-4.5-4.5s2-4.5 4.5-4.5 4.5 2 4.5 4.5-2 4.5-4.5 4.5z"
);

export const MoreIcon = svg(
  "M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
);

export const SendIcon = svg(
  "M3.4 20.4l17.45-7.48a1 1 0 0 0 0-1.84L3.4 3.6a.993.993 0 0 0-1.39.91L2 9.12c0 .5.37.93.87.99L17 12 2.87 13.88c-.5.07-.87.5-.87 1l.01 4.61c0 .71.73 1.2 1.39.91z"
);

export const MicIcon = svg(
  "M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5-3c0 2.5-2 4.5-5 4.5s-5-2-5-4.5H5.5c0 3.14 2.37 5.73 5.4 6.18V21h2.2v-2.82c3.03-.45 5.4-3.04 5.4-6.18H17z"
);

export const ClipIcon = ({ size = 24, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
  </svg>
);

export const CameraIcon = ({ size = 24, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M12 9a3.75 3.75 0 1 0 0 7.5A3.75 3.75 0 0 0 12 9m0 6a2.25 2.25 0 1 1 0-4.5 2.25 2.25 0 0 1 0 4.5m8-9h-3.15l-.75-1h-8.2l-.75 1H4a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2m.5 13a.5.5 0 0 1-.5.5H4a.5.5 0 0 1-.5-.5V7a.5.5 0 0 1 .5-.5h3.45l.75-1h7.6l.75 1H20a.5.5 0 0 1 .5.5z" />
  </svg>
);

export const CameraSolidIcon = ({ size = 24, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M9.414 4.828A2 2 0 0 1 10.828 4.243h2.344a2 2 0 0 1 1.414.585l1.414 1.415H19a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3v-8a3 3 0 0 1 3-3h2.999l1.415-1.414zM12 17a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9zm0-2a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"
    />
    <circle cx="18" cy="9.5" r="0.9" fill="currentColor" />
  </svg>
);

export const EmojiIcon = svg(
  "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-3.5-9.5c.83 0 1.5-.67 1.5-1.5S9.33 7.5 8.5 7.5 7 8.17 7 9s.67 1.5 1.5 1.5zm7 0c.83 0 1.5-.67 1.5-1.5S16.33 7.5 15.5 7.5 14 8.17 14 9s.67 1.5 1.5 1.5zm-3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"
);

export const ListIcon = svg(
  "M3 13h2v-2H3zm0 4h2v-2H3zm0-8h2V7H3zm4 4h14v-2H7zm0 4h14v-2H7zM7 7v2h14V7z"
);

export const ReplyIcon = svg(
  "M10 9V5l-7 7 7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11z"
);

export const PinIcon = svg(
  "M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"
);

export const ChevronUpIcon = svg("M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z");
export const ChevronDownIcon = svg("M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z");
export const ChevronRightIcon = svg("M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z");

export const GlobeIcon = svg(
  "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"
);

export const MailIcon = svg(
  "M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"
);

export const ClockIcon = svg(
  "M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"
);

export const BuildingIcon = svg(
  "M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"
);

export const BellIcon = svg(
  "M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z"
);

export const BellOffIcon = svg(
  "M20 18.69L7.84 6.14 5.27 3.49 4 4.76l2.8 2.8v3.44l-2 2v1h13.73l2.25 2.25 1.27-1.27-2.05-2.29zM8 17v-4.8l4.8 4.8H8zm4 5c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm4-6.88V11c0-2.48-1.51-4.5-4-4.5-.7 0-1.34.16-1.92.44l1.51 1.51c.14-.01.27-.03.41-.03 1.38 0 2.5 1.12 2.5 2.5v1.88l1.5 1.5z"
);

export const ShieldCheckIcon = svg(
  "M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"
);

export const BlockIcon = svg(
  "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8 0-1.85.63-3.55 1.69-4.9L16.9 18.31C15.55 19.37 13.85 20 12 20zm6.31-3.1L7.1 5.69C8.45 4.63 10.15 4 12 4c4.42 0 8 3.58 8 8 0 1.85-.63 3.55-1.69 4.9z"
);

export const ReportIcon = svg("M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6z");

export const QrCodeIcon = svg(
  "M3 3h8v8H3zm2 2v4h4V5zm8-2h8v8h-8zm2 2v4h4V5zM3 13h8v8H3zm2 2v4h4v-4zm13-2h3v2h-3zm-5 0h3v3h-3zm2 3h3v2h-3zm-2 2h2v3h-2zm3 0h3v3h-3zm2-2h3v3h-3z"
);

export const CloseIcon = svg(
  "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"
);

export const CropIcon = svg(
  "M17 15h2V7c0-1.1-.9-2-2-2H9v2h8v8zM7 17V1H5v4H1v2h4v10c0 1.1.9 2 2 2h10v4h2v-4h4v-2H7z"
);

export const PencilIcon = svg(
  "M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
);

export const TextIcon = svg("M5 4v3h5.5v12h3V7H19V4z");

export const GalleryIcon = svg(
  "M21 19V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"
);

export const FlipCameraIcon = svg(
  "M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46A7.93 7.93 0 0 0 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74A7.93 7.93 0 0 0 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"
);

export const FlashOnIcon = svg("M7 2v11h3v9l7-12h-4l4-8z");
export const FlashOffIcon = svg("M3.27 3L2 4.27l5 5V13h3v9l3.58-6.14L17.73 20 19 18.73 3.27 3zM17 10h-4l4-8H7v2.18l8.46 8.46L17 10z");
export const FlashAutoIcon = svg("M7 2v11h3v9l7-12h-4l4-8zM19 14h-1.5l-.6 1.8h-1.4l2.1-6h1.6l2.1 6h-1.4l-.6-1.8zm-1.2-3.8l-.4 1.4h1.1l-.4-1.4h-.3z");

export const UndoIcon = svg(
  "M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C20.81 11.02 17.04 8 12.5 8z"
);

export const StarIcon = svg(
  "M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
);

export const ForwardIcon = svg(
  "M14 9V5l7 7-7 7v-4.1c-5 0-8.5 1.6-11 5.1 1-5 4-10 11-11z"
);

export const CheckIcon = svg("M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z");

export const PlayIcon = svg("M8 5v14l11-7z");
export const PauseIcon = svg("M6 19h4V5H6v14zm8-14v14h4V5h-4z");

export const DocumentIcon = svg(
  "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"
);

export const HeadphonesIcon = svg(
  "M12 3a9 9 0 0 0-9 9v7a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-6a1 1 0 0 0-1-1H5v-1a7 7 0 1 1 14 0v1h-3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7a9 9 0 0 0-9-9z"
);

export const ContactCardIcon = svg(
  "M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
);

export const PollIcon = svg(
  "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"
);

export const HdIcon = ({ active = false, className = "" }) => (
  <span
    className={`inline-flex items-center justify-center px-1.5 py-0.5 rounded border text-[11px] font-bold leading-none select-none transition-colors ${
      active
        ? "border-[#00a884] bg-[#00a884]/20 text-[#00a884]"
        : "border-white/60 text-white/80 hover:text-white"
    } ${className}`}
  >
    HD
  </span>
);

export const LockIcon = svg(
  "M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"
);

export const TrashIcon = svg(
  "M15 4V3H9v1H4v2h1v13c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V6h1V4h-5zm2 15H7V6h10v13zM9 8h2v9H9V8zm4 0h2v9h-2V8z"
);

export const ViewOnceIcon = ({ active = false, size = 20, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    aria-label="View Once"
  >
    <circle
      cx="12"
      cy="12"
      r="9.5"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeDasharray={active ? "none" : "3.5 2.5"}
      fill={active ? "currentColor" : "none"}
    />
    <path
      d="M11.5 8.5L10 9.5V10.8L11.5 9.8V15.5H13V8.5H11.5Z"
      fill={active ? "#ffffff" : "currentColor"}
    />
  </svg>
);

export const VerifiedIcon = ({ size = 16, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    className={className}
    aria-label="Verified Official Business"
  >
    <path
      fill="#25D366"
      d="M12 1l2.4 2.1 3.1-.4 1 3 2.9 1.4-.6 3.1L22.5 13l-2 2.4.3 3.1-3 1-1.5 2.8-3.1-.6L12 23l-2.3-2.1-3.1.5-1-3-2.8-1.5.6-3.1L1.5 11l2-2.4-.3-3.1 3-1L7.7 1.8l3.1.6z"
    />
    <path fill="#fff" d="M10.5 15.6l-3.3-3.3 1.4-1.4 1.9 1.9 4.9-4.9 1.4 1.4z" />
  </svg>
);

export const Ticks = ({ status = "sent" }) => {
  if (status === "sending") {
    return (
      <svg width="13" height="13" viewBox="0 0 24 24" className="tick text-[#8696a0]" aria-label="Sending">
        <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="2.2" />
        <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="2.2" fill="none" />
      </svg>
    );
  }

  const double = status !== "sent";
  const isRead = status === "read";

  return (
    <svg
      width="16"
      height="11"
      viewBox="0 0 17 11"
      className={`tick inline-block transition-colors ${isRead ? "text-[#53bdeb]" : "text-[#8696a0]"}`}
      aria-label={isRead ? "Read" : status === "delivered" ? "Delivered" : "Sent"}
    >
      <path d="M11.1.6L5.2 7.9 2.4 5.3 1.3 6.5l4 3.7L12.3 1.6z" fill="currentColor" />
      {double && <path d="M15.6.6L9.7 7.9l-.9-.8-1 1.3 2 1.8L16.8 1.6z" fill="currentColor" />}
    </svg>
  );
};

export const AppAvatar = ({ size = 40, className = "" }) => (
  <div
    style={{ width: size, height: size }}
    className={`relative shrink-0 rounded-full overflow-hidden bg-white flex items-center justify-center p-0.5 shadow-sm border border-black/10 ${className}`}
  >
    <img src={apLogo} alt="AP Govt Pushkaralu Helpline" className="w-full h-full object-contain" />
  </div>
);
