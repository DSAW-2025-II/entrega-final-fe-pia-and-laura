import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null; // ✅ primero parseamos
  });

  const [token, setToken] = useState(() => localStorage.getItem("token") || null);

  const login = (userData, tokenData) => {
    // ✅ guardamos en localStorage
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", tokenData);

    // ✅ actualizamos estado global
    setUser(userData);
    setToken(tokenData);
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
