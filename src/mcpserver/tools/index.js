import listClients, { inputSchema as listClientsSchema } from "./list_clients.js";
import listOpportunities, {
  inputSchema as listOpportunitiesSchema,
} from "./list_opportunities.js";

export const tools = {
  list_clients: { handler: listClients, inputSchema: listClientsSchema },
  list_opportunities: {
    handler: listOpportunities,
    inputSchema: listOpportunitiesSchema,
  },
};

export default tools;
