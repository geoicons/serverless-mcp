import listClients, { description as listClientsDescription } from "./list_clients.js";
import listOpportunities, { description as listOpportunitiesDescription } from "./list_opportunities.js";
import getClient, {
  description as getClientDescription,
  inputSchema as getClientSchema,
} from "./get_client.js";
import getGuide, {
  description as getGuideDescription,
  inputSchema as getGuideSchema,
} from "./get_guide.js";

export const tools = {
  list_clients: {
    handler: listClients,
    description: listClientsDescription,
  },
  list_opportunities: {
    handler: listOpportunities,
    description: listOpportunitiesDescription,
  },
  get_client: {
    handler: getClient,
    description: getClientDescription,
    inputSchema: getClientSchema,
  },
  get_guide: {
    handler: getGuide,
    description: getGuideDescription,
    inputSchema: getGuideSchema,
  },
};

export default tools;
