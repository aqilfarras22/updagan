<template>
  <div class="main-container">
    <main-header></main-header>
    <sideMenu :studyData="studyData" :disabled="isEditMode"></sideMenu>
    <div class="has-header has-sidemenu formBackground">
        <div class="whiteBackground formNameCss topFixed">
          <b-row class="p-10">
            <b-col class="pl-0" cols="8">
              <span v-if="!editFormNameInput" class="formNameEdit" @click="editFormName()">
                    <b class="fs-22">{{formName}}</b>
                    <i class="fa fa-pencil pl-10 edit_hover_class fs-16" aria-hidden="true"></i>
                  </span>
              <div class="pr-0" v-if="editFormNameInput">
                <b-input-group>
                  <b-input-group-text slot="append" class="whiteBackground p-5" v-bind:class="{'is-danger': formNameError}">
                    <i class="fa fa-times cancelFormNameEditIcon mr-4 fs-16 cursor_pointer" @click="cancelFormNameSave()" aria-hidden="true"></i>
                    <i class="fa fa-check-square primaryColor fs-24 cursor_pointer" @click="saveFormName()" aria-hidden="true"></i>
                  </b-input-group-text>
                  <b-form-input v-model="formName" onClick="this.select();" class="formNameInput" v-bind:class="{'is-danger': formNameError}">
                  </b-form-input>
                </b-input-group>
              </div>
            </b-col>
            <b-col cols="4" class="p-0">
              <b-row class="p-0">
                <b-col lg="4" v-if="!saveNewVersionBtn"></b-col>
                <b-col class="pull-right text-right pt-5 cursor_pointer fs-15" cols="5" lg="5" @click="cancelForm()">
                      <img src="static/img/add.svg" alt="" class="img-size mb-2"> Cancel
                </b-col>
                <b-col cols="5" lg="3" v-if="!saveNewVersionBtn" class="pull-right p-0">
                  <b-button class="btn-block pull-right primaryBgColor" variant="primary" size="sm" @click="saveForm()">Save</b-button>
                </b-col>
                <b-col cols="7" lg="7" v-if="saveNewVersionBtn" class="pull-right p-0">
                  <b-btn variant="primary" class="btn-block pull-right primaryBgColor" size="sm" @click="saveForm()">Save new version</b-btn>
                </b-col>
              </b-row>
            </b-col>
          </b-row>
        </div>
        <b-row class="pt-55">
          <b-col cols="9" class="pb-15 pt-15 pr-65 center-area">
            <b-row class="mb-10">
              <b-col cols="12" lg="5" class="p-0" align-self="center">
                <div class="dropdown" id="scheduleDropDown">
                  <button class="pt-10 pr-20 pb-10 pl-12 dropdown-toggle fs-12 unscheduleBtn" size="sm" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <span v-if="selectedPackets.length > 0">
                      {{selectedPackets}}
                    </span>
                    <span v-else>
                      Add to an unscheduled packet
                      <img src="static/img/caret.svg" alt="" class=" pl-20 img-size mb-2">
                    </span>
                  </button>
                  <div class="dropdown-menu fs-12" style="overflow-y: auto !important; max-height: 250px;padding-left: 20px;">
                    <div class="dropdown-item m-5 p-0 cursor_pointer" v-for="(formName, index) in unscheduledPackets" :key="index">
                      <b-row class="p-0 cursor_pointer">
                        <b-form-checkbox v-model="formName.selected" :name="formName.name" class="pl-10" @change="formName.selected = !formName.selected, formEditedFlag = true, displaySelectedList()">
                          <span class="pl-23 text-align fs-15">{{formName.name}}</span>
                        </b-form-checkbox>
                      </b-row>
                    </div>
                    <div class="dropdown-divider" v-if="unscheduledPackets.length"></div>
                    <div class="dropdown-item m-0 pl-10 fs-15 pr-25 cursor_pointer py-15" v-b-modal.unscheduledFormModal>
                      <img src="static/img/expand.svg" alt="" class="img-size mb-2">
                      <span class="ml-10 text-color">Create a unscheduled packet</span>
                    </div>
                  </div>
                </div>
              </b-col>
              <!-- <b-col cols="23" lg="8" class="fs-12 p-0">
                        <b-form-checkbox @change="saveAsTemplate = !saveAsTemplate" v-model="saveAsTemplate">
                          <span class="pl-22 text-align">Save as a template to use amongst all studies.</span>
                        </b-form-checkbox><br>
                      </b-col> -->
            </b-row>
            <drop @drop="droppedComponent">
              <FormPreview class="mt-20" :formDataProp="savedFormFields" v-if="savedFormFields && savedFormFields.length > 0" @draggingText="draggingText" @editComponent="editComponent" @saveformdata="saveformdata" @switchComponent="switchComponent" @isFormEdited="isFormEdited" @saveNewComponent="copyNewComponent" :hideShowCopyAction="hideShowCopyAction"/>
              <FormDesign :options="savedFormFields" :dropText="dropText" :mode="mode" v-if="component == '' && savedFormFields.length <= 0" />
            </drop>
          </b-col>
          <b-col cols="3" id="right-menu" class="mt-1">
            <SidePanel v-if="component == '' || component == 'formHeader' || component == 'formParagraph'" :class="{sidePanelDisabled: (component == 'formHeader' || component == 'formParagraph')}" @draggingText="draggingText" />
            <DropDownProp v-if="component == 'formDropdown'" :dropdownSchema="componentSchema" />
            <CheckBoxProp v-if="component == 'formCheckbox'" :checkboxSchema="componentSchema" />
            <TextNumericProp v-if="component == 'formTextNumeric'" :alphaNumericSchema="componentSchema" />
            <SingleChoiceProp v-if="component == 'formSinglechoice'" :singleChoiceSchema="componentSchema" />
            <ScaleProp v-if="component == 'formScale'" :scaleSchema="componentSchema" />
            <DateTimeProp v-if="component == 'formDateTime'" :dateTimeSchema="componentSchema" />
            <FormTableProp v-if="component == 'formTable'" :formTableSchema="componentSchema" />
            <FormTextAreaProp v-if="component == 'formTextArea'" :formTextAreaSchema="componentSchema" />
          </b-col>
        </b-row>
    </div>
    <!-- Unschedule form name Modal Component -->
    <b-modal id="unscheduledFormModal" size="lg" ref="unscheduledFormModal" @hidden="closeModal('unscheduledFormModal')" hide-footer hide-header>
      <div style="padding: 42px 100px;">
        <b-row class="border-style text-center">
          <b-col align-self="center title-color">
            <b class="fs-34">Unscheduled packet name</b>
            <b-col class="text-center fs-17">Enter a name of this unscheduled packet</b-col>
          </b-col>
        </b-row>
        <div>
          <b-input v-model="unscheduledPacketName" class="form-control mt-30 fs-15" style="height:40px" size="sm" placeholder="Enter name" />
        </div>
        <b-row class="mt-50">
          <b-col cols="6" class="align-btn-right">
            <button class="secondary-btn" @click="closeModal('unscheduledFormModal')">
                Cancel
            </button>
          </b-col>
          <b-col cols="6">
            <button class="primary-btn" @click="saveUnschedulePacket()">
                Save
              </button>
          </b-col>
        </b-row>
      </div>
    </b-modal>
  </div>
</template>

<script>
  import cloneDeep from 'lodash/cloneDeep';
  import orderBy from 'lodash/orderBy';
  import filter from 'lodash/filter';
  import sortBy from 'lodash/sortBy';
  import findIndex from 'lodash/findIndex';
  import swal from 'sweetalert2';
  import {
    mapActions,
  } from 'vuex';
  
  import mainHeader from '../common/main-header';
  import sideMenu from '../common/side-menu';

  import FormDesign from './form-design';
  import FormPreview from './preview-component';
  import SidePanel from './side-panel';
  
  // drop-down
  import DropDownProp from '../form-components/form-components-properties/drop-down-prop';
  import dropDownJson from '../../data/form-components-json/drop-down.json';
  
  // checkbox
  import CheckBoxProp from '../form-components/form-components-properties/check-box-prop';
  import checkBoxJson from '../../data/form-components-json/check-box.json';
  
  // text-numeric
  import TextNumericProp from '../form-components/form-components-properties/text-numeric-prop';
  import textNumericJson from '../../data/form-components-json/text-numeric.json';
  
  // single choice
  import SingleChoiceProp from '../form-components/form-components-properties/single-choice-prop';
  import singleChoiceJson from '../../data/form-components-json/single-choice.json';
  
  // Form Header
  import formHeaderJson from '../../data/form-components-json/form-header.json';
  
  // Form Paragraph
  import formParagraphJson from '../../data/form-components-json/form-paragraph.json';
  
  // Scale
  import ScaleProp from '../form-components/form-components-properties/scale-prop';
  import scaleJson from '../../data/form-components-json/scale.json';
  
  // Date/Time
  import DateTimeProp from '../form-components/form-components-properties/date-time-prop';
  import dateTimeJson from '../../data/form-components-json/date-time.json';
  
  // Form Table
  import FormTableProp from '../form-components/form-components-properties/form-table-prop';
  import formTableJson from '../../data/form-components-json/form-table.json';
  
  // Form TextArea
  import FormTextAreaProp from '../form-components/form-components-properties/form-text-area-prop';
  import formTextAreaJson from '../../data/form-components-json/form-text-area.json';
  
  export default {
    name: 'configure-new-form',
    components: {
      FormDesign,
      SidePanel,
      DropDownProp,
      FormPreview,
      CheckBoxProp,
      TextNumericProp,
      SingleChoiceProp,
      ScaleProp,
      DateTimeProp,
      FormTableProp,
      FormTextAreaProp,
      mainHeader,
      sideMenu,
    },
    data() {
      return {
        studyId: this.$route.params.studyId,
        formId: this.$route.params.formId,
        formToDuplicate: this.$route.query.duplicateFormId && this.$route.query.duplicateFormId.length > 1? this.$route.query.duplicateFormId : null,
        studyData: {},
        saveNewVersionBtn: false,
        editFormNameInput: false,
        defaultFormName: 'Form name (click to edit)',
        formName: window.localStorage.getItem('thread-edcFormName') || 'Form name (click to edit)',
        formNameError: false,
        savedFormFields: [],
        formTypes: [{
          text: 'Add to a unscheduled packet',
          value: 'Add to a unscheduled packet',
        },
        {
          text: 'Create a unscheduled packet',
          value: 'Create a unscheduled packet',
        }],
        formType: 'Add to a unscheduled packet',
        saveAsTemplate: false,
        mode: 'default',
        component: '',
        componentSchema: {},
        unscheduledPackets: [],
        edcformData: {},
        unscheduledPacketName: '',
        dropText: null,
        selectedPackets: '',
        formEditedFlag: true,
        hideShowCopyAction: true
      };
    },
    computed: {
      isEditMode() {
        const editMode = this.component.length > 0 || this.editFormNameInput;
        this.toggleEDCFormEditMode(editMode);
        return editMode;
      },
    },
    methods: {
      ...mapActions(['saveEDCFormData', 'saveEDCFormName', 'clearEDCData', 'toggleEDCFormEditMode']),
      isFormEdited(flag) {
        this.formEditedFlag = flag;
      },
      getStudyDetails() {
        this.$api.getStudyDataFact(this.studyId).then(response => {
          this.studyData = response.body;
        });
      },
      draggingText(textData) {
        this.dropText = textData;
      },
      droppedComponent(draggedData) {
        if (draggedData) {
          this.component = draggedData.component.id;
          this.switchComponent(this.component);
          this.componentSchema.order = this.savedFormFields.length + 1;
          const questions = filter(this.savedFormFields, comp => comp.fieldType === 'QUESTION');
          if (this.componentSchema.fieldType === 'QUESTION') {
            this.componentSchema.sequence = questions.length + 1;
          }
          this.savedFormFields.push(this.componentSchema);
        }
      },
      copyNewComponent(data) {
        let dataObject = cloneDeep(data);
        if(dataObject && dataObject.id) {
          delete dataObject.id;
        }
        if(dataObject && dataObject.options){
          _.map(dataObject.options, opt=>{
            delete opt.id;
          })
        }
        dataObject.fieldNameErrorMsg = "";
        dataObject.fieldName = "";
        dataObject.order = data.order + 1;
        const questions = filter(this.savedFormFields, comp => comp.fieldType === 'QUESTION');
        if (dataObject.fieldType === 'QUESTION') {
          dataObject.sequence = questions.length + 1;
        }

        if (dataObject.fieldType === 'QUESTION') {
          dataObject.sequence = questions.length + 1;
        }
        this.savedFormFields.splice(data.order, 0, dataObject);
        let totalFields = [];
        let sequence = null;
        this.savedFormFields.forEach((component, index) => {
          if(component.sequence != undefined) {
            component.sequence = sequence + 1;
            sequence += 1;
          } else {
            sequence = sequence == null ? index : sequence;
          }
          component.order = index + 1;
          totalFields.push(component);
        });
        this.savedFormFields = totalFields;
      },

      switchComponent(component) {
        switch (component) {
          case 'formDropdown':
            this.componentSchema = cloneDeep(dropDownJson);
            break;
          case 'formCheckbox':
            this.componentSchema = cloneDeep(checkBoxJson);
            break;
          case 'formTextNumeric':
            this.componentSchema = cloneDeep(textNumericJson);
            break;
          case 'formSinglechoice':
            this.componentSchema = cloneDeep(singleChoiceJson);
            break;
          case 'formHeader':
            this.componentSchema = cloneDeep(formHeaderJson);
            break;
          case 'formParagraph':
            this.componentSchema = cloneDeep(formParagraphJson);
            break;
          case 'formScale':
            this.componentSchema = cloneDeep(scaleJson);
            break;
          case 'formDateTime':
            this.componentSchema = cloneDeep(dateTimeJson);
            break;
          case 'formTable':
            this.componentSchema = cloneDeep(formTableJson);
            break;
          case 'formTextArea':
            this.componentSchema = cloneDeep(formTextAreaJson);
            break;
          default:
            break;
        }
      },
      editFormName() {
        this.editFormNameInput = !this.editFormNameInput;
        this.formNameError = false;
        this.defaultFormName = this.formName;
      },
      saveFormName() {
        if (!this.formName || this.formName.trim().length === 0) {
          this.formNameError = true;
          this.$toastr.error("Form name can't be empty.");
        } else {
          this.formEditedFlag = true;
          this.formNameError = false;
          this.defaultFormName = this.formName;
          this.saveEDCFormName(this.formName);
          this.editFormNameInput = false;
        }
      },
      cancelFormNameSave() {
        this.editFormNameInput = !this.editFormNameInput;
        this.formName = this.defaultFormName;
      },
      saveformdata(formdata) {
        this.savedFormFields = formdata;
        this.saveEDCFormData(this.savedFormFields);
        this.component = '';
      },
      editComponent(componentData) {
        this.component = componentData.name;
        this.componentSchema = componentData;
      },
      cancelForm() {
        if (this.component || this.savedFormFields.length > 0 || this.editFormNameInput) {
          swal({
            title: 'You have not saved your progress. Are you sure you want to cancel? Your changes will not be saved. ',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#b8c7ce',
            cancelButtonColor: '#34537d',
            confirmButtonText: 'Cancel',
            cancelButtonText: 'Yes',
          }).then(({
            dismiss,
          }) => {
            if (dismiss === 'cancel') {
              this.component = '';
              this.savedFormFields = [];
              this.componentSchema = {};
              this.clearEDCData();
              this.$router.push({
                name: 'forms-list',
                params: {
                  studyId: this.studyId,
                },
              });
            }
          });
        } else {
          this.$router.push({
            name: 'forms-list',
            params: {
              studyId: this.studyId,
            },
          });
        }
      },
      saveForm() {
        if (!this.savedFormFields || this.savedFormFields.length <= 0) {
          this.$toastr.error('Please add at least one question to the form.');
        } else if (this.component.length > 0) {
          this.$toastr.error('Save form elements before saving the form.');
        } else if (!this.formEditedFlag && this.saveNewVersionBtn) {
          this.$toastr.warning('Please edit the form to save the new form version.');
        } else if (this.component) {
          swal({
            title: 'You have not saved your progress. Are you sure you want to save? Your changes will not be saved. ',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#b8c7ce',
            cancelButtonColor: '#34537d',
            confirmButtonText: 'Cancel',
            cancelButtonText: 'Yes',
          }).then(({
            dismiss,
          }) => {
            if (dismiss === 'cancel') {
              this.$router.push({
                name: 'forms-list',
                params: {
                  studyId: this.studyId,
                },
              });
            }
          });
        } else {
          const saveForm = {};
          saveForm.name = this.formName;
          const questions = filter(this.savedFormFields, comp => comp.fieldType === 'QUESTION');
          saveForm.noOfQuestions = questions.length;
          this.savedFormFields = orderBy(this.savedFormFields, ['order']);
          saveForm.fields = this.savedFormFields;
          saveForm.studyId = this.studyId;
          const packets = filter(this.unscheduledPackets, packet => packet.selected);
          saveForm.unscheduledPacketIds = [];
          if (packets && packets.length > 0) {
            packets.forEach(packet => {
              saveForm.unscheduledPacketIds.push(packet.id);
            });
          }
          if (this.formId !== '0') {
            this.edcformData.fields = saveForm.fields;
            this.edcformData.name = saveForm.name;
            this.edcformData.noOfQuestions = saveForm.noOfQuestions;
            this.edcformData.formId = this.formId;
            const isFormChanged = true;
            this.edcformData.unscheduledPacketIds = saveForm.unscheduledPacketIds;
            this.$api
              .updateEDCFormDataFact(this.formId, this.studyId, isFormChanged, this.edcformData)
              .then(response => {
                this.forms = response.body;
                this.component = '';
                this.savedFormFields = [];
                this.componentSchema = {};
                this.clearEDCData();
                this.$router.push({
                  name: 'forms-list',
                  params: {
                    studyId: this.studyId,
                  },
                });
              })
              .catch(error => {
                if (error && (error.message || error.body.message)) {
                  this.$toastr.error(error.message || error.body.message).attr('style', 'max-width: 650px !important');
                }
              });
          } else {
            this.$api
              .postEDCFormFact(this.studyId, saveForm)
              .then(response => {
                this.forms = response.body;
                this.component = '';
                this.savedFormFields = [];
                this.componentSchema = {};
                this.clearEDCData();
                this.$router.push({
                  name: 'forms-list',
                  params: {
                    studyId: this.studyId,
                  },
                });
              })
              .catch(error => {
                if (error && (error.message || error.body.message)) {
                  this.$toastr.error(error.message || error.body.message).attr('style', 'max-width: 650px !important');
                }
              });
          }
        }
      },
      closeModal(ref) {
        this.$refs[ref].hide();
      },
  
      saveUnschedulePacket() {
        if (!this.unscheduledPacketName
        || !this.unscheduledPacketName.length
        || !this.unscheduledPacketName.trim()
        ) {
          this.$toastr.error('Please enter valid unschedule packet name.');
        } else {
          const data = {
            name: this.unscheduledPacketName,
          };
          this.$api.postUnscheduledPacketFact(this.studyId, data).then(response => {
            this.unscheduledPackets.push(response.body);
            this.unscheduledPackets = sortBy(this.unscheduledPackets, packet => packet.name);
            this.unscheduledPacketName = '';
            this.closeModal('unscheduledFormModal');
          });
        }
      },
  
      preventDropDownHide(event) {
        event.stopPropagation();
      },
  
      getEDCFormDetails() {
        let formID = this.formToDuplicate ? this.formToDuplicate : this.formId;
        this.$api.getEDCFormDataFact(formID, this.studyId).then(response => {
          this.edcformData = response.body;
          const formFields = [];
          this.edcformData.fields.forEach(field => {
            const formField = field;
            formField.mode = 'saved';
            formField.fieldNameErrorMsg = '';
            if(this.formToDuplicate){
              //We do not need the existing id in case od duplicate form.
              delete formField.id;
              //As a Duplicate form requirement we do not need to copy the fieldNames
              formField.fieldName = "";
              //Remove option id from the field
              if(formField.options){
                _.map(formField.options, opt=>{
                  delete opt.id;
                });
              }
            }
            formFields.push(formField);
          });
          this.edcformData.fields = formFields;
          this.savedFormFields = this.edcformData.fields;
          this.saveEDCFormData(this.savedFormFields);
          if(this.formToDuplicate){
            //As a Duplicate form requirement we need to Add 'Copy' to the form name & no need to copy the packets relationship
            this.formName = `${this.edcformData.name} Copy`;
            this.defaultFormName = `${this.edcformData.name} Copy`;
            delete this.edcformData.unscheduledPacketIds;
          }else{
            this.formName = this.edcformData.name;
            this.defaultFormName = this.edcformData.name;
          }
          this.getUnscheduledPackets();
        });
      },
      sortArrayOfObject(arrObject) {
        arrObject.sort(function(a, b) {
          var strA = a.name.toUpperCase();
          var strB = b.name.toUpperCase();
          return (strA < strB) ? -1 : (strA > strB) ? 1 : 0;
        });
        return arrObject;
      },
      getUnscheduledPackets() {
        this.$api.getUnscheduledPacketsFact(this.studyId).then(response => {
          this.unscheduledPackets = response.body;
          this.unscheduledPackets.forEach(packet => {
            const data = packet;
            data.selected = false;
          });
          this.unscheduledPackets = this.sortArrayOfObject(this.unscheduledPackets);
          if (this.edcformData && this.edcformData.unscheduledPacketIds) {
            this.edcformData.unscheduledPacketIds.forEach(packet => {
              const selectedIndex = findIndex(this.unscheduledPackets, ['id', packet]);
              this.unscheduledPackets[selectedIndex].selected = true;
            });
          }
          this.displaySelectedList();
        });
      },

      // display selected packets list
      displaySelectedList() {
        this.selectedPackets = '';
        const packets = filter(this.unscheduledPackets, packet => packet.selected);
        packets.forEach(packet => {
          if (packet.selected) {
            this.selectedPackets += `${packet.name}, `;
          }
        });
        // removes comma and space
        this.selectedPackets = this.selectedPackets.substring(0, this.selectedPackets.length - 2);
      },
    },
    mounted() {
      this.getStudyDetails();
      if ((this.$route.params.formId && this.$route.params.formId.length > 1) || this.formToDuplicate) {
        this.getEDCFormDetails();
        this.saveNewVersionBtn = this.formToDuplicate? false : !this.saveNewVersionBtn;
      } else {
        if(this.$route.params.formId==0){
          this.savedFormFields = [];  
        }
        else{
          this.savedFormFields = JSON.parse(window.localStorage.getItem('thread-edcData')) || [];
        }
        this.getUnscheduledPackets();
      }
      window.$('.dropdown-menu').on({
        click: e => {
          e.stopPropagation();
        },
      });
    },
  };
</script>

<style scoped lang="scss">

  .dropdown-toggle::after {
      display: none;
  }
  .main-container {
    background-color: #f5f6f7 !important;
    height: 100% !important;
    min-height: 100vh;
  }

  .formBackground {
    background-color: #f5f6f7 !important;
  }
  
  .whiteBackground {
    background-color: #ffffff !important;
  }

  .topFixed {
    position: fixed;
    right: 0;
    left: 200px;
    z-index: 99;
  }

  .pt-55 {
    padding-top: 55px !important;
  }

  .pr-65 {
    padding-right: 65px !important;
  }

  .center-area {
    z-index: 90;
  }
  #right-menu {
    background-color: #ffffff !important;
    position: fixed;
    right: 0;
    height: 82%;
    overflow-y: auto;
    z-index: 98;
    box-shadow: 0 2px 14px 0 rgba(0, 0, 0, 0.1);
  }
  
  .formNameCss {
    border-bottom: 1px solid #f5f6f7;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.06) !important;
  }
  
  .text-align {
    line-height: 23px !important;
  }
  
  .formNameEdit:hover {
    background-color: #f5f6f7;
    padding: 6px 10px 2px 0px !important;
  }
  
  .edit_hover_class {
    visibility: hidden;
  }
  
  .formNameEdit:hover .edit_hover_class {
    visibility: visible;
    color: #d4d9e2;
  }
  
  .primaryColor {
    color: #1e8fe1;
  }
  
  .primaryBgColor {
    background-color: #1e8fe1;
  }
  
  .cancelFormNameEditIcon {
    border: 0.5px solid;
    padding: 1.5px 3.5px;
    border-radius: 2px;
  }
  
  .formNameInput {
    border-right: none;
  }
  
  .is-danger {
    border-color: #ff4848;
  }

  .drag-drop-component {
    max-height: 385px;
    overflow-y: auto;
  }
  
  #dropdownMenuButton {
    background-color: #ffffff;
    color: #666769;
  }
  
  /deep/.dropdown-menu.show {
    overflow: hidden !important;
  }
  
  .sidePanelDisabled {
    pointer-events: none;
    cursor: none;
  }
  
  .unscheduleBtn {
    border: solid 1px #e4e8eb;
    outline: none;
    border-radius: 3px;
  }
  
  .btn-secondary:not(:disabled):not(.disabled):active,
  .btn-secondary:not(:disabled):not(.disabled).active,
  .show>.btn-secondary.dropdown-toggle {
    border: solid 1px #e4e8eb;
  }
  .align-btn-right {
    text-align: right;
  }

  /deep/.custom-checkbox .custom-control-label::before {
    border-radius: 0.25rem;
    border: 1px solid #9b9b9b;
  }
</style>
