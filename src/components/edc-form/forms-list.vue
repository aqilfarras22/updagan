<template>
  <div>
    <div class="formBackground">
      <b-row>
        <h2>
          <b>Data Capture Forms</b>
        </h2>
      </b-row>
      <b-row class="pb-20">
        <h6>
          <b>Create, manage, and schedule data capture forms for this study.</b>
        </h6>
      </b-row>
      <b-row>
        <b-col cols="11" class="pl-0 pr-0">
          <b-row class="pb-20">
            <b-col cols="3" class="p-0">
              <input type="text" class="form-control mb-10 br-25 search-field" placeholder='Search' v-model="searchTerm" @keyup.enter="searchFormName(searchTerm)">
            </b-col>
            <b-col cols="3">
            </b-col>
            <b-col cols="6" class="text-right p-0">
              <b-btn variant="primary" class="fs-12 mr-5 primaryBgColor" size="sm" @click="configureNewForm()">
                Configure a new form
              </b-btn>
              <b-btn variant="primary" class="fs-12 primaryBgColor" size="sm" :to="{ name: 'schedule-form', params: { studyId: studyId } }">
                Schedule forms
              </b-btn>
            </b-col>
          </b-row>
          <div class="tableBg mb-25">
            <b-row>
              <b-col cols="10" class="p-0">
                <h6>
                  <b>
                    <span class="noOfForms">{{forms.length}}</span> Forms</b>
                </h6>
              </b-col>
              <b-col cols="2" class="p-0 text-right">
                <b-form-select v-model="selectedShowOption" :options="scheduleFormOptions" class="mb-3 fs-12" size="sm" @change="showForms" />
              </b-col>
            </b-row>
            <b-row class="mb-10">
              <b-col cols="5" class="form-title p-0">
                Form name
              </b-col>
              <b-col cols="6" class="form-title p-0">
                Study Days
              </b-col>
              <b-col cols="1" class="form-title p-0">
              </b-col>
            </b-row>
            <b-row v-for="(form, index) in currentFormList" :key="index" class="mb-10">
              <b-col cols="5" class="form-name p-0">
                <router-link :to="{ name: 'form-view', params: {'formId': form.formId}}">{{form.formName}}</router-link>
              </b-col>
              <b-col cols="6" class="form-text p-0" v-if="form.milestones && form.milestones.length > 0">
                <span v-for="(milestone,index) in form.milestones" :key="index">
                  {{milestone}}
                  <span v-if="index + 1 < form.milestones.length">, </span>
                </span>
              </b-col>
              <b-col cols="6" class="form-name p-0" v-if="form.milestones && form.milestones.length <= 0">
                <router-link class="" :to="{ name: 'schedule-form', params: { studyId: studyId } }">
                  Schedule form
                </router-link>
              </b-col>
              <b-col cols="1" class="p-0 text-right">
              <div class="duplicate-icon" @click="configureNewForm(form.formId)">
                <img src="static/img/duplicate.svg" />
              </div>
              </b-col>
            </b-row>
            <b-row class="pt-20">
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
          <div class="tableBg mb-25">
            <b-row>
              <b-col cols="10" class="p-0">
                <h6>
                  <b>
                    <span class="noOfForms">{{unscheduledPackets.length}}</span> Unscheduled visit packets</b>
                </h6>
              </b-col>
              <b-col cols="2" class="p-0 text-right">
                <b-form-select v-model="packetShowOption" :options="unScheduleFormOptions" class="mb-3 fs-12" size="sm" @change="showPackets" />
              </b-col>
            </b-row>
            <b-row class="pb-10">
              <b-col cols="5" class="form-title p-0">
                Packet name
              </b-col>
              <b-col cols="6" class="form-title p-0">
                # of forms
              </b-col>
              <b-col cols="1" class="form-title p-0">
              </b-col>
            </b-row>
            <b-row v-for="(packet, index) in currentPacketList" :key="index" class="pb-10">
              <b-col cols="5" class="form-name p-0">
                <router-link :to="{ name: 'unschedule-forms', params: {'studyId': studyId, 'packetId': packet.id, 'packet': packet }}">{{packet.name}}</router-link>
              </b-col>
              <b-col cols="6" class="form-text p-0" v-if="packet.unscheduledForms && packet.unscheduledForms.length > 0">
                {{packet.unscheduledForms.length}}
              </b-col>
              <b-col cols="1" class="p-0 text-right">
              </b-col>
            </b-row>
            <b-row class="pt-20">
              <div @click="prevPacketPage" class="arrow-icon cursor_pointer" :class="{ 'disabledPagination': currentPacketPage <= 1}">
                <i class="fa fa-angle-left fs-23"></i>
              </div>
              <div class="pagination">
                {{currentPacketPage}}
              </div>
              <div class="pagination2">
                of {{totalPacketPages}}
              </div>
              <div @click="nextPacketPage" class="arrow-icon cursor_pointer" :class="{ 'disabledPagination': currentPacketPage >= totalPacketPages}">
                <i class="fa fa-angle-right fs-23"></i>
              </div>
            </b-row>
          </div>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
import slice from 'lodash/slice';
import ceil from 'lodash/ceil';
import filter from 'lodash/filter';
import orderBy from 'lodash/orderBy';

export default {
  name: 'forms-list',
  components: {},
  data() {
    return {
      forms: [],
      selectedForms: [],
      studyId: this.$route.params.studyId,
      selectedShowOption: 10,
      currentPage: 1,
      totalPages: 1,
      searchTerm: '',
      currentFormList: [],
      allForms: [],
      unscheduledPackets: [],
      allUnscheduledPackets: [],
      selectedPackets: [],
      currentPacketPage: 1,
      totalPacketPages: 1,
      packetShowOption: 10,
      currentPacketList: [],
      scheduleFormOptions: [],
      unScheduleFormOptions: [],
    };
  },
  computed: {},
  methods: {
    getEDCFormDetails() {
      this.$api.getEDCFormsFact(this.studyId).then(response => {
        this.allForms = response.body;
        this.allForms = orderBy(this.allForms, ['formName'], ['asc']);
        this.forms = this.allForms;
        this.forms.forEach((form, index) => {
          const data = form;
          data.index = index + 1;
        });
        this.showForms(this.selectedShowOption);
      });
    },
    getUnscheduledPackets() {
      this.$api.getUnscheduledPacketsFact(this.studyId).then(response => {
        this.allUnscheduledPackets = response.body;
        this.unscheduledPackets = this.allUnscheduledPackets;
        this.showPackets(this.packetShowOption);
      });
    },
    showForms(selectedShowOption) {
      this.totalPages = ceil(this.forms.length / selectedShowOption) === 0
        ? 1
        : ceil(this.forms.length / selectedShowOption);
      this.selectedForms = [];
      let start = 0;
      let end = selectedShowOption;
      for (let index = 0; index < this.totalPages; index++) {
        this.selectedForms.push(slice(this.forms, start, end));
        start += selectedShowOption;
        end += selectedShowOption;
      }
      if (!this.scheduleFormOptions || !this.scheduleFormOptions.length) {
        for (let index = 1; index <= this.totalPages; index++) {
          this.scheduleFormOptions.push({
            value: index * 10,
            text: `Show ${index * 10} items`,
          });
        }
      }
      this.currentPage = 1;
      this.currentFormList = this.selectedForms[this.currentPage - 1];
    },
    prevPage() {
      if (this.currentPage <= this.totalPages) {
        this.currentPage -= 1;
        this.currentFormList = this.selectedForms[this.currentPage - 1];
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentFormList = this.selectedForms[this.currentPage];
        this.currentPage += 1;
      }
    },
    configureNewForm(duplicateFormId = null) {
      let route = {
        name: 'configure-new-form',
        params: {
          studyId: this.studyId,
          formId: '0',
        },
      };
      if(duplicateFormId){
        route.query = { duplicateFormId: duplicateFormId };
      }
      this.$router.push(route);
    },
    searchFormName(searchTerm) {
      if (searchTerm) {
        let search = searchTerm;
        search = search.trim();
        this.forms = this.allForms;
        this.forms = filter(this.forms, form => form
          .formName.toLowerCase().includes(search.toLowerCase()));
        this.showForms(this.selectedShowOption);
        this.unscheduledPackets = this.allUnscheduledPackets;
        this.unscheduledPackets = filter(this.unscheduledPackets, packet => packet
          .name.toLowerCase().includes(search.toLowerCase()));
        this.showForms(this.selectedShowOption);
        this.showPackets(this.packetShowOption);
      } else {
        this.forms = this.allForms;
        this.unscheduledPackets = this.allUnscheduledPackets;
        this.showForms(this.selectedShowOption);
        this.showPackets(this.packetShowOption);
      }
    },
    showPackets(packetShowOption) {
      this.totalPacketPages = ceil(this.unscheduledPackets.length / packetShowOption) === 0
        ? 1
        : ceil(this.unscheduledPackets.length / packetShowOption);
      this.selectedPackets = [];
      let start = 0;
      let end = packetShowOption;
      for (let index = 0; index < this.totalPacketPages; index++) {
        this.selectedPackets.push(slice(this.unscheduledPackets, start, end));
        start += packetShowOption;
        end += packetShowOption;
      }
      if (!this.unScheduleFormOptions || !this.unScheduleFormOptions.length) {
        for (let index = 1; index <= this.totalPages; index++) {
          this.unScheduleFormOptions.push({
            value: index * 10,
            text: `Show ${index * 10} items`,
          });
        }
      }
      this.currentPacketPage = 1;
      this.currentPacketList = this.selectedPackets[this.currentPacketPage - 1];
    },
    prevPacketPage() {
      if (this.currentPacketPage <= this.totalPacketPages) {
        this.currentPacketPage -= 1;
        this.currentPacketList = this.selectedPackets[this.currentPacketPage - 1];
      }
    },
    nextPacketPage() {
      if (this.currentPacketPage < this.totalPacketPages) {
        this.currentPacketList = this.selectedPackets[this.currentPacketPage];
        this.currentPacketPage += 1;
      }
    },
  },
  mounted() {
    this.getEDCFormDetails();
    this.getUnscheduledPackets();
  },
};
</script>

<style scoped lang="scss">
.tableBg {
  background-color: #ffffff !important;
  padding: 24px 20px 14px 20px !important;
  border-radius: 4px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.06);
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
  width: 40px;
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

.search-field {
  padding-right: 30px;
  background-image: url('/static/img/icon-search.gif');
  background-repeat: no-repeat;
  background-position: 97% 50%;
}

.noOfForms {
  color: #f16559;
}
  
.primaryBgColor {
  background-color: #1e8fe1;
}

.duplicate-icon img{
  vertical-align: top;
}

.duplicate-icon img:hover{
  cursor: pointer;
}
</style>
