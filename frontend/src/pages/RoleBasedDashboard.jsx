// src/pages/RoleBasedDashboard.jsx
import DashboardHomeAdmin from "./DashboardHomeAdmin";
import ManagerDashboard from "./ManagerDashboard";
import StaffDashboard from "./StaffDashboard";
import { useAuth } from "../context/AuthContext";

const RoleBasedDashboard = () => {
  const { user } = useAuth();

  if (!user) return <div>Loading dashboard...</div>;

  switch (user.role) {
    case "admin":
      return <DashboardHomeAdmin />; // ✅ shows charts page
    case "manager":
      return <ManagerDashboard />;
    case "staff":
      return <StaffDashboard />;
    default:
      return <div>Unauthorized</div>;
  }
};

export default RoleBasedDashboard;
