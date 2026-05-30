import { useEffect, useRef, useState } from "react";
import { Home, Sparkles, AlertTriangle, User } from "lucide-react";
import emergencySiren from "@/assets/emergency-siren.png";

function HoldSosButton({ onActivate }) {
  const HOLD_DURATION = 3000; // ms
  const [progress, setProgress] = useState(0);
  const [holding, setHolding] = useState(false);
  const timerRef = useRef(null);
  const intervalRef = useRef(null);
  const startRef = useRef(0);

  useEffect(() => {
    return () => {
      clearTimeout(timerRef.current);
      clearInterval(intervalRef.current);
    };
  }, []);

  const beginHold = (e) => {
    e.preventDefault();
    if (holding) return;
    setHolding(true);
    startRef.current = Date.now();
    setProgress(0);

    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startRef.current;
      const pct = Math.min(100, (elapsed / HOLD_DURATION) * 100);
      setProgress(pct);
    }, 50);

    timerRef.current = setTimeout(() => {
      // complete
      setProgress(100);
      setHolding(false);
      clearInterval(intervalRef.current);
      onActivate();
    }, HOLD_DURATION);
  };

  const cancelHold = () => {
    if (!holding) return;
    setHolding(false);
    setProgress(0);
    clearTimeout(timerRef.current);
    clearInterval(intervalRef.current);
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <button
        onMouseDown={beginHold}
        onMouseUp={cancelHold}
        onMouseLeave={cancelHold}
        onTouchStart={beginHold}
        onTouchEnd={cancelHold}
        onTouchCancel={cancelHold}
        aria-label="Hold to trigger SOS"
        className="relative w-16 h-16 rounded-full border-4 border-white bg-white shadow-lg flex items-center justify-center touch-none"
        style={{ WebkitTapHighlightColor: 'transparent' }}
      >
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: `conic-gradient(rgba(190,18,60,0.95) ${progress}%, rgba(255,255,255,0) ${progress}% )`,
            transition: holding ? 'none' : 'background 150ms linear',
          }}
        />

        <div className="relative flex flex-col items-center justify-center">
          <img src={emergencySiren} className="w-9 h-7 object-contain shrink-0 select-none" alt="" />
          <span className="text-[6.5px] text-red-600 font-bold tracking-tighter uppercase mt-0.5 leading-none select-none">
            {holding ? 'Hold...' : 'EMERGENCY'}
          </span>
        </div>
      </button>
    </div>
  );
}

function BottomNav({ activeTab, onTabSelect }) {
  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-sm bg-white border-t border-gray-200 px-2 py-2 flex justify-around items-center z-50 shadow-2xl select-none">
      <button
        onClick={() => onTabSelect("home")}
        className="flex flex-col items-center justify-center w-14 h-11 transition-transform active:scale-95"
      >
        <Home className={`w-5 h-5 ${activeTab === "home" ? "text-blue-600" : "text-gray-400 hover:text-gray-600"}`} />
        <span className={`text-[9px] font-bold mt-0.5 leading-none ${activeTab === "home" ? "text-blue-600" : "text-gray-400"}`}>
          Home
        </span>
      </button>

      <button
        onClick={() => onTabSelect("ai-ghat")}
        className="flex flex-col items-center justify-center w-14 h-11 transition-transform active:scale-95"
      >
        <Sparkles className={`w-5 h-5 ${activeTab === "ai-ghat" ? "text-blue-600" : "text-gray-400 hover:text-gray-600"}`} />
        <span className={`text-[9px] font-bold mt-0.5 leading-none text-center ${activeTab === "ai-ghat" ? "text-blue-600" : "text-gray-400"}`}>
          AI Ghat
        </span>
      </button>

      <div className="relative w-16 h-16 -mt-8 shrink-0">
        <button
          onClick={() => onTabSelect("sos")}
          className="absolute inset-0 bg-[#FFFFFF] rounded-full border-4 border-white shadow-lg shadow-red-500/40 flex flex-col items-center justify-center hover:bg-[#be123c] hover:scale-105 active:scale-95 transition-all"
          aria-label="Emergency SOS"
        >
          <img src={emergencySiren} className="w-9 h-7 object-contain shrink-0 select-none" alt="" />
          <span className="text-[6.5px] text-red-600 font-bold tracking-tighter uppercase mt-0.5 leading-none select-none">
            EMERGENCY
          </span>
        </button>
      </div>

      <button
        onClick={() => onTabSelect("missing-child")}
        className="flex flex-col items-center justify-center w-14 h-11 transition-transform active:scale-95"
      >
        <AlertTriangle className={`w-5 h-5 ${activeTab === "missing-child" ? "text-blue-600" : "text-gray-400 hover:text-gray-600"}`} />
        <span className={`text-[9px] font-bold mt-0.5 leading-none text-center ${activeTab === "missing-child" ? "text-blue-600" : "text-gray-400"}`}>
          Missing
        </span>
      </button>

      <button
        onClick={() => onTabSelect("profile")}
        className="flex flex-col items-center justify-center w-14 h-11 transition-transform active:scale-95"
      >
        <User className={`w-5 h-5 ${activeTab === "profile" ? "text-blue-600" : "text-gray-400 hover:text-gray-600"}`} />
        <span className={`text-[9px] font-bold mt-0.5 leading-none ${activeTab === "profile" ? "text-blue-600" : "text-gray-400"}`}>
          Profile
        </span>
      </button>
    </div>
  );
}

export default BottomNav;
