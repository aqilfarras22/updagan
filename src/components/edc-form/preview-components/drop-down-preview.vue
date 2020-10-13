<template>
  <div class="pt-10 pb-15 component-div">
    <b-row>
      <b-col cols="12" class="pl-14">
        <b class="cursor_pointer">{{componentData.sequence}}. {{componentData.body}}</b>
        <div class="pull-right icons-div">
        <div v-if="hideShowCopyAction" class="icon-div" @click="copyData()">
          <img src="static/img/duplicate.svg" />
        </div>
        </div>
        <span class="error-style" v-if="componentData.required">*</span>
      </b-col>
    </b-row>
    <b-row class="pl-15 pt-10" :class="{'pointerEventsNull': disableField}">
      <b-col cols="10" lg="4">
        <b-form-select v-model="dropDownAnswer" :disabled="disableField" size="sm" class="fs-12 field-h40" @change="checkForOtherOption" :class="{'is-danger': requiredAndNoAns}">
          <option key="" value="">&nbsp;</option>
          <option v-for="choice in componentData.options" :disabled="disableField" :key="choice.index" :value="choice.id || choice.label">{{choice.label}}
          </option>
        </b-form-select>
      </b-col>
      <b-col lg="8"></b-col>
      <!-- Use this text area for comment field when there is id created for option which will occur when PI answers the comment field -->
      <b-col cols="12" lg="4" class="pt-5 pl-15 fs-12" v-if="dropDownAnswer == componentData.options[componentData.options.length - 1].id && componentData.options[componentData.options.length - 1].id && componentData.options[componentData.options.length - 1].comment">
        <span>Comment</span><br>
        <textarea v-model="otherChoiceComment"  placeholder="Enter comments" rows="4" v-validate="validationConstraints" name="dropDownComment" :class="{'input': true, 'is-danger': errors.has('dropDownComment') || errorFlag}" v-on:keyup="validateRegEx" @click="validateRegEx" class="fs-12 text-area"></textarea>
      </b-col>
      <b-col cols="8"></b-col>
      <b-col cols="12" v-if="dropDownAnswer == componentData.options[componentData.options.length - 1].id && componentData.options[componentData.options.length - 1].id && componentData.options[componentData.options.length - 1].comment">
        <span v-if="(errors.has('dropDownComment') || errorFlag) && !otherChoiceComment" class="pt-5 fs-12 error-style">{{componentData.options[componentData.options.length - 1].comment.errorMessage}}</span>
        <span v-if="(errors.has('dropDownComment') || errorFlag) && otherChoiceComment && commentFieldErrorMsg" class="pt-8 fs-12 error-style">{{commentFieldErrorMsg}}</span>
      </b-col>
      <!-- Use this text area for comment field when there is no id created for option which will occur only if the field is still in configure a new form page -->
      <b-col cols="12" lg="4" class="pt-5 pl-15 fs-12" v-if="dropDownAnswer == componentData.options[componentData.options.length - 1].label && componentData.options[componentData.options.length - 1].comment">
        <span>Comment</span><br>
        <b-textarea name="dropDownComment" v-model="otherChoiceComment" placeholder="Enter comments" rows="3" v-on:keyup.native="validateRegEx"></b-textarea>
      </b-col>
      <b-col cols="8"></b-col>
    </b-row>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import findIndex from 'lodash/findIndex';
import find from 'lodash/find';

import regExpUtil from '../../../utils/regExpUtil';

export default {
  name: 'drop-down-preview',
  props: ['componentData', 'formSubmitted', 'disableField', 'hideShowCopyAction'],
  data() {
    return {
      errorFlag: false,
      requiredAndNoAns: false,
      regExp: null,
      validationConstraints: {},
      dropDownAnswer: null,
      otherChoiceComment: null,
      commentFieldErrorMsg: null,
    };
  },
  mounted() {
    // check if the other option field comment field is enabled or not
    // if (this.componentData) {
    //   this.dropDownAnswer = this.componentData.answer;
    // }
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
        !this.otherChoiceComment &&
        this.dropDownAnswer === this.componentData.options[this.componentData.options.length - 1].id &&
        this.componentData.options[this.componentData.options.length - 1].id) {
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
      if(selectedAnswer === "" && this.componentData.required) {
        this.requiredAndNoAns = true;
      }
      else {
        this.requiredAndNoAns = false;
      const selectedOption = find(this.componentData.options, ['id', selectedAnswer]);
      if (selectedOption && selectedOption.type) {
        this.requiredAndNoAns = false;
        if (selectedOption.type !== 'Other') {
          // as option is selected no need to test the commentbox value so send false as error flag
          this.updateVueStore(false);
        } else if (selectedOption.type === 'Other') {
          if (this.componentData.options[this.componentData.options.length - 1].commentField) {
            this.updateVueStore(true);
          }
          // this.validateRegEx();
          if (this.componentData.options[this.componentData.options.length - 1].comment
            .commentMessage
          && this.componentData.options[this.componentData.options.length - 1].comment
            .commentMessage.trim().length > 0) {
            this.validateRegEx();
          }
        }
      }
      }
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
    dropDownAnswer: {
      handler() {
        if (this.dropDownAnswer || this.dropDownAnswer === "") {
          this.componentData.answer = this.dropDownAnswer;
          if(this.dropDownAnswer === "") {
            this.otherChoiceComment = "";
            this.errorFlag = false;
            this.updateVueStore(this.errorFlag);
          }
        } else {
          this.dropDownAnswer = this.componentData.answer;
        }
        this.$forceUpdate();
      },
      deep: true,
      immediate: true,
    },
    otherChoiceComment: {
      handler() {
        if (this.otherChoiceComment !=null && this.otherChoiceComment !=undefined) {
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
          if (this.componentData.answer) {
            this.validateRegEx();
          }
          if (!this.componentData.answer && this.componentData.required) {
            this.requiredAndNoAns = true;
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

</style>
