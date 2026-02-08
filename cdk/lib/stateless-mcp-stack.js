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
        // Use NONE for no auth. To enable the token authorizer: create TokenAuthorizer with api as scope,
        // then use authorizationType: CUSTOM and authorizer: tokenAuthorizer on addMethod.
        mcpResource.addMethod("ANY", integration, {
            authorizationType: apigateway.AuthorizationType.NONE,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdGVsZXNzLW1jcC1zdGFjay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInN0YXRlbGVzcy1tY3Atc3RhY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSwyQ0FBNkI7QUFDN0IsaURBQW1DO0FBQ25DLCtEQUFpRDtBQUNqRCx1RUFBeUQ7QUFFekQsMkNBQTRDO0FBRTVDLE1BQU0sd0JBQXdCLEdBQzVCLHNFQUFzRSxDQUFDO0FBT3pFLE1BQWEsaUJBQWtCLFNBQVEsR0FBRyxDQUFDLEtBQUs7SUFHOUMsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUE2QjtRQUNyRSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV4QixNQUFNLEtBQUssR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDO1FBQzFCLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7UUFDM0IsTUFBTSxNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsU0FBUyxJQUFJLE1BQU0sRUFBRSxDQUFDO1FBRTdDLDZDQUE2QztRQUM3QyxNQUFNLGtCQUFrQixHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUMsbUJBQW1CLENBQ2hFLElBQUksRUFDSixvQkFBb0IsRUFDcEIsd0JBQXdCLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRSxNQUFNLENBQUMsQ0FDdEQsQ0FBQztRQUVGLE1BQU0scUJBQXFCLEdBQUc7WUFDNUIsa0JBQWtCLEVBQUUsS0FBSyxDQUFDLGdCQUFnQjtTQUMzQyxDQUFDO1FBRUYsNEJBQTRCO1FBQzVCLE1BQU0sZ0JBQWdCLEdBQUcsSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxZQUFZLEVBQUU7WUFDL0QsWUFBWSxFQUFFLElBQUEseUJBQWEsRUFBQyxZQUFZLEVBQUUsTUFBTSxDQUFDO1lBQ2pELE9BQU8sRUFBRSxNQUFNLENBQUMsT0FBTyxDQUFDLFdBQVc7WUFDbkMsT0FBTyxFQUFFLGVBQWU7WUFDeEIsSUFBSSxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLHNCQUFzQixDQUFDLENBQUM7WUFDekUsVUFBVSxFQUFFLEdBQUc7WUFDZixPQUFPLEVBQUUsR0FBRyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1lBQ2hDLFdBQVcsRUFBRSxxQkFBcUI7U0FDbkMsQ0FBQyxDQUFDO1FBRUgsNEJBQTRCO1FBQzVCLE1BQU0sZUFBZSxHQUFHLElBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsV0FBVyxFQUFFO1lBQzdELFlBQVksRUFBRSxJQUFBLHlCQUFhLEVBQUMsV0FBVyxFQUFFLE1BQU0sQ0FBQztZQUNoRCxPQUFPLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxXQUFXO1lBQ25DLE9BQU8sRUFBRSxRQUFRO1lBQ2pCLElBQUksRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxxQkFBcUIsQ0FBQyxDQUFDO1lBQ3hFLFVBQVUsRUFBRSxHQUFHO1lBQ2YsT0FBTyxFQUFFLEdBQUcsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQztZQUNqQyxNQUFNLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQztZQUM1QixXQUFXLEVBQUU7Z0JBQ1gsWUFBWSxFQUFFLE1BQU07Z0JBQ3BCLHVCQUF1QixFQUFFLGdCQUFnQjthQUMxQztTQUNGLENBQUMsQ0FBQztRQUVILHNCQUFzQjtRQUN0QixNQUFNLEdBQUcsR0FBRyxJQUFJLFVBQVUsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRTtZQUM5QyxXQUFXLEVBQUUsSUFBQSx5QkFBYSxFQUFDLFNBQVMsRUFBRSxNQUFNLENBQUM7WUFDN0MsYUFBYSxFQUFFO2dCQUNiLFNBQVMsRUFBRSxLQUFLO2FBQ2pCO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsTUFBTSxXQUFXLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDaEQsTUFBTSxXQUFXLEdBQUcsSUFBSSxVQUFVLENBQUMsaUJBQWlCLENBQUMsZUFBZSxFQUFFO1lBQ3BFLEtBQUssRUFBRSxJQUFJO1NBQ1osQ0FBQyxDQUFDO1FBRUgsa0dBQWtHO1FBQ2xHLG1GQUFtRjtRQUNuRixXQUFXLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxXQUFXLEVBQUU7WUFDeEMsaUJBQWlCLEVBQUUsVUFBVSxDQUFDLGlCQUFpQixDQUFDLElBQUk7U0FDckQsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLFdBQVcsR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEtBQUssQ0FBQztRQUNuQyxJQUFJLEdBQUcsQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLGFBQWEsRUFBRTtZQUNyQyxLQUFLLEVBQUUsSUFBSSxDQUFDLFdBQVc7WUFDdkIsV0FBVyxFQUFFLHlCQUF5QjtZQUN0QyxVQUFVLEVBQUUsSUFBQSx5QkFBYSxFQUFDLGFBQWEsRUFBRSxNQUFNLENBQUM7U0FDakQsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUNGO0FBekVELDhDQXlFQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIHBhdGggZnJvbSBcInBhdGhcIjtcbmltcG9ydCAqIGFzIGNkayBmcm9tIFwiYXdzLWNkay1saWJcIjtcbmltcG9ydCAqIGFzIGxhbWJkYSBmcm9tIFwiYXdzLWNkay1saWIvYXdzLWxhbWJkYVwiO1xuaW1wb3J0ICogYXMgYXBpZ2F0ZXdheSBmcm9tIFwiYXdzLWNkay1saWIvYXdzLWFwaWdhdGV3YXlcIjtcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gXCJjb25zdHJ1Y3RzXCI7XG5pbXBvcnQgeyBhcHBlbmRfcHJlZml4IH0gZnJvbSBcIi4vdXRpbGl0aWVzXCI7XG5cbmNvbnN0IExBTUJEQV9BREFQVEVSX0xBWUVSX0FSTiA9XG4gIFwiYXJuOmF3czpsYW1iZGE6dXMtZWFzdC0xOjc1MzI0MDU5ODA3NTpsYXllcjpMYW1iZGFBZGFwdGVyTGF5ZXJYODY6MjVcIjtcblxuZXhwb3J0IGludGVyZmFjZSBTdGF0ZWxlc3NNY3BTdGFja1Byb3BzIGV4dGVuZHMgY2RrLlN0YWNrUHJvcHMge1xuICBzdGFnZTogc3RyaW5nO1xuICBtYW5hZ2VtZW50QXBpS2V5OiBzdHJpbmc7XG59XG5cbmV4cG9ydCBjbGFzcyBTdGF0ZWxlc3NNY3BTdGFjayBleHRlbmRzIGNkay5TdGFjayB7XG4gIHB1YmxpYyByZWFkb25seSBtY3BFbmRwb2ludDogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBTdGF0ZWxlc3NNY3BTdGFja1Byb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG5cbiAgICBjb25zdCBzdGFnZSA9IHByb3BzLnN0YWdlO1xuICAgIGNvbnN0IHJlZ2lvbiA9IHRoaXMucmVnaW9uO1xuICAgIGNvbnN0IHByZWZpeCA9IGAke3RoaXMuc3RhY2tOYW1lfS0ke3JlZ2lvbn1gO1xuXG4gICAgLy8gTGFtYmRhIEFkYXB0ZXIgbGF5ZXIgKHJlZ2lvbi1zcGVjaWZpYyBBUk4pXG4gICAgY29uc3QgbGFtYmRhQWRhcHRlckxheWVyID0gbGFtYmRhLkxheWVyVmVyc2lvbi5mcm9tTGF5ZXJWZXJzaW9uQXJuKFxuICAgICAgdGhpcyxcbiAgICAgIFwiTGFtYmRhQWRhcHRlckxheWVyXCIsXG4gICAgICBMQU1CREFfQURBUFRFUl9MQVlFUl9BUk4ucmVwbGFjZShcInVzLWVhc3QtMVwiLCByZWdpb24pXG4gICAgKTtcblxuICAgIGNvbnN0IGF1dGhvcml6ZXJFbnZpcm9ubWVudCA9IHtcbiAgICAgIE1BTkFHRU1FTlRfQVBJX0tFWTogcHJvcHMubWFuYWdlbWVudEFwaUtleSxcbiAgICB9O1xuXG4gICAgLy8gLS0tIEF1dGhvcml6ZXIgTGFtYmRhIC0tLVxuICAgIGNvbnN0IGF1dGhvcml6ZXJMYW1iZGEgPSBuZXcgbGFtYmRhLkZ1bmN0aW9uKHRoaXMsIFwiQXV0aG9yaXplclwiLCB7XG4gICAgICBmdW5jdGlvbk5hbWU6IGFwcGVuZF9wcmVmaXgoXCJhdXRob3JpemVyXCIsIHByZWZpeCksXG4gICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMjJfWCxcbiAgICAgIGhhbmRsZXI6IFwiaW5kZXguaGFuZGxlclwiLFxuICAgICAgY29kZTogbGFtYmRhLkNvZGUuZnJvbUFzc2V0KHBhdGguam9pbihfX2Rpcm5hbWUsIFwiLi4vLi4vc3JjL2F1dGhvcml6ZXJcIikpLFxuICAgICAgbWVtb3J5U2l6ZTogMjU2LFxuICAgICAgdGltZW91dDogY2RrLkR1cmF0aW9uLnNlY29uZHMoNSksXG4gICAgICBlbnZpcm9ubWVudDogYXV0aG9yaXplckVudmlyb25tZW50LFxuICAgIH0pO1xuXG4gICAgLy8gLS0tIE1DUCBTZXJ2ZXIgTGFtYmRhIC0tLVxuICAgIGNvbnN0IG1jcFNlcnZlckxhbWJkYSA9IG5ldyBsYW1iZGEuRnVuY3Rpb24odGhpcywgXCJNY3BTZXJ2ZXJcIiwge1xuICAgICAgZnVuY3Rpb25OYW1lOiBhcHBlbmRfcHJlZml4KFwibWNwc2VydmVyXCIsIHByZWZpeCksXG4gICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMjJfWCxcbiAgICAgIGhhbmRsZXI6IFwicnVuLnNoXCIsXG4gICAgICBjb2RlOiBsYW1iZGEuQ29kZS5mcm9tQXNzZXQocGF0aC5qb2luKF9fZGlybmFtZSwgXCIuLi8uLi9zcmMvbWNwc2VydmVyXCIpKSxcbiAgICAgIG1lbW9yeVNpemU6IDUxMixcbiAgICAgIHRpbWVvdXQ6IGNkay5EdXJhdGlvbi5zZWNvbmRzKDEwKSxcbiAgICAgIGxheWVyczogW2xhbWJkYUFkYXB0ZXJMYXllcl0sXG4gICAgICBlbnZpcm9ubWVudDoge1xuICAgICAgICBBV1NfTFdBX1BPUlQ6IFwiMzAwMFwiLFxuICAgICAgICBBV1NfTEFNQkRBX0VYRUNfV1JBUFBFUjogXCIvb3B0L2Jvb3RzdHJhcFwiLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vIC0tLSBBUEkgR2F0ZXdheSAtLS1cbiAgICBjb25zdCBhcGkgPSBuZXcgYXBpZ2F0ZXdheS5SZXN0QXBpKHRoaXMsIFwiQXBpXCIsIHtcbiAgICAgIHJlc3RBcGlOYW1lOiBhcHBlbmRfcHJlZml4KFwibWNwLWFwaVwiLCBwcmVmaXgpLFxuICAgICAgZGVwbG95T3B0aW9uczoge1xuICAgICAgICBzdGFnZU5hbWU6IHN0YWdlLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIGNvbnN0IG1jcFJlc291cmNlID0gYXBpLnJvb3QuYWRkUmVzb3VyY2UoXCJtY3BcIik7XG4gICAgY29uc3QgaW50ZWdyYXRpb24gPSBuZXcgYXBpZ2F0ZXdheS5MYW1iZGFJbnRlZ3JhdGlvbihtY3BTZXJ2ZXJMYW1iZGEsIHtcbiAgICAgIHByb3h5OiB0cnVlLFxuICAgIH0pO1xuXG4gICAgLy8gVXNlIE5PTkUgZm9yIG5vIGF1dGguIFRvIGVuYWJsZSB0aGUgdG9rZW4gYXV0aG9yaXplcjogY3JlYXRlIFRva2VuQXV0aG9yaXplciB3aXRoIGFwaSBhcyBzY29wZSxcbiAgICAvLyB0aGVuIHVzZSBhdXRob3JpemF0aW9uVHlwZTogQ1VTVE9NIGFuZCBhdXRob3JpemVyOiB0b2tlbkF1dGhvcml6ZXIgb24gYWRkTWV0aG9kLlxuICAgIG1jcFJlc291cmNlLmFkZE1ldGhvZChcIkFOWVwiLCBpbnRlZ3JhdGlvbiwge1xuICAgICAgYXV0aG9yaXphdGlvblR5cGU6IGFwaWdhdGV3YXkuQXV0aG9yaXphdGlvblR5cGUuTk9ORSxcbiAgICB9KTtcblxuICAgIHRoaXMubWNwRW5kcG9pbnQgPSBgJHthcGkudXJsfW1jcGA7XG4gICAgbmV3IGNkay5DZm5PdXRwdXQodGhpcywgXCJNY3BFbmRwb2ludFwiLCB7XG4gICAgICB2YWx1ZTogdGhpcy5tY3BFbmRwb2ludCxcbiAgICAgIGRlc2NyaXB0aW9uOiBcIk1DUCBzZXJ2ZXIgZW5kcG9pbnQgVVJMXCIsXG4gICAgICBleHBvcnROYW1lOiBhcHBlbmRfcHJlZml4KFwiTWNwRW5kcG9pbnRcIiwgcHJlZml4KSxcbiAgICB9KTtcbiAgfVxufVxuIl19