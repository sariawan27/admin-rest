import * as yup from "yup";
export const categoryValidationSchema = yup.object().shape({
  productCategoryName: yup.string().required("form:error-name-required"),
});
