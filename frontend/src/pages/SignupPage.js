import React, { useContext, useEffect, useState } from "react";
import Axios from "axios";
import { Container, Form, Button, InputGroup } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Store } from "../store";
import { getError } from "../utilities";

function SignupPage() {
  const { search } = useLocation();
  const navigate = useNavigate();
  const redirectInUrl = new URLSearchParams(search).get("redirect");
  const redirect = redirectInUrl ? redirectInUrl : "/";

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState();
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { user } = state;

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      const { data } = await Axios.post("/api/user/signup", {
        firstName,
        lastName,
        email,
        phoneNumber,
        address,
        password,
      });
      ctxDispatch({ type: "USER_SIGNIN", payload: data });
      localStorage.setItem("userData", JSON.stringify(data));
      navigate(redirect || "/");
    } catch (err) {
      toast.error(getError(err));
    }
  };

  useEffect(() => {
    if (user.userData) {
      navigate(redirect);
    }
  }, [navigate, redirect, user.userData]);

  return (
    <Container className="sm-container">
      <Helmet>
        <title>Sign Up</title>
      </Helmet>
      <h1 className="mb-3 text-center">Sign Up</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="firstName">
          <Form.Label>First Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter your first name"
            required
            onChange={(e) => setFirstName(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="lastName">
          <Form.Label>Last Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter your last name"
            required
            onChange={(e) => setLastName(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter your email address"
            required
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
              onChange={(e) => setPhoneNumber(parseInt(e.target.value))}
            />
          </InputGroup>
        </Form.Group>
        <Form.Group className="mb-3" controlId="address">
          <Form.Label>Address</Form.Label>
          <Form.Control
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter your address"
            required
          ></Form.Control>
        </Form.Group>
        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter your password"
            required
            minLength={8}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="confirmPassword">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Re enter your password"
            required
            minLength={8}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </Form.Group>
        <div className="mb-3 d-grid text-center">
          <Button type="submit">Sign Up</Button>
        </div>
        <div className="text-primary text-center">
          <span>Already have an Account? </span>
          <Link to={`/signin?redirect=${redirect}`}>Sign in</Link>
        </div>
      </Form>
    </Container>
  );
}

export default SignupPage;
