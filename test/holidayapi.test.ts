import * as nock from 'nock';
import { HolidayApi } from '../src/holidayapi';
import { RateLimit } from '../src/types';

const PACKAGE_VERSION = require('../package.json').version;

afterEach(() => {
  nock.cleanAll();
  nock.enableNetConnect();
});

describe('constructor tests', () => {
  test('works with a proper-looking configuration', () => {
      expect(new HolidayApi({ apiKey: 'abc123' })).toBeInstanceOf(HolidayApi);
  });

  test('requires a configuration', () => {
    expect(() => new HolidayApi(null as any)).toThrowError('Please provide a valid API key.');
  });

  test('requires a proper-looking API key', () => {
    expect(() => new HolidayApi({} as any)).toThrowError('Please provide a valid API key.');
    expect(() => new HolidayApi({apiKey: ''})).toThrowError('Please provide a valid API key.');
  });
});

describe('common functionality tests', () => {
  test('passes along API key', async () => {
    nock('https://api.apilayer.com/checkiday/', {
      reqheaders: {
        'apikey': 'abc123',
      },
    }).get('/events')
      .reply(200, {});
    
    const api = new HolidayApi({ apiKey: 'abc123' });
    await api.getEvents();
  });

  test('passes along user-agent', async () => {
    nock('https://api.apilayer.com/checkiday/', {
      reqheaders: {
        'user-agent': `HolidayApiJs/${PACKAGE_VERSION}`,
      },
    }).get('/events')
      .reply(200, {});
    
    const api = new HolidayApi({ apiKey: 'abc123' });
    await api.getEvents();
  });

  test('passes along error', async () => {
    nock('https://api.apilayer.com/checkiday/')
      .get('/events')
      .reply(401, { error: 'MyError!' });
    
    const api = new HolidayApi({ apiKey: 'abc123' });
    expect(api.getEvents()).rejects.toThrowError('MyError!');
  });

  test('server error', async () => {
    nock('https://api.apilayer.com/checkiday/')
      .get('/events')
      .reply(500);
    
    const api = new HolidayApi({ apiKey: 'abc123' });
    expect(api.getEvents()).rejects.toThrowError('Internal Server Error');
  });

  test('server error (unknown)', async () => {
    nock('https://api.apilayer.com/checkiday/')
      .get('/events')
      .reply(599);
    
    const api = new HolidayApi({ apiKey: 'abc123' });
    expect(api.getEvents()).rejects.toThrowError('599');
  });

  test('server error (malformed response)', async () => {
    nock('https://api.apilayer.com/checkiday/')
      .get('/events')
      .reply(200, '');
    
    const api = new HolidayApi({ apiKey: 'abc123' });
    expect(api.getEvents()).rejects.toThrowError('Unable to parse response.');
  });

  test('follows redirects', async () => {
    nock('https://api.apilayer.com/checkiday/')
      .get('/events')
      .reply(302, undefined, {
        'Location': 'https://api.apilayer.com/checkiday/redirected'
      })
      .get('/redirected')
      .reply(200, {});
    
    const api = new HolidayApi({ apiKey: 'abc123' });
    await api.getEvents();
  });

  test('reports rate limits', async () => {
    nock('https://api.apilayer.com/checkiday/')
      .get('/events')
      .replyWithFile(200, 'test/responses/getEvents-default.json', {
        'X-RateLimit-Limit-Month': '100',
        'x-ratelimit-remaining-month': '88',
      });
    
    const api = new HolidayApi({ apiKey: 'abc123' });
    const response = await api.getEvents();
    expect(response.rateLimit).toEqual<RateLimit>({
      limitMonth: 100,
      remainingMonth: 88,
    });
  });
});

describe('getEvents', () => {
  test('fetches with default parameters', async () => {
    nock('https://api.apilayer.com/checkiday/')
      .get('/events')
      .replyWithFile(200, 'test/responses/getEvents-default.json');
    
    const api = new HolidayApi({ apiKey: 'abc123' });
    const response = await api.getEvents();
    expect(response.adult).toBe(false);
    expect(response.timezone).toBe('America/Chicago');
    expect(response.events).toHaveLength(2);
    expect(response.multiday_starting).toHaveLength(1);
    expect(response.multiday_ongoing).toHaveLength(2);
    expect(response.events[0]).toEqual({
      "id": "b80630ae75c35f34c0526173dd999cfc",
      "name": "Cinco de Mayo",
      "url": "https://www.checkiday.com/b80630ae75c35f34c0526173dd999cfc/cinco-de-mayo"
    });
  });

  test('fetches with set parameters', async () => {
    nock('https://api.apilayer.com/checkiday/')
      .get('/events')
      .query({
        adult: 'true',
        timezone: 'America/New_York',
        date: '7/16/1992'
      })
      .replyWithFile(200, 'test/responses/getEvents-parameters.json');
    
    const api = new HolidayApi({ apiKey: 'abc123' });
    const response = await api.getEvents({
      adult: true,
      timezone: 'America/New_York',
      date: '7/16/1992',
    });
    expect(response.adult).toBe(true);
    expect(response.timezone).toBe('America/New_York');
    expect(response.events).toHaveLength(2);
    expect(response.multiday_starting).toHaveLength(0);
    expect(response.multiday_ongoing).toHaveLength(1);
    expect(response.events[0]).toEqual({
      "id": "6ebb6fd5e483de2fde33969a6c398472",
      "name": "Get to Know Your Customers Day",
      "url": "https://www.checkiday.com/6ebb6fd5e483de2fde33969a6c398472/get-to-know-your-customers-day"
    });
  });
});

describe('getEventInfo', () => {
  test('fetches with default parameters', async () => {
    nock('https://api.apilayer.com/checkiday/')
      .get('/event')
      .query({
        id: 'f90b893ea04939d7456f30c54f68d7b4',
      })
      .replyWithFile(200, 'test/responses/getEventInfo.json');
    
    const api = new HolidayApi({ apiKey: 'abc123' });
    const response = await api.getEventInfo({
      id: 'f90b893ea04939d7456f30c54f68d7b4',
    });
    expect(response.event.id).toBe('f90b893ea04939d7456f30c54f68d7b4');
    expect(response.event.hashtags).toHaveLength(2);
  });

  test('fetches with set parameters', async () => {
    nock('https://api.apilayer.com/checkiday/')
      .get('/event')
      .query({
        id: 'f90b893ea04939d7456f30c54f68d7b4',
        start: '2002',
        end: '2003',
      })
      .replyWithFile(200, 'test/responses/getEventInfo-parameters.json');
    
    const api = new HolidayApi({ apiKey: 'abc123' });
    const response = await api.getEventInfo({
      id: 'f90b893ea04939d7456f30c54f68d7b4',
      start: 2002,
      end: 2003,
    });
    expect(response.event.occurrences).toHaveLength(2);
    expect(response.event.occurrences![0]).toEqual({
      "date": "08/08/2002",
      "length": 1
    });
  });

  test('invalid event', async () => {
    nock('https://api.apilayer.com/checkiday/')
      .get('/event')
      .query({
        id: 'hi',
      })
      .reply(404, { error: 'Event not found.' });
    
    const api = new HolidayApi({ apiKey: 'abc123' });
    expect(api.getEventInfo({ id: 'hi' })).rejects.toThrowError('Event not found.');
  });

  test('missing id', async () => {
    const api = new HolidayApi({ apiKey: 'abc123' });
    expect(api.getEventInfo({} as any)).rejects.toThrowError('Event id is required.');
  });

  test('missing parameters', async () => {
    const api = new HolidayApi({ apiKey: 'abc123' });
    expect(api.getEventInfo(undefined as any)).rejects.toThrowError('Event id is required.');
  });
});

describe('search', () => {
  test('fetches with default parameters', async () => {
    nock('https://api.apilayer.com/checkiday/')
      .get('/search')
      .query({
        query: 'zucchini',
      })
      .replyWithFile(200, 'test/responses/search-default.json');
    
    const api = new HolidayApi({ apiKey: 'abc123' });
    const response = await api.search({
      query: 'zucchini',
    });
    expect(response.adult).toBe(false);
    expect(response.query).toBe('zucchini');
    expect(response.events).toHaveLength(3);
    expect(response.events[0]).toEqual({
      "id": "cc81cbd8730098456f85f69798cbc867",
      "name": "National Zucchini Bread Day",
      "url": "https://www.checkiday.com/cc81cbd8730098456f85f69798cbc867/national-zucchini-bread-day"
    });
  });

  test('fetches with set parameters', async () => {
    nock('https://api.apilayer.com/checkiday/')
      .get('/search')
      .query({
        adult: 'true',
        query: 'porch day',
      })
      .replyWithFile(200, 'test/responses/search-parameters.json');
    
    const api = new HolidayApi({ apiKey: 'abc123' });
    const response = await api.search({
      adult: true,
      query: 'porch day',
    });
    expect(response.adult).toBe(true);
    expect(response.query).toBe('porch day');
    expect(response.events).toHaveLength(1);
    expect(response.events[0]).toEqual({
      "id": "61363236f06e4eb8e4e14e5925c2503d",
      "name": "Sneak Some Zucchini Onto Your Neighbor's Porch Day",
      "url": "https://www.checkiday.com/61363236f06e4eb8e4e14e5925c2503d/sneak-some-zucchini-onto-your-neighbors-porch-day"
    });
  });

  test('query too short', async () => {
    nock('https://api.apilayer.com/checkiday/')
      .get('/search')
      .query({
        query: 'a',
      })
      .reply(400, { error: 'Please enter a longer search term.' });
    
    const api = new HolidayApi({ apiKey: 'abc123' });
    expect(api.search({ query: 'a' })).rejects.toThrowError('Please enter a longer search term.');
  });

  test('too many results', async () => {
    nock('https://api.apilayer.com/checkiday/')
      .get('/search')
      .query({
        query: 'day',
      })
      .reply(400, { error: 'Too many results returned. Please refine your query.' });
    
    const api = new HolidayApi({ apiKey: 'abc123' });
    expect(api.search({ query: 'day' })).rejects.toThrowError('Too many results returned. Please refine your query.');
  });

  test('missing parameters', async () => {
    const api = new HolidayApi({ apiKey: 'abc123' });
    expect(api.search(undefined as any)).rejects.toThrowError('Search query is required.');
  });
});
