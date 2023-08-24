import React, { useContext, useState } from "react";
import { Helmet } from "react-helmet-async";
import Loading from "../../components/Loading";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  patchProductsDiscount,
  patchProductsIncrease,
  patchProductsPrice,
} from "./products.api";
import { toast } from "react-toastify";
import { Store } from "../../context";
import { BsCheck2 } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

const UpdatePricesPage = () => {
  const {
    state: {
      user: { userData },
    },
  } = useContext(Store);
  const navigate = useNavigate();
  const [productsDiscount, setProductsDiscount] = useState(1);
  const [productsIncrease, setProductsIncrease] = useState(1);

  const queryClient = useQueryClient();
  const { mutate: patchPriceMutate, isLoading: patchPriceIsLoading } =
    useMutation(() => patchProductsPrice(userData), {
      onSuccess: (data) => {
        queryClient.setQueryData(["products"], () => data);
        navigate("/admin/products");
        toast.success("Updated Prices Successfully");
      },
    });

  const { mutate: patchDiscountMutate, isLoading: patchDiscountIsLoading } =
    useMutation((discount) => patchProductsDiscount(discount, userData), {
      onSuccess: (data) => {
        queryClient.setQueryData(["products"], () => data);
        navigate("/admin/products");
        toast.success("Updated Discount Successfully");
      },
    });

  const { mutate: patchIncreaseMutate, isLoading: patchIncreaseIsLoading } =
    useMutation((increase) => patchProductsIncrease(increase, userData), {
      onSuccess: (data) => {
        queryClient.setQueryData(["products"], () => data);
        navigate("/admin/products");
        toast.success("Updated Increase Successfully");
      },
    });

  const updateProductsPriceHandler = () => {
    if (window.confirm("Are you sure?")) {
      patchPriceMutate();
      setProductsDiscount(1);
      setProductsIncrease(1);
    }
  };

  const updateProductsDiscountHandler = (e) => {
    e.preventDefault();
    if (window.confirm("Are you sure?")) {
      patchDiscountMutate(productsDiscount);
      setProductsDiscount(1);
    }
  };

  const updateProductsIncreaseHandler = (e) => {
    e.preventDefault();
    if (window.confirm("Are you sure?")) {
      patchIncreaseMutate(productsIncrease);
      setProductsIncrease(1);
    }
  };
  return (
    <>
      <Helmet>
        <title>Update Prices</title>
      </Helmet>
      {patchPriceIsLoading ||
      patchDiscountIsLoading ||
      patchIncreaseIsLoading ? (
        <Loading />
      ) : (
        <div className="custom-container flex justify-center">
          <div className="flex min-w-[375px] justify-center">
            <div className="w-full space-y-4 px-6 py-4 border rounded">
              <h1 className="text-center">Update Prices</h1>
              <form
                className="flex items-center justify-center gap-4"
                onSubmit={updateProductsDiscountHandler}
              >
                <h4 className="mb-0">Update Discount</h4>
                <select onChange={(e) => setProductsDiscount(+e.target.value)}>
                  {[...Array(100).keys()].map((x) => (
                    <option value={parseInt(x + 1)} key={x + 1}>
                      {x + 1}
                    </option>
                  ))}
                </select>
                <button className="btn-primary text-2xl w-auto">
                  <BsCheck2 />
                </button>
              </form>
              <form
                className="flex items-center justify-center gap-4"
                onSubmit={updateProductsIncreaseHandler}
              >
                <h4 className="mb-0">Update Increase</h4>
                <select onChange={(e) => setProductsIncrease(+e.target.value)}>
                  {[...Array(100).keys()].map((x) => (
                    <option value={parseInt(x + 1)} key={x + 1}>
                      {x + 1}
                    </option>
                  ))}
                </select>
                <button className="btn-primary text-2xl w-auto">
                  <BsCheck2 />
                </button>
              </form>
              <button
                className="btn-primary"
                onClick={updateProductsPriceHandler}
              >
                Update Prices
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UpdatePricesPage;
