import React, { useContext, useEffect, useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Store } from "../store";
import { toast } from "react-toastify";
import { getError } from "../utilities";
import Axios from "axios";

function SigninPage() {
  const { search } = useLocation();
  const navigate = useNavigate();
  const redirectUrl = new URLSearchParams(search).get("redirect");
  const redirect = redirectUrl ? redirectUrl : "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { user } = state;

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await Axios.post("/api/user/signin", {
        email,
        password,
      });
      ctxDispatch({ type: "USER_SIGNIN", payload: data });
      localStorage.setItem("userData", JSON.stringify(data));
      navigate(redirect || "/");
    } catch (error) {
      toast.error(getError(error));
    }
  };

  useEffect(() => {
    if (user.userData) {
      navigate(redirect);
    }
  }, [navigate, redirect, user.userData]);
  return (
    <div>
      <Container className="sm-container">
        <Helmet>
          <title>Sign In</title>
        </Helmet>
        <h1 className="mb-3 text-center">Sign In</h1>
        <Form onSubmit={submitHandler}>
          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
          <div className="mb-3 d-grid">
            <Button type="submit">Sign In</Button>
          </div>
          <div className="text-primary text-center">
            <span>New Customer? </span>
            {<Link to={`/signup?redirect=${redirect}`}>Create an Account</Link>}
          </div>
        </Form>
      </Container>
    </div>
  );
}

export default SigninPage;
