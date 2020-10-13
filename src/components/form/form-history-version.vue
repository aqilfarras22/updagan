<template>
  <div>
    <b-row class="border-bottom header-row">
      <b-col><a @click.prevent="back" class="backButton" href=""><i class="fa fa-caret-left fa-lg"></i>&nbsp; Back to history</a></b-col>
      <b-col class="text-right"><i class="square"></i>&nbsp; <span class="info">Edited fields</span></b-col>
    </b-row>
    <b-row v-if="formVersion.primaryReason">
      <b-col class="mt-3">
        <p><strong>Reason for change: {{ formVersion.primaryReason }}</strong></p>
      </b-col>
    </b-row>
    <FormFieldsList
      doNotOpenQuery
      showChanged
      :sections="formVersion.sections"
    />
  </div>
</template>

<script>
import FormFieldsList from '@/components/form/form-fields-list';

export default {
  name: 'form-history-version',
  components: { FormFieldsList },
  props: {
    formVersion: Object,
  },
  methods: {
    back() {
      this.$emit('back');
    },
  },
};
</script>

<style scoped>
.header-row {
  padding: 0.9rem 0 0.65rem;
}
.square {
  display: inline-block;
  width: 16px;
  height: 16px;
  border-radius: 1px;
  margin-bottom: -2px;
  background-color: #ffa200;
}
.info {
  font-size: 12px;
  display: inline-block;
}
</style>
