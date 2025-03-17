import Errors from "../errors/errors";
import { validateParams } from "../utils/ajv-helper";
import { addHeaderInformation } from "./add-headers";
import { handleError } from "./handle-error";
import { APIEvent, APIResult, RequestParamsValidate } from "./interface";
import { logRequest, logResponse } from "./log-info";
import middy from "@middy/core";
import { Type, TypeGuard } from "@sinclair/typebox";
import { SchemaObject } from "ajv";
import ajvKeywords from "ajv-keywords/dist/definitions";
import fastJsonStringify from "fast-json-stringify";
import { defaultTo } from "lodash";

export const corsMiddleWare = (): middy.MiddlewareObj<APIEvent, APIResult> => {
  const addCors: middy.MiddlewareFn<APIEvent, APIResult> = async (
    request
  ): Promise<void> => {
    const { response } = request;
    if (response) {
      addHeaderInformation(response);
    }
  };

  return {
    after: addCors,
    onError: addCors,
  };
};

export const logMiddleWare = (): middy.MiddlewareObj<APIEvent, APIResult> => {
  const logRequestInfo: middy.MiddlewareFn<APIEvent, APIResult> = async (
    request
  ): Promise<void> => {
    const { event } = request;
    logRequest(event);
  };

  const logResponseInfo: middy.MiddlewareFn<APIEvent, APIResult> = async (
    request
  ): Promise<void> => {
    const { response } = request;
    logResponse(response);
  };

  const logErrorInfo: middy.MiddlewareFn<APIEvent, APIResult> = async (
    request
  ): Promise<void> => {
    const { response, error } = request;
    console.error(JSON.stringify(error, null, 2));
    logResponse(response);
  };

  return {
    before: logRequestInfo,
    after: logResponseInfo,
    onError: logErrorInfo,
  };
};

export const validateRequestParamsMiddleWare = (
  requestParameterValidate?: RequestParamsValidate
): middy.MiddlewareObj<APIEvent, APIResult> => {
  const middlewareBefore: middy.MiddlewareFn<APIEvent, APIResult> = async (
    request
  ): Promise<void> => {
    if (!requestParameterValidate) {
      return;
    }

    const { event } = request;
    const { body, pathParameters, queryStringParameters, headers } =
      requestParameterValidate;
    if (body) {
      event.body = JSON.parse(defaultTo(event.body as string, "{}"));
      validateParams(event.body, body);
    }

    if (pathParameters) {
      validateParams(event.pathParameters, pathParameters);
    }

    if (queryStringParameters) {
      validateParams(event.queryStringParameters, queryStringParameters);
    }

    if (headers) {
      validateParams(event.headers, headers);
    }
  };

  return {
    before: middlewareBefore,
  };
};

export const responseMiddleWare = (
  schema?: SchemaObject
): middy.MiddlewareObj<APIEvent, APIResult> => {
  const middlewareOnAfter: middy.MiddlewareFn<APIEvent, APIResult> = async (
    request
  ): Promise<void> => {
    let data: object = { message: "success" };
    if (request.response) {
      data = request.response as any; // eslint-disable-line
    }
    if (!schema || TypeGuard.TVoid(schema)) {
      schema = Type.Object({}, { additionalProperties: true });
    }
    try {
      const stringify = fastJsonStringify(schema, {
        ajv: {
          keywords: ajvKeywords(),
        },
      });

      request.response = {
        statusCode: 200,
        body: stringify(data),
      };
    } catch (err: unknown) {
      // eslint-disable-line
      console.error(err);
      throw Errors.INTERNAL_ERROR;
    }
  };

  const middlewareOnError: middy.MiddlewareFn<APIEvent, APIResult> = async (
    request
  ): Promise<void> => {
    const { error } = request;
    schema = Type.Object({}, { additionalProperties: true });
    const stringify = fastJsonStringify(schema, {
      ajv: {
        keywords: ajvKeywords(),
      },
    });

    request.response = {
      statusCode: 400,
      body: stringify(handleError(error)),
    };
  };

  return {
    after: middlewareOnAfter,
    onError: middlewareOnError,
  };
};
