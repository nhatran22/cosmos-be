import { middlewareOptions } from "./interface";
import {
  corsMiddleWare,
  logMiddleWare,
  responseMiddleWare,
  validateRequestParamsMiddleWare,
} from "./middle-ware";
import middy from "@middy/core";

export const middlewareHandler = (options: middlewareOptions) => {
  const {
    handler,
    requestParamsValidate,
    responsePayloadSchema,
  } = options;

  return middy(handler)
    .use(corsMiddleWare())
    .use(logMiddleWare())
    .use(validateRequestParamsMiddleWare(requestParamsValidate))
    .use(responseMiddleWare(responsePayloadSchema));
};
