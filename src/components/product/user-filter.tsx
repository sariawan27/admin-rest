import Select from "@components/ui/select/select";

import React from "react";
import { useTranslation } from "next-i18next";
import Label from "@components/ui/label";
import cn from "classnames";
import { useTypesQuery } from "@data/type/use-types.query";
import { useCategoriesQuery } from "@data/category/use-categories.query";
import { useUsersQuery } from "@data/user/use-users.query";

type Props = {
    onCategoryFilter: Function;
    onTypeFilter: Function;
    userValue: string;
    className?: string;
};

export default function UserFilter({
    userValue,
    onTypeFilter,
    onUserFilter,
    className,
}: Props) {
    const { t } = useTranslation();

    // const { data, isLoading: loading } = useTypesQuery();
    const { data: usersData, isLoading: userLoading } = useUsersQuery(
        {
            limit: 999,
        }
    );

    return (
        <div
            className={cn(
                "flex flex-col md:flex-row md:space-x-5 md:items-end space-y-5 md:space-y-0 w-full",
                className
            )}
        >
            <div className="w-full">
                <Label>{t("common:filter-by-group")}</Label>
                {/* <Select
          options={data?.types}
          isLoading={loading}
          getOptionLabel={(option: any) => option.name}
          getOptionValue={(option: any) => option.slug}
          placeholder={t("common:filter-by-group-placeholder")}
          onChange={onTypeFilter}
        /> */}
            </div>
            <div className="w-full">
                <Label>{t("common:filter-by-category")}</Label>
                <Select
                    options={usersData?.users?.data}
                    getOptionLabel={({ userName }) => userName}
                    getOptionValue={({ userId }) => userId}
                    placeholder={t("common:filter-by-category-placeholder")}
                    isLoading={userLoading}
                    value={usersData?.users?.data.filter(({ userId }) => userId === userValue)}
                    onChange={onUserFilter}
                />
            </div>
        </div>
    );
}
