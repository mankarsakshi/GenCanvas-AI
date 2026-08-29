import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  X,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Zap,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import "./Auth.css";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, demoLogin } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const destination = location.state?.from?.pathname || "/dashboard";

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.email || !form.password) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);
    const result = await login(form.email, form.password);
    setLoading(false);

    if (result.success) {
      setSuccess("Welcome back! Redirecting to studio...");
      setTimeout(() => {
        navigate(destination, { replace: true });
      }, 700);
    } else {
      setError(result.message || "Failed to sign in. Please verify your credentials.");
    }
  };

  const handleDemoLogin = () => {
    setError("");
    setSuccess("Logged in as Demo Creator!");
    demoLogin();
    setTimeout(() => {
      navigate(destination, { replace: true });
    }, 600);
  };

  return (
    <div className="auth-wrapper">
      {/* Background orbs */}
      <div className="auth-orb auth-orb-1" />
      <div className="auth-orb auth-orb-2" />
      <div className="auth-orb auth-orb-3" />
      <div className="auth-grid" />

      <div className="auth-card">
        {/* Close / Return button */}
        <button
          type="button"
          onClick={() => navigate("/")}
          className="auth-close-btn"
          title="Return to Home"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="auth-header">
          <div className="auth-logo">
            <Sparkles size={15} />
            <span>GenCanvas AI</span>
          </div>
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Sign in to your creative AI workspace</p>
        </div>

        {/* Tabs: Sign In / Create Account */}
        <div className="auth-tabs">
          <button
            type="button"
            className="auth-tab-btn active"
            onClick={() => {}}
          >
            Sign In
          </button>
          <button
            type="button"
            className="auth-tab-btn"
            onClick={() => navigate("/signup")}
          >
            Create Account
          </button>
        </div>

        {/* Feedback Alerts */}
        {error && (
          <div className="auth-alert auth-alert-error">
            <AlertCircle size={17} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="auth-alert auth-alert-success">
            <CheckCircle2 size={17} className="shrink-0 mt-0.5" />
            <span>{success}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="auth-field-group">
            <label className="auth-label">Email Address</label>
            <div className="auth-input-wrapper">
              <Mail size={17} className="auth-input-icon" />
              <input
                type="email"
                name="email"
                placeholder="name@example.com"
                value={form.email}
                onChange={handleChange}
                required
                autoComplete="email"
                className="auth-input"
              />
            </div>
          </div>

          {/* Password */}
          <div className="auth-field-group">
            <label className="auth-label">Password</label>
            <div className="auth-input-wrapper">
              <Lock size={17} className="auth-input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
                className="auth-input"
              />
              <button
                type="button"
                className="auth-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="auth-row-between">
            <label className="auth-checkbox-label">
              <input
                type="checkbox"
                name="remember"
                checked={form.remember}
                onChange={handleChange}
              />
              <span>Remember me</span>
            </label>

            <a
              href="#forgot"
              onClick={(e) => {
                e.preventDefault();
                setError("Password recovery link has been requested.");
              }}
              className="auth-link"
            >
              Forgot Password?
            </a>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="auth-submit-btn"
          >
            {loading ? (
              <span>Signing in...</span>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight size={17} />
              </>
            )}
          </button>
        </form>

        {/* Demo Fast Login Option */}
        <button
          type="button"
          onClick={handleDemoLogin}
          className="auth-demo-btn"
          title="Instant 1-click login for quick evaluation"
        >
          <Zap size={15} className="text-amber-400" />
          <span>Quick Demo Login (1-Click)</span>
        </button>

        {/* Footer */}
        <div className="auth-footer">
          Don't have an account?{" "}
          <Link to="/signup" className="auth-link">
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;