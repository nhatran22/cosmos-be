import {
  DynamoDBClient,
  QueryCommand,
  ScanCommand,
} from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  GetCommandInput,
  NativeAttributeValue,
  PutCommandInput,
  QueryCommandInput,
  QueryCommandOutput,
  ScanCommandInput,
  ScanCommandOutput,
  UpdateCommandInput,
} from "@aws-sdk/lib-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { defaultTo } from "lodash";

export default class DynamoDBBase<
  M extends Record<string, NativeAttributeValue>,
  K extends Record<string, NativeAttributeValue>
> {
  private ddbDocClient: DynamoDBDocumentClient;
  private tableName: string;

  constructor(tableName: string) {
    if (tableName.length === 0) {
      throw new Error("Table name is empty!");
    }
    const ddbClient = new DynamoDBClient({});

    this.ddbDocClient = DynamoDBDocumentClient.from(ddbClient);
    this.tableName = tableName;
  }

  async getByKey(key: K, options?: GetCommandInput): Promise<M | null> {
    const result = await this.ddbDocClient.send(
      new GetCommand({
        TableName: this.tableName,
        Key: key,
        ...options,
      })
    );
    if (!result.Item) {
      return null;
    }

    return result.Item as M;
  }

  async query(options: QueryOptions): Promise<ResultListResponse<M>> {
    const result = await this.ddbDocClient.send(
      new QueryCommand({
        TableName: this.tableName,
        ...options,
      })
    );

    if (!result.Items) {
      return {
        items: [],
        lastEvaluatedKey: null,
      };
    }

    const unmarshallItems = result.Items.map((item) => unmarshall(item));

    return {
      items: unmarshallItems as M[],
      lastEvaluatedKey: defaultTo(result.LastEvaluatedKey?.toString(), null),
    };
  }

  async scan(options?: ScanOptions): Promise<ResultListResponse<M>> {
    const result = await this.ddbDocClient.send(
      new ScanCommand({
        TableName: this.tableName,
        ...options,
      })
    );

    if (!result.Items) {
      return {
        items: [],
        lastEvaluatedKey: null,
      };
    }

    const unmarshallItems = result.Items.map((item) => unmarshall(item));

    return {
      items: unmarshallItems as M[],
      lastEvaluatedKey: defaultTo(result.LastEvaluatedKey?.toString(), null),
    };
  }

  async queryAll(options: QueryAllOptions): Promise<M[]> {
    const queryParams = {
      TableName: this.tableName,
      ...options,
    };
    const items: M[] = [];
    let data: QueryCommandOutput;
    do {
      data = await this.ddbDocClient.send(new QueryCommand(queryParams));
      if (data.Items?.length) {
        const unmarshallItems = data.Items.map((item) => unmarshall(item));
        items.push(...(unmarshallItems as M[]));
      }
      queryParams.ExclusiveStartKey = data.LastEvaluatedKey;
    } while (data.LastEvaluatedKey);

    return items;
  }

  async queryOne(options: QueryOneOptions): Promise<M | null> {
    const queryParams = {
      TableName: this.tableName,
      ...options,
    };
    let data: QueryCommandOutput;
    do {
      data = await this.ddbDocClient.send(new QueryCommand(queryParams));
      if (data.Items?.length) {
        return unmarshall(data.Items[0]) as M;
      }
      queryParams.ExclusiveStartKey = data.LastEvaluatedKey;
    } while (data.LastEvaluatedKey);

    return null;
  }

  async scanAll(options?: ScanAllOptions): Promise<M[]> {
    const scanParams = {
      TableName: this.tableName,
      ...options,
    };
    const items: M[] = [];
    let data: ScanCommandOutput;
    do {
      data = await this.ddbDocClient.send(new ScanCommand(scanParams));
      if (data.Items && data.Items.length > 0) {
        const unmarshallItems = data.Items.map((item) => unmarshall(item));
        items.push(...(unmarshallItems as M[]));
      }
      scanParams.ExclusiveStartKey = data.LastEvaluatedKey;
    } while (data.LastEvaluatedKey);
    return items;
  }
}

export type GetByKeyOptions = Omit<GetCommandInput, "TableName" | "Key">;

export type PutOptions = Omit<PutCommandInput, "TableName" | "Item">;

export type UpdateOptions = Omit<UpdateCommandInput, "TableName" | "Key"> & {
  SkipCheckExist?: boolean;
};

export type QueryOptions = Omit<QueryCommandInput, "TableName">;

export type ScanOptions = Omit<ScanCommandInput, "TableName">;

export type QueryAllOptions = Omit<QueryCommandInput, "TableName">;

export type QueryOneOptions = Omit<QueryCommandInput, "TableName">;

export type ScanAllOptions = Omit<ScanCommandInput, "TableName">;

export type ScanPaginateOptions = Omit<
  ScanCommandInput,
  "TableName" | "ExclusiveStartKey"
> & {
  ExclusiveStartKey?: string | null;
};

export interface ResultListResponse<M> {
  items: M[];
  lastEvaluatedKey: string | null;
}
