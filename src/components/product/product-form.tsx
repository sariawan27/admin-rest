import Input from "@components/ui/input";
import TextArea from "@components/ui/text-area";
import { useForm, FormProvider } from "react-hook-form";
import Button from "@components/ui/button";
import Description from "@components/ui/description";
import Card from "@components/common/card";
import Label from "@components/ui/label";
import Radio from "@components/ui/radio/radio";
import cn from "classnames";
import { useRouter } from "next/router";
import { yupResolver } from "@hookform/resolvers/yup";
import FileInput from "@components/ui/file-input";
import { productValidationSchema } from "./product-validation-schema";
import groupBy from "lodash/groupBy";
import ProductVariableForm from "./product-variable-form";
import ProductSimpleForm from "./product-simple-form";
import ProductGroupInput from "./product-group-input";
import NumberFormat from "react-number-format";
import ProductCategoryInput from "./product-category-input";
import ProductUnitInput from "./product-unit-input";
import orderBy from "lodash/orderBy";
import sum from "lodash/sum";
import cloneDeep from "lodash/cloneDeep";

import {
  Type,
  ProductType,
  Category,
  Unit,
  AttachmentInput,
  ProductStatus,
  Product,
  VariationOption,
  Tag,
  ProductDiscount,
} from "@ts-types/generated";

import { useCreateProductMutation } from "@data/product/product-create.mutation";
import { useTranslation } from "next-i18next";
import { useUpdateProductMutation } from "@data/product/product-update.mutation";
import { useShopQuery } from "@data/shop/use-shop.query";
import ProductTagInput from "./product-tag-input";
import Alert from "@components/ui/alert";
import { useEffect, useState, useRef, useCallback } from "react";
import { animateScroll } from "react-scroll";
import { getAuthCredentials } from "@utils/auth-utils";
import { CloseIcon } from "@components/icons/close-icon";
import NumberInput from "@components/ui/number-input";
import Checkbox from "@components/ui/checkbox/checkbox";

import { FilePond, File, registerPlugin } from 'react-filepond'
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import FilePondPluginImageCrop from 'filepond-plugin-image-crop';
import FilePondPluginImageTranform from 'filepond-plugin-image-transform';
import FilePondPluginImageEdit from 'filepond-plugin-image-edit';
import ReactCrop from "react-image-crop";
import { useModalAction } from "@components/ui/modal/modal.context";
import { resolve } from "url";
import getStorageUrl from "@utils/getStorageUrl";

type Variation = {
  formName: number;
};

type FormValues = {
  productUserId: string;
  isVariantPrice: boolean;
  productSku: string;
  productName: string;
  type: Type;
  product_type: ProductType;
  productDescription: string;
  productPrice: number;
  min_price: number;
  max_price: number;
  sale_price: number;
  quantity: number;
  categories: Category[];
  units: Unit[];
  tags: Tag[];
  in_stock: boolean;
  is_taxable: boolean;
  image: AttachmentInput;
  gallery: AttachmentInput[];
  status: ProductStatus;
  width: string;
  height: string;
  length: string;
  isVariation: boolean;
  isDiscount: boolean;
  variations: Variation[];
  discount: ProductDiscount;
  variation_options: Product["variation_options"];
  [key: string]: any;
};

const { userId } = getAuthCredentials();
const defaultValues = {
  productUserId: userId,
  sku: "",
  name: "",
  type: "",
  productTypeValue: { name: "Simple Product", value: ProductType.Simple },
  description: "",
  unit: "",
  price: "",
  min_price: 0.0,
  max_price: 0.0,
  sale_price: "",
  quantity: "",
  productCategory: [],
  tags: [],
  in_stock: true,
  is_taxable: false,
  image: [],
  gallery: [],
  status: ProductStatus.Publish,
  width: "",
  height: "",
  length: "",
  isVariation: false,
  isDiscount: false,
  isVariantPrice: false,
  variations: [],
  variation_options: [],
  discount: "",
};

type IProps = {
  initialValues?: Product | null;
};

const productType = [
  { name: "Simple Product", value: ProductType.Simple },
  { name: "Variable Product", value: ProductType.Variable },
];
function getFormattedVariations(variations: any) {
  const variationGroup = groupBy(variations, "attribute.slug");
  return Object.values(variationGroup)?.map((vg) => {
    return {
      attribute: vg?.[0]?.attribute,
      value: vg?.map((v) => ({ id: v.id, value: v.value })),
    };
  });
}

function processOptions(options: any) {
  try {
    return JSON.parse(options);
  } catch (error) {
    return options;
  }
}

function calculateMaxMinPrice(variationOptions: any) {
  if (!variationOptions || !variationOptions.length) {
    return {
      min_price: null,
      max_price: null,
    };
  }
  const sortedVariationsByPrice = orderBy(variationOptions, ["price"]);
  const sortedVariationsBySalePrice = orderBy(variationOptions, ["sale_price"]);
  return {
    min_price:
      sortedVariationsBySalePrice?.[0].sale_price <
        sortedVariationsByPrice?.[0]?.price
        ? Number(sortedVariationsBySalePrice?.[0].sale_price)
        : Number(sortedVariationsByPrice?.[0]?.price),
    max_price: Number(
      sortedVariationsByPrice?.[sortedVariationsByPrice?.length - 1]?.price
    ),
  };
}

function calculateQuantity(variationOptions: any) {
  return sum(
    variationOptions?.map(({ quantity }: { quantity: number }) => quantity)
  );
}

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview, FilePondPluginImageCrop, FilePondPluginImageTranform, FilePondPluginImageEdit)

export default function CreateOrUpdateProductForm({ initialValues }: IProps) {
  const router = useRouter();
  const [productQuantity, setProductQuantity] = useState(0);
  const [productPrice, setProductPrice] = useState(0);
  const [productPrices, setProductPrices] = useState([
    { prodbasVariantPriceMinQty: 1, prodbasVariantPricePrice: 0, readOnly: true },
  ]);
  const [productDiscount, setProductDiscount] = useState([
    { prodbasDiscountMinPurchase: 0, prodbasDiscountPercent: 0, prodbasDiscountAmount: 0, isDeleted: 0 },
  ]);

  const [thumbnail, setThumbnail] = useState([])
  const [gallery, setGallery] = useState([])
  const [thumbnailOld, setThumbnailOld] = useState(null)
  const [galleryOld, setGalleryOld] = useState([])

  const [upImg, setUpImg] = useState();
  const imgRef = useRef(null);
  const previewCanvasRef = useRef(null);
  const [crop, setCrop] = useState({ unit: '%', width: 30, aspect: 1 / 1 });
  const [completedCrop, setCompletedCrop] = useState(null);
  const [croppedImageUrl, setCroppedImageUrl] = useState(null);

  const idFormatter = new Intl.NumberFormat('id-ID')

  const handleAddFieldOfVariantPrices = () => {
    setProductPrices(
      productPrices.concat({
        prodbasVariantPriceId: null,
        prodbasVariantPriceMinQty: 0,
        prodbasVariantPricePrice: 0,
        readOnly: false,
        isDeleted: 0
      })
    )
  }

  const handleRemoveFieldOfVariantPrices = (index) => {
    if (!initialValues) {
      setProductPrices(
        productPrices.filter((item, itemIndex) => {
          return index !== itemIndex
        })
      )
    } else {
      const values = [...productPrices]
      values[index]['isDeleted'] = 1
      setProductPrices(values)

      productPrices[index].prodbasVariantPriceId === null ?
        setProductPrices(
          productPrices.filter((item) => {
            return item.prodbasVariantPriceId !== null || item.isDeleted !== 1
          })
        ) : null
    }
  }

  const handleAddFieldOfDiscounts = () => {
    setProductDiscount(
      productDiscount.concat({
        prodbasDiscountId: null,
        prodbasDiscountMinPurchase: 0,
        prodbasDiscountPercent: 0,
        prodbasDiscountAmount: 0,
        isDeleted: 0
      })
    )
  }
  const handleRemoveFieldOfDiscounts = (index) => {
    if (!initialValues) {
      setProductDiscount(
        productDiscount.filter((item, itemIndex) => {
          return index !== itemIndex
        })
      )
    } else {
      const values = [...productDiscount]
      values[index]['isDeleted'] = 1
      setProductDiscount(values)

      productDiscount[index].prodbasDiscountId === null ?
        setProductDiscount(
          productDiscount.filter((item) => {
            return item.prodbasDiscountId !== null || item.isDeleted !== 1
          })
        ) : null
    }

  }

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { t } = useTranslation();
  const { data: shopData } = useShopQuery(router.query.shop as string, {
    enabled: !!router.query.shop,
  });
  const shopId = shopData?.shop?.id!;
  const methods = useForm<FormValues>({
    resolver: yupResolver(productValidationSchema),
    //@ts-ignore
    defaultValues: initialValues
      ? cloneDeep({
        ...initialValues,
        isVariation:
          initialValues.variations?.length &&
            initialValues.variation_options?.length
            ? true
            : false,
        productTypeValue: initialValues.product_type
          ? productType.find(
            (type) => initialValues.product_type === type.value
          )
          : productType[0],
        variations: getFormattedVariations(initialValues?.variations),
        productUserId: userId,
        discount: initialValues?.discount,
        productDescription: initialValues?.productDesc,
        productPrice: initialValues?.productPrice,
        isDiscount: initialValues?.basic_discount.length ? true : false,
        isVariantPrice: initialValues?.basic_prices.length ? true : false,
        categories: initialValues?.product_categories,
        tags: initialValues?.product_tags,
        units: initialValues?.product_unit,
      })
      : defaultValues,
  });
  const {
    register,
    handleSubmit,
    control,
    setValue,
    setError,
    watch,
    formState: { errors },
  } = methods;

  const { mutate: createProduct, isLoading: creating } =
    useCreateProductMutation();
  const { mutate: updateProduct, isLoading: updating } =
    useUpdateProductMutation();

  const onSubmit = async (values: FormValues) => {
    const { type } = values;
    const formData = new FormData();
    formData.append("productSku", values?.productSku);
    formData.append("productName", values?.productName);
    formData.append("productDesc", values?.productDescription);
    formData.append("productCategories", JSON.stringify(values?.categories));
    formData.append("productTags", JSON.stringify(values?.tags));
    formData.append("productProductUnitId", values?.units?.productUnitId!);
    formData.append("productUserId", values?.productUserId);
    formData.append("isVariantPrice", values?.isVariantPrice);
    formData.append("productPrice", productPrice);
    formData.append("productPrices", JSON.stringify(productPrices));
    formData.append("isDiscount", values?.isDiscount);
    formData.append("productDiscount", JSON.stringify(productDiscount));
    formData.append("productStock", productQuantity);
    // formData.append("thumbnail", blobT);
    thumbnail?.forEach((t: any) => {
      formData.append("thumbnail[]", t);
    });
    gallery?.forEach((g: any) => {
      formData.append("gallery[]", g);
    });
    formData.append("thumbnailOld", JSON.stringify(thumbnailOld));
    formData.append("galleryOld", JSON.stringify(galleryOld));

    const inputValues: any = {
      productDesc: values.productDescription,
      // height: values.height,
      // length: values.length,
      productName: values.productName,
      productSku: values.productSku,
      productCategories: values?.categories,
      productProductUnitId: values?.units?.productUnitId!,
      productUserId: values?.productUserId,
      isVariantPrice: values?.isVariantPrice,
      productPrice: productPrice,
      productPrices: productPrices,
      isDiscount: values?.isDiscount,
      productDiscount: productDiscount,
      productStock: productQuantity,
      // files: files,
      // status: values.status,
      // unit: values.unit,
      // width: values.width,
      // quantity:
      //   values?.productTypeValue?.value === ProductType.Simple
      //     ? values?.quantity
      //     : calculateQuantity(values?.variation_options),
      // product_type: values.productTypeValue?.value,
      // type_id: type?.id,
      // ...(initialValues
      //   ? { shop_id: initialValues?.shop_id }
      //   : { shop_id: Number(shopId) }),
      // price: Number(values.price),
      // sale_price: values.sale_price ? Number(values.sale_price) : null,
      // tags: values?.tags?.map(({ id }: any) => id),
      // image: {
      //   thumbnail: values?.image?.thumbnail,
      //   original: values?.image?.original,
      //   id: values?.image?.id,
      // },
      // gallery: values.gallery?.map(({ thumbnail, original, id }: any) => ({
      //   thumbnail,
      //   original,
      //   id,
      // })),
      // ...(productTypeValue?.value === ProductType.Variable && {
      //   variations: values?.variations?.flatMap(({ value }: any) =>
      //     value?.map(({ id }: any) => ({ attribute_value_id: id }))
      //   ),
      // }),
      // ...(productTypeValue?.value === ProductType.Variable
      //   ? {
      //     variation_options: {
      //       upsert: values?.variation_options?.map(
      //         ({ options, ...rest }: any) => ({
      //           ...rest,
      //           options: processOptions(options).map(
      //             ({ name, value }: VariationOption) => ({
      //               name,
      //               value,
      //             })
      //           ),
      //         })
      //       ),
      //       delete: initialValues?.variation_options
      //         ?.map((initialVariationOption) => {
      //           const find = values?.variation_options?.find(
      //             (variationOption) =>
      //               variationOption?.id === initialVariationOption?.id
      //           );
      //           if (!find) {
      //             return initialVariationOption?.id;
      //           }
      //         })
      //         .filter((item) => item !== undefined),
      //     },
      //   }
      //   : {
      //     variations: [],
      //     variation_options: {
      //       upsert: [],
      //       delete: initialValues?.variation_options?.map(
      //         (variation) => variation?.id
      //       ),
      //     },
      //   }),
      // ...calculateMaxMinPrice(values?.variation_options),
    };

    if (initialValues) {
      updateProduct(
        {
          variables: {
            productId: initialValues.productId,
            formData: formData,
            // input: inputValues,
          },
        },
        {
          onError: (error: any) => {
            Object.keys(error?.response?.data).forEach((field: any) => {
              setError(field, {
                type: "manual",
                message: error?.response?.data[field][0],
              });
            });
          },
        }
      );
    } else {
      createProduct(
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
  };
  const productTypeValue = watch("productTypeValue");
  const isVariantPrice = watch("isVariantPrice");
  const isDiscount = watch("isDiscount");
  const productPriceBasic = watch("productPriceBasic");
  const discount = watch("basic_discount");
  const prices = watch("basic_prices");
  const images = watch("image");
  const categories = watch("categories");

  const editor = {
    // Called by FilePond to edit the image
    // - should open your image editor
    // - receives file object and image edit instructions
    open: (file, instructions) => {
      // open editor here
      setUpImg(URL.createObjectURL(file))
      // const reader = new FileReader();
      // reader.addEventListener("load", () => setUpImg(reader.result));
      // reader.readAsDataURL(file);
    },

    // Callback set by FilePond
    // - should be called by the editor when user confirms editing
    // - should receive output object, resulting edit information
    onconfirm: (output) => {
    },

    // Callback set by FilePond
    // - should be called by the editor when user cancels editing
    oncancel: () => {
      setUpImg(null);
      setCroppedImageUrl(null);
    },

    // Callback set by FilePond
    // - should be called by the editor when user closes the editor
    onclose: () => {
      setUpImg(null);
      setCroppedImageUrl(null);
    },
  };

  // console.log(upImg);
  const onSelectFile = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => setUpImg(reader.result));
      reader.readAsDataURL(e.target.files[0]);
    }
  };
  const onLoad = useCallback((img) => {
    imgRef.current = img;
  }, []);
  const onCropChange = (crop, percentCrop) => {
    // You could also use percentCrop:
    // this.setState({ crop: percentCrop });
    setCrop(crop)
  };

  // const onCropComplete = crop => {
  //   makeClientCrop(crop);
  // };

  // const onCropChange = (crop, percentCrop) => {
  //   // You could also use percentCrop:
  //   // this.setState({ crop: percentCrop });
  //   setCrop;
  // };

  // const makeClientCrop = async (crop) => {
  //   if (imageRef && crop.width && crop.height) {
  //     const croppedImageUrl = await getCroppedImg(
  //       imageRef,
  //       crop,
  //       "newFile.jpeg"
  //     );
  //     setCroppedImageUrl;
  //   }
  // }

  // const getCroppedImg = (image, crop, fileName) => {
  //   const canvas = previewCanvasRef.current;
  //   const scaleX = image.naturalWidth / image.width;
  //   const scaleY = image.naturalHeight / image.height;

  //   const context = canvas.getContext('2d');
  //   if (ctx) {
  //     ctx.drawImage(
  //       image,
  //       crop.x * scaleX,
  //       crop.y * scaleY,
  //       crop.width * scaleX,
  //       crop.height * scaleY,
  //       0,
  //       0,
  //       crop.width,
  //       crop.height
  //     );
  //   }

  //   return new Promise((resolve, reject) => {
  //     canvas.toBlob(blob => {
  //       if (!blob) {
  //         //reject(new Error('Canvas is empty'));
  //         console.error("Canvas is empty");
  //         return;
  //       }
  //       blob.name = fileName;
  //       window.URL.revokeObjectURL(fileUrl);
  //       fileUrl = window.URL.createObjectURL(blob);
  //       resolve(fileUrl);
  //     }, "image/jpeg");
  //   });
  // }

  const onCropComplete = (crop) => {
    makeClientCrop(crop);
  };

  const makeClientCrop = async (crop) => {
    const t = await generateDownload(previewCanvasRef.current, crop, 'hello.jpeg');
    setCroppedImageUrl(t);
  }

  function generateDownload(canvas, crop, fileName) {
    if (!crop || !canvas) {
      return;
    }
    // if (!completedCrop || !previewCanvasRef.current || !imgRef.current) {
    //   return;
    // }

    const image = imgRef.current;
    // const canvas = previewCanvasRef.current;
    // const crop = completedCrop;
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d");
    const pixelRatio = window.devicePixelRatio;

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = 'high';

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          //reject(new Error('Canvas is empty'));
          console.error("Canvas is empty");
          return;
        }

        blob.name = fileName;
        window.URL.revokeObjectURL(fileUrl);
        const fileUrl = window.URL.createObjectURL(blob);

        resolve(fileUrl);
      },
        'image/jpeg',
        1
      );
    });
  }

  const handleSubmitImage = () => {
    // const t = await generateDownload(previewCanvasRef.current, completedCrop, 'hello.jpg');
    // setCompletedCrop(t)
    setThumbnail(croppedImageUrl)
    setUpImg(null)
    setCroppedImageUrl(null)
  };
  const handleCancel = () => {
    setUpImg(null)
    setCroppedImageUrl(null)
  };
  const handleDeleteGalleryOld = (index) => {
    const values = [...galleryOld]
    values[index]['isDeleted'] = 1
    setGalleryOld(values)
  }
  const previewGallery = galleryOld.map((gallery, idx) => (
    <>
      {galleryOld[idx].isDeleted != 1 ? (
        <>
          <div
            className="inline-flex flex-col overflow-hidden border border-border-200 rounded mt-2 me-2 relative"
            key={idx}
          >
            <div className="flex items-center justify-center min-w-0 w-16 h-16 overflow-hidden">
              <img src={getStorageUrl + gallery.productImagePath} />
            </div>
            <button
              className="w-4 h-4 flex items-center justify-center rounded-full bg-red-600 text-xs text-light absolute top-1 end-1 shadow-xl outline-none"
              onClick={() => handleDeleteGalleryOld(idx)}
              type="button"
            >
              <CloseIcon width={10} height={10} />
            </button>
          </div>
        </>) : "removed"
      }
    </>
  ))

  useEffect(() => {
    setProductPrice(productPriceBasic);
    setProductPrices(initialValues ? prices : [
      { prodbasVariantPriceMinQty: 1, prodbasVariantPricePrice: 0, readOnly: true },
    ]);
    setProductDiscount(initialValues ? discount : [
      { prodbasDiscountMinPurchase: 0, prodbasDiscountPercent: 0, prodbasDiscountAmount: 0, isDeleted: 0 },
    ]);
    setProductQuantity(initialValues ? initialValues?.stock ? initialValues?.stock.productStockLast : null : null)
    setThumbnailOld(initialValues ? initialValues?.images.filter((img) => { return img.productImageType == 0 }) : null)
    setGalleryOld(initialValues ? initialValues?.images.filter((img) => { return img.productImageType == 1 }).map(img => { return { ...img, isDeleted: 0 } }) : [])
    // setThumbnailOld(initialValues ? initialValues?.images : null)
    // if (!completedCrop || !previewCanvasRef.current || !imgRef.current) {
    //   return;
    // }

    // const image = imgRef.current;
    // const canvas = previewCanvasRef.current;
    // const crop = completedCrop;

    // const scaleX = image.naturalWidth / image.width;
    // const scaleY = image.naturalHeight / image.height;
    // const ctx = canvas.getContext('2d');

    // canvas.width = crop.width * pixelRatio * scaleX;
    // canvas.height = crop.height * pixelRatio * scaleY;


    // const scaleX = image.naturalWidth / image.width;
    // const scaleY = image.naturalHeight / image.height;
    // canvas.width = crop.width;
    // canvas.height = crop.height;
    // const ctx = canvas.getContext("2d");
    // const pixelRatio = window.devicePixelRatio;

    // ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    // ctx.imageSmoothingQuality = 'high';

    // ctx.drawImage(
    //   image,
    //   crop.x * scaleX,
    //   crop.y * scaleY,
    //   crop.width * scaleX,
    //   crop.height * scaleY,
    //   0,
    //   0,
    //   crop.width,
    //   crop.height
    // );
    // ctx.drawImage(
    //   image,
    //   crop.x * scaleX,
    //   crop.y * scaleY,
    //   crop.width * scaleX,
    //   crop.height * scaleY,
    //   0,
    //   0,
    //   crop.width * scaleX,
    //   crop.height * scaleY
    // );
  }, [completedCrop]);

  return (
    <>
      {errorMessage ? (
        <Alert
          message={t(`common:${errorMessage}`)}
          variant="error"
          closeable={true}
          className="mt-5"
          onClose={() => setErrorMessage(null)}
        />
      ) : null}
      <FormProvider {...methods}>{console.log(initialValues)}
        <form onSubmit={handleSubmit(onSubmit)} noValidate>{console.log(galleryOld)}
          <div className="flex flex-wrap pb-8 border-b border-dashed border-border-base my-5 sm:my-8">
            <Description
              title={t("form:displayed-image-title")}
              details={t("form:displayed-image-help-text")}
              className="w-full px-0 sm:pe-4 md:pe-5 pb-5 sm:w-4/12 md:w-1/3 sm:py-8"
            />
            <Card className="w-full sm:w-8/12 md:w-2/3">
              <FilePond
                files={thumbnail}
                onupdatefiles={fileItems => {
                  setThumbnail(fileItems.map(fileItem => fileItem.file))
                }}
                imageEditEditor={editor}
                beforeRemoveFile={() => {
                  setCroppedImageUrl(null);
                }}
                name="files"
                labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
              />
              <div>
                {upImg ? (<>
                  <ReactCrop
                    src={upImg}
                    ruleOfThirds
                    onImageLoaded={(c) => { onLoad(c) }}
                    crop={crop}
                    onChange={(c) => onCropChange(c)}
                    onComplete={(c) => {
                      setCompletedCrop(c)
                      onCropComplete(c);
                    }}
                  />
                  <canvas
                    ref={previewCanvasRef}
                    // Rounding is important so the canvas width and height matches/is a multiple for sharpness.
                    style={{
                      width: Math.round(crop?.width ?? 0),
                      height: Math.round(crop?.height ?? 0),
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleSubmitImage}>
                    Submit
                  </button>
                  <button type="button" onClick={handleCancel} className="ml-2">
                    Cancel
                  </button></>) : null}
              </div>
              {/* <FileInput name="image" control={control} multiple={false} /> */}
            </Card>
          </div>

          <div className="flex flex-wrap pb-8 border-b border-dashed border-border-base my-5 sm:my-8">
            <Description
              title={t("form:gallery-title")}
              details={t("form:gallery-help-text")}
              className="w-full px-0 sm:pe-4 md:pe-5 pb-5 sm:w-4/12 md:w-1/3 sm:py-8"
            />
            <Card className="w-full sm:w-8/12 md:w-2/3">
              <FilePond
                files={gallery}
                onupdatefiles={fileItems => {
                  setGallery(fileItems.map(fileItem => fileItem.file))
                }}
                allowMultiple={true}
                maxFiles={previewGallery.length + +gallery.length >= 4 ? 1 : 5}
                // disabled={previewGallery.length + +gallery.length >= 5 ? true : false}
                name="files"
                labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
              />
              {(!!previewGallery.length) && (
                <aside className="flex flex-wrap mt-2">
                  {!!previewGallery.length && previewGallery}
                </aside>
              )}
              {/* <FileInput name="gallery" control={control} /> */}
            </Card>
          </div>

          {/* <div className="flex flex-wrap pb-8 border-b border-dashed border-border-base my-5 sm:my-8">
            <Description
              title={t("form:type-and-category")}
              details={t("form:type-and-category-help-text")}
              className="w-full px-0 sm:pe-4 md:pe-5 pb-5 sm:w-4/12 md:w-1/3 sm:py-8"
            />

            <Card className="w-full sm:w-8/12 md:w-2/3">
              <ProductGroupInput
                control={control}
                error={t((errors?.type as any)?.message)}
              />
              <ProductTagInput control={control} setValue={setValue} />
            </Card>
          </div> */}

          <div className="flex flex-wrap pb-8 border-b border-dashed border-border-base my-5 sm:my-8">
            <Description
              title={t("form:item-description")}
              details={`${initialValues
                ? t("form:item-description-edit")
                : t("form:item-description-add")
                } ${t("form:product-description-help-text")}`}
              className="w-full px-0 sm:pe-4 md:pe-5 pb-5 sm:w-4/12 md:w-1/3 sm:py-8"
            />

            <Card className="w-full sm:w-8/12 md:w-2/3">
              <ProductCategoryInput control={control} setValue={setValue} initialValues={initialValues} />
              <ProductTagInput control={control} setValue={setValue} initialValues={initialValues} />
              <Input
                {...register("productUserId")}
                error={t(errors.productUserId?.message!)}
                variant="outline"
                type="hidden"
                className="mb-5"
              />
              <Input
                label={`${t("form:input-label-sku")}`}
                {...register("productSku")}
                error={t(errors.sku?.message!)}
                variant="outline"
                className="mb-5"
              />
              <Input
                label={`${t("form:input-label-name")}*`}
                {...register("productName")}
                error={t(errors.name?.message!)}
                variant="outline"
                className="mb-5"
              />
              <NumberFormat
                customInput={NumberInput}
                variant="outline"
                label={t("form:input-label-quantity")}
                thousandSeparator="."
                decimalSeparator=","
                allowNegative={false}
                allowLeadingZeros={false}
                value={productQuantity}
                isAllowed={(values) => {
                  const { value } = values
                  return +value < 1000000;
                }}
                onValueChange={({ value }) => {
                  setProductQuantity(value)
                }}
                className="mb-5"
              />
              <ProductUnitInput control={control} setValue={setValue} initialValues={initialValues} />
              <TextArea
                label={t("form:input-label-description")}
                {...register("productDescription")}
                error={t(errors.description?.message!)}
                variant="outline"
                className="mb-5"
              />

              {/* <div>
                <Label>{t("form:input-label-status")}</Label>
                <Radio
                  {...register("status")}
                  label={t("form:input-label-published")}
                  id="published"
                  value="publish"
                  className="mb-2"
                />
                <Radio
                  {...register("status")}
                  id="draft"
                  label={t("form:input-label-draft")}
                  value="draft"
                />
              </div> */}
            </Card>
          </div>
          <div className="flex flex-wrap my-5 sm:my-8">
            <Description
              title={t("form:item-product-price")}
              details={`${initialValues
                ? t("form:item-description-edit")
                : t("form:item-description-add")
                } ${t("form:product-product-price-help-text")}`}
              className="w-full px-0 sm:pe-4 md:pe-5 pb-5 sm:w-4/12 md:w-1/3 sm:py-8"
            />

            <Card className="w-full sm:w-8/12 md:w-2/3">
              {isVariantPrice ? (
                <>
                  {productPrices.map((pp, index) => (
                    <>
                      {productPrices[index].isDeleted !== 1 ? (
                        <div className="flex flex-wrap my-5 sm:my-8">
                          <NumberFormat
                            customInput={NumberInput}
                            variant="outline"
                            label={t("form:input-label-min-quantity")}
                            thousandSeparator="."
                            decimalSeparator=","
                            allowNegative={false}
                            allowLeadingZeros={false}
                            disabled={pp?.prodbasVariantPriceMinQty === 1 ? true : false}
                            value={pp?.prodbasVariantPriceMinQty}
                            onValueChange={({ value }) => {
                              const values = [...productPrices]
                              values[index]['prodbasVariantPriceMinQty'] = +value
                              setProductPrices(values)
                            }}
                            className="w-1/6"
                          />
                          <NumberFormat
                            customInput={NumberInput}
                            variant="outline"
                            label={t("form:input-label-price")}
                            thousandSeparator="."
                            decimalSeparator=","
                            allowNegative={false}
                            allowLeadingZeros={false}
                            prefix={'Rp. '}
                            value={pp?.prodbasVariantPricePrice}
                            onValueChange={({ value }) => {
                              const values = [...productPrices]
                              values[index]['prodbasVariantPricePrice'] = value
                              setProductPrices(values)
                            }
                            }
                            className="w-4/6 pl-2"
                          />
                          {pp?.prodbasVariantPriceMinQty === 1 ? null : (
                            <Button
                              onClick={() => handleRemoveFieldOfVariantPrices(index)}
                              type="button"
                              variant="custom"
                              className="mt-6 w-1/6 text-red-500 outline-none focus:text-red-700 hover:text-red-700 focus:ring-opacity-0 focus:bg-transparent focus:shadow-none"
                            >
                              <CloseIcon className="w-5 h-5" />
                            </Button>
                          )
                          }
                        </div>) : (<div>variant price is deleted</div>)}
                    </>
                  )
                  )
                  }
                  <Button size="small"
                    onClick={() => handleAddFieldOfVariantPrices()}
                    type="button">+</Button>
                </>) : (
                <>
                  <NumberFormat
                    customInput={NumberInput}
                    variant="outline"
                    label={t("form:input-label-price")}
                    thousandSeparator="."
                    decimalSeparator=","
                    allowNegative={false}
                    allowLeadingZeros={false}
                    prefix={'Rp. '}
                    value={productPrice}
                    onValueChange={({ value }) => setProductPrice(value)}
                    className="mb-5"
                  />
                </>
              )
              }
              {initialValues ? null : (
                <div className="flex flex-wrap my-5 sm:my-8">
                  <Checkbox
                    {...register("isVariantPrice")}
                    error={t(errors.isSupplier?.message!)}
                    label={t("form:input-label-variant-price")}
                    className="mr-2"
                  />
                  <Checkbox
                    {...register("isDiscount")}
                    error={t(errors.isSupplier?.message!)}
                    label={t("form:input-label-discount")}
                  />
                </div>)}
              {/* <div
                className={cn("w-full flex items-center relative", "normal")}
              >
                <NumberFormat
                  customInput={() =>
                    <NumberInput variant="outline"
                      label={`${t("form:input-label-sku")}`}
                      className="mb-6 w-full"
                      error={t(errors.sku?.message!)} />}
                  thousandSeparator="."
                  decimalSeparator=","
                  allowNegative={false}
                  allowLeadingZeros={false}
                  value={productPrice}
                  onValueChange={({ value }) => setProductPrice(value)}
                  className="text-right" />
                <span className="outline-none absolute end-1 focus:outline-none active:outline-none p-2 text-body">
                  %</span>
              </div> */}
            </Card>
          </div>
          {isDiscount ? (
            <div className="flex flex-wrap my-5 sm:my-8">
              <Description
                title={t("form:item-product-discount")}
                details={initialValues ? t("form:change-product-product-discount-price-help-text") : t("form:add-product-product-discount-price-help-text")}
                className="w-full px-0 sm:pe-4 md:pe-5 pb-5 sm:w-4/12 md:w-1/3 sm:py-8"
              />
              <Card className="w-full sm:w-8/12 md:w-2/3">
                {productDiscount.map((pd, index) => (
                  <>
                    {productDiscount[index].isDeleted !== 1 ? (
                      <div className="flex flex-wrap my-5 sm:my-8">
                        <NumberFormat
                          customInput={NumberInput}
                          variant="outline"
                          label={t("form:input-label-min-quantity")}
                          thousandSeparator="."
                          decimalSeparator=","
                          allowNegative={false}
                          allowLeadingZeros={false}
                          value={pd?.prodbasDiscountMinPurchase}
                          onValueChange={({ value }) => {
                            const values = [...productDiscount]
                            values[index]['prodbasDiscountMinPurchase'] = +value ? +value : null
                            setProductDiscount(values)
                          }
                          }
                          className="lg:w-2/12 md:w-2/12 sm:w-2/12 w-full"
                        />
                        <div
                          className="lg:w-2/12 md:w-2/12 sm:w-2/12 w-full flex items-center relative lg:pl-1 md:pl-1 sm:pl-1"
                        >
                          <NumberFormat
                            label={t("form:input-label-discount-percent")}
                            customInput={NumberInput}
                            variant="outline"
                            decimalSeparator="."
                            allowNegative={false}
                            // allowLeadingZeros={false}
                            value={pd?.prodbasDiscountPercent}
                            isAllowed={(values) => {
                              const { value } = values;

                              return +value <= 100
                            }}
                            onValueChange={({ value }) => {
                              const values = [...productDiscount]
                              values[index]['prodbasDiscountPercent'] = +value ? +value : null
                              setProductDiscount(values)
                            }}
                            className="w-full" />
                          <span className="outline-none absolute end-1 focus:outline-none active:outline-none p-2 pt-8 md:pt-8 sm:pt-12 text-body">
                            %</span>
                        </div>
                        {/* <NumberFormat
                    customInput={NumberInput}
                    variant="outline"
                    label={t("form:input-label-min-quantity")}
                    thousandSeparator="."
                    decimalSeparator=","
                    allowNegative={false}
                    allowLeadingZeros={false}
                    // disabled={pp?.readOnly}
                    // value={pp?.prodprice_min_quantity}
                    // onValueChange={({ value }) => {
                    //   const values = [...productPrices]
                    //   values[index]['prodprice_min_quantity'] = value
                    //   setProductPrices(values)
                    // }}
                    className="w-1/6"
                      /> */}
                        <NumberFormat
                          customInput={NumberInput}
                          variant="outline"
                          label={t("form:input-label-discount-amount")}
                          thousandSeparator="."
                          decimalSeparator=","
                          allowNegative={false}
                          allowLeadingZeros={false}
                          disabled={true}
                          prefix={'Rp '}
                          decimalScale={2}
                          value={productDiscount[index]?.prodbasDiscountMinPurchase * (isVariantPrice ? productPrices[0].prodbasVariantPricePrice : productPrice) * (productDiscount[index]?.prodbasDiscountPercent / 100)}
                          onValueChange={({ value }) => {
                            const values = [...productDiscount]
                            values[index]['prodbasDiscountAmount'] = +value
                            setProductDiscount(values)
                          }
                          }
                          className="lg:w-6/12 md:w-6/12 sm:w-6/12 w-full lg:pl-1 md:pl-1 sm:pl-1"
                        />
                        <Button
                          onClick={() => handleRemoveFieldOfDiscounts(index)}
                          type="button"
                          variant="custom"
                          className="mt-6 lg:w-2/12 md:w-2/12 sm:w-2/12 w-full text-red-500 outline-none focus:text-red-700 hover:text-red-700 focus:ring-opacity-0 focus:bg-transparent focus:shadow-none"
                        >
                          <CloseIcon className="w-5 h-5" />
                        </Button>
                      </div>) : (<div>discount is deleted</div>)}
                  </>))}

                <Button
                  className="mt-3"
                  size="small"
                  onClick={() => handleAddFieldOfDiscounts()}
                  type="button">+</Button>
              </Card>
            </div>
          ) : null}

          {/* <div className="flex flex-wrap pb-8 border-b border-dashed border-border-base my-5 sm:my-8">
            <Description
              title={t("form:form-title-product-type")}
              details={t("form:form-description-product-type")}
              className="w-full px-0 sm:pr-4 md:pr-5 pb-5 sm:w-4/12 md:w-1/3 sm:py-8"
            />

            <ProductTypeInput />
          </div> */}

          {/* Simple Type */}
          {/* {productTypeValue?.value === ProductType.Simple && (
            <ProductSimpleForm initialValues={initialValues} />
          )} */}

          {/* Variation Type */}
          {/* {productTypeValue?.value === ProductType.Variable && (
            <ProductVariableForm
              shopId={shopId}
              initialValues={initialValues}
            />
          )} */}

          <div className="mb-4 text-end">
            {initialValues && (
              <Button
                variant="outline"
                onClick={router.back}
                className="me-4"
                type="button"
              >
                {t("form:button-label-back")}
              </Button>
            )}
            <Button loading={updating || creating}>
              {initialValues
                ? t("form:button-label-update-product")
                : t("form:button-label-add-product")}
            </Button>
          </div>
        </form>
      </FormProvider >
    </>
  );
}
