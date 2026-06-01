import { MapPin, Sun, Waves, Megaphone, ChevronRight } from "lucide-react";
import heroBg from "@/assets/hero-bg.png";
import modi from "@/assets/modi.png";
import naidu from "@/assets/naidu.png";
import pk from "@/assets/pk.png";
import purandeswari from "@/assets/purandeswari.png";
import vasu from "@/assets/vasu.png";

function HeroSection() {

  const LEADERS = [
  { src: modi},
  { src: naidu},
  { src: pk},
  { src: purandeswari},
  { src: vasu},
];


  return (
    <section className="w-full h-72 relative overflow-hidden select-none">
      <img
        src={heroBg}
        className="absolute inset-0 w-full h-full object-cover"
        alt="A Image showing godavari river"
      />
      <div className="absolute top-4 left-4 z-10 flex gap-1">
  <div className="w-8 h-8 rounded-full border-2 border-white overflow-hidden bg-white">
    <img
      src={modi}
      alt="Leader 1"
      className="w-full h-full object-cover scale-[3.0]"
    />
  </div>

  <div className="w-8 h-8 rounded-full border-2 border-white overflow-hidden bg-white">
    <img
      src={naidu}
      alt="Leader 2"
      className="w-full h-full object-cover scale-[2.0]"
    />
  </div>

  <div className="w-8 h-8 rounded-full border-2 border-white overflow-hidden bg-white">
    <img
      src={pk}
      alt="Leader 3"
      className="w-full h-full object-cover scale-[3.0]"
    />
  </div>
  <div className="w-8 h-8 rounded-full border-2 border-white overflow-hidden bg-white">
    <img
      src={purandeswari}
      alt="Leader 4"
      className="w-full h-full object-cover scale-[3.0]"
    />
  </div>
  <div className="w-8 h-8 rounded-full border-2 border-white overflow-hidden bg-white">
    <img
      src={vasu}
      alt="Leader 5"
      className="w-full h-full object-cover scale-[2.0]"
    />
  </div>
</div>
      

      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md rounded-2xl p-3 shadow-md flex flex-col gap-2 border border-white/40 min-w-[128px]">
        <div className="flex items-center gap-2.5 text-left">
          <Sun className="w-5 h-5 text-yellow-500 shrink-0" />
          <div className="flex flex-col">
            <span className="font-bold text-sm text-gray-900 leading-none">28°C</span>
            <span className="text-[9px] text-gray-500 font-semibold leading-none mt-1">Sunny</span>
          </div>
        </div>
        <div className="h-px bg-gray-250 w-full" />
        <div className="flex items-center gap-2.5 text-left">
          <Waves className="w-5 h-5 text-blue-400 shrink-0" />
          <div className="flex flex-col">
            <span className="text-[9px] text-gray-700 font-bold leading-none">Godavari River</span>
            <span className="text-[9px] text-green-600 font-bold leading-none mt-1">Normal</span>
          </div>
        </div>
      </div>

      <div className="absolute top-24 left-4 text-white text-left">
        <h2 className="text-2xl font-bold tracking-tight text-white leading-tight">
          Welcome Pilgrim
        </h2>
        <p className="text-[13px] font-medium text-white/90 mt-1 leading-none">
          Plan your holy journey
        </p>
        <p className="text-[13px] font-medium text-white/90 leading-none mt-1">
          Stay safe, stay blessed
        </p>
        <div className="inline-flex items-center gap-1.5 bg-black/5 border border-black/5 rounded-full px-3 py-1 text-white text-xs font-semibold mt-3 shadow-sm">
          <MapPin className="w-3.5 h-3.5 text-white/80" />
          <span>Rajahmundry, Andhra Pradesh</span>
          <span className="text-[8px] text-[#0c2340]/50">▼</span>
        </div>
      </div>

      <div className="absolute bottom-4 right-4 bg-slate-900/90 backdrop-blur-md text-white pl-3.5 pr-2.5 py-2 rounded-2xl flex items-center gap-2.5 border border-white/10 shadow-lg select-none hover:bg-slate-900 transition-colors">
        <div className="bg-yellow-400/20 p-1.5 rounded-xl shrink-0 flex items-center justify-center">
          <Megaphone className="w-4 h-4 text-yellow-400" />
        </div>
        <div className="flex flex-col text-left leading-tight">
          <span className="text-[9px] text-gray-300 font-medium leading-none">Pushkar Ghat is</span>
          <span className="text-yellow-400 font-bold text-[10px] leading-none mt-1">Medium Crowded</span>
        </div>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400 ml-1.5" />
      </div>
    </section>
  );
}

export default HeroSection;
