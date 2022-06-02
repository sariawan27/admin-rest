import React from "react";
import { useRouter } from "next/router";
import { getAuthCredentials, hasAccess } from "./auth-utils";
import Loader from "@components/ui/loader/loader";
import AccessDeniedPage from "@components/common/access-denied";
import { ROUTES } from "./routes";

const PrivateRoute: React.FC<{ authProps: any }> = ({
  children,
  authProps,
}) => {
  const router = useRouter();
  const { userApiToken, userGroup } = getAuthCredentials();
  const isUser = !!userApiToken;
  const hasPermission =
    Array.isArray(userGroup) &&
    !!userGroup.length &&
    hasAccess(userGroup, authProps.userGroup);
  React.useEffect(() => {
    if (!isUser) router.replace(ROUTES.LOGIN); // If not authenticated, force log in
  }, [isUser]);

  if (isUser && hasPermission) {
    return <>{children}</>;
  }
  if (isUser && !hasPermission) {
    return <AccessDeniedPage />;
  }
  // Session is being fetched, or no user.
  // If no user, useEffect() will redirect.
  return <Loader showText={false} />;
};

export default PrivateRoute;
