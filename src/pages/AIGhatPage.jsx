import { useState, useRef, useEffect } from "react";
import { Clock3, Users, Zap } from "lucide-react";
import Navbar from "../layouts/Navbar";
import BottomNav from "../layouts/BottomNav";
import GhatSuggestionCard from "../components/GhatSuggestionCard";

const GHATS = [
  {
    id: 1,
    name: "Pushkar Ghat",
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
    bg: "from-emerald-600 via-emerald-500 to-teal-400",
    bar: "bg-emerald-300",
    track: "bg-emerald-950/35",
    badge: "bg-emerald-950/40 text-emerald-50 border-emerald-300/30",
    label: "text-emerald-100",
    percent: "text-white",
  },
  amber: {
    bg: "from-amber-600 via-orange-500 to-yellow-400",
    bar: "bg-amber-200",
    track: "bg-amber-950/35",
    badge: "bg-amber-950/40 text-amber-50 border-amber-300/30",
    label: "text-amber-100",
    percent: "text-white",
  },
  rose: {
    bg: "from-rose-700 via-rose-500 to-pink-400",
    bar: "bg-rose-300",
    track: "bg-rose-950/35",
    badge: "bg-rose-950/40 text-rose-50 border-rose-300/30",
    label: "text-rose-100",
    percent: "text-white",
  },
};

function AIGhatPage({ onBack, onNavigate }) {
  const [selectedGhat, setSelectedGhat] = useState(null);
  const [filter, setFilter] = useState("all");
  const detailTopRef = useRef(null);

  const sortedGhats = [...GHATS].sort((a, b) => {
    if (filter === "least") return a.crowdPercent - b.crowdPercent;
    if (filter === "nearest") return a.travelMins - b.travelMins;

    return 0;
  });

  useEffect(() => {
    if (!selectedGhat) return;
    // scroll the internal detail container to top when a ghat is opened
    window.setTimeout(() => {
      try {
        detailTopRef.current?.scrollTo({ top: 0, behavior: "smooth" });
      } catch (e) {
        detailTopRef.current?.scrollIntoView?.({ behavior: "smooth", block: "start" });
      }
    }, 80);
  }, [selectedGhat]);

  if (selectedGhat) {
    return (
      <div className="max-w-sm mx-auto min-h-screen bg-gray-50 flex flex-col relative pb-24 shadow-2xl border-x border-gray-200">
        <Navbar showBack={true} onBack={onBack} />

        <div ref={detailTopRef} className="flex-1 overflow-y-auto px-4 pt-2 pb-3">
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
        <div className="rounded-[28px] bg-gradient-to-br from-indigo-700 via-indigo-600 to-cyan-500 px-4 py-5 text-white shadow-lg shadow-indigo-500/20">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.28em] text-white/80">
            <Zap className="h-3.5 w-3.5" />
            AI Powered
          </div>
          <h1 className="mt-3 text-2xl font-black leading-tight">Choose Your Ghat</h1>
          <p className="mt-2 max-w-[50ch] text-sm text-white/85">
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

        <div className="space-y-3">
          {sortedGhats.map((ghat) => {
            const theme = CROWD_THEME[ghat.crowdColor] ?? CROWD_THEME.emerald;

            return (
              <button
                key={ghat.id}
                type="button"
                onClick={() => setSelectedGhat(ghat)}
                className={`relative w-full overflow-hidden rounded-3xl bg-gradient-to-br ${theme.bg} p-5 text-left shadow-lg transition-all duration-200 active:scale-[0.98]`}
                style={{ minHeight: "160px" }}
              >
                {ghat.isAIPick ? (
                  <div className={`absolute right-4 top-4 rounded-full border px-2.5 py-1 text-[9px] font-black uppercase tracking-widest shadow-sm ${theme.badge}`}>
                    AI Pick
                  </div>
                ) : null}

                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.2),transparent_40%),linear-gradient(135deg,rgba(255,255,255,0.08),transparent_35%)]" />
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(3,7,18,0.42),rgba(3,7,18,0.08)_55%,rgba(255,255,255,0.05))]" />

                <div className="relative z-10 flex h-full min-h-[128px] flex-col justify-between">
                  <div className="pr-16">
                    <h2 className="text-[17px] font-black leading-tight text-white drop-shadow-sm">
                      {ghat.name}
                    </h2>
                    <p className={`mt-1 text-[12px] font-semibold ${theme.label}`}>{ghat.bestTime}</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-end justify-between gap-3">
                      <div className="min-w-0">
                        <div className={`text-[10px] font-black uppercase tracking-[0.3em] ${theme.label}`}>
                          Live Crowd
                        </div>
                        <div className="mt-1 flex items-center gap-2">
                          <span className={`text-xl font-black leading-none ${theme.percent}`}>
                            {ghat.crowdPercent}%
                          </span>
                          <span className={`rounded-full border px-2 py-1 text-[10px] font-black uppercase tracking-wider ${theme.badge}`}>
                            {ghat.crowdLabel}
                          </span>
                        </div>
                      </div>

                      {ghat.isAIPick ? (
                        <div className="flex items-center gap-1.5 rounded-full bg-white/14 px-2.5 py-1.5 text-[10px] font-black uppercase tracking-wider text-white backdrop-blur-sm">
                          <Zap className="h-3.5 w-3.5" />
                          Smart Pick
                        </div>
                      ) : null}
                    </div>

                    <div className={`h-2.5 overflow-hidden rounded-full ${theme.track}`}>
                      <div
                        className={`h-full rounded-full ${theme.bar}`}
                        style={{ width: `${ghat.crowdPercent}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between gap-3 text-[11px] font-semibold text-white/90">
                      <div className="flex items-center gap-1.5">
                        <Clock3 className="h-3.5 w-3.5" />
                        <span>{ghat.travelMins} mins away</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-right">
                        <Users className="h-3.5 w-3.5" />
                        <span>~{ghat.crowdPercent * 15} pilgrims</span>
                      </div>
                    </div>
                  </div>
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
