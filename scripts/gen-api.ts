import { program } from "commander";
import fs from "fs";
import { toUpper, upperFirst } from "lodash";
import { Document, ParsedNode, Scalar, parseDocument, stringify } from "yaml";

program.name("Generate API").description("CLI Generate API").version("1.0.0");
program
  .requiredOption("-f, --functionName [functionName]", "Function name.")
  .requiredOption(
    "-m, --method [method]",
    "API method: GET, POST, PUT, DELETE."
  )
  .requiredOption("-u, --url [url]", "API url.");
program.parse(process.argv);
const functionName = upperFirst(program.opts().functionName);
const method = toUpper(program.opts().method);
const url = String(program.opts().url);
if (!/^\/.*/.test(url)) {
  throw "Error: Invalid url";
}
const lambdaSrcPath = "src/lambda/";
const cloudformationSrcPath = "deploy";

createLambdaFolder();
generateMainSource();
generateInterface();
updateCloudFormationFunction();
updateCloudFormationPermission();
updateCloudFormationRole();
updateCloudFormationMain();
updateSwagger();

function createLambdaFolder() {
  fs.mkdirSync(`${lambdaSrcPath}/${functionName}`, { recursive: true });
}

function generateMainSource() {
  const data = `import { middlewareHandler } from "../../middleware/handler";
import SiteConfigRepository from "../../repository/site-config.repository";
import {
  requestParamsValidate,
  ResponsePayload,
  responsePayloadSchema,
} from "./interface";

// Repository
const siteConfigRepository = new SiteConfigRepository();

// Function
const ${functionName} = async (): Promise<ResponsePayload> => {
  return (async () => main())();

  async function main(): Promise<ResponsePayload> {
    const siteConfig = await siteConfigRepository.scanAll();
    return {
      config: siteConfig,
    };
  }
};

export const handler = middlewareHandler({
  handler: ${functionName},
  requestParamsValidate,
  responsePayloadSchema,
});
`;
  fs.writeFileSync(`${lambdaSrcPath}/${functionName}/index.ts`, data);
}

function generateInterface() {
  const data = `import { RequestParamsValidate } from "../../middleware/interface";
import { SiteConfigSchema } from "../../schema/site-config.schema";
import { Static, Type } from "@sinclair/typebox";

export const requestParamsValidate: RequestParamsValidate = {};

export const responsePayloadSchema = Type.Object({
  config: Type.Array(SiteConfigSchema),
});
export type ResponsePayload = Static<typeof responsePayloadSchema>;
`;
  fs.writeFileSync(`${lambdaSrcPath}/${functionName}/interface.ts`, data);
}

function updateCloudFormationFunction() {
  const functionPath = `${cloudformationSrcPath}/function.yaml`;
  const cloudformation = parseCloudformation(functionPath);
  addFunctionParameter(cloudformation);
  addFunctionResources(cloudformation);
  addFunctionOutputs(cloudformation);
  updateCloudFormation(functionPath, cloudformation);
}

function addFunctionParameter(cloudformation: Document.Parsed<ParsedNode>) {
  cloudformation.addIn(["Parameters"], {
    key: `${functionName}RoleArn`,
    value: {
      Type: "String",
    },
  });
}

function addFunctionResources(cloudformation: Document.Parsed<ParsedNode>) {
  const keyName = new Scalar(`${functionName}Function`);
  keyName.spaceBefore = true;

  cloudformation.addIn(["Resources"], {
    key: keyName,
    value: {
      Type: "AWS::Serverless::Function",
      Properties: {
        FunctionName: `${functionName}Function`,
        CodeUri: `../dist/${functionName}/`,
        Role: createRefValue(`${functionName}RoleArn`),
        Environment: {
          Variables: {
            SITE_CONFIG_TABLE_NAME: "SiteConfig",
          },
        },
      },
    },
  });
}

function addFunctionOutputs(cloudformation: Document.Parsed<ParsedNode>) {
  cloudformation.addIn(["Outputs"], {
    key: `${functionName}FunctionArn`,
    value: {
      Value: createGetAttValue(`${functionName}Function.Arn`),
    },
  });
}

function updateCloudFormationPermission() {
  const permissionTemplatePath = `${cloudformationSrcPath}/permission.yaml`;
  const cloudformation = parseCloudformation(permissionTemplatePath);
  addPermissionParameter(cloudformation);
  addPermissionResources(cloudformation);
  updateCloudFormation(permissionTemplatePath, cloudformation);
}

function addPermissionParameter(cloudformation: Document.Parsed<ParsedNode>) {
  cloudformation.addIn(["Parameters"], {
    key: `${functionName}FunctionArn`,
    value: {
      Type: "String",
    },
  });
}

function addPermissionResources(cloudformation: Document.Parsed<ParsedNode>) {
  const keyName = new Scalar(`${functionName}Permission`);
  keyName.spaceBefore = true;
  cloudformation.addIn(["Resources"], {
    key: keyName,
    value: {
      Type: "AWS::Lambda::Permission",
      Properties: {
        FunctionName: createRefValue(`${functionName}FunctionArn`),
        Action: "lambda:InvokeFunction",
        Principal: "apigateway.amazonaws.com",
        SourceArn: createSubValue(
          `arn:aws:execute-api:\${AWS::Region}:\${AWS::AccountId}:\${CosmosApiGateway}/*/${method}${url.replaceAll(
            /{.[^/]*}/g,
            "*"
          )}`
        ),
      },
    },
  });
}

function updateCloudFormationRole() {
  const roleTemplatePath = `${cloudformationSrcPath}/role.yaml`;
  const cloudformation = parseCloudformation(roleTemplatePath);
  addRoleResources(cloudformation);
  addRoleOutputs(cloudformation);
  updateCloudFormation(roleTemplatePath, cloudformation);
}

function addRoleResources(cloudformation: Document.Parsed<ParsedNode>) {
  const keyName = new Scalar(`${functionName}Role`);
  keyName.spaceBefore = true;

  cloudformation.addIn(["Resources"], {
    key: keyName,
    value: {
      Type: "AWS::IAM::Role",
      Properties: {
        RoleName: `${functionName}Role`,
        AssumeRolePolicyDocument: {
          Version: "2012-10-17",
          Statement: [
            {
              Effect: "Allow",
              Principal: {
                Service: ["lambda.amazonaws.com"],
              },
              Action: ["sts:AssumeRole"],
            },
          ],
        },
        ManagedPolicyArns: ["arn:aws:iam::aws:policy/CloudWatchLogsFullAccess"],
        Policies: [
          {
            PolicyName: "DynamoDBPolicy",
            PolicyDocument: {
              Version: "2012-10-17",
              Statement: [
                {
                  Effect: "Allow",
                  Action: ["dynamodb:GetItem"],
                  Resource: [
                    createSubValue(
                      `arn:aws:dynamodb:\${AWS::Region}:\${AWS::AccountId}:table/SiteConfig`
                    ),
                  ],
                },
              ],
            },
          },
        ],
      },
    },
  });
}

function addRoleOutputs(cloudformation: Document.Parsed<ParsedNode>) {
  cloudformation.addIn(["Outputs"], {
    key: `${functionName}RoleArn`,
    value: {
      Value: createGetAttValue(`${functionName}Role.Arn`),
    },
  });
}

function updateCloudFormationMain() {
  const mainTemplatePath = `${cloudformationSrcPath}/template.yaml`;
  const cloudformation = parseCloudformation(mainTemplatePath);
  addMainFunctions(cloudformation);
  addMainPermissions(cloudformation);
  updateCloudFormation(mainTemplatePath, cloudformation);
}

function addMainFunctions(cloudformation: Document.Parsed<ParsedNode>) {
  cloudformation.addIn(
    ["Resources", "CosmosFunctions", "Properties", "Parameters"],
    {
      key: `${functionName}RoleArn`,
      value: createGetAttValue(`CosmosRole.Outputs.${functionName}RoleArn`),
    }
  );
}

function addMainPermissions(cloudformation: Document.Parsed<ParsedNode>) {
  cloudformation.addIn(
    ["Resources", "CosmosPermissions", "Properties", "Parameters"],
    {
      key: `${functionName}FunctionArn`,
      value: createGetAttValue(
        `CosmosFunctions.Outputs.${functionName}FunctionArn`
      ),
    }
  );
}

function updateSwagger() {
  const swaggerTemplatePath = `${cloudformationSrcPath}/swagger.yaml`;
  const swagger = parseCloudformation(swaggerTemplatePath);
  updateSwaggerInfo(swagger);
  updateCloudFormation(swaggerTemplatePath, swagger);
}

function updateSwaggerInfo(swagger: Document.Parsed<ParsedNode>) {
  let keyName = new Scalar(`${url}`);
  let path = ["paths"];
  let value: any = {
    tags: ["Auth"],
    operationId: `${functionName}Function`,
    summary: `${functionName}`,
    description: `${functionName}`,
    requestBody: {
      content: {
        ["application/json"]: {
          schema: {
            type: "object",
            properties: {
              SomeThing: {
                description: "Something",
                type: "string",
              },
            },
            required: ["SomeThing"],
          },
        },
      },
    },
    responses: {
      "200": {
        description: "Successful operation",
        content: {
          ["application/json"]: {
            schema: {
              $ref: "#/components/schemas/Success",
            },
          },
        },
      },
      "400": {
        description: "Error operation",
        content: {
          ["application/json"]: {
            schema: {
              oneOf: [
                {
                  $ref: "#/components/schemas/ParameterError",
                },
                {
                  $ref: "#/components/schemas/InternalError",
                },
              ],
            },
          },
        },
      },
    },
    ["x-amazon-apigateway-integration"]: {
      type: "aws_proxy",
      httpMethod: "POST",
      passthroughBehavior: "when_no_templates",
      uri: {
        "Fn::Sub": `arn:aws:apigateway:\${AWS::Region}:lambda:path/2015-03-31/functions/\${CosmosFunctions.Outputs.${functionName}FunctionArn}/invocations`,
      },
    },
  };
  if (swagger.getIn(["paths", url])) {
    path = ["paths", url];
    keyName = new Scalar(`${method.toLowerCase()}`);
  } else {
    value = {
      [method.toLowerCase()]: value,
    };
  }
  keyName.spaceBefore = true;
  swagger.addIn(path, {
    key: keyName,
    value: value,
  });
}

function parseCloudformation(templatePath: string) {
  const filePath = fs.readFileSync(templatePath).toString();
  return parseDocument(filePath);
}

function createRefValue(value: string) {
  return createNode(value, { tag: "!Ref", type: Scalar.PLAIN });
}

function createSubValue(value: string) {
  return createNode(value, { tag: "!Sub", type: Scalar.PLAIN });
}

function createGetAttValue(value: string) {
  return createNode(value, { tag: "!GetAtt", type: Scalar.PLAIN });
}

function createNode(
  value: string,
  options: {
    spaceBefore?: boolean;
    tag?: string;
    type?: Scalar.PLAIN | Scalar.QUOTE_DOUBLE;
  }
) {
  const node = new Scalar(value);
  const { spaceBefore, tag, type } = options;
  node.spaceBefore = !!spaceBefore;
  if (tag) node.tag = tag;
  if (type) node.type = type;

  return node;
}

function updateCloudFormation(
  templatePath: string,
  cloudFormation: Document.Parsed<ParsedNode>
) {
  fs.writeFileSync(templatePath, stringify(cloudFormation, { lineWidth: 0 }));
}
