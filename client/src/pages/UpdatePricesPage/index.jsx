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
    useMutation((algo) => patchProductsPrice(algo, userData), {
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

  const updateProductsPriceBayesianHandler = () => {
    if (window.confirm("Are you sure?")) {
      patchPriceMutate("bayesian");
      setProductsDiscount(1);
      setProductsIncrease(1);
    }
  };
  const updateProductsPriceDecisionHandler = () => {
    if (window.confirm("Are you sure?")) {
      patchPriceMutate("decision");
      setProductsDiscount(1);
      setProductsIncrease(1);
    }
  };
  const updateProductsPriceKnnHandler = () => {
    if (window.confirm("Are you sure?")) {
      patchPriceMutate("knn");
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
          <div className="flex flex-col md:flex-row justify-center gap-6">
            <div className="w-auto h-fit space-y-4 px-6 py-4 border rounded">
              <div className="flex flex-col items-center gap-4">
                <h2 className="text-center">Update Pricing</h2>
                <form
                  className="flex items-center justify-center gap-4"
                  onSubmit={updateProductsDiscountHandler}
                >
                  <h4 className="mb-0">Update Discount</h4>
                  <select
                    onChange={(e) => setProductsDiscount(+e.target.value)}
                  >
                    {[...Array(100).keys()].map((x) => (
                      <option value={parseInt(x + 1)} key={x + 1}>
                        {x + 1}
                      </option>
                    ))}
                  </select>
                  <button
                    className="btn-primary text-2xl w-auto"
                    title="UPDATE DISCOUNT"
                  >
                    <BsCheck2 />
                  </button>
                </form>
                <form
                  className="flex items-center justify-center gap-4"
                  onSubmit={updateProductsIncreaseHandler}
                >
                  <h4 className="mb-0">Update Increase</h4>
                  <select
                    onChange={(e) => setProductsIncrease(+e.target.value)}
                  >
                    {[...Array(100).keys()].map((x) => (
                      <option value={parseInt(x + 1)} key={x + 1}>
                        {x + 1}
                      </option>
                    ))}
                  </select>
                  <button
                    className="btn-primary text-2xl w-auto"
                    title="UPDATE INCREASE"
                  >
                    <BsCheck2 />
                  </button>
                </form>
              </div>
            </div>
            <div className="w-auto px-6 py-4 flex flex-col gap-4 border p-4">
              <h2 className="text-center">Update Prices</h2>
              <button
                className="btn-primary"
                onClick={updateProductsPriceBayesianHandler}
                title="UPDATE PRICES"
              >
                Update Prices with Gaussian Naive Bayes
              </button>
              <button
                className="btn-primary"
                onClick={updateProductsPriceDecisionHandler}
                title="UPDATE PRICES"
              >
                Update Prices with Decision Tree
              </button>
              <button
                className="btn-primary"
                onClick={updateProductsPriceKnnHandler}
                title="UPDATE PRICES"
              >
                Update Prices with K-Nearest Neighbor
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UpdatePricesPage;
