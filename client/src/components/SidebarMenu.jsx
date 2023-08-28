import React from "react";
import { useNavigate } from "react-router-dom";

const prices = [
  {
    option: "$1 - $100",
    value: "1-100",
  },
  {
    option: "$101 - $200",
    value: "101-200",
  },
  {
    option: "$201 - $400",
    value: "201-400",
  },
  {
    option: "$401 - $1000",
    value: "401-1000",
  },
  {
    option: "$1001 - $2000",
    value: "1001-2000",
  },
];

const ratings = [
  {
    option: "4 stars & up",
    rating: 4,
  },
  {
    option: "3 stars & up",
    rating: 3,
  },
  {
    option: "2 stars & up",
    rating: 2,
  },
  {
    option: "1 star & up",
    rating: 1,
  },
];

const SidebarMenu = ({
  data,
  getFilterUrl,
  category,
  price,
  rating,
  order,
}) => {
  const navigate = useNavigate();
  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-6 lg:col-span-12">
        <h4 className="mb-2">Category</h4>
        <select
          value={category}
          onChange={(e) => navigate(getFilterUrl({ category: e.target.value }))}
        >
          <option value="all">All</option>
          {data.productCategories.map((c) => (
            <option className="capitalize" value={c} key={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
      <div className="col-span-6 lg:col-span-12">
        <h4 className="mb-2">Price</h4>
        <select
          value={price}
          onChange={(e) => navigate(getFilterUrl({ price: e.target.value }))}
        >
          <option value="all">All</option>
          {prices.map((p) => (
            <option value={p.value} key={p.value}>
              {p.option}
            </option>
          ))}
        </select>
      </div>
      <div className="col-span-6 lg:col-span-12">
        <h4 className="mb-2">Avg. Customer Review</h4>
        <select
          value={rating}
          onChange={(e) => navigate(getFilterUrl({ rating: e.target.value }))}
        >
          <option value="all">All</option>
          {ratings.map((r) => (
            <option value={r.rating} key={r.rating}>
              {r.option}
            </option>
          ))}
        </select>
      </div>
      <div className="col-span-6 lg:col-span-12">
        <h4 className="mb-2">Sort by</h4>
        <select
          value={order}
          onChange={(e) => navigate(getFilterUrl({ order: e.target.value }))}
          className="w-full xl:w-auto"
        >
          <option value="newest">Newest Arrival</option>
          <option value="lowest">Price: Low to High</option>
          <option value="highest">Price: High to Low</option>
          <option value="toprated">Avg. Customer Reviews</option>
        </select>
      </div>
    </div>
  );
};

export default SidebarMenu;
