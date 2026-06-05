import { useState, useEffect } from "react";
import { ArrowLeft, Clock, MapPin, Star, ChevronDown, ChevronUp, Landmark, ShieldAlert, Navigation, Calendar, Info } from "lucide-react";
import Navbar from "../layouts/Navbar";
import BottomNav from "../layouts/BottomNav";
import apLogo from "@/assets/ap-govt-logo.png";

const TEMPLES_DATA = [
  {
    id: 1,
    name: "Sri Kotilingeshwara Swamy Temple",
    category: "city",
    crowdLevel: "High Peak",
    crowdPercent: 88,
    crowdColor: "rose",
    rating: "4.7",
    reviews: "8.2K",
    distance: "0.2 km",
    shuttleRouteId: 2,
    significance: "Houses one crore (10 million) Shiva Lingas, representing holy power.",
    traditionalPractice: "Perform Abhishekam with sacred Godavari water collected directly from the ghat.",
    details: {
      timings: "5:00 AM - 11:30 AM, 4:30 PM - 9:00 PM",
      dressCode: "Traditional wear recommended. Men in dhotis/kurtas, women in sarees/salwars.",
      history: "Dating back to the 10th century, this temple stands near the banks where sage Gautama performed penance."
    }
  },
  {
    id: 2,
    name: "Sri Markandeya Swamy Temple",
    category: "city",
    crowdLevel: "Moderate Swell",
    crowdPercent: 54,
    crowdColor: "amber",
    rating: "4.8",
    reviews: "4.1K",
    distance: "0.6 km",
    shuttleRouteId: 1,
    significance: "Associated with Sage Markandeya, who was saved from death by Lord Shiva.",
    traditionalPractice: "Offer Bilva Patra leaves to the central deity during the noon Pradosha Puja.",
    details: {
      timings: "6:00 AM - 12:00 PM, 4:00 PM - 8:30 PM",
      dressCode: "Decent casual or traditional attire.",
      history: "Reconstructed on ancient foundations, it is believed to be the site of Markandeya's life-saving devotion."
    }
  },
  {
    id: 3,
    name: "ISKCON Temple Rajahmundry",
    category: "city",
    crowdLevel: "Low Crowd",
    crowdPercent: 22,
    crowdColor: "emerald",
    rating: "4.9",
    reviews: "6.3K",
    distance: "1.1 km",
    shuttleRouteId: 2,
    significance: "A vibrant center for Krishna consciousness with beautiful deities overlooking the Godavari.",
    traditionalPractice: "Attend the evening Maha Harati and join the congregational chanting at 6:30 PM.",
    details: {
      timings: "4:30 AM - 12:45 PM, 4:00 PM - 8:30 PM",
      dressCode: "Modest casual attire.",
      history: "Constructed on Gowthami Ghat, this 2-acre complex features visual exhibits of Vedic heritage."
    }
  },
  {
    id: 4,
    name: "Sri Satyanarayana Swamy Temple",
    category: "extended",
    crowdLevel: "High Peak",
    crowdPercent: 94,
    crowdColor: "rose",
    rating: "4.8",
    reviews: "28K",
    distance: "72 km",
    shuttleRouteId: 3,
    significance: "The second most visited hill shrine in AP, famous for the sacred Satyanarayana Vratam.",
    traditionalPractice: "Participate in the mass Satyanarayana Vratam performed on the Ratnagiri hills.",
    details: {
      timings: "6:00 AM - 9:00 PM (Continuous)",
      dressCode: "Strict traditional attire required for Vratam performers.",
      history: "Established in 1891 on Ratnagiri hill, this temple architecture resembles a chariot on wheels."
    }
  },
  {
    id: 5,
    name: "Sri Lakshmi Narasimha Swamy Temple",
    category: "extended",
    crowdLevel: "Moderate Swell",
    crowdPercent: 62,
    crowdColor: "amber",
    rating: "4.7",
    reviews: "12K",
    distance: "85 km",
    shuttleRouteId: null,
    significance: "Located at the holy Sagara Sangamam where the Godavari river meets the Bay of Bengal.",
    traditionalPractice: "Perform the Sagara Sangamam holy bath and offer deepam (lamps) to the sea before entering.",
    details: {
      timings: "6:00 AM - 1:00 PM, 3:30 PM - 7:30 PM",
      dressCode: "Traditional attire recommended.",
      history: "A historical beach temple where Lord Narasimha is believed to have pacified his post-Hiranyakashipu anger."
    }
  },
  {
    id: 6,
    name: "Sri Ainavilli Siddhi Vinayaka Temple",
    category: "extended",
    crowdLevel: "Low Crowd",
    crowdPercent: 18,
    crowdColor: "emerald",
    rating: "4.9",
    reviews: "9.5K",
    distance: "46 km",
    shuttleRouteId: null,
    significance: "A self-manifested (Swayambhu) Ganesha temple revered as a blocker of obstacles.",
    traditionalPractice: "Break a coconut at the entrance and write your wishes on the sacred temple ledger.",
    details: {
      timings: "5:00 AM - 1:00 PM, 3:30 PM - 8:00 PM",
      dressCode: "Decent casual or traditional attire.",
      history: "Dating back thousands of years, sage Vyasa is believed to have installed Sri Siddhi Vinayaka before scripting Mahabharata."
    }
  }
];

function TemplesPage({ onBack, onNavigate }) {
  const [activeTab, setActiveTab] = useState("city");
  const [expandedCardId, setExpandedCardId] = useState(null);

  const toggleExpand = (e, id) => {
    e.stopPropagation();
    setExpandedCardId((prev) => (prev === id ? null : id));
  };

  const getCrowdBadgeClass = (color) => {
    if (color === "emerald") {
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }
    if (color === "amber") {
      return "bg-amber-50 text-amber-700 border-amber-200";
    }
    return "bg-rose-50 text-rose-700 border-rose-200";
  };

  const getCrowdProgressClass = (color) => {
    if (color === "emerald") return "bg-emerald-500";
    if (color === "amber") return "bg-amber-500";
    return "bg-rose-500";
  };

  const filteredTemples = TEMPLES_DATA.filter((temple) => temple.category === activeTab);

  return (
    <div className="w-screen h-[100dvh] flex flex-col overflow-hidden bg-[#f6f8fb]">
      <Navbar showBack={true} onBack={onBack} />

      <div className="flex gap-2 overflow-x-auto pb-1 px-4 pt-4 shrink-0 scrollbar-hide">
        <button
          onClick={() => setActiveTab("city")}
          className={`rounded-full border px-4 py-2.5 text-[10.5px] font-black uppercase tracking-wider transition-all whitespace-nowrap ${activeTab === "city"
              ? "border-[#11223f] bg-[#11223f] text-white shadow-md shadow-[#11223f]/10"
              : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
            }`}
        >
          Rajahmundry City Core
        </button>
        <button
          onClick={() => setActiveTab("extended")}
          className={`rounded-full border px-4 py-2.5 text-[10.5px] font-black uppercase tracking-wider transition-all whitespace-nowrap ${activeTab === "extended"
              ? "border-[#11223f] bg-[#11223f] text-white shadow-md shadow-[#11223f]/10"
              : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
            }`}
        >
          Konaseema & Day-Trips
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 pb-24">
        {filteredTemples.map((temple) => {
          const isExpanded = expandedCardId === temple.id;

          return (
            <div
              key={temple.id}
              className="bg-white rounded-2xl border border-slate-200/60 overflow-hidden shadow-sm flex flex-col transition-all duration-200"
            >
              <div className="p-4 flex flex-col text-left">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[14px] font-black text-slate-900 leading-snug">
                      {temple.name}
                    </h3>

                    <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                      <span className="flex items-center gap-1 text-slate-500">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {temple.distance} from Core
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-amber-600">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        {temple.rating} ({temple.reviews})
                      </span>
                    </div>
                  </div>

                  <span className={`inline-flex text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border shrink-0 ${getCrowdBadgeClass(temple.crowdColor)}`}>
                    {temple.crowdLevel}
                  </span>
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest shrink-0">Live Crowd</div>
                  <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${getCrowdProgressClass(temple.crowdColor)}`} style={{ width: `${temple.crowdPercent}%` }} />
                  </div>
                  <div className="text-[10px] font-black text-slate-600 shrink-0">{temple.crowdPercent}%</div>
                </div>

                <div className="mt-3 bg-slate-50 border border-slate-100 p-3 rounded-xl flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#11223f]/5 text-[#11223f] flex items-center justify-center shrink-0">
                    <Landmark className="w-4.5 h-4.5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[9.5px] font-black uppercase tracking-wider text-[#11223f]">Sacred Significance</p>
                    <p className="text-[11px] text-slate-600 font-medium leading-normal mt-0.5">{temple.significance}</p>
                  </div>
                </div>

                <div className="mt-3 bg-amber-50/50 border border-amber-200/50 p-3 rounded-xl flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-700 flex items-center justify-center shrink-0">
                    <ShieldAlert className="w-4.5 h-4.5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[9.5px] font-black uppercase tracking-wider text-amber-700">Traditional Practice</p>
                    <p className="text-[11px] text-amber-800 font-bold leading-normal mt-0.5">{temple.traditionalPractice}</p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between pt-1">
                  <button
                    onClick={(e) => toggleExpand(e, temple.id)}
                    className="flex items-center gap-1 text-[9px] font-black uppercase tracking-wider text-slate-500 hover:text-slate-700"
                  >
                    {isExpanded ? (
                      <>
                        Hide Details <ChevronUp className="w-3.5 h-3.5 stroke-[3]" />
                      </>
                    ) : (
                      <>
                        View Timings & Dress Code <ChevronDown className="w-3.5 h-3.5 stroke-[3]" />
                      </>
                    )}
                  </button>

                  <div className="flex items-center gap-2">
                    {temple.shuttleRouteId ? (
                      <button
                        onClick={() => alert(`Shuttle service is active. Please board Bus No. ${temple.shuttleRouteId} at your nearest ghat boarding point.`)}
                        className="bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 text-indigo-700 text-[10px] font-black px-3 py-1.5 rounded-lg flex items-center gap-1 active:scale-95 transition-all shadow-sm"
                      >
                        <Navigation className="w-3 h-3 fill-indigo-75" />
                        Navigate Via Shuttle
                      </button>
                    ) : (
                      <button
                        onClick={() => alert("Special regional tour buses can be booked at the help desk.")}
                        className="bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 text-[10px] font-black px-3 py-1.5 rounded-lg flex items-center gap-1 active:scale-95 transition-all shadow-sm"
                      >
                        <Calendar className="w-3 h-3" />
                        Book Day Tour
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {isExpanded && (
                <div className="border-t border-slate-100 bg-slate-50/50 p-4 rounded-b-2xl flex flex-col gap-3 text-left">
                  <div>
                    <span className="text-[9px] font-black uppercase tracking-wider text-slate-400">Pooja & Darshan Timings</span>
                    <p className="text-[11.5px] font-bold text-slate-700 mt-0.5">{temple.details.timings}</p>
                  </div>
                  <div>
                    <span className="text-[9px] font-black uppercase tracking-wider text-slate-400">Pilgrim Dress Code</span>
                    <p className="text-[11.5px] font-bold text-slate-700 mt-0.5">{temple.details.dressCode}</p>
                  </div>
                  <div>
                    <span className="text-[9px] font-black uppercase tracking-wider text-slate-400">Shrine History</span>
                    <p className="text-[11.5px] font-semibold text-slate-500 leading-normal mt-0.5">{temple.details.history}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <BottomNav activeTab="" onTabSelect={onNavigate} />
    </div>
  );
}

export default TemplesPage;
