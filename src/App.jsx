import { useState } from "react";
import Home from "./pages/Home";
import SosPage from "./pages/SosPage";
import MissingPersonPage from "./pages/MissingPersonPage";
import ProfilePage from "./pages/ProfilePage";
import FamilyMembers from "./components/FamilyMembers";

function App() {
  const [currentScreen, setCurrentScreen] = useState("home");

  if (currentScreen === "sos") {
    return <SosPage onBack={() => setCurrentScreen("home")} />;
  }

  if (currentScreen === "missing-child") {
    return <MissingPersonPage onBack={() => setCurrentScreen("home")} />;
  }

  if (currentScreen === "profile") {
    return <ProfilePage onNavigate={setCurrentScreen} />;
  }

  if (currentScreen === "family") {
    return <FamilyMembers onBack={() => setCurrentScreen("profile")} />;
  }

  return <Home onNavigate={setCurrentScreen} />;
}

export default App;
