import { RequestParamsValidate } from "../../middleware/interface";
import { ProductSchema } from "../../schema/product.schema";
import { Nullable } from "../../utils/type-box-helper";
import { Static, Type } from "@sinclair/typebox";

export const requestQueryStringParametersValidate = Nullable(
  Type.Object({
    categoryId: Nullable(Type.String()),
  })
);

export const requestParamsValidate: RequestParamsValidate = {
  queryStringParameters: requestQueryStringParametersValidate,
};

export interface RequestParams {
  queryStringParameters: Static<typeof requestQueryStringParametersValidate>;
}

export const responsePayloadSchema = Type.Object({
  data: Type.Array(
    Type.Pick(ProductSchema, ["id", "name", "image", "categoryId"])
  ),
});
export type ResponsePayload = Static<typeof responsePayloadSchema>;
