import { Static, Type } from "@sinclair/typebox";

export const SubCategorySchema = Type.Object({
  id: Type.String({
    transform: ["trim"],
  }),
  name: Type.String({
    transform: ["trim"],
  }),
  description: Type.String(),
  image: Type.String(),
});

export const CategorySchema = Type.Object({
  id: Type.String({
    transform: ["trim"],
  }),
  name: Type.String({
    transform: ["trim"],
  }),
  description: Type.String(),
  image: Type.String(),
  subCategory: Type.Array(SubCategorySchema, {
    $id: "SubCategorySchema",
  }),
});

// Type
export type CategoryModel = Static<typeof CategorySchema>;
export type CategoryKeys = Pick<CategoryModel, "id">;

export type SubCategoryModel = Static<typeof SubCategorySchema>;
