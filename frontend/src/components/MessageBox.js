import React from "react";
import { Alert } from "react-bootstrap";

function MessageBox({ variant, children }) {
  return <Alert variant={variant || "info"}>{children}</Alert>;
}

export default MessageBox;
