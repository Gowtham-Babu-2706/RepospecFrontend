import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

/**
 * Spring Boot redirects here after OAuth2 success:
 *   http://localhost:5173/oauth2/callback?token=<jwt>
 *
 * This page grabs the token, saves it, then navigates home.
 */
const OAuth2Callback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuthContext();

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      // Decode the JWT payload to extract basic user info (no secret needed)
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const user = {
          email: payload.sub || payload.email || "",
          name: payload.name || payload.sub || "User",
        };
        login(user, token);
      } catch {
        // If decode fails, still save the token with minimal user info
        login({ name: "User", email: "" }, token);
      }
      navigate("/", { replace: true });
    } else {
      // No token found — redirect to login with error
      navigate("/login?error=oauth_failed", { replace: true });
    }
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        gap: "1rem",
      }}
    >
      {/* Spinner */}
      <div
        style={{
          width: "48px",
          height: "48px",
          border: "4px solid rgba(255,255,255,0.15)",
          borderTop: "4px solid #a78bfa",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
        }}
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.7)" }}>
        Completing sign-in…
      </p>
    </div>
  );
};

export default OAuth2Callback;
