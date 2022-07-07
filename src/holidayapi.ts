import fetch from 'node-fetch';
import { URL, URLSearchParams } from 'url';

import {
  GetEventsRequest,
  GetEventsResponse,
  HolidayApiConfig,
} from './types';

export class HolidayApi {
  private apiKey: string;
  private version: string = '0.0.1';
  private baseUrl: string = 'https://api.apilayer.com/checkiday/';
  private userAgent: string = 'HolidayApiJs/' + this.version;

  constructor(config: HolidayApiConfig) {
    this.apiKey = config.apiKey;
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
}
