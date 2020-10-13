<template>
  <b-list-group flush>
    <b-list-group-item v-for="query in queries" :key="query.id">
      <FormQueriesListItem :query="query" @view="viewQuery" />
    </b-list-group-item>
  </b-list-group>
</template>

<script>
import FormQueriesListItem from '@/components/form/edc-form-queries/form-queries-list-item';

export default {
  name: 'form-queries-list',
  components: {
    FormQueriesListItem,
  },
  props: {
    queries: Array,
  },
  methods: {
    viewQuery(queryId) {
      this.$emit('view', queryId);
    },
  },
};
</script>
