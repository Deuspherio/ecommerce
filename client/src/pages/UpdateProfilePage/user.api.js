import axios from "axios";

export const patchUser = async (user, token) => {
  const { data } = await axios.patch("/api/users", user, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};
