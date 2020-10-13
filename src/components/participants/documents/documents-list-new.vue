<template>
  <div class="documents-list">
    <div class="divTable unstyledTable">
      <div class="divTableHeading">
        <div class="divTableRow">
          <div class="divTableCell width-999 pl-10 font-bold docTblHeading">Agreement Documents</div>
          <!-- Fake table cell -->
          <div class="divTableCell"></div>
          <div class="divTableCell"></div>
          <div class="divTableCell"></div>
          <div class="divTableCell"></div>
          <div class="divTableCell"></div>
          <div class="divTableCell"></div>
        </div>
        <div class="divTableRow">
          <div class="divTableHead" :class="field.class" v-for="(field, index) in documentListFields" :key ="index">
            <b class="mr-5">{{field.label}}</b>
            <span class="sortDown mr-2" v-if="field.label !== 'Action'" @click="sortField(field, 'asc')" :class="{'disable-icon': !field.ascOrder}"><i class="fa fa-long-arrow-down" aria-hidden="true"></i></span>
            <span class="sortUp" v-if="field.label !== 'Action'" @click="sortField(field, 'desc')" :class="{'disable-icon': !field.descOrder}"><i class="fa fa-long-arrow-up" aria-hidden="true"></i></span>
          </div>
        </div>
      </div>
      <div class="divTableBody" v-for="(document,index) in documents" :key ="index">
        <div class="divTableRow">
            <div class="divTableCell pl-20 action text-info" :title="document.docName" @click="documentSelected(document)" v-if="document.docName.length >= 19">{{document.docName.split('.')[0].slice(0, 17)}}...</div>
            <div class="divTableCell pl-20 action text-info" :title="document.docName" @click="documentSelected(document)" v-else>{{document.docName.split('.')[0]}}</div>
            <div class="divTableCell pl-10 action text-info">
              <span class="statusActive" v-if="document.platformDocId !=null && (document.state == 'Active')">{{document.state}}</span>
              <span class="statusInactive" v-if="document.state == 'Inactive'">{{document.state}}</span>
            </div>
            <div class="divTableCell pl-10 action language_color">{{document.docLanguageName}}</div>
            <div class="divTableCell pl-10">
              <div v-if="(document.status == 'SignatureNotRequested' || document.status == 'RequestedSignature')  && (document.state != 'Inactive')" @click="showReqSignModal(document)" class="signature">
                <a v-if="document.status == 'SignatureNotRequested'">Request Signature</a>
                <a v-else-if="document.status == 'RequestedSignature'">Resend Document</a>
              </div>
              <div v-if="document.isParticipantSigned" class="pt-8 pb-8">
                <span class="color-text fs-12">{{new Date(document.participantSignedTime) | formatUTCDate}}</span>
                <!--<span class="clock"></span>-->
              </div>
            </div>
            <div class="divTableCell">
              <div v-if="document.isPISignRequired">
                <span class="color-text fs-12" v-if="!document.isPISigned">Not Signed</span>
                <span class="color-text fs-12" v-if="document.isPISigned">
                  <span class="color-text fs-12">{{ new Date(document.piSignedTime) | formatUTCDate}}</span>
                  <!--<span class="clock"></span>-->
                </span>
              </div>
              <div class="sign-in-wrap" v-if="!document.isPISignRequired">
                <span class="color-text fs-12">N/A</span>
              </div>
            </div>
            <div class="divTableCell pl-10 action"><span class="color-text fs-12" v-if="document.uploadedTime">{{new Date(document.uploadedTime) | formatUTCDate}}</span></div>
            <div class="divTableCell pl-10 action text-info"><button class="btn btn-light addDoc" v-if="document.platformDocId != null && document.state =='Active' || document.platformDocId != null && document.state =='Inactive'" @click="openUploadDocModal(document)">Upload Document</button></div>
        </div>

        <div v-for="(cdocument,index) in document.childDocs" :key ="index" class="divTableRow">
            <div class="divTableCell pl-10 width-870 action text-info" @click="documentSelected(cdocument)" v-if="cdocument.docName.length >= 17">
              <span class="pl-20">
                <img src="static/img/vector-arrow/child-arrow@2x.png" class="vector"> 
                <span class="pl-8" :title="cdocument.docName">{{cdocument.docName.split('.pdf')[0].slice(0, 15)}}...</span>
              </span>
            </div>
            <div class="divTableCell width-870 pl-10 action text-info" @click="documentSelected(cdocument)" v-if="cdocument.docName.length < 17">
               <span class="pl-20">
                <img src="static/img/vector-arrow/child-arrow@2x.png" class="vector"> 
                <span class="pl-8" :title="cdocument.docName">{{cdocument.docName.split('.pdf')[0]}}</span>
               </span>
            </div>
            <div class="divTableCell pl-10 action text-info"></div>
            <div class="divTableCell pl-10 action language_color">{{cdocument.docLanguageName}}</div>
            <div class="divTableCell pl-10 action"><span class="fs-12 color-text" v-if="cdocument.participantSignDate">{{new Date(cdocument.participantSignDate) | dateUTC}}</span></div>
            <div class="divTableCell pl-0 action"><span class="fs-12 color-text" v-if="cdocument.siteMemberSignDate">{{new Date(cdocument.siteMemberSignDate) | dateUTC}}</span></div>
            <div class="divTableCell pl-10 action"><span class="fs-12 color-text" v-if="cdocument.uploadedTime">{{ new Date(cdocument.uploadedTime) | dateFUTC}} UTC</span></div>
            <div class="divTableCell pl-10 action"></div>
        </div>
      </div>
    </div>
    <div class="no-task slide-animation" v-if="enableNoData">No documents available to view</div>
    <!-- Modal Component -->
    <b-modal ref="reqSignModalRef" id="requestSignModal" hide-footer hide-header>
      <p class="fs-16 p-10">Are you sure you want to request signature for
        <b>{{selectedDoc.docName}}</b>?</p>
      <b-col cols="10" offset="1" class="pt-10">
        <b-btn class="br-30" variant="primary" block @click="requestSignature()">Yes, send request</b-btn>
      </b-col>
      <b-col cols="10" offset="1" class="pb-20">
        <b-btn class="mt-20 br-30" size="md" variant="secondary" block @click="hideModal">No, do not send request</b-btn>
      </b-col>
    </b-modal>

    <div id="upload-document-modal" class="modal fade" role="dialog" data-backdrop="static">
      <div class="modal-dialog pl-50">
        <!-- Modal content-->
        <div class="modal-content pl-34">
          <div>
            <div class="modal-header border-none">
              <div class="doc-modal-title">Upload Document</div>
              <button type="button" class="close" @click="closeModal">&times;</button>
            </div>
            <div class="modal-body pl-0 pr-30">
              <form>
                <div class="file-upload-document">
                  <label class="alignlable">
                    <span v-if="fileName" id="fileName" class="spanFile1">
                      <span :title="fileName" class="spanFile1" v-if="fileName.length >= 32">{{fileName.slice(0, 30)}}...</span>
                      <span :title="fileName" v-else>{{fileName}}</span>
                    </span>
                    <span v-else class="spanFile">Select Document</span>
                    <span v-if="fileName.length == 0" class="btnBrowse0">Browse</span>
                    <span v-else :class="fileName.length >= 34 ? 'btnBrowse' : 'btnBrowse2'">Browse</span>
                    <input
                      type="file"
                      class="file-input form-control"
                      size="60"
                      id="consent_section_doc"
                      v-on:change="onDocFileSelection($event)"
                      accept="application/pdf"
                    />
                  </label>
                </div>
                <div class="form-group">
                  <label class="labelTitle">Document Language</label>
                  <select
                    v-model="selectedLanguage"
                    class="language-select-box form-control"
                  >
                    <option value="null" disabled selected>Choose Language</option>
                    <option
                      :value="lang.language_id"
                      v-for="lang in studyLanguages"
                      :key="lang.language_id"
                    >{{lang.display_name}}</option>
                  </select>
                </div>
                <div class="form-group">
                  <label class="labelTitle">Participant Sign Date</label>
                  <datepicker class="text-left" input-class="datepicker-class uploadDocInputField form-control" placeholder="Enter Participant Sign Date"
                        v-model="participantSignDate" format="MM/dd/yyyy" name="participantSignDate"></datepicker>
                      <span class="cal-icon-style">
                        <i class="fa fa-calendar-o" aria-hidden="true"></i>
                      </span>
                </div>
                <div class="form-group">
                  <label class="labelTitle">Site Team Sign Date</label>
                  <datepicker class="text-left" input-class="datepicker-class uploadDocInputField form-control" placeholder="Enter Site Team Sign Date"
                        v-model="siteMemberSignDate" format="MM/dd/yyyy" name="siteMemberSignDate"></datepicker>
                      <span class="site-cal-icon-style">
                        <i class="fa fa-calendar-o" aria-hidden="true"></i>
                      </span>
                </div>
                <div class="form-group">
                   <label class="labelTitle">Signed By</label>
                  <select
                      v-model="signedBy"
                      class="language-select-box form-control"
                    >
                  <option value="">Select Team Member</option>
                  <option
                    v-for="team in siteTeamList"
                    :value="team.id"
                    :key="team.id"
                  >{{team.firstName}} {{team.lastName}}, 
                    <span v-if="team.userRole == 'Pi'">PI</span>
                    <span v-if="team.userRole == 'SubPi'">Sub-I</span>
                    <span v-if="team.userRole == 'StudyCoordinator'">SC</span>
                    <span v-if="team.userRole == 'HomeHealth'">HH</span>
                  </option>
                </select>
                </div>
              <div class="align-right">
               <button type="button" @click="uploadDocument()" :disabled="isDisabled" class="btn btn-primary btnUpload float-right">Upload</button>
              </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import nprogress from "nprogress";
import "nprogress/nprogress.css";
import TableComponent from "@/components/common/table";
import _ from "lodash";
import Datepicker from "vuejs-datepicker";
import localStorageService from "@/services/localStorage";
import moment from 'moment';
import momentTimeZone from 'moment-timezone';
import { mapGetters, mapActions } from 'vuex';
import { STUDY_ADMIN,STUDY_MANAGER, SITEDATALOCK  } from "@/constants/authRoles";
import { AclRule } from "vue-acl";
import toastr from 'toastr';

export default {
  name: "DocumentsList",
  components: { TableComponent },
  data() {
    return {
      studyId: this.$route.params.studyId,
      participantId: this.$route.params.participantId,
      documents: [],
      totalDocuments: 0,
      participantSignDate: "",
      siteMemberSignDate: "",
      signedBy: "",
      siteId: null,
      siteDetails:[],
      siteTeamList: [],
      DatePickerFormat: 'dd/MM/yyyy',
      isDisabled:false,
      documentListFields: [
        {
          key: "docName",
          type: "string",
          label: "Document Name",
          ascOrder: false,
          descOrder: false,
          class: "width-520 pl-10",
          currentOrder: null
        },
        {
          key: "state",
          type: "string",
          label: "Status",
          ascOrder: false,
          descOrder: false,
          class: "width-395 pl-10",
          currentOrder: null
        },
        {
          key: "docLanguageName",
          type: "string",
          label: "Language",
          ascOrder: false,
          descOrder: false,
          class: "width-395 pl-10",
          currentOrder: null
        },
        {
          key: "participantSignedTime",
          type: "integer",
          label: "Participant Signed",
          ascOrder: false,
          descOrder: false,
          class: "width-990 pl-10",
          currentOrder: null
        },
        {
          key: "piSignedTime",
          type: "integer",
          label: "Site Signed",
          ascOrder: false,
          descOrder: false,
          class: "width-1000",
          currentOrder: null
        },
        {
          key: "uploadedTime",
          type: "integer",
          label: "Uploaded",
          ascOrder: false,
          descOrder: false,
          class: "width-1000 pl-10",
          currentOrder: null
        },
        { label: "Action", class: "width-326 pl-10", currentOrder: null }
      ],
      selectedDoc: {},
      selectedLanguage: null,
      studyLanguages: [],
      file: "",
      fileName: "",
      fileEvent:"",
      enableNoData: false
    };
  },
  components: { datepicker: Datepicker },
  computed: {
    ...mapGetters(["user"]),
    userAccess() {
      return new AclRule(this.user.userRole).generate();
    },
    canStudyManagerAccess() {
      this.$acl.change(`${STUDY_MANAGER}`);
      return this.$acl.check('userAccess');
    },
    canStudyAdminAccess() {
      this.$acl.change(`${STUDY_ADMIN}`);
      return this.$acl.check("userAccess");
    },
    canSiteDataLockAccess() {
      this.$acl.change(`${SITEDATALOCK}`);
      return this.$acl.check("userAccess");
     },
  },
  methods: {
    showReqSignModal(doc) {
      if (this.canStudyAdminAccess || this.canStudyManagerAccess || this.user.userRole === 'Cra' || this.user.userRole === 'SiteDataLock') {
        toastr.warning('Access restricted');
      } else {
        this.selectedDoc = doc;
        this.$refs.reqSignModalRef.show();
      }      
    },
    openUploadDocModal(document) {
      if (this.canStudyAdminAccess || this.canStudyManagerAccess || this.canSiteDataLockAccess) { 
        toastr.warning('Access restricted');
      } else {
        this.selectedLanguage = "";
        this.file = "";
        this.fileName = "";
        this.fileEvent = "";
        this.participantSignDate= "";
        this.siteMemberSignDate= "";
        this.signedBy = "";
        this.getPaticipantDetail();
        this.getSiteTeamFact();
        this.document = document;
        this.getSiteInfo(document.studyId, this.siteId);
        window.$("#upload-document-modal").modal("show");
      }           
    },
    getSiteId() {
      const user = localStorageService.getItem("userObj");
      if (user) {
        this.siteId = user.siteIds[0];
      }
    },
    getDocuments() {
      const docObj = {
        studyId: this.studyId,
        participantId: this.participantId
      };
      nprogress.start();
      this.$api.documentsListFact(docObj).then(
        response => {
          var list = [];
          list = response.body;
          var result = list.filter(item => item.parentDocId == null);
          result.forEach(function(item, index) {
            var a = list.filter(x => x.parentDocId == item.docId);
            item.childDocs = a;
          });
          var filteredList =  result.filter(
            item => item.state != "Uploaded"
          );
          this.documents = filteredList;
          this.documents = this.sortTimeStamp("desc", {
            key: "participantSignedTime"
          });
          this.totalDocuments = this.documents.length;
          this.enableNoData = this.documents.length == 0;
          nprogress.done();
        },
        error => {
          nprogress.done();
          this.$toastr.error(
            error.body && error.body.message
              ? error.body.message
              : "Error while getting documents."
          );
        }
      );
    },
    documentSelected(document) {
      if (this.canStudyAdminAccess || this.canStudyManagerAccess) {
        toastr.warning('Access restricted');
      } else {
          this.$router.push({
          name: "participant-document",
          params: {
            studyId: this.studyId,
            participantId: this.participantId,
            documentId: document.docId
          }
        });
      }
    },
    requestSignature() {
      let currentDate = new Date();
      const docData = {
        studyId: this.studyId,
        participantId: this.participantId,
        docId: this.selectedDoc.docId,
        reqSignDate:moment.utc(currentDate).format()
      };
      this.$api.requestSignatureFact(docData).then(
        () => {
          this.getDocuments();
          this.$toastr.success("Request for signature sent");
        },
        error => {
          this.$toastr.error(
            error.body && error.body.message
              ? error.body.message
              : "Error while getting documents."
          );
        }
      );
      this.hideModal();
    },
    hideModal() {
      this.$refs.reqSignModalRef.hide();
    },
    closeModal() {
      window.$("#upload-document-modal").modal("hide");
    },
    sortField(field, direction) {
      if (direction == "asc") {
        field.ascOrder = true;
        field.descOrder = false;
      } else if (direction == "desc") {
        field.ascOrder = false;
        field.descOrder = true;
      }
      if (field.type == "string") {
        if (field.currentOrder != direction) {
          field.currentOrder = direction;
          this.documents = this.sortString(direction, field);
        }
      } else if (field.type == "integer" && field.currentOrder != direction) {
        field.currentOrder = direction;
        this.documents = this.sortTimeStamp(direction, field);
      }
    },
    sortString(direction, field) {
      let records = _.cloneDeep(this.documents);
      records = _.orderBy(
        records,
        [records => records.docName.toLowerCase()],
        direction
      );
      return records;
    },
    sortTimeStamp(direction, field) {
      let records = _.cloneDeep(this.documents);
      records = _.orderBy(records, field.key, direction);
      return records;
    },
    getSiteInfo(studyId, siteId) {
      let self = this;
      this.$api.getSiteDetailsFact(studyId, siteId).then(response => {
        this.siteDetails = response.body;
      });
    },
    getStudyLanguages() {
      this.$api.getStudyLanguages(this.studyId).then(
        response => {
          this.studyLanguages = response.body;
          if (this.studyLanguages.length > 1) {
            this.selectedLanguage = null;
          } else if (
            this.studyLanguages != null &&
            this.studyLanguages.length == 1
          ) {
            this.selectedLanguage = this.studyLanguages[0].language_id;
          }
        },
        error => {
          this.$toastr.error(
            error.body && error.body.message
              ? error.body.message
              : "Error while getting Study Languages."
          );
        }
      );
    },
    getPaticipantDetail() {
      this.studyLanguages=[]
      this.selectedLanguage = '';
      this.$api.getParticipantDataFact(this.studyId, this.participantId).then(
        response => {
          this.studyLanguages.push(response.body.participantLanguage);
          this.selectedLanguage = this.studyLanguages[0].language_id;
        },
        error => {
          this.$toastr.error(
            error.body && error.body.message
              ? error.body.message
              : "Error while getting Study Languages."
          );
        }
      );
    },
    getSiteTeamFact() {
      let self = this;
      this.$api.getSiteTeamFact(this.studyId, this.siteId).then(response => {
        this.siteTeamList = response.body;
      });
    },
    onDocFileSelection(event) {
      let error = false;
      if (
        !(
          event.srcElement ||
          (event.srcElement.files && event.srcElement.files[0] == null)
        )
      ) {
        return true;
      }
      this.fileEvent = event;
      this.file = event.srcElement.files[0];
      this.fileName = this.file.name;
      event.target.value = null;
    },

    uploadDocument() {
      nprogress.start();
      this.isDisabled = true;
      let error = false;
      if(this.fileEvent){
        if (!(this.fileEvent.srcElement || (this.fileEvent.srcElement.files && this.fileEvent.srcElement.files[0] == null))) {
          return true;
        }
      }

      if (!this.selectedLanguage || this.selectedLanguage === undefined || this.selectedLanguage === "" || this.selectedLanguage === "null" ) {
        this.$toastr.error("Please select a document language.");
        return;
      }

      if (!this.file || this.file === undefined || this.file ==='') {
        this.$toastr.error("No file selected!!");
        return;
      }

      if(this.file){
          var ext = this.file.name
            .split(".")
            .pop()
            .toLowerCase();

          this.fileName = this.file.name;

          if (ext != "pdf") {
            error = true;
            this.$toastr.error("PDF files only");
            return;
          }

          if (this.file) {
            let fileSizeMB = this.formatBytes(this.file.size);
            if(fileSizeMB > 100){
              error = true;
              this.$toastr.error("File size cannot exceed 100 MB.");
              return;
            }
          }
        }

      if (error) {
        if (this.studyLanguages.length > 1) {
          this.selectedLanguage = null;
        } else if (
          this.studyLanguages != null &&
          this.studyLanguages.length == 1
        ) {
          this.selectedLanguage = this.studyLanguages[0].language_id;
        }
        return;
      }
      const fd = new FormData();
      fd.append("studyId", this.document.studyId);
      fd.append("siteId", this.siteId);
      fd.append("participantId", this.document.participantId);
      fd.append("documentName", this.fileName);
      fd.append("languageId", this.selectedLanguage);
      fd.append("participantSignDate", this.participantSignDate? moment(this.participantSignDate).format("YYYY-MM-DDTHH:mm:ss[Z]"): '');
      fd.append("siteMemberSignDate", this.siteMemberSignDate? moment(this.siteMemberSignDate).format("YYYY-MM-DDTHH:mm:ss[Z]"): '');
      fd.append("signedBy", this.signedBy);
      fd.append("file", this.file);
      fd.append("parentDocId", this.document.docId);

      this.$api
        .saveStudyParticipantDocuement(
          this.document.studyId,
          this.siteId,
          this.document.participantId,
          fd
        )
        .then(
          response => {
            nprogress.done();
            this.isDisabled = false;
            this.getDocuments();
            this.$toastr.success("Document uploaded successfully");
            window.$("#upload-document-modal").modal("hide");
          },
          error => {
            nprogress.done();
            this.$toastr.error(
              error.body
                ? error.body.message
                : "Error while adding the research site document"
            );
          }
        );
    },
    formatBytes(size) {
      return size / Math.pow(1024, 2);
    }
  },
  mounted() {
    this.getDocuments();
    this.getSiteId();
  }
};
</script>
<style scoped lang="scss" src="@/assets/table-styling.scss"></style>
<style scoped lang="scss" src="@/assets/dot-streaching-loader.scss"></style>
<style scoped lang="scss">
.documents-list {
  padding: 0px 20px;
  margin-bottom: 10px;
  .signature {
    width: 129px;
    height: 30px;
    padding: 4px 0px 0px 14px;
    font-family: Roboto-Regular;
    font-size: 14px;
    border-radius: 4px;
    border: solid 1px #e4e8eb;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    color: #4c8ce4;
    a {
      color: #4c8ce4;
      font-size: 12px;
      font-weight: bold;
      cursor: pointer;
    }
  }
  .action {
    font-family: Roboto-Regular;
    cursor: pointer;
  }
  .text-info {
    font-family: Roboto-Regular;
    color: #1e8fe1 !important;
    cursor: pointer;
    font-weight: 600;
  }
  .color-text {
    color: #a8a8a8;
  }
  .clock {
    margin-top: -4px;
    margin-left: 4px;
  }
  .addDoc {
    color: #4c8ce4;
    font-size: 14px;
    font-weight: bold;
    width: 169px;
    height: 30px;
    border-radius: 4px;
    border: solid 1px #e4e8eb;
    background-color: #ffffff;
    padding-top: 3px;
  }
  .doc-modal-title {
    width: 360px;
    height: 24px;
    padding-top: 20px;
    font-size: 20px;
    font-weight: bold;
    text-align: center;
    line-height: 1.2;
    color: #666669;
  }
  .modal-content {
    width: 425px;
    height: auto;
    border-radius: 4px;
    background-color: #ffffff;
  }
  .modal-title {
    margin: auto;
    margin-top: 45px;
    text-align: center;
    width: 100%;
    font-family: Roboto-Bold;
    font-size: 20px;
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.2;
    letter-spacing: normal;
    color: #666669;
  }
   .disabled_datepicker {
    pointer-events: none;
    opacity: 0.5;
    .datepicker-class {
      background-color: #eee !important;
    }
  }

  .cov-datepicker {
    width: 100%;
  }

  .icon_style {
    position: absolute;
    height: 33px;
    display: inline-block;
    border-left: 1px solid #ddd;
    top: 21px;
    right: 16px;
    background-color: rgba(85, 85, 85, 0.05);
    width: 35px;
    pointer-events: none;
  }
  .cal-icon-style {
    position: absolute;
    cursor: pointer;
    pointer-events: none;
    color: #b0bac9;
    left: 341px;
    top: 188px;
    height: 14px;
    width: 14px;
  }
  .site-cal-icon-style {
    position: absolute;
    cursor: pointer;
    pointer-events: none;
    color: #b0bac9;
    top: 268px;
    left: 341px;
    height: 14px;
    width: 14px;
  }

  .language-select-box {
    width: 360px;
    height: 40px;
    border-radius: 3px;
    box-shadow: inset 0 1px 2px 0 #e4e8eb;
    border: solid 1px #e4e8eb;
    background-color: #ffffff;
    background-image: url(/static/img/arrow-down.png) !important;
    font-family: Roboto-Regular;
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    color: #9b9b9b;
  }
  .uploadDocInputField {
    margin-top: 12px;
    width: 360px;
    height: 40px;
    border-radius: 3px;
    box-shadow: inset 0 1px 2px 0 #e4e8eb;
    border: solid 1px #e4e8eb;
    background-color: #ffffff;
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    color: #9b9b9b;
  }
  .form-group {
    margin-top: 12px;
  }
  
  .file-input {
    display: none;
    flex-grow: 2;
    border: none;
  }

  span.btnBrowse {
    padding: 2px 19px 6px 25px;
    margin: -25px 4px -2px 62px;
    width: 100px;
    height: 28px;
    border-radius: 4px;
    border: solid 1px #1e8fe1;
    color: #1e8fe1;
    float: right;
  }

  span.spanFile {
    padding-right: 145px;
    color: #9b9b9b;
    width: auto;
  }
  .spanFile1{
    color: #9b9b9b;
    width: auto;
    margin-top: 12px;
  }
  .file-upload-document {
    display: flex;
    background: #fff;
    height: 36px;
    align-items: end;
    justify-content: flex-end;
    width: 100%;
    height: 40px;
    border-radius: 3px;
    box-shadow: inset 0 1px 2px 0 #e4e8eb;
    border: solid 1px #e4e8eb;
    background-color: #ffffff;
    padding-top: 9px;
  }
  .btnUpload {
    font-size: 14px;
    color: #ffffff;
    margin-bottom: 30px;
    margin-right: 0px;
    background-color: #1e8fe1;
  }
  .labelTitle {
    font-weight: bold;
  }
  .statusActive{
    padding: 1px 9px 1px 7px;
    height: 16.2px;
    font-weight: 600;
    border-radius: 2px;
    border: solid 1px #e4e8eb;
    background-color: #f7f7f7;
  }
  .statusInactive{
    color: #4a4a4a;
    padding: 1px 3px 1px 3px;
    font-weight: 600;
    opacity: 0.6;
    border-radius: 2px;
    border: solid 1px #e4e8eb;
    background-color: #f7f7f7;
  }
  .width-520{
    width: 520px;
  }
  .width-870{
    width: 870px;
  }
  .width-999{
    width: 1297px;
  }
  .width-990{
    width: 1010px;
  }
  label.alignlable {
    width: 97%;
  }
  .docTblHeading{
    color: #4a4a4a;
  }
  .width-1000 {
    width: 1717px;
  }
  .vector {
    width: 7px;
    height: 11.3px;
    object-fit: contain;
    margin-bottom: 6px;
  }
  span.btnBrowse2{
    padding: 2px 19px 6px 25px;
    margin: -4px 4px -2px 0px;
    width: 100px;
    height: 29px;
    border-radius: 4px;
    border: solid 1px #1e8fe1;
    color: #1e8fe1;
    float: right;
  }
  span.btnBrowse0{
    padding: 3px 19px 6px 25px;
    margin: -25px 4px -4px 0px;
    width: 100px;
    height: 30px;
    border-radius: 4px;
    border: solid 1px #1e8fe1;
    color: #1e8fe1;
    float: right;
  }
  .language_color {
    opacity: 0.5;
    font-family: Roboto-Regular;
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    color: #4a4a4a;
  }
}
@media screen and (min-width:0\0) { /* supports all versions of Internet Explorer */
   span.btnBrowse0{
    padding: 3px 19px 6px 25px!important;
    margin: -2px 4px -5px 0px!important;
    width: 100px;
    height: 28px!important;
    border-radius: 4px;
    border: solid 1px #1e8fe1;
    color: #1e8fe1;
    float: right;
  }
}
@media not all and (min-resolution:.001dpcm)  { 
    .signature {
        width: 129px;
        height: 30px;
        padding: 6px 0px 0px 9px!important;
        font-family: Roboto-Regular;
        font-size: 14px;
        border-radius: 4px;
        border: solid 1px #e4e8eb;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        line-height: normal;
        letter-spacing: normal;
        color: #4c8ce4;
    }
}
</style>
