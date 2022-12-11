import React, { useContext } from "react";
import { Store } from "../store";
import { Navigate } from "react-router-dom";

function AdminRoute({ children }) {
  const { state } = useContext(Store);
  const {
    user: { userData },
  } = state;

  return userData && userData.isAdmin ? children : <Navigate to="/" />;
}

export default AdminRoute;
