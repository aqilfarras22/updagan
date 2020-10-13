<template>
  <b-modal ref="modal" size="lg" hide-footer hide-header>
    <div class="modal-content-box">
      <b-form @submit.prevent="yesAction">
        <b-container fluid>
          <b-row class="text-center" v-if="text">
            <b-col>
              <p><strong>{{ text }}</strong></p>
            </b-col>
          </b-row>
          <b-row class="text-center">
            <b-col>
              <p>
                <button-cmp variant="primary" aria-label="yes" type="submit" class="button">{{ yesBtnTxt }}</button-cmp>
              </p>
            </b-col>
          </b-row>
          <b-row class="text-center">
            <b-col>
              <button-cmp @click="hide" aria-label="no" class="button">{{ noBtnTxt }}</button-cmp>
            </b-col>
          </b-row>
        </b-container>
      </b-form>
    </div>
  </b-modal>
</template>

<script>
import ButtonCmp from '@/components/common/button';

export default {
  name: 'confirmation-modal',
  components: { ButtonCmp },
  props: {
    text: String,
    yesBtnTxt: {
      type: String,
      default: 'Yes',
    },
    noBtnTxt: {
      type: String,
      default: 'No',
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
      this.$emit('confirmed');
      this.hide();
    },
  },
};
</script>

<style scoped>
.modal-content-box {
  min-width: 550px;
  padding: 31px 50px;
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
