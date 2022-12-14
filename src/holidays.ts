import fetch from 'node-fetch';
import { URL, URLSearchParams } from 'url';

import {
  GetEventInfoRequest,
  GetEventInfoResponse,
  GetEventsRequest,
  GetEventsResponse,
  HolidaysConfig,
  SearchRequest,
  SearchResponse,
} from './types';

export class Holidays {
  private apiKey: string;
  private version: string = '1.0.0';
  private baseUrl: string = 'https://api.apilayer.com/checkiday/';
  private userAgent: string = 'HolidayApiJs/' + this.version;

  constructor(config: HolidaysConfig) {
    if (!config?.apiKey || config.apiKey.length == 0) {
      throw new Error('Please provide a valid API key. Get one at https://apilayer.com/marketplace/checkiday-api#pricing.');
    }
    this.apiKey = config.apiKey;
  }

  /**
   * Get additional information for an Event.
   * @param request the request information.
   * @returns the requested Event information.
   */
  async getEventInfo(request: GetEventInfoRequest): Promise<GetEventInfoResponse> {
    const params: {[index: string]: string} = {};
    if (!request?.id) {
      throw new Error(`Event id is required.`);
    }
    params.id = request.id;
    if (Number.isInteger(request.start)) {
      params.start = request.start.toString();
    }
    if (Number.isInteger(request.end)) {
      params.end = request.end.toString();
    }

    return this.request('event', params);
  }

  /**
   * Get all events for a specified date.
   * @param request request parameters.
   * @returns the events.
   */
  async getEvents(request?: GetEventsRequest): Promise<GetEventsResponse> {
    const params: {[index: string]: string} = {};
    if (!!request?.date) {
      params.date = request.date;
    }
    if (request?.adult) {
      params.adult = request.adult.toString();
    }
    if (!!request?.timezone) {
      params.timezone = request.timezone;
    }

    return this.request('events', params);
  }

  /**
   * Search for events.
   * @param request the search request.
   * @returns the search results.
   */
  async search(request: SearchRequest): Promise<SearchResponse> {
    const params: {[index: string]: string} = {};
    if (!request?.query) {
      throw new Error(`Search query is required.`);
    }
    params.query = request.query;
    if (request.adult) {
      params.adult = request.adult.toString();
    }

    return this.request('search', params);
  }

  private async request(path: string, params: {[index: string]: string}) {
    const url = new URL(path, this.baseUrl);
    url.search = new URLSearchParams(params).toString();
    const response = await fetch(url, {
      headers: {
        apikey: this.apiKey,
        'User-Agent': this.userAgent,
      },
    });

    let payload: any;
    try {
      payload = await response.json();
      payload.rateLimit = {
        limitMonth: parseInt(response.headers.get('x-ratelimit-limit-month'), 10),
        remainingMonth: parseInt(response.headers.get('x-ratelimit-remaining-month'), 10),
      }
    } catch (err) {
      if (response.ok) {
        throw new Error('Unable to parse response.');
      }
    }

    if (!response.ok) {
      throw new Error(payload?.error || response.statusText || response.status);
    }

    return payload;
  }
}
