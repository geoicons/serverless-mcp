import { fileURLToPath } from "url";
import { dirname, join } from "path";
import dotenv from "dotenv";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, ".env") });

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

const ENDPOINT_URL = process.env.MCP_SERVER_ENDPOINT || "http://localhost:3000/mcp";
const AUTHORIZATION_ENABLED = process.env.AUTHORIZATION_ENABLED === "true";
const AUTH_TOKEN = process.env.MCP_AUTH_TOKEN || "good_access_token";

console.log(`Connecting ENDPOINT_URL=${ENDPOINT_URL} authorizationEnabled=${AUTHORIZATION_ENABLED}`);

const transportOptions = AUTHORIZATION_ENABLED
  ? {
      requestInit: {
        headers: {
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
      },
    }
  : {};

const transport = new StreamableHTTPClientTransport(new URL(ENDPOINT_URL), transportOptions);

const client = new Client({
    name: "node-client",
    version: "0.0.1"
})

await client.connect(transport);
console.log('connected');

const { tools } = await client.listTools();
console.log(`listTools response:`, tools);

for (const tool of tools) {
  const name = tool.name;
  console.log(`\ncallTool:${name}`);
  const result = await client.callTool({ name, arguments: {} });
  console.log(`callTool:${name} response:`, result);
}

await client.close();
