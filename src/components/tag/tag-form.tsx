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
import { useCreateTagMutation } from "@data/tag/use-tag-create.mutation";
import { useUpdateTagMutation } from "@data/tag/use-tag-update.mutation";
import { tagValidationSchema } from "./tag-validation-schema";

type FormValues = {
  tagName: string;
  tagDesc: string;
  isRestored: boolean;
};

const defaultValues = {
  tagName: "",
  tagDesc: "",
  isRestored: false
};

type IProps = {
  initialValues?: ProductCategory | null;
};
export default function CreateOrUpdateTagForm({
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
    resolver: yupResolver(tagValidationSchema),
  });

  const { mutate: createTag, isLoading: creating } =
    useCreateTagMutation();
  const { mutate: updateTag, isLoading: updating } =
    useUpdateTagMutation();

  const [icon, setIcon] = useState([])
  const [iconOld, setIconOld] = useState([])

  registerPlugin(FilePondPluginImagePreview, FilePondPluginImageResize, FilePondPluginImageCrop, FilePondPluginFileValidateType)

  const onSubmit = async (values: FormValues) => {
    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("tagName", values?.tagName);
    formData.append("tagDesc", values?.tagDesc);
    formData.append("isRestored", values?.isRestored);
    // icon?.forEach((t: any) => {
    //   formData.append("icon[]", t);
    // });

    if (initialValues) {
      updateTag({
        variables: {
          tagId: initialValues?.tagId,
          formData: formData,
        },
      });
    } else {
      createTag(formData);
    }
  };

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
          <Input
            label={t("form:input-label-name")}
            {...register("tagName")}
            error={t(errors.tagName?.message!)}
            variant="outline"
            className="mb-5"
          />

          <TextArea
            label={t("form:input-label-description")}
            {...register("tagDesc")}
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
            ? t("form:button-label-update-tag")
            : t("form:button-label-add-tag")}
        </Button>
      </div>
    </form>
  );
}
