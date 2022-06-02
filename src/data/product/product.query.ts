import Product from "@repositories/product";
import { useQuery } from "react-query";
import { Product as TProduct } from "@ts-types/generated";
import { API_ENDPOINTS } from "@utils/api/endpoints";

export const fetchProduct = async (productId: string) => {
  const { data } = await Product.find(`${API_ENDPOINTS.PRODUCTS}/${productId}`);
  return data;
};

type ProductResponse = {
  product: TProduct;
};
export const useProductQuery = (productId: string) => {
  return useQuery<ProductResponse, Error>([API_ENDPOINTS.PRODUCTS, productId], () =>
    fetchProduct(productId)
  );
};
