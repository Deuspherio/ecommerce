import { Link } from "react-router-dom";
import { roundToTwo } from "../utilities";

const Product = ({ product }) => {
  return (
    <Link
      to={`/product/${product._id}`}
      className="flex flex-col items-center justify-between border rounded w-full px-6 py-4 text-center relative overflow-hidden transition-shadow hover:shadow-md"
    >
      <img src={product.image} alt={product.name} />
      {product.pricePrediction === product.price ? (
        <p className="absolute top-[4%] left-0 shadow-md text-sm bg-primary text-white rounded-r p-2 z-[2] md:text-base lg:top-[10%] lg:w-[110px]">
          Trending
        </p>
      ) : null}
      {product.discountedPrice < product.price && product.stocks > 0 ? (
        <p className="absolute top-[18%] left-0 shadow-md text-sm bg-primary text-white rounded-r p-2 z-[1] md:text-base lg:top-[22%] lg:w-[90px]">
          {`${roundToTwo(
            (100 * (product.price - product.discountedPrice)) / product.price
          )}% off`}
        </p>
      ) : null}
      <h4>{product.name}</h4>
    </Link>
  );
};

export default Product;
