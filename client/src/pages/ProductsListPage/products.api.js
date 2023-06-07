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

export const patchProductsPrice = async (userData) => {
  const { data } = await axios.patch(
    "/api/products/update/prices",
    {},
    {
      headers: { Authorization: `Bearer ${userData.token}` },
    }
  );
  return data;
};
export const patchProductsDiscount = async (discount, userData) => {
  const { data } = await axios.patch(
    "/api/products/update/discounts",
    { discount: discount },
    {
      headers: { Authorization: `Bearer ${userData.token}` },
    }
  );
  return data;
};

export const patchProductsIncrease = async (increase, userData) => {
  const { data } = await axios.patch(
    "/api/products/update/increase",
    { increase: increase },
    { headers: { Authorization: `Bearer ${userData.token}` } }
  );
  return data;
};
