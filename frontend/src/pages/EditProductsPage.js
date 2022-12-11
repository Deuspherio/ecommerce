import React, { useContext, useEffect, useReducer, useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { toast } from "react-toastify";
import axios from "axios";
import { getError } from "../utilities";
import { Store } from "../store";
import Loading from "../components/Loading";
import MessageBox from "../components/MessageBox";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };

    case "FETCH_SUCCESS":
      return { ...state, loading: false };

    case "FETCH_FAILED":
      return { ...state, loading: false, error: action.payload };

    case "UPDATE_REQUEST":
      return { ...state, updateLoading: true };

    case "UPDATE_SUCCESS":
      return { ...state, updateLoading: false };

    case "UPDATE_FAILED":
      return { ...state, updateLoading: false };

    default:
      return state;
  }
};

function EditProductsPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const { state } = useContext(Store);
  const {
    user: { userData },
  } = state;
  const [{ loading, error, updateLoading }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [price, setPrice] = useState(0);
  const [category, setCategory] = useState("");
  const [stocks, setStocks] = useState(0);
  const [description, setDescription] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const { data } = await axios.get(`/api/products/id/${id}`);
        setName(data.name);
        setSlug(data.slug);
        setPrice(data.price);
        setCategory(data.category);
        setStocks(data.stocks);
        setDescription(data.description);
        dispatch({ type: "FETCH_SUCCESS" });
      } catch (e) {
        dispatch({
          type: "FETCH_FAILED",
          payload: getError(e),
        });
      }
    };
    fetchData();
  }, [id]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch({ type: "UPDATE_REQUEST" });
      await axios.patch(
        `/api/products/id/${id}`,
        {
          _id: id,
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
      dispatch({
        type: "UPDATE_SUCCESS",
      });
      toast.success("Product Updated Successfully");
      navigate("/");
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: "UPDATE_FAILED" });
    }
  };

  return (
    <>
      <Helmet>
        <title>Update/Edit Product</title>
      </Helmet>
      {error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : loading ? (
        <Loading />
      ) : (
        <Container className="sm-container">
          <h1 className="mb-3 text-center">Update/Edit Product</h1>
          <Form onSubmit={submitHandler}>
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="slug">
              <Form.Label>Slug</Form.Label>
              <Form.Control
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="price">
              <Form.Label>Price</Form.Label>
              <Form.Control
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="category">
              <Form.Label>Category</Form.Label>
              <Form.Control
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="stocks">
              <Form.Label>Stocks</Form.Label>
              <Form.Control
                value={stocks}
                onChange={(e) => setStocks(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>
            <div className="d-grid">
              <Button disabled={updateLoading} type="submit">
                Update Product
              </Button>
              {updateLoading && <Loading></Loading>}
            </div>
          </Form>
        </Container>
      )}
    </>
  );
}

export default EditProductsPage;
