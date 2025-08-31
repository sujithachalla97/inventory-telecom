// src/pages/Home.js
import React from "react";
import { useAuth } from "../context/AuthContext"; // ✅ auth awareness
import { useNavigate } from "react-router-dom";

const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    textAlign: "center",
    background: "linear-gradient(to right, #f0f4f8, #d9e2ec)",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    padding: "80px 20px",
    animation: "fadeInDown 1s ease forwards",
  },
  h1: {
    fontSize: "3rem",
    color: "#0f213e",
    marginBottom: "20px",
  },
  p: {
    fontSize: "1.2rem",
    marginBottom: "30px",
    color: "#334e68",
  },
  button: {
    backgroundColor: "#0f213e",
    color: "white",
    padding: "12px 30px",
    borderRadius: "5px",
    textDecoration: "none",
    fontWeight: "bold",
    transition: "all 0.3s ease",
    display: "inline-block",
  },
  buttonHover: {
    backgroundColor: "#1e3a8a",
  },
  features: {
    display: "flex",
    justifyContent: "center",
    gap: "40px",
    flexWrap: "wrap",
    padding: "60px 20px",
  },
  featureCard: {
    background: "white",
    borderRadius: "12px",
    padding: "20px",
    width: "300px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
  },
  featureCardHover: {
    transform: "translateY(-10px)",
    boxShadow: "0 12px 25px rgba(0,0,0,0.15)",
  },
  featureImg: {
    width: "100px",
    height: "100px",
    marginBottom: "20px",
    borderRadius: "10px",
    objectFit: "cover",
  },
  featureH3: {
    color: "#0f213e",
    marginBottom: "10px",
  },
  featureP: {
    color: "#334e68",
    fontSize: "0.95rem",
  },
  footer: {
    marginTop: "auto",
    padding: "20px",
    backgroundColor: "#0f213e",
    color: "white",
  },
  fadeInLeft: {
    animation: "fadeInLeft 1s ease forwards",
  },
  fadeInRight: {
    animation: "fadeInRight 1s ease forwards",
  },
};

const keyframes = `
@keyframes fadeInDown {0% {opacity:0; transform:translateY(-50px);}100%{opacity:1; transform:translateY(0);}}
@keyframes fadeInLeft {0% {opacity:0; transform:translateX(-50px);}100%{opacity:1; transform:translateX(0);}}
@keyframes fadeInRight {0% {opacity:0; transform:translateX(50px);}100%{opacity:1; transform:translateX(0);}}
`;

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCTA = () => {
    if (user) navigate("/dashboard");
    else navigate("/login");
  };

  return (
    <div style={styles.container}>
      <style>{keyframes}</style>
      <header style={styles.header}>
        <h1 style={styles.h1}>Telecom Inventory Management</h1>
        <p style={styles.p}>
          Manage your telecom products, suppliers, and transactions efficiently.
        </p>
        <button
          onClick={handleCTA}
          style={styles.button}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#1e3a8a")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#0f213e")}
        >
          {user ? "Go to Dashboard" : "Get Started"}
        </button>
      </header>

      <section style={styles.features}>
        <div
          style={{ ...styles.featureCard, ...styles.fadeInLeft }}
          onMouseEnter={(e) =>
            Object.assign(e.currentTarget.style, styles.featureCardHover)
          }
          onMouseLeave={(e) =>
            Object.assign(e.currentTarget.style, styles.featureCard)
          }
        >
          <img
            src="https://images.unsplash.com/photo-1581093588401-8b9f7b0b3ff6?auto=format&fit=crop&w=100&q=80"
            alt="Internet"
            style={styles.featureImg}
          />
          <h3 style={styles.featureH3}>Internet Connectivity</h3>
          <p style={styles.featureP}>
            Keep track of all your network devices and connections seamlessly.
          </p>
        </div>

        <div
          style={{ ...styles.featureCard, ...styles.fadeInRight }}
          onMouseEnter={(e) =>
            Object.assign(e.currentTarget.style, styles.featureCardHover)
          }
          onMouseLeave={(e) =>
            Object.assign(e.currentTarget.style, styles.featureCard)
          }
        >
          <img
            src="https://images.unsplash.com/photo-1581091870620-0c0b90b616a4?auto=format&fit=crop&w=100&q=80"
            alt="Access"
            style={styles.featureImg}
          />
          <h3 style={styles.featureH3}>Secure Access</h3>
          <p style={styles.featureP}>
            Control who can access inventory data with robust role-based permissions.
          </p>
        </div>
      </section>

      <footer style={styles.footer}>
        <p>&copy; 2025 Telecom Inventory. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
