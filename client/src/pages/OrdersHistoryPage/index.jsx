import { useQuery } from "@tanstack/react-query";
import { Store } from "../../context";
import { useContext, useState } from "react";
import Loading from "../../components/Loading";
import { roundToTwo } from "../../utilities";
import { useNavigate } from "react-router-dom";
import { getOrders } from "./orders.api";
import { Helmet } from "react-helmet-async";
import Pagination from "../../components/Pagination";

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
    isSuccess,
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
      ) : isSuccess ? (
        <div className="custom-container">
          <h1 className="text-center">Orders History</h1>
          <div className="overflow-x-auto relative">
            <table className="w-full text-left text-gray-500 rounded border">
              <thead className="text-lg w-full text-gray-700 uppercase border">
                <tr>
                  <th scope="col" className="py-3 px-6 border">
                    DATE
                  </th>
                  <th scope="col" className="py-3 px-6 border">
                    TOTAL
                  </th>
                  <th scope="col" className="py-3 px-6 border">
                    PAID
                  </th>
                  <th scope="col" className="py-3 px-6 border">
                    DELIVERED
                  </th>
                  <th scope="col" className="py-3 px-6 border" colSpan={2}>
                    ACTIONS
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(firstOrderIndex, lastOrderIndex).map((order) => (
                  <tr
                    key={order._id}
                    className="transition-bg hover:bg-slate-100"
                  >
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
                        <button className="btn-primary" type="button">
                          Order Received
                        </button>
                      ) : (
                        <button className="btn-primary" type="button" disabled>
                          Order Received
                        </button>
                      )}
                    </td>
                    <td>
                      <button
                        className="btn-primary"
                        type="button"
                        onClick={() => {
                          navigate(`/user/order/${order._id}`);
                        }}
                      >
                        Details
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
      ) : null}
    </>
  );
};

export default OrdersHistoryPage;
