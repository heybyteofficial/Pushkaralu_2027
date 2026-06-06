import { useState } from "react";
import {
  MapPin,
  RefreshCw,
  CheckCircle,
  Clock,
  Accessibility,
  Building2,
  Truck,
  FlameKindling,
  Navigation,
  Check,
  AlertCircle
} from "lucide-react";
import Navbar from "../layouts/Navbar";
import BottomNav from "../layouts/BottomNav";

const TOILET_LOCATIONS = [
  // Ghat Blocks
  {
    id: "ghat-1",
    name: "Kotilingala Ghat Sector A",
    location: "Adjacent to Main Entrance Gate 1",
    zone: "ghat",
    distance: "120m",
    setupType: "Permanent",
    amenities: ["Male & Female separated", "Disabled friendly", "Handwash available", "Running Water"],
    isClean: true
  },
  {
    id: "ghat-2",
    name: "Pushkar Ghat Main Hub",
    location: "Behind VIP Bathing Area",
    zone: "ghat",
    distance: "250m",
    setupType: "Permanent",
    amenities: ["Male, Female & Third Gender", "Disabled friendly", "Soap dispenser", "Exhaust fan active"],
    isClean: true
  },
  {
    id: "ghat-3",
    name: "Saraswati Ghat North Wing",
    location: "Near Pilgrim Seating Deck B",
    zone: "ghat",
    distance: "450m",
    setupType: "Mobile",
    amenities: ["Separate Men/Women blocks", "Handwash available", "Eco-friendly bio-toilet"],
    isClean: true
  },
  {
    id: "ghat-4",
    name: "Gowthami Ghat Sector C",
    location: "Near ISKCON Temple Path",
    zone: "ghat",
    distance: "850m",
    setupType: "Permanent",
    amenities: ["Male & Female separated", "Running Water", "Western toilets available"],
    isClean: true
  },
  {
    id: "ghat-5",
    name: "VIP Ghat Bathing Zone B",
    location: "Near Administrative Tents",
    zone: "ghat",
    distance: "1.1 km",
    setupType: "Permanent",
    amenities: ["Male & Female separated", "Disabled friendly", "Premium hygiene kit"],
    isClean: true
  },
  // Transit Zones
  {
    id: "transit-1",
    name: "Rajahmundry Railway Station (East Gate)",
    location: "Opposite Pilgrim Help Desk",
    zone: "transit",
    distance: "1.4 km",
    setupType: "Permanent",
    amenities: ["Male & Female separated", "Disabled friendly", "24/7 Attendant", "Soap dispenser"],
    isClean: true
  },
  {
    id: "transit-2",
    name: "Gokavaram Bus Stand Cluster",
    location: "Near Shuttle Bus Boarding Bay 4",
    zone: "transit",
    distance: "1.8 km",
    setupType: "Mobile",
    amenities: ["Separate Men/Women blocks", "Handwash available", "Running Water"],
    isClean: true
  },
  {
    id: "transit-3",
    name: "Kotipalli Bus Stand Parking Hub",
    location: "Adjacent to Main Vehicle Exit",
    zone: "transit",
    distance: "2.2 km",
    setupType: "Mobile",
    amenities: ["Separate Men/Women blocks", "Bio-toilet setup", "Exhaust fan active"],
    isClean: true
  },
  {
    id: "transit-4",
    name: "Morampudi Junction Parking Area",
    location: "Behind Police Chowki",
    zone: "transit",
    distance: "3.5 km",
    setupType: "Mobile",
    amenities: ["Male & Female separated", "Soap dispenser", "Running Water"],
    isClean: true
  },
  {
    id: "transit-5",
    name: "Bommuru Parking Zone B",
    location: "Near Food Court Entry",
    zone: "transit",
    distance: "4.2 km",
    setupType: "Mobile",
    amenities: ["Male & Female separated", "Disabled friendly", "Eco-friendly bio-toilet"],
    isClean: true
  }
];

function ToiletLocatorPage({ onBack, onNavigate }) {
  const [activeFilter, setActiveFilter] = useState("ghat"); // "ghat" | "transit"
  const [toiletsData, setToiletsData] = useState(TOILET_LOCATIONS);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 2500);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    triggerToast("Syncing pilgrim telemetry... GPS distance telemetry refreshed!");

    setTimeout(() => {
      setToiletsData(prev =>
        prev.map(item => {
          // Simulate dynamic distance telemetry updates
          const isKm = item.distance.includes("km");
          const distVal = parseFloat(item.distance);
          if (isKm) {
            const newVal = Math.max(0.1, distVal + (Math.random() > 0.5 ? 0.1 : -0.1));
            return { ...item, distance: `${newVal.toFixed(1)} km` };
          } else {
            const newVal = Math.max(10, Math.round(distVal + (Math.random() > 0.5 ? 10 : -10)));
            return { ...item, distance: `${newVal}m` };
          }
        })
      );
      setIsRefreshing(false);
    }, 1000);
  };

  // Filter based on selected zone tab
  const filteredToilets = toiletsData.filter(item => item.zone === activeFilter);

  // Compute live summary stats
  const activeCount = filteredToilets.length;
  const setupPermanentCount = filteredToilets.filter(item => item.setupType === "Permanent").length;
  const setupMobileCount = filteredToilets.filter(item => item.setupType === "Mobile").length;

  return (
    <div className="w-screen max-w-sm mx-auto h-[100dvh] flex flex-col overflow-hidden bg-[#f4f7fc] relative font-sans shadow-2xl border-x border-gray-200">

      {/* Fixed Header */}
      <Navbar showBack={true} onBack={onBack} />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 bg-[#0c2340] text-white text-[11px] font-bold py-2 px-4 rounded-full border border-teal-500/30 shadow-2xl flex items-center gap-2 animate-bounce">
          <RefreshCw className="w-3.5 h-3.5 animate-spin text-teal-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Info-Only Scrollable List */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 pb-36">

        {/* Header Info Panel & Interactive Refresh */}
        <div className="bg-white rounded-2xl border border-slate-200/85 p-4 text-left shadow-sm mt-1">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider">
                Toilet Locator
              </h2>
            </div>

            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center justify-center w-8 h-8 rounded-lg bg-teal-50 text-teal-700 hover:bg-teal-100 active:scale-95 transition-all shadow-sm"
              title="Refresh Live Status"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
            </button>
          </div>

          {/* Live Mini Stats Panel */}
          <div className="mt-3 grid grid-cols-3 gap-2 bg-[#f8fafc] rounded-xl p-2.5 border border-slate-100 text-[10px] font-bold text-slate-655">
            <div className="flex flex-col">
              <span className="text-[7.5px] font-black uppercase text-slate-400">Total Blocks</span>
              <span className="text-slate-800 font-extrabold mt-0.5">{activeCount} Sites</span>
            </div>
            <div className="flex flex-col border-x border-slate-200/80 px-2.5">
              <span className="text-[7.5px] font-black uppercase text-slate-400">Permanent</span>
              <span className="text-teal-700 font-extrabold mt-0.5">{setupPermanentCount} Built</span>
            </div>
            <div className="flex flex-col pl-1.5">
              <span className="text-[7.5px] font-black uppercase text-slate-400">Mobile Pods</span>
              <span className="text-indigo-600 font-extrabold mt-0.5">{setupMobileCount} Active</span>
            </div>
          </div>
        </div>

        {/* Clean Two-Way Filter Bar */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-1.5 shadow-sm">
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveFilter("ghat")}
              className={`flex-1 text-center py-2 text-xs font-black rounded-lg transition-all ${activeFilter === "ghat"
                  ? "bg-white text-teal-850 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
                }`}
            >
              Ghat Blocks (Near River)
            </button>
            <button
              onClick={() => setActiveFilter("transit")}
              className={`flex-1 text-center py-2 text-xs font-black rounded-lg transition-all ${activeFilter === "transit"
                  ? "bg-white text-teal-850 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
                }`}
            >
              Transit Zones (Parking/Station)
            </button>
          </div>
        </div>

        {/* Info-Only List Items container */}
        <div className="space-y-3">
          {filteredToilets.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm flex flex-col text-left transition-all duration-200"
            >
              {/* Header: Title and Setup Type */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <h3 className="text-[13px] font-black text-slate-900 leading-snug">
                    {item.name}
                  </h3>
                  <p className="text-[9.5px] text-slate-400 font-bold mt-0.5 leading-tight">
                    {item.location}
                  </p>
                </div>

                {/* Setup Type Badge */}
                <span className={`inline-flex items-center gap-1 text-[8.5px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border shrink-0 ${item.setupType === "Permanent"
                    ? "bg-teal-50 text-teal-700 border-teal-200"
                    : "bg-indigo-50 text-indigo-700 border-indigo-200"
                  }`}>
                  {item.setupType === "Permanent" ? (
                    <Building2 className="w-2.5 h-2.5" />
                  ) : (
                    <Truck className="w-2.5 h-2.5" />
                  )}
                  {item.setupType}
                </span>
              </div>

              {/* Distance Info Block */}
              <div className="mt-3 flex items-center gap-1.5 text-[11px] font-bold text-slate-700 bg-[#f8fafc] border border-slate-100 rounded-xl p-2 px-3 w-fit">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>Distance:</span>
                <span className="text-slate-900 font-black">{item.distance}</span>
              </div>

              {/* Amenities Checklist (Highly Actionable, Clean layout) */}
              <div className="mt-3.5 space-y-1.5">
                <span className="text-[7.5px] font-black uppercase tracking-wider text-slate-400">
                  Amenities & Facilities
                </span>
                <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
                  {item.amenities.map((amenity, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-600">
                      <div className="w-3.5 h-3.5 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                      <span className="truncate leading-none">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer and Directions Action */}
              <div className="mt-3.5 border-t border-slate-100 pt-3 flex items-center justify-between">
                <span className="text-[8.5px] font-black uppercase tracking-wider text-slate-400">
                  AP Smart Pilgrim Grid
                </span>

                {/* Action Button: Get Directions */}
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
              No toilet locations found in this zone.
            </div>
          )}
        </div>
      </div>

      {/* Bottom Nav */}
      <BottomNav activeTab="" onTabSelect={onNavigate} />
    </div>
  );
}

export default ToiletLocatorPage;
