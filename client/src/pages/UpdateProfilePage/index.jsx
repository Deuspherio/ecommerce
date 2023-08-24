import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { yupResolver } from "@hookform/resolvers/yup";
import { Helmet } from "react-helmet-async";
import Loading from "../../components/Loading";
import { useContext, useEffect } from "react";
import { Store } from "../../context";
import { getError } from "../../utilities";
import { schema } from "./user.validation";
import { patchUser } from "./user.api";

const UpdateProfilePage = () => {
  const navigate = useNavigate();
  const {
    state: {
      user: {
        userData: {
          _id,
          firstName,
          lastName,
          email,
          address,
          phoneNumber,
          token,
        },
      },
    },
    dispatch: ctxDispatch,
  } = useContext(Store);

  const { mutate, data, isLoading, isError, error, isSuccess } = useMutation(
    (user) => patchUser(user, token)
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    shouldUnregister: true,
  });

  const submitHandler = (values) => {
    const newValues = { ...values, id: _id };
    mutate(newValues);
  };

  useEffect(() => {
    if (isSuccess) {
      ctxDispatch({ type: "USER_SIGNIN", payload: data });
      localStorage.setItem("userData", JSON.stringify(data));
      navigate("/");
    } else if (isError) {
      toast.error(getError(error));
    }
  }, [ctxDispatch, data, error, isError, isSuccess, navigate]);

  return (
    <>
      <Helmet>
        <title>Update Profile</title>
      </Helmet>
      <div className="custom-container flex flex-col items-center">
        <form
          onSubmit={handleSubmit(submitHandler)}
          className="border rounded px-6 py-4 min-w-[375px] space-y-6"
        >
          <h1 className="text-center">Update Profile</h1>
          <div className="flex flex-col">
            <label className="font-bold">First Name</label>
            <input
              type="text"
              {...register("firstName", { value: firstName })}
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
              {...register("lastName", { value: lastName })}
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
              {...register("email", { value: email })}
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
              {...register("address", { value: address })}
              className="border rounded p-2"
              placeholder="Update your address"
              name="address"
            />
            {errors.address?.message && (
              <p className="yup-error">{errors.address?.message}</p>
            )}
          </div>
          <div className="flex flex-col">
            <label className="font-bold">Phone Number</label>
            <div className="flex items-center gap-4">
              <button disabled>+63</button>
              <input
                type="tel"
                {...register("phoneNumber", {
                  value: phoneNumber,
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
          <div className="flex flex-col">
            <label className="font-bold">Password</label>
            <input
              type="password"
              {...register("password")}
              className="border rounded p-2"
              placeholder="Update your password"
              name="password"
            />
            {errors.password?.message && (
              <p className="yup-error">{errors.password?.message}</p>
            )}
          </div>
          <div className="flex flex-col">
            <label className="font-bold">Confirm Password</label>
            <input
              type="password"
              {...register("passwordConfirmation")}
              className="border rounded p-2"
              placeholder="Confirm your password"
              name="passwordConfirmation"
            />
            {errors.passwordConfirmation?.message && (
              <p className="yup-error">
                {errors.passwordConfirmation?.message}
              </p>
            )}
          </div>
          <button type="submit" className="btn-primary">
            Update Profile
          </button>
          {isLoading ? <Loading /> : null}
        </form>
      </div>
    </>
  );
};

export default UpdateProfilePage;
