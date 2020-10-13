import * as studyService from './study-service';
import * as authService from './auth-service';
import * as featureNavigationService from './feature-navigation-service';

const services = {
  ...studyService,
  ...authService,
  ...featureNavigationService,
};

export default services;
