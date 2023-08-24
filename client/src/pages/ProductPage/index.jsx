import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import Loading from "../../components/Loading";
import MessageBox from "../../components/MessageBox";
import Rating from "../../components/Rating";
import { useContext, useEffect, useState } from "react";
import { Store } from "../../context";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { getError } from "../../utilities";
import { getProduct, postComments } from "./product.api";
import { schema } from "./comment.validation";
import Pagination from "../../components/Pagination";
import { BsCartPlus } from "react-icons/bs";

const ProductPage = () => {
  const { slug } = useParams();
  const {
    isLoading,
    isError,
    error,
    data: product,
  } = useQuery(["product"], () => getProduct(slug));
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
    user: { userData },
  } = state;

  const [qty, setQty] = useState(1);

  const addToCartHandler = (item) => {
    const existItem = cartItems.find((x) => x._id === item._id);
    const quantity = existItem ? existItem.quantity + qty : qty;
    if (item.stocks < quantity) {
      toast.error("Not Enough Stocks");
      return;
    }
    ctxDispatch({
      type: "CART_ADD_ITEM",
      payload: { ...item, quantity },
    });
  };

  const { register, handleSubmit } = useForm({
    resolver: yupResolver(schema),
  });

  const queryClient = useQueryClient();
  const {
    mutate,
    isLoading: reviewIsLoading,
    isError: reviewIsError,
    error: reviewError,
  } = useMutation((review) => postComments(product._id, userData, review), {
    onSuccess: (data) => {
      queryClient.setQueryData(["product"], (oldQueryData) => {
        return {
          ...oldQueryData,
          reviews: data.reviews,
          numReviews: data.numReviews,
        };
      });
    },
  });

  const submitHandler = (values) => {
    if (!userData) {
      toast.error("Please sign in");
      return;
    }
    if (window.confirm("Are you sure?")) {
      mutate(values);
    }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;
  const lastPageIndex = currentPage * PAGE_SIZE;
  const firstPageIndex = lastPageIndex - PAGE_SIZE;

  useEffect(() => {
    if (reviewIsError) {
      toast.error(getError(reviewError));
    }
  }, [reviewError, reviewIsError]);

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : isError ? (
        <MessageBox danger>{error.message}</MessageBox>
      ) : (
        <div className="custom-container">
          <h1 className="text-center">Product Information</h1>
          <div className="grid grid-cols-12 gap-4 items-start">
            <div className="col-span-8 grid grid-cols-2 gap-4 border rounded px-6 py-4">
              <div className="space-y-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="border rounded"
                />
                <div className="grid grid-cols-3 gap-4">
                  {[...Array(3).keys()].map((images) => (
                    <button
                      key={images}
                      className="border rounded transition-shadow hover:shadow-md"
                    >
                      <img src={product.image} alt={product.name} />
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <h2 className="text-center">{product.name}</h2>
                <div className="flex justify-center">
                  <Rating rating={product.rating} />
                </div>
                <p className="indent-8 text-justify">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Explicabo voluptates consectetur reiciendis amet cum fugit
                  mollitia, temporibus nemo, quam voluptate ut aperiam tempora
                  facere placeat non possimus rerum a ipsa.
                </p>
                <div className="px-6 py-2 space-y-4">
                  <div className="flex items-center  justify-between">
                    <h4 className="mb-0">Price</h4>
                    {product.currentPrice >= product.price ? (
                      <p>{`$ ${product.currentPrice}`}</p>
                    ) : (
                      <div className="flex flex-col">
                        <p className="text-sm line-through">{`$ ${product.price}`}</p>
                        <p className="font-bold">{`$ ${product.currentPrice}`}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <h4 className="mb-0">Quantity: </h4>
                    {product.stocks > 0 ? (
                      <select
                        value={qty}
                        onChange={(e) => setQty(+e.target.value)}
                        className="px-4 py-2 bg-white border rounded"
                      >
                        {[...Array(product.stocks).keys()].map((stock) => (
                          <option value={stock + 1} key={stock + 1}>
                            {stock + 1}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <p className="text-red-700">Out of stock</p>
                    )}
                  </div>
                  {product.stocks > 0 ? (
                    <button
                      type="button"
                      className="btn-primary flex items-center justify-center gap-1"
                      onClick={() => addToCartHandler(product)}
                    >
                      <BsCartPlus className="text-xl" />
                      Add to Cart
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="btn-primary flex items-center justify-center gap-1 opacity-80"
                      disabled
                    >
                      <BsCartPlus className="text-xl" />
                      Add to Cart
                    </button>
                  )}
                </div>
              </div>
            </div>
            <div className="col-span-4 flex flex-col gap-4">
              <form
                className="space-y-6 border rounded px-6 py-4"
                onSubmit={handleSubmit(submitHandler)}
              >
                <h2 className="text-center">Rate our Product</h2>
                <div className="flex justify-between items-center">
                  <label htmlFor="rating">Your Rating</label>
                  <select {...register("rating")} id="rating">
                    <option value={parseInt(5)}>5 - Excellent</option>
                    <option value={parseInt(4)}>4 - Very good</option>
                    <option value={parseInt(3)}>3 - Good</option>
                    <option value={parseInt(2)}>2 - Fair</option>
                    <option value={parseInt(1)}>1 - Poor</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="comments">Your Comments</label>
                  <textarea
                    name="comments"
                    id="comments"
                    className="border rounded w-full p-2"
                    placeholder="Leave a message..."
                    {...register("comments")}
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={reviewIsLoading}
                >
                  Submit
                </button>
                {reviewIsLoading ? <Loading /> : null}
              </form>
              <div className="space-y-6 border rounded px-6 py-4">
                <h2 className="text-center">Customers' Reviews</h2>
                <p className="text-end text-sm">
                  {product.numReviews > 0
                    ? `${product.numReviews} reviews`
                    : `${product.numReviews} review`}
                </p>
                <ul className="border rounded divide-y">
                  {product.reviews && product.reviews.length === 0 ? (
                    <MessageBox info>There is no review</MessageBox>
                  ) : (
                    product.reviews
                      .slice(firstPageIndex, lastPageIndex)
                      .reverse()
                      .map((review) => (
                        <li key={review._id} className="mb-2 p-2">
                          <div className="grid grid-cols-2">
                            <p className="font-bold">
                              {`${review.firstName} ${review.lastName}`}
                            </p>
                            <p className="text-end">
                              {review.createdAt.substring(0, 10)}
                            </p>
                          </div>
                          <Rating rating={review.rating} />
                          <p>{review.comments}</p>
                        </li>
                      ))
                  )}
                </ul>
                <Pagination
                  items={product.reviews}
                  PAGE_SIZE={PAGE_SIZE}
                  setCurrentPage={setCurrentPage}
                  currentPage={currentPage}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductPage;
