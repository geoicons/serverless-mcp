"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatelessMcpStack = void 0;
const path = __importStar(require("path"));
const cdk = __importStar(require("aws-cdk-lib"));
const lambda = __importStar(require("aws-cdk-lib/aws-lambda"));
const apigateway = __importStar(require("aws-cdk-lib/aws-apigateway"));
const utilities_1 = require("./utilities");
const LAMBDA_ADAPTER_LAYER_ARN = "arn:aws:lambda:us-east-1:753240598075:layer:LambdaAdapterLayerX86:25";
class StatelessMcpStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const stage = props.stage;
        const region = this.region;
        const prefix = `${this.stackName}-${region}`;
        // Lambda Adapter layer (region-specific ARN)
        const lambdaAdapterLayer = lambda.LayerVersion.fromLayerVersionArn(this, "LambdaAdapterLayer", LAMBDA_ADAPTER_LAYER_ARN.replace("us-east-1", region));
        const authorizerEnvironment = {
            MANAGEMENT_API_KEY: props.managementApiKey,
        };
        // --- Authorizer Lambda ---
        const authorizerLambda = new lambda.Function(this, "Authorizer", {
            functionName: (0, utilities_1.append_prefix)("authorizer", prefix),
            runtime: lambda.Runtime.NODEJS_22_X,
            handler: "index.handler",
            code: lambda.Code.fromAsset(path.join(__dirname, "../../src/authorizer")),
            memorySize: 256,
            timeout: cdk.Duration.seconds(5),
            environment: authorizerEnvironment,
        });
        // --- MCP Server Lambda ---
        const mcpServerLambda = new lambda.Function(this, "McpServer", {
            functionName: (0, utilities_1.append_prefix)("mcpserver", prefix),
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
            restApiName: (0, utilities_1.append_prefix)("mcp-api", prefix),
            deployOptions: {
                stageName: stage,
            },
        });
        const mcpResource = api.root.addResource("mcp");
        const integration = new apigateway.LambdaIntegration(mcpServerLambda, {
            proxy: true,
        });
        const tokenAuthorizer = props.authorizationEnabled
            ? new apigateway.TokenAuthorizer(api, "McpAuthorizer", {
                handler: authorizerLambda,
                identitySource: apigateway.IdentitySource.header("Authorization"),
                resultsCacheTtl: cdk.Duration.seconds(0),
            })
            : undefined;
        mcpResource.addMethod("ANY", integration, {
            authorizationType: props.authorizationEnabled
                ? apigateway.AuthorizationType.CUSTOM
                : apigateway.AuthorizationType.NONE,
            ...(tokenAuthorizer && { authorizer: tokenAuthorizer }),
        });
        this.mcpEndpoint = `${api.url}mcp`;
        new cdk.CfnOutput(this, "McpEndpoint", {
            value: this.mcpEndpoint,
            description: "MCP server endpoint URL",
            exportName: (0, utilities_1.append_prefix)("McpEndpoint", prefix),
        });
    }
}
exports.StatelessMcpStack = StatelessMcpStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdGVsZXNzLW1jcC1zdGFjay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInN0YXRlbGVzcy1tY3Atc3RhY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSwyQ0FBNkI7QUFDN0IsaURBQW1DO0FBQ25DLCtEQUFpRDtBQUNqRCx1RUFBeUQ7QUFFekQsMkNBQTRDO0FBRTVDLE1BQU0sd0JBQXdCLEdBQzVCLHNFQUFzRSxDQUFDO0FBU3pFLE1BQWEsaUJBQWtCLFNBQVEsR0FBRyxDQUFDLEtBQUs7SUFHOUMsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUE2QjtRQUNyRSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV4QixNQUFNLEtBQUssR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDO1FBQzFCLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7UUFDM0IsTUFBTSxNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsU0FBUyxJQUFJLE1BQU0sRUFBRSxDQUFDO1FBRTdDLDZDQUE2QztRQUM3QyxNQUFNLGtCQUFrQixHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUMsbUJBQW1CLENBQ2hFLElBQUksRUFDSixvQkFBb0IsRUFDcEIsd0JBQXdCLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRSxNQUFNLENBQUMsQ0FDdEQsQ0FBQztRQUVGLE1BQU0scUJBQXFCLEdBQUc7WUFDNUIsa0JBQWtCLEVBQUUsS0FBSyxDQUFDLGdCQUFnQjtTQUMzQyxDQUFDO1FBRUYsNEJBQTRCO1FBQzVCLE1BQU0sZ0JBQWdCLEdBQUcsSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxZQUFZLEVBQUU7WUFDL0QsWUFBWSxFQUFFLElBQUEseUJBQWEsRUFBQyxZQUFZLEVBQUUsTUFBTSxDQUFDO1lBQ2pELE9BQU8sRUFBRSxNQUFNLENBQUMsT0FBTyxDQUFDLFdB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TCxDQUFDO0NBQ0Y7QUFsRkQsOENBa0ZDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgcGF0aCBmcm9tIFwicGF0aFwiO1xuaW1wb3J0ICogYXMgY2RrIGZyb20gXCJhd3MtY2RrLWxpYlwiO1xuaW1wb3J0ICogYXMgbGFtYmRhIGZyb20gXCJhd3MtY2RrLWxpYi9hd3MtbGFtYmRhXCI7XG5pbXBvcnQgKiBhcyBhcGlnYXRld2F5IGZyb20gXCJhd3MtY2RrLWxpYi9hd3MtYXBpZ2F0ZXdheVwiO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSBcImNvbnN0cnVjdHNcIjtcbmltcG9ydCB7IGFwcGVuZF9wcmVmaXggfSBmcm9tIFwiLi91dGlsaXRpZXNcIjtcblxuY29uc3QgTEFNQkRBX0FEQVBURVJfTEFZRVJfQVJOID1cbiAgXCJhcm46YXdzOmxhbWJkYTp1cy1lYXN0LTE6NzUzMjQwNTk4MDc1OmxheWVyOkxhbWJkYUFkYXB0ZXJMYXllclg4NjoyNVwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIFN0YXRlbGVzc01jcFN0YWNrUHJvcHMgZXh0ZW5kcyBjZGsuU3RhY2tQcm9wcyB7XG4gIHN0YWdlOiBzdHJpbmc7XG4gIG1hbmFnZW1lbnRBcGlLZXk6IHN0cmluZztcbiAgLyoqIFdoZW4gdHJ1ZSwgdGhlIC9tY3Agcm91dGUgdXNlcyB0aGUgdG9rZW4gYXV0aG9yaXplciBMYW1iZGE7IHdoZW4gZmFsc2UsIG5vIGF1dGggKE5PTkUpLiAqL1xuICBhdXRob3JpemF0aW9uRW5hYmxlZDogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGNsYXNzIFN0YXRlbGVzc01jcFN0YWNrIGV4dGVuZHMgY2RrLlN0YWNrIHtcbiAgcHVibGljIHJlYWRvbmx5IG1jcEVuZHBvaW50OiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IFN0YXRlbGVzc01jcFN0YWNrUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcblxuICAgIGNvbnN0IHN0YWdlID0gcHJvcHMuc3RhZ2U7XG4gICAgY29uc3QgcmVnaW9uID0gdGhpcy5yZWdpb247XG4gICAgY29uc3QgcHJlZml4ID0gYCR7dGhpcy5zdGFja05hbWV9LSR7cmVnaW9ufWA7XG5cbiAgICAvLyBMYW1iZGEgQWRhcHRlciBsYXllciAocmVnaW9uLXNwZWNpZmljIEFSTilcbiAgICBjb25zdCBsYW1iZGFBZGFwdGVyTGF5ZXIgPSBsYW1iZGEuTGF5ZXJWZXJzaW9uLmZyb21MYXllclZlcnNpb25Bcm4oXG4gICAgICB0aGlzLFxuICAgICAgXCJMYW1iZGFBZGFwdGVyTGF5ZXJcIixcbiAgICAgIExBTUJEQV9BREFQVEVSX0xBWUVSX0FSTi5yZXBsYWNlKFwidXMtZWFzdC0xXCIsIHJlZ2lvbilcbiAgICApO1xuXG4gICAgY29uc3QgYXV0aG9yaXplckVudmlyb25tZW50ID0ge1xuICAgICAgTUFOQUdFTUVOVF9BUElfS0VZOiBwcm9wcy5tYW5hZ2VtZW50QXBpS2V5LFxuICAgIH07XG5cbiAgICAvLyAtLS0gQXV0aG9yaXplciBMYW1iZGEgLS0tXG4gICAgY29uc3QgYXV0aG9yaXplckxhbWJkYSA9IG5ldyBsYW1iZGEuRnVuY3Rpb24odGhpcywgXCJBdXRob3JpemVyXCIsIHtcbiAgICAgIGZ1bmN0aW9uTmFtZTogYXBwZW5kX3ByZWZpeChcImF1dGhvcml6ZXJcIiwgcHJlZml4KSxcbiAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLk5PREVKU18yMl9YLFxuICAgICAgaGFuZGxlcjogXCJpbmRleC5oYW5kbGVyXCIsXG4gICAgICBjb2RlOiBsYW1iZGEuQ29kZS5mcm9tQXNzZXQocGF0aC5qb2luKF9fZGlybmFtZSwgXCIuLi8uLi9zcmMvYXV0aG9yaXplclwiKSksXG4gICAgICBtZW1vcnlTaXplOiAyNTYsXG4gICAgICB0aW1lb3V0OiBjZGsuRHVyYXRpb24uc2Vjb25kcyg1KSxcbiAgICAgIGVudmlyb25tZW50OiBhdXRob3JpemVyRW52aXJvbm1lbnQsXG4gICAgfSk7XG5cbiAgICAvLyAtLS0gTUNQIFNlcnZlciBMYW1iZGEgLS0tXG4gICAgY29uc3QgbWNwU2VydmVyTGFtYmRhID0gbmV3IGxhbWJkYS5GdW5jdGlvbih0aGlzLCBcIk1jcFNlcnZlclwiLCB7XG4gICAgICBmdW5jdGlvbk5hbWU6IGFwcGVuZF9wcmVmaXgoXCJtY3BzZXJ2ZXJcIiwgcHJlZml4KSxcbiAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLk5PREVKU18yMl9YLFxuICAgICAgaGFuZGxlcjogXCJydW4uc2hcIixcbiAgICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21Bc3NldChwYXRoLmpvaW4oX19kaXJuYW1lLCBcIi4uLy4uL3NyYy9tY3BzZXJ2ZXJcIikpLFxuICAgICAgbWVtb3J5U2l6ZTogNTEyLFxuICAgICAgdGltZW91dDogY2RrLkR1cmF0aW9uLnNlY29uZHMoMTApLFxuICAgICAgbGF5ZXJzOiBbbGFtYmRhQWRhcHRlckxheWVyXSxcbiAgICAgIGVudmlyb25tZW50OiB7XG4gICAgICAgIEFXU19MV0FfUE9SVDogXCIzMDAwXCIsXG4gICAgICAgIEFXU19MQU1CREFfRVhFQ19XUkFQUEVSOiBcIi9vcHQvYm9vdHN0cmFwXCIsXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8gLS0tIEFQSSBHYXRld2F5IC0tLVxuICAgIGNvbnN0IGFwaSA9IG5ldyBhcGlnYXRld2F5LlJlc3RBcGkodGhpcywgXCJBcGlcIiwge1xuICAgICAgcmVzdEFwaU5hbWU6IGFwcGVuZF9wcmVmaXgoXCJtY3AtYXBpXCIsIHByZWZpeCksXG4gICAgICBkZXBsb3lPcHRpb25zOiB7XG4gICAgICAgIHN0YWdlTmFtZTogc3RhZ2UsXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgY29uc3QgbWNwUmVzb3VyY2UgPSBhcGkucm9vdC5hZGRSZXNvdXJjZShcIm1jcFwiKTtcbiAgICBjb25zdCBpbnRlZ3JhdGlvbiA9IG5ldyBhcGlnYXRld2F5LkxhbWJkYUludGVncmF0aW9uKG1jcFNlcnZlckxhbWJkYSwge1xuICAgICAgcHJveHk6IHRydWUsXG4gICAgfSk7XG5cbiAgICBjb25zdCB0b2tlbkF1dGhvcml6ZXIgPSBwcm9wcy5hdXRob3JpemF0aW9uRW5hYmxlZFxuICAgICAgPyBuZXcgYXBpZ2F0ZXdheS5Ub2tlbkF1dGhvcml6ZXIoYXBpLCBcIk1jcEF1dGhvcml6ZXJcIiwge1xuICAgICAgICAgIGhhbmRsZXI6IGF1dGhvcml6ZXJMYW1iZGEsXG4gICAgICAgICAgaWRlbnRpdHlTb3VyY2U6IGFwaWdhdGV3YXkuSWRlbnRpdHlTb3VyY2UuaGVhZGVyKFwiQXV0aG9yaXphdGlvblwiKSxcbiAgICAgICAgICByZXN1bHRzQ2FjaGVUdGw6IGNkay5EdXJhdGlvbi5zZWNvbmRzKDApLFxuICAgICAgICB9KVxuICAgICAgOiB1bmRlZmluZWQ7XG5cbiAgICBtY3BSZXNvdXJjZS5hZGRNZXRob2QoXCJBTllcIiwgaW50ZWdyYXRpb24sIHtcbiAgICAgIGF1dGhvcml6YXRpb25UeXBlOiBwcm9wcy5hdXRob3JpemF0aW9uRW5hYmxlZFxuICAgICAgICA/IGFwaWdhdGV3YXkuQXV0aG9yaXphdGlvblR5cGUuQ1VTVE9NXG4gICAgICAgIDogYXBpZ2F0ZXdheS5BdXRob3JpemF0aW9uVHlwZS5OT05FLFxuICAgICAgLi4uKHRva2VuQXV0aG9yaXplciAmJiB7IGF1dGhvcml6ZXI6IHRva2VuQXV0aG9yaXplciB9KSxcbiAgICB9KTtcblxuICAgIHRoaXMubWNwRW5kcG9pbnQgPSBgJHthcGkudXJsfW1jcGA7XG4gICAgbmV3IGNkay5DZm5PdXRwdXQodGhpcywgXCJNY3BFbmRwb2ludFwiLCB7XG4gICAgICB2YWx1ZTogdGhpcy5tY3BFbmRwb2ludCxcbiAgICAgIGRlc2NyaXB0aW9uOiBcIk1DUCBzZXJ2ZXIgZW5kcG9pbnQgVVJMXCIsXG4gICAgICBleHBvcnROYW1lOiBhcHBlbmRfcHJlZml4KFwiTWNwRW5kcG9pbnRcIiwgcHJlZml4KSxcbiAgICB9KTtcbiAgfVxufVxuIl19