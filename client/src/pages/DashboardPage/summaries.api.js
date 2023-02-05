import axios from "axios";

export const getSummaries = async (userData) => {
  const { data } = await axios.get("/api/orders/summary", {
    headers: { authorization: `Bearer ${userData.token}` },
  });
  return data;
};
