import { SAMPLE_CLIENTS } from "./data.js";

/** Human-readable description for tools/list. When to use: user asks to list clients, see who the clients are, or get client ids for later get_client calls. */
export const description =
  "List all clients accessible in the system.\n\nReturns: Array of clients with id, name, and email. Use these ids with get_client when the user asks for details about a specific client.";

export async function handler() {
  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(SAMPLE_CLIENTS, null, 2),
      },
    ],
  };
}

export default handler;
