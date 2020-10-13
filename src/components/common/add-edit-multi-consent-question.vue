<template>
  <div class="add_edit_question_card">
    <div class="p-0">
      <div class="row">
        <div class="col-lg-3 col-md-4 col-sm-12 col-xs-12 p-0">
          <select class="form-control type_select" v-model="addEditQuestion.type" v-on:change="questionTypeChanged(addEditQuestion)">
            <option v-for="questionType in questionTypes" :value="questionType.value"
            :disabled="questionType.value === 'Default'" :selected="questionType.value === 'Default'">{{questionType.label}}</option>
          </select>
        </div>
      </div>
      <div class="" v-if="addEditQuestion.type !== 'Default'">
        <div class="options_section">
          <!--MultiChoice type question START-->
          <div v-if="addEditQuestion.type && addEditQuestion.type.toLowerCase() === 'multichoice'" class="multi_choice_type">
            <div class="">
              <label class="">
                <input type="checkbox" v-model="addEditQuestion.multipleSelection" name="multipleSelection"/>
                <span class="">Allow users to select more than one answer</span>
              </label>
            </div>
            <div class="">
              <label class="">
                <input type="checkbox" v-model="addEditQuestion.hasBodyImage" name="hasBodyImage"/>
                <span class="">Include an image in the question</span>
              </label>
            </div>
          </div>
          <!--MultiChoice type question END-->

          <!--Image type question START-->
          <div v-if="addEditQuestion.type === 'Image'" class="multi_choice_type">
            <div class="">
              <label class="">
                <input type="checkbox" v-model="addEditQuestion.multipleSelection" name="multipleSelection"/>
                <span class="">Allow users to select more than one answer</span>
              </label>
            </div>
          </div>
          <!--Image type question END

        <!--Boolean type question START-->
          <div v-if="addEditQuestion.type && addEditQuestion.type.toLowerCase() === 'boolean'" class="boolean_choice_type"></div>
          <!--Boolean type question START-->

          <!--Number Scale type question START-->
          <div v-if="addEditQuestion.type && addEditQuestion.type.toLowerCase() === 'numberscale'" class="scale_choice_type">
            <div class="">
              <label class="fw-normal">
                <input type="checkbox" v-model="addEditQuestion.verticalScale" name="verticalScale"/>
                <span class="">Vertical scale (scale is horizonal by default)</span>
              </label>
            </div>
            <!--<div class="">
              <label class="fw-normal">
                <input type="checkbox" v-model="addEditQuestion.reportable" name="reportable"/>
                <span class="">Display data as a dashboard for participants </span>
              </label>
            </div>-->
          </div>
          <!--Number Scale type question END-->

          <!--Custom Scale type question START-->
          <div v-if="addEditQuestion.type && addEditQuestion.type.toLowerCase() === 'customscale'" class="scale_choice_type">
            <div class="">
              <label class="fw-normal">
                <input type="checkbox" v-model="addEditQuestion.verticalScale" name="verticalScale"/>
                <span class="">Vertical scale (scale is horizonal by default)</span>
              </label>
            </div>
            <!--<div class="">
              <label class="fw-normal">
                <input type="checkbox" v-model="addEditQuestion.reportable" name="reportable"/>
                <span class="">Display data as a dashboard for participants (Due to limited space in dashboards, consider shorter labels names if selected)</span>
              </label>
            </div>-->
          </div>
          <!--Custom Scale type question END-->

          <!--Text type question START-->
          <div v-if="addEditQuestion.type && addEditQuestion.type.toLowerCase() == 'text'" class="text_choice_type">
            <label class="fw-normal">
              <input type="checkbox" v-model="addEditQuestion.characterLimited" name="characterLimited"/>
              <span class="position_relative">Character limit <input type="number" class="form-control form-control-sm input-style limit_text_input" v-model="addEditQuestion.textLimit" placeholder="" min="1" max="2048" :disabled="!addEditQuestion.characterLimited"></span>
            </label>
          </div>
          <!--Text type question END-->

          <!--Number type question START-->
          <div v-if="addEditQuestion.type && addEditQuestion.type.toLowerCase() === 'number'" class="number_choice_type">
            <!--<label class="fw-normal display-block">
              <input type="checkbox" v-model="addEditQuestion.characterLimited" name="characterLimited"/>
              <span class="position_relative">Character limit <input type="number" class="form-control form-control-sm input-style limit_text_input" v-model="addEditQuestion.textLimit" placeholder="" min="1" max="2048" :disabled="!addEditQuestion.characterLimited"></span>
            </label>-->
            <label class="fw-normal display-block">
              <input type="checkbox" v-model="addEditQuestion.hasUnits" name="hasUnits"/>
              <span class="position_relative">Answer label <input type="text" class="form-control form-control-sm input-style limit_text_input answer_label_text_input" placeholder="ex. mins, lbs, days" v-model="addEditQuestion.units" :disabled="!addEditQuestion.hasUnits"></span>
            </label>
            <label class="fw-normal display-block">
              <input type="checkbox" v-model="addEditQuestion.hasMinMax" name="subType"/>
              <span class="position_relative">Min/max value
                <input type="number" class="form-control form-control-sm input-style limit_text_input min_value_input" v-model="addEditQuestion.minValue" placeholder="min" min="1" max="2048" :disabled="!addEditQuestion.hasMinMax">
                <span class="min_max_to_text">to</span>
                <input type="number" class="form-control form-control-sm input-style limit_text_input max_value_input" v-model="addEditQuestion.maxValue" placeholder="max" min="1" max="2048" :disabled="!addEditQuestion.hasMinMax">
              </span>
            </label>
            <label class="fw-normal display-block">
              <input type="checkbox" v-model="addEditQuestion.allowDecimals" value="Single" name="subType"/>
              <span class="position_relative">Allow decimals</span>
            </label>
          </div>
          <!--Number type question END-->

          <!--DateTime type question START-->
          <div v-if="addEditQuestion.type && addEditQuestion.type.toLowerCase() === 'datetime'" class="date_time_type">
            <div class="radio radio-style m-0">
              <label class="pl-0"><input type="checkbox" v-model="addEditQuestion.showDate"> Date</label>
              <label class=""><input type="radio" v-model="addEditQuestion.dateFormat" value="mm/dd/yy" :disabled="!addEditQuestion.showDate" v-on:click="dateFormatModified(addEditQuestion.dateFormat)"> mm/dd/yy</label>
              <label class=""><input type="radio" v-model="addEditQuestion.dateFormat" value="dd/mm/yy" :disabled="!addEditQuestion.showDate" v-on:click="dateFormatModified(addEditQuestion.dateFormat)"> dd/mm/yy</label>
              <!--<label class=""><input type="radio" v-model="addEditQuestion.dateFormat" value="yy/mm/dd" :disabled="!addEditQuestion.showDate"> yy/mm/dd</label>-->
            </div>
            <div class="radio radio-style m-0">
              <label class="pl-0"><input type="checkbox" v-model="addEditQuestion.showTime"> Time</label>
              <label class=""><input type="radio" v-model="addEditQuestion.timeFormat" value="12" :disabled="!addEditQuestion.showTime" v-on:click="timeFormatModified(addEditQuestion.timeFormat)"> AM/PM</label>
              <label class=""><input type="radio" v-model="addEditQuestion.timeFormat" value="24" :disabled="!addEditQuestion.showTime" v-on:click="timeFormatModified(addEditQuestion.timeFormat)"> 24 HR</label>
            </div>
          </div>
          <!--DateTime type question END-->
          <label class="fw-normal">
            <input type="checkbox" v-model="addEditQuestion.isSkippable">
            <span class="">Participant is allowed to skip this question</span>
          </label>
        </div>
      </div>
    </div>
    <div class="pt-10 pb-10 clearfix" v-if="addEditQuestion.type">
      <h5>Question {{addEditQuestion.questionNumber}}:</h5>
      <div><input type="text" class="form-control" placeholder="Enter your question" v-model="addEditQuestion.body" :disabled="addEditQuestion.type === 'Default'"></div>
      <div v-if="addEditQuestion.hasBodyImage" class="" v-for="bodyImageoption in addEditQuestion.bodyImages">
        <div class="col-lg-2 pl-0 pr-20" v-if="addEditQuestion.bodyImages.length==!0">
          <img class="img_size mar-top15" :src="bodyImageoption.imageUrl" />
        </div>
        <div class="col-lg-3 col-md-3 file_container">
          <span class="file_container_text upload_btn">Upload</span>
          <input type="file" :id="'file_upload_' + bodyImageoption.sequence" class="form-control-file" @change="uploadBodyImage($event, bodyImageoption, 'file_upload_' + bodyImageoption.sequence);return false;">
          <a class="color_red cursor_pointer fs-12 pt-10" v-if="addEditQuestion.bodyImages.length!==0" v-on:click="deleteImageBodyQuestion(bodyImageoption)">Remove</a>
          <span class="" v-if="addEditQuestion.bodyImages.length==0">Large images will automatically resize to fit the width of the phone</span>
        </div>
      </div>
    </div>

    <!--MultiChoice type question START-->
    <div v-if="addEditQuestion.type && addEditQuestion.type.toLowerCase() === 'multichoice'" class="">
      <h5>Answer choices</h5>
      <!--<div class="form-group" v-for="option in addEditQuestion.options">
        <div class="">
          <input type="text" class="form-control input-style" placeholder="Enter an answer choice" v-model="option.body">
        </div>
      </div>-->
      <div class="row form-group" v-for="(option, index) in addEditQuestion.options">
        <div class="col-sm-10 p-0">
          <input type="text" class="form-control input-style" placeholder="Enter an answer choice" v-model="option.body">
        </div>
        <div class="col-sm-2 p-0">
          <button class="btn btn-link color_red" v-on:click="deleteQuestionOptionItem(addEditQuestion.options, index)" v-if="index > 1">Remove</button>
        </div>
      </div>
      <div class="add_another_answer"><a v-on:click="addAnotherAnswer()">Add another answer</a></div>
    </div>
    <!--MultiChoice type question END-->

    <!--Image type question END-->
    <div v-if="addEditQuestion.type && addEditQuestion.type.toLowerCase() === 'image'" class="">
      <h5>Answer choices</h5>
      <div class="row form-group" v-for="option in addEditQuestion.options">
        <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12 p-0">
          <div class="col-lg-2 pl-0 pr-20" v-if="option.imageUrl">
            <img class="img_size" :src="option.imageUrl" />
          </div>
          <div class="col-lg-4 col-md-4 file_container">
            <span class="file_container_text">Upload Image</span>
            <input type="file" class="form-control-file" :id="'file_upload_' + option.sequence" @change="uploadOptionImage($event, option, 'file_upload_' + option.sequence);return false;">
            <a class="color_red cursor_pointer fs-12 pt-10" v-if="option.imageId" v-on:click="deleteQuestionOption(option)">Delete</a>
          </div>
          <div class="col-lg-6 col-md-6 text-style">Upload a photo answer choice</div>
        </div>
      </div>
      <div class="add_another_answer"><a v-on:click="addAnotherAnswer()">Add another answer</a></div>
    </div>
    <!--Image type question END-->

    <!--Boolean type question START-->
    <div v-if="addEditQuestion.type && addEditQuestion.type.toLowerCase() === 'boolean'" class="">
      <h5>Answer choices</h5>
      <div class="pt-20">
        <div class="form-group p-0">
          <div class="">{{addEditQuestion.options[0].body}}</div>
        </div>
        <div class="form-group padding-top">
          <div class="p-0">{{addEditQuestion.options[1].body}}</div>
        </div>
      </div>
    </div>
    <!--Boolean type question END-->

    <!--Number Scale type question START-->
    <div v-if="addEditQuestion.type && addEditQuestion.type.toLowerCase() == 'numberscale'">
      <h5>Scale labels</h5>
      <div class="row form-group pt-10">
        <div class="col-lg-1 col-md-2 col-sm-2 col-xs-2 pl-0">
          <span v-if="addEditQuestion.verticalScale">Bottom</span>
          <span v-if="!addEditQuestion.verticalScale">Left</span>

        </div>
        <div class="col-lg-11 col-md-10 col-sm-10 col-xs-10 p-0">
          <input type="number" class="form-control input-style" placeholder="Enter an answer choice" min="1" max="14" v-model="addEditQuestion.minValue">
        </div>
      </div>
      <div class="row form-group pt-10">
        <div class="col-lg-1 col-md-2 col-sm-2 col-xs-2 pl-0">
          <span v-if="addEditQuestion.verticalScale">Top</span>
          <span v-if="!addEditQuestion.verticalScale">Right</span>
        </div>
        <div class="col-lg-11 col-md-10 col-sm-10 col-xs-10 p-0">
          <input type="number" class="form-control input-style" placeholder="Enter an answer choice" min="1" max="14" v-model="addEditQuestion.maxValue">
        </div>
      </div>
      <div class="col-lg-offset-1 col-md-offset-2 col-sm-offset-2 col-xs-offset-2">
        <label class="fw-normal">
          <input type="checkbox" v-model="addEditQuestion.showMidValue" name="showMidValue"/>
          <span class="">Show middle value</span>
        </label>
      </div>
    </div>
    <!--Number Scale type question END-->

    <!--User Scale type question START-->
    <div v-if="addEditQuestion.type && addEditQuestion.type.toLowerCase() == 'customscale'">
      <h5>Scale labels</h5>
      <div class="row form-group">
        <div class="col-lg-1 pl-0 pt-5">Intervals</div>
        <div class="col-lg-1 p-0">
          <input type="number" class="form-control" min="2" max="8" v-model="addEditQuestion.intervals" v-on:change="changeLabelsLength(addEditQuestion.intervals)">
        </div>
        <span class="col-lg-8 pt-5" v-if="addEditQuestion.reportable">Max of 8 intervals can be entered when dashboard graph option is selected.</span>
      </div>
      <div v-if="addEditQuestion.intervals > 0">
        <div class="row form-group" v-for="(value, index) in addEditQuestion.labels">
          <div v-if="index === 0">
            <div class="col-lg-1 mt-5">
              <span v-if="addEditQuestion.verticalScale">Top</span>
              <span v-if="!addEditQuestion.verticalScale">Right</span>
            </div>
            <div class="col-lg-11 p-0">
              <input type="text" v-on:blur="validateLabels(addEditQuestion.labels.length - index - 1)" class="form-control input-style"
                placeholder="Enter value" v-model="addEditQuestion.labels[addEditQuestion.labels.length - index - 1]">
              <span v-if="validLabels.includes(addEditQuestion.labels.length - index - 1)" class="error-style">Labels cannot exceed 16 characters in length</span>
            </div>
          </div>
          <div v-else-if="addEditQuestion.labels && (index === addEditQuestion.labels.length - 1)">
            <div class="col-lg-1 mt-5">
              <span v-if="addEditQuestion.verticalScale">Bottom</span>
              <span v-if="!addEditQuestion.verticalScale">Left</span>
            </div>
            <div class="col-lg-11 p-0">
              <input type="text" name="vertical-labels" class="form-control input-style" placeholder="Enter value" v-on:blur="validateLabels(addEditQuestion.labels.length - index - 1)"
                v-model="addEditQuestion.labels[addEditQuestion.labels.length - index - 1]">
              <span v-if="validLabels.includes(addEditQuestion.labels.length - index - 1)" class="error-style">Labels cannot exceed 16 characters in length</span>
            </div>
          </div>
          <div v-if="addEditQuestion.labels && index !== 0 && (index !== addEditQuestion.labels.length - 1)">
            <div class="col-lg-1"></div>
            <div class="col-lg-11 p-0">
              <input type="text" class="form-control input-style" placeholder="Enter value" v-on:blur="validateLabels(addEditQuestion.labels.length - index - 1)"
                v-model="addEditQuestion.labels[addEditQuestion.labels.length - index - 1]" v-if="!addEditQuestion.reportable">
              <input type="text" class="form-control input-style" placeholder="Enter value" v-on:blur="validateLabels(addEditQuestion.labels.length - index - 1)"
                v-model="addEditQuestion.labels[addEditQuestion.labels.length - index - 1]" v-if="addEditQuestion.reportable">
              <span v-if="validLabels.includes(addEditQuestion.labels.length - index - 1)" class="error-style">Labels cannot exceed 16 characters in length</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--User Scale type question END-->

    <!--DateTime type question END-->
    <div v-if="addEditQuestion.type && addEditQuestion.type.toLowerCase() === 'datetime'"></div>
    <!--DateTime type question END-->

    <div class="row pt-10">
      <div class="col-lg-4 p-0">
        <button class="btn btn-link color_red pl-0" v-on:click="deleteQuestion(addEditQuestion)" :disabled="addEditQuestion.type === 'Default'"
          v-if="addEditQuestion.id">Delete</button>
      </div>
      <div class="col-lg-offset-4 col-lg-4 text-right p-0" style="white-space:nowrap; float:right;">
        <button class="btn btn-link br-25" v-on:click="cancelQuestion()" :disabled="allQuestions && allQuestions.length === 0">Cancel</button>
        <button class="btn btn-success save_btn br-25" v-on:click="saveQuestion()" :disabled="addEditQuestion.type === 'Default'">Save</button>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import toastr from 'toastr';
import swal from 'sweetalert2';

export default {
  name: 'add-edit-questions',
  data() {
    return {
      surveyDetails: null,
      questionTypes: [
        { value: 'Default', label: '- Select a question type -' },
        { value: 'CustomScale', label: 'Custom scale' },
        { value: 'DateTime', label: 'Date / Time' },
        { value: 'Image', label: 'Image choice' },
        { value: 'MultiChoice', label: 'Multiple choice' },
        { value: 'Number', label: 'Number response' },
        { value: 'NumberScale', label: 'Number scale' },
        { value: 'Text', label: 'Text response' },
        { value: 'Boolean', label: 'Yes or No' },
        // { value: 'Email', label: 'Email' },
        // { value: 'Location', label: 'Location' },
      ],
      validLabels: [],
      addEditQuestion: this.options,
      allQuestions: null,
      bodyImages: [],
    };
  },
  props: ['options'],
  computed: {
    questionSaveUpdateChanged() {
      return this.$store.getters.getNewQuestion;
    },
    surveyDetailsChanged() {
      return this.$store.getters.getSurveyDetails;
    },
  },
  watch: {
    surveyDetailsChanged: {
      handler(val) {
        this.surveyDetails = val;
      },
    },
  },
  mounted() {
    this.studyId = this.$route.params.studyId;
    this.surveyId = this.$route.params.surveyId;
    this.surveyDetails = this.$store.getters.getSurveyDetails;
    this.allQuestions =
      this.surveyDetails && this.surveyDetails.questions ? this.surveyDetails.questions : []; // eslint-disable-line
    this.allQuestions = _.filter(this.allQuestions, o => o.type !== 'SurveyInstruction'); // eslint-disable-line
    if (this.addEditQuestion && this.addEditQuestion.options) {
      _.forEach(this.addEditQuestion.options, value => {
        if (!value.nextQuestion) {
          value.nextQuestion = null; // eslint-disable-line
        }
      });
    }
    this.questionTypeChanged(this.addEditQuestion);
    this.options.type = this.options.type ? this.options.type : 'Default';
  },
  methods: {
    validateLabels(index) {
      if (this.addEditQuestion.labels[index] && this.addEditQuestion.labels[index].length > 16) {
        //eslint-disable-line
        this.validLabels.push(index);
      } else {
        this.validLabels.forEach((item, vindex) => {
          if (item === index) {
            this.validLabels.splice(vindex, 1);
          }
        });
      }
    },
    changeLabelsLength(intervals) {
      this.addEditQuestion.labels.length = intervals;
      this.$forceUpdate();
    },
    deleteQuestionOptionItem(options, index) {
      this.addEditQuestion.options.splice(index, 1);
    },
    dateFormatModified(dateFormat) {
      if (dateFormat === 'dd/mm/yy') {
        this.addEditQuestion.timeFormat = '24';
      } else {
        this.addEditQuestion.timeFormat = '12';
      }
    },
    timeFormatModified(timeFormat) {
      if (timeFormat === '12') {
        this.addEditQuestion.dateFormat = 'mm/dd/yy';
      } else {
        this.addEditQuestion.dateFormat = 'dd/mm/yy';
      }
    },
    questionTypeChanged(addEditQuestion) {
      if (addEditQuestion.type) {
        const questionType = addEditQuestion.type.toLowerCase();
        switch (questionType) {
          case 'boolean':
            this.addEditQuestion.options[0].body = 'Yes';
            this.addEditQuestion.options[1].body = 'No';
            break;
          case 'multichoice':
            if (!this.addEditQuestion.options || this.addEditQuestion.options.length === 0) {
              this.addEditQuestion.options = [
                { body: null, sequence: 1, nextQuestion: null, imageUrl: null },
                { body: null, sequence: 2, nextQuestion: null, imageUrl: null },
              ];
            }
            this.addEditQuestion.options[0].body = this.addEditQuestion.options[0].body || '';
            this.addEditQuestion.options[1].body = this.addEditQuestion.options[1].body || '';
            break;
          case 'numberscale':
            this.addEditQuestion.minValue = this.addEditQuestion.minValue
              ? this.addEditQuestion.minValue
              : 1; // eslint-disable-line
            this.addEditQuestion.maxValue = this.addEditQuestion.maxValue
              ? this.addEditQuestion.maxValue
              : 8; // eslint-disable-line
            break;
          case 'customscale':
            if (!this.addEditQuestion.labels) {
              this.addEditQuestion.labels = [];
            }
            this.addEditQuestion.labels.length = this.addEditQuestion.labels.length || 5;
            break;
          case 'number':
            this.addEditQuestion.minValue = this.addEditQuestion.id
              ? this.addEditQuestion.minValue
              : ''; // eslint-disable-line
            this.addEditQuestion.maxValue = this.addEditQuestion.id
              ? this.addEditQuestion.maxValue
              : ''; // eslint-disable-line
            break;
          default:
            this.addEditQuestion.labels = [];
            this.addEditQuestion.maxValue = 8;
            break;
        }
      }
    },
    setMaxValueForSlider(intervals) {
      this.addEditQuestion.maxValue = intervals;
    },
    addAnotherAnswer() {
      if (!this.addEditQuestion.options) {
        this.addEditQuestion.options = [];
      }
      let maxSequence = Number(_.max(_.map(this.addEditQuestion.options, 'sequence')));
      if (!maxSequence) {
        maxSequence = this.addEditQuestion.options.length;
      }
      this.addEditQuestion.options.push({
        body: null,
        sequence: maxSequence + 1,
        nextQuestion: null,
        imageUrl: null,
      }); // eslint-disable-line
      this.$forceUpdate();
    },
    checkQuestionValidity(question) {
      let validQuestion = true;
      let scaleLabels = [];
      let numberScaleValidity = false;
      let customScaleValidity = false;
      switch (question.type) {
        case 'MultiChoice':
          _.forEach(question.options, value => {
            if (!value.body) {
              validQuestion = false;
            }
            const uniqueOptionsArr = _.uniqBy(question.options, 'body');
            if (uniqueOptionsArr.length < question.options.length) {
              validQuestion = false;
            }
          });
          return (
            validQuestion && (question.body && question.sequence && question.options.length > 1)
          ); // eslint-disable-line
        // break;
        case 'Image':
          if (!question.body || !question.sequence || question.options.length < 2) {
            validQuestion = false;
          }
          _.forEach(question.options, value => {
            if (!value.imageUrl) {
              validQuestion = false;
            }
          });
          return validQuestion;
        // break;
        case 'Boolean':
          _.forEach(question.options, value => {
            if (!value.body) {
              validQuestion = false;
            }
          });
          return (
            validQuestion && (question.body && question.sequence && question.options.length === 2)
          ); // eslint-disable-line
        // break;
        case 'NumberScale':
          question.minValue = Number(question.minValue); // eslint-disable-line
          question.maxValue = Number(question.maxValue); // eslint-disable-line
          numberScaleValidity =
            question.body &&
            question.sequence &&
            (question.minValue >= 1 &&
              question.minValue < question.maxValue &&
              question.maxValue >= 1 &&
              ((question.reportable && question.maxValue <= 10) ||
                (!question.reportable && question.maxValue <= 13)) &&
              question.minValue < question.maxValue); // eslint-disable-line
          return numberScaleValidity;
        // break;
        case 'CustomScale':
          question.intervals = Number(question.intervals); // eslint-disable-line
          scaleLabels = _.without(question.labels, '', null, undefined);
          customScaleValidity =
            question.body &&
            question.sequence &&
            (question.intervals > 1 && question.intervals <= 8) &&
            scaleLabels.length > 0 &&
            scaleLabels.length === Number(question.intervals) &&
            this.validLabels.length === 0 &&
            _.uniq(question.labels).length === question.labels.length; // eslint-disable-line
          return customScaleValidity;
        // break;
        case 'DateTime':
          return (
            question.body &&
            question.sequence &&
            (question.dateFormat || question.timeFormat) &&
            (question.showDate || question.showTime)
          ); // eslint-disable-line
        // break;
        case 'Text':
          return (
            (question.body && question.sequence && !question.characterLimited) ||
            (question.body &&
              question.sequence &&
              question.characterLimited &&
              question.textLimit &&
              question.textLimit > 0)
          ); // eslint-disable-line
        // break;
        case 'Number':
          if (!question.body || !question.sequence) {
            validQuestion = false;
          } else if (question.hasUnits && !question.units) {
            validQuestion = false;
          } else if (question.hasMinMax && (question.minValue < 0 || !question.maxValue)) {
            validQuestion = false;
          } else if (
            (question.minValue % 1 !== 0 || question.maxValue % 1 !== 0) &&
            !question.allowDecimals
          ) {
            //eslint-disable-line
            validQuestion = false;
          }
          return validQuestion;
        // break;
        // break;
        case 'Email':
          return question.body && question.sequence; // eslint-disable-line
        // break;
        case 'Location':
          return question.body && question.sequence; // eslint-disable-line
        // break;
        default:
          return false;
      }
    },
    saveQuestion() {
      const validQuestion = this.checkQuestionValidity(this.addEditQuestion);
      if (validQuestion) {
        this.$store.dispatch('addQuestionAction', this.addEditQuestion);
      } else {
        toastr.error(
          'Please configure all the required elements.',
        );
      }
    },
    cancelQuestion() {
      this.addEditQuestion = {};
      this.$store.dispatch('selectedQuestionAction', { id: null });
    },
    deleteQuestion() {
      swal({
        title: 'Are you sure you want to delete?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#b8c7ce',
        cancelButtonColor: '#f16559',
        confirmButtonText: 'Cancel',
        cancelButtonText: 'Delete',
      }).then(({ dismiss }) => {
        if (dismiss === 'cancel') {
          this.$store.dispatch('addQuestionAction', null);
          this.addEditQuestion.opType = 'delete';
          this.$store.dispatch('addQuestionAction', this.addEditQuestion);
        }
      });
    },
    deleteImageBodyQuestion(option) {
      this.$api
        .deleteOptionFact(this.studyId, this.surveyId, option) // eslint-disable-line
        .then(
          response => {
            window.console.log(response.body);
            const optionIndex = _.findIndex(this.addEditQuestion.bodyImages, [
              'sequence',
              option.sequence,
            ]);
            this.addEditQuestion.bodyImages.splice(optionIndex, 1, {
              sequence: 1,
              imageUrl: null,
              imageId: null,
            });
            toastr.success('Image deleted successfully.');
            window.$('#file_upload[type="file"]').val(null);
          },
          error => {
            this.errorMsg = error.body ? error.body.message : 'Error while deleting the option.';
            toastr.error(this.errorMsg);
          },
        );
    },
    uploadBodyImage(e, option, id) {
      const fd = new FormData();
      const input = window.document.getElementById(id);
      fd.append('image', input.files[0]);
      fd.append('sequence', option.sequence);
      const rand = Math.random()
        .toString(36)
        .substr(2, 10);
      fd.append('imageId', option.imageId ? option.imageId : `img_id_${rand}`);
      this.$api.imageQuestionFact(this.studyId, this.surveyId, fd).then(
        response => {
          window.console.log(response.body, this.addEditQuestion.bodyImages);
          // const optionIndex = Number(response.body.sequence) - 1;
          const optionIndex = _.findIndex(this.addEditQuestion.bodyImages, [
            'sequence',
            Number(response.body.sequence),
          ]);
          this.addEditQuestion.bodyImages[optionIndex].imageUrl = response.body.imageUrl;
          this.addEditQuestion.bodyImages[optionIndex].imageId = response.body.imageId;
          this.addEditQuestion.bodyImages[optionIndex].sequence = response.body.sequence; // eslint-disable-line
          toastr.success('Image uploaded successfully');
          window.$('#file_upload[type="file"]').val(null);
        },
        error => {
          this.errorMsg = error.body ? error.body.message : 'Error while uploading the image.';
          toastr.error(this.errorMsg);
        },
      );
    },
    uploadOptionImage(e, option, id) {
      const fd = new FormData();
      const input = window.document.getElementById(id);
      fd.append('image', input.files[0]);
      fd.append('sequence', option.sequence);
      const rand = Math.random()
        .toString(36)
        .substr(2, 10);
      fd.append('imageId', option.imageId ? option.imageId : `img_id_${rand}`);
      this.$api.imageUploadFact(this.studyId, this.surveyId, fd).then(
        response => {
          window.console.log(response.body, this.addEditQuestion.options);
          // const optionIndex = Number(response.body.sequence) - 1;
          const optionIndex = _.findIndex(this.addEditQuestion.options, [
            'sequence',
            Number(response.body.sequence),
          ]);
          this.addEditQuestion.options[optionIndex].imageUrl = response.body.imageUrl;
          this.addEditQuestion.options[optionIndex].imageId = response.body.imageId;
          this.addEditQuestion.options[optionIndex].sequence = response.body.sequence;
          toastr.success('Image uploaded successfully');
          window.$('#file_upload[type="file"]').val(null);
        },
        error => {
          this.errorMsg = error.body ? error.body.message : 'Error while uploading the image.';
          toastr.error(this.errorMsg);
        },
      );
    },
    deleteQuestionOption(option) {
      this.$api.deleteOptionFact(this.studyId, this.surveyId, option).then(
        response => {
          window.console.log(response.body);
          const optionIndex = _.findIndex(this.addEditQuestion.options, [
            'sequence',
            option.sequence,
          ]);
          this.addEditQuestion.options.splice(optionIndex, 1);
          toastr.success('Answer option deleted successfully.');
          window.$('#file_upload[type="file"]').val(null);
        },
        error => {
          this.errorMsg = error.body ? error.body.message : 'Error while deleting the option.';
          toastr.error(this.errorMsg);
        },
      );
    },
  },
};
</script>

<style scoped lang="scss">
// Style for quick fixes bootstrap after migration (before redesign should be removed)

body {
  color: #333;
}

.h2,
h2 {
  font-size: 30px;
  margin: 20px 0 10px;
}

.h3,
h3 {
  font-size: 24px;
  color: #333;
}

.h5,
h5 {
  font-size: 14px;
  margin: 10px 0;
}

.h6,
h6 {
  font-size: 12px;
  margin: 10px 0;
  color: #333;
}

.btn {
  font-size: 14px;
  cursor: pointer;
}

.col-xs-12 {
  width: 100%;
}

.col-xs-1,
.col-xs-2,
.col-xs-3,
.col-xs-4,
.col-xs-5,
.col-xs-6,
.col-xs-7,
.col-xs-8,
.col-xs-9,
.col-xs-10,
.col-xs-11,
.col-xs-12 {
  float: left;
  //flex: none;
  display: block;
}

.col-lg-1,
.col-lg-2,
.col-lg-3,
.col-lg-4,
.col-lg-5,
.col-lg-6,
.col-lg-7,
.col-lg-8,
.col-lg-9,
.col-lg-10,
.col-lg-11,
.col-lg-12,
.col-md-1,
.col-md-2,
.col-md-3,
.col-md-4,
.col-md-5,
.col-md-6,
.col-md-7,
.col-md-8,
.col-md-9,
.col-md-10,
.col-md-11,
.col-md-12,
.col-sm-1,
.col-sm-2,
.col-sm-3,
.col-sm-4,
.col-sm-5,
.col-sm-6,
.col-sm-7,
.col-sm-8,
.col-sm-9,
.col-sm-10,
.col-sm-11,
.col-sm-12,
.col-xs-1,
.col-xs-2,
.col-xs-3,
.col-xs-4,
.col-xs-5,
.col-xs-6,
.col-xs-7,
.col-xs-8,
.col-xs-9,
.col-xs-10,
.col-xs-11,
.col-xs-12 {
  position: relative;
  min-height: 1px;
  padding-right: 15px;
  padding-left: 15px;
}

.col-xs-10 {
  width: 83.33333333%;
}

.panel-default {
  border-color: #ddd;
}

.panel {
  margin-bottom: 20px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
}

.add_edit_question_card {
  background-color: #f5f8fa;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid #d3dfe4;
  padding: 16px;
}

.upload_btn {
  width: 80px !important;
  height: 30px !important;
}
.mar-top15 {
  margin-top: 15px !important;
}

.row {
  display: block;

  &:after {
    content: '';
    clear: both;
    display: block;
  }
}

.color_959fa4 {
  color: #959fa4 !important;
}

@media (min-width: 768px) {
  .col-sm-1,
  .col-sm-2,
  .col-sm-3,
  .col-sm-4,
  .col-sm-5,
  .col-sm-6,
  .col-sm-7,
  .col-sm-8,
  .col-sm-9,
  .col-sm-10,
  .col-sm-11,
  .col-sm-12 {
    float: left;
    display: block;
  }
  .col-sm-12 {
    width: 100%;
  }
  .col-sm-10 {
    width: 83.33333333%;
  }
  .col-sm-4 {
    width: 33.33333333%;
    max-width: 33.33333333%;
  }
  .col-md-2 {
    flex: none;
  }
}

@media (min-width: 992px) {
  .col-md-1,
  .col-md-2,
  .col-md-3,
  .col-md-4,
  .col-md-5,
  .col-md-6,
  .col-md-7,
  .col-md-8,
  .col-md-9,
  .col-md-10,
  .col-md-11,
  .col-md-12 {
    float: left;
    flex: none;
  }
  .col-md-2 {
    width: 16.66666667%;
  }
  .col-md-10 {
    width: 83.33333333%;
  }
  .col-md-12 {
    width: 100%;
  }
  .col-lg-offset-4 {
    margin-left: 33.33333333%;
  }
}

@media (min-width: 1200px) {
  .col-lg-1,
  .col-lg-2,
  .col-lg-3,
  .col-lg-4,
  .col-lg-5,
  .col-lg-6,
  .col-lg-7,
  .col-lg-8,
  .col-lg-9,
  .col-lg-10,
  .col-lg-11,
  .col-lg-12 {
    float: left;
    display: block;
  }
  .col-lg-2 {
    width: 16.66666667%;
  }
  .col-lg-10 {
    width: 82.33333333%;
  }
  .col-lg-11 {
    width: 91.66666667%;
  }
}

// END of style for quick fixes bootstrap after migration (before redesign should be removed)

.add_edit_question_card {
  background-color: #f5f8fa;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid #d3dfe4;
  padding: 16px;
  margin-bottom: 20px;
  display: block;
  .type_select {
    border-radius: 0 !important;
  }
  .options_section {
    background-color: #eaf0f4;
    border: solid 1px #e2e7ea;
    display: inline-block;
    width: 100%;
    border-radius: 2px;
    padding: 5px;
    margin: 10px 0 0;
  }
  .limit_text_input {
    position: absolute;
    top: -5px;
    left: 110px;
    width: 50px;
    height: 28px;
  }
  .answer_label_text_input {
    width: 150px;
  }
  .min_value_input {
  }
  .max_value_input {
    left: 200px;
    width: 60px;
  }
  .min_max_to_text {
    position: absolute;
    top: 0px;
    left: 175px;
  }
  .add_another_answer {
    padding-top: 10px;
    a {
      color: #34537d;
      cursor: pointer;
    }
  }
  label {
    font-weight: normal;
    margin-bottom: 10px;
  }
  .multi_choice_type {
    padding-top: 5px;
  }
  .boolean_choice_type {
  }
  .scale_choice_type {
    padding-top: 5px;
    .radio-style {
      margin: 0;
    }
  }
  .text_choice_type {
    padding-top: 5px;
  }
  .number_choice_type {
    padding-top: 5px;
  }
  .date_time_type {
    padding-top: 5px;
    label {
      min-width: 120px;
    }
  }
  .save_btn {
    width: 100px;
  }
  .branch_section {
    position: relative;
    top: -20px;
  }
  .form-control,
  .input-text {
    border-radius: 2px !important;
  }
  .file_container [type='file'] {
    cursor: inherit;
    display: block;
    font-size: 20px;
    filter: alpha(opacity=0);
    width: 200px;
    height: 40px;
    max-height: 50px;
    max-width: 300px;
    opacity: 0;
    position: absolute;
    right: 0;
    text-align: right;
    top: 15px;
    left: 0px;
  }
  .file_container {
    padding: 25px 10px 0 0;
    color: grey;
  }
  .file_container [type='file'] {
    cursor: pointer;
  }
  .file_container_text {
    background-color: #d3dfe4;
    padding: 5px;
    width: 100%;
    display: block;
    border-radius: 4px;
    text-align: center;
    color: #959fa4;
  }
  .error-style {
    font-size: 12px;
    color: #ff4848;
    padding-bottom: 5px;
    padding-left: 0;
  }
  .text-style {
    padding: 30px 0px 0 0;
    font-size: 12px;
    color: #959fa4;
  }
  .img_size {
    width: 100%;
    height: 100%;
    max-width: 120px;
    max-height: 120px;
    border: 1px solid #d3dfe4;
  }
  @media (max-width: 575px) {
    .col-sm-12 {
      padding: 0px;
    }
    .branch_section {
      padding-top: 25px;
    }
  }
  @media (min-width: 576px) and (max-width: 767px) {
    .col-sm-12 {
      padding: 0px;
    }
    .branch_section {
      padding-top: 25px;
    }
    .text-style {
      padding: 0 0 20px 0;
    }
  }
  @media (min-width: 768px) and (max-width: 991px) {
    .col-sm-12 {
      padding: 0px;
    }
    .branch_section {
      padding-top: 25px;
    }
    .text-style {
      padding: 0 0 20px 0;
    }
  }
  @media (min-width: 992px) and (max-width: 1199px) {
    .branch_section {
      padding-right: 0;
    }
  }
  @media (min-width: 1200px) {
    .branch_section {
      padding-right: 0;
    }
  }
}
</style>
