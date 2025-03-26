import { S3_BUCKET } from "../../constants/s3-bucket.constant";
import { middlewareHandler } from "../../middleware/handler";
import { APIEvent } from "../../middleware/interface";
import ProductRepository from "../../repository/product.repository";
import { ProductModel } from "../../schema/product.schema";
import { QueryOptions, ResultListResponse } from "../../services/dynamoDB";
import S3Service from "../../services/s3";
import {
  RequestParams,
  requestParamsValidate,
  ResponsePayload,
  responsePayloadSchema,
} from "./interface";

// Repository
const productRepository = new ProductRepository();
const s3Service = new S3Service();

// Function
const GetProducts = async (
  event: APIEvent<RequestParams>
): Promise<ResponsePayload> => {
  return (async () => main())();

  async function main(): Promise<ResponsePayload> {
    const params = initParams();
    const { items } = await getProducts(params);
    await addPresignedUrlForResource(items);

    return {
      data: items,
    };
  }

  function initParams(): RequestParams {
    const queryStringParameters = event.queryStringParameters;

    return {
      queryStringParameters,
    };
  }

  async function getProducts(
    params: RequestParams
  ): Promise<ResultListResponse<ProductModel>> {
    if (params.queryStringParameters?.categoryId) {
      const queryParams: QueryOptions = {
        IndexName: "categoryId-index",
        KeyConditionExpression: "categoryId = :categoryId",
        ExpressionAttributeValues: {
          ":categoryId": params.queryStringParameters.categoryId,
        },
      };
      return productRepository.query(queryParams);
    } else {
      const results = await productRepository.scanAll();
      return {
        items: results,
        lastEvaluatedKey: null,
      };
    }
  }

  async function addPresignedUrlForResource(
    items: ProductModel[]
  ): Promise<void> {
    for (const item of items) {
      if (item.image) {
        item.image = await s3Service.getDownloadSignedUrl(
          S3_BUCKET.RESOURCES_BUCKET,
          item.image
        );
      }
    }
  }
};

export const handler = middlewareHandler({
  handler: GetProducts,
  requestParamsValidate,
  responsePayloadSchema,
});
