import React, { useContext, useEffect, useReducer, useState } from "react";
import { Button, Card, Modal, Table } from "react-bootstrap";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet-async";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading";
import { getError } from "../utilities";
import MessageBox from "../components/MessageBox";
import { Store } from "../store";
import { AiOutlineEdit } from "react-icons/ai";
import { FaTrash } from "react-icons/fa";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };

    case "FETCH_SUCCESS":
      return {
        ...state,
        products: action.payload,
        loading: false,
      };

    case "FETCH_FAILED":
      return { ...state, loading: false, error: action.payload };

    case "DELETE_REQUEST":
      return { ...state, loading: true, successDelete: false };

    case "DELETE_SUCCESS":
      return {
        ...state,
        loading: true,
        successDelete: true,
      };

    case "DELETE_FAILED":
      return { ...state, loading: false, successDelete: false };

    case "DELETE_RESET":
      return { ...state, loading: true, successDelete: false };

    default:
      return state;
  }
};

function ListProductsPage() {
  const [{ loading, error, products, successDelete }, dispatch] = useReducer(
    reducer,
    {
      loading: true,
      error: "",
    }
  );

  const navigate = useNavigate();

  const { state } = useContext(Store);
  const {
    user: { userData },
  } = state;

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const { data } = await axios.get(`/api/products/admin`, {
          headers: { Authorization: `Bearer ${userData.token}` },
        });
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({
          type: "FETCH_FAILED",
          payload: getError(err),
        });
      }
    };

    if (successDelete) {
      dispatch({ type: "DELETE_RESET" });
    } else {
      fetchData();
    }
  }, [userData, successDelete]);

  const deleteHandler = async (product) => {
    try {
      await axios.delete(`/api/products/delete/${product._id}`, {
        headers: { Authorization: `Bearer ${userData.token}` },
      });
      toast.success("Product Deleted Successfully");
      dispatch({ type: "DELETE_SUCCESS" });
    } catch (err) {
      toast.error(getError(error));
      dispatch({
        type: "DELETE_FAILED",
      });
    }
  };

  const [productInfo, setProductInfo] = useState({});

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
              deleteHandler(productInfo);
              handleClose();
            }}
          >
            Delete Product
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  return (
    <div>
      <Helmet>
        <title>List of Products</title>
      </Helmet>
      <h1>List of Products</h1>
      {loading ? (
        <Loading />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <Card className="py-3 px-3">
          {show ? <BtnModal /> : null}
          <div className="text-end mb-3">
            <Button
              variant="primary"
              type="button"
              onClick={() =>
                navigate("/admin/products-list/product/create-product")
              }
            >
              Create Product
            </Button>
          </div>
          <Table bordered responsive className="mb-0">
            <thead>
              <tr>
                <th rowSpan={2}>NAME</th>
                <th colSpan={2}>PRICE</th>
                <th rowSpan={2}>STOCKS</th>
                <th rowSpan={2}>CATEGORY</th>
                <th rowSpan={2} colSpan={2}>
                  ACTIONS
                </th>
              </tr>
              <tr>
                <th>ORIGINAL</th>
                <th>CURRENT</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>{product.name}</td>
                  <td>{`₱ ${product.price}`}</td>
                  <td>{`₱ ${product.discountedPrice}`}</td>
                  <td>{product.stocks}</td>
                  <td>{product.category}</td>
                  <td>
                    <Button
                      type="button"
                      variant="primary"
                      onClick={() =>
                        navigate(
                          `/admin/products-list/product/update-product/${product._id}`
                        )
                      }
                    >
                      Update/Edit
                      <AiOutlineEdit />
                    </Button>
                  </td>
                  <td>
                    <Button
                      type="button"
                      variant="danger"
                      onClick={() => {
                        handleShow();
                        setProductInfo(product);
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

export default ListProductsPage;
