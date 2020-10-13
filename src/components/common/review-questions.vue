<template>
  <div class="row">
      <div class="" v-for='(question, index) in surveyQuestions' v-if="question.type !== 'SurveyCompletion'">
          <div class="row">
            <div class="col-md-12 p-0">
              <div class="question-section">
                <div v-if="question.type === 'SurveyInstruction' || question.type === 'GPSkin' || question.type === 'ImageCapture'" class="mb-20">
                  <div v-if="!question.templateImageUrl">
                    <div class="question_body survey_content mb-10" v-html="prepareQuestion(question.formattedTitle, index)"></div>
                    <div class="survey_heading fs-14" v-html="question.formattedInformation"></div>
                    <div v-if="question.imageUrl">
                      <img :src="question.imageUrl" alt="" class="wid300">
                    </div>
                  </div>
                  <div v-else>
                    <div class="row p-0">
                      <div class="col-sm-6 col-md-6 col-lg-6 p-0">
                        <div class="question_body survey_content mb-10" v-html="prepareQuestion(question.formattedTitle, index)"></div>
                        <div class="survey_heading fs-14" v-html="question.formattedInformation"></div>
                        <div v-if="question.imageUrl">
                          <img :src="question.imageUrl" alt="" class="wid300">
                        </div>
                      </div>
                      <div class="col-sm-6 col-md-6 col-lg-6">
                        <div class="question_body survey_content mb-10">Template image</div>
                        <div v-if="question.templateImageUrl">
                          <img :src="question.templateImageUrl" alt="" class="wid300">
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-else class="mb-20">
                <div class="question_body survey_content mb-10" v-html="prepareQuestion(question.formattedBody, index)"></div>
                <div class="" v-if="question.hasBodyImage">
                  <div class="" v-for="img in question.bodyImages">
                    <img :src="img.imageUrl" alt="" class="wid300">
                  </div>
                </div>
              <div class="answer-section">
                <div class="option-section" v-if="question.type.toLowerCase() === 'boolean'">
                  <div class="" v-for='option in question.options'>
                    <p class="radio-option">
                      <input type="radio" name="boolean_type" disabled class="checkbox_position">
                      <label v-html="option.formattedBody"></label>
                    </p>
                  </div>
                </div>
                <div class="option-section pt-20" v-if="question.type.toLowerCase() === 'numberscale'">
                  <ds-slider v-if="!question.verticalScale" ref="slider" :value="question.minValue" :piecewise="true" direction="horizontal"
                    class="horizontal-vue-slider pl-20 pt-20 pb-25" :min="question.minValue" :max="question.maxValue" :disabled="true"
                    :piecewiseLabel="true" :piecewiseStyle="piecewiseStyle"
                    :piecewiseActiveStyle="piecewiseActiveStyle" :labelActiveStyle="labelActiveStyle"></ds-slider>
                  <ds-slider v-if="question.verticalScale" ref="slider" :value="question.minValue" :piecewise="true" direction="vertical"
                    class="vertical-vue-slider pl-20" width="2" :min="question.minValue" :max="question.maxValue" :disabled="true"
                    :piecewiseLabel="true" :piecewiseStyle="piecewiseStyle"
                    :piecewiseActiveStyle="piecewiseActiveStyle" :labelActiveStyle="labelActiveStyle"></ds-slider>
                </div>
                <div class="option-section pt-20" v-if="question.type.toLowerCase() === 'customscale'">
                  <ds-slider v-if="!question.verticalScale" ref="slider" :value="question.formattedLabels[0]" :piecewise="true" width="1" direction="horizontal"
                    class="horizontal-vue-slider pl-20 pt-20 pb-25" :data="question.formattedLabels" :disabled="true"
                    :piecewiseLabel="true" :piecewiseStyle="piecewiseStyle"
                    :piecewiseActiveStyle="piecewiseActiveStyle" :labelActiveStyle="labelActiveStyle"></ds-slider>
                  <ds-slider v-if="question.verticalScale" ref="slider" :value="question.formattedLabels[0]" :piecewise="true" width="2" direction="vertical"
                    class="vertical-vue-slider pl-20" :data="question.formattedLabels" :disabled="true"
                    :piecewiseLabel="true" :piecewiseStyle="piecewiseStyle"
                    :piecewiseActiveStyle="piecewiseActiveStyle" :labelActiveStyle="labelActiveStyle"></ds-slider>
                </div>
                <div class="option-section text-input" v-if="question.type.toLowerCase() === 'text'">
                  <input type="text" class="input-text readonly" placeholder="" readonly />
                </div>
                <div class="option-section" v-if="question.type.toLowerCase() === 'datetime'">
                  <div class="col-sm-3 p-0" v-if="question.showDate">
                    <input type="text" class="input-text readonly" placeholder="" v-model="question.dateFormat" readonly>
                  </div>
                  <div class="col-sm-3" v-if="question.showTime" :class="{'pl-10':(question.showDate)}">
                    <span v-if="question.timeFormat == '12'">
                    <input type="text" class="input-text readonly" placeholder="" value="--:-- AM" readonly>
                  </span>
                    <span v-if="question.timeFormat == '24'">
                    <input type="text" class="input-text readonly" placeholder="" value="--:--" readonly >
                  </span>
                  </div>
                </div>
                <div class="option-section" v-if="question.type.toLowerCase() === 'number'">
                  <div class="text-input">
                    <input type="text" class="input-text readonly" placeholder="" readonly>
                  </div>
                </div>
                <div class="option-section" v-if="question.type.toLowerCase() === 'valuepicker'">
                  <div class="">
                    <input type="number" class="input-text readonly" placeholder="" readonly>
                  </div>
                </div>
                <div class="option-section" v-if="question.type.toLowerCase() === 'email'">
                  <div class="">
                    <input type="email" class="input-text readonly" placeholder="" readonly>
                  </div>
                </div>
                <div class="option-section" v-if="question.type.toLowerCase() === 'location'">
                  <div class="">
                    <input type="text" class="input-text readonly" placeholder="" readonly>
                  </div>
                </div>
                <div class="option-section" v-if="question.type.toLowerCase() === 'multichoice'">
                  <div v-if="question.subType.toLowerCase() === 'multi'">
                    <div class="" v-for='option in question.options'>
                    <div v-if="option.enabled">
                    <label>
                      <input type="checkbox" class="checkbox_position" disabled>
                      <span class="display-inline" v-html="option.formattedBody"></span>
                    </label>
                      <div class="" v-if="option.imageUrl">
                        <img :src="option.imageUrl" alt="">
                      </div>
                      </div>
                    </div>
                  </div>
                  <div v-if="question.subType.toLowerCase() === 'single'">
                    <div class="" v-for='option in question.options'>
                      <div v-if="option.enabled">
                      <label>
                        <input type="radio" name="single" disabled class="checkbox_position">
                        <span class="display-inline" v-html="option.formattedBody"></span>
                      </label>
                      <div class="" v-if="option.imageUrl">
                        <img :src="option.imageUrl" alt="" class="">
                      </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="option-section lang-img-options" v-if="question.type.toLowerCase() === 'image'">
                  <div>                                  
                    <div class="row justify-content-start">
                      <div class="col-auto pl-0 pr-0" v-for="(langOptionobj, loopIndex) in question.languageImageOptions" :key="loopIndex">
                        <div class="language-name">{{langOptionobj.languageName}}</div>
                        <div class="form-group clearfix" v-for="(option, optionIndex) in langOptionobj.options" ::key="optionIndex">
                          <div v-if="option.enabled">
                          <span v-if="question.subType.toLowerCase() === 'multi'">
                            <input type="checkbox" id="checkbox" disabled class="checkbox_position">
                          </span>
                          <span v-else>
                            <input type="radio" id="radio" disabled class="checkbox_position">
                          </span>
                          <img class="col-lg-2 img-size" :src="option.imageUrl">
                        </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
              </div>
            </div>
        </div>
      
    </div>
  </div>
</template>

<script>
// import toastr from 'toastr';
// import _ from 'lodash';
// import swal from 'sweetalert2';
import dsSlider from '../../lib/ds-slider-component';

export default {
  name: 'qaCard',
  data() {
    return {
      selectedQuestion: { id: null },
      selectedQuestionForBranching: { id: null },
      studyId: null,
      surveyId: null,
      hideEditBtn: false,
      surveyQuestions: [],
      piecewiseActiveStyle: {
        backgroundColor: '#3498db',
      },
      labelActiveStyle: {
        color: '#3498db',
      },
      piecewiseStyle: {
        backgroundColor: '#ccc',
        visibility: 'visible',
        width: '12px',
        height: '12px',
      },
    };
  },
  // props: ['instructions'],
  components: { dsSlider },
  mounted() {
    this.studyId = this.$route.params.studyId;
    this.surveyId = this.$route.params.surveyId;
  },
  computed: {

    questions() {
      return this.$store.getters.getSurveyQuestionsData;
    }
  },
  methods: {
    prepareQuestion(q, i) {
      return ++i + '. <span style="display: inline-block">' + q + '</span>';
    }
  },
  watch: {
    questions: {
      handler(val) {
        this.surveyQuestions = val;
      },
    },
  },
};
</script>

<style scoped lang="scss">
h1,
h2,
h3 {
  font-weight: 200;
}
.wid300 {
  max-width: 120px;
  max-height: 120px;
}
.img-style {
  padding-top: 20px;
  height: 300px;
  width: 500px;
  padding-bottom: 20px;
}

// .question_body {
//   word-break: break-all;
//   color: #959fa4;
// }
.display-inline {
  display: inline-block;
  padding-left: 5px;
}
/deep/ .vue-slider-component .vue-slider-tooltip {
  display: none;
}
.read_only_question {
  border-left: 8px solid #d3dfe4 !important;
  background-color: #f5f8fa;
}

.icon-style {
  color: #57dd7a;
  font-size: 25px;
  padding-top: 20px;
  background-color: #d6f0de;
  padding: 7px;
  padding-bottom: 3px;
  border-radius: 25px;
}

.font-style {
  color: #57dd7a;
  font-size: 16px;
  padding-top: 10px;
  padding-bottom: 30px;
}

// Style for quick fixes bootstrap after migration (before redesign should be removed)

.option-section {
  &:after {
    content: '';
    clear: both;
    display: block;
  }
  .col-sm-3 {
    float: left;
  }
}

// END of style for quick fixes bootstrap after migration (before redesign should be removed)

h1,
h2,
h3 {
  font-weight: 200;
}

.img-style {
  padding-top: 20px;
  height: 300px;
  width: 500px;
  padding-bottom: 20px;
}

.question_body {
  word-break: break-all;
  color: #959fa4;
}

.read_only_question {
  border-left: 8px solid #d3dfe4 !important;
  background-color: #f5f8fa;
}

.icon-style {
  color: #57dd7a;
  font-size: 25px;
  padding-top: 20px;
  background-color: #d6f0de;
  padding: 7px;
  padding-bottom: 3px;
  border-radius: 25px;
}

.font-style {
  color: #57dd7a;
  font-size: 16px;
  padding-top: 10px;
  padding-bottom: 30px;
}

.text-style {
  color: #969090;
  text-align: right;
}

.btn-style {
  margin-top: 10px;
  width: 80px;
  height: 29px;
  margin-bottom: 50px;
}

.custom-btn {
  background: #00baf9;
  color: #fff;
  width: 220px;
}

.pad-top50 {
  padding-top: 50px;
}

.form-control {
  border-radius: 2px;
}

.custom-para {
  padding-bottom: 20px;
  font-size: 20px;
}

.mar-bot20 {
  margin-bottom: 20px;
}

.error-style {
  font-size: 12px;
  color: #ff4848;
  padding-bottom: 5px;
}
.readonly {
  background: #f7f7f7;
}
.btn-disabled {
  color: white;
  background-color: #c6c2c2;
  border: #c6c2c2;
}

.text-color {
  color: #888;
}

.survey-name {
  color: #00baf9;
  font-size: 20px;
}

.pad-left50 {
  padding-left: 50px;
}
.branching_section {
  background-color: #f5f8fa;
  border: solid 1px #d3dfe4;
  padding: 5px 10px;
  .branching_image {
    max-width: 120px;
    max-height: 120px;
    width: 100%;
    border: 1px solid #ccc;
  }
}
.custom-btn-bg {
  background: linear-gradient(to left, #4b6fe6, #00baf9);
  color: #fff;
}

.mar-bot20 {
  margin-bottom: 20px;
}

.pad-left100 {
  padding-left: 100px;
}

.mar-bot0 {
  margin-bottom: 0px !important;
}

.card {
  border: 1px solid rgba(0, 0, 0, 0.125);
  padding: 15px;
  margin-bottom: 16px;
}

.question_color,
input {
  color: #666769;
  font-size: 14px;
}

.radio-option {
  margin: 0px;
  label {
    padding-left: 5px;
  }
}

.input-text {
  width: 100%;
  border-radius: 2px;
  outline: none;
  border: 1px solid #ccc;
  height: 35px;
  text-indent: 10px;
}

.date-input {
  border-radius: 20px;
  outline: none;
  border: 1px solid #ccc;
  height: 35px;
  text-indent: 10px;
}

.pad-top20 {
  padding-top: 20px;
}

.vertical-vue-slider {
  height: 300px !important;
  width: 4px;
  padding: 11px;
  margin-left: 30px;
}

.horizontal-vue-slider {
  height: 8px;
  width: 100%;
}

.img-size {
  width: 100%;
  height: auto;
  float: none;
  max-width: 120px;
  max-height: 120px;
  padding-left: 5px;
}

label {
  font-weight: normal !important;
  word-break: break-all;
  color: #959fa4;
}

.modal-dialog {
  width: 500px !important;
}

.survey_content {
  color: #666669;
  font-size: 14px;
  font-weight: bold;
  word-break: break-all;
}

.survey_heading {
  color: #959fa4;
  font-size: 12px;
}

.checkbox_position {
  position: relative;
  top: 2px;
}

.text-input {
  width:48%;
}

.lang-img-options .col-auto{
  margin-right: 137px !important;
}
.lang-img-options .col-auto:last-of-type{
  margin-right:0 !important;
}
.language-name{
  color: #666669;
}
</style>
