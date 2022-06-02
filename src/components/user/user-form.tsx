import Button from "@components/ui/button";
import Input from "@components/ui/input";
import PasswordInput from "@components/ui/password-input";
import { Control, FieldErrors, FormProvider, useForm } from "react-hook-form";
import Card from "@components/common/card";
import Description from "@components/ui/description";
import { useCreateUserMutation } from "@data/user/use-user-create.mutation";
import { useUpdateUserMutation } from "@data/user/use-user-update.mutation";
import { useTranslation } from "next-i18next";
import { yupResolver } from "@hookform/resolvers/yup";
import { customerValidationSchema } from "./user-validation-schema";
import Checkbox from "@components/ui/checkbox/checkbox";
import { Supplier, User, UserGroup } from "@ts-types/generated";
import UserGroupInput from "./user-group-input";
import { useState } from "react";
import { cloneDeep, initial } from "lodash";
import Alert from "@components/ui/alert";

type FormValues = {
  userName: string;
  userEmail: string;
  userPassword: string;
  userPasswordConfirmation: string;
  userPhone: string;
  userAddress: string;
  userUserGroup: UserGroup;
  isSupplier: boolean;
  isChangePassword: boolean;
  supplier: Supplier;
  oldPassword: string
};

const defaultValues = {
  userEmail: "",
  userPassword: "",
  userUserGroup: "",
  supplier: "",
  isSupplier: true,
  isChangePassword: false
};

type IProps = {
  initialValues?: User | null;
};

export default function CreateOrUpdateUsersForm({
  initialValues,
}: IProps) {
  const { t } = useTranslation();
  const { mutate: registerUser, isLoading: creating } = useCreateUserMutation();
  const { mutate: updateUser, isLoading: updating } = useUpdateUserMutation();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const methods = useForm<FormValues>({
    shouldUnregister: true,
    defaultValues: initialValues
      ? cloneDeep({
        ...initialValues,
        userUserGroup: initialValues.user_group,
        isSupplier: initialValues?.userSupplierId ? true : false,
      })
      : defaultValues,
    resolver: initialValues ? null : yupResolver(customerValidationSchema),
  });
  const {
    register,
    handleSubmit,
    setError,
    watch,
    control,

    formState: { errors },
  } = methods;

  const onSubmit = async (values: FormValues) => {
    const input = {
      userName: values.userName!,
      userEmail: values.userEmail!,
      userPassword: values.userPassword!,
      userPhone: values.userPhone!,
      userAddress: values.userAddress!,
      userUserGroupId: values.userUserGroup?.userGroupId!,
      userSupplierId: values?.supplier?.supplierId!,
      supplier: values.supplier!,
      isSupplier: values.isSupplier,
      oldPassword: values.oldPassword
    };
    if (initialValues) {
      updateUser(
        {
          variables: {
            userId: initialValues?.userId,
            input: input,
          },
        },
        {
          onError: (error: any) => {
            Object.keys(error?.response?.data).forEach((field: any) => {
              setError(field, {
                type: "manual",
                message: error?.response?.data[field][0],
              });
            });
          },
        }
      );
    } else {
      registerUser(
        {
          variables: input,
        },
        {
          onError: (error: any) => {
            Object.keys(error?.response?.data).forEach((field: any) => {
              setError(field, {
                type: "manual",
                message: error?.response?.data[field][0],
              });
            });
          },
        }
      );
    }
  }

  const isSupplier = watch("isSupplier");
  const isChangePassword = watch("isChangePassword");
  return (
    <>
      {errorMessage ? (
        <Alert
          message={t(`common:${errorMessage}`)}
          variant="error"
          closeable={true}
          className="mt-5"
          onClose={() => setErrorMessage(null)}
        />
      ) : null}
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="flex flex-wrap my-5 sm:my-8">
            <Description
              title={t("form:form-title-information")}
              details={initialValues ? t("form:user-change-form-info-help-text") : t("form:user-form-info-help-text")}
              className="w-full px-0 sm:pe-4 md:pe-5 pb-5 sm:w-4/12 md:w-1/3 sm:py-8"
            />

            <Card className="w-full sm:w-8/12 md:w-2/3">
              <Input
                label={t("form:input-label-name")}
                {...register("userName")}
                type="text"
                variant="outline"
                className="mb-4"
                error={t(errors.userName?.message!)}
              />
              <Input
                label={t("form:input-label-email")}
                {...register("userEmail")}
                type="email"
                variant="outline"
                className="mb-4"
                error={t(errors.userEmail?.message!)}
              />{!initialValues ? (
                <>
                  <PasswordInput
                    label={t("form:input-label-password")}
                    {...register("userPassword")}
                    error={t(errors.userPassword?.message!)}
                    variant="outline"
                    className="mb-4"
                  />
                  <PasswordInput
                    label={t("form:input-label-confirm-password")}
                    {...register("userPasswordConfirmation")}
                    variant="outline"
                    error={t(errors.userPasswordConfirmation?.message!)}
                    className="mb-4"
                  /></>
              ) : null}
              <Input
                label={t("form:input-label-phone")}
                {...register("userPhone")}
                type="number"
                variant="outline"
                className="mb-4"
                error={t(errors.userPhone?.message!)}
              />
              <Input
                label={t("form:input-label-address")}
                {...register("userAddress")}
                type="text"
                variant="outline"
                className="mb-4"
                error={t(errors.userAddress?.message!)}
              />
              <UserGroupInput control={control} error={t((errors?.userUserGroup as any)?.message)} initialValues={initialValues} />

              <div className="flex flex-wrap my-5 sm:my-8">
                {initialValues ? (
                  <Checkbox
                    {...register("isChangePassword")}
                    error={t(errors.isChangePassword?.message!)}
                    label={t("form:input-label-as-change-password")}
                    className="mb-5 mr-2"
                  />) : null}
                <Checkbox
                  {...register("isSupplier")}
                  error={t(errors.isSupplier?.message!)}
                  label={t("form:input-label-as-supplier")}
                  className="mb-5"
                />
              </div>
            </Card>
          </div>
          {isChangePassword && initialValues ? (
            <div className="flex flex-wrap my-5 sm:my-8">
              <Description
                title={t("form:input-label-password")}
                details={t("form:password-help-text")}
                className="w-full px-0 sm:pe-4 md:pe-5 pb-5 sm:w-4/12 md:w-1/3 sm:py-8"
              />

              <Card className="w-full sm:w-8/12 md:w-2/3 mb-5">
                <PasswordInput
                  label={t("form:input-label-old-password")}
                  {...register("oldPassword")}
                  variant="outline"
                  error={t(errors.oldPassword?.message!)}
                  className="mb-5"
                />
                <PasswordInput
                  label={t("form:input-label-new-password")}
                  {...register("userPassword")}
                  variant="outline"
                  error={t(errors.userPassword?.message!)}
                  className="mb-5"
                />
                <PasswordInput
                  label={t("form:input-label-confirm-password")}
                  {...register("userPasswordConfirmation")}
                  variant="outline"
                  error={t(errors.userPasswordConfirmation?.message!)}
                />
              </Card>
            </div>) : null}
          {isSupplier ? (
            <div className="flex flex-wrap my-5 sm:my-8">
              <Description
                title={t("form:form-title-supplier")}
                details={initialValues ? t("form:supplier-change-form-info-help-text") : t("form:supplier-form-info-help-text")}
                className="w-full px-0 sm:pe-4 md:pe-5 pb-5 sm:w-4/12 md:w-1/3 sm:py-8"
              />

              <Card className="w-full sm:w-8/12 md:w-2/3">
                <Input
                  {...register("supplier.supplierId")}
                  type="hidden"
                  variant="outline"
                  className="mb-4"
                />
                <Input
                  label={t("form:input-label-supplier-name")}
                  {...register("supplier.supplierName")}
                  type="text"
                  variant="outline"
                  className="mb-4"
                />
                <Input
                  label={t("form:input-label-supplier-email")}
                  {...register("supplier.supplierEmail")}
                  type="email"
                  variant="outline"
                  className="mb-4"
                />
                <Input
                  label={t("form:input-label-supplier-phone")}
                  {...register("supplier.supplierPhone")}
                  type="number"
                  variant="outline"
                  className="mb-4"
                />
                <Input
                  label={t("form:input-label-supplier-address")}
                  {...register("supplier.supplierAddress")}
                  type="text"
                  variant="outline"
                  className="mb-4"
                />
                <Input
                  label={t("form:input-label-supplier-city")}
                  {...register("supplier.supplierCity")}
                  type="text"
                  variant="outline"
                  className="mb-4"
                />
                <Input
                  label={t("form:input-label-supplier-province")}
                  {...register("supplier.supplierProvince")}
                  type="text"
                  variant="outline"
                  className="mb-4"
                />
                <Input
                  label={t("form:input-label-supplier-postal-code")}
                  {...register("supplier.supplierPostalCode")}
                  type="text"
                  variant="outline"
                  className="mb-4"
                />
              </Card>
            </div>) : null}

          <div className="mb-4 text-end">
            <Button loading={updating || creating}>
              {initialValues ? t("form:button-label-update-user") : t("form:button-label-create-user")}
            </Button>
          </div>
        </form>
      </FormProvider>
    </>
  );
}

