import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Store } from "../../context";
import { useContext, useState } from "react";
import Loading from "../../components/Loading";
import { deleteOrder, getOrders } from "./orders.api";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import Pagination from "../../components/Pagination";
import { BsCheck2, BsInfo } from "react-icons/bs";
import { AiOutlineDelete } from "react-icons/ai";

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
        queryClient.setQueryData(["orders"], () => data);
      },
    }
  );

  const deleteHandler = (id) => {
    if (window.confirm("Are you sure?")) {
      console.log(id);
      // mutate(id);
    }
  };
  console.log(orders);
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
                  <th scope="col">USERS</th>
                  <th scope="col">DATE</th>
                  <th scope="col">TOTAL</th>
                  <th scope="col">PAID</th>
                  <th scope="col">DELIVERED</th>
                  <th scope="col" colSpan={3}>
                    ACTIONS
                  </th>
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
                            {`${order.shippingData.firstName}
                         ${order.shippingData.lastName}`}
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
                          : "Not yet"}
                      </td>
                      <td>
                        {order.isDelivered
                          ? order.deliveredAt.substring(0, 10)
                          : "Not yet"}
                      </td>
                      <td>
                        {!order.isPaid ? (
                          <>
                            <button
                              type="button"
                              title="ORDER PAID?"
                              className="btn-primary text-2xl bg-green-600"
                            >
                              <BsCheck2 />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              type="button"
                              className="btn-primary text-2xl bg-green-600"
                              disabled
                            >
                              <BsCheck2 />
                            </button>
                          </>
                        )}
                      </td>
                      <td>
                        <button
                          type="button"
                          title="ORDER INFO"
                          className="btn-primary text-2xl"
                          onClick={() => {
                            navigate(`/user/order/${order._id}`);
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
