<template>
  <div class="pt-10 pb-5">
    <b-row>
      <b-col cols="12" class="pl-14"><p class="mb-0">{{componentData.body}}</p></b-col>
    </b-row>
  </div>
</template>

<script>
  export default {
    name: 'form-paragraph-preview',
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
