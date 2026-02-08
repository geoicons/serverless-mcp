const SAMPLE_CLIENTS = [
  { id: "1", name: "Acme Corp", email: "contact@acme.example.com" },
  { id: "2", name: "Globex Inc", email: "info@globex.example.com" },
  { id: "3", name: "Initech", email: "hello@initech.example.com" },
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
        text: JSON.stringify(SAMPLE_CLIENTS, null, 2),
      },
    ],
  };
}

export default handler;
