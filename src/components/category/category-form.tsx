import Input from "@components/ui/input";
import {
  Control,
  FieldErrors,
  useForm,
  useFormState,
  useWatch,
} from "react-hook-form";
import Button from "@components/ui/button";
import TextArea from "@components/ui/text-area";
import Card from "@components/common/card";
import Description from "@components/ui/description";
import { useRouter } from "next/router";
import { Category, ProductCategory } from "@ts-types/generated";
import { useUpdateCategoryMutation } from "@data/category/use-category-update.mutation";
import { useCreateCategoryMutation } from "@data/category/use-category-create.mutation";
import { useTranslation } from "next-i18next";
import { yupResolver } from "@hookform/resolvers/yup";
import { categoryValidationSchema } from "./category-validation-schema";
import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import FilePondPluginImageResize from 'filepond-plugin-image-resize';
import FilePondPluginImageCrop from 'filepond-plugin-image-crop';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import { useState } from "react";
import getStorageUrl from "@utils/getStorageUrl";
import { useEffect } from "react";
import Checkbox from "@components/ui/checkbox/checkbox";
import { getAuthCredentials } from "@utils/auth-utils";

type FormValues = {
  productCategoryName: string;
  productCategoryDesc: string;
  isRestored: boolean;
};

const defaultValues = {
  productCategoryName: "",
  productCategoryDesc: "",
  isRestored: false
};

type IProps = {
  initialValues?: ProductCategory | null;
};
export default function CreateOrUpdateCategoriesForm({
  initialValues,
}: IProps) {
  const { userId } = getAuthCredentials()
  const router = useRouter();
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,

    formState: { errors },
  } = useForm<FormValues>({
    // shouldUnregister: true,
    //@ts-ignore
    defaultValues: initialValues
      ? {
        ...initialValues,
      }
      : defaultValues,
    resolver: yupResolver(categoryValidationSchema),
  });

  const { mutate: createCategory, isLoading: creating } =
    useCreateCategoryMutation();
  const { mutate: updateCategory, isLoading: updating } =
    useUpdateCategoryMutation();

  const [icon, setIcon] = useState([])
  const [iconOld, setIconOld] = useState([])

  registerPlugin(FilePondPluginImagePreview, FilePondPluginImageResize, FilePondPluginImageCrop, FilePondPluginFileValidateType)

  const onSubmit = async (values: FormValues) => {
    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("productCategoryName", values?.productCategoryName);
    formData.append("productCategoryDesc", values?.productCategoryDesc);
    formData.append("isRestored", values?.isRestored);
    icon?.forEach((t: any) => {
      formData.append("icon[]", t);
    });
    const input = {
      productCategoryName: values?.productCategoryName,
      productCategoryDesc: values?.productCategoryDesc,
    };
    if (initialValues) {
      updateCategory({
        variables: {
          productCategoryId: initialValues?.productCategoryId,
          formData: formData,
        },
      });
    } else {
      createCategory(formData);
    }
  };

  useEffect(() => {
    setIconOld(initialValues ? initialValues?.productCategoryIcon : []);
  }, [])

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-wrap my-5 sm:my-8">
        <Description
          title={t("form:input-label-description")}
          details={`${initialValues
            ? t("form:item-description-edit")
            : t("form:item-description-add")
            } ${t("form:category-description-helper-text")}`}
          className="w-full px-0 sm:pe-4 md:pe-5 pb-5 sm:w-4/12 md:w-1/3 sm:py-8 "
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <div className="flex flex-wrap my-5 sm:my-8">
            {initialValues ? null : (
              <>
                <div className="w-2/12">
                  <span className="font-semibold">Default:</span>
                  <div className="w-10 h-10 relative flex items-center justify-center overflow-hidden border border-black mt-1 p-1">
                    <img src={getStorageUrl + '/images/defaultprodcaticon.png'}></img>
                  </div>
                </div>
              </>)}

            <div className={initialValues ? "w-full" : "w-10/12"}>
              <FilePond
                files={icon}
                onupdatefiles={fileItems => {
                  setIcon(fileItems.map(fileItem => fileItem.file))
                }}
                allowImageResize
                imageResizeTargetWidth="200"
                imageResizeTargetHeight="200"
                imageResizeMode="contain"
                imageResizeUpscale
                imageCropAspectRatio="1:1"
                // disabled={previewGallery.length + +gallery.length >= 5 ? true : false}
                name="files"
                allowFileTypeValidation
                acceptedFileTypes={['image/*']}
                labelIdle='Drag & Drop your icon or <span class="filepond--label-action">Browse</span>'
              />
              {initialValues ? (
                <aside className="flex flex-wrap mt-2">
                  <div
                    className="inline-flex flex-col overflow-hidden border border-border-200 rounded mt-2 me-2 relative"
                  >
                    <div className="flex items-center justify-center min-w-0 w-16 h-16 overflow-hidden">
                      <img src={getStorageUrl + iconOld} />
                    </div>
                  </div>
                </aside>) : null
              }
            </div>
          </div>
          <Input
            label={t("form:input-label-name")}
            {...register("productCategoryName")}
            error={t(errors.productCategoryName?.message!)}
            variant="outline"
            className="mb-5"
          />

          <TextArea
            label={t("form:input-label-description")}
            {...register("productCategoryDesc")}
            variant="outline"
            className="mb-5"
          />
          {initialValues?.isDeleted === 1 ? (
            <Checkbox
              {...register("isRestored")}
              error={t(errors.isRestored?.message!)}
              label={t("form:input-label-restore")}
              className="mr-2"
            />) : null}
        </Card>
      </div>
      <div className="mb-4 text-end">
        {initialValues && (
          <Button
            variant="outline"
            onClick={router.back}
            className="me-4"
            type="button"
          >
            {t("form:button-label-back")}
          </Button>
        )}

        <Button loading={creating || updating}>
          {initialValues
            ? t("form:button-label-update-category")
            : t("form:button-label-add-category")}
        </Button>
      </div>
    </form>
  );
}
