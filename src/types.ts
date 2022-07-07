export type HolidayApiConfig = {
  apiKey: string;
};

export type GetEventsRequest = {
  date?: string;
  adult?: boolean;
  timezone?: string;
};

export type EventSummary = {
  id: string;
  name: string;
  url: string;
};

export type GetEventsResponse = {
  adult: boolean;
  date: string | number;
  timezone: string;
  events: EventSummary[];
  multiday_starting?: EventSummary[];
  multiday_ongoing?: EventSummary[];
};
