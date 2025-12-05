import { wecallMockData } from "../data/wecallMockData";

const connectors = [...wecallMockData.routing.connectors];
const routes = [...wecallMockData.routing.routes];

export const mockRouting = {
  listConnectors: async () => connectors,
  listRoutes: async () => routes,
  getConnector: async (sid: string) => connectors.find((c) => c.sid === sid) || null,
  setConnectorStatus: async (sid: string, status: string) => {
    const c = connectors.find((x) => x.sid === sid);
    if (c) c.status = status;
    return c;
  },
};
