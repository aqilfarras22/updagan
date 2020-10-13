<template>
  <b-modal ref="modal" size="lg" hide-footer hide-header>
    <div class="modal-content-box">
      <b-container fluid>
        <b-row class="text-center">
          <b-col><p><strong>{{ title }}</strong></p></b-col>
        </b-row>
        <b-row class="text-center">
          <b-col>
            <p>
              <button-cmp variant="primary" @click="yesAction" class="button">{{ yesBtn }}</button-cmp>
            </p>
          </b-col>
        </b-row>
        <b-row class="text-center">
          <b-col><button-cmp @click="hide" class="button">{{ noBtn }}</button-cmp></b-col>
        </b-row>
      </b-container>
    </div>
  </b-modal>
</template>

<script>
import ButtonCmp from '@/components/common/button';

export default {
  name: 'form-verification-modal',
  components: { ButtonCmp },
  props: {
    formId: {
      type: String,
      required: true,
    },
    verified: {
      type: Boolean,
      required: true,
    },
    callApi: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    title() {
      if (this.verified) {
        return 'Are you sure you want to rescind verification for this source document?';
      }
      return 'Have you thoroughly verified this source document?';
    },
    yesBtn() {
      if (this.verified) {
        return 'Yes, change to "unverified" status';
      }
      return 'Yes, change to "verified" status';
    },
    noBtn() {
      if (this.verified) {
        return 'No, do not change to "unverified" status';
      }
      return 'No, do not change to "verified" status';
    },
  },
  methods: {
    show() {
      this.$refs.modal.show();
    },
    hide() {
      this.$refs.modal.hide();
    },
    yesAction() {
      this.$emit('confirmed', { verified: !this.verified });
      this.hide();
    },
  },
};
</script>

<style scoped>
.modal-content-box {
  padding: 50px 0px;
}
.button {
  text-transform: none;
  border-radius: 25px;
  width: 80%;
  font-size: 14px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
}
</style>
