import { UpdateProduct } from "@ts-types/generated";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import Product from "@repositories/product";
import { API_ENDPOINTS } from "@utils/api/endpoints";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { ROUTES } from "@utils/routes";

export interface IPublishProductVariables {
    variables: { id: string; input: UpdateProduct };
}

export const usePublishProductMutation = () => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const router = useRouter();

    return useMutation(
        ({ variables: { id, input } }: IPublishProductVariables) =>
            Product.publishProduct(`${API_ENDPOINTS.PRODUCTS}/${id}/publish`, input),
        {
            onSuccess: () => {
                router.push(`/${ROUTES.PRODUCTS}`);
                toast.success(t("common:successfully-updated"));
            },
            // Always refetch after error or success:
            onSettled: () => {
                queryClient.invalidateQueries(API_ENDPOINTS.PRODUCTS);
            },
        }
    );
};
