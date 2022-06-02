import SelectInput from "@components/ui/select-input";
import Label from "@components/ui/label";
import { Control, useFormState, useWatch } from "react-hook-form";
import { useEffect } from "react";
import { useUserGroupsQuery } from "@data/user-group/use-user-groups.query";
import { useTranslation } from "next-i18next";
import ValidationError from "@components/ui/form-validation-error";
import { User } from "@ts-types/generated";

interface Props {
    control: Control<any>;
    error: string | undefined;
    initialValues: User | undefined;
}

const UserGroupInput = ({ control, error, initialValues }: Props) => {
    const { t } = useTranslation("common");
    const { data, isLoading: loading } = useUserGroupsQuery({
        limit: 7,
    });
    return (
        <div className="mb-5">
            <Label>{t("form:input-label-user-group")}</Label>
            <SelectInput
                name="userUserGroup"
                control={control}
                getOptionLabel={(option: any) => option.userGroupName}
                getOptionValue={(option: any) => option.userGroupId}
                options={data?.userGroups!}
                getValue={initialValues?.user_group}
                isLoading={loading}
            />
            <ValidationError message={t(error!)} />
        </div>
    );
};

export default UserGroupInput;
