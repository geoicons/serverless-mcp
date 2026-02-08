const SAMPLE_OPPORTUNITIES = [
  { id: "1", title: "Website redesign", status: "open", clientId: "1" },
  { id: "2", title: "API integration", status: "in_progress", clientId: "2" },
  { id: "3", title: "Support contract", status: "closed", clientId: "3" },
];

export const inputSchema = {
  type: "object",
  properties: {},
};

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
