const moment = require('moment-timezone');
const querystring = require('querystring');
const request = require('request-promise');
const { baseURL, tz, QUERY_DAY } = require('../../utils/constants');

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CLIENT_ID_PROD, GOOGLE_CLIENT_SECRET_PROD, ENV } = process.env;

const getHeaders = (token) => ({
  Authorization: `Bearer ${token}`,
  'Content-Type': 'application/json',
});

const getAllEventsGoogle = (user, pageToken) => {
  // eslint-disable-next-line camelcase
  const { google_access_token } = user;
  const googleCalendarId = user.googleCalendarId || 'primary';
  const conditions = {
    timeMin: moment()
      .tz(user.userTimezone || tz)
      .format('YYYY-MM-DDT[00:00:00]Z'),
    timeMax: moment()
      .add(QUERY_DAY.END, 'days')
      .tz(user.userTimezone || tz)
      .format('YYYY-MM-DDT[00:00:00]Z'),
    maxResults: 2500,
    singleEvents: true,
    timeZone: user.userTimezone || tz,
  };

  if (pageToken) {
    conditions.pageToken = pageToken;
  }

  const query = querystring.stringify(conditions);
  const uri = `${baseURL.GOOGLE_BASE_URL}/calendar/v3/calendars/${googleCalendarId}/events?${query}`;

  console.log('Query: ', query);
  console.log('URI: ', uri);

  return request
    .get({
      headers: getHeaders(google_access_token),
      uri,
      json: true,
    })
    .then((body) => {
      if (body.nextPageToken) {
        return getAllEventsGoogle(user, body.nextPageToken).then((events) => [...events, ...body.items]);
      }
      return body.items;
    });
};

const refreshToken = (google_refresh_token) => {
  const now = new Date();
  if (!google_refresh_token) {
    return Promise.resolve(null);
  }

  const params = {
    refresh_token: google_refresh_token,
    client_id: ENV === 'prod' ? GOOGLE_CLIENT_ID_PROD : GOOGLE_CLIENT_ID,
    client_secret: ENV === 'prod' ? GOOGLE_CLIENT_SECRET_PROD : GOOGLE_CLIENT_SECRET,
    grant_type: 'refresh_token',
  };

  console.log('Params: ', params);

  return request
    .post({
      uri: `${baseURL.GOOGLE_BASE_URL}/oauth2/v4/token`,
      headers: {
        'Content-type': 'application/x-www-form-urlencoded',
      },
      body: querystring.stringify(params),
      json: true,
    })
    .then((body) => {
      console.log('Refresh token: ', body);
      now.setMinutes(now.getMinutes() + 40); // timestamp
      const then = new Date(now).toISOString();
      return {
        google_access_token: body.access_token,
        google_expires_on: then,
      };
    });
};

module.exports = {
  getAllEventsGoogle,
  refreshToken,
};
