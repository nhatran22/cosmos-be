import { Static, Type } from "@sinclair/typebox";

export const PerformanceCharacteristic = Type.Object({
  icon: Type.String({
    transform: ["trim"],
  }),
  title: Type.String({
    transform: ["trim"],
  }),
  description: Type.String({
    transform: ["trim"],
  }),
});
export const Diagram = Type.Object({
  image: Type.String({
    transform: ["trim"],
  }),
  title: Type.String({
    transform: ["trim"],
  }),
  description: Type.String({
    transform: ["trim"],
  }),
});

export const ProductSchema = Type.Object({
  id: Type.String({
    transform: ["trim"],
  }),
  name: Type.String({
    transform: ["trim"],
  }),
  image: Type.String({
    transform: ["trim"],
  }),
  description: Type.String({}),
  powerRange: Type.String({
    transform: ["trim"],
  }),
  gridSystem: Type.Optional(
    Type.String({
      transform: ["trim"],
    })
  ),
  workingWay: Type.Optional(
    Type.String({
      transform: ["trim"],
    })
  ),
  suitableArea: Type.String({
    transform: ["trim"],
  }),
  performanceCharacteristics: Type.Array(PerformanceCharacteristic),
  diagrams: Type.Array(Diagram),
  catalogueUrl: Type.String({
    transform: ["trim"],
  }),
  categoryId: Type.String(),
});

// Type
export type ProductModel = Static<typeof ProductSchema>;
export type ProductKeys = Pick<ProductModel, "id">;

export type PerformanceCharacteristicModel = Static<
  typeof PerformanceCharacteristic
>;
export type Diagram = Static<typeof Diagram>;
