import axios from "axios";

export const postOrder = async (orders, userData) => {
  try {
    const { data } = await axios.post("/api/orders", orders, {
      headers: { Authorization: `Bearer ${userData.token}` },
    });
    return data;
  } catch (err) {
    return err;
  }
};
