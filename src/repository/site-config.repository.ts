import { TABLE_NAME } from "../constants/table-name.constant";
import { SiteConfigKeys, SiteConfigModel } from "../schema/site-config.schema";
import DynamoDBBase from "../services/dynamoDB";

export default class SiteConfigRepository extends DynamoDBBase<
  SiteConfigModel,
  SiteConfigKeys
> {
  constructor() {
    super(TABLE_NAME.SITE_CONFIG_TABLE_NAME);
  }
}
