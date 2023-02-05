import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { Store } from "../context";

function ProtectedRoute({ children }) {
  const { state } = useContext(Store);
  const {
    user: { userData },
  } = state;

  return userData ? children : <Navigate to="/" />;
}

export default ProtectedRoute;
