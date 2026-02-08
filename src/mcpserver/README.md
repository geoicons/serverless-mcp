# MCP Server

This folder contains a **stateless** Model Context Protocol (MCP) server that runs on Express and is deployed to AWS Lambda behind API Gateway. It uses the [Streamable HTTP](https://modelcontextprotocol.io/specification/2025-03-26/basic/transports#streamable-http) transport so each request is self-contained—no long-lived sessions or SSE connections.

## How it works

### Startup

1. **`run.sh`** — Entry point when run on Lambda (or locally). It simply runs `node index.js`.
2. **`index.js`** — Loads logging, initialises metadata (version, log stream name), creates an Express app, and mounts the MCP transport at `/mcp`. The app listens on port 3000. On Lambda, [AWS Lambda Web Adapter](https://github.com/awslabs/aws-lambda-web-adapter) invokes this HTTP server.

### Request flow

1. **HTTP** — Clients send **POST** requests to `/mcp`. GET and DELETE to `/mcp` return 405 (method not allowed).
2. **`transport.js`** — For each POST:
   - Creates a **new** MCP server instance and a **new** `StreamableHTTPServerTransport` (stateless: no session ID, no stored state).
   - Connects the server to the transport, then calls `transport.handleRequest(req, res, req.body)` so the SDK parses the JSON-RPC and runs the right handler.
   - On response finish or connection close, the transport and server are closed.
3. **`mcp-server.js`** — Builds the MCP server with name/version from `metadata.js`, declares `tools` capability, and registers every tool from `tools/index.js` plus a built-in `ping` tool.
4. **Tools** — Each tool is a function that receives arguments (and optional extra context) and returns `{ content: [{ type: "text", text: "..." }] }`. Tools with parameters use a Zod `inputSchema` exported from the tool file.

### Key files

| File | Role |
|------|------|
| `index.js` | Express app, `/health`, mounts transport at `/mcp`, listens on 3000 |
| `transport.js` | Binds POST/GET/DELETE for `/mcp`, creates server + Streamable HTTP transport per request, handles errors |
| `mcp-server.js` | Factory that creates an `McpServer`, registers all tools and `ping` |
| `metadata.js` | Version and `AWS_LAMBDA_LOG_STREAM_NAME` (or `"unknown"` locally), used by server and `ping` |
| `mcp-errors.js` | JSON-RPC error payloads (500, 405, invalid session, etc.) |
| `tools/index.js` | Exports `tools` object: name → `{ handler, description?, inputSchema? }` |
| `tools/*.js` | Tool handlers plus optional `description` and Zod `inputSchema` (use `.describe()` on fields for caller hints) |
| `utils/guides.js` | Workflow guides (overview, list-and-lookup, get-client-details); used by `get_guide` tool and by resources |
| `utils/resources.js` | MCP resource definitions (guides + schemas) for `resources/list` and `resources/read`; URIs under `demomcp://` |
| `utils/index.js` | Re-exports guides and resources helpers |

### Transport behaviour

- **Stateless** — No `sessionIdGenerator`; every POST is independent.
- **JSON responses** — `enableJsonResponse: true` so the transport responds with JSON instead of streaming SSE for responses.
- **Error handling** — Uncaught errors in the request handler result in a 500 and a JSON-RPC `internalServerError` body.

### How callers discover what tools can do

Callers use the standard MCP request **`tools/list`** (e.g. `client.listTools()` in the SDK). The server responds with a list of tools; for each tool the response includes:

- **`name`** — The tool identifier (e.g. `list_clients`, `get_client`).
- **`description`** — Optional human-readable text describing what the tool does (used by clients/LLMs to choose and call the right tool).
- **`inputSchema`** — A JSON Schema object describing the tool’s parameters (property names, types, required fields). The SDK converts Zod schemas to JSON Schema when tools are registered.

So the caller learns what each tool can do from the **description** and what arguments to send from the **inputSchema**. This server passes **`description`** and **`inputSchema`** when registering each tool (in `mcp-server.js`). Tool modules under `tools/` export an optional `description` string and, for parameters, a Zod `inputSchema`; use `.describe()` on schema fields so the generated JSON Schema includes parameter hints for the caller.

### Resources (guides and schemas)

Guides and schemas are exposed as **MCP resources** so clients can list and read them by URI (like requestrocket’s `requestrocket://guides/...` and `requestrocket://schemas/...`). The IDE will show them with the resource (document) icon.

- **URI scheme** — `demomcp://`
- **Guides** — `demomcp://guides/overview`, `demomcp://guides/list-and-lookup`, `demomcp://guides/get-client-details`. Content is JSON (steps, tools, parameters, tips).
- **Schemas** — `demomcp://schemas/overview`, `demomcp://schemas/client`, `demomcp://schemas/opportunity`. Content is JSON (schema + example for client and opportunity data).

`utils/resources.js` defines all resource URIs, names, descriptions, and content getters; `mcp-server.js` registers them with `mcpServer.registerResource()` so the server advertises the `resources` capability and responds to `resources/list` and `resources/read`.

### Guidance and tool context (utils + get_guide)

- **`utils/guides.js`** — Defines the overview and workflow guides (list-and-lookup, get-client-details). Used by both the **get_guide** tool and the **resources** above.
- **`get_guide` tool** — Callers can still call `get_guide(guide_key)` to fetch a guide by key; the same content is also available as resources for clients that prefer reading by URI.

Tool **descriptions** are written for the caller: when to use the tool, what it returns, and how it fits with other tools. Parameter schemas use Zod’s `.describe()` so the generated JSON Schema explains each argument.

### Registered tools

- **`list_clients`** — List all sample clients (id, name, email). Use ids with `get_client` for details.
- **`list_opportunities`** — List all opportunities (id, title, status, clientId).
- **`get_client`** — Get one client by `clientId` (string). Use after `list_clients` when the user refers to a client by name.
- **`get_guide`** — Get a workflow guide by `guide_key` (`overview`, `list-and-lookup`, `get-client-details`). Use when the user asks how to do something.
- **`ping`** — Connectivity check; returns pong with version and log stream. No parameters.

### Adding a new tool

1. Add a file under `tools/` (e.g. `my_tool.js`) that exports a `handler`, and optionally `description` (string) and `inputSchema` (Zod; use `.describe()` on fields).
2. In `tools/index.js`, import it and add an entry: `my_tool: { handler, description, inputSchema }`.
3. `mcp-server.js` registers tools from `tools` with description and inputSchema automatically.

### Local run

```bash
node index.js
```

Then send MCP JSON-RPC requests to `http://localhost:3000/mcp`. The test client in `src/mcpclient` can target this URL via `MCP_SERVER_ENDPOINT=http://localhost:3000/mcp`.

### Health check

`GET /health` returns JSON with metadata (e.g. version, log stream name). Useful for readiness checks and debugging.
