import Select from "@components/ui/select/select";

import React from "react";
import { useTranslation } from "next-i18next";
import Label from "@components/ui/label";
import cn from "classnames";
import { useTypesQuery } from "@data/type/use-types.query";
import { useCategoriesQuery } from "@data/category/use-categories.query";
import { useUsersQuery } from "@data/user/use-users.query";
import Button from "@components/ui/button";
import { CloseIcon } from "@components/icons/close-icon";
import { getAuthCredentials } from "@utils/auth-utils";

type Props = {
  onCategoryFilter: Function;
  onUserFilter: Function;
  handleRemoveUserFilter: Function;
  handleRemoveCategoryFilter: Function;
  productCategory: string;
  userValue: string
  className?: string;
};

export default function CategoryTypeFilter({
  userValue,
  productCategory,
  handleRemoveUserFilter,
  handleRemoveCategoryFilter,
  onUserFilter,
  onCategoryFilter,
  className,
}: Props) {
  const { t } = useTranslation();

  const { userGroup } = getAuthCredentials()

  // const { data, isLoading: loading } = useTypesQuery();
  const { data: categoryData, isLoading: categoryLoading } = useCategoriesQuery(
    {
      limit: 999,
    }
  );
  const { data: usersData, isLoading: userLoading } = useUsersQuery(
    {
      limit: 999,
    }
  );
  console.log(userGroup)

  return (
    <div
      className={cn(
        "flex flex-col md:flex-row md:space-x-5 md:items-end space-y-5 md:space-y-0 w-full",
        className
      )}
    >
      {userGroup[0] === 'superuser' ? (
        <>
          <div className="w-full lg:w-5/12 md:w-5/12">
            <Label>{t("common:filter-by-group")}</Label>
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
          <div className="w-full lg:w-1/12 md:w-1/12">
            <Button onClick={handleRemoveUserFilter} className="mt-5 ml-1"><CloseIcon className="w-3 h-3" /></Button>
          </div></>) : null}
      <div className="w-full lg:w-5/12 md:w-5/12">
        <Label>{t("common:filter-by-category")}</Label>
        <Select
          options={categoryData?.categories?.data.filter(c => c.isDeleted === 0)}
          getOptionLabel={({ productCategoryName }) => productCategoryName}
          getOptionValue={({ productCategoryId }) => productCategoryId}
          placeholder={t("common:filter-by-category-placeholder")}
          isLoading={categoryLoading}
          value={categoryData?.categories?.data.filter(({ productCategoryId }) => productCategoryId === productCategory)}
          onChange={onCategoryFilter}
        />
      </div>
      <div className="w-full lg:w-1/12 md:w-1/12">
        <Button onClick={handleRemoveCategoryFilter} className="mt-5 ml-1"><CloseIcon className="w-3 h-3" /></Button>
      </div>
    </div>
  );
}
