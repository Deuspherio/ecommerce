import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Store } from "../../context";
import { useContext, useState } from "react";
import Loading from "../../components/Loading";
import { deleteOrder, getOrders } from "./orders.api";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import Pagination from "../../components/Pagination";
import { BsInfo } from "react-icons/bs";
import { AiOutlineDelete } from "react-icons/ai";
import { toast } from "react-toastify";
import { FiEdit } from "react-icons/fi";

const PAGE_SIZE = 10;
const OrdersListPage = () => {
  const navigate = useNavigate();
  const {
    state: {
      user: { userData },
    },
  } = useContext(Store);
  const {
    data: orders,
    isLoading,
    isError,
    error,
  } = useQuery(["orders"], () => getOrders(userData));

  const queryClient = useQueryClient();
  const { mutate, isLoading: deleteIsLoading } = useMutation(
    (id) => deleteOrder(id, userData),
    {
      onSuccess: (data) => {
        queryClient.setQueryData(["orders"], () =>
          data.sort((a, b) => b.createdAt - a.createdAt)
        );
      },
    }
  );

  const deleteHandler = (id) => {
    if (window.confirm("Are you sure?")) {
      mutate(id);
    }
  };
  const [currentPage, setCurrentPage] = useState(1);
  const lastProductIndex = currentPage * PAGE_SIZE;
  const firstProductIndex = lastProductIndex - PAGE_SIZE;
  return (
    <>
      <Helmet>
        <title>List of Orders</title>
      </Helmet>
      {isLoading || deleteIsLoading ? (
        <Loading />
      ) : isError ? (
        <p>{error.message}</p>
      ) : (
        <div className="custom-container">
          <h1 className="text-center">List of Orders</h1>
          <div className="overflow-x-auto relative">
            <table className="w-full rounded border">
              <thead className="text-lg w-full text-gray-700 uppercase">
                <tr>
                  <th scope="col" rowSpan={2}>
                    USERS
                  </th>
                  <th scope="col" rowSpan={2}>
                    DATE
                  </th>
                  <th scope="col" rowSpan={2}>
                    TOTAL
                  </th>
                  <th scope="col" rowSpan={2}>
                    PAID
                  </th>
                  <th scope="col" rowSpan={2}>
                    DELIVERED
                  </th>
                  <th scope="col" colSpan={3}>
                    ACTIONS
                  </th>
                </tr>
                <tr>
                  <th scope="col">UPDATE</th>
                  <th scope="col">INFO</th>
                  <th scope="col">DELETE</th>
                </tr>
              </thead>
              <tbody>
                {orders
                  .slice(firstProductIndex, lastProductIndex)
                  .map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td>
                        {order.user ? (
                          <>
                            {`${order.shippingInfo.firstName}
                         ${order.shippingInfo.lastName}`}
                          </>
                        ) : (
                          "Deleted User"
                        )}
                      </td>
                      <td>{order.createdAt.substring(0, 10)}</td>
                      <td>{`$ ${order.totalPrice.toLocaleString()}`}</td>
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
                        <button
                          type="button"
                          className="btn-primary bg-green-600 text-2xl"
                          title="UPDATE ORDER PAYMENT"
                          onClick={() => {
                            !order.isPaid
                              ? navigate(
                                  `/admin/orders/update/payment/${order._id}`
                                )
                              : toast.info("Order Already Paid");
                          }}
                        >
                          <FiEdit />
                        </button>
                      </td>
                      <td>
                        <button
                          type="button"
                          title="INFO"
                          className="btn-primary text-2xl"
                          onClick={() => {
                            navigate(`/user/orders/${order._id}`);
                          }}
                        >
                          <BsInfo />
                        </button>
                      </td>
                      <td className="py-3 px-6">
                        <button
                          type="button"
                          title="DELETE"
                          className="btn-primary bg-red-600 text-2xl"
                          onClick={() => deleteHandler(order._id)}
                        >
                          <AiOutlineDelete className="text-xl" />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <Pagination
            items={orders}
            PAGE_SIZE={PAGE_SIZE}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </div>
      )}
    </>
  );
};

export default OrdersListPage;
