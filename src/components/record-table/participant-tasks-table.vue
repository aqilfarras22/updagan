<template>
  <div class="participant-task-table">
    <div class="row table-title">
      <div class="col-md-6 pl-0 font-bolder">Participant Tasks</div>
      <div class="col-md-6 align-right p-0"><span class="font-bolder pr-10">{{participantTaskCompletionPR}}%</span>Complete</div>
    </div>
    <div class="divTable unstyledTable">
      <div class="divTableHeading">
        <div class="divTableRow">
          <div class="divTableHead" :class="field.class" v-for="(field, index) in participantFields" :key ="index">
            <b class="mr-5">{{field.label}}</b>
            <span class="sortDown mr-2" @click="sortField(field, 'asc')" :class="{'disable-icon': !field.ascOrder}"><i class="fa fa-long-arrow-down" aria-hidden="true"></i></span>
            <span class="sortUp" @click="sortField(field, 'desc')" :class="{'disable-icon': !field.dscOrder}"><i class="fa fa-long-arrow-up" aria-hidden="true"></i></span>
          </div>
        </div>
      </div>
      <div class="divTableBody" :class="{'loading-opacity': apiIsInProgress}" v-if="participantRecords && participantRecords.length > 0">
        <div class="divTableRow" v-for="(record, index) in tasksArrOne" :key ="index">
          <div class="divTableCell">
            <span v-if="isStatusEnabled(record.status)" class="status" :class="record.status.toLowerCase()">{{record.status}}</span>
            <span class="text-info" :class="{'pl-85': !isStatusEnabled(record.status), 'text-info-cursor': record.status == 'Scheduled' || record.status == 'Missed' || record.status == 'Current'}" @click="showActivityResponseModal(record)">{{truncate(record.name)}}</span>
          </div>
          <div class="divTableCell"><span v-if="record.status.toLowerCase() != 'complete' && triggerForParticipantTask" class="due-date-indicator">{{new Date(record.dueDate) | dueDateIndicator}}</span></div>
          <div class="divTableCell color-text">
            <div v-if="record.status.toLowerCase() != 'missed' && record.status.toLowerCase() != 'scheduled'">
              <span>{{new Date(record.completedOn) | formatUTCDate }}</span>
              <span class="clock ml-5" :id="record.reportedDataTrackerId" tabindex="0"></span>
              <b-popover :target="record.reportedDataTrackerId" triggers="click blur">
                <template v-slot:content>
                  <div class="popover-content">
                    <span class="person"></span>
                    <div class="ml-15">{{dateInReadableFormat(record)}}</div>
                  </div>
                  <div class="popover-content">
                    <span class="clinic"></span>
                    <div class="ml-15">{{toPILocalTime(record)}}</div>
                  </div>
                </template>
              </b-popover>
            </div>
          </div>
          <div class="divTableCell color-text">{{record.availibilityWindow}}</div>
          <div class="divTableCell color-text">{{record.deviceType}}</div>
        </div>
      </div>
    </div>
    <div class="no-task slide-animation" v-if="enableParticipantTable && participantRecords.length == 0">No tasks available</div>
    <div v-if="enableParticipantTable && participantRecords.length > 0">
      <div
        v-if="!isParticipantTasksSectionExpand && enableParticipantTable && participantRecords.length > 0 && showExpandButton"
        @click="isParticipantTasksSectionExpand=!isParticipantTasksSectionExpand"
        :class="isParticipantTasksSectionExpand ? null : 'collapsed'"
        :aria-expanded="isParticipantTasksSectionExpand"
        v-b-toggle.collapse-participant-tasks
        variant="primary"
        class="toggle-text pt-10 pb-10">Show all tasks<span></span>
      </div>
      <b-collapse v-if="enableParticipantTable" v-model="isParticipantTasksSectionExpand" id="collapse-participant-tasks" class="mt-2">
        <b-card>
          <div class="divTable">
            <div class="divTableBody" :class="{'loading-opacity': apiIsInProgress}">
              <div class="divTableRow" v-for="(record, index) in tasksArrTwo" :key ="index">
                <div class="divTableCell width-250">
                  <span v-if="isStatusEnabled(record.status)" class="status" :class="record.status.toLowerCase()">{{record.status}}</span>
                  <span class="text-info" :class="{'pl-85': !isStatusEnabled(record.status), 'text-info-cursor': record.status == 'Scheduled' || record.status == 'Missed' || record.status == 'Current'}" @click="showActivityResponseModal(record)">{{truncate(record.name)}}</span>
                </div>
                <div class="divTableCell width-120"><span  v-if="record.status.toLowerCase() != 'complete' && triggerForParticipantTask" class="due-date-indicator">{{new Date(record.dueDate) | dueDateIndicator}}</span></div>
                <div class="divTableCell color-text width-250">
                  <div v-if="record.status.toLowerCase() != 'missed' && record.status.toLowerCase() != 'scheduled'">
                    <span>{{new Date(record.completedOn) | formatUTCDate }}</span>
                    <span class="clock ml-5" :id="record.reportedDataTrackerId" tabindex="0"></span>
                    <b-popover :target="record.reportedDataTrackerId" triggers="click blur">
                      <template v-slot:content>
                        <div class="popover-content">
                          <span class="person"></span>
                          <div class="ml-15">{{dateInReadableFormat(record)}}</div>
                        </div>
                        <div class="popover-content">
                          <span class="clinic"></span>
                          <div class="ml-15">{{toPILocalTime(record)}}</div>
                        </div>
                      </template>
                    </b-popover>
                  </div>
                </div>
                <div class="divTableCell width-155 color-text">{{record.availibilityWindow}}</div>
                <div class="divTableCell width-280 color-text">{{record.deviceType}}</div>
              </div>
            </div>
          </div>
          <nav aria-label="page navigation pagination" v-if="isPaginationEnabled">
            <ul class="pagination">
              <li class="page-item"><a @click="loadRecords($event, 'previous')" :class="{'disabled': apiIsInProgress || this.localPaginationObject.currentPage == 1}" class="page-link arrow" href="#"><</a></li>
              <li class="page-item"><a class="page-link">{{this.localPaginationObject.currentPage}}</a></li>
              <li class="page-item pt-1"><span class="of">of</span><span class="mr-3 ttlPge pt-0">{{this.localPaginationObject.totalPage}}</span></li>
              <li class="page-item"><a @click="loadRecords($event, 'next')" :class="{'disabled': apiIsInProgress || this.localPaginationObject.currentPage == this.localPaginationObject.totalPage}" class="page-link arrow" href="#">></a></li>
            </ul>
          </nav>
        </b-card>
        <div v-if="!isPaginationEnabled && showCollapseButton" @click="isParticipantTasksSectionExpand=!isParticipantTasksSectionExpand" v-b-toggle.collapse-participant-tasks variant="primary" class="toggle-text pb-10 pt-15">Collapse tasks<span class="collapsed"></span></div>
    </b-collapse>
    </div>
    <!-- Participant Submitted response modal -->
    <ParticipantResponseModal
      ref="activityResponseModal"
      :responseActivityDetail="responseActivityDetail"
      :responseLanguageOptions="responseLanguageOptions"
      :generalParticipantInfo="generalParticipantInfo"
      @resetActivityResponse="responseActivityDetail=null;"
    />
  </div>
</template>

<script>
import ParticipantResponseModal from "@/components/participants/activity-response-modal";
import moment from 'moment';
import momentTimeZone from 'moment-timezone';
import { deflate } from 'zlib';

export default {
  name: 'participant-tasks-table',
  components: {
    ParticipantResponseModal
  },
  props: {
    participantTaskRecords: {
      type: Array
    },
    participantInfo: {
      type: Object
    },
    generalParticipantInfo: {
      type: Object
    },
    enableParticipantTable: {
      type: Boolean
    },
    participantTaskCompletionPR: {
      type: Number
    },
    participantPaginationObject: {
      type: Object
    },
    showAllParticipantTasks: {
      type: Boolean,
      default: false
    },
    participantTableDataLoading: {
      type: Boolean,
      default: false
    },
    participantTaskSectionEnabled: {
      type: Boolean
    },
    triggerForParticipantTask: {
      type: Boolean
    }
  },
  data() {
    return {
      participantFields: [
        {key: "name", type: "string", label: "Name", ascOrder: false, dscOrder: false, class: 'width-250 pl-85', currentOrder: null, ableToSort: true},
        {key: "dueDate", type: "integer", label: "Due", ascOrder: false, dscOrder: false, class: 'width-120', currentOrder: null, ableToSort: true},
        {key: "completedOn", type: "integer", label: "Completed", ascOrder: false, dscOrder: false, class: 'width-250', currentOrder: null, ableToSort: true},
        {key: "availibilityWindow", type: "string", label: "Availability Window", ascOrder: false, dscOrder: false, class: 'width-155', currentOrder: null, ableToSort: true},
        {key: "deviceType", type: "string", label: "Device Type", ascOrder: false, dscOrder: false, class: 'width-280', currentOrder: null, ableToSort: true},
      ],
      isParticipantTasksSectionExpand: false,
      participantRecords: [],
      responseLanguageOptions: [],
      responseActivityDetail: null,
      localPaginationObject: {},
      isPaginationEnabled: false,
      apiIsInProgress: false,
      showCollapseButton: false,
      showExpandButton: false,
    };
  },
  computed: {
    tasksArrOne() {
      return this.participantRecords.slice(0, 5);
    },
    tasksArrTwo() {
      return this.participantRecords.slice(5, this.participantRecords.length);
    }
  },
  watch: {
    participantTableDataLoading: {
      handler(val) {
        if(val) {
          this.apiIsInProgress = true;
        }
      }
    },
    participantTaskRecords: {
      handler(val) {
        if(this.showAllParticipantTasks) {
          this.isParticipantTasksSectionExpand = true;
        } else {
          this.isParticipantTasksSectionExpand = false;
        }
        this.participantRecords = _.cloneDeep(this.participantTaskRecords);
        // disabled sorting if scheduled / due task is not there
        let disabledSortingForCompletedColumn = this.participantRecords.filter((f) => {
          return f.status.toLowerCase() == 'complete';
        });
        let disabledSortingForDueColumn = this.participantRecords.filter((f) => {
          return f.status.toLowerCase() !== 'complete';
        });
        let disabledSortingForDeviceType = this.participantRecords.filter((f) => {
          return f.deviceType != "";
        });
        this.participantFields.map((field) => {
          if(field.key == 'dueDate') {
            field.ableToSort = disabledSortingForDueColumn.length > 0;
            field.ascOrder = false;
            field.dscOrder = false;
          }
          if(field.key == 'completedOn') {
            field.ableToSort = disabledSortingForCompletedColumn.length > 0;
            field.ascOrder = false;
            field.dscOrder = false;
          }
          if(field.key == 'deviceType') {
            field.ableToSort = disabledSortingForDeviceType.length > 0;
            field.ascOrder = false;
            field.dscOrder = false;
          }
        });
      }
    },
    participantPaginationObject: {
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
          return
        } else if (val.totalPage > 1) {
          this.isPaginationEnabled = true;
          this.showCollapseButton = false;
          this.showExpandButton = true;
        }
        this.preparePaginationObject();
      }
    }
  },
  methods: {
    preparePaginationObject() {
      this.localPaginationObject = _.cloneDeep(this.participantPaginationObject);
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
          let obj = {
            pageIndex: currentPage,
            pageSize: 10,
            totalRecords: this.localPaginationObject.totalRecords,
            totalPage: this.localPaginationObject.totalPage
          }
          this.$emit('getNextParticipantRecords', obj);
        }
      } else if (direction == 'previous') {
        if(this.localPaginationObject.currentPage == 1) {
          return;
        } else {
          this.apiIsInProgress = true;
          let currentPage = this.localPaginationObject.currentPage - 1;
          let obj = {
            pageIndex: currentPage,
            pageSize: 10,
            totalRecords: this.localPaginationObject.totalRecords,
            totalPage: this.localPaginationObject.totalPage
          };
          this.$emit('getNextParticipantRecords', obj);
        }
      }
    },
    sortField(field, direction) {
      if(!field.ableToSort || this.participantRecords.length == 0) {
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
        this.sortTimeStamp(direction, field)
      }
    },
    sortString(direction, field) {
      let records = _.cloneDeep(this.participantTaskRecords);
      records = _.orderBy(records, [records => records[field.key] != undefined && records[field.key].toLowerCase()], direction);
      this.participantRecords = records;
    },
    sortTimeStamp(direction, field) {
      let records = _.cloneDeep(this.participantTaskRecords);
      records = _.orderBy(records, [records => records[field.key] != undefined && records[field.key]], direction);
      this.participantRecords = records;
    },
    truncate(string) {
      if (string.length > 21) {
        return string.substring(0, 21) + "...";
      }
      return string;
    },
    isStatusEnabled(status) {
      return status.toLowerCase() != "current" &&
        status.toLowerCase() != "scheduled" &&
        status.toLowerCase() != "notstarted" &&
        status.toLowerCase() != "rescheduled";
    },
    showActivityResponseModal(activityDetail) {
      if(!this.triggerForParticipantTask) {
        return;
      }
      if(activityDetail.status.toLowerCase() == 'current' || activityDetail.status.toLowerCase() == 'missed' ||  activityDetail.status.toLowerCase() == 'scheduled') {
        return;
      }
      if(activityDetail.type == 'Telehealth') {
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
    toPILocalTime(record) {
      let timeZone = moment.tz.guess();
      let time = new Date();
      let timeZoneOffset = time.getTimezoneOffset();
      let abbr = moment.tz.zone(timeZone).abbr(timeZoneOffset);
      let piLocalTime = momentTimeZone(record.completedOn).tz(abbr).format('DD MMM YYYY hh:mm A z');
      if(piLocalTime.length > 21) {
        return piLocalTime;
      }
      return piLocalTime + abbr;
    },
    dateInReadableFormat(record) {
      let d = moment(record.localCompletedTime).utcOffset(record.localOffset);
      return moment(d).format('DD MMM YYYY hh:mm A');
    }
  },
  mounted() {},
};
</script>

<style lang="scss" src="@/assets/table-styling.scss"></style>
<style lang="scss">
  .participant-task-table {
    padding: 0px 20px 40px !important;
    .table-title {
      font-size: 15px;
    }
    .text-info {
      color: #1e8fe1 !important;
      cursor: pointer;
      font-weight: 600;
      &.text-info-cursor {
        cursor: context-menu;
      }
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
    .color-text {
      color: #A8A8A8;
    }
    .card {
      .card-body {
        margin-top: -1px;
        border-right: 1px solid #E4E8EB;
        border-left: 1px solid #E4E8EB;
        border-bottom: 1px solid #E4E8EB;
        .divTable {
          width: 100%;
        }
      }
    }
    .clock {
      margin-top: -3px;
    }
    .of {
      margin-right: -1px;
      margin-left: 2px;
    }
    .ttlPge {
      margin-left:-7px;
    }
  }
  .popover-content {
    width: 200px;
  }
  .telehealth-call {
    .participant-task-table {
      .toggle-text {
        font-size: 12px;
      }
      .due-date-indicator {
        height: 22px;
        width: 75px;
      }
      .table-title {
        font-size: 12px;
      }
    }
  }
</style>
