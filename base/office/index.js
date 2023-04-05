const moment = require('moment-timezone');

const querystring = require('querystring');
const request = require('request-promise');
const { baseURL, tz, QUERY_DAY } = require('../../utils/constants');

const {
  ENV,
  OFFICE_CLIENT_ID,
  OFFICE_CLIENT_SECRET,
  OFFICE_REDIRECT_URI,
  OFFICE_CLIENT_ID_PROD,
  OFFICE_CLIENT_SECRET_PROD,
  OFFICE_REDIRECT_URI_PROD,
} = process.env;

const getHeaders = (token, userTimezone) => ({
  Authorization: `Bearer ${token}`,
  'Content-Type': 'application/json',
  Prefer: `outlook.timezone="${userTimezone || tz}"`,
});

const getAllEvents = (user, nextLink) => {
  // eslint-disable-next-line camelcase
  const { officeCalendarId, office_access_token } = user;

  const conditions = {
    startDateTime: moment().format('YYYY-MM-DDT[00:00:01]Z'),
    endDateTime: moment().add(QUERY_DAY.END, 'days').format('YYYY-MM-DDT[00:00:01]Z'),
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
        return getAllEvents(user, body['@odata.nextLink']).then((events) => [...events, ...body.value]);
      }
      return body.value;
    });
};

const refreshToken = (office_refresh_token) => {
  const now = new Date();
  if (!office_refresh_token) {
    return Promise.resolve(null);
  }

  const params = {
    client_id: ENV === 'prod' ? OFFICE_CLIENT_ID_PROD : OFFICE_CLIENT_ID,
    client_secret: ENV === 'prod' ? OFFICE_CLIENT_SECRET_PROD : OFFICE_CLIENT_SECRET,
    grant_type: 'refresh_token',
    scope: 'openid profile offline_access User.ReadWrite Calendars.ReadWrite Calendars.ReadWrite.Shared',
    redirect_uri: ENV === 'prod' ? OFFICE_REDIRECT_URI_PROD : OFFICE_REDIRECT_URI,
    refresh_token: office_refresh_token,
  };
  console.log("Params: ", params);

  return request
    .post({
      uri: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
      headers: {
        'Content-type': 'application/x-www-form-urlencoded',
      },
      body: querystring.stringify(params),
      json: true,
    })
    .then((rs) => {
      console.log('Refresh token: ', rs);
      now.setMinutes(now.getMinutes() + 40); // timestamp
      const then = new Date(now).toISOString();
      return {
        office_refresh_token: rs.refresh_token,
        office_access_token: rs.access_token,
        office_expires_on: then,
      };
    });
};

module.exports = {
  getAllEvents,
  refreshToken,
};
