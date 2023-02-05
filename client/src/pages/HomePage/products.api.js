import axios from "axios";

export const getProducts = async (page, category, price, rating, order) => {
  const { data } = await axios.get(
    `/api/products/?page=${page}&category=${category}&price=${price}&rating=${rating}&order=${order}`
  );
  return data;
};
