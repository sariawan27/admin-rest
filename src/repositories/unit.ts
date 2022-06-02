import { CreateCategory, CreateProductCategory, Unit, UpdateCategory } from "@ts-types/generated";
import Base from "./base";

class ProductUnit extends Base<Unit, UpdateCategory> {
    fetchParent = async (url: string) => {
        return this.http(url, "get");
    };
}

export default new ProductUnit();
