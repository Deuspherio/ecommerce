import React from "react";
import { Col, Row } from "react-bootstrap";
import { FaShoppingCart } from "react-icons/fa";
import { MdLocalShipping, MdPayments } from "react-icons/md";

function CheckoutGuide({ shipping, placeOrder, payment }) {
  return (
    <div>
      <Row className="text-center mb-3 checkout-guide">
        <Col
          className={
            shipping
              ? "active d-flex align-items-center justify-content-center flex-column"
              : "d-flex align-items-center justify-content-center flex-column"
          }
        >
          <div className="icons d-flex align-items-center justify-content-center">
            <FaShoppingCart />
          </div>
          <small>Contact & Shipping Address</small>
        </Col>
        <Col
          className={
            payment
              ? "active d-flex align-items-center justify-content-center flex-column"
              : "d-flex align-items-center justify-content-center flex-column"
          }
        >
          <div className="icons d-flex align-items-center justify-content-center">
            <MdPayments />
          </div>
          <small>Payment Method</small>
        </Col>
        <Col
          className={
            placeOrder
              ? "active d-flex align-items-center justify-content-center flex-column"
              : "d-flex align-items-center justify-content-center flex-column"
          }
        >
          <div className="icons d-flex align-items-center justify-content-center">
            <MdLocalShipping />
          </div>
          <small>Place Order</small>
        </Col>
      </Row>
    </div>
  );
}

export default CheckoutGuide;
