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

From repo root (installs authorizer, mcpserver, and CDK):

```bash
yarn installall
```

Or per package:

```bash
(cd src/authorizer && yarn install)
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

From repo root:

```bash
yarn installall
yarn buildall
yarn deploy
```

Or from the CDK package: `(cd cdk && yarn deploy)` after installing deps.

After deployment, CDK will print the MCP endpoint. Export it for the client:

```bash
export MCP_SERVER_ENDPOINT=<value from McpEndpoint output>
```

It may take about a minute for the API Gateway endpoint to become available.

### Deploy via GitHub Actions (OIDC)

Deployment uses reusable workflows and branch-based promotion:

| Trigger | Workflow | Environment |
|--------|----------|-------------|
| PR → `main` | **Dev Check** | Runs CDK synth only (no deploy) |
| Push to `main` | **Development Deployment** | `dev` |
| Push to `qas` | **QAS Deployment** | `qas` |
| Push to `prod` | **Production Deployment** | `prod` |

All deploy workflows support manual run via **workflow_dispatch**. Auth uses GitHub OIDC (no long-lived AWS keys).

**Setup:**

1. **GitHub:** For each environment (`dev`, `qas`, `prod`) you use, create it under Settings → Environments and add:
   - **Secret:** `AWS_ROLE_ARN` = ARN of the IAM role GitHub Actions will assume (e.g. `arn:aws:iam::123456789012:role/github-oidc-deploy`).
   - **Variable (optional):** `AWS_REGION` (default in workflows is `us-east-1`).

2. **AWS:** Create an IAM role for OIDC per environment (or one role with conditions):
   - Trust policy: allow `sts:AssumeRoleWithWebIdentity` from your GitHub OIDC provider with conditions on repo and (optionally) branch/environment.
   - Permissions: enough to deploy the stack (CloudFormation, Lambda, API Gateway, IAM, S3 for assets). Bootstrap CDK once locally and grant the role the policy CDK generates for the deployment role.

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
