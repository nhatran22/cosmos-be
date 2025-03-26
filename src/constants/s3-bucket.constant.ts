import { defaultTo } from "lodash";

export const S3_BUCKET = {
  RESOURCES_BUCKET: defaultTo(process.env.COSMOS_SYSTEM_RESOURCES_BUCKET_NAME, ""),
};
