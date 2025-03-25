import { defaultTo } from "lodash";

export const S3_BUCKET_NAME = {
  IMAGE_BUCKET: defaultTo(process.env.COSMOS_SYSTEM_IMAGES_BUCKET_NAME, ""),
};
