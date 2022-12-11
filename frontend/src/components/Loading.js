import React from "react";
import { Spinner } from "react-bootstrap";

function Loading() {
  return (
    <div className="loading d-flex justify-content-center align-items-center">
      <Spinner
        className="loading"
        animation="border"
        role="status"
        variant="primary"
      >
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  );
}

export default Loading;
