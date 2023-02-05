import axios from "axios";

export const getProducts = async (userData) => {
  const { data } = await axios.get("/api/products/admin", {
    headers: { Authorization: `Bearer ${userData.token}` },
  });
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

export const patchProductsDiscountByCategory = async (
  category,
  discount,
  userData
) => {
  const { data } = await axios.patch(
    "/api/products/update/discounts/category",
    { category: category, discount: discount },
    {
      headers: { Authorization: `Bearer ${userData.token}` },
    }
  );
  return data;
};

export const patchProductsPriceByCategory = async (category, userData) => {
  const { data } = await axios.patch(
    "/api/products/update/price/category",
    { category: category },
    {
      headers: { Authorization: `Bearer ${userData.token}` },
    }
  );
  return data;
};

export const patchProductDiscountById = async (id, discount, userData) => {
  const { data } = await axios.patch(
    `/api/products/update/discounts/id/${id}`,
    { discount: discount },
    {
      headers: { Authorization: `Bearer ${userData.token}` },
    }
  );
  return data;
};

export const patchProductPriceById = async (id, userData) => {
  const { data } = await axios.patch(
    `/api/products/update/price/id/${id}`,
    {},
    {
      headers: { Authorization: `Bearer ${userData.token}` },
    }
  );
  return data;
};
