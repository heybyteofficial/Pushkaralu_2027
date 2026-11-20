import React, { useState } from "react";
import { CloseIcon } from "./icons";

/**
 * Authentic WhatsApp List Message Bottom Sheet.
 */
export function ListSheet({ title, sections = [], onClose, onSelect }) {
  const [picked, setPicked] = useState(null);

  return (
    <div
      className="sheet-backdrop absolute inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-[1.5px] transition-opacity"
      onClick={onClose}
    >
      <div
        className="sheet relative w-full max-w-[430px] max-h-[58%] rounded-t-2xl bg-white flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-200 select-none overflow-hidden"
        role="dialog"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Compact grab handle */}
        <div className="w-9 h-1 rounded-full bg-[#d1d7db] mx-auto mt-2 mb-0.5 shrink-0" />

        {/* Medium Compact Header */}
        <div className="flex items-center justify-between px-3.5 py-2 border-b border-[#e9edef] shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              type="button"
              className="w-7 h-7 rounded-full flex items-center justify-center text-[#54656f] hover:bg-black/5 active:scale-90 transition-all shrink-0"
              onClick={onClose}
              aria-label="Close"
            >
              <CloseIcon size={18} />
            </button>
            <span className="font-semibold text-[15px] text-[#111b21] truncate">
              {title}
            </span>
          </div>
          <span className="text-[11.5px] text-[#8696a0] font-medium shrink-0">
            Select one
          </span>
        </div>

        {/* Medium Sized Body with Sections and Choices */}
        <div className="sheet__body flex-1 overflow-y-auto scrollbar-hide divide-y divide-[#f0f2f5] px-1 py-1">
          {sections.map((sec, si) => (
            <div key={si} className="py-1">
              {sec.title && (
                <div className="px-3.5 pt-2 pb-1 text-[11px] font-bold tracking-wider uppercase text-[#008069]">
                  {sec.title}
                </div>
              )}
              {sec.rows.map((row) => {
                const isSelected = picked?.id === row.id;
                return (
                  <label
                    key={row.id}
                    onClick={() => setPicked({ id: row.id, title: row.title })}
                    className={`flex items-center justify-between gap-3 px-3.5 py-2 rounded-xl mx-1 cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-[#e7f6ef]/70 text-[#111b21]"
                        : "hover:bg-[#f5f6f6] active:bg-[#f0f2f5]"
                    }`}
                  >
                    <div className="flex-1 min-w-0 pr-1">
                      <div className="text-[14px] font-medium text-[#111b21] leading-snug">
                        {row.title}
                      </div>
                      {row.description && (
                        <div className="text-[12px] text-[#667781] leading-tight line-clamp-1 mt-0.5">
                          {row.description}
                        </div>
                      )}
                    </div>
                    {/* Compact WhatsApp Radio Circle */}
                    <div
                      className={`w-[18px] h-[18px] rounded-full border-[1.75px] flex items-center justify-center shrink-0 transition-colors ${
                        isSelected
                          ? "border-[#00a884] bg-[#00a884]"
                          : "border-[#8696a0] bg-transparent"
                      }`}
                    >
                      {isSelected && (
                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                      )}
                    </div>
                  </label>
                );
              })}
            </div>
          ))}
        </div>

        {/* Medium Compact Footer Button */}
        <div className="px-3.5 py-2.5 pb-[max(0.75rem,env(safe-area-inset-bottom))] border-t border-[#e9edef] bg-white shrink-0">
          <button
            type="button"
            disabled={!picked}
            onClick={() => picked && onSelect(picked.id, picked.title)}
            className={`w-full py-2.5 px-4 rounded-full font-semibold text-[14px] transition-all flex items-center justify-center gap-1.5 shadow-sm ${
              picked
                ? "bg-[#00a884] hover:bg-[#008069] text-white active:scale-[0.98]"
                : "bg-[#e9edef] text-[#8696a0] cursor-not-allowed"
            }`}
          >
            <span>Send Choice</span>
          </button>
        </div>
      </div>
    </div>
  );
}
