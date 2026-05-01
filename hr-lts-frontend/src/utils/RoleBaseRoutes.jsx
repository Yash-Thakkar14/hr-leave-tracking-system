import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

const RoleBaseRoutes = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (!user || !requiredRole?.includes(user.role)) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default RoleBaseRoutes;
