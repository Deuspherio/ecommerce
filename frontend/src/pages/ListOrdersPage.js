import React, { useContext, useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Modal, Table } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import { toast } from "react-toastify";
import axios from "axios";
import { Store } from "../store";
import { getError } from "../utilities";
import Loading from "../components/Loading";
import MessageBox from "../components/MessageBox";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { FaTrash } from "react-icons/fa";
import { BsCheck2, BsCheck2All } from "react-icons/bs";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };

    case "FETCH_SUCCESS":
      return {
        ...state,
        orders: action.payload,
        loading: false,
      };

    case "FETCH_FAILED":
      return { ...state, loading: false, error: action.payload };

    case "PAYMENT_REQUEST":
      return { ...state, loading: true, paymentSuccess: false };

    case "PAYMENT_SUCCESS":
      return { ...state, loading: true, paymentSuccess: true };

    case "PAYMENT_FAILED":
      return { ...state, loading: false };

    case "PAYMENT_RESET":
      return { ...state, loading: true, paymentSuccess: false };

    case "DELETE_REQUEST":
      return { ...state, loading: true, deleteSuccess: false };

    case "DELETE_SUCCESS":
      return {
        ...state,
        loading: true,
        deleteSuccess: true,
      };

    case "DELETE_FAILED":
      return { ...state, loading: false };

    case "DELETE_RESET":
      return { ...state, loading: true, deleteSuccess: false };

    default:
      return state;
  }
};

function ListOrdersPage() {
  const { state } = useContext(Store);
  const {
    user: { userData },
  } = state;
  const [{ loading, deleteSuccess, paymentSuccess, error, orders }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: "",
    });
  const navigate = useNavigate();

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [paymentState, setPaymentState] = useState(false);
  const [orderInfo, setOrderInfo] = useState({});

  const [deleteState, setDeleteState] = useState(false);

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
          {paymentState && (
            <Button
              variant="primary"
              onClick={() => {
                updatePaymentStatus(orderInfo);
                handleClose();
                setPaymentState(false);
              }}
            >
              Payment received
            </Button>
          )}
          {deleteState && (
            <Button
              variant="primary"
              onClick={() => {
                deleteHandler(orderInfo);
                handleClose();
                setDeleteState(false);
              }}
            >
              Delete Order
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`/api/order/all-orders`, {
          headers: { Authorization: `Bearer ${userData.token}` },
        });
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (e) {
        dispatch({
          type: "FETCH_FAILED",
          payload: getError(e),
        });
      }
    };

    if (paymentSuccess) {
      dispatch({ type: "PAYMENT_RESET" });
    } else if (deleteSuccess) {
      dispatch({ type: "DELETE_RESET" });
    } else {
      fetchData();
    }
  }, [userData, deleteSuccess, paymentSuccess]);

  const updatePaymentStatus = async (order) => {
    dispatch({ type: "PAYMENT_REQUEST" });
    try {
      await axios.patch(
        `/api/order/payment-update/${order._id}`,
        {},
        {
          headers: { Authorization: `Bearer ${userData.token}` },
        }
      );
      toast.success("Payment Successful");
      dispatch({ type: "PAYMENT_SUCCESS" });
    } catch (e) {
      toast.error(getError(e));
      dispatch({
        type: "PAYMENT_FAILED",
      });
    }
  };

  const deleteHandler = async (order) => {
    dispatch({ type: "DELETE_REQUEST" });
    try {
      await axios.delete(`/api/order/delete/${order._id}`, {
        headers: { Authorization: `Bearer ${userData.token}` },
      });
      toast.success("Order Deleted Successfully");
      dispatch({ type: "DELETE_SUCCESS" });
    } catch (e) {
      toast.error(getError(e));
      dispatch({
        type: "DELETE_FAILED",
      });
    }
  };

  return (
    <div>
      <Helmet>
        <title>List of Orders</title>
      </Helmet>
      <h1>List of Orders</h1>
      {loading ? (
        <Loading />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <Card className="py-3 px-3 card-table">
          {show ? <BtnModal /> : null}
          <Table bordered responsive className="mb-0">
            <thead>
              <tr>
                <th>USERS</th>
                <th>DATE</th>
                <th>TOTAL</th>
                <th>PAID</th>
                <th>DELIVERED</th>
                <th colSpan={3}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>
                    {order.user ? (
                      <>
                        {`${order.shippingAddress.firstName}
                         ${order.shippingAddress.lastName}`}
                      </>
                    ) : (
                      "Deleted User"
                    )}
                  </td>
                  <td>{order.createdAt.substring(0, 10)}</td>
                  <td>{`₱ ${order.totalPrice.toLocaleString()}`}</td>
                  <td>
                    {order.isPaid
                      ? order.paidAt.substring(0, 10)
                      : "Not yet paid "}
                  </td>
                  <td>
                    {order.isDelivered
                      ? order.deliveredAt.substring(0, 10)
                      : "Not yet delivered "}
                  </td>
                  <td>
                    {!order.isPaid ? (
                      <>
                        <Button
                          type="button"
                          variant="success"
                          onClick={() => {
                            setPaymentState(true);
                            setOrderInfo(order);
                            handleShow();
                          }}
                        >
                          Paid
                          <BsCheck2 />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button type="button" variant="success" disabled>
                          Paid
                          <BsCheck2All />
                        </Button>
                      </>
                    )}
                  </td>
                  <td>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => {
                        navigate(`/order/${order._id}`);
                      }}
                    >
                      Details
                      <AiOutlineInfoCircle />
                    </Button>
                  </td>
                  <td>
                    <Button
                      type="button"
                      variant="danger"
                      onClick={() => {
                        setDeleteState(true);
                        setOrderInfo(order);
                        handleShow();
                      }}
                    >
                      Delete
                      <FaTrash />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card>
      )}
    </div>
  );
}

export default ListOrdersPage;
