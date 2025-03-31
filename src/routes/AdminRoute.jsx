import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const AdminRoute = ({ children }) => {
  const { user } = useAuth();

  if (user?.role === "Admin") return children;
  return <Navigate to="/dashboard" replace="true" />;
};

export default AdminRoute;
