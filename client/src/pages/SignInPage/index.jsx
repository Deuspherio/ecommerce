import { useContext, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Store } from "../../context";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { getError } from "../../utilities";
import Loading from "../../components/Loading";
import { schema } from "./user.validation";
import { postUser } from "./user.api";

const SignInPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectUrl = searchParams.get("redirect");
  const redirect = redirectUrl ? redirectUrl : "/";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const { mutate, isLoading, isError, data, isSuccess, error } = useMutation(
    (user) => postUser(user)
  );

  const {
    state: { user },
    dispatch: ctxDispatch,
  } = useContext(Store);

  const submitHandler = (data) => {
    mutate(data);
  };

  useEffect(() => {
    if (user.userData) {
      navigate(redirect);
    } else if (isSuccess) {
      ctxDispatch({ type: "USER_SIGNIN", payload: data });
      localStorage.setItem("userData", JSON.stringify(data));
      navigate(redirect || "/");
    } else if (isError) {
      toast.error(getError(error));
    }
  }, [
    ctxDispatch,
    error,
    isError,
    isSuccess,
    data,
    navigate,
    redirect,
    user.userData,
  ]);
  return (
    <>
      <Helmet>
        <title>Sign In</title>
      </Helmet>
      <div className="custom-container flex justify-center">
        <form
          onSubmit={handleSubmit(submitHandler)}
          className="border rounded px-6 py-4 min-w-[375px] space-y-6"
        >
          <h1 className="text-center">Sign In</h1>
          <div className="flex flex-col">
            <label>Email</label>
            <input
              type="email"
              {...register("email")}
              className="border rounded p-2"
              placeholder="Enter your email"
            />
            {errors.email?.message && (
              <p className="">{errors.email?.message}</p>
            )}
          </div>
          <div className="flex flex-col">
            <label>Password</label>
            <input
              type="password"
              {...register("password")}
              className="border rounded p-2"
              placeholder="Enter your password"
            />
            {errors.password?.message && (
              <p className="">{errors.password?.message}</p>
            )}
          </div>
          <button type="submit" className="btn-primary">
            Sign In
          </button>
          {isLoading ? <Loading /> : null}
          <div className="text-center">
            <span>New Customer? </span>
            <Link
              to={`/user/signup?redirect=${redirect}`}
              className="text-primary"
            >
              Create an Account
            </Link>
          </div>
        </form>
      </div>
    </>
  );
};

export default SignInPage;
