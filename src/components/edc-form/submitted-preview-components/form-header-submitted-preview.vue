<template>
  <div class="pt-10 pb-5">
    <b-row>
      <b-col cols="10" class="pl-30">
        <span>{{componentData.question}}</span>
      </b-col>
    </b-row>
  </div>
</template>

<script>

export default {
  name: 'header-submitted-preview',
  props: ['componentData'],
  data() {
    return {};
  },
  mounted() {},
  methods: {},
  computed: {},
};
</script>
