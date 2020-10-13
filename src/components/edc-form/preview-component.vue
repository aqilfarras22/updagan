<template>
  <div :class="{primaryBackGround: !formData, primaryBackGround2: formData}" v-if="formData">
    <draggable :list="formData" @start="drag=true" @end="onDragComponent" :options="{ disabled: editMode }">
      <div v-for="(form,index) in formData" :key="index">
        <DropDownPreview class="editOnHover" :disableField="true" :componentData="form" v-if="form.name == 'formDropdown' && form.mode == 'saved'" @click.native="editField(form, index)"  @copyComponent="copyComponent" :hideShowCopyAction="hideShowCopyAction"/>
        <DropDown :formData="formData" v-if="form.name == 'formDropdown' && (form.mode == 'edit' || form.mode == 'new')" :dropdownSchema="form" @save="saveComponent" @deleteComponent="deleteComponent" @cancelComponent="cancelComponent"/>
        <CheckBoxPreview class="editOnHover" :disableField="true" :componentData="form" v-if="form.name == 'formCheckbox' && form.mode == 'saved'" @click.native="editField(form, index)"  @copyComponent="copyComponent" :hideShowCopyAction="hideShowCopyAction"/>
        <CheckBox :formData="formData" v-if="form.name == 'formCheckbox' && (form.mode == 'edit' || form.mode == 'new')" :checkboxSchema="form" @save="saveComponent" @deleteComponent="deleteComponent" @cancelComponent="cancelComponent"/>
        <SingleChoicePreview class="editOnHover" :disableField="true" :componentData="form" v-if="form.name == 'formSinglechoice' && form.mode == 'saved'" @click.native="editField(form, index)"  @copyComponent="copyComponent" :hideShowCopyAction="hideShowCopyAction"/>
        <SingleChoice :formData="formData" v-if="form.name == 'formSinglechoice' && (form.mode == 'edit' || form.mode == 'new')" :singleChoiceSchema="form" @save="saveComponent" @deleteComponent="deleteComponent" @cancelComponent="cancelComponent"/>
        <TextNumericPreview class="editOnHover" :disableField="true" :componentData="form" v-if="form.name == 'formTextNumeric' && form.mode == 'saved'" @click.native="editField(form, index)"  @copyComponent="copyComponent" :hideShowCopyAction="hideShowCopyAction"/>
        <TextNumeric :formData="formData" v-if="form.name == 'formTextNumeric' && (form.mode == 'edit' || form.mode == 'new')" :alphaNumericSchema="form" @save="saveComponent" @deleteComponent="deleteComponent" @cancelComponent="cancelComponent"/>
        <FormHeaderPreview class="editOnHover" :componentData="form" v-if="form.name == 'formHeader' && form.mode == 'saved'" @click.native="editField(form, index)" />
        <FormHeader v-if="form.name == 'formHeader' && (form.mode == 'edit' || form.mode == 'new')" :formHeaderSchema="form" @save="saveComponent" @deleteComponent="deleteComponent" @cancelComponent="cancelComponent" />
        <FormParagraphPreview class="editOnHover" :componentData="form" v-if="form.name == 'formParagraph' && form.mode == 'saved'" @click.native="editField(form, index)" />
        <FormParagraph v-if="form.name == 'formParagraph' && (form.mode == 'edit' || form.mode == 'new')" :formParagraphSchema="form" @save="saveComponent" @deleteComponent="deleteComponent" @cancelComponent="cancelComponent" />
        <DateTimePreview class="editOnHover" :disableField="true" :componentData="form" v-if="form.name == 'formDateTime' && (form.mode == 'saved')" @click.native="editField(form, index)"  @copyComponent="copyComponent" :hideShowCopyAction="hideShowCopyAction"/>
        <DateTime :formData="formData" v-if="form.name == 'formDateTime' && (form.mode == 'edit' || form.mode == 'new')" :dateTimeSchema="form" @save="saveComponent" @deleteComponent="deleteComponent" @cancelComponent="cancelComponent"/>
        <ScalePreview class="editOnHover" :disableField="true" :componentData="form" v-if="form.name == 'formScale' && form.mode == 'saved'" @click.native="editField(form, index)"  @copyComponent="copyComponent" :hideShowCopyAction="hideShowCopyAction"/>
        <Scale :formData="formData" v-if="form.name == 'formScale' && (form.mode == 'edit' || form.mode == 'new')" :scaleSchema="form" @save="saveComponent" @deleteComponent="deleteComponent" @cancelComponent="cancelComponent" />
        <FormTablePreview class="editOnHover" :disableField="true" :componentData="form" v-if="form.name == 'formTable' && form.mode == 'saved'" @click.native="editField(form, index)" :disableAddAnother="true"  @copyComponent="copyComponent" :hideShowCopyAction="hideShowCopyAction"/>
        <FormTable :formData="formData" v-if="form.name == 'formTable' && (form.mode == 'edit' || form.mode == 'new')" :formTableSchema="form" @save="saveComponent" @deleteComponent="deleteComponent" @cancelComponent="cancelComponent" />
        <FormTextAreaPreview class="editOnHover" :disableField="true" :componentData="form" v-if="form.name == 'formTextArea' && form.mode == 'saved'" @click.native="editField(form, index)"  @copyComponent="copyComponent" :hideShowCopyAction="hideShowCopyAction"/>
        <FormTextArea :formData="formData" v-if="form.name == 'formTextArea' && (form.mode == 'edit' || form.mode == 'new')" :formTextAreaSchema="form" @save="saveComponent" @deleteComponent="deleteComponent" @cancelComponent="cancelComponent" />
      </div>
    </draggable>
  </div>
</template>

<script>
import filter from 'lodash/filter';
import findIndex from 'lodash/findIndex';
import forEach from 'lodash/forEach';
import draggable from 'vuedraggable';
import cloneDeep from 'lodash/cloneDeep';
import { mapActions } from 'vuex';
import swal from 'sweetalert2';

import DropDownPreview from './preview-components/drop-down-preview';
import DropDown from '../form-components/drop-down';

import CheckBoxPreview from './preview-components/check-box-preview';
import CheckBox from '../form-components/check-box';

import SingleChoicePreview from './preview-components/single-choice-preview';
import SingleChoice from '../form-components/single-choice';

import TextNumericPreview from './preview-components/text-numeric-preview';
import TextNumeric from '../form-components/text-numeric';

import FormHeaderPreview from './preview-components/form-header-preview';
import FormHeader from '../form-components/form-header';

import FormParagraphPreview from './preview-components/form-paragraph-preview';
import FormParagraph from '../form-components/form-paragraph';

import DateTimePreview from './preview-components/date-time-preview';
import DateTime from '../form-components/date-time';

import ScalePreview from './preview-components/scale-preview';
import Scale from '../form-components/scale';

import FormTablePreview from './preview-components/form-table-preview';
import FormTable from '../form-components/form-table';

import FormTextAreaPreview from './preview-components/form-text-area-preview';
import FormTextArea from '../form-components/form-text-area';

export default {
  name: 'Form-view',
  data() {
    return {
      formData: [],
      selectedData: {},
      editMode: false,
      isFormEdited: false,
    };
  },
  props: ['formDataProp', 'hideShowCopyAction'],
  components: {
    draggable,
    DropDownPreview,
    CheckBoxPreview,
    SingleChoicePreview,
    TextNumericPreview,
    FormHeaderPreview,
    FormParagraphPreview,
    ScalePreview,
    DateTimePreview,
    FormTablePreview,
    FormTextAreaPreview,
    DropDown,
    CheckBox,
    TextNumeric,
    SingleChoice,
    FormHeader,
    FormParagraph,
    Scale,
    DateTime,
    FormTable,
    FormTextArea,
  },
  methods: {
    ...mapActions(['saveEDCFormData', 'clearEDCData']),
    // edit the current component which is clicked
    editField(form, index) {
      this.$emit('isFormEdited', true);
      const selected = filter(this.formData, o => o.mode === 'edit' || o.mode === 'new');
      if (selected.length === 0) {
        const data = form;
        data.mode = 'edit';
        // this.formData[index].mode = 'edit'; This cannot be done.
        // Because Vue cannot detect when we directly set an item with index of Array
        this.$set(this.formData, index, data);
        this.selectedData = cloneDeep(data);
        this.$emit('editComponent', data);
      }
      this.editMode = true;
    },

    // save the form component locally
    saveComponent(componentData) {
      this.$emit('isFormEdited', true);
      if (componentData.name !== 'formHeader' && componentData.name !== 'formParagraph') {
        const fields = filter(this.formData,
          o => o.fieldName && o.fieldName.length > 0 && o.fieldName === componentData.fieldName);
        if (fields.length >= 2) {
          this.$toastr.error('Please enter unique field name');
          return;
        }
      }
      const index = findIndex(this.formData, ['order', componentData.order]);
      this.formData.splice(index, 1, componentData);
      try {
        this.$emit('saveformdata', this.formData);
        this.editMode = false;
      } catch (error) {
        this.$toastr.error('Unable to save form data.');
      }
      this.$toastr.success('Question saved');
    },

    // cancel the component changes which are done since last save
    cancelComponent(order) {
      this.$emit('isFormEdited', true);
      swal({
        title:
          'Are you sure you want to cancel ?',
        type: 'warning',
        showCancelButton: true,
        allowOutsideClick: false,
        allowEscapeKey: false,
        confirmButtonColor: '#b8c7ce',
        cancelButtonColor: '#34537d',
        confirmButtonText: 'Cancel',
        cancelButtonText: 'Yes',
      }).then(({ dismiss }) => {
        if (dismiss === 'cancel') {
          const index = findIndex(this.formData, ['order', order]);
          this.selectedData.mode = 'saved';
          // this.formData[index].mode = 'edit'; This cannot be done.
          // Because Vue cannot detect when we directly set an item with index of Array
          this.$set(this.formData, index, this.selectedData);
          // this.formData[index].mode = 'saved';
          this.$emit('saveformdata', this.formData);
          this.editMode = false;
        }
      });
    },

    // delete the form component locally
    deleteComponent(componentData) {
      this.$emit('isFormEdited', true);
      swal({
        title:
          'Are you sure you want to delete ?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#b8c7ce',
        cancelButtonColor: '#34537d',
        confirmButtonText: 'Cancel',
        cancelButtonText: 'Yes',
      }).then(({ dismiss }) => {
        if (dismiss === 'cancel') {
          const selectedIndex = findIndex(this.formData, ['order', componentData.order]);
          this.formData.splice(selectedIndex, 1);
          forEach(this.formData, (component, index) => {
            const data = component;
            data.order = index + 1;
          });
          const questions = filter(this.formData, o => o.fieldType === 'QUESTION');
          forEach(questions, (question, ind) => {
            const data = question;
            data.sequence = ind + 1;
          });
          this.$emit('saveformdata', this.formData);
          this.editMode = false;
          if (this.formData.length <= 0) {
            this.$emit('draggingText', 'Drag and drop a field from the right panel to add to form');
            this.clearEDCData();
          }
        }
      });
    },

    onDragComponent() {
      this.$emit('isFormEdited', true);
      const tempFormData = cloneDeep(this.formData);
      forEach(tempFormData, (component, index) => {
        const data = component;
        data.order = index + 1;
        // tempFormData.push(data);
      });
      const questions = filter(tempFormData, o => o.fieldType === 'QUESTION');
      forEach(questions, (question, ind) => {
        const data = question;
        data.sequence = ind + 1;
      });
      this.formData = tempFormData;
      // this.formData.forEach((component, index) => {
      //   const data = component;
      //   data.order = index + 1;
      // });
      // const questions = filter(this.formData, o => o.fieldType === 'QUESTION');
      // forEach(questions, (question, ind) => {
      //   const data = question;
      //   data.sequence = ind + 1;
      // });
      this.saveEDCFormData(this.formData);
      this.$nextTick(() => {
        this.formData = tempFormData;
        this.$emit('saveformdata', this.formData);
      });
    },
    copyComponent(data) {
      this.$emit('isFormEdited', true);
      this.$emit('saveNewComponent',data);
    }
  },
  watch: {
    formData: {
      handler() {
        const selected = filter(this.formData, o => o.mode === 'edit' || o.mode === 'new');
        if (selected.length > 0) {
          this.editMode = true;
        }
      },
      deep: true,
      immediate: true,
    },
    formDataProp: {
      handler() {
        this.formData = this.formDataProp;
      },
      deep: true,
      immediate: true,
    },
  },
  mounted() {
    this.formData = this.formDataProp;
    this.$emit('isFormEdited', false);
  },
};
</script>

<style scoped>
.primaryBackGround {
  background-color: #ffffff !important;
  padding: 10px 20px 20px 20px !important;
}

.primaryBackGround2 {

  background-color: #ffffff !important;
  padding: 15px 10px 30px 10px !important;
  border-radius: 4px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.06);
}

.editOnHover:hover {
  border: 1px dashed #b8c7ce;
  cursor: pointer;
  padding: 0px;
  color: #b8c7ce;
  font-weight: lighter;
}

</style>
