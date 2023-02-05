import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Loading from "../../components/Loading";
import MessageBox from "../../components/MessageBox";
import { Helmet } from "react-helmet-async";
import { useContext } from "react";
import { Store } from "../../context";
import { useParams } from "react-router-dom";
import { schema } from "./product.validation";
import { getProduct, patchProduct } from "./product.api";

const UpdateProductPage = () => {
  const { id } = useParams();
  const {
    state: {
      user: { userData },
    },
  } = useContext(Store);

  const {
    data: product,
    isSuccess: getIsSuccess,
    isLoading: getIsLoading,
    isError: getIsError,
    error: getError,
  } = useQuery(["product"], () => getProduct(id));
  const { mutate, isLoading } = useMutation(["product"], (product) =>
    patchProduct(product, id, userData)
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const submitHandler = (value) => {
    console.log(value);
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
                >
                  <option value="face-cream">Face Cream</option>
                  <option value="lipstick">Lipstick</option>
                  <option value="lotion">Lotion</option>
                  <option value="powder">Powder</option>
                </select>
                {errors.category?.message && (
                  <p className="">{errors.category?.message}</p>
                )}
              </div>
              <div className="flex flex-col">
                <label>Product Price</label>
                <input
                  type="number"
                  {...register("price", {
                    value: product.price,
                  })}
                  className="border rounded p-2"
                  placeholder="Update the product price"
                  name="price"
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
                />
                {errors.stocks?.message && (
                  <p className="">{errors.stocks?.message}</p>
                )}
              </div>
              <button type="submit" className="btn-primary">
                Update Product
              </button>
              {isLoading ? <Loading /> : null}
            </form>
          </div>
        </>
      )}
    </>
  );
};

export default UpdateProductPage;
