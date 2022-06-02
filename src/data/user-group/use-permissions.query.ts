import { QueryParamsType, QueryOptionsType } from "@ts-types/custom.types";
import { mapPaginatorData } from "@utils/data-mappers";
import { useQuery } from "react-query";
import UserGroup from "@repositories/user-group";
import { API_ENDPOINTS } from "@utils/api/endpoints";
import { Permission as TPermission } from "@ts-types/generated";
import { UserGroup as TUserGroup } from "@ts-types/generated";

const fetchPermissions = async ({ queryKey }: QueryParamsType) => {
    const [_key, params] = queryKey;
    const url = `${API_ENDPOINTS.PERMISSIONS}`;
    const { data } = await UserGroup.getAllPermissions(url);
    return data;
};

const usePermissionsQuery = () => {
    return useQuery<TPermission[], Error>(
        [API_ENDPOINTS.PERMISSIONS],
        fetchPermissions
    );
};
// type UserGroupResponse = {
//     userGroups: TUserGroup[];
// };

// const useUserGroupsQuery = (options: QueryOptionsType) => {
//     return useQuery<UserGroupResponse, Error>([API_ENDPOINTS.USER_GROUPS, options], fetchUserGroups, {
//         keepPreviousData: true,
//     });
// };

export { usePermissionsQuery, fetchPermissions };
