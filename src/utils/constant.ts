import { defaultTo } from "lodash";

export enum ROLES {
  ADMIN,
  USER,
}

export const TABLE_NAME = {
  ADMIN_ACCOUNTS_TABLE_NAME: defaultTo(
    process.env.ADMIN_ACCOUNTS_TABLE_NAME,
    ""
  ),
};
