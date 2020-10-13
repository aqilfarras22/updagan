<template>
  <div>
    <b-row class="border-bottom header-row">
      <b-col><a @click.prevent="back" class="backButton" href=""><i class="fa fa-caret-left fa-lg"></i>&nbsp; Back to history</a></b-col>
      <b-col class="text-right"><i class="square"></i>&nbsp; <span class="info">Edited fields</span></b-col>
    </b-row>
    <div>
      <b-card-group v-if="!edcFormVersionData.isUnSchedule" class="pb-15">
        <b-card no-body class="border-0" :header="edcFormVersionData.name">
          <div v-if="edcFormVersionData.primaryReason" class="reason">
            Reason for change: {{ edcFormVersionData.primaryReason }}
          </div>
          <SubmittedFormPreview v-if="edcFormVersionData.fields" :isHistory="true" :formData="edcFormVersionData.fields" />
        </b-card>
      </b-card-group>
    </div>
    <div v-if="edcFormVersionData.isUnSchedule && edcFormVersionData.fields">
      <b-card-group v-for="(unscheduleAnswers, index) in edcFormVersionData.fields" :key="index" :class="{'border-top': index!=0 ,'pb-15' : index+1 === edcFormVersionData.fields.length, 'pb-5' : index+1 !== edcFormVersionData.fields.length}">
        <b-card no-body class="border-0" :header="unscheduleAnswers.formName">
          <div v-if="edcFormVersionData.primaryReason" class="reason">
            Reason for change: {{ edcFormVersionData.primaryReason }}
          </div>
          <SubmittedFormPreview v-if="unscheduleAnswers.formData" :isHistory="true" :formData="unscheduleAnswers.formData"/>
        </b-card>
      </b-card-group>
    </div>
  </div>
</template>

<script>
import SubmittedFormPreview from '@/components/edc-form/submitted-form-preview';

export default {
  name: 'form-history-version',
  components: { SubmittedFormPreview },
  props: {
    edcFormVersionData: Object,
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
.reason {
  font-family: "RobotoBold" !important;
  color: #666669;
  padding-left: 30px;
  padding-top: 19px;
}
</style>
