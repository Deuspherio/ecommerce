import * as yup from "yup";

export const schema = yup
  .object()
  .shape({
    payment: yup.boolean().required(),
  })
  .required();
