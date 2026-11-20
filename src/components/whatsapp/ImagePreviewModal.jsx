import React, { useState } from "react";
import { CloseIcon, SendIcon } from "./icons";

/**
 * WhatsApp Full-Screen Image Preview & Quality Check Modal before sending.
 */
export function ImagePreviewModal({
  src,
  warnings = [],
  sendable = true,
  onClose,
  onSend,
}) {
  const [caption, setCaption] = useState("");

  const handleSend = () => {
    if (!sendable) return;
    onSend(caption.trim());
  };

  return (
    <div className="absolute inset-0 z-50 flex flex-col bg-[#0b141a] text-white animate-in fade-in duration-150">
      {/* Top action bar */}
      <header className="flex items-center justify-between px-4 py-3 bg-[#111b21]">
        <button
          type="button"
          onClick={onClose}
          className="w-10 h-10 rounded-full flex items-center justify-center text-white/80 hover:bg-white/10 active:scale-95"
          aria-label="Cancel"
        >
          <CloseIcon size={24} />
        </button>

        <span className="text-[15px] font-medium tracking-wide text-white/90">
          {sendable ? "Photo Preview" : "View Photo"}
        </span>

        <div className="w-10" />
      </header>

      {/* Main photo view */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 min-h-0 overflow-hidden relative">
        <img
          src={src}
          alt="Preview"
          className="max-h-full max-w-full object-contain rounded-md shadow-2xl"
        />

        {warnings.length > 0 && (
          <div className="absolute top-6 left-6 right-6 max-w-md mx-auto bg-[#5c3b00]/90 backdrop-blur border border-[#ffe0a3]/30 text-[#ffe0a3] text-[13px] px-3.5 py-2.5 rounded-lg shadow-lg">
            {warnings.map((w, i) => (
              <p key={i} className="leading-snug">⚠️ {w}</p>
            ))}
          </div>
        )}
      </div>

      {/* Bottom caption and send bar */}
      {sendable ? (
        <div className="p-3 bg-[#111b21] border-t border-white/10 flex items-center gap-3">
          <input
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Add a caption..."
            className="flex-1 bg-[#202c33] text-white placeholder:text-[#8696a0] rounded-full px-4 py-2.5 text-[15px] outline-none border border-transparent focus:border-[#00a884] transition-colors"
            autoFocus
          />

          <button
            type="button"
            onClick={handleSend}
            className="w-12 h-12 rounded-full bg-[#00a884] hover:bg-[#008069] active:scale-95 text-white flex items-center justify-center shadow-lg transition-transform shrink-0"
            aria-label="Send photo"
          >
            <SendIcon size={22} />
          </button>
        </div>
      ) : (
        <div className="p-3 bg-[#111b21] flex justify-center">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 rounded-full bg-white/10 hover:bg-white/20 text-sm font-medium text-white transition-colors"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}
