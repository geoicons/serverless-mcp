import { SAMPLE_CLIENTS } from "./data.js";

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
