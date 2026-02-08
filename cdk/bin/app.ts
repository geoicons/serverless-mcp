#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { StatelessMcpStack } from "../lib/stateless-mcp-stack";

const STAGE = process.env.STAGE || "dev";
const REGION = process.env.REGION || process.env.CDK_DEFAULT_REGION || "ap-southeast-2";
const MANAGEMENT_API_KEY = process.env.MANAGEMENT_API_KEY || "management-api-key";
const AUTHORIZATION_ENABLED = process.env.AUTHORIZATION_ENABLED === "true";

const STACK_NAME = `mcp-${STAGE}-stack`;

const app = new cdk.App();
new StatelessMcpStack(app, STACK_NAME, {
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
