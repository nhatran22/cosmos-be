import { defaultTo } from "lodash";

export const S3_BUCKET = {
  BUCKET_REGION: defaultTo(process.env.BUCKET_REGION, ""),
  IMAGE_BUCKET: defaultTo(process.env.COSMOS_SYSTEM_IMAGES_BUCKET_NAME, ""),
};
