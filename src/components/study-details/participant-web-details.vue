<template>
  <div class="details">
    <!-- Modal -->
    <div
      class="modal fade"
      id="view_study_data_model"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content study_content_card">
          <button type="button" class="close" data-dismiss="modal">
            <div class="study_sites">Study sites</div>
            <span aria-hidden="true" class="study_close_option">&times;</span>
          </button>
          <div class="modal-body study_modal_body">
            <table class="table table-responsive table_study">
              <thead>
                <tr>
                  <th>Facility Name</th>
                  <th>Site type</th>
                  <th>Allow all</th>
                  <th>City</th>
                  <th>State / Province</th>
                  <th>Country</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(registrationData) in registrationSiteFact" :key="registrationData.name">
                  <td class="text-left">{{registrationData.name}}</td>
                  <td>{{registrationData.type}}</td>
                  <td>{{registrationData.isAllowOtherRegionParticipant === false ? 'No' : registrationData.isAllowOtherRegionParticipant === true ? 'Yes' : '' }}</td>
                  <td>{{registrationData.city}}</td>
                  <td>{{registrationData.state}}</td>
                  <td>{{registrationData.country}}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <div class="card br-2">
      <div class="p-10">
        <div>
          <h6 class="fw-bold">PARTICIPANT WEB</h6>
          <div class>
            <a href class="col-1 p-0" @click.prevent="expandAll()">Expand all</a>
            <span class="link_style"></span>
            <a href class="col-1 p-0" @click.prevent="collapseAll()">Collapse all</a>
          </div>
          <div class="pt-8">
            <div>
              <i
                class="fa fa-plus-circle pr-6"
                v-if="!expandStudyName"
                @click.prevent="expandStudyName = true"
              ></i>
              <i
                class="fa fa-minus-circle pr-6"
                v-if="expandStudyName"
                @click.prevent="expandStudyName = false"
              ></i>
              Eligibility screening
            </div>
            <div v-if="expandStudyName">
              <div class="card inner-card br-2">
                <div class="p-10">
                  <div class="module-header">Eligibility questions</div>
                  <b-row class="mt-20">
                    <b-col class="pl-0">
                      <div
                        class="content"
                        v-for="(optionquestion, index) in eligibility.questions"
                        :key="optionquestion.question"
                      >
                        <div class="questions_no">Question {{index+1}}</div>
                        <div class="content" v-html="optionquestion.question"></div>

                        <div
                          v-for="(radioOption) in optionquestion.options"
                          :key="radioOption.id"
                          class="radio_data"
                        >
                          <div style="display : flex">
                            <input type="radio" class="radio_size" :disabled="true" />&nbsp;&nbsp;
                            <div class="optional_values" v-html="radioOption.answer"></div>
                          </div>
                        </div>
                      </div>
                    </b-col>
                  </b-row>
                </div>
              </div>
            </div>
          </div>

          <div class="pt-8">
            <div>
              <i
                class="fa fa-plus-circle pr-6"
                v-if="!expandIcon"
                @click.prevent="expandIcon = true"
              ></i>
              <i
                class="fa fa-minus-circle pr-6"
                v-if="expandIcon"
                @click.prevent="expandIcon = false"
              ></i>
              Agreement
            </div>
            <div v-if="expandIcon">
              <div class="card inner-card br-2">
                <div class="p-10">
                  <div class="module-header">Agreement content</div>
                  <div class="p-0">
                    <b-row class="mt-15">
                      <b-col class="pl-0">
                        <div class="header pl-0">Body copy</div>
                        <div class="content" v-html="agreement.agreementCopyContent"></div>
                      </b-col>
                    </b-row>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="pt-8 pb-10">
            <div>
            <div class="row">
              <div class="col-md-4 registration_content_icon">
                <i
                class="fa fa-plus-circle pr-6"
                v-if="!expandColor"
                @click.prevent="expandColor = true"
              ></i>
              <i
                class="fa fa-minus-circle pr-6"
                v-if="expandColor"
                @click.prevent="expandColor = false"
              ></i>
              Registration
              </div>
               <div v-if="!expandColor">
                   <div class="register_invitation_api" v-if="registrationFormFlag.data ? registrationFormFlag.data.autoInvite == true : false">Invitation API: On</div>
                  <div class="register_invitation_api" v-else-if="registrationFormFlag.data ? registrationFormFlag.data.autoInvite == false : false">Invitation API: Off</div>
             </div>
               <div class="col-md-8 register_invitation_api" v-if="expandColor">
                 <!-- Invitation API : {{registrationFormFlag.autoInvite}} -->
                <!-- <div class="register_invitation_api" v-if="registrationFormFlag.data.autoInvite == true">Invitation API: Enabled</div> -->
                 <!-- <div class="register_invitation_api" v-else-if="registrationFormFlag.data.autoInvite == false">Invitation API: Disabled</div> -->
               <div v-if="registrationFormFlag.data">
                   <div class="register_invitation_api" v-if="registrationFormFlag.data ? registrationFormFlag.data.autoInvite == true : false">Invitation API: Enabled</div>
                  <div class="register_invitation_api" v-else-if="registrationFormFlag.data ? registrationFormFlag.data.autoInvite == false : false">Invitation API: Disabled</div>
             </div>
               </div>
            </div> 
            </div>
            <div v-if="expandColor">
              <div class="card inner-card br-2">
                <div class="p-10">
                  <div class="module-header">Registration participant information</div>
                  <div class="p-0">
                    <b-row class="mt-15">
                      <b-col class="pl-0">
                        <div class="study_registration">Required</div>
                        <span v-for="(registerSiteData, index) in registerpersonalrequired" :key="registerSiteData.field">
                          <span class="study_data">
                            {{registerSiteData.field}}
                          <span v-if="index + 1 < registerpersonalrequired.length">,</span>
                          </span>
                        </span>

                        <div class="study_registration">Optional</div>
                        <span v-for="(registerSiteData, index) in registerpersonaloptional" :key="registerSiteData.field">
                          <span class="study_data">
                            {{registerSiteData.field}}
                          <span v-if="index + 1 < registerpersonaloptional.length">,</span>
                          </span>
                        </span>
  
                      </b-col>
                    </b-row>
                  </div>
                  <div class="module-header mt-15">Registration participant information</div>
                  <div class="p-0">
                    <b-row class="mt-15">
                      <b-col class="pl-0">
                        <div class="study_registration">Required</div>
                         <span v-for="(registerSiteData, index) in registercontactrequired" :key="registerSiteData.field">
                          <span class="study_data">
                            {{registerSiteData.field}}
                          <span v-if="index + 1 < registercontactrequired.length">,</span>
                          </span>
                        </span>

                        <div class="study_registration" style="display : flex">Optional</div>
                         <span v-for="(registerSiteData, index) in registercontactoptional" :key="registerSiteData.field">
                          <span class="study_data">
                            {{registerSiteData.field}}
                          <span v-if="index + 1 < registercontactoptional.length">,</span>
                          </span>
                        </span>
                      </b-col>
                    </b-row>
                  </div>
                  <div class="module-header mt-15">Study sites</div>
                  <div class="p-0">
                    <b-row class="mt-15">
                      <b-col class="pl-0">
                        <div class="study_registration">Sites added</div>
                        <div class="study_site"><span class="study_anchor" @click="viewAddsites()">View study sites</span></div>
                        
                        <div class="study_registration">Invitation API</div>
                        <!-- <div class="study_data">{{registrationFormFlag.autoInvite}}</div> -->
                        <div v-if="registrationFormFlag.data">
                        <div class="study_data_invite" v-if="registrationFormFlag.data ? registrationFormFlag.data.autoInvite == true : false">Enabled</div>
                        <div class="study_data_invite" v-else-if="registrationFormFlag.data ? registrationFormFlag.data.autoInvite == false : false">Disabled</div>
                      </div>
                      </b-col>
                    </b-row>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
    
<script>
export default {
  name: "participant-web-details",
  data() {
    return {
      studyId: "",
      expandStudyName: false,
      expandIcon: false,
      expandColor: false,
      registrationSiteDaata: {},
      registerpersonalrequired : [],
      registerpersonaloptional :[],
      registercontactrequired : [],
      registercontactoptional : []
    };
  },
  components: {},
  props: {
    agreement: {
      type: Object,
      default: () => {},
    },
    eligibility: {
      type: Object,
      default: () => {},
    },
    registrationFormWeb: {
      type: Object,
      default: () => {},
    },
    registrationformWebfields: {
      type: Object,
      default: () => {},
    },
    registrationSite: {
      type: Object,
      default: () => {},
    },
    registrationSiteFact: {
      type: Array,
      default: () =>[],
    },
    registrationFormFlag: {
      type: Object,
      default: () => {},
    },
  },

  mounted(){
    this.studyId = this.$route.params.studyId;
     this.$api
        .getRegistrationFact(this.studyId)
        .then((response) => {
          if (response) {
            this.registrationSiteDaata = response.body.participantRegistrationConfigDetails;
            // personal - required
            if(this.registrationSiteDaata) {
              this.registrationSiteDaata.forEach(data =>{
              if(data.type === 'personalInfo'&& data.isOptional === 'required'){
                this.registerpersonalrequired.push(data);
              }
            })
            // personal- optioanal
             this.registrationSiteDaata.forEach(data =>{
              if(data.type === 'personalInfo'&& data.isOptional === 'optional'){
                this.registerpersonaloptional.push(data);
              }
            })
            // contact - required
              this.registrationSiteDaata.forEach(data =>{
              if(data.type === 'contactInfo' && data.isOptional === 'required'){
                this.registercontactrequired.push(data);
              }
            })
            // contact - optional
              this.registrationSiteDaata.forEach(data =>{
              if(data.type === 'contactInfo' && data.isOptional === 'optional'){
                this.registercontactoptional.push(data);
              }
            })
            }
          }
        })
        .catch((err) => {
          throw err;
        });
  },

  methods: {
    viewAddsites() {
      $("#view_study_data_model").modal("show");
    },
    expandAll() {
      this.expandStudyName = true;
      this.expandIcon = true;
      this.expandColor = true;
    },
    collapseAll() {
      this.expandStudyName = false;
      this.expandIcon = false;
      this.expandColor = false;
    },
  },
};
</script>
    
<style scoped>

.modal-dialog {
    max-width: 1001px;
    margin: 1.75rem auto;
}
.study_content_card {
  width: 1001px;
  height: 418px;
  border-radius: 3px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  border: solid 1px #ffffff;
  background-color: #ffffff;
}

.table_study {
  border: 2px solid #d3dee3 !important;
  border-radius: 3px !important;
}

 .table_study tbody {
    display:block !important;
    height:330px !important;
}
 .table_study thead, tbody tr {
    display:table !important;
    width:965px !important;
    table-layout:fixed !important;
}

.table_study th {
  border-bottom: none !important;
  padding: 0.25rem !important;
  height: 10px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  border: solid 2px #fff;
  background-color: #d3dee3;
  font-size: 12px;
  color: black;
  font-weight: bold;
  text-align: center;
  border-top: none;
}
.table_study tr td {
  font-size: 12px;
  text-align: center;
  border: none;
  color: #000;
}
.table_study th:first-child{
  border-left: none;
}
.table_study th:last-child{
  border-right: none;
}
.table_study th:first-child,
.table_study td:first-child {
    width: 230px;
    max-width: 300px;
}

.table_study th:nth-child(2),
.table_study th:nth-child(3),
.table_study td:nth-child(2),
.table_study td:nth-child(3) {
    width: 100px;
    max-width: 110px;
}

.study_close_option {
  float: right;
  position: relative;
  right: 18px;
  top: 6px;
}
.study_sites {
  /* position: fixed; */
  padding: 12px !important;
  float: left !important;
  margin-left: 8px !important;
  font-size: 13px;
  margin-top: 0 !important;
}
.close {
  opacity: 1 !important;
  color: #00000038 !important;
}

.study_modal_body {
  padding-top: 4px !important;
}

.optional_values {
  position: relative;
  top: 2px;
  font-weight: normal !important;
  color: grey;
}
.radio_size {
  width: 16.7px !important;
  height: 16.7px !important;
  margin: 2px !important;
}

.questions_no {
  font-weight: normal !important;
  color: grey;
}

.radio_data {
  position: relative;
  bottom: 8px;
}

.register_heading {
  font-size: 12px;
  font-weight: bold;
}

.study_anchor {
  font-size: 12px;
  font-weight: bold;
  color: #007bff !important;
  cursor: pointer;
}

.study_data {
  /* text-transform: capitalize; */
  font-size: 12px;
  font-weight: bold;
  display: inline-block;
  margin-bottom: 12px;
  margin-right: 3px;
}

.study_data_invite {
  font-size: 12px;
  font-weight: bold;
  display: inline-block;
  margin-bottom: 12px;
  margin-right: 3px;
}


.study_registration {
  font-size: 12px;
  color: grey;
  clear: both;
  line-height: 1.14;
}
.study_data::after {
    /* content: ','; */
    margin-left: 3px;
}
.study_data_invite::after{
  content: '';
}
.Registration_participant_align:nth-last-child(1) .study_data::after {
    content: '';
}
.registration_content_icon{
  position: relative;
  left: -15px;
}

.register_invitation_api{
  font-size: 12px;
  font-weight: bold;
}

.link_style {
  border-right: 1px solid #959fa4;
  margin: 0px 5px 0px 2px !important;
}
.inner-card {
  border: none;
  margin: 5px 20px;
  border-radius: 3px !important;
  /* background-color: #d3dfe4; */
  background-color: #f6f9fa;
}
.module-header {
  /* width: 250px; */
  height: 16px;
  font-size: 14px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.14;
  letter-spacing: normal;
  color: #666669;
}
.header {
  font-size: 12px;
  color: #666669;
}
.content {
  font-size: 12px;
  font-weight: bold;
  color: #666669;
}
.content-img {
  width: auto;
  height: 100%;
  max-height: 80px;
}
.color-card {
  width: 25px;
  height: 25px;
  border-radius: 3px;
}
.content-color {
  line-height: 25px;
}
.study_site {
    margin-bottom: 12px;
}
.Registration_participant_align{
  float: left;
}
table {
  scrollbar-width: thin;
  scrollbar-color: #c4c4c4 transparent;
}
table::-webkit-scrollbar{
    width: 5px;
  border: 3px solid transparent;
}
*::-webkit-scrollbar-track {
  background: transparent;
}
table::-webkit-scrollbar-thumb{
  background-color: #c4c4c4;
  border-radius: 20px;
  border: 2px solid transparent;
}
table::-webkit-scrollbar-thumb:window-inactive{
  background-color: #c4c4c4;
  border-radius: 20px;
  border: 2px solid transparent;
}
</style>
    