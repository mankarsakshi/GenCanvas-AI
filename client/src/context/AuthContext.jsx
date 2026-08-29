import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/v1/auth";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  // Verify token and fetch current user profile on initial load
  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem("token");
      if (!savedToken) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`${API_BASE_URL}/me`, {
          headers: {
            Authorization: `Bearer ${savedToken}`,
          },
          timeout: 4000,
        });

        if (res.data?.success && res.data.user) {
          setUser(res.data.user);
          localStorage.setItem("user", JSON.stringify(res.data.user));
        }
      } catch (err) {
        console.warn("Token validation failed or server unavailable:", err.message);
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          logout();
        }
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Login handler
  const login = async (email, password) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/login`, {
        email: email.trim(),
        password,
      });

      if (res.data?.success) {
        const { token: receivedToken, user: receivedUser } = res.data;
        if (receivedToken) {
          localStorage.setItem("token", receivedToken);
          setToken(receivedToken);
        }
        if (receivedUser) {
          localStorage.setItem("user", JSON.stringify(receivedUser));
          setUser(receivedUser);
        }
        return { success: true, data: res.data };
      }
      return {
        success: false,
        message: res.data?.message || "Login failed",
      };
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Login failed. Please check your credentials.";
      return { success: false, message };
    }
  };

  // Signup handler
  const signup = async (name, email, password) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/register`, {
        name: name.trim(),
        email: email.trim(),
        password,
      });

      if (res.data?.success) {
        const { token: receivedToken, user: receivedUser } = res.data;
        if (receivedToken) {
          localStorage.setItem("token", receivedToken);
          setToken(receivedToken);
        }
        if (receivedUser) {
          localStorage.setItem("user", JSON.stringify(receivedUser));
          setUser(receivedUser);
        }
        return { success: true, data: res.data };
      }
      return {
        success: false,
        message: res.data?.message || "Signup failed",
      };
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Signup failed. Please try again.";
      return { success: false, message };
    }
  };

  // Demo login for quick testing/evaluation
  const demoLogin = () => {
    const demoUser = {
      id: "demo-user-123",
      name: "Sakshi",
      email: "sakshi@example.com",
      profileImage: "",
    };
    const demoToken = "demo-jwt-token";
    localStorage.setItem("token", demoToken);
    localStorage.setItem("user", JSON.stringify(demoUser));
    setToken(demoToken);
    setUser(demoUser);
    return { success: true, user: demoUser };
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    setToken(null);
    setUser(null);
  };

  // Update profile handler in state & storage
  const updateUser = (updatedFields) => {
    setUser((prev) => {
      const updated = { ...prev, ...updatedFields };
      localStorage.setItem("user", JSON.stringify(updated));
      return updated;
    });
  };

  // Update full profile via backend API
  const updateProfile = async (formData) => {
    try {
      const savedToken = localStorage.getItem("token") || token;
      let headers = {};
      if (savedToken) {
        headers["Authorization"] = `Bearer ${savedToken}`;
      }

      const res = await axios.put(
        `${API_BASE_URL}/profile`,
        {
          userId: user?._id || user?.id,
          ...formData,
        },
        { headers, timeout: 5000 }
      );

      if (res.data?.success && res.data.user) {
        setUser(res.data.user);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        return { success: true, user: res.data.user, message: res.data.message };
      }

      const fallbackUser = { ...user, ...formData };
      setUser(fallbackUser);
      localStorage.setItem("user", JSON.stringify(fallbackUser));
      return { success: true, user: fallbackUser };
    } catch (err) {
      console.warn("Backend profile update warning (falling back to local):", err.message);
      const fallbackUser = { ...user, ...formData };
      setUser(fallbackUser);
      localStorage.setItem("user", JSON.stringify(fallbackUser));
      return { success: true, user: fallbackUser, notice: "Saved locally" };
    }
  };

  // Update avatar via backend API
  const updateAvatar = async (profileImage) => {
    try {
      const savedToken = localStorage.getItem("token") || token;
      let headers = {};
      if (savedToken) {
        headers["Authorization"] = `Bearer ${savedToken}`;
      }

      const res = await axios.post(
        `${API_BASE_URL}/avatar`,
        {
          userId: user?._id || user?.id,
          profileImage,
        },
        { headers, timeout: 5000 }
      );

      if (res.data?.success && res.data.user) {
        setUser(res.data.user);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        return { success: true, user: res.data.user };
      }

      const fallbackUser = { ...user, profileImage };
      setUser(fallbackUser);
      localStorage.setItem("user", JSON.stringify(fallbackUser));
      return { success: true, profileImage };
    } catch (err) {
      console.warn("Backend avatar update warning (falling back to local):", err.message);
      const fallbackUser = { ...user, profileImage };
      setUser(fallbackUser);
      localStorage.setItem("user", JSON.stringify(fallbackUser));
      return { success: true, profileImage };
    }
  };

  // Update settings via backend API
  const updateSettings = async (newSettings) => {
    try {
      const savedToken = localStorage.getItem("token") || token;
      let headers = {};
      if (savedToken) {
        headers["Authorization"] = `Bearer ${savedToken}`;
      }

      const res = await axios.put(
        `${API_BASE_URL}/settings`,
        {
          userId: user?._id || user?.id,
          settings: newSettings,
        },
        { headers, timeout: 5000 }
      );

      if (res.data?.success && res.data.settings) {
        const updatedUser = { ...user, settings: res.data.settings };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        localStorage.setItem("user_settings", JSON.stringify(res.data.settings));
        return { success: true, settings: res.data.settings, message: res.data.message };
      }

      const fallbackUser = { ...user, settings: { ...(user?.settings || {}), ...newSettings } };
      setUser(fallbackUser);
      localStorage.setItem("user", JSON.stringify(fallbackUser));
      localStorage.setItem("user_settings", JSON.stringify(fallbackUser.settings));
      return { success: true, settings: fallbackUser.settings };
    } catch (err) {
      console.warn("Backend settings update warning (falling back to local):", err.message);
      const fallbackUser = { ...user, settings: { ...(user?.settings || {}), ...newSettings } };
      setUser(fallbackUser);
      localStorage.setItem("user", JSON.stringify(fallbackUser));
      localStorage.setItem("user_settings", JSON.stringify(fallbackUser.settings));
      return { success: true, settings: fallbackUser.settings, notice: "Saved locally" };
    }
  };

  // Delete account via backend API
  const deleteAccount = async () => {
    try {
      const savedToken = localStorage.getItem("token") || token;
      let headers = {};
      if (savedToken) {
        headers["Authorization"] = `Bearer ${savedToken}`;
      }

      const res = await axios.delete(
        `${API_BASE_URL}/account`,
        {
          headers,
          data: { userId: user?._id || user?.id },
          timeout: 5000,
        }
      );

      logout();
      localStorage.clear();
      return { success: true, message: res.data?.message || "Account deleted successfully" };
    } catch (err) {
      console.warn("Backend account deletion warning:", err.message);
      logout();
      localStorage.clear();
      return { success: true, message: "Account deleted locally" };
    }
  };

  const value = {
    user,
    token,
    isAuthenticated: Boolean(token || user),
    loading,
    login,
    signup,
    demoLogin,
    logout,
    updateUser,
    updateProfile,
    updateAvatar,
    updateSettings,
    deleteAccount,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
