import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Store } from "../../context";
import { useContext, useState } from "react";
import Loading from "../../components/Loading";
import { useNavigate } from "react-router-dom";
import { deleteProduct, getProducts } from "./products.api";
import { Helmet } from "react-helmet-async";
import Pagination from "../../components/Pagination";
import MessageBox from "../../components/MessageBox";
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
    isSuccess,
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
    if (window.confirm("Are you sure?")) {
      mutate(id);
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
      {isLoading || deleteIsLoading ? (
        <Loading />
      ) : isError ? (
        <MessageBox>{error.message}</MessageBox>
      ) : (
        <div className="custom-container">
          <div className="flex items-center justify-between">
            <h1 className="text-center flex-1">List of Products</h1>
            <button
              type="button"
              className="btn-primary w-auto"
              onClick={() => navigate("/admin/products/create")}
            >
              Create Product
            </button>
          </div>
          <div className="overflow-x-auto relative">
            <table className="w-full rounded border">
              <thead className="text-lg w-full uppercase">
                <tr>
                  <th scope="col" rowSpan={2}>
                    NAME
                  </th>
                  <th scope="col" className="text-center" colSpan={2}>
                    PRICE
                  </th>
                  <th scope="col" rowSpan={2}>
                    STOCKS
                  </th>
                  <th scope="col" rowSpan={2}>
                    CATEGORY
                  </th>
                  <th scope="col" rowSpan={2} colSpan={2}>
                    ACTIONS
                  </th>
                </tr>
                <tr>
                  <th scope="col">ORIGINAL</th>
                  <th scope="col">CURRENT</th>
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
                      <td>{`₱ ${product.price}`}</td>
                      <td>{`₱ ${product.discountedPrice}`}</td>
                      <td>{product.stocks}</td>
                      <td>{product.category}</td>
                      <td>
                        <button
                          type="button"
                          className="btn-primary"
                          onClick={() =>
                            navigate(`/admin/products/${product._id}`)
                          }
                        >
                          Update
                        </button>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="btn-primary"
                          onClick={() => deleteSingleProduct(product._id)}
                        >
                          Delete
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
