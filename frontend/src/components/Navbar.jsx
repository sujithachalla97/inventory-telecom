// src/components/Navbar.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // clear context + token
    navigate("/login");
  };

  const styles = {
    navbar: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "12px 30px",
      backgroundColor: "#0f213e",
      color: "#fff",
      boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
      position: "sticky",
      top: 0,
      zIndex: 1000,
    },
    brand: {
      fontSize: "1.8rem",
      fontWeight: "bold",
      color: "#fff",
      textDecoration: "none",
    },
    button: {
      backgroundColor: "#1ac8db",
      border: "none",
      padding: "8px 18px",
      borderRadius: "5px",
      color: "#fff",
      cursor: "pointer",
      fontWeight: "bold",
      textDecoration: "none",
      transition: "background 0.3s ease",
    },
    buttonHover: {
      backgroundColor: "#1490a0",
    },
  };

  return (
    <nav style={styles.navbar}>
      <Link to="/" style={styles.brand}>
        TIMS
      </Link>

      {token ? (
        <button
          style={styles.button}
          onClick={handleLogout}
          onMouseOver={(e) =>
            (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)
          }
          onMouseOut={(e) =>
            (e.target.style.backgroundColor = styles.button.backgroundColor)
          }
        >
          Logout {user?.name ? `(${user.name})` : ""}
        </button>
      ) : (
        <Link
          to="/login"
          style={styles.button}
          onMouseOver={(e) =>
            (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)
          }
          onMouseOut={(e) =>
            (e.target.style.backgroundColor = styles.button.backgroundColor)
          }
        >
          Login
        </Link>
      )}
    </nav>
  );
};

export default Navbar;
