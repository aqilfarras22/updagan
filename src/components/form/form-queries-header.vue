<template>
  <header>
    <b-row class="py-2 align-middle">
      <b-col class="text">{{ title }}</b-col>
      <b-col col lg="3" class="text text-right"><a @click.prevent="back" href="#" class="backButton">{{ backTitle }}</a></b-col>
    </b-row>
  </header>
</template>

<script>
export default {
  name: 'form-queries-header',
  props: {
    title: String,
    backTitle: {
      type: String,
      default: 'Back',
    },
  },
  methods: {
    back() {
      this.$emit('back');
    },
  },
};
</script>

<style scoped>
header {
  background: rgba(211, 223, 228, 0.5);
}
.text {
  font-size: 12px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.33;
  letter-spacing: normal;
  vertical-align: middle;
  color: #666669;
}
.backButton {
  color: #666669;
  text-decoration: underline;
}
</style>
