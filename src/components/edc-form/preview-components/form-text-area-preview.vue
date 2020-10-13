<template>
  <div class="pt-10 pb-10 component-div">
    <b-row>
      <b-col cols="12" class="pl-14">
        <b>{{componentData.sequence}}. {{componentData.body}}</b>
        <div class="pull-right icons-div">
        <div v-if="hideShowCopyAction" class="icon-div" @click="copyData()">
          <img src="static/img/duplicate.svg" />
        </div>
        </div>
        <span class="error-style" v-if="componentData.required">*</span>
      </b-col>
    </b-row>
    <b-row class="pt-5">
      <b-col cols="12" align-self="center" class="pt-5 pl-30">
        <textarea v-model="answer" :disabled="disableField" :rows="componentData.noOfLines" :placeholder="componentData.placeholder" autocomplete="off" v-validate="validationConstraints" name="textAreaValidation" :class="{'field-h40': disableField, 'input': true, 'is-danger': errors.has('textAreaValidation') || errorFlag || requiredAndNoAns}" v-on:keyup="validateRegEx" @click.native="validateRegEx" class="fs-12 text-area"></textarea>        
      </b-col>
      <b-col cols="12" align-self="center" class="pl-30">
        <span v-if="(errors.has('textAreaValidation') || errorFlag) && answer && commentFieldErrorMsg" class="pt-8 error-style fs-12">{{commentFieldErrorMsg}}</span>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import findIndex from 'lodash/findIndex';

import regExpUtil from '../../../utils/regExpUtil';

export default {
  name: 'form-text-area-preview',
  props: ['componentData', 'formSubmitted', 'disableField', 'hideShowCopyAction'],
  components: {},
  data() {
    return {
      regExp: null,
      requiredAndNoAns: false,
      validationConstraints: {},
      errorFlag: false,
      answer: null,
      commentFieldErrorMsg: null,
    };
  },
  mounted() {
    this.prepareValidationConstraints();
  },
  methods: {
    ...mapActions(['saveEDCFormErrors']),

    copyData() {
      event.stopPropagation();
      this.$emit('copyComponent', this.componentData);
    },
     prepareValidationConstraints() {
      this.validationConstraints = {};
      if (this.componentData && this.componentData.constraint) {
        this.answer = this.componentData.answer || null;
        // check if constraint rules are set
        if (this.componentData.constraint) {
          const constraints = this.componentData.constraint;
          // check if the comment box has constraints for min, max chars
          if (constraints.lettersAllowed || constraints.specialCharactersAllowed) {
            if (constraints.minCharsFlag) {
              this.validationConstraints.min = constraints.minChars;
            }
            if (constraints.maxCharsFlag) {
              this.validationConstraints.max = constraints.maxChars;
            }
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
        }
          this.generateRegExp(
            constraints.lettersAllowed,
            constraints.numbersAllowed,
            constraints.specialCharactersAllowed);
        }
      }
    },
    // generate regEx based on the comment field constraints
    generateRegExp(lettersAllowed, numbersAllowed, specialCharactersAllowed) {
      this.regExp = null;
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
        !this.componentData.constraint.lettersAllowed
        && !this.componentData.constraint.specialCharactersAllowed
        && this.componentData.constraint.numbersAllowed
        && this.componentData.constraint.decimalLimitFlag
        && this.componentData.constraint.decimalLimit
      ) {
        this.regExp = '';
      }
    },

    // validate the regEx on key up in comment box
    validateRegEx() {
      if (this.regExp) {
        this.errorFlag = !this.regExp.test(this.componentData.answer);
      } else {
        this.errorFlag = false;
      }
      if (this.componentData.answer && this.componentData.answer.length > 0) {
        this.requiredAndNoAns = false;
      }
      // validate all the vee validator features
      this.$validator.validateAll().then(noVeeValidateError => {
        // send the error status to update the VueStore
        this.updateVueStore(this.errorFlag || !noVeeValidateError);
        this.commentFieldErrorMsg = null;
        const constraints = this.componentData.constraint;
        if (
          !constraints.lettersAllowed
          && !constraints.specialCharactersAllowed
          && constraints.numbersAllowed
        ) {
          const answerWithoutSpace = this.componentData.answer.replace(/\s/g,'');
          if (isNaN(answerWithoutSpace)) { // eslint-disable-line// eslint-disable-line
            // no-restricted-globals
            this.commentFieldErrorMsg = 'Only numbers are allowed.';
          } else if (
            constraints.minLimitFlag
            && !constraints.maxLimitFlag
            && !constraints.decimalLimitFlag
          ) {
            if (this.componentData.answer % 1 !== 0) {
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
            if (this.componentData.answer % 1 !== 0) {
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
            if (this.componentData.answer % 1 !== 0) {
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
    answer: {
      handler() {
        this.componentData.answer = this.answer;
      },
    },
    formSubmitted: {
      handler() {
        if (this.formSubmitted && this.componentData.answer) {
          this.validateRegEx();
        } else if (!this.componentData.answer && this.componentData.required) {
          this.requiredAndNoAns = true;
        }
      },
      deep: true,
    },
    componentData: {
      handler() {
        this.prepareValidationConstraints();
      },
      deep: true
    }
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
