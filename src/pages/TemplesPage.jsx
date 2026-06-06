import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Clock, MapPin, Star, ChevronDown, ChevronUp, Landmark, ShieldAlert, Navigation, Calendar, Info } from "lucide-react";
import Navbar from "../layouts/Navbar";
import BottomNav from "../layouts/BottomNav";
import templeCover from "../assets/temple_cover.png";

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
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const [scrollIndex, setScrollIndex] = useState(0);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const scrollContainerRef = useRef(null);

  useEffect(() => {
    setScrollIndex(0);
    setExpandedCardId(null);
    setIsAccordionOpen(false);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ left: 0, behavior: "auto" });
    }
  }, [activeTab]);

  const handleScroll = (e) => {
    const scrollLeft = e.target.scrollLeft;
    const cardWidth = 296; // 280 (card width) + 16 (gap)
    const index = Math.round(scrollLeft / cardWidth);
    const maxIndex = filteredTemples.length - 1;
    setScrollIndex(Math.max(0, Math.min(index, maxIndex)));
    
    // Auto-collapse expanded details when user scrolls
    setExpandedCardId(null);
    setIsAccordionOpen(false);
  };

  const handleStart = (clientX, clientY) => {
    setDragStart({ x: clientX, y: clientY });
  };

  const handleEnd = (clientX, clientY, templeId) => {
    const dx = clientX - dragStart.x;
    const dy = clientY - dragStart.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    // 6px threshold to distinguish intentional tap from scrolling drag
    if (distance < 6) {
      setExpandedCardId((prev) => {
        const nextVal = prev === templeId ? null : templeId;
        setIsAccordionOpen(false); // Reset accordion when switching/toggling cards
        return nextVal;
      });
    }
  };

  const handleMouseDown = (e) => {
    handleStart(e.clientX, e.clientY);
  };

  const handleMouseUp = (e, templeId) => {
    handleEnd(e.clientX, e.clientY, templeId);
  };

  const handleTouchStart = (e) => {
    if (e.touches && e.touches[0]) {
      handleStart(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handleTouchEnd = (e, templeId) => {
    if (e.changedTouches && e.changedTouches[0]) {
      handleEnd(e.changedTouches[0].clientX, e.changedTouches[0].clientY, templeId);
    }
  };

  const toggleAccordion = (e) => {
    e.stopPropagation();
    setIsAccordionOpen((prev) => !prev);
  };

  const filteredTemples = TEMPLES_DATA.filter((temple) => temple.category === activeTab);

  return (
    <div className="w-screen h-[100dvh] flex flex-col overflow-hidden bg-[#f6f8fb]">
      <Navbar showBack={true} onBack={onBack} />

      <div className="flex gap-2 overflow-x-auto pb-1 px-4 pt-4 shrink-0 scrollbar-hide">
        <button
          onClick={() => setActiveTab("city")}
          className={`rounded-full border px-4 py-2.5 text-[10.5px] font-black uppercase tracking-wider transition-all whitespace-nowrap ${
            activeTab === "city"
              ? "border-[#11223f] bg-[#11223f] text-white shadow-md shadow-[#11223f]/10"
              : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
          }`}
        >
          Rajahmundry City Core
        </button>
        <button
          onClick={() => setActiveTab("extended")}
          className={`rounded-full border px-4 py-2.5 text-[10.5px] font-black uppercase tracking-wider transition-all whitespace-nowrap ${
            activeTab === "extended"
              ? "border-[#11223f] bg-[#11223f] text-white shadow-md shadow-[#11223f]/10"
              : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
          }`}
        >
          Konaseema & Day-Trips
        </button>
      </div>

      <div className="flex-1 flex flex-col justify-center min-h-0 relative pb-20">
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="w-full h-[470px] flex items-center overflow-x-auto gap-4 snap-x snap-mandatory scrollbar-hide px-10"
        >
          {filteredTemples.map((temple) => {
            const isExpanded = expandedCardId === temple.id;

            return (
              <div
                key={temple.id}
                onMouseDown={handleMouseDown}
                onMouseUp={(e) => handleMouseUp(e, temple.id)}
                onTouchStart={handleTouchStart}
                onTouchEnd={(e) => handleTouchEnd(e, temple.id)}
                className="w-[280px] h-[460px] shrink-0 snap-center cursor-pointer select-none"
              >
                <div
                  className="w-full h-full bg-white rounded-2xl border border-slate-200/80 shadow-md overflow-hidden flex flex-col transition-all duration-300 text-left relative"
                >
                  {/* COVER IMAGE SECTION */}
                  <div
                    className={`relative w-full overflow-hidden transition-all duration-500 shrink-0 ${
                      isExpanded ? "h-0 opacity-0" : "h-[290px] opacity-100"
                    }`}
                  >
                    <img
                      src={templeCover}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-102"
                      alt={temple.name}
                    />
                    {/* Distance overlay tag */}
                    <span className="absolute top-3 left-3 bg-white/95 text-slate-800 text-[10px] font-black px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      {temple.distance}
                    </span>
                    {/* Rating overlay tag */}
                    <span className="absolute top-3 right-3 bg-white/95 text-amber-600 text-[10px] font-black px-2.5 py-1 rounded-full shadow-md flex items-center gap-1 border border-slate-150">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      {temple.rating}
                    </span>
                  </div>

                  {/* BRIEF PANEL (Visible when not expanded) */}
                  {!isExpanded && (
                    <div className="p-4 flex-1 flex flex-col justify-between transition-all duration-500">
                      <div>
                        <h3 className="text-[14px] font-black text-slate-900 leading-snug">
                          {temple.name}
                        </h3>
                        <p className="text-[9.5px] text-slate-450 font-black uppercase tracking-wider mt-1.5 leading-none">
                          Tap Card to View Details
                        </p>
                      </div>

                      <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                        <span
                          className={`text-[8.5px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                            temple.crowdColor === "rose"
                              ? "bg-rose-50 text-rose-700 border-rose-250"
                              : temple.crowdColor === "amber"
                              ? "bg-amber-50 text-amber-700 border-amber-250"
                              : "bg-emerald-50 text-emerald-700 border-emerald-250"
                          }`}
                        >
                          {temple.crowdLevel}
                        </span>

                        <span className="text-[10px] text-blue-600 font-extrabold flex items-center gap-1">
                          Tap to Expand &darr;
                        </span>
                      </div>
                    </div>
                  )}

                  {/* DETAILS PANEL (Visible when expanded) */}
                  {isExpanded && (
                    <div
                      onMouseDown={(e) => e.stopPropagation()}
                      onMouseUp={(e) => e.stopPropagation()}
                      onTouchStart={(e) => e.stopPropagation()}
                      onTouchEnd={(e) => e.stopPropagation()}
                      onClick={(e) => e.stopPropagation()}
                      className="flex-1 flex flex-col justify-between p-4 overflow-y-auto scrollbar-hide text-left animate-fade-in"
                    >
                      <div className="space-y-3">
                        {/* Header info */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <h3 className="text-[13px] font-black text-slate-900 leading-snug">
                              {temple.name}
                            </h3>

                            <div className="mt-1 flex items-center gap-x-2 text-[9.5px] font-extrabold uppercase tracking-wider text-slate-400">
                              <span className="flex items-center gap-1 text-slate-500">
                                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                {temple.distance}
                              </span>
                              <span>•</span>
                              <span className="flex items-center gap-1 text-amber-600">
                                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                                {temple.rating}
                              </span>
                            </div>
                          </div>

                          <button
                            onClick={() => setExpandedCardId(null)}
                            className="text-[9.5px] font-black uppercase text-blue-650 border border-blue-200/60 bg-blue-50/50 rounded-lg px-2.5 py-1 shrink-0"
                          >
                            Collapse
                          </button>
                        </div>

                        {/* Live Crowd progress bar */}
                        <div>
                          <div className="flex items-center justify-between text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                            <span>Live Crowd Density</span>
                            <span className="text-slate-700 font-extrabold">
                              {temple.crowdPercent}% ({temple.crowdLevel})
                            </span>
                          </div>
                          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                temple.crowdColor === "emerald"
                                  ? "bg-emerald-500"
                                  : temple.crowdColor === "amber"
                                  ? "bg-amber-500"
                                  : "bg-rose-500"
                              }`}
                              style={{ width: `${temple.crowdPercent}%` }}
                            />
                          </div>
                        </div>

                        {/* Significance Panel */}
                        <div className="bg-slate-50 border border-slate-100 p-2.5 rounded-xl flex items-start gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-[#11223f]/5 text-[#11223f] flex items-center justify-center shrink-0 mt-0.5">
                            <Landmark className="w-4 h-4" />
                          </div>
                          <div className="flex-1">
                            <p className="text-[8.5px] font-black uppercase tracking-wider text-[#11223f]">
                              Sacred Significance
                            </p>
                            <p className="text-[10px] text-slate-600 font-medium leading-normal mt-0.5">
                              {temple.significance}
                            </p>
                          </div>
                        </div>

                        {/* Traditional Practice Panel */}
                        <div className="bg-amber-50/50 border border-amber-200/50 p-2.5 rounded-xl flex items-start gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                            <ShieldAlert className="w-4 h-4" />
                          </div>
                          <div className="flex-1">
                            <p className="text-[8.5px] font-black uppercase tracking-wider text-amber-700">
                              Traditional Practice
                            </p>
                            <p className="text-[10px] text-amber-800 font-bold leading-normal mt-0.5">
                              {temple.traditionalPractice}
                            </p>
                          </div>
                        </div>

                        {/* Accordion: View Timings & Dress Code */}
                        <div className="border border-slate-150 rounded-xl overflow-hidden bg-slate-50/40">
                          <button
                            onClick={toggleAccordion}
                            className="w-full flex items-center justify-between p-2.5 bg-slate-50/70 hover:bg-slate-100 text-[10px] font-black uppercase text-slate-500 tracking-wider"
                          >
                            <span>Timings & Dress Code</span>
                            {isAccordionOpen ? (
                              <ChevronUp className="w-3.5 h-3.5 stroke-[3] text-slate-450" />
                            ) : (
                              <ChevronDown className="w-3.5 h-3.5 stroke-[3] text-slate-450" />
                            )}
                          </button>

                          {isAccordionOpen && (
                            <div className="bg-white p-3 border-t border-slate-150 flex flex-col gap-2.5 text-[10px]">
                              <div>
                                <span className="text-[8.5px] font-black uppercase text-slate-450">
                                  Timings
                                </span>
                                <p className="font-bold text-slate-700 mt-0.5">
                                  {temple.details.timings}
                                </p>
                              </div>
                              <div>
                                <span className="text-[8.5px] font-black uppercase text-slate-450">
                                  Dress Code
                                </span>
                                <p className="font-bold text-slate-700 mt-0.5">
                                  {temple.details.dressCode}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Shuttle navigation action */}
                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end">
                        {temple.shuttleRouteId ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              alert(
                                `Shuttle service is active. Please board Bus No. ${temple.shuttleRouteId} at your nearest ghat boarding point.`
                              );
                            }}
                            className="bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 text-indigo-700 text-[10px] font-black px-3 py-1.5 rounded-lg flex items-center gap-1 active:scale-95 transition-all shadow-sm"
                          >
                            <Navigation className="w-3 h-3 fill-indigo-75" />
                            Navigate Via Shuttle
                          </button>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              alert("Special regional tour buses can be booked at the help desk.");
                            }}
                            className="bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 text-[10px] font-black px-3 py-1.5 rounded-lg flex items-center gap-1 active:scale-95 transition-all shadow-sm"
                          >
                            <Calendar className="w-3 h-3" />
                            Book Day Tour
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center gap-1.5 pt-3 pb-1 shrink-0">
          {filteredTemples.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                if (scrollContainerRef.current) {
                  const cardWidth = 296; // 280 + 16
                  scrollContainerRef.current.scrollTo({
                    left: index * cardWidth,
                    behavior: "smooth"
                  });
                }
              }}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                scrollIndex === index ? "w-5 bg-slate-800" : "w-1.5 bg-slate-300"
              }`}
              aria-label={`Go to card ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <BottomNav activeTab="" onTabSelect={onNavigate} />
    </div>
  );
}

export default TemplesPage;
