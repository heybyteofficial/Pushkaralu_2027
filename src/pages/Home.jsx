import Navbar from "../layouts/Navbar";
import HeroSection from "../components/HeroSection";
import LiveStatus from "../components/LiveStatus";
import QuickServices from "../components/QuickServices";
import ChatBanner from "../components/ChatBanner";
import BottomNav from "../layouts/BottomNav";

function Home({ onNavigate }) {
  return (
    <div className="max-w-sm mx-auto min-h-screen bg-gray-50 flex flex-col relative pb-36 shadow-2xl border-x border-gray-200">
      <Navbar />
      <div className="flex-1 overflow-y-auto">
        <HeroSection />
        <LiveStatus />
        <QuickServices />
      </div>
      <ChatBanner />
      <BottomNav activeTab="home" onTabSelect={onNavigate} />
    </div>
  );
}

export default Home;
