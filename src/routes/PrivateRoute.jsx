import { Navigate, useLocation } from "react-router-dom";
import LoadingSpinner from "../components/Shared/LoadingSpinner";
import useAuth from "../hooks/useAuth";

const routeAccessRole = {
  "/dashboard/booked_session": "Student",
};

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  // console.log(location);

  if (loading) return <LoadingSpinner></LoadingSpinner>;
  if (
    routeAccessRole[location.pathname] &&
    routeAccessRole[location.pathname] !== user?.role
  )
    return <Navigate to="/not-found" replace />;

  if (user) return children;
  return <Navigate to="/sign_in" state={{ from: location }} replace />;
};

export default PrivateRoute;
