import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Store } from "../../context";
import { useContext, useState } from "react";
import { IoMdRefresh } from "react-icons/io";
import Loading from "../../components/Loading";
import { Link, useNavigate } from "react-router-dom";
import { getProducts, patchProductsPrediction } from "./products.api";
import { Helmet } from "react-helmet-async";
import Pagination from "../../components/Pagination";
import MessageBox from "../../components/MessageBox";
import { FiEdit } from "react-icons/fi";
import { toast } from "react-toastify";

const PAGE_SIZE = 10;
const ProductsListPage = () => {
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

  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const lastProductIndex = currentPage * PAGE_SIZE;
  const firstProductIndex = lastProductIndex - PAGE_SIZE;

  const queryClient = useQueryClient();
  const { mutate: patchPredictionMutate, isLoading: patchPredictionIsLoading } =
    useMutation(() => patchProductsPrediction(userData), {
      onSuccess: (data) => {
        queryClient.setQueryData(["products"], () => data);
        toast.success("Updated Prediction Successfully");
      },
    });

  const updateProductsPredictionHandler = () => {
    if (window.confirm("Are you sure?")) {
      patchPredictionMutate();
    }
  };

  return (
    <>
      <Helmet>
        <title>List Of Products</title>
      </Helmet>
      {isLoading || patchPredictionIsLoading ? (
        <Loading />
      ) : isError ? (
        <MessageBox>{error.message}</MessageBox>
      ) : (
        <div className="custom-container">
          <h1 className="text-center mb-0">List of Products</h1>
          <div className="flex items-center gap-4 justify-end">
            <Link
              to="/admin/products/update/prices"
              className="btn-primary w-auto"
            >
              Update Prices
            </Link>
            <button
              className="btn-primary w-auto"
              title="REFRESH PREDICTION"
              onClick={updateProductsPredictionHandler}
            >
              <IoMdRefresh className="text-xl" />
            </button>
          </div>
          <div className="overflow-x-auto relative">
            <table className="w-full rounded border">
              <thead className="text-lg w-full uppercase">
                <tr>
                  <th scope="col" rowSpan={2}>
                    NAME
                  </th>
                  <th scope="col" rowSpan={2}>
                    IMAGE
                  </th>
                  <th scope="col" rowSpan={2}>
                    CATEGORY
                  </th>
                  <th scope="col" rowSpan={2}>
                    STOCKS
                  </th>
                  <th scope="col" rowSpan={2}>
                    DEMAND
                  </th>
                  <th scope="col" rowSpan={2}>
                    SALES
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
                      <td>
                        <img src={product.image} alt={product.name} />
                      </td>
                      <td>{product.category}</td>
                      <td>{product.stocks}</td>
                      <td>{product.soldProducts}</td>
                      <td>{`$ ${product.sales}`}</td>
                      <td>{`$ ${product.price}`}</td>
                      <td>{`$ ${product.currentPrice}`}</td>
                      <td className="capitalize">{product.priceSuggestion}</td>
                      <td>{`$ ${product.pricePrediction}`}</td>
                      <td>
                        <button
                          type="button"
                          className="btn-primary text-2xl"
                          onClick={() =>
                            navigate(`/admin/products/${product._id}`)
                          }
                          title="ADD STOCKS"
                        >
                          <FiEdit />
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
        </div>
      )}
    </>
  );
};

export default ProductsListPage;
