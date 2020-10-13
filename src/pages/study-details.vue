<template>
  <div class="study_details">
    <MainHeader />
    <SideMenu :studyData="studyData" />
    <div class="content has-header">
      <div class="row details_bg" v-if="studyDetails">
        <div class="container p-20 container-content">
          <BrandingDetails
            class="pb-12"
            :brandingDetails="studyDetails.studyBrandingDetails"
            v-if="studyDetails.studyBrandingDetails"
          />
          <StudyMilestones
            class="pb-12"
            :studyMilestones="studyDetails.milestonesList"
            v-if="studyDetails.milestonesList && studyDetails.milestonesList.length > 0"
          />
          <ParticipantTriggerDayZeroDetail v-if="studyDetails.isManualStudyStart"></ParticipantTriggerDayZeroDetail>
          <RegistrationDetails
            class="pb-12"
            :registrationDetails="studyDetails.registrationDetails.participantRegistrationConfigDetails"
            v-if="studyDetails.registrationDetails"
          />
          <OnboardingDetails
            class="pb-12"
            :onboardingDetails="studyDetails.welcomeScreenDetails"
            v-if="studyDetails.welcomeScreenDetails"
          />
          <EligibilityDetails
            class="pb-12"
            :eligibilityDetails="studyDetails.eligibilityQuestionsDetails"
            v-if="studyDetails.eligibilityQuestionsDetails && studyDetails.eligibilityQuestionsDetails.length > 0"
          />
          <eConsentDetails
            class="pb-12"
            :eConsentDetails="studyDetails.eConsentsDetails"
            :isMultipleConsent="isMultipleConsent"
            v-if="!isMultipleConsent && studyDetails.eConsentsDetails"
          />
          <eConsentDetails
            class="pb-12"
            :eConsentDetails="studyDetails.eConsentsDetails"
            :isMultipleConsent="isMultipleConsent"
            v-if="isMultipleConsent && studyDetails.eConsentsDetails"
          />
          <SurveyDetails
            class="pb-12"
            :surveyDetails="surveyDetails"
            v-if="studyDetails.surveysSelected && surveyDetails"
          />
          <ePRODetails
            class="pb-12"
            :eprosDetails="eprosDetails"
            v-if="studyDetails.eprosSelected && eprosDetails"
          />
          <eDRODetails
            class="pb-12"
            :edroDetails="studyDetails.edroDetails"
            v-if="studyDetails.edroDetails"
          />
          <MobileHealthDataAccess
            class="pb-12"
            :mobileHealthDetails="studyDetails.healthDataAccessDetails"
            v-if="studyDetails.healthDataAccessDetails && studyDetails.healthDataAccessDetails.length > 0"
          />
          <DashboardDetails
            class="pb-12"
            :dashboardDetails="studyDetails.dashboardDetails"
            v-if="studyDetails.dashboardDetails"
          />
          <NotificationsDetails
            class="pb-12"
            :notificationDetails="studyDetails.customNotificationDetails"
            v-if="studyDetails.customNotificationDetails && studyDetails.customNotificationDetails.length > 0"
          />
          <MedicalDevices
            class="pb-12"
            :medicalDeviceDetails="studyDetails.medicalDevicesWearablesDetails"
            v-if="studyDetails.medicalDevicesWearablesDetails"
          />
          <EngagementContent
            class="pb-12"
            :engagementContentDetails="studyDetails.learnMoreDetails"
            v-if="studyDetails.learnMoreDetails"
          />
          <TeleHealthDetails
            class="pb-12"
            :visits="visitDetails"
            :studyDetails="studyDetails"
            v-if="studyData.telehealthIntegration && visitDetails.length>0"
          />
          <ParticipantWebDetails
            class="pb-12"
            :agreement="agreement"
            :eligibility="eligibility"
            :registrationformWebfields="registrationformWebfields"
            :registrationSite="registrationSite"
            :registrationSiteFact="registrationSiteFact"
            :registrationFormFlag="registrationFormFlag"
          />
          <div
            class="card p-10"
            v-if="studyDetails.activityOrderInfos && studyDetails.activityOrderInfos.length > 0"
          >
            <h6 class="fw-bold">ACTIVITY ORDER</h6>
            <div>
              <ul>
                <li
                  v-for="(activity,index) in studyDetails.activityOrderInfos"
                  :key="index"
                >{{activity.activityName}}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import sortBy from "lodash/sortBy";
import MainHeader from "../components/common/main-header";
import SideMenu from "../components/common/side-menu";
import BrandingDetails from "../components/study-details/branding-details";
import StudyMilestones from "../components/study-details/study-milestones";
import RegistrationDetails from "../components/study-details/registration-details";
import OnboardingDetails from "../components/study-details/onboarding-details";
import EligibilityDetails from "../components/study-details/eligibility-details";
import eConsentDetails from "../components/study-details/econsent-details";
import SurveyDetails from "../components/study-details/surveys-details";
import ePRODetails from "../components/study-details/epros-details";
import eDRODetails from "../components/study-details/edros-details";
import MobileHealthDataAccess from "../components/study-details/mobileHealthDataAccess";
import DashboardDetails from "../components/study-details/dashboards-details";
import NotificationsDetails from "../components/study-details/notifications-details";
import MedicalDevices from "../components/study-details/medicaldevices-wearables";
import EngagementContent from "../components/study-details/engagement-content";
import TeleHealthDetails from "../components/study-details/teleHealth-details";
import ParticipantWebDetails from "../components/study-details/participant-web-details";
import ParticipantTriggerDayZeroDetail from "../components/study-details/participant-day-zero-details";

export default {
  name: "study-details",
  data() {
    return {
      studyId: "",
      studyData: {},
      agreement: {},
      eligibility: {},
      registrationformWebfields: {},
      registrationSite: {},
      registrationSiteFact: [],
      registrationFormFlag:{},
      studyDetails: {},
      surveyDetails: [],
      eprosDetails: [],
      visitDetails: [],
      isMultipleConsent: true,
    };
  },
  methods: {
    isMultipleConsentEnabled() {
      const that = this;

      that.$api.getToggleFeaturesFact(that.studyId).then(
        (response) => {
          that.toggleFeatures = response.body.studyFeatures;
          const isEconsent = that.toggleFeatures.filter(
            (x) => x.featureKey == "ECONSENT"
          ); // eslint-disable-line
          if (
            (isEconsent == null ||
              isEconsent == undefined ||
              isEconsent == "") &&
            isEconsent.length == 0
          ) {
            // eslint-disable-line
            that.isMultipleConsent = true;
          } else {
            that.isMultipleConsent = false;
          }
          this.toggleStudyDetails();
        },
        (error) => {
          that.$toastr.error(
            error.body && error.body.message
              ? error.body.message
              : "Error while getting features."
          );
        }
      );
    },
    toggleStudyDetails() {
      const that = this;
      if (that.isMultipleConsent === false) {
        this.getStudyDetails();
      } else {
        this.getStudyDetailsV2();
      }
    },
    getStudyData() {
      this.$api.getStudyDataFact(this.studyId).then((response) => {
        this.studyData = response.body;
      });
    },
    getParticipantWeb() {
      let sitesFact = [];
      let webAddSites = [];
        this.$api
          .getParticipantWebAddSites(this.studyId)
          .then((response) => {
            if (response) {
              webAddSites = response.body.data;
              this.$api
              .getSitesFact(this.studyId)
              .then((response) => {
                if (response) {
                  sitesFact = response.body;
                  if(webAddSites) {
                    webAddSites.forEach((e,i)=>{
                    let temp = sitesFact.find(element=> element.id === e.site_id) 
                    if(temp) {
                      this.registrationSiteFact.push(temp);
                    } 
                  })
                  }
                }
              })
              .catch((err) => {
              throw err;
              });
            }
          })
          .catch((err) => {
            throw err;
          });
         this.$api
        .getParticipantWebAgreement(this.studyId)
        .then((response) => {
          if (response.data.data) {
            this.agreement = response.data.data;
          }
        })
        .catch((err) => {
          throw err;
        });
      this.$api
        .getParticipantWebEligibility(this.studyId)
        .then((response) => {
          if (response.data.data) {
            this.eligibility = response.data.data;
          }
        })
        .catch((err) => {
          throw err;
        });
      // web api
      // getParticipantWebAddSites
       this.$api
      .getParticipantWebRegistration(this.studyId)
      .then(response => {
        if (response) {
          this.registrationFormFlag = response.body;
        }
      })
      .catch(err => {
        throw err;
      });
      this.$api
        .getParticipantWebRegistrationForm(this.studyId)
        .then((response) => {
          if (response.data.data) {
            this.registrationformWebfields = response.data.data;
          }
        })
        .catch((err) => {
          throw err;
        });

      // sites api

      this.$api
        .getRegistrationFact(this.studyId)
        .then((response) => {
          if (response) {
            // participantRegistrationConfigDetails
            this.registrationSite = response.body;
          }
        })
        .catch((err) => {
          throw err;
        });
     
    },
    getStudyDetails() {
      this.$api.getStudyDetailsFact(this.studyId).then((response) => {
        let order = false;
        this.studyDetails = response.body;

        //Extract the telehealth visits from the Study Details
        this.getVisitDetails();

        if (response.body.activityOrderInfos) {
          response.body.activityOrderInfos.forEach((item, index) => {
            if (item.displayOrder === null) {
              order = true;
            }
          });
          if (order === true) {
            this.studyDetails.activityOrderInfos = sortBy(
              response.body.activityOrderInfos,
              "sequence"
            );
          } else {
            this.studyDetails.activityOrderInfos = sortBy(
              response.body.activityOrderInfos,
              "displayOrder"
            );
          }
        }
        if (this.studyDetails.surveysSelected) {
          this.getSurveyDetails();
        }
        if (this.studyDetails.eprosSelected) {
          this.geteprosDetails();
        }
      });
    },
    getStudyDetailsV2() {
      this.$api.getStudyDetailsFactV2(this.studyId).then((response) => {
        let order = false;
        this.studyDetails = response.body;

        //Extract the telehealth visits from the Study Details
        this.getVisitDetails();

        if (response.body.activityOrderInfos) {
          response.body.activityOrderInfos.forEach((item, index) => {
            if (item.displayOrder === null) {
              order = true;
            }
          });
          if (order === true) {
            this.studyDetails.activityOrderInfos = sortBy(
              response.body.activityOrderInfos,
              "sequence"
            );
          } else {
            this.studyDetails.activityOrderInfos = sortBy(
              response.body.activityOrderInfos,
              "displayOrder"
            );
          }
        }
        if (this.studyDetails.surveysSelected) {
          this.getSurveyDetails();
        }
        if (this.studyDetails.eprosSelected) {
          this.geteprosDetails();
        }

        if (
          this.studyDetails.eConsentsDetails.consentConfigurationSort &&
          this.studyDetails.eConsentsDetails.consentConfigurationSort.length > 0
        ) {
          _.map(
            this.studyDetails.eConsentsDetails.consentConfigurationSort,
            (consent) => {
              if (
                consent.listOfDisclaimer &&
                consent.listOfDisclaimer.length > 0
              ) {
                consent.listOfDisclaimer = _.filter(
                  consent.listOfDisclaimer,
                  "status"
                );
              }
            }
          );
        }
      });
    },
    getSurveyDetails() {
      this.$api.getStudySurveyDetailsFact(this.studyId).then((response) => {
        this.surveyDetails = sortBy(response.body, "sequence");
      });
    },
    geteprosDetails() {
      this.$api.getStudyeprosDetailsFact(this.studyId).then((response) => {
        this.eprosDetails = response.body;
      });
    },
    getVisitDetails() {
      if (
        this.studyDetails.telehealthVisits &&
        this.studyDetails.telehealthVisits.length > 0
      ) {
        this.visitDetails = this.studyDetails.telehealthVisits;
      }
    },
  },
  components: {
    MainHeader,
    SideMenu,
    BrandingDetails,
    StudyMilestones,
    RegistrationDetails,
    OnboardingDetails,
    EligibilityDetails,
    eConsentDetails,
    SurveyDetails,
    ePRODetails,
    eDRODetails,
    MobileHealthDataAccess,
    DashboardDetails,
    NotificationsDetails,
    MedicalDevices,
    EngagementContent,
    TeleHealthDetails,
    ParticipantWebDetails,
    ParticipantTriggerDayZeroDetail
  },
  mounted() {
    this.studyId = this.$route.params.studyId;
    this.getStudyData();
    // this.getStudyDetails();
    setTimeout(() => {
      this.getParticipantWeb();
    }, 1000);
    this.isMultipleConsentEnabled();
  },
};
</script>

<style scoped lang="scss">
.study_details {
  display: flex;
  background-color: #f5f8fa;
}
.container-content {
  max-width: 100%;
}
.content {
  width: 100%;
  padding: 20px;
}
.details_bg {
  border-radius: 3px;
  background-color: #ffffff;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
}
</style>
