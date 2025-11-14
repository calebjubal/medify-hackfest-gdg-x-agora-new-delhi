import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "@/App.css";
import AdminDashboard from "@/pages/AdminDashboard";
import DoctorDashboard from "@/pages/DoctorDashboard";
import PatientDashboard from "@/pages/PatientDashboard";
import VoiceBooking from "@/pages/VoiceBooking";
import LandingPage from "@/pages/LandingPage";
import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard/admin" element={<AdminDashboard />} />
          <Route path="/dashboard/doctor" element={<DoctorDashboard />} />
          <Route path="/dashboard/patient" element={<PatientDashboard />} />
          <Route path="/dashboard/patient/voice-booking" element={<VoiceBooking />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" richColors />
    </div>
  );
}

export default App;