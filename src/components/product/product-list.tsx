import Pagination from "@components/ui/pagination";
import Image from "next/image";
import { Table } from "@components/ui/table";
import ActionButtons from "@components/common/action-buttons";
import { siteSettings } from "@settings/site.settings";
import usePrice from "@utils/use-price";
import Badge from "@components/ui/badge/badge";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import {
  Product,
  ProductCategory,
  ProductPaginator,
  ProductType,
  Shop,
  SortOrder,
  User,
} from "@ts-types/generated";
import { useIsRTL } from "@utils/locals";
import { useState } from "react";
import TitleWithSort from "@components/ui/title-with-sort";
import getStorageUrl from "@utils/getStorageUrl";
import { getAuthCredentials } from "@utils/auth-utils";

export type IProps = {
  products?: ProductPaginator;
  onPagination: (current: number) => void;
  onSort: (current: any) => void;
  onOrder: (current: string) => void;
};

type SortingObjType = {
  sort: SortOrder;
  column: string | null;
};

const ProductList = ({ products, onPagination, onSort, onOrder }: IProps) => {
  const { data, paginatorInfo } = products! ?? {};
  const router = useRouter();
  const { t } = useTranslation();
  const { alignLeft, alignRight } = useIsRTL();

  const idFormatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR'
  })

  const [sortingObj, setSortingObj] = useState<SortingObjType>({
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

  let columns = [
    {
      title: t("table:table-item-image"),
      dataIndex: "images",
      key: "image",
      align: alignLeft,
      width: 74,
      render: (images: any) => (
        <Image
          src={images?.thumbnail ?? siteSettings.product.placeholder}
          loader={() => getStorageUrl + images.filter((img: any) => { return img.productImageType == 0 })[0]?.productImagePath}
          alt={name}
          layout="fixed"
          width={42}
          height={42}
          className="rounded overflow-hidden"
        />
      ),
    },
    {
      title: t("table:table-item-sku"),
      dataIndex: "productSku",
      key: "type",
      width: 120,
      align: "center",
      ellipsis: true,
      render: (productSku: any) => (
        <span className="whitespace-nowrap truncate">{productSku}</span>
      ),
    },
    {
      title: (
        <TitleWithSort
          title={t("table:table-item-title")}
          ascending={
            sortingObj.sort === SortOrder.Asc && sortingObj.column === "productName"
          }
          isActive={sortingObj.column === "productName"}
        />
      ),
      className: "cursor-pointer",
      dataIndex: "productName",
      key: "name",
      align: alignLeft,
      width: 200,
      ellipsis: true,
      onHeaderCell: () => onHeaderClick("productName"),
    },
    {
      title: t("table:table-item-category"),
      dataIndex: "product_categories",
      key: "shop",
      align: alignLeft,
      width: 250,
      ellipsis: true,
      render: (productCategory: ProductCategory) => (
        productCategory.filter(pc => pc.isDeleted === 0).map((pc, idx, arr) => (
          < span className="whitespace-nowrap truncate" > {pc?.productCategoryName}{idx + 1 === arr.length ? "" : ","}</span >
        ))
      ),
    },
    {
      title: t("table:table-item-publisher"),
      dataIndex: "users",
      key: "shop",
      align: alignLeft,
      width: 120,
      ellipsis: true,
      render: (user: User) => (
        <span className="whitespace-nowrap truncate">{user?.userName}</span>
      ),
    },
    {
      title: (
        <TitleWithSort
          title={t("table:table-item-unit")}
          ascending={
            sortingObj.sort === SortOrder.Asc && sortingObj.column === "productPriceBasic"
          }
          isActive={sortingObj.column === "productPriceBasic"}
        />
      ),
      className: "cursor-pointer",
      dataIndex: "productPrice",
      key: "price",
      align: alignRight,
      width: 150,
      onHeaderCell: () => onHeaderClick("productPriceBasic"),
      render: (value: number, record: Product) => {
        return (
          <span className="whitespace-nowrap">
            {`${idFormatter.format(record?.productPriceBasic)}`}
          </span>
        );
      }
    },
    {
      title: (
        <TitleWithSort
          title={t("table:table-item-quantity")}
          ascending={
            sortingObj.sort === SortOrder.Asc &&
            sortingObj.column === "productStockLast"
          }
          isActive={sortingObj.column === "productStockLast"}
        />
      ),
      className: "cursor-pointer",
      dataIndex: "productStock",
      key: "quantity",
      align: "center",
      width: 100,
      onHeaderCell: () => onHeaderClick("productStockLast"),
    },
    {
      title: (
        <TitleWithSort
          title={t("table:table-item-status")}
          ascending={
            sortingObj.sort === SortOrder.Asc &&
            sortingObj.column === "productStatus"
          }
          isActive={sortingObj.column === "productStatus"}
        />
      ),
      dataIndex: "productStatus",
      key: "productStatus",
      align: "center",
      width: 100,
      onHeaderCell: () => onHeaderClick("productStatus"),
      render: (productStatus: string) => (
        <Badge
          text={
            productStatus === 0 ? "draft" : "publish"}
          color={
            productStatus === 0
              ? "bg-yellow-400"
              : "bg-accent"
          }
        />
      ),
    },
    {
      title: t("table:table-item-actions"),
      dataIndex: "productId",
      key: "actions",
      align: "center",
      width: 80,
      render: (productId: string) => (
        <ActionButtons
          id={productId}
          detailsUrl={`${router.asPath}/${productId}`}
        // deleteModalView="DELETE_PRODUCT"
        />
      ),
    },
  ];

  if (router?.query?.user) {
    columns = columns?.filter((column) => column?.key !== "user");
  }

  return (
    <>
      <div className="rounded overflow-hidden shadow mb-6">
        <Table
          /* @ts-ignore */
          columns={columns}
          emptyText={t("table:empty-table-data")}
          data={data}
          rowKey="id"
          scroll={{ x: 900 }}
        />
      </div>

      {!!paginatorInfo.total && (
        <div className="flex justify-end items-center">
          <Pagination
            total={paginatorInfo.total}
            current={paginatorInfo.currentPage}
            pageSize={paginatorInfo.perPage}
            onChange={onPagination}
            showLessItems
          />
        </div>
      )}
    </>
  );
};

export default ProductList;
