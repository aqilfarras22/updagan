<template>
  <div class="pt-10">
    <span :class="{'query-icon':isEdited}"></span>
    <b-row>
      <b-col :class="componentData.isEditedVersion?'col-6':'col-10'" class="pl-30">
        <span class="changed" v-if="componentData.isEditedVersion"></span>
        <div class="mb-4">{{componentData.sequence}}. {{componentData.question}}</div>
        <div class="answers ml-15">
          <b-row>
            <b-col v-for="(answer, index) in componentData.answerText" :key="index" class="pl-0 pr-0" v-bind:class="{'col-4' : (componentData.noOfColumns == 3), 'col-6': (componentData.noOfColumns == 2), 'col-12': (componentData.noOfColumns == 1)}">
              <b-row>

                <b-col align-self="center" class="pl-0 pt-5 pb-5">
                  <div class="text-align" v-if="!answer.comment">
                    <span class="mr-10">{{answer.answerText}}</span>
                    <span v-if="answer.colorCoding && answer.colorCoding.warningMessage" :style="[ answer.colorCoding.color !== '#ffffff' ? {'background-color': answer.colorCoding.color,'color':'#ffffff'} : {'color':'#000000','padding-left':'0px!important'} ]" class="pt-5 pb-5 pl-10 pr-10 alert-div">{{answer.colorCoding.warningMessage}}</span>
                    <span v-if="answer.colorCoding && !answer.colorCoding.warningMessage" style="border-radius:50px;" :style="{ 'background-color': answer.colorCoding.color }" class="pt-2 pb-5 pl-15 pr-10"></span>
                  </div>
                  <span class="text-align" v-if="answer.comment">{{answer.answerText}} - {{answer.comment}}</span>
                </b-col>
              </b-row>
            </b-col>
          </b-row>
        </div>
      </b-col>
      <b-col v-if="componentData.isEditedVersion" class="col-6 previous-answer">
        <span class="previous-value-mark"></span>
        <div class="answers previous-value">Previous value</div>
        <div>
          <b-row>
            <b-col v-for="(answer, index) in componentData.previousAnswerText" :key="index" class="pl-0 pr-0" v-bind:class="{'col-4' : (componentData.noOfColumns == 3), 'col-6': (componentData.noOfColumns == 2), 'col-12': (componentData.noOfColumns == 1)}">
              <b-row>
                <b-col align-self="center" class="pl-0">
                  <span class="text-align" v-if="!answer.comment">{{answer.answerText}}</span>
                  <span class="text-align" v-if="answer.comment">{{answer.answerText}} - {{answer.comment}}</span>
                </b-col>
              </b-row>
            </b-col>
          </b-row>
        </div>
      </b-col>
    </b-row>
  </div>
</template>
<script>
export default {
  name: 'check-box-submitted-preview',
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
  top: 0px;
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
  margin-bottom: 8px;
  letter-spacing: 2.4px;
  margin-top: 3px;
}

.alert-div {
  border-radius:50px;
  display:inline-block;
}
</style>
