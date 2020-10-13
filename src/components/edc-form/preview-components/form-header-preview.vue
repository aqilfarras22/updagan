<template>
  <div class="pt-10 pb-5">
    <b-row>
      <b-col cols="12" class="pl-14 fs-16"><b>{{componentData.body}}</b></b-col>
    </b-row>
  </div>
</template>

<script>
  export default {
    name: 'form-header-preview',
    props: ['componentData'],
    data() {
      return {};
    },
    mounted() {
    },
    methods: {},
    computed: {},
  };
</script>

<style scoped lang="scss">

</style>
