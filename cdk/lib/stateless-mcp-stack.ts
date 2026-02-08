import * as path from "path";
import * as cdk from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import { Construct } from "constructs";
import { append_prefix } from "./utilities";

const LAMBDA_ADAPTER_LAYER_ARN =
  "arn:aws:lambda:us-east-1:753240598075:layer:LambdaAdapterLayerX86:25";

export interface StatelessMcpStackProps extends cdk.StackProps {
  stage: string;
}

export class StatelessMcpStack extends cdk.Stack {
  public readonly mcpEndpoint: string;

  constructor(scope: Construct, id: string, props: StatelessMcpStackProps) {
    super(scope, id, props);

    const stage = props.stage;
    const region = this.region;
    const prefix = `${this.stackName}-${region}`;

    // Lambda Adapter layer (region-specific ARN)
    const lambdaAdapterLayer = lambda.LayerVersion.fromLayerVersionArn(
      this,
      "LambdaAdapterLayer",
      LAMBDA_ADAPTER_LAYER_ARN.replace("us-east-1", region)
    );

    // --- Authorizer Lambda ---
    const authorizerLambda = new lambda.Function(this, "Authorizer", {
      functionName: append_prefix("authorizer", prefix),
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: "index.handler",
      code: lambda.Code.fromAsset(path.join(__dirname, "../../src/authorizer")),
      memorySize: 256,
      timeout: cdk.Duration.seconds(5),
    });

    // --- MCP Server Lambda ---
    const mcpServerLambda = new lambda.Function(this, "McpServer", {
      functionName: append_prefix("mcpserver", prefix),
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: "run.sh",
      code: lambda.Code.fromAsset(path.join(__dirname, "../../src/mcpserver")),
      memorySize: 512,
      timeout: cdk.Duration.seconds(10),
      layers: [lambdaAdapterLayer],
      environment: {
        AWS_LWA_PORT: "3000",
        AWS_LAMBDA_EXEC_WRAPPER: "/opt/bootstrap",
      },
    });

    // --- API Gateway ---
    const api = new apigateway.RestApi(this, "Api", {
      restApiName: append_prefix("mcp-api", prefix),
      deployOptions: {
        stageName: stage,
      },
    });

    const mcpResource = api.root.addResource("mcp");
    const integration = new apigateway.LambdaIntegration(mcpServerLambda, {
      proxy: true,
    });

    // Use NONE for no auth. To enable the token authorizer: create TokenAuthorizer with api as scope,
    // then use authorizationType: CUSTOM and authorizer: tokenAuthorizer on addMethod.
    mcpResource.addMethod("ANY", integration, {
      authorizationType: apigateway.AuthorizationType.NONE,
    });

    this.mcpEndpoint = `${api.url}mcp`;
    new cdk.CfnOutput(this, "McpEndpoint", {
      value: this.mcpEndpoint,
      description: "MCP server endpoint URL",
      exportName: append_prefix("McpEndpoint", prefix),
    });
  }
}
