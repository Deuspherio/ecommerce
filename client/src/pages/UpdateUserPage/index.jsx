import { useMutation, useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { Store } from "../../context";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../../components/Loading";
import MessageBox from "../../components/MessageBox";
import { Helmet } from "react-helmet-async";
import { schema } from "./user.validation";
import { getUser, updateUser } from "./user.api";

const UpdateUserPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    state: {
      user: { userData },
    },
  } = useContext(Store);

  const {
    data: getUserData,
    isLoading: getUserIsLoading,
    isSuccess: getUserIsSuccess,
    isError: getUserIsError,
    error: getUserError,
  } = useQuery(["users"], () => getUser(id, userData));

  const {
    mutate,
    isLoading: updateUserIsLoading,
    isError: updateUserIsError,
    error: updateUserError,
  } = useMutation((user) => updateUser(user, id, userData), {
    onSuccess: (data) => {
      console.log(data);
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const submitHandler = (values) => {
    console.log(values);
  };

  return (
    <>
      {getUserIsLoading ? (
        <Loading />
      ) : getUserIsError ? (
        <MessageBox danger>{getUserError.message}</MessageBox>
      ) : (
        <div className="custom-container flex justify-center">
          <Helmet>
            <title>Update User</title>
          </Helmet>
          <form
            onSubmit={handleSubmit(submitHandler)}
            className="border rounded px-6 py-4 min-w-[375px] space-y-6"
          >
            <h1 className="text-center capitalize">{`Update ${getUserData.firstName} ${getUserData.lastName}`}</h1>
            <div className="flex flex-col">
              <label>User Email</label>
              <input
                type="email"
                {...register("email", {
                  value: getUserData.email,
                })}
                className="border rounded p-2"
                placeholder="Update user email"
                name="email"
              />
              {errors.email?.message && (
                <p className="">{errors.email?.message}</p>
              )}
            </div>
            <div className="flex flex-col">
              <label>User Address</label>
              <input
                type="text"
                {...register("address", {
                  value: getUserData.address,
                })}
                className="border rounded p-2"
                placeholder="Update user address"
                name="address"
              />
              {errors.address?.message && (
                <p className="">{errors.address?.message}</p>
              )}
            </div>
            <div className="flex flex-col">
              <label>User Phone Number</label>
              <div className="flex items-cUpdate gap-4">
                <button disabled>+63</button>
                <input
                  type="tel"
                  {...register("phoneNumber", {
                    value: getUserData.phoneNumber,
                  })}
                  className="border rounded p-2 flex-1"
                  placeholder="Update user phone number"
                  name="phoneNumber"
                />
              </div>
              {errors.phoneNumber?.message && (
                <p className="text-red">{errors.phoneNumber?.message}</p>
              )}
            </div>
            <button type="submit" className="btn-primary">
              Update
            </button>
            {updateUserIsLoading ? <Loading /> : null}
          </form>
        </div>
      )}
    </>
  );
};

export default UpdateUserPage;
