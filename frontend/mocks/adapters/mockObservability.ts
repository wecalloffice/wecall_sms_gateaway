import { wecallMockData } from "../data/wecallMockData";

export const mockObservability = {
  events: async () => wecallMockData.observability.events,
};