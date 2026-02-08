# Stateless MCP Server on AWS Lambda

This is a sample MCP Server running natively on AWS Lambda and API Gateway without any extra bridging components or custom transports. This is now possible thanks to the [Streamable HTTP](https://modelcontextprotocol.io/specification/2025-03-26/basic/transports#streamable-http) transport introduced in v2025-03-26. 

![](architecture.png)

## Prereqs

* AWS CLI (configured with credentials)
* Node.js 20+
* Yarn

## Instructions

**Quick path:** clone → `yarn installall` → run server and client locally (optional) → deploy with `yarn buildall && yarn deploy` or push to `main`/`qas`/`prod` to deploy via GitHub Actions (after configuring secrets).

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

This deploys the **dev** stack by default (`mcp-dev-stack`). To deploy another stage or region from your machine:

```bash
STAGE=qas REGION=ap-southeast-2 yarn deploy
```

Or from the CDK package: `(cd cdk && yarn deploy)` after installing deps.

After deployment, CDK will print the MCP endpoint. Export it for the client:

```bash
export MCP_SERVER_ENDPOINT=<value from McpEndpoint output>
```

It may take about a minute for the API Gateway endpoint to become available.

### Deploy via GitHub Actions

Deployment uses reusable workflows and branch-based promotion. Each environment (dev, qas, prod) deploys a separate stack with prefixed resource names (e.g. `mcp-dev-stack`, `mcp-qas-stack`, `mcp-prod-stack`).

| Trigger | Workflow | Environment |
|--------|----------|-------------|
| PR → `main` | **Dev Check** | Runs CDK synth only (no deploy) |
| Push to `main` | **Development Deployment** | `dev` |
| Push to `qas` | **QAS Deployment** | `qas` |
| Push to `prod` | **Production Deployment** | `prod` |

All deploy workflows can also be run manually via **workflow_dispatch** (Actions tab → select workflow → Run workflow).

**Required secrets (per environment)**

For each environment you use (`dev`, `qas`, `prod`), create the environment under **Settings → Environments** and add these **secrets**:

| Secret | Description |
|--------|-------------|
| `AWS_ACCESS_KEY_ID` | IAM access key for the deploy user/role |
| `AWS_SECRET_ACCESS_KEY` | IAM secret key |
| `MANAGEMENT_API_KEY` | Management API key (used by the deployment workflow; set to a value of your choice if not used by the app) |

**Region**

Workflows use `ap-southeast-2` by default. To use another region, edit the `aws-region` input in the caller workflows (`dev_deploy.yaml`, `qas_deploy.yaml`, `prod_deploy.yaml`).

**AWS permissions**

The IAM user or role whose keys you use must have permissions to deploy the CDK stack (CloudFormation, Lambda, API Gateway, IAM, S3 for CDK assets). Run `cdk bootstrap` once in your account/region, then grant the deploy user the policy that CDK assigns to the deployment role.

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
