<template>
  <div class="pt-10">
    <span :class="{'query-icon':isEdited}"></span>
    <b-row>
      <b-col :class="componentData.isEditedVersion?'col-6':'col-10'" class="pl-30">
        <span class="changed" v-if="componentData.isEditedVersion"></span>
        <div class="mb-6">{{componentData.sequence}}. {{componentData.question}}</div>
        <div class="answers ml-15">
          <span class="mr-10">{{componentData.answerText}}</span>
          <span v-if="componentData.colorCoding && componentData.colorCoding.warningMessage" :style="[ componentData.colorCoding.color !== '#ffffff' ? {'background-color': componentData.colorCoding.color,'color':'#ffffff'} : {'color':'#000000'} ]" class="pt-5 pb-5 pl-10 pr-10 alert-div">{{componentData.colorCoding.warningMessage}}</span>
          <span v-if="componentData.colorCoding && !componentData.colorCoding.warningMessage" style="border-radius:50px;" :style="{ 'background-color': componentData.colorCoding.color }" class="pt-2 pb-5 pl-15 pr-10"></span>
          </div>
      </b-col>
      <b-col v-if="componentData.isEditedVersion" class="col-6 previous-answer">
        <span class="previous-value-mark"></span>
        <div class="answers previous-value">Previous value</div>
        <div>{{componentData.previousAnswerText}}</div>
      </b-col>
    </b-row>
  </div>
</template>
<script>
export default {
  name: 'single-choice-submitted-preview',
  props: ['componentData', 'isEdited'],
  data() {
    return {};
  },
  mounted() {},
  methods: {},
  computed: {},
};
</script>

<style scoped lang="scss">
.changed {
  position: absolute;
  left: 0;
  top: 0;
  width: 10px;
  height: 40px;
  border-radius: 1px;
  background-color: #ffa200;
}

.previous-value-mark{
  width: 3px;
  height: 40px;
  background-color: #ffa200;
  border-radius: 1px;
  left: 0;
  top: 4px;
  position: absolute;
}

.answers{
  font-weight: 600;
}

.previous-answer{
  opacity: 0.8;
}

.previous-value{
  color: #ffa200;
  opacity: 0.8;
  font-size: 10px;
  font-weight: bold;
  text-transform: uppercase;
  margin-bottom: 9px;
  letter-spacing: 2.4px;
  margin-top: 3px;
}

.alert-div {
  border-radius:50px;
  display:inline-block;
}
</style>
