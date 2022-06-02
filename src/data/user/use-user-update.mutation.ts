import { RegisterInput, UpdateUser } from "@ts-types/generated";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import User from "@repositories/user";
import { API_ENDPOINTS } from "@utils/api/endpoints";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { ROUTES } from "@utils/routes";

export interface IUserUpdateVariables {
  variables: { userId: string; input: RegisterInput };
}

export const useUpdateUserMutation = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation(
    ({ variables: { userId, input } }: IUserUpdateVariables) =>
      User.update(`${API_ENDPOINTS.USERS}/${userId}`, input),
    {
      onSuccess: () => {
        toast.success(t("common:successfully-updated"));
        router.push(ROUTES.USERS);
      },
      // Always refetch after error or success:
      onSettled: () => {
        queryClient.invalidateQueries(API_ENDPOINTS.USERS);
      },
    }
  );
};
