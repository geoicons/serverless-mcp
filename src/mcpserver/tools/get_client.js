import { z } from "zod";
import { SAMPLE_CLIENTS } from "./data.js";

/** Human-readable description for tools/list. Use when the user asks for details about a specific client; call list_clients first if they refer to the client by name to get the id. */
export const description =
  "Get details for a specific client by id.\n\nArgs: clientId (required) – the client's id, e.g. from list_clients.\nReturns: Client object with id, name, email. If not found, returns an error. When the user refers to a client by name (e.g. 'Globex'), call list_clients first, find the matching client's id, then call get_client with that id.";

export const inputSchema = z.object({
  clientId: z.string().describe("The client's id (e.g. '1', '2'). Get this from list_clients if the user refers to the client by name."),
});

export async function handler(args, _extra) {
  const { clientId } = args;
  const client = SAMPLE_CLIENTS.find((c) => c.id === clientId);
  if (!client) {
    return {
      content: [{ type: "text", text: "Client not found" }],
      isError: true,
    };
  }
  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(client, null, 2),
      },
    ],
  };
}

export default handler;
