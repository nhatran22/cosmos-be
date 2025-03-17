import { defaultTo } from "lodash";

export const TABLE_NAME = {
  SITE_CONFIG_TABLE_NAME: defaultTo(process.env.SITE_CONFIG_TABLE_NAME, ""),
};
