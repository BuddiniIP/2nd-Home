import { Routes, Route } from "react-router-dom";
import MainLayout from "../layout/MainLayout";

// Public Pages
import Home from "../pages/Home";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import StudentRegister from "../pages/StudentRegister";
import OwnerRegister from "../pages/OwnerRegister";
import Listing from "../pages/Listing.jsx";
import ListingDetails from "../pages/ListingDetails.jsx";
import Contact from "../pages/contact.jsx";

// Dashboards
import StudentDashboard from "../pages/Dashboard/StudentDashboard.jsx";
import OwnerDashboard from "../pages/Dashboard/OwnerDashboard.jsx";
import AdminDashboard from "../pages/Dashboard/AdminDashboard.jsx";
import AddListing from "../pages/Dashboard/AddListing.jsx";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>

        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/register/student" element={<StudentRegister />} />
        <Route path="/register/owner" element={<OwnerRegister />} />
        <Route path="/listings" element={<Listing />} />
        <Route path="/listing/:id" element={<ListingDetails />} />
        <Route path="/contact" element={<Contact />} />

        {/* Dashboards (temporary open access) */}
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/owner" element={<OwnerDashboard />} />
        <Route path="/owner/add-listing" element={<AddListing />} />
        <Route path="/admin" element={<AdminDashboard />} />

      </Route>
    </Routes>
  );
}
