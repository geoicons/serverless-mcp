/**
 * MCP resource definitions: guides and schemas exposed as resources (read by URI).
 * Used by mcp-server.js to register resources so clients see them in resources/list
 * and can read content via resources/read.
 */

const RESOURCE_URI_PREFIX = "demomcp://";

import { GUIDES_OVERVIEW, GUIDES, getGuide } from "./guides.js";

/** Resource definitions for guides: uri, name, description, mimeType, and content getter. */
function getGuideResourceDefinitions() {
  const base = `${RESOURCE_URI_PREFIX}guides/`;
  return [
    {
      uri: `${base}overview`,
      name: "Guides Overview",
      description: "List all available workflow guides and when to use them",
      mimeType: "application/json",
      getText: () => JSON.stringify(GUIDES_OVERVIEW, null, 2),
    },
    {
      uri: `${base}list-and-lookup`,
      name: "Guide: List Clients and Opportunities, Then Look Up a Client",
      description: "Step-by-step workflow for listing clients/opportunities and getting client details",
      mimeType: "application/json",
      getText: () => JSON.stringify(GUIDES["list-and-lookup"], null, 2),
    },
    {
      uri: `${base}get-client-details`,
      name: "Guide: Get a Client by ID",
      description: "How to retrieve full client details when you have a client id",
      mimeType: "application/json",
      getText: () => JSON.stringify(GUIDES["get-client-details"], null, 2),
    },
  ];
}

/** Schema definitions: JSON structure of client and opportunity (for reference). */
const SCHEMAS = {
  client: {
    name: "Client",
    description: "A client in the system (from list_clients or get_client)",
    schema: {
      type: "object",
      properties: {
        id: { type: "string", description: "Client id" },
        name: { type: "string", description: "Client name" },
        email: { type: "string", description: "Client email" },
      },
      required: ["id", "name", "email"],
    },
    example: { id: "1", name: "Acme Corp", email: "contact@acme.example.com" },
  },
  opportunity: {
    name: "Opportunity",
    description: "An opportunity in the system (from list_opportunities)",
    schema: {
      type: "object",
      properties: {
        id: { type: "string", description: "Opportunity id" },
        title: { type: "string", description: "Opportunity title" },
        status: {
          type: "string",
          enum: ["open", "in_progress", "closed"],
          description: "Current status",
        },
        clientId: { type: "string", description: "Id of the client this opportunity belongs to" },
      },
      required: ["id", "title", "status", "clientId"],
    },
    example: {
      id: "1",
      title: "Website redesign",
      status: "open",
      clientId: "1",
    },
  },
};

/** Resource definitions for schemas. */
function getSchemaResourceDefinitions() {
  const base = `${RESOURCE_URI_PREFIX}schemas/`;
  const overview = {
    name: "Demo MCP Server – Schema Overview",
    description: "JSON schemas for data returned by tools",
    available_schemas: [
      { uri: `${base}client`, title: "Client", description: "Shape of a client object" },
      { uri: `${base}opportunity`, title: "Opportunity", description: "Shape of an opportunity object" },
    ],
    usage: "Read a schema URI (e.g. demomcp://schemas/client) to get the full JSON schema and example.",
  };
  return [
    {
      uri: `${base}overview`,
      name: "Schemas Overview",
      description: "List all available data schemas (client, opportunity)",
      mimeType: "application/json",
      getText: () => JSON.stringify(overview, null, 2),
    },
    {
      uri: `${base}client`,
      name: "Client Schema",
      description: "JSON schema and example for a client object",
      mimeType: "application/json",
      getText: () => JSON.stringify(SCHEMAS.client, null, 2),
    },
    {
      uri: `${base}opportunity`,
      name: "Opportunity Schema",
      description: "JSON schema and example for an opportunity object",
      mimeType: "application/json",
      getText: () => JSON.stringify(SCHEMAS.opportunity, null, 2),
    },
  ];
}

/**
 * All resource definitions (guides + schemas) for registration.
 * Each has: uri, name, description, mimeType, getText().
 */
export function getAllResourceDefinitions() {
  return [...getGuideResourceDefinitions(), ...getSchemaResourceDefinitions()];
}

export { RESOURCE_URI_PREFIX };
