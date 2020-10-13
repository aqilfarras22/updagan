<template>
<div>
  <div v-if="!canSiteDataLockAccess" class="add-document"><div class="plus-sign pull-left" @click="openUploadModal()"><span class="plus">+</span></div><div class="pull-left cursor_pointer"  @click="openUploadModal()">Add a source document</div><div class="pull-left max-size">Max file size: 100mb</div>
  <div style="clear:both;"></div>
  </div>
  <b-modal ref="upload-modal" hide-footer hide-header>
                <div class="d-block text-center upload-modal">
                  <div class="description">If you are uploading Protected Health Information (PHI), please make sure all Personally Identifiable Information (PII) is redacted or removed.</div>
                  <div class="btn-grp mt-30">
                     <div class="file-upload understand-button">
  <input type="file" id="myfile" name="myfile" class="file-input" @change="selectedFile()" @click="closeUploadModal()"/>I understand</div>
                  </div>
    </div>
  </b-modal>
  <b-modal ref="progress-modal" hide-footer hide-header>
                <div class="d-block text-center progress-modal">
                  <div class="upload-file">Uploading file...</div>
                  <img src="static/img/icn-csv.png"/>
                  <div class="pb-15">{{fileName}}</div>
                  <progress id="progressBar" value="0" max="100" class="progress"></progress>
                  <div class="uploading-now">Uploading now. Thanks for being patient.</div>
                  <div class="uploading-now delete pt-40"><span class="cursor_pointer" @click="cancelUpload()">Cancel upload</span></div>

    </div>
  </b-modal>
  <table-component
    showEmpty
    noGutters
    :items="documents"
    :fields="formHistoryFields"
  >


     <template slot="name" slot-scope="data">
      {{ data.row.item.name }}
    </template>
     <template slot="createdAt" slot-scope="data">
      {{ new Date(data.row.item.createdAt) | formatUTCDate }}
    </template>
     <template slot="uploadedBy" slot-scope="data">
      {{ data.row.item.createdByName }} ({{data.row.item.createdByUserRole}})
    </template>
    <template slot="size" slot-scope="data">
      {{ data.row.item.fileSize }}
    </template>
     <template slot="Download" slot-scope="data">
      <a @click="downloadDocument(data.row.item.id)" class="download cursor_pointer">Download</a>
    </template>
    <template slot="Delete" slot-scope="data">
      <a @click="deleteDocument(data.row.item.id)" class="delete cursor_pointer">Delete</a>
    </template>

  </table-component>
  </div>
</template>

<script>
import TableComponent from '@/components/common/table';
import swal from 'sweetalert2';

import {
  approvalStatusText,
  verificationStatusText,
  historyStatusText,
  historyStatus,
} from '@/constants/form';

import { SITEDATALOCK, PI } from "@/constants/authRoles";
import { mapGetters } from "vuex";
import { AclRule } from "vue-acl";
import toastr from 'toastr';

export default {
  name: 'edc-form-source-documents',
  components: {
    TableComponent,
  },
  props: [
    'documents',
    'studyId',
    'participantId',
    'responseId',
    'type',
    'participantInfo'
  ],
  data() {
    return {
      xmlHTTP: '',
      uploadUrl: '',
      s3Id: '',
      fileName: '',
      approvalStatusText,
      verificationStatusText,
      historyStatusText,
      historyStatus,
      formHistoryFields: [
        {
          key: 'name',
          label: 'NAME',
          sortable: true,
        },
        {
          key: 'createdAt',
          label: 'UPLOADED',
          sortable: true,
        },
        {
          key: 'uploadedBy',
          label: 'BY',
          sortable: false,
        },
        {
          key: 'fileSize',
          label: 'FILE SIZE',
          sortable: false,
        },
        {
          key: 'Download',
          label: 'ACTIONS'
        },
        {
          key: 'Delete',
          label: ' '
        }
      ],
    };
  },
  mounted() {
  },
  computed: {
    ...mapGetters(["user"]),
    userAccess() {
      return new AclRule(this.user.userRole).generate();
    },
    canPiAccess() {
      this.$acl.change(`${PI}`);
      return this.$acl.check("userAccess");
    },
    canSiteDataLockAccess() {
      this.$acl.change(`${SITEDATALOCK}`);
      return this.$acl.check("userAccess");
    }
  },
  methods: {
    getSourceDocuments() {
      this.$emit('getDocuments')
  },
    openUploadModal() {
      this.$refs['upload-modal'].show()
  },
  selectedFile() {
     this.$api.getPreSignedUrlFact(this.studyId, this.participantId, this.responseId, this.type, this.participantInfo.siteId)
        .then(response => {
          this.uploadUrl= response.body.preSignedUrl;
          this.s3Id= response.body.s3Id;
          document.getElementById("progressBar").value = 0
          var selectedFile = document.getElementById("myfile");
                var file = selectedFile.files[0];
                if (file) {
                  if(file.size < 104857600) {
                  this.$refs['progress-modal'].show()
                  var url = this.uploadUrl;
                  this.fileName = file.name;
                  this.$forceUpdate()
                  this.xmlHTTP= new XMLHttpRequest();
                  // xmlHTTP.upload.addEventListener("loadstart", loadStartFunction, false);
                  this.xmlHTTP.upload.addEventListener("progress", this.progressFunction, false);
                  this.xmlHTTP.addEventListener("load", this.transferCompleteFunction, false);
                  this.xmlHTTP.addEventListener("error", this.uploadFailed, false);
                  this.xmlHTTP.addEventListener("abort", this.uploadCanceled, false);
                  this.xmlHTTP.open("PUT", url, true);
                  this.xmlHTTP.setRequestHeader("Content-Type", file.type);
                  //xmlHTTP.setRequestHeader('book_id','10');
                  this.xmlHTTP.send(file);
                  }
                  else{
                    this.$toastr.error('File size exceeds the maximum of 100 MB.')
                    document.getElementById("myfile").value = null;
                  }
                }
        },
        error => {
          this.$toastr.error(
            error.body && error.body.message
              ? error.body.message
              : 'Error while uploading the document.',
          );
        })

              },
            progressFunction(evt) {
                var progressBar = document.getElementById("progressBar");
                var percentageDiv = document.getElementById("percentageCalc");
                if (evt.lengthComputable) {
                    progressBar.max = evt.total;
                    progressBar.value = evt.loaded;
                    // percentageDiv.innerHTML = Math.round(evt.loaded / evt.total * 100) + "%";
                }
            },
            transferCompleteFunction(evt) {
              let fileDetails = {}
              fileDetails.name = this.fileName
              fileDetails.s3Id = this.s3Id
              fileDetails.description = ''
              fileDetails.type = this.type
              this.$api.postUploadFact(this.studyId, this.participantId, this.responseId, fileDetails, this.participantInfo.siteId)
        .then(response => {
          this.getSourceDocuments()
        },
        error => {
          this.$toastr.error(
            error.body && error.body.message
              ? error.body.message
              : 'Error while uploading the document.',
          );
        })
        this.$refs['progress-modal'].hide()
        document.getElementById("myfile").value = null;
            },
        uploadFailed() {
          this.$toastr.error('Error while uploading the document.')
        },
        downloadDocument(id) {
          if (!this.canSiteDataLockAccess) {
              this.$api.getDownloadUrlFact(this.studyId, this.participantId, this.responseId, id, this.participantInfo.siteId)
          .then(response => {
            this.downloadUrl = response.body.preSignedUrl
            window.open(this.downloadUrl, "_blank")
          },
          error => {
            this.$toastr.error(
              error.body && error.body.message
                ? error.body.message
                : 'Error while downloading the document.',
            );
          })
          } else {
            toastr.warning('Access restricted');
          }        
        },
        deleteDocument(id) {
          if (!this.canSiteDataLockAccess) {
                swal({
            title:
              'Are you sure you want to delete the document?',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#b8c7ce',
            cancelButtonColor: '#34537d',
            confirmButtonText: 'Cancel',
            cancelButtonText: 'Yes',
          }).then(({ dismiss }) => {
            if (dismiss === 'cancel') {
            this.$api.deleteDocumentFact(this.studyId, this.participantId, this.responseId, id, this.participantInfo.siteId)
            .then(response => {
              this.getSourceDocuments()
            },
            error => {
              this.$toastr.error(
                error.body && error.body.message
                  ? error.body.message
                  : 'Error while deleting the document.',
              );
            })
            }
          }); 
         } else {
            toastr.warning('Access restricted');
        }        
        },
        cancelUpload(){
          this.xmlHTTP.abort()
          this.$refs['progress-modal'].hide()
          document.getElementById("myfile").value = null;
        },
        closeUploadModal() {
        this.$refs['upload-modal'].hide()
        }
  }
};
</script>
<style lang="scss" scoped>
.add-document {
  padding: 20px;
  color: #4c8ce4;
  font-weight: bold;
}

.progress {
  width: 400px;
  margin: 0 auto;
  height: 5px!important;
}

.download {
  color: #4c8ce4!important;
}

.delete {
  color: #f16559!important;
}

.upload-modal {
  padding: 40px;
  font-weight: bold;
}

.understand-button {
  background-color: #4c8ce4!important;
  padding: 10px 80px;
  color: #ffffff!important;
  border-radius: 100px;
  font-weight: normal!important;
}

.plus-sign {
  width: 17px;
  height: 17px;
  border-radius: 100px;
  background-color: #4c8ce4;
  color: #ffffff;
  text-align: center;
  margin-right: 5px;
  position: relative;
  top: 2px;
  cursor: pointer;
}

.plus {
  position: relative;
  bottom: 2.5px;
}

.progress-modal {
  padding: 20px;
}

.upload-file {
  font-size: 17px;
  font-weight: bold;
  margin-bottom: 30px;
}

.uploading-now {
  font-size:12px;
  padding-top: 10px;
  color: #666669;
}

progress::-webkit-progress-value {
  background: #4c8ce4!important;
}

.max-size {
  color: grey;
  font-size: 12px;
  font-weight: normal;
  margin: 3px 0 0 10px;
}

</style>
