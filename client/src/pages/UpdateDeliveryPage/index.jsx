import { useMutation, useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useContext } from "react";
import { Store } from "../../context";
import Loading from "../../components/Loading";
import { getOrder, updateDelivery } from "./order.api";
import { schema } from "./delivery.validation";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const UpdateDeliveryPage = () => {
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
    isLoading,
    isError,
  } = useQuery(["order"], () => getOrder(id, userData));

  const { mutate, isLoading: deliveryIsLoading } = useMutation(
    (values) => updateDelivery(id, values, userData),
    {
      onSuccess: (data) => {
        toast.success(data.message);
        navigate("/user/orders/history");
      },
    }
  );

  const { register, handleSubmit } = useForm({
    resolver: yupResolver(schema),
  });

  const updateDeliveryOrder = (values) => {
    if (window.confirm("Are you sure?")) {
      mutate(values);
    }
  };

  return (
    <>
      <Helmet>
        <title>Update Order Delivery</title>
      </Helmet>
      {isLoading ? (
        <Loading />
      ) : isError ? (
        <p>{error.message}</p>
      ) : (
        <div className="custom-container flex justify-center">
          {!order.isDelivered ? (
            <div className="border rounded px-6 py-4 min-w-[18.75rem] md:min-w-[23.4375rem] space-y-6">
              <h1 className="text-center">Update Order Delivery</h1>
              <form
                onSubmit={handleSubmit(updateDeliveryOrder)}
                className="flex items-center"
              >
                <select {...register("delivery")}>
                  <option value={true}>Delivered Today</option>
                  <option value={false}>Not yet Fulfilled</option>
                </select>
                &nbsp;
                <button
                  className="btn-primary"
                  type="submit"
                  disabled={deliveryIsLoading}
                >
                  Update
                </button>
              </form>
              {deliveryIsLoading ? <Loading /> : null}
            </div>
          ) : (
            <Navigate to="/user/orders/history" />
          )}
        </div>
      )}
    </>
  );
};

export default UpdateDeliveryPage;
