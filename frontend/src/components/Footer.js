import React from "react";
import { Button, Col, Container, Form, ListGroup, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <div
      style={{
        backgroundColor: "#01345b",
      }}
    >
      <Container className="p-3">
        <hr />
        <Row>
          <Col xs={6} sm={6} md={4} lg={4} className="mb-3">
            <h5 style={{ color: "white" }}>Skin Care</h5>
            <ListGroup variant="flush">
              <ListGroup.Item
                style={{
                  fontSize: "0.875rem",
                  backgroundColor: "#01345b",
                  border: 0,
                }}
              >
                <Link to="/" style={{ color: "white" }}>
                  Cream
                </Link>
              </ListGroup.Item>
              <ListGroup.Item
                style={{
                  fontSize: "0.875rem",
                  backgroundColor: "#01345b",
                  border: 0,
                }}
              >
                <Link to="/" style={{ color: "white" }}>
                  Lipstick
                </Link>
              </ListGroup.Item>
              <ListGroup.Item
                style={{
                  fontSize: "0.875rem",
                  backgroundColor: "#01345b",
                  border: 0,
                }}
              >
                <Link to="/" style={{ color: "white" }}>
                  Lotion
                </Link>
              </ListGroup.Item>
              <ListGroup.Item
                style={{
                  fontSize: "0.875rem",
                  backgroundColor: "#01345b",
                  border: 0,
                }}
              >
                <Link to="/" style={{ color: "white" }}>
                  Powder
                </Link>
              </ListGroup.Item>
            </ListGroup>
          </Col>
          <Col xs={6} sm={6} md={4} lg={4} className="mb-3">
            <h5 style={{ color: "white" }}>Other Products</h5>
          </Col>
          <Col
            md={4}
            lg={4}
            className="mb-3 d-flex flex-column align-items-center align-items-md-start"
          >
            <h6 style={{ color: "white" }}>Be in touch with us:</h6>
            <Form className="d-flex align-items-center">
              <Form.Group controlId="email">
                <Form.Control
                  type="email"
                  required
                  placeholder="Enter your email"
                />
              </Form.Group>
              <Button type="button" style={{ fontSize: "14px" }}>
                JOIN US
              </Button>
            </Form>
          </Col>
        </Row>
        <Row className="mt-5">
          <p
            className="text-xs d-flex justify-content-center mb-0"
            style={{ color: "white", fontSize: "12px" }}
          >
            © Copyright 2023. All Rights Reserved
          </p>
        </Row>
      </Container>
    </div>
  );
}

export default Footer;
