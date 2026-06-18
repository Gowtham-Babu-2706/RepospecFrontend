
import { useState } from "react";
import authApi from "./authApi";

// ── Login Hook ──────────────────────────────────────────────
export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const login = async (credentials) => {
    try {
      setLoading(true);
      setError("");
      const res = await authApi.post("/login", credentials);
      return res.data; // expects { token, user }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Login failed. Please check your credentials.";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error, setError };
};

// ── Register Hook ────────────────────────────────────────────
export const useRegister = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const register = async (userData) => {
    try {
      setLoading(true);
      setError("");
      const res = await authApi.post("/register", userData);
      return res.data; // expects { token, user }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Registration failed. Please try again.";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { register, loading, error, setError };
};
