import * as yup from "yup";
export const customerValidationSchema = yup.object().shape({
  userName: yup.string().required("form:error-name-required"),
  userEmail: yup
    .string()
    .email("form:error-email-format")
    .required("form:error-email-required"),
  userPassword: yup.string().required("form:error-password-required"),
  userPasswordConfirmation: yup
    .string()
    .oneOf([yup.ref("userPassword")], "form:error-match-passwords")
    .required("form:error-confirm-password"),
  userPhone: yup.string().required("form:error-phone-required"),
  userAddress: yup.string().required("form:error-address-required"),
});
