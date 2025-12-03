import { wecallMockData } from "../data/wecallMockData";

export const mockRouting = {
  connectors: async () => wecallMockData.routing.connectors,
  routes: async () => wecallMockData.routing.routes,
};
