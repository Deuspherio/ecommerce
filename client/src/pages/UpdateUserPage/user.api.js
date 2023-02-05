import axios from "axios";

export const getUser = async (id, userData) => {
  const { data } = await axios.get(`/api/users/id/${id}`, {
    headers: { Authorization: `Bearer ${userData.token}` },
  });
  return data;
};

export const updateUser = async (user, id, userData) => {
  const { data } = await axios.patch(`/api/users/id/${id}`, user, {
    headers: { Authorization: `Bearer ${userData.token}` },
  });
  return data;
};
