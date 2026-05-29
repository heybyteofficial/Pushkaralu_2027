import { useState, useEffect, useRef } from "react";
import { ArrowLeft, AlertOctagon, AlertTriangle, ShieldCheck, Shield, HeartPulse, Clock, MapPin } from "lucide-react";
import Navbar from "../layouts/Navbar";

function SosPage({ onBack }) {
  const [holdProgress, setHoldProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const [isDistressActive, setIsDistressActive] = useState(false);

  const timerRef = useRef(null);

  const handleButtonClick = () => {
    if (isDistressActive) return;

    if (isHolding) {
      setIsHolding(false);
      setHoldProgress(0);
      clearInterval(timerRef.current);
    } else {
      setIsHolding(true);
      setHoldProgress(0);
      clearInterval(timerRef.current);

      timerRef.current = setInterval(() => {
        setHoldProgress((prev) => {
          if (prev >= 100) {
            clearInterval(timerRef.current);
            setIsDistressActive(true);
            setIsHolding(false);
            return 100;
          }
          return prev + 1;
        });
      }, 30);
    }
  };

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  const radius = 64;
  const strokeWidth = 5;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (holdProgress / 100) * circumference;

  return (
    <div className="max-w-sm mx-auto min-h-screen bg-gray-50 flex flex-col justify-between relative shadow-2xl border-x border-gray-200 select-none pb-4">
      <Navbar showBack={true} onBack={onBack} />

      <div className="flex-1 flex flex-col px-4 pt-4">
        <div className="flex items-center justify-between bg-white border border-gray-100 rounded-2xl p-3.5 shadow-sm">
          <span className="text-sm font-extrabold text-[#0c2340]">
            Emergency SOS
          </span>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
            </span>
            <span className="text-[9px] font-bold uppercase tracking-wider">
              ICCC Link Active
            </span>
          </div>
        </div>

        <div className="w-full bg-[#f8fafc] border border-blue-100 rounded-2xl py-2.5 px-3 text-center text-xs font-semibold text-slate-700 mt-3 shadow-sm">
          Target Field Response Window: &lt; 4 Mins
        </div>

        {/* Center Hold Panel */}
        <div className="flex-1 flex flex-col items-center justify-center my-6">
          <div className="w-full bg-white rounded-3xl border border-gray-100 p-6 shadow-md flex flex-col items-center text-center">
            <h2 className="text-sm font-extrabold text-[#0c2340] tracking-tight uppercase max-w-[280px]">
              {isDistressActive
                ? "SOS Distress Active"
                : "Hold for 3 secs to broadcast distress beacon"}
            </h2>
            
            <p className="text-[9px] font-bold uppercase tracking-wider mt-1.5 min-h-[14px]">
              {isDistressActive ? (
                <span className="text-emerald-600">Distress broadcast successfully logged at ICCC</span>
              ) : isHolding ? (
                <span className="text-rose-500 animate-pulse">Holding... Transmitting beacon compliance handshake</span>
              ) : (
                <span className="text-gray-400">Safehold lock prevents accidental distress triggers</span>
              )}
            </p>

            {/* Circular Hold Trigger Button */}
            <div className="relative w-44 h-44 flex items-center justify-center mt-8">
              <svg className="absolute w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 150 150">
                <circle
                  cx="75"
                  cy="75"
                  r={radius}
                  stroke="#f1f5f9"
                  strokeWidth={strokeWidth}
                  fill="none"
                />
                {!isDistressActive && holdProgress > 0 && (
                  <circle
                    cx="75"
                    cy="75"
                    r={radius}
                    stroke="#f43f5e"
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className="transition-all duration-75"
                  />
                )}
                {isDistressActive && (
                  <circle
                    cx="75"
                    cy="75"
                    r={radius}
                    stroke="#10b981"
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeLinecap="round"
                  />
                )}
              </svg>

              <button
                onClick={handleButtonClick}
                className={`w-32 h-32 rounded-full flex flex-col items-center justify-center gap-1.5 text-white shadow-xl transition-all duration-300 border-4 border-white select-none ${
                  isDistressActive
                    ? "bg-gradient-to-b from-emerald-400 to-emerald-600 shadow-emerald-500/30 scale-105 active:scale-100"
                    : isHolding
                    ? "bg-gradient-to-b from-rose-500 to-rose-700 shadow-rose-500/40 scale-95"
                    : "bg-gradient-to-b from-rose-400 to-rose-600 shadow-rose-500/30 hover:scale-105 active:scale-95"
                }`}
                aria-label={isDistressActive ? "Distress Beacon Active" : "Click for distress beacon"}
              >
                {isDistressActive ? (
                  <>
                    <ShieldCheck className="w-8 h-8 text-white animate-bounce" />
                    <span className="text-[10px] font-black uppercase tracking-wider">
                      SOS ON
                    </span>
                  </>
                ) : (
                  <>
                    <AlertOctagon className={`w-8 h-8 text-white ${isHolding ? "animate-pulse" : ""}`} />
                    <span className="text-[10px] font-black uppercase tracking-wider">
                      {isHolding ? "Holding..." : "SOS Beacon"}
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Active State Dispatched Unit Panel */}
          {isDistressActive && (
            <div className="w-full border border-emerald-200 bg-gradient-to-br from-emerald-50/80 to-teal-50/40 rounded-3xl p-5 mt-5 shadow-lg shadow-emerald-500/5 animate-fade-in">
              <div className="flex items-center justify-between border-b border-emerald-100/60 pb-3 mb-3.5">
                <div className="flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-[9px] font-black uppercase tracking-wider text-emerald-800">
                    Distress Beacon Active
                  </span>
                </div>
                <span className="inline-flex items-center gap-1 text-[8px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200/50 shadow-sm">
                  Broadcast Received
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative flex items-center shrink-0">
                  <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shadow-sm">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-sm -ml-3">
                    <HeartPulse className="w-5 h-5 animate-pulse" />
                  </div>
                </div>
                <div className="flex flex-col text-left">
                  <h3 className="text-sm font-black text-slate-800 leading-none">
                    Verified Support Dispatched
                  </h3>
                  <p className="text-[10px] font-bold text-slate-500 mt-1.5">
                    Team S-7 • Quick Action Rescue Unit
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="bg-white/90 backdrop-blur border border-emerald-100/50 rounded-2xl p-3 flex items-center gap-2.5 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="w-8 h-8 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider leading-none">Arriving In</span>
                    <span className="text-xs font-black text-slate-800 mt-1 leading-none">2 MINS</span>
                  </div>
                </div>

                <div className="bg-white/90 backdrop-blur border border-emerald-100/50 rounded-2xl p-3 flex items-center gap-2.5 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="w-8 h-8 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider leading-none">Distance</span>
                    <span className="text-xs font-black text-slate-800 mt-1 leading-none">120m</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Details */}
      <footer className="text-center py-2 shrink-0 flex flex-col items-center">
        {isDistressActive ? (
          <button
            onClick={() => {
              setIsDistressActive(false);
              setHoldProgress(0);
            }}
            className="text-xs font-semibold text-rose-500 hover:text-rose-700 active:scale-95 transition-all py-1 px-4 border border-rose-200 rounded-full bg-rose-50 hover:bg-rose-100 mb-2"
          >
            Cancel Emergency Distress
          </button>
        ) : (
          <p className="text-[10px] text-gray-400 font-medium">
            ICCC Smart Security Link AP-Pushkaralu v3.1
          </p>
        )}
      </footer>
    </div>
  );
}

export default SosPage;
