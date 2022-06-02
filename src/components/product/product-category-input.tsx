import SelectInput from "@components/ui/select-input";
import Label from "@components/ui/label";
import { Control, useFormState, useWatch } from "react-hook-form";
import { useEffect } from "react";
import { useCategoriesQuery } from "@data/category/use-categories.query";
import { useTranslation } from "next-i18next";
import { Product } from "@ts-types/generated";
import Button from "@components/ui/button";
import { useModalAction } from "@components/ui/modal/modal.context";
import { getAuthCredentials } from "@utils/auth-utils";

interface Props {
  control: Control<any>;
  setValue: any;
  initialValues: Product | undefined;
}

const ProductCategoryInput = ({ control, setValue, initialValues }: Props) => {
  const { userId } = getAuthCredentials()
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

  const { data, isLoading: loading } = useCategoriesQuery({
    limit: 15,
    userId: userId,
  });

  const { openModal } = useModalAction();
  function handleAddCategory() {
    openModal("ADD_CATEGORY");
  }

  return (<>
    <div className="flex flex-wrap my-5 sm:my-8">
      <div className="w-full sm:w-10/12 md:w-10/12 lg:w-10/12">
        <Label>{t("form:input-label-categories")}</Label>
        <SelectInput
          name="categories"
          isMulti
          control={control}
          getOptionLabel={(option: any) => option.productCategoryName}
          getOptionValue={(option: any) => option.productCategoryId}
          // @ts-ignore
          options={data?.categories?.data.filter(c => c.isDeleted === 0)}
          getValue={initialValues?.categories}
          isLoading={loading}
        />
      </div>
      <Button
        className="w-full sm:w-1/12 md:w-1/12 lg:w-1/12 ml-2 mt-6"
        onClick={handleAddCategory}
        type="button"
      >
        +
      </Button>
    </div>
  </>
  );
};

export default ProductCategoryInput;
