import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const SignupRoleSelection = () => {
  const [selectedRole, setSelectedRole] = useState(null);
  const navigate = useNavigate();

  const handleContinue = () => {
    if (selectedRole === "student") {
      navigate("/student-registration");
    } else if (selectedRole === "owner") {
      navigate("/owner-registration");
    }
  };

  return (
    <section className="flex justify-center items-center min-h-[calc(100vh-80px)] py-[100px] sm:py-[50px] bg-[#f5f7fa]">
      <div className="w-[90%] max-w-[1200px] mx-auto px-[15px] flex justify-center">
        <div className="bg-white rounded-[15px] shadow-[0_20px_40px_rgba(0,0,0,0.1)] w-full max-w-[500px] p-[50px_40px] md:p-[40px_30px] sm:p-[30px_20px] text-center">
          <div className="mb-[40px]">
            <h1 className="text-[2.2rem] md:text-[2rem] sm:text-[1.8rem] text-dark font-bold mb-[15px]">Create Account</h1>
            <p className="text-gray text-[1.1rem]">Join 2nd Home community</p>
          </div>
          
          <div className="mb-[30px] text-left">
            <div className="text-[1.2rem] text-dark mb-[20px] font-semibold text-center">I am a</div>
            
            <div 
              className={`w-full p-[25px_20px] bg-white border-2 rounded-[10px] text-center transition-all duration-300 cursor-pointer mb-[20px] ${selectedRole === 'student' ? 'border-primary bg-[rgba(74,107,175,0.05)]' : 'border-[#e0e0e0] hover:border-primary hover:-translate-y-[5px] hover:shadow-[0_10px_25px_rgba(0,0,0,0.1)]'}`}
              onClick={() => setSelectedRole("student")}
            >
              <div className="text-[3rem] sm:text-[2.5rem] mb-[15px] text-primary">
                <i className="fas fa-user-graduate"></i>
              </div>
              <div className="text-[1.3rem] font-semibold text-dark mb-[10px]">Student</div>
              <div className="text-gray text-[0.95rem] mb-[15px]">
                Looking for verified boarding facilities near my university
              </div>
            </div>
            
            <div 
              className={`w-full p-[25px_20px] bg-white border-2 rounded-[10px] text-center transition-all duration-300 cursor-pointer mb-[20px] ${selectedRole === 'owner' ? 'border-primary bg-[rgba(74,107,175,0.05)]' : 'border-[#e0e0e0] hover:border-primary hover:-translate-y-[5px] hover:shadow-[0_10px_25px_rgba(0,0,0,0.1)]'}`}
              onClick={() => setSelectedRole("owner")}
            >
              <div className="text-[3rem] sm:text-[2.5rem] mb-[15px] text-primary">
                <i className="fas fa-home"></i>
              </div>
              <div className="text-[1.3rem] font-semibold text-dark mb-[10px]">Boarding Owner</div>
              <div className="text-gray text-[0.95rem] mb-[15px]">
                Want to list and manage my boarding facilities
              </div>
            </div>
          </div>
          
          <button 
            className={`w-[100%] p-[15px] text-[1.1rem] mt-[10px] rounded-[4px] font-semibold transition-all duration-300 ${selectedRole ? 'bg-primary text-white hover:bg-[#3a5a9f] hover:-translate-y-[2px] opacity-100 cursor-pointer' : 'bg-primary text-white opacity-70 cursor-not-allowed'}`}
            disabled={!selectedRole}
            onClick={handleContinue}
          >
            Continue
          </button>
          
          <div className="mt-[25px] text-gray">
            Already have an account? <Link to="/login" className="text-primary font-medium hover:underline">Login</Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignupRoleSelection;
