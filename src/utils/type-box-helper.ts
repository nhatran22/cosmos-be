import { TSchema, Type } from "@sinclair/typebox";

export const Nullable = <T extends TSchema>(schema: T) => {
  return Type.Union([schema, Type.Null()]);
};

export const stringEnum = <T extends string[]>(values: [...T]) => {
  return Type.Unsafe<T[number]>({ type: "string", enum: values });
};
