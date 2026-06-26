import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, role }) {
  const providerToken = localStorage.getItem("providerToken");
  const residentToken = localStorage.getItem("residentToken");

  if (role === "provider" && !providerToken) {
    return <Navigate to="/provider-login" />;
  }

  if (role === "resident" && !residentToken) {
    return <Navigate to="/resident-login" />;
  }

  return children;
}
