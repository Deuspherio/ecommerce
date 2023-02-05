import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Loading from "../../components/Loading";
import { Helmet } from "react-helmet-async";
import { useContext } from "react";
import { Store } from "../../context";
import { schema } from "./product.validation";
import { createProduct } from "./product.api";

const CreateProductPage = () => {
  const {
    state: {
      user: { userData },
    },
  } = useContext(Store);

  const { mutate, isLoading } = useMutation(["products"], (product) =>
    createProduct(product, userData)
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const submitHandler = (values) => {
    console.log(values);
    // mutate(values);
  };

  return (
    <div className="container-lg flex justify-center">
      <Helmet>
        <title>Create Product</title>
      </Helmet>
      <form
        onSubmit={handleSubmit(submitHandler)}
        className="border rounded px-6 py-4 min-w-[375px] space-y-6"
      >
        <h1 className="text-center">Create Product</h1>
        <div className="flex flex-col">
          <label>Product Name</label>
          <input
            type="text"
            {...register("name")}
            className="border rounded p-2"
            placeholder="Enter the product name"
            name="name"
          />
          {errors.name?.message && <p className="">{errors.name?.message}</p>}
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
          {errors.image?.message && <p className="">{errors.image?.message}</p>}
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
          <select>
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
            {...register("price")}
            className="border rounded p-2"
            placeholder="Enter product price"
            name="price"
          />
          {errors.price?.message && <p className="">{errors.price?.message}</p>}
        </div>
        <div className="flex flex-col">
          <label>Product Stocks</label>
          <input
            type="number"
            {...register("stocks")}
            className="border rounded p-2"
            placeholder="Enter product stocks"
            name="stocks"
          />
          {errors.stocks?.message && (
            <p className="">{errors.stocks?.message}</p>
          )}
        </div>
        <button type="submit" className="btn-primary" disabled={isLoading}>
          Create Product
        </button>
        {isLoading ? <Loading /> : null}
      </form>
    </div>
  );
};

export default CreateProductPage;
