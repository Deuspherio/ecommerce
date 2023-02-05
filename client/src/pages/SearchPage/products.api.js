import axios from "axios";

export const getProducts = async (
  page,
  query,
  category,
  price,
  rating,
  order
) => {
  const { data } = await axios.get(
    `/api/products/search?page=${page}&query=${query}&category=${category}&price=${price}&rating=${rating}&order=${order}`
  );
  return data;
};
