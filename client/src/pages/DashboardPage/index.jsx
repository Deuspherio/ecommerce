import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import SalesGraph from "../../components/SalesGraph";
import Loading from "../../components/Loading";
import ProductsStocks from "../../components/ProductsStocks";
import { Store } from "../../context";
import { roundToTwo } from "../../utilities";
import { getSummaries } from "./summaries.api";
import { Helmet } from "react-helmet-async";

const DashboardPage = () => {
  const { state } = useContext(Store);
  const {
    user: { userData },
  } = state;
  const {
    data: summary,
    isLoading,
    isError,
    error,
    isSuccess,
  } = useQuery(["summaries"], () => getSummaries(userData));
  return (
    <>
      <Helmet>
        <title>Overview</title>
      </Helmet>
      {isLoading ? (
        <Loading />
      ) : isError ? (
        <p>{error.message}</p>
      ) : isSuccess ? (
        <div className="custom-container">
          <h1 className="text-center">Dashboard Overview</h1>
          <div className="grid grid-cols-3 gap-4">
            <div className="border rounded px-6 py-4">
              <h4 className="text-lg font-bold">Total of Users:</h4>
              <p>{`${
                summary.users && summary.users[0] && summary.users.length !== 0
                  ? summary.users[0].totalUsers
                  : 0
              } users`}</p>
            </div>
            <div className="border rounded px-6 py-4">
              <h4 className="text-lg font-bold">Total of Orders:</h4>
              <p>{`${
                summary.orders &&
                summary.orders[0] &&
                summary.orders.length !== 0
                  ? summary.orders[0].totalOrders
                  : 0
              } orders`}</p>
            </div>
            <div className="border rounded px-6 py-4">
              <h4 className="text-lg font-bold">Total of Profits:</h4>
              <p>{`₱ ${
                summary.orders &&
                summary.orders[0] &&
                summary.orders.length !== 0
                  ? roundToTwo(summary.orders[0].totalSales).toLocaleString()
                  : 0
              }`}</p>
            </div>
          </div>
          <SalesGraph summary={summary} />
          <ProductsStocks summary={summary} />
        </div>
      ) : null}
    </>
  );
};

export default DashboardPage;
