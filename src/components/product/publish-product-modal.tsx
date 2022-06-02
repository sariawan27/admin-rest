import Card from "@components/common/card";
import { DownloadIcon } from "@components/icons/download-icon";
import Button from "@components/ui/button";
import Description from "@components/ui/description";
import Input from "@components/ui/input";
import { useModalAction, useModalState } from "@components/ui/modal/modal.context";
import NumberInput from "@components/ui/number-input";
import { usePublishProductMutation } from "@data/product/publish-product.mutation";
import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslation } from "next-i18next";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import NumberFormat from "react-number-format";

const PublishProductView = () => {
    const { data: product } = useModalState();
    const { t } = useTranslation();
    const idFormatter = new Intl.NumberFormat('id-ID')

    const [productPrice, setProductPrice] = useState(0);
    const [markupPercent, setMarkupPercent] = useState(0);
    const [markupPrice, setMarkupPrice] = useState(0);
    const [productPrices, setProductPrices] = useState([]);
    const [productDiscounts, setProductDiscounts] = useState([]);

    type FormValues = {}

    const { mutate: publishProduct, isLoading: publishing } =
        usePublishProductMutation();

    const methods = useForm<FormValues>();
    const {
        handleSubmit,
        setError,
        formState: { errors },
    } = methods;

    const { closeModal } = useModalAction();

    const onSubmit = async () => {
        const inputValues: any = {
            markupPercent: markupPercent,
            markupPrice: markupPrice,
            productPrice: productPrice,
            productPrices: productPrices.filter((item) => {
                return item.isDeleted != 1
            }),
            productDiscounts: productDiscounts.filter((item) => {
                return item.isDeleted != 1
            }),
        }

        publishProduct(
            {
                variables: {
                    id: product?.productId,
                    input: inputValues,
                },
            },
            {
                onSuccess: () => {
                    closeModal()
                },
                onError: (error: any) => {
                    Object.keys(error?.response?.data).forEach((field: any) => {
                        setError(field, {
                            type: "manual",
                            message: error?.response?.data[field][0],
                        });
                    });
                },
            }
        );
    }

    const handleChangeMarkupPrice = (priceId: any, e) => {
        setProductPrices(
            productPrices.map((pp) => {
                if (pp.prodbasVariantPriceId === priceId) {
                    return {
                        ...pp,
                        markupPercent: +e.target.value ? +e.target.value : null,
                        markupPrice: +e.target.value ? +e.target.value / 100 * pp.prodbasVariantPricePrice : null,
                    }
                } else {
                    return {
                        ...pp
                    }
                }
            })
        )
        // const values = [...productPrices]

        // values[index]['markupPrice'] = e.target.value / 100 * values[index].prodbasVariantPricePrice
        // setProductPrices(values)
        // console.log(e.target.value / 100 * values[index].prodbasVariantPricePrice)
    }
    const handleChangeMarkupPercent = (priceId: any, value) => {
        setProductPrices(
            productPrices.map((pp) => {
                if (pp.prodbasVariantPriceId === priceId) {
                    return {
                        ...pp,
                        markupPercent: +value ? +value * 100 / pp.prodbasVariantPricePrice : null,
                        markupPrice: +value ? +value : null
                    }
                } else {
                    return {
                        ...pp
                    }
                }
            })
        )
    }

    const productPriceBasic = productPrices.filter((item) => item.prodbasVariantPriceMinQty === 1);

    useEffect(() => {
        setProductPrice(product?.productPriceSale ? product?.productPriceSale : product?.productPriceBasic);
        setProductPrices(product?.basic_prices.map((pp) => {
            return {
                ...pp,
                markupPrice: null,
                markupPercent: null,
            }
        }));
        setProductDiscounts(product?.basic_discount);
    }, []);

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Card className="flex flex-col min-h-screen md:min-h-0">
                <div className="w-full mb-5">
                    <h1 className="text-lg font-semibold text-heading">
                        {t("common:text-publish-product")}
                    </h1>
                    Before publish product, please check/add the markup of price.
                </div>

                <div className="w-full">
                    {productPrices.length ? (
                        <>
                            <Description
                                title={t("form:item-product-price")}
                                className="w-full px-0"
                            />
                            {productPrices.map((pp, index) => (
                                <>
                                    {productPrices[index].isDeleted !== 1 ? (
                                        <div className="flex flex-wrap my-5 sm:my-8">
                                            <NumberFormat
                                                customInput={NumberInput}
                                                variant="outline"
                                                label={t("form:input-label-min-quantity")}
                                                thousandSeparator="."
                                                decimalSeparator=","
                                                allowNegative={false}
                                                allowLeadingZeros={false}
                                                disabled={true}
                                                value={pp?.prodbasVariantPriceMinQty}
                                                onValueChange={({ value }) => {
                                                    const values = [...productPrices]
                                                    values[index]['prodbasVariantPriceMinQty'] = value
                                                    setProductPrices(values)
                                                }}
                                                className="w-3/12"
                                            />
                                            <div
                                                className="w-3/12 flex items-center relative pl-1"
                                            >
                                                <NumberFormat
                                                    label={t("form:input-label-markup-percent")}
                                                    customInput={NumberInput}
                                                    variant="outline"
                                                    allowNegative={false}
                                                    // decimalSeparator=","
                                                    // fixedDecimalScale={true}
                                                    decimalScale={2}
                                                    // displayType="input"
                                                    // allowLeadingZeros={false}
                                                    value={pp?.markupPercent}
                                                    onChange={(e) => handleChangeMarkupPrice(pp?.prodbasVariantPriceId, e)}
                                                    // onValueChange={({ value }) => {
                                                    //     const values = [...productPrices]
                                                    //     // values[index]['wkwk'] = value
                                                    //     values[index]['markupPrice'] = value / 100 * values[index].prodbasVariantPricePrice
                                                    //     setProductPrices(values)
                                                    // }
                                                    // }
                                                    className="w-full" />
                                                <span className="outline-none absolute end-1 focus:outline-none active:outline-none p-2 pt-8 md:pt-8 sm:pt-12 text-body">
                                                    %</span>
                                            </div>
                                            <NumberFormat
                                                customInput={NumberInput}
                                                variant="outline"
                                                label={t("form:input-label-markup-price")}
                                                allowNegative={false}
                                                thousandSeparator={'.'}
                                                decimalSeparator={','}
                                                prefix={'Rp '}
                                                decimalScale={2}
                                                // allowLeadingZeros={false}
                                                disabled={product?.prices.length ? true : false}
                                                // !== null ? pp?.markupPrice >= pp?.prodbasVariantPricePrice ? pp?.prodbasVariantPricePrice : pp?.markupPrice : pp?.markupPrice

                                                value={pp?.markupPrice}
                                                onValueChange={({ value }) => handleChangeMarkupPercent(pp?.prodbasVariantPriceId, value)}
                                                // onValueChange={({ value }) => {
                                                //     const values = [...productPrices]
                                                //     // values[index]['prodbasVariantPricePrice'] = value
                                                //     values[index]['markupPercent'] = value / values[index].prodbasVariantPricePrice * 100
                                                //     setProductPrices(values)
                                                // }
                                                // }
                                                className="w-6/12 pl-1"
                                            />
                                        </div>) : (<div>Variant price is deleted</div>)}
                                </>)
                            )
                            }
                        </>
                    ) : (
                        <>
                            <Description
                                title={t("form:item-product-price")}
                                className="w-full px-0"
                            />
                            <div className="flex flex-wrap my-5 sm:my-8">
                                <div
                                    className="w-3/12 flex items-center relative"
                                >
                                    <NumberFormat
                                        label={t("form:input-label-markup-percent")}
                                        customInput={NumberInput}
                                        variant="outline"
                                        decimalSeparator="."
                                        allowNegative={false}
                                        decimalScale={2}
                                        // allowLeadingZeros={false}
                                        value={markupPercent}
                                        onChange={(e) => {
                                            setMarkupPrice(+e.target.value ? +e.target.value / 100 * productPrice : null)
                                            setMarkupPercent(+e.target.value ? +e.target.value : null)
                                        }
                                        }
                                        // onValueChange={({ value }) => {
                                        //     const values = [...productPrices]
                                        //     // values[index]['wkwk'] = value
                                        //     values[index]['markupPrice'] = value / 100 * values[index].prodbasVariantPricePrice
                                        //     setProductPrices(values)
                                        // }
                                        // }
                                        className="w-full" />
                                    <span className="outline-none absolute end-1 focus:outline-none active:outline-none p-2 pt-8 md:pt-8 sm:pt-12 text-body">
                                        %</span>
                                </div>
                                <NumberFormat
                                    customInput={NumberInput}
                                    variant="outline"
                                    label={t("form:input-label-markup-price")}
                                    thousandSeparator="."
                                    decimalSeparator=","
                                    allowNegative={false}
                                    allowLeadingZeros={false}
                                    prefix={'Rp '}
                                    decimalScale={2}
                                    disabled={product?.productPriceSale ? true : false}
                                    value={markupPrice}
                                    onValueChange={({ value }) => {
                                        setMarkupPercent(+value ? +value / productPrice * 100 : null)
                                        setMarkupPrice(+value ? +value : null)
                                    }
                                    }
                                    className="pl-1 w-9/12"
                                />
                            </div>
                        </>
                    )
                    }

                    {undefined !== undefined ? (<></>
                        // <div className="flex flex-wrap my-5 sm:my-8">
                        //     <Description
                        //         title={t("form:item-product-discount")}
                        //         className="w-full px-0 pt-3"
                        //     />
                        //     <div className="w-full">
                        //         <div className="flex flex-wrap my-5 sm:my-8">
                        //             <div
                        //                 className="w-2/6 flex items-center relative"
                        //             >
                        //                 <NumberFormat
                        //                     label={t("form:input-label-discount-percent")}
                        //                     customInput={NumberInput}
                        //                     variant="outline"
                        //                     decimalSeparator="."
                        //                     allowNegative={false}
                        //                     disabled={true}
                        //                     // allowLeadingZeros={false}
                        //                     value={productDiscountPercent >= 100 ? 100 : productDiscountPercent}
                        //                     onValueChange={({ value }) => setProductDiscountPercent(value)}
                        //                     className="w-full" />
                        //                 <span className="outline-none absolute end-1 focus:outline-none active:outline-none p-2 pt-8 md:pt-8 sm:pt-12 text-body">
                        //                     %</span>
                        //             </div>
                        //             {/* <NumberFormat
                        //     customInput={NumberInput}
                        //     variant="outline"
                        //     label={t("form:input-label-min-quantity")}
                        //     thousandSeparator="."
                        //     decimalSeparator=","
                        //     allowNegative={false}
                        //     allowLeadingZeros={false}
                        //     // disabled={pp?.readOnly}
                        //     // value={pp?.prodprice_min_quantity}
                        //     // onValueChange={({ value }) => {
                        //     //   const values = [...productPrices]
                        //     //   values[index]['prodprice_min_quantity'] = value
                        //     //   setProductPrices(values)
                        //     // }}
                        //     className="w-1/6"
                        //   /> */}
                        //             <NumberFormat
                        //                 customInput={NumberInput}
                        //                 variant="outline"
                        //                 label={t("form:input-label-discount-amount")}
                        //                 thousandSeparator="."
                        //                 decimalSeparator=","
                        //                 allowNegative={false}
                        //                 allowLeadingZeros={false}
                        //                 disabled={true}
                        //                 prefix={'Rp. '}
                        //                 value={(productDiscountPercent / 100) * (productPrices.length ? (+productPrice + productPriceBasic[0].markupPrice) : (+productPrice + +markupPrice))}
                        //                 onValueChange={({ value }) => {
                        //                     setProductDiscountAmount(value)
                        //                 }
                        //                 }
                        //                 className="w-4/6 pl-2"
                        //             />
                        //         </div>
                        //         <div className="flex flex-wrap my-5 sm:my-8">
                        //             <NumberFormat
                        //                 customInput={NumberInput}
                        //                 variant="outline"
                        //                 label={t("form:input-label-min-purchase")}
                        //                 thousandSeparator="."
                        //                 decimalSeparator=","
                        //                 allowNegative={false}
                        //                 allowLeadingZeros={false}
                        //                 disabled={true}
                        //                 prefix={'Rp. '}
                        //                 value={minPurchaseDiscount}
                        //                 onValueChange={({ value }) => setMinPurchaseDiscount(value)}
                        //                 className="mb-5 w-full mt-3"
                        //             />
                        //         </div>
                        //     </div>
                        // </div>
                    ) : null
                    }

                    {productDiscounts.length ? (
                        <>
                            <Description
                                title={t("form:item-product-discount")}
                                className="w-full px-0"
                            />
                            {productDiscounts.map((pd, index) => (
                                <>
                                    {productDiscounts[index].isDeleted !== 1 ? (
                                        <div className="flex flex-wrap my-5 sm:my-8">
                                            <NumberFormat
                                                customInput={NumberInput}
                                                variant="outline"
                                                label={t("form:input-label-min-quantity")}
                                                thousandSeparator="."
                                                decimalSeparator=","
                                                allowNegative={false}
                                                allowLeadingZeros={false}
                                                disabled={true}
                                                value={pd?.prodbasDiscountMinPurchase}
                                                onValueChange={({ value }) => {
                                                    const values = [...productDiscounts]
                                                    values[index]['prodbasDiscountMinPurchase'] = value
                                                    setProductDiscounts(values)
                                                }}
                                                className="w-3/12"
                                            />
                                            <div
                                                className="w-3/12 flex items-center relative pl-1"
                                            >
                                                <NumberFormat
                                                    label={t("form:input-label-discount-percent")}
                                                    customInput={NumberInput}
                                                    variant="outline"
                                                    decimalSeparator="."
                                                    allowNegative={false}
                                                    disabled={true}
                                                    // allowLeadingZeros={false}
                                                    value={pd?.prodbasDiscountPercent}
                                                    onValueChange={({ value }) => {
                                                        const values = [...productDiscounts]
                                                        values[index]['prodbasDiscountPercent'] = value
                                                        setProductDiscounts(values)
                                                    }}
                                                    // onValueChange={({ value }) => {
                                                    //     const values = [...productPrices]
                                                    //     // values[index]['wkwk'] = value
                                                    //     values[index]['markupPrice'] = value / 100 * values[index].prodbasVariantPricePrice
                                                    //     setProductPrices(values)
                                                    // }
                                                    // }
                                                    className="w-full" />
                                                <span className="outline-none absolute end-1 focus:outline-none active:outline-none p-2 pt-8 md:pt-8 sm:pt-12 text-body">
                                                    %</span>
                                            </div>
                                            <NumberFormat
                                                customInput={NumberInput}
                                                variant="outline"
                                                label={t("form:input-label-discount-amount")}
                                                allowNegative={false}
                                                thousandSeparator={'.'}
                                                decimalSeparator={','}
                                                prefix={'Rp '}
                                                // allowLeadingZeros={false}
                                                disabled={true}
                                                decimalScale={2}
                                                // !== null ? pp?.markupPrice >= pp?.prodbasVariantPricePrice ? pp?.prodbasVariantPricePrice : pp?.markupPrice : pp?.markupPrice

                                                value={productDiscounts[index]?.prodbasDiscountMinPurchase * (productPrices.length ? +productPrice + productPriceBasic[0].markupPrice : +productPrice + +markupPrice) * (productDiscounts[index]?.prodbasDiscountPercent / 100)}
                                                onValueChange={({ value }) => {
                                                    const values = [...productDiscounts]
                                                    values[index]['prodbasDiscountAmount'] = value
                                                    setProductDiscounts(values)
                                                }}
                                                // onValueChange={({ value }) => {
                                                //     const values = [...productPrices]
                                                //     // values[index]['prodbasVariantPricePrice'] = value
                                                //     values[index]['markupPercent'] = value / values[index].prodbasVariantPricePrice * 100
                                                //     setProductPrices(values)
                                                // }
                                                // }
                                                className="w-6/12 pl-1"
                                            />
                                        </div>) : (<div>Variant price is deleted</div>)}
                                </>))
                            }
                        </>) : null
                    }
                </div>
                {/* <ImportProducts />
                <ImportVariationOptions /> */}
                {/* <a
                    href={`${process?.env?.NEXT_PUBLIC_REST_API_ENDPOINT}export-products/${shopId}`}
                    target="_blank"
                    className="border-dashed border-2 border-border-base h-36 rounded flex flex-col justify-center items-center cursor-pointer focus:border-accent-400 focus:outline-none p-5"
                >
                    <DownloadIcon className="text-muted-light w-10" />

                    <span className="text-sm mt-4 text-center text-accent font-semibold">
                        {t("common:text-export-products")}
                    </span>
                </a>

                <a
                    href={`${process?.env?.NEXT_PUBLIC_REST_API_ENDPOINT}export-variation-options/${shopId}`}
                    target="_blank"
                    className="border-dashed border-2 border-border-base h-36 rounded flex flex-col justify-center items-center cursor-pointer focus:border-accent-400 focus:outline-none p-5"
                >
                    <DownloadIcon className="text-muted-light w-10" />
                    <span className="text-sm mt-4 text-center text-accent font-semibold">
                        {t("common:text-export-product-variations")}
                    </span>
                </a> */}
                {product?.productStatus === 1 ? null : (
                    <div className="mb-4 text-end">
                        <Button size="small" loading={publishing}>
                            Publish Product
                        </Button>
                    </div>)}
            </Card>
        </form>
    );
};

export default PublishProductView;
