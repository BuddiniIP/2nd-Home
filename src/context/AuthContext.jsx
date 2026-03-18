import { createContext, useState, useContext, useEffect } from 'react';
import { users } from '../data/mockData';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage for persistent login
    const storedUser = localStorage.getItem('2nd HomeUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (username, password) => {
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('2nd HomeUser', JSON.stringify(user));
      return { success: true, user };
    }
    return { success: false, message: 'Invalid username or password' };
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('2nd HomeUser');
  };

  const register = (userData) => {
    // In a real app we would add to db. Here we just pretend it worked and log them in
    // Note: this mock data won't persist across page reloads because it modifies the in-memory array
    const newUser = { id: Date.now().toString(), ...userData };
    users.push(newUser); 
    setCurrentUser(newUser);
    localStorage.setItem('2nd HomeUser', JSON.stringify(newUser));
    return { success: true, user: newUser };
  };

  const value = {
    currentUser,
    login,
    logout,
    register,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
