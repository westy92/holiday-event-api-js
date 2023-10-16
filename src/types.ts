/**
 * Data needed to create a new API client.
 */
export type HolidaysConfig = {
  /**
   * Your API Key.
   * Get a FREE API key from https://apilayer.com/marketplace/checkiday-api#pricing
   */
  apiKey: string;
};

/**
 * A summary of an Event
 */
export type EventSummary = {
  /**
   * The Event Id
   */
  id: string;
  /**
   * The Event name
   */
  name: string;
  /**
   * The Event URL
   */
  url: string;
};

/**
 * Information about an Event's Alternate Name
 */
export type AlternateName = {
  /**
   * An Event's Alternate Name
   */
  name: string;
  /**
   * The first year this Alternate Name was in effect (null implies none or unknown)
   */
  first_year?: number;
  /**
   * The last year this Alternate Name was in effect (null implies none or unknown)
   */
  last_year?: number;
};

/**
 * Information about an Event image
 */
export type ImageInfo = {
  /**
   * A small image
   */
  small: string;
  /**
   * A medium image
   */
  medium: string;
  /**
   * A large image
   */
  large: string;
};

/**
 * Information about an Event Founder
 */
export type FounderInfo = {
  /**
   * The Founder's name
   */
  name: string;
  /**
   * A link to the Founder
   */
  url?: string;
  /**
   * The date the Event was founded
   */
  date?: string;
};

/**
 * Information about an Event tag
 */
export type Tag = {
  /**
   * The name of the tag.
   */
  name: string;
};

/**
 * Formatted Text
 */
export type RichText = {
  /**
   * Formatted as plain text
   */
  text?: string;
  /**
   * Formatted as HTML
   */
  html?: string;
  /**
   * Formatted as Markdown
   */
  markdown?: string;
};

/**
 * Information about an Event's Pattern
 */
export type Pattern = {
  /**
   * The first year this event is observed (null implies none or unknown)
   */
  first_year?: number;
  /**
   * The last year this event is observed (null implies none or unknown)
   */
  last_year?: number;
  /**
   * A description of how this event is observed (formatted as plain text)
   */
  observed: string;
  /**
   * A description of how this event is observed (formatted as HTML)
   */
  observed_html: string;
  /**
   * A description of how this event is observed (formatted as Markdown)
   */
  observed_markdown: string;
  /**
   * For how many days this event is celebrated
   */
  length: number;
};

/**
 * Information about an Event's Occurrence
 */
export type Occurrence = {
  /**
   * The date or timestamp the Event occurs
   */
  date: string;
  /**
   * The length (in days) of the Event occurrence
   */
  length: number;
};

/**
 * Your API plan's current Rate Limit and status. Upgrade to increase these limits.
 */
export type RateLimit = {
  /**
   * The amount of requests allowed this month
   */
  limitMonth: number;
  /**
   * The amount of requests remaining this month
   */
  remainingMonth: number;
}

/**
 * The API's standard response
 */
export type StandardResponse = {
  /**
   * The API plan's current rate limit and status
   */
  rateLimit: RateLimit;
};

/**
 * The Request for calling GetEvents
 */
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

/**
 * The Response returned by getEvents
 */
export type GetEventsResponse = StandardResponse & {
  /**
   * Whether Adult entries can be included
   */
  adult: boolean;
  /**
   * The Date string
   */
  date: string | number;
  /**
   * The Timezone used to calculate the Date's Events
   */
  timezone: string;
  /**
   * The Date's Events
   */
  events: EventSummary[];
  /**
   * Multi-day Events that start on Date
   */
  multiday_starting?: EventSummary[];
  /**
   * Multi-day Events that are continuing their observance on Date
   */
  multiday_ongoing?: EventSummary[];
};

/**
 * The Request for calling getEventInfo
 */
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

/**
 * The Response returned by getEventInfo
 */
export type GetEventInfoResponse = StandardResponse & {
  event: EventSummary & {
    /**
     * Whether this Event is unsafe for children or viewing at work
     */
    adult: boolean;
    /**
     * The Event's Alternate Names
     */
    alternate_names: AlternateName[];
    /**
     * The Event's hashtags
     */
    hashtags?: string[];
    /**
     * The Event's images
     */
    image?: ImageInfo;
    /**
     * The Event's sources
     */
    sources?: string[];
    /**
     * The Event's description
     */
    description?: RichText;
    /**
     * How to observe the Event
     */
    how_to_observe?: RichText;
    /**
     * Patterns defining when the Event is observed
     */
    patterns?: Pattern[];
    /**
     * The Event Occurrences (when it occurs)
     */
    occurrences?: Occurrence[];
    /**
     * The Event's founders
     */
    founders?: FounderInfo[];
    /**
     * The Event's tags
     */
    tags?: Tag[];
  };
};

/**
 * The Request for calling search
 */
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

/**
 * The Response returned by search
 */
export type SearchResponse = StandardResponse & {
  /**
   * The search query
   */
  query: string;
  /**
   * Whether Adult entries can be included
   */
  adult: boolean;
  /**
   * The found Events
   */
  events: EventSummary[];
};
