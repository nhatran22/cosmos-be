import { SITE_CONFIG_CODE } from "../../constants/site-config.constant";
import { middlewareHandler } from "../../middleware/handler";
import SiteConfigRepository from "../../repository/site-config.repository";
import {
  SiteConfigInformationModel,
  SiteConfigModel,
  SiteConfigSocialMediaModel,
} from "../../schema/site-config.schema";
import {
  requestParamsValidate,
  ResponsePayload,
  responsePayloadSchema,
} from "./interface";

// Repository
const siteConfigRepository = new SiteConfigRepository();

// Function
const GetSiteConfig = async (): Promise<ResponsePayload> => {
  return (async () => main())();

  async function main(): Promise<ResponsePayload> {
    const siteConfig = await siteConfigRepository.scanAll();

    const siteName = getValue<string>(SITE_CONFIG_CODE.SITE_NAME, siteConfig);
    const siteInformation = getValue<SiteConfigInformationModel>(
      SITE_CONFIG_CODE.SITE_INFORMATION,
      siteConfig
    );
    const siteSocialMedia = getValue<SiteConfigSocialMediaModel>(
      SITE_CONFIG_CODE.SITE_SOCIAL_MEDIA,
      siteConfig
    );

    return {
      siteName,
      siteInformation,
      siteSocialMedia,
    };
  }

  function getValue<T>(code: string, siteConfig: SiteConfigModel[]): T {
    return siteConfig.find((config) => config.code === code)?.value as T;
  }
};

export const handler = middlewareHandler({
  handler: GetSiteConfig,
  requestParamsValidate,
  responsePayloadSchema,
});
