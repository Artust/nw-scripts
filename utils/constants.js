const { ENV } = process.env;

const constants = {
  PLUGIN: ENV === 'staging' ? 'pluginAuthTableStaging' : 'pluginAuthTable',
  SETTING_OFFICE: `garoon-office-${ENV}-setting`,
  USER_OFFICE: `garoon-office-${ENV}-user-info`,
  TASK_OFFICE: `garoon-office-${ENV}-task`,
  EVENT_OFFICE: `garoon-office-${ENV}-event-app`,
  MAIL_OFFICE: `garoon-office-${ENV}-mail-history`,
  SETTING_GOOGLE: `garoon-google-${ENV}-setting`,
  USER_GOOGLE: `garoon-google-${ENV}-user-info`,
  TASK_GOOGLE: `garoon-google-${ENV}-task`,
  EVENT_GOOGLE: `garoon-google-${ENV}-event-app`,
  MAIL_GOOGLE: `garoon-google-${ENV}-mail-history`,
};

const SIDE_ACTION = {
  GOOGLE: 'google',
  OFFICE: 'office',
};

const baseURL = {
  OFFICE_BASE_URL: `https://graph.microsoft.com/v1.0`,
  GOOGLE_BASE_URL: `https://www.googleapis.com`,
};

const FieldSyncArr = ['notes', 'attendees', 'companyInfo', 'category', 'facilities'];

const tz = 'Asia/Tokyo';

const QUERY_DAY = {
  START: 0,
  END: 365,
};

module.exports = {
  constants,
  baseURL,
  FieldSyncArr,
  tz,
  QUERY_DAY,
  SIDE_ACTION,
};
