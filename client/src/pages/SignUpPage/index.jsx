import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Loading from "../../components/Loading";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useContext } from "react";
import { Store } from "../../context";
import { getError } from "../../utilities";
import { postUser } from "./user.api";
import { schema } from "./user.validation";

const SignUpPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectUrl = searchParams.get("redirect");
  const redirect = redirectUrl ? redirectUrl : "/";
  const { dispatch: ctxDispatch } = useContext(Store);

  const { mutate, data, isLoading, isSuccess, isError, error } = useMutation(
    (user) => postUser(user)
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const submitHandler = (values) => {
    mutate(values);
  };

  useEffect(() => {
    if (isSuccess) {
      ctxDispatch({ type: "USER_SIGNIN", payload: data });
      localStorage.setItem("userData", JSON.stringify(data));
      toast.success("Created succesfully");
      navigate(redirect);
    } else if (isError) {
      toast.error(getError(error));
    }
  }, [ctxDispatch, data, error, isError, isSuccess, navigate, redirect]);

  return (
    <>
      <Helmet>
        <title>Sign Up</title>
      </Helmet>
      <div className="custom-container flex justify-center">
        <form
          onSubmit={handleSubmit(submitHandler)}
          className="border rounded px-6 py-4 min-w-[375px] space-y-6"
        >
          <h1 className="text-center">Sign Up</h1>
          <div className="flex flex-col">
            <label className="font-bold">First Name</label>
            <input
              type="text"
              {...register("firstName")}
              className="border rounded p-2"
              placeholder="Enter your first name"
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
              {...register("lastName")}
              className="border rounded p-2"
              placeholder="Enter your last name"
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
              {...register("email")}
              className="border rounded p-2"
              placeholder="Enter your email"
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
              {...register("address")}
              className="border rounded p-2"
              placeholder="Enter your address"
              name="address"
            />
            {errors.address?.message && (
              <p className="yup-error">{errors.address?.message}</p>
            )}
          </div>
          <div className="flex flex-col">
            <label className="font-bold">Phone Number</label>
            <div className="flex items-cUpdate gap-4">
              <button disabled>+63</button>
              <input
                type="tel"
                {...register("phoneNumber")}
                className="border rounded p-2 flex-1"
                placeholder="Enter your phone number"
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
              placeholder="Enter your password"
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
            Sign Up
          </button>
          {isLoading ? <Loading /> : null}
          <div className="text-center">
            <span>Already have an account? </span>
            <Link
              to={`/user/signin?redirect=${redirect}`}
              className="text-primary"
            >
              Sign In
            </Link>
          </div>
        </form>
      </div>
    </>
  );
};

export default SignUpPage;
