import { z } from "zod";
import { SAMPLE_CLIENTS } from "./data.js";

export const inputSchema = z.object({
  clientId: z.string(),
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
