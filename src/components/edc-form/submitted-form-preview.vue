<template>
  <div class="pt-10">
    <b-row>
      <b-col v-for="(form,index) in formData" :key="index" cols="12" class="pl-0 pr-0 form-components">
        <div class="fieldCmp"  :class="{ 'cursor_pointer': (form.name != 'formHeader' && form.name != 'formParagraph' && !isHistory && checkForChangeField(form.id))}">
          <DropDownSubmittedPreview :id="form.id" :componentData="form" v-if="form.name == 'formDropdown'" :isEdited="checkForChangeField(form.id)" @click.native="select(form.id)" :class="{ selected: selectedId === form.id}" class="pb-20"/>
          <CheckBoxSubmittedPreview :id="form.id" :componentData="form" v-if="form.name == 'formCheckbox'" :isEdited="checkForChangeField(form.id)" @click.native="select(form.id)" :class="{ selected: selectedId === form.id}" class="pb-20"/>
          <SingleChoiceSubmittedPreview :id="form.id" :componentData="form" v-if="form.name == 'formSinglechoice'" :isEdited="checkForChangeField(form.id)" @click.native="select(form.id)" :class="{ selected: selectedId === form.id}" class="pb-20"/>
          <TextNumericSubmittedPreview :id="form.id" :componentData="form" v-if="form.name == 'formTextNumeric'" :isEdited="checkForChangeField(form.id)" @click.native="select(form.id)" :class="{ selected: selectedId === form.id}" class="pb-20"/>
          <FormHeaderSubmittedPreview :id="form.id" :componentData="form" v-if="form.name == 'formHeader'" :isEdited="checkForChangeField(form.id)" @click.native="select(form.id)" :class="{ selected: selectedId === form.id}" class="pb-20"/>
          <FormParagraphSubmittedPreview :id="form.id" :componentData="form" v-if="form.name == 'formParagraph'" :isEdited="checkForChangeField(form.id)" @click.native="select(form.id)" :class="{ selected: selectedId === form.id}" class="pb-20"/>
          <DateTimeSubmittedPreview :id="form.id" :componentData="form" v-if="form.name == 'formDateTime'" :isEdited="checkForChangeField(form.id)" @click.native="select(form.id)" :class="{ selected: selectedId === form.id}" class="pb-20"/>
          <ScaleSubmittedPreview :id="form.id" :componentData="form" v-if="form.name == 'formScale'" :isEdited="checkForChangeField(form.id)" @click.native="select(form.id)" :class="{ selected: selectedId === form.id}" class="pb-20"/>
          <FormTextAreaSubmittedPreview :id="form.id" :componentData="form" v-if="form.name == 'formTextArea'" :isEdited="checkForChangeField(form.id)" @click.native="select(form.id)" :class="{ selected: selectedId === form.id}" class="pb-20"/>
          <FormTableSubmittedPreview :id="form.id" :componentData="form" v-if="form.name == 'formTable'" :isEdited="checkForChangeField(form.id)" @click.native="select(form.id)" :class="{ selected: selectedId === form.id}" class="pb-20"/>
        </div>
        <button v-if="form.name != 'formHeader' && form.name != 'formParagraph' && !isHistory && (canCraAccess || canDmAccess)" class="btn fw-bold fs-12 btnDisplay btn-outline-primary" @click="openQuery(form.id)">OPEN A QUERY</button>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { CRA, DM } from '@/constants/authRoles';
import { AclRule } from 'vue-acl';
import { mapGetters } from 'vuex';

import DropDownSubmittedPreview from './submitted-preview-components/drop-down-submitted-preview';
import CheckBoxSubmittedPreview from './submitted-preview-components/check-box-submitted-preview';
import SingleChoiceSubmittedPreview from './submitted-preview-components/single-choice-submitted-preview';
import TextNumericSubmittedPreview from './submitted-preview-components/text-numeric-submitted-preview';
import FormHeaderSubmittedPreview from './submitted-preview-components/form-header-submitted-preview';
import FormParagraphSubmittedPreview from './submitted-preview-components/form-paragraph-submitted-preview';
import DateTimeSubmittedPreview from './submitted-preview-components/date-time-submitted-preview';
import ScaleSubmittedPreview from './submitted-preview-components/scale-submitted-preview';
import FormTextAreaSubmittedPreview from './submitted-preview-components/form-text-area-submitted-preview';
import FormTableSubmittedPreview from './submitted-preview-components/form-table-submitted-preview';

export default {
  name: 'submitted-form-preview',
  props: ['formData', 'isHistory', 'queryIds', 'selectedFieldId', 'selectedId'],
  components: {
    DropDownSubmittedPreview,
    CheckBoxSubmittedPreview,
    SingleChoiceSubmittedPreview,
    TextNumericSubmittedPreview,
    FormHeaderSubmittedPreview,
    FormParagraphSubmittedPreview,
    DateTimeSubmittedPreview,
    ScaleSubmittedPreview,
    FormTextAreaSubmittedPreview,
    FormTableSubmittedPreview,
  },
  data() {
    return {
      formId: this.$route.params.formId,
      studyId: this.$route.params.studyId,
    };
  },
  mounted() {},
  methods: {
    openQuery(id) {
      this.$emit('openQuery', id);
    },
    checkForChangeField(id) {
      return this.queryIds && this.queryIds.includes(id);
    },
    select(id) {
      if (this.queryIds && this.queryIds.includes(id)) {
        this.$emit('selected', id);
      }
    },
    scrollToId() {
      if (this.selectedId) {
        window.document.getElementById(`${this.selectedId}`).scrollIntoViewIfNeeded(true);
      }
    },
  },
  computed: {
    ...mapGetters(['user']),
    userAccess() {
      return new AclRule(this.user.userRole).generate();
    },
    canCraAccess() {
      this.$acl.change(`${CRA}`);
      return this.$acl.check('userAccess');
    },
    canDmAccess() {
      this.$acl.change(`${DM}`);
      return this.$acl.check('userAccess');
    },
  },
  watch: {
    selectedId: {
      handler() {
        this.scrollToId();
      },
    },
  },
};
</script>

<style scoped lang="scss">
.btnDisplay {
  top: 10px;
  right: 10px;
  position: absolute;
  border-color: #d3dfe4;
  background-color: #fff;
}
.btnDisplay:hover {
  color: #fff !important;
  background-color: #4c8ce4 !important;
}
.fieldCmp{
  color: #666669;
}
.form-components:last-of-type{
  padding-bottom:15px
}
.fieldCmp:hover + .btnDisplay,
.btnDisplay:hover {
  display: block;
}
.selected {
  background: #f9f9e0;
  border-color: #d3dfe4;
}

</style>
