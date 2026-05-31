import { useState } from "react";
import { Users, Zap } from "lucide-react";
import Navbar from "../layouts/Navbar";
import BottomNav from "../layouts/BottomNav";
import GhatSuggestionCard from "../components/GhatSuggestionCard";
import photoMetric from "@/assets/PhotoMetric.png";

const GHATS = [
  {
    id: 1,
    name: "Pushkar Ghat",
    image: photoMetric,
    crowdPercent: 14,
    crowdLabel: "Low",
    crowdColor: "emerald",
    travelMins: 8,
    travelAlt: "12 mins via auto",
    aiInsight:
      "The drone feed shows the water flow is currently optimal near the North steps. Avoid the South corner due to temporary repairs.",
    bestTime: "Best after 6PM",
    isAIPick: true,
  },
  {
    id: 2,
    name: "Kotilingala Ghat",
    image: photoMetric,
    crowdPercent: 67,
    crowdLabel: "Moderate",
    crowdColor: "amber",
    travelMins: 12,
    travelAlt: "18 mins via auto",
    aiInsight:
      "Moderate crowd near the main steps. North end is less congested. Umakotilingeswara Temple area is accessible.",
    bestTime: "Best before 8AM",
    isAIPick: false,
  },
  {
    id: 3,
    name: "Saraswati Ghat",
    image: photoMetric,
    crowdPercent: 82,
    crowdLabel: "Crowded",
    crowdColor: "rose",
    travelMins: 15,
    travelAlt: "20 mins via auto",
    aiInsight:
      "High crowd expected due to evening harathi. VIP section restricted. Plan for 20 min queue.",
    bestTime: "Best after 9PM",
    isAIPick: false,
  },
  {
    id: 4,
    name: "Markandeya Ghat",
    image: photoMetric,
    crowdPercent: 35,
    crowdLabel: "Low",
    crowdColor: "emerald",
    travelMins: 10,
    travelAlt: "14 mins via auto",
    aiInsight:
      "Water flow near Markandeya Temple is calm. Entry from the East side recommended.",
    bestTime: "Best anytime",
    isAIPick: false,
  },
  {
    id: 5,
    name: "Gowthami Ghat",
    image: photoMetric,
    crowdPercent: 55,
    crowdLabel: "Moderate",
    crowdColor: "amber",
    travelMins: 9,
    travelAlt: "13 mins via auto",
    aiInsight:
      "ISKCON temple area sees steady inflow. Central steps are clear. Good conditions for bathing.",
    bestTime: "Best before 7AM",
    isAIPick: false,
  },
];

const CROWD_THEME = {
  emerald: {
    border: "border-emerald-200",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    dot: "bg-emerald-500",
  },
  amber: {
    border: "border-amber-200",
    bg: "bg-amber-50",
    text: "text-amber-700",
    dot: "bg-amber-500",
  },
  rose: {
    border: "border-rose-200",
    bg: "bg-rose-50",
    text: "text-rose-700",
    dot: "bg-rose-500",
  },
};

function AIGhatPage({ onBack, onNavigate }) {
  const [selectedGhat, setSelectedGhat] = useState(null);
  const [filter, setFilter] = useState("all");

  const sortedGhats = [...GHATS].sort((a, b) => {
    if (filter === "least") return a.crowdPercent - b.crowdPercent;
    if (filter === "nearest") return a.travelMins - b.travelMins;

    return 0;
  });

  if (selectedGhat) {
    return (
      <div className="max-w-sm mx-auto min-h-screen bg-gray-50 flex flex-col relative pb-24 shadow-2xl border-x border-gray-200">
        <Navbar showBack={true} onBack={onBack} />

        <div className="flex-1 overflow-y-auto px-4 pt-2 pb-3">
          <GhatSuggestionCard ghat={selectedGhat} />
        </div>

        <BottomNav activeTab="ai-ghat" onTabSelect={onNavigate} />
      </div>
    );
  }

  return (
    <div className="max-w-sm mx-auto min-h-screen bg-gray-50 flex flex-col relative pb-36 shadow-2xl border-x border-gray-200">
      <Navbar showBack={true} onBack={onBack} />

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        <div className="rounded-[28px] bg-gradient-to-br from-indigo-600 via-indigo-500 to-cyan-500 px-4 py-5 text-white shadow-lg shadow-indigo-500/20">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.28em] text-white/80">
            <Zap className="h-3.5 w-3.5" />
            AI Powered
          </div>
          <h1 className="mt-3 text-2xl font-black leading-tight">Choose Your Ghat</h1>
          <p className="mt-2 max-w-[22ch] text-sm text-white/85">
            Live crowd data updated every 2 mins
          </p>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {[
            { key: "all", label: "All Ghats" },
            { key: "least", label: "Least Crowded" },
            { key: "nearest", label: "Nearest" },
          ].map((option) => (
            <button
              key={option.key}
              type="button"
              onClick={() => setFilter(option.key)}
              className={`rounded-full border px-3 py-1.5 text-[10px] font-black uppercase tracking-wider transition-all ${
                filter === option.key
                  ? "border-indigo-600 bg-indigo-600 text-white shadow-md shadow-indigo-500/25"
                  : "border-slate-200 bg-white text-slate-500"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3">
          {sortedGhats.map((ghat) => {
            const theme = CROWD_THEME[ghat.crowdColor] ?? CROWD_THEME.emerald;

            return (
              <button
                key={ghat.id}
                type="button"
                onClick={() => setSelectedGhat(ghat)}
                className={`relative overflow-hidden rounded-2xl border bg-white p-3 text-left shadow-sm transition-all duration-200 active:scale-[0.97] ${
                  ghat.isAIPick ? "border-indigo-200 ring-1 ring-indigo-200" : "border-slate-100"
                }`}
              >
                {ghat.isAIPick ? (
                  <div className="absolute right-3 top-3 rounded-full bg-indigo-600 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-white shadow-sm">
                    AI Pick
                  </div>
                ) : null}

                <div className="overflow-hidden rounded-xl">
                  <img src={ghat.image} alt={ghat.name} className="h-28 w-full object-cover" />
                </div>

                <div className="mt-3 space-y-1">
                  <h2 className="text-sm font-black text-slate-900">{ghat.name}</h2>
                  <p className="text-[11px] font-semibold text-slate-500">{ghat.bestTime}</p>
                </div>

                <div className={`mt-3 rounded-xl border ${theme.border} ${theme.bg} p-3`}>
                  <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-slate-500">
                    <span>{ghat.crowdLabel}</span>
                    <span className={theme.text}>{ghat.crowdPercent}%</span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-white/90">
                    <div
                      className={`h-2 rounded-full ${theme.dot}`}
                      style={{ width: `${ghat.crowdPercent}%` }}
                    />
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-2 text-[11px] font-semibold text-slate-500">
                  <Users className="h-3.5 w-3.5" />
                  <span>{ghat.travelMins} mins away</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <BottomNav activeTab="ai-ghat" onTabSelect={onNavigate} />
    </div>
  );
}

export default AIGhatPage;
