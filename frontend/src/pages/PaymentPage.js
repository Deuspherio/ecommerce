import React, { useContext, useEffect, useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Store } from "../store";
import { Helmet } from "react-helmet-async";
import CheckoutGuide from "../components/CheckoutGuide";

function PaymentPage() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    user: { shippingAddress },
    cart: { paymentMethod },
  } = state;

  const [paymentMethodName, setPaymentMethod] = useState(
    paymentMethod || "COD (Cash on Delivery)"
  );

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate("/shipping");
    }
  }, [navigate, shippingAddress]);

  const submitHandler = (e) => {
    e.preventDefault();
    ctxDispatch({ type: "PAYMENT_METHOD", payload: paymentMethodName });
    localStorage.setItem("paymentMethod", paymentMethodName);
    navigate("/place-order");
  };

  return (
    <>
      <Helmet>
        <title>Payment Method</title>
      </Helmet>
      <CheckoutGuide shipping payment />
      <Container className="container sm-container">
        <h1 className="text-center mb-3">Payment Method</h1>
        <Form onSubmit={submitHandler}>
          {/* <div className="mb-3">
            <Form.Check
              type="radio"
              id="Paypal"
              label="Paypal"
              value="Paypal"
              checked={paymentMethodName === "Paypal"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            ></Form.Check>
          </div> */}
          <div className="mb-3">
            <Form.Check
              type="radio"
              id="COD"
              label="COD (Cash on Delivery)"
              value="COD (Cash on Delivery)"
              checked={paymentMethodName === "COD (Cash on Delivery)"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            ></Form.Check>
          </div>
          <div className="d-grid">
            <Button type="submit">Continue</Button>
          </div>
        </Form>
      </Container>
    </>
  );
}

export default PaymentPage;
