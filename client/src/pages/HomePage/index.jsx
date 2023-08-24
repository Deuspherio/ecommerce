import { useQuery } from "@tanstack/react-query";
import Product from "../../components/Product";
import Loading from "../../components/Loading";
import { Helmet } from "react-helmet-async";
import { getProducts } from "./products.api";
import MessageBox from "../../components/MessageBox";
import { Link, useSearchParams } from "react-router-dom";
import SidebarMenu from "../../components/SidebarMenu";
import Carousel from "../../components/Carousel";

const HomePage = () => {
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category") || "all";
  const price = searchParams.get("price") || "all";
  const rating = searchParams.get("rating") || "all";
  const order = searchParams.get("order") || "newest";
  const page = searchParams.get("page") || 1;

  const { data, isLoading, isError, error } = useQuery(
    ["products", category, price, rating, order, page],
    () => getProducts(page, category, price, rating, order)
  );

  const getFilterUrl = (filter) => {
    const filterPage = filter.page || page;
    const filterCategory = filter.category || category;
    const filterPrice = filter.price || price;
    const filterRating = filter.rating || rating;
    const filterOrder = filter.order || order;

    return `/products/search/?page=${filterPage}&category=${filterCategory}&price=${filterPrice}&rating=${filterRating}&order=${filterOrder}`;
  };

  return (
    <>
      <Helmet>
        <title>Home</title>
      </Helmet>
      {isLoading ? (
        <Loading />
      ) : isError ? (
        <MessageBox danger>{error.message}</MessageBox>
      ) : (
        <>
          <Carousel />
          <div className="custom-container mt-6">
            {data.notFilteredProducts.filter(
              (product) =>
                product.pricePrediction >= product.price &&
                product.soldProducts > 0 &&
                product.stocks > 0
            ).length > 0 ? (
              <>
                <h1>Trending Products</h1>
                <div className="grid gap-4 mb-6 grid-cols-4">
                  {data.notFilteredProducts
                    .filter(
                      (product) =>
                        product.pricePrediction >= product.price &&
                        product.soldProducts > 0 &&
                        product.stocks > 0
                    )
                    .splice(0, 4)
                    .map((product) => (
                      <Product product={product} key={product._id} />
                    ))}
                </div>
              </>
            ) : null}
            <div className="flex items-center space-x-4 mb-4">
              <h1 className="mb-0">Featured Products</h1>
            </div>
            <div className="grid grid-cols-12 gap-4 relative">
              <div className="col-span-3">
                <SidebarMenu
                  data={data}
                  getFilterUrl={getFilterUrl}
                  category={category}
                  price={price}
                  rating={rating}
                  order={order}
                />
              </div>
              <div className="col-span-9 mb-4">
                {data.products.length === 0 ? (
                  <MessageBox danger>No Products Found</MessageBox>
                ) : (
                  <div className="grid gap-4 grid-cols-3">
                    {data.products.map((product) => (
                      <Product product={product} key={product._id} />
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-2 items-center justify-center">
              {[...Array(data.pages).keys()].map((x) => (
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
        </>
      )}
    </>
  );
};

export default HomePage;
