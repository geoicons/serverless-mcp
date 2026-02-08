/**
 * Workflow guides for the demo MCP server.
 * Callers can use the get_guide tool to retrieve step-by-step instructions
 * for common tasks (list clients/opportunities, get client details, typical workflow).
 */

export const GUIDES_OVERVIEW = {
  name: "Demo MCP Server – Workflow Guides",
  description: "Step-by-step guides for listing and looking up clients and opportunities",
  available_guides: [
    {
      key: "overview",
      title: "Guides Overview",
      description: "List all available guides and when to use them",
    },
    {
      key: "list-and-lookup",
      title: "List Clients and Opportunities, Then Look Up a Client",
      description: "Typical workflow: list everything, then get details for one client",
    },
    {
      key: "get-client-details",
      title: "Get a Client by ID",
      description: "When you have a client ID and need full client details",
    },
  ],
  usage:
    "Call get_guide with guide_key set to one of: overview, list-and-lookup, get-client-details",
};

const GUIDE_LIST_AND_LOOKUP = {
  key: "list-and-lookup",
  title: "List Clients and Opportunities, Then Look Up a Client",
  description:
    "Use this when the user wants to see what clients and opportunities exist, or to get details for a specific client.",
  steps: [
    {
      step: 1,
      title: "List all clients",
      tool: "list_clients",
      description: "Returns all clients with id, name, and email.",
      parameters: {},
      output: "Array of clients. Note each client's id for step 3.",
    },
    {
      step: 2,
      title: "List all opportunities",
      tool: "list_opportunities",
      description: "Returns all opportunities with id, title, status, and clientId.",
      parameters: {},
      output: "Array of opportunities. clientId links each opportunity to a client from step 1.",
    },
    {
      step: 3,
      title: "Get details for one client (optional)",
      tool: "get_client",
      description: "When the user asks about a specific client, call this with that client's id.",
      parameters: {
        clientId: "The client id (string, e.g. '1', '2') from the list_clients result",
      },
      example: { clientId: "2" },
      output: "Single client object with id, name, email.",
    },
  ],
  tips: [
    "Use list_clients first if the user says 'show clients' or 'who are the clients?'",
    "Use list_opportunities to see open/in_progress/closed work.",
    "Use get_client when the user names a client (e.g. 'Globex') and you need full details; match by name from list_clients to get the id, then call get_client with that id.",
  ],
};

const GUIDE_GET_CLIENT_DETAILS = {
  key: "get-client-details",
  title: "Get a Client by ID",
  description: "Retrieve full details for one client when you already have their id.",
  when_to_use: [
    "User asks for details about a specific client (by name or id).",
    "You have a client id from a previous list_clients or list_opportunities (e.g. clientId from an opportunity).",
  ],
  steps: [
    {
      step: 1,
      title: "Call get_client with the client id",
      tool: "get_client",
      parameters: {
        clientId: "Required. The client's id (string). Use id from list_clients if you looked up by name.",
      },
      example: { clientId: "1" },
      output: "Client object { id, name, email }. Returns error content if client not found.",
    },
  ],
  note: "If the user refers to a client by name (e.g. 'Globex'), call list_clients first, find the matching client's id, then call get_client with that id.",
};

/**
 * All guides keyed by guide_key for get_guide tool.
 */
export const GUIDES = {
  overview: GUIDES_OVERVIEW,
  "list-and-lookup": GUIDE_LIST_AND_LOOKUP,
  "get-client-details": GUIDE_GET_CLIENT_DETAILS,
};

/**
 * Get a guide by key. Returns the guide object or null if not found.
 * @param {string} guideKey - One of: overview, list-and-lookup, get-client-details
 * @returns {object|null}
 */
export function getGuide(guideKey) {
  if (!guideKey || typeof guideKey !== "string") return null;
  const key = guideKey.trim().toLowerCase();
  if (key === "overview") return GUIDES_OVERVIEW;
  return GUIDES[key] ?? null;
}

/**
 * List all guide keys (for tool description / discovery).
 */
export function getGuideKeys() {
  return ["overview", "list-and-lookup", "get-client-details"];
}
