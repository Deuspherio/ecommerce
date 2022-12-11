import React, { useContext, useReducer, useState, useEffect } from "react";
import { Button, Card, Col, ListGroup, Modal, Row } from "react-bootstrap";
import Loading from "../components/Loading";
import MessageBox from "../components/MessageBox";
import { Store } from "../store";
import { getError } from "../utilities";
import { Helmet } from "react-helmet-async";
import {
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  BarChart,
  Bar,
} from "recharts";
import axios from "axios";
import ProductTable from "../components/ProductTable";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";

const reducer = (state, action) => {
  switch (action.type) {
    case "UPDATE_REQUEST":
      return {
        ...state,
        loading: true,
        updatePriceSuccess: false,
      };

    case "UPDATE_SUCCESS":
      return {
        ...state,
        loading: false,
        updatePriceSuccess: true,
      };

    case "UPDATE_FAILED":
      return { ...state, loading: false };

    case "UPDATE_PRICE":
      return { ...state, loading: false, updatePreviewPriceSuccess: false };

    case "UPDATE_PREVIEW_REQUEST":
      return {
        ...state,
        loading: true,
        updatePriceSuccess: false,
      };

    case "UPDATE_PREVIEW_SUCCESS":
      return {
        ...state,
        loading: false,
        updatePreviewPriceSuccess: true,
      };

    case "UPDATE_PREVIEW_FAILED":
      return { ...state, loading: false };

    case "UPDATE_PREVIEW_PRICE":
      return { ...state, loading: false, updatePreviewPriceSuccess: false };

    default:
      return state;
  }
};

const fetchSummary = async (userData) => {
  try {
    const { data } = await axios.get("/api/order/summary", {
      headers: { Authorization: `Bearer ${userData.token}` },
    });
    return data;
  } catch (err) {
    console.log(err);
  }
};

function DashboardPage() {
  const [{ loading, updatePriceSuccess, updatePreviewPriceSuccess }, dispatch] =
    useReducer(reducer, {
      loading: false,
    });
  const { state } = useContext(Store);
  const {
    user: { userData },
  } = state;
  const {
    isLoading,
    isError,
    data: summary,
    error,
  } = useQuery(["summary"], () => fetchSummary(userData), {
    refetchInterval: 5000,
  });

  const [previewPredict, setPreviewPredict] = useState(1);

  const [show, setShow] = useState(false);
  const [previewShow, setPreviewShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handlePreviewClose = () => setPreviewShow(false);
  const handlePreviewShow = () =>
    !previewPredict
      ? toast.error("Please enter a number")
      : setPreviewShow(true);

  const submitHandler = async (e) => {
    e.preventDefault();
    dispatch({ type: "UPDATE_REQUEST" });
    try {
      await axios.patch(
        "/api/products/activate-algo",
        {},
        {
          headers: { Authorization: `Bearer ${userData.token}` },
        }
      );
      toast.success("Prices Updated Successfully");
      dispatch({ type: "UPDATE_SUCCESS" });
    } catch (error) {
      toast.error(getError(error));
      dispatch({ type: "UPDATE_FAILED" });
    }
  };

  const previewHandler = async (e) => {
    e.preventDefault();
    dispatch({ type: "UPDATE_PREVIEW_REQUEST" });
    try {
      await axios.patch(
        "/api/products/preview-algo",
        { previewPredict },
        {
          headers: { Authorization: `Bearer ${userData.token}` },
        }
      );
      setPreviewPredict(1);
      window.location.reload();
      dispatch({ type: "UPDATE_PREVIEW_SUCCESS" });
      toast.success("Prices Preview Updated Successfully");
    } catch (error) {
      toast.error(getError(error));
      dispatch({ type: "UPDATE_PREVIEW_FAILED" });
    }
  };

  useEffect(() => {
    if (updatePriceSuccess) {
      dispatch({ type: "UPDATE_PRICE" });
    } else if (updatePreviewPriceSuccess) {
      dispatch({ type: "UPDATE_PREVIEW_PRICE" });
    }
  }, [updatePriceSuccess, updatePreviewPriceSuccess]);

  return (
    <>
      <Helmet>
        <title>Dashboard</title>
      </Helmet>
      <h1>Dashboard</h1>
      {isLoading || loading ? (
        <Loading />
      ) : isError ? (
        <MessageBox variant="danger">{error.message}</MessageBox>
      ) : (
        <>
          <Row>
            <Col md={4} className="mb-3">
              <Card>
                <Card.Body>
                  <Card.Title>
                    <strong>Total Users:</strong>
                  </Card.Title>
                  <Card.Text>
                    &nbsp;
                    {`${
                      summary.users &&
                      summary.users[0] &&
                      summary.users.length !== 0
                        ? summary.users[0].totalUsers
                        : 0
                    } user/s`}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-3">
              <Card>
                <Card.Body>
                  <Card.Title>
                    <strong>Total Orders:</strong>
                  </Card.Title>
                  <Card.Text>
                    &nbsp;
                    {`${
                      summary.orders &&
                      summary.users[0] &&
                      summary.orders.length !== 0 &&
                      summary.users.length !== 0
                        ? summary.orders[0].totalOrders
                        : 0
                    } order/s`}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-3">
              <Card>
                <Card.Body>
                  <Card.Title>
                    <strong>Total Profits:</strong>
                  </Card.Title>
                  <Card.Text>
                    &nbsp;
                    {`₱
                    ${
                      summary.orders &&
                      summary.users[0] &&
                      summary.orders.length !== 0 &&
                      summary.users.length !== 0
                        ? summary.orders[0].totalSales.toLocaleString()
                        : 0
                    }`}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Modal show={show} onHide={handleClose}>
            <Modal.Header>
              <Modal.Title>Are you sure?</Modal.Title>
            </Modal.Header>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                No
              </Button>
              <Button
                variant="primary"
                onClick={(e) => {
                  submitHandler(e);
                  handleClose();
                }}
              >
                Apply Price Prediction
              </Button>
            </Modal.Footer>
          </Modal>
          <Modal show={previewShow} onHide={handlePreviewClose}>
            <Modal.Header>
              <Modal.Title>Are you sure?</Modal.Title>
            </Modal.Header>
            <Modal.Footer>
              <Button variant="secondary" onClick={handlePreviewClose}>
                No
              </Button>
              <Button
                variant="primary"
                onClick={(e) => {
                  previewHandler(e);
                  handlePreviewClose();
                }}
              >
                Preview Price Prediction
              </Button>
            </Modal.Footer>
          </Modal>
          <ProductTable
            products={summary.products}
            handleShow={handleShow}
            handlePreviewShow={handlePreviewShow}
            setPreviewPredict={setPreviewPredict}
          />
          <Row className="my-3">
            <Col md={6}>
              <Card className="p-3">
                <h2>Daily Profits</h2>
                {summary.dailyOrders.length === 0 ? (
                  <MessageBox>No Profits</MessageBox>
                ) : (
                  <ResponsiveContainer width="100%" height={320}>
                    <AreaChart data={summary.dailyOrders}>
                      <defs>
                        <linearGradient
                          id="colorSales"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#ffb600"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="#ffb600"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke="#8884d8" strokeDasharray="5 5" />
                      <XAxis dataKey="_id" />
                      <YAxis />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="sales"
                        stroke="#ffb600"
                        fillOpacity={1}
                        fill="url(#colorSales)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </Card>
            </Col>
            <Col md={6} className="mt-3 mt-md-0">
              <Card className="p-3">
                <h2>Top 3 Selling Products</h2>
                <h4 className="text-center">(current)</h4>
                <ListGroup variant="flush">
                  {summary.products
                    .sort((a, b) => b.soldItems - a.soldItems)
                    .slice(0, 3)
                    .map((product, i) => (
                      <ListGroup.Item key={product._id}>
                        <Row className="d-flex align-items-center">
                          <Col xs={1}>{i + 1}.</Col>
                          <Col xs={3}>
                            <img
                              src={product.image}
                              alt={product.name}
                              className="img-fluid rounded image-small"
                            />
                          </Col>
                          <Col xs={8}>{product.name}</Col>
                        </Row>
                      </ListGroup.Item>
                    ))}
                </ListGroup>
              </Card>
            </Col>
          </Row>
          <Card className="my-3 p-3">
            <h2>Products Stocks</h2>
            {/* Face Cream */}
            <Row>
              <Col md={6}>
                {summary.faceCreamAvailable.length === 0 ? (
                  <MessageBox>No Face Cream Available</MessageBox>
                ) : (
                  <>
                    <h4>Face Cream</h4>
                    <ResponsiveContainer width="100%" height={320}>
                      <BarChart data={summary.faceCreamAvailable}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="_id" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="stocks" fill="#ffb600" />
                      </BarChart>
                    </ResponsiveContainer>
                  </>
                )}
              </Col>
              <Col md={6}>
                {/* Lipstick */}
                <h4>Lipstick</h4>
                {summary.lipstickAvailable.length === 0 ? (
                  <MessageBox>No Lipstick (16oz) Available</MessageBox>
                ) : (
                  <>
                    <ResponsiveContainer width="100%" height={320}>
                      <BarChart data={summary.lipstickAvailable}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="_id" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="stocks" fill="#0088fe" />
                      </BarChart>
                    </ResponsiveContainer>
                  </>
                )}
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                {/* Lotion */}
                {summary.lotionAvailable.length === 0 ? (
                  <MessageBox>No Lotion Available</MessageBox>
                ) : (
                  <>
                    <h4>Lotion</h4>
                    <ResponsiveContainer width="100%" height={320}>
                      <BarChart data={summary.lotionAvailable}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="_id" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="stocks" fill="#00c49f" />
                      </BarChart>
                    </ResponsiveContainer>
                  </>
                )}
              </Col>
              <Col md={6}>
                {/* powder */}
                <h4>Powder</h4>
                {summary.powderAvailable.length === 0 ? (
                  <MessageBox>No Powder Available</MessageBox>
                ) : (
                  <>
                    <ResponsiveContainer width="100%" height={320}>
                      <BarChart data={summary.powderAvailable}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="_id" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="stocks" fill="#ff8042" />
                      </BarChart>
                    </ResponsiveContainer>
                  </>
                )}
              </Col>
            </Row>
          </Card>
        </>
      )}
    </>
  );
}

export default DashboardPage;
