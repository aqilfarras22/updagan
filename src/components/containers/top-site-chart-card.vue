<template>
  <b-card class="card-full" :title="title" v-if="newData">
    <div v-for="(s,index) in newData.sites" :key="index" class="mb-4">
      <p class="mb-2">
        <span class="text-13">{{ s.site }}</span>
        <span class="float-right text-muted text-13">{{ s.active }}/{{ newData.total }}</span>
        <b-progress :value="(s.active / newData.total) * 100" :class="`progress-color-${0}`"></b-progress>
      </p>
    </div>
  </b-card>
</template>
<script>
export default {
  props: {
    data: { type: Object, default: null },
    title: { type: String, default: "" },
  },
  data() {
    return {
      newData: this.data,
    };
  },
  watch: {
    data() {
      this.newData = this.data;
    },
  },
};
</script>
