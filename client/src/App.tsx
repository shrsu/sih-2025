import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import DoctorDashboard from "./pages/DoctorDashboard";
import DoctorLoginPage from "./pages/DoctorLoginPage";
import PharmacistLoginPage from "./pages/PharmacistLoginPage";
import PharmacistDashboard from "./pages/PharmacistDashboard";
import UserLoginPage from "./pages/UserLoginPage";
import UserDashboard from "./pages/UserDashboard";
import { ThemeProvider } from "./themes/theme-provider";
import { LoggedInEntityProvider } from "@/contexts/LoggedInEntityContext";

function App() {
  return (
    <ThemeProvider>
      <LoggedInEntityProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
            <Route path="/doctor/login" element={<DoctorLoginPage />} />
            <Route path="/pharmacist/login" element={<PharmacistLoginPage />} />
            <Route
              path="/pharmacist/dashboard"
              element={<PharmacistDashboard />}
            />
            <Route path="/user/login" element={<UserLoginPage />} />
            <Route path="/user/dashboard" element={<UserDashboard />} />
          </Routes>
        </BrowserRouter>
      </LoggedInEntityProvider>
    </ThemeProvider>
  );
}

export default App;
