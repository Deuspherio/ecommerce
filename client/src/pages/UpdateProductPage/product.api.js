import axios from "axios";

export const getProduct = async (id) => {
  const { data } = await axios.get(`/api/products/id/${id}`);
  return data;
};

export const patchProduct = async (product, id, userData) => {
  const { data } = await axios.patch(`/api/products/id/${id}`, product, {
    Headers: { Authorization: `Bearer ${userData.token}` },
  });
  return data;
};
