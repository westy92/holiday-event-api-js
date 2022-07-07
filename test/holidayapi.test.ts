import * as nock from 'nock';
import { HolidayApi } from '../src/holidayapi';

const PACKAGE_VERSION = require('../package.json').version;

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
      .reply(200);
    
    const api = new HolidayApi({ apiKey: 'abc123' });
    await api.getEvents();
  });

  test('passes along user-agent', async () => {
    nock('https://api.apilayer.com/checkiday/', {
      reqheaders: {
        'user-agent': `HolidayApiJs/${PACKAGE_VERSION}`,
      },
    }).get('/events')
      .reply(200);
    
    const api = new HolidayApi({ apiKey: 'abc123' });
    await api.getEvents();
  });

  test('passes along error', async () => {
    nock('https://api.apilayer.com/checkiday/', {
    }).get('/events')
      .reply(401, { error: 'MyError!' });
    
    const api = new HolidayApi({ apiKey: 'abc123' });
    expect(api.getEvents()).rejects.toThrowError('MyError!');
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
