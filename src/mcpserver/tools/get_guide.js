import { z } from "zod";
import { getGuide, getGuideKeys } from "../utils/guides.js";

/** Human-readable description for tools/list. Use when the user asks how to do something, wants step-by-step instructions, or asks what guides are available. */
export const description =
  "Get a workflow guide by key. Use when the user asks 'how do I...', 'what can I do?', or wants step-by-step instructions. Call with guide_key 'overview' to list all available guides; then call again with a specific guide_key for full steps.";

export const inputSchema = z.object({
  guide_key: z
    .string()
    .describe(
      "One of: overview (list all guides), list-and-lookup (list clients/opportunities and get client details), get-client-details (get one client by id)"
    ),
});

export async function handler(args) {
  const { guide_key } = args;
  const guide = getGuide(guide_key);
  if (!guide) {
    const valid = getGuideKeys().join(", ");
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              error: "Guide not found",
              guide_key: guide_key,
              valid_guide_keys: valid,
              hint: "Use guide_key 'overview' to see all available guides.",
            },
            null,
            2
          ),
        },
      ],
      isError: true,
    };
  }
  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(guide, null, 2),
      },
    ],
  };
}

export default handler;
