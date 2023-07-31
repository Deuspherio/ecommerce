import React, { useContext } from "react";
import { Store } from "../context";
import { Navigate } from "react-router-dom";

const CustomerRoute = ({ children }) => {
  const { state } = useContext(Store);
  const {
    user: { userData },
  } = state;
  return (
    <>
      {userData && userData.isAdmin ? (
        <Navigate to="/admin/dashboard" />
      ) : (
        children
      )}
    </>
  );
};

export default CustomerRoute;
