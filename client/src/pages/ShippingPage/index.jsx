import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { Helmet } from "react-helmet-async";
import { useContext, useEffect } from "react";
import { Store } from "../../context";
import { schema } from "./shipping.validation";

const ShippingPage = () => {
  const navigate = useNavigate();
  const {
    state: {
      user: { userData, shippingData },
    },
    dispatch: ctxDispatch,
  } = useContext(Store);

  const paymentMethodName = shippingData
    ? shippingData.paymentMethod
    : "Cash on Delivery";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    shouldUnregister: true,
  });

  const submitHandler = (value) => {
    ctxDispatch({
      type: "SAVE_SHIPPING_DATA",
      payload: value,
    });
    localStorage.setItem("shippingData", JSON.stringify(value));
    navigate("/user/order/place-order");
  };

  useEffect(() => {
    if (!userData) {
      navigate("/user/signin?redirect=/user/order/shipping");
    }
  }, [navigate, userData]);

  return (
    <>
      <Helmet>
        <title>Shipping Information</title>
      </Helmet>
      <div className="custom-container">
        {userData ? (
          <div className="flex justify-center">
            <form
              onSubmit={handleSubmit(submitHandler)}
              className="border rounded px-6 py-4 min-w-[375px] space-y-4"
            >
              <h1 className="text-center">Shipping Information</h1>
              <div className="flex flex-col">
                <label>First Name</label>
                <input
                  type="text"
                  {...register("firstName", { value: userData.firstName })}
                  className="border rounded p-2"
                  placeholder="Update your first name"
                  name="firstName"
                  disabled
                />
                {errors.firstName?.message && (
                  <p className="yup-error">{errors.firstName?.message}</p>
                )}
              </div>
              <div className="flex flex-col">
                <label>Last Name</label>
                <input
                  type="text"
                  {...register("lastName", { value: userData.lastName })}
                  className="border rounded p-2"
                  placeholder="Update your last name"
                  name="lastName"
                  disabled
                />
                {errors.lastName?.message && (
                  <p className="yup-error">{errors.lastName?.message}</p>
                )}
              </div>
              <div className="flex flex-col">
                <label>Email</label>
                <input
                  type="email"
                  {...register("email", { value: userData.email })}
                  className="border rounded p-2"
                  placeholder="Update your email"
                  name="email"
                  disabled
                />
                {errors.email?.message && (
                  <p className="yup-error">{errors.email?.message}</p>
                )}
              </div>
              <div className="flex flex-col">
                <label>Address</label>
                <input
                  type="text"
                  {...register("address", { value: userData.address })}
                  className="border rounded p-2"
                  placeholder="Update your address"
                  name="address"
                  disabled
                />
                {errors.address?.message && (
                  <p className="yup-error">{errors.address?.message}</p>
                )}
              </div>
              <div className="flex flex-col mb-6">
                <label>Phone Number</label>
                <div className="flex items-cUpdate gap-4">
                  <button disabled>+63</button>
                  <input
                    type="tel"
                    {...register("phoneNumber", {
                      value: userData.phoneNumber,
                    })}
                    className="border rounded p-2 flex-1"
                    placeholder="Update your phone number"
                    name="phoneNumber"
                    disabled
                  />
                </div>
                {errors.phoneNumber?.message && (
                  <p className="yup-error">{errors.phoneNumber?.message}</p>
                )}
              </div>
              <p>Payment Method</p>
              <select
                {...register("paymentMethod", {
                  value: paymentMethodName,
                })}
              >
                <option id="cod" value="Cash on Delivery">
                  Cash on Delivery
                </option>
                <option id="gcash" value="Gcash" disabled>
                  GCASH <span className="text-sm">(coming soon)</span>
                </option>
                <option id="paymaya" value="Paymaya" disabled>
                  Paymaya <span className="text-sm">(coming soon)</span>
                </option>
                <option id="paypal" value="Paypal" disabled>
                  Paypal <span className="text-sm">(coming soon)</span>
                </option>
              </select>
              {errors.paymentMethod?.message && (
                <p className="yup-error">{errors.paymentMethod?.message}</p>
              )}
              <button type="submit" className="btn-primary">
                Save
              </button>
            </form>
          </div>
        ) : null}
      </div>
    </>
  );
};

export default ShippingPage;
