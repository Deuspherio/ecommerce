import { useQuery } from "@tanstack/react-query";
import { Store } from "../../context";
import { useContext, useState } from "react";
import Loading from "../../components/Loading";
import { roundToTwo } from "../../utilities";
import { useNavigate } from "react-router-dom";
import { getOrders } from "./orders.api";
import { Helmet } from "react-helmet-async";
import Pagination from "../../components/Pagination";
import { BsInfo } from "react-icons/bs";
import { FiEdit } from "react-icons/fi";
import { toast } from "react-toastify";

const PAGE_SIZE = 10;
const OrdersHistoryPage = () => {
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

  const [currentPage, setCurrentPage] = useState(1);
  const lastOrderIndex = currentPage * PAGE_SIZE;
  const firstOrderIndex = lastOrderIndex - PAGE_SIZE;
  return (
    <>
      <Helmet>
        <title>Orders History</title>
      </Helmet>
      {isLoading ? (
        <Loading />
      ) : isError ? (
        <p>{error.message}</p>
      ) : (
        <div className="custom-container">
          <h1 className="text-center">Orders History</h1>
          <div className="overflow-x-auto relative">
            <table className="w-full rounded border">
              <thead className="text-lg w-full text-gray-700 uppercase">
                <tr>
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
                  <th scope="col" colSpan={2}>
                    ACTIONS
                  </th>
                </tr>
                <tr>
                  <th scope="col">UPDATE</th>
                  <th scope="col">INFO</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(firstOrderIndex, lastOrderIndex).map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td>{order.createdAt.substring(0, 10)}</td>
                    <td>{`$ ${roundToTwo(
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
                    <td className="py-3 px-6">
                      <button
                        type="button"
                        className="btn-primary bg-green-600 text-2xl"
                        title="UPDATE ORDER DELIVERY"
                        onClick={() => {
                          !order.isDelivered
                            ? navigate(
                                `/user/orders/update/delivery/${order._id}`
                              )
                            : toast.info("Order Already Received");
                        }}
                      >
                        <FiEdit />
                      </button>
                    </td>
                    <td className="py-3 px-6">
                      <button
                        className="btn-primary text-2xl"
                        type="button"
                        title="INFO"
                        onClick={() => {
                          navigate(`/user/orders/${order._id}`);
                        }}
                      >
                        <BsInfo />
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

export default OrdersHistoryPage;
