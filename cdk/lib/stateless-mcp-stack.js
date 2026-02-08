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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdGVsZXNzLW1jcC1zdGFjay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInN0YXRlbGVzcy1tY3Atc3RhY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSwyQ0FBNkI7QUFDN0IsaURBQW1DO0FBQ25DLCtEQUFpRDtBQUNqRCx1RUFBeUQ7QUFFekQsMkNBQTRDO0FBRTVDLE1BQU0sd0JBQXdCLEdBQzVCLHNFQUFzRSxDQUFDO0FBU3pFLE1BQWEsaUJBQWtCLFNBQVEsR0FBRyxDQUFDLEtBQUs7SUFHOUMsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUE2QjtRQUNyRSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV4QixNQUFNLEtBQUssR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDO1FBQzFCLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7UUFDM0IsTUFBTSxNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsU0FBUyxJQUFJLE1BQU0sRUFBRSxDQUFDO1FBRTdDLDZDQUE2QztRQUM3QyxNQUFNLGtCQUFrQixHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUMsbUJBQW1CLENBQ2hFLElBQUksRUFDSixvQkFBb0IsRUFDcEIsd0JBQXdCLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRSxNQUFNLENBQUMsQ0FDdEQsQ0FBQztRQUVGLE1BQU0scUJBQXFCLEdBQUc7WUFDNUIsa0JBQWtCLEVBQUUsS0FBSyxDQUFDLGdCQUFnQjtTQUMzQyxDQUFDO1FBRUYsNEJBQTRCO1FBQzVCLE1BQU0sZ0JBQWdCLEdBQUcsSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxZQUFZLEVBQUU7WUFDL0QsWUFBWSxFQUFFLElBQUEseUJBQWEsRUFBQyxZQUFZLEVBQUUsTUFBTSxDQUFDO1lBQ2pELE9BQU8sRUFBRSxNQUFNLENBQUMsT0FBTyxDQUFDLFdB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TCxDQUFDO0NBQ0Y7QUFsRkQsOENBa0ZDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgcGF0aCBmcm9tIFwicGF0aFwiO1xyXG5pbXBvcnQgKiBhcyBjZGsgZnJvbSBcImF3cy1jZGstbGliXCI7XHJcbmltcG9ydCAqIGFzIGxhbWJkYSBmcm9tIFwiYXdzLWNkay1saWIvYXdzLWxhbWJkYVwiO1xyXG5pbXBvcnQgKiBhcyBhcGlnYXRld2F5IGZyb20gXCJhd3MtY2RrLWxpYi9hd3MtYXBpZ2F0ZXdheVwiO1xyXG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tIFwiY29uc3RydWN0c1wiO1xyXG5pbXBvcnQgeyBhcHBlbmRfcHJlZml4IH0gZnJvbSBcIi4vdXRpbGl0aWVzXCI7XHJcblxyXG5jb25zdCBMQU1CREFfQURBUFRFUl9MQVlFUl9BUk4gPVxyXG4gIFwiYXJuOmF3czpsYW1iZGE6dXMtZWFzdC0xOjc1MzI0MDU5ODA3NTpsYXllcjpMYW1iZGFBZGFwdGVyTGF5ZXJYODY6MjVcIjtcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgU3RhdGVsZXNzTWNwU3RhY2tQcm9wcyBleHRlbmRzIGNkay5TdGFja1Byb3BzIHtcclxuICBzdGFnZTogc3RyaW5nO1xyXG4gIG1hbmFnZW1lbnRBcGlLZXk6IHN0cmluZztcclxuICAvKiogV2hlbiB0cnVlLCB0aGUgL21jcCByb3V0ZSB1c2VzIHRoZSB0b2tlbiBhdXRob3JpemVyIExhbWJkYTsgd2hlbiBmYWxzZSwgbm8gYXV0aCAoTk9ORSkuICovXHJcbiAgYXV0aG9yaXphdGlvbkVuYWJsZWQ6IGJvb2xlYW47XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBTdGF0ZWxlc3NNY3BTdGFjayBleHRlbmRzIGNkay5TdGFjayB7XHJcbiAgcHVibGljIHJlYWRvbmx5IG1jcEVuZHBvaW50OiBzdHJpbmc7XHJcblxyXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBTdGF0ZWxlc3NNY3BTdGFja1Byb3BzKSB7XHJcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcclxuXHJcbiAgICBjb25zdCBzdGFnZSA9IHByb3BzLnN0YWdlO1xyXG4gICAgY29uc3QgcmVnaW9uID0gdGhpcy5yZWdpb247XHJcbiAgICBjb25zdCBwcmVmaXggPSBgJHt0aGlzLnN0YWNrTmFtZX0tJHtyZWdpb259YDtcclxuXHJcbiAgICAvLyBMYW1iZGEgQWRhcHRlciBsYXllciAocmVnaW9uLXNwZWNpZmljIEFSTilcclxuICAgIGNvbnN0IGxhbWJkYUFkYXB0ZXJMYXllciA9IGxhbWJkYS5MYXllclZlcnNpb24uZnJvbUxheWVyVmVyc2lvbkFybihcclxuICAgICAgdGhpcyxcclxuICAgICAgXCJMYW1iZGFBZGFwdGVyTGF5ZXJcIixcclxuICAgICAgTEFNQkRBX0FEQVBURVJfTEFZRVJfQVJOLnJlcGxhY2UoXCJ1cy1lYXN0LTFcIiwgcmVnaW9uKVxyXG4gICAgKTtcclxuXHJcbiAgICBjb25zdCBhdXRob3JpemVyRW52aXJvbm1lbnQgPSB7XHJcbiAgICAgIE1BTkFHRU1FTlRfQVBJX0tFWTogcHJvcHMubWFuYWdlbWVudEFwaUtleSxcclxuICAgIH07XHJcblxyXG4gICAgLy8gLS0tIEF1dGhvcml6ZXIgTGFtYmRhIC0tLVxyXG4gICAgY29uc3QgYXV0aG9yaXplckxhbWJkYSA9IG5ldyBsYW1iZGEuRnVuY3Rpb24odGhpcywgXCJBdXRob3JpemVyXCIsIHtcclxuICAgICAgZnVuY3Rpb25OYW1lOiBhcHBlbmRfcHJlZml4KFwiYXV0aG9yaXplclwiLCBwcmVmaXgpLFxyXG4gICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMjJfWCxcclxuICAgICAgaGFuZGxlcjogXCJpbmRleC5oYW5kbGVyXCIsXHJcbiAgICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21Bc3NldChwYXRoLmpvaW4oX19kaXJuYW1lLCBcIi4uLy4uL3NyYy9hdXRob3JpemVyXCIpKSxcclxuICAgICAgbWVtb3J5U2l6ZTogMjU2LFxyXG4gICAgICB0aW1lb3V0OiBjZGsuRHVyYXRpb24uc2Vjb25kcyg1KSxcclxuICAgICAgZW52aXJvbm1lbnQ6IGF1dGhvcml6ZXJFbnZpcm9ubWVudCxcclxuICAgIH0pO1xyXG5cclxuICAgIC8vIC0tLSBNQ1AgU2VydmVyIExhbWJkYSAtLS1cclxuICAgIGNvbnN0IG1jcFNlcnZlckxhbWJkYSA9IG5ldyBsYW1iZGEuRnVuY3Rpb24odGhpcywgXCJNY3BTZXJ2ZXJcIiwge1xyXG4gICAgICBmdW5jdGlvbk5hbWU6IGFwcGVuZF9wcmVmaXgoXCJtY3BzZXJ2ZXJcIiwgcHJlZml4KSxcclxuICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzIyX1gsXHJcbiAgICAgIGhhbmRsZXI6IFwicnVuLnNoXCIsXHJcbiAgICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21Bc3NldChwYXRoLmpvaW4oX19kaXJuYW1lLCBcIi4uLy4uL3NyYy9tY3BzZXJ2ZXJcIikpLFxyXG4gICAgICBtZW1vcnlTaXplOiA1MTIsXHJcbiAgICAgIHRpbWVvdXQ6IGNkay5EdXJhdGlvbi5zZWNvbmRzKDEwKSxcclxuICAgICAgbGF5ZXJzOiBbbGFtYmRhQWRhcHRlckxheWVyXSxcclxuICAgICAgZW52aXJvbm1lbnQ6IHtcclxuICAgICAgICBBV1NfTFdBX1BPUlQ6IFwiMzAwMFwiLFxyXG4gICAgICAgIEFXU19MQU1CREFfRVhFQ19XUkFQUEVSOiBcIi9vcHQvYm9vdHN0cmFwXCIsXHJcbiAgICAgIH0sXHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyAtLS0gQVBJIEdhdGV3YXkgLS0tXHJcbiAgICBjb25zdCBhcGkgPSBuZXcgYXBpZ2F0ZXdheS5SZXN0QXBpKHRoaXMsIFwiQXBpXCIsIHtcclxuICAgICAgcmVzdEFwaU5hbWU6IGFwcGVuZF9wcmVmaXgoXCJtY3AtYXBpXCIsIHByZWZpeCksXHJcbiAgICAgIGRlcGxveU9wdGlvbnM6IHtcclxuICAgICAgICBzdGFnZU5hbWU6IHN0YWdlLFxyXG4gICAgICB9LFxyXG4gICAgfSk7XHJcblxyXG4gICAgY29uc3QgbWNwUmVzb3VyY2UgPSBhcGkucm9vdC5hZGRSZXNvdXJjZShcIm1jcFwiKTtcclxuICAgIGNvbnN0IGludGVncmF0aW9uID0gbmV3IGFwaWdhdGV3YXkuTGFtYmRhSW50ZWdyYXRpb24obWNwU2VydmVyTGFtYmRhLCB7XHJcbiAgICAgIHByb3h5OiB0cnVlLFxyXG4gICAgfSk7XHJcblxyXG4gICAgY29uc3QgdG9rZW5BdXRob3JpemVyID0gcHJvcHMuYXV0aG9yaXphdGlvbkVuYWJsZWRcclxuICAgICAgPyBuZXcgYXBpZ2F0ZXdheS5Ub2tlbkF1dGhvcml6ZXIoYXBpLCBcIk1jcEF1dGhvcml6ZXJcIiwge1xyXG4gICAgICAgICAgaGFuZGxlcjogYXV0aG9yaXplckxhbWJkYSxcclxuICAgICAgICAgIGlkZW50aXR5U291cmNlOiBhcGlnYXRld2F5LklkZW50aXR5U291cmNlLmhlYWRlcihcIkF1dGhvcml6YXRpb25cIiksXHJcbiAgICAgICAgICByZXN1bHRzQ2FjaGVUdGw6IGNkay5EdXJhdGlvbi5zZWNvbmRzKDApLFxyXG4gICAgICAgIH0pXHJcbiAgICAgIDogdW5kZWZpbmVkO1xyXG5cclxuICAgIG1jcFJlc291cmNlLmFkZE1ldGhvZChcIkFOWVwiLCBpbnRlZ3JhdGlvbiwge1xyXG4gICAgICBhdXRob3JpemF0aW9uVHlwZTogcHJvcHMuYXV0aG9yaXphdGlvbkVuYWJsZWRcclxuICAgICAgICA/IGFwaWdhdGV3YXkuQXV0aG9yaXphdGlvblR5cGUuQ1VTVE9NXHJcbiAgICAgICAgOiBhcGlnYXRld2F5LkF1dGhvcml6YXRpb25UeXBlLk5PTkUsXHJcbiAgICAgIC4uLih0b2tlbkF1dGhvcml6ZXIgJiYgeyBhdXRob3JpemVyOiB0b2tlbkF1dGhvcml6ZXIgfSksXHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLm1jcEVuZHBvaW50ID0gYCR7YXBpLnVybH1tY3BgO1xyXG4gICAgbmV3IGNkay5DZm5PdXRwdXQodGhpcywgXCJNY3BFbmRwb2ludFwiLCB7XHJcbiAgICAgIHZhbHVlOiB0aGlzLm1jcEVuZHBvaW50LFxyXG4gICAgICBkZXNjcmlwdGlvbjogXCJNQ1Agc2VydmVyIGVuZHBvaW50IFVSTFwiLFxyXG4gICAgICBleHBvcnROYW1lOiBhcHBlbmRfcHJlZml4KFwiTWNwRW5kcG9pbnRcIiwgcHJlZml4KSxcclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG4iXX0=