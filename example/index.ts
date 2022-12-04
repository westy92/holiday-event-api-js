import { HolidayApi } from 'holiday-event-api';

const holidayApi = new HolidayApi({ apiKey: '<Your API Key Here>' });

(async () => {
  try {
    const result = await holidayApi.getEvents();
    const randomEvent = result.events[Math.floor(Math.random() * result.events.length)];
    console.log(`Today is ${randomEvent.name}! Find more information at: ${randomEvent.url}.`);
    console.log(`Rate limits remaining: ${result.rateLimit.remainingDay}/${result.rateLimit.limitDay} (day), ${result.rateLimit.remainingMonth}/${result.rateLimit.limitMonth} (month).`);
  } catch (err) {
    console.log(`There was an error: ` + err);
  }
})();
