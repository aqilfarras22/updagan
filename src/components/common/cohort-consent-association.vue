<template>
  <!--Edit Consent Window-->
  <div class="container">
    <div class="box association-box">
      <div class="inner-box association-inner-box" v-if="cohortEdit">
        <div class="heading association-heading">{{currentCohort.cohortName}}</div>
        <span class="association-edit-icon" v-on:click="startEditing()">
          <img src="static/img/econsent/edit.svg">
        </span>
      </div>
      <div class="content-box" v-else>
        <div class="cohort-input-field">
          <input
            type="text"
            v-if="cohort.cohortName!=''"
            v-model="cohort.cohortName"
            placeholder="eg. An Adult (18+ y/o) registering for the study"
          >
          <input
            type="text"
            v-else
            placeholder="eg. An Adult (18+ y/o) registering for the study"
            v-model="new_cohort_name"
          >
        </div>
        <div class="btn">
          <button class="white-btn" v-on:click="cancel()">Cancel</button>
          <button class="blue-btn" v-on:click="editCohort(currentCohort)">Save</button>
        </div>
      </div>
      <div v-if="associatedConsents.length > 0">
        <span
          class="associatef-info"
        >Set the order you would like the consents to be presented to participants.</span>
        <draggable
          v-model="associatedConsents"
          @start="drag=true"
          @end="drag=false"
          @change="onDragSections()"
        >
          <div
            class="associated-row"
            v-for="consent in associatedConsents"
            :key="consent.consentId"
          >
            <div class="icon-div">
              <span class="association-consent-icon">
                <img src="static/img/econsent/scrubber.svg">
              </span>
            </div>
            <div class="name-div">
              <span class="consent-name">{{consent.consentName}}</span>
            </div>
            <div class="icon-div-remove">
              <span
                class="association-consent-icon"
                v-on:click="removeAssociateConsent(consent,currentCohort)"
              >
                <img src="static/img/econsent/collapse_consent.svg">
              </span>
            </div>
            <div class="clearfix"></div>
          </div>
        </draggable>
        <div class="multiconsent-box2-divider"></div>

        <div
          v-if="defaultConsentsList.length > 0"
          v-for="defaultConsent in defaultConsentsList"
          :key="defaultConsent.consentId"
          class="available-consent-box"
        >
          <div class="icon-div">
            <span
              class="association-consent-icon"
              v-on:click="associateConsent(defaultConsent,currentCohort)"
            >
              <img src="static/img/econsent/expand.svg">
            </span>
          </div>
          <div class="name-div">
            <span class="consent-name">{{defaultConsent.consentName}}</span>
          </div>
          <div class="clearfix"></div>
        </div>
      </div>
      <div class="no-consent" v-else>No consents added
        <div class="multiconsent-box2-divider"></div>
        <div
          v-if="defaultConsentsList.length > 0"
          v-for="defaultConsent in defaultConsentsList"
          :key="defaultConsent.consentId"
          class="available-consent-box"
        >
          <div class="icon-div">
            <span
              class="association-consent-icon"
              v-on:click="associateConsent(defaultConsent,currentCohort)"
            >
              <img src="static/img/econsent/expand.svg">
            </span>
          </div>
          <div class="name-div">
            <span class="consent-name">{{defaultConsent.consentName}}</span>
          </div>
          <div class="clearfix"></div>
        </div>
      </div>
      <div class="delete-div">
        <span class="delete-icon" v-on:click="deleteCohort(currentCohort)">
          <img src="static/img/econsent/delete.svg">
        </span>
        <div class="btn">
          <button class="white-btn" v-on:click="cancelAssociationEditing()">Cancel</button>
          <button class="blue-btn" v-on:click="saveAssociateConsent(currentCohort)">Save</button>
        </div>
        <div class="clearfix"></div>
      </div>
    </div>
  </div>
  <!--End Edit Consent Window-->
</template>

<script>
import toastr from 'toastr';
import swal from 'sweetalert2';
import draggable from 'vuedraggable';
import nprogress from 'nprogress';
import 'nprogress/nprogress.css';

export default {
  name: 'cohort-consents',
  new_cohort_name: '',
  old_cohort_name: '',
  components: {
    draggable,
  },
  data() {
    return {
      isApiCalled: false,
      currentCohort: this.cohort,
      associatedConsents: [],
      defaultConsentsList: [],
      cohortEdit: true,
      associatedConsentIds: [],
      existingCohortList: [],
    };
  },
  computed: {
    draggableSection() {
      // //eslint-disable-line
      if (this.associatedConsents.length <= 0) {
        return false;
      }
      return true;

      return false; // eslint-disable-line
    },
  },
  props: ['cohort', 'consentsList', 'existingCohort'],
  mounted() {
    this.studyId = this.$route.params.studyId;
    this.getExistingCohorts();
    this.getAssociatedConsent();
    this.removeduplicate();
  },
  methods: {
    removeduplicate() {},
    getExistingCohorts() {
      nprogress.start();
      this.$api.getExistingCohorts(this.studyId).then(
        response => {
          for (let i = 0; i < response.data.length; i++) {
            this.existingCohortList.push(response.data[i]);
          }
          nprogress.done();
        },
        error => {
          toastr.error(
            error.body && error.body.message
              ? error.body.message
              : 'Error while getting the study details',
          );
          nprogress.done();
        },
      );
    },
    deleteCohort(currentCohort) {
      this.$emit('deleteCohort', currentCohort);
    },
    onDragSections() {
      if (this.associatedConsentIds.length > 0) {
        this.associatedConsents.forEach((item, index) => { // eslint-disable-line
          this.associatedConsents[index].sortOrder = index + 1;
        });
        nprogress.start();
        this.$api
          .updateCohortConsenrOrderfact(
            this.studyId,
            this.currentCohort.cohortId,
            this.associatedConsents,
          )
          .then(
            () => {
              nprogress.done();
            },
            error => {
              toastr.error(
                error.body && error.body.message
                  ? error.body.message
                  : 'Error while saving the data',
              );
              nprogress.done();
            },
          );
      }
    },
    getDefaultConsents() {
      nprogress.start();
      this.$api.getExistingConsentData(this.studyId).then(
        response => {
          for (let i = 0; i < response.data.length; i++) {
            const id = response.data[i].consentId;
            const index = this.associatedConsentIds.indexOf(id);

            if (index < 0) {
              this.defaultConsentsList.push(response.data[i]);
            }
          }


          nprogress.done();
        },
        error => {
          toastr.error(
            error.body && error.body.message
              ? error.body.message
              : 'Error while getting the study details',
          );
          nprogress.done();
        },
      );
    },
    getAssociatedConsent() {
      const cohortId = this.currentCohort.cohortId; // eslint-disable-line
      nprogress.start();
      this.$api.getAssociatedConsentData(this.studyId, cohortId).then(
        response => {
          if (response.data != '') { // eslint-disable-line
            for (let i = 0; i < response.data.length; i++) {
              this.associatedConsents.push(response.data[i]);
              this.associatedConsentIds.push(response.data[i].consentId);
            }
          }
          this.getDefaultConsents();
          nprogress.done();
        },
        error => {
          toastr.error(
            error.body && error.body.message
              ? error.body.message
              : 'Error while getting associated consent.',
          ); // eslint-disable-line
          this.getDefaultConsents();
          nprogress.done();
        },
      );
    },
    saveAssociateConsent(currentCohort) {
      const that = this;
      nprogress.start();
      that.$api
        .addMultipleConsenttoCohortFact(that.studyId, currentCohort.cohortId, {
          consents: that.associatedConsents,
        })
        .then(
          response => {
            toastr.success(
              'All selected consent associate successfully with cohort',
            );

            for (let i = 0; i < response.data.cohortSort.length; i++) {
              if (
                response.data.cohortSort[i].cohortId == currentCohort.cohortId // eslint-disable-line
              ) { // eslint-disable-line
                this.$emit('cancelEditing', response.data.cohortSort[i]);
              }
            }
            nprogress.done();
          },
          error => {
            toastr.error(
              error.body && error.body.message
                ? error.body.message
                : 'Error while getting consent details',
            ); // eslint-disable-line
            nprogress.done();
          },
        );
    },
    startEditing() {
      this.old_cohort_name = this.currentCohort.cohortName;
      this.cohortEdit = false;
    },
    cancel() {
      this.currentCohort.cohortName = this.old_cohort_name;
      this.cohortEdit = true;
    },
    getConsentDetailsByID(consentId) {
      const that = this;
      nprogress.start();
      that.$api.getConsentDetailsByConsentId(that.studyId, consentId).then(
        response => {
          const index = that.defaultConsentsList.findIndex(
            x => x.consentId == consentId, // eslint-disable-line
          );

          if (index < 0) {
            that.defaultConsentsList.push(response.data);
          }
          nprogress.done();
        },
        error => {
          toastr.error(
            error.body && error.body.message
              ? error.body.message
              : 'Error while getting consent details',
          ); // eslint-disable-line
          nprogress.done();
        },
      );
    },
    removeAssociateConsent(consent, currentCohort) {
      swal({
        title: 'Are you sure you want to delete this consent?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#b8c7ce',
        cancelButtonColor: '#f16559',
        confirmButtonText: 'Cancel',
        cancelButtonText: 'Delete',
      }).then(({ dismiss }) => {
        if (dismiss === 'cancel') {
          const cohortId = currentCohort.cohortId; // eslint-disable-line
          const consentId = consent.consentId; // eslint-disable-line
          const that = this;
          let isExists = false;

          nprogress.start();
          that.$api.getConsentCohort(that.studyId, cohortId, consentId).then(
            response => {
              isExists = response.data;
              if (isExists) {
                that.$api
                  .deleteAssociatedConsentData(
                    that.studyId,
                    cohortId,
                    consentId,
                  )
                  .then(
                    () => {
                      const index = that.associatedConsents.findIndex(
                        x => x.consentId == consentId, // eslint-disable-line
                      );
                      if (index >= 0) {
                        that.associatedConsents.splice(index, 1);
                      }
                      toastr.success(
                        'Associated consent remove successfully from cohort',
                      );
                      that.getConsentDetailsByID(consentId);
                      nprogress.done();
                    },
                    error => {
                      toastr.error(
                        error.body && error.body.message
                          ? error.body.message
                          : 'Error while associated consent to cohort.',
                      ); // eslint-disable-line
                      nprogress.done();
                    },
                  );
              } else {
                const index = that.associatedConsents.findIndex(
                  x => x.consentId == consentId, // eslint-disable-line
                );
                if (index >= 0) {
                  that.associatedConsents.splice(index, 1);
                }
                that.getConsentDetailsByID(consentId);
              }
            },
            error => {
              toastr.error(
                error.body && error.body.message
                  ? error.body.message
                  : 'Error while getting consent detail.',
              ); // eslint-disable-line
              nprogress.done();
            },
          );
        }
      });
    },
    associateConsent(consent, currentCohort) {
      if(this.isApiCalled) {
        return;
      }
      this.isApiCalled = true;
      const cohortId = currentCohort.cohortId; // eslint-disable-line
      const consentId = consent.consentId; // eslint-disable-line
      const that = this;
      nprogress.start();
      that.$api.getConsentDetailsByConsentId(that.studyId, consentId).then(
        response => {
          const index = that.defaultConsentsList.findIndex(
            x => x.consentId == consentId, // eslint-disable-line
          );
          if (index >= 0) {
            that.defaultConsentsList.splice(index, 1);
          }
          that.associatedConsents.push(response.body);
          nprogress.done();
          this.isApiCalled = false;
        },
        error => {
          toastr.error(
            error.body && error.body.message
              ? error.body.message
              : 'Error while associated consent to cohort.',
          ); // eslint-disable-line
          nprogress.done();
          this.isApiCalled = false;
        },
      );
    },
    cancelAssociationEditing() {
      this.$emit('cancelEditing');
    },
    editCohort(cohort) {
      const that = this;
      const cohortName = cohort.cohortName; // eslint-disable-line
      const cohortId = cohort.cohortId; // eslint-disable-line

      if (cohortName === '') {
        toastr.error('Please enter cohort name.');
        that.currentCohort.cohortName = that.old_cohort_name;
      } else if (
        that.existingCohortList != null &&
        that.existingCohortList.length > 0
      ) {
        const filterList = that.existingCohortList.filter(
          x => x.cohortName == cohortName, // eslint-disable-line
        );
        if (filterList != null && filterList.length > 0) {
          toastr.error('A cohort with this name already exists.');
        } else {
          nprogress.start();
          that.$api.editCohortData(that.studyId, cohortId, cohortName).then(
            () => {
              that.currentCohort.cohortName = cohortName;
              toastr.success('Cohort edited successfully');
              that.cohortEdit = true;
              that.getExistingCohorts();
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
      } else {
        nprogress.start();
        that.$api.editCohortData(this.studyId, cohortId, cohortName).then(
          () => {
            that.currentCohort.cohortName = cohortName;
            toastr.success('Cohort edited successfully');
            that.cohortEdit = true;
            that.getExistingCohorts();
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
  },
};
</script>

<style scoped lang="scss">
.association-box {
  margin-left: 0px !important;
  margin-right: 0px !important;

  .no-consent {
    font-family: Lato-Regular;
    font-size: 15px;
    font-weight: bold;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.33;
    letter-spacing: normal;
    color: #9b9b9b;
    margin-top: 20px;
  }

  .available-consent-box {
    margin-bottom: 9px;
    .icon-div {
      width: 20px;
      display: inline-block;
      .association-consent-icon {
        cursor: pointer;

        img {
          height: 18px;
          width: 18px;
          vertical-align: middle;
        }
      }
    }
    .name-div {
      display: inline-block;
      margin-left: 10px;
      .consent-name {
        font-family: Lato-Regular;
        font-size: 15px;
        font-weight: normal;
        font-style: normal;
        font-stretch: normal;
        line-height: 1.33;
        letter-spacing: normal;
        color: #4a4a4a;
      }
    }
  }

  .association-inner-box {
    margin-top: 0;
    margin-bottom: 10px;

    .association-heading {
      font-family: Lato-Regular;
      font-size: 17px;
      font-weight: bold;
      font-style: normal;
      font-stretch: normal;
      line-height: 1.29;
      letter-spacing: normal;
      color: #4a4a4a;
      display: inline-block;
    }

    .association-edit-icon {
      display: inline-block;
      margin-left: 10px;
      cursor: pointer;
      img {
        height: 18px;
        width: 18px;
        vertical-align: middle;
      }
    }
  }

  .content-box {
    .cohort-input-field input {
      width: 500px;
      height: 40px;
      border-radius: 3px;
      border: solid 1px #e4e8eb;
      background-color: #ffffff;
      margin-top: 10px;
      padding-left: 10px;
      padding-right: 10px;
    }

    .btn button {
      &.white-btn {
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

      &.blue-btn {
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
.associatef-info {
  font-family: Lato-Regular;
  font-size: 15px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.33;
  letter-spacing: normal;
  color: #4a4a4a;
  margin-bottom: 10px;
}

.associated-row {
  width: 100%;
  height: 40px;
  border-radius: 4px;
  border: solid 1px #e4e8eb;
  margin-top: 10px;
  background-color: #ffffff;
  line-height: 35px;

  .icon-div {
    width: 20px;
    display: inline-block;
    .association-consent-icon {
      cursor: pointer;

      img {
        height: 18px;
        width: 18px;
        vertical-align: middle;
      }
    }
  }
  .name-div {
    display: inline-block;
    margin-left: 10px;
    .consent-name {
      font-family: Lato-Regular;
      font-size: 15px;
      font-weight: normal;
      font-style: normal;
      font-stretch: normal;
      line-height: 1.33;
      letter-spacing: normal;
      color: #4a4a4a;
    }
  }
}

.multiconsent-box2-divider {
  width: 100%;
  height: 1px;
  background-color: #e4e8eb;
  margin-top: 20px;
  margin-bottom: 20px;
}

.icon-div-remove {
  float: right;
  margin-right: 2%;
  cursor: pointer;
}
.delete-div {
  vertical-align: middle;
  margin-top: 30px;
  margin-bottom: 20px;

  .delete-icon {
    cursor: pointer;
    position: relative;
    top: 15px;
  }

  .btn {
    float: right;
    padding-top: 10px;
    button {
      &.white-btn {
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

      &.blue-btn {
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

       &.white-btn:hover{
        opacity: 0.5;
      }

      &.blue-btn:hover{
        opacity: 0.5;
      }
    }
  }
}

button:hover, .blue-btn:hover, .white-btn:hover{
  opacity: 0.5;
}
</style>

<style scoped lang="scss" src="./styles/add-edit-multi-consent.scss"></style>


