import dynamic from "next/dynamic";
import type { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import {
  allowedRoles,
  getAuthCredentials,
  hasAccess,
  isAuthenticated,
} from "@utils/auth-utils";
import { SUPER_ADMIN } from "@utils/constants";
import { ROUTES } from "@utils/routes";
import AppLayout from "@components/layouts/app";
const AdminDashboard = dynamic(() => import("@components/dashboard/admin"));
const OwnerDashboard = dynamic(() => import("@components/dashboard/owner"));

export default function Dashboard({
  userGroup,
}: {
  userGroup: string[];
}) {
  // if (userPermissions?.includes(SUPER_ADMIN)) {
  return <AdminDashboard />;
  // }
  // return <OwnerDashboard />;
}

Dashboard.Layout = AppLayout;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { locale } = ctx;
  const { userApiToken, userGroup } = getAuthCredentials(ctx);
  if (
    !hasAccess(allowedRoles, userGroup)
  ) {
    return {
      redirect: {
        destination: ROUTES.LOGIN,
        permanent: false,
      },
    };
  }
  if (locale) {
    return {
      props: {
        ...(await serverSideTranslations(locale, [
          "common",
          "table",
          "widgets",
        ])),
        userGroup: userGroup,
      },
    };
  }
  return {
    props: {
      userGroup: userGroup,
    },
  };
};
