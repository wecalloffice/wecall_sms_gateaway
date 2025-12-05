import { wecallMockData } from "../data/wecallMockData";

const events = [...wecallMockData.observability.events];

export const mockObservability = {
  listEvents: async (filter?: any) => {
    if (!filter) return events;
    return events.filter((e) => {
      if (filter.type && e.type !== filter.type) return false;
      if (filter.actor && e.actor !== filter.actor) return false;
      return true;
    });
  },
  pushEvent: async (ev: any) => {
    const entry = { sid: `EVT${1000 + events.length + 1}`, ...ev, timestamp: new Date().toISOString() };
    events.unshift(entry);
    return entry;
  },
};
