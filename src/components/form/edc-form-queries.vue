<template>
  <b-tabs class="" v-model="tabIndex">
    <b-tab :title="`Open Queries: ${openQueries.length}`" :title-link-class="queriesOpen()">
      <FormQueriesCommentForm v-if="value" @cancel="cancelQuery" @submit="createQuery"/>
      <div v-else>
        <div v-if="openQueryId">
          <FormQueriesQueryDetails
            :userNames="userNames"
            :comments="comments"
            :query="openQuery"
            @back="hideOpenQuery"
            @onQueryCommentCreate="onQueryCommentCreate"
            @onQueryClosed="onQueryClosed"
          />
        </div>
        <div v-else>
          <FormQueriesHeader v-if="filter" :title="`Filtered by field ID ${shortFilterId}`" @back="resetFilter" backTitle="Clear"/>
          <b-row v-if="!openQueries.length" class="py-2">
            <b-col><p>No queries created yet.<br>Select a field to create a query.</p></b-col>
          </b-row>
          <FormQueriesList
            v-else
            :queries="openQueries"
            @view="viewOpenQuery"
          />
        </div>
      </div>
    </b-tab>
    <b-tab :title="`Closed Queries: ${closedQueries.length}`">
      <div v-if="closedQuery">
        <FormQueriesQueryDetails
          closed
          :comments="comments"
          :userNames="userNames"
          :query="closedQuery"
          @back="hideClosedQuery"
          @onQueryReopened="onQueryReopened"
        />
      </div>
      <div v-else>
        <FormQueriesHeader v-if="filter" :title="`Filtered by field ID ${filter}`" @back="resetFilter" backTitle="Clear"/>
        <b-row v-if="!closedQueries.length">
          <b-col class="py-2"><p>No queries closed yet.</p></b-col>
        </b-row>
        <FormQueriesList
          v-else
          :queries="closedQueries"
          @view="viewClosedQuery"
        />
      </div>
    </b-tab>
  </b-tabs>
</template>

<script>
import sortBy from 'lodash/sortBy';
import FormQueriesList from '@/components/form/edc-form-queries/form-queries-list';
import FormQueriesQueryDetails from '@/components/form/edc-form-queries/form-queries-query-details';
import FormQueriesCommentForm from '@/components/form/edc-form-queries/form-queries-comment-form';
import FormQueriesHeader from '@/components/form/form-queries-header';

import { formFieldQueryStatus } from '@/constants/form';

export default {
  name: 'edc-form-queries',
  components: {
    FormQueriesList,
    FormQueriesQueryDetails,
    FormQueriesCommentForm,
    FormQueriesHeader,
  },
  props: {
    value: String,
    queries: Array,
    filter: String,
    formId: String,
    studyId: String,
    comments: Array,
  },
  data() {
    return {
      tabIndex: 0,
      openQueryId: null,
      closedQueryId: null,
      userNames: {},
    };
  },
  async mounted() {
    const type="studyteam"
    const associated = "true"
    const studyTeamData = await this.$api.getStudyUsersFact(this.$route.params.studyId, type, associated);
    const siteTeamData = await this.$api.getUserNames(this.$route.params.studyId);
    studyTeamData.body.forEach(team => {
      this.userNames[team.id] = `${team.firstName} ${team.lastName}`;
    });
    siteTeamData.body.forEach(team => {
      this.userNames[team.id] = `${team.firstName} ${team.lastName}`;
    });
  },
  computed: {
    shortFilterId() {
      if (this.filter) {
        // return this.filter.slice(0, 5).toUpperCase();
        return this.filter;
      }
      return '';
    },
    filteredQueries() {
      let filtered = this.queries;
      if (this.filter) {
        filtered = this.queries.filter(q => q.fieldId === this.filter);
        this.$forceUpdate();
      }
      return sortBy(filtered, ['openedOn']).reverse();
    },
    openQueries() {
      return this.filteredQueries.filter(q => q.status === formFieldQueryStatus.OPEN);
    },
    closedQueries() {
      return this.filteredQueries.filter(q => q.status !== formFieldQueryStatus.OPEN);
    },
    openQuery() {
      return this.queries.find(q => q.queryId === this.openQueryId);
    },
    closedQuery() {
      return this.queries.find(q => q.queryId === this.closedQueryId);
    },
  },
  watch: {
    value(val) {
      if (val) {
        this.openQueryId = null;
        this.closedQueryId = null;
        this.tabIndex = 0;
      }
    },
    filter(val) {
      if (!this.value) {
        if (val) {
          this.shortFilterId = val;
          this.openQueryId = null;
          this.closedQueryId = null;
          this.tabIndex = 0;
        }
      }
    },
  },
  methods: {
    queriesOpen() {
      return this.filteredQueries.filter(q => q.status === formFieldQueryStatus.OPEN).length > 0 ? 'text-warning' : '';
    },
    viewOpenQuery(queryId) {
      this.openQueryId = queryId;
      const field = this.openQueries.find(q => q.queryId === queryId);
      this.$emit('updateComment', queryId, field.fieldId);
    },
    hideOpenQuery() {
      this.$emit('updateQueries');
      this.openQueryId = null;
      this.$emit('resetFilter');
    },
    viewClosedQuery(queryId) {
      this.closedQueryId = queryId;
      const field = this.closedQueries.find(q => q.queryId === queryId);
      this.$emit('updateComment', queryId, field.fieldId);
    },
    hideClosedQuery() {
      this.closedQueryId = null;
      this.$emit('resetFilter');
    },
    createQuery(commentData) {
      const newQuery = {
        fieldId: this.value,
        formId: this.formId,
        comment: commentData,
      };
      this.$emit('createQuery', newQuery);
      this.$emit('input', null);
    },
    onQueryCommentCreate(commentData) {
      this.$emit('createComment', commentData);
    },
    cancelQuery() {
      this.$emit('input', null);
      this.$emit('resetFilter');
    },
    resetFilter() {
      this.$emit('resetFilter');
      window.scrollTo(0, 0);
    },
    onQueryClosed(query) {
      this.openQueryId = null;
      this.$emit('onQueryClosed', query);
    },
    onQueryReopened(query) {
      this.closedQueryId = null;
      this.$emit('onQueryReopened', query);
    },
  },
};
</script>
<style>
a.text-warning:hover, a.text-warning:focus, .text-warning {
  color: #f5a623 !important;
}
</style>
