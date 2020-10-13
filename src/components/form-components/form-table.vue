<template>
  <div class="primaryBackGround">
    <div class="formTable form-bg">
      <b-form @submit.prevent="validateBeforeSubmit" class="pt-16 pl-20 pb-20">
        <label for="formTableQuestion" class="sequence-style"><b>{{formTable.sequence}}. </b></label>
        <!-- form Table question -->
        <b-row class="pl-15 pr-15 pb-15 pt-0">
          <b-form-input id="formTableQuestion" type="text" class="fs-15 ml-10 form-control field-h40" v-model="formTable.body" placeholder="Enter question or description" size="sm" v-bind:class="{'is-danger': validateQuestion}" v-on:keyup.native="validateQuestionText" autocomplete="off">
          </b-form-input>
          <span v-if="validateQuestion" class="error-style ml-10">Question cannot be empty.</span>
        </b-row>
        <b-row class="pr-15 pb-15 pl-10 pt-0">
          <b-col align-self="center" v-for="(field, index) in formTable.fields" :key="index" class="pt-10 pr-0" cols="4">
            <b-form-input type="text" v-model="field.label" :placeholder="formTable.placeholder" size="sm" class="fs-15 field-h40 form-control" autocomplete="off" :disabled="true">
            </b-form-input>
            <!-- <span v-if="validateOption && (errorOptionsCount == formTable.fields.length) && (index == 0)" class="error-style">At least one answer option must be entered.</span>
                <span v-if="validateOption && (errorOptionsCount != formTable.fields.length) && (index == 0)" class="error-style">Answer cannot be empty.</span>
                <span v-if="field.errorFlag && index > 0" class="error-style">Answer cannot be empty.</span> -->
          </b-col>
        </b-row>
      </b-form>
      <hr class="m-0">
      <b-row class="pt-15 pl-35 fs-13">
        <b-col cols="12" lg="4" class="pt-10 pl-0">
          <div class="bright">
            <div class="pb-10">
              <b class="fs-13">Allowed Characters</b><br></div>
            <b-row>
              <b-form-checkbox v-model="formTable.constraint.lettersAllowed" id="tableLettersAllowed" class="pl-0">
              </b-form-checkbox>
              <label for="tableLettersAllowed" class="pl-8 pt-2 text-align fs-15">Letters(abc)</label>
            </b-row>
            <b-row>
              <b-form-checkbox v-model="formTable.constraint.numbersAllowed" id="tableNumbersAllowed" class="pl-0">
              </b-form-checkbox>
              <label for="tableNumbersAllowed" class="pl-8 pt-2 text-align fs-15">Numbers(123)</label>
            </b-row>
            <b-row>
              <b-form-checkbox v-model="formTable.constraint.specialCharactersAllowed" id="tableSpecialCharsAllowed" class="pl-0">
              </b-form-checkbox>
              <label for="tableSpecialCharsAllowed" class="pl-8 pt-2 text-align fs-15">Special characters(!@#)</label>
            </b-row>
          </div>
        </b-col>
        <b-col cols="12" lg="2" class="pt-10 pl-0">
          <div class="bright mln-5">
            <div class="pb-10">
              <label for="tableNoOfFieldsSelect" class="font-weight-bold mb-0 fs-13"># of fields</label>
            </div>
            <b-row class="fs-12">
              <b-col cols="4" lg="2">
                <b-form-select id="tableNoOfFieldsSelect" v-model="formTable.noOfFields" class="mb-5 fs-12 field-select" size="sm" @change="changeFields">
                  <option v-for="(field, index) in noOfFields" :key="index" :value="field">{{field}}
                  </option>
                </b-form-select>
              </b-col>
            </b-row>
          </div>
        </b-col>
        <!-- For text constraints -->
        <b-col cols="12" lg="6" class="pt-10 pl-4" v-if="formTable.constraint.lettersAllowed || formTable.constraint.specialCharactersAllowed">
          <div class="pb-10">
            <b>Character Text</b>
          </div>
          <b-row>
            <b-col cols="12" lg="6" class="pl-0">
              <switches id="scaleMinCharacters" v-model="formTable.constraint.minCharsFlag" theme="custom" color="blue" @change="formTable.constraint.minCharsFlag = !formTable.constraint.minCharsFlag"></switches>
              <span for="scaleMinCharacters" class="pl-8 fs-15">Min characters</span>
              <b-col cols="12" lg="10" class="pull-right">
                <b-form-input type="number" min="0" class="fs-15 form-control field-h40 mt-10" placeholder="0" v-model="formTable.constraint.minChars" v-if="formTable.constraint.minCharsFlag" size="sm" v-validate="{regex: /^\d+$/, required: true}" name="charMin" v-bind:class="{'input': true, 'is-danger': errors.has('charMin')}" autocomplete="off">
                </b-form-input>
              </b-col>
            </b-col>
            <b-col cols="12" lg="6" class="pl-0">
              <switches id="scaleMaxCharacters" v-model="formTable.constraint.maxCharsFlag" theme="custom" color="blue" @change="formTable.constraint.maxCharsFlag = !formTable.constraint.maxCharsFlag"></switches>
              <span for="scaleMaxCharacters" class="pl-8 fs-15">Max characters</span>
              <b-col cols="12" lg="10" class="pull-right">
                <b-form-input type="number" class="fs-15 form-control field-h40" min="0" placeholder="250" v-model="formTable.constraint.maxChars" v-if="formTable.constraint.maxCharsFlag" size="sm" v-validate="{regex: /^\d+$/, required: true}" name="charMax" v-bind:class="{'input': true, 'is-danger': errors.has('charMax')}" autocomplete="off">
                </b-form-input>
              </b-col>
            </b-col>
          </b-row>
        </b-col>
        <!-- For Numeric constraints -->
        <b-col cols="12" lg="6" class="pt-10 pl-4" v-if="!formTable.constraint.lettersAllowed && !formTable.constraint.specialCharactersAllowed && formTable.constraint.numbersAllowed">
          <div class="pb-10">
            <b>Validation</b>
          </div>
          <b-row>
            <b-col cols="12" lg="4" class="pl-0">
              <switches v-model="formTable.constraint.minLimitFlag" theme="custom" color="blue" @change="formTable.constraint.minLimitFlag = !formTable.constraint.minLimitFlag"></switches>
              <span class="pl-8 fs-15">Min value</span>
              <b-col cols="12" lg="10" class="pull-right">
                <b-form-input type="number" class="fs-12" placeholder="0" min="0" v-model="formTable.constraint.minLimit" v-if="formTable.constraint.minLimitFlag" size="sm" v-validate="{regex: /^\d+$/, required: true}" name="numberMin" v-bind:class="{'input': true, 'is-danger': errors.has('numberMin')}" autocomplete="off">
                </b-form-input>
              </b-col>
            </b-col>
            <b-col cols="12" lg="4" class="pl-0">
              <switches v-model="formTable.constraint.maxLimitFlag" theme="custom" color="blue" @change="formTable.constraint.maxLimitFlag = !formTable.constraint.maxLimitFlag"></switches>
              <span class="pl-8 fs-15">Max value</span>
              <b-col cols="12" lg="10" class="pull-right">
                <b-form-input type="number" class="fs-12" placeholder="10" min="0" v-model="formTable.constraint.maxLimit" v-if="formTable.constraint.maxLimitFlag" size="sm" v-validate="{regex: /^\d+$/, required: true}" name="numberMax" v-bind:class="{'input': true, 'is-danger': errors.has('numberMax')}" autocomplete="off">
                </b-form-input>
              </b-col>
            </b-col>
            <b-col cols="12" lg="4" class="pl-0">
              <switches v-model="formTable.constraint.decimalLimitFlag" theme="custom" color="blue" @change="formTable.constraint.decimalLimitFlag  = !formTable.constraint.decimalLimitFlag "></switches>
              <span class="pl-8 fs-15"># of decimal places</span>
              <b-col cols="12" lg="10" class="pull-right">
                <b-form-input type="number" class="fs-12" placeholder="4" min="0" v-model="formTable.constraint.decimalLimit" v-if="formTable.constraint.decimalLimitFlag" size="sm" v-validate="{regex: /^\d+$/, required: true}" name="numberDecimals" v-bind:class="{'input': true, 'is-danger': errors.has('numberDecimals')}" autocomplete="off">
                </b-form-input>
              </b-col>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
      <b-row class="fs-13 pl-35 pt-15 font-weight-bold">
        <label for="tableAnswerField">Placeholder</label>
      </b-row>
      <b-row class="fs-12 pl-20">
        <b-col cols="8" lg="8">
          <b-form-input v-model="formTable.placeholder" id="tableAnswerField" type="text" class="fs-15 form-control field-h40" placeholder="Enter your answer here" size="sm" autocomplete="off" v-bind:class="{'is-danger': validateAnswer}" v-on:keyup.native="validatePlaceholderText()">
          </b-form-input>
          <span v-if="validateAnswer" class="error-style">Placeholder cannot be empty.</span>
        </b-col>
      </b-row>
      <b-row class="mt-30 pl-35 fs-12">
        <b-form-checkbox v-model="formTable.additionalFields" id="tableAllowAddFields" class="pl-0"> </b-form-checkbox>
        <label for="tableAllowAddFields" class="pl-8 fs-15 text-align">Allow form user to add additional fields.</label>
      </b-row>
      <b-row class="fs-12 pl-56" v-if="formTable.additionalFields">
        <b-col cols="12" lg="5" align-self="center" class="pl-0 font-weight-bold">
          <span for="maxNoSelect" class="mb-0 fs-13">Max # of fields</span>
          <div class="pt-10 pb-15 pl-12">
            <b-form-select v-model="formTable.maxFields" id="maxNoSelect" class="field-h40 mb-5 fs-15 field-select from-control" size="sm">
              <option v-for="(field, index) in maxNoOfFields" :key="index" :value="field">{{field}}
              </option>
            </b-form-select>
          </div>
        </b-col>
      </b-row>
      <b-row class="pb-15">
        <b-col cols="12" class="p-0">
          <hr>
        </b-col>
        <b-col cols="12" align-self="center" class="pull-right">
          <i class="fa fa-trash-o fs-18 pull-left pl-20 pt-5 iconColor cursor_pointer" aria-hidden="true" @click="deleteComponent()"></i>
          <button class="primary-btn br-1 fs-12 pull-right" @click="validateBeforeSubmit()">Save</button>
          <button class="plain-btn br-1 fs-12 pull-right mr-10" @click="cancelComponent(formTable.order)" v-if="formTable.mode == 'edit'">Cancel</button>
        </b-col>
      </b-row>
    </div>
  </div>
</template>
<script>
import _ from 'lodash';
import cloneDeep from 'lodash/cloneDeep';
import find from 'lodash/find';
import schemas from '../../data/form-components-json/schemas.json';

export default {
  name: 'form-table',
  data() {
    return {
      formTable: {},
      validateQuestion: false,
      validateAnswer: false,
      noOfFields: [3, 6, 9, 12],
      maxNoOfFields: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      validateMinMaxOption: false,
      fieldSchema: cloneDeep(
        find(schemas, ['fieldType', 'formTable']).schemas.fieldSchema,
      ),
    };
  },
  props: ['formTableSchema', 'formData'],
  beforeMount() {
    this.formTable = this.formTableSchema;
  },
  computed: {},
  methods: {
    // change the table fields based on the no of fields
    changeFields(fieldNo) {
      if (fieldNo > this.formTable.fields.length) {
        const diffFields = fieldNo - this.formTable.fields.length;
        for (let index = diffFields; index > 0; index--) {
          this.formTable.fields.push(this.fieldSchema);
        }
      } else if (fieldNo < this.formTable.fields.length) {
        const diffFields = this.formTable.fields.length - fieldNo;
        this.formTable.fields.splice(fieldNo, diffFields);
      }
    },

    // Validation for form table question text
    validateQuestionText() {
      if (this.formTable && this.formTable.body && this.formTable.body.length) {
        this.validateQuestion = false;
      } else {
        this.validateQuestion = true;
      }
    },

    // validate min, max
    validateMinMax() {
      this.validateMinMaxOption = false;
      // if (this.scale.options[this.scale.options.length - 1].commentField) {
      if (
        !this.formTable.constraint.lettersAllowed
        && !this.formTable.constraint.specialCharactersAllowed
        && !this.formTable.constraint.numbersAllowed
      ) {
        this.validateMinMaxOption = true;
        this.$toastr.error('You have to select atleast any one of the allowed characters.');
        // check for characters in case of letters or special characters and numbers are selected
      } else if (
        this.formTable.constraint.lettersAllowed
        || this.formTable.constraint.specialCharactersAllowed
      ) {
        if (this.formTable.constraint.minCharsFlag && this.formTable.constraint.maxCharsFlag) {
          if (
            parseInt(this.formTable.constraint.maxChars, 0) >= 0
            && parseInt(this.formTable.constraint.minChars, 0) >= 0
            && parseInt(this.formTable.constraint.maxChars, 0)
              <= parseInt(this.formTable.constraint.minChars, 0)
          ) {
            this.validateMinMaxOption = true;
            this.$toastr.error('Max value cannot be less than or equal to min value.');
          }
        }
        // check for values in case of only numbers is selected
      } else {
        this.validateMinMaxOption = false;
        if (
          this.formTable.constraint.minLimitFlag
          && this.formTable.constraint.maxLimitFlag
          && !this.validateMinMaxOption
        ) {
          if (
            parseInt(this.formTable.constraint.maxLimit, 0) >= 0
            && parseInt(this.formTable.constraint.minLimit, 0) >= 0
            && parseInt(this.formTable.constraint.maxLimit, 0)
              <= parseInt(this.formTable.constraint.minLimit, 0)
          ) {
            this.validateMinMaxOption = true;
            this.$toastr.error('Max value cannot be less than or equal to min value.');
          }
        }
      }
      // }
    },

    // Validate for formTable placeholder text
    validatePlaceholderText() {
      if (this.formTable && this.formTable.placeholder && this.formTable.placeholder.length > 0) {
        this.validateAnswer = false;
      } else {
        this.validateAnswer = true;
      }
    },

    validateBeforeSubmit() {
      this.validateQuestionText();
      // this.validateAllOptions();
      this.validatePlaceholderText();
      this.validateMinMax();

      // this.formTable.fields.forEach((field, ind) => {
      //   let tempErrorFlag = false;
      //   if (field.label.length < 1) {
      //     tempErrorFlag = true;
      //   }
      //   this.formTable.fields[ind].errorFlag = tempErrorFlag;
      // });

      this.$validator.validateAll().then(result => {
        // this.errorOptionsCount = _.filter(this.formTable.fields, { errorFlag: true }).length;
        const formArray = _.filter(this.formData, o => o.fieldName && o.fieldName.length > 0);
        const fieldNames = _.map(formArray, 'fieldName');
        if (_.compact(_.uniq(fieldNames)).length === _.compact(fieldNames).length) {
          if (
            !result
            || this.validateQuestion
            || this.validateAnswer
            || this.validateMinMaxOption
            // this.errorOptionsCount
          ) {
            //   this.$toastr.error('Please fill the error fields.');
          } else {
            this.formTable.mode = 'saved';
            this.formTable.fieldNameErrorMsg = '';
            this.$emit('save', this.formTable);
          }
        } else {
          this.formTable.fieldNameErrorMsg = 'Please enter unique field name.';
        }
      });
    },

    deleteComponent() {
      this.$emit('deleteComponent', this.formTable);
    },

    cancelComponent(sequence) {
      this.$emit('cancelComponent', sequence);
    },
  },
};
</script>
<style scoped lang="scss">
.primaryBackGround {
  background-color: white;
  padding: 20px;
}

.formTable {
  position: relative;
  border: 0.5px solid lightgray;
  border-radius: 2px;
}

.iconColor {
  color: lightgrey;
}

.error-style {
  font-size: 12px;
  color: #ff4848;
  padding-bottom: 5px;
}

.is-danger {
  border-color: #ff4848;
}

.sequence-style {
  position: absolute;
  top: 20px;
}

.bright {
  border-right: 0.5px solid lightgrey;
}

.field-select {
  width: 80px;
  /* height: 40px !important; */
  margin-left: -12px;
}

/deep/.vue-switcher-theme--custom.vue-switcher-color--blue div {
  background-color: #1e8fe1;
  height: 9px;
  width: 33px;
}

/deep/.vue-switcher-theme--custom.vue-switcher-color--blue div:after {
  background-color: #ffffff;
  border: 1px solid #1e8fe1;
  height: 15px;
  width: 15px;
  margin-left: -15px;
}

/deep/.vue-switcher-theme--custom.vue-switcher-color--blue.vue-switcher--unchecked div {
  background-color: #d5d7dc;
  height: 9px;
  width: 33px;
}

/deep/.vue-switcher-theme--custom.vue-switcher-color--blue.vue-switcher--unchecked div:after {
  background-color: #ffffff;
  border: 1px solid #1e8fe1;
  height: 15px;
  width: 15px;
}

.pl-56 {
  padding-left: 56px !important;
}

.mln-5 {
  margin-left: -5px;
}
</style>
