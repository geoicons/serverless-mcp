import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import metadata from "./metadata.js";
import { tools } from "./tools/index.js";
import { getAllResourceDefinitions } from "./utils/resources.js";

let SHORT_DELAY = true;
const LONG_DELAY_MS = 100;
const SHORT_DELAY_MS = 50;

const create = () => {
  const mcpServer = new McpServer({
    name: "demo-mcp-server",
    version: metadata.version
  }, {
    capabilities: {
      tools: {},
      resources: {}
    }
  });

  for (const def of getAllResourceDefinitions()) {
    mcpServer.registerResource(
      def.name,
      def.uri,
      {
        description: def.description,
        mimeType: def.mimeType,
      },
      (_uri, _extra) => ({
        contents: [{
          uri: def.uri,
          mimeType: def.mimeType,
          text: def.getText(),
        }],
      })
    );
  }

  for (const [name, { handler, description, inputSchema }] of Object.entries(tools)) {
    const config = {
      ...(description && { description }),
      ...(inputSchema && { inputSchema }),
    };
    mcpServer.registerTool(name, config, handler);
  }

  mcpServer.registerTool("ping", {
    description:
      "Simple health/connectivity check. Returns a pong message with server version and log stream name. No parameters.",
  }, async () => {
    const startTime = Date.now();
    SHORT_DELAY=!SHORT_DELAY;

    if (SHORT_DELAY){
      await new Promise((resolve) => setTimeout(resolve, SHORT_DELAY_MS));
    } else {
      await new Promise((resolve) => setTimeout(resolve, LONG_DELAY_MS));
    }
    const duration = Date.now() - startTime;

    return {
      content: [
        {
          type: "text",
          text: `pong! logStream=${metadata.logStreamName} v=${metadata.version} d=${duration}`
        }
      ]
    }
  });

  return mcpServer
};

export default { create };
