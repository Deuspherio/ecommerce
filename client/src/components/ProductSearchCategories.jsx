import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "./products.api";

const prices = [
  {
    name: "1 to 100",
    value: "1-100",
  },
  {
    name: "101 to 200",
    value: "101-200",
  },
  {
    name: "201 to 300",
    value: "201-300",
  },
  {
    name: "301 to 1000",
    value: "301-1000",
  },
  {
    name: "1001 to 2000",
    value: "1001-2000",
  },
];

const ratings = [
  {
    name: "4stars & up",
    rating: 4,
  },
  {
    name: "3stars & up",
    rating: 3,
  },
  {
    name: "2stars & up",
    rating: 2,
  },
  {
    name: "1stars & up",
    rating: 1,
  },
];

const ProductSearchCategories = () => {
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

    return `/product/search?page=${filterPage}&query=${filterQuery}&category=${filterCategory}&price=${filterPrice}&rating=${filterRating}&order=${filterOrder}`;
  };
  return (
    <div>
      <div>
        <h3>Department</h3>
        <ul>
          <li>
            <Link
              to={getFilterUrl({ category: "all" })}
              className={"all" === category ? "font-bold" : ""}
            >
              Any
            </Link>
          </li>
          {search.productCategories.map((c) => (
            <li key={c}>
              <Link
                to={getFilterUrl({ category: c })}
                className={c === category ? "font-bold" : ""}
              >
                {c}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3>Price</h3>
        <ul>
          <li>
            <Link
              to={getFilterUrl({ price: "all" })}
              className={"all" === price ? "font-bold" : ""}
            >
              Any
            </Link>
          </li>
          {prices.map((p) => (
            <li key={p.value}>
              <Link
                to={getFilterUrl({ price: p.value })}
                className={p.value === price ? "font-bold" : ""}
              >
                {p.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3>Avg. Customer Review</h3>
        <ul>
          {ratings.map((r) => (
            <li key={r.name}>
              <Link
                to={getFilterUrl({ rating: r.rating })}
                className={`${r.rating}` === `${rating}` ? "font-bold" : ""}
              >
                {r.rating}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ProductSearchCategories;
