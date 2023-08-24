import axios from "axios";

export const getOrder = async (id, userData) => {
  const { data } = await axios.get(`/api/orders/id/${id}`, {
    headers: { Authorization: `Bearer ${userData.token}` },
  });
  return data;
};

export const updateDelivery = async (id, values, userData) => {
  const { data } = await axios.patch(`/api/orders/delivery/id/${id}`, values, {
    headers: { Authorization: `Bearer ${userData.token}` },
  });
  return data;
};
