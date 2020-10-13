<template>
  <div class="pt-10 component-div">
    <b-row>
      <b-col cols="12" class="pl-14 pb-15">
        <b>{{componentData.sequence}}. {{componentData.body}}</b>
        <div class="pull-right icons-div">
        <div v-if="hideShowCopyAction" class="icon-div" @click="copyData()">
          <img src="static/img/duplicate.svg" />
        </div>
        </div>
        <span class="error-style" v-if="componentData.required">*</span>
      </b-col>
    </b-row>
    <!-- <b-row class="pr-15 pb-15 pt-0 pl-15">
      <b-col v-for="(field, index) in fields" :key="index" class="pt-5 pl-0 pr-0" v-bind:class="{'col-4' : (componentData.noOfFields == 3), 'col-6': (componentData.noOfFields == 2), 'col-12': (componentData.noOfFields == 1)}">
        <b-col align-self="center" cols="12" v-if="index < componentData.noOfFields">
          <b-form-input  type="text" v-model="fields[index].label" :placeholder="componentData.placeholder" size="sm" class="field-h40 fs-12" autocomplete="off" :class="{'input': true, 'is-danger':field.errorFlag}" v-on:keyup.native="validateAllFields"/>
          <div v-if="field.errorFlag" class="pt-4 fs-12 error-style">{{errorMsgs[index].errorMsg}}</div>
        </b-col>
      </b-col>
    </b-row>
    <div :class="{'pointerEventsNull': disableField}">
    <b-row class="pr-15 pb-15 pt-0 pl-15" v-if="addFields.length > 0" v-for="(field, index) in addFields" :key="index">
      <b-col align-self="center" cols="11">
        <b-form-input type="text" v-model="field.label" :placeholder="componentData.placeholder" size="sm" class="field-h40 fs-12" autocomplete="off" :class="{'input': true, 'is-danger':field.errorFlag}" v-on:keyup.native="validateAllFields"/>
        <div v-if="field.errorFlag" class="pt-4 fs-12 error-style">{{errorMsgsAdd[index].errorMsg}}</div>
      </b-col>
      <b-col cols="1" align-self="center" class="pl-0">
        <i class="fa fa-minus-circle fs-18 iconColor cursor_pointer" @click="removeField(index)" aria-hidden="true"></i>
      </b-col>
    </b-row> -->

    <b-row class="pr-15 pb-5 pt-0 pl-15">
      <b-col v-for="(field, index) in fields" :key="index" class="pt-5 pl-0 pr-0" v-bind:class="{'col-4' : (componentData.noOfFields == 3), 'col-6': (componentData.noOfFields == 2), 'col-12': (componentData.noOfFields == 1)}">
        <b-col align-self="center" cols="12" v-if="index < componentData.noOfFields">
          <b-form-input  type="text" v-model="fields[index].label" :placeholder="componentData.placeholder" :disabled="disableField" size="sm" class="field-h40 fs-12" autocomplete="off" :class="{'input': true, 'is-danger':field.errorFlag}" v-on:keyup.native="validateAllFields"/>
          <div v-if="field.errorFlag" class="pt-4 fs-12 error-style">{{errorMsgs[index].errorMsg}}</div>
        </b-col>
      </b-col>
    </b-row>
    <div :class="{'pointerEventsNull': disableField}">
      <b-row class="pr-15 pb-15 pt-0 pl-15" v-if="addFields.length > 0">
        <b-col :class="{'pt-5': index > 2}" cols="4" v-for="(field, index) in addFields" :key="index">
          <b-form-input type="text" v-model="field.label" :placeholder="componentData.placeholder" size="sm" class="field-h40 fs-12 additionalFieldInput" autocomplete="off" :name="field.name" :class="{'input': true, 'is-danger': field.errorFlag}" v-on:keyup.native="validateAllFields">
          </b-form-input>
          <i class="fa fa-minus-circle fs-18 iconColor cursor_pointer additionalFieldIcon" @click="removeField(index)" aria-hidden="true"></i>
          <div v-if="field.errorFlag" class="pt-4 fs-12 error-style">{{errorMsgsAdd[index].errorMsg}}</div>
        </b-col>
      </b-row>

      <b-row class="pr-15 pb-15 pt-0 pl-15" v-if="componentData.additionalFields">
        <b-col align-self="center">
          <b-button @click="addAdditionalFields" variant="outline-primary" size="sm" class="fs-12" :disabled="disableAddAnother">Add a Field</b-button>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import findIndex from 'lodash/findIndex';
import find from 'lodash/find';
import cloneDeep from 'lodash/cloneDeep';
import _ from 'lodash';

import schemas from '../../../data/form-components-json/schemas.json';

export default {
  name: 'form-table-preview',
  props: ['componentData', 'disableAddAnother', 'formSubmitted', 'disableField', 'hideShowCopyAction'],
  components: {},
  data() {
    return {
      fieldSchema: find(schemas, { fieldType: 'formTable' }).schemas.fieldSchema,
      fields: [],
      addFields: [],
      regExp: null,
      validationConstraints: {},
      errorMsgs: [],
      errorMsgsAdd: [],
    };
  },
  mounted() {
    if (this.componentData.noOfFields) {
      for (let ind = 0; ind < this.componentData.noOfFields; ind++) {
        const fieldSchema = cloneDeep(this.fieldSchema);
        this.fields.push(fieldSchema);
        this.fields[ind].index = ind;
        this.fields[ind].errorFlag = false;
        this.errorMsgs.push({
          errorMsg: '',
        });
      }
    }
    if (this.componentData.fields) {
      this.fields = this.componentData.fields;
    }
    if (this.componentData.addFields) {
      this.addFields = this.componentData.addFields;
    }

    // generate name for each configured field to validate via vee validate
    const tempFields = [];
    if (this.fields) {
      this.fields.forEach((option, index) => {
        const tempOption = option;
        tempOption.name = `field${index + 1}`;
        tempFields.push(tempOption);
      });
    }
    this.fields = tempFields;

    // generate name for each user added field to validate via vee validate
    const tempAdditionalFields = [];
    if (this.addFields) {
      this.addFields.forEach((option, index) => {
        const tempOption = option;
        tempOption.name = `addField${index + 1}`;
        tempOption.errorFlag = false;
        tempAdditionalFields.push(tempOption);
        this.errorMsgsAdd.push({
          errorMsg: null,
        });
      });
    }
    this.addFields = tempAdditionalFields;

    // constraints for the input fields added
    // check if constraint rules are set
    if (this.componentData.constraint) {
      const constraints = this.componentData.constraint;
      // check if the comment box has constraints for min, max chars
      if (constraints.lettersAllowed || constraints.specialCharactersAllowed) {
        if (constraints.minCharsFlag) {
          this.validationConstraints.min = constraints.minChars;
        }
        if (constraints.maxCharsFlag) {
          this.validationConstraints.max = parseInt(constraints.maxChars, 0);
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
        if (constraints.decimalLimit) {
          this.validationConstraints.decimal = constraints.decimalLimit;
        }
      }
      this.generateRegExp(
        constraints.lettersAllowed,
        constraints.numbersAllowed,
        constraints.specialCharactersAllowed,
      );
    }
  },
  methods: {
    ...mapActions(['saveEDCFormErrors']),

    copyData() {
      event.stopPropagation();
      this.$emit('copyComponent', this.componentData);
    },

    addAdditionalFields() {
      if (this.componentData.maxFields && this.componentData.maxFields > this.addFields.length) {
        const fieldSchema = cloneDeep(this.fieldSchema);
        fieldSchema.name = `addField${this.addFields.length}`;
        this.addFields.push(fieldSchema);
        this.addFields[this.addFields.length - 1].index = this.addFields.length - 1;
        this.errorMsgsAdd.push({
          errorMsg: null,
          errorFlag: false,
        });
        const fieldsWithAns = _.filter(this.componentData.fields, field => field
          .label.trim().length > 0).length;
        const addFieldsWithAns = _.filter(this.componentData.addFields, field => field
          .label.trim().length > 0).length;
        if ((fieldsWithAns !== 0 || addFieldsWithAns !== 0) || this.componentData.required) {
          this.updateVueStore(true);
        }
      } else {
        this.$toastr.error(
          `Cannot add more than ${this.componentData.maxFields} additional fields`,
        );
      }
    },

    removeField(index) {
      this.addFields.splice(index, 1);
      const tempAddFields = [];
      this.addFields.forEach((field, fieldIndex) => {
        const tempField = field;
        tempField.name = `addField${fieldIndex}`;
        tempField.index = fieldIndex;
        tempAddFields.push(tempField);
      });
      this.addFields = tempAddFields;
      this.errorMsgsAdd.splice(index, 1);
      const fieldsWithAns = _.filter(this.componentData.fields, field => field
        .label.trim().length > 0).length;
      const addFieldsWithAns = _.filter(this.componentData.addFields, field => field
        .label.trim().length > 0).length;
      if ((fieldsWithAns !== 0 || addFieldsWithAns !== 0) || this.componentData.required) {
        this.validateAllFields();
      }
    },
    generateRegExp() {
      let regEx = '';
      const { constraint } = this.componentData;
      if (constraint.numbersAllowed && !constraint.lettersAllowed && !constraint.specialCharactersAllowed) { // eslint-disable-line
        regEx += '[0-9]+';
        if (constraint.decimalLimitFlag) {
          regEx += `(\\.[0-9]{0,${constraint.decimalLimit}})?`;
        }
      } else if (constraint.numbersAllowed && constraint.lettersAllowed && !constraint.specialCharactersAllowed) { // eslint-disable-line
        if (constraint.numbersAllowed) {
          regEx += '0-9';
        }
        if (constraint.lettersAllowed) {
          regEx += 'a-zA-Z';
        }
        regEx = `[${regEx}]`;
        if (constraint.minCharsFlag && constraint.maxCharsFlag) {
          regEx += `{${constraint.minChars},${constraint.maxChars}}`;
        } else if (constraint.minCharsFlag) {
          regEx += `{${constraint.minChars},}`;
        } else if (constraint.maxCharsFlag) {
          regEx += `{,${constraint.maxChars}}`;
        }
      } else if (!constraint.numbersAllowed && constraint.lettersAllowed && !constraint.specialCharactersAllowed) { // eslint-disable-line
        // allow only alphabets
        regEx = '[a-zA-Z]';
        if (constraint.minCharsFlag && constraint.maxCharsFlag) {
          regEx += `{${constraint.minChars},${constraint.maxChars}}`;
        } else if (constraint.minCharsFlag) {
          regEx += `{${constraint.minChars},}`;
        } else if (constraint.maxCharsFlag) {
          regEx += `{,${constraint.maxChars}}`;
        }
      } else if (!constraint.numbersAllowed && !constraint.lettersAllowed && constraint.specialCharactersAllowed) { // eslint-disable-line
        // allow only spl chars
        regEx = '[\\W]';
        if (constraint.minCharsFlag && constraint.maxCharsFlag) {
          regEx += `{${constraint.minChars},${constraint.maxChars}}`;
        } else if (constraint.minCharsFlag) {
          regEx += `{${constraint.minChars},}`;
        } else if (constraint.maxCharsFlag) {
          regEx += `{,${constraint.maxChars}}`;
        }
      } else if (!constraint.numbersAllowed && constraint.lettersAllowed && constraint.specialCharactersAllowed) { //eslint-disable-line
        // allow letters and spl chars
        regEx = '[a-zA-Z\\W]';
        if (constraint.minCharsFlag && constraint.maxCharsFlag) {
          regEx += `{${constraint.minChars},${constraint.maxChars}}`;
        } else if (constraint.minCharsFlag) {
          regEx += `{${constraint.minChars},}`;
        } else if (constraint.maxCharsFlag) {
          regEx += `{,${constraint.maxChars}}`;
        }
      }
      this.regExp = new RegExp(`^${regEx}$`);
    },
    checkForFieldErrors(text, index, type, errArrayParam, compFieldsParam) {
      const { constraint } = this.componentData;
      const errArray = errArrayParam;
      const compFields = compFieldsParam;
      if (constraint.numbersAllowed && !constraint.lettersAllowed && !constraint.specialCharactersAllowed) { //eslint-disable-line
        // allow only numbers
        if (text === '' || text.length <= 0) {
          compFields[index].errorFlag = true;
          errArray[index].errorMsg = 'This field is required.';
        } else if (this.regExp.test(text)) {
          if (constraint.minLimitFlag && constraint.maxLimitFlag) {
            // if maxflag and min flag true the check for range
            text = Number(text); // eslint-disable-line
            if (!(text >= constraint.minLimit && text <= constraint.maxLimit)) {
              compFields[index].errorFlag = true;
              errArray[index].errorMsg = `Please enter a number that is between ${
                constraint.minLimit
              } (Min) and ${constraint.maxLimit} (Max).`;
            } else if (constraint.decimalLimitFlag) {
              // if decimal flag true then check for decimal length
              text = Number(text); // eslint-disable-line
              if (!this.regExp.test(text)) {
                compFields[index].errorFlag = true;
                errArray[index].errorMsg = `Please enter a number that has decimal length of ${
                  constraint.decimalLimit
                } or less.`;
              } else {
                compFields[index].errorFlag = false;
                errArray[index].errorMsg = '';
              }
            } else {
              compFields[index].errorFlag = false;
              errArray[index].errorMsg = '';
            }
          } else if (!constraint.minLimitFlag && constraint.maxLimitFlag) {
            // if maxflag true and minflag false check for upper limit
            text = Number(text); //eslint-disable-line
            if (text >= constraint.maxLimit) {
              compFields[index].errorFlag = true;
              errArray[index].errorMsg = `Please enter a number that is less than ${
                constraint.maxLimit
              }`;
            } else if (constraint.decimalLimitFlag) {
              // if decimal flag true then check for decimal length
              text = Number(text); // eslint-disable-line
              if (!this.regExp.test(text)) {
                compFields[index].errorFlag = true;
                errArray[index].errorMsg = `Please enter a number that has decimal length of ${
                  constraint.decimalLimit
                } or less.`;
              } else {
                compFields[index].errorFlag = false;
                errArray[index].errorMsg = '';
              }
            } else {
              compFields[index].errorFlag = false;
              errArray[index].errorMsg = '';
            }
          } else if (constraint.minLimitFlag && !constraint.maxLimitFlag) {
            // if minflag true and max flag false check for lower limit
            text = Number(text); // eslint-disable-line
            if (text < constraint.minLimit) {
              compFields[index].errorFlag = true;
              errArray[index].errorMsg = `Please enter a number that is greater than ${
                constraint.minLimit
              }`;
            } else if (constraint.decimalLimitFlag) {
              // if decimal flag true then check for decimal length
              text = Number(text); // eslint-disable-line
              if (!this.regExp.test(text)) {
                compFields[index].errorFlag = true;
                errArray[index].errorMsg = `Please enter a number that has decimal length of ${
                  constraint.decimalLimit
                } or less.`;
              } else {
                compFields[index].errorFlag = false;
                errArray[index].errorMsg = '';
              }
            } else {
              compFields[index].errorFlag = false;
              errArray[index].errorMsg = '';
            }
          } else if (!constraint.minLimitFlag && !constraint.maxLimitFlag) {
            // if minflag, max flag and decimal flag not up
            text = Number(text); // eslint-disable-line
            if (!this.regExp.test(text) && constraint.decimalLimitFlag) {
              compFields[index].errorFlag = true;
              errArray[index].errorMsg = `Please enter a number that has decimal length of ${
                constraint.decimalLimit
              } or less.`;
            } else if (!this.regExp.test(text) && !constraint.decimalLimitFlag) {
              compFields[index].errorFlag = true;
              errArray[index].errorMsg = 'Invalid min and/or max value.';
            } else {
              compFields[index].errorFlag = false;
              errArray[index].errorMsg = '';
            }
          }
        } else if (Number(text)) {
          // if decimal flag true then check for decimal length
          // text = Number(text); // eslint-disable-line
          if (!this.regExp.test(text) && constraint.decimalLimitFlag
           && constraint.minLimitFlag && constraint.maxLimitFlag) {
            compFields[index].errorFlag = true;
            errArray[index].errorMsg = `Please enter a number that is between ${
              constraint.minLimit
            } (Min) and ${constraint.maxLimit} (Max) and has decimal length of ${
              constraint.decimalLimit
            } or less.`;
          } else if (!this.regExp.test(text) && constraint.decimalLimitFlag) {
            compFields[index].errorFlag = true;
            errArray[index].errorMsg = `Please enter a number that has decimal length of ${
              constraint.decimalLimit
            } or less.`;
          } else if (!this.regExp.test(text) && !constraint.decimalLimitFlag) {
            compFields[index].errorFlag = true;
            errArray[index].errorMsg = 'Decimals are not allowed.';
          } else {
            compFields[index].errorFlag = false;
            errArray[index].errorMsg = '';
          }
        } else {
          compFields[index].errorFlag = true;
          errArray[index].errorMsg = 'Only numbers are allowed.';
        }
      } else if(constraint.numbersAllowed && constraint.lettersAllowed && !constraint.specialCharactersAllowed) { // eslint-disable-line
        // allow numbers and letters
        if (text !== '') {
          if (this.regExp.test(text)) {
            compFields[index].errorFlag = false;
            errArray[index].errorMsg = '';
          } else {
            // check for spl chars
            // [!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]
            const splRegExp = /\W/;
            if (splRegExp.test(text)) {
              compFields[index].errorFlag = true;
              errArray[index].errorMsg = 'Only letters and numbers are allowed.';
            } else if (constraint.minCharsFlag && constraint.maxCharsFlag) {
              // check for range
              if (text.length >= constraint.minChars && text.length <= constraint.maxChars) {
                compFields[index].errorFlag = false;
                errArray[index].errorMsg = '';
              } else {
                compFields[index].errorFlag = true;
                errArray[index].errorMsg = `Please enter number of characters between ${
                  constraint.minChars
                } (Min) and ${constraint.maxChars} (Max).`;
              }
            } else if (constraint.maxCharsFlag && !constraint.minCharsFlag) {
              // check for max
              if (text.length > constraint.maxChars) {
                compFields[index].errorFlag = true;
                errArray[index].errorMsg = `Max number of characters ${
                  constraint.maxChars
                } exceeded.`;
              } else {
                compFields[index].errorFlag = false;
                errArray[index].errorMsg = '';
              }
            } else if (constraint.minCharsFlag && !constraint.maxCharsFlag) {
              // check for min
              if (text.length < constraint.minChars) {
                compFields[index].errorFlag = true;
                errArray[index].errorMsg = `Min of ${
                  constraint.minChars
                } characters needed.`;
              } else {
                compFields[index].errorFlag = true;
                errArray[index].errorMsg = '';
              }
            } else {
              compFields[index].errorFlag = false;
              errArray[index].errorMsg = '';
            }
          }
        } else {
          compFields[index].errorFlag = true;
          errArray[index].errorMsg = 'This field is required.';
        }
      } else if (constraint.lettersAllowed && constraint.specialCharactersAllowed && constraint.numbersAllowed) {  // eslint-disable-line
        // allow all chars
        if (text !== '') {
          if (constraint.minCharsFlag && constraint.maxCharsFlag) {
            // check for range
            if (text.length >= constraint.minChars && text.length <= constraint.maxChars) {
              compFields[index].errorFlag = false;
              errArray[index].errorMsg = '';
            } else {
              compFields[index].errorFlag = true;
              errArray[index].errorMsg = `Please enter number of characters between ${
                constraint.minChars
              } (Min) and ${constraint.maxChars} (Max).`;
            }
          } else if (constraint.maxCharsFlag && !constraint.minCharsFlag) {
            // check for max
            if (text.length > constraint.maxChars) {
              compFields[index].errorFlag = true;
              errArray[index].errorMsg = `Max number of characters ${
                constraint.maxChars
              } exceeded.`;
            } else {
              compFields[index].errorFlag = false;
              errArray[index].errorMsg = '';
            }
          } else if (constraint.minCharsFlag && !constraint.maxCharsFlag) {
            // check for min
            if (text.length < constraint.minChars) {
              compFields[index].errorFlag = true;
              errArray[index].errorMsg = `Min of ${
                constraint.minChars
              } characters needed.`;
            } else {
              compFields[index].errorFlag = false;
              errArray[index].errorMsg = '';
            }
          } else {
            compFields[index].errorFlag = false;
            errArray[index].errorMsg = '';
          }
        } else {
          compFields[index].errorFlag = true;
          errArray[index].errorMsg = 'This field is required.';
        }
      } else if (!constraint.numbersAllowed && constraint.lettersAllowed && !constraint.specialCharactersAllowed) { //eslint-disable-line
        // allow only alphabets
        if (text !== '') {
          if (this.regExp.test(text)) {
            compFields[index].errorFlag = false;
            errArray[index].errorMsg = '';
          } else {
            // check for numbers
            const numRegEx = /[0-9]\W/;
            if (numRegEx.test(text)) {
              compFields[index].errorFlag = true;
              errArray[index].errorMsg = 'Only letters characters are allowed.';
            } else if (constraint.minCharsFlag && constraint.maxCharsFlag) {
              // check for range
              if (text.length >= constraint.minChars && text.length <= constraint.maxChars) {
                compFields[index].errorFlag = false;
                errArray[index].errorMsg = '';
              } else {
                compFields[index].errorFlag = true;
                errArray[index].errorMsg = `Please enter number of characters between ${
                  constraint.minChars
                } (Min) and ${constraint.maxChars} (Max).`;
              }
            } else if (constraint.maxCharsFlag && !constraint.minCharsFlag) {
              // check for max
              if (text.length > constraint.maxChars) {
                compFields[index].errorFlag = true;
                errArray[index].errorMsg = `Max number of characters ${
                  constraint.maxChars
                } exceeded.`;
              } else {
                compFields[index].errorFlag = false;
                errArray[index].errorMsg = '';
              }
            } else if (constraint.minCharsFlag && !constraint.maxCharsFlag) {
              // check for min
              if (text.length < constraint.minChars) {
                compFields[index].errorFlag = true;
                errArray[index].errorMsg = `Min of ${
                  constraint.minChars
                } characters needed.`;
              } else {
                compFields[index].errorFlag = false;
                errArray[index].errorMsg = '';
              }
            } else {
              compFields[index].errorFlag = false;
              errArray[index].errorMsg = '';
            }
          }
        } else {
          compFields[index].errorFlag = true;
          errArray[index].errorMsg = 'This field is required.';
        }
      } else if (!constraint.numbersAllowed && !constraint.lettersAllowed && constraint.specialCharactersAllowed) { //eslint-disable-line
        // allow only spl chars
        if (text !== '') {
          if (this.regExp.test(text)) {
            compFields[index].errorFlag = false;
            errArray[index].errorMsg = '';
          } else {
            // check for numbers and letters
            const numRegEx = /[0-9a-zA-Z]/;
            if (numRegEx.test(text)) {
              compFields[index].errorFlag = true;
              errArray[index].errorMsg = 'Only special characters are allowed.';
            } else if (constraint.minCharsFlag && constraint.maxCharsFlag) {
              // check for range
              if (text.length >= constraint.minChars && text.length <= constraint.maxChars) {
                compFields[index].errorFlag = false;
                errArray[index].errorMsg = '';
              } else {
                compFields[index].errorFlag = true;
                errArray[index].errorMsg = `Please enter number of characters between ${
                  constraint.minChars
                } (Min) and ${constraint.maxChars} (Max).`;
              }
            } else if (constraint.maxCharsFlag && !constraint.minCharsFlag) {
              // check for max
              if (text.length > constraint.maxChars) {
                compFields[index].errorFlag = true;
                errArray[index].errorMsg = `Max number of characters ${
                  constraint.maxChars
                } exceeded.`;
              } else {
                compFields[index].errorFlag = false;
                errArray[index].errorMsg = '';
              }
            } else if (constraint.minCharsFlag && !constraint.maxCharsFlag) {
              // check for min
              if (text.length < constraint.minChars) {
                compFields[index].errorFlag = true;
                errArray[index].errorMsg = `Min of ${
                  constraint.minChars
                } characters needed.`;
              } else {
                compFields[index].errorFlag = false;
                errArray[index].errorMsg = '';
              }
            } else {
              compFields[index].errorFlag = false;
              errArray[index].errorMsg = '';
            }
          }
        } else {
          compFields[index].errorFlag = true;
          errArray[index].errorMsg = 'This field is required.';
        }
      } else if (!constraint.numbersAllowed && constraint.lettersAllowed && constraint.specialCharactersAllowed) { //eslint-disable-line
        // allow letters and spl chars
        if (text !== '') {
          if (this.regExp.test(text)) {
            compFields[index].errorFlag = false;
            errArray[index].errorMsg = '';
          } else {
            // check for numbers
            const numRegEx = /[0-9]/;
            if (numRegEx.test(text)) {
              compFields[index].errorFlag = true;
              errArray[index].errorMsg = 'Only letters and special characters are allowed.';
            } else if (constraint.minCharsFlag && constraint.maxCharsFlag) {
              // check for range
              if (text.length >= constraint.minChars && text.length <= constraint.maxChars) {
                compFields[index].errorFlag = false;
                errArray[index].errorMsg = '';
              } else {
                compFields[index].errorFlag = true;
                errArray[index].errorMsg = `Please enter number of characters between ${
                  constraint.minChars
                } (Min) and ${constraint.maxChars} (Max).`;
              }
            } else if (constraint.maxCharsFlag && !constraint.minCharsFlag) {
              // check for max
              if (text.length > constraint.maxChars) {
                compFields[index].errorFlag = true;
                errArray[index].errorMsg = `Max number of characters ${
                  constraint.maxChars
                } exceeded.`;
              } else {
                compFields[index].errorFlag = false;
                errArray[index].errorMsg = '';
              }
            } else if (constraint.minCharsFlag && !constraint.maxCharsFlag) {
              // check for min
              if (text.length < constraint.minChars) {
                compFields[index].errorFlag = true;
                errArray[index].errorMsg = `Min of ${
                  constraint.minChars
                } characters needed.`;
              } else {
                compFields[index].errorFlag = false;
                errArray[index].errorMsg = '';
              }
            } else {
              compFields[index].errorFlag = false;
              errArray[index].errorMsg = '';
            }
          }
        } else {
          compFields[index].errorFlag = true;
          errArray[index].errorMsg = 'This field is required.';
        }
      } else if (constraint.numbersAllowed && !constraint.lettersAllowed && constraint.specialCharactersAllowed) { // eslint-disable-line
        // allow numbers and spl chars
        if (text !== '') {
          if (this.regExp.test(text)) {
            compFields[index].errorFlag = false;
            errArray[index].errorMsg = '';
          } else {
            // check for numbers
            const numRegEx = /[a-zA-Z]/;
            if (numRegEx.test(text)) {
              compFields[index].errorFlag = true;
              errArray[index].errorMsg = 'Only numbers and special characters are allowed.';
            } else if (constraint.minCharsFlag && constraint.maxCharsFlag) {
              // check for range
              if (text.length >= constraint.minChars && text.length <= constraint.maxChars) {
                compFields[index].errorFlag = false;
                errArray[index].errorMsg = '';
              } else {
                compFields[index].errorFlag = true;
                errArray[index].errorMsg = `Please enter number of characters between ${
                  constraint.minChars
                } (Min) and ${constraint.maxChars} (Max).`;
              }
            } else if (constraint.maxCharsFlag && !constraint.minCharsFlag) {
              // check for max
              if (text.length > constraint.maxChars) {
                compFields[index].errorFlag = true;
                errArray[index].errorMsg = `Max number of characters ${
                  constraint.maxChars
                } exceeded.`;
              } else {
                compFields[index].errorFlag = false;
                errArray[index].errorMsg = '';
              }
            } else if (constraint.minCharsFlag && !constraint.maxCharsFlag) {
              // check for min
              if (text.length < constraint.minChars) {
                compFields[index].errorFlag = true;
                errArray[index].errorMsg = `Min of ${
                  constraint.minChars
                } characters needed.`;
              } else {
                compFields[index].errorFlag = false;
                errArray[index].errorMsg = '';
              }
            } else {
              compFields[index].errorFlag = false;
              errArray[index].errorMsg = '';
            }
          }
        } else {
          compFields[index].errorFlag = true;
          errArray[index].errorMsg = 'This field is required.';
        }
      }
      if (type === 'field') {
        this.errorMsgs = errArray;
        this.componentData.fields = compFields;
      }
      if (type === 'addField') {
        this.errorMsgsAdd = errArray;
        this.componentData.addFields = compFields;
      }
      this.$forceUpdate();
    },
    validateAllFields() {
      this.generateRegExp();
      const { fields } = this.componentData;
      const { addFields } = this.componentData;
      // field is not required but only partial data is filled
      const fieldsWithAns = _.filter(this.componentData.fields, field => field
        .label.trim().length > 0).length;
      const addFieldsWithAns = _.filter(this.componentData.addFields, field => field
        .label.trim().length > 0).length;
      if (fieldsWithAns === 0 && addFieldsWithAns === 0 && !this.componentData.required) {
        fields.forEach((field, index) => {
          this.componentData.fields[index].errorFlag = false;
          this.errorMsgs[index].errorMsg = '';
        });
        addFields.forEach((addField, index) => {
          this.componentData.addFields[index].errorFlag = false;
          this.errorMsgsAdd[index].errorMsg = '';
        });
        this.updateVueStore(false);
        // if field is required or if not all fields are entered
      } else {
        fields.forEach((field, index) => {
          if (field.label.trim().length > 0 || this.componentData.required) {
            this.checkForFieldErrors(field.label, index, 'field', this.errorMsgs, this.componentData.fields);
          } else {
            this.componentData.fields[index].errorFlag = false;
            this.errorMsgs[index].errorMsg = '';
          }
        });
        addFields.forEach((addField, index) => {
          if (addField.label.trim().length > 0 || this.componentData.required) {
            this.checkForFieldErrors(addField.label, index, 'addField', this.errorMsgsAdd, this.componentData.addFields);
          } else {
            this.componentData.addFields[index].errorFlag = false;
            this.errorMsgsAdd[index].errorMsg = '';
          }
        });
        const fieldErrs = _.filter(this.errorMsgs, field => field.errorMsg !== '');
        const addFieldErrs = _.filter(this.errorMsgsAdd, field => field.errorMsg !== '');
        if (fieldErrs.length > 0 || addFieldErrs.length > 0) {
          this.updateVueStore(true);
        } else {
          this.updateVueStore(false);
        }
      }
    },
    // update the VueStore for the component errorFlag
    updateVueStore(errorStatus) {
      // get the available edcFormErrors from localstorage set by VueStore
      this.$emit('formSubmittedFlag', false);
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
    fields: {
      handler() {
        this.componentData.fields = this.fields;
      },
    },
    addFields: {
      handler() {
        this.componentData.addFields = this.addFields;
      },
    },
    formSubmitted: {
      handler() {
        this.componentData.addFields = this.addFields;
        this.validateAllFields();
      },
      deep: true,
    },
  },
};
</script>

<style scoped lang="scss">
.iconColor {
  color: lightgrey;
}

.error-style {
  color: #ff4848;
}

.is-danger {
  border-color: #ff4848;
}

.additionalFieldInput {
  width: 90%;
}

.additionalFieldIcon {
  position: absolute;
  top: 15px;
  right: 15px;
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
