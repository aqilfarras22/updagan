<template>
  <div class="wrap" ref="profile" @click="hideModal()" :class="{'telehealth-call': telehealthCallStatus}">
    <!-- participant toggle -->
    <NavigationBreadcrumb :navigationWidth="navigationWidth" :redirectToProfile="false" :navigationOptions="navigationOptions" @toggleParticipant='toggleParticipant'></NavigationBreadcrumb>
    <PiiAndNonPiiInfo ref="PiiAndNonPiiInfo" class="clear-both" :participantDetails="participantInfo" v-if="participantInfo" @expanded="piInfoExpanded"></PiiAndNonPiiInfo>
    <div v-if="isFirstTimeLoading" class="loading-class">
      <div class="snippet" data-title=".dot-stretching">
        <div class="stage">
          <div class="dot-stretching"></div>
        </div>
      </div>
    </div>
    <!-- Milestone Carousel Starts Here -->
    <MilestoneCarouselProgress ref="carouselList"
      v-if="!isFirstTimeLoading && actualMilestones!=null && participantData && (participantInfo.status != 'INVITED' || participantInfo.status != 'NOTINVITED')"
      :participantData="participantData"
      :milestonesList="milestonesList"
      :participantDetails="participantInfo"
      :selectedMilestone="selectedMilestoneIndex"
      @getMilestoneDetails="getMilestoneDetails"
      :istelehealthCallInitiated="istelehealthCallInitiated"
      :triggerDay="triggerDay"
      @resetParticipant="resetParticipant"
      :outsideClickStatus="outsideClickStatus">
    </MilestoneCarouselProgress>
    <!-- Milestone Carousel Ends Here -->
    <div class="participant-section" v-if="!isFirstTimeLoading">
      <ParticipantInfo class="clear-both" :participantDetails="participantInfo" :areActionsAllowed="areActionsAllowed" @toggleSitePartTaskSec="toggleSitePartTaskSec"/>
      <!-- filter options view for milestone study -->
      <div v-show="showSitePartTaskSec" class="change-caret-icon" v-if="actualMilestones && actualMilestones.length > 0">
        <div class="btn btn-primary dropdown-toggle truncate" @click.stop="listToggle()" data-toggle="dropdown"><span class="mr-20">{{viewAllTasksText != null ? viewAllTasksText : selectedMilestone.milestoneName}}</span>
        <span class="caret"></span></div>
        <ul id="milestone-drop-down" class="dropdown-menu" :class="{'scrollbar': actualMilestones && actualMilestones.length > 0, 'list-expanded': isExpanded, 'list-collapsed': !isExpanded}">
          <li :class="{'active': selectedMilestone.milestoneName==milestone.milestoneName && viewAllTasksText==null}" v-for="(milestone, index) in actualMilestones" @click="onMilestoneChange($event, milestone, index)">
            <a href="#">{{milestone.milestoneName}}</a>
          </li>
          <div class="border mb-2 mr-15 ml-15 mt-3"></div>
          <li style="height:30px;" :class="{'active': viewAllTasksText != null}"><a @click="onMilestoneChange($event, null, null)" href="#">View All Tasks</a></li>
        </ul>
      </div>
      <!-- filter options view for no mileston study -->
      <div v-show="showSitePartTaskSec" class="change-caret-icon pt-15" v-if="actualMilestones && actualMilestones.length == 0">
        <div class="btn btn-primary dropdown-toggle truncate" @click.stop="listToggle()" data-toggle="dropdown"><span class="mr-20">{{viewAllTasksText != null ? viewAllTasksText : selectedFrequency.milestoneName}}</span>
        <span class="caret"></span></div>
        <ul id="drop-down" class="dropdown-menu no-milestone" :class="{'list-expanded': isExpanded, 'list-collapsed': !isExpanded}">
          <li :class="{'active': selectedFrequency.milestoneName==milestone.milestoneName}" v-for="(milestone, index) in customizeMilestones" @click="onMilestoneChange($event, milestone, index, true)">
            <a href="#">{{milestone.milestoneName}}</a>
            <div class="all-time-wrapper mt-10" v-if="milestone.key=='all'">
              <div class="font-wieght-bold" style="font-weight: 400;">Enter a day range to view</div>
              <div class="pt-10 row p-0">
                <div class="col-sm-4 p-0" style="max-width:30%;margin-right: 6px;height: 40px;"><span class="day-styling">Day</span><input class="input-styling" v-model="startDay" placeholder="i.e0" type='text' @click.stop/></div>
                <div class="text-to">to</div>
                <div class="col-sm-4 p-0"><span class="day-styling">Day</span><input class="input-styling" v-model="endDay" placeholder="i.e25" type='text' @click.stop/></div>
                <div class="col-sm-3 p-0"><button class="btn-styling" style="cursor:pointer;" @click="dayRangeListener()">Submit</button></div>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <!-- end -->
      <div v-show="showSitePartTaskSec" class="tbl-wrapper">
        <SiteTeamActionTable
          v-if="isSiteTeamMember"
          :edcFormRecords="edcFormRecords"
          :siteTeamTaskCompletionPR="siteTeamTaskCompletionPR"
          :milestoneView="actualMilestones.length != 0"
          :studyId="studyId"
          :enableSiteTeamTable="enableSiteTeamTable"
          :sitePaginationObject="sitePaginationObject"
          @getNextSiteTeamRecords="getNextSiteTeamRecords"
          :showAllSiteTeamTasks="showAllSiteTeamTasks"
          :siteTableDataLoading="siteTableDataLoading"
          :siteTeamTaskSectionEnabled="siteTeamTaskSectionEnabled"
          :triggerForSiteTeamTask="triggerForSiteTeamTask">
        </SiteTeamActionTable>
        <ParticipantTasksTable
          :participantTaskRecords="participantTaskRecords"
          :participantInfo="participantInfo"
          :generalParticipantInfo="generalParticipantInfo"
          :enableParticipantTable="enableParticipantTable"
          :participantTaskCompletionPR="participantTaskCompletionPR"
          :participantPaginationObject="participantPaginationObject"
          @getNextParticipantRecords="getNextParticipantRecords"
          :showAllParticipantTasks="showAllParticipantTasks"
          :participantTableDataLoading="participantTableDataLoading"
          :participantTaskSectionEnabled="participantTaskSectionEnabled"
          :triggerForParticipantTask="triggerForParticipantTask">
        </ParticipantTasksTable>
      </div>
    </div>
  </div>
</template>

<script>
import uniq from "lodash/uniq";
import { AclRule } from "vue-acl";
import { mapGetters } from "vuex";
import sortBy from "lodash/sortBy";
import TableComponent from "@/components/common/table";
import ParticipantInfo from "@/components/participants/participant-info-new";
import NavigationBreadcrumb from "@/components/common/navigation-breadcrumb";
import moment from 'moment';
import nprogress from 'nprogress';
import 'nprogress/nprogress.css';
import MilestoneCarouselProgress from "@/components/participants/study-participant-milestone-carousel-progress";
import ParticipantResponseModal from "@/components/participants/activity-response-modal";
import PiiAndNonPiiInfo from "@/components/participants/pii-and-non-pii-info";
import {
  PI,
  SUB_PI,
  STUDY_COORDINATOR,
  CRA,
  DM,
  HOME_HEALTH,
  QUALITY,
  SYSTEM_ADMIN,
  SITEDATALOCK
} from "@/constants/authRoles";
import {
  approvalStatusText,
  verificationStatusText,
  verificationStatus,
  approvalStatus
} from "@/constants/form";
import TelehealthAppointmentList from "@/components/participants/telehealth/appointment-list";
import SiteTeamActionTable from "@/components/record-table/site-team-action-table.vue";
import ParticipantTasksTable from "@/components/record-table/participant-tasks-table.vue";
export default {
  name: "study-participant-details",
  components: {
    TableComponent,
    ParticipantInfo,
    TelehealthAppointmentList,
    NavigationBreadcrumb,
    MilestoneCarouselProgress,
    ParticipantResponseModal,
    PiiAndNonPiiInfo,
    SiteTeamActionTable,
    ParticipantTasksTable
  },
  props: {
    studyId: {
      type: String
    },
    studyData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      isFirstTimeLoading: true,
      maxDay: 0,
      startDay: null,
      endDay: null,
      participantCurrentDay: null,
      studyStartDate: null,
      studyEndDate: null,
      approvalStatusText,
      verificationStatusText,
      participantInfo: {},
      selectedMilestone: 0,
      selectedMilestoneIndex: 0,
      selectedFrequency: {},
      edcFormRecords: [],
      activityRecords: [],
      isCurrentButtonActive: false,
      navigationOptions: [
        {name: "Profile", isLink: false, route: null, params: null, displayOrder: 2},
        {name: "Participants", isLink: true, route: 'study-participants-list', params: {studyId: this.studyId}, displayOrder: 1}
      ],
      customizeMilestones: [
        {milestoneName: 'This Week', key: 'week'},
        {milestoneName: 'Last Week', key: 'lastWeek'},
        {milestoneName: 'This Month', key: 'month'},
        {milestoneName: 'This Year', key: 'year'},
        {milestoneName: 'View  All Time', key: 'full'},
        {milestoneName: 'View  Range Day', key: 'all'},
      ],
      generalParticipantInfo: null,
      edcFilter: '',
      activityFilter: "",
      isViewRangeInputDisabled: false,
      actualMilestones: null,
      milestonesList: null,
      participantData: null,
      responseActivityDetail: null,
      responseLanguageOptions: [],
      participantTaskRecords: [],
      enableParticipantTable: false,
      participantTaskCompletionPR: 0,
      siteTeamTaskCompletionPR: 0,
      enableSiteTeamTable: false,
      viewAllTasksText: null,
      istelehealthCallInitiated: false,
      telehealthCallStatus: false,
      participantPaginationObject: {},
      sitePaginationObject: {},
      showAllParticipantTasks: false,
      showAllSiteTeamTasks: false,
      participantTableDataLoading: false,
      siteTableDataLoading: false,
      triggerDay: {
        currentDayTextVisiblity: false,
        triggeredBtnVisiblity: false,
        currentMilestoneVisiblity: true,
        confirmationText: null,
        triggeredDate: null,
        dateVisiblity: false
      },
      participantTaskSectionEnabled: true,
      siteTeamTaskSectionEnabled: true,
      studyResponse: null,
      triggerForSiteTeamTask: true,
      triggerForParticipantTask: true,
      outsideClickStatus: true,
      isExpanded: false,
      navigationWidth: "76%",
      areActionsAllowed: {document: true, telehealth: true, edcforms: false, sendMessage: true},
      showingFullData: false,
      isTelehealthV2Enabled: false,
      showSitePartTaskSec: true
    };
  },
  watch: {
    getVideoCallStatus(isCallInProgress) {
      this.telehealthCallStatus = isCallInProgress;
    },
  },
  computed: {
    ...mapGetters(["token", "user", "getVideoCallStatus"]),
    userAccess() {
      return new AclRule(this.user.userRole).generate();
    },
    isSiteTeamMember() {
      return this.canHomeHealthAccess ||
        this.canPiAccess ||
        this.canStudyCoordinatorAccess ||
        this.canSubPIAccess ||
        this.canCraAccess ||
        this.canDmAccess ||
        this.canQualityAccess ||
        this.canSiteDataLockAccess;
    },
    isSiteTeamAccess(){
      return this.canHomeHealthAccess ||
        this.canPiAccess ||
        this.canStudyCoordinatorAccess ||
        this.canSubPIAccess ||
        this.canSiteDataLockAccess;
    },
    canSysAdminAccess() {
      this.$acl.change(`${SYSTEM_ADMIN}`);
      return this.$acl.check('userAccess');
    },
    canPiAccess() {
      this.$acl.change(`${PI}`);
      return this.$acl.check("userAccess");
    },
    canSubPIAccess() {
      this.$acl.change(`${SUB_PI}`);
      return this.$acl.check("userAccess");
    },
    canStudyCoordinatorAccess() {
      this.$acl.change(`${STUDY_COORDINATOR}`);
      return this.$acl.check("userAccess");
    },
    canHomeHealthAccess() {
      this.$acl.change(`${HOME_HEALTH}`);
      return this.$acl.check('userAccess');
    },
    canCraAccess() {
      this.$acl.change(`${CRA}`);
      return this.$acl.check("userAccess");
    },
    canDmAccess() {
      this.$acl.change(`${DM}`);
      return this.$acl.check("userAccess");
    },
    canQualityAccess() {
      this.$acl.change(`${QUALITY}`);
      return this.$acl.check("userAccess");
    },
    isParticipantInActive() {
      return this.participantInfo.status == 'DISQUALIFIED' ||
        this.participantInfo.status == 'WITHDRAWSTUDY';
    },
    isParticipantActive() {
      return this.participantInfo.status == 'ACTIVE';
    },
    userRoles() {
      return {
        canCraAccess: this.canCraAccess,
        canPiAccess: this.canPiAccess,
        canSysAdminAccess: this.canSysAdminAccess,
        canSubPiAccess: this.canSubPiAccess,
        canStudyCoordinatorAccess: this.canStudyCoordinatorAccess,
        canHomeHealthAccess: this.canHomeHealthAccess,
        canDmAccess: this.canDmAccess,
        canQualityAccess: this.canQualityAccess,
        canSiteDataLockAccess: this.canSiteDataLockAccess
      };
    },
    isDetailedActivityPageAccessable() {
      if (!this.user) return false;
      let rolesThatCanAccessDetailedActivityPage = [PI, SUB_PI, STUDY_COORDINATOR, CRA, DM, HOME_HEALTH, QUALITY, SYSTEM_ADMIN, SITEDATALOCK];
      let currentUserRole = this.user.userRole;
      if (rolesThatCanAccessDetailedActivityPage.indexOf(currentUserRole) === - 1) {
        return false;
      }
      return true;
    },
    canSiteDataLockAccess() {
      this.$acl.change(`${SITEDATALOCK}`);
      return this.$acl.check("userAccess");
    },
  },
  methods: {
    getNextParticipantRecords(dataObj) {
      dataObj.participantCurrentDay = this.participantCurrentDay;
      if(this.viewAllTasksText == null && this.actualMilestones.length > 0) {
        dataObj.milestoneId = this.selectedMilestone.milestoneId;
        dataObj.startDay = this.selectedMilestone.startDay;
        dataObj.endDay = this.selectedMilestone.endDay;
      } else if (this.viewAllTasksText != null && this.actualMilestones.length > 0) {
        dataObj.milestoneId = this.selectedMilestone.milestoneId;
        dataObj.startDay = 0
        dataObj.endDay = this.maxDay;
      } else if (this.viewAllTasksText == null && this.actualMilestones.length == 0) {
        dataObj.startDay = this.selectedFrequency.startDay;
        dataObj.endDay = this.selectedFrequency.endDay;
      } else if (this.viewAllTasksText != null && this.selectedFrequency.key == 'all') {
        dataObj.startDay = this.selectedFrequency.startDay;
        dataObj.endDay = this.selectedFrequency.endDay;
      }
      let inActiveDay = null;
      if(this.isParticipantInActive) {
        inActiveDay = this.participantData.participantInActiveDay;
        if((dataObj.startDay < inActiveDay) && (inActiveDay <= dataObj.endDay)) {
          dataObj.endDay = inActiveDay;
        } else if((dataObj.startDay >= inActiveDay) && (inActiveDay < dataObj.endDay)) {
          dataObj.endDay = inActiveDay;
        }
      }

      this.showAllParticipantTasks = true;
      this.participantTableDataLoading = true;
      this.loadParticipantData(dataObj, true);
    },
    getNextSiteTeamRecords(dataObj) {
      dataObj.participantCurrentDay = this.participantCurrentDay;
      if(this.viewAllTasksText == null && this.actualMilestones.length > 0) {
        dataObj.milestoneId = this.selectedMilestone.milestoneId;
        dataObj.startDay = this.selectedMilestone.startDay;
        dataObj.endDay = this.selectedMilestone.endDay;
      } else if (this.viewAllTasksText != null && this.actualMilestones.length > 0) {
        dataObj.milestoneId = this.selectedMilestone.milestoneId;
        dataObj.startDay = 0;
        dataObj.endDay = this.maxDay;
      } else if (this.viewAllTasksText == null && this.actualMilestones.length == 0) {
        dataObj.startDay = this.selectedFrequency.startDay;
        dataObj.endDay = this.selectedFrequency.endDay;
      } else if (this.viewAllTasksText != null && this.selectedFrequency.key == 'all') {
        dataObj.startDay = this.selectedFrequency.startDay;
        dataObj.endDay = this.selectedFrequency.endDay;
      }
      let inActiveDay = null;
      if(this.isParticipantInActive) {
        inActiveDay = this.participantData.participantInActiveDay;
        if((dataObj.startDay < inActiveDay) && (inActiveDay <= dataObj.endDay)) {
          dataObj.endDay = inActiveDay;
        } else if((dataObj.startDay >= inActiveDay) && (inActiveDay < dataObj.endDay)) {
          dataObj.endDay = inActiveDay;
        }
      }
      this.showAllSiteTeamTasks = true;
      this.siteTableDataLoading = true;
      this.loadEdcFormData(dataObj, true);
    },
    onMilestoneChange(event, milestone, index, isCustomize=false) {
      event.preventDefault();
      if(this.actualMilestones.length == 0 && milestone.key == 'all') {
        return ;
      }
      this.siteTableDataLoading = true;
      this.participantTableDataLoading = true;
      this.showingFullData = false;
      if(milestone == null && index == null) {
        this.showAllParticipantTasks = true; // show pagination by default
        this.showAllSiteTeamTasks = true;
        this.viewAllTasksText = 'View All Tasks';
        this.selectedMilestoneIndex = null;
        this.showingFullData = true;
        this.getParticipantFullDetail(0, this.maxDay);
        return;
      }
      if(isCustomize) {
        this.selectedFrequency.milestoneName = milestone.milestoneName;
      }
      this.showAllParticipantTasks = false; // collapsed the table while changing the milestone dropdown;
      this.showAllSiteTeamTasks = false
      this.viewAllTasksText = null;
      this.selectedMilestone = milestone;
      this.selectedFrequency = _.cloneDeep(milestone);
      this.selectedMilestoneIndex = index;
      if(milestone.key == 'full') {
        this.showingFullData = true;
      }
      this.getParticipantFullDetail(milestone.startDay, milestone.endDay);
    },
    dayRangeListener() {
      this.showingFullData = false;
      if(this.startDay == null || this.endDay == null) {
        this.$toastr.error("Please enter valid values");
        return;
      }
      this.startDay = Number(this.startDay);
      this.endDay = Number(this.endDay);
      if(isNaN(this.startDay) || isNaN(this.endDay)) {
        this.startDay = isNaN(this.startDay) ? null : this.startDay;
        this.endDay = isNaN(this.endDay) ? null : this.endDay
        this.$toastr.error("Please enter valid values");
        return;
      }
      if(Math.sign(this.startDay) < 0 || Math.sign(this.endDay) < 0) {
        this.$toastr.error("Negative values are not allowed");
        return;
      }
      if(this.startDay % 1 != 0 ) {
        toastr.error('Start date cannot have decimals values');
        return;
      }
      if(this.endDay % 1 != 0 ) {
        toastr.error('End date cannot have decimals values');
        return;
      }

      if (this.startDay && this.endDay && this.endDay < this.startDay) {
        this.$toastr.error("End Day should be greater than Start Day");
      } else if (this.endDay > this.maxDay) {
        this.$toastr.error("End Day should not be greater than maximum day");
      } else if ((this.startDay || this.startDay >= 0) && (this.endDay || this.endDay >= 0)) {
        this.viewAllTasksText = 'View Range Day';
        this.customizeMilestones[5].startDay = this.startDay;
        this.customizeMilestones[5].endDay = this.endDay;
        this.selectedFrequency = _.cloneDeep(this.customizeMilestones[5]);
        nprogress.start()
        this.getParticipantFullDetail(this.startDay, this.endDay);
        this.startDay = null;
        this.endDay = null;
      }
      return;
    },
    processTriggerDayFeature() {
      if(this.studyResponse.isManualStudyStart) {
        this.triggerForSiteTeamTask = false;
        this.triggerForParticipantTask = false;
        this.triggerDay.dateVisiblity = false;
        this.triggerDay = {
          currentDayTextVisiblity: false,
          triggeredBtnVisiblity: false,
          currentMilestoneVisiblity: false,
          confirmationText: null,
          triggeredDate: null
        };
        // check if participant is active when tpd is disaled
        if(this.checkForOldParticipant()) {
          this.triggerDay.currentDayTextVisiblity = true;
          this.triggerForSiteTeamTask = true;
          this.triggerForParticipantTask = true;
          this.triggerDay.currentMilestoneVisiblity = this.participantInfo.status != 'NOTINVITED' && this.participantInfo.status != 'INVITED';
          this.triggerDay.dateVisiblity = true;
          return;
        }
        this.triggerDay.triggeredBtnVisiblity = this.participantInfo.status == 'VERIFIED' &&
          this.participantInfo.participantStudyStartTrigger.triggeredBy == null && this.isSiteTeamAccess;
        this.triggerDay.currentDayTextVisiblity = !this.triggerDay.triggeredBtnVisiblity;
        if(this.participantInfo.participantStudyStartTrigger.triggeredBy && !this.participantInfo.participantStudyStartTrigger.isConfirmed) {
          this.triggerDay.confirmationText = "Study start has been requested and is awaiting participant confirmation";
          this.triggerDay.currentDayTextVisiblity = false;
          this.triggerDay.currentMilestoneVisiblity = false;
          this.triggerDay.dateVisiblity = false;
        } else if (this.participantInfo.participantStudyStartTrigger.triggeredBy && this.participantInfo.participantStudyStartTrigger.isConfirmed) {
          this.triggerDay.confirmationText = "Study activities started on ";
          this.triggerDay.triggeredDate = this.participantInfo.participantStudyStartTrigger.confirmedOnUtc;
          this.triggerForSiteTeamTask = true;
          this.triggerForParticipantTask = true;
          this.triggerDay.currentDayTextVisiblity = true;
          this.triggerDay.currentMilestoneVisiblity = true;
          this.triggerDay.dateVisiblity = true;
        }
        // if participant is disqualified / withdrawn just after the invited/notinvited.
        if(this.participantInfo.registrationDate == undefined) {
          this.triggerDay.dateVisiblity = false;
          this.triggerDay.currentMilestoneVisiblity = false;
        }
      } else {
        this.triggerDay.currentDayTextVisiblity = true;
        this.triggerForSiteTeamTask = true;
        this.triggerForParticipantTask = true;
        this.triggerDay.currentMilestoneVisiblity = this.participantInfo.status != 'NOTINVITED' && this.participantInfo.status != 'INVITED';
        this.triggerDay.dateVisiblity = true;
      }
    },
    checkForOldParticipant() {
      if(!this.participantInfo.participantStudyStartTrigger.isConfirmed && (this.isParticipantActive || this.isParticipantInActive)) {
        return true;
      }
    },
    getParticipantInfo(participantId) {
      this.$api
        .getParticipantDataFactV2(this.studyId, participantId)
        .then(
          response => {
            this.participantInfo = response.body ? response.body : null;
            if(this.participantInfo != null) {
              this.processTriggerDayFeature()
              if(this.canSysAdminAccess) {
                this.getListOfCountryFeature();
              } else {
                this.getToggledFeatures()
              }
            } else {
              this.isFirstTimeLoading = false;
              this.actualMilestones = null;
              this.milestonesList = null;
            }
        },
        error => {
          this.$toastr.error(
            error.body && error.body.message
              ? error.body.message
              : "Error while getting participant."
          );
        }
      );
    },
    getListOfCountryFeature() {
      this.$api.getCountrySpecificStudyFeatures(this.studyId).then((response) => {
        let countries = response.body;
        this.isTelehealthV2Enabled = this.studyData.telehealthIntegration && countries && _.chain(countries).filter({'isTelehealthEnabled': true, 'country_id': this.participantInfo.countryId}).size().value()>0;
        this.getParticipantFullDetail();
      });
    },
    getParticipantFullDetail(startDay=null, endDay=null, isUserClickOnStartOrEndDay=false) {
      let registrationDate = new Date(this.participantInfo.registrationDate);
      let fakeParticipantCurrentDay = null;
      let that = this;
      var participantStatus = that.participantInfo.status;
      that.$api
        .participantFullDetail(that.studyId, that.participantInfo.id, this.isTelehealthV2Enabled)
        .then(async (resp) => {
          // call if milestone avialable
          if(startDay == null && endDay == null) {
            if(resp && resp.body && resp.body.participantMileStoneList && resp.body.participantMileStoneList.length > 0) {
              await that.$api.participantsMilestonsDetail(that.studyId, that.participantInfo.id, resp.body, resp.body.participantCurrentDay, participantStatus, this.isTelehealthV2Enabled).then( milestone => {
                if(milestone.body == null) {
                  that.actualMilestones.length = 0;
                } else {
                  that.actualMilestones = milestone.body;
                }

              }, error => {});
            } else {
              that.actualMilestones = resp.body.participantMileStoneList;
            }
             ///Initialize Carousel for the first time only when there are milestones in the study
            if(that.actualMilestones.length>0 && !isUserClickOnStartOrEndDay) {
              that.milestonesList = that.actualMilestones;
            }
          }
          if(startDay == null && endDay == null) {
            that.participantCurrentDay = resp.body.participantCurrentDay;
            that.maxDay = resp && resp.body && resp.body.maxDay;
            that.setMilestoneForSingleEntry();
            if(that.actualMilestones && that.actualMilestones.length > 0) {
              for(let i = 0; i < that.actualMilestones.length ; i++) {
                if(that.actualMilestones[i].milestoneSelected) {
                  this.viewAllTasksText = null;
                  that.selectedMilestone = that.actualMilestones.length == 1 ? that.actualMilestones[1] : that.actualMilestones[i];
                  that.selectedMilestoneIndex = that.actualMilestones.length == 1 ? 1 : i;
                  startDay = that.selectedMilestone.startDay;
                  endDay = that.selectedMilestone.endDay;
                  break;
                }
              }
            }
            // if participant current day is less then the first milestone day
            // then select first milestone by defualt
            if(that.actualMilestones.length > 0 && (that.participantCurrentDay < that.actualMilestones[0].milestoneDay)) {
              that.selectedMilestone = that.actualMilestones[0];
              that.selectedMilestoneIndex = 0;
              startDay = that.selectedMilestone.startDay;
              endDay = that.selectedMilestone.endDay;
              // by default selelct last milestone
              that.actualMilestones[0].milestoneSelected = true;
            }
            // if participant current day is gretaor then the first milestone day and
            // there is no selected milstone as true then set selected milestone as last milestone.
            if(that.actualMilestones.length > 0 && (that.participantCurrentDay > that.actualMilestones[0].milestoneDay) && that.selectedMilestone == 0) {
              that.selectedMilestone = that.actualMilestones[that.actualMilestones.length-1];
              that.selectedMilestoneIndex = that.actualMilestones.length - 1;
              startDay = that.selectedMilestone.startDay;
              endDay = that.selectedMilestone.endDay;
              fakeParticipantCurrentDay = that.selectedMilestone.endDay;
              // by default selelct last milestone
              that.actualMilestones[that.actualMilestones.length-1].milestoneSelected = true;
            }
          }
          let anyUnscheduledForms = [];
          this.$api.getUnschduledPkts(this.studyId).then((response) => {
            anyUnscheduledForms = response.body.length;
            this.areActionsAllowed.edcforms = anyUnscheduledForms > 0;
          });
          that.participantData = {
            studyStartDate: this.calculateParticipantCarouselDates(resp.body.studyStartDate),
            studyEndDate: this.calculateParticipantCarouselDates(resp.body.studyEndDate),
            maxDay: resp.body.maxDay,
            participantCurrentDay: that.participantCurrentDay,
            fakeParticipantCurrentDay: fakeParticipantCurrentDay,
            participant: {registrationDate: that.participantInfo.registrationDate, status: that.participantInfo.status},
            participantMileStoneList: that.actualMilestones,
            participantCompliancePercentage: resp.body.participantCompliancePercentage,
            participantStudyCompletionPercentage: resp.body.participantStudyCompletionPercentage,
            participant: this.participantInfo,
            piId: this.user.id,
            studyId: this.studyId,
            inActiveDate: this.participantInfo.inActiveDate ? this.participantInfo.inActiveDate : null,
            participantStatus: this.participantInfo.status,
            participantInActiveDay: resp.body.inActiveDay
          };
          // for no milestone
          if(startDay==null && endDay==null && (that.actualMilestones.length == 0 || that.actualMilestones == null)) {
            that.updateCustomizeMilestone();
            that.selectedFrequency = _.cloneDeep(that.customizeMilestones[0]);
            // load by default values
            startDay = that.customizeMilestones[0].startDay;
            endDay = that.customizeMilestones[0].endDay
          }
          let data = {
            startDay: startDay,
            endDay: endDay,
            participantCurrentDay: that.participantCurrentDay,
            milestoneId: that.selectedMilestone.milestoneId,
            registrationDate: registrationDate,
            maxDay: this.maxDay
          };
          that.generalParticipantInfo = {startDay: data.startDay, endDay: data.endDay};
          // if TPD is enabled and Participant is not active then no data need to show
          // Only edc unschduled and scheduled(for old participant) will show.
          if(this.studyResponse.isManualStudyStart) {
            if(!this.checkForOldParticipant() && !this.participantInfo.participantStudyStartTrigger.isConfirmed) {
              that.loadEdcFormData(data);
              that.participantTaskRecords = [];
              that.participantTaskCompletionPR = 0;
              that.enableParticipantTable = true;
              that.isFirstTimeLoading = false;
              return;
            }
          }
          // if participant is disqualified / withdrawn from the study
          let inActiveDay = null;
          if(this.isParticipantInActive) {
            inActiveDay = resp.body.inActiveDay;
          }
          if (inActiveDay == null) {
            that.loadParticipantData(data);
          } else if(inActiveDay != null && (startDay < inActiveDay) && (inActiveDay <= endDay)) {
            data.endDay = inActiveDay;
            that.loadParticipantData(data);
          } else if (inActiveDay != null && (startDay < inActiveDay) && (inActiveDay > endDay)) {
            that.loadParticipantData(data);
          } else if (inActiveDay != null && (startDay == inActiveDay) && (inActiveDay == endDay)) {
            that.loadParticipantData(data);
          } else if(inActiveDay != null && (startDay >= inActiveDay) && (inActiveDay < endDay)) {
            data.endDay = inActiveDay;
            that.loadParticipantData(data);
          } else if(inActiveDay != null && (startDay > inActiveDay) && (inActiveDay < endDay)) {
            that.participantTaskRecords = [];
            that.participantTaskCompletionPR = 0;
            that.enableParticipantTable = true;
          }
          that.loadEdcFormData(data);
          that.isFirstTimeLoading = false;
        })
        .catch(error => {
          if (error && (error.message || error.body.message)) {
            that.$toastr.error(error.message || error.body.message);
          } else {
            that.$toastr.error('Unable to fetch the participant details');
          }
            nprogress.done();
            that.isFirstTimeLoading = false;
        });
    },
    calculateParticipantCarouselDates(date) {
      if(this.actualMilestones.length == 0 && (this.participantInfo.status == 'INVITED' || this.participantInfo.status == 'NOTINVITED')) {
        return null
      }
      return date;
    },
    processActivities(records) {
      if(records.length == 0 ) {
        return [];
      }
      records.map((r) => {
        // in participant task reschduled and not started telehelath call will be treated as a cancelled call.
        if(r.status == 'Reschedule' || r.status == 'NotStarted') {
          r.status = 'Cancelled';
        }
        if(r.status == 'Missed' || r.status == 'Scheduled') {
          r.completedOn = 0;
        }
        // in participant task due date will visbile to all the activites not in completed state.
        if(r.status == 'Complete') {
          r.dueDate = 0;
        }
      });
      return records;
    },
    loadParticipantData(data, loadPaginationData = false) {
      this.$api.participantTaks(this.studyId, this.participantInfo.id, data, this.participantInfo.status, this.showingFullData, this.isTelehealthV2Enabled).then(async (response) => {
        this.participantTaskRecords = this.processActivities(response.body.activities);
        if(!loadPaginationData) {
          this.participantTaskCompletionPR = response.body.participantTaskCompletionPR;
        }
        this.participantPaginationObject = {
          totalPage: response.body.totalPage,
          totalRecords: response.body.totalRecords,
          currentPage: response.body.currentPage
        };
        this.enableParticipantTable = true;
        this.participantTableDataLoading = false;
        nprogress.done();
      }).catch(error => {
        if (error && (error.message || error.body.message)) {
          this.$toastr.error(error.message || error.body.message);
        } else {
          this.$toastr.error('Unable to fetch the participant tasks records.');
        }
          nprogress.done();
          this.participantTableDataLoading = false;
          this.isFirstTimeLoading = false;
          this.enableParticipantTable = true;
          this.enableSiteTeamTable = true;
      });
    },
    setMilestoneForSingleEntry() {
      if(this.actualMilestones == null || (this.actualMilestones && this.actualMilestones.length == 0)) {
        return;
      }
      if(this.actualMilestones.length == 1) {
        if(this.actualMilestones[0].milestoneSelected == false) {
          this.actualMilestones[0].milestoneSelected = true;
        }
        this.actualMilestones.unshift({
          "milestoneName": "Start",
          "milestoneSelected": false,
          "startDay": 0,
          "endDay": this.maxDay
        });
        this.actualMilestones.push({
          "milestoneName": "End",
          "milestoneSelected": false,
          "startDay": 0,
          "endDay": this.maxDay
        });
      }
    },
    loadEdcFormData(data, loadPaginationData = false) {
      if(!(this.canPiAccess || this.canSubPIAccess || this.canStudyCoordinatorAccess|| this.canCraAccess
        || this.canDmAccess || this.canHomeHealthAccess || this.canQualityAccess || this.canSiteDataLockAccess)) {
          return;
      }
      this.$api.participantEDCFormData(this.participantInfo.id, data.startDay, data.endDay, this.studyId, data, this.participantInfo.status, this.showingFullData, this.actualMilestones).then(resp => {
        if(!loadPaginationData) {
          this.siteTeamTaskCompletionPR = resp && resp.body && resp.body.siteTeamTaskCompletionPR;
        }
        let formsRecords = this.processEDCForms(resp);
        if(formsRecords.length > 0) {          
          this.edcFormRecords = formsRecords;
          this.enableSiteTeamTable = true;
          this.sitePaginationObject = {
            totalPage: resp.body.totalPage,
            totalRecords: resp.body.totalRecords,
            currentPage: resp.body.currentPage
          }
        } else {
          this.edcFormRecords = [];
          this.enableSiteTeamTable = true;
        }
        this.siteTableDataLoading = false;
        nprogress.done();
      }, error => {
        this.$toastr.error(error.body.message);
        this.enableSiteTeamTable = true;
        this.siteTableDataLoading = false;
        nprogress.done();
      });
    },
    sortParticipantTask(records) {
      if(records.length == 0) {
        return records;
      } // ascending order
      records.sort(function(x, y){
          return x.dueDate - y.dueDate;
      });
      return records;
    },
    sortTimestamp(records) {
      records.sort(function(x, y){
          return x.formDate - y.formDate;
      });
      return records;
    },
    processEDCForms(records) {
      if(!(records && records.body && records.body.siteTeamTaskList.length > 0)) {
        return [];
      }
      let edcRecords = records.body.siteTeamTaskList;
      edcRecords.map((form, index) => {
        let now = moment().format('YYYY-MM-DD');
        let formScheduleDate = moment(form.scheduleDate);
        formScheduleDate = formScheduleDate.format('YYYY-MM-DD');
        let formDate = moment(form.responseTimeUTC);
        formDate = formDate.format('YYYY-MM-DD');
        form.label = null;
        form.dueDate = false;
        if(formScheduleDate >= now && (form.state == "NOTSUBMITTED" || form.state == null || form.state == "")) {
          form.label = 'Start';
          form.dueDate = true;
        } else if(formScheduleDate < now && form.state == "NOTSUBMITTED" || form.state == null || form.state == "") {
          form.label = 'Missed';
          form.dueDate = true;
        } else if(formScheduleDate >= now && form.state == "DRAFT") {
          form.label = 'Pending';
          form.dueDate = true;
        } else if (formScheduleDate < now && form.state == "DRAFT") {
          form.label = 'Pending';
          form.dueDate = true;
        } else if(form.state == 'SUBMITTED') {
          form.label = 'Complete';
          form.scheduleDate = 0;
        } else if (form.taskType == "TELEHEALTH_UNSCHEDULED") {
          form.label = form.state;
          // form.responseTimeUTC = form.scheduleDate;
          form.scheduleDate = 0;
        }
        if(form.taskType == "EDC_UNSCHEDULED") {
          form.taskName = form.taskName + '(Unschedule)';
          form.scheduleDate = 0;
          form.dueDate = false;
        }
        if (form.taskType == "TELEHEALTH_UNSCHEDULED") {
          form.label = form.state == 'NotStarted' || form.state == 'Rescheduled' ? "Cancelled" : form.state;
          form.dueDate = false;
          form.openQueryCount = 0;
        }
        if(form.openQueryCount == null) {
          form.openQueryCount = 0;
        }
        if(form.submittedBy == null) {
          form.submittedBy = "";
        }
        if(form.approveStatus == null) {
          form.approveStatus = 'NOT_APPROVED';
        }
        if(form.verificationStatus == null) {
          form.verificationStatus = 'NOT_VERIFIED';
        }
      });
      return edcRecords;
    },
    updateCustomizeMilestone() {
      let startDay = null;
      let endDay = null;
      let registrationMoment = moment.utc(this.participantInfo.registrationDate);
      registrationMoment = registrationMoment.format('DD-MM-YYYY');
      registrationMoment = moment(registrationMoment, 'DD-MM-YYYY');
      let currentDate = _.cloneDeep(registrationMoment);
      currentDate.add(this.participantCurrentDay, 'days');
      this.customizeMilestones.map(milestone => {
        if(milestone.key == 'week' || milestone.key == 'lastWeek') {
          // Current week case :
          let firstWeekStartDate = currentDate.clone();
          let firstWeekEndDate = currentDate.clone();
          firstWeekStartDate.subtract(firstWeekStartDate.day(),'day').format('DD-MM-YYYY'); // first day of week
          firstWeekEndDate.add( 6 - firstWeekEndDate.day(),'day').format('DD-MM-YYYY'); // last day of week
          startDay = firstWeekStartDate.diff(registrationMoment,'day') >= 0 ? firstWeekStartDate.diff(registrationMoment,'day') : 0;
          endDay = firstWeekEndDate.diff(registrationMoment,'day') >= 0 ? firstWeekEndDate.diff(registrationMoment,'day') : 0;
          if(milestone.key == 'lastWeek') {
            let firstWeek = firstWeekStartDate.clone();
            let lastWeek = firstWeekEndDate.clone();
            firstWeek.subtract(7,'day');
            lastWeek.subtract(7,'day');
            startDay = firstWeek.diff(registrationMoment,'day') >= 0 ? firstWeek.diff(registrationMoment,'day') : 0;
            // set end date if last week is range lies outside the particiapnt registration date
            endDay = lastWeek.diff(registrationMoment,'day') >= 0 ? lastWeek.diff(registrationMoment,'day') : firstWeekEndDate.diff(registrationMoment,'day');
          }
        } else if(milestone.key == 'month') {
          startDay = (this.participantCurrentDay - 30) > 0 ? this.participantCurrentDay - 30 : 0;
          endDay = this.participantCurrentDay;
        } else if(milestone.key == 'year') {
          startDay = (this.participantCurrentDay - 365) > 0 ? this.participantCurrentDay - 365 : 0;
          endDay = this.participantCurrentDay;
        } else if(milestone.key == 'full') {
          startDay = 0; // by default
          endDay = this.maxDay;
        } else if(milestone.key == 'all') {
          startDay = 0;
          endDay = this.maxDay;
        }
        milestone.startDay = startDay;
        milestone.endDay = endDay;
      });
    },
    getMilestoneDetails(startDay, endDay, index, isUserClickOnStartOrEndDay, milestone) {
      this.showingFullData = false;
      this.startDay = startDay;
      this.endDay = endDay;
      this.selectedMilestone = milestone;
      this.viewAllTasksText = null;
      this.selectedMilestoneIndex = index;
      this.showAllParticipantTasks = false; // collapsed the table while changing the milestone dropdown;
      this.showAllSiteTeamTasks = false;
      this.siteTableDataLoading = true;
      this.participantTableDataLoading = true;
      this.getParticipantFullDetail(startDay, endDay, isUserClickOnStartOrEndDay);
    },
    resetParticipant(status) {
      this.triggerDay.confirmationText = "Study start has been requested and is awaiting participant confirmation";
      this.participantInfo.participantStudyStartTrigger.triggeredBy = this.user.id;
      this.processTriggerDayFeature()
    },
    showActivityResponseModal(activityDetail) {
      if(activityDetail.status.toLowerCase() == 'current' || activityDetail.status.toLowerCase() == 'missed' ||  activityDetail.status.toLowerCase() == 'scheduled') {
        let html = 'This activity is ';
        html += activityDetail.status.toLowerCase() == "current" ? "scheduled" : activityDetail.status.toLowerCase();
        html += '. No data to display'
        this.$toastr.warning(html);
        return;
      }
      this.responseLanguageOptions = [];
      this.responseLanguageOptions.push({value: 'EN', text:'English'});
      //The below code is to find the participant language other than english and push in the responseLanguageOptions options
      if(this.participantInfo && this.participantInfo.participantLanguage){
        let participantLang = this.participantInfo.participantLanguage.name;
        if(!participantLang.toLowerCase().includes("english")){
          this.responseLanguageOptions.push({value:this.participantInfo.participantLanguage.language_culture, text:participantLang})
        }
      }
      this.responseActivityDetail = activityDetail;
      this.$refs.activityResponseModal.show();
    },
    toggleParticipant(participant) {
      this.$router.push({
        name: "participant-profile",
        params: {participantId: participant.id}
      });
      this.getParticipantInfo(participant.id);
    },
    piInfoExpanded(isExpanded) {
      let c = document.getElementById('milestone-carousel-list');
      if(isExpanded) {
        setTimeout(() => {
          let expandEle = document.getElementById('collapse-piiandnon-pii');
          window.$('#milestone-carousel-list').animate({
            marginTop: (expandEle.offsetHeight - 34) + 'px'
          })
        }, 400);
      } else {
        c.style.marginTop = '0px';
      }
    },
    getStudyDetails() {
      this.$api.getStudyDataFact(this.studyId).then(
        response => {
          if (response.body) {
            this.studyResponse = response.body;
            this.getParticipantInfo(this.$route.params.participantId);
          }
        },
        error => {
          const err = error.body && error.body.message ? error.body.message : "Error while getting the study details";
          this.$toastr.error(err);
        }
      ).catch(error => {
        if (error && (error.message || error.body.message)) {
          this.$toastr.error(error.message || error.body.message);
        } else {
          this.$toastr.error("Unable to fetch the study details");
        }
      });
    },
    hideModal () {
      this.outsideClickStatus = !this.outsideClickStatus;
    },
    listToggle() {
      this.isExpanded = !this.isExpanded;
    },
    getToggledFeatures() {
      this.$api.getToggleFeaturesFact(this.studyId).then(
        response => {
          let toggleFeatures = response.body.studyFeatures;
          toggleFeatures.forEach(feature => {
            if (feature.featureKey === "TELEHEALTH") {
              this.isTelehealthV2Enabled = feature.enabled &&
                this.user.countries && _.chain(this.user.countries).filter({'isTelehealthEnabled': true, 'country_id': this.participantInfo.countryId}).size().value()>0;
            }
          });
          this.getParticipantFullDetail();
        },
        error => {
          this.$toastr.error(
            error.body && error.body.message
              ? error.body.message
              : "Error while getting features."
          );
        }
      );
    },
    toggleSitePartTaskSec(val){
      //Hide the Site and Participant task section when compose/messages section is visible
      this.showSitePartTaskSec = val;
    }
  },
  mounted() {
    this.getStudyDetails();
    this.$root.$on("videoCallEnded", () => {
      let data = {
        startDay: this.selectedMilestone.startDay,
        endDay: this.selectedMilestone.endDay,
        participantCurrentDay: this.participantCurrentDay,
        type: this.actualMilestones && this.actualMilestones.length > 0 ? "milestone" : "nomilestone",
        registrationDate: this.participantInfo.registrationDate
      };
      if(this.actualMilestones.length == 0) {
        data.startDay = this.selectedFrequency.startDay;
        data.endDay = this.selectedFrequency.endDay;
      }
      this.istelehealthCallInitiated = false;
      this.loadEdcFormData(data)
    });
    this.$root.$on("videoCallingInitiated", () => {
      // wait for video call intiated
      setTimeout(() => {
        this.istelehealthCallInitiated = true;
      }, 7000);
    });
    // force page to load from top only
    window.scrollTo(0,0);
    let _this = this;
    $(document).click(function() {
      _this.isExpanded = false;
    });
  }
};
</script>
<style scoped lang="scss" src="../../../public/static/fonts.scss"></style>
<style scoped lang="scss" src="@/assets/dot-streaching-loader.scss"></style>
<style scoped lang="scss" src="@/assets/dropdown-css.scss"></style>
<style scoped lang="scss" src="@/assets/participant-profile.scss"></style>
<style scoped lang="scss" src="@/assets/dot-streaching-loader.scss"></style>
