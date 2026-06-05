import {
  Bus,
  ParkingCircle,
  AlertCircle,
  UtensilsCrossed,
  BriefcaseMedical,
  Landmark,
  Droplet,
  BedDouble,
  Search
} from "lucide-react";

// Custom Temple SVG icon conforming to government portal design
function Temple({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v3M10 5h4M12 5C9 8 9 12 9 16h6c0-4 0-8-3-11zM6 16v4M18 16v4M9 16v4M15 16v4M4 20h16M3 22h18" />
    </svg>
  );
}

const SERVICES_DATA = [
  {
    id: "live-transport",
    icon: Bus,
    iconColor: "text-green-600", // Using deep green
    bgColor: "bg-green-50",
    label: "Live Transport",
  },
  {
    id: "parking-finder",
    icon: ParkingCircle,
    iconColor: "text-blue-600",
    bgColor: "bg-blue-50",
    label: "Parking Finder",
  },
  {
    id: "food-water",
    icon: UtensilsCrossed,
    iconColor: "text-orange-600",
    bgColor: "bg-orange-50",
    label: "Food & Water",
  },
  {
    id: "temple-queue",
    icon: Landmark,
    iconColor: "text-purple-600",
    bgColor: "bg-purple-50",
    label: "Temples-Visit",
  },
  {
    id: "toilets",
    icon: Droplet,
    iconColor: "text-teal-600",
    bgColor: "bg-teal-50",
    label: "Toilets",
  },
  {
    id: "accommodation",
    icon: BedDouble,
    iconColor: "text-indigo-600",
    bgColor: "bg-indigo-50",
    label: "Accommodation",
  },
];

function QuickServices({ onNavigate }) {
  return (
    <div className="px-4 mt-5 select-none">
      <div className="flex items-center justify-between mb-3.5">
        <h3 className="text-sm font-bold text-gray-900 tracking-tight">
          Quick Services
        </h3>
        <button className="text-xs font-semibold text-blue-600 hover:underline">
          View All ›
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {SERVICES_DATA.map(({ id, icon: IconComponent, iconColor, bgColor, label, hasBadge }) => (
          <button
            key={id}
            onClick={() => {
              if (id === "live-transport" && onNavigate) {
                onNavigate("transport");
              }
              if (id === "temple-queue" && onNavigate) {
                onNavigate("temples");
              }
            }}
            className="relative flex items-center gap-3 bg-white rounded-2xl p-3 shadow-sm border border-gray-100 hover:border-gray-200 active:scale-98 transition-all duration-200 text-left min-h-[58px]"
          >
            {hasBadge && (
              <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full z-10 shadow-sm animate-pulse">
                SOS
              </span>
            )}

            <div className={`w-10 h-10 flex items-center justify-center rounded-xl ${bgColor} ${iconColor} shrink-0`}>
              <IconComponent className="w-5 h-5" />
            </div>

            <div className="flex flex-col justify-center">
              <span className="text-[11px] font-bold text-gray-800 leading-tight">
                {label}
              </span>
              <span className="text-[9px] text-gray-400 font-medium">
                Tap to open
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default QuickServices;
