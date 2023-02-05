import * as yup from "yup";

export const allProductsSchema = yup
  .object()
  .shape({
    discount: yup.number().required(),
  })
  .required();

export const productSchema = yup
  .object()
  .shape({
    newDiscount: yup.number().required(),
  })
  .required();
