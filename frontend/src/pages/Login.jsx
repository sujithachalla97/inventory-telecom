// src/pages/Login.jsx
import { useState } from "react";
import axios from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/auth/login", { email, password });

      // Save user + token in context (this also writes to localStorage)
      login(res.data.user, res.data.token);

      // ✅ Send user to dashboard root
      navigate("/dashboard");

      toast.success("Login successful ✅");
    } catch (err) {
      toast.error("Invalid credentials");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Welcome Back</h2>
        <p style={styles.subtitle}>Sign in to your TIMS account</p>
        <form onSubmit={handleLogin} style={styles.form}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />
          <button type="submit" style={styles.button}>
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
  },
  card: {
    background: "#fff",
    padding: "40px 30px",
    borderRadius: "15px",
    boxShadow: "0 15px 40px rgba(0,0,0,0.2)",
    width: "400px",
    textAlign: "center",
  },
  title: {
    marginBottom: "10px",
    color: "#333",
    fontWeight: "600",
    fontSize: "28px",
  },
  subtitle: {
    marginBottom: "30px",
    color: "#777",
    fontSize: "14px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  input: {
    padding: "12px 15px",
    marginBottom: "20px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "16px",
    outline: "none",
    transition: "0.3s",
  },
  button: {
    padding: "12px",
    border: "none",
    borderRadius: "8px",
    background: "#667eea",
    color: "#fff",
    fontSize: "16px",
    cursor: "pointer",
    fontWeight: "500",
    transition: "0.3s",
  },
};

export default Login;
