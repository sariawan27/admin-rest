import Category from "@repositories/category";
import { useQuery } from "react-query";
import { Category as TCategory } from "@ts-types/generated";
import { API_ENDPOINTS } from "@utils/api/endpoints";

export const fetchCategory = async (productCategoryid: string) => {
  const { data } = await Category.find(`${API_ENDPOINTS.PRODUCT_CATEGORIES}/${productCategoryid}`);
  return data;
};

export const useCategoryQuery = (productCategoryid: string) => {
  return useQuery<TCategory, Error>([API_ENDPOINTS.PRODUCT_CATEGORIES, productCategoryid], () =>
    fetchCategory(productCategoryid)
  );
};
