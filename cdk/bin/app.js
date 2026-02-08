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
const STACK_NAME = `mcp-${STAGE}-stack`;
const app = new cdk.App();
new stateless_mcp_stack_1.StatelessMcpStack(app, STACK_NAME, {
    env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: REGION,
    },
    description: "Stateless MCP Server on AWS Lambda with API Gateway",
    stage: STAGE,
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYXBwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0EsaURBQW1DO0FBQ25DLG9FQUErRDtBQUUvRCxNQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssSUFBSSxLQUFLLENBQUM7QUFDekMsTUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLElBQUksT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsSUFBSSxnQkFBZ0IsQ0FBQztBQUV4RixNQUFNLFVBQVUsR0FBRyxPQUFPLEtBQUssUUFBUSxDQUFDO0FBRXhDLE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQzFCLElBQUksdUNBQWlCLENBQUMsR0FBRyxFQUFFLFVBQVUsRUFBRTtJQUNyQyxHQUFHLEVBQUU7UUFDSCxPQUFPLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxtQkFBbUI7UUFDeEMsTUFBTSxFQUFFLE1BQU07S0FDZjtJQUNELFdBQVcsRUFBRSxxREFBcUQ7SUFDbEUsS0FBSyxFQUFFLEtBQUs7Q0FDYixDQUFDLENBQUM7QUFDSCxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIjIS91c3IvYmluL2VudiBub2RlXG5pbXBvcnQgKiBhcyBjZGsgZnJvbSBcImF3cy1jZGstbGliXCI7XG5pbXBvcnQgeyBTdGF0ZWxlc3NNY3BTdGFjayB9IGZyb20gXCIuLi9saWIvc3RhdGVsZXNzLW1jcC1zdGFja1wiO1xuXG5jb25zdCBTVEFHRSA9IHByb2Nlc3MuZW52LlNUQUdFIHx8IFwiZGV2XCI7XG5jb25zdCBSRUdJT04gPSBwcm9jZXNzLmVudi5SRUdJT04gfHwgcHJvY2Vzcy5lbnYuQ0RLX0RFRkFVTFRfUkVHSU9OIHx8IFwiYXAtc291dGhlYXN0LTJcIjtcblxuY29uc3QgU1RBQ0tfTkFNRSA9IGBtY3AtJHtTVEFHRX0tc3RhY2tgO1xuXG5jb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xubmV3IFN0YXRlbGVzc01jcFN0YWNrKGFwcCwgU1RBQ0tfTkFNRSwge1xuICBlbnY6IHtcbiAgICBhY2NvdW50OiBwcm9jZXNzLmVudi5DREtfREVGQVVMVF9BQ0NPVU5ULFxuICAgIHJlZ2lvbjogUkVHSU9OLFxuICB9LFxuICBkZXNjcmlwdGlvbjogXCJTdGF0ZWxlc3MgTUNQIFNlcnZlciBvbiBBV1MgTGFtYmRhIHdpdGggQVBJIEdhdGV3YXlcIixcbiAgc3RhZ2U6IFNUQUdFLFxufSk7XG5hcHAuc3ludGgoKTtcbiJdfQ==