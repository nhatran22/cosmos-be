import { RequestParamsValidate } from "../../middleware/interface";
import { CategorySchema } from "../../schema/category.schema";
import { Static, Type } from "@sinclair/typebox";

export const requestParamsValidate: RequestParamsValidate = {};

export const responsePayloadSchema = Type.Object({
  data: Type.Array(CategorySchema),
});
export type ResponsePayload = Static<typeof responsePayloadSchema>;
