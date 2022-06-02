import Card from "@components/common/card";
import { DownloadIcon } from "@components/icons/download-icon";
import Button from "@components/ui/button";
import Description from "@components/ui/description";
import Input from "@components/ui/input";
import { useModalAction, useModalState } from "@components/ui/modal/modal.context";
import NumberInput from "@components/ui/number-input";
import TextArea from "@components/ui/text-area";
import { useCreateTagMutation } from "@data/tag/use-tag-create.mutation";
import { yupResolver } from "@hookform/resolvers/yup";
import { ProductCategory } from "@ts-types/generated";
import { getAuthCredentials } from "@utils/auth-utils";
import { useTranslation } from "next-i18next";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import NumberFormat from "react-number-format";
import { tagValidationSchema } from "./tag-validation-schema";

type FormValues = {
    tagName: string;
    tagDesc: string;
}

const AddTagView = () => {
    const { userId } = getAuthCredentials()

    const { t } = useTranslation();

    const { mutate: createTag, isLoading: tagLoading } =
        useCreateTagMutation();

    const methods = useForm<FormValues>({
        resolver: yupResolver(tagValidationSchema),
    });
    const {
        handleSubmit,
        setError,
        register,
        formState: { errors },
    } = methods;

    const { closeModal } = useModalAction();

    const onSubmit = async (values: FormValues) => {
        const formData = new FormData();
        formData.append("userId", userId);
        formData.append("tagName", values?.tagName);
        formData.append("tagDesc", values?.tagDesc);

        // const input = {
        //     productCategoryName: values?.tagName,
        //     productCategoryDesc: values?.tagDesc,
        // };

        createTag(
            formData,
            {
                onSuccess: () => {
                    closeModal()
                },
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

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Card className="flex flex-col min-h-screen md:min-h-0">
                <div className="w-full mb-5">
                    <h1 className="text-lg font-semibold text-heading">
                        Add Tag Product
                    </h1>
                </div>

                <div className="w-full">
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
                </div>
                {/* <ImportProducts />
                <ImportVariationOptions /> */}
                {/* <a
                    href={`${process?.env?.NEXT_PUBLIC_REST_API_ENDPOINT}export-products/${shopId}`}
                    target="_blank"
                    className="border-dashed border-2 border-border-base h-36 rounded flex flex-col justify-center items-center cursor-pointer focus:border-accent-400 focus:outline-none p-5"
                >
                    <DownloadIcon className="text-muted-light w-10" />

                    <span className="text-sm mt-4 text-center text-accent font-semibold">
                        {t("common:text-export-products")}
                    </span>
                </a>

                <a
                    href={`${process?.env?.NEXT_PUBLIC_REST_API_ENDPOINT}export-variation-options/${shopId}`}
                    target="_blank"
                    className="border-dashed border-2 border-border-base h-36 rounded flex flex-col justify-center items-center cursor-pointer focus:border-accent-400 focus:outline-none p-5"
                >
                    <DownloadIcon className="text-muted-light w-10" />
                    <span className="text-sm mt-4 text-center text-accent font-semibold">
                        {t("common:text-export-product-variations")}
                    </span>
                </a> */}
                <div className="mb-4 text-end">
                    <Button size="small" loading={tagLoading}>
                        Add Tag
                    </Button>
                </div>
            </Card>
        </form>
    );
};

export default AddTagView;
