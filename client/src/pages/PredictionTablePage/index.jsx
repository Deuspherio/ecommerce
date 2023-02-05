import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import MessageBox from "../../components/MessageBox";
import Loading from "../../components/Loading";
import { Helmet } from "react-helmet-async";
import { roundToTwo } from "../../utilities";
import { useContext, useState } from "react";
import { Store } from "../../context";
import {
  getProducts,
  patchProductsDiscount,
  patchProductsDiscountByCategory,
  patchProductDiscountById,
  patchProductsPrice,
  patchProductsPriceByCategory,
  patchProductPriceById,
} from "./products.api";
import Pagination from "../../components/Pagination";

const productsDiscountPriceCategory = [
  { name: "Face Cream", category: "face-cream" },
  { name: "Lipstick", category: "lipstick" },
  { name: "Lotion", category: "lotion" },
  { name: "Powder", category: "powder" },
];

const PAGE_SIZE = 10;
const PredictionTablePage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const lastPageIndex = currentPage * PAGE_SIZE;
  const firstPageIndex = lastPageIndex - PAGE_SIZE;
  const {
    data: products,
    isLoading,
    isError,
    error,
    isSuccess,
  } = useQuery(["products"], () => getProducts(userData));
  const [productDiscount, setProductDiscount] = useState(1);
  const [productsDiscount, setProductsDiscount] = useState(1);
  const {
    state: {
      user: { userData },
    },
  } = useContext(Store);

  const queryClient = useQueryClient();
  const { mutate: patchDiscountMutate, isLoading: patchDiscountIsLoading } =
    useMutation((discount) => patchProductsDiscount(discount, userData), {
      onSuccess: (data) => {
        queryClient.setQueryData(["products"], () => data);
      },
    });

  const {
    mutate: patchCategoryDiscountMutate,
    isLoading: patchCategoryDiscountIsLoading,
  } = useMutation(
    (category) =>
      patchProductsDiscountByCategory(category, productsDiscount, userData),
    {
      onSuccess: (data) => {
        queryClient.setQueryData(["products"], () => data);
      },
    }
  );

  const { mutate: patchIdDiscountMutate, isLoading: patchIdDiscountIsLoading } =
    useMutation(
      (id) => patchProductDiscountById(id, productDiscount, userData),
      {
        onSuccess: (data) => {
          queryClient.setQueryData(["products"], () => data);
        },
      }
    );

  const { mutate: patchPriceMutate, isLoading: patchPriceIsLoading } =
    useMutation(() => patchProductsPrice(userData), {
      onSuccess: (data) => {
        queryClient.setQueryData(["products"], () => data);
      },
    });
  const {
    mutate: patchCategoryPriceMutate,
    isLoading: patchCategoryPriceIsLoading,
  } = useMutation(
    (category) => patchProductsPriceByCategory(category, userData),
    {
      onSuccess: (data) => {
        queryClient.setQueryData(["products"], () => data);
      },
    }
  );
  const { mutate: patchIdPriceMutate, isLoading: patchIdPriceIsLoading } =
    useMutation((id) => patchProductPriceById(id, userData), {
      onSuccess: (data) => {
        queryClient.setQueryData(["products"], () => data);
      },
    });

  const updateProductsDiscountHandler = (e) => {
    e.preventDefault();
    if (window.confirm("Are you sure?")) {
      patchDiscountMutate(productsDiscount);
      setProductsDiscount(1);
    }
  };
  const updateProductsPriceHandler = () => {
    if (window.confirm("Are you sure?")) {
      patchPriceMutate();
      setProductsDiscount(1);
    }
  };

  const updateProductDiscountHandler = (e, id) => {
    e.preventDefault();
    if (window.confirm("Are you sure?")) {
      patchIdDiscountMutate(id);
      setProductDiscount(1);
    }
  };
  const updateProductPriceHandler = (id) => {
    if (window.confirm("Are you sure?")) {
      patchIdPriceMutate(id);
      setProductDiscount(1);
    }
  };

  const updateDiscountByCategoryHandler = (e, productsCategory) => {
    e.preventDefault();
    if (window.confirm("Are you sure?")) {
      patchCategoryDiscountMutate(productsCategory.category);
      setProductsDiscount(1);
    }
  };
  const updatePriceByCategoryHandler = (e, productsCategory) => {
    e.preventDefault();
    if (window.confirm("Are you sure?")) {
      patchCategoryPriceMutate(productsCategory.category);
      setProductsDiscount(1);
    }
  };

  return (
    <>
      <Helmet>
        <title>Prediction Table</title>
      </Helmet>
      {isLoading ||
      patchPriceIsLoading ||
      patchDiscountIsLoading ||
      patchCategoryDiscountIsLoading ||
      patchIdDiscountIsLoading ||
      patchIdPriceIsLoading ||
      patchCategoryPriceIsLoading ? (
        <Loading />
      ) : isError ? (
        <MessageBox>{error.message}</MessageBox>
      ) : isSuccess ? (
        <div className="custom-container">
          <h1 className="text-center">Prediction Table</h1>
          <div className="overflow-x-auto relative">
            <table className="w-full text-left text-gray-500 border rounded">
              <thead className="text-lg w-full text-gray-700 uppercase">
                <tr>
                  <th scope="col" className="text-center" rowSpan={2}>
                    PRODUCT NAME
                  </th>
                  <th scope="col" className="text-center" rowSpan={2}>
                    CATEGORY
                  </th>
                  <th scope="col" className="text-center" colSpan={3}>
                    PRICE
                  </th>
                  <th scope="col" className="text-center" colSpan={2}>
                    DISCOUNT
                  </th>
                  <th scope="col" className="text-center" colSpan={2}>
                    ACTIONS
                  </th>
                </tr>
                <tr>
                  <th scope="col">ORIGINAL</th>
                  <th scope="col">CURRENT</th>
                  <th scope="col">PREDICTION</th>
                  <th scope="col">CURRENT</th>
                  <th scope="col">FUTURE</th>
                  <th className="text-center" scope="col">
                    UPDATE DISCOUNT
                  </th>
                  <th className="text-center" scope="col">
                    UPDATE PRICE
                  </th>
                </tr>
              </thead>
              <tbody>
                {products
                  .slice(firstPageIndex, lastPageIndex)
                  .map((product) => (
                    <tr className="hover:bg-gray-50" key={product._id}>
                      <th className="font-medium text-gray-900 whitespace-nowrap">
                        {product.name}
                      </th>
                      <td>{product.category}</td>
                      <td>{`₱ ${product.price.toLocaleString()}`}</td>
                      <td>{`₱ ${product.discountedPrice.toLocaleString()}`}</td>
                      <td>{`₱ ${product.pricePrediction.toLocaleString()}`}</td>
                      <td>{`${roundToTwo(
                        (100 * (product.price - product.discountedPrice)) /
                          product.price
                      )}%`}</td>
                      <td>{`${roundToTwo(
                        (100 * (product.price - product.pricePrediction)) /
                          product.price
                      )}%`}</td>
                      <td>
                        <form
                          className="flex gap-4"
                          onSubmit={(e) =>
                            updateProductDiscountHandler(e, product._id)
                          }
                        >
                          <select
                            onChange={(e) =>
                              setProductDiscount(+e.target.value)
                            }
                          >
                            {[...Array(100).keys()].map((x) => (
                              <option value={parseInt(x + 1)} key={x + 1}>
                                {x + 1}
                              </option>
                            ))}
                          </select>
                          <button type="submit" className="btn-primary">
                            Update
                          </button>
                        </form>
                      </td>
                      <td>
                        <button
                          className="btn-primary"
                          onClick={() => updateProductPriceHandler(product._id)}
                        >
                          Update
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <Pagination
            items={products}
            PAGE_SIZE={PAGE_SIZE}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
          <h2 className="text-center">Update Prices, and Discount</h2>
          <div className="flex justify-center">
            <div className="max-w-[268px] space-y-4 px-6 py-4 border rounded">
              <h4 className="text-center">All</h4>
              <form
                className="flex items-center gap-4"
                onSubmit={updateProductsDiscountHandler}
              >
                <select onChange={(e) => setProductsDiscount(+e.target.value)}>
                  {[...Array(100).keys()].map((x) => (
                    <option value={parseInt(x + 1)} key={x + 1}>
                      {x + 1}
                    </option>
                  ))}
                </select>
                <button className="btn-primary">Update Discounts</button>
              </form>
              <button
                className="btn-primary"
                onClick={updateProductsPriceHandler}
              >
                Update Prices
              </button>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {productsDiscountPriceCategory.map((item) => (
              <div
                className="space-y-4 px-6 py-4 border rounded"
                key={item.name}
              >
                <h4 className="text-center">{item.name}</h4>
                <form
                  className="flex items-center gap-4"
                  onSubmit={(e) =>
                    updateDiscountByCategoryHandler(e, {
                      category: item.category,
                    })
                  }
                >
                  <select
                    onChange={(e) => setProductsDiscount(+e.target.value)}
                  >
                    {[...Array(100).keys()].map((x) => (
                      <option value={parseInt(x + 1)} key={x + 1}>
                        {x + 1}
                      </option>
                    ))}
                  </select>
                  <button type="submit" className="btn-primary">
                    Update Discounts
                  </button>
                </form>
                <button
                  className="btn-primary"
                  onClick={(e) =>
                    updatePriceByCategoryHandler(e, {
                      category: item.category,
                    })
                  }
                >
                  Update Prices
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </>
  );
};

export default PredictionTablePage;
