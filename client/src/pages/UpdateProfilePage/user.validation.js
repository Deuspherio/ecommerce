import * as yup from "yup";

export const schema = yup
  .object()
  .shape({
    firstName: yup.string().required(),
    lastName: yup.string().required(),
    email: yup.string().email().required(),
    phoneNumber: yup
      .string()
      .required()
      .matches(/^[0-9]+$/, "Must be only digits")
      .min(10, "Must be exactly 10 digits")
      .max(10, "Must be exactly 10 digits"),
    address: yup.string().required(),
    password: yup.string().min(8),
    passwordConfirmation: yup
      .string()
      .oneOf([yup.ref("password"), null], "Password must match"),
  })
  .required();
