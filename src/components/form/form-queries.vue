<template>
  <b-tabs class="form-queries-tabs" v-model="tabIndex">
    <b-tab :title="`Open Queries: ${openQueries.length}`">
      <FormQueriesCommentForm v-if="value" @cancel="cancelQuery" @submit="createQuery"/>
      <div v-else>
        <div v-if="openQuery">
          <FormQueriesQueryDetails
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
import FormQueriesList from '@/components/form/form-queries/form-queries-list';
import FormQueriesQueryDetails from '@/components/form/form-queries/form-queries-query-details';
import FormQueriesCommentForm from '@/components/form/form-queries/form-queries-comment-form';
import FormQueriesHeader from '@/components/form/form-queries-header';

import { formFieldQueryStatus } from '@/constants/form';

export default {
  name: 'form-queries',
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
  },
  data() {
    return {
      tabIndex: 0,
      openQueryId: null,
      closedQueryId: null,
    };
  },
  computed: {
    shortFilterId() {
      if (this.filter) {
        return this.filter.slice(0, 5).toUpperCase();
      }
      return '';
    },
    filteredQueries() {
      let filtered = this.queries;
      if (this.filter) {
        filtered = this.queries.filter(q => q.fieldId === this.filter);
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
  },
  methods: {
    viewOpenQuery(queryId) {
      this.openQueryId = queryId;
    },
    hideOpenQuery() {
      this.openQueryId = null;
    },
    viewClosedQuery(queryId) {
      this.closedQueryId = queryId;
    },
    hideClosedQuery() {
      this.closedQueryId = null;
    },
    createQuery({ comment }) {
      const newQuery = {
        fieldId: this.value,
        formId: this.formId,
        comment,
      };
      this.$emit('createQuery', newQuery);
      this.$emit('input', null);
    },
    onQueryCommentCreate(commentData) {
      this.$emit('createComment', commentData);
    },
    cancelQuery() {
      this.$emit('input', null);
    },
    resetFilter() {
      this.$emit('resetFilter');
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
