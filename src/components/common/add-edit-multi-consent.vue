<template>

    <!--Edit Consent Window-->
       <div class="container">
           <div class="new-consent" v-if="consentData.opType==='toAdd'">
                <div class="heading">Create an consent or agreement</div>
                <div class="sub-heading">A consent or agreement consists of: education, comprehension, and documentation.</div>
            </div>

            <div class="edit-consent" v-if="consentData.opType==='toEdit'">
                <div class="heading">Editing "{{consentData.consentData[0].consentName}}"</div>
            </div>

            <div class="box">
                <div class='inner-box'>
                    <div class="heading" v-on:click="consentBox.box1=!consentBox.box1" v-bind:class="{headingactive: consentBox.box1}">
                        <img v-if="consentBox.box1" src="/static/img/econsent/collapse.svg">
                        <img v-if="!consentBox.box1" src="/static/img/econsent/expand.svg">
                        <span>Consent Name</span>
                    </div>

                    <div class='content-box' v-if="consentBox.box1">
                        <div class="input-field">
                            <input maxlength="255" type="text" v-if="consentData.consentName!=''" v-model="consentData.consentData[0].consentName" placeholder="Enter Consent Name">
                            <input maxlength="255" type="text" v-else placeholder="Enter Consent Name" v-model="new_consent_name">
                        </div>
                        <div class="btn"><button v-on:click="addConsent()">Continue</button></div>
                    </div>
                </div>
                <div class="inner-box-divider"></div>

                <div class='inner-box'>
                    <div class="heading" v-on:click="consentBox.box2=!consentBox.box2" v-bind:class="{headingactive: consentBox.box2}">
                        <img v-if="consentBox.box2" src="/static/img/econsent/collapse.svg">
                        <img v-if="!consentBox.box2" src="/static/img/econsent/expand.svg">
                        <span>Education</span>
                    </div>

                    <div class='content-box' v-if="consentBox.box2">
                        <h2>Box2</h2>
                    </div>
                </div>
                <div class="inner-box-divider"></div>

                <div class='inner-box'>
                    <div class="heading" v-on:click="consentBox.box3=!consentBox.box3" v-bind:class="{headingactive: consentBox.box3}">
                        <img v-if="consentBox.box3" src="/static/img/econsent/collapse.svg">
                        <img v-if="!consentBox.box3" src="/static/img/econsent/expand.svg">
                        <span>Comprehension</span>
                    </div>

                    <div class='content-box' v-if="consentBox.box3">
                        <h2>Box3</h2>
                    </div>
                </div>
                <div class="inner-box-divider"></div>

                <div class='inner-box'>
                    <div class="heading" v-on:click="consentBox.box4=!consentBox.box4" v-bind:class="{headingactive: consentBox.box4}">
                        <img v-if="consentBox.box4" src="/static/img/econsent/collapse.svg">
                        <img v-if="!consentBox.box4" src="/static/img/econsent/expand.svg">
                        <span>Document & signature</span>
                    </div>

                    <div class='content-box' v-if="consentBox.box4">
                        <h2>Box4</h2>
                    </div>
                </div>                
            </div>
        
</div>



</template>

<script>
import nprogress from 'nprogress';
import 'nprogress/nprogress.css';
import toastr from 'toastr';
import swal from 'sweetalert2';
import econsentData from '../../data/econsent.json';

export default {
  name: 'econsent',
  data() {
    return {
      consentBox: {
        box1: true,
        box2: false,
        box3: false,
        box4: false,
      },
      new_consent_name: '',
      consentData: [],
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
      consentData: this.options, // eslint-disable-line
    };
  },
  props: ['options'],
  mounted() {
    window.scrollTo(0, 0);
    this.studyId = this.$route.params.studyId;
  },
  methods: {
    addConsent() {
      const consentName = this.new_consent_name;

      if (consentName === '') {
        toastr.error('Please add consent name.');
      } else {
        nprogress.start();
        this.$api.addNewConsent(this.studyId, consentName).then(
          () => {
            nprogress.done();
          },
          error => {
            toastr.error(
              error.body && error.body.message
                ? error.body.message
                : 'Error while adding the new consent.',
                ); // eslint-disable-line
            nprogress.done();
          },
        );
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
      nprogress.start();
      this.$api.getConsentIconsFact(pageNumber).then(
        response => {
          this.iconLibrary = response.body.icons;
          this.totalPages = response.body.totalPages;
          this.$forceUpdate();
          nprogress.done();
        },
        error => {
          toastr.error(
            error.body && error.body.message
              ? error.body.message
              : 'Error while getting the information screens',
          ); // eslint-disable-line
          nprogress.done();
        },
      );
    },
    saveConsentSection() {
      if (this.selectedConsentSection.sectionTitle && this.selectedConsentSection.sectionSummary) {
        // eslint-disable-line
        if (!this.selectedConsentSection.sectionImage) {
          toastr.error('Please upload an image');
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
        toastr.error('Please populate all the fields');
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
  border: solid 1px #d3dfe4;
  background-color: #f5f8fa;
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
</style>

<style scoped lang="scss">
.main_div_editing{
    font-family:Lato-Regular;
    border-radius: 4px;
    background-color: #ffffff;
    border:none;
    margin-top: 20px;
    margin-left: 20px;
    margin-right: 20px;
    padding: 20px;

    .consent-agreement-sub-div0, .consent-agreement-sub-div1, .consent-agreement-sub-div2, .consent-agreement-sub-div0{
        margin-left:35px;
    }
}

.main_div{        
    font-family:Lato-Regular;
    border-radius: 4px;
    background-color: #ffffff;
    border: solid 1px #e4e8eb;
    margin-top: 20px;
    margin-left: 20px;
    margin-right: 20px;
    padding: 20px;
}

.extra_top_margin{
    margin-top:40px;
}

.new_design_consent_agreement_h1 {  
    font-family:Lato-Regular;
    font-size: 34px;
    font-weight: bold;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.21;
    letter-spacing: normal;
    color: #2d3752;
}

.new_design_consent_agreement_div{
    font-family:Lato-Regular;
    font-size: 17px;
    font-weight: bold;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.29;
    letter-spacing: normal;
    color: #4a4a4a;
    margin-top: 4px;
}

.new_design_consent_agreement_btn {
    font-family:Lato-Regular;
    width: 190px;
    height: 30px;
     border-radius: 4px;
    background-color: #ffffff;
    border: solid 1px #1e8fe1;
    font-size: 13px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: normal;
    text-align: center;
    color: #1e8fe1;
    margin-top: 20px;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
}

.new_design_consent_agreement_divider {  
    font-family:Lato-Regular;
    height: 1px;
    background-color: #e4e8eb;
    margin-top: 30px;
    margin-bottom: 20px;
}

.new_design_consent_agreement_text {  
    font-family:Lato-Regular;
    font-size: 15px;
    font-weight: bold;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.33;
    letter-spacing: normal;
    color: #9b9b9b;
    padding-bottom: 7px;
}

.default_cohort{
    font-family:Lato-Regular;
  font-size: 17px;
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.29;
  letter-spacing: normal;
  color: #4a4a4a;
}

.legal_text{
    font-family:Lato-Regular;
  font-size: 17px;
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.29;
  letter-spacing: normal;
  color: #4a4a4a;
  padding-top:28px;
}

.legal_divider {  
    height: 1px;
    background-color: #e4e8eb;
    margin-top: 10px;
    margin-bottom: 25px;
}

.legal_extra_bottom_padding{
    padding-bottom:26px;
}

.pl-20{
    padding-top:50px;
}

.second{
 padding-top:28px;
}

.cohort_div_lr{
    width:100%;
   

    .left_part{
        width:50%;
        float: left;
    }

    .right_part{
        width:50%;
        float:right;
        text-align: right;

        .view{
            font-family: Lato-Regular;
            font-size: 13px;
            font-weight: bold;
            font-style: normal;
            font-stretch: normal;
            line-height: normal;
            letter-spacing: normal;
            text-align: right;
            color: #1e8fe1;
        }

        span img{
            margin-left:30px;
        }

        .select_consents_btn{
                width: 120px;
                height: 30px;
                border-radius: 4px;
                background-color: #1e8fe1;
                border: solid 2px #1e8fe1;
                font-family:Lato-Regular;
                font-size: 13px;
                font-weight: normal;
                font-style: normal;
                font-stretch: normal;
                line-height: normal;
                letter-spacing: normal;
                text-align: center;
                color: #fff;
                margin-top: -5px;
                -webkit-box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
                box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
        }
    }
        .clearfix {
        clear:both;
    }   
}

.add_privacy_policy{
    width: 140px;
    height: 30px;
     border-radius: 4px;
    background-color: #ffffff;
    border: solid 1px #1e8fe1;
    font-family:Lato-Regular;
    font-size: 13px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: normal;
    text-align: center;
    color: #1e8fe1;
    margin-top: -5px;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
}

.consent-agreement-sub-div{
  border-radius: 4px;
  background-color: #ffffff;
  border: solid 1px #e4e8eb;
  margin-top:20px;
  padding-left:20px;
  padding-right:20px;
}

.consent-agreement-sub-div-btn{
    display:block;
    font-family:Lato-Regular;
    font-size: 20px;
    font-weight: bold;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.4;
    letter-spacing: normal;
    color: #2d3752;
    padding-top:20px;
    
    img{
        padding-right:10px;
        display:inline-block;
        margin:auto;
    }
}

.consent-agreement-sub-div-divider {
  height: 1px;
  background-color: #e4e8eb;
  margin-top:15px;
}

.consent-agreement-sub-div0{
    padding-left: 30px;

    .input-field{
        input{
            padding: 10px;
            height: 40px;
            border-radius: 3px;
            background-color: #ffffff;
            border: solid 1px #e4e8eb;
            padding-left: 11.5px;
            margin-top: 5px;
        }
    }

    .btn{
        padding-top: 20px;
        padding-left:0px;

        button{
            width: 100px;
            height: 36px;
            border-radius: 4px;
            border: solid 2px #ffffff;
            background: #1e8fe1;
            color: #fff;
            cursor:pointer;
        }
    }
}

.consent-agreement-sub-div1{
    padding-left:30px;

    .inside-div {
        border-radius: 3px;
        background-color: #f5f6f7;
        border: solid 1px #e4e8eb;
        margin: 10px 0;

        .img{
            float:left;
            width:auto;
            margin:25px 10px;
        }

        .heading{
                float: left;
                width: 80%;
                margin-top: 15px;
                display: block;
                font-family: Lato-Regular;
                font-size: 15px;
                font-weight: bold;
                font-style: normal;
                font-stretch: normal;
                line-height: 1.33;
                letter-spacing: normal;
                color: #4a4a4a;
                margin-bottom: 15px;

            .content{
            display:block;
            font-family:Lato-Regular;
            font-size: 15px;
            font-weight: normal;
            font-style: normal;
            font-stretch: normal;
            line-height: 1.33;
            letter-spacing: normal;
            color: #4a4a4a;   
            }
        }

        .btn{
            float:right;
            width:auto;
            margin:20px 20px 20px 0px;
            padding:0px;

            .edit-btn{
            border-radius: 4px;
            background-color: #f5f6f7;
            border: solid 1px #1e8fe1;
            width: 70px;
            }
        }

        .cleafix{
            clear:both;
        }
    }

    .add-another-screen-btn{
        margin-top:20px;

        button{
            width: 150px;
            height: 30px;
            border-radius: 4px;
            background-color: #fff;
            border: solid 1px #1e8fe1;
            color:#1e8fe1;
            cursor:pointer;
        }
    }

    .continue-btn{
        margin-top:40px;
        margin-bottom:30px;

        button{
            width: 100px;
            height: 36px;
            border-radius: 4px;
            background-color: #1e8fe1;
            border: solid 2px #fff;
            color:#fff;              
            cursor:pointer;          
        }
    }
}

.consent-agreement-bottom-div{

        margin-top:45px;
        margin-bottom:30px;
        
        .delete-btn{
            float:left;

        }

        .right-part{
            float:right;

            .save-btn{    
                display: inline-block;        

                button{
                    width: 100px;
                    height: 36px;
                    border-radius: 4px;
                    border: solid 1px #ffffff;
                    background:#1e8fe1;
                    color:#fff;
                    cursor:pointer;
                }
            }

            .cancel-btn{
                 display: inline-block;      

                button{
                    width: 100px;
                    height: 36px;                    
                    border-radius: 4px;
                    background-color: #ffffff;
                    border: solid 1px #4a4a4a;
                    cursor:pointer;
                }
            }
        }
        

        

        .clear-fix{
            clear:both;
        }
    }

.consent-agreement-sub-div2{
    padding-left:30px;

    .text{
        font-family:Lato-Regular;
        font-size: 15px;
        font-weight: normal;
        font-style: normal;
        font-stretch: normal;
        line-height: 1.33;
        letter-spacing: normal;
        color: #4a4a4a;
    }

    .add-a-question-btn{
        margin-top:20px;

        button{
            width: 150px;
            height: 30px;
            border-radius: 4px;
            background-color: #fff;
            border: solid 1px #1e8fe1;
            color:#1e8fe1;
            cursor:pointer;
        }
    }
    
    .continue-btn{
        margin-top:30px;
        button{
            width: 100px;
            height: 36px;
            border-radius: 4px;
            border: solid 2px #ffffff;
            background:#1e8fe1;
            color:#fff;
            cursor:pointer;
        }
    }
}    

.consent-agreement-sub-div3{
    padding-left:30px;

    .field1-title{
        margin-top:6px;
        font-weight: bold;
        font-style: normal;
        font-stretch: normal;
        line-height: 1.29;
        letter-spacing: normal;
        color: #4a4a4a;
        font-family:Lato-Regular;
        font-size: 17px;
    }

    .field1-input{
        margin-top:10px;

        input[type="text"]{
            width: 450px;
            height: 40px;
            border-radius: 3px;
            background-color: #ffffff;
            border: solid 1px #e4e8eb;
            padding-left:11.5px;
        }

        input[type="text"]::placeholder{
            font-family:Lato-Regular;
            font-size: 15px;
            font-weight: normal;
            font-style: normal;
            font-stretch: normal;
            line-height: 1.33;
            letter-spacing: normal;
            color: #9b9b9b;            
            padding-top:11px;
        }
    }

    .field2-title{
        font-family:Lato-Regular;
        margin-top:30px;
        font-size: 17px;
        font-weight: bold;
        font-style: normal;
        font-stretch: normal;
        line-height: 1.29;
        letter-spacing: normal;
        color: #4a4a4a;
    }

    .field2-input{
        margin-top:10px;

        textarea{
            width: 100%;
            height: 100px;
            border-radius: 3px;
            background-color: #ffffff;
            border: solid 1px #e4e8eb;
            padding-left:11.5px;
            padding-top:10px;
        }

        textarea::placeholder{
            font-family:Lato-Regular;
            font-size: 15px;
            font-weight: normal;
            font-style: normal;
            font-stretch: normal;
            line-height: 1.33;
            letter-spacing: normal;
            color: #9b9b9b;  
        }
    }

    .field3-title{
        margin-top:30px;
        font-weight: bold;
        font-style: normal;
        font-stretch: normal;
        line-height: 1.29;
        letter-spacing: normal;
        color: #4a4a4a;
        font-family:Lato-Regular;
        font-size: 17px;

        span{
            font-family:Lato-Regular;
            font-size: 15px;
            font-weight: normal;
            font-style: normal;
            font-stretch: normal;
            line-height: 1.33;
            letter-spacing: normal;
            color: #4a4a4a;
            display: block;
        }
    }

    .field3-upload-btn{
        margin-top:10px;

        button{            
            border-radius: 4px;
            background-color: #ffffff;
            border: solid 1px #1e8fe1;
            width: 100px;
            height: 30px;
            color:#1e8fe1;
            cursor:pointer;
        }

        input [type="file"]:after{
            content:'';
        }
    }

    .field4-title{
        margin-top:30px;
        font-family:Lato-Regular;
        font-size: 17px;
        font-weight: bold;
        font-style: normal;
        font-stretch: normal;
        line-height: 1.29;
        letter-spacing: normal;
        color: #4a4a4a;
    }

    .field4-input{
        margin-top:10px;

        .checkbox{
            vertical-align: middle;
            width: 18px;
            height: 18px;
            background-image:url('/static/img/econsent/empty.svg')
        }

        .checkbox:nth-child(3){
            margin-left:93px;
        }

        .checkbox-text{
            font-family:Lato-Regular;
             font-size: 15px;
            font-weight: normal;
            font-style: normal;
            font-stretch: normal;
            line-height: 1.33;
            letter-spacing: normal;
            color: #4a4a4a;
            padding-left: 10px;
        }
    }
}

.show-consents{

    div{        

        .left-part{
            float:left;

            .title{
                font-family:Lato-Regular;
                font-size: 17px;
                font-weight: bold;
                font-style: normal;
                font-stretch: normal;
                line-height: 1.29;
                letter-spacing: normal;
                color: #4a4a4a;
            }
        }

        .right-part{
            float: right;

            .edit, .icon{
                display: inline-block;
            }

            .edit{
                font-family:Lato-Regular;
                font-size: 13px;
                font-weight: bold;
                font-style: normal;
                font-stretch: normal;
                line-height: normal;
                letter-spacing: normal;
                text-align: right;
                color: #1e8fe1;
            }

            .icon{
                padding-left:30px;
            }
        }
    }

    .clearfix{
        margin-bottom:20px;
        clear:both;
    }
}

.add-a-cohort{
    .title{
        margin-top:20px;
        font-family:Lato-Regular;
        font-size: 17px;
        font-weight: bold;
        font-style: normal;
        font-stretch: normal;
        line-height: 1.29;
        letter-spacing: normal;
        color: #4a4a4a;
    }

    .input-field{
        margin-top:10px;

        input[type="text"]{
            width: 500px;
            height: 40px;
            border-radius: 3px;
            background-color: #ffffff;
            border: solid 1px #e4e8eb;            
            padding-left:11.5px;
        }

        input[type="text"]::placeholder{
            font-family:Lato-Regular;
            font-size: 15px;
            font-weight: normal;
            font-style: normal;
            font-stretch: normal;
            line-height: 1.33;
            letter-spacing: normal;
            color: #9b9b9b;
            padding-top:11px;
        }

        .error-msg{
            padding-left:20px;
            font-family:Lato-Regular;
            font-size: 15px;
            font-weight: bold;
            font-style: normal;
            font-stretch: normal;
            line-height: 1.33;
            letter-spacing: normal;
            color: #e67d23;
        }
    }

    .btn{
        padding:0px;
        margin-top:20px;

        .cancel-btn{
            width: 100px;
            height: 36px;
            border-radius: 3px;
            background-color: #e3e3e3;
            border: 1px solid #e3e3e3;
            background: #fff;
        }

        .save-btn{
            font-family:Lato-Regular;
            width: 100px;
            height: 36px;
            border-radius: 3px;
            background-color: #1e8fe1;
            border: 1px solid #e3e3e3;
            background: #1e8fe1;
            color:#fff;
        }
    }
}

.show_cohorts{
    margin-top:20px;

    .cohort-div{
        margin-bottom:10px;
        margin-top:25px;

        .left-part{
            float:left;
            width:50%;  
            
            .notActive{
                opacity: 0.5;
            }
            
            .title{
                font-family:Lato-Regular;
                font-size: 17px;
                font-weight: bold;
                font-style: normal;
                font-stretch: normal;
                line-height: 1.29;
                letter-spacing: normal;
                color: #4a4a4a;
            }

            li{
                display: inline-block;
                font-family:Lato-Regular;
                font-size: 15px;
                font-weight: normal;
                font-style: normal;
                font-stretch: normal;
                line-height: 1.33;
                letter-spacing: normal;
                color: #4a4a4a;
                padding-top:5px;
            }

            li:not(:last-child):after{
                content: ">";
                padding:0 10px;
            }

            .existing-consent{
                font-size: 15px;
                font-weight: normal;
                font-style: normal;
                font-stretch: normal;
                line-height: 1.33;
                letter-spacing: normal;
                color: #4a4a4a;
                padding-top:4px;

                .separator{
                    padding-left:10px;
                    padding-right:10px;
                    width:12px;
                    height:12px;
                    font-weight: bold;
                }
            }
        }

        .right-part{
            float:right;

            .btn, .img, .edit, .icon{
                display: inline-block;
            }

            .edit{
                padding:0px;
                margin-right:30px;
                font-family: Lato-Regular;
                font-size: 13px;
                font-weight: bold;
                font-style: normal;
                font-stretch: normal;
                line-height: normal;
                letter-spacing: normal;
                text-align: right;
                color: #1e8fe1;
            }

            .btn{
                padding:0px;
                margin-right:30px;

                button{
                    width: 120px;
                    height: 30px;
                    border-radius: 4px;
                    border: solid 2px #ffffff;
                    background:#1e8fe1;
                    color:#fff;
                    cursor:pointer;

                    .notActive{
                            opacity: 0.5;
                        }
                }

                button:disabled{
                    opacity: 0.5;
                    cursor:pointer;
                }
            }
        }

        .clearfix{
            clear: both;
        }
    }
}

.add-privacy-policy{
    margin:0 50px;

    .title{
        margin-top:23px;
        font-family: Lato-Regular;
        font-size: 34px;
        font-weight: bold;
        font-style: normal;
        font-stretch: normal;
        line-height: 1.21;
        letter-spacing: normal;
        color: #2d3752;
    }

    .input-field{
        margin-top:20px;

        .edit, .disabled{
            width: 1040px;
            height: 340px;
            border-radius: 3px;
            background-color: #ffffff;
            border: solid 1px #e4e8eb;
            overflow: hidden;
            font-family: Lato-Regular;
            font-size: 15px;
            font-weight: normal;
            font-style: normal;
            font-stretch: normal;
            line-height: 1.33;
            letter-spacing: normal;
            color: #4a4a4a;
            padding:10px;
        }

        .disabled{
            background-color: #f5f6f7;
        }

        textarea{
            width: 100%;
            height: 100px;
            border-radius: 3px;
            background-color: #ffffff;
            border: solid 1px #e4e8eb;
            padding-left:10px;
            padding-top:10px;
        }

        textarea::placeholder{
            font-family: Lato-Regular;
            font-size: 15px;
            font-weight: normal;
            font-style: normal;
            font-stretch: normal;
            line-height: 1.33;
            letter-spacing: normal;
            color: #9b9b9b;
        }
    }

    .footer{

        margin-top:40px;

        .left-part{
            float:left;

            img{
                vertical-align: middle;
            }
        }

        .right-part{
            float:right;

            .save-button{
                font-family: Lato-Regular;
                width: 100px;
                height: 36px;
                border-radius: 4px;
                border: solid 2px #ffffff;
                color:#fff;
                background:#1e8fe1;
                margin-left:10px;
                cursor:pointer;
            }

            .cancel-button{
                font-family: Lato-Regular;
                width: 100px;
                height: 36px;
                border-radius: 4px;
                border: solid 2px #4a4a4a;
                color:#4a4a4a;
                background:#fff;
                cursor:pointer;
            }
        }

        .clearfix{
            clear: both;
        }
    }
}

.show-cohorts-div{
    border-radius: 4px;
    background-color: #ffffff;
    border: solid 1px #e4e8eb;
    margin:24px 0px;

    .inside{
        padding:20px;

        .title{
            font-size: 17px;
            font-weight: bold;
            font-style: normal;
            font-stretch: normal;
            line-height: 1.29;
            letter-spacing: normal;
            color: #4a4a4a;

            .edit-icon{
                padding-left:10px;
            }
        }

        

        .text1{
            font-size: 15px;
            font-weight: bold;
            font-style: normal;
            font-stretch: normal;
            line-height: 1.33;
            letter-spacing: normal;
            color: #9b9b9b;
            padding-top:20px;
        }

        .text2{
            padding-top:20px;
            font-size: 15px;
            font-weight: normal;
            font-style: normal;
            font-stretch: normal;
            line-height: 1.33;
            letter-spacing: normal;
            color: #4a4a4a;
        }

        .line{
            height: 1px;
            background-color: #e4e8eb;
            margin-top:20px;
        }

        .options{
            padding-top:10px;

            img{
                padding-right: 10px;
            }
           div{
                padding-top:10px;
                font-size: 15px;
                font-weight: normal;
                font-style: normal;
                font-stretch: normal;
                line-height: 1.33;
                letter-spacing: normal;
                color: #4a4a4a;
            }
        }

        .options-edit{
            padding-top:10px;

            img{
                padding: 12px 10px;
            }

            div{
                width: 100%;
                height: 40px;
                border-radius: 4px;
                background-color: #ffffff;
                border: solid 1px #e4e8eb;
                margin-top:10px;
                font-size: 15px;
                font-weight: normal;
                font-style: normal;
                font-stretch: normal;
                line-height: 1.33;
                letter-spacing: normal;
                color: #4a4a4a;
            }
        }
        

        .buttons{
            padding-top:30px;

            .left-part{
                width:auto;
                float: left;
                padding-top: 10px;
            }

            .right-part{
                float: right;

                .cancel{
                    width: 100px;
                    height: 36px;
                    border-radius: 3px;
                    background:#fff;
                    color: #4a4a4a;
                    border:1px solid #4a4a4a;
                    padding-top:5px;
                }

                .save{
                    margin-left:10px;
                    width: 100px;
                    height: 36px;
                    border-radius: 3px;
                    background:#1e8fe1;
                    color: #fff;
                    padding-top:5px;
                    border:1px solid #1e8fe1;
                }
            }

            .cleafix{
                clear: both;
            }
        }
    }
}

.add-another-screen{
    border-radius: 3px;    
    border: solid 1px #e4e8eb;
    margin: 10px 0;
    padding:10px;

    .page-icon-field{
            padding: 8px 10px 10px 10px;
            height: 40px;
            border-radius: 3px;
            background-color: #ffffff;
            padding-left: 11.5px;
            width: 125px;
            background: #fff;
            border: solid 1px #e4e8eb;
            text-align: center;
            margin-top: 5px;

        input{
            display: none;
        }
    }

    .title, .page-icon, .content, .additional-details{
            font-family: Lato-Regular;
            font-size: 15px;
            font-weight: bold;
            font-style: normal;
            font-stretch: normal;
            line-height: 1.33;
            letter-spacing: normal;
            color: #4a4a4a;
            padding-top:10px;
        }
    
    .title-field input[type="text"]{
        width:100%;
    }

    .title-field input[type="text"], .page-icon-field input[type="text"]{
        padding: 10px;
        height: 40px;
        border-radius: 3px;
        background-color: #ffffff;
        border: solid 1px #e4e8eb;
        padding-left: 11.5px;
        margin-top: 5px;        
    }

    .content-field textarea, .additional-details-field textarea{
        height:100px;
        width:100%;
        margin-top: 5px; 
        border-radius: 3px;
        background-color: #ffffff;
        border: solid 1px #e4e8eb;
        padding-left: 11.5px;
    }

    .left-part{
        float:left;
        padding-right:10px;
        width:80%;
    }

    .bottom{
            width: 75%;
        }

    .right-part{
        float:right;

        .cancel-btn, .save-btn{
            display: inline-block;
        }

        .cancel-btn button{
            width: 100px;
            height: 36px;                    
            border-radius: 4px;
            background-color: #ffffff;
            border: solid 1px #4a4a4a;
        }

        .save-btn button{
            width: 100px;
            height: 36px;
            border-radius: 4px;
            border: solid 1px #ffffff;
            background:#1e8fe1;
            color:#fff;
        }
    }

    .clearfix{
        clear:both;
    }

}

.add-a-question{
    border-radius: 3px;    
    border: solid 1px #e4e8eb;
    margin: 10px 0;
    padding:10px;

    .bottom{
        margin-top:25px;

        .left-part{
            float:left;
            width: auto;            
        }

        .right-part{
            float:right;
            width:auto;

                .save-btn{    
                    display: inline-block;        

                    button{
                        width: 100px;
                        height: 36px;
                        border-radius: 4px;
                        border: solid 1px #ffffff;
                        background:#1e8fe1;
                        color:#fff;
                    }
                }

                .cancel-btn{
                    display: inline-block;      

                    button{
                        width: 100px;
                        height: 36px;                    
                        border-radius: 4px;
                        background-color: #ffffff;
                        border: solid 1px #4a4a4a;
                    }
                }            
        }

        .cleafix{
            clear: both;
        }
    }
    .question-type select{
        border-radius: 3px;    
        border: solid 1px #e4e8eb;
    }

    .question-label{        
        font-family: Lato-Regular;
        font-size: 15px;
        font-weight: bold;
        font-style: normal;
        font-stretch: normal;
        line-height: 1.33;
        letter-spacing: normal;
        color: #4a4a4a;
        padding-top: 10px;
    }
    
    .question-field {        

        input[type="text"]{
            padding: 10px;
            height: 40px;
            border-radius: 3px;
            background-color: #ffffff;
            border: solid 1px #e4e8eb;
            padding-left: 11.5px;
            margin-top: 5px;
            width: 100%;
        }
    }

    .answer-options{
        .answer-single-choice{
            font-family: Lato-Regular;
            font-size: 15px;
            font-weight: bold;
            font-style: normal;
            font-stretch: normal;
            line-height: 1.33;
            letter-spacing: normal;
            color: #4a4a4a;
            padding-top: 10px;
            .left-part{
                float:left;
                width:80%;
                .answer-input{
                    padding-top:5px;

                    input{
                        display: inline-block;
                    }

                    input[type="text"] {
                        padding: 10px;
                        height: 40px;
                        border-radius: 3px;
                        background-color: #ffffff;
                        border: solid 1px #e4e8eb;
                        padding-left: 11.5px;
                        margin-top: 5px;
                        width: 100%;
                    }
                }
            }
            .right-part{
                float:right;
                .right-answer{                                            
                    div{
                        height: 40px;
                        width: 100%;
                        margin:10px 10px;
                    }
                    input {                       
                            padding: 10px;
                            height: 15px;
                            border-radius: 3px;
                            background-color: #ffffff;
                            border: solid 1px #e4e8eb;
                            padding-left: 11.5px;
                            margin-top: 15px;
                            width: 100%;
                    }
                }
            }
            .clearfix{
                clear: both;
            }

            .add-another-answer{
                font-size:15px;
                padding-top:10px;
                font-weight: bold;
                color:#1e8fe1;
            }
        }
    }

    .answer-yes-no{
            font-family: Lato-Regular;
            font-size: 15px;
            font-weight: bold;
            font-style: normal;
            font-stretch: normal;
            line-height: 1.33;
            letter-spacing: normal;
            color: #4a4a4a;
            padding-top: 10px;
            .left-part{
                float:left;
                width:80%;
                .answer-input{
                    padding-top:5px;
                    input {
                        padding: 10px;
                        height: 40px;
                        border-radius: 3px;
                        background-color: #ffffff;
                        border: solid 1px #e4e8eb;
                        padding-left: 11.5px;
                        margin-top: 5px;
                        width: 100%;
                    }
                }
            }
            .right-part{
                float:right;
                .right-answer{
                    input {
                        padding: 10px;
                        height: 15px;
                        border-radius: 3px;
                        background-color: #ffffff;
                        border: solid 1px #e4e8eb;
                        padding-left: 11.5px;
                        margin-top: 5px;
                        width: 100%;
                        vertical-align: middle;
                    }
                }
            }
            .clearfix{
                clear: both;
            }
    }
}

.edit-cohort-name{

    input[type="text"]{
        width: 25%;
        height: 40px;
        border-radius: 4px;
        background-color: #ffffff;
        border: solid 1px #e4e8eb;
        margin-top: 10px;
        font-size: 15px;
        font-weight: normal;
        font-style: normal;
        font-stretch: normal;
        line-height: 1.33;
        letter-spacing: normal;
        color: #4a4a4a;
        padding-left: 10px;
    }

    button{
        margin-left: 10px;
        width: 100px;
        height: 36px;
        border-radius: 3px;
        background: #1e8fe1;
        color: #fff;
        padding-top: 5px;
        border: 1px solid #1e8fe1;
    }
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

.add-edit-quiz-card {    
    padding: 16px;
    margin-bottom: 20px;    
    display: block;
    border: 1px solid #ccc;
    border-radius: 4px;
}

.add-another-screen-btn{
  margin-top:20px;
  width: 150px;
    height: 30px;
    border-radius: 4px;
    background-color: #fff;
    border: solid 1px #1e8fe1;
    color:#1e8fe1;
    cursor:pointer;
}

.file-upload{
    border-radius: 4px;
    background-color: #ffffff;
    border: solid 1px #1e8fe1;
    width: 0px;
    height: 30px;
    color: #1e8fe1;
    cursor: pointer;
}

.file-upload input.file-input{
    border-radius: 4px;
    background-color: #ffffff;
    border: solid 1px #1e8fe1;
    width: 100px;
    height: 30px;
    color: #1e8fe1;
    cursor: pointer;
}

.upload-btn{
    border-radius: 4px;
    background-color: #ffffff;
    border: solid 1px #1e8fe1;
    width: 100px;
    height: 30px;
    color: #1e8fe1;
    cursor: pointer;
    margin-left:-285px
}

</style>

<style scoped lang="scss" src="./styles/add-edit-multi-consent.scss"></style>


