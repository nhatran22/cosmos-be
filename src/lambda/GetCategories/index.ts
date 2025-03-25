import { isEmpty } from "lodash";
import { S3_BUCKET } from "../../constants/s3-bucket.constant";
import { middlewareHandler } from "../../middleware/handler";
import CategoryRepository from "../../repository/category.repository";
import { CategoryModel, SubCategoryModel } from "../../schema/category.schema";
import S3Service from "../../services/s3";
import {
  requestParamsValidate,
  ResponsePayload,
  responsePayloadSchema,
} from "./interface";

// Repository
const categoryRepository = new CategoryRepository();
const s3Service = new S3Service();

// Function
const GetCategories = async (): Promise<ResponsePayload> => {
  return (async () => main())();

  async function main(): Promise<ResponsePayload> {
    const categories = await categoryRepository.scanAll();
    await addPresignedImageUrl(categories);
    return {
      data: categories,
    };
  }

  async function addPresignedImageUrl(
    categories: CategoryModel[] | SubCategoryModel[]
  ) {
    for (const category of categories) {
      if (category.image) {
        category.image = await s3Service.getDownloadSignedUrl(
          S3_BUCKET.IMAGE_BUCKET,
          category.image
        );
      }

      const parentCategory = category as CategoryModel;
      if (!isEmpty(parentCategory.subCategory)) {
        await addPresignedImageUrl(parentCategory.subCategory);
      }
    }
  }
};

export const handler = middlewareHandler({
  handler: GetCategories,
  requestParamsValidate,
  responsePayloadSchema,
});
