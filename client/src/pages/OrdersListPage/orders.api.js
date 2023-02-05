import axios from "axios";

export const getOrders = async (userData) => {
  const { data } = await axios.get("/api/orders", {
    headers: { authorization: `Bearer ${userData.token}` },
  });
  return data;
};

export const deleteOrder = async (id, userData) => {
  const { data } = await axios.delete(`/api/orders/id/${id}`, {
    headers: { authorization: `Bearer ${userData.token}` },
  });
  return data;
};
