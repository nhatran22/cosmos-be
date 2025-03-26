import { TABLE_NAME } from "../constants/table-name.constant";
import { ProductKeys, ProductModel } from "../schema/product.schema";
import DynamoDBBase from "../services/dynamoDB";

export default class ProductRepository extends DynamoDBBase<
  ProductModel,
  ProductKeys
> {
  constructor() {
    super(TABLE_NAME.PRODUCT_TABLE_NAME);
  }
}
