<template>
  <div class="pt-10 pb-5 component-div" v-if="scaleData">
    <b-row>
      <b-col cols="12" class="pl-14" :class="{'pb-35': scaleData.horizontalScale }">
          <div :class="{'error-border': scaleError}"><b>{{scaleData.sequence}}. {{scaleData.body}}</b>
        <div class="pull-right icons-div">
        <div v-if="hideShowCopyAction" class="icon-div" @click="copyData()">
          <img src="static/img/duplicate.svg" />
        </div>
        </div>
        <span class="error-style" v-if="scaleData.required">*</span>
        </div>
      </b-col>
    </b-row>
    <b-row class="pl-15 pr-30" :class="{'pointerEventsNull': disableField}">
      <b-col cols="12" align-self="center">
        <b-row v-if="scaleData.horizontalScale">
          <b-col cols="11">
            <vue-slider ref="slider"
              direction="horizontal" class="horizontal-vue-slider" :clickable="false"
              :piecewise="true" width="1" :style="sliderOptions.style" :piecewiseLabel="true"
              :data="sliderOptions.data" :piecewiseStyle="sliderOptions.piecewiseStyle" 
              :piecewiseActiveStyle="sliderOptions.piecewiseActiveStyle" @drag-end="changeAnswer"
              :labelActiveStyle="sliderOptions.labelActiveStyle" @callback="emptyNonScaleAnswer"
              :disabled="(nonScaleAnswer && nonScaleAnswer.length > 0) || disableField"></vue-slider>
          </b-col>
          <b-col cols="1"><button class="btn btn-link" @click="clearSlider" v-if="scaleData.answer">Clear</button></b-col>
        </b-row>
        <b-row v-if="!scaleData.horizontalScale">
          <b-col cols="11">
            <vue-slider ref="slider" 
              :value="null" direction="vertical" class="vertical-vue-slider" :piecewise="true" width="6" 
              :style="sliderOptions.style" :piecewiseLabel="true" :data="sliderOptions.data" :clickable="false" @drag-end="changeAnswer"
              :piecewiseStyle="sliderOptions.piecewiseStyle" @drag-start="refresh" :piecewiseActiveStyle="sliderOptions.piecewiseActiveStyle" 
              :labelActiveStyle="sliderOptions.labelActiveStyle" @callback="emptyNonScaleAnswer" :disabled="(nonScaleAnswer && nonScaleAnswer.length > 0) || disableField"></vue-slider>
          </b-col>
          <b-col cols="1"><button class="btn btn-link" @click="clearSlider" v-if="scaleData.answer">Clear</button></b-col>
        </b-row>
        <b-col cols="12" v-for="(option,index) in choicesGiven" class="pl-0" :key="index">
          <div v-if="option.type == 'NA' || option.type == 'Other'" class="pb-8">
            <b-form-checkbox class="pl-0 position-absolute" v-model="nonScaleAnswer" :value="option.value" :unchecked-value="null" @change="checkForOtherOption">
            </b-form-checkbox>
            <span class="pl-20 text-align">{{option.text}}</span>
          </div>
        </b-col>
        <!-- <b-col cols="5" v-if="scaleData.answer === 'Other' && scaleData.options[scaleData.options.length-1].commentField">
          <b-form-textarea name="scaleComment" v-model="otherChoiceComment" v-validate="validationConstraints" class="fs-12" rows="3" autocomplete="off" :class="{'input': true, 'is-danger': errors.has('scaleComment') || errorFlag}" placeholder="Enter comments" v-on:keyup.native="validateRegEx" @click.native="validateRegEx">
          </b-form-textarea>
        </b-col> -->
      </b-col>
      <div v-if="scaleData && scaleData.options && nonScaleAnswer === scaleData.options[scaleData.options.length-1].label && scaleData.options[scaleData.options.length-1].commentField">
        <b-col cols="12" lg="12" class="pr-5">
          <textarea name="scaleComment" rows="4" v-model="otherChoiceComment" v-validate="validationConstraints" autocomplete="off" :class="{'input': true, 'is-danger': errors.has('scaleComment') || errorFlag}" placeholder="Enter comments" v-on:keyup="validateRegEx" @click="validateRegEx" class="fs-12 text-area"></textarea>
        </b-col>
        <b-col cols="7"></b-col>
        <b-col cols="12">
          <span v-if="(errors.has('scaleComment') || errorFlag) && !otherChoiceComment" class="pt-5 fs-12 error-style">{{scaleData.options[scaleData.options.length - 1].comment.errorMessage}}</span>
          <span v-if="(errors.has('scaleComment') || errorFlag) && otherChoiceComment && commentFieldErrorMsg" class="pt-8 fs-12 error-style">{{commentFieldErrorMsg}}</span>
        </b-col>
      </div>
    </b-row>
  </div>
</template>

<script>
import _ from 'lodash';
import { mapActions } from 'vuex';
import findIndex from 'lodash/findIndex';
import find from 'lodash/find';
import vueSlider from 'vue-slider-component';

import regExpUtil from '../../../utils/regExpUtil';

export default {
  name: 'scale-preview',
  props: ['componentData', 'formSubmitted', 'disableField', 'hideShowCopyAction'],
  components: {
    vueSlider,
  },
  data() {
    return {
      scaleError: false,
      scaleData: {},
      choicesGiven: [],
      initialValue: null,
      sliderData: [],
      sliderWeights: [],
      otherChoice: false,
      sliderOptions: {
        value: [],
        piecewiseStyle: {
          backgroundColor: '#ccc',
          visibility: 'visible',
          width: '12px',
          height: '12px',
        },
        style: {
          marginBottom: '5%',
          fontWeight: 'bold',
        },
        piecewiseActiveStyle: {
          backgroundColor: '#3498db',
        },
        labelActiveStyle: {
          color: '#3498db',
        },
      },
      otherChoiceComment: null,
      nonScaleAnswer: null,
      errorFlag: false,
      regExp: null,
      validationConstraints: {},
      commentFieldErrorMsg: null,
      dragStart: false,
    };
  },
  mounted() {
    this.scaleData = this.componentData;
    this.initMethod();
  },
  methods: {
    ...mapActions(['saveEDCFormErrors']),

    copyData() {
      event.stopPropagation();
      this.$emit('copyComponent', this.componentData);
    },
    // refresh scale
    refresh() {
      this.$nextTick(() => this.$refs.slider.refresh());
    },
    // mounted call
    initMethod() {
      // intialize the scale properties
      this.choicesGiven = [];
      this.sliderData = [];
      this.sliderWeights = [];
      // Fill the scale properties
      this.scaleData.options.forEach(option => {
        this.choicesGiven.push({
          value: option.label,
          text: option.label,
          weight: option.weight,
          selected: null,
          type: option.type,
        });
      });
      if (this.scaleData.answer && this.$refs.slider) {
        const selectedOpt = _.filter(this.scaleData.options, opt => opt.label === this.scaleData.answer); // eslint-disable-line
        this.$refs.slider.setIndex(selectedOpt[0].index);
      }
      if (this.scaleData.horizontalScale) {
        this.choicesGiven.forEach(choice => {
          if (choice.type.toLowerCase() === 'option') {
            this.sliderData.push(choice.value);
            this.sliderWeights.push(choice.weight);
          }
        });
      } else {
        for (let index = this.choicesGiven.length - 1; index >= 0; index--) {
          if (this.choicesGiven[index].type.toLowerCase() === 'option') {
            this.sliderData.push(this.choicesGiven[index].value);
            this.sliderWeights.push(this.choicesGiven[index].weight);
          }
        }
      }
      const iniVal = this.sliderData[0];
      this.initialValue = iniVal;
      this.sliderOptions.value = this.initialValue;
      this.sliderOptions.data = this.sliderData;
      this.nonScaleAnswer = this.scaleData.nonScaleAnswer || null;

      // check if the other option field comment field is enabled or not
      if (
        this.scaleData
        && this.scaleData.options[this.scaleData.options.length - 1].comment
      ) {
        if (this.scaleData.options[this.scaleData.options.length - 1].comment) {
          this.otherChoiceComment = this.scaleData.options[
            this.scaleData.options.length - 1
          ].comment.commentMessage;
        }
        // check if constraint rules are set
        if (this.scaleData.options[this.scaleData.options.length - 1].comment.constraint) {
          const constraints = this.scaleData.options[this.scaleData.options.length - 1]
            .comment.constraint;
          // check if the comment box has constraints for min, max chars
          if (constraints.lettersAllowed || constraints.specialCharactersAllowed) {
            if (constraints.minCharsFlag) {
              this.validationConstraints.min = constraints.minChars;
            }
            if (constraints.maxCharsFlag) {
              this.validationConstraints.max = constraints.maxChars;
            }
            this.validationConstraints.required = this.scaleData.options[
              this.scaleData.options.length - 1
            ].commentField;
          }
          // check if the comment box has constraints for min, max, decimal numbers
          if (
            !constraints.lettersAllowed
            && !constraints.specialCharactersAllowed
            && constraints.numbersAllowed
          ) {
            if (constraints.minLimitFlag) {
              this.validationConstraints.min_value = constraints.minLimit;
            }
            if (constraints.maxLimitFlag) {
              this.validationConstraints.max_value = constraints.maxLimit;
            }
            if (constraints.decimalLimitFlag) {
              this.validationConstraints.decimal = constraints.decimalLimit;
            }
            this.validationConstraints.required = this.scaleData.options[
              this.scaleData.options.length - 1
            ].commentField;
          }
          this.generateRegExp(
            constraints.lettersAllowed,
            constraints.numbersAllowed,
            constraints.specialCharactersAllowed,
          );
        }
      }
    },

    // generate regEx based on the comment field constraints
    generateRegExp(lettersAllowed, numbersAllowed, specialCharactersAllowed) {
      let letters = '';
      let numbers = '';
      let specialCharacters = '';
      letters = lettersAllowed ? 'L' : '';
      numbers = numbersAllowed ? 'N' : '';
      specialCharacters = specialCharactersAllowed ? 'S' : '';
      // get regular expressions based on the KeyName generated from comment field constraints
      const keyName = `${letters}${numbers}${specialCharacters}`;
      this.regExp = regExpUtil.commonValidations[keyName];
      if (
        !this.scaleData.options[this.scaleData.options.length - 1].comment.constraint
          .lettersAllowed
        && !this.scaleData.options[this.scaleData.options.length - 1].comment.constraint
          .specialCharactersAllowed
        && this.scaleData.options[this.scaleData.options.length - 1].comment.constraint
          .numbersAllowed
        && this.scaleData.options[this.scaleData.options.length - 1].comment.constraint
          .decimalLimitFlag
        && this.scaleData.options[this.scaleData.options.length - 1].comment.constraint
          .decimalLimit
      ) {
        this.regExp = '';
      }
    },

    changeAnswer(evt) {
      this.scaleError = false;
      this.dragStart = true;
      this.scaleData.answer = evt.val;
      this.$forceUpdate();
    },
    clearSlider() {
      this.scaleError = false;
      this.$refs.slider.setIndex(0);
      this.scaleData.answer = '';
      this.$forceUpdate();
    },
    // validate the regEx on key up in comment box
    validateRegEx() {
      if (this.scaleData.options[this.scaleData.options.length - 1].commentField &&
        (this.otherChoiceComment && this.otherChoiceComment.length > 0)) {
        const commentMsg = this.scaleData.options[this.scaleData.options.length - 1].comment
          .commentMessage;
        if (this.regExp) {
          this.errorFlag = !this.regExp.test(commentMsg);
        } else {
          this.errorFlag = false;
        }
        // validate all the vee validator features
        this.$validator.validateAll().then(noVeeValidateError => {
          // send the error status to update the VueStore
          this.updateVueStore(this.errorFlag || !noVeeValidateError);
          this.commentFieldErrorMsg = null;
          const constraints = this.scaleData.options[this.scaleData.options.length - 1]
            .comment.constraint;
          if (
            !constraints.lettersAllowed
            && !constraints.specialCharactersAllowed
            && constraints.numbersAllowed
          ) {
            const answerWithoutSpace = this.otherChoiceComment.replace(/\s/g,'');
            if (isNaN(answerWithoutSpace)) { // eslint-disable-line // eslint-disable-line
              // no-restricted-globals
              this.commentFieldErrorMsg = 'Only numbers are allowed.';
            } else if (
              constraints.minLimitFlag
              && !constraints.maxLimitFlag
              && !constraints.decimalLimitFlag
            ) {
              if (this.otherChoiceComment % 1 !== 0) {
                this.commentFieldErrorMsg = 'Invalid min and/or max value.';
              } else {
                this.commentFieldErrorMsg = `Please enter a number that is greater than ${
                  constraints.minLimit
                }.`;
              }
            } else if (
              !constraints.minLimitFlag
              && constraints.maxLimitFlag
              && !constraints.decimalLimitFlag
            ) {
              if (this.otherChoiceComment % 1 !== 0) {
                this.commentFieldErrorMsg = 'Invalid min and/or max value.';
              } else {
                this.commentFieldErrorMsg = `Please enter a number that is less than ${
                  constraints.maxLimit
                }.`;
              }
            } else if (
              !constraints.minLimitFlag
              && !constraints.maxLimitFlag
              && constraints.decimalLimitFlag
            ) {
              this.commentFieldErrorMsg = `Please enter a number that has decimal length of ${
                constraints.decimalLimit
              } or less.`;
            } else if (
              constraints.minLimitFlag
              && constraints.maxLimitFlag
              && !constraints.decimalLimitFlag
            ) {
              if (this.otherChoiceComment % 1 !== 0) {
                this.commentFieldErrorMsg = 'Invalid min and/or max value.';
              } else {
                this.commentFieldErrorMsg = `Please enter a number that is between ${
                  constraints.minLimit
                } (Min) and ${constraints.maxLimit} (Max).`;
              }
            } else if (
              constraints.minLimitFlag
              && !constraints.maxLimitFlag
              && constraints.decimalLimitFlag
            ) {
              this.commentFieldErrorMsg = `Please enter a number that is more than ${
                constraints.minLimit
              } and has decimal length of ${constraints.decimalLimit} or less.`;
            } else if (
              !constraints.minLimitFlag
              && constraints.maxLimitFlag
              && constraints.decimalLimitFlag
            ) {
              this.commentFieldErrorMsg = `Please enter a number that is less than ${
                constraints.maxLimit
              } and has decimal length of ${constraints.decimalLimit} or less.`;
            } else if (
              constraints.minLimitFlag
              && constraints.maxLimitFlag
              && constraints.decimalLimitFlag
            ) {
              this.commentFieldErrorMsg = `Please enter a number that is between ${
                constraints.minLimit
              } (Min) and ${constraints.maxLimit} (Max) and has decimal length of ${
                constraints.decimalLimit
              } or less.`;
            } else if (
              !constraints.minLimitFlag
              && !constraints.maxLimitFlag
              && !constraints.decimalLimitFlag
            ) {
              this.commentFieldErrorMsg = 'Decimals are not allowed.';
            } else {
              this.commentFieldErrorMsg = null;
            }
          } else if (
            constraints.lettersAllowed
            && !constraints.specialCharactersAllowed
            && !constraints.numbersAllowed
          ) {
            if (this.errorFlag) {
              this.commentFieldErrorMsg = 'Only letters are allowed.';
            } else {
              this.generateErrorMsg(constraints);
            }
          } else if (
            !constraints.lettersAllowed
            && constraints.specialCharactersAllowed
            && !constraints.numbersAllowed
          ) {
            if (this.errorFlag) {
              this.commentFieldErrorMsg = 'Only special characters are allowed.';
            } else {
              this.generateErrorMsg(constraints);
            }
          } else if (
            !constraints.lettersAllowed
            && constraints.specialCharactersAllowed
            && constraints.numbersAllowed
          ) {
            if (this.errorFlag) {
              this.commentFieldErrorMsg = 'Only numbers and special characters are allowed.';
            } else {
              this.generateErrorMsg(constraints);
            }
          } else if (
            constraints.lettersAllowed
            && !constraints.specialCharactersAllowed
            && constraints.numbersAllowed
          ) {
            if (this.errorFlag) {
              this.commentFieldErrorMsg = 'Only letters and numbers are allowed.';
            } else {
              this.generateErrorMsg(constraints);
            }
          } else if (
            constraints.lettersAllowed
            && constraints.specialCharactersAllowed
            && !constraints.numbersAllowed
          ) {
            if (this.errorFlag) {
              this.commentFieldErrorMsg = 'Only letters and special characters are allowed.';
            } else {
              this.generateErrorMsg(constraints);
            }
          } else if (
            constraints.lettersAllowed
            && constraints.specialCharactersAllowed
            && constraints.numbersAllowed
          ) {
            if (this.errorFlag) {
              this.commentFieldErrorMsg = 'Only letters, numbers and special characters are allowed.';
            } else {
              this.generateErrorMsg(constraints);
            }
          }
        });
      } else if (this.scaleData && this.scaleData.options && !this.otherChoiceComment &&
          this.nonScaleAnswer === this.scaleData.options[this.scaleData.options.length-1].label && 
          this.scaleData.options[this.scaleData.options.length-1].commentField)
        {
            this.errorFlag = true;
            this.updateVueStore(this.errorFlag);
        }
    },

    generateErrorMsg(constraints) {
      if (constraints.minCharsFlag && !constraints.maxCharsFlag) {
        this.commentFieldErrorMsg = `Must be over ${constraints.minChars} characters.`;
      } else if (!constraints.minCharsFlag && constraints.maxCharsFlag) {
        this.commentFieldErrorMsg = `Max number of characters ${constraints.maxChars} exceeded.`;
      } else if (constraints.minCharsFlag && constraints.maxCharsFlag) {
        this.commentFieldErrorMsg = `Please enter number of characters between ${
          constraints.minChars
        } (Min) and ${constraints.maxChars} (Max).`;
      }
    },

    // check the current selected option
    checkForOtherOption(selectedAnswer) {
      this.$refs.slider.setIndex(0);
      this.scaleData.answer = '';
      this.$forceUpdate();
      const selectedOption = find(this.scaleData.options, ['label', selectedAnswer]);
      this.nonScaleAnswer = selectedAnswer;
      if (selectedOption && selectedOption.type !== 'Other') {
        // as option is selected no need to test the commentbox value so send false as error flag
        this.updateVueStore(false);
      } else if (selectedOption && selectedOption.type === 'Other') {
        // this.validateRegEx();
        if (this.componentData.options[this.scaleData.options.length - 1].commentField) {
          this.updateVueStore(true);
        }
        if (this.scaleData.options[this.scaleData.options.length - 1].comment
          .commentMessage
        && this.scaleData.options[this.scaleData.options.length - 1].comment
          .commentMessage.trim().length > 0) {
          this.validateRegEx();
        }
      } else if (!selectedOption || !selectedAnswer) {
        this.updateVueStore(false);
      }
    },

    emptyNonScaleAnswer() {
      this.nonScaleAnswer = null;
      this.scaleData.nonScaleAnswer = null;
    },

    // update the VueStore for the component errorFlag
    updateVueStore(errorStatus) {
      // get the available edcFormErrors from localstorage set by VueStore
      const currentEdcFormErrors = window.localStorage.getItem('thread-edcFormErrors') || [];
      const currentEdcFormErrorsJson = JSON.parse(window.localStorage.getItem('thread-edcFormErrors')) || [];
      // update the component error status if already exists
      if (currentEdcFormErrors.includes(this.scaleData.id)) {
        const compInd = findIndex(currentEdcFormErrorsJson, ['id', this.scaleData.id]);
        currentEdcFormErrorsJson[compInd].comment = errorStatus;
      } else {
        // add the component error status if it doesn't exist
        currentEdcFormErrorsJson.push({
          id: this.scaleData.id,
          name: this.scaleData.name,
          comment: errorStatus,
        });
      }
      // save the form component error for using it in the PI form filling
      this.saveEDCFormErrors(currentEdcFormErrorsJson);
    },
  },
  computed: {},
  watch: {
    otherChoiceComment: {
      handler() {
        if (this.otherChoiceComment) {
          this.scaleData.options[
            this.scaleData.options.length - 1
          ].comment.commentMessage = this.otherChoiceComment;
        }
      },
      immediate: true,
      deep: true,
    },
    nonScaleAnswer: {
      handler() {
        this.scaleData.nonScaleAnswer = this.nonScaleAnswer;
      },
      immediate: true,
      deep: true,
    },
    componentData: {
      handler() {
        this.scaleData = this.componentData;
        this.initMethod();
        this.$nextTick(() => this.$refs.slider.refresh());
      },
    },
    formSubmitted: {
      handler() {
        if(this.formSubmitted && !this.scaleData.answer && this.scaleData.required) {
          this.scaleError = true;
        }
        else if (this.formSubmitted
          && (this.scaleData.nonScaleAnswer)) {
          this.validateRegEx();
        }
      },
      deep: true,
    },
  },
};
</script>

<style scoped lang="scss">
.disableClick {
  pointer-events: none;
}

.vertical-vue-slider {
  height: 300px !important;
  width: 25px;
  padding: 11px;
  margin-left: 90px;
}

/deep/ .vue-slider-component.vue-slider-horizontal .vue-slider-process {
  height: 100% !important;
}

.horizontal-vue-slider {
  height: 8px;
  width: 100%;
}

.error-style {
  color: #ff4848;
}

.is-danger {
  border-color: #ff4848;
}

.pointerEventsNull:active {
  pointer-events: none;
}

.iconColor{
  color: #ced4da;
}

.icon-div {
  border: 1px solid #ced4da;
  border-radius: 3px;
  padding: 7px 22px;
}

.icons-div {
  display: none;
}
 
.component-div:hover .icons-div {
  display: block;
}

.error-border {
  border: 2px solid #ff4848;
  border-radius: 5px;
}
</style>
