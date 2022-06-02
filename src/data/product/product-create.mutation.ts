import { CreateProduct } from "@ts-types/generated";
import { ROUTES } from "@utils/routes";
import Product from "@repositories/product";
import { useRouter } from "next/router";
import { useMutation, useQueryClient } from "react-query";
import { API_ENDPOINTS } from "@utils/api/endpoints";

export const useCreateProductMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation(
    (formData: any) => Product.createWithFormData(API_ENDPOINTS.PRODUCTS, formData),
    {
      onSuccess: () => {
        router.push(`/${ROUTES.PRODUCTS}`);
      },
      // Always refetch after error or success:
      onSettled: () => {
        queryClient.invalidateQueries(API_ENDPOINTS.PRODUCTS);
      },
    }
  );
};
