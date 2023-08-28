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
    navigate("/user/orders/place-order");
  };

  useEffect(() => {
    if (!userData) {
      navigate("/user/signin?redirect=/user/orders/shipping");
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
              className="border rounded px-6 py-4 min-w-[18.75rem] md:min-w-[23.4375rem] space-y-4"
            >
              <h1 className="text-center">Shipping Information</h1>
              <div className="flex flex-col">
                <label className="font-bold">First Name</label>
                <input
                  type="text"
                  {...register("firstName", { value: userData.firstName })}
                  className="border rounded p-2"
                  placeholder="Update your first name"
                  name="firstName"
                />
                {errors.firstName?.message && (
                  <p className="yup-error">{errors.firstName?.message}</p>
                )}
              </div>
              <div className="flex flex-col">
                <label className="font-bold">Last Name</label>
                <input
                  type="text"
                  {...register("lastName", { value: userData.lastName })}
                  className="border rounded p-2"
                  placeholder="Update your last name"
                  name="lastName"
                />
                {errors.lastName?.message && (
                  <p className="yup-error">{errors.lastName?.message}</p>
                )}
              </div>
              <div className="flex flex-col">
                <label className="font-bold">Email</label>
                <input
                  type="email"
                  {...register("email", { value: userData.email })}
                  className="border rounded p-2"
                  placeholder="Update your email"
                  name="email"
                />
                {errors.email?.message && (
                  <p className="yup-error">{errors.email?.message}</p>
                )}
              </div>
              <div className="flex flex-col">
                <label className="font-bold">Address</label>
                <input
                  type="text"
                  {...register("address", { value: userData.address })}
                  className="border rounded p-2"
                  placeholder="Update your address"
                  name="address"
                />
                {errors.address?.message && (
                  <p className="yup-error">{errors.address?.message}</p>
                )}
              </div>
              <div className="flex flex-col mb-6">
                <label className="font-bold">Phone Number</label>
                <div className="flex items-cUpdate gap-4">
                  <button>+63</button>
                  <input
                    type="tel"
                    {...register("phoneNumber", {
                      value: userData.phoneNumber,
                    })}
                    className="border rounded p-2 flex-1"
                    placeholder="Update your phone number"
                    name="phoneNumber"
                  />
                </div>
                {errors.phoneNumber?.message && (
                  <p className="yup-error">{errors.phoneNumber?.message}</p>
                )}
              </div>
              <p className="font-bold">Payment Method</p>
              <select
                {...register("paymentMethod", {
                  value: paymentMethodName,
                })}
              >
                <option id="cod" value="Cash on Delivery">
                  Cash on Delivery
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
