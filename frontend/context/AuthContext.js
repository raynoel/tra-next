// Composant qui contient un simili-store importé dans '/pages/_app.js' pour qu'il soit disponble à tous les composants
import axios from 'axios'
import { createContext, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { API_URL } from '../config/index.js'

const AuthContext = createContext();                                                              // Cré un simili-store

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    checkUserLoggedIn();
  }, []);

  // Vérifie si l'usagé est 'logged in' lorsque le composant mount
  const checkUserLoggedIn = async (user) => {
    try {
      const { data } = await axios.get(`${API_URL}/api/user`, user)
      setUser(data.user);
    } catch (error) {
      setUser(null);
    }
  }

  // Register 
  const register = async (user) => {
    try {
      const config = { headers: { 'Content-Type': 'application/json'}} 
      const { data } = await axios.post(`${API_URL}/api/register`, user, config)
      setUser(data.user);
      router.push("/account/dashboard");
    } catch (error) {
      setError(data.message);
      setError(null);
    }
  };

  // Login 
  const login = async ({ email: identifier, password }) => {                                      // on renomme 'email' en 'identifier' pour Strapi
    try {
      const config = { headers: { 'Content-Type': 'application/json'}} 
      const { data } = await axios.post(`${API_URL}/api/login`, { identifier, password }, config)
      setUser(data.user);
      router.push("/account/dashboard");
    } catch (error) {
      setError(data.message);
      setError(null);
    }
  };

  // Logout 
  const logout = async () => {
    const { data } = await axios.post(`${API_URL}/api/logout`)
    setError(null);
    router.push("/");
  };



  return (
    <AuthContext.Provider value={{ user, error, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
