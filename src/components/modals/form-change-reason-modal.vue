<template>
  <b-modal v-model="value" size="lg" hide-footer hide-header no-close-on-backdrop>
    <b-container class="modal-content-box" fluid>
      <b-row class="text-center">
        <b-col><p class="title"><strong>Select reason for data change</strong></p></b-col>
      </b-row>
      <b-row class="text-center my-3">
        <b-col>
          <b-form-select v-model="primaryReason" :options="options" class="mb-3">
            <template slot="first">
              <option :value="''" disabled>Select an option</option>
            </template>
          </b-form-select>
        </b-col>
      </b-row>
      <b-row class="text-center my-3">
        <b-col>
          <button-cmp variant="primary" @click="confirmAction" class="button" :disabled="!primaryReason">Confirm data change</button-cmp>
        </b-col>
      </b-row>
      <b-row class="text-center my-3">
        <b-col>
          <button-cmp @click="cancelAction" class="button">Cancel changes</button-cmp>
        </b-col>
      </b-row>
    </b-container>
  </b-modal>
</template>

<script>
import ButtonCmp from '@/components/common/button';

export default {
  name: 'form-change-reason-modal',
  components: { ButtonCmp },
  props: {
    value: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      primaryReason: '',
      options: [],
    };
  },
  methods: {
    confirmAction() {
      this.$emit('confirmed', this.primaryReason);
      this.closeModal();
    },
    cancelAction() {
      this.$emit('canceled');
      this.closeModal();
    },
    closeModal() {
      this.$emit('input', false);
    },
  },
  mounted() {
    this.$api.getFormReasonForChangeList()
      .then(result => {
        this.options = result.body || [];
      })
      .catch(error => {
        const { message = 'Error while loading available reason for change variants' } = (error && error.body) || {};
        this.$toastr.error(message);
      });
  },
};
</script>

<style scoped>
.modal-content-box {
  padding: 25px;
  min-width: 300px!important;
}
.title {
  font-size: 16px;
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.5;
  letter-spacing: normal;
  text-align: center;
  color: #666669;
}
.button {
  text-transform: none;
  border-radius: 25px;
  width: 75%;
  font-size: 14px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
}
</style>
