<template>
  <div>
    <b-row>
      <b-col cols="11" class="pl-0 pr-0">
        <b-row>
          <router-link :to="{ name: 'forms-list'}">
            <i class="fa fa-angle-left pr-8 fs-16" aria-hidden="true"></i>All forms</router-link>
        </b-row>
        <b-row class="pt-10 pb-20">
          <b-col cols="12" lg="10" class="pl-0" align-self="center">
            <h2 class="mb-0">
              <b>{{mainVersionFormData.name}}</b>
            </h2>
            <!-- <span>Included in Unscheduled packet A</span> -->
          </b-col>
        </b-row>
        <b-row>
          <div :class="{primaryBackGround: !isOldVersion, primaryBackgroundNoPadd: isOldVersion} ">
            <div v-if="!isOldVersion">
              <navBar v-if="navBarRoutes" :routes="navBarRoutes" />
              <b-row class="pt-20">
                <b-col cols="9">
                  <h6>
                    <span class="versionNumber">{{formVersions.length}}</span> Versions
                  </h6>
                </b-col>
                <b-col cols="3" class="text-right">
                  <b-form-select v-model="selectedShowOption" class="fs-12" size="sm" @change="showForms">
                    <option v-for="(option, index) in showOptions" :key="index" :value="option.value">{{option.text}}</option>
                  </b-form-select>
                </b-col>
              </b-row>
              <b-row class="pb-20">
                <b-col cols="5" class="tableHeading fs-12">
                  Version number
                </b-col>
                <b-col cols="6" class="tableHeading fs-12">
                  Date created
                </b-col>
              </b-row>
              <b-row v-for="(version, index) in currentFormVersions" :key="index" class="pb-10" v-if="formVersions.length">
                <b-col cols="5" class="fs-12">
                  <!-- <router-link :to="{ name: 'form-view', params: {studyId: studyId, formId: formId}}">{{version.name}}</router-link> -->
                  <b-link @click="showOldVersionForm(version)">Version {{version.version}}</b-link>
                </b-col>
                <b-col cols="6" class="fs-12">
                  {{new Date(version.timestamp) | formatGMTDate}}
                </b-col>
              </b-row>
              <b-row class="pt-20 pl-15">
                <div @click="prevPage" class="arrow-icon cursor_pointer" :class="{ 'disabledPagination': currentPage <= 1}">
                  <i class="fa fa-angle-left fs-23"></i>
                </div>
                <div class="pagination">
                  {{currentPage}}
                </div>
                <div class="pagination2">
                  of {{totalPages}}
                </div>
                <div @click="nextPage" class="arrow-icon cursor_pointer" :class="{ 'disabledPagination': currentPage >= totalPages}">
                  <i class="fa fa-angle-right fs-23"></i>
                </div>
              </b-row>
            </div>
            <div v-if="isOldVersion">
              <b-row class="pt-20">
                <b-link @click="isOldVersion = !isOldVersion" class="pl-28">
                  <i class="fa fa-angle-left pr-8 fs-16" aria-hidden="true"></i>All Versions</b-link>
              </b-row>
              <b-row class="pt-30 pl-28">
                <label>
                  <b>Version {{selectedVersion.version}}</b>
                </label>
              </b-row>
              <FormPreview :hideShowCopyAction="hideShowCopyAction" :formData="versionFormData.fields" />
            </div>
          </div>
        </b-row>
      </b-col>
      <b-col></b-col>
    </b-row>
  </div>
</template>

<script>
import slice from 'lodash/slice';
import ceil from 'lodash/ceil';
import orderBy from 'lodash/orderBy';

import navBar from '@/components/common/nav-bar';

import FormPreview from './form-preview';

export default {
  name: 'Form-view',
  data() {
    return {
      mainFormId: this.$route.params.formId,
      studyId: this.$route.params.studyId,
      mainVersionFormData: {},
      versionFormData: {},
      selectedVersion: {},
      formData: [],
      isOldVersion: false,
      currentPage: 1,
      totalPages: 0,
      showOptions: [],
      selectedShowOption: 10,
      formVersions: [],
      currentFormVersions: [],
      collectionOfAllFormVersions: [],
      hideShowCopyAction: false
    };
  },
  components: {
    navBar,
    FormPreview,
  },
  methods: {
    // get the form details
    getEDCMainFormDetails() {
      this.$api.getEDCFormDataFact(this.mainFormId, this.studyId).then(response => {
        this.mainVersionFormData = response.body;
        const formFields = [];
        this.mainVersionFormData.fields.forEach(field => {
          const formField = field;
          formField.mode = 'saved';
          formFields.push(formField);
        });
        this.mainVersionFormData.fields = formFields;
      });
    },

    // get the versioned form details
    getEDCFormVersionDetails(formId) {
      this.versionFormData = {};
      this.$api.getEDCformversionDataFact(this.mainFormId, formId, this.studyId).then(response => {
        this.versionFormData = response.body;
        const formFields = [];
        this.versionFormData.fields.forEach(field => {
          const formField = field;
          formField.mode = 'saved';
          formFields.push(formField);
        });
        this.versionFormData.fields = formFields;
      });
    },

    // get all the form versions of given form id and study id
    getFormVersions() {
      this.$api.getEDCformversionsDataFact(this.mainFormId, this.studyId).then(response => {
        this.formVersions = response.body;
        this.formVersions = orderBy(this.formVersions, ['version'], ['desc']);
        this.showForms(this.selectedShowOption);
      });
    },

    // show the available form versions for given show number of items
    // set current and total pages for pagination
    showForms(selectedShowOption) {
      // set totalPages to 1 if the available form versions are less than selectedShowOption
      this.totalPages = ceil(this.formVersions.length / selectedShowOption) === 0
        ? 1
        : ceil(this.formVersions.length / selectedShowOption);
      this.collectionOfAllFormVersions = [];
      let start = 0;
      let end = selectedShowOption;
      for (let index = 0; index < this.totalPages; index++) {
        this.collectionOfAllFormVersions.push(slice(this.formVersions, start, end));
        start += selectedShowOption;
        end += selectedShowOption;
      }
      if (!this.showOptions || !this.showOptions.length) {
        for (let index = 1; index <= this.totalPages; index++) {
          this.showOptions.push({
            value: index * 10,
            text: `Show ${index * 10} items`,
          });
        }
      }
      this.currentPage = 1;
      this.currentFormVersions = this.collectionOfAllFormVersions[this.currentPage - 1];
    },

    // function to show the previous set of forms
    prevPage() {
      if (this.currentPage <= this.totalPages) {
        this.currentPage -= 1;
        this.currentFormVersions = this.collectionOfAllFormVersions[this.currentPage - 1];
      }
    },

    // function to show the next set of forms
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentFormVersions = this.collectionOfAllFormVersions[this.currentPage];
        this.currentPage += 1;
      }
    },

    // hide versions list and show clicked form version details
    showOldVersionForm(version) {
      this.selectedVersion = version;
      this.isOldVersion = !this.isOldVersion;
      this.getEDCFormVersionDetails(version.formVersionId);
    },
  },
  mounted() {
    this.getEDCMainFormDetails();
    this.getFormVersions();
  },
  computed: {
    navBarRoutes() {
      return [
        {
          label: 'Current version',
          to: {
            name: 'form-view',
            params: { studyId: this.studyId, formId: this.mainFormId },
          },
        },
        {
          label: 'Version history',
          to: {
            name: 'form-versions',
            params: { studyId: this.studyId, formId: this.mainFormId },
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

.primaryBackgroundNoPadd {
  background-color: #ffffff !important;
  padding-bottom: 25px;
  margin-bottom: 20px;
  width: 100% !important;
  border-radius: 4px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.06);
}

.tableHeading {
  color: #9b9b9b !important;
}

.versionNumber {
  color: #f16559;
}

.arrow-icon {
  width: 25px;
  height: 25px;
  border-radius: 3px;
  background-color: #ffffff;
  border: solid 1px #e4e8eb;
  text-align: center;
  font-size: 23px;
  line-height: 10px !important;
  color: #e4e8eb;
}

.pagination {
  width: 30px;
  height: 25px;
  border-radius: 2px;
  background-color: #ffffff;
  border: solid 1px #e4e8eb;
  text-align: center;
  font-size: 13px;
  line-height: 23px !important;
  color: #4a4a4a;
  padding-left: 11px !important;
}

.pagination2 {
  width: 45px;
  height: 25px;
  background-color: #ffffff;
  font-size: 13px;
  line-height: 23px !important;
  color: #4a4a4a;
  padding-left: 6px !important;
}

.disabledPagination {
  pointer-events: none;
}

/deep/.nav-bar .nav-link.active {
  padding-left: 2px !important;
  padding-right: 2px !important;
  color: #4a4a4a !important;
}

/deep/.nav-bar .nav-link {
  padding-left: 2px !important;
  color: #9b9b9b;
  font-weight: bold;
}
</style>
