import React, { useState } from "react";

const EMOJI_CATEGORIES = [
  {
    id: "smileys",
    name: "Smileys",
    emojis: [
      "😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "🥲", "🥹", "😊", "😇",
      "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘", "😗", "😙", "😚", "😋", "😛",
      "😝", "😜", "🤪", "🤨", "🧐", "🤓", "😎", "🥸", "🤩", "🥳", "😏", "😒",
      "😞", "😔", "😟", "😕", "🙁", "😣", "😖", "😫", "😩", "🥺", "😢", "😭",
      "😮‍💨", "😤", "😠", "😡", "🤯", "😳", "🥵", "🥶", "😱", "😨", "😰", "😥",
      "😓", "🤗", "🤔", "🫣", "🤫", "🤥", "😶", "😐", "😑", "😬", "🙄", "😯",
    ],
  },
  {
    id: "people",
    name: "Gestures",
    emojis: [
      "👋", "🤚", "🖐️", "✋", "🖖", "👌", "🤌", "🤏", "✌️", "🤞", "🫰", "🤟",
      "🤘", "🤙", "👈", "👉", "👆", "🖕", "👇", "☝️", "👍", "👎", "✊", "👊",
      "🤛", "🤜", "👏", "🙌", "🫶", "👐", "🤲", "🤝", "🙏", "✍️", "💅", "🤳",
      "💪", "🦾", "🦿", "🦵", "🦶", "👂", "🦻", "👃", "🫀", "🫁", "🧠", "👀",
    ],
  },
  {
    id: "symbols",
    name: "Symbols",
    emojis: [
      "❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💔", "❣️", "💕",
      "💞", "💓", "💗", "💖", "💘", "💝", "❤️‍🔥", "⭐", "🌟", "✨", "⚡", "🔥",
      "💥", "💯", "✅", "❌", "❓", "❗", "⚠️", "🚨", "🚩", "📍", "📌", "🔒",
      "🔑", "🔔", "🔕", "📢", "📣", "💬", "💭", "🕉️", "🙏", "💐", "🌸", "🌹",
    ],
  },
];

/**
 * WhatsApp Emoji Panel with Tabs.
 */
export function EmojiPanel({ onPick }) {
  const [activeTab, setActiveTab] = useState(EMOJI_CATEGORIES[0].id);
  const currentCategory =
    EMOJI_CATEGORIES.find((c) => c.id === activeTab) || EMOJI_CATEGORIES[0];

  return (
    <div className="w-full bg-[#f0f2f5] border-t border-[#e9edef] flex flex-col h-56 select-none animate-in slide-in-from-bottom duration-150">
      {/* Category Tabs */}
      <div className="flex items-center gap-1 px-3 py-1.5 border-b border-[#e9edef]/80 bg-[#f0f2f5]">
        {EMOJI_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setActiveTab(cat.id)}
            className={`px-3 py-1 rounded-full text-[12px] font-medium transition-colors ${
              activeTab === cat.id
                ? "bg-white text-[#008069] shadow-sm font-semibold"
                : "text-[#667781] hover:text-[#111b21]"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto scrollbar-hide p-2 grid grid-cols-8 sm:grid-cols-10 gap-1 content-start">
        {currentCategory.emojis.map((emoji, index) => (
          <button
            key={index}
            type="button"
            onClick={() => onPick(emoji)}
            className="h-10 w-10 flex items-center justify-center text-[22px] rounded-lg hover:bg-white active:scale-110 transition-transform"
            aria-label={emoji}
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
}
