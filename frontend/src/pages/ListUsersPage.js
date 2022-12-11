import React, { useContext, useEffect, useReducer, useState } from "react";
import { Button, Card, Modal, Table } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Store } from "../store";
import { getError } from "../utilities";
import Loading from "../components/Loading";
import MessageBox from "../components/MessageBox";
import { AiOutlineEdit } from "react-icons/ai";
import { FaTrash } from "react-icons/fa";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };

    case "FETCH_SUCCESS":
      return {
        ...state,
        users: action.payload,
        loading: false,
      };

    case "FETCH_FAILED":
      return { ...state, loading: false, error: action.payload };

    case "DELETE_REQUEST":
      return { ...state, successDelete: false, loading: true };

    case "DELETE_SUCCESS":
      return {
        ...state,
        successDelete: true,
        loading: true,
      };

    case "DELETE_FAILED":
      return { ...state, loading: false };

    case "DELETE_RESET":
      return { ...state, successDelete: false, loading: true };

    default:
      return state;
  }
};

function ListUsersPage() {
  const navigate = useNavigate();
  const [{ loading, error, users, successDelete }, dispatch] = useReducer(
    reducer,
    {
      loading: true,
      error: "",
    }
  );

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
        const { data } = await axios.get(`/api/user`, {
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
    if (successDelete) {
      dispatch({ type: "DELETE_RESET" });
    } else {
      fetchData();
    }
  }, [userData, successDelete]);

  const deleteHandler = async (user) => {
    try {
      dispatch({ type: "DELETE_REQUEST" });
      await axios.delete(`/api/user/delete/${user._id}`, {
        headers: { Authorization: `Bearer ${userData.token}` },
      });
      toast.success("User Deleted Successfully");
      dispatch({ type: "DELETE_SUCCESS" });
    } catch (error) {
      toast.error(getError(error));
      dispatch({
        type: "DELETE_FAILED",
      });
    }
  };

  const [userInfo, setUserInfo] = useState({});

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
              deleteHandler(userInfo);
              handleClose();
            }}
          >
            Delete User
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  return (
    <div>
      <Helmet>
        <title>List of Users</title>
      </Helmet>
      <h1>List of Users</h1>
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
                <th>FIRST NAME</th>
                <th>LAST NAME</th>
                <th>EMAIL</th>
                <th>PHONE NUMBER</th>
                <th>ADDRESS</th>
                <th>ADMIN</th>
                <th colSpan={2}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.firstName}</td>
                  <td>{user.lastName}</td>
                  <td>{user.email}</td>
                  <td>{user.phoneNumber}</td>
                  <td>{user.address}</td>
                  <td>{user.isAdmin ? "Yes" : "Not an Admin"}</td>
                  <td>
                    <Button
                      type="button"
                      variant="primary"
                      onClick={() =>
                        navigate(
                          `/admin/users-list/user/update-user/${user._id}`
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
                        setUserInfo(user);
                        handleShow();
                      }}
                      disabled={userData.isAdmin && userData.isAdmin}
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

export default ListUsersPage;
