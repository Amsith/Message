import React, { ReactNode } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: ReactNode; // Type for children
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  // Access isAuthenticated state from redux
  const isAuthenticated = useSelector((state: any) => state.user.isAuthenticated);

  // Redirect to the home page if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  // Render the children if authenticated
  return <>{children}</>;
}
