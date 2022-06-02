import { useMutation, useQueryClient } from "react-query";
import Category from "@repositories/category";
import { API_ENDPOINTS } from "@utils/api/endpoints";

export const useDeleteCategoryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(
    (productCategoryId: string) => Category.delete(`${API_ENDPOINTS.PRODUCT_CATEGORIES}/${productCategoryId}`),
    {
      // Always refetch after error or success:
      onSettled: () => {
        queryClient.invalidateQueries(API_ENDPOINTS.PRODUCT_CATEGORIES);
      },
    }
  );
};
