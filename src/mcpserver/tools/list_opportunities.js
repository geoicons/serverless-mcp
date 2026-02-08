const SAMPLE_OPPORTUNITIES = [
  { id: "1", title: "Website redesign", status: "open", clientId: "1" },
  { id: "2", title: "API integration", status: "in_progress", clientId: "2" },
  { id: "3", title: "Support contract", status: "closed", clientId: "3" },
];

/** Human-readable description for tools/list. When to use: user asks to list opportunities, see open/closed work, or what's in progress. */
export const description =
  "List all opportunities in the system.\n\nReturns: Array of opportunities with id, title, status (open | in_progress | closed), and clientId. Use clientId with get_client to see which client each opportunity belongs to.";

export async function handler() {
  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(SAMPLE_OPPORTUNITIES, null, 2),
      },
    ],
  };
}

export default handler;
