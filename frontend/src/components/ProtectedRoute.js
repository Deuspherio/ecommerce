import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { Store } from "../store";

function ProtectedRoute({ children }) {
  const { state } = useContext(Store);
  const {
    user: { userData },
  } = state;

  return userData ? children : <Navigate to="/signin" />;
}

export default ProtectedRoute;
