'use strict';
const merge = require('webpack-merge');
const prodEnv = require('./prod.env');

const API_BASE_URL = process.env.API_BASE_URL ? JSON.stringify(process.env.API_BASE_URL) : '';
const API_ANALYTICS_BASE_URL = process.env.API_ANALYTICS_BASE_URL ? JSON.stringify(process.env.API_ANALYTICS_BASE_URL) : '';
const API_PARTICIPANT_WEB_BASE_URL = process.env.API_PARTICIPANT_WEB_BASE_URL ? JSON.stringify(process.env.API_PARTICIPANT_WEB_BASE_URL) : '';

module.exports = merge(prodEnv, {
  VUE_APP_NODE_ENV: '"development"',
  VUE_APP_API_BASE_URL: API_BASE_URL || '"https://clientonbelb.styx.threadresearch.com"',
  VUE_APP_API_ANALYTICS_BASE_URL: API_ANALYTICS_BASE_URL || '"https://us-east-1-dev-analytics-microservice.styx.threadresearch.com"',
  VUE_APP_API_PARTICIPANT_WEB_BASE_URL: API_PARTICIPANT_WEB_BASE_URL || '"https://us-east-1-dev-web.styx.threadresearch.com"',
});
