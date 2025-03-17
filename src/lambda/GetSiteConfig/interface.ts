import { RequestParamsValidate } from "../../middleware/interface";
import {
  SiteConfigInformationSchema,
  SiteConfigSocialMediaSchema,
} from "../../schema/site-config.schema";
import { Static, Type } from "@sinclair/typebox";

export const requestParamsValidate: RequestParamsValidate = {};

export const responsePayloadSchema = Type.Object({
  siteName: Type.String(),
  siteInformation: SiteConfigInformationSchema,
  siteSocialMedia: SiteConfigSocialMediaSchema,
});
export type ResponsePayload = Static<typeof responsePayloadSchema>;
