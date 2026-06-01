import { Clock3, Send, Sparkles } from "lucide-react";
import PhotoMetric from "@/assets/PhotoMetric.png";


const CIRCUMFERENCE = 2 * Math.PI * 22;

const CROWD_THEME = {
  emerald: {
    stroke: "#10b981",
    accent: "text-emerald-600",
    label: "text-emerald-600",
    glow: "shadow-[0_0_0_8px_rgba(16,185,129,0.12)]",
  },
  amber: {
    stroke: "#f59e0b",
    accent: "text-amber-600",
    label: "text-amber-600",
    glow: "shadow-[0_0_0_8px_rgba(245,158,11,0.12)]",
  },
  rose: {
    stroke: "#f43f5e",
    accent: "text-rose-600",
    label: "text-rose-600",
    glow: "shadow-[0_0_0_8px_rgba(244,63,94,0.12)]",
  },
};

function CrowdDensityRing({ percent, crowdColor }) {
  const strokeOffset = CIRCUMFERENCE - (percent / 100) * CIRCUMFERENCE;
  const theme = CROWD_THEME[crowdColor] ?? CROWD_THEME.emerald;

  return (
    <div className="relative flex items-center justify-center">
      <svg viewBox="0 0 56 56" className="h-20 w-20 -rotate-90">
        <circle
          cx="28"
          cy="28"
          r="22"
          fill="none"
          stroke="#e2e8f0"
          strokeWidth="4"
        />
        <circle
          cx="28"
          cy="28"
          r="22"
          fill="none"
          stroke={theme.stroke}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={strokeOffset}
          className="transition-[stroke-dashoffset] duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-sm font-black ${theme.accent}`}>{percent}%</span>
      </div>
    </div>
  );
}

function GhatSuggestionCard({ ghat }) {
  const crowdTheme = CROWD_THEME[ghat.crowdColor] ?? CROWD_THEME.emerald;
  const ghatImage = PhotoMetric;

  return (
    <section className="max-w-sm mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">
      <div className="relative overflow-hidden rounded-t-3xl">
        <img src={ghatImage} alt={`${ghat.name} location`} className="h-[200px] w-full object-cover" />

        <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center justify-center">
          <span className="absolute h-5 w-5 animate-ping rounded-full bg-emerald-400/25" />
          <span className="absolute h-7 w-7 rounded-full border border-emerald-400/20" />
          <span className={`relative h-4 w-4 rounded-full bg-emerald-500 ${crowdTheme.glow}`} />
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center gap-2">
          <span className="relative inline-flex h-2.5 w-2.5 items-center justify-center">
            <span className="absolute h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping opacity-75" />
            <span className="relative h-2.5 w-2.5 rounded-full bg-emerald-500" />
          </span>
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-emerald-600">
            AI Real-Time Suggestion
          </p>
        </div>

        <h2 className="mt-2 text-2xl font-black text-slate-900">{ghat.name}</h2>
        <p className="mt-1 text-sm text-slate-500">Recommended for a serene holy bath.</p>
        <p className="mt-1 text-sm text-slate-500">{ghat.bestTime}</p>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-3">
            <p className="text-xs font-semibold text-slate-500">Crowd Density</p>
            <div className="mt-3 flex flex-col items-center gap-2">
              <CrowdDensityRing percent={ghat.crowdPercent} crowdColor={ghat.crowdColor} />
              <span className={`text-sm font-black ${crowdTheme.label}`}>{ghat.crowdLabel}</span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-3">
            <p className="text-xs font-semibold text-slate-500">Travel Time</p>
            <div className="mt-3 flex h-full flex-col items-center justify-center text-center">
              <Clock3 className="h-8 w-8 text-indigo-500" />
              <span className="mt-2 text-xl font-black text-indigo-600">{ghat.travelMins} Mins</span>
              <p className="mt-1 text-xs text-slate-400">{ghat.travelAlt}</p>
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-indigo-600">
                AI Insight
              </p>
              <p className="mt-1 text-xs leading-relaxed text-slate-600">
                {ghat.aiInsight}
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          className="mt-4 flex h-[52px] w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-500 text-sm font-black text-white shadow-lg shadow-indigo-500/30 transition-transform active:scale-[0.99]"
        >
          <span>Directions to {ghat.name}</span>
          <Send className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}

export default GhatSuggestionCard;
