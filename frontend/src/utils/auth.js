import { Navigate } from "react-router-dom";

// Protected Route component to guard authorized pages
const ProtectedRoute = ({ isAuthenticated, children }) => {
  if (!isAuthenticated) {
    // Not authenticated -> redirect to login
    return <Navigate to="/login" replace />;
  }
  return children; // Show authorized page if authenticated
};

// Public Route component to guard login/unauthorized pages
const PublicRoute = ({ isAuthenticated, children }) => {
  if (isAuthenticated) {
    // Authenticated users should not access login page
    return <Navigate to="/sidebar" replace />;
  }
  return children;
};

export {ProtectedRoute,PublicRoute}