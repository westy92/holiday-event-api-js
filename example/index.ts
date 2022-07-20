import { HolidayApi } from 'holiday-api-js';

const holidayApi = new HolidayApi({ apiKey: '<Your API Key Here>' });

(async () => {
  const result = await holidayApi.getEvents();
  const randomEvent = result.events[Math.floor(Math.random() * result.events.length)];
  console.log(`Today is ${randomEvent.name}! Find more information at: ${randomEvent.url}.`);
})();
