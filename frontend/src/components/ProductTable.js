import React from "react";
import { Button, Card, Col, Form, Row, Table } from "react-bootstrap";
import { roundToTwo } from "../utilities";

function ProductTable({
  products,
  handleShow,
  handlePreviewShow,
  setPreviewPredict,
}) {
  return (
    <Row>
      <Col md={9} sm={8} xs={12}>
        <Card className="p-3">
          <h2>Products Price Information</h2>
          <Table bordered hover responsive className="mb-0">
            <thead>
              <tr>
                <th rowSpan={2}>NAME</th>
                <th rowSpan={2}>SALES</th>
                <th colSpan={3}>PRICE</th>
                <th colSpan={2}>DISCOUNT</th>
              </tr>
              <tr>
                <th>ORIGINAL</th>
                <th>CURRENT</th>
                <th>PREDICTION</th>
                <th>CURRENT</th>
                <th>FUTURE</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  {product.stocks > 0 && (
                    <>
                      <td>{product.name}</td>
                      <td>{`₱ ${roundToTwo(
                        product.discountedPrice * product.soldItems
                      ).toLocaleString()}`}</td>
                      <td>{`₱ ${product.price.toLocaleString()}`}</td>
                      <td>{`₱ ${product.discountedPrice.toLocaleString()}`}</td>
                      <td>{`₱ ${product.pricePrediction.toLocaleString()}`}</td>
                      <td>{`${roundToTwo(
                        (100 * (product.price - product.discountedPrice)) /
                          product.price
                      )}%`}</td>
                      <td>{`${roundToTwo(
                        (100 * (product.price - product.pricePrediction)) /
                          product.price
                      )}%`}</td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </Table>
        </Card>
      </Col>
      <Col md={3} sm={4} xs={12} className="mt-3 mt-md-0">
        <Card className="p-3">
          <strong>Change Future Discount (%)</strong>
          <Form className="mb-3">
            <Form.Select
              onChange={(e) => setPreviewPredict(parseFloat(e.target.value))}
            >
              {[...Array(100).keys()].map((discountOption) => (
                <option value={discountOption + 1} key={discountOption + 1}>
                  {discountOption + 1}
                </option>
              ))}
            </Form.Select>
          </Form>
          <Button variant="secondary" type="button" onClick={handlePreviewShow}>
            Preview Price Prediction
          </Button>
          <hr />
          <strong>Apply Future Discount</strong>
          <Button type="button" onClick={handleShow}>
            Apply Price Prediction
          </Button>
        </Card>
      </Col>
    </Row>
  );
}

export default ProductTable;
