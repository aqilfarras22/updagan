<template>
  <div class="component">
    <b-container fluid class="pb-20 pt-30">
      <b-row>
        <b-col cols="6" md="4">
          <DonutChartWidget
            :data="queriesData"
            :titleColor="queriesData[0].color"
            title="Queries"
            info="The number of queries created by research team"
          />
        </b-col>
        <b-col cols="6" md="4">
          <DonutChartWidget
            :data="verificationData"
            :titleColor="verificationData[0].color"
            title="Verification"
            info="The number of forms verified by the research team"
          />
        </b-col>
        <b-col cols="6" md="4">
          <DonutChartWidget
            :data="approvalData"
            :titleColor="approvalData[0].color"
            title="Approval"
            info="The number of forms approved by the Principal Investigator(s)"
          />
        </b-col>
      </b-row>
    </b-container>
    <br />
    <table-component
      showTotal
      showEmpty
      :printTotalFormatter="printTotalFormatter"
      tableWrapperComponent="b-card"
      filterLabelMessage=""
      :perPage="perPage"
      :totalItems="totalForms"
      showPagination
      showFilter
      :filterOptions="filterOptions"
      :items="getQueries"
      :fields="tableFields"
    >
      <!-- participantId -->
      <template slot="participantId" slot-scope="data">
        <router-link :to="{
          name: 'study-participant-details',
          params: { studyId, participantId: data.row.item.participantId }
        }">{{ data.row.item.participantId }}</router-link>
      </template>
      <!-- lastCreatedQuery -->
      <template slot="lastCreatedQuery" v-if="data.row.item.lastCreatedQuery" slot-scope="data">
        {{ new Date(data.row.item.lastCreatedQuery) | formatGMTDate }}
      </template>
      <!-- formName -->
      <template slot="formName" slot-scope="data">
        <router-link :to="{
          name: 'study-participant-form',
          params: { studyId, participantId: data.row.item.participantId, formId: data.row.item.formId }
        }">
          {{ data.row.item.formName ? data.row.item.formName.replace(/_/g, ' ') : '' }}
        </router-link>
      </template>
      <!-- approvalStatus -->
      <template slot="approvalStatus" slot-scope="data">
        <span :class="data.row.item.approvalStatus">{{ approvalStatusText[data.row.item.approvalStatus] }}</span>
      </template>
      <!-- verificationStatus -->
      <template slot="verificationStatus" slot-scope="data">
        <span :class="data.row.item.verificationStatus">{{ verificationStatusText[data.row.item.verificationStatus] }}</span>
      </template>
    </table-component>
  </div>
</template>

<script>
import DonutChartWidget from '@/components/widgets/donut-chart-widget';
import TableComponent from '@/components/common/table';
import { AclRule } from 'vue-acl';
import { mapGetters } from 'vuex';
import { approvalStatusText, verificationStatusText } from '@/constants/form';
import { PI } from '@/constants/authRoles';
import memoize from 'lodash/memoize';

export default {
  name: 'study-participants-data-dashboard',
  components: {
    DonutChartWidget,
    TableComponent,
  },
  props: {
    studyId: {
      type: String,
    },
    studyData: {
      type: Object,
      default: () => {},
    },
    participantInfo: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      approvalStatusText,
      verificationStatusText,
      metainfo: {},
      filterOptions: [
        { value: '', text: 'All' },
        { value: 'open', text: 'Forms w/ open queries' },
        { value: 'closed', text: 'Forms w/ closed queries' },
        { value: 'NOT_VERIFIED', text: 'Unverified' },
        { value: 'VERIFIED', text: 'Verified' },
        { value: 'NOT_APPROVED', text: 'Unapproved' },
        { value: 'APPROVED', text: 'Approved' },
      ],
      perPage: 5,
      totalQueries: 0,
      totalForms: 0,
    };
  },
  computed: {
    ...mapGetters(['user']),
    userAccess() {
      return new AclRule(this.user.userRole).generate();
    },
    queriesData() {
      return [
        { value: this.metainfo.openQueries, label: 'Open', color: '#2E62A1' },
        { value: this.metainfo.closedQueries, label: 'Closed', color: '#5BB7CC' },
      ];
    },
    verificationData() {
      return [
        { value: this.metainfo.unverifiedForms, label: 'Unverified', color: '#DD5B2C' },
        { value: this.metainfo.verifiedForms, label: 'Verified', color: '#F8CD61' },
      ];
    },
    approvalData() {
      return [
        { value: this.metainfo.unApprovedForms, label: 'Unapproved', color: '#A73B8F' },
        { value: this.metainfo.approvedForms, label: 'Approved', color: '#E9668C' },
      ];
    },
    canPiAccess() {
      this.$acl.change(`${PI}`);
      return this.$acl.check('userAccess');
    },
    tableFields() {
      let fields = [
        {
          key: 'participantId',
          label: 'Participant Id',
        },
        {
          key: 'formName',
          label: 'Form Name',
        },
        {
          key: 'lastCreatedQuery',
          label: 'Last Query Created',
          sortable: true,
        },
        {
          key: 'numberOfOpenQueries',
          label: '# Of Open Queries',
          sortable: true,
        },
        {
          key: 'approvalStatus',
          label: 'Approval',
          sortable: true,
        },
        {
          key: 'verificationStatus',
          label: 'Verification',
          sortable: true,
        },
      ];

      if (this.canPiAccess) {
        fields = [
          fields[0],
          {
            key: 'email',
            label: 'Email Address',
          },
          ...fields.slice(1),
        ];
      }

      return fields;
    },
  },
  methods: {
    async getQueries({ currentPage, filter, sortBy, sortDesc, perPage }) {
      const limit = perPage;
      const offset = limit * (currentPage - 1);
      const { queries } = await this.getCacheStatistic([offset, limit, filter, sortBy, sortDesc]);

      return queries;
    },
    printTotalFormatter() {
      return `Total queries: ${this.totalQueries}`;
    },
    async getStatistic(params) {
      try {
        const data = await this.$api.getQueryToolStatistic({ sId: this.studyId, params });
        this.totalQueries = data.metainfo.totalQueries;
        this.totalForms = data.metainfo.totalForms;

        // do not update metainfo if it already exists
        if (!Object.keys(this.metainfo).length) {
          this.metainfo = data.metainfo;
        }
        return data;
      } catch (error) {
        const { message = 'Error while statistic request' } = (error && error.body) || {};
        this.$toastr.error(message);
      }
      return null;
    },
  },
  created() {
    this.getCacheStatistic = memoize(([offset, limit, filter,
      sortBy, sortDesc]) => this.getStatistic({ offset, limit, filter, sortBy, sortDesc }),
    );
  },
};
</script>

<style scoped lang="scss">
@import '~@/assets/variables.scss';

.component {
  background-color: $color_content_background;
}
.APPROVED,
.VERIFIED {
  color: #48bf7a;
}
.NOT_VERIFIED,
.NOT_APPROVED {
  color: #f16559;
}
</style>
