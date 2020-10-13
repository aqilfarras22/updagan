<template>
  <div>
    <b-row>
      <b-col cols="11" class="pl-0 pr-0">
        <b-row>
          <router-link :to="{ name: 'forms-list'}">
            <i class="fa fa-angle-left pr-8 fs-16" aria-hidden="true"></i>All forms
          </router-link>
        </b-row>
        <b-row class="pt-10 pb-20">
          <b-col cols="12" lg="10" class="pl-0" align-self="center">
            <h2 class="mb-0">
              <b>{{formData.name}}</b>
            </h2>
            <!-- <span>Included in Unscheduled packet A</span> -->
          </b-col>
          <b-col cols="12" lg="2" align-self="center">
            <b-btn class="fs-12 pull-right primaryBgColor" variant="primary" v-if="studyData.status !== 'Active'" @click="editForm()">Edit this form</b-btn>
            <b-btn class="fs-12 pull-right primaryBgColor" variant="primary" v-if="studyData.status === 'Active'" v-b-modal.editFormModal>Edit this form</b-btn>
          </b-col>
        </b-row>
        <b-row class="mb-20">
          <span class="primaryBackGround">
            <navBar v-if="navBarRoutes" :routes="navBarRoutes" />
            <FormPreview :formData="formData.fields" class="pointerEventsNone"/>
          </span>
        </b-row>
        <!-- Edit form confirmation  Modal Component -->
        <b-modal id="editFormModal" ref="editFormModal" @hidden="closeModal('editFormModal')" hide-footer hide-header>
          <b-row class="pt-20 border-style text-center">
            <b-col align-self="center" class="pb-0">
              <h2>
                <b>Warning</b>
              </h2>
            </b-col>
          </b-row>
          <b-row class="text-center">
            This project is live, any edits may require resubmission and re-approval. Are you sure you want to continue?
          </b-row>
          <b-row class="pt-20 pb-40">
            <b-col cols="3"></b-col>
            <b-col cols="3">
              <b-btn class="btn-block fs-14" variant="secondary" @click="closeModal('editFormModal')">
                No
              </b-btn>
            </b-col>
            <b-col cols="3">
              <b-btn class="btn-block fs-14 error-bg primaryBgColor" variant="primary" @click="editForm()">
                Yes
              </b-btn>
            </b-col>
          </b-row>
          <div class="modal-style">
          </div>
        </b-modal>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import navBar from '@/components/common/nav-bar';

import FormPreview from './form-preview';

export default {
  name: 'Form-view',
  data() {
    return {
      formId: this.$route.params.formId,
      studyId: this.$route.params.studyId,
      formData: [],
      studyData: {},
    };
  },
  components: {
    navBar,
    FormPreview,
  },
  methods: {
    getStudyDetails() {
      this.$api.getStudyDataFact(this.studyId).then(response => {
        this.studyData = response.body;
        this.getEDCFormDetails();
      });
    },
    getEDCFormDetails() {
      this.$api.getEDCFormDataFact(this.formId, this.studyId).then(response => {
        this.formData = response.body;
        const formFields = [];
        this.formData.fields.forEach(field => {
          const formField = field;
          formField.mode = 'saved';
          formFields.push(formField);
        });
        this.formData.fields = formFields;
      });
    },

    editForm() {
      this.$router.push({
        name: 'configure-new-form',
        params: {
          studyId: this.studyId,
          formId: this.formId,
        },
      });
    },

    closeModal(ref) {
      this.$refs[ref].hide();
    },
  },
  mounted() {
    this.getStudyDetails();
  },
  computed: {
    navBarRoutes() {
      return [
        {
          label: 'Current version',
          to: {
            name: 'form-view',
            params: { studyId: this.studyId, formId: this.formId },
          },
        },
        {
          label: 'Version history',
          to: {
            name: 'form-versions',
            params: { studyId: this.studyId, formId: this.formId },
          },
        },
      ];
    },
  },
};
</script>

<style scoped>
.primaryBackGround {
  background-color: #ffffff !important;
  padding: 0px 20px 20px 20px !important;
  width: 100% !important;
  border-radius: 4px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.06);
}
.pointerEventsNone {
  pointer-events: none;
}
  
.primaryBgColor {
  background-color: #1e8fe1;
}

/deep/.nav-bar .nav-link.active {
  padding-left: 2px !important;
  padding-right: 2px !important;
  color: #4a4a4a !important;
}

/deep/.nav-bar .nav-link {
  padding-right: 2px !important;
  color: #9b9b9b !important;
  font-weight: bold;
}
</style>
