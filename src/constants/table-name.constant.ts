import { defaultTo } from "lodash";

export const TABLE_NAME = {
  SITE_CONFIG_TABLE_NAME: defaultTo(process.env.SITE_CONFIG_TABLE_NAME, ""),
  CATEGORY_TABLE_NAME: defaultTo(process.env.CATEGORY_TABLE_NAME, ""),
};
