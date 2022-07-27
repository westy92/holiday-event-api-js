export type HolidayApiConfig = {
  apiKey: string;
};

export type EventSummary = {
  id: string;
  name: string;
  url: string;
};

export type AlternateName = {
  name: string;
  first_year?: number;
  last_year?: number;
};

export type ImageInfo = {
  small: string;
  medium: string;
  large: string;
};

export type FounderInfo = {
  name: string;
  url: string;
  date: string;
};

export type RichText = {
  text?: string;
  html?: string;
  markdown?: string;
};

export type Pattern = {
  first_year?: number;
  last_year?: number;
  observed: string;
  observed_html: string;
  observed_markdown: string;
  length: number;
};

export type Occurrence = {
  date: string;
  length: number;
};

export type RateLimit = {
  limitMonth: number;
  limitDay: number;
  remainingMonth: number;
  remainingDay: number;
}

export type StandardResponse = {
  rateLimit: RateLimit;
};

export type GetEventsRequest = {
  /**
   * Date to get the events for. Defaults to today.
   */
  date?: string;
  /**
   * Include events that may be unsafe for viewing at work or by children. Default is false.
   */
  adult?: boolean;
  /**
   * IANA Time Zone for calculating dates and times. Defaults to America/Chicago.
   */
  timezone?: string;
};

export type GetEventsResponse = StandardResponse & {
  adult: boolean;
  date: string | number;
  timezone: string;
  events: EventSummary[];
  multiday_starting?: EventSummary[];
  multiday_ongoing?: EventSummary[];
};

export type GetEventInfoRequest = {
  /**
   * The ID of the requested Event.
   */
  id: string;
  /**
   * The starting range of returned occurrences. Optional, defaults to 2 years prior.
   */
  start?: number;
  /**
   * The ending range of returned occurrences. Optional, defaults to 3 years in the future.
   */
  end?: number;
};

export type GetEventInfoResponse = StandardResponse & {
  event: EventSummary & {
    adult: boolean;
    alternate_names: AlternateName[];
    hashtags?: string[];
    image?: ImageInfo;
    sources?: string[];
    description?: RichText;
    how_to_observe?: RichText;
    patterns?: Pattern[];
    occurrences?: Occurrence[];
  };
};

export type SearchRequest = {
  /**
   * The search query. Must be at least 3 characters long.
   */
  query: string;
  /**
   * Include events that may be unsafe for viewing at work or by children. Default is false.
   */
  adult?: boolean;
};

export type SearchResponse = StandardResponse & {
  query: string;
  adult: boolean;
  events: EventSummary[];
};
