import { useState } from "react";
import Home from "./pages/Home";
import SosPage from "./pages/SosPage";
import MissingPersonPage from "./pages/MissingPersonPage";
import ProfilePage from "./pages/ProfilePage";
import FamilyMembers from "./components/FamilyMembers";
import AIGhatPage from "./pages/AIGhatPage";
import TransportPage from "./pages/TransportPage";
import TemplesPage from "./pages/TemplesPage";
import FoodWaterPage from "./pages/FoodWaterPage";

function App() {
  const [currentScreen, setCurrentScreen] = useState("home");

  if (currentScreen === "sos") {
    return <SosPage onBack={() => setCurrentScreen("home")} />;
  }

  if (currentScreen === "missing-child") {
    return <MissingPersonPage onBack={() => setCurrentScreen("home")} />;
  }

  if (currentScreen === "ai-ghat") {
    return (
      <AIGhatPage
        onBack={() => setCurrentScreen("home")}
        onNavigate={setCurrentScreen}
      />
    );
  }

  if (currentScreen === "profile") {
    return <ProfilePage onNavigate={setCurrentScreen} />;
  }

  if (currentScreen === "transport") {
    return (
      <TransportPage
        onBack={() => setCurrentScreen("home")}
        onNavigate={setCurrentScreen}
      />
    );
  }

  if (currentScreen === "temples") {
    return (
      <TemplesPage
        onBack={() => setCurrentScreen("home")}
        onNavigate={setCurrentScreen}
      />
    );
  }

  if (currentScreen === "food-water") {
    return (
      <FoodWaterPage
        onBack={() => setCurrentScreen("home")}
        onNavigate={setCurrentScreen}
      />
    );
  }

  if (currentScreen === "family") {
    return <FamilyMembers onBack={() => setCurrentScreen("profile")} />;
  }

  return <Home onNavigate={setCurrentScreen} />;
}

export default App;
