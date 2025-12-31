import React, { createContext, useContext, useState, useEffect } from "react";
import * as api from "../services/api";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const raw = localStorage.getItem("btz_auth");
    if (raw) {
      const obj = JSON.parse(raw);
      setUser(obj.user);
      setToken(obj.token);
    }
  }, []);

  function save(u, t) {
    setUser(u);
    setToken(t);
    localStorage.setItem("btz_auth", JSON.stringify({ user: u, token: t }));
  }

  async function login(email, password) {
    const resp = await api.login(email, password);
    if (resp && resp.token) save(resp.user, resp.token);
    return resp;
  }

  async function loginWithGoogle(payload) {
    // payload: { email, googleId, name }
    const resp = await api.loginWithGoogle(payload);
    if (resp?.token) save(resp.user, resp.token);
    return resp;
  }

  function logout() {
    setUser(null);
    setToken(null);
    localStorage.removeItem("btz_auth");
    navigate("/");
  }

  return (
    <AuthContext.Provider
      value={{ user, token, login, loginWithGoogle, logout, save }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
