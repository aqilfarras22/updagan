<template>
  <!--Edit Consent Window-->
  <div class="container">
    <div class="cohort-heading">Cohort Name</div>
    <div class="content-box">
      <div class="cohort-input-field">
        <input
          type="text"
          v-if="cohort.cohortName!=''"
          v-model.trim="cohort.cohortName"
          placeholder="eg. An Adult (18+ y/o) registering for the study"
        >
        <input
          type="text"
          v-else
          placeholder="eg. An Adult (18+ y/o) registering for the study"
          v-model.trim="new_cohort_name"
        >
      </div>
      <div
        class="cohort-information"
      >If you have more than one cohort, this name will be participant facing.</div>
      <div class="btn">
        <button class="white-btn" v-on:click="cancel()">Cancel</button>
        <button class="blue-btn" v-on:click="addCohort()">Save</button>
      </div>
    </div>
  </div>
  <!--End Edit Consent Window-->
</template>

<script>
import toastr from 'toastr';
import swal from 'sweetalert2'; // eslint-disable-line
import nprogress from 'nprogress';
import 'nprogress/nprogress.css';

export default {
  name: 'cohort',
  data() {
    return {
      new_cohort_name: '',
      cohort: this.options,
      cohortList: this.existingCohort,
    };
  },
  props: ['options', 'existingCohort'],
  mounted() {
    this.studyId = this.$route.params.studyId;
  },
  methods: {
    addCohort() {
      const cohortName = this.new_cohort_name;
      if (
        cohortName === '' ||
        cohortName === null ||
        cohortName === undefined
      ) {
        toastr.error('Please add a Cohort name.');
      } else if (this.cohortList != null && this.cohortList.length > 0) {
        const filterList = this.cohortList.filter(
          x => x.cohortName == this.new_cohort_name, // eslint-disable-line
        );
        if (filterList != null && filterList.length > 0) {
          toastr.error('A cohort with this name already exists.');
        } else {
          nprogress.start();
          this.$api.addNewCohort(this.studyId, cohortName).then(
            response => {
              this.$emit('save', response.data);
              this.$emit('cancel');
              nprogress.done();
            },
            error => {
              toastr.error(
                error.body && error.body.message
                  ? error.body.message
                  : 'Error while adding the new consent.',
              );
              nprogress.done();
            },
          );
        }
      } else {
        nprogress.start();
        this.$api.addNewCohort(this.studyId, cohortName).then(
          response => {
            this.$emit('save', response.data);
            this.$emit('cancel');
            nprogress.done();
          },
          error => {
            toastr.error(
              error.body && error.body.message
                ? error.body.message
                : 'Error while adding the new consent.',
            );
            nprogress.done();
          },
        );
      }
    },
    cancel() {
      this.$emit('cancel');
    },
  },
};
</script>

<style scoped lang="scss">
.cohort-heading {
  font-family: Lato-Regular;
  font-size: 17px;
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.29;
  letter-spacing: normal;
  color: #4a4a4a;
  margin-top: 20px;
}

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

.cohort-information {
  font-family: Lato-Regular;
  font-size: 15px;
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.33;
  letter-spacing: normal;
  color: #e67d23;
  margin-top: 10px;
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
    line-height: normal;
    letter-spacing: normal;
    text-align: center;
    color: #ffffff;
    border: solid 1px #1e8fe1;
    background-color: #1e8fe1;
  }
}

button:hover{
  opacity: 0.5;
}
</style>

<style scoped lang="scss" src="./styles/add-edit-multi-consent.scss"></style>


