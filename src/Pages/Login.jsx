import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCodeBranch,
  faEnvelope,
  faLock,
  faEye,
  faEyeSlash,
  faCircleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { useLogin } from "../utils/axios/useAuth";
import { useAuthContext } from "../context/AuthContext";

/* ── Inline style tokens ───────────────────────────────────── */
const S = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f0c29 0%, #302b63 55%, #24243e 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "1.5rem",
    fontFamily: "'Inter', 'Public Sans', sans-serif",
  },
  card: {
    width: "100%",
    maxWidth: "420px",
    background: "rgba(255,255,255,0.05)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: "20px",
    padding: "2.5rem 2rem",
    boxShadow: "0 25px 50px rgba(0,0,0,0.4)",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    justifyContent: "center",
    marginBottom: "1.75rem",
    color: "#a78bfa",
    fontSize: "1.25rem",
    fontWeight: 700,
    letterSpacing: "-0.5px",
  },
  heading: {
    color: "#ffffff",
    fontSize: "1.6rem",
    fontWeight: 700,
    textAlign: "center",
    marginBottom: "0.35rem",
  },
  sub: {
    color: "rgba(255,255,255,0.5)",
    fontSize: "0.875rem",
    textAlign: "center",
    marginBottom: "2rem",
  },
  label: {
    display: "block",
    color: "rgba(255,255,255,0.7)",
    fontSize: "0.8rem",
    fontWeight: 500,
    marginBottom: "0.4rem",
    letterSpacing: "0.3px",
  },
  inputWrap: {
    position: "relative",
    marginBottom: "1.1rem",
  },
  inputIcon: {
    position: "absolute",
    left: "14px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "rgba(255,255,255,0.35)",
    fontSize: "0.85rem",
    pointerEvents: "none",
  },
  input: {
    width: "100%",
    background: "rgba(255,255,255,0.07)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: "10px",
    padding: "0.75rem 0.75rem 0.75rem 2.5rem",
    color: "#fff",
    fontSize: "0.9rem",
    outline: "none",
    transition: "border 0.2s",
    boxSizing: "border-box",
  },
  eyeBtn: {
    position: "absolute",
    right: "14px",
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    color: "rgba(255,255,255,0.4)",
    cursor: "pointer",
    padding: 0,
    fontSize: "0.85rem",
  },
  primaryBtn: {
    width: "100%",
    padding: "0.8rem",
    background: "linear-gradient(135deg, #7c3aed, #a78bfa)",
    border: "none",
    borderRadius: "10px",
    color: "#fff",
    fontSize: "0.95rem",
    fontWeight: 600,
    cursor: "pointer",
    transition: "opacity 0.2s, transform 0.1s",
    marginTop: "0.5rem",
    letterSpacing: "0.3px",
  },
  divider: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    margin: "1.5rem 0",
  },
  dividerLine: {
    flex: 1,
    height: "1px",
    background: "rgba(255,255,255,0.1)",
  },
  dividerText: {
    color: "rgba(255,255,255,0.35)",
    fontSize: "0.78rem",
    whiteSpace: "nowrap",
  },
  socialBtn: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.6rem",
    padding: "0.75rem",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: "10px",
    color: "rgba(255,255,255,0.85)",
    fontSize: "0.9rem",
    fontWeight: 500,
    cursor: "pointer",
    transition: "background 0.2s, border-color 0.2s",
    marginBottom: "0.75rem",
    letterSpacing: "0.2px",
  },
  errorBox: {
    background: "rgba(239,68,68,0.1)",
    border: "1px solid rgba(239,68,68,0.3)",
    borderRadius: "8px",
    padding: "0.7rem 0.9rem",
    color: "#fca5a5",
    fontSize: "0.82rem",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    marginBottom: "1rem",
  },
  footer: {
    marginTop: "1.5rem",
    textAlign: "center",
    color: "rgba(255,255,255,0.45)",
    fontSize: "0.82rem",
  },
  footerLink: {
    color: "#a78bfa",
    fontWeight: 600,
    textDecoration: "none",
  },
};

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login: setAuth } = useAuthContext();
  const { login, loading, error } = useLogin();

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState("");

  const oauthError = searchParams.get("error") === "oauth_failed";

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login(form);
      setAuth(res.user || { name: res.name || form.email }, res.token);
      navigate("/");
    } catch {
      // error is already set by the hook
    }
  };

  const handleGoogle = () => {
    window.location.href = "https://repospecbackend-1.onrender.com/oauth2/authorization/google";
  };

  const handleGithub = () => {
    window.location.href = "https://repospecbackend-1.onrender.com/oauth2/authorization/github";
  };

  const inputStyle = (field) => ({
    ...S.input,
    borderColor:
      focusedField === field
        ? "rgba(167,139,250,0.6)"
        : "rgba(255,255,255,0.12)",
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        input::placeholder { color: rgba(255,255,255,0.25); }
        input:-webkit-autofill {
          -webkit-box-shadow: 0 0 0 1000px #1e1b4b inset !important;
          -webkit-text-fill-color: #fff !important;
        }
        .social-btn:hover { background: rgba(255,255,255,0.1) !important; border-color: rgba(255,255,255,0.22) !important; }
        .primary-btn:hover:not(:disabled) { opacity: 0.88; transform: translateY(-1px); }
        .primary-btn:disabled { opacity: 0.55; cursor: not-allowed; }
      `}</style>

      <div style={S.page}>
        <div style={S.card}>
          {/* Logo */}
          <div style={S.logo}>
            <FontAwesomeIcon icon={faCodeBranch} />
            RepoSpec
          </div>

          <h1 style={S.heading}>Welcome back</h1>
          <p style={S.sub}>Sign in to your account to continue</p>

          {/* OAuth error */}
          {oauthError && (
            <div style={S.errorBox}>
              <FontAwesomeIcon icon={faCircleExclamation} />
              OAuth sign-in failed. Please try again.
            </div>
          )}

          {/* API error */}
          {error && (
            <div style={S.errorBox}>
              <FontAwesomeIcon icon={faCircleExclamation} />
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Email */}
            <label style={S.label} htmlFor="login-email">Email address</label>
            <div style={S.inputWrap}>
              <FontAwesomeIcon icon={faEnvelope} style={S.inputIcon} />
              <input
                id="login-email"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={form.email}
                required
                autoComplete="email"
                onChange={handleChange}
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField("")}
                style={inputStyle("email")}
              />
            </div>

            {/* Password */}
            <label style={S.label} htmlFor="login-password">Password</label>
            <div style={S.inputWrap}>
              <FontAwesomeIcon icon={faLock} style={S.inputIcon} />
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                value={form.password}
                required
                autoComplete="current-password"
                onChange={handleChange}
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField("")}
                style={{ ...inputStyle("password"), paddingRight: "2.5rem" }}
              />
              <button
                type="button"
                style={S.eyeBtn}
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="primary-btn"
              style={S.primaryBtn}
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>

          {/* Divider */}
          <div style={S.divider}>
            <div style={S.dividerLine} />
            <span style={S.dividerText}>or continue with</span>
            <div style={S.dividerLine} />
          </div>

          {/* Google */}
          <button
            id="btn-google-login"
            type="button"
            className="social-btn"
            style={S.socialBtn}
            onClick={handleGoogle}
          >
            <svg width="18" height="18" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              <path fill="none" d="M0 0h48v48H0z"/>
            </svg>
            Continue with Google
          </button>

          {/* GitHub */}
          <button
            id="btn-github-login"
            type="button"
            className="social-btn"
            style={S.socialBtn}
            onClick={handleGithub}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            Continue with GitHub
          </button>

          {/* Footer */}
          <p style={S.footer}>
            Don't have an account?{" "}
            <Link to="/register" style={S.footerLink}>
              Create one
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
