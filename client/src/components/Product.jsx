import { Link } from "react-router-dom";
import { roundToTwo } from "../utilities";
import Rating from "./Rating";

const Product = ({ product }) => {
  return (
    <Link
      to={`/product/${product.slug}`}
      className="flex flex-col items-center justify-between border rounded w-full px-6 py-4 text-center relative overflow-hidden transition-shadow hover:shadow-md"
    >
      <img src={product.image} alt={product.name} />
      {product.pricePrediction === product.price ? (
        <p className="absolute top-[4%] left-0 shadow-md text-sm bg-primary text-white rounded-r p-2 z-[2] md:text-base lg:top-[10%] lg:w-[110px]">
          Trending
        </p>
      ) : null}
      {product.currentPrice < product.price && product.stocks > 0 ? (
        <p className="absolute top-[18%] left-0 shadow-md text-sm bg-primary text-white rounded-r p-2 z-[1] md:text-base lg:top-[22%] lg:w-[90px]">
          {`${product.discount * 100}% off`}
        </p>
      ) : null}
      <h4>{product.name}</h4>
      <div className="flex flex-row w-full items-center justify-between">
        <div>
          <Rating rating={product.rating} />
        </div>
        <div className="text-xs">
          {product.totalSoldProducts > 0 ? product.totalSoldProducts : 0} sold
        </div>
      </div>
    </Link>
  );
};

export default Product;
