import { CheckCircle2, ChevronRight, FileText, Phone, Headphones, Settings, LogOut, Footprints, UsersRound, Heart } from "lucide-react";
import profileAvatar from "../assets/profile-avatar.png";
import BottomNav from "../layouts/BottomNav";
import Navbar from "../layouts/Navbar";

const TempleIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 2L2 7h20L12 2z" />
    <path d="M4 7v13h16V7" />
    <path d="M9 20v-6h6v6" />
    <circle cx="12" cy="10" r="1.5" />
  </svg>
);

function ProfilePage({ onNavigate }) {
  const stats = [
    { label: "Holy Sites", value: "12" },
    { label: "Active", value: "03" },
    { label: "Rating", value: "4.9" }
  ];

  const bookings = [
    {
      title: "My Family Members",
      icon: (
        <div className="relative flex items-center justify-center">
          <UsersRound className="w-4.5 h-4.5 text-blue-600" />
        </div>
      ),
      bg: "bg-blue-50 border border-blue-100/50"
    },
    {
      title: "My Bookings",
      icon: <FileText className="w-4 h-4 text-blue-600" />,
      bg: "bg-blue-50 border border-blue-100/50"
    },
    {
      title: "Emergency Contacts",
      icon: <Phone className="w-4 h-4 text-rose-600" />,
      bg: "bg-rose-50 border border-rose-100/50"
    },
    {
      title: "Help Desk",
      icon: <Headphones className="w-4 h-4 text-amber-600" />,
      bg: "bg-amber-50 border border-amber-100/50"
    },
    {
      title: "Account Settings",
      icon: <Settings className="w-4 h-4 text-slate-600" />,
      bg: "bg-slate-50 border border-slate-100/50"
    }
  ];

  return (
    <div className="max-w-sm mx-auto min-h-screen bg-gray-50 flex flex-col relative pb-24 shadow-2xl border-x border-gray-200 select-none">
      <Navbar showBack={true} onBack={() => onNavigate("home")} />

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6">
        <div className="bg-white rounded-3xl border border-gray-100 p-5 shadow-sm flex flex-col items-center text-center mt-2">
          <div className="relative">
            <img
              src={profileAvatar}
              alt="Venkatesh Prasad"
              className="w-20 h-20 rounded-full object-cover border-2 border-white shadow-md"
            />
            <span className="absolute bottom-0 right-0 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center text-white shadow-sm">
              <CheckCircle2 className="w-3 h-3" />
            </span>
          </div>

          <h2 className="text-base font-black text-slate-800 mt-3 leading-none">
            Venkatesh Prasad
          </h2>

          <div className="flex items-center gap-2 mt-2">
            <span className="inline-flex items-center gap-0.5 text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-250">
              Verified Citizen
            </span>
            <span className="text-[8px] font-bold text-slate-400">
              • ID: AP-7729-102
            </span>
          </div>

          <div className="w-full border-t border-gray-100 my-4"></div>

          <div className="grid grid-cols-3 w-full">
            {stats.map((stat, idx) => (
              <div
                key={stat.label}
                className={`flex flex-col items-center ${idx < 2 ? "border-r border-gray-100" : ""
                  }`}
              >
                <span className="text-sm font-black text-slate-800 leading-none">
                  {stat.value}
                </span>
                <span className="text-[8.5px] font-bold text-slate-400 mt-1 uppercase tracking-wider leading-none">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-wide">
              Pilgrim Journey
            </h3>
            <button className="text-[9px] font-extrabold text-blue-600 uppercase tracking-wider hover:text-blue-800 active:scale-95 transition-all">
              View All
            </button>
          </div>

          <div className="bg-[#0c2340] text-white rounded-2xl p-4 mt-3 shadow-md relative overflow-hidden group hover:shadow-lg hover:shadow-blue-900/10 transition-all duration-300">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-sm font-black tracking-wide">
                  Pushkar Ghat Ritual
                </h4>
                <p className="text-[10px] text-blue-200 mt-1 font-semibold">
                  Rajahmundry • Since 4:30 AM
                </p>
              </div>
              <span className="bg-amber-600 text-white text-[8px] font-extrabold px-2.5 py-0.5 rounded-full shadow-sm tracking-wider uppercase">
                In Progress
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-3">
            {/* Removed static Pilgrim Journey cards as requested */}
          </div>
        </div>

        <div className="flex flex-col">
          <h3 className="text-xs font-black text-slate-800 uppercase tracking-wide mb-3">
            Settings & Support
          </h3>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
            {bookings.map((item) => (
              <button
                key={item.title}
                onClick={() => {
                  if (item.title === "My Family Members") {
                    onNavigate("family");
                  }
                }}
                className="flex items-center justify-between p-3.5 border-b border-gray-50 last:border-b-0 hover:bg-gray-50/80 active:bg-gray-100/50 transition-all duration-200 text-left"
              >
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${item.bg}`}>
                    {item.icon}
                  </div>
                  <span className="text-xs font-bold text-slate-700 ml-3">
                    {item.title}
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300" />
              </button>
            ))}
          </div>

          <button className="w-full bg-white border border-rose-200 hover:bg-rose-50/50 active:scale-[0.98] transition-all rounded-2xl py-3 px-4 flex items-center justify-center gap-2 text-xs font-extrabold text-rose-600 mt-6 shadow-sm">
            <LogOut className="w-4 h-4 text-rose-500" />
            Logout Account
          </button>
        </div>
      </div>
      <BottomNav activeTab="profile" onTabSelect={onNavigate} />
    </div>
  );
}

export default ProfilePage;
