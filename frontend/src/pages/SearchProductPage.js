import React, { useContext, useEffect, useReducer } from "react";
import axios from "axios";
import Product from "../components/Product";
import Loading from "../components/Loading";
import { Helmet } from "react-helmet-async";
import { Col, Row } from "react-bootstrap";
import { getError } from "../utilities";
import MessageBox from "../components/MessageBox";
import { useLocation } from "react-router-dom";
import { Store } from "../store";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };

    case "FETCH_SUCCESS":
      return { ...state, products: action.payload, loading: false };

    case "FETCH_FAILED":
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

function SearchProductPage() {
  const { state } = useContext(Store);
  const {
    user: { userData },
  } = state;
  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);
  const name = searchParams.get("name") || "all";

  const [{ loading, error, products }, dispatch] = useReducer(reducer, {
    products: [],
    loading: true,
    error: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const { data } = await axios.get(`/api/products/search?name=${name}`);
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (error) {
        dispatch({ type: "FETCH_FAILED", payload: getError(error) });
      }
    };

    fetchData();
  }, [name]);

  return (
    <>
      <Helmet>
        <title>Search Product</title>
      </Helmet>
      <small>{`results for ${name}`}</small>
      {loading ? (
        <Loading />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <>
          {products.length === 0 ? (
            <MessageBox>No Product Found</MessageBox>
          ) : (
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
          )}
        </>
      )}
    </>
  );
}

export default SearchProductPage;
