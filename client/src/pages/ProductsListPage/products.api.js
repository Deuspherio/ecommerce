import axios from "axios";

export const getProducts = async (userData) => {
  const { data } = await axios.get("/api/products/admin", {
    headers: { Authorization: `Bearer ${userData.token}` },
  });
  return data;
};

export const deleteProduct = async (id, userData) => {
  const { data } = await axios.delete(`/api/products/${id}`, {
    headers: { Authorization: `Bearer ${userData.token}` },
  });
  return data;
};
