import { APIEvent, APIResult } from "./interface";
import { defaultTo } from "lodash";

export const logRequest = (event: APIEvent): void => {
  console.log(
    `Path Parameters: ${JSON.stringify(event.pathParameters, null, 2)}`
  );
  console.log(
    `Query String Parameters: ${JSON.stringify(event.queryStringParameters)}`
  );
  console.log(`Request Body Parameters: ${event.body}`);
};

export const logResponse = (response: APIResult | null): void => {
  console.log(`Response: ${JSON.stringify(defaultTo(response, "{}"))}`);
};
