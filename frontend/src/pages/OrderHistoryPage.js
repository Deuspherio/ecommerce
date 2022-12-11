import React, { useContext, useEffect, useReducer, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Button, Card, Modal, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Store } from "../store";
import { getError, roundToTwo } from "../utilities";
import Loading from "../components/Loading";
import MessageBox from "../components/MessageBox";
import { toast } from "react-toastify";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { BsCheck2, BsCheck2All } from "react-icons/bs";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };

    case "FETCH_SUCCESS":
      return { ...state, orders: action.payload, loading: false };

    case "FETCH_FAILED":
      return { ...state, error: action.payload, loading: false };

    case "DELIVERY_REQUEST":
      return { ...state, loading: true, deliverySuccess: false };

    case "DELIVERY_SUCCESS":
      return { ...state, loading: true, deliverySuccess: true };

    case "DELIVERY_FAILED":
      return { ...state, loading: false };

    case "DELIVERY_RESET":
      return { ...state, loading: true, deliverySuccess: false };

    default:
      return state;
  }
};

function OrderHistoryPage() {
  const { state } = useContext(Store);
  const {
    user: { userData },
  } = state;
  const navigate = useNavigate();

  const [{ loading, error, orders, deliverySuccess }, dispatch] = useReducer(
    reducer,
    {
      loading: true,
      error: "",
    }
  );

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const { data } = await axios.get("/api/order/single-order", {
          headers: { Authorization: `Bearer ${userData.token}` },
        });
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (error) {
        dispatch({
          type: "FETCH_FAILED",
          payload: getError(error),
        });
      }
    };

    if (deliverySuccess) {
      dispatch({ type: "DELIVERY_RESET" });
    } else {
      fetchData();
    }
  }, [deliverySuccess, userData]);

  const updateDeliveryStatus = async (order) => {
    dispatch({ type: "DELIVERY_REQUEST" });
    try {
      const isDelivered = true;
      await axios.patch(
        `/api/order/delivery-update/${order._id}`,
        { isDelivered },
        { headers: { authorization: `Bearer ${userData.token}` } }
      );
      toast.success("Product Received Successfully");
      dispatch({ type: "DELIVERY_SUCCESS" });
    } catch (e) {
      toast.error(getError(e));
      dispatch({
        type: "DELIVERY_FAILED",
      });
    }
  };

  const [deliveryInfo, setDeliveryInfo] = useState({});

  const BtnModal = () => {
    return (
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
            onClick={() => {
              updateDeliveryStatus(deliveryInfo);
              handleClose();
            }}
          >
            Order Received
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  return (
    <div>
      <Helmet>
        <title>Order History</title>
      </Helmet>
      <h1>Order History</h1>

      {loading ? (
        <Loading />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : orders.length > 0 ? (
        <Card className="py-3 px-3">
          {show ? <BtnModal /> : null}
          <Table bordered responsive className="mb-0">
            <thead>
              <tr>
                <th>DATE</th>
                <th>TOTAL</th>
                <th>PAID</th>
                <th>DELIVERED</th>
                <th colSpan={2}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order.createdAt.substring(0, 10)}</td>
                  <td>{`₱ ${roundToTwo(
                    order.totalPrice
                  ).toLocaleString()}`}</td>
                  <td>
                    {order.isPaid
                      ? order.paidAt.substring(0, 10)
                      : "Not yet paid"}
                  </td>
                  <td>
                    {order.isDelivered
                      ? order.deliveredAt.substring(0, 10)
                      : "Not yet delivered"}
                  </td>
                  <td>
                    {!order.isDelivered ? (
                      <Button
                        variant="success"
                        type="button"
                        onClick={() => {
                          handleShow();
                          setDeliveryInfo(order);
                        }}
                      >
                        Order Received
                        <BsCheck2 />
                      </Button>
                    ) : (
                      <Button variant="success" type="button" disabled>
                        Order Received
                        <BsCheck2All />
                      </Button>
                    )}
                  </td>
                  <td>
                    <Button
                      variant="secondary"
                      type="button"
                      onClick={() => {
                        navigate(`/order/${order._id}`);
                      }}
                    >
                      Details
                      <AiOutlineInfoCircle />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card>
      ) : (
        <MessageBox>No Orders</MessageBox>
      )}
    </div>
  );
}

export default OrderHistoryPage;
