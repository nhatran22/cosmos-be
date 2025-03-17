import { APIResult } from "./interface";

export const addHeaderInformation = (res: APIResult): void => {
  res.headers = {
    ...res.headers,
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "*",
  };
};
