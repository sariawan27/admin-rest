import {
    UpdateUserGroup,
    CreateUserGroup,
} from "@ts-types/generated";
import Base from "./base";

class UserGroup extends Base<CreateUserGroup, UpdateUserGroup> {

    //you can add function to call api url in here

    getAllPermissions = async (url: string) => {
        return await this.http(url, "get");
    };
    createWithFormData = async (url: string, variables: any) => {
        const options = {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        };
        const response = await this.http(url, "post", variables, options);
        return response.data;
    };

    updateWithFormData = async (url: string, variables: any) => {
        const options = {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        };
        const response = await this.http(url, "post", variables, options);
        return response.data;
    };
}

export default new UserGroup();
