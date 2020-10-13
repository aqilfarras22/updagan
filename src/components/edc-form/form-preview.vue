<template>
  <div class="pt-10">
    <b-row>
      <div class="ml-20 p-5 fw-bold fs-18">{{formName}}</div>
      <b-col v-for="(form,index) in formData" :key="index" cols="12">
        <DropDownPreview :componentData="form" :key="form.id" :formSubmitted="formSubmitted" v-if="form.name == 'formDropdown' && form.mode == 'saved'" :hideShowCopyAction="hideShowCopyAction" />
        <CheckBoxPreview :componentData="form" :key="form.id" :formSubmitted="formSubmitted" v-if="form.name == 'formCheckbox' && form.mode == 'saved'" />
        <SingleChoicePreview :componentData="form" :key="form.id" :formSubmitted="formSubmitted" v-if="form.name == 'formSinglechoice' && form.mode == 'saved'" />
        <TextNumericPreview :componentData="form" :key="form.id" :formSubmitted="formSubmitted" v-if="form.name == 'formTextNumeric' && form.mode == 'saved'" />
        <FormHeaderPreview :componentData="form" :key="form.id" v-if="form.name == 'formHeader' && form.mode == 'saved'" />
        <FormParagraphPreview :componentData="form" :key="form.id" v-if="form.name == 'formParagraph' && form.mode == 'saved'" />
        <DateTimePreview :formId="formId" :componentData="form" :key="form.id" :formSubmitted="formSubmitted" :queryTool="queryTool" v-if="form.name == 'formDateTime' && (form.mode == 'saved')" />
        <ScalePreview :componentData="form" :key="form.id" :formSubmitted="formSubmitted" v-if="form.name == 'formScale' && (form.mode == 'saved')" />
        <FormTextAreaPreview :componentData="form" :key="form.id" :formSubmitted="formSubmitted" v-if="form.name == 'formTextArea' && (form.mode == 'saved')" />
        <FormTablePreview :componentData="form" :key="form.id" :formSubmitted="formSubmitted" v-if="form.name == 'formTable' && (form.mode == 'saved')" :disableAddAnother="false"/>
      </b-col>
    </b-row>
  </div>
</template>

<script>
  import DropDownPreview from './preview-components/drop-down-preview';
  import CheckBoxPreview from './preview-components/check-box-preview';
  import SingleChoicePreview from './preview-components/single-choice-preview';
  import TextNumericPreview from './preview-components/text-numeric-preview';
  import FormHeaderPreview from './preview-components/form-header-preview';
  import FormParagraphPreview from './preview-components/form-paragraph-preview';
  import DateTimePreview from './preview-components/date-time-preview';
  import ScalePreview from './preview-components/scale-preview';
  import FormTextAreaPreview from './preview-components/form-text-area-preview';
  import FormTablePreview from './preview-components/form-table-preview';
  
  export default {
    name: 'form-preview',
    props: ['formData', 'formName', 'queryTool', 'formSubmitted', 'hideShowCopyAction', 'formId'],
    components: {
      DropDownPreview,
      CheckBoxPreview,
      SingleChoicePreview,
      TextNumericPreview,
      FormHeaderPreview,
      FormParagraphPreview,
      DateTimePreview,
      ScalePreview,
      FormTextAreaPreview,
      FormTablePreview,
    },
    data() {
      return {
        studyId: this.$route.params.studyId,
      };
    },
    mounted() {},
    methods: {},
    computed: {},
  };
</script>

<style scoped lang="scss">
  
</style>
