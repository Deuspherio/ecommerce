import * as yup from "yup";

export const schema = yup
  .object()
  .shape({
    stocks: yup.number("Must be a whole number").required(),
  })
  .required();
