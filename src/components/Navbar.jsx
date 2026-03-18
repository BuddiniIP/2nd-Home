import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Logo from "./Logo";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="bg-white shadow-[0_2px_10px_rgba(0,0,0,0.1)] fixed w-full top-0 z-[1000]">
      <div className="w-[90%] max-w-[1200px] mx-auto px-[15px]">
        <nav className="flex justify-between items-center py-5">
          <Link to="/" className="text-[1.8rem] font-bold text-primary no-underline flex items-center">
            <Logo style={{ height: '50px' }} />
          </Link>

          <ul className={`lg:flex list-none ${isMobileMenuOpen ? 'flex flex-col absolute top-full left-0 w-full bg-white shadow-md p-5 gap-4' : 'hidden'}`}>
            <li className="lg:ml-[30px]"><Link to="/" className="text-dark font-medium hover:text-primary transition-colors duration-300">Home</Link></li>
            <li className="lg:ml-[30px]"><Link to="/search" className="text-dark font-medium hover:text-primary transition-colors duration-300">Search</Link></li>
            <li className="lg:ml-[30px]"><Link to="/about" className="text-dark font-medium hover:text-primary transition-colors duration-300">About</Link></li>
            <li className="lg:ml-[30px]"><Link to="/how-it-works" className="text-dark font-medium hover:text-primary transition-colors duration-300">How It Works</Link></li>
            <li className="lg:ml-[30px]"><Link to="/contact-us" className="text-dark font-medium hover:text-primary transition-colors duration-300">Contact</Link></li>
          </ul>

          <div className={`lg:flex items-center gap-[15px] ${isMobileMenuOpen ? 'flex flex-col absolute top-[280px] left-0 w-full bg-white shadow-md p-5 border-t border-gray-100' : 'hidden'}`}>
            {currentUser ? (
              <>
                <Link to={currentUser.role === 'owner' ? "/owner-dashboard" : "/student-dashboard"} className="text-dark font-medium hover:text-primary transition-colors duration-300">Dashboard</Link>
                <div className="w-[1px] h-[20px] bg-gray-300 hidden lg:block"></div>
                <div className="flex items-center gap-3">
                  <Link to="/student-profile" className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
                      {currentUser.name.charAt(0)}
                    </div>
                  </Link>
                  <button onClick={handleLogout} className="text-gray-500 hover:text-red-500 transition-colors text-sm font-medium">Logout</button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="inline-block px-6 py-2 rounded text-primary font-semibold border-2 border-primary hover:bg-primary hover:text-white transition-all duration-300 text-center">Login</Link>
                <Link to="/signup-role" className="inline-block px-6 py-2 rounded text-white bg-primary font-semibold hover:bg-[#3a5a9f] hover:-translate-y-[2px] transition-all duration-300 text-center">Sign Up</Link>
              </>
            )}
          </div>

          <div className="lg:hidden text-2xl cursor-pointer text-dark" onClick={toggleMobileMenu}>
            <i className="fas fa-bars"></i>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
