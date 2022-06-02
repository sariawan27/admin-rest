import { CreateProduct, PublishProductInput, UpdateProduct } from "@ts-types/generated";
import Base from "./base";

class Product extends Base<CreateProduct, UpdateProduct> {
  popularProducts = (url: string) => {
    return this.http(url, "get");
  };
  publishProduct = (url: string, variables: PublishProductInput) => {
    return this.http<PublishProductInput>(url, "put", variables);
  };

  createWithFormData = async (url: string, variables: any) => {
    const options = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
    const response = await this.http(url, "post", variables, options);
    return response.data;
  };

  updateWithFormData = async (url: string, variables: any) => {
    const options = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
    const response = await this.http(url, "post", variables, options);
    return response.data;
  };
}

export default new Product();
