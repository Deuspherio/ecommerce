import React, { useContext, useReducer, useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Loading from "../components/Loading";
import MessageBox from "../components/MessageBox";
import { getError } from "../utilities";
import axios from "axios";
import { Store } from "../store";

const reducer = (state, action) => {
  switch (action.type) {
    case "CREATE_REQUEST":
      return { ...state, loading: true };

    case "CREATE_SUCCESS":
      return {
        ...state,
        loading: false,
      };

    case "CREATE_FAILED":
      return { ...state, loading: false };

    default:
      return state;
  }
};

function CreateProductPage() {
  const [{ error, loading }, dispatch] = useReducer(reducer, {
    loading: false,
    error: "",
  });
  const { state } = useContext(Store);
  const {
    user: { userData },
  } = state;

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [price, setPrice] = useState(0);
  const [category, setCategory] = useState("");
  const [stocks, setStocks] = useState(0);
  const [description, setDescription] = useState("");

  const navigate = useNavigate();

  const createHandler = async (e) => {
    e.preventDefault();
    dispatch({ type: "CREATE_REQUEST" });
    try {
      await axios.post(
        "/api/products/create-product",
        {
          name,
          slug,
          price,
          category,
          stocks,
          description,
        },
        {
          headers: { Authorization: `Bearer ${userData.token}` },
        }
      );
      dispatch({ type: "CREATE_SUCCESS" });
      toast.success("Product Created Successfully");
      navigate("/admin/products-list");
    } catch (err) {
      toast.error(getError(err));
      dispatch({
        type: "CREATE_FAILED",
      });
    }
  };
  return (
    <>
      <Helmet>
        <title>Create Product</title>
      </Helmet>
      {error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <Container className="sm-container">
          <h1 className="mb-3 text-center">Create Product</h1>
          <Form onSubmit={createHandler}>
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="slug">
              <Form.Label>Slug</Form.Label>
              <Form.Control
                onChange={(e) => setSlug(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="price">
              <Form.Label>Price</Form.Label>
              <Form.Control
                onChange={(e) => setPrice(parseInt(e.target.value))}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="category">
              <Form.Label>Category</Form.Label>
              <Form.Control
                onChange={(e) => setCategory(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="stocks">
              <Form.Label>Stocks</Form.Label>
              <Form.Control
                onChange={(e) => setStocks(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control onChange={(e) => setDescription(e.target.value)} />
            </Form.Group>
            <div className="d-grid">
              <Button type="submit">Create Product</Button>
              {loading && <Loading />}
            </div>
          </Form>
        </Container>
      )}
    </>
  );
}

export default CreateProductPage;
