import { Menu, Bell, ArrowLeft } from "lucide-react";
import apLogo from "@/assets/ap-govt-logo.png";

function Navbar({ showBack, onBack }) {
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-100 px-4 py-3 flex items-center justify-between select-none">
      <div className="flex items-center gap-2">
        {showBack ? (
          <button
            onClick={onBack}
            className="w-[38px] h-[46px] bg-slate-50 border border-slate-100/50 rounded-[14px] flex items-center justify-center text-slate-700 hover:bg-slate-100 active:scale-95 transition-all shadow-sm"
            aria-label="Go Back"
          >
            <ArrowLeft className="w-5.5 h-5.5" />
          </button>
        ) : (
          <button
            className="w-[38px] h-[46px] bg-slate-50 border border-slate-100/50 rounded-[14px] flex items-center justify-center text-slate-700 hover:bg-slate-100 active:scale-95 transition-all shadow-sm"
            aria-label="Menu"
          >
            <Menu className="w-5.5 h-5.5" />
          </button>
        )}

        <img
          src={apLogo}
          className="h-10 w-10 object-contain shrink-0 ml-0.5"
          alt="Andhra Pradesh State Government Logo"
        />

        <div className="flex flex-col text-left justify-center ml-0.5">
          <span className="text-[15px] font-black text-[#0c2340] leading-tight tracking-tight">
            AP Pilgrim Grid
          </span>
          <span className="text-[8.5px] font-black uppercase tracking-wider text-slate-500 mt-1 leading-tight">
            GOVERNMENT OF
          </span>
          <span className="text-[8.5px] font-black uppercase tracking-wider text-slate-500 leading-tight">
            ANDHRA PRADESH
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="relative w-9 h-9 flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors" aria-label="Notifications">
          <Bell className="w-[22px] h-[22px]" />
          <span className="absolute top-0.5 right-0.5 bg-[#ef4444] text-white text-[8px] font-black w-[17px] h-[17px] rounded-full flex items-center justify-center border-2 border-white shadow-sm">
            12
          </span>
        </button>

        <button className="flex items-center gap-1.5 bg-white border border-slate-200/80 rounded-full px-4 py-1.5 text-xs font-black text-slate-800 hover:bg-slate-50 active:scale-95 transition-all shadow-sm">
          తెలుగు <span className="text-[9px] text-slate-400">▼</span>
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
