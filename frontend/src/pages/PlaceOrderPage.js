import React, { useContext, useEffect, useReducer } from "react";
import { Button, Card, Col, ListGroup, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { toast } from "react-toastify";
import Axios from "axios";
import { getError, roundToTwo } from "../utilities";
import { Store } from "../store";
import Loading from "../components/Loading";
import CheckoutGuide from "../components/CheckoutGuide";

const reducer = (state, action) => {
  switch (action.type) {
    case "CREATE_REQUEST":
      return { ...state, loading: true };

    case "CREATE_SUCCESS":
      return { ...state, loading: false };

    case "CREATE_FAILED":
      return { ...state, loading: false };

    default:
      return state;
  }
};

function PlaceOrderPage() {
  const [{ loading }, dispatch] = useReducer(reducer, {
    loading: false,
  });

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart,
    user: { userData, shippingAddress },
  } = state;

  cart.itemsPrice = roundToTwo(
    cart.cartItems.reduce((a, c) => a + c.quantity * c.discountedPrice, 0)
  );
  cart.shippingPrice = cart.itemsPrice > 100 ? roundToTwo(0) : roundToTwo(10);
  cart.totalPrice = cart.itemsPrice + cart.shippingPrice;
  cart.totalItems = cart.cartItems.reduce((a, c) => a + c.quantity, 0);

  const placeOrderHandler = async () => {
    try {
      dispatch({ type: "CREATE_REQUEST" });
      const { data } = await Axios.post(
        "/api/order",
        {
          totalOrderItems: cart.totalItems,
          orderItems: cart.cartItems,
          shippingAddress: shippingAddress,
          paymentMethod: cart.paymentMethod,
          itemsPrice: cart.itemsPrice,
          shippingPrice: cart.shippingPrice,
          totalPrice: cart.totalPrice,
        },
        { headers: { authorization: `Bearer ${userData.token}` } }
      );
      ctxDispatch({ type: "CART_CLEAR" });
      dispatch({ type: "CREATE_SUCCESS" });
      localStorage.removeItem("cartItems");
      toast.success(data.message);
      navigate(`/order/${data.order._id}`);
    } catch (error) {
      dispatch({ type: "CREATE_FAILED" });
      toast.error(getError(error));
    }
  };

  const navigate = useNavigate();
  useEffect(() => {
    if (!cart.paymentMethod) {
      navigate("/payment");
    }
  }, [navigate, cart.paymentMethod]);

  return (
    <div>
      <div>
        <Helmet>
          <title>Place Order</title>
        </Helmet>
        <CheckoutGuide shipping payment placeOrder />
        <h1 className="my-3">Place Order</h1>
        <Row>
          <Col md={8}>
            <Card className="mb-3">
              <Card.Body>
                <Card.Title>
                  <strong>Shipping Summary</strong>
                </Card.Title>
                <Card.Text>
                  <strong>Name:</strong>
                  {` ${shippingAddress.firstName} ${shippingAddress.lastName}`}
                  <br />
                  <strong>Email:</strong>
                  {` ${shippingAddress.email}`}
                  <br />
                  <strong>Phone Number:</strong>
                  {` ${shippingAddress.phoneNumber}`}
                  <br />
                  <strong>Address:</strong>
                  {` ${shippingAddress.address}`}
                  <br />
                  <strong>Payment Method:</strong> {cart.paymentMethod}
                </Card.Text>
                <Card.Text>
                  <strong>All Items</strong>
                </Card.Text>
                <br />
                <ListGroup variant="flush">
                  {cart.cartItems.map((item) => (
                    <ListGroup.Item key={item._id}>
                      <Row className="align-items-center">
                        <Col xs={2}>
                          <img
                            src={item.image}
                            alt={item.name}
                            className="img-fluid rounded image-small"
                          />
                        </Col>
                        <Col xs={4}>{item.name}</Col>
                        <Col xs={2}>x{item.quantity}</Col>
                        <Col xs={4}>
                          {`₱ ${(
                            item.discountedPrice * item.quantity
                          ).toLocaleString()}`}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
                <div className="text-primary">
                  <Link to="/">Edit</Link>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card>
              <Card.Body>
                <Card.Title>
                  <strong>Order Summary</strong>
                </Card.Title>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <Row>
                      <Col>Items</Col>
                      <Col>{`₱ ${cart.itemsPrice.toLocaleString()}`}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Shipping</Col>
                      <Col>{`₱ ${roundToTwo(
                        cart.shippingPrice
                      ).toLocaleString()}`}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Order Total</Col>
                      <Col>{`₱ ${roundToTwo(
                        cart.totalPrice
                      ).toLocaleString()}`}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <div className="d-grid">
                      <Button
                        type="button"
                        onClick={placeOrderHandler}
                        disabled={cart.cartItems.length === 0}
                      >
                        Place Order
                      </Button>
                    </div>
                    {loading && <Loading></Loading>}
                  </ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default PlaceOrderPage;
