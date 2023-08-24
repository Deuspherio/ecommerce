import * as yup from "yup";

export const schema = yup
  .object()
  .shape({
    delivery: yup.boolean().required(),
  })
  .required();
