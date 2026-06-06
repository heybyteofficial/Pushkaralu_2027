import { useState, useEffect } from "react";
import { 
  ArrowLeft, 
  Utensils, 
  Droplet, 
  MapPin, 
  Clock, 
  Navigation, 
  Thermometer, 
  Zap, 
  RefreshCw, 
  Heart, 
  Waves, 
  Compass, 
  Info,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import Navbar from "../layouts/Navbar";
import BottomNav from "../layouts/BottomNav";

const INITIAL_FOOD_CENTERS = [
  {
    id: "food-1",
    name: "Annadhanam Center 1",
    subName: "Near Kotilingala Ghat",
    type: "food",
    capacityText: "High Capacity (10,000+ meals/hr)",
    capacityPercent: 92,
    scheduleText: "Running 24/7",
    waitMins: 4,
    distance: "0.3 km",
    servingWindow: "Continuous Service",
    statusText: "Serving Meal Batch 7: Hot Pulihora, Sambar Rice & Curd Rice",
    isSponsored: true,
    sponsorName: "Tirumala Tirupati Devasthanams (TTD)",
    safetyRating: "5.0 ★ Food Safety Certified",
    routeCheckpoints: ["Kotilingala Parking Hub", "Sector B Barrier", "Center 1 Entrance"]
  },
  {
    id: "food-2",
    name: "Gowthami Ghat Free Food Pavilion",
    subName: "Adjacent to ISKCON Temple",
    type: "food",
    capacityText: "Trust Sponsored Pavilion",
    capacityPercent: 74,
    scheduleText: "6:00 AM - 11:00 PM",
    waitMins: 12,
    distance: "1.1 km",
    servingWindow: "Current Batch Ends in 15 mins",
    statusText: "Serving Meal Batch 4: Full Andhra Thali & Special Laddu Prasad",
    isSponsored: true,
    sponsorName: "Rajahmundry Local Merchants Trust",
    safetyRating: "4.8 ★ FSSAI Audited",
    routeCheckpoints: ["Gowthami Ghat Arch", "Satsang Exhibition Area", "Pavilion Gate 3"]
  }
];

const INITIAL_WATER_ZONES = [
  {
    id: "water-1",
    name: "Central Water Filter Plant Node 3",
    subName: "Pushkar Ghat Main Entry Gate",
    type: "water",
    capacityText: "Massive 5,000L Chill Dispenser",
    capacityPercent: 85,
    tempCelsius: 16,
    tdsPpm: 94,
    distance: "0.1 km",
    servingWindow: "Purifying Live",
    statusText: "Fully Operational • 4 Chilled Drinking Taps Active",
    waterQuality: "RO + UV Purified • Ice Chilled",
    routeCheckpoints: ["Pushkar Ghat Plaza", "First Aid Node B", "Dispensation Bay 3"]
  },
  {
    id: "water-2",
    name: "Mobile Water Bowser Grid B-4",
    subName: "Saraswati Ghat Outer Loop",
    type: "water",
    capacityText: "APSRTC Mobile Supply Unit",
    capacityPercent: 62,
    tempCelsius: 18,
    tdsPpm: 105,
    distance: "0.8 km",
    servingWindow: "Stationary until 9:30 PM",
    statusText: "Active Dispatch • Refilled 10 mins ago at Mother Plant",
    waterQuality: "Municipal Chilled RO Supply",
    routeCheckpoints: ["Saraswati Ghat Main Stand", "VIP Ring Road Corner", "Bowser Dock B-4"]
  }
];

function FoodWaterPage({ onBack, onNavigate }) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [foodCenters, setFoodCenters] = useState(INITIAL_FOOD_CENTERS);
  const [waterZones, setWaterZones] = useState(INITIAL_WATER_ZONES);
  
  // Tab/Filter State: "all" | "food" | "water"
  const [selectedFilter, setSelectedFilter] = useState("all");
  
  // Expanded Navigation Route state
  const [expandedRouteId, setExpandedRouteId] = useState(null);
  
  // Live Simulation Loading/Feedback states
  const [isSimulatingFood, setIsSimulatingFood] = useState(false);
  const [isSimulatingWater, setIsSimulatingWater] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage("");
    }, 3000);
  };

  // Trigger food batch simulation
  const handleSimulateFood = (e) => {
    e.stopPropagation(); // Avoid triggering filter toggle if clicked inside card
    if (isSimulatingFood) return;
    
    setIsSimulatingFood(true);
    showToast("Updating Annadhanam centers: dispatching next meal batch...");
    
    setTimeout(() => {
      setFoodCenters(prev => 
        prev.map((item, idx) => {
          const newWait = Math.max(2, item.waitMins + (idx === 0 ? 2 : -4));
          const newPercent = idx === 0 ? 98 : 88;
          const newBatch = idx === 0 
            ? "Serving Meal Batch 8: Sweet Pongal & Hot Sambar Rice"
            : "Serving Meal Batch 5: Hot Pulihora & Lemon Rice";
          return {
            ...item,
            waitMins: newWait,
            capacityPercent: newPercent,
            statusText: newBatch
          };
        })
      );
      setIsSimulatingFood(false);
      showToast("Annadhanam queue matrices refreshed successfully!");
    }, 1200);
  };

  // Trigger water tank refill simulation
  const handleSimulateWater = (e) => {
    e.stopPropagation();
    if (isSimulatingWater) return;
    
    setIsSimulatingWater(true);
    showToast("Connecting grid bowsers: initiating automatic tank refills...");
    
    setTimeout(() => {
      setWaterZones(prev => 
        prev.map((item, idx) => {
          return {
            ...item,
            capacityPercent: idx === 0 ? 100 : 90,
            statusText: idx === 0 
              ? "Fully Restocked • Tank level at 100% capacity"
              : "Refill complete at Bowser Dock B-4 • Flow rates optimized"
          };
        })
      );
      setIsSimulatingWater(false);
      showToast("Chilled water reservoirs at maximum capacity!");
    }, 1200);
  };

  const toggleRouteExpand = (id) => {
    setExpandedRouteId(prev => (prev === id ? null : id));
  };

  // Calculate Aggregates for Dashboard
  const avgFoodWait = Math.round(
    foodCenters.reduce((acc, item) => acc + item.waitMins, 0) / foodCenters.length
  );
  const avgWaterLevel = Math.round(
    waterZones.reduce((acc, item) => acc + item.capacityPercent, 0) / waterZones.length
  );

  // Filter combined dataset
  const displayItems = [
    ...(selectedFilter === "all" || selectedFilter === "food" ? foodCenters : []),
    ...(selectedFilter === "all" || selectedFilter === "water" ? waterZones : [])
  ].sort((a, b) => {
    const distA = parseFloat(a.distance.split(" ")[0]);
    const distB = parseFloat(b.distance.split(" ")[0]);
    return distA - distB;
  });

  return (
    <div className="w-screen max-w-sm mx-auto min-h-screen bg-[#f4f7fc] flex flex-col relative pb-36 font-sans shadow-2xl border-x border-gray-200">
      {/* Standard Header */}
      <Navbar showBack={true} onBack={onBack} />

      {/* Main Interactive Screen Content */}
      <div className="flex-1 px-4 py-3 space-y-4">
        
        {/* Government Announcement Banner */}
        <div className="bg-[#11223f] text-white p-3 rounded-2xl flex items-center gap-3 shadow-md border-l-4 border-amber-500">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
            <Zap className="w-4.5 h-4.5 animate-pulse" />
          </div>
          <div className="flex-1 text-left min-w-0">
            <p className="text-[9.5px] font-black uppercase tracking-wider text-amber-400 leading-none">
              AP Pilgrim Command Center Live
            </p>
            <p className="text-[10.5px] text-slate-200 mt-1 leading-normal font-medium truncate">
              Chilled RO Water & Free Annadhanam monitored in real-time.
            </p>
          </div>
        </div>

        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-[#11223f]/95 text-white text-[11px] font-bold py-2 px-4 rounded-full border border-amber-500/30 shadow-2xl flex items-center gap-2 animate-bounce">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* SECTION 2: DUAL-RESOURCE CAPACITANCE METERS */}
        <div className="grid grid-cols-2 gap-3.5">
          
          {/* METER 1: ANNADHANAM PANEL (Optimized Vertical Stack) */}
          <div 
            onClick={() => setSelectedFilter(selectedFilter === "food" ? "all" : "food")}
            className={`cursor-pointer bg-white rounded-3xl p-3 border text-center flex flex-col justify-between transition-all duration-300 relative overflow-hidden select-none min-h-[190px] ${
              selectedFilter === "food" 
                ? "border-orange-500 ring-2 ring-orange-100 shadow-md shadow-orange-500/10" 
                : "border-slate-200/80 shadow-sm hover:border-slate-350"
            }`}
          >
            {/* Background highlight */}
            {selectedFilter === "food" && (
              <div className="absolute top-0 right-0 w-20 h-20 bg-orange-500/5 rounded-full -mr-6 -mt-6 pointer-events-none" />
            )}

            <div className="flex items-start justify-between w-full">
              <div className="w-7 h-7 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                <Utensils className="w-3.5 h-3.5" />
              </div>
              <span className="text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-orange-50 text-orange-700">
                {avgFoodWait}m Wait
              </span>
            </div>

            {/* Central Circle Progress Meter */}
            <div className="my-2 flex flex-col items-center justify-center">
              <div className="relative w-14 h-14 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <circle
                    cx="18"
                    cy="18"
                    r="15.915"
                    className="text-slate-100"
                    strokeWidth="3.0"
                    stroke="currentColor"
                    fill="none"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="15.915"
                    className="text-orange-500 transition-all duration-700"
                    strokeWidth="3.5"
                    strokeDasharray="83, 100"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                  />
                </svg>
                {/* Absolutely centered text - styled for perfect fit */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[10px] font-black text-slate-800 leading-none">83%</span>
                </div>
              </div>
              <p className="text-[11px] font-black text-slate-800 mt-2.5 leading-none">Annadhanam</p>
              <span className="text-[8px] text-emerald-600 font-extrabold uppercase tracking-widest mt-1.5 leading-none">
                Fast Moving
              </span>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1.5 w-full text-[9px] font-bold text-slate-400">
              <span className="truncate">Served: 18.2K</span>
              <button 
                onClick={handleSimulateFood}
                disabled={isSimulatingFood}
                className="w-5 h-5 rounded-md bg-orange-50 hover:bg-orange-100 flex items-center justify-center text-orange-600 active:scale-90 transition-transform shrink-0"
                title="Simulate Meal Service Batch"
              >
                <RefreshCw className={`w-3 h-3 ${isSimulatingFood ? "animate-spin" : ""}`} />
              </button>
            </div>
          </div>

          {/* METER 2: DRINKING WATER PANEL (Optimized Vertical Stack) */}
          <div 
            onClick={() => setSelectedFilter(selectedFilter === "water" ? "all" : "water")}
            className={`cursor-pointer bg-white rounded-3xl p-3 border text-center flex flex-col justify-between transition-all duration-300 relative overflow-hidden select-none min-h-[190px] ${
              selectedFilter === "water" 
                ? "border-sky-500 ring-2 ring-sky-100 shadow-md shadow-sky-500/10" 
                : "border-slate-200/80 shadow-sm hover:border-slate-350"
            }`}
          >
            {/* Background highlight */}
            {selectedFilter === "water" && (
              <div className="absolute top-0 right-0 w-20 h-20 bg-sky-500/5 rounded-full -mr-6 -mt-6 pointer-events-none" />
            )}

            <div className="flex items-start justify-between w-full">
              <div className="w-7 h-7 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                <Droplet className="w-3.5 h-3.5" />
              </div>
              <span className="text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-sky-50 text-sky-700">
                94 TDS
              </span>
            </div>

            {/* Central Water Cylinder Tank */}
            <div className="my-2 flex flex-col items-center justify-center">
              <div className="relative w-8 h-14 border-2 border-sky-200 bg-sky-50 rounded-xl overflow-hidden flex flex-col justify-end shadow-inner">
                {/* Wave progress fill */}
                <div 
                  className="w-full bg-gradient-to-t from-sky-500 to-sky-400 transition-all duration-700 relative" 
                  style={{ height: `${avgWaterLevel}%` }}
                >
                  <div className="absolute top-0 inset-x-0 h-1 bg-sky-300/45 animate-pulse" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[9.5px] font-black text-slate-800 leading-none">{avgWaterLevel}%</span>
                </div>
              </div>
              <p className="text-[11px] font-black text-slate-800 mt-2.5 leading-none">Water Grid</p>
              <span className="text-[8px] text-slate-400 font-extrabold uppercase tracking-widest mt-1.5 leading-none">
                48,000L Reserve
              </span>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1.5 w-full text-[9px] font-bold text-slate-400">
              <span className="truncate">Chilled 16°C</span>
              <button 
                onClick={handleSimulateWater}
                disabled={isSimulatingWater}
                className="w-5 h-5 rounded-md bg-sky-50 hover:bg-sky-100 flex items-center justify-center text-sky-600 active:scale-90 transition-transform shrink-0"
                title="Simulate Automatic Tank Refill"
              >
                <RefreshCw className={`w-3 h-3 ${isSimulatingWater ? "animate-spin" : ""}`} />
              </button>
            </div>
          </div>

        </div>

        {/* SECTION 3: PROXIMITY-BASED RESOURCE QUEUE */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-left">
              <h3 className="text-[11px] font-black text-slate-850 uppercase tracking-wider">
                {selectedFilter === "all" ? "All Live Hubs" : selectedFilter === "food" ? "Annadhanam Pavilions" : "Drinking Water Stations"}
              </h3>
              <p className="text-[8px] font-extrabold uppercase tracking-widest text-slate-400 mt-0.5">
                Sorted by nearest distance ({displayItems.length} locations)
              </p>
            </div>
            
            {selectedFilter !== "all" && (
              <button 
                onClick={() => setSelectedFilter("all")}
                className="text-[9px] font-bold text-[#11223f] hover:underline"
              >
                Reset Filters
              </button>
            )}
          </div>

          <div className="space-y-3">
            {displayItems.map((item) => {
              const isExpanded = expandedRouteId === item.id;
              const isFood = item.type === "food";
              
              return (
                <div 
                  key={item.id}
                  className="bg-white rounded-2xl border border-slate-200/60 overflow-hidden shadow-sm flex flex-col transition-all duration-300"
                >
                  {/* Card Main Block */}
                  <div className="p-4 flex flex-col text-left">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-[13.5px] font-black text-slate-900 leading-snug">
                          {item.name}
                        </h4>
                        <p className="text-[9px] text-slate-400 font-extrabold mt-1.5 uppercase tracking-widest leading-none">
                          {item.subName}
                        </p>
                      </div>

                      <span className={`inline-flex text-[8.5px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border shrink-0 ${
                        isFood 
                          ? "bg-orange-50 text-orange-700 border-orange-200" 
                          : "bg-sky-50 text-sky-700 border-sky-200"
                      }`}>
                        {item.capacityPercent}% Capacity
                      </span>
                    </div>

                    {/* Proximity Details: 2-Column + Full-Width Row Grid Layout (Spacious & Responsively Clean) */}
                    <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-[10.5px] font-bold text-slate-600 bg-slate-50 border border-slate-100 rounded-xl p-3">
                      {/* Distance info */}
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <div className="flex flex-col text-left">
                          <span className="text-[7.5px] font-black uppercase tracking-wider text-slate-400 leading-none">Distance</span>
                          <span className="text-slate-800 font-black mt-0.5 leading-none">{item.distance}</span>
                        </div>
                      </div>
                      
                      {/* Queue / Outlets info */}
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <div className="flex flex-col text-left">
                          <span className="text-[7.5px] font-black uppercase tracking-wider text-slate-400 leading-none">
                            {isFood ? "Queue Wait" : "Dispenser"}
                          </span>
                          <span className="text-slate-800 font-black mt-0.5 leading-none">
                            {isFood ? `${item.waitMins} mins` : "4 Outlets"}
                          </span>
                        </div>
                      </div>

                      {/* Serving Window - Full Width row */}
                      <div className="col-span-2 border-t border-slate-200/50 pt-2 flex items-center gap-2">
                        <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <div className="flex flex-col text-left">
                          <span className="text-[7.5px] font-black uppercase tracking-wider text-slate-400 leading-none font-sans">Serving Window</span>
                          <span className="text-slate-700 font-semibold mt-0.5 leading-none">{item.servingWindow}</span>
                        </div>
                      </div>
                    </div>

                    {/* Supply level progress bar */}
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">
                        <span>Supply Fill Status</span>
                        <span className="text-slate-700 font-extrabold">{item.capacityPercent}%</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-700 ${
                            isFood ? "bg-orange-500" : "bg-sky-500"
                          }`}
                          style={{ width: `${item.capacityPercent}%` }}
                        />
                      </div>
                    </div>

                    {/* Dynamic State Info Box */}
                    <div className="mt-3 flex items-start gap-2.5 border border-slate-100 bg-white/50 p-2.5 rounded-xl">
                      {isFood ? (
                        <>
                          <div className="w-6 h-6 rounded-md bg-orange-50 text-orange-600 flex items-center justify-center shrink-0 mt-0.5">
                            <Utensils className="w-3.5 h-3.5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-[8px] font-black uppercase tracking-wider text-orange-600">Current Live Meal Batch</span>
                            <p className="text-[10.5px] text-slate-700 font-semibold leading-snug mt-0.5">
                              {item.statusText}
                            </p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="w-6 h-6 rounded-md bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 mt-0.5">
                            <Waves className="w-3.5 h-3.5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-[8px] font-black uppercase tracking-wider text-sky-600">Purification & Flow Metrics</span>
                            <p className="text-[10.5px] text-slate-700 font-semibold leading-snug mt-0.5">
                              {item.statusText}
                            </p>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Bottom Sponsors and Quick Actions */}
                    {isFood && item.isSponsored && (
                      <div className="mt-2 flex items-center gap-1 text-[8.5px] font-bold text-slate-400">
                        <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
                        <span>Sponsored by <strong className="text-slate-600">{item.sponsorName}</strong></span>
                      </div>
                    )}

                    {!isFood && (
                      <div className="mt-2 flex items-center gap-2.5 text-[8.5px] font-extrabold text-slate-450 uppercase tracking-wider">
                        <span className="flex items-center gap-0.5 text-slate-500">
                          <Thermometer className="w-3 h-3 text-sky-500" />
                          {item.tempCelsius}°C Temp
                        </span>
                        <span>•</span>
                        <span className="text-sky-700 font-black">
                          {item.waterQuality}
                        </span>
                      </div>
                    )}

                    {/* Card Actions Row */}
                    <div className="mt-3.5 flex items-center justify-between border-t border-slate-100 pt-3">
                      <div className="flex items-center gap-1.5 text-[8.5px] font-bold uppercase tracking-wider text-slate-400">
                        {isFood ? (
                          <span className="text-emerald-600 font-black">{item.safetyRating}</span>
                        ) : (
                          <span className="text-slate-500">TDS: {item.tdsPpm} PPM (Perfect)</span>
                        )}
                      </div>

                      <button
                        onClick={() => toggleRouteExpand(item.id)}
                        className={`text-[9.5px] font-black px-3.5 py-1.5 rounded-xl flex items-center gap-1 active:scale-95 transition-all shadow-sm ${
                          isExpanded 
                            ? "bg-slate-100 hover:bg-slate-200 text-slate-700" 
                            : "bg-[#11223f] hover:bg-[#1f355c] text-white"
                        }`}
                      >
                        <Navigation className="w-3 h-3" />
                        {isExpanded ? "Hide Map" : "Navigate Route"}
                      </button>
                    </div>
                  </div>

                  {/* EXPANDABLE NAVIGATION VIEW */}
                  {isExpanded && (
                    <div className="border-t border-slate-150 bg-slate-50/70 p-4 rounded-b-2xl animate-fade-in text-left">
                      <p className="text-[9px] font-black uppercase tracking-wider text-slate-400 mb-3">
                        Pilgrim Proximity Navigation Overlay
                      </p>
                      
                      {/* Premium Custom SVG Route Map Hook */}
                      <div className="w-full h-40 bg-white border border-slate-200 rounded-2xl relative overflow-hidden shadow-inner flex items-center justify-center">
                        <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
                        
                        <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                          <path 
                            d="M -20,130 C 60,120 120,80 200,90 C 260,100 320,60 420,50 L 420,170 L -20,170 Z" 
                            fill="url(#riverGradientMobile)" 
                            opacity="0.85" 
                          />
                          <defs>
                            <linearGradient id="riverGradientMobile" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#bae6fd" />
                              <stop offset="100%" stopColor="#7dd3fc" />
                            </linearGradient>
                          </defs>

                          <path
                            d="M 50,50 L 120,45 L 180,85 L 260,65"
                            fill="none"
                            stroke={isFood ? "#f97316" : "#0ea5e9"}
                            strokeWidth="3"
                            strokeDasharray="6 4"
                            className="animate-pulse"
                          />
                        </svg>

                        {/* YOU start point icon */}
                        <div className="absolute left-[40px] top-[40px] flex flex-col items-center">
                          <span className="w-3 h-3 rounded-full bg-blue-600 border border-white shadow-md flex items-center justify-center animate-ping absolute" />
                          <span className="w-3 h-3 rounded-full bg-blue-600 border border-white shadow-md relative z-10" />
                          <span className="text-[7px] font-black bg-blue-950 text-white rounded px-1 mt-0.5 uppercase tracking-wider shadow-sm">
                            YOU
                          </span>
                        </div>

                        {/* Destination endpoint icon */}
                        <div className="absolute right-[110px] top-[55px] flex flex-col items-center">
                          <span className={`w-3.5 h-3.5 rounded-full border border-white shadow-md flex items-center justify-center relative z-10 ${
                            isFood ? "bg-orange-500 text-white" : "bg-sky-500 text-white"
                          }`}>
                            {isFood ? <Utensils className="w-2 h-2" /> : <Droplet className="w-2 h-2" />}
                          </span>
                          <span className={`text-[7px] font-black text-white rounded px-1 mt-0.5 uppercase tracking-wider shadow-sm ${
                            isFood ? "bg-orange-950" : "bg-sky-950"
                          }`}>
                            {item.name.split(" ")[0]}
                          </span>
                        </div>

                        <div className="absolute bottom-2.5 right-2.5 bg-white/95 border border-slate-200/60 rounded-xl px-2 py-0.5 flex items-center gap-1.5 shadow-md">
                          <Compass className="w-3 h-3 text-[#11223f] animate-spin" style={{ animationDuration: "8s" }} />
                          <span className="text-[7.5px] font-black text-slate-800 uppercase tracking-wider">
                            GPS Active
                          </span>
                        </div>
                      </div>

                      {/* Checkpoint Steps (Responsive Vertical Timeline Layout) */}
                      <div className="mt-4 space-y-3">
                        <span className="text-[8px] font-black uppercase tracking-wider text-slate-400">
                          Route Checkpoint Progress
                        </span>
                        
                        <div className="mt-2.5 space-y-3.5 pl-2 border-l-2 border-dashed border-slate-200 ml-1.5">
                          {item.routeCheckpoints.map((step, idx) => {
                            const isLast = idx === item.routeCheckpoints.length - 1;
                            return (
                              <div key={step} className="flex items-start gap-2.5 relative -ml-3.5">
                                <div className={`w-3 h-3 rounded-full border-2 border-white flex items-center justify-center z-10 shadow-sm shrink-0 ${
                                  isLast 
                                    ? (isFood ? "bg-orange-500" : "bg-sky-500") 
                                    : "bg-slate-400"
                                }`} />
                                <div className="flex flex-col text-left">
                                  <span className="text-[10.5px] font-black text-slate-800 leading-tight">
                                    {step}
                                  </span>
                                  <span className="text-[7.5px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">
                                    {isLast ? "Destination Portal" : `Waypoint Gate ${idx + 1}`}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Shuttle bus connection card */}
                      <div className="mt-4 bg-[#11223f]/5 border border-[#11223f]/10 p-2.5 rounded-xl flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <Info className="w-3.5 h-3.5 text-[#11223f] shrink-0" />
                          <span className="text-[9.5px] font-semibold text-slate-700 leading-snug">
                            PK Shuttles connect directly to this hub terminal.
                          </span>
                        </div>
                        <button 
                          onClick={() => alert("Board Shuttle Bus PK-1 at nearest gate. Active service.")}
                          className="bg-[#11223f] hover:bg-[#1a315c] text-white text-[8px] font-black px-2 py-1 rounded-lg shrink-0 uppercase tracking-wider"
                        >
                          Show Shuttle
                        </button>
                      </div>

                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Standard Bottom Nav */}
      <BottomNav activeTab="" onTabSelect={onNavigate} />
    </div>
  );
}

export default FoodWaterPage;
