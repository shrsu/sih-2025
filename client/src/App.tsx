import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import DoctorDashboard from "./pages/DoctorDashboard";
import DoctorLoginPage from "./pages/DoctorLoginPage";
import PharmacistLoginPage from "./pages/PharmacistLoginPage";
import PharmacistDashboard from "./pages/PharmacistDashboard";
import { ThemeProvider } from "./themes/theme-provider";
import { UserProvider } from "./contexts/UserContext";

function App() {
  return (
    <ThemeProvider>
      <UserProvider>
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
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;
