import * as yup from "yup";

export const schema = yup
  .object()
  .shape({
    name: yup.string().required(),
    category: yup.string().required(),
    price: yup.number().required(),
    stocks: yup.number("Must be a whole number").required(),
  })
  .required();
