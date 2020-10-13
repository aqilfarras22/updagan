<template>
  <div>
    <b-row>
      <h2 class="dataCaptureForms">
        <b>Schedule Data Capture Forms</b>
      </h2>
    </b-row>
    <b-row class="pb-20">
      <h6>
        <b class="headingColor">Schedule forms using established milestones. You may
          <span class="color_1e8fe1 cursor_pointer" v-on:click="goToMilestones()"> create or edit milestones here.</span>
        </b>
      </h6>
    </b-row>
    <b-row class="mb-20">
      <b-col class="tableBg" cols="11">
        <b-row class="pb-10">
          <b-col cols="10" class="p-0">
            <h6>
              <b class="headingColor">Milestones</b>
            </h6>
          </b-col>
          <b-col cols="2" class="p-0 text-right">
            <b-form-select v-model="selectedShowOption" size="sm" :options="showOptions" class="mb-3 fs-12" @change="showMilestones" />
          </b-col>
        </b-row>
        <b-row v-for="(milestone, index) in currentMilestoneList" :key="index">
          <b-col cols="12" class="p-0" v-if="!milestone.showStatus" :class="{'disabled-milestone': editMode }">
            <b-row>
              <b-col cols="10" class="p-0 fw-bold">
                Milestone {{milestone.index}}
              </b-col>
              <b-col cols="2" class="p-0 text-right">
                <button type="button" class="btn btn-primary btn-sm primaryBgColor fs-12" @click.prevent="showForms(index)" :disabled="editMode">
                  Select forms
                </button>
              </b-col>
            </b-row>
            <b-col cols="12" class="p-0">
              <b-row v-for="(form, index) in milestone.forms" :key="index" v-if="form.selected" class="pt-4 pb-4">
                <b-col class="pl-0">
                  {{form.formName}}
                </b-col>
                <b-col v-if="form.required">
                  <span class="pl-20 text-align">Required</span>
                </b-col>
              </b-row>
              <hr v-if="index < currentMilestoneList.length-1">
            </b-col>
          </b-col>
          <b-col cols="12" class="p-0 pb-20" v-if="milestone.showStatus">
            <div class="formsBg">
              <b-row class="fw-bold headingTextColor">
                Milestone {{selectedMilestone.index}} forms
              </b-row>
              <b-row class="pb-10 headingTextColor">
                Add forms first, then set requirement and order.
              </b-row>
              <b-row class="no-forms fs-14" v-if="!selectedMilestone.forms || selectedMilestone.forms.length <= 0">
                No forms added
              </b-row>
              <draggable v-model="selectedMilestone.forms" @start="drag=true" @end="drag=false" @change="onDragForms" v-if="selectedMilestone.forms && selectedMilestone.forms.length > 0">
                <b-row v-for="(form, index) in selectedMilestone.forms" :key="index" class="form-card" v-if="form.selected">
                  <b-col cols="9" class="pl-0">
                    <span class="left-icon">
                      <i class="fa fa-ellipsis-v"></i>
                      <i class="fa fa-ellipsis-v"></i>
                    </span>
                    <span class="pl-10">{{form.formName}}</span>
                  </b-col>
                  <b-col cols="2">
                    <b-form-checkbox class="pl-0 position-absolute" v-model="form.required">
                    </b-form-checkbox>
                    <span class="pl-30 text-align">Required</span>
                  </b-col>
                  <b-col cols="1" class="text-right">
                    <span class="cursor_pointer color_e4e8eb fs-16" @click="removeForm(form)">
                      <i class="fa fa-minus-circle"></i>
                    </span>
                  </b-col>
                </b-row>
              </draggable>
              <hr>
              <b-row>
                <b-col cols="6" class="p-0 pt-3 pb-3" v-for="(form, index) in selectedForms" :key="index" v-if="!form.selected">
                  <span class="cursor_pointer" @click="addForm(index)">
                    <i class="fa fa-plus-circle color_1e8fe1 fs-16"></i>
                    <span class="pl-4">{{form.formName}}</span>
                  </span>
                </b-col>
              </b-row>
              <b-row class="pt-20 pl-0">
                <b-col class="pl-0">
                  <b-btn class="btn btnClass mr-5" variant="outline-secondary" size="sm" @click="cancelMilestone()">Cancel</b-btn>
                  <b-btn class="btn btnClass primaryBgColor" variant="primary" size="sm" @click="saveMilestone()" :disabled="(!selectedMilestone.forms || selectedMilestone.forms.length <= 0) && selectedMilestone.disableSave">Save</b-btn>
                </b-col>
              </b-row>
            </div>
          </b-col>
        </b-row>
        <b-row class="pt-20">
          <div @click="prevPage" class="arrow-icon cursor_pointer" :class="{ 'disabledPagination': currentPage <= 1 || editMode }">
            <i class="fa fa-angle-left fs-23"></i>
          </div>
          <div class="pagination">
            {{currentPage}}
          </div>
          <div class="pagination2">
            of {{totalPages}}
          </div>
          <div @click="nextPage" class="arrow-icon cursor_pointer" :class="{ 'disabledPagination': currentPage >= totalPages || editMode }">
            <i class="fa fa-angle-right fs-23"></i>
          </div>
        </b-row>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import draggable from 'vuedraggable';
import slice from 'lodash/slice';
import ceil from 'lodash/ceil';
import cloneDeep from 'lodash/cloneDeep';
import forEach from 'lodash/forEach';
import findIndex from 'lodash/findIndex';

export default {
  name: 'schdeule-form',
  components: {
    draggable,
  },
  data() {
    return {
      milestoneSchedule: {
        schedule: [],
      },
      forms: [],
      studyId: this.$route.params.studyId,
      showOptions: [],
      selectedMilestones: [],
      selectedShowOption: 10,
      currentPage: 1,
      totalPages: 1,
      showIndex: 1,
      selectedMilestone: {},
      selectedForms: [],
      studyData: {},
      editMode: false,
      currentMilestoneList: [],
    };
  },
  computed: {},
  methods: {
    // Redirect to milestones setup page
    goToMilestones() {
      window.localStorage.setItem('designIndex', 11);
      this.$router.push({ name: 'study-design', params: { studyId: this.studyId } });
    },
    getEDCFormDetails() {
      this.$api.getEDCFormsFact(this.studyId).then(response => {
        this.forms = response.body;
        this.forms.forEach(form => {
          const data = form;
          data.selected = false;
          data.required = false;
        });
        this.getMilestoneDetails();
      });
    },
    getMilestoneDetails() {
      this.$api.getEDCMilestonesFact(this.studyId).then(response => {
        const tmpMilestoneSchedule = response.body;
        this.milestoneSchedule.scheduleId = tmpMilestoneSchedule.scheduleId;
        if (tmpMilestoneSchedule && tmpMilestoneSchedule.schedule) {
          const studyMilestones = this.studyData.milestones;
          const tmpMilestones = [];
          studyMilestones.forEach(data => {
            const tmpInd = findIndex(tmpMilestoneSchedule.schedule, ['milestone', data]);
            const tmpSchedule = tmpMilestoneSchedule.schedule[tmpInd];
            tmpMilestones.push(tmpSchedule);
          });
          this.milestoneSchedule.schedule = tmpMilestones;
          this.milestoneSchedule.schedule.forEach((milestone, index) => {
            const tmp = milestone;
            tmp.index = index + 1;
            milestone.forms.forEach(form => {
              const ind = findIndex(this.forms, ['formId', form.formId]);
              const data = form;
              data.selected = true;
              data.formName = this.forms[ind].formName;
            });
          });
          this.showMilestones(this.selectedShowOption);
        } else {
          this.setMilestone();
          this.showMilestones(this.selectedShowOption);
        }
      });
    },
    showMilestones(selectedShowOption) {
      this.totalPages = ceil(this.milestoneSchedule.schedule.length / selectedShowOption) === 0
        ? 1
        : ceil(this.milestoneSchedule.schedule.length / selectedShowOption);
      this.selectedMilestones = [];
      let start = 0;
      let end = selectedShowOption;
      for (let index = 0; index < this.totalPages; index++) {
        this.selectedMilestones.push(slice(this.milestoneSchedule.schedule, start, end));
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
      this.currentMilestoneList = this.selectedMilestones[this.currentPage - 1];
    },
    prevPage() {
      if (this.currentPage <= this.totalPages) {
        this.currentPage -= 1;
        this.currentMilestoneList = this.selectedMilestones[this.currentPage - 1];
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentMilestoneList = this.selectedMilestones[this.currentPage];
        this.currentPage += 1;
      }
    },
    showForms(index) {
      this.editMode = true;
      this.selectedMilestone = cloneDeep(this.currentMilestoneList[index]);
      this.selectedMilestone.showStatus = true;
      this.selectedMilestone.disableSave = true;
      this.currentMilestoneList[index].showStatus = true;
      this.selectedForms = cloneDeep(this.forms);
      this.selectedForms.forEach(form => {
        const data = form;
        data.selected = false;
        data.required = false;
      });
      forEach(this.selectedMilestone.forms, form => {
        const selectedIndex = findIndex(this.selectedForms, ['formName', form.formName]);
        this.selectedForms[selectedIndex].selected = true;
        this.selectedForms[selectedIndex].required = form.required;
        this.selectedForms[selectedIndex].index = form.index;
      });
    },
    addForm(index) {
      const form = this.selectedForms[index];
      form.selected = true;
      this.$set(this.selectedForms, index, form);
      this.selectedMilestone.forms = [];
      forEach(this.selectedForms, formData => {
        if (formData.selected) {
          this.selectedMilestone.forms.push(formData);
        }
      });
      this.updateIndex();
    },
    removeForm(form) {
      const formIndex = findIndex(this.selectedForms, ['formId', form.formId]);
      this.selectedForms[formIndex].selected = false;
      this.selectedMilestone.forms = [];
      forEach(this.selectedForms, formData => {
        if (formData.selected) {
          this.selectedMilestone.forms.push(formData);
        }
      });
      this.selectedMilestone.disableSave = false;
      this.updateIndex();
    },
    updateIndex() {
      this.selectedMilestone.forms.forEach((form, index) => {
        const formData = form;
        formData.index = index + 1;
      });
    },
    saveMilestone() {
      const scheduleIndex = findIndex(this.milestoneSchedule.schedule, [
        'milestone',
        this.selectedMilestone.milestone,
      ]);
      this.milestoneSchedule.schedule[scheduleIndex] = this.selectedMilestone;
      if (!this.milestoneSchedule.scheduleId) {
        this.$api.postEDCMilestonesFact(this.studyId, this.milestoneSchedule).then(response => {
          this.milestoneSchedule = response.body;
        });
      } else {
        this.$api.updateEDCMilestonesFact(this.studyId, this.milestoneSchedule).then(response => {
          this.milestoneSchedule = response.body;
        });
      }
      const index = findIndex(this.currentMilestoneList, [
        'milestone',
        this.selectedMilestone.milestone,
      ]);
      this.selectedMilestone.disableSave = true;
      this.selectedMilestone.showStatus = false;
      this.$set(this.currentMilestoneList, index, this.selectedMilestone);
      this.editMode = false;
    },
    cancelMilestone() {
      const index = findIndex(this.currentMilestoneList, [
        'milestone',
        this.selectedMilestone.milestone,
      ]);
      this.selectedMilestone.showStatus = false;
      this.currentMilestoneList[index].showStatus = false;
      this.selectedMilestone = cloneDeep(this.currentMilestoneList[index]);
      this.editMode = false;
    },
    onDragForms() {
      this.selectedMilestone.forms.forEach((item, ind) => {
        const dataItem = item;
        dataItem.index = ind + 1;
      });
    },
    setMilestone() {
      const studyMilestones = this.studyData.milestones;
      const tmpMilestones = [];
      studyMilestones.forEach((data, index) => {
        tmpMilestones.push({ milestone: data, index: index + 1, forms: [] });
      });
      this.milestoneSchedule.schedule = tmpMilestones;
    },
    getStudyDetails() {
      this.$api.getStudyDataFact(this.studyId).then(response => {
        this.studyData = response.body;
        this.getEDCFormDetails();
      });
    },
  },
  mounted() {
    this.getStudyDetails();
  },
};
</script>

<style scoped lang="scss">
.dataCaptureForms {
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.21;
  letter-spacing: normal;
  color: #2d3752;
}

.headingColor {
  color: #2d3752;
}

.headingTextColor {
  color: #4a4a4a;
}

.tableBg {
  background-color: #ffffff !important;
  padding: 24px 20px 14px 20px !important;
  border-radius: 4px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.06);
}

.no-forms {
  font-size: 15px;
  color: #9b9b9b;
}

.disabled-milestone {
  color: #9b9b9b;
}

.form-title {
  font-size: 12px;
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.33;
  letter-spacing: normal;
  color: #9b9b9b;
}

.form-name {
  font-size: 14px;
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.33;
  letter-spacing: normal;
  color: #1e8fe1;
}

.form-text {
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.33;
  letter-spacing: normal;
  color: #4a4a4a;
}

.text-align {
  line-height: 23px !important;
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
  border-radius: 3px;
  background-color: #ffffff;
  border: solid 1px #e4e8eb;
  text-align: center;
  font-size: 13px;
  line-height: 23px !important;
  color: #4a4a4a;
  padding-left: 11px !important;
}

.pagination2 {
  width: 30px;
  height: 25px;
  background-color: #ffffff;
  font-size: 13px;
  line-height: 23px !important;
  color: #4a4a4a;
  padding-left: 4px !important;
}

.form-card {
  border-radius: 4px;
  background-color: #ffffff;
  border: solid 1px #e4e8eb;
  padding: 5px 10px 5px 10px;
  margin: 10px;
}

.left-icon {
  color: #d4d9e2;
}

.disabledPagination {
  pointer-events: none;
}

.color_1e8fe1 {
  color: #1e8fe1 !important;
}

.modal.right .modal-dialog {
  position: fixed;
  margin: auto;
  width: 500px;
  height: 100%;
  -webkit-transform: translate3d(0%, 0, 0);
  -ms-transform: translate3d(0%, 0, 0);
  -o-transform: translate3d(0%, 0, 0);
  transform: translate3d(0%, 0, 0);
}

.modal.right .modal-content {
  height: 100%;
  overflow-y: auto;
}

.modal.right .modal-body {
  padding: 15px 15px 80px;
}

/*Right*/

.modal.right.fade .modal-dialog {
  right: 0px;
  -webkit-transition: opacity 0.3s linear, right 0.3s ease-out;
  -moz-transition: opacity 0.3s linear, right 0.3s ease-out;
  -o-transition: opacity 0.3s linear, right 0.3s ease-out;
  transition: opacity 0.3s linear, right 0.3s ease-out;
}

.modal.right.fade.in .modal-dialog {
  right: 0;
}

.btn-width {
  width: 70px !important;
}

.formsBg {
  border-radius: 4px;
  background-color: #ffffff;
  border: solid 1px #e4e8eb;
  padding: 12px 10px 10px 15px !important;
}

.color_e4e8eb {
  color: #e4e8eb;
}

.color_1e8fe1 {
  color: #1e8fe1;
}

.vue-switcher-theme--bootstrap.vue-switcher-color--primary div:after {
  background-color: #1e8fe1 !important;
}

.btnClass {
  width: 100px;
  height: 36px;
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

/deep/.custom-checkbox .custom-control-label::before {
  border-radius: 0.25rem;
  background-color: #ffffff;
  border: 1.1px solid #9b9b9b;
}
  
.primaryBgColor {
  background-color: #1e8fe1;
}
</style>
