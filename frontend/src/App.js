// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider, useAuth } from "./context/AuthContext";

// layouts & components
import DashboardLayout from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleProtectedRoute from "./components/RoleProtectedRoute";

// pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Products from "./pages/Products";
import Suppliers from "./pages/Suppliers";
import Transactions from "./pages/Transactions";
import Alerts from "./pages/Alerts";
import Managers from "./pages/Managers";
import Staff from "./pages/Staff";
import RoleBasedDashboard from "./pages/RoleBasedDashboard";
import Unauthorized from "./pages/Unauthorised";

function AppContent() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        fontSize: "20px",
        fontWeight: "600",
        color: "#667eea",
      }}>
        Loading...
      </div>
    );
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />

      {/* Protected Dashboard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<RoleBasedDashboard />} />
        <Route
          path="products"
          element={
            <RoleProtectedRoute allowedRoles={["admin", "manager"]}>
              <Products />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="suppliers"
          element={
            <RoleProtectedRoute allowedRoles={["admin", "manager"]}>
              <Suppliers />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="transactions"
          element={
            <RoleProtectedRoute allowedRoles={["admin", "manager", "staff"]}>
              <Transactions />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="managers"
          element={
            <RoleProtectedRoute allowedRoles={["admin"]}>
              <Managers />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="staff"
          element={
            <RoleProtectedRoute allowedRoles={["admin"]}>
              <Staff />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="alerts"
          element={
            <RoleProtectedRoute allowedRoles={["admin", "manager", "staff"]}>
              <Alerts />
            </RoleProtectedRoute>
          }
        />
      </Route>

      {/* Unauthorized */}
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ToastContainer position="top-right" autoClose={3000} />
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
