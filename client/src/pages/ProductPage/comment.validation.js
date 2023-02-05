import * as yup from "yup";

export const schema = yup
  .object()
  .shape({
    rating: yup.number().required(),
    comments: yup.string(),
  })
  .required();
