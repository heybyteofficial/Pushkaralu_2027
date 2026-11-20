import React from "react";
import { PinIcon } from "./icons";

/**
 * Real WhatsApp Location Card with Map Preview and Google Maps link.
 */
export function LocationCard({ lat, lng, name, address }) {
  const gmapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

  return (
    <a
      className="loc-card block w-full max-w-[250px] no-underline text-inherit overflow-hidden rounded-lg bg-white/90 shadow-sm hover:shadow transition-shadow"
      href={gmapsUrl}
      target="_blank"
      rel="noreferrer"
      title="Open in Google Maps"
    >
      <div className="loc-card__map relative h-28 w-full overflow-hidden bg-[#e5efe3] border-b border-black/5 flex items-center justify-center">
        {/* Decorative realistic grid / streets */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `
              linear-gradient(90deg, #cadbb7 1px, transparent 1px),
              linear-gradient(0deg, #cadbb7 1px, transparent 1px),
              linear-gradient(45deg, transparent 46%, #ffffff 46% 54%, transparent 54%)
            `,
            backgroundSize: "22px 22px, 22px 22px, 80px 80px",
          }}
        />
        {/* River accent */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[#a5d8f3]/60 transform -skew-x-12" />
        <span className="loc-card__pin relative z-10 text-[#ea4335] drop-shadow-md animate-bounce">
          <PinIcon size={36} />
        </span>
      </div>

      <div className="loc-card__text p-2.5 flex flex-col gap-0.5">
        <strong className="text-[13.5px] font-semibold text-[#111b21] line-clamp-1">
          {name || "📍 Current Location"}
        </strong>
        <span className="text-[12px] text-[#667781] line-clamp-1">
          {address || `${lat.toFixed(5)}, ${lng.toFixed(5)}`}
        </span>
        <span className="text-[11.5px] font-medium text-[#027eb5] mt-1 flex items-center gap-1">
          Open in Google Maps →
        </span>
      </div>
    </a>
  );
}
