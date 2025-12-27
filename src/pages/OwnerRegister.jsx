import { useState } from "react";
import { Link } from "react-router-dom";
// import Navbar from "../components/Navbar";
// import Footer from "../components/Footer";
import ownerBg from "../assets/images/bluedoor.jpg";

export default function OwnerRegister() {
  const [profilePic, setProfilePic] = useState(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nic, setNic] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const nicRegex = /^([0-9]{9}[xXvV]|[0-9]{12})$/;
    if (!nicRegex.test(nic)) {
      alert("Please enter a valid NIC number");
      return;
    }

    alert("Boarding Owner account created successfully!");
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* <Navbar /> */}

      <div className="flex flex-1 pt-20">
        {/* Left Image Section */}
        <div
          className="hidden lg:block w-1/2 bg-cover bg-center"
          style={{ backgroundImage: `url(${ownerBg})` }}
        />

        {/* Right Form Section */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">Boarding Owner Registration</h1>
              <p className="text-sm text-gray-500">Create your BoardingFinder owner account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Profile Picture */}
              <div>
                <p className="font-semibold mb-2">Profile Picture</p>
                <label className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-5 cursor-pointer hover:border-blue-500">
                  <span className="text-3xl">📷</span>
                  <span className="text-sm text-gray-500">Choose File</span>
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

              <hr />

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

              <Input
                label="NIC Number"
                required
                value={nic}
                onChange={(e) => setNic(e.target.value)}
              />

              <Input label="Contact Number" type="tel" required />
              <Input label="Email" type="email" required />
              <Input label="WhatsApp Number" type="tel" required />

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
