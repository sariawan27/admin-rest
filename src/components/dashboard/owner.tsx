import ErrorMessage from "@components/ui/error-message";
import Loader from "@components/ui/loader/loader";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import { useMeQuery } from "@data/user/use-me.query";
import ShopCard from "@components/shop/shop-card";
import NoShopSvg from "../../../public/no-shop.svg";
import { CheckMarkFill } from "@components/icons/checkmark-circle-fill";
import { CloseFillIcon } from "@components/icons/close-fill";
import ReadMore from "@components/ui/truncate";
import { MapPin } from "@components/icons/map-pin";
import { isEmpty } from "lodash";
import { formatAddress } from "@utils/format-address";
import { PhoneIcon } from "@components/icons/phone";
import { allowedRoles, getAuthCredentials, hasAccess } from "@utils/auth-utils";
import LinkButton from "@components/ui/link-button";
import { EditIcon } from "@components/icons/edit copy";
import { CubeIcon } from "@components/icons/shops/cube";
import { OrdersIcon } from "@components/icons/sidebar";
import { PriceWalletIcon } from "@components/icons/shops/price-wallet";
import { DollarIcon } from "@components/icons/shops/dollar";
import { PercentageIcon } from "@components/icons/shops/percentage";
import dayjs, { locale } from "dayjs";
import getStorageUrl from "@utils/getStorageUrl";

export default function OwnerDashboard() {
  const { t } = useTranslation();
  const { userGroup } = getAuthCredentials();
  const { data, isLoading: loading, error } = useMeQuery();

  if (loading) return <Loader text={t("common:text-loading")} />;
  if (error) return <ErrorMessage message={error.message} />;
  return (

    <div className="grid grid-cols-12 gap-6">
      {!data?.supplier?.supplierEmailVerifiedAt && (
        <div className="col-span-12 bg-red-500 text-sm text-light px-5 py-4 rounded-lg">
          {t("common:text-permission-message")}
        </div>
      )}
      {/* about Shop */}
      <div className="order-2 xl:order-1 col-span-12 sm:col-span-6 xl:col-span-4 3xl:col-span-3">
        <div className="py-8 px-6 bg-white rounded flex flex-col items-center">
          <div className="w-36 h-36 relative rounded-full mb-5">
            <div className="w-full h-full relative overflow-hidden flex items-center justify-center border border-gray-100 rounded-full">
              <Image
                src={getStorageUrl + data?.shop?.shopLogoPath ?? "/avatar-placeholder.svg"}
                layout="fill"
                objectFit="contain"
              />
            </div>

            {data?.supplier?.supplierEmailVerifiedAt ? (
              <div className="w-5 h-5 rounded-full overflow-hidden bg-light absolute bottom-4 end-2">
                <CheckMarkFill width={20} className="me-2 text-accent" />
              </div>
            ) : (
              <div className="w-5 h-5 rounded-full overflow-hidden bg-light absolute bottom-4 end-2">
                <CloseFillIcon width={20} className="me-2 text-red-500" />
              </div>
            )}
          </div>

          <h1 className="text-xl font-semibold text-heading mb-2">{data?.shop?.shopName}</h1>
          <p className="text-sm text-body text-center">
            <ReadMore character={70}>{data?.shop?.shopDescription!}</ReadMore>
          </p>

          <div className="flex w-full justify-start mt-5">
            <span className="text-muted-light mt-0.5 me-2">
              <MapPin width={16} />
            </span>

            <address className="text-body text-sm not-italic">
              {!isEmpty(formatAddress(data?.shop?.shopAddress!))
                ? formatAddress(data?.shop?.shopAddress!)
                : t("common:text-no-address")}
            </address>
          </div>

          <div className="flex w-full justify-start mt-3">
            <span className="text-muted-light mt-0.5 me-2">
              <PhoneIcon width={16} />
            </span>
            <a href={`tel:${data?.shop?.settings?.shopSettingContact}`} className="text-body text-sm">
              {data?.shop?.settings?.shopSettingContact
                ? data?.shop?.settings?.shopSettingContact
                : t("common:text-no-contact")}
            </a>
          </div>

          <div className="grid grid-cols-1 w-full mt-7">
            <a
              href={`${process.env.NEXT_PUBLIC_SHOP_URL}/${locale}/shops/${data?.shop?.shopId}`}
              target="_blank"
              className="inline-flex items-center justify-center flex-shrink-0 leading-none rounded outline-none transition duration-300 ease-in-out focus:outline-none focus:shadow focus:ring-1 focus:ring-accent-700 !bg-gray-100 hover:!bg-accent !text-heading hover:!text-light !font-normal px-5 py-0 h-12"
            >
              {t("common:text-visit-shop")}
            </a>
          </div>
        </div>
      </div>

      {/* Cover Photo */}
      <div className="order-1 xl:order-2 col-span-12 xl:col-span-8 3xl:col-span-9 rounded h-full overflow-hidden relative bg-light min-h-[400px]">
        <Image
          src={getStorageUrl + data?.shop?.shopCoverImagePath ?? "/product-placeholder-borderless.svg"}
          layout="fill"
          objectFit="contain"
        />

        {hasAccess(allowedRoles, userGroup) && (
          <LinkButton
            size="small"
            className="absolute top-3 end-3 bg-blue-500 hover:bg-blue-600 shadow-sm"
            href={`/my-shop/${data?.shop?.shopId}/edit`}
          >
            <EditIcon className="w-4 me-2" /> {t("common:text-edit-shop")}
          </LinkButton>
        )}
      </div>

      {/* Mini Dashboard */}
      <div className="order-4 xl:order-3 col-span-12 xl:col-span-9">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 bg-light p-4 rounded h-full">
          <div className="space-y-3">
            <h2 className="text-heading text-lg font-semibold">
              {t("common:text-products")}
            </h2>

            <div className="border border-gray-100">
              <div className="flex items-center py-3 px-4 border-b border-gray-100">
                <div className="p-3 rounded-full w-11 h-11 flex items-center justify-center bg-[#FC9EC6] text-light">
                  <CubeIcon width={18} />
                </div>

                <div className="ml-3">
                  <p className="text-lg font-semibold text-sub-heading mb-0.5">
                    {/* {products_count} */}
                  </p>
                  <p className="text-sm text-muted mt-0">
                    {t("common:text-total-products")}
                  </p>
                </div>
              </div>

              <div className="flex items-center py-3 px-4">
                <div className="p-3 rounded-full w-11 h-11 flex items-center justify-center bg-[#6EBBFD] text-light">
                  <OrdersIcon width={16} />
                </div>

                <div className="ml-3">
                  <p className="text-lg font-semibold text-sub-heading mb-0.5">
                    {/* {orders_count} */}
                  </p>
                  <p className="text-sm text-muted mt-0">
                    {t("common:text-total-orders")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-heading text-lg font-semibold">
              {t("common:text-revenue")}
            </h2>

            <div className="border border-gray-100">
              <div className="flex items-center py-3 px-4 border-b border-gray-100">
                <div className="p-3 rounded-full w-11 h-11 flex items-center justify-center bg-[#C7AF99] text-light">
                  <PriceWalletIcon width={16} />
                </div>

                <div className="ml-3">
                  <p className="text-lg font-semibold text-sub-heading mb-0.5">
                    {/* {totalEarnings} */}
                  </p>
                  <p className="text-sm text-muted mt-0">
                    {t("common:text-gross-sales")}
                  </p>
                </div>
              </div>

              <div className="flex items-center py-3 px-4">
                <div className="p-3 rounded-full w-11 h-11 flex items-center justify-center bg-[#FFA7AE] text-light">
                  <DollarIcon width={12} />
                </div>

                <div className="ml-3">
                  <p className="text-lg font-semibold text-sub-heading mb-0.5">
                    {/* {currentBalance} */}
                  </p>
                  <p className="text-sm text-muted mt-0">
                    {t("common:text-current-balance")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-heading text-lg font-semibold">
              {t("common:text-others")}
            </h2>

            <div className="border border-gray-100">
              <div className="flex items-center py-3 px-4 border-b border-gray-100">
                <div className="p-3 rounded-full w-11 h-11 flex items-center justify-center bg-[#D59066] text-light">
                  <PercentageIcon width={16} />
                </div>

                <div className="ml-3">
                  <p className="text-lg font-semibold text-sub-heading mb-0.5">
                    {/* {`${balance?.admin_commission_rate ?? 0} %` ?? "Not Set"} */}
                  </p>
                  <p className="text-sm text-muted mt-0">
                    {t("common:text-commission-rate")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Misc. Information */}
      <div className="order-3 xl:order-4 bg-light rounded col-span-12 sm:col-span-6 xl:col-span-3">
        <div className="flex flex-col p-6 2xl:p-7 border-b border-gray-200">
          <span className="text-muted text-sm mb-2">
            {t("common:text-registered-since")}
          </span>
          <span className="text-sm font-semibold text-sub-heading">
            {dayjs(data?.created_at).format("MMMM D, YYYY")}
          </span>
        </div>

        <div className="flex flex-col p-6 2xl:p-7">
          <span className="text-sub-heading text-lg font-semibold mb-4">
            {t("common:text-payment-info")}
          </span>

          <div className="flex flex-col space-y-3">
            <p className="text-sm text-sub-heading">
              <span className="text-muted block w-full">
                {t("common:text-name")}:
              </span>{" "}
              <span className="font-semibold">
                {data?.shop?.payment_info[0]?.paymentInfoName}
              </span>
            </p>
            <p className="text-sm text-sub-heading">
              <span className="text-muted block w-full">
                {t("common:text-email")}:
              </span>{" "}
              <span className="font-semibold">
                {data?.shop?.payment_info[0]?.paymentInfoEmail}
              </span>
            </p>
            <p className="text-sm text-sub-heading">
              <span className="text-muted block w-full">
                {t("common:text-bank")}:
              </span>{" "}
              <span className="font-semibold">
                {data?.shop?.payment_info[0]?.paymentInfoBank}
              </span>
            </p>
            <p className="text-sm text-sub-heading">
              <span className="text-muted block w-full">
                {t("common:text-account-no")}:
              </span>{" "}
              <span className="font-semibold">
                {data?.shop?.payment_info[0]?.paymentInfoAccount}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
    // <>
    //   <div className="border-b border-dashed border-border-base mb-5 sm:mb-8 pb-8">
    //     <h1 className="text-lg font-semibold text-heading">
    //       {t("common:sidebar-nav-item-my-shops")}
    //     </h1>
    //   </div>

    //   <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 3xl:grid-cols-5 gap-5">
    //     <ShopCard shop={data?.shop} />
    //   </div>{console.log(data?.shop === null)}

    //   {data?.shop === null ? (
    //     <div className="w-full flex flex-col items-center p-10">
    //       <div className="w-[300px] sm:w-[490px] h-[180px] sm:h-[370px] relative">
    //         <Image
    //           alt={t("common:text-image")}
    //           src={NoShopSvg}
    //           layout="fill"
    //           objectFit="cover"
    //         />
    //       </div>
    //       <span className="text-lg font-semibold text-center text-body-dark mt-6 sm:mt-10">
    //         {t("common:text-no-shop")}
    //       </span>
    //     </div>
    //   ) : null}
    //   {!!data?.shop ? (
    //     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 3xl:grid-cols-5 gap-5">
    //       <ShopCard shop={data?.shop} />
    //     </div>
    //   ) : null}
    // </>
  );
}
