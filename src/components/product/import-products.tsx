import { useTranslation } from "next-i18next";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import Button from "@components/ui/button";
import ImportCsv from "@components/ui/import-csv";
import { useShopQuery } from "@data/shop/use-shop.query";
import { useImportProductsMutation } from "@data/import/use-import-products.mutation";

import { FilePond, File, registerPlugin } from 'react-filepond';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';

import { useModalAction, useModalState } from "@components/ui/modal/modal.context";

export default function ImportProducts() {
  const { t } = useTranslation("common");
  const {
    query: { shop },
  } = useRouter();
  const { data: shopData } = useShopQuery(shop as string);
  const shopId = shopData?.shop?.id!;
  const { mutate: importProducts, isLoading: loading } =
    useImportProductsMutation();
  registerPlugin(FilePondPluginFileValidateType, FilePondPluginFileValidateSize);
  // const handleDrop = async (acceptedFiles: any) => {
  //   if (acceptedFiles.length) {
  //     importProducts({
  //       shop_id: shopId,
  //       csv: acceptedFiles[0],
  //     });
  //   }
  // };
  type FormValues = {}
  const [products, setProducts] = useState(null);
  console.log(products)
  const { closeModal } = useModalAction();
  const methods = useForm<FormValues>();
  const {
    handleSubmit,
    setError,
    formState: { errors },
  } = methods;

  const onSubmit = async () => {
    importProducts({
      shop_id: shopId,
      products: products,
    },
      {
        onSuccess: () => {
          closeModal()
        },
        onError: (error: any) => {
          Object.keys(error?.response?.data).forEach((field: any) => {
            setError(field, {
              type: "manual",
              message: error?.response?.data[field][0],
            });
          });
        },
      })
  }

  return (
    // <ImportCsv
    //   onDrop={handleDrop}
    //   loading={loading}
    //   title={t("text-import-products")}
    // />
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <FilePond
        files={products}
        onupdatefiles={fileItems => {
          setProducts(fileItems.map(fileItem => fileItem.file))
        }}
        name="files"
        allowFileTypeValidation
        acceptedFileTypes={['application/vnd.ms-excel', 'text/csv', 'application/csv']}
        allowFileSizeValidation
        maxFileSize={"1MB"}
      />

      <div className="mb-4 pt-4 text-end">
        <Button size="small" loading={loading}>
          Import
        </Button>
      </div>
    </form>
  );
}
