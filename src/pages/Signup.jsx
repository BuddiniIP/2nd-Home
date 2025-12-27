import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
// import Navbar from "../components/Navbar";
// import Footer from "../components/Footer";
import signupBg from "../assets/images/signupBg.jpg";

export default function Signup() {
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  const handleContinue = () => {
    if (!role) return;

    if (role === "student") {
      navigate("/register/student");
    } else {
      navigate("/register/owner");
    }
  };

  return (
    <>
      {/* <Navbar /> */}

      {/* Background */}
      <div
        className="min-h-screen flex items-center justify-center bg-cover bg-center px-4"
        style={{ backgroundImage: `url(${signupBg})` }}
      >
        <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8 mt-20 text-center">
          
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Create Account
            </h1>
            <p className="text-gray-500">
              Join BoardingFinder community
            </p>
          </div>

          {/* Role Selection */}
          <div className="mb-6">
            <p className="font-semibold text-gray-700 mb-4">I am a</p>

            {/* Student */}
            <RoleCard
              active={role === "student"}
              title="Student"
              description="Looking for verified boarding facilities near my university"
              icon="🎓"
              onClick={() => setRole("student")}
            />

            {/* Owner */}
            <RoleCard
              active={role === "owner"}
              title="Boarding Owner"
              description="Want to list and manage my boarding facilities"
              icon="🏠"
              onClick={() => setRole("owner")}
            />
          </div>

          {/* Continue Button */}
          <button
            onClick={handleContinue}
            disabled={!role}
            className={`w-full py-3 rounded font-semibold transition
              ${role
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-blue-300 text-white cursor-not-allowed"
              }`}
          >
            Continue
          </button>

          {/* Login */}
          <p className="mt-6 text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 font-medium hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>

      {/* <Footer /> */}
    </>
  );
}

/* ---------- Role Card Component ---------- */

function RoleCard({ active, title, description, icon, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`border rounded-xl p-6 mb-4 cursor-pointer transition
        ${active
          ? "border-blue-600 bg-blue-50 shadow-md"
          : "border-gray-200 hover:border-blue-500 hover:shadow"
        }`}
    >
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="font-semibold text-lg mb-1">{title}</h3>
      <p className="text-gray-500 text-sm">{description}</p>
    </div>
  );
}
