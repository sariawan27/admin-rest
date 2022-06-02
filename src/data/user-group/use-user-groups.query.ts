import { QueryParamsType, QueryOptionsType } from "@ts-types/custom.types";
import { mapPaginatorData } from "@utils/data-mappers";
import { useQuery } from "react-query";
import UserGroup from "@repositories/user-group";
import { API_ENDPOINTS } from "@utils/api/endpoints";
import { UserGroup as TUserGroup } from "@ts-types/generated";

const fetchUserGroups = async ({ queryKey }: QueryParamsType) => {
    const [_key, params] = queryKey;
    const {
        page,
        text,
        limit = 15,
        orderBy = "updated_at",
        sortedBy = "DESC",
    } = params as QueryOptionsType;
    const url = `${API_ENDPOINTS.USER_GROUPS}?search=${text}&limit=${limit}&page=${page}&orderBy=${orderBy}&sortedBy=${sortedBy}&with=wallet`;
    const {
        data: { data, ...rest },
    } = await UserGroup.all(url);
    return {
        userGroups: { data, paginatorInfo: mapPaginatorData({ ...rest }) }
    };
};

type UserGroupResponse = {
    userGroups: TUserGroup[];
};

const useUserGroupsQuery = (options: QueryOptionsType) => {
    return useQuery<UserGroupResponse, Error>([API_ENDPOINTS.USER_GROUPS, options], fetchUserGroups, {
        keepPreviousData: true,
    });
};

export { useUserGroupsQuery, fetchUserGroups };
