import {
  AdminAccountsModel,
  adminAccountsSchema,
} from "../../repository/admin-accounts";
import { Static, Type } from "@sinclair/typebox";

export interface RequestParams {
  loggedAccount: AdminAccountsModel;
}

export const responsePayloadSchema = Type.Pick(adminAccountsSchema, [
  "adminAccountUID",
  "email",
  "accountRoles",
  "profile",
]);
export type ResponsePayload = Static<typeof responsePayloadSchema>;
