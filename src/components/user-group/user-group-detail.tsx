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
import { useUserGroupsQuery } from "@data/user-group/use-user-groups.query";
import { useUserGroupQuery } from "@data/user-group/use-user-group.query";
import { usePermissionsQuery } from "@data/user-group/use-permissions.query";
import { useEffect, useState } from "react";
import { formatPermissionsByGroup } from "./format-permission";
import Checkbox from "@components/ui/checkbox/checkbox";
import { Permission } from "@ts-types/generated";
import { useForm } from "react-hook-form";
import styles from "@components/ui/checkbox/checkbox.module.css";
import { useCreateUserGroupMutation } from "@data/user-group/user-group-create.mutation";
import { animateScroll } from "react-scroll";
import { useUpdateUserGroupMutation } from "@data/user-group/user-group-update.mutation";

type IProps = {
    permissions?: Permission | null;
    loadingPermissions?: any;
};

export default function UserGroupDetails({ permissions, loadingPermissions }: IProps) {
    const { t } = useTranslation("common");
    const { query } = useRouter();
    const [group_permissions, setGroupPermissions] = useState([])
    const [groupedPermissions, setGroupedPermissions] = useState([])
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const handleChangePermission = e => {
        if (group_permissions.includes(e.target.value)) {
            setGroupPermissions(group_permissions.filter(p => p !== e.target.value))
        } else {
            setGroupPermissions(group_permissions.concat(e.target.value))
        }
    }
    const {
        data,
        isLoading: loading,
        setError,
    } = useUserGroupQuery(query.userGroupId as string);

    const { mutate: createUserGroup, isLoading: creating } =
        useCreateUserGroupMutation();
    const { mutate: updateUserGroup, isLoading: updating } =
        useUpdateUserGroupMutation();

    const onSubmit = async () => {
        const formData = new FormData();

        formData.append("permissions", JSON.stringify(group_permissions));
        formData.append("userGroupId", query.userGroupId);


        createUserGroup(
            formData,
            {
                onError: (error: any) => {
                    if (error?.response?.data?.message) {
                        setErrorMessage(error?.response?.data?.message);
                        animateScroll.scrollToTop();
                    } else {
                        Object.keys(error?.response?.data).forEach((field: any) => {
                            setError(field, {
                                type: "manual",
                                message: error?.response?.data[field][0],
                            });
                        });
                    }
                },
            }
        );
    }

    const methods = useForm();
    const {
        watch,
        handleSubmit,
        formState: { errors },
    } = methods;

    if (loading && loadingPermissions) return <Loader text={t("text-loading")} />;
    useEffect(() => {
        setGroupPermissions(data['user']?.permissions.map(p => p.permissionId))
        setGroupedPermissions(formatPermissionsByGroup(permissions ? permissions : []))
    }, [permissions])

    return (
        <div>{console.log(group_permissions)}
            <Card className="mb-5">
                <h3 className="text-2xl font-semibold text-heading text-center lg:text-start w-full lg:w-1/3 mb-8 lg:mb-0 whitespace-nowrap">
                    {t("common:text-user-group-details")}
                </h3>
            </Card>
            <div className="grid grid-cols-12 gap-6">
                <div className="order-1 xl:order-1 col-span-12 sm:col-span-12 xl:col-span-12 3xl:col-span-12">
                    <form onSubmit={handleSubmit(onSubmit)} noValidate>
                        <div className="py-8 px-6 bg-white rounded flex flex-col">
                            <table className="table-fixed m-5">
                                <thead>
                                    <tr className="border-b-4 border-gray-500">
                                        <th className="text-left">Permissions</th>
                                        <th className="border-top-0" />
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.keys(groupedPermissions).map(permissionGroup => (
                                        // { voca.titleCase(permissionGroup.replaceAll('-', ' ')) }
                                        <>
                                            <tr key={permissionGroup} className="border-b-2 border-gray-200">
                                                <td className="fit">
                                                    {permissionGroup}
                                                </td>
                                                <td className=" p-2">
                                                    {
                                                        groupedPermissions[permissionGroup].map(
                                                            p => (
                                                                <>
                                                                    <div className="flex items-center">
                                                                        <input
                                                                            id={p.permissionId}
                                                                            type="checkbox"
                                                                            className={styles.checkbox}
                                                                            checked={group_permissions.includes(
                                                                                p.permissionId
                                                                            )}
                                                                            value={p.permissionId}
                                                                            onChange={handleChangePermission}
                                                                        // {...register("isVariantPrice")}
                                                                        // error={t(errors.isSupplier?.message!)}
                                                                        />
                                                                        <label htmlFor={p.permissionId} className="text-body text-sm">
                                                                            {p.permissionLabel}
                                                                        </label>
                                                                    </div>
                                                                </>
                                                            )
                                                        )
                                                    }
                                                </td>
                                            </tr>
                                        </>
                                        // console.log('wkwk')
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
