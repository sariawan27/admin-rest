import User from "@repositories/user";
import { useQuery } from "react-query";
import { UserGroup as TUserGroup } from "@ts-types/generated";
import { API_ENDPOINTS } from "@utils/api/endpoints";

export const fetchUserGroup = async (userId: string) => {
    const { data } = await User.find(`${API_ENDPOINTS.USER_GROUPS}/${userId}`);
    return { user: data };
};

type UserGroupResponse = {
    userGroup: TUserGroup;
};

export const useUserGroupQuery = (userGroupId: string) => {
    return useQuery<UserGroupResponse, Error>([API_ENDPOINTS.USER_GROUPS, userGroupId], () =>
        fetchUserGroup(userGroupId)
    );
};
