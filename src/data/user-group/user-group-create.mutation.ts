import { CreateProduct } from "@ts-types/generated";
import { ROUTES } from "@utils/routes";
import Product from "@repositories/product";
import { useRouter } from "next/router";
import { useMutation, useQueryClient } from "react-query";
import { API_ENDPOINTS } from "@utils/api/endpoints";
import UserGroup from "@repositories/user-group";

export const useCreateUserGroupMutation = () => {
    const queryClient = useQueryClient();
    const router = useRouter();

    return useMutation(
        (formData: any) => UserGroup.createWithFormData(API_ENDPOINTS.USER_GROUPS, formData),
        {
            onSuccess: () => {
                router.push(`/${ROUTES.USER_GROUPS}`);
            },
            // Always refetch after error or success:
            onSettled: () => {
                queryClient.invalidateQueries(API_ENDPOINTS.USER_GROUPS);
            },
        }
    );
};
