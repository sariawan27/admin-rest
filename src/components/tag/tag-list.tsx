import Pagination from "@components/ui/pagination";
import { Table } from "@components/ui/table";
import ActionButtons from "@components/common/action-buttons";
import { getIcon } from "@utils/get-icon";
import * as categoriesIcon from "@components/icons/category";
import { ROUTES } from "@utils/routes";
import Image from "next/image";
import { useTranslation } from "next-i18next";
import { useIsRTL } from "@utils/locals";
import { SortOrder } from "@ts-types/generated";
import { useState } from "react";
import TitleWithSort from "@components/ui/title-with-sort";
import Badge from "@components/ui/badge/badge";

export type IProps = {
  tags: any | undefined | null;
  onPagination: (key: number) => void;
  onSort: (current: any) => void;
  onOrder: (current: string) => void;
};

const TagList = ({ tags, onPagination, onSort, onOrder }: IProps) => {
  const { t } = useTranslation();
  const { data, paginatorInfo } = tags! ?? {};
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
      title: (
        <TitleWithSort
          title={t("table:table-item-title")}
          ascending={
            sortingObj.sort === SortOrder.Asc && sortingObj.column === "tagName"
          }
          isActive={sortingObj.column === "tagName"}
        />
      ),
      className: "cursor-pointer",
      dataIndex: "tagName",
      key: "tagName",
      align: alignLeft,
      onHeaderCell: () => onHeaderClick("tagName"),
    },
    {
      title: t("table:table-item-descriptions"),
      dataIndex: "tagDesc",
      key: "details",
      align: alignLeft,
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
      dataIndex: "tagId",
      key: "actions",
      align: "center",
      width: 90,
      render: (tagId: string) => (
        <ActionButtons
          id={tagId}
          editUrl={`${ROUTES.TAGS}/${tagId}/edit`}
          deleteModalView="DELETE_TAG"
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
          //@ts-ignore
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

export default TagList;
