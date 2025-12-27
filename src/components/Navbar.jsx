import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <>
      <header className="fixed top-0 w-full bg-white shadow z-50">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex items-center justify-between h-16">
            <Link to="/" className="text-xl font-bold text-blue-600">
              BoardingFinder
            </Link>

            <ul className="hidden md:flex space-x-6 text-gray-700 font-medium">
              <li><a href="#features" className="hover:text-blue-600">How It Works</a></li>
              <li><a href="#universities" className="hover:text-blue-600">Universities</a></li>
              <li><a href="#contact" className="hover:text-blue-600">Contact</a></li>
            </ul>

            <div className="hidden md:flex space-x-3">
              {!user ? (
                <>
                  <Link to="/login" className="border border-blue-600 px-4 py-2 rounded text-blue-600 hover:bg-blue-600 hover:text-white">
                    Login
                  </Link>
                  <Link to="/signup" className="bg-blue-600 px-4 py-2 rounded text-white hover:bg-blue-700">
                    Sign Up
                  </Link>
                </>
              ) : (
                <>
                  <Link to={`/${user.role}`} className="px-4 py-2 rounded text-gray-700 hover:text-blue-600">
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </Link>
                  <button onClick={() => { logout(); navigate('/'); }} className="border px-4 py-2 rounded">Logout</button>
                </>
              )}
            </div>

            <button
              className="md:hidden text-2xl"
              onClick={() => setOpen(true)}
            >
              ☰
            </button>
          </nav>
        </div>
      </header>

      {/* Mobile Menu */}
      {open && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center space-y-6">
          <button className="absolute top-4 right-4 text-2xl" onClick={() => setOpen(false)}>✕</button>
          <a href="#features" onClick={() => setOpen(false)}>How It Works</a>
          <a href="#universities" onClick={() => setOpen(false)}>Universities</a>
          {!user ? (
            <>
              <Link to="/login" onClick={() => setOpen(false)}>Login</Link>
              <Link to="/signup" className="bg-blue-600 text-white px-6 py-2 rounded" onClick={() => setOpen(false)}>
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <Link to={`/${user.role}`} onClick={() => setOpen(false)}>{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</Link>
              <button onClick={() => { logout(); setOpen(false); navigate('/'); }} className="bg-gray-200 px-4 py-2 rounded">Logout</button>
            </>
          )}
        </div>
      )}
    </>
  );
}
