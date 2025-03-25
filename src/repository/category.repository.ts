import { TABLE_NAME } from "../constants/table-name.constant";
import { CategoryKeys, CategoryModel } from "../schema/category.schema";
import DynamoDBBase from "../services/dynamoDB";

export default class CategoryRepository extends DynamoDBBase<
  CategoryModel,
  CategoryKeys
> {
  constructor() {
    super(TABLE_NAME.CATEGORY_TABLE_NAME);
  }
}
