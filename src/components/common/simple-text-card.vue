<template>
  <simple-card>
    <p class="lead text-center mb-2">{{ primaryValue }}</p>
    <p class="label text-small mb-2">{{title}}</p>
    <p class="card-text font-weight-semibold mb-2">{{ secondaryValue }}</p>
  </simple-card>
</template>
<script>
import SimpleCard from "./simple-card";

export default {
  props: {
    primaryValueProp: { type: String, default: null },
    titleProp: { type: String, default: null },
    secondaryValueProp: { type: String, default: null }
  },
  data() {
    return {
      primaryValue: this.primaryValueProp,
      title: this.titleProp,
      secondaryValue: this.secondaryValueProp
    };
  },
  watch: {
    primaryValueProp() {
      this.primaryValue = this.primaryValueProp;
    },
    titleProp() {
      this.title = this.titleProp;
    },
    secondaryValueProp() {
      this.secondaryValue = this.secondaryValueProp;
    }
  },
  components: {
    SimpleCard
  },
  methods: {
    refreshButtonClick() {
      console.log("refreshButtonClick");
    }
  },
};
</script>
