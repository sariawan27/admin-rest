import { CreateTagInput } from "@ts-types/generated";
import { ROUTES } from "@utils/routes";
import Tag from "@repositories/tag";
import { useRouter } from "next/router";
import { useMutation, useQueryClient } from "react-query";
import { API_ENDPOINTS } from "@utils/api/endpoints";
import { toast } from "react-toastify";
import { useTranslation } from "next-i18next";

export interface ITagCreateVariables {
  variables: { input: CreateTagInput };
}

export const useCreateTagMutation = () => {
  const { t } = useTranslation();

  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation(
    (formData: any) =>
      Tag.create(API_ENDPOINTS.TAGS, formData),
    {
      onSuccess: () => {
        toast.success(t("common:successfully-created"));
      },
      // Always refetch after error or success:
      onSettled: () => {
        queryClient.invalidateQueries(API_ENDPOINTS.TAGS);
      },
    }
  );
};
