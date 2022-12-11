import React, { useContext, useEffect, useReducer, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Button, Container, Form, InputGroup } from "react-bootstrap";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { Store } from "../store";
import { getError } from "../utilities";
import Loading from "../components/Loading";
import MessageBox from "../components/MessageBox";
import axios from "axios";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };

    case "FETCH_SUCCESS":
      return { ...state, loading: false };

    case "FETCH_FAILED":
      return { ...state, loading: false, error: action.payload };

    case "UPDATE_REQUEST":
      return { ...state, loadingUpdate: true };

    case "UPDATE_SUCCESS":
      return { ...state, loadingUpdate: false };

    case "UPDATE_FAILED":
      return { ...state, loadingUpdate: false };

    default:
      return state;
  }
};

function EditUserPage() {
  const [{ loading, error, loadingUpdate }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  const { state } = useContext(Store);
  const {
    user: { userData },
  } = state;

  const { id } = useParams();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`/api/user/id/${id}`, {
          headers: { Authorization: `Bearer ${userData.token}` },
        });
        setFirstName(data.firstName);
        setLastName(data.lastName);
        setPhoneNumber(data.phoneNumber);
        setAddress(data.address);
        dispatch({ type: "FETCH_SUCCESS" });
      } catch (e) {
        dispatch({
          type: "FETCH_FAILED",
          payload: getError(e),
        });
      }
    };
    fetchData();
  }, [id, userData]);

  const submitHandler = async (e) => {
    e.preventDefault();
    dispatch({ type: "UPDATE_REQUEST" });
    try {
      await axios.put(
        `/api/user/id/${id}`,
        { _id: id, phoneNumber, address },
        {
          headers: { Authorization: `Bearer ${userData.token}` },
        }
      );
      dispatch({
        type: "UPDATE_SUCCESS",
      });
      toast.success("User updated successfully");
      navigate("/admin/users-list");
    } catch (error) {
      toast.error(getError(error));
      dispatch({ type: "UPDATE_FAILED" });
    }
  };
  return (
    <>
      <Helmet>
        <title>{`Update/Edit User ${firstName} ${lastName}`}</title>
      </Helmet>
      {loading ? (
        <Loading />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <Container className="sm-container">
          <h1 className="text-center mb-3">
            Update/Edit User {firstName} {lastName}
          </h1>
          <Form onSubmit={submitHandler}>
            <Form.Group className="mb-3" controlId="phoneNumber">
              <Form.Label>Phone Number</Form.Label>
              <InputGroup>
                <InputGroup.Text>+63</InputGroup.Text>
                <Form.Control
                  type="tel"
                  placeholder="Enter user phone number"
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
                type="text"
                placeholder="Enter user complete address"
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </Form.Group>
            <div className="d-grid">
              <Button disabled={loadingUpdate} type="submit">
                Update User
              </Button>
              {loadingUpdate && <Loading />}
            </div>
          </Form>
        </Container>
      )}
    </>
  );
}

export default EditUserPage;
