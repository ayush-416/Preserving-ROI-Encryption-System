import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { generateAndStoreKeyPair } from "../utils/cryptoUtils";
import { api } from "../utils/api";

export default function Auth() {
  const [searchParams] = useSearchParams();
  const [mode, setMode] = useState(searchParams.get("mode") === "signup" ? "signup" : "login");
  const [form, setForm] = useState({ username: "", role: "user" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const m = searchParams.get("mode");
    if (m === "signup" || m === "login") setMode(m);
  }, [searchParams]);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "signup") {
        const publicKey = await generateAndStoreKeyPair(form.username);
        const res = await api.signup({ username: form.username, role: form.role, rsa_public_key: publicKey });
        if (res.detail) { setError(res.detail); return; }
        localStorage.setItem("user", JSON.stringify({ ...form, user_id: res.user_id }));
      } else {
        const res = await api.login({ username: form.username });
        if (res.detail) { setError(res.detail); return; }
        localStorage.setItem("user", JSON.stringify(res));
      }
      const user = JSON.parse(localStorage.getItem("user"));
      navigate(user.role === "admin" ? "/admin" : "/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f8fafc",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
      padding: 24,
    }}>
      <style>{`
        @keyframes fadeInUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        .auth-input {
          width: 100%; box-sizing: border-box;
          background: #fff;
          border: 1.5px solid #e2e8f0;
          border-radius: 9px;
          padding: 11px 14px;
          color: #1e293b; font-size: 14px;
          outline: none; transition: border-color 0.2s, box-shadow 0.2s;
          font-family: inherit;
        }
        .auth-input:focus { border-color: #4f46e5; box-shadow: 0 0 0 3px rgba(79,70,229,0.1); }
        .auth-input::placeholder { color: #94a3b8; }
        .auth-tab { flex:1; padding:8px 0; border-radius:7px; border:none; cursor:pointer; font-size:13px; font-weight:600; font-family:inherit; transition:all 0.2s; }
        .auth-tab.active { background:#4f46e5; color:#fff; box-shadow:0 2px 8px rgba(79,70,229,0.25); }
        .auth-tab.inactive { background:transparent; color:#94a3b8; }
        .auth-tab.inactive:hover { color:#475569; }
        .submit-btn { width:100%; padding:12px 0; border-radius:9px; border:none; font-size:14px; font-weight:700; font-family:inherit; cursor:pointer; transition:all 0.2s; }
        .submit-btn:not(:disabled) { background:#4f46e5; color:#fff; box-shadow:0 3px 12px rgba(79,70,229,0.3); }
        .submit-btn:not(:disabled):hover { background:#4338ca; box-shadow:0 5px 18px rgba(79,70,229,0.4); transform:translateY(-1px); }
        .submit-btn:disabled { background:#e2e8f0; color:#94a3b8; cursor:not-allowed; }
      `}</style>

      {/* back button */}
      <button
        onClick={() => navigate("/")}
        style={{
          position: "fixed", top: 18, left: 20,
          background: "#fff", border: "1px solid #e2e8f0",
          borderRadius: 8, padding: "7px 14px", color: "#64748b",
          cursor: "pointer", fontSize: 13, fontFamily: "inherit",
          display: "flex", alignItems: "center", gap: 5,
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)", transition: "all 0.2s",
        }}
        onMouseOver={e => { e.currentTarget.style.borderColor = "#94a3b8"; e.currentTarget.style.color = "#1e293b"; }}
        onMouseOut={e => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.color = "#64748b"; }}
      >
        ← Back
      </button>

      <div style={{
        width: "100%", maxWidth: 400,
        background: "#fff",
        border: "1px solid #e2e8f0",
        borderRadius: 20, padding: "36px 32px 32px",
        boxShadow: "0 4px 32px rgba(0,0,0,0.08)",
        animation: "fadeInUp 0.45s ease both",
      }}>
        {/* logo */}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 13,
            background: "linear-gradient(135deg,#4f46e5,#818cf8)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 24, margin: "0 auto 10px",
            boxShadow: "0 4px 14px rgba(79,70,229,0.3)",
          }}>🔐</div>
          <div style={{ fontWeight: 800, fontSize: 19, color: "#1e293b" }}>
            ROI<span style={{ color: "#4f46e5" }}>Vault</span>
          </div>
          <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 3 }}>
            {mode === "login" ? "Sign in to your account" : "Create a new account"}
          </div>
        </div>

        {/* tab switcher */}
        <div style={{
          display: "flex", gap: 4,
          background: "#f1f5f9", border: "1px solid #e2e8f0",
          borderRadius: 10, padding: 4, marginBottom: 24,
        }}>
          {["login", "signup"].map((m) => (
            <button
              key={m}
              className={`auth-tab ${mode === m ? "active" : "inactive"}`}
              onClick={() => { setMode(m); setError(""); }}
            >
              {m === "login" ? "Login" : "Sign Up"}
            </button>
          ))}
        </div>

        {/* error */}
        {error && (
          <div style={{
            background: "#fef2f2", border: "1px solid #fecaca",
            borderRadius: 9, padding: "10px 14px", marginBottom: 16,
            color: "#dc2626", fontSize: 13, display: "flex", gap: 8, alignItems: "flex-start",
          }}>
            <span>⚠️</span> {error}
          </div>
        )}

        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={{ fontSize: 12, color: "#475569", fontWeight: 600, display: "block", marginBottom: 6 }}>
              Username
            </label>
            <input
              className="auth-input"
              name="username" placeholder="Enter your username"
              value={form.username} onChange={handle} required
              autoComplete="username"
            />
          </div>

          {mode === "signup" && (
            <div>
              <label style={{ fontSize: 12, color: "#475569", fontWeight: 600, display: "block", marginBottom: 6 }}>
                Role
              </label>
              <select className="auth-input" name="role" value={form.role} onChange={handle}>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          )}

          <button type="submit" className="submit-btn" disabled={loading} style={{ marginTop: 4 }}>
            {loading ? "Please wait…" : mode === "login" ? "Sign In" : "Create Account"}
          </button>
        </form>

        {mode === "signup" && (
          <div style={{
            marginTop: 18, padding: "12px 14px",
            background: "#eef2ff", border: "1px solid #c7d2fe",
            borderRadius: 10,
          }}>
            <div style={{ fontSize: 12, color: "#4f46e5", fontWeight: 700, marginBottom: 4 }}>
              🔑 RSA Key Generation
            </div>
            <div style={{ fontSize: 12, color: "#6366f1", lineHeight: 1.6 }}>
              An RSA-2048 key pair will be generated in your browser.
              Your <strong>private key never leaves this device</strong>.
            </div>
          </div>
        )}

        <div style={{ textAlign: "center", marginTop: 20 }}>
          <span style={{ fontSize: 13, color: "#94a3b8" }}>
            {mode === "login" ? "Don't have an account? " : "Already have an account? "}
          </span>
          <span
            style={{ fontSize: 13, color: "#4f46e5", fontWeight: 600, cursor: "pointer" }}
            onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); }}
          >
            {mode === "login" ? "Sign up" : "Sign in"}
          </span>
        </div>
      </div>
    </div>
  );
}
