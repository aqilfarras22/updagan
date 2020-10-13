<template>
  <b-modal ref="modal" size="lg" hide-footer hide-header>
    <div class="modal-content-box">
      <b-form @submit.prevent="yesAction">
        <b-container fluid>
          <b-row class="text-center">
            <b-col>
              <p>
                <strong>
                  Herewith I confirm the completeness and correctness of all data entered into the THREAD Platform by applying an electronic signature, using my account name and password. This electronic signature is the legally binding equivalent of my handwritten signature. I understand that this electronic signature is assigned only to my account name and password; no other person is authorized to use these.
                </strong>
              </p>
              <p>
                <strong>
                  Please enter your username and password to approve.
                </strong>
              </p>
            </b-col>
          </b-row>
          <b-row>
            <b-form-group
              class="group"
              :invalid-feedback="errors.first('username')"
              :state="veeFields.username && veeFields.username.validated ? !errors.has('username') : null"
            >
              <b-form-input
                id="username"
                name="username"
                placeholder="Username"
                :state="veeFields.username && veeFields.username.validated ? !errors.has('username') : null"
                v-model.trim="username"
                v-validate="'required|email'"
              ></b-form-input>
            </b-form-group>
          </b-row>
          <b-row>
            <b-form-group
              class="group"
              :invalid-feedback="errors.first('password')"
              :state="veeFields.username && veeFields.username.validated ? !errors.has('password') : null"
            >
              <b-form-input
                id="password"
                name="password"
                type="password"
                placeholder="Password"
                :state="veeFields.username && veeFields.username.validated ? !errors.has('password') : null"
                v-model.trim="password"
                v-validate="'required'"
              ></b-form-input>
            </b-form-group>
          </b-row>
          <b-row class="text-center">
            <b-col>
              <p>
                <button-cmp variant="primary" type="submit" :disabled="errors.any()" class="button">{{ yesBtn }}</button-cmp>
              </p>
            </b-col>
          </b-row>
          <b-row class="text-center">
            <b-col><button-cmp @click="hide" class="button">{{ noBtn }}</button-cmp></b-col>
          </b-row>
        </b-container>
      </b-form>
    </div>
  </b-modal>
</template>

<script>
import ButtonCmp from '@/components/common/button';

export default {
  name: 'form-approval-modal',
  components: { ButtonCmp },
  props: {
    formId: {
      type: String,
      required: true,
    },
    approved: {
      type: Boolean,
      required: true,
    },
    callApi: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    username: '',
    password: '',
    submited: false,
  }),
  computed: {
    yesBtn() {
      if (this.approved) {
        return 'Yes, unapprove';
      }
      return 'Yes, approve';
    },
    noBtn() {
      if (this.approved) {
        return 'No, do not unapprove';
      }
      return 'No, do not approve';
    },
  },
  methods: {
    show() {
      this.$refs.modal.show();
    },
    hide() {
      this.$refs.modal.hide();
    },
    yesAction() {
      this.$validator.validateAll().then(valid => {
        if (valid) {
          if (this.callApi) {
            const patchId = !this.approved ? 'approve' : 'unApprove';
            this.$api
              .setQueryToolStudyFormStatus(
                { fId: this.formId, patchId },
                {
                  username: this.username,
                  password: this.password,
                },
              )
              .then(() => {
                this.$emit('confirmed', {
                  approved: !this.approved,
                });
                this.$toastr.success(`Approval ${this.approved ? 'Unconfirmed' : 'confirmed'}`);
                this.hide();
              })
              .catch(error => {
                const { message = 'Error while saving approval status' } = (error && error.body) || {};
                this.$toastr.error(message);
              });
          } else {
            this.$emit('confirmed', {
              approved: !this.approved,
            });
            this.hide();
          }
        }
      });
    },
  },
};
</script>

<style scoped>
.modal-content-box {
  min-width: 600px!important;
  padding: 31px 50px;
}
.group {
  width: 70%;
  margin-left: 15%;
}
.button {
  text-transform: none;
  border-radius: 25px;
  width: 75%;
  font-size: 14px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
}
</style>
