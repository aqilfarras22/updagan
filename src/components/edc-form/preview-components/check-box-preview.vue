<template>
  <div class="pt-10 pb-15 component-div">
    <b-row>
      <b-col cols="12" class="pl-14">
        <div :class="{'error-border': (checkboxError)}"><b>{{componentData.sequence}}. {{componentData.body}}</b>
        <div class="pull-right icons-div">
        <div v-if="hideShowCopyAction" class="icon-div" @click="copyData()">
          <img src="static/img/duplicate.svg" />
        </div>
        </div>
        <span class="error-style" v-if="componentData.required">*</span>
        </div>
      </b-col>
    </b-row>
    <div :class="{'pointerEventsNull': disableField}">
      <b-row class="pl-15 fs-12" v-if="componentData.options && componentData.options.length">
        <b-col v-for="(choice, index) in componentData.options" :key="index" class="pt-0 pl-0 pr-0" v-bind:class="{'col-4' : (componentData.noOfColumns == 3), 'col-6': (componentData.noOfColumns == 2), 'col-12': (componentData.noOfColumns == 1)}">
          <b-row class="pt-3 pb-3">
            <b-col align-self="center">
              <b-form-checkbox class="pl-0 position-absolute" v-model="choice.answer" :value="{selected: `${index + 1}`}" :unchecked-value="{unSelected: `${index + 1}`}" @change="checkForOtherOption">
              </b-form-checkbox>
              <span class="pl-20 text-align mr-10">{{choice.label}}</span>
              <span v-if="(choice.answer && choice.answer.selected && (choice.answer.selected === `${index + 1}`)) && choice.colorCoding && choice.colorCoding.warningMessage" :style="[ choice.colorCoding.color !== '#ffffff' ? {'background-color': choice.colorCoding.color,'color':'#ffffff'} : {'color':'#000000','padding-left':'0px!important'} ]" class="pt-5 pb-5 pl-10 pr-10 alert-div">{{choice.colorCoding.warningMessage}}</span>
              <span v-if="(choice.answer && choice.answer.selected && (choice.answer.selected === `${index + 1}`)) && choice.colorCoding && !choice.colorCoding.warningMessage" :style="{ 'background-color': choice.colorCoding.color }" style="border-radius:50px;" class="pt-5 pb-5 pl-15 pr-10"></span>
            </b-col>
          </b-row>
        </b-col>
        <b-col cols="4" align-self="center"></b-col>
      </b-row>
      <b-row class="pl-15 fs-12" v-if="componentData.options && componentData.options.length && componentData.options[componentData.options.length - 1] && componentData.options[componentData.options.length - 1].answer && componentData.options[componentData.options.length - 1].answer.selected  && componentData.options[componentData.options.length - 1].comment">
        <b-col cols="4" class="pt-5">
          <span>Comment</span><br>
          <textarea v-model="otherChoiceComment"  placeholder="Enter comments" rows="4" v-validate="validationConstraints" name="checkBoxComment" :class="{'input': true, 'is-danger': errors.has('checkBoxComment') || errorFlag}" v-on:keyup="validateRegEx" @click="validateRegEx" class="fs-12 text-area"></textarea>
        </b-col>
        <b-col cols="8"></b-col>
        <b-col cols="12">
          <span v-if="(errors.has('checkBoxComment') || errorFlag) && !otherChoiceComment" class="pt-5 error-style">{{componentData.options[componentData.options.length - 1].comment.errorMessage}}</span>
          <span v-if="(errors.has('checkBoxComment') || errorFlag) && otherChoiceComment && commentFieldErrorMsg" class="pt-8 error-style">{{commentFieldErrorMsg}}</span>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import findIndex from 'lodash/findIndex';
import find from 'lodash/find';

import regExpUtil from '../../../utils/regExpUtil';

export default {
  name: 'check-box-preview',
  props: ['componentData', 'formSubmitted', 'disableField', 'hideShowCopyAction'],
  data() {
    return {
      choicesGiven: [],
      otherChoice: false,
      errorFlag: false,
      regExp: null,
      validationConstraints: {},
      otherChoiceComment: null,
      commentFieldErrorMsg: null,
      checkboxError: false,
      answer: ""
    };
  },
  mounted() {
    this.choicesGiven = this.componentData.options;
    const tempOptions = [];
    if (this.componentData.options) {
      this.componentData.options.forEach((option, index) => {
        const tempOption = option;
        tempOption.value = option.label;
        tempOption.selectVal = `${index + 1}`;
        tempOptions.push(option);
      });
      this.componentData.options = tempOptions;
      // check if the other option field comment field is enabled or not
      if (
        this.componentData
        && this.componentData.options[this.componentData.options.length - 1].comment
      ) {
        if (this.componentData.options[this.componentData.options.length - 1].comment) {
          this.otherChoiceComment = this.componentData.options[
            this.componentData.options.length - 1
          ].comment.commentMessage;
        }
        // check if constraint rules are set
        if (this.componentData.options[this.componentData.options.length - 1].comment.constraint) {
          const constraints = this.componentData.options[this.componentData.options.length - 1]
            .comment.constraint;
          // check if the comment box has constraints for min, max chars
          if (constraints.lettersAllowed || constraints.specialCharactersAllowed) {
            if (constraints.minCharsFlag) {
              this.validationConstraints.min = constraints.minChars;
            }
            if (constraints.maxCharsFlag) {
              this.validationConstraints.max = constraints.maxChars;
            }
            this.validationConstraints.required = this.componentData.options[
              this.componentData.options.length - 1
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
            this.validationConstraints.required = this.componentData.options[
              this.componentData.options.length - 1
            ].commentField;
          }
          this.generateRegExp(
            this.componentData.options[this.componentData.options.length - 1].comment
              .constraint.lettersAllowed,
            this.componentData.options[this.componentData.options.length - 1].comment
              .constraint.numbersAllowed,
            this.componentData.options[this.componentData.options.length - 1].comment
              .constraint.specialCharactersAllowed,
          );
        }
      }
    }
  },
  methods: {
    ...mapActions(['saveEDCFormErrors']),

    copyData() {
      event.stopPropagation();
      this.$emit('copyComponent', this.componentData);
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
        !this.componentData.options[this.componentData.options.length - 1].comment.constraint
          .lettersAllowed
        && !this.componentData.options[this.componentData.options.length - 1].comment.constraint
          .specialCharactersAllowed
        && this.componentData.options[this.componentData.options.length - 1].comment.constraint
          .numbersAllowed
        && this.componentData.options[this.componentData.options.length - 1].comment.constraint
          .decimalLimitFlag
        && this.componentData.options[this.componentData.options.length - 1].comment.constraint
          .decimalLimit
      ) {
        this.regExp = '';
      }
    },

    // validate the regEx on key up in comment box
    validateRegEx() {
      if (this.componentData.options[this.componentData.options.length - 1].commentField &&
        (this.otherChoiceComment && this.otherChoiceComment.length > 0)) {
        const commentMsg = this.componentData.options[this.componentData.options.length - 1].comment
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
          const constraints = this.componentData.options[this.componentData.options.length - 1]
            .comment.constraint;
          if (
            !constraints.lettersAllowed
            && !constraints.specialCharactersAllowed
            && constraints.numbersAllowed
          ) {
            const answerWithoutSpace = this.otherChoiceComment.replace(/\s/g,'');
            if (isNaN(answerWithoutSpace)) { // eslint-disable-line
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
      } else if (this.componentData.options[this.componentData.options.length - 1].commentField &&
        !this.otherChoiceCommentt &&
        this.componentData.options[this.componentData.options.length - 1].answer &&
        this.componentData.options[this.componentData.options.length - 1].answer.selected) {
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
    checkForOtherOption(answer) {
      this.checkboxError = false;
      const answerSelected = answer.selected || answer.unSelected;
      // check of answer is selected or unselected
      if (answerSelected) {
        // get the changed option
        const selectedOption = find(this.componentData.options, ['selectVal', answerSelected]);
        /* Update VueStore as normal option is changed and also
        Test the commentbox value as well as in checkbox we can select multiple values */
        if (selectedOption.type !== 'Other') {
          this.updateVueStore(false);
          if (
            this.componentData.options[this.componentData.options.length - 1].answer
            && this.componentData.options[this.componentData.options.length - 1].type === 'Other'
            && this.componentData.options[this.componentData.options.length - 1].answer.selected
          ) {
            this.validateRegEx();
          }
          // Test the checkbox if answer is selected or just update the VueStore as false
        } else if (selectedOption.type === 'Other') {
          if (answer.unSelected) {
            this.updateVueStore(false);
          } else {
            // this.validateRegEx();
            if (this.componentData.options[this.componentData.options.length - 1].commentField) {
              this.updateVueStore(true);
            }
            // this.updateVueStore(true);
            if (this.componentData.options[this.componentData.options.length - 1].comment
              .commentMessage
            && this.componentData.options[this.componentData.options.length - 1].comment
              .commentMessage.trim().length > 0) {
              this.validateRegEx();
            }
          }
        }
      }
      this.$nextTick(() => {
        this.choicesGiven = this.componentData.options;
        this.$forceUpdate();
      });
    },

    // update the VueStore for the component errorFlag
    updateVueStore(errorStatus) {
      // get the available edcFormErrors from localstorage set by VueStore
      const currentEdcFormErrors = window.localStorage.getItem('thread-edcFormErrors') || [];
      const currentEdcFormErrorsJson = JSON.parse(window.localStorage.getItem('thread-edcFormErrors')) || [];
      // update the component error status if already exists
      if (currentEdcFormErrors.includes(this.componentData.id)) {
        const compInd = findIndex(currentEdcFormErrorsJson, ['id', this.componentData.id]);
        currentEdcFormErrorsJson[compInd].comment = errorStatus;
      } else {
        // add the component error status if it doesn't exist
        currentEdcFormErrorsJson.push({
          id: this.componentData.id,
          name: this.componentData.name,
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
        if (this.otherChoiceComment !=null && this.otherChoiceComment !=undefined && this.componentData.options) {
          this.componentData.options[
            this.componentData.options.length - 1
          ].comment.commentMessage = this.otherChoiceComment;
        }
      },
      immediate: true,
      deep: true,
    },
    formSubmitted: {
      handler() {
        if (this.formSubmitted) {
           this.answer = ""
           this.componentData.options.forEach(option => {
            if (option.answer && option.answer.selected) {
              this.answer = option;
            }
          });
        if (!this.answer && this.componentData.required) {
          this.checkboxError = true;
        }
        else {
          this.validateRegEx();
        }
        }
      },
      deep: true,
    },
  },
};
</script>

<style scoped lang="scss">
.error-style {
  color: #ff4848;
}

.is-danger {
  border-color: #ff4848;
}

.pointerEventsNull:active {
  pointer-events: none;
}

.text-align {
  line-height: 23px !important;
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

.alert-div {
  border-radius:50px;
  display:inline-block;
}
</style>
