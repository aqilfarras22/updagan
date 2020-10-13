const appComponent = require('./app/app');
const loginComponent = require('./auth/login');
const forgotPasswordComponent = require('./auth/forgot-password');
const resetPasswordComponent = require('./auth/reset-password');
const sendOTPComponent = require('./auth/send-otp');
const resetPswdOtp = require('./auth/reset-password-send-otp');
const expireLinkComponent = require('./auth/expire-link');
const aboutYouComponent = require('./auth/about-you');
const studiesComponent = require('./studies/studies');
const dashboardComponent = require('./dashboard/dashboard');
const inviteAdminsComponent = require('./invite-admins/invite-admins');
const createPasswordComponent = require('./auth/create-password');
const pageNotFoundComponent = require('./errors/page-not-found');
const surveyDetailsComponent = require('./survey-builder/survey-details');
const surveyInstructionsComponent = require('./survey-builder/survey-instructions');
const surveyQuestionsComponent = require('./survey-builder/survey-questions');
const surveyReviewComponent = require('./survey-builder/survey-review');
const surveySchedulerComponent = require('./survey-builder/survey-scheduler');
const surveyAsTemplateComponent = require('./survey-builder/survey-as-template');
const surveyAddAnotherComponent = require('./survey-builder/survey-add-another');
const eproSchedulerComponent = require('./epros/epro-scheduler');
const eproDetailsComponent = require('./epros/epro-details');
const eproValidateComponent = require('./epros/epro-validate');
const eproAddAnotherComponent = require('./epros/epro-add-another');

const eproCreateComponent = require('./epros/epro-create');

const qaCardComponent = require('./common/read-only-questions');
const usersComponent = require('./users/users');
const addEditUserComponent = require('./users/add-edit-user');
const participantsComponent = require('./participants/participants-list');
const addEditParticipantComponent = require('./participants/add-edit-participant');
const participantVerifyComponent = require('./participants/verify-participant');
const participantVerifyV2Component = require('./participants/verify-participant-v2');
const participantForgotPasswordComponent = require('./participants/participant-reset-password');
const designComponent = require('./configurator/design');
const registrationComponent = require('./configurator/registration');
const healthAccessComponent = require('./configurator/health-data-access');
const brandingComponent = require('./configurator/branding');
const documentationComponent = require('./configurator/review/documentation');
const approvalComponent = require('./configurator/review/approval');
const scanComponent = require('./configurator/review/scan');
const econsentComponent = require('./configurator/econsent');
const generatePrototypeComponent = require('./configurator/review/generate-prototype');
const studyApprovalComponent = require('./configurator/review/study-approval-confirm');
const notificationsComponent = require('./configurator/notifications');
const participantDashboardsComponent = require('./configurator/participant-dashboards');
const profileComponent = require('./profile/profile');
const participantInfoComponent = require('./participants/participant-info');
const studyBuildProgessComponent = require('./configurator/study-build-progress');
const customizeFeaturesComponent = require('./configurator/customize-features');
const onboardingComponent = require('./configurator/onboarding');
const featuresLibraryComponent = require('./configurator/features-library');
const eligibilityComponent = require('./configurator/eligibility');
const surveysComponent = require('./configurator/surveys');
const eprosComponent = require('./configurator/epros');
const edroComponent = require('./configurator/edros');
const medicalDevicesComponent = require('./configurator/medical-devices');
const epicMychartComponent = require('./configurator/epic-mychart');
const studyReviewComponent = require('./configurator/review/review');
const studySummaryComponent = require('./configurator/review/study-summary');
const editeDROComponent = require('./configurator/edit-edro');
const wearablesComponent = require('./configurator/wearables');
const engagementContentComponent = require('./configurator/engagement-content');
const telehealthComponent = require('./configurator/tele-health');
const activityOrderComponent = require('./configurator/activity-order');
const featuresListFinalComponent = require('./configurator/features-library-final');
const clientsComponent = require('./clients/clients');
const clientListComponent = require('./clients/client-list');
const addNewClientMemberComponent = require('./clients/add-new-client-member');
const addEditClientMemberComponent = require('./clients/add-edit-client-member');
const addEditClientComponent = require('./clients/add-edit-client');
const clientAddedComponent = require('./clients/client-added');
const sponsersComponent = require('./sponsers/sponsers');
const sponsersListComponent = require('./sponsers/sponsers-list');
const sponserMemberAddEditComponent = require('./sponsers/sponser-member-add-edit');
const sponserMemberAddNewComponent = require('./sponsers/sponser-member-add-new');
const addEditSponserComponent = require('./sponsers/add-edit-sponser');
const sponserAddedComponent = require('./sponsers/sponser-added');
const studyLaunchComponent = require('./configurator/launch/launch');
const studyManageComponent = require('./configurator/manage/manage');

module.exports = {
  appComponent,
  loginComponent,
  forgotPasswordComponent,
  resetPasswordComponent,
  sendOTPComponent,
  resetPswdOtp,
  aboutYouComponent,
  expireLinkComponent,
  studiesComponent,
  dashboardComponent,
  inviteAdminsComponent,
  createPasswordComponent,
  pageNotFoundComponent,
  surveyAsTemplateComponent,
  surveyAddAnotherComponent,
  surveyDetailsComponent,
  surveyInstructionsComponent,
  surveyQuestionsComponent,
  surveyReviewComponent,
  qaCardComponent,
  surveySchedulerComponent,
  eproSchedulerComponent,
  eproDetailsComponent,
  eproValidateComponent,
  eproAddAnotherComponent,

  eproCreateComponent,
  eproQuestionsComponent,
  
  usersComponent,
  addEditUserComponent,
  designComponent,
  brandingComponent,
  econsentComponent,
  notificationsComponent,
  participantDashboardsComponent,
  documentationComponent,
  approvalComponent,
  scanComponent,
  generatePrototypeComponent,
  studyApprovalComponent,
  registrationComponent,
  healthAccessComponent,
  profileComponent,
  participantsComponent,
  addEditParticipantComponent,
  participantInfoComponent,
  participantVerifyComponent,
  participantVerifyV2Component,
  participantForgotPasswordComponent,
  studyBuildProgessComponent,
  customizeFeaturesComponent,
  onboardingComponent,
  featuresLibraryComponent,
  eligibilityComponent,
  surveysComponent,
  eprosComponent,
  edroComponent,
  medicalDevicesComponent,
  studySummaryComponent,
  studyReviewComponent,
  editeDROComponent,
  wearablesComponent,
  engagementContentComponent,
  telehealthComponent,
  activityOrderComponent,
  featuresListFinalComponent,
  clientsComponent,
  clientListComponent,
  addNewClientMemberComponent,
  addEditClientMemberComponent,
  addEditClientComponent,
  clientAddedComponent,
  sponsersComponent,
  sponsersListComponent,
  sponserMemberAddEditComponent,
  addEditSponserComponent,
  sponserAddedComponent,
  sponserMemberAddNewComponent,
  studyLaunchComponent,
  studyManageComponent,
  epicMychartComponent,
};
