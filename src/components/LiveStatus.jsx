import { Users, Car, CloudSun, Waves } from "lucide-react";

const STATUS_ITEMS = [
  {
    id: "ghat-crowd",
    icon: "users",
    title: "Ghat Crowd",
    value: "Medium",
    valueColor: "text-orange-500",
    action: "View All ›",
    actionColor: "text-blue-600",
  },
  {
    id: "traffic",
    icon: "car",
    title: "Traffic",
    value: "Smooth",
    valueColor: "text-green-600",
    action: "View Map ›",
    actionColor: "text-blue-600",
  },
  {
    id: "weather",
    icon: "cloudsun",
    title: "Weather",
    value: "28°C",
    valueColor: "text-blue-600",
    action: "Clear",
    actionColor: "text-gray-500",
  },
  {
    id: "river-level",
    icon: "waves",
    title: "River Level",
    value: "Normal",
    valueColor: "text-blue-600",
    action: "Status",
    actionColor: "text-gray-500",
  },
  {
    id: "parking",
    icon: "p-circle",
    title: "Parking",
    value: "72%",
    valueColor: "text-blue-600",
    action: "Available",
    actionColor: "text-gray-500",
  },
];

function RenderIcon({ type }) {
  if (type === "users") {
    return <Users className="w-5 h-5 text-blue-400 mb-1" />;
  }
  if (type === "car") {
    return <Car className="w-5 h-5 text-green-500 mb-1" />;
  }
  if (type === "cloudsun") {
    return <CloudSun className="w-5 h-5 text-blue-400 mb-1" />;
  }
  if (type === "waves") {
    return <Waves className="w-5 h-5 text-blue-500 mb-1" />;
  }
  if (type === "p-circle") {
    return (
      <div className="bg-blue-600 text-white rounded-full w-7 h-7 flex items-center justify-center font-bold text-sm mb-1 leading-none shadow-sm shadow-blue-500/10">
        P
      </div>
    );
  }
  return null;
}

function LiveStatus() {
  return (
    <div className="mx-4 -mt-4 relative z-10 bg-white rounded-2xl shadow-md p-4 border border-gray-100">
      <h3 className="text-sm font-bold text-gray-900 mb-3 tracking-tight">
        Live Status
      </h3>

      <div className="flex overflow-x-auto gap-3 scrollbar-hide pb-1">
        {STATUS_ITEMS.map(({ id, icon, title, value, valueColor, action, actionColor }) => (
          <div
            key={id}
            className="flex-shrink-0 flex flex-col items-center justify-between text-center w-20 p-2 rounded-xl bg-gray-50 border border-gray-100 hover:border-gray-200 transition-colors"
          >
            <div className="flex flex-col items-center">
              <RenderIcon type={icon} />
              <span className="text-[10px] text-gray-500 font-medium leading-tight mt-1">
                {title}
              </span>
            </div>
            <div className="flex flex-col items-center mt-1">
              <span className={`text-xs font-bold ${valueColor} leading-tight`}>
                {value}
              </span>
              <button className={`text-[9px] font-semibold ${actionColor} mt-0.5 hover:underline`}>
                {action}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LiveStatus;
