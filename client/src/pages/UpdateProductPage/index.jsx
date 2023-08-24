import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Loading from "../../components/Loading";
import MessageBox from "../../components/MessageBox";
import { Helmet } from "react-helmet-async";
import { useContext } from "react";
import { Store } from "../../context";
import { useNavigate, useParams } from "react-router-dom";
import { schema } from "./product.validation";
import { getProduct, patchProduct } from "./product.api";

const UpdateProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    state: {
      user: { userData },
    },
  } = useContext(Store);

  const {
    data: product,
    isLoading: getIsLoading,
    isError: getIsError,
    error: getError,
  } = useQuery(["product"], () => getProduct(id));

  const queryClient = useQueryClient();
  const { mutate, isLoading, isSuccess } = useMutation(
    ["product"],
    (product) => patchProduct(product, id, userData),
    {
      onSuccess: (data) =>
        queryClient.setQueryData(["product"], (old) => {
          return { ...old, stocks: data.stocks, category: data.category };
        }),
    }
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const submitHandler = (value) => {
    mutate(value);
  };

  return (
    <>
      {getIsLoading ? (
        <Loading />
      ) : getIsError ? (
        <MessageBox danger>{getError.message}</MessageBox>
      ) : (
        <>
          <Helmet>
            <title>Add {product.name} Stocks</title>
          </Helmet>
          <div className="custom-container flex justify-center">
            <div className="border rounded px-6 py-4 min-w-[375px] space-y-6">
              <h1 className="text-center capitalize">Add Stocks</h1>

              <form
                className="flex items-center"
                onSubmit={handleSubmit(submitHandler)}
              >
                <select {...register("stocks")}>
                  {[...Array(100).keys()].map((stock) => (
                    <option value={stock + 1} key={stock + 1}>
                      {stock + 1}
                    </option>
                  ))}
                </select>
                {errors.stocks?.message && (
                  <p className="yup-error">{errors.stocks?.message}</p>
                )}
                &nbsp;
                <button type="submit" className="btn-primary">
                  Add
                </button>
              </form>
              {isLoading ? (
                <Loading />
              ) : isSuccess ? (
                navigate("/admin/products")
              ) : null}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default UpdateProductPage;
