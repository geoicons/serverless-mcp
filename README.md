# Stateless MCP Server on AWS Lambda

This is a sample MCP Server running natively on AWS Lambda and API Gateway without any extra bridging components or custom transports. This is now possible thanks to the [Streamable HTTP](https://modelcontextprotocol.io/specification/2025-03-26/basic/transports#streamable-http) transport introduced in v2025-03-26. 

![](architecture.png)

## Prereqs

* AWS CLI (configured with credentials)
* Node.js 20+
* Yarn

## Instructions

### Clone the project

```bash
git clone <your-repo-url>
cd serverless-mcp
```

### Install dependencies

```bash
(cd src/mcpclient && yarn install)
(cd src/mcpserver && yarn install)
(cd cdk && yarn install)
```

### Test the server locally

```bash
node src/mcpserver/index.js
```

Once the server is running, run the client in a separate terminal:

```bash
node src/mcpclient/index.js
```

### Deploy to AWS with CDK

Install Lambda dependencies and deploy:

```bash
(cd src/authorizer && yarn install)
(cd src/mcpserver && yarn install)
cd cdk
yarn deploy
```

After deployment, CDK will print the MCP endpoint. Export it for the client:

```bash
export MCP_SERVER_ENDPOINT=<value from McpEndpoint output>
```

It may take about a minute for the API Gateway endpoint to become available.

### Deploy via GitHub Actions (OIDC)

The `Deploy` workflow deploys the CDK stack to the **dev** environment on push to `main` or via manual run. It uses GitHub OIDC to assume an IAM role (no long-lived AWS keys).

**Setup:**

1. **GitHub:** Create an environment named `dev` (Settings → Environments). In that environment, add:
   - **Secret:** `AWS_ROLE_ARN` = ARN of the IAM role that GitHub Actions will assume (e.g. `arn:aws:iam::123456789012:role/github-oidc-deploy`).
   - **Variable (optional):** `AWS_REGION` (default `us-east-1`).

2. **AWS:** Create an IAM role for OIDC:
   - Trust policy: allow `sts:AssumeRoleWithWebIdentity` from your GitHub OIDC provider (e.g. `token.actions.githubusercontent.com`) with condition on your repo and (optionally) branch/environment.
   - Permissions: enough to deploy the stack (e.g. CloudFormation, Lambda, API Gateway, IAM, S3 for assets). You can bootstrap CDK once locally and use the same account/region, then grant the role the policy CDK generates for the deployment role.

After that, pushes to `main` (or running the workflow manually) will deploy to dev.

### Test your remote MCP Server with the client

```bash
node src/mcpclient/index.js
```

Observe the response (endpoint URL will match your deployment):

```
Connecting ENDPOINT_URL=https://xxxxxx.execute-api.us-east-1.amazonaws.com/dev/mcp
connected
listTools response:  { tools: [ { name: 'ping', inputSchema: [Object] } ] }
callTool:ping response:  { ... }
```

## Stateful vs Stateless considerations

MCP Server can run in two modes - stateless and stateful. This repo demonstrates the stateless mode.

In stateless mode, clients do not establish persistent SSE connections to the MCP Server. This means clients will not receive proactive notifications from the server. On the other hand, stateless mode allows you to scale your server horizontally.

## Authorization demo

This sample includes a simple API Gateway token authorizer (Lambda). By default, the `/mcp` route uses **no authorization**. To enable the custom authorizer, edit `cdk/lib/stateless-mcp-stack.ts`: set `authorizationType` to `AuthorizationType.CUSTOM` and pass `authorizer: tokenAuthorizer` on the `addMethod` call.

See transport initialization in `src/mcpclient/index.js` for how to add a custom `Authorization` header (e.g. `Bearer good_access_token` for the demo authorizer).

## Cost considerations

This sample provisions paid resources in your account (Lambda, API Gateway). Remember to destroy the stack when you're done:

```bash
cd cdk
yarn destroy
```

## Learn about MCP

* [Intro](https://modelcontextprotocol.io/introduction)
* [Protocol specification](https://modelcontextprotocol.io/specification/2025-03-26)
