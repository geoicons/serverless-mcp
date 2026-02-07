#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { StatelessMcpStack } from '../lib/stateless-mcp-stack';

const app = new cdk.App();
new StatelessMcpStack(app, 'StatelessMcpStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION ?? 'us-east-1',
  },
  description: 'Stateless MCP Server on AWS Lambda with API Gateway',
});
