import * as yup from "yup";

export const schema = yup
  .object()
  .shape({
    name: yup.string().required(),
    category: yup.string().required(),
    price: yup.number().positive().min(1).required(),
    stocks: yup.number().positive().min(1).required(),
  })
  .required();
