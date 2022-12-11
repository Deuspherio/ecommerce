import React, { useContext, useEffect, useReducer, useState } from "react";
import Loading from "../components/Loading";
import MessageBox from "../components/MessageBox";
import { useNavigate, useParams } from "react-router-dom";
import {
  Badge,
  Button,
  Card,
  Col,
  Form,
  ListGroup,
  Row,
} from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import axios from "axios";
import { getError, roundToTwo } from "../utilities";
import Rating from "../components/Rating";
import { toast } from "react-toastify";
import { Store } from "../store";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

const reducer = (state, action) => {
  switch (action.type) {
    case "REFRESH_PRODUCT":
      return { ...state, reviewSuccess: false };

    case "CREATE_REQUEST":
      return { ...state, reviewLoading: true, reviewSuccess: false };

    case "CREATE_SUCCESS":
      return { ...state, reviewLoading: false, reviewSuccess: true };

    case "CREATE_FAILED":
      return { ...state, reviewLoading: false };

    default:
      return state;
  }
};

const fetchProduct = async (slug) => {
  try {
    const { data } = await axios.get(`/api/products/slug/${slug}`);
    return data;
  } catch (err) {
    console.log(err);
  }
};

function ProductPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const {
    isLoading,
    isError,
    data: product,
    error,
  } = useQuery(["product"], () => fetchProduct(slug), {
    refetchInterval: 5000,
  });
  const [{ reviewLoading, reviewSuccess }, dispatch] = useReducer(reducer, {});

  useEffect(() => {
    if (reviewSuccess) {
      dispatch({ type: "REFRESH_PRODUCT" });
    }
  }, [reviewSuccess]);

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart,
    user: { userData },
  } = state;

  const [qty, setQty] = useState(1);
  const addToCartHandler = async () => {
    const existItem = cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + qty : qty;
    const { data } = await axios.get(`/api/products/id/${product._id}`);
    if (data.stocks < quantity) {
      toast.error("Order Limit Reached");
      return;
    }
    ctxDispatch({
      type: "CART_ADD_ITEM",
      payload: { ...product, quantity },
    });
    navigate("/");
  };

  const [rating, setRating] = useState(0);
  const [comments, setComments] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!rating) {
      toast.error("Please Enter Rating");
      return;
    }
    dispatch({
      type: "CREATE_REQUEST",
    });
    try {
      await axios.post(
        `/api/products/reviews/id/${product._id}`,
        {
          rating,
          comments,
        },
        {
          headers: { Authorization: `Bearer ${userData.token}` },
        }
      );

      dispatch({
        type: "CREATE_SUCCESS",
      });
      toast.success("Reviewed Succesfully");
      window.location.reload();
    } catch (error) {
      toast.error(getError(error));
      dispatch({ type: "CREATE_FAILED" });
    }
  };
  return (
    <>
      {isLoading ? (
        <Loading />
      ) : isError ? (
        <MessageBox variant="danger">{error.message}</MessageBox>
      ) : (
        <>
          <Helmet>
            <title>{product.name}</title>
          </Helmet>
          <h1 className="text-capitalize">{product.name}</h1>
          <div className="py-3 px-2 product-page">
            <Row>
              <Col md={6} lg={4} className="mb-3">
                <Card className="py-3 px-2">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="image-large"
                  />
                  {product.discountedPrice < product.price &&
                    product.stocks > 0 && (
                      <div className="d-flex">
                        <h4 className="sale d-flex justify-content-center align-items-center">
                          Sale
                        </h4>
                        <h4 className="discount d-flex justify-content-center align-items-center">
                          {`${roundToTwo(
                            (100 * (product.price - product.discountedPrice)) /
                              product.price
                          )}%`}
                        </h4>
                      </div>
                    )}
                  <ListGroup variant="flush" className="mb-3">
                    <ListGroup.Item>
                      <h3 className="text-center">{product.name}</h3>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <Row>
                        <Col className="border-end border-1 border-dark text-center">
                          {product.rating > 0 ? (
                            <Rating rating={product.rating}></Rating>
                          ) : (
                            "Not yet Rated"
                          )}
                        </Col>
                        <Col className="text-center">{`${
                          product.totalSoldItems ? product.totalSoldItems : 0
                        } sold`}</Col>
                      </Row>
                    </ListGroup.Item>
                  </ListGroup>
                  <Card className="product-card-item">
                    <Card.Body>
                      <ListGroup variant="flush">
                        {product.stocks > 2 && (
                          <ListGroup.Item className="product-list-item">
                            <Row>
                              <Col>Price:</Col>
                              <Col>
                                {product.discountedPrice > product.price ? (
                                  `₱ ${product.discountedPrice}`
                                ) : product.discountedPrice < product.price ? (
                                  <>
                                    <del>{`₱ ${product.price}`}</del>
                                    {` ₱ ${product.discountedPrice}`}
                                  </>
                                ) : (
                                  ` ₱ ${product.price}`
                                )}
                              </Col>
                            </Row>
                          </ListGroup.Item>
                        )}
                        {product.stocks > 0 && (
                          <ListGroup.Item>
                            <Row className="align-items-center">
                              <Col>Quantity: </Col>
                              <Col>
                                <Form.Select
                                  value={qty}
                                  onChange={(e) =>
                                    setQty(parseInt(e.target.value))
                                  }
                                >
                                  {[...Array(product.stocks).keys()].map(
                                    (stock) => (
                                      <option value={stock + 1} key={stock + 1}>
                                        {stock + 1}
                                      </option>
                                    )
                                  )}
                                </Form.Select>
                              </Col>
                            </Row>
                          </ListGroup.Item>
                        )}
                        <ListGroup.Item>
                          <Row>
                            <Col>Status: </Col>
                            <Col>
                              {product.stocks > 0 ? (
                                <Badge bg="success">Available</Badge>
                              ) : (
                                <Badge bg="danger">Out of Stock</Badge>
                              )}
                            </Col>
                          </Row>
                        </ListGroup.Item>
                        {product.stocks > 0 && (
                          <ListGroup.Item>
                            <div className="d-grid">
                              <Button
                                variant="primary"
                                onClick={addToCartHandler}
                              >
                                Add to Cart
                              </Button>
                            </div>
                          </ListGroup.Item>
                        )}
                      </ListGroup>
                    </Card.Body>
                  </Card>
                </Card>
              </Col>
              <Col md={6} lg={4} className="mb-3">
                <Card className="py-3 px-2">
                  <h4> Customers' Reviews</h4>
                  <small className="text-end">
                    {product.numReviews < 2
                      ? product.numReviews + " review"
                      : product.numReviews + " reviews"}
                  </small>
                  <ListGroup variant="flush">
                    {product.reviews && product.reviews.length === 0 ? (
                      <MessageBox>There is no review</MessageBox>
                    ) : (
                      product.reviews
                        .slice(0)
                        .reverse()
                        .map((review) => (
                          <ListGroup.Item key={review._id}>
                            <Row>
                              <Col>
                                <strong>
                                  {`${review.firstName} ${review.lastName}`}
                                </strong>
                              </Col>
                              <Col>{review.createdAt.substring(0, 10)}</Col>
                            </Row>
                            <Rating rating={review.rating}></Rating>
                            <p>{review.comments}</p>
                          </ListGroup.Item>
                        ))
                    )}
                  </ListGroup>
                </Card>
              </Col>
              <Col md={6} lg={4} className="mb-3">
                <Card className="py-3 px-2">
                  <>
                    {userData ? (
                      <Form onSubmit={submitHandler}>
                        <h4 className="text-center">Rate our {product.name}</h4>
                        <Form.Group className="mb-3" controlId="rating">
                          <Form.Label>Your Rating</Form.Label>
                          <Form.Select
                            aria-label="Rating"
                            value={rating}
                            required
                            onChange={(e) =>
                              setRating(parseInt(e.target.value))
                            }
                          >
                            <option value="">Select Your Rating</option>
                            <option value={parseInt(1)}>1 - Poor</option>
                            <option value={parseInt(2)}>2 - Fair</option>
                            <option value={parseInt(3)}>3 - Good</option>
                            <option value={parseInt(4)}>4 - Very good</option>
                            <option value={parseInt(5)}>5 - Excelent</option>
                          </Form.Select>
                        </Form.Group>
                        <Form.Group
                          controlId="comments"
                          label="Your comments"
                          className="mb-3"
                        >
                          <Form.Label>Your Comments</Form.Label>
                          <Form.Control
                            as="textarea"
                            placeholder="Leave a comment here"
                            value={comments}
                            onChange={(e) => setComments(e.target.value)}
                          />
                        </Form.Group>
                        <div className="d-grid">
                          <Button disabled={reviewLoading} type="submit">
                            Submit
                          </Button>
                          {reviewLoading && <Loading></Loading>}
                        </div>
                      </Form>
                    ) : (
                      <MessageBox>
                        Please&nbsp;
                        <Link to={`/signin?redirect=/product/${product.slug}`}>
                          Sign In
                        </Link>
                        &nbsp;to write a review
                      </MessageBox>
                    )}
                  </>
                </Card>
              </Col>
            </Row>
          </div>
        </>
      )}
    </>
  );
}

export default ProductPage;
