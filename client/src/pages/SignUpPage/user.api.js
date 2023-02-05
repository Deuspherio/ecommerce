import axios from "axios";

export const postUser = async (user) => {
  const { data } = await axios.post("/api/users", user);
  return data;
};
