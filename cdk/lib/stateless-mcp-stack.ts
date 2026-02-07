import * as path from 'path';
import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';

const PROJECT_NAME = 'stateless-mcp-on-lambda';
const LAMBDA_ADAPTER_LAYER_ARN =
  'arn:aws:lambda:us-east-1:753240598075:layer:LambdaAdapterLayerX86:25';

export class StatelessMcpStack extends cdk.Stack {
  public readonly mcpEndpoint: string;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const region = this.region;

    // Lambda Adapter layer (region-specific ARN)
    const lambdaAdapterLayer = lambda.LayerVersion.fromLayerVersionArn(
      this,
      'LambdaAdapterLayer',
      LAMBDA_ADAPTER_LAYER_ARN.replace('us-east-1', region)
    );

    // --- Authorizer Lambda ---
    const authorizerLambda = new lambda.Function(this, 'Authorizer', {
      functionName: `${PROJECT_NAME}-authorizer`,
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../../src/authorizer')),
      memorySize: 256,
      timeout: cdk.Duration.seconds(5),
    });

    // --- MCP Server Lambda ---
    const mcpServerLambda = new lambda.Function(this, 'McpServer', {
      functionName: PROJECT_NAME,
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'run.sh',
      code: lambda.Code.fromAsset(path.join(__dirname, '../../src/mcpserver')),
      memorySize: 512,
      timeout: cdk.Duration.seconds(10),
      layers: [lambdaAdapterLayer],
      environment: {
        AWS_LWA_PORT: '3000',
        AWS_LAMBDA_EXEC_WRAPPER: '/opt/bootstrap',
      },
    });

    // --- API Gateway ---
    const api = new apigateway.RestApi(this, 'Api', {
      restApiName: PROJECT_NAME,
      deployOptions: {
        stageName: 'dev',
      },
    });

    const tokenAuthorizer = new apigateway.TokenAuthorizer(this, 'McpAuthorizer', {
      handler: authorizerLambda,
      identitySource: apigateway.IdentitySource.header('Authorization'),
      resultsCacheTtl: cdk.Duration.seconds(0),
    });

    const mcpResource = api.root.addResource('mcp');
    const integration = new apigateway.LambdaIntegration(mcpServerLambda, {
      proxy: true,
    });

    // ANY /mcp - use NONE for no auth (switch to tokenAuthorizer to enable auth)
    mcpResource.addMethod('ANY', integration, {
      authorizationType: apigateway.AuthorizationType.NONE,
      // To enable custom authorizer, change to:
      // authorizationType: apigateway.AuthorizationType.CUSTOM,
      // authorizer: tokenAuthorizer,
    });

    this.mcpEndpoint = `${api.url}mcp`;
    new cdk.CfnOutput(this, 'McpEndpoint', {
      value: this.mcpEndpoint,
      description: 'MCP server endpoint URL',
      exportName: 'StatelessMcpEndpoint',
    });
  }
}
