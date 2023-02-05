import axios from "axios";

export const getUsers = async (userData) => {
  const { data } = await axios.get("/api/users", {
    headers: { authorization: `Bearer ${userData.token}` },
  });
  return data;
};
