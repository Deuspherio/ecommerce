import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../components/Loading";
import Product from "../../components/Product";
import { getProducts } from "./products.api";
import SidebarMenu from "../../components/SidebarMenu";
import { BsX } from "react-icons/bs";
import { Helmet } from "react-helmet-async";
import MessageBox from "../../components/MessageBox";

const SearchPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || "all";
  const category = searchParams.get("category") || "all";
  const price = searchParams.get("price") || "all";
  const rating = searchParams.get("rating") || "all";
  const order = searchParams.get("order") || "newest";
  const page = searchParams.get("page") || 1;

  const {
    data: search,
    isLoading,
    isError,
    isSuccess,
    error,
  } = useQuery(["search", query, category, price, rating, order, page], () =>
    getProducts(page, query, category, price, rating, order)
  );

  const getFilterUrl = (filter) => {
    const filterPage = filter.page || page;
    const filterQuery = filter.query || query;
    const filterCategory = filter.category || category;
    const filterPrice = filter.price || price;
    const filterRating = filter.rating || rating;
    const filterOrder = filter.order || order;

    return `/products/search?page=${filterPage}&query=${filterQuery}&category=${filterCategory}&price=${filterPrice}&rating=${filterRating}&order=${filterOrder}`;
  };

  return (
    <>
      <Helmet>
        <title>Search</title>
      </Helmet>
      {isLoading ? (
        <Loading />
      ) : isError ? (
        <MessageBox danger>{error.message}</MessageBox>
      ) : isSuccess ? (
        <div className="custom-container">
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 lg:col-span-3">
              <SidebarMenu
                data={search}
                getFilterUrl={getFilterUrl}
                category={category}
                price={price}
                rating={rating}
                order={order}
              />
            </div>
            <div className="col-span-12 lg:col-span-9 space-y-6">
              <div className="col-span-6">
                <div className="flex gap-4">
                  <p className="text-sm">
                    {search.countProducts === 0
                      ? "No"
                      : `${search.countProducts} results`}
                    {query !== "all" ? " : " + query : null}
                    {category !== "all" ? " : " + category : null}
                    {price !== "all" ? " : $" + price : null}
                    {rating !== "all" ? " : " + rating + " stars & up" : null}
                    {query !== "all" ||
                    category !== "all" ||
                    price !== "all" ||
                    rating !== "all" ? (
                      <button
                        onClick={() => navigate("/products/search")}
                        className="text-xl border rounded-full"
                        title="clear"
                      >
                        <BsX />
                      </button>
                    ) : null}
                  </p>
                </div>
              </div>
              <div>
                {search.products.length === 0 ? (
                  <MessageBox info>No Products Found</MessageBox>
                ) : (
                  <div className="grid gap-4 grid-cols-2 md:grid-cols-3">
                    {search.products.map((product) => (
                      <Product product={product} key={product._id} />
                    ))}
                  </div>
                )}
              </div>
              <div className="flex gap-2 items-center justify-center">
                {[...Array(search.pages).keys()].map((x) => (
                  <Link to={getFilterUrl({ page: x + 1 })} key={x + 1}>
                    <button
                      className={`${
                        +page === x + 1
                          ? "text-primary font-bold shadow-md"
                          : " p-2 border rounded"
                      } border py-2 px-4 rounded text-base transition-pagination hover:shadow-md hover:text-primary hover:font-bold`}
                    >
                      {x + 1}
                    </button>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default SearchPage;
