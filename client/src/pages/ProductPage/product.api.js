import axios from "axios";

export const getProduct = async (slug) => {
  const { data } = await axios.get(`/api/products/slug/${slug}`);
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
