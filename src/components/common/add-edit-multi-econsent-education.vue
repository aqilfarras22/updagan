<template>
  <div>
  <div class="edit_only_screen">
    <div class="row pt-10">
      <div class="col-lg-11 col-md-10 col-sm-9 col-xs-8 p-0">
        <div class="section_heading">Page Title</div>
        <div class="form-group">
          <input type="text" class="form-control input-md" v-model="selectedConsentSection.sectionTitle" placeholder="Enter page title"/>
        </div>
      </div>
      <!--<div>original: {{selectedConsentSection.sectionImage}}</div>-->
      <!--<div>temp: {{selectedConsentSection.sectionImageTemp}}</div>-->
      <div class="col-lg-1 col-md-2 col-sm-3 col-xs-4 p-0 pl-10">
        <div class="section_heading">Page Icon</div>
          <div class="form-group">
            <div class="image-upload" >
              <label for="info_image" >
                <i class="fa fa-picture-o" aria-hidden="true" v-if="!selectedConsentSection.sectionImage"></i>
                <img :src="selectedConsentSection.sectionImage" class="section_image disabled" v-if="selectedConsentSection.sectionImage" />
              </label>
              <!--<input id="file-input" type="file" />-->
              <input type="button" class="file-input" id="info_image" v-on:click="getIconLibrary(1)" data-toggle="modal" data-target="#iconModal"
                accept="image/png">
            </div>
          </div>
      </div>
    </div>
    <div class="section_heading">Page Content</div>
    <!--<quill-editor class="bg-white" ref="econsentRef" v-model="selectedConsentSection.sectionSummary" :options="editorOption">
      </quill-editor>-->
    <textarea class="form-control" rows="4" cols="126" v-model="selectedConsentSection.sectionSummary"></textarea>
    <div class="pt-20">
      <div class="section_heading">Additional Details
        <i class="fa fa-question-circle help_icon" aria-hidden="true" data-toggle="modal" data-target="#additionalDetailsModal"></i>
      </div>
      <quill-editor class="bg-white" @change="onEditorChange($event)" ref="econsentRef" v-model="selectedConsentSection.sectionHtmlContent" :options="editorOption">
      </quill-editor>
    </div>
    <div class="row pt-20">
      <div class="col-lg-9 col-md-9 col-sm-6 col-xs-2 p-0">
        <img src="/static/img/econsent/delete.svg" v-on:click="deleteConsentSection()" class="delete-btn">

      </div>
      <div class="col-lg-3 col-md-3 col-sm-6 col-xs-10 text-right p-0">
        <button class="cancel-btn" v-on:click="cancelConsentSection()">Cancel</button>
        <button class="save-btn" v-on:click="saveConsentSection()">Save</button>
      </div>
    </div>
    <div id="additionalDetailsModal" class="modal fade" role="dialog">
      <div class="modal-dialog">
        <!-- Modal content-->
        <div class="modal-content">
          <div class="modal-header border-none p-0">
            <button type="button" class="close close pr-25 pt-20" data-dismiss="modal">&times;</button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12 fs-12 pb-10 text_justify">
                <div>If you have additional content that is not absolutely vital for your participants to read, you may add it
                  here in the “Additional details” section. To your participants, this content will appear when they tap
                  “learn more.” </div>
                <div class="pt-10">
                  You should not be putting critical pieces of information in this section.
                </div>
              </div>
              <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
                <div class="text-center">
                  <img src="static/img/econsent/e-consent-example-1.png" alt="" class="img_size_icon">
                </div>
              </div>
              <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
                <div class="text-center">
                  <img src="static/img/econsent/e-consent-example-2.png" alt="" class="img_size_icon">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div id="iconModal" class="modal fade" role="dialog" data-backdrop="static">
    <div class="modal-dialog">
      <!-- Modal content-->
      <div class="modal-content pb-30 pr-30 pt-20 pl-30">
        <div class="row">
          <div class="fs-28 modal_header_color fw-200">Icon Library</div>
          <a class="cancelImage cursor_pointer" v-on:click="closeModal()"><i class="fa fa-times" aria-hidden="true"></i></a>
        </div>
        <p>Choose from any of these icons.</p>
        <div class="row">
          <div class="row pt-20">
            <div class="col-lg-3 col-md-3 col-sm-3 col-xs-3 pl-0 pr-0" v-for="(page, pageIndex) in iconLibrary" v-on:click="selectIcon(page)">
              <div class="library_img_bg" :class="{ selected_icon_logo_image: selectedIcon.name === page.name}">
                <img class="img-responsive icon" :src="page.preSignedURL">
              </div>
            </div>
          </div>
        </div>
        <div class="row text-center pt-20" v-if="totalPages > 1">
          <span class="paginate" v-on:click="getIconLibrary(currentPage - 1)"><i class="fa fa-chevron-left" aria-hidden="true"></i></span>
          <span class="paginate" :class="{active: currentPage === pageIndex + 1 }" v-for="(page, pageIndex) in totalPages" v-on:click="getIconLibrary(pageIndex + 1)">{{pageIndex + 1}}</span>
          <span class="paginate" v-on:click="getIconLibrary(currentPage + 1)"><i class="fa fa-chevron-right" aria-hidden="true"></i></span>
        </div>
        <div class="row text-center pt-20 pb-10">
          <button class="btn btn-md add_btn" v-on:click="addImage()" :disabled="!selectedIcon || !selectedIcon.name">Add</button>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import toastr from 'toastr';
import swal from 'sweetalert2';
import econsentData from '../../data/econsent.json';

export default {
  name: 'econsent',
  data() {
    return {
      consentTypes: econsentData,
      iconLibrary: [],
      totalPages: 1,
      selectedIcon: {},
      editorOption: {
        placeholder: 'Enter your study consent',
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            // [{ size: ['small', false, 'large', 'huge'] }],
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            [{ color: [] }, { background: [] }],
            // [{ font: [] }],
            [{ align: [] }],
            ['link', 'image', 'video'],
            ['clean'],
          ],
        },
      },
      imageTypeError: true,
      selectedConsentSection: this.options,
      appLangaScript: "window.initApplanga = function() {        if(typeof window.ApplangaNative !== 'undefined') {  window.ApplangaNative.loadScript();        } else { setTimeout(window.initApplanga, 180); }    }; window.initApplanga();",
    };
  },
  props: ['options'],
  mounted() {
    // window.scrollTo(0, 0);
    this.studyId = this.$route.params.studyId;
    console.log(this.selectedConsentSection.sectionHtmlContent);
    this.selectedConsentSection.sectionHtmlContent = this.selectedConsentSection.sectionHtmlContent.replace(this.appLangaScript,'');
  },
  methods: {
    onEditorChange(event) {
      var elem= document.createElement("div");
      elem.innerHTML = event.html;
      var images = elem.getElementsByTagName("img");
      this.imageTypeError = false;
      for(var i=0; i < images.length; i++){
        const [imageType, baseUrl] = images[i].src.split(';');
        const [str, type] = imageType.split('/');
        if(type.toLowerCase() != 'png') {
          this.imageTypeError = true;
          break;
        }
      }
    },
    addImage() {
      this.selectedConsentSection.sectionImage = this.selectedIcon.preSignedURL;
      window.$('#iconModal').modal('hide');
      this.$forceUpdate();
    },
    closeModal() {
      window.$('#iconModal').modal('hide');
    },
    selectIcon(page) {
      this.selectedIcon = {};
      this.selectedIcon = page;
    },
    getIconLibrary(pageNumber) {
      this.$api.getConsentIconsFact(pageNumber).then(
        response => {
          this.iconLibrary = response.body.icons;
          this.totalPages = response.body.totalPages;
          this.$forceUpdate();
        },
        error => {
          toastr.error(
            error.body && error.body.message
              ? error.body.message
              : 'Error while getting the information screens',
          ); // eslint-disable-line
        },
      );
    },
    saveConsentSection() {
      if (this.selectedConsentSection.sectionTitle && this.selectedConsentSection.sectionSummary) {
        // eslint-disable-line
        this.onEditorChange({html: this.selectedConsentSection.sectionHtmlContent});
        if (!this.selectedConsentSection.sectionImage) {
          toastr.error('Please upload an image also');
        } else if (this.imageTypeError) {
          toastr.error('Uploaded image format not supported. Please upload a PNG file.');
        } else {
          this.selectedConsentSection.opType = 'done';
          if (this.selectedConsentSection.sectionId) {
            this.$store.dispatch('addConsentSectionAction', null);
          }
          if (this.selectedIcon.name) {
            this.selectedConsentSection.sectionType = 'custom';
            this.selectedConsentSection.sectionImage = this.selectedIcon.name;
          }
          this.$store.dispatch('addConsentSectionAction', this.selectedConsentSection);
        }
      } else {
        toastr.error('Please fill all the fields');
      }
    },
    deleteConsentSection() {
      swal({
        title: 'Are you sure you want to delete?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#b8c7ce',
        cancelButtonColor: '#f16559',
        confirmButtonText: 'Cancel',
        cancelButtonText: 'Delete',
      }).then(({ dismiss }) => {
        if (dismiss === 'cancel') {
          this.$store.dispatch('addConsentSectionAction', null);
          this.selectedConsentSection.opType = 'delete';
          this.$store.dispatch('addConsentSectionAction', this.selectedConsentSection);
        }
      });
    },
    cancelConsentSection() {
      swal({
        title:
          'You have not saved your progress. Are you sure you want to leave? Your changes will not be saved. ',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#b8c7ce',
        cancelButtonColor: '#34537d',
        confirmButtonText: 'Cancel',
        cancelButtonText: 'Yes',
      }).then(({ dismiss }) => {
        if (dismiss === 'cancel') {
          this.$store.dispatch('addConsentSectionAction', { opType: 'none' });
        }
      });
    },
  },
};
</script>

<style scoped lang="scss">
// Style for quick fixes bootstrap after migration (before redesign should be removed)

body {
  color: #333;
  font-family:Lato-Regular;
}

.h2,
h2 {
  font-size: 30px;
  margin: 20px 0 10px;
}

.h3,
h3 {
  font-size: 24px;
  margin: 20px 0 10px;
}

.h4,
h4 {
  font-size: 18px;
  margin: 10px 0;
}

.h5,
h5 {
  font-size: 14px;
  margin: 10px 0;
}

.h6,
h6 {
  font-size: 12px;
  margin: 10px 0;
}

.btn {
  font-size: 14px;
}

.col-xs-12 {
  width: 100%;
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

.panel-default {
  border-color: #ddd;
}

.panel {
  margin-bottom: 20px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
}

.row {
  display: block;

  &:after {
    content: '';
    clear: both;
    display: block;
  }
}

.color_959fa4 {
  color: #959fa4 !important;
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
    max-width: 33.33333333%;
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

// END of style for quick fixes bootstrap after migration (before redesign should be removed)

.edit_only_screen {
  border: solid 1px #e4e8eb;
  background-color: #fff;
  padding: 20px 20px 20px 20px;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.1);
}
.form-control {
  border-radius: 2px;
}
.section_heading {
  font-weight: 500;
  font-size: 14px;
}
.consent_image {
  width: 100%;
  max-width: 40px;
  max-height: 32px;
}
.cancelImage {
  color: #959fa4;
  position: absolute;
  right: 20px;
  top: 20px;
  font-size: 24px;
}
.active {
  color: #4c8ce4;
  font-size: 14px;
  font-weight: bolder;
}
.disabled_input {
  background-color: #eee;
  opacity: 1 !important;
  cursor: not-allowed !important;
}
.add_btn {
  color: white;
  border-radius: 100px;
  background-color: #4c8ce4;
  padding: 10px 150px 10px 150px;
}
.image-upload {
  width: 100%;
  height: 34px;
  text-align: center;
  padding-top: 0px;
  border: 1px solid #ccc;
  background-color: #fff;
  border-radius: 2px;
  label {
    width: 100%;
    height: 100%;
  }
}
.image-upload > input {
  display: none;
}

.library_img_bg {
  display: -webkit-inline-box;
  background-color: #f5f8fa;
  border: solid 1px #d3dfe4;
  max-width: 200px;
  max-height: 80px;
  min-height: 70px;
  width: 98%;
  padding: 10px;
  .icon {
    max-width: 50px;
    max-height: 50px;
    margin: auto;
  }
}
.selected_icon_logo_image {
  background-color: #4c8ce4;
  img {
    -webkit-filter: brightness(0) invert(1);
    filter: brightness(0) invert(1);
  }
}

.section_image {
  width: 100%;
  height: 100%;
  max-width: 28px;
  max-height: 35px;
  padding-top: 2px;
}

.image-upload .fa {
  font-size: 22px;
  color: #888;
  padding-top: 5px;
  width: 100%;
  cursor: pointer;
  max-width: 100%;
  height: 32px;
}

.save_btn {
  width: 100px;
}

.img_size_icon {
  width: 170px;
}

.text_justify {
  text-align: justify;
}

.modal-dialog {
  max-width: 600px !important;
}

.cancel-btn{
        width: 100px;
        height: 30px;
        border-radius: 3px;
        background-color: #fff;
        font-family: Lato-Regular;
        font-size: 13px;
        font-weight: normal;
        font-style: normal;
        font-stretch: normal;
        line-height: normal;
        letter-spacing: normal;
        text-align: center;
        color: #1e8fe1;
        border:1px solid #1e8fe1;
        cursor: pointer;
}

.save-btn{
        width: 100px;
        height: 30px;
        border-radius: 3px;
        background-color: #1e8fe1;
        font-family: Lato-Regular;
        font-size: 13px;
        font-weight: normal;
        font-style: normal;
        font-stretch: normal;
        line-height: normal;
        letter-spacing: normal;
        text-align: center;
        color: #fff;
        border:1px solid #1e8fe1;
        cursor: pointer;
}
.delete-btn{
  cursor: pointer;
}

button:hover{
  opacity: 0.5;
}
</style>
