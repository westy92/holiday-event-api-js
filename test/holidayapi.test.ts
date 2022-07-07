import { HolidayApi } from '../src/holidayapi';

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
