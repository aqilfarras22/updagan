<template>
  <div class="primaryBackGround">
    <div class="dropDown">
      <b-form @submit.prevent="validateBeforeSubmit" class="pt-16 pl-20 pb-10">
        <span class="sequence-style"><b>{{dropDown.sequence}}. </b></span>
        <!-- Drop down question -->
        <b-row class="pl-15 pr-15 pt-0 mb-20">
          <b-form-input type="text" class="fs-15 form-control ml-10 field-h40" v-model="dropDown.body" placeholder="Enter question or description" size="sm" name="dropDownQues" v-bind:class="{'is-danger': validateQuestion}" v-on:keyup.native="validateQuestionText" autocomplete="off">
          </b-form-input>
          <span v-if="validateQuestion" class="error-style ml-10">Question cannot be empty.</span>
        </b-row>
        <!-- Select options -->
        <b-row v-for="(choice, index) in dropDown.options" :key="index">
          <b-col cols="11" v-if="choice.type !== 'Other'">
            <b-form-input type="text" class="fs-15 form-control mb-5 ml-10 field-h40" v-model="choice.label" placeholder="Enter an answer option" size="sm" v-bind:class="{'is-danger': choice.errorFlag }" autocomplete="off" v-on:keyup.native="validateAllOptions()">
            </b-form-input>
              <span v-if="choice.errorFlag" class="error-style pl-10">{{choice.errorFlag}}</span>
              <!-- <span v-if="validateOption && (errorOptionsCount == dropDown.options.length) && (index == 0)" class="error-style">At least one answer option must be entered.</span>
              <span v-if="validateOption && (errorOptionsCount != dropDown.options.length) && (index == 0)" class="error-style">Answer cannot be empty.</span>
              <span v-if="choice.errorFlag && index > 0" class="error-style">Answer cannot be empty.</span> -->
          </b-col>
          <b-col cols="1" align-self="center" class="pl-0 pr-0 mtn-10" v-if="choice.type !== 'Other'">
            <i class="fa fa-plus-circle fs-18 pr-5 iconColor cursor_pointer" @click="addChoice(index)" aria-hidden="true"></i>
            <i class="fa fa-minus-circle fs-18 iconColor cursor_pointer" @click="removeChoice(index)" aria-hidden="true"></i>
          </b-col>
        </b-row>
      </b-form>
      <!-- Other option check mark -->
      <hr class="m-0">
      <b-row class="pl-35 pt-10 fs-12">
        <b-form-checkbox @change="dropDown.otherOptionField = !dropDown.otherOptionField, addOtherOption()" v-model="dropDown.otherOptionField" class="pl-0">
          <span class="pl-25 text-align fs-15 text-color">Add an 'Other' answer option or content field.</span>
        </b-form-checkbox><br>
      </b-row>
      <!-- Label for other option -->
      <b-row v-if="dropDown.otherOptionField" class="pl-56 pt-20">
        <b-col cols="12" lg="5" align-self="center" class="fs-13 pl-0">
          <b>Label</b><br>
          <div class="pt-5 pb-30">
            <b-form-input type="text" placeholder="Other" class="fs-15 form-control field-h40" v-model="otherOptionData.label" size="sm" v-on:keyup.native="validateOtherOptionLabel()" v-bind:class="{'is-danger': validateOtherOptionText}">
            </b-form-input>
            <span v-if="validateOtherOptionText" class="error-style">Please provide other option label.</span>
          </div>
        </b-col>
        <!-- Comment field for other option -->
        <b-col cols="12" lg="8" align-self="center" class="fs-12 pl-0">
          <b-form-checkbox @change="otherOptionData.commentField = !otherOptionData.commentField, addCommentFieldSchema()" v-model="otherOptionData.commentField" class="pl-0 pb-20">
            <span class="pl-25 text-align fs-15 text-color">Provide comment field if "{{otherOptionData.label}}" is selected.</span>
          </b-form-checkbox><br>
          <div v-if="otherOptionData.commentField" class="pt-10 fs-13 text-color">
            <b>If left blank, display this error message:</b><br>
            <div class="pt-5">
              <b-form-input type="text" class="fs-15 mb-10 form-control field-h40" placeholder="Please fill the comments field" v-model="commentFieldTempData.errorMessage" size="sm" v-bind:class="{'is-danger': validateCommentErrorField}" v-on:keyup.native="validateOtherOptionCommentErrorField">
              </b-form-input>
              <span v-if="validateCommentErrorField" class="error-style">Comment field cannot be empty.</span>
            </div>
          </div>
        </b-col>
        <b-col lg="3">
        </b-col>
        <!-- Constraints for the other option comment field -->
        <b-col cols="12" lg="4" class="pt-10 pl-0 fs-12" v-if="otherOptionData.commentField">
          <div class="bright">
            <div class="pb-10">
              <b class="fs-13">Allowed Characters</b><br>
            </div>
            <b-row class="mb-10">
              <b-form-checkbox @change="commentFieldTempData.constraint.lettersAllowed = !commentFieldTempData.constraint.lettersAllowed" v-model="commentFieldTempData.constraint.lettersAllowed" class="pl-0">
              </b-form-checkbox>
              <div class="pl-8 text-align fs-15">Letters(abc)</div>
            </b-row>
            <b-row class="mb-10">
              <b-form-checkbox @change="commentFieldTempData.constraint.numbersAllowed = !commentFieldTempData.constraint.numbersAllowed" v-model="commentFieldTempData.constraint.numbersAllowed" class="pl-0">
              </b-form-checkbox><br>
              <div class="pl-8 text-align fs-15">Numbers(123)</div>
            </b-row>
            <b-row class="mb-10">
              <b-form-checkbox @change="commentFieldTempData.constraint.specialCharactersAllowed = !commentFieldTempData.constraint.specialCharactersAllowed" v-model="commentFieldTempData.constraint.specialCharactersAllowed" class="pl-0">
              </b-form-checkbox><br>
              <div class="pl-8 text-align fs-15">Special characters(!@#)</div>
            </b-row>
          </div>
        </b-col>
        <b-col cols="12" lg="8" class="pt-10 pl-4 fs-12" v-if="otherOptionData.commentField && (commentFieldTempData.constraint.lettersAllowed || commentFieldTempData.constraint.specialCharactersAllowed)">
          <div class="pb-10">
            <b>Character Text</b>
          </div>
          <b-row>
            <b-col cols="12" lg="5" class="pl-0 pb-10">
              <switches v-model="commentFieldTempData.constraint.minCharsFlag" theme="custom" color="blue" @change="commentFieldTempData.constraint.minCharsFlag = !commentFieldTempData.constraint.minCharsFlag"></switches>
              <span class="pl-8 fs-15">Min Characters</span>
              <b-col cols="12" lg="10" class="pull-right">
                <b-form-input type="number" class="fs-15 form-control field-h40" min="0" placeholder="0" v-model="commentFieldTempData.constraint.minChars" v-if="commentFieldTempData.constraint.minCharsFlag" size="sm" v-validate="{regex: /^\d+$/, required: true}" name="charMin" v-bind:class="{'input': true, 'is-danger': errors.has('charMin')}">
                </b-form-input>
              </b-col>
            </b-col>
            <b-col cols="12" lg="5" class="pl-0">
              <switches v-model="commentFieldTempData.constraint.maxCharsFlag" theme="custom" color="blue" @change="commentFieldTempData.constraint.maxCharsFlag = !commentFieldTempData.constraint.maxCharsFlag"></switches>
              <span class="pl-8 fs-15">Max Characters</span>
              <b-col cols="12" lg="10" class="pull-right">
                <b-form-input type="number" class="fs-15 form-control field-h40" min="0" placeholder="250" v-model="commentFieldTempData.constraint.maxChars" v-if="commentFieldTempData.constraint.maxCharsFlag" size="sm" v-validate="{regex: /^\d+$/, required: true}" name="charMax" v-bind:class="{'input': true, 'is-danger': errors.has('charMax')}">
                </b-form-input>
              </b-col>
            </b-col>
          </b-row>
        </b-col>
        <b-col cols="12" lg="8" class="pt-10 pl-4 fs-12" v-if="otherOptionData.commentField && !commentFieldTempData.constraint.lettersAllowed && !commentFieldTempData.constraint.specialCharactersAllowed && commentFieldTempData.constraint.numbersAllowed">
          <div class="pb-10">
            <b>Validation</b>
          </div>
          <b-row>
            <b-col cols="12" lg="3" class="pl-0">
              <switches v-model="commentFieldTempData.constraint.minLimitFlag" theme="custom" color="blue" @change="commentFieldTempData.constraint.minLimitFlag = !commentFieldTempData.constraint.minLimitFlag"></switches>
              <span class="pl-4">Min value</span>
              <b-col cols="12" lg="10" class="pull-right">
                <b-form-input type="number" class="fs-12" placeholder="0" min="0" v-model="commentFieldTempData.constraint.minLimit" v-if="commentFieldTempData.constraint.minLimitFlag" size="sm" v-validate="{regex: /^\d+$/, required: true}" name="numberMin" v-bind:class="{'input': true, 'is-danger': errors.has('numberMin')}">
                </b-form-input>
              </b-col>
            </b-col>
            <b-col cols="12" lg="4" class="pl-0">
              <switches v-model="commentFieldTempData.constraint.maxLimitFlag" theme="custom" color="blue" @change="commentFieldTempData.constraint.maxLimitFlag = !commentFieldTempData.constraint.maxLimitFlag"></switches>
              <span class="pl-5">Max value</span>
              <b-col cols="12" lg="10" class="pull-right">
                <b-form-input type="number" class="fs-12" placeholder="10" min="0" v-model="commentFieldTempData.constraint.maxLimit" v-if="commentFieldTempData.constraint.maxLimitFlag" size="sm" v-validate="{regex: /^\d+$/, required: true}" name="numberMax" v-bind:class="{'input': true, 'is-danger': errors.has('numberMax')}">
                </b-form-input>
              </b-col>
            </b-col>
            <b-col cols="12" lg="5" class="pl-0">
              <switches v-model="commentFieldTempData.constraint.decimalLimitFlag" theme="custom" color="blue" @change="commentFieldTempData.constraint.decimalLimitFlag = !commentFieldTempData.constraint.decimalLimitFlag"></switches>
              <span class="pl-5"># of decimal places</span>
              <b-col cols="12" lg="10" class="pull-right">
                <b-form-input type="number" class="fs-12" placeholder="4" min="0" v-model="commentFieldTempData.constraint.decimalLimit" v-if="commentFieldTempData.constraint.decimalLimitFlag" size="sm" v-validate="{regex: /^\d+$/, required: true}" name="numberDecimals" v-bind:class="{'input': true, 'is-danger': errors.has('numberDecimals')}">
                </b-form-input>
              </b-col>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
      <hr class="m-0 pb-13 mt-10">
      <b-row class="pb-15">
        <b-col cols="12" align-self="center" class="pull-right">
          <i class="fa fa-trash-o fs-18 pull-left iconColor cursor_pointer pl-20 pt-5" aria-hidden="true" @click="deleteComponent()"></i>
          <button class="primary-btn pull-right" @click="validateBeforeSubmit()">Save</button>
          <button class="plain-btn br-1 fs-12 pull-right mr-10" @click="cancelComponent(dropDown.order)" v-if="dropDown.mode == 'edit'">Cancel</button>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import cloneDeep from 'lodash/cloneDeep';
import filter from 'lodash/filter';
import find from 'lodash/find';

import schemas from '../../data/form-components-json/schemas.json';

export default {
  name: 'drop-down',
  components: {},
  data() {
    return {
      dropDown: {},
      validateQuestion: false,
      validateOption: false,
      validateOtherOptionText: false,
      validateCommentErrorField: false,
      validateMinMaxOption: false,
      errorOptionsCount: 0,
      commentFieldTempData: {},
      choiceSchema: find(schemas, 'fieldType', 'DropDown').schemas.choiceSchema,
      otherOptionSchema: find(schemas, 'fieldType', 'DropDown').schemas.otherOptionSchema,
      commentFieldSchema: find(schemas, 'fieldType', 'DropDown').schemas.commentFieldSchema,
    };
  },
  props: ['dropdownSchema', 'formData'],
  mounted() {
    this.dropDown = this.dropdownSchema;

    // check for other type option and maintain otherOptionField flag as it is not saved in DB
    if (this.dropdownSchema.options[this.dropdownSchema.options.length - 1].type === 'Other') {
      this.dropdownSchema.otherOptionField = true;
    }

    // check for the comment field flag and copy to temp comment field data
    if (
      this.dropdownSchema.otherOptionField
      && this.dropdownSchema.options[this.dropdownSchema.options.length - 1].commentField
    ) {
      this.commentFieldTempData = this.dropdownSchema.options[
        this.dropdownSchema.options.length - 1
      ].comment;
    }

    // add errorFlag to all options as we will not save the errorFlag in DB
    const tempOptions = [];
    this.dropDown.options.forEach(option => {
      const tempOption = option;
      tempOption.errorFlag = false;
      tempOptions.push(tempOption);
    });
    this.dropDown.options = tempOptions;
  },
  methods: {
    // Add choice or option
    addChoice(index) {
      const choiceSchema = cloneDeep(this.choiceSchema);
      this.dropDown.options.splice(index + 1, 0, choiceSchema);
      this.dropDown.options[index + 1].index = this.dropDown.options.length;
      this.dropDown.options.forEach((choice, ind) => {
        this.dropDown.options[ind].index = ind;
      });
    },

    // Remove the selected option field
    removeChoice(index) {
      if (this.dropDown.options.length <= 1) {
        this.$toastr.error('At least one answer option must be entered.');
      } else {
        this.dropDown.options.splice(index, 1);
      }
    },

    // add or remove other option shcema to drop down schema
    addOtherOption() {
      if (this.dropDown.otherOptionField) {
        const otherOptionSchema = cloneDeep(this.otherOptionSchema);
        this.dropDown.options.push(otherOptionSchema);
        this.dropDown.options.forEach((choice, ind) => {
          this.dropDown.options[ind].index = ind;
        });
      } else {
        this.dropDown.options.forEach((choice, ind) => {
          if (choice.type === 'Other') {
            this.dropDown.options.splice(ind, 1);
          }
        });
      }
    },

    // add or remove other option comment field shcema to drop down schema
    addCommentFieldSchema() {
      this.commentFieldTempData = cloneDeep(this.commentFieldSchema);
    },

    // Validate for dropdown question text
    validateQuestionText() {
      if (this.dropDown && this.dropDown.body && this.dropDown.body.length) {
        this.validateQuestion = false;
      } else {
        this.validateQuestion = true;
      }
    },

    // Validate for other option label
    validateOtherOptionLabel() {
      if (this.dropDown && this.dropDown.otherOptionField) {
        if (this.dropDown.options[this.dropDown.options.length - 1].label.length) {
          this.validateOtherOptionText = false;
        } else {
          this.validateOtherOptionText = true;
        }
      } else {
        this.validateOtherOptionText = false;
      }
    },

    // validate other option comment if not entered display error message
    validateOtherOptionCommentErrorField() {
      if (
        this.dropDown
        && this.dropDown.otherOptionField
        && this.dropDown.options[this.dropDown.options.length - 1].commentField
      ) {
        if (this.commentFieldTempData.errorMessage.length) {
          this.validateCommentErrorField = false;
        } else {
          this.validateCommentErrorField = true;
        }
      } else {
        this.validateCommentErrorField = false;
      }
    },

    // validate min, max value for comment field validation
    validateMinMax() {
      this.validateMinMaxOption = false;
      if (this.dropDown.options[this.dropDown.options.length - 1].commentField) {
        if (
          !this.commentFieldTempData.constraint.lettersAllowed
          && !this.commentFieldTempData.constraint.specialCharactersAllowed
          && !this.commentFieldTempData.constraint.numbersAllowed
        ) {
          this.validateMinMaxOption = true;
          this.$toastr.error('You have to select atleast any one of the allowed characters.');
          // check for characters in case of letters or special characters and numbers are selected
        } else if (
          this.commentFieldTempData.constraint.lettersAllowed
          || this.commentFieldTempData.constraint.specialCharactersAllowed
        ) {
          if (
            this.commentFieldTempData.constraint.minCharsFlag
            && this.commentFieldTempData.constraint.maxCharsFlag
          ) {
            if (
              parseInt(this.commentFieldTempData.constraint.maxChars, 0) >= 0
              && parseInt(this.commentFieldTempData.constraint.minChars, 0) >= 0
              && parseInt(this.commentFieldTempData.constraint.maxChars, 0)
                <= parseInt(this.commentFieldTempData.constraint.minChars, 0)
            ) {
              this.validateMinMaxOption = true;
              this.$toastr.error('Max value cannot be less than or equal to min value.');
            }
          }
          // check for values in case of only numbers is selected
        } else {
          this.validateMinMaxOption = false;
          if (
            this.commentFieldTempData.constraint.minLimitFlag
            && this.commentFieldTempData.constraint.maxLimitFlag
            && !this.validateMinMaxOption
          ) {
            if (
              parseInt(this.commentFieldTempData.constraint.maxLimit, 0) >= 0
              && parseInt(this.commentFieldTempData.constraint.minLimit, 0) >= 0
              && parseInt(this.commentFieldTempData.constraint.maxLimit, 0)
                <= parseInt(this.commentFieldTempData.constraint.minLimit, 0)
            ) {
              this.validateMinMaxOption = true;
              this.$toastr.error('Max value cannot be less than or equal to min value.');
            }
          }
        }
      }
    },

    validateAllOptions() {
      const options = filter(this.dropDown.options, option => option.label.trim().length > 0);
      if (options.length <= 0) {
        this.dropDown.options[0].errorFlag = 'At least one answer option must be entered.';
      } else {
        this.dropDown.options[0].errorFlag = false;
      }
    },

    // Validate and submit the drop down to parent form design component
    validateBeforeSubmit() {
      // validate the form requirements
      this.validateQuestionText();
      this.validateOtherOptionLabel();
      this.validateMinMax();
      this.validateOtherOptionCommentErrorField();
      this.validateAllOptions();

      this.$validator.validateAll().then(result => {
        this.errorOptionsCount = filter(this.dropDown.options,
          option => option.errorFlag !== false).length;
        const formArray = _.filter(this.formData, o => o.fieldName && o.fieldName.length > 0);
        const fieldNames = _.map(formArray, 'fieldName');
        if (_.compact(_.uniq(fieldNames)).length === _.compact(fieldNames).length) {
          if (
            !result
            || this.validateOtherOptionText
            || this.errorOptionsCount
            || this.validateQuestion
            || this.validateCommentErrorField
            || this.validateMinMaxOption
          ) {
            //   this.$toastr.error('Please fill the error fields.');
          } else {
            this.dropDown.mode = 'saved';
            this.dropDown.options = filter(this.dropDown.options,
              option => option.label.trim().length > 0);
            if (this.dropDown.options[this.dropDown.options.length - 1].commentField) {
              this.dropDown.options[
                this.dropDown.options.length - 1
              ].comment = this.commentFieldTempData;
              this.commentFieldTempData = {};
            }
            this.dropDown.fieldNameErrorMsg = '';
            this.$emit('save', this.dropDown);
          }
        } else {
          this.dropDown.fieldNameErrorMsg = 'Please enter unique field name.';
        }
      });
    },

    deleteComponent() {
      this.$emit('deleteComponent', this.dropDown);
    },

    cancelComponent(sequence) {
      this.$emit('cancelComponent', sequence);
    },
  },
  computed: {
    otherOptionData() {
      let returnFlag = {};
      if (this.dropDown.otherOptionField) {
        returnFlag = this.dropDown.options[this.dropDown.options.length - 1];
      }
      return returnFlag;
    },
  },
};
</script>

<style scoped lang="scss">
.primaryBackGround {
  background-color: white;
  padding: 20px;
}

.sequence-style {
  position: absolute;
  top: 20px;
}

.dropDown {
  position: relative;
  background-color: #f5f6f7;
  border: 0.5px solid lightgray;
  border-radius: 5px;
}

.drop-down {
  background-color: #ffffff !important;
}

.bright {
  border-right: 0.5px solid lightgrey;
}

.text-align {
  line-height: 23px !important;
}

.vue-switcher-theme--bootstrap.vue-switcher-color--primary div:after {
  background-color: #1e8fe1 !important;
}

.error-style {
  font-size: 13px;
  color: #f16559;
  padding-bottom: 5px;
}

.is-danger {
  border-color: #ff4848;
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

.mtn-10 {
  margin-top: -13px;
}

.iconColor{
  color: #ced4da;
}
</style>
