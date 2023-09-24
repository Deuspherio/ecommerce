import axios from "axios";

export const patchProductsPrice = async (algo, userData) => {
  const { data } = await axios.patch(
    "/api/products/update/prices",
    { algo: algo },
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
