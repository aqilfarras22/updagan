<template>
  <div class="primaryBackGround">
    <div class="singleChoice form-bg">
      <b-form @submit.prevent="validateBeforeSubmit" class="pt-16 pl-20 pb-20">
        <span class="sequence-style"><b>{{singleChoice.sequence}}. </b></span>
        <!-- Single choice question -->
        <b-row class="pl-15 pr-15 pb-15 pt-0">
          <b-form-input type="text" class="fs-15 form-control field-h40 ml-10" v-model="singleChoice.body" placeholder="Enter question or description" size="sm" v-bind:class="{'is-danger': validateQuestion}" v-on:keyup.native="validateQuestionText">
          </b-form-input>
          <span v-if="validateQuestion" class="error-style ml-10">Question cannot be empty.</span>
        </b-row>
        <!-- Select options -->
        <b-row>
          <b-form-radio-group id="radios" v-model="selected" name="radioSubComponent" v-for="(choice, index) in singleChoice.options" :key="index" class="pt-10 pl-10 pr-0" v-bind:class="{'col-4' : (singleChoice.noOfColumns == 3), 'col-6': (singleChoice.noOfColumns == 2), 'col-12': (singleChoice.noOfColumns == 1)}">
            <b-row v-if="choice.type !== 'Other'">
              <b-col align-self="center" v-bind:class="{'col-8': (12/singleChoice.noOfColumns == 4), 'col-9': (12/singleChoice.noOfColumns == 6), 'col-11': (12/singleChoice.noOfColumns == 12)}">
                <b-form-radio class="pl-0 pt-8 position-absolute pt-3" :disabled="true">
                </b-form-radio>
                <b-form-input type="text" v-model="choice.label" placeholder="Enter an answer option" size="sm" class="ml-22 field-h40 fs-15 form-control " v-bind:class="{'is-danger': choice.errorFlag, 'width-97':(12/singleChoice.noOfColumns == 12)  }" v-on:keyup.native="validateAllOptions()">
                </b-form-input>
                <span v-if="12/singleChoice.noOfColumns == 12" :class="{'singleChoiceIcons': 12/singleChoice.noOfColumns == 12}">
                  <i class="fa fa-plus-circle fs-18 pr-5 iconColor cursor_pointer" @click="addChoice(index)" aria-hidden="true"></i>
                  <i class="fa fa-minus-circle fs-18 iconColor cursor_pointer" @click="removeChoice(index)" aria-hidden="true"></i>
                </span>
                <span v-if="choice.errorFlag" class="error-style pl-28">{{choice.errorFlag}}</span>
              </b-col>
              <b-col v-if="12/singleChoice.noOfColumns != 12" v-bind:class="{'col-4': (12/singleChoice.noOfColumns == 4), 'col-3': (12/singleChoice.noOfColumns == 6), 'col-2': (12/singleChoice.noOfColumns == 12)}" align-self="center">
                <span>
                  <i class="fa fa-plus-circle fs-18 pr-5 iconColor cursor_pointer" @click="addChoice(index)" aria-hidden="true"></i>
                  <i class="fa fa-minus-circle fs-18 iconColor cursor_pointer" @click="removeChoice(index)" aria-hidden="true"></i>
                </span>
              </b-col>
            </b-row>
            <!-- color coded alerts-->
            <b-row class="mt-10" v-if="singleChoice.colorCodeEnabled && choice.type !== 'Other'">
              <b-col class="pl-37" v-bind:class="{'col-9': (12/singleChoice.noOfColumns == 4), 'col-3': (12/singleChoice.noOfColumns == 6 || 12/singleChoice.noOfColumns == 12)}">Select an alert color</b-col>
              <b-col class="p-0" :class="{'col-3': (12/singleChoice.noOfColumns == 4), 'col-2': (12/singleChoice.noOfColumns == 6), 'col-1': (12/singleChoice.noOfColumns == 12)}">
              <div>
              <div @click="showHideDropdown(index)" class="color-dropdown-outer" :class="{'text-align' : (choice.showDropdown)}" ><div class="color-code" :class="{'ml-5 pull-left text-align' : (!choice.showDropdown)}"  :style="{ 'background-color': choice.colorCoding.color }"></div><div class="ml-35" v-if="!choice.showDropdown"><i aria-hidden="true" title="" class="fas fa-caret-down fs-20 icon-color"></i></div></div>
              <div v-show="choice.showDropdown" class="color-dropdown-inner">
              <div v-for="colorOption in choice.colorOptions">
              <label @click="hideDropdown(index)" v-if="colorOption !== choice.colorCoding.color" class="color-code-label"><input type="radio" style="display:none;" :value="colorOption" name="color" v-model="choice.colorCoding.color"/><div class="color-code-outer"><div class="color-code" :style="{ 'background-color': colorOption }"></div></div></label>
              </div>
              </div>
              </div>
              </b-col>
              <b-col v-bind:class="{'col-12 pl-37 pr-0 mt-10': (12/singleChoice.noOfColumns == 4), 'col-7': (12/singleChoice.noOfColumns == 6 || 12/singleChoice.noOfColumns == 12)}">  
                <b-form-input type="text" v-model="choice.colorCoding.warningMessage" placeholder="Enter an alert message" size="sm" class="fs-15 form-control">
                </b-form-input>
              </b-col>
            </b-row>
          </b-form-radio-group>
        </b-row>
      </b-form>
      <!-- Other option check mark and number of columns for checkboxes -->
      <hr class="m-0">
      <b-row class="fs-12 pl-35 pt-15">
        <b class="mb-10">Number of columns</b>
      </b-row>
      <!-- Number of columns for singleChoice -->
      <b-row class="fs-12 pl-20">
        <b-col cols="4" lg="2">
          <b-form-select v-model="singleChoice.noOfColumns" class="mb-5 fs-12" size="sm">
            <option v-for="(column, index) in columnsAllowed" :key="index" :value="column">{{column}}
            </option>
          </b-form-select>
        </b-col>
      </b-row>
      <b-row class="pt-15 pl-35 fs-15 mb-20">
        <b-form-checkbox @change="singleChoice.otherOptionField = !singleChoice.otherOptionField, addOtherOption()" v-model="singleChoice.otherOptionField" class="pl-0">
          <span class="pl-25 text-align">Add an 'Other' answer option or content field.</span>
        </b-form-checkbox><br>
      </b-row>
      <!-- Label for other option -->
      <b-row v-if="singleChoice.otherOptionField" class="fs-12 pl-56">
        <b-col cols="12" lg="5" align-self="center" class="pl-0">
          <b>Label</b><br>
          <div class="pt-5 pb-15">
            <b-form-input type="text" class="fs-15 form-control mt-10 field-h40" placeholder="Other" v-model="otherOpitonData.label" size="sm" v-on:keyup.native="validateOtherOptionLabel()" v-bind:class="{'is-danger': validateOtherOptionText}">
            </b-form-input>
            <span v-if="validateOtherOptionText" class="error-style">Please provide other option label.</span>
          </div>
        </b-col>
        <!-- Comment field for other option -->
        <b-col cols="12" lg="8" align-self="center" class="pl-0 mt-20">
          <b-form-checkbox @change="otherOpitonData.commentField = !otherOpitonData.commentField, addCommentFieldSchema()" v-model="otherOpitonData.commentField" class="pl-0">
            <span class="pl-25 fs-15 text-color text-align">Provide comment field if "{{otherOpitonData.label}}" is selected.</span>
          </b-form-checkbox><br>
          <div v-if="otherOpitonData.commentField" class="pt-20">
            <b>If left blank, display this error message:</b><br>
            <div class="pt-5">
              <b-form-input type="text" class="fs-15 form-control mt-10 field-h40" placeholder="Please fill the comments field" v-model="commentFieldTempData.errorMessage" size="sm" v-bind:class="{'is-danger': validateCommentErrorField}" v-on:keyup.native="validateOtherOptionCommentErrorField">
              </b-form-input>
              <span v-if="validateCommentErrorField" class="error-style">Comment field cannot be empty.</span>
            </div>
          </div>
        </b-col>
        <b-col lg="3"></b-col>
        <!-- Constraints for the other option comment field -->
        <b-col cols="12" lg="4" class="pt-20 pl-0" v-if="otherOpitonData.commentField">
          <div class="bright">
            <div class="pb-10">
              <b class="fs-13">Allowed Characters</b><br></div>
            <b-row>
              <b-form-checkbox @change="commentFieldTempData.constraint.lettersAllowed = !commentFieldTempData.constraint.lettersAllowed" v-model="commentFieldTempData.constraint.lettersAllowed" class="pl-0">
              </b-form-checkbox>
              <div class="pl-8 text-align pb-10 fs-15">Letters(abc)</div>
            </b-row>
            <b-row>
              <b-form-checkbox @change="commentFieldTempData.constraint.numbersAllowed = !commentFieldTempData.constraint.numbersAllowed" v-model="commentFieldTempData.constraint.numbersAllowed" class="pl-0">
              </b-form-checkbox><br>
              <div class="pl-8 text-align pb-10 fs-15">Numbers(123)</div>
            </b-row>
            <b-row>
              <b-form-checkbox @change="commentFieldTempData.constraint.specialCharactersAllowed = !commentFieldTempData.constraint.specialCharactersAllowed" v-model="commentFieldTempData.constraint.specialCharactersAllowed" class="pl-0">
              </b-form-checkbox><br>
              <div class="pl-8 text-align pb-10 fs-15">Special characters(!@#)</div>
            </b-row>
          </div>
        </b-col>
        <!-- For text constraints -->
        <b-col cols="12" lg="8" class="pt-20 pl-4" v-if="otherOpitonData.commentField && (commentFieldTempData.constraint.lettersAllowed || commentFieldTempData.constraint.specialCharactersAllowed)">
          <div class="pb-10 fs-13">
            <b>Character Text</b>
          </div>
          <b-row>
            <b-col cols="12" lg="5" class="pl-0">
              <switches v-model="commentFieldTempData.constraint.minCharsFlag" theme="custom" color="blue" @change="commentFieldTempData.constraint.minCharsFlag = !commentFieldTempData.constraint.minCharsFlag"></switches>
              <span class="pl-8 fs-15">Min Characters</span>
              <b-col cols="12" lg="10" class="pull-right">
                <b-form-input type="number" min="0" class="fs-15 form-control mt-10 field-h40" placeholder="0" v-model="commentFieldTempData.constraint.minChars" v-if="commentFieldTempData.constraint.minCharsFlag" size="sm" v-validate="{regex: /^\d+$/, required: true}" name="charMin" v-bind:class="{'input': true, 'is-danger': errors.has('charMin')}">
                </b-form-input>
              </b-col>
            </b-col>
            <b-col cols="12" lg="5" class="pl-0">
              <switches v-model="commentFieldTempData.constraint.maxCharsFlag" theme="custom" color="blue" @change="commentFieldTempData.constraint.maxCharsFlag = !commentFieldTempData.constraint.maxCharsFlag"></switches>
              <span class="pl-8 fs-15">Max Characters</span>
              <b-col cols="12" lg="10" class="pull-right">
                <b-form-input type="number" class="fs-15 form-control mt-10 field-h40" min="0" placeholder="250" v-model="commentFieldTempData.constraint.maxChars" v-if="commentFieldTempData.constraint.maxCharsFlag" size="sm" v-validate="{regex: /^\d+$/, required: true}" name="charMax" v-bind:class="{'input': true, 'is-danger': errors.has('charMax')}">
                </b-form-input>
              </b-col>
            </b-col>
          </b-row>
        </b-col>
        <!-- For Numeric constraints -->
        <b-col cols="12" lg="8" class="pt-10 pl-4" v-if="otherOpitonData.commentField && !commentFieldTempData.constraint.lettersAllowed && !commentFieldTempData.constraint.specialCharactersAllowed && commentFieldTempData.constraint.numbersAllowed">
          <div class="pb-10">
            <b>Validation</b>
          </div>
          <b-row>
            <b-col cols="12" lg="4" class="pl-0">
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
                <b-form-input type="number" class="fs-13 form-control mt-10 field-h40" placeholder="10" min="0" v-model="commentFieldTempData.constraint.maxLimit" v-if="commentFieldTempData.constraint.maxLimitFlag" size="sm" v-validate="{regex: /^\d+$/, required: true}" name="numberMax" v-bind:class="{'input': true, 'is-danger': errors.has('numberMax')}">
                </b-form-input>
              </b-col>
            </b-col>
            <b-col cols="12" lg="4" class="pl-0">
              <switches v-model="commentFieldTempData.constraint.decimalLimitFlag" theme="custom" color="blue" @change="commentFieldTempData.constraint.decimalLimitFlag = !commentFieldTempData.constraint.decimalLimitFlag"></switches>
              <span class="pl-5"># of decimal places</span>
              <b-col cols="12" lg="10" class="pull-right">
                <b-form-input type="number" class="fs-15 form-control mt-10 field-h40" placeholder="4" min="0" v-model="commentFieldTempData.constraint.decimalLimit" v-if="commentFieldTempData.constraint.decimalLimitFlag" size="sm" v-validate="{regex: /^\d+$/, required: true}" name="numberDecimals" v-bind:class="{'input': true, 'is-danger': errors.has('numberDecimals')}">
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
          <button class="plain-btn br-1 fs-12 pull-right mr-10" @click="cancelComponent(singleChoice.order)" v-if="singleChoice.mode == 'edit'">Cancel</button>
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
import swal from 'sweetalert2';
import schemas from '../../data/form-components-json/schemas.json';

export default {
  name: 'single-choice',
  data() {
    return {
      singleChoice: {},
      validateQuestion: false,
      validateOtherOptionText: false,
      validateCommentErrorField: false,
      errorOptionsCount: 0,
      validateMinMaxOption: false,
      selected: null,
      commentFieldTempData: {},
      columnsAllowed: [1, 2, 3],
      choiceSchema: find(schemas, 'fieldType', 'SingleChoice').schemas.choiceSchema,
      otherOptionSchema: find(schemas, 'fieldType', 'SingleChoice').schemas.otherOptionSchema,
      commentFieldSchema: find(schemas, 'fieldType', 'SingleChoice').schemas.commentFieldSchema,
    };
  },
  props: ['singleChoiceSchema', 'formData'],
  mounted() {
    this.singleChoice = this.singleChoiceSchema;
    // check for other type option and maintain otherOptionField flag as it is not saved in DB
    if (
      this.singleChoiceSchema.options[this.singleChoiceSchema.options.length - 1].type === 'Other'
    ) {
      this.singleChoiceSchema.otherOptionField = true;
    }
    // check for the comment field flag and copy to temp comment field data
    if (
      this.singleChoiceSchema.otherOptionField
      && this.singleChoiceSchema.options[this.singleChoiceSchema.options.length - 1].commentField
    ) {
      this.commentFieldTempData = this.singleChoiceSchema.options[
        this.singleChoiceSchema.options.length - 1
      ].comment;
    }
    // add errorFlag to all options as we will not save the errorFlag in DB
    const tempOptions = [];
    this.singleChoice.options.forEach(option => {
      const tempOption = option;
      tempOption.errorFlag = false;
      tempOption.showDropdown = false;
      tempOption.colorOptions = ["#ffffff","#f16559","#ffa800","#48bf7a"]
      if(!tempOption.colorCoding) {
        tempOption.colorCoding = {'color':'#ffffff','warningMessage':''};
      }
      tempOptions.push(tempOption);
    });
    this.singleChoice.options = tempOptions;
  },
  methods: {
    // Add choice or option
    addChoice(index) {
      const choiceSchema = cloneDeep(this.choiceSchema);
      choiceSchema.showDropdown = false;
      choiceSchema.colorCoding = {'color':'#ffffff','warningMessage':''};
      choiceSchema.colorOptions = ["#ffffff","#f16559","#ffa800","#48bf7a"]
      this.singleChoice.options.splice(index + 1, 0, choiceSchema);
      this.singleChoice.options[index + 1].index = this.singleChoice.options.length;
      this.singleChoice.options.forEach((choice, ind) => {
        this.singleChoice.options[ind].index = ind;
      });
    },

    // Remove the selected option field
    removeChoice(index) {
      if (this.singleChoice.options.length <= 1) {
        this.$toastr.error('At least one answer option must be entered.');
      } else {
        let removableNotificationIndex = -1;
        this.singleChoice.notifications.forEach((notification, notificationIndex) => {
          if (notification.selectedOptionVal === this.singleChoice.options[index].label) {
            removableNotificationIndex = notificationIndex;
          }
        });
        if (removableNotificationIndex >= 0) {
          swal({
            title:
              'This will also delete the notification created based on this choice, Are you sure you want to delte ? ',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#b8c7ce',
            cancelButtonColor: '#34537d',
            confirmButtonText: 'Yes',
            cancelButtonText: 'Cancel',
          }).then(({ dismiss }) => {
            if (dismiss !== 'cancel' || !dismiss) {
              this.singleChoice.notifications.splice(removableNotificationIndex, 1);
              this.singleChoice.options.splice(index, 1);
            }
          });
        } else {
          this.singleChoice.options.splice(index, 1);
        }
      }
    },

    // add or remove other option shcema to check box schema
    addOtherOption() {
      if (this.singleChoice.otherOptionField) {
        const otherOptionSchema = cloneDeep(this.otherOptionSchema);
        this.singleChoice.options.push(otherOptionSchema);
        this.singleChoice.options.forEach((choice, ind) => {
          this.singleChoice.options[ind].index = ind;
        });
      } else {
        this.singleChoice.options.forEach((choice, ind) => {
          if (choice.type === 'Other') {
            this.singleChoice.options.splice(ind, 1);
          }
        });
      }
    },

    // add or remove other option comment field shcema to check box schema
    addCommentFieldSchema() {
      this.commentFieldTempData = cloneDeep(this.commentFieldSchema);
    },

    // validate options added other than first option
    validateAllOptions() {
      const options = filter(this.singleChoice.options, option => option.label.trim().length > 0);
      if (options.length <= 0) {
        this.singleChoice.options[0].errorFlag = 'At least one answer option must be entered.';
      } else {
        this.singleChoice.options[0].errorFlag = false;
      }
    },

    // Validate for single choice question text
    validateQuestionText() {
      if (this.singleChoice && this.singleChoice.body && this.singleChoice.body.length) {
        this.validateQuestion = false;
      } else {
        this.validateQuestion = true;
      }
    },

    // Validate for other option label
    validateOtherOptionLabel() {
      if (this.singleChoice && this.singleChoice.otherOptionField) {
        if (this.singleChoice.options[this.singleChoice.options.length - 1].label.length) {
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
        this.singleChoice
        && this.singleChoice.otherOptionField
        && this.otherOpitonData.commentField
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
      if (this.singleChoice.options[this.singleChoice.options.length - 1].commentField) {
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

    // Validate and submit the single choice to parent form design component
    validateBeforeSubmit() {
      // validate the form requirements
      this.validateQuestionText();
      this.validateOtherOptionLabel();
      this.validateAllOptions();
      this.validateMinMax();
      this.validateOtherOptionCommentErrorField();

      const self = this;
      this.$validator.validateAll().then(result => {
        this.errorOptionsCount = filter(self.singleChoice.options,
          option => option.errorFlag !== false).length;
        const formArray = _.filter(this.formData, o => o.fieldName && o.fieldName.length > 0);
        const fieldNames = _.map(formArray, 'fieldName');
        if (_.compact(_.uniq(fieldNames)).length === _.compact(fieldNames).length) {
          if (
            !result
            || (this.validateOtherOptionText && this.singleChoice.otherOptionField)
            || this.errorOptionsCount
            || this.validateQuestion
            || this.validateCommentErrorField
            || this.validateMinMaxOption
          ) {
            // this.$toastr.error('Please fill the error fields.');
          } else {
            this.singleChoice.mode = 'saved';
            this.singleChoice.options = filter(this.singleChoice.options,
              option => option.label.trim().length > 0);
            if (this.singleChoice.options[this.singleChoice.options.length - 1].commentField) {
              this.singleChoice.options[
                this.singleChoice.options.length - 1
              ].comment = this.commentFieldTempData;
              this.commentFieldTempData = {};
            }
            this.singleChoice.fieldNameErrorMsg = '';
            this.$emit('save', this.singleChoice);
          }
        } else {
          this.singleChoice.fieldNameErrorMsg = 'Please enter unique field name.';
        }
      });
    },

    deleteComponent() {
      this.$emit('deleteComponent', this.singleChoice);
    },

    cancelComponent(sequence) {
      this.$emit('cancelComponent', sequence);
    },

    showHideDropdown(index) {
      this.singleChoice.options[index].showDropdown = !this.singleChoice.options[index].showDropdown;
      this.$forceUpdate();
    },

    hideDropdown(index) {
      this.singleChoice.options[index].showDropdown = false
      this.$forceUpdate();
    }
  },
  watch: {
    singleChoice: {
      handler: function(val, oldVal) {
        if(val.colorCodeEnabled === false) {
          this.singleChoice.options.forEach(option => {
          if(option.colorCoding) {
            option.colorCoding.color = '#ffffff';
            option.colorCoding.warningMessage = "";
          }
    });
        }
      },
      deep: true
    }
  },
  computed: {
    otherOpitonData() {
      let returnFlag = {};
      if (this.singleChoice.otherOptionField) {
        returnFlag = this.singleChoice.options[this.singleChoice.options.length - 1];
      }
      return returnFlag;
    }
  },
};
</script>

<style scoped lang="scss">
.width-97 {
  width: 97%;
}

.singleChoiceIcons {
  position: absolute;
  top: 10px;
  right: -35px
}

.primaryBackGround {
  background-color: white;
  padding: 20px;
}

.sequence-style {
  position: absolute;
  top: 20px;
}

.singleChoice {
  position: relative;
  border: 0.5px solid lightgray;
  border-radius: 2px;
}

.iconColor {
  color: #ced4da;
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

//color code styles
.icon-color {
  color: #e4e8eb;
}

.text-align {
  text-align: -webkit-center;
}

.color-code-label {
  width:100%;
  text-align:-webkit-center;
  display:block;
  margin-bottom:0!important;
}

.color-code-outer {
  border:1px solid #e4e8eb;
  padding:5px;
  width:100%;
}

.color-code {
  height:20px;
  width:20px;
  border-radius:20px;
  border:solid 2px #d3dee3;
}

.color-dropdown-outer {
  border:1px solid #ced4da;
  border-radius:0.2rem;
  padding:5px;
  background-color:#ffffff;
}

.color-dropdown-inner {
  position:absolute;
  z-index:999;
  background-color:#ffffff;
  width:100%;
}

</style>
