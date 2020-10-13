<template>
  <b-modal ref="modal" hide-footer hide-header>
    <b-row class="pt-20 border-style text-center">
      <b-col align-self="center" class="pb-0">
      </b-col>
    </b-row>
    <b-row class="text-center plr-60">
      <b>Your changes will not be saved.<br>
      Are you sure you want to cancel modifying this study?</b>
    </b-row>
    <b-row class="pt-20 pb-40 text-center">
      <b-col cols="12" class="pb-10">
        <button type="button" class="btn modifyBtn pl-10 pr-10 br-25" @click="cancelModifying()">
          Yes, cancel modifying study
        </button>
      </b-col>
      <b-col cols="12">
        <button type="button" class="btn cancelModifyBtn br-25" @click="hide">
          No, do not cancel modifying study
        </button>
      </b-col>
    </b-row>
    <div class="modal-style">
    </div>
  </b-modal>
</template>

<script>

export default {
  name: 'cancel-modal',
  data() {
    return {
      studyId: null,
    };
  },
  mounted() {
    this.studyId = this.$route.params.studyId;
  },
  methods: {
    show() {
      this.$refs.modal.show();
    },
    hide() {
      this.$refs.modal.hide();
    },
    cancelModifying() {
      this.$router.push({ name: 'dashboard', params: { studyId: this.studyId } });
    },
  },
};
</script>

<style scoped>
.modifyBtn {
  width: 300px;
  height: 40px;
  background-color: #4c8ce4;
  color: #fff;
}
.cancelModifyBtn {
  width: 300px;
  height: 40px;
  opacity: 0.7;
  background-color: #959fa4;
  color: #ffffff
}
.plr-60 {
  padding-left: 60px;
  padding-right: 60px;
}
</style>
