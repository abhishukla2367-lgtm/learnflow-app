import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axiosConfig';

const AuthContext = createContext(null);

// Scoped enrollment key — prevents cross-user data leaks on shared devices
export const enrollmentKey = (userId) => `lf_enrollments_${userId}`;

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('lf_user');
    const token      = localStorage.getItem('lf_token');
    if (storedUser && token) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } catch {
        localStorage.clear();
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    const { user, token, refreshToken } = data;

    localStorage.setItem('lf_user',  JSON.stringify(user));
    localStorage.setItem('lf_token', token);
    if (refreshToken) localStorage.setItem('lf_refresh_token', refreshToken);

    setUser(user);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    return user;
  };

  const logout = () => {
    // Clear user-scoped enrollments to prevent leaking to next user on same browser
    if (user) {
      const uid = user._id || user.id;
      if (uid) localStorage.removeItem(enrollmentKey(uid));
    }
    setUser(null);
    localStorage.clear();
    delete api.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, enrollmentKey }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
