import Pagination from "@components/ui/pagination";
import { Table } from "@components/ui/table";
import ActionButtons from "@components/common/action-buttons";
import { getIcon } from "@utils/get-icon";
import * as categoriesIcon from "@components/icons/category";
import { ROUTES } from "@utils/routes";
import { CategoryPaginator, SortOrder } from "@ts-types/generated";
import Image from "next/image";
import { useTranslation } from "next-i18next";
import { useIsRTL } from "@utils/locals";
import { useState } from "react";
import TitleWithSort from "@components/ui/title-with-sort";
import getStorageUrl from "@utils/getStorageUrl";
import Badge from "@components/ui/badge/badge";

export type IProps = {
  categories: CategoryPaginator | undefined | null;
  onPagination: (key: number) => void;
  onSort: (current: any) => void;
  onOrder: (current: string) => void;
};
const CategoryList = ({
  categories,
  onPagination,
  onSort,
  onOrder,
}: IProps) => {
  const { t } = useTranslation();
  const { data, paginatorInfo } = categories!;
  const rowExpandable = (record: any) => record.children?.length;

  const { alignLeft } = useIsRTL();

  const [sortingObj, setSortingObj] = useState<{
    sort: SortOrder;
    column: string | null;
  }>({
    sort: SortOrder.Desc,
    column: null,
  });

  const onHeaderClick = (column: string | null) => ({
    onClick: () => {
      onSort((currentSortDirection: SortOrder) =>
        currentSortDirection === SortOrder.Desc ? SortOrder.Asc : SortOrder.Desc
      );
      onOrder(column!);

      setSortingObj({
        sort:
          sortingObj.sort === SortOrder.Desc ? SortOrder.Asc : SortOrder.Desc,
        column: column,
      });
    },
  });

  const columns = [
    {
      title: t("table:table-item-icon"),
      dataIndex: "productCategoryIcon",
      key: "image",
      align: alignLeft,
      width: 74,
      render: (images: any) => (
        <Image
          src={getStorageUrl + images}
          loader={() => getStorageUrl + images}
          alt={name}
          layout="fixed"
          width={20}
          height={20}
          className="overflow-hidden"
        />
      ),
    },
    {
      title: (
        <TitleWithSort
          title={t("table:table-item-title")}
          ascending={
            sortingObj.sort === SortOrder.Asc && sortingObj.column === "productCategoryName"
          }
          isActive={sortingObj.column === "productCategoryName"}
        />
      ),
      className: "cursor-pointer",
      dataIndex: "productCategoryName",
      key: "name",
      align: alignLeft,
      width: 150,
      onHeaderCell: () => onHeaderClick("productCategoryName"),
    },
    {
      title: t("table:table-item-descriptions"),
      dataIndex: "productCategoryDesc",
      key: "details",
      align: alignLeft,
      width: 200,
    },
    {
      title: t("table:table-item-status"),
      dataIndex: "isDeleted",
      key: "isDeleted",
      align: "center",
      width: 100,
      onHeaderCell: () => onHeaderClick("isDeleted"),
      render: (isDeleted: string) => (
        <Badge
          text={
            isDeleted === 0 ? "available" : "deleted"}
          color={
            isDeleted !== 0
              ? "bg-red-400"
              : "bg-accent"
          }
        />
      ),
    },
    {
      title: t("table:table-item-actions"),
      dataIndex: "productCategoryId",
      key: "actions",
      align: "center",
      width: 90,
      render: (productCategoryId: string) => (
        <ActionButtons
          id={productCategoryId}
          editUrl={`${ROUTES.CATEGORIES}/edit/${productCategoryId}`}
          deleteModalView="DELETE_CATEGORY"
        />
      ),
    },
  ];

  return (
    <>
      <div className="rounded overflow-hidden shadow mb-6">
        <Table
          //@ts-ignore
          columns={columns}
          emptyText={t("table:empty-table-data")}
          data={data}
          rowKey="id"
          scroll={{ x: 1000 }}
          expandable={{
            expandedRowRender: () => "",
            rowExpandable: rowExpandable,
          }}
        />
      </div>

      {!!paginatorInfo.total && (
        <div className="flex justify-end items-center">
          <Pagination
            total={paginatorInfo.total}
            current={paginatorInfo.currentPage}
            pageSize={paginatorInfo.perPage}
            onChange={onPagination}
          />
        </div>
      )}
    </>
  );
};

export default CategoryList;
