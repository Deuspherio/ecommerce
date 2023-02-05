import axios from "axios";

export const getProduct = async (id) => {
  const { data } = await axios.get(`/api/products/id/${id}`);
  return data;
};

export const postComments = async (id, userData, comments) => {
  const { data } = await axios.post(
    `/api/products/reviews/id/${id}`,
    comments,
    {
      headers: { authorization: `Bearer ${userData.token}` },
    }
  );
  return data;
};
