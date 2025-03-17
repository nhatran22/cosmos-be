import {
  RequestParamsType,
  RequestTypeGenericInterface,
  ResolveRequestType,
} from "../utils/type-provider";
import { Schema, SchemaObject } from "ajv";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

export type APIEvent<
  RouteGeneric extends RequestTypeGenericInterface = RequestTypeGenericInterface,
  RequestParamsGeneric extends RequestParamsType = ResolveRequestType<RouteGeneric>
> = Omit<
  APIGatewayProxyEvent,
  "body" | "queryStringParameters" | "headers" | "pathParameters"
> & {
  body: RequestParamsGeneric["body"];
  queryStringParameters: RequestParamsGeneric["queryStringParameters"];
  pathParameters: RequestParamsGeneric["pathParameters"];
  headers: RequestParamsGeneric["headers"];
};

export type APIResult = APIGatewayProxyResult;

export interface middlewareOptions {
  handler: any; // eslint-disable-line
  lambdaSettings?: LambdaSettings;
  requestParamsValidate?: RequestParamsValidate;
  responsePayloadSchema?: SchemaObject;
}
export interface RequestParamsValidate {
  body?: Schema;
  queryStringParameters?: Schema;
  pathParameters?: Schema;
  headers?: Schema;
}

export interface LambdaSettings {
  [key: string]: unknown;
  // IS_REQUIRE_AUTHENTICATION: boolean;
  // ROLE_REQUIRE: number[];
}
