import React, { useContext, useReducer, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { Store } from "../store";
import { Container, Form, Button, InputGroup } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { getError } from "../utilities";
import Loading from "../components/Loading";

const reducer = (state, action) => {
  switch (action.type) {
    case "UPDATE_REQUEST":
      return { ...state, loading: true };

    case "UPDATE_SUCCESS":
      return { ...state, loading: false };

    case "UPDATE_FAILED":
      return { ...state, loading: false };

    default:
      return state;
  }
};

function UpdateUserProfilePage() {
  const [{ loading }, dispatch] = useReducer(reducer, {
    loading: false,
  });

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    user: { userData },
  } = state;
  const id = userData._id;

  const [firstName, setFirstName] = useState(userData.firstName);
  const [lastName, setLastName] = useState(userData.lastName);
  const [email, setEmail] = useState(userData.email);
  const [phoneNumber, setPhoneNumber] = useState(userData.phoneNumber);
  const [address, setAddress] = useState(userData.address);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState();

  const navigate = useNavigate();
  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords Do Not Match");
      return;
    }
    dispatch({ type: "UPDATE_REQUEST" });
    try {
      const { data } = await axios.put(
        "/api/user/update-profile",
        {
          id,
          firstName,
          lastName,
          email,
          phoneNumber,
          address,
          password,
        },
        { headers: { Authorization: `Bearer ${userData.token}` } }
      );
      dispatch({ type: "UPDATE_SUCCESS" });
      ctxDispatch({ type: "USER_SIGNIN", payload: data });
      localStorage.setItem("userData", JSON.stringify(data));
      toast.success("Updated Successfully");
      navigate("/");
    } catch (error) {
      dispatch({ type: "UPDATE_FAILED" });
      toast.error(getError(error));
    }
  };
  return (
    <Container className="sm-container">
      <Helmet>
        <title>Update Profile</title>
      </Helmet>
      <h1 className="mb-3 text-center">Update Profile</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="firstName">
          <Form.Label>First Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Update your first name"
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="lastName">
          <Form.Label>Last Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Update your last name"
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Update your email address"
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
              placeholder="Update your phone number"
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
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Update your address address"
            required
            value={address}
          ></Form.Control>
        </Form.Group>
        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Update your password"
            required
            minLength={8}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="confirmPassword">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Re enter your updated password"
            required
            minLength={8}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </Form.Group>
        <div className="d-grid">
          <Button type="submit">Update Profile</Button>
        </div>
        {loading && <Loading></Loading>}
      </Form>
    </Container>
  );
}

export default UpdateUserProfilePage;
