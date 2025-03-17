import Errors from "../errors/errors";
import Ajv from "ajv";
import { Schema } from "ajv";
import addFormat from "ajv-formats";
import ajvKeywords from "ajv-keywords/dist/definitions";

export const ajv = addFormat(
  new Ajv({
    keywords: ajvKeywords(),
    allErrors: true,
    coerceTypes: true,
  }),
  [
    "date-time",
    "time",
    "date",
    "email",
    "hostname",
    "ipv4",
    "ipv6",
    "uri",
    "uri-reference",
    "uuid",
    "uri-template",
    "json-pointer",
    "relative-json-pointer",
    "regex",
  ]
);

export const validateParams = (params: unknown, schema: Schema): void => {
  // eslint-disable-line
  const validate = ajv.compile(schema);
  if (!validate(params)) {
    console.error(JSON.stringify(validate.errors));
    throw Errors.PARAMETER_ERROR;
  }
};
