#!/usr/bin/env node
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
const cdk = __importStar(require("aws-cdk-lib"));
const stateless_mcp_stack_1 = require("../lib/stateless-mcp-stack");
const STAGE = process.env.STAGE || "dev";
const REGION = process.env.REGION || process.env.CDK_DEFAULT_REGION || "ap-southeast-2";
const MANAGEMENT_API_KEY = process.env.MANAGEMENT_API_KEY || "management-api-key";
const STACK_NAME = `mcp-${STAGE}-stack`;
const app = new cdk.App();
new stateless_mcp_stack_1.StatelessMcpStack(app, STACK_NAME, {
    env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: REGION,
    },
    description: "Stateless MCP Server on AWS Lambda with API Gateway",
    stage: STAGE,
    managementApiKey: MANAGEMENT_API_KEY,
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYXBwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0EsaURBQW1DO0FBQ25DLG9FQUErRDtBQUUvRCxNQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssSUFBSSxLQUFLLENBQUM7QUFDekMsTUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLElBQUksT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsSUFBSSxnQkFBZ0IsQ0FBQztBQUN4RixNQUFNLGtCQUFrQixHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLElBQUksb0JBQW9CLENBQUM7QUFFbEYsTUFBTSxVQUFVLEdBQUcsT0FBTyxLQUFLLFFBQVEsQ0FBQztBQUV4QyxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUMxQixJQUFJLHVDQUFpQixDQUFDLEdBQUcsRUFBRSxVQUFVLEVBQUU7SUFDckMsR0FBRyxFQUFFO1FBQ0gsT0FBTyxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsbUJBQW1CO1FBQ3hDLE1BQU0sRUFBRSxNQUFNO0tBQ2Y7SUFDRCxXQUFXLEVBQUUscURBQXFEO0lBQ2xFLEtBQUssRUFBRSxLQUFLO0lBQ1osZ0JBQWdCLEVBQUUsa0JBQWtCO0NBQ3JDLENBQUMsQ0FBQztBQUNILEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIiMhL3Vzci9iaW4vZW52IG5vZGVcbmltcG9ydCAqIGFzIGNkayBmcm9tIFwiYXdzLWNkay1saWJcIjtcbmltcG9ydCB7IFN0YXRlbGVzc01jcFN0YWNrIH0gZnJvbSBcIi4uL2xpYi9zdGF0ZWxlc3MtbWNwLXN0YWNrXCI7XG5cbmNvbnN0IFNUQUdFID0gcHJvY2Vzcy5lbnYuU1RBR0UgfHwgXCJkZXZcIjtcbmNvbnN0IFJFR0lPTiA9IHByb2Nlc3MuZW52LlJFR0lPTiB8fCBwcm9jZXNzLmVudi5DREtfREVGQVVMVF9SRUdJT04gfHwgXCJhcC1zb3V0aGVhc3QtMlwiO1xuY29uc3QgTUFOQUdFTUVOVF9BUElfS0VZID0gcHJvY2Vzcy5lbnYuTUFOQUdFTUVOVF9BUElfS0VZIHx8IFwibWFuYWdlbWVudC1hcGkta2V5XCI7XG5cbmNvbnN0IFNUQUNLX05BTUUgPSBgbWNwLSR7U1RBR0V9LXN0YWNrYDtcblxuY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcbm5ldyBTdGF0ZWxlc3NNY3BTdGFjayhhcHAsIFNUQUNLX05BTUUsIHtcbiAgZW52OiB7XG4gICAgYWNjb3VudDogcHJvY2Vzcy5lbnYuQ0RLX0RFRkFVTFRfQUNDT1VOVCxcbiAgICByZWdpb246IFJFR0lPTixcbiAgfSxcbiAgZGVzY3JpcHRpb246IFwiU3RhdGVsZXNzIE1DUCBTZXJ2ZXIgb24gQVdTIExhbWJkYSB3aXRoIEFQSSBHYXRld2F5XCIsXG4gIHN0YWdlOiBTVEFHRSxcbiAgbWFuYWdlbWVudEFwaUtleTogTUFOQUdFTUVOVF9BUElfS0VZLFxufSk7XG5hcHAuc3ludGgoKTtcbiJdfQ==