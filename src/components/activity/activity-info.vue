<template>
  <div>
    <dl>
      <dt>Task Name</dt>
      <dd>{{ name }}</dd>
    </dl>
    <dl>
      <dt>Submitted On</dt>
      <dd>
        {{ new Date(completedOn) | dateFormat('MMM DD,YYYY') }}
      </dd>
    </dl>
  </div>
</template>

<script>
export default {
  name: 'activity-info',
  props: {
    name: {
      type: String,
      required: true,
    },
    completedOn: [String, Number],
  },
};
</script>

<style scoped>
dt {
  font-size: 10px;
  line-height: 1.6;
  text-transform: uppercase;
  color: #adaeb1;
}
dd {
  color: #666669;
  font-size: 14px;
  font-weight: 500;
}
.date {
  font-size: 12px;
  line-height: 1.67;
}
</style>
