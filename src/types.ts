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

export type GetEventsRequest = {
  date?: string;
  adult?: boolean;
  timezone?: string;
};

export type GetEventsResponse = {
  adult: boolean;
  date: string | number;
  timezone: string;
  events: EventSummary[];
  multiday_starting?: EventSummary[];
  multiday_ongoing?: EventSummary[];
};

export type GetEventInfoRequest = {
  id: string;
  start?: number;
  end?: number;
};

export type GetEventInfoResponse = {
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
  query: string;
  adult?: boolean;
};

export type SearchResponse = {
  query: string;
  adult: boolean;
  events: EventSummary[];
};
