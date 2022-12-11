import React, { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Button, Container, Form, InputGroup } from "react-bootstrap";
import { Store } from "../store";
import { useNavigate } from "react-router-dom";
import CheckoutGuide from "../components/CheckoutGuide";

function ShippingPage() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    user: { userData },
  } = state;
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState(userData.firstName);
  const [lastName, setLastName] = useState(userData.lastName);
  const [email, setEmail] = useState(userData.email);
  const [phoneNumber, setPhoneNumber] = useState(userData.phoneNumber);
  const [address, setAddress] = useState(userData.address);

  useEffect(() => {
    if (!userData) {
      navigate("/signin?redirect=/shipping");
    }
  }, [navigate, userData]);

  const submitHandler = (e) => {
    e.preventDefault();
    ctxDispatch({
      type: "SAVE_SHIPPING_ADDRESS",
      payload: {
        firstName,
        lastName,
        email,
        phoneNumber,
        address,
      },
    });
    localStorage.setItem(
      "shippingAddress",
      JSON.stringify({ firstName, lastName, email, phoneNumber, address })
    );
    navigate("/payment");
  };

  return (
    <>
      <Helmet>
        <title>Contact & Shipping Address</title>
      </Helmet>
      <CheckoutGuide shipping />
      <Container className="sm-container">
        <h1 className="mb-3 text-center">Contact & Shipping Address</h1>
        <Form onSubmit={submitHandler}>
          <Form.Group className="mb-3" controlId="firstName">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your first name"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="lastName">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your last name"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter your email address"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="phoneNumber">
            <Form.Label>Phone Number</Form.Label>
            <InputGroup>
              <InputGroup.Text>+63</InputGroup.Text>
              <Form.Control
                type="tel"
                placeholder="Enter your phone number"
                required
                pattern="[0-9]{10}"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(parseInt(e.target.value))}
              />
            </InputGroup>
          </Form.Group>
          <Form.Group className="mb-3" controlId="address">
            <Form.Label>Address</Form.Label>
            <Form.Control
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              placeholder="Enter your complete address"
            ></Form.Control>
          </Form.Group>
          <div className="d-grid">
            <Button variant="primary" type="submit">
              Continue
            </Button>
          </div>
        </Form>
      </Container>
    </>
  );
}

export default ShippingPage;
