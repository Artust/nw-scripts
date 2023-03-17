const { ENV } = process.env;

exports.constants = {
  PLUGIN: ENV === 'staging' ? 'pluginAuthTableStaging': 'pluginAuthTable',
  SETTING_OFFICE: `garoon-office-${ENV}-setting`,
  USER_OFFICE:  `garoon-office-${ENV}-user-info`,
  TASK_OFFICE:  `garoon-office-${ENV}-task`,
  EVENT_OFFICE:  `garoon-office-${ENV}-event-app`,
  MAIL_OFFICE:  `garoon-office-${ENV}-mail-history`,
  SETTING_GOOGLE:  `garoon-google-${ENV}-setting`,
  USER_GOOGLE:  `garoon-google-${ENV}-user-info`,
  TASK_GOOGLE:  `garoon-google-${ENV}-task`,
  EVENT_GOOGLE:  `garoon-google-${ENV}-event-app`,
  MAIL_GOOGLE:  `garoon-google-${ENV}-mail-history`,
};
