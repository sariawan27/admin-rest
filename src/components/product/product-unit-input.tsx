import SelectInput from "@components/ui/select-input";
import Label from "@components/ui/label";
import { Control, useFormState, useWatch } from "react-hook-form";
import { useEffect } from "react";
import { useCategoriesQuery } from "@data/category/use-categories.query";
import { useTranslation } from "next-i18next";
import { Product } from "@ts-types/generated";
import Button from "@components/ui/button";
import { useModalAction } from "@components/ui/modal/modal.context";
import { useUnitsQuery } from "@data/unit/use-units.query";

interface Props {
    control: Control<any>;
    setValue: any;
    initialValues: Product | undefined;
}

const ProductUnitInput = ({ control, setValue, initialValues }: Props) => {
    const { t } = useTranslation("common");
    // const type = useWatch({
    //   control,
    //   name: "type",
    // });
    // const { dirtyFields } = useFormState({
    //   control,
    // });
    // useEffect(() => {
    //   if (type?.slug && dirtyFields?.type) {
    //     setValue("categories", []);
    //   }
    // }, [type?.slug]);

    const { data, isLoading: loading } = useUnitsQuery({
        limit: 15,
    });

    const { openModal } = useModalAction();
    function handleAddUnit() {
        openModal("ADD_UNIT");
    }

    return (<>
        <div className="flex flex-wrap my-5 sm:my-8">
            <div className="w-full sm:w-10/12 md:w-10/12 lg:w-10/12">
                <Label>{t("form:input-label-units")}</Label>
                <SelectInput
                    name="units"
                    // isMulti
                    control={control}
                    getOptionLabel={(option: any) => option.productUnitName}
                    getOptionValue={(option: any) => option.productUnitId}
                    // @ts-ignore
                    options={data?.units?.data}
                    getValue={initialValues?.units}
                    isLoading={loading}
                />
            </div>
            <Button
                className="w-full sm:w-1/12 md:w-1/12 lg:w-1/12 ml-2 mt-6"
                onClick={handleAddUnit}
                type="button"
            >
                +
            </Button>
        </div>
    </>
    );
};

export default ProductUnitInput;
