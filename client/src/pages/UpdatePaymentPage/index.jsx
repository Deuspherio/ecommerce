import { useMutation, useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useContext } from "react";
import { Store } from "../../context";
import Loading from "../../components/Loading";
import { getOrder, updatePayment } from "./order.api";
import { schema } from "./payment.validation";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const UpdatePaymentPage = () => {
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

  const { mutate, isLoading: paymentIsLoading } = useMutation(
    (values) => updatePayment(id, values, userData),
    {
      onSuccess: (data) => {
        toast.success(data.message);
        navigate("/admin/orders");
      },
    }
  );

  const { register, handleSubmit } = useForm({
    resolver: yupResolver(schema),
  });

  const updatePaymentOrder = (values) => {
    if (window.confirm("Are you sure?")) {
      mutate(values);
    }
  };

  return (
    <>
      <Helmet>
        <title>Update Order Payment</title>
      </Helmet>
      {isLoading ? (
        <Loading />
      ) : isError ? (
        <p>{error.message}</p>
      ) : (
        <div className="custom-container flex justify-center">
          {!order.isPaid ? (
            <div className="border rounded px-6 py-4 min-w-[375px] space-y-6">
              <h1 className="text-center">Update Order Payment</h1>
              <form
                onSubmit={handleSubmit(updatePaymentOrder)}
                className="flex items-center"
              >
                <select {...register("payment")}>
                  <option value={true}>Paid Today</option>
                  <option value={false}>Not yet Fulfilled</option>
                </select>
                &nbsp;
                <button
                  className="btn-primary"
                  type="submit"
                  disabled={paymentIsLoading}
                >
                  Update
                </button>
              </form>
            </div>
          ) : (
            <Navigate to="/user/order/history" />
          )}
        </div>
      )}
    </>
  );
};

export default UpdatePaymentPage;
