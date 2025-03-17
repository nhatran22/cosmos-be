import { middlewareHandler } from "../../middleware/handler";
import { APIEvent, LambdaSettings } from "../../middleware/interface";
import { ROLES } from "../../utils/constant";
import { ResponsePayload, responsePayloadSchema } from "./interface";

const lambdaSettings: LambdaSettings = {
  IS_REQUIRE_AUTHENTICATION: true,
  ROLE_REQUIRE: [ROLES.ADMIN, ROLES.USER],
};

const GetProfile = async (event: APIEvent): Promise<ResponsePayload> => {
  return (async () => main())();

  function main() {
    return event.loggedAccount;
  }
};

export const handler = middlewareHandler({
  handler: GetProfile,
  lambdaSettings,
  responsePayloadSchema,
});
