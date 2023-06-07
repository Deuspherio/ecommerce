import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Store } from "../../context";
import { useContext, useState } from "react";
import Loading from "../../components/Loading";
import { useNavigate } from "react-router-dom";
import {
  deleteProduct,
  getProducts,
  patchProductsDiscount,
  patchProductsPrice,
  patchProductsIncrease,
} from "./products.api";
import { Helmet } from "react-helmet-async";
import Pagination from "../../components/Pagination";
import MessageBox from "../../components/MessageBox";
import { toast } from "react-toastify";
import { BsCheck2 } from "react-icons/bs";
import { AiOutlineDelete } from "react-icons/ai";
import { FiEdit } from "react-icons/fi";

const PAGE_SIZE = 10;
const ProductsListPage = () => {
  const [productsDiscount, setProductsDiscount] = useState(1);
  const [productsIncrease, setProductsIncrease] = useState(1);
  const {
    state: {
      user: { userData },
    },
  } = useContext(Store);
  const {
    data: products,
    isLoading,
    isError,
    error,
  } = useQuery(["products"], () => getProducts(userData));

  const queryClient = useQueryClient();
  const { mutate, isLoading: deleteIsLoading } = useMutation(
    (id) => deleteProduct(id, userData),
    {
      onSuccess: (data) => {
        queryClient.setQueryData(["products"], () => {
          toast.success("Product Deleted Successfully");
          return data;
        });
      },
    }
  );

  const deleteSingleProduct = (id) => {
    // if (window.confirm("Are you sure?")) {
    //   mutate(id);
    // }
    console.log(id);
  };

  const { mutate: patchPriceMutate, isLoading: patchPriceIsLoading } =
    useMutation(() => patchProductsPrice(userData), {
      onSuccess: (data) => {
        queryClient.setQueryData(["products"], () => data);
      },
    });

  const updateProductsPriceHandler = () => {
    if (window.confirm("Are you sure?")) {
      patchPriceMutate();
      setProductsDiscount(1);
      setProductsIncrease(1);
    }
  };

  const { mutate: patchDiscountMutate, isLoading: patchDiscountIsLoading } =
    useMutation((discount) => patchProductsDiscount(discount, userData), {
      onSuccess: (data) => {
        queryClient.setQueryData(["products"], () => data);
      },
    });

  const { mutate: patchIncreaseMutate, isLoading: patchIncreaseIsLoading } =
    useMutation((increase) => patchProductsIncrease(increase, userData), {
      onSuccess: (data) => queryClient.setQueryData(["products"], () => data),
    });

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

  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const lastProductIndex = currentPage * PAGE_SIZE;
  const firstProductIndex = lastProductIndex - PAGE_SIZE;
  return (
    <>
      <Helmet>
        <title>List Of Products</title>
      </Helmet>
      {isLoading ||
      deleteIsLoading ||
      patchPriceIsLoading ||
      patchDiscountIsLoading ||
      patchIncreaseIsLoading ? (
        <Loading />
      ) : isError ? (
        <MessageBox>{error.message}</MessageBox>
      ) : (
        <div className="custom-container">
          <div className="flex items-center justify-between">
            <h1 className="text-center flex-1">List of Products</h1>
          </div>
          <div className="overflow-x-auto relative">
            <table className="w-full rounded border">
              <thead className="text-lg w-full uppercase">
                <tr>
                  <th scope="col" rowSpan={2}>
                    NAME
                  </th>
                  <th scope="col" rowSpan={2}>
                    CATEGORY
                  </th>
                  <th scope="col" rowSpan={2}>
                    STOCKS
                  </th>
                  <th scope="col" className="text-center" colSpan={2}>
                    PRICE
                  </th>
                  <th scope="col" className="text-center" colSpan={2}>
                    PREDICTION
                  </th>
                  <th scope="col" rowSpan={2} colSpan={2}>
                    ACTIONS
                  </th>
                </tr>
                <tr>
                  <th scope="col">ORIGINAL</th>
                  <th scope="col">CURRENT</th>
                  <th scope="col">SUGGESTION</th>
                  <th scope="col">PRICE</th>
                </tr>
              </thead>
              <tbody>
                {products
                  .slice(firstProductIndex, lastProductIndex)
                  .map((product) => (
                    <tr key={product._id} className="hover:bg-gray-50">
                      <th className="text-start font-medium text-gray-900 whitespace-nowrap">
                        {product.name}
                      </th>
                      <td>{product.category}</td>
                      <td>{product.stocks}</td>
                      <td>{`$ ${product.price}`}</td>
                      <td>{`$ ${product.discountedPrice}`}</td>
                      <td className="capitalize">{product.priceSuggestion}</td>
                      <td>{`$ ${product.pricePrediction}`}</td>
                      <td>
                        <button
                          type="button"
                          className="btn-primary text-2xl"
                          onClick={() =>
                            navigate(`/admin/products/${product._id}`)
                          }
                        >
                          <FiEdit />
                        </button>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="btn-primary bg-red-600 text-2xl"
                          onClick={() => deleteSingleProduct(product._id)}
                        >
                          <AiOutlineDelete />
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
          <div className="flex justify-center">
            <div className="min-w-[250px] space-y-4 px-6 py-4 border rounded">
              <h4 className="text-center">Update Discount</h4>
              <form
                className="flex items-center justify-center gap-4"
                onSubmit={updateProductsDiscountHandler}
              >
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
              <h4 className="text-center">Update Increase</h4>
              <form
                className="flex items-center justify-center gap-4"
                onSubmit={updateProductsIncreaseHandler}
              >
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

export default ProductsListPage;
