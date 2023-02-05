import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { roundToTwo } from "../../utilities";
import { useNavigate, useParams } from "react-router-dom";
import { useContext } from "react";
import { Store } from "../../context";
import Loading from "../../components/Loading";
import { getOrder } from "./order.api";

const OrderPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    state: {
      user: { userData },
    },
  } = useContext(Store);

  const {
    data: order,
    error,
    isSuccess,
    isLoading,
    isError,
  } = useQuery(["order"], () => getOrder(id, userData));

  return (
    <>
      <Helmet>
        <title>Order Information</title>
      </Helmet>
      {isLoading ? (
        <Loading />
      ) : isError ? (
        <p>{error.message}</p>
      ) : isSuccess ? (
        <div className="custom-container">
          <h1 className="text-center">Order Information</h1>
          <div className="grid grid-cols-12 gap-4 items-start">
            <div className="col-span-8 border rounded px-6 py-4 space-y-4">
              <h2 className="text-center">Shipping Information</h2>
              <div>
                <p>
                  <span className="font-bold">Name: </span>
                  {`${order.shippingData.firstName} ${order.shippingData.lastName}`}
                </p>
                <p>
                  <span className="font-bold">Email: </span>
                  {order.shippingData.email}
                </p>
                <p>
                  <span className="font-bold">Phone Number: </span>
                  {order.shippingData.phoneNumber}
                </p>
                <p>
                  <span className="font-bold">Address: </span>
                  {order.shippingData.address}
                </p>
                <p>
                  <span className="font-bold">Payment Method: </span>
                  {order.shippingData.paymentMethod}
                </p>
              </div>
              <div>
                <h2 className="text-center">
                  {userData.isAdmin ? "Customer's Orders" : "Your Orders"}
                </h2>
                {order.orderItems.map((item) => (
                  <div
                    className="grid grid-cols-12 items-center"
                    key={item._id}
                  >
                    <div className="col-span-2">
                      <img src={item.image} alt={item.name} />
                    </div>
                    <div className="col-span-4">{item.name}</div>
                    <div className="col-span-2">x{item.quantity}</div>
                    <div className="col-span-4">{`₱ ${(
                      item.discountedPrice * item.quantity
                    ).toLocaleString()}`}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="col-span-4 border rounded px-6 py-4 space-y-4">
              <h2 className="text-center">Order Summary</h2>
              <div className="flex justify-between">
                <p className="font-bold">Items</p>
                <p>{`₱ ${order.itemsPrice.toLocaleString()}`}</p>
              </div>
              <div className="flex justify-between">
                <p className="font-bold">Shipping</p>
                <p>{`₱ ${roundToTwo(order.shippingPrice).toLocaleString()}`}</p>
              </div>
              <div className="flex justify-between">
                <p className="font-bold">Order Total</p>
                <p>{`₱ ${roundToTwo(order.totalPrice).toLocaleString()}`}</p>
              </div>
              <button
                type="button"
                className="btn-primary"
                onClick={() =>
                  userData.isAdmin
                    ? navigate("/admin/orders")
                    : navigate("/user/order/history")
                }
              >
                View Orders
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default OrderPage;
