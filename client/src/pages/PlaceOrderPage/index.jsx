import { useContext } from "react";
import { Store } from "../../context";
import { Link, useNavigate } from "react-router-dom";
import { roundToTwo } from "../../utilities";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Loading from "../../components/Loading";
import { postOrder } from "./order.api";
import { Helmet } from "react-helmet-async";

const PlaceOrderPage = () => {
  const navigate = useNavigate();
  const {
    state: {
      user: { userData, shippingData },
      cart: { cartItems },
    },
    dispatch: ctxDispatch,
  } = useContext(Store);

  const itemsPrice = roundToTwo(
    cartItems.reduce((a, c) => a + c.quantity * c.discountedPrice, 0)
  );
  const shippingPrice = itemsPrice > 100 ? roundToTwo(0) : roundToTwo(40);
  const totalPrice = itemsPrice + shippingPrice;
  const totalItems = cartItems.reduce((a, c) => a + c.quantity, 0);

  const { mutate, data, isSuccess, isError, error, isLoading } = useMutation(
    ["order"],
    (order) => postOrder(order, userData)
  );

  const submitHandler = () => {
    mutate({
      totalOrderItems: totalItems,
      orderItems: cartItems,
      shippingData,
      itemsPrice: itemsPrice,
      shippingPrice: shippingPrice,
      totalPrice: totalPrice,
    });
  };

  if (isSuccess) {
    ctxDispatch({ type: "CART_CLEAR" });
    localStorage.removeItem("cartItems");
    toast.success(data.message);
    navigate(`/user/order/${data.order._id}`);
  } else if (isError) {
    toast.error(error.message);
  }

  return (
    <>
      <Helmet>
        <title>Place Order</title>
      </Helmet>
      <div className="custom-container">
        <h1 className="text-center">Place Order</h1>
        <div className="grid grid-cols-12 gap-4 items-start">
          <div className="col-span-8 border rounded px-6 py-4 space-y-4">
            <div>
              <h2 className="text-center">Shipping Information</h2>
              <p>
                <span className="font-bold">Name: </span>
                {`${shippingData.firstName} ${shippingData.lastName}`}
              </p>
              <p>
                <span className="font-bold">Email: </span>
                {shippingData.email}
              </p>
              <p>
                <span className="font-bold">Phone Number: </span>
                {shippingData.phoneNumber}
              </p>
              <p>
                <span className="font-bold">Address: </span>
                {shippingData.address}
              </p>
              <p>
                <span className="font-bold">Payment Method: </span>
                {shippingData.paymentMethod}
              </p>
            </div>
            <div>
              <h2 className="text-center">Your Orders</h2>
              {cartItems.map((item) => (
                <div className="grid grid-cols-12 items-center" key={item._id}>
                  <div className="col-span-2">
                    <img src={item.image} alt={item.name} />
                  </div>
                  <div className="col-span-4">{item.name}</div>
                  <div className="col-span-2">x{item.quantity}</div>
                  <div className="col-span-4">{`$ ${(
                    item.discountedPrice * item.quantity
                  ).toLocaleString()}`}</div>
                </div>
              ))}
              <Link to="/" className="text-primary">
                Edit
              </Link>
            </div>
          </div>
          <div className="col-span-4 border rounded px-6 py-4 space-y-4">
            <h2 className="text-center">Order Summary</h2>
            <div className="flex justify-between">
              <p className="font-bold">Items</p>
              <p>{`$ ${itemsPrice.toLocaleString()}`}</p>
            </div>
            <div className="flex justify-between">
              <p className="font-bold">Shipping</p>
              <p>{`$ ${roundToTwo(shippingPrice).toLocaleString()}`}</p>
            </div>
            <div className="flex justify-between">
              <p className="font-bold">Order Total</p>
              <p>{`$ ${roundToTwo(totalPrice).toLocaleString()}`}</p>
            </div>
            <button
              type="button"
              className="btn-primary"
              disabled={cartItems.length === 0 || isLoading}
              onClick={submitHandler}
            >
              Place Order
            </button>
            {isLoading ? <Loading /> : null}
          </div>
        </div>
      </div>
    </>
  );
};

export default PlaceOrderPage;
