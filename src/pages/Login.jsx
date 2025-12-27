import { useState } from "react"
// import Navbar from "../components/Navbar"
// import Footer from "../components/Footer"
import loginBg from "../assets/images/loginpageImage.jpg"
import { useNavigate, Link } from "react-router-dom"
import { loginUser } from "../services/authService"
import { useAuth } from "../context/AuthContext"

export default function Login() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [remember, setRemember] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  // ✅ MUST be async
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!username || !password) {
      alert("Please fill in all fields")
      return
    }

    try {
      const res = await loginUser({ username, password })
      login(res.role)
      navigate(`/${res.role}`)
    } catch (error) {
      alert("Invalid username or password")
    }
  }

  return (
    <>
      {/* <Navbar /> */}

      <div
        className="min-h-screen flex items-center justify-center bg-cover bg-center px-4"
        style={{ backgroundImage: `url(${loginBg})` }}
      >
        <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-8 mt-20">
          
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-500">
              Sign in to your BoardingFinder account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border rounded px-4 py-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border rounded px-4 py-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-between items-center text-sm">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={() => setRemember(!remember)}
                />
                Remember me
              </label>
              <a href="#" className="text-blue-600 hover:underline">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded font-semibold hover:bg-blue-700 transition"
            >
              Login
            </button>
          </form>

          <p className="text-center text-gray-600 mt-6 text-sm">
            Don&apos;t have an account?{" "}
            <Link to="/signup" className="text-blue-600 font-medium hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>

      {/* <Footer /> */}
    </>
  )
}
