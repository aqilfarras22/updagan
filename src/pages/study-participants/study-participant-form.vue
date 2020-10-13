<template>
  <b-container
    v-if="!isLoading"
    fluid
    class="pt-30 mb-5 component"
  >
    <b-row>
      <b-col cols="2">
        <button-cmp
          variant="link"
          size="sm"
          @click="goToPreviousScreen"
          class="back-button"
        >
          <span><strong><i class="fa fa-caret-left fa-lg" aria-hidden="true"></i></strong>&nbsp; Back</span>
        </button-cmp>
        <FormInfo
          v-if="generalInfo"
          v-bind="generalInfo"
          @verificationConfirmed="verificationConfirmed"
          @approvalConfirmed="approvalConfirmed"
        />
        <hr v-if="participantInfo" class="mt-30 mb-30" />
        <ParticipantInfo
          v-if="participantInfo"
          :participantDetails="participantInfo"
        />
      </b-col>
      <b-col cols="10" class="pb-20">
        <b-card no-body class="border-0 shadow study-particip-form-block">
          <b-row v-if="formHistoryVersion" no-gutters>
            <b-col>
              <FormHistoryVersion :formVersion="formHistoryVersion" @back="historyBack" />
            </b-col>
          </b-row>
          <b-row v-else no-gutters>
            <b-col cols="7" xl="8">
              <b-tabs v-model="tabIndex">
                <b-tab title="Latest Version">
                  <b-row>
                    <b-col>
                      <div v-if="canPiAccess || canSubPiAccess || canScAccess || canHomeHealthAccess" class="float-right my-1">
                        <button-cmp v-if="!edit" @click="edit = !edit" size="sm" variant="outline-secondary">
                          <span><i class="fa fa-pencil" aria-hidden="true"></i> Edit</span>
                        </button-cmp>
                        <strong v-else class="editing">Currently editing</strong>
                      </div>
                    </b-col>
                  </b-row>
                  <FormFieldsEditList
                    v-if="edit"
                    :sections="sections"
                    @save="saveForm"
                    @cancelEdit="cancelEdit"
                  />
                  <FormFieldsList
                    v-else
                    :doNotOpenQuery="!(canCraAccess || canDmAccess)"
                    :sections="sections"
                    :fieldsWithQueries="fieldsWithQueries"
                    :selectedFieldId="filterFieldId"
                    @openQuery="openQuery"
                    @selected="filterByField" />
                  <FormComments
                    v-if="comments && comments.length > 0"
                    :comments="comments" />
                </b-tab>
                <b-tab title="History">
                  <FormHistoryList
                    :history="formHistory"
                    @view="viewHistoryForm"
                  />
                </b-tab>
              </b-tabs>
            </b-col>
            <b-col cols="5" xl="4" class="tabs-queries">
              <FormQueries
                v-model="newQuery"
                :filter="filterFieldId"
                :queries="queries"
                :formId="fId"
                @createQuery="createQuery"
                @createComment="createComment"
                @resetFilter="resetFilter"
                @onQueryClosed="onQueryClosed"
                @onQueryReopened="onQueryReopened"
              />
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { AclRule } from 'vue-acl';
import { mapGetters } from 'vuex';
import ParticipantInfo from '@/components/participants/participant-info';
import FormInfo from '@/components/form/form-info';
import FormHistoryList from '@/components/form/form-history-list';
import FormHistoryVersion from '@/components/form/form-history-version';
import FormFieldsList from '@/components/form/form-fields-list';
import FormFieldsEditList from '@/components/form/form-fields-edit-list';
import FormQueries from '@/components/form/form-queries';
import FormQueriesHeader from '@/components/form/form-queries-header';
import ButtonCmp from '@/components/common/button';
import FormComments from '@/components/form/form-comments';

import { PI, SUB_PI, STUDY_COORDINATOR, CRA, DM, HOME_HEALTH  } from '@/constants/authRoles';
import { formFieldQueryStatus } from '@/constants/form';

export default {
  name: 'study-participant-form',
  components: {
    ParticipantInfo,
    FormInfo,
    FormHistoryList,
    FormHistoryVersion,
    FormFieldsList,
    FormFieldsEditList,
    FormQueries,
    FormQueriesHeader,
    ButtonCmp,
    FormComments,
  },
  props: {
    studyId: {
      type: String,
    },
    studyData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      tabIndex: 0,
      participantInfo: null,
      formHistory: null,
      isLoading: true,
      newQuery: null,
      formHistoryVersion: null,
      edit: false,
      filterFieldId: null,
      generalInfo: null,
      participant: null,
      sections: [],
      queries: [],
      comments: [],
    };
  },
  computed: {
    ...mapGetters(['user']),
    userAccess() {
      return new AclRule(this.user.userRole).generate();
    },
    canPiAccess() {
      this.$acl.change(`${PI}`);
      return this.$acl.check('userAccess');
    },
     canSubPiAccess() {
      this.$acl.change(`${SUB_PI}`);
      return this.$acl.check('userAccess');
    },
    canScAccess() {
      this.$acl.change(`${STUDY_COORDINATOR}`);
      return this.$acl.check('userAccess');
    },
    canHomeHealthAccess() {
      this.$acl.change(`${HOME_HEALTH}`);
      return this.$acl.check('userAccess');
    },
    canCraAccess() {
      this.$acl.change(`${CRA}`);
      return this.$acl.check('userAccess');
    },
    canDmAccess() {
      this.$acl.change(`${DM}`);
      return this.$acl.check('userAccess');
    },
    fId() {
      return this.$route.params.formId;
    },
    fieldsWithQueries() {
      if (this.queries) {
        return this.queries.filter(q => q.status === formFieldQueryStatus.OPEN).map(q => q.fieldId);
      }
      return [];
    },
  },
  methods: {
    verificationConfirmed(status) {
      if (this.generalInfo.verificationStatus !== status) {
        this.generalInfo.verificationStatus = status;
        this.getData();
      }
    },
    approvalConfirmed(status) {
      if (this.generalInfo.approvalStatus !== status) {
        this.generalInfo.approvalStatus = status;
        this.getData();
      }
    },
    saveForm({ sections, primaryReason }) {
      this.$api
        .saveQueryToolStudyForm(
          { fId: this.fId },
          {
            primaryReason,
            sections,
          },
        )
        .then(() => {
          this.$toastr.success('Edits saved');
          this.getData();
          this.edit = false;
        })
        .catch(error => {
          const { message = 'Error while saving form data' } = (error && error.body) || {};
          this.$toastr.error(message);
          this.edit = false;
        });
    },
    cancelEdit() {
      this.edit = false;
    },
    openQuery(fieldId) {
      this.newQuery = fieldId;
    },
    createQuery(query) {
      this.$api
        .addQueryToolFieldQuery(query)
        .then(() => {
          this.$toastr.success('Query created');
          this.getData();
        })
        .catch(error => {
          const { message = 'Error while creating field query' } = (error && error.body) || {};
          this.$toastr.error(message);
        });
    },
    createComment(commentData) {
      this.$api
        .addQueryToolFormQueryComment(commentData)
        .then(this.getData)
        .catch(error => {
          const { message = 'Error while creating comment' } = (error && error.body) || {};
          this.$toastr.error(message);
        });
    },
    viewHistoryForm({ versionId }) {
      this.$api
        .getQueryToolStudyFormHistoryVersion({
          vId: versionId,
          fId: this.fId,
        })
        .then(data => {
          this.formHistoryVersion = data;
        })
        .catch(error => {
          const { message = 'Error while getting form version' } = (error && error.body) || {};
          this.$toastr.error(message);
        });
    },
    historyBack() {
      this.formHistoryVersion = null;
    },
    filterByField(id) {
      this.filterFieldId = id;
    },
    resetFilter() {
      this.filterFieldId = null;
    },
    onQueryClosed(query) {
      this.$api
        .setQueryToolFormQueryStatus({ qId: query.queryId, patchId: 'close' })
        .then(() => {
          this.$toastr.success('Query closed');
          this.getData();
        })
        .catch(error => {
          const { message = 'Error while closing query' } = (error && error.body) || {};
          this.$toastr.error(message);
        });
    },
    onQueryReopened(query) {
      this.$api
        .setQueryToolFormQueryStatus({ qId: query.queryId, patchId: 'open' })
        .then(() => {
          this.$toastr.success('Query reopened');
          this.getData();
        })
        .catch(error => {
          const { message = 'Error while reopening query' } = (error && error.body) || {};
          this.$toastr.error(message);
        });
    },
    getData() {
      this.$api
        .getQueryToolStudyForm({ fId: this.fId })
        .then(data => {
          this.generalInfo = data.generalInfo;
          this.sections = data.sections;
          this.queries = data.dataQueries;
          this.participantInfo = data.participant;
          this.isLoading = false;
          this.comments = data.comments;
        })
        .catch(error => {
          const { message = 'Error while saving form data' } = (error && error.body) || {};
          this.$toastr.error(message);
        });

      this.$api
        .getQueryToolStudyFormHistory({ fId: this.fId })
        .then(data => {
          this.formHistory = data;
        })
        .catch(error => {
          const { message = 'Error while getting history data' } = (error && error.body) || {};
          this.$toastr.error(message);
        });
    },
    goToPreviousScreen() {
      this.$router.go(-1);
    },
  },
  mounted() {
    this.getData();
  },
};
</script>

<style scoped lang="scss">
@import '~@/assets/variables.scss';

.component {
  background-color: $color_content_background;
}

.back-button {
  font-size: 14px;
  padding-top: 0px;
  padding-left: 0px;
  margin-bottom: 20px;
}

.editing {
  text-transform: uppercase;
  font-size: 12px;
  color: #7478e6;
}
</style>
<style lang="scss">
.study-particip-form-block {
  .nav-tabs {
    border-bottom-color: #d3dfe4;
    .nav-item {
      margin: 0 25px;
    }

    .nav-link {
      font-size: 14px;
      line-height: 1.43;
      color: #2d3752;
      padding: 0.9rem 0 0.45rem !important;
      border: none;
      border-bottom: 4px solid transparent;

      &:focus,
      &:hover {
        border: none;
        border-bottom: 4px solid transparent;
      }

      &:hover {
        border-bottom: 4px solid #4c8ce4;
      }

      &.active {
        font-weight: bold;
        border-bottom: 4px solid #4c8ce4;
      }
    }
  }

  .tabs-queries {
    border-left: 1px solid #d3dfe4;

    .nav-tabs {
      margin-left: -1px;
      border-left: 1px solid #fff;
      flex-wrap: inherit;
    }

    .nav-item {
      .nav-link {
        &.active {
          color: #f5a623;
        }
      }
    }
  }
}

@media (max-width: 1400px) {
  .study-particip-form-block {
    .nav-tabs {
      .nav-item {
        margin: 0 10px;
      }
    }
  }
}
</style>
