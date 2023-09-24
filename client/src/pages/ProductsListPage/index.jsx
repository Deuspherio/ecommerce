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
import { roundToTwo } from "../../utilities";

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
              className="btn-primary bg-green-600 w-auto"
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
                  <th scope="col" rowSpan={3}>
                    NAME
                  </th>
                  <th scope="col" rowSpan={3}>
                    IMAGE
                  </th>
                  <th scope="col" rowSpan={3}>
                    CATEGORY
                  </th>
                  <th scope="col" rowSpan={3}>
                    STOCKS
                  </th>
                  <th scope="col" rowSpan={3}>
                    DEMAND
                  </th>
                  <th scope="col" rowSpan={3}>
                    SALES
                  </th>
                  <th scope="col" className="text-center" colSpan={2}>
                    PRICE
                  </th>
                  <th scope="col" className="text-center" colSpan={6}>
                    PREDICTION
                  </th>
                  <th scope="col" rowSpan={3}>
                    ACTIONS
                  </th>
                </tr>
                <tr>
                  <th scope="col" rowSpan={2}>
                    ORIGINAL
                  </th>
                  <th scope="col" rowSpan={2}>
                    CURRENT
                  </th>
                  <th scope="col" colSpan={3}>
                    SUGGESTION
                  </th>
                  <th scope="col" colSpan={3}>
                    PRICE
                  </th>
                </tr>
                <tr>
                  <th scope="col">GAUSSIAN NAIVE BAYES</th>
                  <th scope="col">DECISION TREE</th>
                  <th scope="col">K-NEAREST NEIGHBOR</th>
                  <th scope="col">GAUSSIAN NAIVE BAYES</th>
                  <th scope="col">DECISION TREE</th>
                  <th scope="col">K-NEAREST NEIGHBOR</th>
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
                      <td>{`$ ${roundToTwo(product.sales)}`}</td>
                      <td>{`$ ${product.price}`}</td>
                      <td>{`$ ${product.currentPrice}`}</td>
                      <td className="capitalize">
                        {product.bayesianSuggestion}
                      </td>
                      <td className="capitalize">
                        {product.decisionSuggestion}
                      </td>
                      <td className="capitalize">{product.knnSuggestion}</td>
                      <td>{`$ ${product.bayesianPrediction}`}</td>
                      <td>{`$ ${product.decisionPrediction}`}</td>
                      <td>{`$ ${product.knnPrediction}`}</td>
                      <td>
                        <button
                          type="button"
                          className="btn-primary bg-green-600 text-2xl"
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
