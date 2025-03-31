import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const TutorRoute = ({ children }) => {
  const { user } = useAuth();

  if (user?.role === "Tutor") return children;
  return <Navigate to="/dashboard" replace="true" />;
};

export default TutorRoute;
