<template>
  <div class="query-item">
    <div class="date">
      <span>{{ new Date(lastComment.createdAt) | formatGMTDate }}</span>
      <span>ID: {{ shortQueryId }}</span>
    </div>
    <dl>
      <dt class="query-username"><strong>{{ lastComment.createdBy }}</strong></dt>
      <dd>{{ lastComment.cText }}</dd>
    </dl>
    <a href="#" @click.prevent="viewQuery(query.queryId)">View</a>
  </div>
</template>

<script>
export default {
  name: 'form-queries-list-item',
  props: {
    query: Object,
  },
  computed: {
    shortQueryId() {
      if (this.query) {
        return this.query.queryId.slice(0, 5).toUpperCase();
      }
      return '';
    },
    lastComment() {
      return this.query.comments[0];
    },
  },
  methods: {
    viewQuery(queryId) {
      this.$emit('view', queryId);
    },
  },
};
</script>

<style scoped>
.date {
  color: grey;
  font-size: 10px;
  overflow: hidden;
}
.date span {
  float: right;
}
.date span:first-child {
  float: left;
}
.dt {
  font-size: 10px;
  line-height: 1.6;
  text-transform: uppercase;
  color: #adaeb1;
}
</style>
