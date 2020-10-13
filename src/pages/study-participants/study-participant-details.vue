<template>
  <b-container fluid class="study-particip-details-block pt-30">
    <b-row>
      <b-col cols="2">
        <ParticipantInfo :participantDetails="participantInfo" />
      </b-col>
      <b-col cols="10">
        <div class="mb-20" v-if="canPiAccess || canSubPIAccess || canStudyCoordinatorAccess || canHomeHealthAccess || canCraAccess || canSiteDataLockAccess">
          <DocumentsList />
        </div>

        <div v-if="unschedulePacketsCalled && edcEnabled">
          <b-card no-body class="pt-10">
            <table-component
              showTotal
              :showButton="canPiAccess || canSubPIAccess || canStudyCoordinatorAccess || canHomeHealthAccess"
              showEmpty
              noGutters
              :btnText="'Unscheduled packet'"
              @tableBtn="btnClicked"
              :printTotalFormatter="formsPrintTotalFormatter"
              showFilter
              noProviderSorting
              noProviderPaging
              filterLabelMessage
              :perPage="tableFormPerPage * tableFormCurrentPage"
              :filterOptions="tableFormFilterOptions"
              :items="formsDataCollection"
              :fields="tableFormFields"
            >
              <!-- formName -->
              <template slot="formName" slot-scope="data">
                <span v-if="data.row.item.state === 'SUBMITTED'">
                  <img src="static/img/checkmark-2.svg" alt class="check-img-size" />
                </span>
                <span v-if="data.row.item.state === 'DRAFT'">
                  <img src="static/img/draft.png" alt class="img-size" />
                </span>
                <span
                  v-if="data.row.item.formName && data.row.item.state !== 'SUBMITTED' && (canQualityAccess || canDmAccess)"
                >{{ data.row.item.formName ? data.row.item.formName.replace(/_/g, ' ') : '' }}</span>
                <router-link
                  v-if="data.row.item.formName && data.row.item.state !== 'SUBMITTED' && !canQualityAccess && !canDmAccess"
                  class="fs-14"
                  :to="{
                  name: 'study-participant-edc',
                  params: { studyId, formId: data.row.item.formId, milestone: data.row.item.milestone, responseId: data.row.item.responseId || '0'}}"
                >{{ data.row.item.formName ? data.row.item.formName.replace(/_/g, ' ') : '' }}</router-link>
                <router-link
                  v-if="data.row.item.formName && data.row.item.state === 'SUBMITTED'"
                  class="fs-14"
                  :to="{
                  name: 'submitted-form',
                  params: { studyId, formId: data.row.item.formId, milestone: data.row.item.milestone, responseId: data.row.item.responseId || '0'}}"
                >{{ data.row.item.formName ? data.row.item.formName.replace(/_/g, ' ') : '' }}</router-link>
                <router-link
                  v-if="data.row.item.packetName && data.row.item.state !== 'SUBMITTED'"
                  class="fs-14"
                  :to="{
                  name: 'study-participant-edc-unschedule-form',
                  params: { studyId, packetId: data.row.item.unscheduledPacketId, unscheduledPacketResponseId: data.row.item.unscheduledPacketResponseId}}"
                >
                  {{ data.row.item.packetName ? data.row.item.packetName.replace(/_/g, ' ') : '' }} (Unscheduled)
                  <!-- <span v-if="data.row.item.packetName">{{ data.row.item.packetName ? data.row.item.packetName.replace(/_/g, ' ') : '' }}</span> -->
                </router-link>
                <router-link
                  v-if="data.row.item.packetName && data.row.item.state === 'SUBMITTED'"
                  class="fs-14"
                  :to="{
                  name: 'submitted-packets',
                  params: { studyId, packetId: data.row.item.unscheduledPacketId, unscheduledPacketResponseId: data.row.item.unscheduledPacketResponseId}}"
                >
                  {{ data.row.item.packetName ? data.row.item.packetName.replace(/_/g, ' ') : '' }} (Unscheduled)
                  <!-- <span v-if="data.row.item.packetName">{{ data.row.item.packetName ? data.row.item.packetName.replace(/_/g, ' ') : '' }}</span> -->
                </router-link>
              </template>
              <!-- lastCreatedQuery -->
              <template slot="formDate" v-if="data.row.item.formDate" slot-scope="data">
                <span v-if="data.row.item.state === 'DRAFT'">Started -</span>
                {{ new Date(data.row.item.formDate) | formatGMTDate }}
              </template>
              <!-- approvalStatus -->
              <template slot="approvalStatus" slot-scope="data">
                <span
                  :class="data.row.item.approvalStatus"
                >{{ approvalStatusText[data.row.item.approvalStatus] }}</span>
              </template>
              <!-- verificationStatus -->
              <template slot="verificationStatus" slot-scope="data">
                <span
                  :class="data.row.item.verificationStatus"
                >{{ verificationStatusText[data.row.item.verificationStatus] }}</span>
              </template>
            </table-component>
          </b-card>
          <b-row v-if="forms.length && displayShowMore">
            <b-col class="pr-0 mb-2">
              <b-button @click="showMore" class="float-right" variant="link">
                <b>Show more</b>
              </b-button>
            </b-col>
          </b-row>
          <br />
        </div>

        <!-- Truclinic forms -->
        <div v-if=" truclinicForms && truclinicForms.length && telehealthEnabled">
          <b-card no-body class="pt-10">
            <table-component
              showTotal
              showEmpty
              noGutters
              :printTotalFormatter="truclinicFormsPrintTotalFormatter"
              showFilter
              noProviderSorting
              noProviderPaging
              filterLabelMessage
              :perPage="tableFormPerPage * tableTruclinicFormCurrentPage"
              :filterOptions="tableFormFilterOptions"
              :items="truclinicFormsDataCollection"
              :fields="tableTruclinicFormFields"
            >
              <!-- formName -->
              <template slot="formName" slot-scope="data">
                <router-link
                  :to="{
                  name: 'study-participant-form',
                  params: { studyId, participantId: $route.params.participantId, formId: data.row.item.formId }
                }"
                >{{ data.row.item.formName ? data.row.item.formName.replace(/_/g, ' ') : '' }}</router-link>
              </template>
              <!-- lastCreatedQuery -->
              <template
                slot="submittedOn"
                v-if="data.row.item.submittedOn"
                slot-scope="data"
              >{{ new Date(data.row.item.submittedOn) | formatGMTDate }}</template>
              <!-- approvalStatus -->
              <template slot="approvalStatus" slot-scope="data">
                <span
                  :class="data.row.item.approvalStatus"
                >{{ approvalStatusText[data.row.item.approvalStatus] }}</span>
              </template>
              <!-- verificationStatus -->
              <template slot="verificationStatus" slot-scope="data">
                <span
                  :class="data.row.item.verificationStatus"
                >{{ verificationStatusText[data.row.item.verificationStatus] }}</span>
              </template>
            </table-component>
          </b-card>
          <b-row v-if="truclinicForms && truclinicForms.length && displayShowMoreTruclinic">
            <b-col class="pr-0 mb-2">
              <b-button @click="showMoreTruclinic" class="float-right" variant="link">
                <b>Show more</b>
              </b-button>
            </b-col>
          </b-row>
          <br />
        </div>

        <b-card no-body class="pt-10 mb-4" v-if="reportedData.length">
          <table-component
            showTotal
            showEmpty
            noGutters
            :printTotalFormatter="reportedDataPrintTotalFormatter"
            filterLabelMessage
            showFilter
            noProviderSorting
            :filterOptions="tableReportedDataFilterOptions"
            :items="reportedDataCollection"
            :fields="tableReportedDataFields"
          >
            <!-- name -->
            <template slot="name" slot-scope="data">
              <div v-if="isBlindedEnabled.blinded && data.row.item.type == 'Survey'">
                <span>{{ data.row.item.name ? data.row.item.name : '' }}</span>
              </div>
              <div v-else>
                <router-link
                  :to="{
                name: 'study-participant-survey',
                params: { studyId, surveyId: data.row.item.id, surveyDate: data.row.item.completedOn, trakerId: data.row.item.reportedDataTrackerId },
              }"
                  v-if="data.row.item.type == 'Survey'"
                  v-bind="data.row.item"
                >{{ data.row.item.name ? data.row.item.name : '' }}</router-link>
                <router-link
                  :to="{
                name: 'study-participant-activity',
                params: { studyId, activityId: data.row.item.id },
              }"
                  v-if="data.row.item.type == 'Activity'"
                >{{ data.row.item.name ? data.row.item.name : '' }}</router-link>
              </div>
            </template>
            <!-- completedOn -->
            <template
              slot="completedOn"
              v-if="data.row.item.completedOn"
              slot-scope="data"
            >{{ new Date(data.row.item.completedOn) | formatGMTDate }}</template>
          </table-component>
        </b-card>

        <!-- Telehealth appointments  -->
        <div class="mb-20" v-if="canAccessTelehealth()">
          <TelehealthAppointmentList />
        </div>
        <!-- Telehealth appointments ends -->
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import uniq from "lodash/uniq";
import { AclRule } from "vue-acl";
import { mapGetters } from "vuex";
import sortBy from "lodash/sortBy";
import TableComponent from "@/components/common/table";
import ParticipantInfo from "@/components/participants/participant-info";
import {
  PI,
  SUB_PI,
  STUDY_COORDINATOR,
  CRA,
  DM,
  HOME_HEALTH,
  QUALITY,
  SITEDATALOCK
} from "@/constants/authRoles";

import {
  approvalStatusText,
  verificationStatusText,
  verificationStatus,
  approvalStatus
} from "@/constants/form";
import DocumentsList from "@/components/participants/documents/documents-list";
import TelehealthAppointmentList from "@/components/participants/telehealth/appointment-list";

export default {
  name: "study-participant-details",
  components: {
    TableComponent,
    ParticipantInfo,
    DocumentsList,
    TelehealthAppointmentList
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
      approvalStatusText,
      verificationStatusText,
      participantInfo: {},
      forms: [],
      unschedulePackets: [],
      unschedulePacketsCalled: false,
      filteredForms: null,
      filteredTruclinicForms: null,
      tableFormPerPage: 5,
      tableFormCurrentPage: 1,
      tableTruclinicFormCurrentPage: 1,
      tableFormFields: [
        {
          key: "formName",
          label: "Form Name",
          sortable: true
        },
        {
          key: "formDate",
          label: "Date",
          sortable: true
        },
        {
          key: "noOfOpenQueries",
          label: "# Of Open Queries",
          sortable: true
        },
        {
          key: "approvalStatus",
          label: "Approval Status",
          sortable: true
        },
        {
          key: "verificationStatus",
          label: "Verification Status",
          sortable: true
        }
      ],
      tableTruclinicFormFields: [
        {
          key: "formName",
          label: "Form Name",
          sortable: true
        },
        {
          key: "submittedOn",
          label: "Submitted On",
          sortable: true
        },
        {
          key: "numberOfOpenQueries",
          label: "# Of Open Queries",
          sortable: true
        },
        {
          key: "approvalStatus",
          label: "Approval Status",
          sortable: true
        },
        {
          key: "verificationStatus",
          label: "Verification Status",
          sortable: true
        }
      ],
      tableFormFilterOptions: [
        { value: "", text: "All" },
        { value: "open", text: "Forms w/ open queries" },
        { value: "closed", text: "Forms w/ closed queries" },
        { value: "unverified", text: "Unverified" },
        { value: "verified", text: "Verified" },
        { value: "unapproved", text: "Unapproved" },
        { value: "approved", text: "Approved" }
      ],
      reportedData: [],
      filteredReportedData: null,
      tableReportedDataFields: [
        {
          key: "name",
          label: "Data Name",
          sortable: true
        },
        {
          key: "completedOn",
          label: "Completed On",
          sortable: true
        },
        {
          key: "deviceType",
          label: "Device Type",
          sortable: true
        }
      ],
      tableReportedDataFilterOptions: [{ value: "", text: "Filter" }],
      scheduleForms: {},
      truclinicForms: [],
      edcEnabled: false,
      telehealthEnabled: false,
      isTelehealthV2Enabled: false,
      isBlindedEnabled: {}
    };
  },
  computed: {
    ...mapGetters(["token", "user"]),
    userAccess() {
      return new AclRule(this.user.userRole).generate();
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
      return this.$acl.check("userAccess");
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
    displayShowMore() {
      return (
        this.totalForms > this.tableFormCurrentPage * this.tableFormPerPage
      );
    },
    totalForms() {
      return this.filteredForms ? this.filteredForms.length : this.forms.length;
    },
    displayShowMoreTruclinic() {
      return (
        this.totalTruclinicForms >
        this.tableTruclinicFormCurrentPage * this.tableFormPerPage
      );
    },
    totalTruclinicForms() {
      return this.filteredTruclinicForms
        ? this.filteredTruclinicForms.length
        : this.truclinicForms.length;
    },
    totalReportedData() {
      return this.filteredReportedData
        ? this.filteredReportedData.length
        : this.reportedData.length;
    },
    canSiteDataLockAccess() {
      this.$acl.change(`${SITEDATALOCK}`);
      return this.$acl.check("userAccess");
    }
  },
  methods: {
    formsPrintTotalFormatter() {
      return `Forms: ${this.totalForms}`;
    },
    truclinicFormsPrintTotalFormatter() {
      return `Forms: ${this.totalTruclinicForms}`;
    },
    reportedDataPrintTotalFormatter() {
      return `Participant reported data: ${this.totalReportedData}`;
    },
    formsDataCollection({ filter }) {
      if (filter) this.tableFormCurrentPage = 1;

      switch (filter) {
        case "open":
          this.filteredForms = this.forms.filter(f => f.noOfOpenQueries > 0);
          break;
        case "closed":
          this.filteredForms = this.forms.filter(f => f.noOfCloseQueries > 0);
          break;
        case "verified":
          this.filteredForms = this.forms.filter(
            f => f.verificationStatus === verificationStatus.VERIFIED
          );
          break;
        case "unverified":
          this.filteredForms = this.forms.filter(
            f => f.verificationStatus === verificationStatus.NOT_VERIFIED
          );
          break;
        case "approved":
          this.filteredForms = this.forms.filter(
            f => f.approvalStatus === approvalStatus.APPROVED
          );
          break;
        case "unapproved":
          this.filteredForms = this.forms.filter(
            f => f.approvalStatus === approvalStatus.NOT_APPROVED
          );
          break;
        default:
          this.filteredForms = null;
          return this.forms;
      }
      return this.filteredForms;
    },
    showMore() {
      this.tableFormCurrentPage += 1;
    },
    truclinicFormsDataCollection({ filter }) {
      if (filter) this.tableTruclinicFormCurrentPage = 1;

      switch (filter) {
        case "open":
          this.filteredTruclinicForms = this.truclinicForms.filter(
            f => f.numberOfOpenQueries > 0
          );
          break;
        case "closed":
          this.filteredTruclinicForms = this.truclinicForms.filter(
            f => f.numberOfClosedQueries > 0
          );
          break;
        case "verified":
          this.filteredTruclinicForms = this.truclinicForms.filter(
            f => f.verificationStatus === verificationStatus.VERIFIED
          );
          break;
        case "unverified":
          this.filteredTruclinicForms = this.truclinicForms.filter(
            f => f.verificationStatus === verificationStatus.NOT_VERIFIED
          );
          break;
        case "approved":
          this.filteredTruclinicForms = this.truclinicForms.filter(
            f => f.approvalStatus === approvalStatus.APPROVED
          );
          break;
        case "unapproved":
          this.filteredTruclinicForms = this.truclinicForms.filter(
            f => f.approvalStatus === approvalStatus.NOT_APPROVED
          );
          break;
        default:
          this.filteredTruclinicForms = null;
          return this.truclinicForms;
      }
      return this.filteredTruclinicForms;
    },
    showMoreTruclinic() {
      this.tableTruclinicFormCurrentPage += 1;
    },
    reportedDataCollection({ filter }) {
      if (filter) {
        this.filteredReportedData = this.reportedData.filter(
          rd => rd.name === filter
        );
        return this.filteredReportedData;
      }
      this.filteredReportedData = null;
      return this.reportedData;
    },
    getParticipantInfo() {
      this.$api
        .getParticipantDataFact(this.studyId, this.$route.params.participantId)
        .then(
          response => {
            this.participantInfo = response.body;
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
    async getParticipantEDCSchedule() {
      await this.$api
        .getParticipantFormsFact(this.studyId, this.$route.params.participantId)
        .then(
          response => {
            this.scheduleForms = response.body;            
            this.scheduleForms.forEach(schedule => {
              schedule.participantForms.forEach(form => {
                const formData = form;
                formData.milestone = schedule.milestone;                
                this.forms.push(formData);
              });
            });            
            this.forms = sortBy(this.forms, "formDate");
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
    async getUnscheduledPackets() {
      await this.$api
        .getEDCUnscheduleFormResponseFact(
          this.studyId,
          this.$route.params.participantId
        )
        .then(
          response => {
            this.unschedulePackets = response.body;            
            if (this.unschedulePackets && this.unschedulePackets.length > 0) {
              this.unschedulePackets.forEach(packet => {
                this.forms.push(packet);
              });
            }
            this.unschedulePacketsCalled = true;
            this.forms = sortBy(this.forms, "formDate");
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
    btnClicked(type) {
      if (this.canQualityAccess) {
        this.$toastr.error("You are not allowed to perform this action");
      } else if (type.toLowerCase().includes("unscheduled")) {
        this.$router.push({
          name: "study-participant-edc-unschedule-packets"
        });
      }
    },
    getToggledFeatures() {
      this.$api.getToggleFeaturesFact(this.studyId).then(
        response => {
          if (response.body) {
            this.toggleFeatures = response.body.studyFeatures;
            this.toggleFeatures.forEach(feature => {
              if (feature.featureKey === "EDC") {
                this.edcEnabled = feature.enabled;
              } else if (feature.featureKey === "TruClinic") {
                this.telehealthEnabled = feature.enabled;
              } else if (feature.featureKey === "TELEHEALTH") {
                this.isTelehealthV2Enabled = feature.enabled;
              }
            });
          }
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
    async getForms() {
      await this.getParticipantEDCSchedule();
      await this.getUnscheduledPackets();
    },
    canAccessTelehealth() {
      if (
        this.studyData.telehealthIntegration &&
        this.isTelehealthV2Enabled &&
        (this.canPiAccess ||
          this.canSubPIAccess ||
          this.canStudyCoordinatorAccess ||
          this.canHomeHealthAccess ||
          this.canSiteDataLockAccess
          )
      ) {
        return true;
      }

      return false;
    }
  },
  mounted() {
    this.getToggledFeatures();
    this.$api
      .getBlindedRole()
      .then(resp => {
        this.isBlindedEnabled = resp.body;
      })
      .catch(error => {
        const { message = "Error while requesting blinded role" } =
          (error && error.body) || {};
        this.$toastr.error(message);
      });
    this.$api
      .getQueryToolStudyParticipant({
        pId: this.$route.params.participantId,
        sId: this.studyId
      })
      .then(data => {
        this.truclinicForms = data.forms;
        this.reportedData = data.activities;

        const uniqNames = uniq(data.activities.map(a => a.name));
        uniqNames.forEach(name => {
          this.tableReportedDataFilterOptions.push({ value: name, text: name });
        });
      })
      .catch(error => {
        const { message = "Error while participant details request" } =
          (error && error.body) || {};
        this.$toastr.error(message);
      });
    this.getParticipantInfo();
    if (
      this.canPiAccess ||
      this.canSubPIAccess ||
      this.canStudyCoordinatorAccess ||
      this.canCraAccess ||
      this.canDmAccess ||
      this.canHomeHealthAccess ||
      this.canQualityAccess ||
      this.canSiteDataLockAccess
    ) {
      this.$api.checkEDCMilestonesFact(this.studyId).then(
        resp => {
          if (resp.status === 200) {
            this.getForms();
          }
        },
        error => {
          if (error.status === 400) {
            this.getUnscheduledPackets();
          }
        }
      );
    }
  }
};
</script>

<style scoped lang="scss">
.APPROVED,
.VERIFIED {
  color: #48bf7a;
}
.NOT_VERIFIED,
.NOT_APPROVED {
  color: #f16559;
}
.no-paddings {
  padding-left: 0;
  padding-right: 0;
}

.btn-link {
  font-size: 11px;
  padding-right: 0;
}

.img-size {
  width: 16px;
  height: 13px;
}

.check-img-size {
  width: 16px;
  height: 16px;
}
</style>
<style lang="scss">
@import "~@/assets/variables.scss";
.study-particip-details-block {
  background-color: $color_content_background;

  .custom-b-table {
    th {
      border: none;
    }
    td {
      font-size: 12px;
    }

    .itemstotal {
      font-size: 20px;
      font-weight: normal;
      color: #666669;
      padding-top: 2px;
    }
  }
}
</style>
