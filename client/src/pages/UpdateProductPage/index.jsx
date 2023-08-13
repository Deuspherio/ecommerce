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
          return { ...old, stocks: data.stocks };
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
            <title>Update {product.name}</title>
          </Helmet>
          <div className="custom-container flex justify-center">
            <form
              onSubmit={handleSubmit(submitHandler)}
              className="border rounded px-6 py-4 min-w-[375px] space-y-6"
            >
              <h1 className="text-center capitalize">Update Product</h1>
              <div className="flex flex-col">
                <label>Product Name</label>
                <input
                  type="text"
                  {...register("name", {
                    value: product.name,
                  })}
                  className="border rounded p-2"
                  placeholder="Update the product name"
                  name="name"
                  disabled
                />
                {errors.name?.message && (
                  <p className="border rounded p-2">{errors.name?.message}</p>
                )}
              </div>
              <div className="flex flex-col">
                <label>Product Main Image</label>
                <input
                  type="file"
                  {...register("images")}
                  className="border rounded p-2"
                  disabled
                  placeholder="Update the product images"
                  name="image"
                />
                {errors.image?.message && (
                  <p className="">{errors.image?.message}</p>
                )}
              </div>
              <div className="flex flex-col">
                <label>Product Images</label>
                <input
                  type="file"
                  disabled
                  {...register("images")}
                  className="border rounded p-2"
                  placeholder="Update the product images"
                  name="images"
                />
                {errors.images?.message && (
                  <p className="">{errors.images?.message}</p>
                )}
              </div>
              <div className="flex flex-col">
                <label>Product Category</label>
                <select
                  {...register("category", {
                    value: product.category,
                  })}
                  disabled
                >
                  <option value="electronics">Electronics</option>
                </select>
                {errors.category?.message && (
                  <p className="">{errors.category?.message}</p>
                )}
              </div>
              <div className="flex flex-col">
                <label>Product Price</label>
                <input
                  type="number"
                  step=".01"
                  {...register("price", {
                    value: product.price,
                  })}
                  className="border rounded p-2"
                  placeholder="Update the product price"
                  name="price"
                  disabled
                />
                {errors.price?.message && (
                  <p className="">{errors.price?.message}</p>
                )}
              </div>
              <div className="flex flex-col">
                <label>Product Stocks</label>
                <input
                  type="number"
                  {...register("stocks", {
                    value: product.stocks,
                  })}
                  className="border rounded p-2"
                  placeholder="Update the product stocks"
                  name="stocks"
                  min="0"
                />
                {errors.stocks?.message && (
                  <p className="yup-error">{errors.stocks?.message}</p>
                )}
              </div>
              <p className="text-red-600 text-xs">
                Note: Only stocks can be changed
              </p>
              <button type="submit" className="btn-primary">
                Update Product
              </button>
              {isLoading ? (
                <Loading />
              ) : isSuccess ? (
                navigate("/admin/products")
              ) : null}
            </form>
          </div>
        </>
      )}
    </>
  );
};

export default UpdateProductPage;
