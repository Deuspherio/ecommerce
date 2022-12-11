import React, { useContext, useState } from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import Rating from "./Rating";
import { Store } from "../store";
import axios from "axios";
import { toast } from "react-toastify";
import { roundToTwo } from "../utilities";
import { LinkContainer } from "react-router-bootstrap";
import { Link } from "react-router-dom";

function Product({ product }) {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
    user: { userData },
  } = state;

  const [qty, setQty] = useState(1);

  const addToCartHandler = async (item) => {
    const existItem = cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + qty : qty;
    const { data } = await axios.get(`/api/products/id/${item._id}`);
    if (data.stocks < quantity) {
      toast.error("Order Limit Reached");
      return;
    }
    ctxDispatch({
      type: "CART_ADD_ITEM",
      payload: { ...item, quantity },
    });
  };

  return (
    <Card className="text-center product-card px-2 py-3">
      <Link to={`/product/${product.slug}`} className="product-img">
        <Card.Img variant="top" src={product.image} alt={product.name} />
      </Link>
      {product.discountedPrice < product.price && product.stocks > 0 && (
        <div className="d-flex sale-discount">
          <h4 className="sale">Sale</h4>
          <h4 className="discount">
            {`${roundToTwo(
              (100 * (product.price - product.discountedPrice)) / product.price
            )}%`}
          </h4>
        </div>
      )}
      <Card.Body>
        <Link to={`/product/${product.slug}`} className="card-link">
          <Card.Title>{product.name}</Card.Title>
        </Link>
        <Rating rating={product.rating} />
        {product.stocks > 0 && (
          <Row>
            <Col>Price:</Col>
            <Col>
              {product.discountedPrice > product.price ? (
                `₱ ${product.discountedPrice}`
              ) : product.discountedPrice < product.price ? (
                <>
                  <Col>
                    <del>{`₱ ${product.price}`}</del>
                  </Col>
                  <Col>{` ₱ ${product.discountedPrice}`}</Col>
                </>
              ) : (
                `₱ ${product.discountedPrice}`
              )}
            </Col>
          </Row>
        )}
        {product.stocks > 0 && (
          <>
            <Row className="align-items-center mb-3">
              <Col>Quantity: </Col>
              <Col>
                <Form.Select
                  value={qty}
                  onChange={(e) => setQty(parseInt(e.target.value))}
                >
                  {[...Array(product.stocks).keys()].map((stock) => (
                    <option value={stock + 1} key={stock + 1}>
                      {stock + 1}
                    </option>
                  ))}
                </Form.Select>
              </Col>
            </Row>
            <div className="d-grid">
              <Button type="button" onClick={() => addToCartHandler(product)}>
                Add to Cart
              </Button>
            </div>
          </>
        )}
        {userData && userData.isAdmin && (
          <Row className="mt-3">
            <div className="d-grid">
              <LinkContainer
                to={`/admin/products-list/product/update-product/${product._id}`}
              >
                <Button variant="secondary">Update/Edit Product</Button>
              </LinkContainer>
            </div>
          </Row>
        )}
      </Card.Body>
    </Card>
  );
}

export default Product;
