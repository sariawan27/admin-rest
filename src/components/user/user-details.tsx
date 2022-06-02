import Image from "next/image";
import { CheckMarkFill } from "@components/icons/checkmark-circle-fill";
import { CloseFillIcon } from "@components/icons/close-fill";
import { useTranslation } from "next-i18next";
import Link from "@components/ui/link";
import { ROUTES } from "@utils/routes";
import Loader from "@components/ui/loader/loader";
import { useUserQuery } from "@data/user/use-user.query";
import { useRouter } from "next/router";
import LinkButton from "@components/ui/link-button";
import { EditIcon } from "@components/icons/edit copy";
import Card from "@components/common/card";

const UserDetails: React.FC = () => {
  const { t } = useTranslation("common");;
  const { query } = useRouter();
  const {
    data,
    isLoading: loading,
    error,
  } = useUserQuery(query.userId as string);
  if (loading) return <Loader text={t("text-loading")} />;

  return (
    <div>
      <Card className="mb-5">
        <h3 className="text-2xl font-semibold text-heading text-center lg:text-start w-full lg:w-1/3 mb-8 lg:mb-0 whitespace-nowrap">
          {t("common:text-user-details")}
        </h3>
      </Card>
      <div className="grid grid-cols-12 gap-6">
        <div className="order-1 xl:order-1 col-span-12 sm:col-span-6 xl:col-span-4 3xl:col-span-3">
          <div className="py-8 px-6 bg-white rounded flex flex-col items-center">
            <div className="h-full p-5 flex flex-col items-center">
              <div className="w-32 h-32 relative rounded-full flex items-center justify-center overflow-hidden border border-gray-200">
                {/* <Image
          src={profile?.avatar?.thumbnail ?? "/avatar-placeholder.svg"}
          layout="fill"
        /> */}
              </div>
              <h3 className="text-lg font-semibold text-heading mt-4">{data?.user?.userName!}</h3>
              <div className="border border-gray-200 rounded flex items-center justify-center text-sm text-body-dark py-2 px-3 mt-6">
                {data?.user.isActived! ? (
                  <CheckMarkFill width={16} className="me-2 text-accent" />
                ) : (
                  <CloseFillIcon width={16} className="me-2 text-red-500" />
                )}
                {data?.user?.isActived! ? "Enabled" : "Disabled"}
              </div>
            </div>
          </div>
        </div>
        <div className="order-2 xl:order-2 col-span-12 xl:col-span-8 3xl:col-span-9 rounded overflow-hidden relative bg-light">
          <div className="flex flex-col p-6 2xl:p-7">
            <span className="text-sub-heading text-lg font-semibold mb-4">
              {t("common:text-user-info")}
            </span>
            <LinkButton
              size="small"
              className="absolute top-3 end-3 shadow-sm"
              href={`${ROUTES.USERS}/${query.userId}/edit`}
            >
              <EditIcon className="w-4 me-2" /> {t("common:text-edit-user")}
            </LinkButton>

            <div className="flex flex-col space-y-3">
              <p className="text-sm text-sub-heading">
                <span className="text-muted block w-full">
                  {t("common:text-group")}:
                </span>{" "}
                <span className="font-semibold">
                  {data?.user?.user_group?.userGroupName!}
                </span>
              </p>
              <p className="text-sm text-sub-heading">
                <span className="text-muted block w-full">
                  {t("common:text-name")}:
                </span>{" "}
                <span className="font-semibold">
                  {data?.user?.userName!}
                </span>
              </p>
              <p className="text-sm text-sub-heading">
                <span className="text-muted block w-full">
                  {t("common:text-email")}:
                </span>{" "}
                <span className="font-semibold">
                  {data?.user?.userEmail!}
                </span>
              </p>
              <p className="text-sm text-sub-heading">
                <span className="text-muted block w-full">
                  {t("table:table-item-email-verified")}:
                </span>{" "}
                <span className="font-semibold">
                  {data?.user?.userEmailVerifiedAt == null ? "-" : data?.user?.userEmailVerifiedAt}
                </span>
              </p>
              <p className="text-sm text-sub-heading">
                <span className="text-muted block w-full">
                  {t("common:text-phone")}:
                </span>{" "}
                <span className="font-semibold">
                  {data?.user?.userPhone!}
                </span>
              </p>
              <p className="text-sm text-sub-heading">
                <span className="text-muted block w-full">
                  {t("common:text-address")}:
                </span>{" "}
                <span className="font-semibold">
                  {data?.user?.userAddress!}
                </span>
              </p>
            </div>
          </div>
        </div>
        {data?.user?.supplier ? (
          <>
            <div className="order-3 xl:order-3 col-span-12 sm:col-span-6 xl:col-span-4 3xl:col-span-3"></div>
            <div className="order-4 xl:order-4 col-span-12 xl:col-span-8 3xl:col-span-9 rounded overflow-hidden relative bg-light">
              <div className="flex flex-col p-6 2xl:p-7">
                <span className="text-sub-heading text-lg font-semibold mb-4">
                  {t("common:text-supplier-info")}
                </span>

                <div className="flex flex-col space-y-3">
                  <p className="text-sm text-sub-heading">
                    <span className="text-muted block w-full">
                      {t("common:text-name")}:
                    </span>{" "}
                    <span className="font-semibold">
                      {data?.user?.supplier?.supplierName!}
                    </span>
                  </p>
                  <p className="text-sm text-sub-heading">
                    <span className="text-muted block w-full">
                      {t("common:text-email")}:
                    </span>{" "}
                    <span className="font-semibold">
                      {data?.user?.supplier?.supplierEmail!}
                    </span>
                  </p>
                  <p className="text-sm text-sub-heading">
                    <span className="text-muted block w-full">
                      {t("common:text-phone")}:
                    </span>{" "}
                    <span className="font-semibold">
                      {data?.user?.supplier?.supplierPhone!}
                    </span>
                  </p>
                  <p className="text-sm text-sub-heading">
                    <span className="text-muted block w-full">
                      {t("common:text-address")}:
                    </span>{" "}
                    <span className="font-semibold">
                      {data?.user?.supplier?.supplierAddress!}
                    </span>
                  </p>
                  <p className="text-sm text-sub-heading">
                    <span className="text-muted block w-full">
                      {t("common:text-city")}:
                    </span>{" "}
                    <span className="font-semibold">
                      {data?.user?.supplier?.supplierCity!}
                    </span>
                  </p>
                  <p className="text-sm text-sub-heading">
                    <span className="text-muted block w-full">
                      {t("common:text-province")}:
                    </span>{" "}
                    <span className="font-semibold">
                      {data?.user?.supplier?.supplierProvince!}
                    </span>
                  </p>
                  <p className="text-sm text-sub-heading">
                    <span className="text-muted block w-full">
                      {t("common:text-postal-code")}:
                    </span>{" "}
                    <span className="font-semibold">
                      {data?.user?.supplier?.supplierPostalCode!}
                    </span>
                  </p>
                </div>
              </div>
            </div></>) : null}
      </div>
    </div>
  );
};
export default UserDetails;
