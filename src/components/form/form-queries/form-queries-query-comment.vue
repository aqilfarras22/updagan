<template>
  <div class="comment-item" v-if="comment">
    <div class="date">
      <span>{{ new Date(comment.createdOn) | formatGMTDate }}</span>
    </div>
    <dl>
      <dt><strong>{{ comment.author }}</strong></dt>
      <dd>{{ comment.comment }}</dd>
    </dl>
  </div>
</template>

<script>
export default {
  name: 'form-queries-query-comment',
  props: {
    comment: Object,
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
