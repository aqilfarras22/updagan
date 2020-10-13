<template>
  <div class="primaryBackGround">
    <div class="scale form-bg">
      <b-form @submit.prevent="validateBeforeSubmit" class="pt-16 pl-20 pb-20">
        <label for="scaleQuestion" class="sequence-style"><b>{{scale.sequence}}. </b></label>
        <!-- Scale question -->
        <b-row class="pl-15 pr-15 pb-15 pt-0">
          <b-form-input id="scaleQuestion" type="text" class="fs-15 form-control field-h40 ml-10" v-model="scale.body" placeholder="Enter question or description" size="sm" v-bind:class="{'is-danger': validateQuestion}" v-on:keyup.native="validateQuestionText" autocomplete="off">
          </b-form-input>
          <span v-if="validateQuestion" class="error-style ml-10 mt-10">Question cannot be empty.</span>
        </b-row>
        <b-row class="pl-10">
          <b-col class="col-9">
            <label class="mr-4 mb-0 fs-13 font-weight-bold" for="scaleComponent">Label</label><i id ="labelPopover" class="fa fa-question-circle fs-15"></i>
            <b-popover :popover-style="{background: '#000'}" target="labelPopover"
                   triggers="hover focus">
                  <span class="fs-13 p-13">These are the labels the person completing the form will see.
                   The top option will be on the left or top of the scale. The bottom option will be on the right or bottom of the scale.</span>
            </b-popover>
          </b-col>
          <b-col class="col-2">
            <label class="mr-4 mb-0 fs-13 font-weight-bold" for="scaleComponent">Weight</label><i id ="weightPopover" class="fa fa-question-circle fs-15"></i>
            <b-popover target="weightPopover"
            triggers="hover focus">
            <span class="fs-13 p-13">A weight is essentially applying a rank to each label. This may help you better analyze the returned data.This is optional and will not be visible to the person completing out the form.</span>
            </b-popover>
          </b-col>
        </b-row>
        <!-- Choices -->
        <b-row id="scaleComponent" v-model="selected" name="scaleSubComponent" v-for="(option, index) in scale.options" :key="index" class="col-12 pt-10 pl-10 pr-0" v-if="option.type !== 'Other' && option.type !== 'NA'">
          <b-col align-self="center" class="col-9 pr-0">
            <b-form-input type="text" v-model="option.label" placeholder="Enter a label" size="sm" class="fs-15 field-h40 form-control" v-bind:class="{'is-danger': (validateUniqueLabel) }" v-on:keyup.native="validateUniqueLabels(scale.options)"  autocomplete="off">
            </b-form-input>
            <!-- <span v-if="validateOption && (errorOptionsCount == scale.options.length) && (index == 0)" class="error-style">You must enter at least one label.</span>
            <span v-if="validateOption && (errorOptionsCount != scale.options.length) && (index == 0)" class="error-style">Label cannot be empty.</span>
            <span v-if="option.errorFlag && index > 0" class="error-style">Label cannot be empty.</span>
            <span v-if="validateUniqueLabel" class="error-style">Labels have to be unique.</span> -->
          </b-col>
          <b-col class="col-2">
            <b-form-input type="number" v-model="option.weight" placeholder="Weight" size="sm" class="fs-15 field-h40 form-control" v-bind:class="{'is-danger': option.weight !=='' &&  option.errorFlag}" v-on:keyup.native="validateUniqueWeights(scale.options)" autocomplete="off">
            </b-form-input>
            <!-- <span v-if="validateUniqueWeight" class="error-style">Weights must be unique.</span> -->
          </b-col>
          <b-col class="col-1 pl-0 pr-0 mt-4 scaleIcons">  
            <span>
              <i class="fa fa-plus-circle fs-18 pr-5 iconColor cursor_pointer" @click="addLabel(index)" aria-hidden="true"></i>
              <i class="fa fa-minus-circle fs-18 iconColor cursor_pointer" @click="removeChoice(index)" aria-hidden="true"></i>
            </span>
          </b-col>
        </b-row>
        <b-row class="pt-5">
          <b-col cols="9" class="error-style pb-0 pt-0 ml-10"><span v-if="validateUniqueLabel">At least two unique labels must be entered.</span></b-col>
          <b-col cols="2" class="error-style ml-10 p-0"><span v-if="validateUniqueWeight">Weights must be unique.</span></b-col>
        </b-row>
        <b-row v-if="scale.naField" class="pl-10">
          <b-col class="col-8 mt-10">
            <b-form-input type="text" size="sm" class="fs-15 form-control field-h40" value="N/A" autocomplete="off" readonly="readonly">
          </b-form-input>
          </b-col>
        </b-row>
      </b-form>
      <!-- Radio Buttins for scale -->
      <hr class="m-0">
      <b-row>
        <b for="scaleOther" class="fw-bold pt-15 pl-35 fs-13">Format</b>
      </b-row>
      <b-row class="pt-10 pl-35 fs-13">
            <b-form-radio class="pl-0" id="horizontal" value="true" name="Horizontal" v-model="scale.horizontalScale" @change="scale.horizontalScale = !scale.horizontalScale"></b-form-radio>
            <label for="horizontal" class="pl-8 text-align fs-15 pr-50">Horizontal Scale</label>
            <b-form-radio class="pl-10" id="vertical" value="false" name="Vertical" v-model="scale.horizontalScale" @change="scale.horizontalScale = !scale.horizontalScale"></b-form-radio>
            <label for="vertical" class="pl-8 text-align fs-15">Vertical scale</label>
      </b-row>
      <!-- Other option check mark N/A checkbox -->
      <b-row class="pt-15 pl-35 fs-15" lg="8" align-self="center">
        <b-form-checkbox @change="scale.naField = !scale.naField, addNa()" v-model="scale.naField" class="pl-0">
          <span class="pl-25 text-align">Add an 'N/A' option.</span> <i id ="naPopOver" class="fa fa-question-circle fs-15"></i>
          <b-popover target="naPopOver"
              triggers="hover focus">
              <span class="fs-13">
                “Not applicable”
              </span>
          </b-popover>
        </b-form-checkbox><br>
      </b-row>
      <!-- Other answer option checkbox -->
      <b-row class="pt-15 pl-35 fs-15">
        <b-form-checkbox @change="scale.otherOptionField = !scale.otherOptionField, addOtherOption()" v-model="scale.otherOptionField" class="pl-0">
          <span class="pl-25 text-align">Add an 'Other' answer option or content field.</span>
        </b-form-checkbox><br>
      </b-row>
      <!-- Label for other option -->
      <b-row v-if="scale.otherOptionField" class="fs-12 pl-56">
        <b-col cols="12" lg="5" align-self="center" class="pl-0">
          <label for="scaleOther" class="font-weight-bold mb-10 mt-20">Label</label>
          <div class="pt-5 pb-15">
            <b-form-input id="scaleOther" type="text" class="fs-15 form-control field-h40" placeholder="Other" v-model="otherOptionData.label" size="sm" v-on:keyup.native="validateOtherOptionLabel()" v-bind:class="{'is-danger': validateOtherOptionText}" autocomplete="off">
            </b-form-input>
            <span v-if="validateOtherOptionText" class="error-style">Please provide other option label.</span>
          </div>
        </b-col>
        <!-- Comment field for other option -->
        <b-col cols="12" lg="8" align-self="center" class="pl-0 mt-10">
          <b-form-checkbox @change="otherOptionData.commentField = !otherOptionData.commentField,addCommentFieldSchema()" v-model="otherOptionData.commentField" class="pl-0">
            <span class="pl-25 text-align fs-15">Provide comment field if "{{otherOptionData.label}}" is selected.</span>
          </b-form-checkbox><br>
          <div v-if="otherOptionData.commentField" class="pt-10 mt-20">
            <label for="scaleBlankError" class="font-weight-bold mb-5">If left blank, display this error message:</label>
            <div class="pt-5">
              <b-form-input id="scaleBlankError" type="text" class="fs-15 form-control field-h40" placeholder="Please fill the comments field" v-model="commentFieldTempData.errorMessage" size="sm" v-bind:class="{'is-danger': validateCommentErrorField}" v-on:keyup.native="validateOtherOptionCommentErrorField" autocomplete="off">
              </b-form-input>
              <span v-if="validateCommentErrorField" class="error-style">Comment field cannot be empty.</span>
            </div>
          </div>
        </b-col>
        <b-col lg="3"></b-col>
        <!-- Constraints for the other option comment field -->
        <b-col cols="12" lg="4" class="pt-10 pl-0" v-if="otherOptionData.commentField">
          <div class="bright">
            <div class="pb-10 fs-13 mt-20">
              <b>Allowed Characters</b><br></div>
            <b-row class="fs-15 pb-10">
              <b-form-checkbox id="scaleLettersAllowed" @change="commentFieldTempData.constraint.lettersAllowed = !commentFieldTempData.constraint.lettersAllowed" v-model="commentFieldTempData.constraint.lettersAllowed" class="pl-0">
              </b-form-checkbox>
             <span for="scaleLettersAllowed" class="pl-8 text-align">Letters(abc)</span>
            </b-row>
            <b-row class="fs-15 pb-10">
              <b-form-checkbox id="scaleNumbersAllowed" @change="commentFieldTempData.constraint.numbersAllowed = !commentFieldTempData.constraint.numbersAllowed" v-model="commentFieldTempData.constraint.numbersAllowed" class="pl-0">
              </b-form-checkbox><br>
              <span for="scaleNumbersAllowed" class="pl-8 text-align">Numbers(123)</span>
            </b-row>
            <b-row class="fs-15 pb-10">
              <b-form-checkbox id="scaleSpecialCharsAllowed" @change="commentFieldTempData.constraint.specialCharactersAllowed = !commentFieldTempData.constraint.specialCharactersAllowed" v-model="commentFieldTempData.constraint.specialCharactersAllowed" class="pl-0">
              </b-form-checkbox><br>
              <span for="scaleSpecialCharsAllowed" class="pl-8 text-align">Special characters(!@#)</span>
            </b-row>
          </div>
        </b-col>
        <!-- For text constraints -->
        <b-col cols="12" lg="7" class="pt-10 pl-4" v-if="otherOptionData.commentField && (commentFieldTempData.constraint.lettersAllowed || commentFieldTempData.constraint.specialCharactersAllowed)">
          <div class="pb-10 fs-13 mt-20">
            <b>Character Text</b>
          </div>
          <b-row>
            <b-col cols="12" lg="6" class="pl-0">
              <switches id="scaleMinCharacters" v-model="commentFieldTempData.constraint.minCharsFlag" theme="custom" color="blue" @change="commentFieldTempData.constraint.minCharsFlag = !commentFieldTempData.constraint.minCharsFlag"></switches>
              <label for="scaleMinCharacters" class="pl-8 fs-15">Min characters</label>
              <b-col cols="12" lg="10" class="pull-right">
                <b-form-input type="number" min="0" class="fs-15 form-control" placeholder="0" v-model="commentFieldTempData.constraint.minChars" v-if="commentFieldTempData.constraint.minCharsFlag" size="sm" v-validate="{regex: /^\d+$/, required: true}" name="charMin" v-bind:class="{'input': true, 'is-danger': errors.has('charMin')}" autocomplete="off">
                </b-form-input>
              </b-col>
            </b-col>
            <b-col cols="12" lg="6" class="pl-0">
              <switches id="scaleMaxCharacters" v-model="commentFieldTempData.constraint.maxCharsFlag" theme="custom" color="blue" @change="commentFieldTempData.constraint.maxCharsFlag = !commentFieldTempData.constraint.maxCharsFlag"></switches>
              <label for="scaleMaxCharacters" class="pl-8 fs-15">Max characters</label>
              <b-col cols="12" lg="10" class="pull-right">
                <b-form-input type="number" class="fs-15 form-control field-h40" min="0" placeholder="250" v-model="commentFieldTempData.constraint.maxChars" v-if="commentFieldTempData.constraint.maxCharsFlag" size="sm" v-validate="{regex: /^\d+$/, required: true}" name="charMax" v-bind:class="{'input': true, 'is-danger': errors.has('charMax')}" autocomplete="off">
                </b-form-input>
              </b-col>
            </b-col>
          </b-row>
        </b-col>
        <!-- For Numeric constraints -->
        <b-col cols="12" lg="8" class="pt-10 pl-4" v-if="otherOptionData.commentField && !commentFieldTempData.constraint.lettersAllowed && !commentFieldTempData.constraint.specialCharactersAllowed && commentFieldTempData.constraint.numbersAllowed">
          <div class="pb-10">
            <b>Validation</b>
          </div>
          <b-row>
            <b-col cols="12" lg="4" class="pl-0">
              <switches v-model="commentFieldTempData.constraint.minLimitFlag" theme="custom" color="blue" @change="commentFieldTempData.constraint.minLimitFlag = !commentFieldTempData.constraint.minLimitFlag"></switches>
              <span class="pl-8">Min value</span>
              <b-col cols="12" lg="10" class="pull-right">
                <b-form-input type="number" class="fs-15 form-control field-h40" placeholder="0" min="0" v-model="commentFieldTempData.constraint.minLimit" v-if="commentFieldTempData.constraint.minLimitFlag" size="sm" v-validate="{regex: /^\d+$/, required: true}" name="numberMin" v-bind:class="{'input': true, 'is-danger': errors.has('numberMin')}" autocomplete="off">
                </b-form-input>
              </b-col>
            </b-col>
            <b-col cols="12" lg="4" class="pl-0">
              <switches v-model="commentFieldTempData.constraint.maxLimitFlag" theme="custom" color="blue" @change="commentFieldTempData.constraint.maxLimitFlag = !commentFieldTempData.constraint.maxLimitFlag"></switches>
              <span class="pl-8">Max value</span>
              <b-col cols="12" lg="10" class="pull-right">
                <b-form-input type="number" class="fs-15 form-control field-h40" placeholder="10" min="0" v-model="commentFieldTempData.constraint.maxLimit" v-if="commentFieldTempData.constraint.maxLimitFlag" size="sm" v-validate="{regex: /^\d+$/, required: true}" name="numberMax" v-bind:class="{'input': true, 'is-danger': errors.has('numberMax')}" autocomplete="off">
                </b-form-input>
              </b-col>
            </b-col>
            <b-col cols="12" lg="4" class="pl-0">
              <switches v-model="commentFieldTempData.constraint.decimalLimitFlag" theme="custom" color="blue" @change="commentFieldTempData.constraint.decimalLimitFlag  = !commentFieldTempData.constraint.decimalLimitFlag "></switches>
              <span class="pl-8"># of decimal places</span>
              <b-col cols="12" lg="10" class="pull-right">
                <b-form-input type="number" class="fs-12" placeholder="4" min="0" v-model="commentFieldTempData.constraint.decimalLimit" v-if="commentFieldTempData.constraint.decimalLimitFlag" size="sm" v-validate="{regex: /^\d+$/, required: true}" name="numberDecimals" v-bind:class="{'input': true, 'is-danger': errors.has('numberDecimals')}" autocomplete="off">
                </b-form-input>
              </b-col>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
      <b-row class="pb-15">
        <b-col cols="12" class="p-0">
          <hr>
        </b-col>
        <b-col cols="12" align-self="center" class="pull-right">
          <i class="fa fa-trash-o fs-18 pull-left pl-20 pt-5 iconColor cursor_pointer" aria-hidden="true" @click="deleteComponent()"></i>
          <button class="primary-btn br-1 fs-12 pull-right" size="sm" @click="validateBeforeSubmit()">Save</button>
          <button class="plain-btn br-1 fs-12 pull-right mr-10" @click="cancelComponent(scale.order)" v-if="scale.mode == 'edit'">Cancel</button>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
// import filter from 'lodash/filter';
import cloneDeep from 'lodash/cloneDeep';
import find from 'lodash/find';
import findIndex from 'lodash/findIndex';
import map from 'lodash/map';
import filter from 'lodash/filter';
import schemas from '../../data/form-components-json/schemas.json';

export default {
  name: 'scale',
  data() {
    return {
      scale: {},
      validateQuestion: false,
      validateOtherOptionText: false,
      validateCommentErrorField: false,
      errorOptionsCount: 0,
      validateMinMaxOption: false,
      validateUniqueLabel: false,
      validateUniqueWeight: false,
      validateWeight: false,
      selected: null,
      commentFieldTempData: {},

      labelSchema: find(schemas, { fieldType: 'Scale' }).schemas.labelSchema,
      naSchema: find(schemas, { fieldType: 'Scale' }).schemas.naSchema,
      otherOptionSchema: find(schemas, { fieldType: 'Scale' }).schemas.otherOptionSchema,
      commentFieldSchema: find(schemas, { fieldType: 'Scale' }).schemas.commentFieldSchema,
    };
  },
  props: ['scaleSchema', 'formData'],
  mounted() {
    this.scale = this.scaleSchema;
    // check for other type option and maintain otherOptionField flag as it is not saved in DB
    if (
      this.scaleSchema.options[this.scaleSchema.options.length - 1].type === 'Other'
    ) {
      this.scaleSchema.otherOptionField = true;
    }
    // check for the comment field flag and copy to temp comment field data
    if (
      this.scaleSchema.otherOptionField
      && this.scaleSchema.options[this.scaleSchema.options.length - 1].commentField
    ) {
      this.commentFieldTempData = this.scaleSchema.options[
        this.scaleSchema.options.length - 1
      ].comment;
    }
    this.scale.options.forEach(option => {
      if (option.type === 'NA') {
        this.scaleSchema.naField = true;
      }
    });
  },
  methods: {
    // Add option
    addLabel(index) {
      const labelSchema = cloneDeep(this.labelSchema);
      this.scale.options.splice(index + 1, 0, labelSchema);
      this.scale.options[index + 1].index = this.scale.options.length;
      this.scale.options.forEach((option, ind) => {
        this.scale.options[ind].index = ind;
      });
    },

    // Remove the selected option field
    removeChoice(index) {
      if (this.scale.options.length <= 2) {
        this.$toastr.error('At least two options must be entered.');
      } else {
        this.scale.options.splice(index, 1);
      }
    },

    // add or remove other option schema to check box schema
    addOtherOption() {
      if (this.scale.otherOptionField) {
        const otherOptionSchema = cloneDeep(this.otherOptionSchema);
        this.scale.options.push(otherOptionSchema);
        this.scale.options.forEach((option, ind) => {
          this.scale.options[ind].index = ind;
        });
      } else {
        this.scale.options.forEach((option, ind) => {
          if (option.type === 'Other') {
            this.scale.options.splice(ind, 1);
          }
        });
      }
    },

    addNa() {
      if (this.scale.naField) {
        const naSchema = cloneDeep(this.naSchema);
        const optionIndex = findIndex(this.scale.options, ['type', 'Other']);
        if (optionIndex >= 0) {
          this.scale.options.splice(optionIndex, 0, naSchema);
        } else {
          this.scale.options.push(naSchema);
        }
        this.scale.options.forEach((option, ind) => {
          this.scale.options[ind].index = ind;
        });
      } else {
        this.scale.options.forEach((option, ind) => {
          if (option.type === 'NA') {
            this.scale.options.splice(ind, 1);
          }
        });
        this.scale.options.forEach((option, ind) => {
          this.scale.options[ind].index = ind;
        });
      }
    },

    // add or remove other option comment field shcema to check box schema
    addCommentFieldSchema() {
      this.commentFieldTempData = cloneDeep(this.commentFieldSchema);
    },

    // check for uniqueness of the labels
    validateUniqueLabels(fields) {
      const uniFields = map(filter(fields, o => o.label.trim().length > 0));
      const fieldsData = new Set(map(uniFields, o => o.label));
      if (fieldsData.size >= 2) {
        this.validateUniqueLabel = false;
      } else {
        this.validateUniqueLabel = true;
      }
    },

    validateUniqueWeights(fields) {
      fields.forEach((field, index) => {
        if (!field.weight) {
          this.scale.options[index].weight = ''; // eslint-disable-line
        } else {
          this.scale.options[index].weight = Number(field.weight); // eslint-disable-line
        }
      });
      const fieldsLength = fields.filter(o => (o.weight !== null && o.weight !== ''));
      if (fieldsLength.length > 1) {
        const weights = _.map(fieldsLength, 'weight');
        const that = this;
        weights.forEach((w, index) => {
          const fIndex = _.indexOf(weights, w);
          const lIndex = _.lastIndexOf(weights, w);
          if (fIndex !== lIndex) {
            that.scale.options[index].errorFlag = true;
          } else {
            that.scale.options[index].errorFlag = false;
          }
        });
        if (_.uniq(weights).length !== weights.length) {
          this.validateUniqueWeight = true;
        } else this.validateUniqueWeight = false;
      } else this.validateUniqueWeight = false;
    },

    // validate options added other than first option
    validateAllOptions() {
      this.validateUniqueLabels(this.scale.options);
      this.validateUniqueWeights(this.scale.options);
    },

    // Validate for scale question text
    validateQuestionText() {
      if (
        this.scale
        && this.scale.body
        && this.scale.body.length
      ) {
        this.validateQuestion = false;
      } else {
        this.validateQuestion = true;
      }
    },

    // Validate for other option label
    validateOtherOptionLabel() {
      if (this.scale && this.scale.otherOptionField) {
        if (this.scale.options[this.scale.options.length - 1].label.length) {
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
        this.scale
        && this.scale.otherOptionField
        && this.otherOptionData.commentField
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
      if (this.scale.options[this.scale.options.length - 1].commentField) {
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

    // Validate and submit the scale to parent form design component
    validateBeforeSubmit() {
      // validate the form requirements
      this.validateUniqueLabels(this.scale.options);
      this.validateUniqueWeights(this.scale.options);
      this.validateQuestionText();
      this.validateOtherOptionLabel();
      this.validateAllOptions();
      this.validateMinMax();
      this.validateOtherOptionCommentErrorField();

      this.$validator.validateAll().then(result => {
        const formArray = _.filter(this.formData, o => o.fieldName && o.fieldName.length > 0);
        const fieldNames = _.map(formArray, 'fieldName');
        if (_.compact(_.uniq(fieldNames)).length === _.compact(fieldNames).length) {
          if (
            !result
            || this.validateUniqueLabel
            || this.validateUniqueWeight
            || this.validateOtherOptionText
            || this.validateQuestion
            || this.validateCommentErrorField
            || this.validateMinMaxOption
          ) {
            //   this.$toastr.error('Please fill the error fields.');
          } else {
            this.scale.mode = 'saved';
            this.scale.options = filter(this.scale.options,
              option => option.label.trim().length > 0);
            if (this.scale.options[this.scale.options.length - 1].commentField) {
              this.scale.options[
                this.scale.options.length - 1
              ].comment = this.commentFieldTempData;
              this.commentFieldTempData = {};
            }
            this.scale.fieldNameErrorMsg = '';
            this.$emit('save', this.scale);
          }
        } else {
          this.scale.fieldNameErrorMsg = 'Please enter unique field name';
        }
      });
    },

    deleteComponent() {
      this.$emit('deleteComponent', this.scale);
    },

    cancelComponent(sequence) {
      this.$emit('cancelComponent', sequence);
    },
  },
  computed: {
    otherOptionData() {
      let returnFlag = {};
      if (this.scale.otherOptionField) {
        returnFlag = this.scale.options[this.scale.options.length - 1];
      }
      return returnFlag;
    },
  },
};
</script>

<style scoped lang="scss">
.scaleIcons {
  position: absolute;
  top: 15px;
  right: 5px;
}

.primaryBackGround {
  background-color: white;
  padding: 20px;
}

.sequence-style {
  position: absolute;
  top: 20px;
}

.scale {
  position: relative;
  border: 0.5px solid lightgray;
  border-radius: 2px;
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
  font-size: 12px;
  color: #ff4848;
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

.iconColor{
  color: #ced4da;
}
</style>
