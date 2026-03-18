import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const BownerRegistration = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    password: "",
    confirmPassword: "",
    nicNumber: "",
    contactNumber: "",
    email: "",
    whatsappNumber: ""
  });
  const [fileName, setFileName] = useState("No file chosen");
  const [error, setError] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    } else {
      setFileName("No file chosen");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
    
    // Basic NIC validation (Sri Lankan format)
    const nicRegex = /^([0-9]{9}[xXvV]|[0-9]{12})$/;
    if (!nicRegex.test(formData.nicNumber)) {
      setError("Please enter a valid NIC number (9 digits with X/V or 12 digits)");
      return;
    }

    const result = register({
      username: formData.username,
      password: formData.password,
      role: 'owner',
      name: formData.fullName,
      email: formData.email,
      phone: formData.contactNumber,
      propertiesOwned: []
    });

    if (result.success) {
      navigate("/"); // Sending owner to home page since there isn't an owner dashboard mapped yet
    } else {
      setError("Failed to create account. Please try again.");
    }
  };

  return (
    <div className="flex flex-1 min-h-[calc(100vh-80px)] bg-[#f5f7fa] flex-col lg:flex-row shadow-[0px_4px_10px_rgba(0,0,0,0.1)] relative w-full overflow-hidden">
      {/* Left Side - For Image */}
      <div className="hidden lg:block flex-1 bg-[url('https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80')] bg-cover bg-center">
      </div>
      
      {/* Right Side - Form */}
      <div className="flex-1 flex justify-center items-center p-[15px] sm:p-[20px] lg:p-[20px]">
        <section className="w-full max-w-[500px]">
          <div className="bg-white rounded-[12px] shadow-[0_10px_30px_rgba(0,0,0,0.1)] p-[20px] xs:p-[15px] sm:p-[25px] lg:p-[30px] max-h-none lg:max-h-[85vh] overflow-y-auto">
            <div className="text-center mb-[25px]">
              <h1 className="text-[1.5rem] sm:text-[1.6rem] lg:text-[1.8rem] text-dark font-bold mb-[8px]">Boarding Owner Registration</h1>
              <p className="text-gray text-[0.95rem]">Create your 2nd Home owner account</p>
            </div>
            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert"><span className="block sm:inline">{error}</span></div>}
            
            <form className="flex flex-col gap-[15px]" onSubmit={handleSubmit}>
              {/* Profile Picture Section */}
              <div className="mb-[15px]">
                <h3 className="text-[1.1rem] text-dark font-semibold mb-[10px]">Profile Picture</h3>
                <div 
                  className="flex flex-col items-center text-center p-[20px] border-2 border-dashed border-[#ddd] rounded-[6px] cursor-pointer transition-colors duration-300 hover:border-primary"
                  onClick={() => document.getElementById('profilePicture').click()}
                >
                  <div className="text-[2rem] text-gray mb-[10px]">
                    <i className="fas fa-camera"></i>
                  </div>
                  <div className="text-gray text-[0.9rem] mb-[8px]">Choose File</div>
                  <div className="text-[0.85rem] text-primary font-medium mt-[8px]">{fileName}</div>
                  <input type="file" id="profilePicture" className="hidden" accept="image/*" onChange={handleFileChange} />
                </div>
              </div>

              <div className="h-[1px] bg-[#e0e0e0] my-[10px]"></div>

              {/* Form Fields */}
              <div className="mb-[15px]">
                <label htmlFor="fullName" className="block mb-[6px] font-medium text-dark text-[0.9rem]">
                  Full Name <span className="text-[#e74c3c]">*</span>
                </label>
                <input type="text" id="fullName" value={formData.fullName} onChange={handleInputChange} className="w-full p-[10px_12px] border border-[#ddd] rounded-[4px] text-[0.9rem] focus:border-primary focus:outline-none focus:ring-2 focus:ring-[rgba(74,107,175,0.2)] transition-colors duration-300" placeholder="Enter your full name" required />
              </div>

              <div className="mb-[15px]">
                <label htmlFor="username" className="block mb-[6px] font-medium text-dark text-[0.9rem]">
                  Username <span className="text-[#e74c3c]">*</span>
                </label>
                <input type="text" id="username" value={formData.username} onChange={handleInputChange} className="w-full p-[10px_12px] border border-[#ddd] rounded-[4px] text-[0.9rem] focus:border-primary focus:outline-none focus:ring-2 focus:ring-[rgba(74,107,175,0.2)] transition-colors duration-300" placeholder="Choose a username" required />
              </div>

              <div className="mb-[15px]">
                <label htmlFor="password" className="block mb-[6px] font-medium text-dark text-[0.9rem]">
                  Password <span className="text-[#e74c3c]">*</span>
                </label>
                <input type="password" id="password" value={formData.password} onChange={handleInputChange} className="w-full p-[10px_12px] border border-[#ddd] rounded-[4px] text-[0.9rem] focus:border-primary focus:outline-none focus:ring-2 focus:ring-[rgba(74,107,175,0.2)] transition-colors duration-300" placeholder="Create a password" required />
              </div>

              <div className="mb-[15px]">
                <label htmlFor="confirmPassword" className="block mb-[6px] font-medium text-dark text-[0.9rem]">
                  Confirm Password <span className="text-[#e74c3c]">*</span>
                </label>
                <input type="password" id="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} className="w-full p-[10px_12px] border border-[#ddd] rounded-[4px] text-[0.9rem] focus:border-primary focus:outline-none focus:ring-2 focus:ring-[rgba(74,107,175,0.2)] transition-colors duration-300" placeholder="Confirm your password" required />
              </div>

              <div className="mb-[15px]">
                <label htmlFor="nicNumber" className="block mb-[6px] font-medium text-dark text-[0.9rem]">
                  NIC Number <span className="text-[#e74c3c]">*</span>
                </label>
                <input type="text" id="nicNumber" value={formData.nicNumber} onChange={handleInputChange} className="w-full p-[10px_12px] border border-[#ddd] rounded-[4px] text-[0.9rem] focus:border-primary focus:outline-none focus:ring-2 focus:ring-[rgba(74,107,175,0.2)] transition-colors duration-300" placeholder="Enter your NIC number" required />
              </div>

              <div className="mb-[15px]">
                <label htmlFor="contactNumber" className="block mb-[6px] font-medium text-dark text-[0.9rem]">
                  Contact Number <span className="text-[#e74c3c]">*</span>
                </label>
                <input type="tel" id="contactNumber" value={formData.contactNumber} onChange={handleInputChange} className="w-full p-[10px_12px] border border-[#ddd] rounded-[4px] text-[0.9rem] focus:border-primary focus:outline-none focus:ring-2 focus:ring-[rgba(74,107,175,0.2)] transition-colors duration-300" placeholder="Enter contact number" required />
              </div>

              <div className="mb-[15px]">
                <label htmlFor="email" className="block mb-[6px] font-medium text-dark text-[0.9rem]">
                  Email <span className="text-[#e74c3c]">*</span>
                </label>
                <input type="email" id="email" value={formData.email} onChange={handleInputChange} className="w-full p-[10px_12px] border border-[#ddd] rounded-[4px] text-[0.9rem] focus:border-primary focus:outline-none focus:ring-2 focus:ring-[rgba(74,107,175,0.2)] transition-colors duration-300" placeholder="Enter email address" required />
              </div>

              <div className="mb-[15px]">
                <label htmlFor="whatsappNumber" className="block mb-[6px] font-medium text-dark text-[0.9rem]">
                  WhatsApp Account <span className="text-[#e74c3c]">*</span>
                </label>
                <input type="tel" id="whatsappNumber" value={formData.whatsappNumber} onChange={handleInputChange} className="w-full p-[10px_12px] border border-[#ddd] rounded-[4px] text-[0.9rem] focus:border-primary focus:outline-none focus:ring-2 focus:ring-[rgba(74,107,175,0.2)] transition-colors duration-300" placeholder="Enter WhatsApp number" required />
              </div>

              <button type="submit" className="w-full p-[12px] text-[1rem] mt-[15px] rounded-[4px] bg-primary text-white font-semibold hover:bg-[#3a5a9f] hover:-translate-y-[2px] transition-all duration-300 text-center border-none cursor-pointer">
                Create Account
              </button>
            </form>

            <div className="text-center mt-[20px] text-gray text-[0.9rem]">
              Already have an account? <Link to="/login" className="text-primary font-medium hover:underline">Login</Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default BownerRegistration;
