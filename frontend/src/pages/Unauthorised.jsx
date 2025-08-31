// src/pages/Unauthorized.jsx
function Unauthorized() {
  return (
    <div style={{
      display: "flex", justifyContent: "center", alignItems: "center",
      height: "100vh", flexDirection: "column", fontFamily: "Arial, sans-serif"
    }}>
      <h1 style={{ color: "#dc3545" }}>403 - Unauthorized</h1>
      <p>You don’t have permission to view this page.</p>
      <a href="/dashboard" style={{
        marginTop: "15px",
        padding: "10px 20px",
        borderRadius: "6px",
        background: "#0d6efd",
        color: "#fff",
        textDecoration: "none"
      }}>Go Back</a>
    </div>
  );
}

export default Unauthorized;
