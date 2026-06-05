import { useState, useEffect } from "react";
import { ArrowLeft, Bus, MapPin, Clock3, Users, ChevronDown, ChevronUp, RefreshCw, Star } from "lucide-react";
import Navbar from "../layouts/Navbar";
import BottomNav from "../layouts/BottomNav";
import swiggyMap from "../assets/swiggy_map.png";

const BUS_ROUTES = [
  {
    id: 1,
    busNo: "Bus No. 1",
    start: "Pedda Anjaneya Swamy Temple",
    end: "Uptron Computer Center",
    route: "Pedda Anjaneya Swamy Temple (near Pushkar Ghat) to Uptron Computer Center (near the Railway Station)",
    stops: ["Pedda Anjaneya Swamy Temple", "Pushkar Ghat Entrance", "Devi Chowk Junction", "Railway Station East Gate", "Uptron Computer Center"],
    status: "Approaching Stop",
    statusColor: "emerald",
    eta: "~3 mins",
    distance: "320m",
    seats: "14 Seats Open",
    seatsColor: "emerald",
    mapX: 40,
    mapY: 60,
    polyPoints: "15,82 30,75 40,60 60,45 82,25"
  },
  {
    id: 2,
    busNo: "Bus No. 2",
    start: "Gokavaram Bus Stand",
    end: "Kadiyam",
    route: "Gokavaram Bus Stand to Kadiyam via Devi Chowk, Thadithota, Kotipalli Bus Stand, Railway Station, and Bommuru",
    stops: ["Gokavaram Bus Stand", "Devi Chowk", "Thadithota Junction", "Kotipalli Bus Stand", "Rajahmundry Railway Station", "Bommuru Junction", "Kadiyam Center"],
    status: "Active Route",
    statusColor: "blue",
    eta: "~9 mins",
    distance: "1.2 km",
    seats: "8 Seats Open",
    seatsColor: "amber",
    mapX: 52,
    mapY: 48,
    polyPoints: "15,82 32,70 52,48 70,35 82,25"
  },
  {
    id: 3,
    busNo: "Bus No. 3",
    start: "Rayudu Pakala",
    end: "Kesavaram",
    route: "Rayudu Pakala to Kesavaram via Gokavaram Bus Stand, Railway Station, Kotipalli Bus Stand, Bommuru, and Rajavolu",
    stops: ["Rayudu Pakala", "Gokavaram Bus Stand", "Rajahmundry Railway Station", "Kotipalli Bus Stand", "Bommuru Hub", "Rajavolu Main", "Kesavaram Gate"],
    status: "Delayed",
    statusColor: "rose",
    eta: "~18 mins",
    distance: "2.4 km",
    seats: "Standing Room Only",
    seatsColor: "rose",
    mapX: 68,
    mapY: 38,
    polyPoints: "15,82 25,80 48,55 68,38 82,25"
  },
  {
    id: 7,
    busNo: "Bus No. 7",
    start: "Shamala Nagar",
    end: "Gokavaram Bus Stand",
    route: "Shamala Nagar to Gokavaram Bus Stand",
    stops: ["Shamala Nagar Terminal", "Uptron Computer Center", "Railway Station Road", "Gokavaram Bus Stand"],
    status: "Active Route",
    statusColor: "blue",
    eta: "~5 mins",
    distance: "650m",
    seats: "22 Seats Open",
    seatsColor: "emerald",
    mapX: 30,
    mapY: 72,
    polyPoints: "15,82 30,72 55,60 70,40 82,25"
  },
  {
    id: 9,
    busNo: "Bus No. 9",
    start: "Rajahmundry",
    end: "Tungapadu",
    route: "Rajahmundry to Tungapadu",
    stops: ["Rajahmundry Central", "Devi Chowk", "Bommuru Bypass", "Tungapadu Gate"],
    status: "Approaching Stop",
    statusColor: "emerald",
    eta: "~2 mins",
    distance: "180m",
    seats: "5 Seats Open",
    seatsColor: "amber",
    mapX: 22,
    mapY: 78,
    polyPoints: "15,82 22,78 40,65 65,48 82,25"
  }
];

function TransportPage({ onBack, onNavigate }) {
  const [selectedRouteId, setSelectedRouteId] = useState(1);
  const [expandedRouteId, setExpandedRouteId] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [jitterOffsets, setJitterOffsets] = useState({ x: 0, y: 0 });

  const activeRoute = BUS_ROUTES.find((r) => r.id === selectedRouteId) || BUS_ROUTES[0];

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      const randomX = (Math.random() - 0.5) * 6;
      const randomY = (Math.random() - 0.5) * 6;
      setJitterOffsets({ x: randomX, y: randomY });
      setRefreshing(false);
    }, 900);
  };

  const handleSelectRoute = (id) => {
    setSelectedRouteId(id);
    setJitterOffsets({ x: 0, y: 0 });
  };

  const toggleExpandRoute = (e, id) => {
    e.stopPropagation();
    setExpandedRouteId((prev) => (prev === id ? null : id));
  };

  const getStatusBadgeClass = (color) => {
    if (color === "emerald") {
      return "bg-emerald-50 text-emerald-700 border-emerald-250";
    }
    if (color === "rose") {
      return "bg-rose-50 text-rose-700 border-rose-250";
    }
    return "bg-blue-50 text-blue-700 border-blue-250";
  };

  const getSeatsBadgeClass = (color) => {
    if (color === "emerald") {
      return "bg-emerald-50 text-emerald-700 border-emerald-150";
    }
    if (color === "rose") {
      return "bg-rose-50 text-rose-700 border-rose-150";
    }
    return "bg-amber-50 text-amber-700 border-amber-150";
  };

  return (
    <div className="w-screen h-[100dvh] flex flex-col overflow-hidden bg-[#f3f6f9]">
      <Navbar showBack={true} onBack={onBack} />

      <div className="flex-1 flex flex-col overflow-hidden relative pb-16">
        <section className="mx-4 mt-4 bg-white border border-slate-200/80 rounded-2xl p-4 shadow-md flex items-center justify-between shrink-0">
          <div className="flex-1 flex flex-col text-left pr-2">
            <span className="text-[8px] font-extrabold uppercase tracking-wider text-slate-400">Selected Shuttle</span>
            <span className="text-xs font-black text-slate-900 mt-0.5 truncate max-w-[85px]">{activeRoute.busNo}</span>
          </div>

          <div className="h-8 w-px bg-slate-200 shrink-0" />

          <div className="flex-1 flex flex-col items-center px-1">
            <span className="text-[8px] font-extrabold uppercase tracking-wider text-slate-400 text-center">Live ETA</span>
            <div className="flex items-center gap-1 mt-0.5 text-indigo-600">
              <Clock3 className="w-3.5 h-3.5" />
              <span className="text-xs font-black">{activeRoute.eta}</span>
            </div>
          </div>

          <div className="h-8 w-px bg-slate-200 shrink-0" />

          <div className="flex-1 flex flex-col items-center px-1">
            <span className="text-[8px] font-extrabold uppercase tracking-wider text-slate-400 text-center">Distance</span>
            <span className="text-xs font-black text-slate-800 mt-0.5">{activeRoute.distance}</span>
          </div>

          <div className="h-8 w-px bg-slate-200 shrink-0" />

          <div className="flex-1 flex flex-col items-end pl-1">
            <span className="text-[8px] font-extrabold uppercase tracking-wider text-slate-400 text-right">Capacity</span>
            <span className={`inline-flex text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border mt-1.5 whitespace-nowrap ${getSeatsBadgeClass(activeRoute.seatsColor)}`}>
              {activeRoute.seats}
            </span>
          </div>
        </section>

        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          <div className="flex items-center justify-between pb-1">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Government Shuttle Services</h3>
            <span className="text-[9.5px] font-bold text-slate-400">5 Available Buses</span>
          </div>

          {BUS_ROUTES.map((route) => {
            const isSelected = route.id === selectedRouteId;
            const isExpanded = route.id === expandedRouteId;

            return (
              <div
                key={route.id}
                onClick={() => handleSelectRoute(route.id)}
                className={`bg-white rounded-2xl border transition-all duration-300 shadow-sm cursor-pointer ${
                  isSelected
                    ? "border-indigo-600 ring-2 ring-indigo-100 shadow-indigo-100/30"
                    : "border-slate-200 hover:border-slate-350"
                }`}
              >
                <div className="p-4 flex flex-col text-left">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                        isSelected ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-650"
                      }`}>
                        <Bus className="w-4.5 h-4.5" />
                      </div>
                      <div>
                        <h4 className="text-[13px] font-black text-slate-900 leading-none">{route.busNo}</h4>
                        <p className="text-[8.5px] text-slate-400 font-extrabold mt-1 uppercase tracking-widest leading-none">
                          PK-SHUTTLE-{route.id}
                        </p>
                      </div>
                    </div>

                    <span className={`inline-flex text-[8.5px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${getStatusBadgeClass(route.statusColor)}`}>
                      {route.status}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center gap-3 text-[11px] font-bold text-slate-700 bg-slate-50 rounded-xl p-3 border border-slate-100">
                    <div className="flex-1 flex flex-col gap-1 text-left">
                      <span className="text-[8.5px] font-black uppercase tracking-wider text-slate-400">Departure</span>
                      <span className="truncate">{route.start}</span>
                    </div>
                    <div className="h-6 w-px bg-slate-200 shrink-0" />
                    <div className="flex-1 flex flex-col gap-1 text-left">
                      <span className="text-[8.5px] font-black uppercase tracking-wider text-slate-400">Destination</span>
                      <span className="truncate">{route.end}</span>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-[9px] text-slate-455 font-extrabold uppercase tracking-wider">
                      <span className="flex items-center gap-1">
                        <Clock3 className="w-3.5 h-3.5 text-slate-400" />
                        {route.eta}
                      </span>
                      <span>•</span>
                      <span>{route.distance}</span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => toggleExpandRoute(e, route.id)}
                      className="flex items-center gap-1 text-[9px] font-extrabold uppercase tracking-wider text-indigo-650 hover:text-indigo-800"
                    >
                      {isExpanded ? (
                        <>
                          Hide Stops <ChevronUp className="w-3 h-3 stroke-[3]" />
                        </>
                      ) : (
                        <>
                          View Stops <ChevronDown className="w-3.5 h-3.5 stroke-[3]" />
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t border-slate-150 bg-slate-50/70 p-4 rounded-b-2xl">
                    <p className="text-[9.5px] font-black uppercase tracking-wider text-slate-400 mb-4">Junction Route Map</p>
                    <div className="relative space-y-4">
                      {route.stops.map((stop, index) => {
                        const isFirst = index === 0;
                        const isLast = index === route.stops.length - 1;

                        return (
                          <div key={stop} className="flex gap-4 items-start text-left">
                            <div className="w-4 shrink-0 relative flex flex-col items-center">
                              <div className={`w-3.5 h-3.5 rounded-full border-2 border-white flex items-center justify-center z-10 shadow-sm ${
                                isFirst
                                  ? "bg-emerald-500"
                                  : isLast
                                  ? "bg-rose-500"
                                  : "bg-indigo-600"
                              }`} />
                              {!isLast && (
                                <div
                                  className="absolute w-0.5 bg-slate-200"
                                  style={{
                                    top: "14px",
                                    bottom: "-20px",
                                    left: "7px"
                                  }}
                                />
                              )}
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[12px] font-bold text-slate-850 leading-snug">
                                {stop}
                              </span>
                              {isFirst && (
                                <span className="text-[8.5px] text-emerald-600 font-extrabold uppercase tracking-wider mt-0.5 leading-none">
                                  Start Point
                                </span>
                              )}
                              {isLast && (
                                <span className="text-[8.5px] text-rose-600 font-extrabold uppercase tracking-wider mt-0.5 leading-none">
                                  Terminal Stop
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="sticky bottom-[61px] left-0 right-0 z-40 bg-white border-t border-slate-200 p-4 flex items-center justify-between shadow-md shrink-0">
          <div className="flex flex-col text-left">
            <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Transit Token</span>
            <span className="text-xs font-black text-slate-800 mt-1">PK-TRANS-2026</span>
          </div>

          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="bg-indigo-600 hover:bg-indigo-700 active:scale-95 disabled:opacity-75 transition-all text-white text-[11.5px] font-black px-4 py-2.5 rounded-full flex items-center gap-1.5 shadow-md shadow-indigo-600/10"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
            {refreshing ? "Refreshing Positions..." : "Refresh Live Positions"}
          </button>
        </div>
      </div>

      <BottomNav activeTab="" onTabSelect={onNavigate} />
    </div>
  );
}

export default TransportPage;
