import axios from "axios";

export const getProducts = async (userData) => {
  const { data } = await axios.get("/api/products/admin", {
    headers: { Authorization: `Bearer ${userData.token}` },
  });
  return data;
};

export const patchProductsPrediction = async (userData) => {
  const { data } = await axios.patch(
    "/api/products/update/prediction",
    {},
    { headers: { Authorization: `Bearer ${userData.token}` } }
  );
  return data;
};
