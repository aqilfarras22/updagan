<template>
  <div class="pt-10">
    <span :class="{'query-icon':isEdited}"></span>
    <b-row>
      <b-col :class="componentData.isEditedVersion?'col-6':'col-10'" class="pl-30">
        <span class="changed" v-if="componentData.isEditedVersion"></span>
        <div class="mb-6">{{componentData.sequence}}. {{componentData.question}}</div>
        <div class="answers ml-15">{{componentData.answerText}}</div>
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
  name: 'drop-down-submitted-preview',
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
</style>
