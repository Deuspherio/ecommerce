import axios from "axios";

export const createProduct = async (product,  userData) => {
  const { data } = await axios.post("/api/products", product, {
    headers: { Authorization: `Bearer ${userData.token}` },
  });
  return data;
};
