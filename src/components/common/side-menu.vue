<template>
  <div id="wrapper">
    <!-- Sidebar -->
    <div id="sidebar-wrapper">
      <div class="company_name">
        <div class="header text-center">
          <span class="display_none_xs">
            <img :src="studyData.logoUrl" alt class="logo_image">
          </span>
        </div>
        <div class="client_name display_none_xs text-center pt-5">{{ studyData.name }}</div>
      </div>

      <ul class="sidebar-nav">
        <b-link v-b-toggle="`visualize_dashboard`" variant="link" class="rotate-arrow-icon opacity-50">
          <i class="simple-icon-arrow-down"></i>
          <SideMenuLink
            class="menu-item"
            faIcon="fa-tachometer"
            :to="{ name: 'dashboard', params: { studyId } }"
            title="Dashboard"
          />
        </b-link>
        <b-collapse :id="`visualize_dashboard`">
          <vis-side-menu />
        </b-collapse>
        <SideMenuLink
          class="menu-item"
          v-if="canSysAdminAccess || canStudyAdminAccess || canQualityAccess"
          icon="static/img/side-menu-icons/icn-team.svg"
          activeIcon="static/img/side-menu-icons/icn-team-active.svg"
          :to="{ name: 'study-admins', params: { studyId } }"
          title="Research Team"
        />
        <SideMenuLink
          class="menu-item"
          v-if="canPiAccess || canSubPiAccess || canStudyCoordinatorAccess || canHomeHealthAccess || canSiteDataLockAccess"
          icon="static/img/side-menu-icons/icn-team.svg"
          activeIcon="static/img/side-menu-icons/icn-team-active.svg"
          :to="{ name: 'site-details', params:{studyId: studyId, siteId: user.siteIds[0]}}"
          title="Site Team"
        />
        <SideMenuLink
          class="menu-item"
          icon="static/img/side-menu-icons/icn-participant.svg"
          activeIcon="static/img/side-menu-icons/icn-participant-active.svg"
          :to="{ name: 'study-participants-list', params: { studyId }}"
          title="Participants"
        />
        <!-- New Link added for Tele-health v2.0 (canSysAdminAccess || canStudyAdminAccess || canPiAccess) && isTelehealthV2Enabled-->
        <SideMenuLink
          class="menu-item"
          v-if="canTelehealthView && isTelehealthV2Enabled && (canPiAccess || canSubPiAccess || canStudyCoordinatorAccess || canHomeHealthAccess || canSiteDataLockAccess) && isTelehealthEnabledForCountry"
          icon="static/img/side-menu-icons/icn-telehealth-2.0.svg"
          activeIcon="static/img/side-menu-icons/icn-telehealth.svg"
          :to="{ name: 'telehealth-appointments', params: { studyId }}"
          title="Telehealth"
        />
        <SideMenuLink
          class="menu-item"
          v-if="canSysAdminAccess || canQualityAccess"
          icon="static/img/side-menu-icons/icn-documentation.svg"
          activeIcon="static/img/side-menu-icons/icn-documentation.svg"
          to
          title="Documentation"
        />
        <SideMenuLink
          class="menu-item"
          v-if="canSysAdminAccess || canSiteDataLockAccess"          
          icon="static/img/side-menu-icons/icn-view-study.svg"
          activeIcon="static/img/side-menu-icons/icn-view-study-active.svg"
          :to="{ name: 'study-details', params: { studyId } }"
          title="Study Details"
        />
        <!-- <SideMenuLink
          class=""
          v-if="(studyData.web === true) && (canSysAdminAccess || canStudyAdminAccess)"
          src="../../../public/static/img/participant-web-img/ICN_Web_App.png"
          activeIcon="../../../public/static/img/participant-web-img/ICN_Web_App.png"
          :to="{ name: 'global-element', params: { studyId }}"
          title="Participant Web"
        /> -->
        
        <!-- <span>
          <img class="menu-item-web" src="../../../public/static/img/participant-web-img/ICN_Web_App.png" />
        </span> -->
        <!-- <SideMenuLink
          class="menu-item"
          v-if="(studyData.web === true) && (canSysAdminAccess || canStudyAdminAccess)"
          faIcon="fa fa-desktop"
          :to="{ name: 'global-elements', params: { studyId } }"
          title="Participant Web"
        /> -->
        <!-- <SideMenuLink
          class="menu-item"
          v-if="(studyData.web === true) && (canSysAdminAccess || canStudyAdminAccess)"
          icon="static/img/participant-web-img/side-menu-icon.png"
          activeIcon="static/img/participant-web-img/web-icon.png"
          :to="{ name: 'global-element', params: { studyId } }"
          title="Participant Web"
        /> -->
        <SideMenuLink
          class="menu-item"
          v-if="(studyData.web === true) && (canSysAdminAccess || canStudyAdminAccess)"
          icon="static/img/participant-web-img/side-menu-icon.png"
          activeIcon="static/img/participant-web-img/web-icon.png"
          :to="{ name: 'global', params: { studyId }  }"
          title="Participant Web"
        />
        
        <SideMenuLink
          class="menu-item"
          v-if="canSysAdminAccess || canStudyAdminAccess"
          icon="/static/img/side-menu-icons/icn-modify.svg"
          activeIcon="/static/img/side-menu-icons/icn-modify.svg"
          :to="{ name: 'study-summary', params: { studyId } }"
          v-on:click.native="modifyStudy()"
          title="Modify Study"
        />
        <SideMenuLink
          class="menu-item"
          v-if="(canSysAdminAccess || canStudyAdminAccess) && edcEnabled"
          faIcon="fa-file-text"
          :to="{ name: 'forms-list', params: { studyId } }"
          title="Data capture forms"
        />
      </ul>
    </div>

    <!-- /#sidebar-wrapper -->
    <!-- Page Content -->
  </div>
</template>

<script>
import _ from "lodash";
import { mapGetters, mapActions } from "vuex";
import { SYSTEM_ADMIN, STUDY_ADMIN, PI, SUB_PI, STUDY_COORDINATOR, HOME_HEALTH, QUALITY, SITEDATALOCK  } from "@/constants/authRoles";
import { AclRule } from "vue-acl";
import SideMenuLink from "./side-menu-link";
import VisSideMenu from "./vis-side-menu";

export default {
  name: "SideMenu",
  components: {
    SideMenuLink,
    VisSideMenu
  },
  props: {
    studyData: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      studyId: this.$route.params.studyId,
      toggleFeatures: {},
      edcEnabled: false,
      telehealthEnabled: false,
      isTelehealthV2Enabled: false,
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
    canSiteDataLockAccess() {
      this.$acl.change(`${SITEDATALOCK}`);
      return this.$acl.check("userAccess");
    }
  },
  mounted() {
    this.getToggledFeatures();
  },
  methods: {
    ...mapActions(["selectedFeaturesAction"]),
    modifyStudy() {
      window.localStorage.setItem("thread-studySummary", true);
      this.$router.push({
        name: "study-summary",
        params: { studyId: this.studyId }
      });
    },
    getToggledFeatures() {
      this.$api.getToggleFeaturesFact(this.studyId).then(
        response => {
          this.toggleFeatures = response.body.studyFeatures;

          this.toggleFeatures.forEach(feature => {
            if (feature.featureKey === "EDC") {
              this.edcEnabled = feature.enabled;
            }
            if (feature.featureKey === "TruClinic") {
              this.telehealthEnabled = feature.enabled;
            }

            if(feature.featureKey === "TELEHEALTH"){
              this.isTelehealthV2Enabled = feature.enabled;
            }
          });
        },
        error => {
          this.$toastr.error(
            error.body && error.body.message
              ? error.body.message
              : "Error while getting features."
          );
        }
      );
    }
  }
};
</script>

<style scoped lang="scss" src="./styles/side-menu.scss"

 />
