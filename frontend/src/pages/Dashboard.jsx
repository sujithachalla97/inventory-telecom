// src/pages/DashboardLayout.jsx
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "../api/axiosInstance";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

function DashboardLayout() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const [profile, setProfile] = useState({ name: "", email: "", password: "" });

  // role & username handling
  const role = user?.role || localStorage.getItem("role") || "";
  const userName = profile.name || user?.name || "User";

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Fetch profile when modal opens
  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) return;
      try {
        const res = await axios.get("/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile({ name: res.data.name, email: res.data.email, password: "" });
      } catch (err) {
        toast.error("Failed to fetch profile");
      }
    };
    if (showProfile) fetchProfile();
  }, [showProfile, token]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        "/users/me",
        profile,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Profile updated ✅");
      setShowProfile(false);
    } catch (err) {
      toast.error("Failed to update profile");
    }
  };

  // Sidebar links configuration
const links = {
  admin: [
    { to: "/dashboard", label: "🏠 Dashboard" },   // <-- added
    { to: "/dashboard/products", label: "📦 Products" },
    { to: "/dashboard/suppliers", label: "🤝 Suppliers" },
    { to: "/dashboard/transactions", label: "📊 Transactions" },
    { to: "/dashboard/alerts", label: "⚠️ Alerts" },
    {
      label: "👥 Users",
      nested: [
        { to: "/dashboard/managers", label: "Managers" },
        { to: "/dashboard/staff", label: "Staff" },
      ],
    },
  ],
  manager: [
    { to: "/dashboard", label: "🏠 Dashboard" },   // <-- added
    { to: "/dashboard/products", label: "📦 Products" },
    { to: "/dashboard/suppliers", label: "🤝 Suppliers" },
    { to: "/dashboard/transactions", label: "📊 Transactions" },
    { to: "/dashboard/alerts", label: "⚠️ Alerts" },
  ],
  staff: [
    { to: "/dashboard", label: "🏠 Dashboard" },   // <-- added
    { to: "/dashboard/transactions", label: "📊 Transactions" },
    { to: "/dashboard/alerts", label: "⚠️ Alerts" },
  ],
};


  // Styles
  const styles = {
    container: { display: "flex", minHeight: "100vh", fontFamily: "Arial, sans-serif" },
    sidebar: { width: "220px", background: "#2c3e50", color: "#ecf0f1", padding: "20px", display: "flex", flexDirection: "column", gap: "10px", boxShadow: "2px 0 5px rgba(0,0,0,0.1)", flexShrink: 0 },
    logo: { fontSize: "1.5rem", fontWeight: "bold", marginBottom: "30px" },
    navLink: { padding: "10px 15px", borderRadius: "6px", textDecoration: "none", color: "#ecf0f1", display: "flex", alignItems: "center", gap: "8px", transition: "all 0.2s" },
    content: { flexGrow: 1, display: "flex", flexDirection: "column", background: "#ecf0f1", minHeight: "100vh" },
    topbar: { background: "#fff", padding: "12px 20px", borderBottom: "1px solid #ddd", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 2px 4px rgba(0,0,0,0.05)", zIndex: 1 },
    logoutBtn: { background: "#e74c3c", color: "white", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", transition: "all 0.2s" },
    pageContent: { padding: "20px", flexGrow: 1 },
    nestedList: { listStyle: "none", paddingLeft: "10px", display: "flex", flexDirection: "column", gap: "6px" },
  };

  const activeLinkStyle = { background: "#1abc9c", fontWeight: "bold" };

  // Function to render sidebar links recursively
  const renderLinks = (items) => (
    <ul style={{ padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "10px" }}>
      {items.map((item, idx) => (
        <li key={idx}>
          {item.to ? (
            <NavLink to={item.to} style={({ isActive }) => ({ ...styles.navLink, ...(isActive ? activeLinkStyle : {}) })}>
              {item.label}
            </NavLink>
          ) : (
            <>
              <span style={{ fontWeight: "bold", padding: "10px 15px", display: "block" }}>{item.label}</span>
              {item.nested && renderLinks(item.nested)}
            </>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <div style={styles.logo}>TIMS</div>
        {renderLinks(links[role] || [{ to: "/dashboard", label: "🏠 Dashboard" }])}
      </div>

      {/* Main Content */}
      <div style={styles.content}>
        <div style={styles.topbar}>
          <span>
            Welcome, <strong>{userName} ({role?.toUpperCase()})</strong>
          </span>
          <div style={{ display: "flex", gap: "10px" }}>
            <button style={{ ...styles.logoutBtn, background: "#3498db" }} onClick={() => setShowProfile(true)}>Profile</button>
            <button
              style={styles.logoutBtn}
              onMouseOver={(e) => (e.target.style.background = "#c0392b")}
              onMouseOut={(e) => (e.target.style.background = "#e74c3c")}
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
        <div style={styles.pageContent}>
          <Outlet />
        </div>
      </div>

      {/* Profile Modal */}
      {showProfile && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 999 }}>
          <div style={{ background: "#fff", padding: "20px", borderRadius: "12px", width: "400px" }}>
            <h3>Update Profile</h3>
            <form onSubmit={handleProfileUpdate}>
              <input type="text" placeholder="Name" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} style={{ width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "6px", border: "1px solid #ccc" }} required />
              <input type="email" placeholder="Email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} style={{ width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "6px", border: "1px solid #ccc" }} required />
              <input type="password" placeholder="New Password" value={profile.password} onChange={(e) => setProfile({ ...profile, password: e.target.value })} style={{ width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "6px", border: "1px solid #ccc" }} />
              <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
                <button type="submit" style={{ flex: 1, padding: "10px", borderRadius: "6px", border: "none", background: "#28a745", color: "#fff", cursor: "pointer" }}>Update</button>
                <button type="button" onClick={() => setShowProfile(false)} style={{ flex: 1, padding: "10px", borderRadius: "6px", border: "none", background: "#dc3545", color: "#fff", cursor: "pointer" }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardLayout;
