import { CheckMarkFill } from "@components/icons/checkmark-circle-fill";
import { CloseFillIcon } from "@components/icons/close-fill";
import { useTranslation } from "next-i18next";
import { ROUTES } from "@utils/routes";
import Loader from "@components/ui/loader/loader";
import { useUserQuery } from "@data/user/use-user.query";
import router, { useRouter } from "next/router";
import LinkButton from "@components/ui/link-button";
import { EditIcon } from "@components/icons/edit copy";
import { UploadIcon } from "@components/icons/upload-icon copy";
import Card from "@components/common/card";
import { useProductQuery } from "@data/product/product.query";
import { Table } from "@components/ui/table";
import { useIsRTL } from "@utils/locals";
import { useModalAction } from "@components/ui/modal/modal.context";
import Button from "@components/ui/button";
import getStorageUrl from "@utils/getStorageUrl";
import Image from "next/image";

const ProductDetails: React.FC = () => {
    const { t } = useTranslation("common");;
    const { query } = useRouter();
    const { alignRight } = useIsRTL();
    const {
        data,
        isLoading: loading,
        error,
    } = useProductQuery(query.productId as string);
    if (loading) return <Loader text={t("text-loading")} />;

    const idFormatter = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR'
    })

    const columnVariantPrices = [
        {
            title: t("table:table-item-min-qty"),
            dataIndex: "prodbasVariantPriceMinQty",
            key: "name",
            align: alignRight,
        },
        {
            title: t("table:table-item-price"),
            dataIndex: "prodbasVariantPricePrice",
            key: "name",
            align: alignRight,
            render: (value: number) => {
                return (
                    <span className="whitespace-nowrap">
                        {`${idFormatter.format(value)}`}
                    </span>
                );
            }
        },
    ];

    const columnVariantPricesAfterMarkup = [
        {
            title: t("table:table-item-min-qty"),
            dataIndex: "productVariantPriceMinQty",
            key: "name",
            align: alignRight,
        },
        {
            title: t("table:table-item-price"),
            dataIndex: "productVariantPricePrice",
            key: "name",
            align: alignRight,
            render: (value: number) => {
                return (
                    <span className="whitespace-nowrap">
                        {`${idFormatter.format(value)}`}
                    </span>
                );
            }
        },
    ];

    const columnDiscounts = [
        {
            title: t("table:table-item-min-qty"),
            dataIndex: "prodbasDiscountMinPurchase",
            key: "name",
            align: alignRight,
        },
        {
            title: t("table:table-item-discount-percent"),
            dataIndex: "prodbasDiscountPercent",
            key: "name",
            align: alignRight,
            render: (value: number) => {
                return (
                    <span className="whitespace-nowrap">
                        {`${value} %`}
                    </span>
                );
            }
        },
        {
            title: t("table:table-item-discount-amount"),
            dataIndex: "prodbasDiscountAmount",
            key: "name",
            align: alignRight,
            render: (value: number) => {
                return (
                    <span className="whitespace-nowrap">
                        {`${idFormatter.format(value)}`}
                    </span>
                );
            }
        },
    ];

    const columnDiscountsAfterMarkup = [
        {
            title: t("table:table-item-min-qty"),
            dataIndex: "productDiscountMinPurchase",
            key: "name",
            align: alignRight,
        },
        {
            title: t("table:table-item-discount-percent"),
            dataIndex: "productDiscountPercent",
            key: "name",
            align: alignRight,
            render: (value: number) => {
                return (
                    <span className="whitespace-nowrap">
                        {`${value} %`}
                    </span>
                );
            }
        },
        {
            title: t("table:table-item-discount-amount"),
            dataIndex: "productDiscountAmount",
            key: "name",
            align: alignRight,
            render: (value: number) => {
                return (
                    <span className="whitespace-nowrap">
                        {`${idFormatter.format(value)}`}
                    </span>
                );
            }
        },
    ];

    const { openModal } = useModalAction();
    function handlePublishProduct(product: any) {
        openModal("PUBLISH_PRODUCT", product);
    }

    function handleUpdateProductConfirm(product: any) {
        openModal("UPDATE_PRODUCT_CONFIRM", product?.productId);
    }

    return (
        <div>
            <Card className="mb-5">
                <h3 className="text-2xl font-semibold text-heading text-center lg:text-start w-full lg:w-1/3 mb-8 lg:mb-0 whitespace-nowrap">
                    {t("common:text-product-details")}
                </h3>
            </Card>
            <div className="grid grid-cols-12 gap-6">
                <div className="order-1 xl:order-1 col-span-12 sm:col-span-6 xl:col-span-4 3xl:col-span-3 relative">
                    <div className="py-8 px-6 bg-white rounded flex flex-col items-center">
                        <div className="items-right ml-2 mb-3">
                            {
                                data?.productStatus === 1 ? (
                                    <CheckMarkFill className="absolute top-4 end-4 w-5 text-accent" />) : (
                                    <Button
                                        size="small"
                                        className="absolute top-3 end-3 shadow-sm"
                                        disabled={data?.productStatus === 1 ? true : false}
                                        onClick={() => handlePublishProduct(data)}
                                    >
                                        <UploadIcon className="w-4 me-2" />Publish
                                    </Button>)
                            }
                        </div>
                        <div className="h-full p-5 flex flex-col items-center">
                            <div className="w-32 h-32 relative rounded-full flex items-center justify-center overflow-hidden border border-gray-200">
                                <img
                                    src={getStorageUrl + data?.images.filter((img: any) => { return img.productImageType == 0 })[0]?.productImagePath}
                                    className="rounded-full"
                                />
                            </div>
                            <h3 className="text-lg font-semibold text-heading mt-5 text-center">{data?.productName!}</h3>
                            <p className="text-md">Ready Stock: {data?.stock ? data?.stock.productStockLast : null}</p>
                            {/* <div className="border border-gray-200 rounded flex items-center justify-center text-sm text-body-dark py-2 px-3 mt-6">
                                {data?.user.isActived! ? (
                                    <CheckMarkFill width={16} className="me-2 text-accent" />
                                ) : (
                                    <CloseFillIcon width={16} className="me-2 text-red-500" />
                                )}
                                {data?.user?.isActived! ? "Enabled" : "Disabled"}
                            </div> */}
                        </div>
                    </div>
                    <div className="py-8 px-6 bg-white rounded flex items-center flex-col mt-3">
                        <span className="text-sub-heading text-lg font-semibold mb-4 items-right">
                            {t("common:text-product-gallery")}
                        </span>
                        <div className="flex justify-center mb-2">
                            {data?.images.filter((img: any) => { return img.productImageType == 1 }).map((pimage) => (
                                <div class="w-full rounded m-1">
                                    <Image
                                        src={getStorageUrl + pimage.productImagePath}
                                        loader={() => getStorageUrl + pimage.productImagePath}
                                        alt={name}
                                        width={58}
                                        height={58}
                                        className="rounded overflow-hidden"
                                    />
                                </div>
                            )
                            )}
                        </div>
                    </div>
                </div>
                <div className="order-2 xl:order-2 col-span-12 xl:col-span-8 3xl:col-span-9 rounded overflow-hidden relative bg-light">
                    <div className="flex flex-col p-6 2xl:p-7">
                        <span className="text-sub-heading text-lg font-semibold mb-4">
                            {t("common:text-product-info")}
                        </span>
                        <Button
                            size="small"
                            className="absolute top-3 end-3 shadow-sm"
                            onClick={() => data?.productStatus === 1 ? handleUpdateProductConfirm(data) : router.push(`${ROUTES.PRODUCTS}/${data?.productId}/edit`)}
                        >
                            <EditIcon className="w-4 me-2" /> {t("common:text-edit-product")}
                        </Button>

                        <div className="flex flex-col space-y-3">
                            <p className="text-sm text-sub-heading">
                                <span className="text-muted block w-full">
                                    {t("common:text-category")}:
                                </span>{" "}
                                {data?.product_categories.filter(pc => pc.isDeleted === 0).map((pc, idx, arr) =>
                                    <span className="font-semibold">{
                                        pc.productCategoryName
                                    }{idx + 1 === arr.length ? "" : ", "}
                                    </span>
                                )}
                            </p>
                            <p className="text-sm text-sub-heading">
                                <span className="text-muted block w-full">
                                    {t("common:text-tag")}:
                                </span>{" "}
                                {data?.product_tags.filter(t => t.isDeleted === 0).map((t, idx, arr) =>
                                    <span className="font-semibold">{
                                        t.tagName
                                    }{idx + 1 === arr.length ? "" : ", "}
                                    </span>
                                )}
                            </p>
                            <p className="text-sm text-sub-heading">
                                <span className="text-muted block w-full">
                                    {t("common:text-sku")}:
                                </span>{" "}
                                <span className="font-semibold">
                                    {data?.productSku!}
                                </span>
                            </p>
                            <p className="text-sm text-sub-heading">
                                <span className="text-muted block w-full">
                                    {t("common:text-name")}:
                                </span>{" "}
                                <span className="font-semibold">
                                    {data?.productName!}
                                </span>
                            </p>
                            <p className="text-sm text-sub-heading">
                                <span className="text-muted block w-full">
                                    {t("common:text-description")}:
                                </span>{" "}
                                <span className="font-semibold">
                                    {data?.productDesc!}
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
                <div className="order-3 xl:order-3 col-span-12 sm:col-span-6 xl:col-span-4 3xl:col-span-3"></div>
                <div className="order-4 xl:order-4 col-span-12 xl:col-span-8 3xl:col-span-9 rounded overflow-hidden relative bg-light">
                    <div className="flex flex-col p-6 2xl:p-7">
                        <span className="text-sub-heading text-lg font-semibold mb-4">
                            {t("common:text-stock-info")}
                        </span>

                        <div className="flex flex-col space-y-3">
                            <p className="text-sm text-sub-heading">
                                <span className="text-muted block w-full">
                                    {t("common:text-stock-first")}:
                                </span>{" "}
                                <div className="font-semibold text-right">
                                    {data?.stock ? data?.stock.productStockFirst : null!}
                                </div>
                            </p>
                            <p className="text-sm text-sub-heading">
                                <span className="text-muted block w-full">
                                    {t("common:text-stock-out")}:
                                </span>{" "}
                                <div className="font-semibold text-right">
                                    {data?.stock ? data?.stock.productStockOut : null}
                                </div>
                            </p>
                            <p className="text-sm text-sub-heading">
                                <span className="text-muted block w-full">
                                    {t("common:text-stock-last")}:
                                </span>{" "}
                                <div className="font-semibold text-right">
                                    {data?.stock ? data?.stock.productStockLast : null}
                                </div>
                            </p>
                        </div>
                    </div>
                </div>
                <div className="order-5 xl:order-5 col-span-12 sm:col-span-6 xl:col-span-4 3xl:col-span-3"></div>
                <div className="order-6 xl:order-6 col-span-12 xl:col-span-8 3xl:col-span-9 rounded overflow-hidden relative bg-light">
                    <div className="flex flex-col p-6 2xl:p-7">
                        <span className="text-sub-heading text-lg font-semibold mb-4">
                            {t("common:text-price-info")}
                        </span>

                        <div className="flex flex-col space-y-3">
                            <p className="text-sm text-sub-heading">
                                <span className="text-muted block w-full">
                                    {t("common:text-price")}:
                                </span>{" "}
                                <div className="font-semibold text-right">
                                    {idFormatter.format(data?.productPriceBasic!)}
                                </div>
                            </p>
                            <p className="text-sm text-sub-heading">
                                <span className="text-muted block w-full">
                                    {t("common:text-price-sale")}:
                                </span>{" "}
                                <div className="font-semibold text-right">
                                    {data?.productPriceSale ? idFormatter.format(data?.productPriceSale!) : "-"}
                                </div>
                            </p>
                            {data?.basic_prices.length ? (
                                <>
                                    <p className="text-sm text-sub-heading">
                                        <span className="text-muted block w-full mb-2">
                                            {t("common:text-variant-price-before-markup")}:
                                        </span>{" "}
                                        <Table
                                            // @ts-ignore
                                            columns={columnVariantPrices}
                                            emptyText={t("table:empty-table-data")}
                                            data={data?.basic_prices.filter(price => price?.prodbasVariantPriceMinQty > 1 && price?.isDeleted !== 1)}
                                            rowKey="id"
                                            scroll={{ x: 300 }}
                                        />
                                        {/* <div className="font-semibold text-right">
                                    {idFormatter.format(data?.discount?.productDiscountAmount!)}
                                </div> */}
                                    </p>
                                </>
                            ) : (<>
                                <p className="text-sm text-sub-heading">
                                    <span className="text-muted block w-full">
                                        {t("common:text-variant-price-before-markup")}:
                                    </span>{" "}
                                    <div className="font-semibold text-right">
                                        -
                                    </div>
                                </p>
                            </>
                            )
                            }

                            {data?.prices.length ? (
                                <>
                                    <p className="text-sm text-sub-heading">
                                        <span className="text-muted block w-full mb-2">
                                            {t("common:text-variant-price-after-markup")}:
                                        </span>{" "}
                                        <Table
                                            // @ts-ignore
                                            columns={columnVariantPricesAfterMarkup}
                                            emptyText={t("table:empty-table-data")}
                                            data={data?.prices.filter(price => price?.productVariantPriceMinQty > 1)}
                                            rowKey="id"
                                            scroll={{ x: 300 }}
                                        />
                                        {/* <div className="font-semibold text-right">
                                    {idFormatter.format(data?.discount?.productDiscountAmount!)}
                                </div> */}
                                    </p>
                                </>
                            ) : (<>
                                <p className="text-sm text-sub-heading">
                                    <span className="text-muted block w-full">
                                        {t("common:text-variant-price-after-markup")}:
                                    </span>{" "}
                                    <div className="font-semibold text-right">
                                        -
                                    </div>
                                </p>
                            </>
                            )
                            }
                        </div>
                    </div>
                </div>
                {data?.basic_discount.length ? (
                    <>
                        <div className="order-7 xl:order-7 col-span-12 sm:col-span-6 xl:col-span-4 3xl:col-span-3"></div>
                        <div className="order-8 xl:order-8 col-span-12 xl:col-span-8 3xl:col-span-9 rounded overflow-hidden relative bg-light">
                            <div className="flex flex-col p-6 2xl:p-7">
                                <span className="text-sub-heading text-lg font-semibold mb-4">
                                    {t("common:text-discount-info")}
                                </span>

                                <div className="flex flex-col space-y-3">
                                    {data?.basic_discount.length ? (
                                        <>
                                            <p className="text-sm text-sub-heading">
                                                <span className="text-muted block w-full mb-2">
                                                    {t("common:text-discount-before-markup")}:
                                                </span>{" "}
                                                <Table
                                                    // @ts-ignore
                                                    columns={columnDiscounts}
                                                    emptyText={t("table:empty-table-data")}
                                                    data={data?.basic_discount.filter((basdisc) => basdisc?.isDeleted !== 1)}
                                                    rowKey="id"
                                                    scroll={{ x: 300 }}
                                                />
                                            </p>
                                        </>
                                    ) : (
                                        <>
                                            <p className="text-sm text-sub-heading">
                                                <span className="text-muted block w-full">
                                                    {t("common:text-discount-before-markup")}:
                                                </span>{" "}
                                                <div className="font-semibold text-right">
                                                    -
                                                </div>
                                            </p>
                                        </>)}

                                    {data?.discount.length ? (
                                        <>
                                            <p className="text-sm text-sub-heading">
                                                <span className="text-muted block w-full mb-2">
                                                    {t("common:text-discount-after-markup")}:
                                                </span>{" "}
                                                <Table
                                                    // @ts-ignore
                                                    columns={columnDiscountsAfterMarkup}
                                                    emptyText={t("table:empty-table-data")}
                                                    data={data?.discount}
                                                    rowKey="id"
                                                    scroll={{ x: 300 }}
                                                />
                                            </p>
                                        </>
                                    ) : (
                                        <>
                                            <p className="text-sm text-sub-heading">
                                                <span className="text-muted block w-full">
                                                    {t("common:text-discount-after-markup")}:
                                                </span>{" "}
                                                <div className="font-semibold text-right">
                                                    -
                                                </div>
                                            </p>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </>
                ) : null}
            </div>
        </div >
    );
};
export default ProductDetails;
