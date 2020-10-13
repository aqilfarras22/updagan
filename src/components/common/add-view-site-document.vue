<template>
  <div>
    <b-container fluid :class="{'pt-32' : !isAdmin}">
      <div v-if="!fromAdmin" class="header-title">Documents</div>
      <div v-if="fromAdmin" class="header-title">
        {{ siteDetails.name }} Documents
        <div class="site-id-info">Site ID: {{ siteDetails.userSiteId }}</div>
      </div>
      <div class="pt-18 pb-18 display-inline-block" v-if="!canSiteDataLockAccess">
        <div class="header-message">
          Upload and manage documents for participants. Documents activated here will be visible in the participant’s profile. Documents deactivated here will be removed from the participant’s profile and app, unless already signed.</div>
        <div class="max-file-size">Max file size: 100mb</div>
        <div class="button-div">
          <button @click="addDocument" class="btn newBtn br-3 ml-5">Add a document</button>
        </div>
      </div>
      <div class="row">
        <div class="col-sm-12 col-md-12 col-lg-12 col-xs-12 pb-20 pl-0 pr-0">
          <div class="table-column">
            <div class="row pl-15 pr-6 border-bottom">
              <div class="col-sm-10 col-md-10 col-lg-10 col-xs-10 p-0 lh-36 fs-17 fw-bold gridHead">
                <span class="color_f16559">&nbsp;</span>
                <span class="color_2d3752">Documents</span>
              </div>
              <div class="col-sm-2 col-md-2 col-lg-2 col-xs-2 p-0 show_section text-right pr-0">
                <select v-model="pageSize"  @change="showSiteDocuments" class="input-bg select_control mb-4 fs-12">
                  <option
                    :value="option.value"
                    v-for="option in documnetListOptions"
                    :key="option.value"
                  >{{option.text}}</option>
                </select>
              </div>
            </div>
            <div class="wrapper height-500 position-relative">
              <table class="table pb-20 mb-50">
                <thead class="table-border fs-12">
                  <tr>
                    <th :class="field.class" v-for="(field, index) in documentListFields" :key ="index">
                      <span class="pr-3 position-relative" v-if="field.key == 'action'"> 
                        <span>{{field.label}}</span>
                      </span>
                      <span class="pr-3 position-relative" v-if="field.key != 'action'">
                        <span @click="sortField(field)">{{field.label}}
                          <span class="sortUp" v-if="field.key != 'setstatus'" :class="{'disable-icon': !field.ascOrder}"><i class="fa fa-angle-up ml-15" aria-hidden="true"></i></span>
                          <span class="sortDown" v-if="field.key != 'setstatus'" :class="{'disable-icon': !field.descOrder}"><i class="fa fa-angle-down ml-15" aria-hidden="true"></i></span>
                        </span>
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody v-if="documents.length > 0">
                  <tr v-for="(document, index) in documents" :key="index" class="border-bottom">
                    <td class="table-content-color w-190 pl-15 pt-16">
                      <a class="link" :title="document.documentName" v-if="document.documentName.length >= 22">{{document.documentName.split('.')[0].slice(0, 20)}}...</a>
                      <a class="link" :title="document.documentName" v-else>{{document.documentName.split('.')[0]}}</a>
                    </td>
                    <td class="table-content-color w-180 pt-16">{{document.docLanguageName}}</td>
                    <td class="table-content-color w-210 pt-16">{{new Date(document.uploadedTime) | dateFUTC}} UTC</td>
                    <td class="table-content-color w-170 pt-16">{{document.uploadedBy}}</td>
                    <td class="table-content-color w-210 pt-16"><span v-if="document.activatedTime">{{new Date(document.activatedTime) | dateFUTC}} UTC</span></td>
                    <td class="table-content-color w-170 pt-16"><span v-if="document.activatedBy">{{document.activatedBy}}</span></td>
                    <td class="table-content-color w-80 pt-16">{{document.status}}</td>
                    <td class="table-content-color w-110 pt-16">
                      <span type="button" class="btn btn-link"  @click="getStudyDocuementDownload(document)">Download</span>
                    </td>
                    <td class="table-content-color w-120 pt-16">
                      <button class="btn btn-link" :disabled="canSiteDataLockAccess" v-if="document.status == 'Uploaded'" @click="activateDocument(document)">Activate</button>
                      <button class="btn btn-link" :disabled="canSiteDataLockAccess"  v-if="document.status == 'Active'" @click="dectivateDocument(document)">Deactivate</button>
                    </td>
                  </tr>
                </tbody>
                <tbody v-if="documents.length < 1">
                    <tr>
                      <td>
                        <div class="emptyGrid">
                          <b class="fs-20">No documents available to view</b>
                        </div>
                      </td>
                    </tr>
                </tbody>
              </table>
              <div class="pb-5 pl-15 position-absolute bottom-0" v-if="documents && documents.length">
                <div class="row display-inline-flex">
                  <div @click="prevPage(currentPage, totalPages)"
                    class="arrow-icon cursor_pointer"
                    :class="{ 'disabledPagination': currentPage <= 1}">
                    <i class="fa fa-angle-left fs-23 pt-3"></i>
                  </div>
                  <div class="pagination pt-3">{{currentPage}}</div>
                  <div class="pagination2 pt-3">of {{totalPages}}</div>
                  <div
                    @click="nextPage(currentPage, totalPages)"
                    class="arrow-icon pt-3 cursor_pointer"
                    :class="{ 'disabledPagination': currentPage >= totalPages}">
                    <i class="fa fa-angle-right fs-23"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </b-container>
    <!-- Upload Document Modal-->
    <div id="add-document-modal" class="modal fade" role="dialog" data-backdrop="static">
      <div class="modal-dialog">
        <div class="modal-content pl-33">
          <div>
            <div class="modal-header border-none">
              <div class="modal-title invite-text">Select Document Language</div>
              <button type="button" class="close" @click="closeModal">&times;</button>
            </div>
            <div class="modal-body pl-0 pr-0">
              <div class="row">
                <span class="ddlLabel">Document Language</span>
                <select
                  v-if="studyLanguages.length > 1"
                  v-model="selected"
                  class="language-select-box"
                >
                  <option value="null" disabled selected>Choose Language</option>
                  <option
                    :value="lang.language_id"
                    v-for="lang in studyLanguages"
                    :key="lang.language_id"
                  >{{lang.display_name}}</option>
                </select>
                <select v-else v-model="selected" class="language-select-box">
                  <option
                    :value="lang.language_id"
                    v-for="lang in studyLanguages"
                    :key="lang.language_id"
                  >{{lang.display_name}}</option>
                </select>
              </div>
              <div class="form-group">
                <div
                  align-self="center"
                  class="row pt-30 align-items-center justify-content-center"
                >
                  <div class="pull-right col">
                    <div class="file-upload pull-right create-btn fs-14">
                      <input type="file" class="file-input" id="consent_section_doc" v-on:change="onDocFileSelection($event)" accept="application/pdf"/>
                      <div class="saveBtn">Save</div>
                    </div>
                    <b-link
                      variant="primary"
                      class="pull-right pt-8 fs-14 pr-20"
                      @click="closeModal()"
                    >Cancel</b-link>
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
import nprogress from "nprogress";
import "nprogress/nprogress.css";
import toastr from "toastr";
import swal from "sweetalert2";
import _ from "lodash";
import localStorageService from "@/services/localStorage";
import FileSaver from 'file-saver';
import sortBy from 'lodash/sortBy';
import filter from 'lodash/filter';
import { SITEDATALOCK  } from "@/constants/authRoles";
import { AclRule } from "vue-acl";
import { mapGetters, mapActions } from "vuex";
export default {
  name: "addviewsitedocument",
  data() {
    return {
      studyLanguages: {},
      selected: null,
      selectedFile: {},
      currentSiteId: this.siteId,
      fromAdmin: this.isAdmin,
      siteDetails: {},
      documents: [],
      currentPage: 1,
      totalPages: 1,
      pageSize: 15,
      sortValue: "",
      sortOrder: "",
      documnetListOptions: [
        {
          value: 15,
          text: "Show 15 items"
        },
        {
          value: 30,
          text: "Show 30 items"
        },
        {
          value: 50,
          text: "Show 50 items"
        }
      ],
      headersAscSortFlags: {
        documentName: "",
        docLanguageName: "",
        uploadedTime: "",
        uploadedBy: "",
        activatedTime: "",
        activatedBy: "",
        status: ""
      },
      documentListFields: [
        {
          key: "documentName",
          type: "string",
          ascOrder: false,
          descOrder: false,
          label: "Name",
          class: "heading-color w-190 cursor_pointer pl-15",
          currentOrder: null
        },
        {
          key: "docLanguageName",
          type: "string",
          ascOrder: false,
          descOrder: false,
          label: "Language",
          class: "heading-color w-180 cursor_pointer pl-10",
          currentOrder: null
        },
        {
          key: "uploadedTime",
          type: "string",
          label: "Uploaded",
          class: "heading-color w-210 cursor_pointer pl-10",
          ascOrder: false,
          descOrder: false,
          currentOrder: null
        },
        {
          key: "uploadedBy",
          type: "string",
          label: "By",
          class: "heading-color w-170 cursor_pointer pl-10",
          ascOrder: false,
          descOrder: false,
          currentOrder: null
        },
        {
          key: "activatedTime",
          type: "string",
          label: "Activated",
          ascOrder: false,
          descOrder: false,
          class: "heading-color w-210 cursor_pointer pl-10",
          currentOrder: null
        },
        {
          key: "activatedBy",
          type: "integer",
          label: "By",
          ascOrder: false,
          descOrder: false,
          class: "heading-color w-170 cursor_pointer pl-10",
          currentOrder: null
        },
        {
          key: "status",
          type: "integer",
          label: "Status",
          ascOrder: false,
          descOrder: false,
          class: "heading-color w-80 cursor_pointer pl-10",
          currentOrder: null
        },
        {
          label: "Action",
          key:"action",
          class: "heading-color w-110 cursor_pointer pl-22",
          currentOrder: null
        },
        {
          label: "",
          key:"setstatus",
          class: "heading-color w-120 pl-10"
        }
      ]
    };
  },
  props: ["siteId", "isAdmin"],
  computed: {
    ...mapGetters(["user"]),
    sortedDocuments: {
      get: function () {
        return this.documents.sort((a, b) =>  new Date(b.uploadedTime) - new Date(a.uploadedTime))
      },
      set: function () {
      }
    },
    userAccess() {
      return new AclRule(this.user.userRole).generate();
    },
    canSiteDataLockAccess() {
      this.$acl.change(`${SITEDATALOCK}`);
      return this.$acl.check("userAccess");
    },
  },
  mounted() {
    this.studyId = this.$route.params.studyId;
    this.getStudyLanguages();
    this.getSiteInfo();
    this.getStudyCustomDocuements(this.currentPage);
  },
  methods: {
    getSiteInfo() {
      let self = this;
      this.$api.getSiteDetailsFact(this.studyId, this.siteId).then(response => {
        this.siteDetails = response.body;
      });
    },
    getStudyCustomDocuements(currentPage) {
      nprogress.start();
      let self = this;
      var siteId;
      if(!this.isAdmin){
        const user = localStorageService.getItem("userObj");
        siteId = user.siteIds[0];
      }else{
          siteId =this.siteId;
      }

      this.$api
        .getStudyCustomDocuements(
          this.studyId,
          siteId,
          currentPage,
          this.pageSize,
          this.sortValue,
          this.sortOrder,
        )
        .then(response => {
          this.documents = [];
          if(!_.isEmpty(response.body)){
            this.documents = response.body.documents;
            this.currentPage = response.body.currentPage;
            this.totalPages = response.body.totalPages;
          }
          nprogress.done();
        },
        error => {
          nprogress.done();
          this.$toastr.error(
            error.body && error.body.message
              ? error.body.message
              : "Error while getting documents."
          );
        });
    },
    getStudyDocuementDownload(document) {
      if (this.canSiteDataLockAccess) {
        toastr.warning('Access restricted');
      } else {
        let self = this;
          this.$api
            .getStudyDocuementDownload(document.studyId, document.docId)
            .then(response => {
              let pdfUrl = response.body;
              self.downloadFile(pdfUrl, document.documentName);
            });
      }      
    },
    downloadFile(dataURL, filename) {     
      var oReq = new XMLHttpRequest();
      var URLToPDF = dataURL;
      oReq.open("GET", URLToPDF, true);
      oReq.responseType = "blob";
      oReq.onload = function() {
          var file = new Blob([oReq.response], { 
              type: 'application/pdf' 
          });
          saveAs(file, filename);
      };
      oReq.send();
    },
    addDocument() {
      window.$("#add-document-modal").modal("show");
      this.$forceUpdate();
    },
    closeModal() {
      this.$swal({
        title: "Are you sure you want to cancel?",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#4a4a4a",
        cancelButtonColor: "#1e8fe1",
        confirmButtonText: "No",
        cancelButtonText: "Yes"
      }).then(({ dismiss }) => {
        if (dismiss === "cancel") {
          this.hideModel();
        }
      });
    },
    getStudyLanguages() {
      this.$api.getStudyLanguages(this.studyId).then(
        response => {
          this.studyLanguages = response.body;
          if (this.studyLanguages.length > 1) {
            this.selected = null;
          } else if (
            this.studyLanguages != null &&
            this.studyLanguages.length == 1
          ) {
            this.selected = this.studyLanguages[0].language_id;
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
    onDocFileSelection(event) {
      nprogress.start();
      let error = false;
      if (
        !(
          event.srcElement ||
          (event.srcElement.files && event.srcElement.files[0] == null)
        )
      ) {
        nprogress.done();
        return true;
      }
      let languageId = this.selected;
      if (!languageId || languageId === undefined) {
        toastr.error("Please select a document language.");
        return;
      }
      let file = event.srcElement.files[0];
      if (!file || file === undefined) {
        toastr.error("No file selected!!");
        return;
      }

      var ext = file.name
        .split(".")
        .pop()
        .toLowerCase();

      let fileName = file.name;

      if (ext != "pdf") {
        error = true;
        toastr.error("PDF files only");
        return;
      }

      if (file) {
        let fileSizeMB = this.formatBytes(file.size);
        if(fileSizeMB > 100){
          error = true;
          toastr.error("File size cannot exceed 100 MB.");
          return;
        }
      }

      if (error) {
        if (this.studyLanguages.length > 1) {
          this.selected = null;
        } else if (
          this.studyLanguages != null &&
          this.studyLanguages.length == 1
        ) {
          this.selected = this.studyLanguages[0].language_id;
        }
        return;
      }

      let studyId = this.studyId;
      let siteId = this.siteId;
      const fd = new FormData();
      fd.append("file", file);
      fd.append("studyId", studyId);
      fd.append("documentName", fileName);
      fd.append("siteId", siteId);
      fd.append("languageId", languageId);

      var self = this;
      this.$api.saveStudyCustomDocuement(studyId, fd).then(
        response => {
          nprogress.done();
          this.getStudyCustomDocuements(self.currentPage);
          toastr.success('Document uploaded successfully');
        },
        error => {
          nprogress.done();
          toastr.error(
            error.body
              ? error.body.message
              : "Error while adding the research site document"
          );
        }
      );

      event.target.value = null;
      this.hideModel();
    },
    hideModel() {
      if (this.studyLanguages.length > 1) {
        this.selected = null;
      } else if (
        this.studyLanguages != null &&
        this.studyLanguages.length == 1
      ) {
        this.selected = this.studyLanguages[0].language_id;
      }
      window.$("#add-document-modal").modal("hide");
      this.$forceUpdate();
    },
    formatBytes(size) {
      return size / Math.pow(1024, 2);
    },
    activateDocument(document) {
      swal
        .fire({
          title:
            "Activate document?<br><br>Activating makes document visible in participant's profile.<br>Are you sure you want to activate this document?",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#4a4a4a",
          cancelButtonColor: "#1e8fe1",
          confirmButtonText: "No",
          cancelButtonText: "Yes"
        })
        .then(({ dismiss }) => {
          if (dismiss === "cancel") {
            var self = this;
            nprogress.start();
            this.$api
              .statusChangeStudyCustomDocuement(
                document.studyId,
                document.docId,
                document
              )
              .then(response => {
                this.$toastr.success("Document activated.");
                this.getStudyCustomDocuements(this.currentPage);
                nprogress.done();
              },
              error => {
                nprogress.done();
                toastr.error(
                  error.body
                    ? error.body.message
                    : "Error while activating document"
                );
              });
          }
        });
    },
    dectivateDocument(document) {
      swal
        .fire({
          title:
            "Deactivate document?<br><br>Deactivating removes document from Participant's profile and app, unless signed.<br>Are you sure you want to deactivate this document?",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#4a4a4a",
          cancelButtonColor: "#1e8fe1",
          confirmButtonText: "No",
          cancelButtonText: "Yes"
        })
        .then(({ dismiss }) => {
          if (dismiss === "cancel") {
            nprogress.start();
            this.$api
              .statusChangeStudyCustomDocuement(
                document.studyId,
                document.docId,
                document
              )
              .then(response => {
                this.getStudyCustomDocuements(this.currentPage);
                this.$toastr.success("Document deactivated.");
                nprogress.done();
              },
              error => {
                nprogress.done();
                toastr.error(
                  error.body
                    ? error.body.message
                    : "Error while deactivating document"
                );
              });
          }
        });
    },
    showSiteDocuments() {
      this.getStudyCustomDocuements(this.currentPage);
    },
    prevPage(currentPage, totalPages) {
      let self = this;
      if (currentPage <= totalPages) {
        let promise = new Promise(function(resolve, reject) {
          let currPage = currentPage - 1;
          resolve(currPage);
        });
        promise.then(function(currentPage) {
          self.getStudyCustomDocuements(currentPage);
        });
      }
    },
    nextPage(currentPage, totalPages) {
      let self = this;
      if (currentPage < totalPages) {
        let promise = new Promise(function(resolve, reject) {
          let currPage = currentPage + 1;
          resolve(currPage);
        });
        promise.then(function(currentPage) {
          self.getStudyCustomDocuements(currentPage);
        });
      }
    },
    sortField(field) {
      var direction;
      field.ascOrder = !field.ascOrder;
     if (field.ascOrder == true) {
        field.ascOrder = true;
        field.descOrder = false;
        direction = 'asc';
      } else {
        field.ascOrder = false;
        field.descOrder = true;
        direction = 'desc';
      }

      this.sortValue = field.key;
      this.sortOrder = direction;
      this.getStudyCustomDocuements(this.currentPage);
    },
    sortString(direction, field) {
      let records = _.cloneDeep(this.documents);
      records = _.orderBy(
        records,
        [records => records.documentName.toLowerCase()],
        direction
      );
      return records;
    },
    sortTimeStamp(direction, field) {
      let records = _.cloneDeep(this.documents);
      records = _.orderBy(records, field.key, direction);
      return records;
    }
  }
};
</script>

<style scoped lang="scss" src="../../../public/static/fonts.scss"></style>
<style scoped lang="scss">
.header-title {
  font-family: Roboto-Medium;
  font-size: 22px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.09;
  letter-spacing: normal;
  color: #2d3752;
}
.display-inline-block {
  display: flex;
}
.header-message {
  opacity: 0.6;
  font-family: Roboto-Regular;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.43;
  letter-spacing: normal;
  color: #2d3752;
  margin-right: auto;
}

.disabled{
   opacity: 0.65; 
  cursor: not-allowed;
}

.disabled-save{
   opacity: 0.65 !important;
   cursor: not-allowed !important;
}

.max-file-size {
  opacity: 0.6;
  font-family: Roboto-Regular;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.43;
  letter-spacing: normal;
  color: #2d3752;
  margin: 0 13px;
  vertical-align: top;
  width: 229px;
}
.newBtn {
  width: 152px;
  height: 36px;
  border-radius: 4px;
  color: #fff !important;
  background-color: #1e8fe1 !important;
  border-color: #1e8fe1 !important;
  cursor: pointer;
  font-family: Roboto-Regular;
  font-size: 14px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: -0.34px;
  color: #ffffff;
  vertical-align: top;
  margin-top: 6px;
}

.btn-link{
  margin-top:-5px;
}

.button-div {
  margin-top: -10px;
  float: right;
}
.modal-content {
  height: 315px;
  width: 425px;
}
.modal-title {
  margin: auto;
  margin-top: 45px;
  text-align: center;
  width: 100%;
  font-family: Roboto-Regular;
  font-size: 20px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.2;
  letter-spacing: normal;
  color: #666669;
}
.create-btn {
  width: 64px !important;
  height: 36px !important;
  border-radius: 2px !important;
  background-color: #1e8fe1 !important;
  font-family: Roboto-Regular !important;
  font-size: 14px !important;
  font-weight: normal !important;
  font-stretch: normal !important;
  font-style: normal !important;
  line-height: 1.71 !important;
  letter-spacing: normal !important;
  color: #ffffff !important;
}
.ddlLabel {
  font-family: Roboto-Regular;
  font-size: 14px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  color: #4a4a4a;
}
.language-select-box {
  margin-top: 12px;
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
.form-group {
  margin-top: 30px;
}
.file-upload {
  position: relative;
  overflow: hidden;
  border: none;
  border-radius: 3px;
  padding: 5px 10px;
  display: inline;
  background-color: #fff;
  border-radius: 4px;
  border: solid 1px #1e8fe1;
  font-family: Lato-Regular;
  font-size: 13px;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.33;
  letter-spacing: normal;
  text-align: center;
  background: #fff;
  color: #1e8fe1;
}
.site-id-info {
  font-family: Roboto-Medium;
  font-size: 16px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.5;
  letter-spacing: normal;
  color: #7b7c7e;
  margin-top: 5px;
}

body {
  color: #333;
  .mb-5 {
    margin-bottom: 5px !important;
  }
}

.btn {
  font-size: 14px;
}

.col-xs-12 {
  width: 100%;
}

.table-striped > tbody > tr[data-v-15e213e8]:nth-of-type(odd) {
  background-color: #fff !important;
}

.col-xs-1,
.col-xs-2,
.col-xs-3,
.col-xs-4,
.col-xs-5,
.col-xs-6,
.col-xs-7,
.col-xs-8,
.col-xs-9,
.col-xs-10,
.col-xs-11,
.col-xs-12 {
  float: left;
  //flex: none;
  display: block;
}

.col-lg-1,
.col-lg-2,
.col-lg-3,
.col-lg-4,
.col-lg-5,
.col-lg-6,
.col-lg-7,
.col-lg-8,
.col-lg-9,
.col-lg-10,
.col-lg-11,
.col-lg-12,
.col-md-1,
.col-md-2,
.col-md-3,
.col-md-4,
.col-md-5,
.col-md-6,
.col-md-7,
.col-md-8,
.col-md-9,
.col-md-10,
.col-md-11,
.col-md-12,
.col-sm-1,
.col-sm-2,
.col-sm-3,
.col-sm-4,
.col-sm-5,
.col-sm-6,
.col-sm-7,
.col-sm-8,
.col-sm-9,
.col-sm-10,
.col-sm-11,
.col-sm-12,
.col-xs-1,
.col-xs-2,
.col-xs-3,
.col-xs-4,
.col-xs-5,
.col-xs-6,
.col-xs-7,
.col-xs-8,
.col-xs-9,
.col-xs-10,
.col-xs-11,
.col-xs-12 {
  position: relative;
  min-height: 1px;
  padding-right: 15px;
  padding-left: 15px;
}

.col-xs-10 {
  width: 83.33333333%;
}

.row {
  display: block;
  &:after {
    content: "";
    clear: both;
    display: block;
  }
}

.select_section {
  select.form-control {
    height: 40px !important;
    line-height: 22px;
  }
}

.show_section {
  select.form-control {
    height: 36px !important;
    line-height: 22px;
  }
}

.modal-dialog {
  min-width: 31%;
}

@media (min-width: 768px) {
  .col-sm-1,
  .col-sm-2,
  .col-sm-3,
  .col-sm-4,
  .col-sm-5,
  .col-sm-6,
  .col-sm-7,
  .col-sm-8,
  .col-sm-9,
  .col-sm-10,
  .col-sm-11,
  .col-sm-12 {
    float: left;
    display: block;
  }

  .col-sm-12 {
    width: 100%;
  }

  .col-sm-10 {
    width: 83.33333333%;
  }

  .col-sm-4 {
    width: 33.33333333%;
    //max-width: inherit;
  }

  .col-md-2 {
    flex: none;
  }
}


@media (min-width: 992px) {
  .col-md-1,
  .col-md-2,
  .col-md-3,
  .col-md-4,
  .col-md-5,
  .col-md-6,
  .col-md-7,
  .col-md-8,
  .col-md-9,
  .col-md-10,
  .col-md-11,
  .col-md-12 {
    float: left;
    flex: none;
  }

  .col-md-2 {
    width: 16.66666667%;
  }

  .col-md-10 {
    width: 83.33333333%;
  }

  .col-md-12 {
    width: 100%;
  }
}


@media (min-width: 1200px) {
  .col-lg-1,
  .col-lg-2,
  .col-lg-3,
  .col-lg-4,
  .col-lg-5,
  .col-lg-6,
  .col-lg-7,
  .col-lg-8,
  .col-lg-9,
  .col-lg-10,
  .col-lg-11,
  .col-lg-12 {
    float: left;
    display: block;
  }

  .col-lg-2 {
    width: 16.66666667%;
  }

  .col-lg-10 {
    width: 82.33333333%;
  }

  .col-lg-11 {
    width: 91.66666667%;
  }
}

.invite-text {
  color: #666669 !important;
}

.color_f16559 {
  color: #f16559;
}

.height-auto {
  height: auto !important;
}

.table {
  .heading-color {
    color: #9b9b9b !important;
    border-top: none;
    border-bottom: none;
    vertical-align: top;
    font-family:'Lato', sans-serif;
  }

  th,
  td {
    font-family: 'Lato', sans-serif;
    padding: 10px;
    // line-height: 30px;
    word-break: break-all;
    border: none;
  }
}

.table-border {
  border-bottom: 1px solid #e4e8eb !important;
}

.new-label-width {
  min-width: 300px !important;
}

.invite-width {
  min-width: 250px !important;
}

.table-content-color {
  color: #4a4a4a;
  height: 55px !important;
}

.azure-class {
  color: #1f95f2;
}

.modal-content {
  padding: 15px;
}

.table-column {
  width: 1140;
  background-color: #fff;
  height: 100%;
  padding: 18px 0px 0px 0px;
  color: #9b9b9b;
  border-radius: 4px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.06);
}

.saveBtn {
    padding: 5px;
    font-family:"Roboto", sans-serif;
}

.color_import {
  color: #34537d;
  padding-bottom: 30px;
}

.input-bg {
  width: 150px;
  background: #ffffff !important;
  color: #4a4a4a !important;
  border: 1px solid #e4e8eb !important;
}

.icon-bg {
  color: #ffffff;
}

.icon-color {
  color: #34537d;
}

.fs-14 {
  font-size: 14px !important;
}

.view-color {
  color: #00b1ff;
  cursor: pointer;
}
.close-style {
  position: relative;
  right: 8px;
  top: 5px;
  font-size: 28px;
}

.color_2d3752 {
  color: #4a4a4a;
}

.document .modal-dialog {
  width: 500px;
}
.select_control {
  border-radius: 4px;
  border: solid 1px #e4e8eb;
  background-color: #ffffff;
}

.gridHead {
  margin-top: -7px;
}

.table .trigger:hover {
  background-color: #e2e8ee;
  border-radius: 3px;
  .edit {
    display: inline;
    top: 8px;
    left: 15px;
  }
}

.table .trigger2:hover {
  background-color: #e2e8ee;
  border-radius: 3px;
  .edit {
    display: inline;
    top: 8px;
    left: 4px;
  }
}

.edit {
  padding: 0px;
  display: none;
  font-size: 16px;
  cursor: pointer;
}

.wrapper {
  overflow-x: auto;
}

@media (max-width: 575px) {
  .xs-none {
    display: none;
  }
  .xs-pl-0 {
    padding-left: 0px;
  }
  .mob-pt15 {
    padding-top: 15px;
  }
}

@media (max-width: 1199px) {
  .has-sidemenu .container {
    padding-left: 30px !important;
    padding-right: 30px !important;
    width: auto;
    max-width: inherit;
  }
}

.modal-header {
  padding: 0 !important;
}

.select_section:after {
  content: "\F107";
  font: normal normal normal 20px/1 FontAwesome;
  color: #4a4a4a;
  right: 15px;
  top: 10px;
  height: 34px;
  padding: 0px 0px 0px 1px;
  position: absolute;
  pointer-events: none;
}

.show_section:after {
  content: "\F107";
  font: normal normal normal 20px/1 FontAwesome;
  color: #4a4a4a;
  right: 25px;
  top: 8px;
  height: 34px;
  padding: 0px 0px 0px 1px;
  position: absolute;
  pointer-events: none;
}

.show_section.siteId:after,
.show_section.country:after,
.show_section.langugage:after {
  content: "\F107";
  font: normal normal normal 20px/1 FontAwesome;
  right: 25px;
  top: 8px;
  position: absolute;
}

.lh-36 {
  line-height: 36px;
}

.height-500 {
  min-height: 400px !important;
}

.sortDown {
  position: absolute;
  padding-left: 4px;
  padding-top: 3px;
}

.sortUp {
  position: absolute;
  margin-top: -3px;
  padding-left: 4px;
}

.sortUp, .sortDown {
  cursor: pointer;
  color: #666769;
  &.disable-icon {
    color: #A8A8A8;
  }
  i {
    font-size: 11px;
  }
}

.position-relative {
  position: relative;
}

.line-height {
  line-height: 1.5;
}

.pt-150 {
  padding-top: 150px;
}

.arrow-icon {
  width: 32px;
  height: 32px;
  border-radius: 3px;
  background-color: #ffffff;
  border: solid 1px #e4e8eb;
  text-align: center;
  font-size: 23px;
  line-height: 10px !important;
  color: #e4e8eb;
}

.pagination {
  width: 32px;
  height: 32px;
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
  height: 32px;
  background-color: #ffffff;
  font-size: 13px;
  line-height: 23px !important;
  color: #4a4a4a;
  padding-left: 6px !important;
}

.disabledPagination {
  pointer-events: none;
}

.display-inline-flex {
  display: inline-flex !important;
}

.position-absolute {
  position: absolute;
}

.bottom-0 {
  bottom: 0px;
}

.form {
  padding: 15px;
}

.file-upload {
  color: #fff !important;
  background-color: #1e8fe1 !important;
  border-color: #1e8fe1 !important;
  position: relative;
  overflow: hidden;
  border: none;
  border-radius: 3px;
  padding: 1px 10px;
  height: 36px;
  border-radius: 4px;
  line-height: 1.33;
  text-align: center;
  align-items: center;
}

.emptyGrid {
  padding-top: 150px;
  height: 100px;
  position: absolute;
  left: 50%;
  margin-left: -50px;
}
</style>