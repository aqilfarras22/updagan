<template>
    <div class="container">
        <div class="box">
            <div class='inner-box'>
                 <div class="new-privacy-policy" v-if="privacyPolicyOperationType==='toAdd'">
                    <div class="privacy-heading">Add Privacy Policy</div>                    
                </div>
                 <div class="edit-privacy-policy" v-if="privacyPolicyOperationType==='toEdit'">
                    <div class="privacy-heading">Edit Privacy Policy</div>
                </div>
              
                <div class="privacy-policy-editor">                    
                    <quill-editor class="bg-white" ref="privacyPolicyEditor" v-model="privacyPolicy" :options="editorOptionsFew">
                    </quill-editor>                    
                </div>
               
                <div class="delete-div">
                    <span class="delete-icon" v-on:click="deletePrivacyPolicy()"><img src="static/img/econsent/delete.svg"></span>
                    <div class="btn">
                        <button class="white-btn" v-on:click="cancelPrivacyPolicy()">Cancel</button>                        
                        <button v-if="privacyPolicyOperationType==='toEdit'" class="blue-btn" v-on:click="editPrivacyPolicy()">Save</button>                        
                        <button v-if="privacyPolicyOperationType==='toAdd'" class="blue-btn" v-on:click="addPrivacyPolicy()">Save</button>  
                    </div>
                </div>
            </div>
        </div>                
    </div>
</template>

<script>
import toastr from 'toastr';
import swal from 'sweetalert2';
import nprogress from 'nprogress';
import 'nprogress/nprogress.css';

export default {
  name: 'privacy-policy',
  data() {
    return {
      privacyPolicyOperationType: this.operationType,
      privacyPolicy: this.privacyPolicyData,
      editorOptionsFew: {
        placeholder: 'Enter your privacy policy',
        readOnly: false,
        modules: {
          toolbar: [['bold', 'italic', 'underline'], ['clean']],
        },
      },
      appLangaScript: "window.initApplanga = function() {        if(typeof window.ApplangaNative !== 'undefined') {  window.ApplangaNative.loadScript();        } else { setTimeout(window.initApplanga, 180); }    }; window.initApplanga();",
    };
  },

  props: ['operationType', 'privacyPolicyData'],
  mounted() {
    this.studyId = this.$route.params.studyId;
    this.privacyPolicy = this.privacyPolicyData.replace(this.appLangaScript,'');
  },
  methods: {
    deletePrivacyPolicy() {
      swal({
        title: 'Are you sure you want to delete privacy policy?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#b8c7ce',
        cancelButtonColor: '#f16559',
        confirmButtonText: 'Cancel',
        cancelButtonText: 'Delete',
      }).then(({ dismiss }) => {
        if (dismiss === 'cancel') {
          nprogress.start();
          this.$api.deletePrivacyFact(this.studyId, null).then(
            () => {
              toastr.success('Privacy Policy deleted successfully');
              this.$emit('delete');
              nprogress.done();
            },
            error => {
              toastr.error(
                error.body ? error.body.message : 'Error while deleting the data',
              );
              nprogress.done();
            },
          );
        }
      });
    },
    cancelPrivacyPolicy() {
      this.$emit('cancel');
    },
    editPrivacyPolicy() {
      const privacyPolicy = this.privacyPolicy; // eslint-disable-line

      if (privacyPolicy == '') { // eslint-disable-line
        toastr.error('Please add Privacy Policy.');
      } else {
        nprogress.start();
        this.$api.updatePrivacyFact(this.studyId, { privacyPolicy }).then(
          () => {
            toastr.success('Privacy Policy saved successfully');
            this.$emit('save');
            nprogress.done();
          },
          error => {
            toastr.error(
              error.body ? error.body.message : 'Error while updating the data',
            );
            nprogress.done();
          },
        );
      }
    },
    addPrivacyPolicy() {
      const privacyPolicy = this.privacyPolicy; // eslint-disable-line

      if (privacyPolicy == '') { // eslint-disable-line
        toastr.error('Please add Privacy Policy.');
      } else {
        nprogress.start();
        this.$api.addPrivacyFactV2(this.studyId, { privacyPolicy }).then(
          () => {
            toastr.success('Privacy Policy saved successfully');
            this.$emit('save');
            nprogress.done();
          },
          error => {
            toastr.error(
              error.body ? error.body.message : 'Error while adding the data',
            );
            nprogress.done();
          },
        );
      }
    },
  },
};
</script>
<style scoped lang="scss">
.privacy-heading{
    font-family: Lato-Regular;
    font-size: 34px;
    font-weight: bold;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.21;
    letter-spacing: normal;
    color: #2d3752;
}

.privacy-policy-editor{
    margin-top: 20px;

    .text-area{
        height: 100px;
    }
}

.delete-div{
  margin-bottom: 20px;
  vertical-align: middle;
  margin-top: 20px;
  line-height: 40px;

  .delete-icon{
    cursor: pointer;
  }

  .btn{
    float: right;
    margin: 0;
    padding: 0;
    cursor: pointer;

    button{
      outline: none;
      &.white-btn{
          width: 100px;
          height: 36px;
          border-radius: 3px;
          font-family: Lato-Regular;
          font-size: 16px;
          font-weight: normal;
          font-style: normal;
          font-stretch: normal;
          letter-spacing: normal;
          text-align: center;
          color: #1e8fe1;    
          border: solid 1px #1e8fe1;
          background-color: #ffffff;
      }

      &.blue-btn{
          width: 100px;
          height: 36px;
          border-radius: 3px;
          font-family: Lato-Regular;
          font-size: 16px;
          font-weight: normal;
          font-style: normal;
          font-stretch: normal;          
          letter-spacing: normal;
          text-align: center;
          color: #ffffff;    
          border: solid 1px #1e8fe1;
          background-color: #1e8fe1;
      }
    }
  }
}
</style>

<style scoped lang="scss" src="./styles/add-edit-multi-consent.scss"></style>


