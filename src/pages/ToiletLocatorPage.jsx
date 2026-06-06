import { useState } from "react";
import {
  MapPin,
  Navigation,
  Accessibility,
  Building2,
  Truck
} from "lucide-react";
import Navbar from "../layouts/Navbar";
import BottomNav from "../layouts/BottomNav";

// Custom high-contrast toilet category figure icons
const MenIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z" />
    <path d="M18 21a6 6 0 0 0-12 0" />
  </svg>
);

const WomenIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="5" r="3" />
    <path d="m9 21 3-10 3 10Z" />
    <path d="M6 11h12" />
  </svg>
);

const TOILET_LOCATIONS = [
  {
    id: "block-1",
    name: "Kotilingala Ghat Washrooms",
    location: "Adjacent to Main Entrance Gate 1",
    setupType: "Permanent Structure",
    distance: "120m",
    categories: ["men", "women", "accessible"]
  },
  {
    id: "block-2",
    name: "Pushkar Ghat Washrooms",
    location: "Behind VIP Bathing Area",
    setupType: "Permanent Structure",
    distance: "250m",
    categories: ["men", "women", "accessible"]
  },
  {
    id: "block-3",
    name: "Saraswati Ghat Washrooms",
    location: "Near Pilgrim Seating Deck B",
    setupType: "Mobile Pod",
    distance: "450m",
    categories: ["men", "women"]
  },
  {
    id: "block-4",
    name: "Gowthami Ghat Washrooms",
    location: "Near ISKCON Temple Path",
    setupType: "Permanent Structure",
    distance: "850m",
    categories: ["men", "women"]
  },
  {
    id: "block-5",
    name: "VIP Ghat Bathing Zone B",
    location: "Near Administrative Tents",
    setupType: "Permanent Structure",
    distance: "1.1 km",
    categories: ["men", "women", "accessible"]
  },
  {
    id: "block-6",
    name: "Rajahmundry Station (East Gate)",
    location: "Opposite Pilgrim Help Desk",
    setupType: "Permanent Structure",
    distance: "1.4 km",
    categories: ["men", "women", "accessible"]
  },
  {
    id: "block-7",
    name: "Gokavaram Bus Stand Cluster",
    location: "Near Shuttle Bus Boarding Bay 4",
    setupType: "Mobile Pod",
    distance: "1.8 km",
    categories: ["men", "women"]
  },
  {
    id: "block-8",
    name: "Kotipalli Bus Stand Parking Hub",
    location: "Adjacent to Main Vehicle Exit",
    setupType: "Mobile Pod",
    distance: "2.2 km",
    categories: ["men", "women"]
  },
  {
    id: "block-9",
    name: "Morampudi Junction Parking Area",
    location: "Behind Police Chowki",
    setupType: "Mobile Pod",
    distance: "3.5 km",
    categories: ["men", "women"]
  },
  {
    id: "block-10",
    name: "Bommuru Parking Zone B",
    location: "Near Food Court Entry",
    setupType: "Mobile Pod",
    distance: "4.2 km",
    categories: ["men", "women", "accessible"]
  }
];

function ToiletLocatorPage({ onBack, onNavigate }) {
  const [activeCategory, setActiveCategory] = useState("men"); // "men" | "women" | "accessible"

  // Filter list by selected category
  const filteredToilets = TOILET_LOCATIONS.filter(item =>
    item.categories.includes(activeCategory)
  );

  return (
    <div className="w-screen h-[100dvh] flex flex-col overflow-hidden bg-[#f8fafc] font-sans relative shadow-2xl max-w-sm mx-auto border-x border-gray-200">

      {/* Home page matching Navbar */}
      <Navbar showBack={true} onBack={onBack} />

      {/* Immediate Visual Clarity Tray */}
      <div className="bg-white border-b border-slate-100 p-6 flex justify-around items-center gap-4 shrink-0 select-none">

        {/* MEN Category */}
        <button
          onClick={() => setActiveCategory("men")}
          className={`flex-1 flex flex-col items-center gap-2 py-3.5 px-2.5 rounded-2xl border transition-all duration-200 active:scale-95 ${activeCategory === "men"
              ? "bg-teal-50/70 border-teal-500 text-teal-700 font-black scale-105 shadow-sm shadow-teal-500/5"
              : "bg-slate-50 border-slate-200/60 text-slate-400 hover:text-slate-600"
            }`}
        >
          <MenIcon className="w-7 h-7" />
          <span className="text-[10px] uppercase tracking-widest font-black">MEN</span>
        </button>

        {/* WOMEN Category */}
        <button
          onClick={() => setActiveCategory("women")}
          className={`flex-1 flex flex-col items-center gap-2 py-3.5 px-2.5 rounded-2xl border transition-all duration-200 active:scale-95 ${activeCategory === "women"
              ? "bg-teal-50/70 border-teal-500 text-teal-700 font-black scale-105 shadow-sm shadow-teal-500/5"
              : "bg-slate-50 border-slate-200/60 text-slate-400 hover:text-slate-600"
            }`}
        >
          <WomenIcon className="w-7 h-7" />
          <span className="text-[10px] uppercase tracking-widest font-black">WOMEN</span>
        </button>

        {/* ACCESSIBLE Category */}
        <button
          onClick={() => setActiveCategory("accessible")}
          className={`flex-1 flex flex-col items-center gap-2 py-3.5 px-2.5 rounded-2xl border transition-all duration-200 active:scale-95 ${activeCategory === "accessible"
              ? "bg-teal-50/70 border-teal-500 text-teal-700 font-black scale-105 shadow-sm shadow-teal-500/5"
              : "bg-slate-50 border-slate-200/60 text-slate-400 hover:text-slate-600"
            }`}
        >
          <Accessibility className="w-7 h-7" />
          <span className="text-[10px] uppercase tracking-widest font-black">ACCESSIBLE</span>
        </button>
      </div>

      {/* Clean Info List Deck */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-36">
        {filteredToilets.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm flex flex-col text-left transition-all duration-150"
          >
            {/* Title and Setup Type */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <h3 className="text-[13px] font-black text-slate-900 leading-snug">
                  {item.name}
                </h3>
                <p className="text-[9.5px] text-slate-400 font-semibold mt-0.5 leading-tight">
                  {item.location}
                </p>
              </div>

              {/* Setup Type Badge */}
              <span className={`inline-flex items-center gap-1 text-[8.5px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border shrink-0 ${item.setupType === "Permanent Structure"
                  ? "bg-teal-50 text-teal-700 border-teal-200"
                  : "bg-indigo-50 text-indigo-700 border-indigo-200"
                }`}>
                {item.setupType === "Permanent Structure" ? (
                  <Building2 className="w-2.5 h-2.5" />
                ) : (
                  <Truck className="w-2.5 h-2.5" />
                )}
                {item.setupType}
              </span>
            </div>

            {/* Distance Info & Action Button */}
            <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between">

              {/* Distance badge */}
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700 bg-slate-50 border border-slate-100 rounded-lg py-1.5 px-3">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="text-[10px] text-slate-500 font-bold">Distance:</span>
                <span className="text-slate-900 font-black">{item.distance}</span>
              </div>

              {/* Get Directions Button */}
              <button
                onClick={() => alert(`Navigating to ${item.name}. Distance: ${item.distance}`)}
                className="bg-[#0c2340] hover:bg-[#15345a] text-white text-[9.5px] font-black px-3.5 py-1.5 rounded-lg flex items-center gap-1 shadow-sm transition-colors"
              >
                <Navigation className="w-2.5 h-2.5" />
                Directions
              </button>
            </div>
          </div>
        ))}

        {filteredToilets.length === 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-400 text-xs">
            No active toilet blocks for this category.
          </div>
        )}
      </div>

      {/* Fixed bottom navigation */}
      <BottomNav activeTab="" onTabSelect={onNavigate} />
    </div>
  );
}

export default ToiletLocatorPage;
