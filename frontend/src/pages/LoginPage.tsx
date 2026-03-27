import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await loginUser(email, password);

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("email", data.email || email);
      localStorage.setItem("username", data.username ?? "User");

      if (data.role === "ADMIN") {
        navigate("/admin/dashboard");
      } else {
        navigate("/user");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      backgroundColor: "#f0f2f5",
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <div style={{
        width: "100%",
        maxWidth: "400px",
        backgroundColor: "#fff",
        borderRadius: "20px",
        padding: "40px 36px",
        boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
      }}>
        {/* Brand mark */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{
            width: "44px", height: "44px",
            backgroundColor: "#0f2c5c",
            borderRadius: "12px",
            marginBottom: "20px",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="6" width="18" height="13" rx="2" stroke="#fff" strokeWidth="2"/>
              <path d="M3 10h18" stroke="#fff" strokeWidth="2"/>
              <path d="M8 3v3M16 3v3" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <h1 style={{ fontSize: "24px", fontWeight: 800, color: "#0f172a", margin: "0 0 4px" }}>
            Welcome 
          </h1>
          <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>
            Sign in to your workspace
          </p>
        </div>

        <form onSubmit={handleLogin}>
          {/* Email */}
          <div style={{ marginBottom: "18px" }}>
            <label style={{
              display: "block",
              fontSize: "13px", fontWeight: 600,
              color: "#475569", marginBottom: "8px",
            }}>
              Email address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              required
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: "10px",
                border: "1px solid #e2e8f0",
                fontSize: "14px",
                color: "#0f172a",
                backgroundColor: "#f8fafc",
                outline: "none",
                boxSizing: "border-box",
                transition: "border-color 0.2s",
              }}
              onFocus={e => e.target.style.borderColor = "#0f2c5c"}
              onBlur={e => e.target.style.borderColor = "#e2e8f0"}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: "28px" }}>
            <label style={{
              display: "block",
              fontSize: "13px", fontWeight: 600,
              color: "#475569", marginBottom: "8px",
            }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: "10px",
                border: "1px solid #e2e8f0",
                fontSize: "14px",
                color: "#0f172a",
                backgroundColor: "#f8fafc",
                outline: "none",
                boxSizing: "border-box",
                transition: "border-color 0.2s",
              }}
              onFocus={e => e.target.style.borderColor = "#0f2c5c"}
              onBlur={e => e.target.style.borderColor = "#e2e8f0"}
            />
          </div>

          {/* Error */}
          {error && (
            <div style={{
              padding: "12px 16px",
              borderRadius: "10px",
              backgroundColor: "#fee2e2",
              color: "#dc2626",
              fontSize: "14px",
              fontWeight: 500,
              marginBottom: "20px",
            }}>
              ✕ {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "10px",
              border: "none",
              backgroundColor: "#0f2c5c",
              color: "#fff",
              fontSize: "15px",
              fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
              transition: "opacity 0.2s",
            }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}