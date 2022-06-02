import * as yup from "yup";
export const tagValidationSchema = yup.object().shape({
  tagName: yup.string().required("form:error-name-required"),
});
