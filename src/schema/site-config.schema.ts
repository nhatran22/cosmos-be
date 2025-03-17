import { Static, Type } from "@sinclair/typebox";

// Site Config structure
// SiteConfig {
//     siteName: string,
//     information: {
//         description: string,
//         address: string,
//         telephone: string,
//         email: string,
//     },
//     socialMedia: {
//         facebook: string,
//     }
// }

// Schema
export const SiteConfigSchema = Type.Object({
  code: Type.String({
    tranform: ["trim"],
  }),
  value: Type.Any(),
});

export const SiteConfigInformationSchema = Type.Object(
  {
    description: Type.String({
      transform: ["trimg"],
    }),
    address: Type.String({
      transform: ["trimg"],
    }),
    telephone: Type.String({
      transform: ["trimg"],
    }),
    email: Type.String({
      format: "email",
      transform: ["trimg"],
    }),
  },
  { $id: "SiteConfigInformationSchema" }
);

export const SiteConfigSocialMediaSchema = Type.Object(
  {
    facebook: Type.String({
      transform: ["trimg"],
    }),
  },
  { $id: "SiteConfigSocialMediaSchema" }
);

// Type
export type SiteConfigModel = Static<typeof SiteConfigSchema>;
export type SiteConfigKeys = Pick<SiteConfigModel, "code">;

export type SiteConfigInformationModel = Static<
  typeof SiteConfigInformationSchema
>;
export type SiteConfigSocialMediaModel = Static<
  typeof SiteConfigSocialMediaSchema
>;
