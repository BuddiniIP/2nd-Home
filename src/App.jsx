import { Routes, Route } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignupRoleSelection from "./pages/SignupRoleSelection";
import StudentRegistration from "./pages/StudentRegistration";
import BownerRegistration from "./pages/BownerRegistration";
import Search from "./pages/Search";
import StudentDashboard from "./pages/StudentDashboard";
import StudentProfile from "./pages/StudentProfile";
import HowItWorks from "./pages/HowItWorks";
import ContactUs from "./pages/ContactUs";
import About from "./pages/About";
import OwnerDashboard from "./pages/OwnerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import VerifierDashboard from "./pages/VerifierDashboard";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup-role" element={<SignupRoleSelection />} />
          <Route path="/student-registration" element={<StudentRegistration />} />
          <Route path="/owner-registration" element={<BownerRegistration />} />
          <Route path="/search" element={<Search />} />
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/owner-dashboard" element={<OwnerDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/verifier-dashboard" element={<VerifierDashboard />} />
          <Route path="/student-profile" element={<StudentProfile />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/contact-us" element={<ContactUs />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
