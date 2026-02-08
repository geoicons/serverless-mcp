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
        // --- Authorizer Lambda ---
        const authorizerLambda = new lambda.Function(this, "Authorizer", {
            functionName: (0, utilities_1.append_prefix)("authorizer", prefix),
            runtime: lambda.Runtime.NODEJS_22_X,
            handler: "index.handler",
            code: lambda.Code.fromAsset(path.join(__dirname, "../../src/authorizer")),
            memorySize: 256,
            timeout: cdk.Duration.seconds(5),
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdGVsZXNzLW1jcC1zdGFjay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInN0YXRlbGVzcy1tY3Atc3RhY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSwyQ0FBNkI7QUFDN0IsaURBQW1DO0FBQ25DLCtEQUFpRDtBQUNqRCx1RUFBeUQ7QUFFekQsMkNBQTRDO0FBRTVDLE1BQU0sd0JBQXdCLEdBQzVCLHNFQUFzRSxDQUFDO0FBTXpFLE1BQWEsaUJBQWtCLFNBQVEsR0FBRyxDQUFDLEtBQUs7SUFHOUMsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUE2QjtRQUNyRSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV4QixNQUFNLEtBQUssR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDO1FBQzFCLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7UUFDM0IsTUFBTSxNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsU0FBUyxJQUFJLE1BQU0sRUFBRSxDQUFDO1FBRTdDLDZDQUE2QztRQUM3QyxNQUFNLGtCQUFrQixHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUMsbUJBQW1CLENBQ2hFLElBQUksRUFDSixvQkFBb0IsRUFDcEIsd0JBQXdCLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRSxNQUFNLENBQUMsQ0FDdEQsQ0FBQztRQUVGLDRCQUE0QjtRQUM1QixNQUFNLGdCQUFnQixHQUFHLElBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsWUFBWSxFQUFFO1lBQy9ELFlBQVksRUFBRSxJQUFBLHlCQUFhLEVBQUMsWUFBWSxFQUFFLE1BQU0sQ0FBQztZQUNqRCxPQUFPLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxXQUFXO1lBQ25DLE9BQU8sRUFBRSxlQUFlO1lBQ3hCLElBQUksRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxzQkFBc0IsQ0FBQyxDQUFDO1lBQ3pFLFVBQVUsRUFBRSxHQUFHO1lBQ2YsT0FBTyxFQUFFLEdBQUcsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztTQUNqQyxDQUFDLENBQUM7UUFFSCw0QkFBNEI7UUFDNUIsTUFBTSxlQUFlLEdBQUcsSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxXQUFXLEVBQUU7WUFDN0QsWUFBWSxFQUFFLElBQUEseUJBQWEsRUFBQyxXQUFXLEVBQUUsTUFBTSxDQUFDO1lBQ2hELE9BQU8sRUFBRSxNQUFNLENBQUMsT0FBTyxDQUFDLFdBQVc7WUFDbkMsT0FBTyxFQUFFLFFBQVE7WUFDakIsSUFBSSxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLHFCQUFxQixDQUFDLENBQUM7WUFDeEUsVUFBVSxFQUFFLEdBQUc7WUFDZixPQUFPLEVBQUUsR0FBRyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDO1lBQ2pDLE1BQU0sRUFBRSxDQUFDLGtCQUFrQixDQUFDO1lBQzVCLFdBQVcsRUFBRTtnQkFDWCxZQUFZLEVBQUUsTUFBTTtnQkFDcEIsdUJBQXVCLEVBQUUsZ0JBQWdCO2FBQzFDO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsc0JBQXNCO1FBQ3RCLE1BQU0sR0FBRyxHQUFHLElBQUksVUFBVSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFO1lBQzlDLFdBQVcsRUFBRSxJQUFBLHlCQUFhLEVBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQztZQUM3QyxhQUFhLEVBQUU7Z0JBQ2IsU0FBUyxFQUFFLEtBQUs7YUFDakI7U0FDRixDQUFDLENBQUM7UUFFSCxNQUFNLFdBQVcsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNoRCxNQUFNLFdBQVcsR0FBRyxJQUFJLFVBQVUsQ0FBQyxpQkFBaUIsQ0FBQyxlQUFlLEVBQUU7WUFDcEUsS0FBSyxFQUFFLElBQUk7U0FDWixDQUFDLENBQUM7UUFFSCxrR0FBa0c7UUFDbEcsbUZBQW1GO1FBQ25GLFdBQVcsQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLFdBQVcsRUFBRTtZQUN4QyxpQkFBaUIsRUFBRSxVQUFVLENBQUMsaUJBQWlCLENBQUMsSUFBSTtTQUNyRCxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsV0FBVyxHQUFHLEdBQUcsR0FBRyxDQUFDLEdBQUcsS0FBSyxDQUFDO1FBQ25DLElBQUksR0FBRyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsYUFBYSxFQUFFO1lBQ3JDLEtBQUssRUFBRSxJQUFJLENBQUMsV0FBVztZQUN2QixXQUFXLEVBQUUseUJBQXlCO1lBQ3RDLFVBQVUsRUFBRSxJQUFBLHlCQUFhLEVBQUMsYUFBYSxFQUFFLE1BQU0sQ0FBQztTQUNqRCxDQUFDLENBQUM7SUFDTCxDQUFDO0NBQ0Y7QUFwRUQsOENBb0VDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgcGF0aCBmcm9tIFwicGF0aFwiO1xuaW1wb3J0ICogYXMgY2RrIGZyb20gXCJhd3MtY2RrLWxpYlwiO1xuaW1wb3J0ICogYXMgbGFtYmRhIGZyb20gXCJhd3MtY2RrLWxpYi9hd3MtbGFtYmRhXCI7XG5pbXBvcnQgKiBhcyBhcGlnYXRld2F5IGZyb20gXCJhd3MtY2RrLWxpYi9hd3MtYXBpZ2F0ZXdheVwiO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSBcImNvbnN0cnVjdHNcIjtcbmltcG9ydCB7IGFwcGVuZF9wcmVmaXggfSBmcm9tIFwiLi91dGlsaXRpZXNcIjtcblxuY29uc3QgTEFNQkRBX0FEQVBURVJfTEFZRVJfQVJOID1cbiAgXCJhcm46YXdzOmxhbWJkYTp1cy1lYXN0LTE6NzUzMjQwNTk4MDc1OmxheWVyOkxhbWJkYUFkYXB0ZXJMYXllclg4NjoyNVwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIFN0YXRlbGVzc01jcFN0YWNrUHJvcHMgZXh0ZW5kcyBjZGsuU3RhY2tQcm9wcyB7XG4gIHN0YWdlOiBzdHJpbmc7XG59XG5cbmV4cG9ydCBjbGFzcyBTdGF0ZWxlc3NNY3BTdGFjayBleHRlbmRzIGNkay5TdGFjayB7XG4gIHB1YmxpYyByZWFkb25seSBtY3BFbmRwb2ludDogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBTdGF0ZWxlc3NNY3BTdGFja1Byb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG5cbiAgICBjb25zdCBzdGFnZSA9IHByb3BzLnN0YWdlO1xuICAgIGNvbnN0IHJlZ2lvbiA9IHRoaXMucmVnaW9uO1xuICAgIGNvbnN0IHByZWZpeCA9IGAke3RoaXMuc3RhY2tOYW1lfS0ke3JlZ2lvbn1gO1xuXG4gICAgLy8gTGFtYmRhIEFkYXB0ZXIgbGF5ZXIgKHJlZ2lvbi1zcGVjaWZpYyBBUk4pXG4gICAgY29uc3QgbGFtYmRhQWRhcHRlckxheWVyID0gbGFtYmRhLkxheWVyVmVyc2lvbi5mcm9tTGF5ZXJWZXJzaW9uQXJuKFxuICAgICAgdGhpcyxcbiAgICAgIFwiTGFtYmRhQWRhcHRlckxheWVyXCIsXG4gICAgICBMQU1CREFfQURBUFRFUl9MQVlFUl9BUk4ucmVwbGFjZShcInVzLWVhc3QtMVwiLCByZWdpb24pXG4gICAgKTtcblxuICAgIC8vIC0tLSBBdXRob3JpemVyIExhbWJkYSAtLS1cbiAgICBjb25zdCBhdXRob3JpemVyTGFtYmRhID0gbmV3IGxhbWJkYS5GdW5jdGlvbih0aGlzLCBcIkF1dGhvcml6ZXJcIiwge1xuICAgICAgZnVuY3Rpb25OYW1lOiBhcHBlbmRfcHJlZml4KFwiYXV0aG9yaXplclwiLCBwcmVmaXgpLFxuICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzIyX1gsXG4gICAgICBoYW5kbGVyOiBcImluZGV4LmhhbmRsZXJcIixcbiAgICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21Bc3NldChwYXRoLmpvaW4oX19kaXJuYW1lLCBcIi4uLy4uL3NyYy9hdXRob3JpemVyXCIpKSxcbiAgICAgIG1lbW9yeVNpemU6IDI1NixcbiAgICAgIHRpbWVvdXQ6IGNkay5EdXJhdGlvbi5zZWNvbmRzKDUpLFxuICAgIH0pO1xuXG4gICAgLy8gLS0tIE1DUCBTZXJ2ZXIgTGFtYmRhIC0tLVxuICAgIGNvbnN0IG1jcFNlcnZlckxhbWJkYSA9IG5ldyBsYW1iZGEuRnVuY3Rpb24odGhpcywgXCJNY3BTZXJ2ZXJcIiwge1xuICAgICAgZnVuY3Rpb25OYW1lOiBhcHBlbmRfcHJlZml4KFwibWNwc2VydmVyXCIsIHByZWZpeCksXG4gICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMjJfWCxcbiAgICAgIGhhbmRsZXI6IFwicnVuLnNoXCIsXG4gICAgICBjb2RlOiBsYW1iZGEuQ29kZS5mcm9tQXNzZXQocGF0aC5qb2luKF9fZGlybmFtZSwgXCIuLi8uLi9zcmMvbWNwc2VydmVyXCIpKSxcbiAgICAgIG1lbW9yeVNpemU6IDUxMixcbiAgICAgIHRpbWVvdXQ6IGNkay5EdXJhdGlvbi5zZWNvbmRzKDEwKSxcbiAgICAgIGxheWVyczogW2xhbWJkYUFkYXB0ZXJMYXllcl0sXG4gICAgICBlbnZpcm9ubWVudDoge1xuICAgICAgICBBV1NfTFdBX1BPUlQ6IFwiMzAwMFwiLFxuICAgICAgICBBV1NfTEFNQkRBX0VYRUNfV1JBUFBFUjogXCIvb3B0L2Jvb3RzdHJhcFwiLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vIC0tLSBBUEkgR2F0ZXdheSAtLS1cbiAgICBjb25zdCBhcGkgPSBuZXcgYXBpZ2F0ZXdheS5SZXN0QXBpKHRoaXMsIFwiQXBpXCIsIHtcbiAgICAgIHJlc3RBcGlOYW1lOiBhcHBlbmRfcHJlZml4KFwibWNwLWFwaVwiLCBwcmVmaXgpLFxuICAgICAgZGVwbG95T3B0aW9uczoge1xuICAgICAgICBzdGFnZU5hbWU6IHN0YWdlLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIGNvbnN0IG1jcFJlc291cmNlID0gYXBpLnJvb3QuYWRkUmVzb3VyY2UoXCJtY3BcIik7XG4gICAgY29uc3QgaW50ZWdyYXRpb24gPSBuZXcgYXBpZ2F0ZXdheS5MYW1iZGFJbnRlZ3JhdGlvbihtY3BTZXJ2ZXJMYW1iZGEsIHtcbiAgICAgIHByb3h5OiB0cnVlLFxuICAgIH0pO1xuXG4gICAgLy8gVXNlIE5PTkUgZm9yIG5vIGF1dGguIFRvIGVuYWJsZSB0aGUgdG9rZW4gYXV0aG9yaXplcjogY3JlYXRlIFRva2VuQXV0aG9yaXplciB3aXRoIGFwaSBhcyBzY29wZSxcbiAgICAvLyB0aGVuIHVzZSBhdXRob3JpemF0aW9uVHlwZTogQ1VTVE9NIGFuZCBhdXRob3JpemVyOiB0b2tlbkF1dGhvcml6ZXIgb24gYWRkTWV0aG9kLlxuICAgIG1jcFJlc291cmNlLmFkZE1ldGhvZChcIkFOWVwiLCBpbnRlZ3JhdGlvbiwge1xuICAgICAgYXV0aG9yaXphdGlvblR5cGU6IGFwaWdhdGV3YXkuQXV0aG9yaXphdGlvblR5cGUuTk9ORSxcbiAgICB9KTtcblxuICAgIHRoaXMubWNwRW5kcG9pbnQgPSBgJHthcGkudXJsfW1jcGA7XG4gICAgbmV3IGNkay5DZm5PdXRwdXQodGhpcywgXCJNY3BFbmRwb2ludFwiLCB7XG4gICAgICB2YWx1ZTogdGhpcy5tY3BFbmRwb2ludCxcbiAgICAgIGRlc2NyaXB0aW9uOiBcIk1DUCBzZXJ2ZXIgZW5kcG9pbnQgVVJMXCIsXG4gICAgICBleHBvcnROYW1lOiBhcHBlbmRfcHJlZml4KFwiTWNwRW5kcG9pbnRcIiwgcHJlZml4KSxcbiAgICB9KTtcbiAgfVxufVxuIl19