import React, { useContext, useState } from "react";
import axios from "axios";
import Product from "../components/Product";
import Loading from "../components/Loading";
import { Helmet } from "react-helmet-async";
import { Col, Row, Tab, Tabs } from "react-bootstrap";
import MessageBox from "../components/MessageBox";
import { Store } from "../store";
import { useQuery } from "@tanstack/react-query";

const fetchProducts = async () => {
  try {
    const { data } = await axios.get("/api/products");
    return data;
  } catch (err) {
    console.log(err);
  }
};

function HomePage() {
  const { state } = useContext(Store);
  const {
    user: { userData },
  } = state;
  const {
    isLoading,
    isError,
    data: products,
    error,
  } = useQuery(["products"], fetchProducts, {
    refetchInterval: 5000,
  });

  const [key, setKey] = useState("all");
  const filteredSale = products
    ? products.filter(
        (product) =>
          product.discountedPrice < product.price && product.stocks > 0
      )
    : null;
  const filteredFaceCream = products
    ? products.filter((product) => product.category === "face-cream")
    : null;
  const filteredLipstick = products
    ? products.filter((product) => product.category === "lipstick")
    : null;
  const filteredLotion = products
    ? products.filter((product) => product.category === "lotion")
    : null;
  const filteredPowder = products
    ? products.filter((product) => product.category === "powder")
    : null;
  return (
    <>
      <Helmet>
        <title>Home</title>
      </Helmet>
      {isLoading ? (
        <Loading />
      ) : isError ? (
        <MessageBox variant="danger">{error.message}</MessageBox>
      ) : (
        <div>
          <>
            {products.filter(
              (product) =>
                product.pricePrediction >= product.price &&
                product.soldItems > 0 &&
                product.stocks > 0
            ).length > 0 ? (
              <>
                <Row>
                  <h2 className="justify-content-start">Trending Products</h2>
                </Row>
                <Row>
                  {products
                    .filter(
                      (product) =>
                        product.pricePrediction >= product.price &&
                        product.soldItems > 0 &&
                        product.stocks > 0
                    )
                    .sort((a, b) => b.soldItems - a.soldItems)
                    .slice(0, 4)
                    .map((product) => (
                      <Col
                        sm={6}
                        md={4}
                        lg={3}
                        className="mb-3 text-center"
                        key={product._id}
                      >
                        <Product product={product} />
                      </Col>
                    ))}
                </Row>
                <hr />
              </>
            ) : null}
            <Row>
              <h2 className="justify-content-start">Featured Products</h2>
            </Row>
            <Tabs
              activeKey={key}
              onSelect={(k) => setKey(k)}
              className="mb-3 tabs-ul"
              justify
            >
              <Tab eventKey="all" title="All">
                <Row>
                  {products
                    .filter((product) => product.stocks > 0)
                    .map((product) => (
                      <Col
                        sm={6}
                        md={4}
                        lg={3}
                        className="mb-3 text-center"
                        key={product._id}
                      >
                        <Product product={product} />
                      </Col>
                    ))}
                </Row>
              </Tab>
              <Tab eventKey="sale" title="Sale">
                <Row>
                  {filteredSale
                    .filter((product) => product.stocks > 0)
                    .map((product) => (
                      <Col
                        sm={6}
                        md={4}
                        lg={3}
                        className="mb-3 text-center"
                        key={product._id}
                      >
                        <Product product={product} />
                      </Col>
                    ))}
                </Row>
              </Tab>
              <Tab eventKey="cream" title="Cream">
                <Row>
                  {filteredFaceCream
                    .filter((product) => product.stocks > 0)
                    .map((product) => (
                      <Col
                        sm={6}
                        md={4}
                        lg={3}
                        className="mb-3 text-center"
                        key={product._id}
                      >
                        <Product product={product} />
                      </Col>
                    ))}
                </Row>
              </Tab>
              <Tab eventKey="lipstick" title="Lipstick">
                <Row>
                  {filteredLipstick
                    .filter((product) => product.stocks > 0)
                    .map((product) => (
                      <Col
                        sm={6}
                        md={4}
                        lg={3}
                        className="mb-3 text-center"
                        key={product._id}
                      >
                        <Product product={product} />
                      </Col>
                    ))}
                </Row>
              </Tab>
              <Tab eventKey="lotion" title="Lotion">
                <Row>
                  {filteredLotion
                    .filter((product) => product.stocks > 0)
                    .map((product) => (
                      <Col
                        sm={6}
                        md={4}
                        lg={3}
                        className="mb-3 text-center"
                        key={product._id}
                      >
                        <Product product={product} />
                      </Col>
                    ))}
                </Row>
              </Tab>
              <Tab eventKey="powder" title="Powder">
                <Row>
                  {filteredPowder
                    .filter((product) => product.stocks > 0)
                    .map((product) => (
                      <Col
                        sm={6}
                        md={4}
                        lg={3}
                        className="mb-3 text-center"
                        key={product._id}
                      >
                        <Product product={product} />
                      </Col>
                    ))}
                </Row>
              </Tab>
            </Tabs>
            <Row>
              {userData &&
                userData.isAdmin &&
                products.filter((product) => product.stocks === 0).length >
                  0 && (
                  <>
                    <hr />
                    <h3>Out of Stocks</h3>
                    {products
                      .filter((product) => product.stocks === 0)
                      .map((product) => (
                        <Col
                          sm={6}
                          md={4}
                          lg={3}
                          className="mb-3 text-center"
                          key={product._id}
                        >
                          <Product product={product} />
                        </Col>
                      ))}
                  </>
                )}
            </Row>
          </>
        </div>
      )}
    </>
  );
}

export default HomePage;
