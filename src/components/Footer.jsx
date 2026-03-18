import { Link } from "react-router-dom";
import Logo from "./Logo";

const Footer = () => {
  return (
    <footer className="bg-dark text-white pt-[60px] pb-[20px]">
      <div className="w-[90%] max-w-[1200px] mx-auto px-[15px]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[40px] mb-[40px]">
          <div>
            <Link to="/" className="inline-block mb-[20px]"><Logo textColor="#ffffff" style={{ height: '50px' }} /></Link>
            <p className="text-[#b0b7c3] leading-relaxed">Connecting university students with verified boarding facilities.</p>
          </div>
          <div>
            <h3 className="text-[1.3rem] mb-[20px] text-white">For Students</h3>
            <ul className="list-none flex flex-col gap-2.5">
              <li><Link to="/search" className="text-[#b0b7c3] hover:text-white transition-colors duration-300">Search Boarding</Link></li>
              <li><Link to="/how-it-works" className="text-[#b0b7c3] hover:text-white transition-colors duration-300">How it Works</Link></li>
              <li><Link to="#" className="text-[#b0b7c3] hover:text-white transition-colors duration-300">Safety Tips</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-[1.3rem] mb-[20px] text-white">For Owners</h3>
            <ul className="list-none flex flex-col gap-2.5">
              <li><Link to="/owner-registration" className="text-[#b0b7c3] hover:text-white transition-colors duration-300">List Your Property</Link></li>
              <li><Link to="#" className="text-[#b0b7c3] hover:text-white transition-colors duration-300">Verification Process</Link></li>
              <li><Link to="#" className="text-[#b0b7c3] hover:text-white transition-colors duration-300">Owner Guidelines</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-[1.3rem] mb-[20px] text-white">Support</h3>
            <ul className="list-none flex flex-col gap-2.5">
              <li><Link to="/contact-us" className="text-[#b0b7c3] hover:text-white transition-colors duration-300">Contact Us</Link></li>
              <li><Link to="#" className="text-[#b0b7c3] hover:text-white transition-colors duration-300">FAQ</Link></li>
              <li><Link to="#" className="text-[#b0b7c3] hover:text-white transition-colors duration-300">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="text-center pt-[20px] border-t border-[rgba(255,255,255,0.1)] text-[#b0b7c3] text-[0.9rem]">
          <p>&copy; {new Date().getFullYear()} 2nd Home. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
