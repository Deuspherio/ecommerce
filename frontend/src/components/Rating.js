import React from "react";
import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";
import { roundToTwo } from "../utilities";

function Rating({ rating }) {
  return (
    <>
      {rating > 0 && (
        <div>
          {rating >= 1 ? (
            <FaStar />
          ) : rating >= 0.5 ? (
            <FaStarHalfAlt />
          ) : (
            <FaRegStar />
          )}
          {rating >= 2 ? (
            <FaStar />
          ) : rating >= 1.5 ? (
            <FaStarHalfAlt />
          ) : (
            <FaRegStar />
          )}
          {rating >= 3 ? (
            <FaStar />
          ) : rating >= 2.5 ? (
            <FaStarHalfAlt />
          ) : (
            <FaRegStar />
          )}
          {rating >= 4 ? (
            <FaStar />
          ) : rating >= 3.5 ? (
            <FaStarHalfAlt />
          ) : (
            <FaRegStar />
          )}
          {rating >= 5 ? (
            <FaStar />
          ) : rating >= 4.5 ? (
            <FaStarHalfAlt />
          ) : (
            <FaRegStar />
          )}
          {rating && <span>{` (${roundToTwo(rating)})`}</span>}
          {!rating && ""}
        </div>
      )}
    </>
  );
}

export default Rating;
