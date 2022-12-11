import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Col, ListGroup, Row, Card } from "react-bootstrap";
import { Store } from "../store";
import { FaTrash } from "react-icons/fa";
import MessageBox from "./MessageBox";
import { AiOutlineClose } from "react-icons/ai";

function Cart({ openCart, setOpenCart }) {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;
  const navigate = useNavigate();

  const removeItemHandler = (item) => {
    ctxDispatch({
      type: "CART_REMOVE_ITEM",
      payload: item,
    });
  };

  const checkOutHandler = () => {
    navigate("/signin?redirect=/shipping");
  };

  return (
    <>
      <div className="close d-flex justify-content-end">
        <Button type="button" onClick={() => setOpenCart(!openCart)}>
          <AiOutlineClose />
        </Button>
      </div>
      <div>
        <h3>Your Order</h3>
      </div>
      {cartItems.length === 0 ? (
        <MessageBox variant="warning">Your cart is empty.</MessageBox>
      ) : (
        <ListGroup variant="flush" className="cart-items">
          {cartItems.map((item) => (
            <ListGroup.Item key={item._id}>
              <Row className="d-flex align-items-center">
                <Col>
                  <img
                    src={item.image}
                    alt={item.name}
                    className="img-fluid rounded image-small"
                  />
                  <Row>
                    <Link to={`/product/${item.slug}`}>{item.name}</Link>
                  </Row>
                </Col>
                <Col>x{item.quantity}</Col>
                <Col>
                  {item.discountedPrice > item.price ? (
                    `₱ ${item.discountedPrice * item.quantity}`
                  ) : item.discountedPrice < item.price ? (
                    <>
                      <Row>
                        <del>{`₱ ${(
                          item.price * item.quantity
                        ).toLocaleString()}`}</del>
                      </Row>
                      <Row>
                        <div>{` ₱ ${(
                          item.discountedPrice * item.quantity
                        ).toLocaleString()}`}</div>
                      </Row>
                    </>
                  ) : (
                    `₱ ${(item.price * item.quantity).toLocaleString()}`
                  )}
                </Col>
                <Col>
                  <Button
                    type="button"
                    variant="light"
                    onClick={() => removeItemHandler(item)}
                  >
                    <FaTrash />
                  </Button>
                </Col>
              </Row>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
      <Card className="mt-3">
        <Card.Body>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h5>
                {`Total Item: ${cartItems.reduce(
                  (a, c) => a + c.quantity,
                  0
                )} items`}
              </h5>
              <h5>{`Total Price: ₱ ${cartItems
                .reduce(
                  (a, c) =>
                    a +
                    (c.discountedPrice ? c.discountedPrice : c.price) *
                      c.quantity,
                  0
                )
                .toLocaleString()}`}</h5>
            </ListGroup.Item>
            <ListGroup.Item>
              <div className="d-grid">
                <Button
                  type="button"
                  variant="primary"
                  disabled={cartItems.length === 0}
                  onClick={() => {
                    checkOutHandler();
                    setOpenCart(!openCart);
                  }}
                >
                  Proceed to Checkout
                </Button>
              </div>
            </ListGroup.Item>
          </ListGroup>
        </Card.Body>
      </Card>
    </>
  );
}

export default Cart;
