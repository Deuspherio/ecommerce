import { useQuery } from "@tanstack/react-query";
import { Store } from "../../context";
import { useContext, useState } from "react";
import Loading from "../../components/Loading";
import { roundToTwo } from "../../utilities";
import { useNavigate } from "react-router-dom";
import { getOrders } from "./orders.api";
import { Helmet } from "react-helmet-async";
import Pagination from "../../components/Pagination";
import { BsCheck2, BsInfo } from "react-icons/bs";

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
      ) : (
        <div className="custom-container">
          <h1 className="text-center">Orders History</h1>
          <div className="overflow-x-auto relative">
            <table className="w-full rounded border">
              <thead className="text-lg w-full text-gray-700 uppercase">
                <tr>
                  <th scope="col">DATE</th>
                  <th scope="col">TOTAL</th>
                  <th scope="col">PAID</th>
                  <th scope="col">DELIVERED</th>
                  <th scope="col" colSpan={2}>
                    ACTIONS
                  </th>
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
                    <td>
                      <div className="flex items-center justify-center">
                        {!order.isDelivered ? (
                          <button
                            type="button"
                            className="btn-primary bg-green-600 text-2xl w-auto"
                            title="ORDER RECEIVED?"
                          >
                            <BsCheck2 />
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="btn-primary bg-green-600 text-2xl w-auto"
                            title="ORDER RECEIVED"
                          >
                            <BsCheck2 />
                          </button>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center justify-center">
                        <button
                          className="btn-primary text-2xl w-auto"
                          type="button"
                          title="ORDER INFO"
                          onClick={() => {
                            navigate(`/user/order/${order._id}`);
                          }}
                        >
                          <BsInfo />
                        </button>
                      </div>
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
