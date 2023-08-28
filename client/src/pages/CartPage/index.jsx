import { useContext } from "react";
import { Store } from "../../context";
import { AiOutlineDelete } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import MessageBox from "../../components/MessageBox";

const CartPage = () => {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;
  const navigate = useNavigate();

  const removeItemHandler = (item) => {
    ctxDispatch({
      type: "CART_REMOVE_ITEM",
      payload: item,
    });
  };
  return (
    <>
      <Helmet>
        <title>Cart</title>
      </Helmet>
      <div className="custom-container">
        <div className="grid grid-cols-12 gap-4 items-start">
          <div className="col-span-12 lg:col-span-8 border rounded px-6 py-4">
            <h1 className="text-center">Orders</h1>
            <div className="divide-y">
              {cartItems.length > 0 ? (
                cartItems.map((item) => (
                  <div
                    className="grid grid-cols-12 gap-4 items-center py-4"
                    key={item._id}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="col-span-3 md:col-span-1"
                    />
                    <Link
                      to={`/product/${item.slug}`}
                      className="col-span-8 md:col-span-4 text-sm lg:text-base"
                    >
                      {item.name}
                    </Link>
                    <p className="col-span-1">x{item.quantity}</p>
                    <div className="col-span-8 md:col-span-3">
                      {item.currentPrice >= item.price ? (
                        <p>{`$ ${item.currentPrice}`}</p>
                      ) : (
                        <div className="flex items-center gap-4">
                          <p className="text-sm line-through">{`₱ ${item.price}`}</p>
                          <p className="font-bold">{`$ ${item.currentPrice}`}</p>
                        </div>
                      )}
                    </div>
                    <button
                      className="col-span-4 md:col-span-2 btn-primary bg-red-600 text-xl"
                      onClick={() => removeItemHandler(item)}
                    >
                      <AiOutlineDelete />
                    </button>
                  </div>
                ))
              ) : (
                <MessageBox info>Cart is empty</MessageBox>
              )}
            </div>
          </div>
          <div className="col-span-12 lg:col-span-4 flex justify-center lg:justify-start">
            <div className="w-full md:max-w-[23.4375rem] lg:max-w-full border rounded px-6 py-4 space-y-4">
              <h2 className="text-center">Partial Total Price</h2>
              <div className="flex justify-between items-center">
                <h4>Total Item:</h4>
                <p>{`${cartItems.reduce(
                  (a, c) => a + c.quantity,
                  0
                )} items`}</p>
              </div>
              <div className="flex justify-between items-center">
                <h4>Total Price:</h4>
                <div className="flex items-center space-x-2">
                  {cartItems.reduce((a, c) => a + c.price * c.quantity, 0) <=
                  cartItems.reduce(
                    (a, c) =>
                      a +
                      (c.currentPrice ? c.currentPrice : c.price) * c.quantity,
                    0
                  ) ? (
                    <h4 className="mb-0">{`$ ${cartItems
                      .reduce(
                        (a, c) =>
                          a +
                          (c.currentPrice ? c.currentPrice : c.price) *
                            c.quantity,
                        0
                      )
                      .toLocaleString()}`}</h4>
                  ) : (
                    <>
                      <p className="line-through text-sm">{`$ ${cartItems
                        .reduce((a, c) => a + c.price * c.quantity, 0)
                        .toLocaleString()}`}</p>
                      <h4 className="mb-0">{`$ ${cartItems
                        .reduce(
                          (a, c) =>
                            a +
                            (c.currentPrice ? c.currentPrice : c.price) *
                              c.quantity,
                          0
                        )
                        .toLocaleString()}`}</h4>
                    </>
                  )}
                </div>
              </div>
              <button
                className={
                  cartItems.length > 0
                    ? "btn-primary"
                    : "px-6 py-4 w-full bg-white border rounded text-black"
                }
                disabled={cartItems.length === 0}
                onClick={() =>
                  navigate("/user/signin?redirect=/user/orders/shipping")
                }
              >
                Check Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartPage;
