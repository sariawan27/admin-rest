import { UpdateProduct } from "@ts-types/generated";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import Product from "@repositories/product";
import { API_ENDPOINTS } from "@utils/api/endpoints";
import { useTranslation } from "next-i18next";
import UserGroup from "@repositories/user-group";

export interface IUserGroupUpdateVariables {
    variables: { userGroupId: string; formData: any };
}

export const useUpdateUserGroupMutation = () => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    return useMutation(
        ({ variables: { userGroupId, formData } }: IUserGroupUpdateVariables) =>
            UserGroup.updateWithFormData(`${API_ENDPOINTS.USER_GROUPS}/${userGroupId}`, formData),
        {
            onSuccess: () => {
                toast.success(t("common:successfully-updated"));
            },
            // Always refetch after error or success:
            onSettled: () => {
                queryClient.invalidateQueries(API_ENDPOINTS.USER_GROUPS);
            },
        }
    );
};
