import { ChevronRight } from "lucide-react";
import waLogo from "../assets/wa-logo.png";

function ChatBanner() {
  return (
    <div className="fixed bottom-[40px] left-1/2 -translate-x-1/2 w-full max-w-sm px-4 z-40 select-none">
      <div className="bg-[#f0f9ff]/95 backdrop-blur border border-sky-100 rounded-[22px] p-3 flex items-center justify-between gap-3.5 shadow-md shadow-sky-900/5 hover:shadow-xl transition-all duration-300">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-white border border-emerald-100 flex items-center justify-center shadow-sm shrink-0 overflow-hidden">
            <img src={waLogo} alt="WhatsApp" className="w-6 h-6 object-contain" />
          </div>

          <div className="flex flex-col text-left justify-center ml-0.5">
            <span className="text-[10px] text-slate-500 font-bold leading-none">
              Need instant help?
            </span>
            <span className="text-[13px] font-black text-[#004cd2] leading-none mt-1">
              Chat with PushkarAI
            </span>
            <span className="text-[9.5px] text-slate-400 font-bold leading-none mt-1">
              Official WhatsApp Assistant
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <svg viewBox="0 0 48 48" className="w-[44px] h-[44px] text-blue-600 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M24 16v-6" />
            <circle cx="24" cy="8" r="2" fill="currentColor" />
            <rect x="12" y="16" width="24" height="16" rx="8" />
            <path d="M12 21a3 3 0 0 0-3 3v2a3 3 0 0 0 3 3" />
            <path d="M36 21a3 3 0 0 1 3 3v2a3 3 0 0 1-3 3" />
            <circle cx="19" cy="24" r="1.5" fill="currentColor" />
            <circle cx="29" cy="24" r="1.5" fill="currentColor" />
            <path d="M21 28c1 1 2 1 3 0" />
            <path d="M16 32v2a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4v-2" />
            <path d="M35 12h5a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-5a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2z" />
            <path d="M35 12l-1 2.5 1.5-2.5" />
            <circle cx="37" cy="9" r="0.5" fill="currentColor" />
            <circle cx="39" cy="9" r="0.5" fill="currentColor" />
            <circle cx="41" cy="9" r="0.5" fill="currentColor" />
          </svg>

          <button className="bg-[#004cd2] hover:bg-[#003db3] active:scale-95 transition-all text-white text-[11px] font-black px-3.5 py-2.5 rounded-full flex items-center gap-1 shadow-md shadow-blue-500/10 shrink-0 whitespace-nowrap">
            Chat Now
            <ChevronRight className="w-3.5 h-3.5 stroke-[3]" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatBanner;
