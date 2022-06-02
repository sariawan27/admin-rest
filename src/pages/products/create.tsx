import Layout from "@components/layouts/admin";
import CreateOrUpdateCategoriesForm from "@components/category/category-form";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import CreateOrUpdateProductForm from "@components/product/product-form";

export default function CreateProductPage() {
    const { t } = useTranslation();
    return (
        <>
            <div className="py-5 sm:py-8 flex border-b border-dashed border-border-base">
                <h1 className="text-lg font-semibold text-heading">
                    {t("form:form-title-create-product")}
                </h1>
            </div>
            <CreateOrUpdateProductForm />
        </>
    );
}

CreateProductPage.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => ({
    props: {
        ...(await serverSideTranslations(locale, ["form", "common"])),
    },
});
