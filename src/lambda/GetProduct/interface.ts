import { RequestParamsValidate } from "../../middleware/interface";
import { ProductSchema } from "../../schema/product.schema";
import { Static, Type } from "@sinclair/typebox";

const pathParametersValidate = Type.Object({
  productId: Type.String({
    transform: ["trim"],
  }),
});
export const requestParamsValidate: RequestParamsValidate = {
  pathParameters: pathParametersValidate,
};

export interface RequestParams {
  pathParameters: Static<typeof pathParametersValidate>;
}

export const responsePayloadSchema = Type.Object({
  data: ProductSchema,
});
export type ResponsePayload = Static<typeof responsePayloadSchema>;
