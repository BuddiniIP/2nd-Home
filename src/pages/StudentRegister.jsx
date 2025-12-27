import { useState } from "react";
import { Link } from "react-router-dom";
// import Navbar from "../components/Navbar";
// import Footer from "../components/Footer";
import bgImage from "../assets/images/girlNearWindow.jpg";

export default function StudentRegister() {
  const [profilePic, setProfilePic] = useState(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    alert("Student account created successfully!");
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* <Navbar /> */}

      <div className="flex justify-start px-6 pt-28 pb-10">
        <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Student Registration</h1>
            <p className="text-gray-500 text-sm">Create your BoardingFinder student account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Profile Picture */}
            <div>
              <p className="font-semibold mb-2">Profile Picture</p>
              <label className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-5 cursor-pointer hover:border-blue-500">
                <span className="text-gray-400 text-3xl">📷</span>
                <span className="text-sm text-gray-500 mt-2">Choose File</span>
                <span className="text-xs text-blue-600 mt-1">
                  {profilePic ? profilePic.name : "No file chosen"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => setProfilePic(e.target.files[0])}
                />
              </label>
            </div>

            {/* Inputs */}
            <Input label="Full Name" required />
            <Input label="Username" required />

            <Input
              label="Password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Input
              label="Confirm Password"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <Select label="Gender" options={["Male", "Female"]} required />
            <Input label="Contact Number" type="tel" required />
            <Input label="Email" type="email" required />

            <Select
              label="University"
              required
              options={[
                "University of Colombo",
                "University of Peradeniya",
                "University of Moratuwa",
                "University of Kelaniya",
                "University of Sri Jayewardenepura",
                "Other",
              ]}
            />

            <Select
              label="Year of Study"
              required
              options={["Year 1", "Year 2", "Year 3", "Year 4", "Year 5", "Postgraduate"]}
            />

            <Select
              label="Faculty"
              required
              options={["Computing", "Technology", "Engineering", "Medicine", "Science", "Arts", "Law", "Management", "Other"]}
            />

            <button className="w-full bg-blue-600 text-white py-3 rounded font-semibold hover:bg-blue-700 transition">
              Create Account
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-5">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 font-medium hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>

      {/* <Footer /> */}
    </div>
  );
}

/* ---------- Reusable Components ---------- */

function Input({ label, type = "text", required, value, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

function Select({ label, options, required }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        required={required}
        className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Select {label}</option>
        {options.map((opt) => (
          <option key={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}
