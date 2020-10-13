<template>
  <div class="comment-item" v-if="comment">
    <div class="date">
      <span>{{ new Date(comment.createdAt) | formatGMTDate }}</span>
    </div>
    <dl>
      <dt class="query-username"><strong>{{ name }}</strong></dt>
      <dd>{{ comment.cText }}</dd>
    </dl>
  </div>
</template>

<script>
export default {
  name: 'form-queries-query-comment',
  props: {
    comment: Object,
    name: String,
  },
};
</script>

<style scoped>
.date {
  color: grey;
  font-size: 10px;
  overflow: hidden;
}
.comment-item {
  padding: 0.75rem 1.25rem;
}

</style>
