import fetch from 'node-fetch';
import { URL, URLSearchParams } from 'url';

import {
  GetEventInfoRequest,
  GetEventInfoResponse,
  GetEventsRequest,
  GetEventsResponse,
  HolidayApiConfig,
  SearchRequest,
  SearchResponse,
} from './types';

export class HolidayApi {
  private apiKey: string;
  private version: string = '0.0.1';
  private baseUrl: string = 'https://api.apilayer.com/checkiday/';
  private userAgent: string = 'HolidayApiJs/' + this.version;

  constructor(config: HolidayApiConfig) {
    if (!config?.apiKey || config.apiKey.length == 0) {
      throw new Error('Please provide a valid API key.');
    }
    this.apiKey = config.apiKey;
  }

  async getEventInfo(request: GetEventInfoRequest): Promise<GetEventInfoResponse> {
    const url = new URL('event', this.baseUrl);
    const params: {[index: string]: string} = {};
    if (!!request?.id) {
      params.id = request?.id;
    }
    if (Number.isInteger(request?.start)) {
      params.start = request?.start.toString();
    }
    if (Number.isInteger(request?.end)) {
      params.end = request?.end.toString();
    }
    url.search = new URLSearchParams(params).toString();
    let payload: any;
    const response = await fetch(url, {
      headers: {
        apikey: this.apiKey,
        'User-Agent': this.userAgent,
      },
    });

    try {
      payload = await response.json();
    } catch (err) {
      payload = {};
    }

    if (!response.ok) {
      throw new Error(payload.error || response.statusText);
    }

    return payload;
  }

  async getEvents(request?: GetEventsRequest): Promise<GetEventsResponse> {
    const url = new URL('events', this.baseUrl);
    const params: {[index: string]: string} = {};
    if (!!request?.date) {
      params.date = request?.date;
    }
    if (request?.adult) {
      params.adult = request?.adult.toString();
    }
    if (!!request?.timezone) {
      params.timezone = request?.timezone;
    }
    url.search = new URLSearchParams(params).toString();
    let payload: any;
    const response = await fetch(url, {
      headers: {
        apikey: this.apiKey,
        'User-Agent': this.userAgent,
      },
    });

    try {
      payload = await response.json();
    } catch (err) {
      payload = {};
    }

    if (!response.ok) {
      throw new Error(payload.error || response.statusText);
    }

    return payload;
  }

  async search(request: SearchRequest): Promise<SearchResponse> {
    const url = new URL('search', this.baseUrl);
    const params: {[index: string]: string} = {};
    if (!!request?.query) {
      params.query = request?.query;
    }
    if (request?.adult) {
      params.adult = request?.adult.toString();
    }
    url.search = new URLSearchParams(params).toString();
    let payload: any;
    const response = await fetch(url, {
      headers: {
        apikey: this.apiKey,
        'User-Agent': this.userAgent,
      },
    });

    try {
      payload = await response.json();
    } catch (err) {
      payload = {};
    }

    if (!response.ok) {
      throw new Error(payload.error || response.statusText);
    }

    return payload;
  }
}
