import Button from "@components/ui/button";
import Input from "@components/ui/input";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useTranslation } from "next-i18next";
import { yupResolver } from "@hookform/resolvers/yup";
import Description from "@components/ui/description";
import Card from "@components/common/card";
import FileInput from "@components/ui/file-input";
import TextArea from "@components/ui/text-area";
import { shopValidationSchema } from "./shop-validation-schema";
import { getFormattedImage } from "@utils/get-formatted-image";
import { useCreateShopMutation } from "@data/shop/use-shop-create.mutation";
import { useUpdateShopMutation } from "@data/shop/use-shop-update.mutation";
import {
  BalanceInput,
  ShopSettings,
  ShopSocialInput,
  UserAddressInput,
} from "@ts-types/generated";
import GooglePlacesAutocomplete from "@components/form/google-places-autocomplete";
import Label from "@components/ui/label";
import { getIcon } from "@utils/get-icon";
import SelectInput from "@components/ui/select-input";
import * as socialIcons from "@components/icons/social";
import omit from "lodash/omit";
import { getAuthCredentials } from "@utils/auth-utils";
import { useRouter } from "next/router";
import { ROUTES } from "@utils/routes";

const socialIcon = [
  {
    value: "FacebookIcon",
    label: "Facebook",
  },
  {
    value: "InstagramIcon",
    label: "Instagram",
  },
  {
    value: "TwitterIcon",
    label: "Twitter",
  },
  {
    value: "YouTubeIcon",
    label: "Youtube",
  },
];

export const updatedIcons = socialIcon.map((item: any) => {
  item.label = (
    <div className="flex space-s-4 items-center text-body">
      <span className="flex w-4 h-4 items-center justify-center">
        {getIcon({
          iconList: socialIcons,
          iconName: item.value,
          className: "w-4 h-4",
        })}
      </span>
      <span>{item.label}</span>
    </div>
  );
  return item;
});

type FormValues = {
  name: string;
  description: string;
  cover_image: any;
  logo: any;
  balance: BalanceInput;
  address: UserAddressInput;
  settings: ShopSettings;
};

const ShopForm = ({ initialValues }: { initialValues?: any }) => {
  const router = useRouter();
  console.log(initialValues)
  // const { shopId } = getAuthCredentials();
  // if (shopId !== null) {
  //   router.replace(ROUTES.DASHBOARD);
  // }
  const { mutate: createShop, isLoading: creating } = useCreateShopMutation();
  const { mutate: updateShop, isLoading: updating } = useUpdateShopMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    control,
  } = useForm<FormValues>({
    ...(initialValues
      ? {
        defaultValues: {
          ...initialValues,
          logo: getFormattedImage(initialValues.logo),
          cover_image: getFormattedImage(initialValues.cover_image),
          payment_info: initialValues?.payment_info[0],
          supplier: initialValues?.supplier[0],
          settings: {
            ...initialValues?.settings,
            socials: initialValues?.settings?.socials
              ? initialValues?.settings?.socials.map((social: any) => ({
                icon: updatedIcons?.find(
                  (icon) => icon?.value === social?.icon
                ),
                url: social?.url,
              }))
              : [],
          },
        },
      }
      : {}),
    resolver: yupResolver(shopValidationSchema),
  });
  const { t } = useTranslation();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "settings.socials",
  });

  function onSubmit(values: FormValues) {
    const settings = {
      ...values?.settings,
      location: { ...omit(values?.settings?.location, "__typename") },
      socials: values?.settings?.socials
        ? values?.settings?.socials?.map((social: any) => ({
          icon: social?.icon?.value,
          url: social?.url,
        }))
        : [],
    };
    if (initialValues) {
      const { ...restAddress } = values.address;
      updateShop({
        variables: {
          id: initialValues.id,
          input: {
            ...values,
            address: restAddress,
            settings,
            balance: {
              id: initialValues.balance?.id,
              ...values.balance,
            },
          },
        },
      });
    } else {
      createShop({
        variables: {
          input: {
            ...values,
            settings,
            balance: {
              ...values.balance,
            },
          },
        },
      });
    }
  }

  const coverImageInformation = (
    <span>
      {t("form:shop-cover-image-help-text")} <br />
      {t("form:cover-image-dimension-help-text")} &nbsp;
      <span className="font-bold">1170 x 435{t("common:text-px")}</span>
    </span>
  );

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="flex flex-wrap pb-8 border-b border-dashed border-border-base my-5 sm:my-8">
          <Description
            title={t("form:input-label-logo")}
            details={t("form:shop-logo-help-text")}
            className="w-full px-0 sm:pe-4 md:pe-5 pb-5 sm:w-4/12 md:w-1/3 sm:py-8"
          />

          <Card className="w-full sm:w-8/12 md:w-2/3">
            <FileInput name="logo" control={control} multiple={false} />
          </Card>
        </div>

        <div className="flex flex-wrap pb-8 border-b border-dashed border-border-base my-5 sm:my-8">
          <Description
            title={t("form:shop-cover-image-title")}
            details={coverImageInformation}
            className="w-full px-0 sm:pe-4 md:pe-5 pb-5 sm:w-4/12 md:w-1/3 sm:py-8"
          />

          <Card className="w-full sm:w-8/12 md:w-2/3">
            <FileInput name="cover_image" control={control} multiple={false} />
          </Card>
        </div>
        <div className="flex flex-wrap pb-8 border-b border-dashed border-border-base my-5 sm:my-8">
          <Description
            title={t("form:shop-basic-info")}
            details={t("form:shop-basic-info-help-text")}
            className="w-full px-0 sm:pe-4 md:pe-5 pb-5 sm:w-4/12 md:w-1/3 sm:py-8"
          />
          <Card className="w-full sm:w-8/12 md:w-2/3">
            <Input
              label={t("form:input-label-name")}
              {...register("shopName")}
              variant="outline"
              className="mb-5"
              error={t(errors.shopName?.message!)}
            />
            <TextArea
              label={t("form:input-label-description")}
              {...register("shopDescription")}
              variant="outline"
              error={t(errors.shopDescription?.message!)}
            />
          </Card>
        </div>
        <div className="flex flex-wrap pb-8 border-b border-dashed border-gray-300 my-5 sm:my-8">
          <Description
            title={t("form:shop-payment-info")}
            details={t("form:payment-info-helper-text")}
            className="w-full px-0 sm:pe-4 md:pe-5 pb-5 sm:w-4/12 md:w-1/3 sm:py-8"
          />

          <Card className="w-full sm:w-8/12 md:w-2/3">
            <Input
              label={t("form:input-label-account-holder-name")}
              {...register("payment_info.paymentInfoName")}
              variant="outline"
              className="mb-5"
              error={t(errors.payment_info?.paymentInfoName?.message!)}
            />
            <Input
              label={t("form:input-label-account-holder-email")}
              {...register("payment_info.paymentInfoEmail")}
              variant="outline"
              className="mb-5"
              error={t(errors.payment_info?.paymentInfoEmail?.message!)}
            />
            <Input
              label={t("form:input-label-bank-name")}
              {...register("payment_info.paymentInfoBank")}
              variant="outline"
              className="mb-5"
              error={t(errors.payment_info?.paymentInfoBank?.message!)}
            />
            <Input
              label={t("form:input-label-account-number")}
              {...register("payment_info.paymentInfoAccount")}
              variant="outline"
              error={t(errors.payment_info?.paymentInfoAccount?.message!)}
            />
          </Card>
        </div>
        <div className="flex flex-wrap pb-8 border-b border-dashed border-gray-300 my-5 sm:my-8">
          <Description
            title={t("common:text-supplier")}
            details={t("common:text-supplier-helper")}
            className="w-full px-0 sm:pe-4 md:pe-5 pb-5 sm:w-4/12 md:w-1/3 sm:py-8"
          />

          <Card className="w-full sm:w-8/12 md:w-2/3">
            <Input
              label={t("common:text-name")}
              {...register("supplier.supplierName")}
              variant="outline"
              className="mb-5"
              error={t(errors.supplier?.supplierName?.message!)}
            />
            <Input
              label={t("common:text-email")}
              {...register("supplier.supplierEmail")}
              variant="outline"
              className="mb-5"
              error={t(errors.supplier?.supplierEmail?.message!)}
            />
            <Input
              label={t("common:text-address")}
              {...register("supplier.supplierAddress")}
              variant="outline"
              className="mb-5"
              error={t(errors.supplier?.supplierAddress?.message!)}
            />
            <Input
              label={t("common:text-city")}
              {...register("supplier.supplierCity")}
              variant="outline"
              className="mb-5"
              error={t(errors.supplier?.supplierCity?.message!)}
            />
            <Input
              label={t("common:text-province")}
              {...register("supplier.supplierProvince")}
              variant="outline"
              className="mb-5"
              error={t(errors.supplier?.supplierProvince?.message!)}
            />
            <Input
              label={t("common:text-postal-code")}
              {...register("supplier.supplierPostalCode")}
              variant="outline"
              className="mb-5"
              error={t(errors.supplier?.supplierPostalCode?.message!)}
            />
            <Input
              label={t("common:text-phone")}
              {...register("supplier.supplierPhone")}
              variant="outline"
              className="mb-5"
              error={t(errors.supplier?.supplierPhone?.message!)}
            />
          </Card>
        </div>
        <div className="flex flex-wrap pb-8 border-b border-dashed border-gray-300 my-5 sm:my-8">
          <Description
            title={t("common:text-shop-settings")}
            details={t("common:text-shop-settings-helper")}
            className="w-full px-0 sm:pe-4 md:pe-5 pb-5 sm:w-4/12 md:w-1/3 sm:py-8"
          />

          <Card className="w-full sm:w-8/12 md:w-2/3">
            {/* <div className="mb-5">
                            <Label>{t("form:input-label-autocomplete")}</Label>
                            <Controller
                                control={control}
                                name="settings.location"
                                render={({ field: { onChange } }) => (
                                    <></>
                                    // <GooglePlacesAutocomplete
                                    //     onChange={onChange}
                                    //     data={getValues("settings.location")!}
                                    // />
                                )}
                            />
                        </div> */}
            <Input
              label={t("common:text-contact-number")}
              {...register("settings.shopSettingContact")}
              variant="outline"
              className="mb-5"
              error={t(errors.settings?.shopSettingContact?.message!)}
            />
            <Input
              label={t("common:text-website")}
              {...register("settings.shopSettingWebsite")}
              variant="outline"
              className="mb-5"
              error={t(errors.settings?.shopSettingWebsite?.message!)}
            />
            <div>
              {fields.map(
                (item: ShopSocialInput & { id: string }, index: number) => (
                  <div
                    className="border-b border-dashed border-border-200 first:border-t last:border-b-0 first:mt-5 md:first:mt-10 py-5 md:py-8"
                    key={item.id}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-5 gap-5">
                      <div className="sm:col-span-2">
                        <Label>{t("form:input-label-select-platform")}</Label>
                        <SelectInput
                          name={`settings.socials.${index}.icon` as const}
                          control={control}
                          options={updatedIcons}
                          isClearable={true}
                          defaultValue={item?.icon!}
                        />
                      </div>
                      {/* <Input
                        className="sm:col-span-2"
                        label={t("form:input-label-icon")}
                        variant="outline"
                        {...register(`settings.socials.${index}.icon` as const)}
                        defaultValue={item?.icon!} // make sure to set up defaultValue
                      /> */}
                      <Input
                        className="sm:col-span-2"
                        label={t("form:input-label-url")}
                        variant="outline"
                        {...register(`settings.socials.${index}.url` as const)}
                        defaultValue={item.url!} // make sure to set up defaultValue
                      />
                      <button
                        onClick={() => {
                          remove(index);
                        }}
                        type="button"
                        className="text-sm text-red-500 hover:text-red-700 transition-colors duration-200 focus:outline-none sm:mt-4 sm:col-span-1"
                      >
                        {t("form:button-label-remove")}
                      </button>
                    </div>
                  </div>
                )
              )}
            </div>
            {/* <Button
                            type="button"
                            onClick={() => append({ icon: "", url: "" })}
                            className="w-full sm:w-auto"
                        >
                            {t("form:button-label-add-social")}
                        </Button> */}
          </Card>
        </div>

        <div className="mb-5 text-end">
          <Button
            loading={creating || updating}
            disabled={creating || updating}
          >
            {initialValues
              ? t("form:button-label-update")
              : t("form:button-label-save")}
          </Button>
        </div>
      </form>
    </>
  );
};

export default ShopForm;
