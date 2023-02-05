import axios from "axios";

export const getOrders = async (userData) => {
  try {
    const { data } = await axios.get("/api/orders/history", {
      headers: { Authorization: `Bearer ${userData.token}` },
    });
    return data;
  } catch (err) {
    return err;
  }
};
