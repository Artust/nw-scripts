const moment = require('moment-timezone');

const querystring = require('querystring');
const request = require('request-promise');
const { baseURL, tz, QUERY_DAY } = require('../../utils/constants');

const getHeaders = (token, userTimezone) => ({
  Authorization: `Bearer ${token}`,
  'Content-Type': 'application/json',
  Prefer: `outlook.timezone="${userTimezone || tz}"`,
});

const getAllEventsOffice = (user, nextLink) => {
  // eslint-disable-next-line camelcase
  const { officeCalendarId, office_access_token } = user;

  const conditions = {
    //   startDateTime: moment().tz(options.userTimezone ? options.userTimezone : tz).format("YYYY-MM-DDT[00:00:01]Z"),
    startDateTime: moment().format('YYYY-MM-DDT[00:00:01]Z'),
    //   endDateTime: moment().add(DayRangeEnd, "days").tz(options.userTimezone ? options.userTimezone : tz).format("YYYY-MM-DDT[00:00:00]Z"),
    endDateTime: moment().format('YYYY-MM-DDT[00:00:01]Z'),
    $select:
      'id,subject,start,end,body,bodyPreview,organizer,attendees,isAllDay,categories,location,locations,sensitivity,recurrence,type,seriesMasterId,isOrganizer,createdDateTime,lastModifiedDateTime',
    top: 1000,
    $filter: 'isOrganizer eq true',
  };

  const query = querystring.stringify(conditions);
  const uri = officeCalendarId
    ? `${baseURL.OFFICE_BASE_URL}/me/calendars/${officeCalendarId}/calendarView?${query}`
    : `${baseURL.OFFICE_BASE_URL}/me/calendar/calendarView?${query}`;

  return request
    .get({
      headers: getHeaders(office_access_token, user.userTimezone),
      uri: nextLink || uri,
      json: true,
    })
    .then((body) => {
      if (body['@odata.nextLink']) {
        return getAllEventsOffice(user, body['@odata.nextLink']).then((events) => [...events, ...body.value]);
      }
      return body.value;
    });
};

module.exports = {
  getAllEventsOffice,
};
