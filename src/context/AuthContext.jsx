import { createContext, useContext, useState, useEffect } from 'react'


const AuthContext = createContext()


export const AuthProvider = ({ children }) => {
const [user, setUser] = useState(() => {
  try {
    const raw = localStorage.getItem("bf_user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
});


useEffect(() => {
  if (user) {
    localStorage.setItem("bf_user", JSON.stringify(user));
  } else {
    localStorage.removeItem("bf_user");
  }
}, [user]);


const login = (role) => setUser({ role })
const logout = () => setUser(null)


return (
<AuthContext.Provider value={{ user, login, logout }}>
{children}
</AuthContext.Provider>
)
}


export const useAuth = () => useContext(AuthContext)