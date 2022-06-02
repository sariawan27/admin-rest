import SelectInput from "@components/ui/select-input";
import Label from "@components/ui/label";
import { Control, useFormState, useWatch } from "react-hook-form";
import { useEffect } from "react";
import { useTagsQuery } from "@data/tag/use-tags.query";
import { useTranslation } from "next-i18next";
import { getAuthCredentials } from "@utils/auth-utils";
import Button from "@components/ui/button";
import { useModalAction } from "@components/ui/modal/modal.context";

interface Props {
  control: Control<any>;
  setValue: any;
}

const ProductTagInput = ({ control, setValue }: Props) => {
  const { userId } = getAuthCredentials()
  const { t } = useTranslation();
  const type = useWatch({
    control,
    name: "type",
  });
  const { dirtyFields } = useFormState({
    control,
  });
  useEffect(() => {
    if (type?.slug && dirtyFields?.type) {
      setValue("tags", []);
    }
  }, [type?.slug]);

  const { data, isLoading: loading } = useTagsQuery({
    limit: 15,
    userId: userId
  });

  const { openModal } = useModalAction();
  function handleAddCategory() {
    openModal("ADD_TAG");
  }

  return (
    <>
      <div className="flex flex-wrap my-5 sm:my-8">
        <div className="w-full sm:w-10/12 md:w-10/12 lg:w-10/12">
          <Label>{t("sidebar-nav-item-tags")}</Label>
          <SelectInput
            name="tags"
            isMulti
            control={control}
            getOptionLabel={(option: any) => option.tagName}
            getOptionValue={(option: any) => option.tagId}
            // @ts-ignore
            options={data?.tags?.data}
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

export default ProductTagInput;
