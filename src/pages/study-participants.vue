<template>
  <div>
    <mainHeader></mainHeader>
    <sideMenu :studyData="studyData"></sideMenu>
    <div class="has-sidemenu has-header">
      <navBar v-if="isDetailPage" :routes="navBarRoutes" />
      <router-view :studyData="studyData" :studyId="studyId"></router-view>
    </div>
  </div>
</template>

<script>
import mainHeader from '@/components/common/main-header';
import sideMenu from '@/components/common/side-menu';
import navBar from '@/components/common/nav-bar';
import { mapGetters, mapActions } from "vuex";
import { SYSTEM_ADMIN, STUDY_ADMIN, PI, SUB_PI, STUDY_COORDINATOR, HOME_HEALTH, QUALITY, SITEDATALOCK  } from "@/constants/authRoles";
import { AclRule } from "vue-acl";
export default {
  name: 'study-participants-page-wrapper',
  components: {
    mainHeader,
    sideMenu,
    navBar,
  },
  data() {
    return {
      studyData: {},
      toggleFeatures: [],
      teleHealthConfigured: false,
      edcEnabled: false,
      telehealthEnabled: false,
    };
  },
  computed: {
    ...mapGetters(["user"]),
    userAccess() {
      return new AclRule(this.user.userRole).generate();
    },
    canView() {
      return this.studyData.truClinicIntegration;
    },
    canTelehealthView() {
      return this.studyData.telehealthIntegration;
    },
    canSysAdminAccess() {
      this.$acl.change(`${SYSTEM_ADMIN}`);
      return this.$acl.check("userAccess");
    },
    canStudyAdminAccess() {
      this.$acl.change(`${STUDY_ADMIN}`);
      return this.$acl.check("userAccess");
    },
    canPiAccess() {
      this.$acl.change(`${PI}`);
      return this.$acl.check("userAccess");
    },
    canSubPiAccess() {
      this.$acl.change(`${SUB_PI}`);
      return this.$acl.check("userAccess");
    },
    canStudyCoordinatorAccess() {
      this.$acl.change(`${STUDY_COORDINATOR}`);
      return this.$acl.check("userAccess");
    },
    canQualityAccess() {
      this.$acl.change(`${QUALITY}`);
      return this.$acl.check("userAccess");
    },
    canHomeHealthAccess() {
      this.$acl.change(`${HOME_HEALTH}`);
      return this.$acl.check("userAccess");
    },
    isTelehealthEnabledForCountry(){
      return this.user.countries && _.chain(this.user.countries).filter({'isTelehealthEnabled': true}).size().value()>0;
    },
    canSiteTeamMemberAccess(){
      return this.canPiAccess || this.canSubPiAccess || this.canHomeHealthAccess || this.canStudyCoordinatorAccess || this.canSiteDataLockAccess;
    },
    studyId() {
      return this.$route.params.studyId;
    },
    isDetailPage() {
      const noTabPages = ['study-participants-list'];
      if (this.edcEnabled) {
        noTabPages.push('study-participants-edc-data-dashboard');
      }
      if (this.telehealthEnabled && this.teleHealthConfigured) {
        noTabPages.push('study-participants-data-dashboard');
      }
      noTabPages.push('study-participant-documents');
      noTabPages.push('study-participant-messages');
      noTabPages.push('study-participant-compose-message');
      return noTabPages.includes(this.$route.name);
    },
    navBarRoutes() {
      const routes = [
        {
          label: 'Participant List',
          to: {
            name: 'study-participants-list',
            params: { studyId: this.studyId },
          },
        },
      ];
      if (this.edcEnabled) {
        routes.push({
          label: 'EDC Data Dashboard',
          to: {
            name: 'study-participants-edc-data-dashboard',
            params: { studyId: this.studyId}
          },
        });
      }
      if (this.telehealthEnabled && this.teleHealthConfigured) {
        routes.push({
          label: 'Data Dashboard',
          to: {
            name: 'study-participants-data-dashboard',
            params: { studyId: this.studyId },
          },
        });
      }
      if(this.canSiteTeamMemberAccess){
        routes.push({
          label: 'Documents',
          to: {
            name: 'study-participant-documents',
            params: { studyId: this.studyId },
          },
        });
      }
      if(this.canSiteTeamMemberAccess && !this.canSiteDataLockAccess){
        routes.push({
          label: 'Messages',
          to: {
            name: 'study-participant-messages',
            params: { studyId: this.studyId },
          },
        });
      }
      return routes;
    },
    canSiteDataLockAccess() {
      this.$acl.change(`${SITEDATALOCK}`);
      return this.$acl.check("userAccess");
    }
  },
  mounted() {
    this.$api
      .getStudyDataFact(this.studyId)
      .then(response => {
        this.studyData = response.body;
        console.log("study data ",this.studyData);
        this.teleHealthConfigured = response.body.truClinicIntegration;
      })
      .catch(error => {
        const { message = 'Error while getting study data' } = (error && error.body) || {};
        this.$toastr.error(message);
      });
    this.getToggledFeatures();
  },
  methods: {
    getToggledFeatures() {
      this.$api.getToggleFeaturesFact(this.studyId).then(
        response => {
          if (response.body) {
            this.toggleFeatures = response.body.studyFeatures;
            this.toggleFeatures.forEach(feature => {
              if (feature.featureKey === 'EDC') {
                this.edcEnabled = feature.enabled;
              }
              if (feature.featureKey === 'TruClinic') {
                this.telehealthEnabled = feature.enabled;
              }
            });
          }
        },
        error => {
          this.$toastr.error(error.body && error.body.message
            ? error.body.message : 'Error while getting features.');
        },
      );
    },
  },
};
</script>
