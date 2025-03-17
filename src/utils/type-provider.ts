// Read more idea at: fastify.com

// Used to map undefined SchemaCompiler properties to unknown
//   Without brackets, UndefinedToUnknown<undefined | null> => unknown
export type UndefinedToUnknown<T> = [T] extends [undefined] ? unknown : T;

export interface RequestTypeGenericInterface {
  body?: unknown;
  queryStringParameters?: unknown;
  pathParameters?: unknown;
  headers?: unknown;
}
type ResolveRequestBody<
  RequestTypeGeneric extends RequestTypeGenericInterface
> = UndefinedToUnknown<RequestTypeGeneric["body"]>;
type ResolveRequestQueryString<
  RequestTypeGeneric extends RequestTypeGenericInterface
> = UndefinedToUnknown<RequestTypeGeneric["queryStringParameters"]>;
type ResolveRequestPathParams<
  RequestTypeGeneric extends RequestTypeGenericInterface
> = UndefinedToUnknown<RequestTypeGeneric["pathParameters"]>;
type ResolveRequestHeaders<
  RequestTypeGeneric extends RequestTypeGenericInterface
> = UndefinedToUnknown<RequestTypeGeneric["headers"]>;

// The target request type. This type is inferenced on fastify 'requests' via generic argument assignment
export interface RequestParamsType<
  Params = unknown,
  Querystring = unknown,
  Headers = unknown,
  Body = unknown
> {
  pathParameters: Params;
  queryStringParameters: Querystring;
  headers: Headers;
  body: Body;
}

export interface ResolveRequestType<
  RequestGeneric extends RequestTypeGenericInterface
> extends RequestParamsType {
  body: ResolveRequestBody<RequestGeneric>;
  queryStringParameters: ResolveRequestQueryString<RequestGeneric>;
  pathParameters: ResolveRequestPathParams<RequestGeneric>;
  headers: ResolveRequestHeaders<RequestGeneric>;
}
