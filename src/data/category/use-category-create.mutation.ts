import { CreateProductCategory } from "@ts-types/generated";
import { ROUTES } from "@utils/routes";
import Category from "@repositories/category";
import { useRouter } from "next/router";
import { useMutation, useQueryClient } from "react-query";
import { API_ENDPOINTS } from "@utils/api/endpoints";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

export interface ICategoryCreateVariables {
  variables: { input: CreateProductCategory };
}

export const useCreateCategoryMutation = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation(
    (formData: any) =>
      Category.create(API_ENDPOINTS.PRODUCT_CATEGORIES, formData),
    {
      onSuccess: () => {
        toast.success(t("common:successfully-created"));
      },
      // Always refetch after error or success:
      onSettled: () => {
        queryClient.invalidateQueries(API_ENDPOINTS.PRODUCT_CATEGORIES);
      },
    }
  );
};
