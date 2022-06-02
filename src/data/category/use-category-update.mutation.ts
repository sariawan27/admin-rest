import { ProductCategory } from "@ts-types/generated";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import Category from "@repositories/category";
import { API_ENDPOINTS } from "@utils/api/endpoints";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { ROUTES } from "@utils/routes";

export interface ICategoryUpdateVariables {
  variables: {
    productCategoryId: string;
    formData: any;
  };
}

export const useUpdateCategoryMutation = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation(
    ({ variables: { productCategoryId, formData } }: ICategoryUpdateVariables) =>
      Category.update(`${API_ENDPOINTS.PRODUCT_CATEGORIES}/${productCategoryId}`, formData),
    {
      onSuccess: () => {
        toast.success(t("common:successfully-updated"));
        router.push(ROUTES.CATEGORIES);
      },
      // Always refetch after error or success:
      onSettled: () => {
        queryClient.invalidateQueries(API_ENDPOINTS.PRODUCT_CATEGORIES);
      },
    }
  );
};
