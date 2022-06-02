import { UpdateProduct } from "@ts-types/generated";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import Product from "@repositories/product";
import { API_ENDPOINTS } from "@utils/api/endpoints";
import { useTranslation } from "next-i18next";

export interface IProductUpdateVariables {
  variables: { productId: string; formData: any };
}

export const useUpdateProductMutation = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutation(
    ({ variables: { productId, formData } }: IProductUpdateVariables) =>
      Product.updateWithFormData(`${API_ENDPOINTS.PRODUCTS}/${productId}`, formData),
    {
      onSuccess: () => {
        toast.success(t("common:successfully-updated"));
      },
      // Always refetch after error or success:
      onSettled: () => {
        queryClient.invalidateQueries(API_ENDPOINTS.PRODUCTS);
      },
    }
  );
};
