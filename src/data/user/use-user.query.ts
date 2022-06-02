import User from "@repositories/user";
import { useQuery } from "react-query";
import { User as TUser } from "@ts-types/generated";
import { API_ENDPOINTS } from "@utils/api/endpoints";

export const fetchUser = async (userId: string) => {
    const { data } = await User.find(`${API_ENDPOINTS.USERS}/${userId}`);
    return { user: data };
};

type UserResponse = {
    user: TUser;
};

export const useUserQuery = (userId: string) => {
    return useQuery<UserResponse, Error>([API_ENDPOINTS.USERS, userId], () =>
        fetchUser(userId)
    );
};
