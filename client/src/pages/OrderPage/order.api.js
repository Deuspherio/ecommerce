import axios from "axios";

export const getOrder = async (id, userData) => {
  const { data } = await axios.get(`/api/orders/id/${id}`, {
    headers: { Authorization: `Bearer ${userData.token}` },
  });
  return data;
};
