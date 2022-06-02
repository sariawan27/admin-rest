import Pagination from "@components/ui/pagination";
import Image from "next/image";
import { Table } from "@components/ui/table";
import ActionButtons from "@components/common/action-buttons";
import { siteSettings } from "@settings/site.settings";
import { UserPaginator, SortOrder, UserGroupPaginator } from "@ts-types/generated";
import { useMeQuery } from "@data/user/use-me.query";
import { useTranslation } from "next-i18next";
import { useIsRTL } from "@utils/locals";
import { useState } from "react";
import TitleWithSort from "@components/ui/title-with-sort";
import { useRouter } from "next/router";

type IProps = {
    userGroups: UserGroupPaginator | null | undefined;
    onPagination: (current: number) => void;
    onSort: (current: any) => void;
    onOrder: (current: string) => void;
};
const UserGroupList = ({ userGroups, onPagination, onSort, onOrder }: IProps) => {
    const { data, paginatorInfo } = userGroups!;
    const { t } = useTranslation();
    const router = useRouter();
    const { alignLeft } = useIsRTL();

    const [sortingObj, setSortingObj] = useState<{
        sort: SortOrder;
        column: any | null;
    }>({
        sort: SortOrder.Desc,
        column: null,
    });

    const onHeaderClick = (column: any | null) => ({
        onClick: () => {
            onSort((currentSortDirection: SortOrder) =>
                currentSortDirection === SortOrder.Desc ? SortOrder.Asc : SortOrder.Desc
            );

            onOrder(column);

            setSortingObj({
                sort:
                    sortingObj.sort === SortOrder.Desc ? SortOrder.Asc : SortOrder.Desc,
                column: column,
            });
        },
    });

    const columns = [
        {
            title: t("table:table-item-title"),
            dataIndex: "userGroupName",
            key: "name",
            align: alignLeft,
        },
        {
            title: t("table:table-item-description"),
            dataIndex: "userGroupDesc",
            key: "userGroupDesc",
            align: alignLeft,
        },
        {
            title: t("table:table-item-actions"),
            dataIndex: "userGroupId",
            key: "actions",
            align: "center",
            render: (userGroupId: string) => {
                // const { data } = useMeQuery();
                return (
                    <>
                        <ActionButtons
                            id={userGroupId}
                            detailsUrl={`${router.asPath}/${userGroupId}`}
                        />
                    </>
                );
            },
        },
    ];

    return (
        <>
            <div className="rounded overflow-hidden shadow mb-6">
                <Table
                    // @ts-ignore
                    columns={columns}
                    emptyText={t("table:empty-table-data")}
                    data={data}
                    rowKey="id"
                    scroll={{ x: 800 }}
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

export default UserGroupList;
