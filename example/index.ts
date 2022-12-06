import { HolidayApi } from 'holiday-event-api';

// Get a FREE API key from https://apilayer.com/marketplace/checkiday-api#pricing
const holidayApi = new HolidayApi({ apiKey: '<Your API Key Here>' });

(async () => {
  try {
    // Get Events for a given Date
    const result = await holidayApi.getEvents({
      // These parameters are the defaults but can be specified:
      // date: 'today',
      // timezone: 'America/Chicago',
      // adult: false,
    });
    const event = result.events[0];
    console.log(`Today is ${event.name}! Find more information at: ${event.url}.`);
    console.log(`Rate limits remaining: ${result.rateLimit.remainingMonth}/${result.rateLimit.limitMonth} (month).`);

    // Get Event Information
    const eventInfo = await holidayApi.getEventInfo({
      id: event.id,
      // These parameters can be specified to calculate the range of eventInfo.Event.Occurrences
      //start: 2020,
      //end: 2030,
    });

    console.log(`The Event's hashtags are ${eventInfo.event.hashtags}.`);

    // Search for Events
    const query = 'pizza day';
    const search = await holidayApi.search({
      query: query,
      // These parameters are the defaults but can be specified:
      // adult: false,
    });

    console.log(`Found ${search.events.length} events, including ${search.events[0].name}, that match the query '${query}'.`);
  } catch (err) {
    console.log(`There was an error: ` + err);
  }
})();
