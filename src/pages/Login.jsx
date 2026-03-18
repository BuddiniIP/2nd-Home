import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");
    
    if (username && password) {
      const result = login(username, password);
      if (result.success) {
        if (result.user.role === 'owner') {
           navigate("/owner-dashboard"); 
        } else {
           navigate("/student-dashboard");
        }
      } else {
        setError(result.message);
      }
    } else {
      setError("Please fill in all fields");
    }
  };

  return (
    <section className="flex justify-center items-center min-h-[calc(100vh-80px)] py-[100px] sm:py-[50px] bg-[#f5f7fa]">
      <div className="w-[90%] max-w-[1200px] mx-auto px-[15px] flex justify-center">
        <div className="bg-white rounded-[10px] shadow-[0_10px_30px_rgba(0,0,0,0.1)] w-full max-w-[450px] p-[40px] sm:p-[30px] sm:px-[25px] xs:p-[25px] xs:px-[20px]">
          <div className="text-center mb-[30px]">
            <h1 className="text-[2rem] sm:text-[1.8rem] xs:text-[1.6rem] text-dark font-bold mb-[10px]">Welcome Back</h1>
            <p className="text-gray">Sign in to your 2nd Home account</p>
          </div>
          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert"><span className="block sm:inline">{error}</span></div>}
          <form onSubmit={handleLogin}>
            <div className="mb-[20px]">
              <label htmlFor="username" className="block mb-[8px] font-medium text-dark">Username</label>
              <input 
                type="text" 
                id="username" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-[12px] px-[15px] border border-[#ddd] rounded-[4px] text-[1rem] focus:border-primary focus:outline-none transition-colors duration-300" 
                placeholder="Enter your username" 
              />
            </div>
            <div className="mb-[20px]">
              <label htmlFor="password" className="block mb-[8px] font-medium text-dark">Password</label>
              <input 
                type="password" 
                id="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-[12px] px-[15px] border border-[#ddd] rounded-[4px] text-[1rem] focus:border-primary focus:outline-none transition-colors duration-300" 
                placeholder="Enter your password" 
              />
            </div>
            <div className="flex justify-between items-center mb-[25px] flex-row xs:flex-col xs:items-start xs:gap-[10px]">
              <div className="flex items-center">
                <input type="checkbox" id="remember" className="mr-[8px]" />
                <label htmlFor="remember" className="text-dark">Remember me</label>
              </div>
              <Link to="#" className="text-primary text-[0.9rem] hover:underline">Forgot password?</Link>
            </div>
            <button type="submit" className="w-full p-[14px] text-[1.1rem] mb-[20px] rounded-[4px] bg-primary text-white font-semibold hover:bg-[#3a5a9f] hover:-translate-y-[2px] transition-all duration-300 text-center border-none cursor-pointer">
              Login
            </button>
          </form>
          <div className="text-center mt-[25px] text-gray">
            Don't have an account? <Link to="/signup-role" className="text-primary font-medium hover:underline">Sign Up</Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
