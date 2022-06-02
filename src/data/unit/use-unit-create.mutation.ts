import { CreateProductCategory, CreateProductUnit } from "@ts-types/generated";
import { ROUTES } from "@utils/routes";
import Category from "@repositories/category";
import { useRouter } from "next/router";
import { useMutation, useQueryClient } from "react-query";
import { API_ENDPOINTS } from "@utils/api/endpoints";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import ProductUnit from "@repositories/unit";

export interface IUnitCreateVariables {
    variables: { input: CreateProductUnit };
}

export const useCreateUnitMutation = () => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const router = useRouter();

    return useMutation(
        ({ variables: { input } }: IUnitCreateVariables) =>
            ProductUnit.create(API_ENDPOINTS.PRODUCT_UNITS, input),
        {
            onSuccess: () => {
                toast.success(t("common:successfully-created"));
            },
            // Always refetch after error or success:
            onSettled: () => {
                queryClient.invalidateQueries(API_ENDPOINTS.PRODUCT_UNITS);
            },
        }
    );
};
