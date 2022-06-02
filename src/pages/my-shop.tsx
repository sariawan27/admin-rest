import OwnerDashboard from "@components/dashboard/owner";
import AdminLayout from "@components/layouts/admin";
import { adminOnly } from "@utils/auth-utils";
import { SUPERUSER } from "@utils/constants";
import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale!, ["common"])),
  },
});
const MyShopPage = () => {
  return <OwnerDashboard />;
};

MyShopPage.authenticate = {
  userGroup: SUPERUSER,
};
MyShopPage.Layout = AdminLayout;
export default MyShopPage;
