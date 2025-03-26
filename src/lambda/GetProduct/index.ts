import { S3_BUCKET } from "../../constants/s3-bucket.constant";
import Errors from "../../errors/errors";
import { middlewareHandler } from "../../middleware/handler";
import { APIEvent } from "../../middleware/interface";
import ProductRepository from "../../repository/product.repository";
import { ProductModel } from "../../schema/product.schema";
import S3Service from "../../services/s3";
import {
  RequestParams,
  requestParamsValidate,
  ResponsePayload,
  responsePayloadSchema,
} from "./interface";
import { isEmpty } from "lodash";

// Repository
const productRepository = new ProductRepository();
const s3Service = new S3Service();

// Function
const GetProduct = async (
  event: APIEvent<RequestParams>
): Promise<ResponsePayload> => {
  return (async () => main())();

  async function main(): Promise<ResponsePayload> {
    const params = initParams();
    const product = await productRepository.getByKey({
      id: params.pathParameters.productId,
    });

    if (!product) {
      throw Errors.DATA_NOT_FOUND;
    }
    await addPresignedUrlForResource(product);

    return {
      data: product,
    };
  }

  function initParams(): RequestParams {
    const pathParameters = event.pathParameters;

    return {
      pathParameters,
    };
  }

  async function addPresignedUrlForResource(
    product: ProductModel
  ): Promise<void> {
    if (product.image) {
      product.image = await s3Service.getDownloadSignedUrl(
        S3_BUCKET.RESOURCES_BUCKET,
        product.image
      );
    }

    if (product.catalogue) {
      product.catalogue = await s3Service.getDownloadSignedUrl(
        S3_BUCKET.RESOURCES_BUCKET,
        product.catalogue
      );
    }

    if (!isEmpty(product.diagrams)) {
      for (const diagram of product.diagrams) {
        diagram.image = await s3Service.getDownloadSignedUrl(
          S3_BUCKET.RESOURCES_BUCKET,
          diagram.image
        );
      }
    }
  }
};

export const handler = middlewareHandler({
  handler: GetProduct,
  requestParamsValidate,
  responsePayloadSchema,
});
