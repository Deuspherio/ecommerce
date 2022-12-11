import React, { useContext, useEffect, useReducer } from "react";
import { Button, Card, Col, ListGroup, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import axios from "axios";
import { getError, roundToTwo } from "../utilities";
import { Store } from "../store";
import Loading from "../components/Loading";
import MessageBox from "../components/MessageBox";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };

    case "FETCH_SUCCESS":
      return { ...state, order: action.payload, loading: false };

    case "FETCH_FAILED":
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

function OrderPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { state } = useContext(Store);
  const {
    user: { userData },
  } = state;
  const [{ loading, error, order }, dispatch] = useReducer(reducer, {
    loading: true,
    order: {},
    error: "",
  });

  useEffect(() => {
    const fetchOrder = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const { data } = await axios.get(`/api/order/id/${id}`, {
          headers: { authorization: `Bearer ${userData.token}` },
        });
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (error) {
        dispatch({ type: "FETCH_FAILED", payload: getError(error) });
      }
    };

    if (!userData) {
      return navigate("/login");
    }

    if (!order._id || (order._id && order._id !== id)) {
      fetchOrder();
    }
  }, [navigate, order._id, id, userData]);

  return loading ? (
    <Loading></Loading>
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <div>
      <Helmet>
        <title>Order Summary</title>
      </Helmet>
      <h1 className="my-3">Order Summary</h1>
      <Row>
        <Col md={8}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>
                <strong>Shipping Summary</strong>
              </Card.Title>
              <Card.Text>
                <strong>Name:</strong>
                {` ${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`}
                <br />
                <strong>Email:</strong>
                {` ${order.shippingAddress.email}`}
                <br />
                <strong>Phone Number:</strong>
                {` ${order.shippingAddress.phoneNumber}`}
                <br />
                <strong>Address:</strong>
                {` ${order.shippingAddress.address}`}
              </Card.Text>
              {order.isDelivered ? (
                <MessageBox variant="success">
                  Delivered at {order.deliveredAt.substring(0, 10)}
                </MessageBox>
              ) : (
                <MessageBox variant="danger">Not yet Delivered</MessageBox>
              )}
              <Card.Text>
                <strong>Payment Method:</strong> {order.paymentMethod}
                <br />
              </Card.Text>
              {order.isPaid ? (
                <MessageBox variant="success">
                  Paid at {order.paidAt.substring(0, 10)}
                </MessageBox>
              ) : (
                <MessageBox variant="danger">Not yet Paid</MessageBox>
              )}
              <Card.Text>
                <strong>All Items</strong>
              </Card.Text>
              <ListGroup variant="flush">
                {order.orderItems.map((item) => {
                  return (
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
                  );
                })}
              </ListGroup>
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
                    <Col>{`₱ ${order.itemsPrice.toLocaleString()}`}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Shipping</Col>
                    <Col>{`₱ ${roundToTwo(
                      order.shippingPrice
                    ).toLocaleString()}`}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Order Total</Col>
                    <Col>{`₱ ${roundToTwo(
                      order.totalPrice
                    ).toLocaleString()}`}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className="d-grid">
                    {userData.isAdmin ? (
                      <Button
                        type="button"
                        onClick={() => {
                          navigate("/admin/orders-list");
                        }}
                      >
                        View All Order History
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        onClick={() => {
                          navigate("/order-history");
                        }}
                      >
                        Your Order History
                      </Button>
                    )}
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default OrderPage;
