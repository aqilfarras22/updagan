<template>
  <div class="site-team-table">
    <div class="row table-title">
      <div class="col-md-6 pl-0 font-bolder">Site Team Tasks</div>
      <div class="col-md-6 align-right pr-0" v-if="milestoneView"><span class="font-bolder pr-10">{{siteTeamTaskCompletionPR}}%</span>Complete</div>
    </div>
    <div class="divTable unstyledTable">
      <div class="divTableHeading">
        <div class="divTableRow">
          <div class="divTableHead" :class="field.class" v-for="(field, index) in siteTeamActionFields" :key ="index">
            <b class="mr-5">{{field.label}}</b>
            <span class="sortDown mr-2" @click="sortField(field, 'asc')" :class="{'disable-icon': !field.ascOrder}"><i class="fa fa-long-arrow-down" aria-hidden="true"></i></span>
            <span class="sortUp" @click="sortField(field, 'desc')" :class="{'disable-icon': !field.dscOrder}"><i class="fa fa-long-arrow-up" aria-hidden="true"></i></span>
          </div>
        </div>
      </div>
      <div class="divTableBody" :class="{'loading-opacity': apiIsInProgress}" v-if="edcForms && edcForms.length > 0">
        <div class="divTableRow" v-for="(record, index) in tasksArrOne" :key ="index">
          <div class="divTableCell text-info">
            <span v-if="isStudyTeam && (record.label.toLowerCase() == 'missed' || record.label.toLowerCase() == 'pending' || record.label.toLowerCase() == 'start')">
              <span v-if="record.label!=null" class="status disabled" :class="record.label.toLowerCase()">
                {{label[record.label]}}
                <i v-if="record.label.toLowerCase()=='start'" class="fa fa-play" aria-hidden="true"></i>
              </span>
            </span>
            <span v-else>
              <span @click="submitNewForm(record, $event)" v-if="record.label!=null" class="status" :class="record.label.toLowerCase()">
                {{label[record.label]}}
                <i v-if="record.label.toLowerCase()=='start'" class="fa fa-play" aria-hidden="true"></i>
              </span>
            </span>
            <span :class="{'disabled': isStudyTeam && (record.label.toLowerCase() == 'missed' || record.label.toLowerCase() == 'pending' || record.label.toLowerCase() == 'start')}" @click="changeState(record)">{{truncate(record.taskName)}}</span>
          </div>
          <div class="divTableCell">
            <span v-if="record.dueDate && triggerForSiteTeamTask && (record.scheduleDate != 0 && record.scheduleDate != null)" class="due-date-indicator" >{{ new Date(record.scheduleDate) | dueDateIndicator }}</span>
          </div>
          <div class="divTableCell color-text">
            <span v-if="(record.label.toLowerCase() == 'pending' || record.label.toLowerCase() == 'complete' || record.label.toLowerCase() == 'cancelled') && (record.responseTimeUTC != null)">{{ new Date(record.responseTimeUTC) | formatUTCDate }}</span>
            <span v-if="(record.label.toLowerCase() == 'pending' || record.label.toLowerCase() == 'complete' || record.label.toLowerCase() == 'cancelled') && (record.responseTimeUTC != null)" class="clock ml-5"></span>
          </div>
          <div class="divTableCell color-text">{{record.submittedBy}}</div>
          <div class="divTableCell in-center"><span v-if="record.openQueryCount" class="open-query">{{record.openQueryCount}}</span></div>
          <div class="divTableCell in-center"><span v-if="record.approveStatus === 'APPROVED'"><i class="fa fa-check" aria-hidden="true"></i></span></div>
          <div class="divTableCell in-center"><span v-if="record.verificationStatus === 'VERIFIED'"><i class="fa fa-check" aria-hidden="true"></i></span></div>
        </div>
      </div>
    </div>
    <div class="no-task slide-animation" v-if="enableSiteTeamTable && edcForms.length == 0">No tasks available</div>
    <div v-if="enableSiteTeamTable && edcForms.length > 0">
      <div
        v-if="!isSiteTeamSectionExpand && enableSiteTeamTable && edcForms.length > 0 && showExpandButton"
        @click="isSiteTeamSectionExpand=!isSiteTeamSectionExpand"
        :class="isSiteTeamSectionExpand ? null : 'collapsed'"
        :aria-expanded="isSiteTeamSectionExpand"
        v-b-toggle.collapse-site-team
        variant="primary"
        class="toggle-text pt-10 pb-10">Show all tasks<span></span>
      </div>
      <b-collapse v-if="enableSiteTeamTable" v-model="isSiteTeamSectionExpand" id="collapse-site-team" class="mt-2">
        <b-card>
          <div class="divTable">
            <div class="divTableBody" :class="{'loading-opacity': apiIsInProgress}">
              <div class="divTableRow" v-for="(record, index) in tasksArrTwo" :key ="index">
                <div class="divTableCell text-info width-250">
                  <span v-if="isStudyTeam && (record.label.toLowerCase() == 'missed' || record.label.toLowerCase() == 'pending' || record.label.toLowerCase() == 'start')">
                    <span v-if="record.label!=null" class="status disabled" :class="record.label.toLowerCase()">
                      {{label[record.label]}}
                      <i v-if="record.label.toLowerCase()=='start'" class="fa fa-play" aria-hidden="true"></i>
                    </span>
                  </span>
                  <span v-else>
                    <span @click="submitNewForm(record, $event)" v-if="record.label!=null" class="status" :class="record.label.toLowerCase()">
                      {{label[record.label]}}
                      <i v-if="record.label.toLowerCase()=='start'" class="fa fa-play" aria-hidden="true"></i>
                    </span>
                  </span>
                  <span :class="{'disabled': isStudyTeam && (record.label.toLowerCase() == 'missed' || record.label.toLowerCase() == 'pending' || record.label.toLowerCase() == 'start')}" @click="changeState(record)">{{truncate(record.taskName)}}</span>
                </div>
                <div class="divTableCell width-120">
                  <span v-if="record.dueDate && triggerForSiteTeamTask && (record.scheduleDate != 0 && record.scheduleDate != null)" class="due-date-indicator" >{{ new Date(record.scheduleDate) | dueDateIndicator }}</span>
                </div>
                <div class="divTableCell width-240 color-text">
                  <span v-if="(record.label.toLowerCase() == 'pending' || record.label.toLowerCase() == 'complete' || record.label.toLowerCase() == 'cancelled') && (record.responseTimeUTC != null)">{{ new Date(record.responseTimeUTC) | formatUTCDate }}</span>
                  <span v-if="(record.label.toLowerCase() == 'pending' || record.label.toLowerCase() == 'complete' || record.label.toLowerCase() == 'cancelled') && (record.responseTimeUTC != null)" class="clock ml-5"></span>
                </div>
                <div class="divTableCell width-150 color-text">{{record.submittedBy}}</div>
                <div class="divTableCell in-center width-120 open-queries"><span v-if="record.openQueryCount" class="open-query">{{record.openQueryCount}}</span></div>
                <div class="divTableCell in-center width-100"><span v-if="record.approveStatus === 'APPROVED'"><i class="fa fa-check" aria-hidden="true"></i></span></div>
                <div class="divTableCell in-center width-70"><span v-if="record.verificationStatus === 'VERIFIED'"><i class="fa fa-check" aria-hidden="true"></i></span></div>
              </div>
            </div>
          </div>
          <nav aria-label="page navigation pagination" v-if="isPaginationEnabled">
            <ul class="pagination">
              <li class="page-item"><a @click="loadRecords($event, 'previous')" :class="{'disabled': apiIsInProgress || this.localPaginationObject.currentPage == 1}" class="page-link arrow" href="#"><</a></li>
              <li class="page-item"><a class="page-link">{{this.localPaginationObject.currentPage}}</a></li>
              <li class="page-item pt-1"><span class="of">of</span><span class="mr-3 ttlPge">{{this.localPaginationObject.totalPage}}</span></li>
              <li class="page-item"><a @click="loadRecords($event, 'next')" class="page-link arrow"  :class="{'disabled': apiIsInProgress || this.localPaginationObject.currentPage == this.localPaginationObject.totalPage}"  href="#">></a></li>
            </ul>
          </nav>
        </b-card>
        <div v-if="!isPaginationEnabled && showCollapseButton" @click="isSiteTeamSectionExpand=!isSiteTeamSectionExpand" v-b-toggle.collapse-site-team variant="primary" class="toggle-text pb-10 pt-15">Collapse tasks<span class="collapsed"></span></div>
      </b-collapse>
    </div>

  </div>
</template>

<script>
import { AclRule } from "vue-acl";
import { mapGetters } from "vuex";
import { CRA, DM, QUALITY, SITEDATALOCK } from "@/constants/authRoles";
export default {
  name: 'site-team-action-table',
  components: {
  },
  props: {
    edcFormRecords: {
      type: Array
    },
    studyId: {
      type: String
    },
    siteTeamTaskCompletionPR: {},
    enableSiteTeamTable: {
      type: Boolean
    },
    sitePaginationObject: {
      type: Object
    },
    showAllSiteTeamTasks: {
      type: Boolean,
      default: false
    },
    siteTableDataLoading: {
      type: Boolean,
      default: false
    },
    siteTeamTaskSectionEnabled: {
      type: Boolean
    },
    triggerForSiteTeamTask: {
      type: Boolean
    },
    milestoneView: {
      type: Boolean
    }
  },
  data() {
    return {
      siteTeamActionFields: [
        {key: "taskName", type: "string", label: "Name", ascOrder: false, dscOrder: false, class: 'width-250 pl-85', currentOrder: null, ableToSort: true},
        {key: "scheduleDate", type: "integer", label: "Due", ascOrder: false, dscOrder: false, class: 'width-120', currentOrder: null, ableToSort: true},
        {key: "responseTimeUTC", type: "integer", label: "Completed", ascOrder: false, dscOrder: false, class: 'width-240', currentOrder: null, ableToSort: true},
        {key: "submittedBy", type: "string", label: "By", ascOrder: false, dscOrder: false, class: 'width-150', currentOrder: null, ableToSort: true},
        {key: "openQueryCount", type: "integer", label: "Open Queries", ascOrder: false, dscOrder: false, class: 'width-120 open-queries', currentOrder: null, ableToSort: true},
        {key: "approveStatus", type: "integer", label: "Approved", ascOrder: false, dscOrder: false, class: 'width-100', currentOrder: null, ableToSort: true},
        {key: "verificationStatus", type: "integer", label: "Verified", ascOrder: false, dscOrder: false, class: 'width-70', currentOrder: null, ableToSort: true},
      ],
      label: {
        'NotStarted': 'Not Started',
        'Cancelled': 'Cancelled',
        'Missed': 'Missed',
        'NOTSTARTED': 'Not Started',
        'Complete': 'Complete',
        'Pending': 'Pending',
        'Start': 'Start'
      },
      isSiteTeamSectionExpand: false,
      edcForms: [],
      localPaginationObject: {},
      isPaginationEnabled: false,
      apiIsInProgress: false,
      showCollapseButton: false,
      showExpandButton: false,
    };
  },
  watch: {
    siteTableDataLoading: {
      handler(val) {
        if(val) {
          this.apiIsInProgress = true;
        }
      }
    },
    edcFormRecords: {
      handler(val) {
        if(this.showAllSiteTeamTasks) {
          this.isSiteTeamSectionExpand = true;
        } else {
          this.isSiteTeamSectionExpand = false;
        }
        this.edcForms = _.cloneDeep(this.edcFormRecords);
        // console.log(this.edcForms);
        // sort the records
        // this.edcForms = this.sortTimestampForScheduleAndUnschdule(this.edcForms);
        // disabled sorting if scheduled / due task is not there
        let disabledSortingForCompletedColumn = this.edcForms.filter((f) => {
          return f.label.toLowerCase() == 'pending' || f.label.toLowerCase() == 'complete' || f.label.toLowerCase() == 'cancelled';
        });
        let disabledSortingForDueColumn = this.edcForms.filter((f) => {
          return f.dueDate == true;
        });
        let disabledSortingForBy = this.edcForms.filter((f) => {
          return f.submittedBy != null && f.submittedBy != "";
        });
        let disabledSortingForOpenQueries = this.edcForms.filter((f) => {
          return f.openQueryCount != 0 ;
        });
        let disabledSortingForApproved = this.edcForms.filter((f) => {
          return f.approveStatus == 'APPROVED' ;
        });
        let disabledSortingForVerified = this.edcForms.filter((f) => {
          return f.verificationStatus == 'VERIFIED' ;
        });
        this.siteTeamActionFields.map((field) => {
          if(field.key == 'scheduleDate') {
            field.ableToSort = disabledSortingForDueColumn.length > 0;
            field.ascOrder = false;
            field.dscOrder = false;
          }
          if(field.key == 'responseTimeUTC') {
            field.ableToSort = disabledSortingForCompletedColumn.length > 0;
            field.ascOrder = false;
            field.dscOrder = false;
          }
          if(field.key == 'submittedBy') {
            field.ableToSort = disabledSortingForBy.length > 0;
            field.ascOrder = false;
            field.dscOrder = false;
          }
          if(field.key == 'openQueryCount') {
            field.ableToSort = disabledSortingForOpenQueries.length > 0;
            field.ascOrder = false;
            field.dscOrder = false;
          }
          if(field.key == 'approveStatus') {
            field.ableToSort = disabledSortingForApproved.length > 0;
            field.ascOrder = false;
            field.dscOrder = false;
          }
          if(field.key == 'verificationStatus') {
            field.ableToSort = disabledSortingForVerified.length > 0;
            field.ascOrder = false;
            field.dscOrder = false;
          }
        });
      }
    },
    sitePaginationObject: {
      handler (val) {
        this.apiIsInProgress = false;
        if((val.totalPage == 1 || val.totalPage == 0) && val.totalRecords <= 5) {
          this.isPaginationEnabled = false;
          this.showCollapseButton = false;
          this.showExpandButton = false;
          return;
        } else if ((val.totalPage == 1 || val.totalPage == 0) && val.totalRecords > 5) {
          this.isPaginationEnabled = false;
          this.showCollapseButton = true;
          this.showExpandButton = true;
          return;
        } else if (val.totalPage > 1) {
          this.isPaginationEnabled = true;
          this.showCollapseButton = false;
          this.showExpandButton = true;
        }
        this.prepareSiteObject();
      }
    }
  },
  computed: {
    ...mapGetters(["token", "user"]),
    userAccess() {
      return new AclRule(this.user.userRole).generate();
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
    tasksArrOne() {
      return this.edcForms.slice(0, 5);
    },
    tasksArrTwo() {
      return this.edcForms.slice(5, this.edcForms.length);
    },
    isStudyTeam() {
      return this.canCraAccess || this.canDmAccess || this.canQualityAccess || this.canSiteDataLockAccess;
    },
    canSiteDataLockAccess() {
      this.$acl.change(`${SITEDATALOCK}`);
      return this.$acl.check("userAccess");
    },
  },
  methods: {
    sortTimestampForScheduleAndUnschdule(records) {
      let isDraftRecordExists = [];
      isDraftRecordExists = records.filter((f) => {
        if(f.state.toLowerCase() == 'draft' && f.taskType != 'EDC_UNSCHEDULED') {
          return f;
        }
      });
      if(isDraftRecordExists.length > 0) {
        records.sort(function(x, y) {
          return x.scheduleDate - y.scheduleDate;
        });
      } else {
        records.sort(function(x, y) {
          return x.responseTimeUTC - y.responseTimeUTC;
        });
      }
      console.log(records);
      return records;
    },
    submitNewForm(record, event) {
      event.stopPropagation();
      if(record.label.toLowerCase() == 'start') {
        this.changeState(record);
      }
    },
    prepareSiteObject() {
      this.localPaginationObject = _.cloneDeep(this.sitePaginationObject);
    },
    loadRecords(event, direction) {
      event.preventDefault();
      if(this.apiIsInProgress) {
        return;
      }
      if(direction == 'next') {
        if(this.localPaginationObject.currentPage == this.localPaginationObject.totalPage) {
          return;
        } else {
          this.apiIsInProgress = true;
          let currentPage = this.localPaginationObject.currentPage + 1;
          this.localPaginationObject.currentIndex +=10;
          let obj = {
            pageIndex: currentPage,
            pageSize: 10,
            totalRecords: this.localPaginationObject.totalRecords,
            totalPage: this.localPaginationObject.totalPage
          }
          this.$emit('getNextSiteTeamRecords', obj);
        }
      } else if (direction == 'previous') {
        if(this.localPaginationObject.currentPage == 1) {
          return;
        } else {
          this.apiIsInProgress = true;
          let currentPage = this.localPaginationObject.currentPage - 1;
          this.localPaginationObject.currentIndex = (this.localPaginationObject.currentIndex + 1 ) - 10;
          let obj = {
            pageIndex: currentPage,
            pageSize: 10,
            totalRecords: this.localPaginationObject.totalRecords,
            totalPage: this.localPaginationObject.totalPage
          }
          this.$emit('getNextSiteTeamRecords', obj);
        }
      }
    },
    sortField(field, direction) {
      if(!field.ableToSort || this.edcForms.length == 0) {
        return;
      }
      if(direction == 'asc') {
        field.ascOrder = true;
        field.dscOrder = false;
      } else if(direction == 'desc') {
        field.ascOrder = false;
        field.dscOrder = true;
      }
      if(field.type == 'string') {
        if(field.currentOrder != direction) {
          field.currentOrder = direction;
          this.sortString(direction, field);
        }
      } else if(field.type == 'integer' && field.currentOrder != direction) {
        field.currentOrder = direction;
        this.sortTimeStamp(direction, field);
      }
    },
    sortString(direction, field) {
      let records = _.cloneDeep(this.edcForms);
      records = _.orderBy(records, [records => records[field.key] != undefined && records[field.key].toLowerCase()], direction);
      this.edcForms = records;
    },
    sortTimeStamp(direction, field) {
      let records = _.cloneDeep(this.edcForms);
      records = _.orderBy(records, [records => records[field.key] != undefined && records[field.key]], direction);
      this.edcForms = records;
    },
    changeState(record) {
      if((this.triggerDay && this.triggerDay.isTriggeredFeatureEnabled && this.triggerDay.triggeredBtnVisiblity) &&
        record.taskType == 'TELEHEALTH_UNSCHEDULED' && record.taskType == 'EDC_SCHEDULED'
      ) {
        return;
      }
      if(!this.triggerForSiteTeamTask && record.taskType == 'EDC_SCHEDULED') {
        return;
      }
      if(this.isStudyTeam && (record.label.toLowerCase() == 'missed' || record.label.toLowerCase() == 'pending' ||  record.label.toLowerCase() == 'start')) {
        return;
      }
      if(record.taskType == 'EDC_SCHEDULED' && record.state == 'SUBMITTED') {
        let params = {
          studyId: this.studyId,
          formId: record.taskId,
          milestone: record.scheduleDay,
          responseId: record.responseId || '0'
        };
        this.$router.push({name: 'submitted-form-new', params: params});
      } else if (record.taskType == 'EDC_SCHEDULED' && record.state !== 'SUBMITTED') {
        let params = {
          studyId: this.studyId,
          formId: record.taskId,
          milestone: record.scheduleDay,
          responseId: record.responseId || '0'
        };
        this.$router.push({name: 'study-participant-edc-reskin', params: params});
      } else if(record.taskType == 'EDC_UNSCHEDULED' && record.state !== 'SUBMITTED') {
        let params = {
          studyId: this.studyId,
          packetId: record.taskId,
          unscheduledPacketResponseId: record.responseId
        };
        this.$router.push({name: 'study-participant-edc-unschedule-form-reskin', params: params});
      } else if(record.taskType == 'EDC_UNSCHEDULED' && record.state === 'SUBMITTED') {
        let params = {
          studyId: this.studyId,
          packetId: record.taskId,
          unscheduledPacketResponseId: record.responseId
        };
        this.$router.push({name: 'submitted-packets-reskin', params: params});
      }
    },
    truncate(string) {
      if (string.length > 16) {
        return string.substring(0, 16) + "...";
      }
      return string;
    }
  },
  mounted() {

  },
};
</script>

<style scoped lang="scss" src="@/assets/table-styling.scss"></style>
<style scoped lang="scss" src="@/assets/dot-streaching-loader.scss"></style>
<style scoped lang="scss">
.site-team-table {
  padding: 0px 20px 25px !important;
  .table-title {
    font-size: 15px;
  }
  .text-info {
    color: #1e8fe1 !important;
    cursor: pointer;
    font-weight: 600;
  }
  .text-info:hover {
    text-decoration: none;
  }
  .due-date-indicator {
    display: inline-block;
    color: #4a4a4a;
    opacity: 0.5;
    border: solid 2px #e4e8eb;
    background-color: #f7f7f7;
    padding: 0px 5px;
    height: 27px;
    width: 100px;
    border-radius: 5px;
  }
  .color-text {
    color: #A8A8A8;
  }
  .clock {
    margin-top: -3px;
  }
  .card {
    .card-body {
      border-right: 1px solid #E4E8EB;
      border-left: 1px solid #E4E8EB;
      border-bottom: 1px solid #E4E8EB;
      .divTable {
        width: 100%;
      }
    }
  }
  .toggle-text {
    background-color: #fff;
    border-right: 1px solid #E4E8EB;
    border-left: 1px solid #E4E8EB;
    border-bottom: 1px solid #E4E8EB;
    border-top: none;
    span {
      background-image: url(/static/img/arrow-down-blue.png) !important;
      height: 20px;
      display: inline-block;
      background-repeat: no-repeat;
      width: 20px;
      background-position-y: 1px;
      background-position-x: 1px;
    }
    .collapsed {
      vertical-align: top;
      transform: rotate(180deg);
      background-position-y: -1px;
      background-position-x: -1px;
    }
  }
  .status {
    font-weight: 400;
  }
  .of {
    margin-right: -1px;
    margin-left: 2px;
  }
  .ttlPge {
    margin-left:-7px;
  }
  .loading-div {
    border: 1px solid #E4E8EB;
    border-top: none;
    height: 45px;
    .loading-class {
      padding: 15px 0px 0px;
      width: 2%;
      margin: 0 auto;
    }
  }
}
.telehealth-call {
  .clock {
    width: 10px;
    height: 10px;
  }
}
</style>
