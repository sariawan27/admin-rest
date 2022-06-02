import ConfirmationCard from "@components/common/confirmation-card";
import { EditIcon } from "@components/icons/edit copy";
import Button from "@components/ui/button";
import {
    useModalAction, useModalState,
} from "@components/ui/modal/modal.context";
import { ROUTES } from "@utils/routes";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";

const UpdateProductConfirmView = () => {
    const { closeModal } = useModalAction();
    const { data } = useModalState();
    const router = useRouter();

    async function onContinue() {
        router.push(`/${ROUTES.PRODUCTS}/${data}/edit`)
        closeModal();
    }
    async function onCancel() {
        router.back
        closeModal();
    }

    const { t } = useTranslation("common");

    return (
        <div className="p-4 pb-6 bg-light m-auto max-w-sm w-full rounded-md md:rounded-xl sm:w-[24rem]">
            <div className="w-full h-full text-center">
                <div className="flex h-full flex-col justify-between">
                    <EditIcon className="mt-4 w-12 h-12 m-auto text-accent" />
                    <p className="text-heading text-xl font-bold mt-4">{t("common:text-edit-product")}</p>
                    <p className="text-body-dark dark:text-muted leading-relaxed py-2 px-6">
                        If you want to edit product, your product will be temporarily unpublished. Do you want to continue editing the product? Click yes to continue.
                    </p>
                    <div className="flex items-center justify-between space-s-4 w-full mt-8">
                        <div className="w-1/2">
                            <Button
                                onClick={onCancel}
                                variant="outline"
                                className="w-full py-2 px-4 focus:outline-accent hover:bg-accent-hover focus:bg-accent-hover transition ease-in duration-200 text-center text-base font-semibold rounded shadow-md"
                            >
                                {t("common:text-cancel")}
                            </Button>
                        </div>

                        <div className="w-1/2">
                            <Button
                                onClick={onContinue}
                                variant="custom"
                                className="w-full py-2 px-4 bg-accent focus:outline-none hover:bg-accent-hover focus:bg-accent-hover text-light transition ease-in duration-200 text-center text-base font-semibold rounded shadow-md"
                            >
                                {t("common:text-yes")}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdateProductConfirmView;
