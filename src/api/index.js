import * as auth from './auth';
import * as studies from './studies';
import * as profile from './profile';
import * as econsent from './econsent';
import * as multieconsent from './multieconsent';
import * as surveys from './surveys';
import * as participants from './participants';
import * as users from './users';
import * as client from './client';
import * as queryTool from './query-tool';
import * as interceptors from './interceptors';
import * as activity from './activity';
import * as response from './response';
import * as sites from './sites';
import * as edc from './edc';
import * as participantweb from './participantweb';
import * as analytics from './analytics';

const apis = {
  ...auth,
  ...studies,
  ...profile,
  ...econsent,
  ...multieconsent,
  ...surveys,
  ...participants,
  ...users,
  ...client,
  ...queryTool,
  ...interceptors,
  ...activity,
  ...response,
  ...sites,
  ...edc,
  ...participantweb,
  ...analytics,
};

export default apis;
