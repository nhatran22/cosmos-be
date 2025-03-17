import DynamoDBBase from "../services/dynamoDB";
import { PASSWORD_REGEX, ROLES, TABLE_NAME } from "../utils/constant";
import { Nullable } from "../utils/type-box-helper";
import { Static, Type } from "@sinclair/typebox";

export const adminProfileSchema = Type.Object(
  {
    fullName: Type.String({
      transform: ["trim"],
    }),
    phoneNumber: Type.String(),
  },
  { $id: "adminProfileSchema" }
);

export const adminAccountsSchema = Type.Object(
  {
    adminAccountUID: Type.String(),
    email: Type.String({ format: "email" }),
    password: Type.String({ pattern: PASSWORD_REGEX.source }),
    accountRoles: Type.Integer({
      minimum: ROLES.ADMIN,
      maximum: ROLES.STAFF,
      default: ROLES.STAFF,
    }),
    profile: adminProfileSchema,
    isDeactivated: Type.Boolean({ default: false }),
    deactivatedDate: Nullable(Type.Integer({ minimum: 0 })),
    createdDate: Type.Integer({ minimum: 0 }),
    updatedDate: Type.Integer({ minimum: 0 }),
  },
  { $id: "adminAccountsSchema" }
);

export type AdminAccountsModel = Static<typeof adminAccountsSchema>;
export type AdminAccountKeys = Pick<AdminAccountsModel, "adminAccountUID">;

export default class AdminAccountsRepository extends DynamoDBBase<
  AdminAccountsModel,
  AdminAccountKeys
> {
  constructor() {
    super(TABLE_NAME.ADMIN_ACCOUNTS_TABLE_NAME);
  }
}
