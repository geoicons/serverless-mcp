import listClients from "./list_clients.js";
import listOpportunities from "./list_opportunities.js";
import getClient, { inputSchema as getClientSchema } from "./get_client.js";

export const tools = {
  list_clients: { handler: listClients },
  list_opportunities: { handler: listOpportunities },
  get_client: { handler: getClient, inputSchema: getClientSchema },
};

export default tools;
