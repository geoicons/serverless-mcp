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
const AUTHORIZATION_ENABLED = process.env.AUTHORIZATION_ENABLED === "true";
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
    authorizationEnabled: AUTHORIZATION_ENABLED,
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYXBwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0EsaURBQW1DO0FBQ25DLG9FQUErRDtBQUUvRCxNQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssSUFBSSxLQUFLLENBQUM7QUFDekMsTUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLElBQUksT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsSUFBSSxnQkFBZ0IsQ0FBQztBQUN4RixNQUFNLGtCQUFrQixHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLElBQUksb0JBQW9CLENBQUM7QUFDbEYsTUFBTSxxQkFBcUIsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLHFCQUFxQixLQUFLLE1BQU0sQ0FBQztBQUUzRSxNQUFNLFVBQVUsR0FBRyxPQUFPLEtBQUssUUFBUSxDQUFDO0FBRXhDLE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQzFCLElBQUksdUNBQWlCLENBQUMsR0FBRyxFQUFFLFVBQVUsRUFBRTtJQUNyQyxHQUFHLEVBQUU7UUFDSCxPQUFPLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxtQkFBbUI7UUFDeEMsTUFBTSxFQUFFLE1BQU07S0FDZjtJQUNELFdBQVcsRUFBRSxxREFBcUQ7SUFDbEUsS0FBSyxFQUFFLEtBQUs7SUFDWixnQkFBZ0IsRUFBRSxrQkFBa0I7SUFDcEMsb0JBQW9CLEVBQUUscUJBQXFCO0NBQzVDLENBQUMsQ0FBQztBQUNILEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIiMhL3Vzci9iaW4vZW52IG5vZGVcbmltcG9ydCAqIGFzIGNkayBmcm9tIFwiYXdzLWNkay1saWJcIjtcbmltcG9ydCB7IFN0YXRlbGVzc01jcFN0YWNrIH0gZnJvbSBcIi4uL2xpYi9zdGF0ZWxlc3MtbWNwLXN0YWNrXCI7XG5cbmNvbnN0IFNUQUdFID0gcHJvY2Vzcy5lbnYuU1RBR0UgfHwgXCJkZXZcIjtcbmNvbnN0IFJFR0lPTiA9IHByb2Nlc3MuZW52LlJFR0lPTiB8fCBwcm9jZXNzLmVudi5DREtfREVGQVVMVF9SRUdJT04gfHwgXCJhcC1zb3V0aGVhc3QtMlwiO1xuY29uc3QgTUFOQUdFTUVOVF9BUElfS0VZID0gcHJvY2Vzcy5lbnYuTUFOQUdFTUVOVF9BUElfS0VZIHx8IFwibWFuYWdlbWVudC1hcGkta2V5XCI7XG5jb25zdCBBVVRIT1JJWkFUSU9OX0VOQUJMRUQgPSBwcm9jZXNzLmVudi5BVVRIT1JJWkFUSU9OX0VOQUJMRUQgPT09IFwidHJ1ZVwiO1xuXG5jb25zdCBTVEFDS19OQU1FID0gYG1jcC0ke1NUQUdFfS1zdGFja2A7XG5cbmNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG5uZXcgU3RhdGVsZXNzTWNwU3RhY2soYXBwLCBTVEFDS19OQU1FLCB7XG4gIGVudjoge1xuICAgIGFjY291bnQ6IHByb2Nlc3MuZW52LkNES19ERUZBVUxUX0FDQ09VTlQsXG4gICAgcmVnaW9uOiBSRUdJT04sXG4gIH0sXG4gIGRlc2NyaXB0aW9uOiBcIlN0YXRlbGVzcyBNQ1AgU2VydmVyIG9uIEFXUyBMYW1iZGEgd2l0aCBBUEkgR2F0ZXdheVwiLFxuICBzdGFnZTogU1RBR0UsXG4gIG1hbmFnZW1lbnRBcGlLZXk6IE1BTkFHRU1FTlRfQVBJX0tFWSxcbiAgYXV0aG9yaXphdGlvbkVuYWJsZWQ6IEFVVEhPUklaQVRJT05fRU5BQkxFRCxcbn0pO1xuYXBwLnN5bnRoKCk7XG4iXX0=