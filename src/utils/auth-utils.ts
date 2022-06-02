import Cookie from "js-cookie";
import SSRCookie from "cookie";
import {
  AUTH_CRED,
  SUPERUSER,
  TOKEN,
  ADMIN,
  STORE_OWNER,
  STAFF
} from "./constants";

export const allowedRoles = [SUPERUSER, ADMIN, STORE_OWNER, STAFF];
// export const adminAndOwnerOnly = [SUPER_ADMIN, STORE_OWNER];
// export const adminOwnerAndStaffOnly = [SUPER_ADMIN, STORE_OWNER, STAFF];
// export const adminOnly = [SUPER_ADMIN];
// export const ownerOnly = [STORE_OWNER];

export function setAuthCredentials(userId: string, shopId: string, userApiToken: string, userGroup: any, userPermissions: any) {
  Cookie.set(AUTH_CRED, JSON.stringify({ userId, shopId, userApiToken, userGroup, userPermissions }));
}

export function getAuthCredentials(context?: any): {
  userId: string | null;
  shopId: string | null;
  userApiToken: string | null;
  userGroup: string[] | null;
  userPermissions: string[] | null;
} {
  let authCred;
  if (context) {
    authCred = parseSSRCookie(context)[AUTH_CRED];
  } else {
    authCred = Cookie.get(AUTH_CRED);
  }
  if (authCred) {
    return JSON.parse(authCred);
  }
  return { userId: null, shopId: null, userApiToken: null, userGroup: null, userPermissions: null };
}

export function parseSSRCookie(context: any) {
  return SSRCookie.parse(context.req.headers.cookie ?? "");
}

export function hasAccess(
  _allowedRoles: string[],
  _userGroup: string[] | undefined | null
) {
  if (_userGroup) {
    console.log(_allowedRoles)
    return Boolean(
      _allowedRoles?.find((aRole) => _userGroup.includes(aRole))
    );
  }
  return false;
}

export function hasPermission(
  _userPermissions: string[] | undefined | null
) {
  if (_userPermissions) {
    const { userPermissions } = getAuthCredentials()
    return Boolean(
      userPermissions?.find((aRole) => _userPermissions.includes(aRole))
    );
  }
  return false;
}

export function isAuthenticated(_cookies: any) {
  return (
    !!_cookies["userApiToken"]
    // Array.isArray(_cookies[PERMISSIONS]) &&
    // !!_cookies[PERMISSIONS].length
  );
}
