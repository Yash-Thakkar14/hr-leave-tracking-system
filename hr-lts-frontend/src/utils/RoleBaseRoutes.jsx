import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

const RoleBaseRoutes = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (!user) return <Navigate to="/login" />;

  if (!requiredRole?.includes(user.role)) {
    return (
      <Navigate
        to={user.role === "admin" ? "/admin-dashboard" : "/employee-dashboard"}
      />
    );
  }

  return children;
};

export default RoleBaseRoutes;
