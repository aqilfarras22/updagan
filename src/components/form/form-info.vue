<template>
  <div v-if="formId">
    <dl v-if="formName" ref="formName">
      <dt>Form Name</dt>
      <dd>{{ clearFormName }}</dd>
    </dl>
    <dl v-if="verificationStatus" ref="verificationStatus">
      <dt>Verification Status</dt>
      <dd>
        <div :class="verificationStatus">{{ verificationStatusText[verificationStatus] }}</div>
        <div v-if="verified && verifiedOn" class="date">
          ({{ new Date(verifiedOn) | formatGMTDate }})
        </div>
      </dd>
    </dl>
    <dl v-if="approvalStatus" ref="approvalStatus">
      <dt>Approval Status</dt>
      <dd>
        <div :class="approvalStatus">{{ approvalStatusText[approvalStatus] }}</div>
        <span v-if="approved && approvedOn" class="date">
          ({{ new Date(approvedOn) | formatGMTDate }})
        </span>
      </dd>
    </dl>
    <div class="actions">
      <button-cmp v-if="canPiAccess" class="form-action-button" size="lg" variant="primary" @click="openApprovalModal">{{ approvalBtnText }}</button-cmp>
      <button-cmp v-if="canCraAccess" class="form-action-button" size="lg" variant="primary" @click="openVerificationModal">{{ verifyBtnText }}</button-cmp>
    </div>
    <formApprovalModal
      v-if="canPiAccess"
      ref="approvalModal"
      callApi
      :formId="formId"
      :approved="approved"
      @confirmed="approvalConfirmed"
    />
    <formVerificationModal
      v-if="canCraAccess"
      ref="verificationModal"
      callApi
      :formId="formId"
      :verified="verified"
      @confirmed="verificationConfirmed"
    />
  </div>
</template>

<script>
import { AclRule } from 'vue-acl';
import { mapGetters } from 'vuex';
import formVerificationModal from '@/components/modals/form-verification-modal';
import formApprovalModal from '@/components/modals/form-approval-modal';
import ButtonCmp from '@/components/common/button';

import { PI, CRA } from '@/constants/authRoles';
import {
  approvalStatusText,
  verificationStatusText,
  verificationStatus,
  approvalStatus,
} from '@/constants/form';

export default {
  name: 'form-info',
  components: {
    formVerificationModal,
    formApprovalModal,
    ButtonCmp,
  },
  props: {
    formId: String,
    formName: String,
    approvalStatus: String,
    verificationStatus: String,
    verifiedOn: [String, Number],
    approvedOn: [String, Number],
  },
  data() {
    return {
      approvalStatusText,
      verificationStatusText,
    };
  },
  computed: {
    ...mapGetters(['user']),
    userAccess() {
      return new AclRule(this.user.userRole).generate();
    },
    canPiAccess() {
      this.$acl.change(`${PI}`);
      return this.$acl.check('userAccess');
    },
    canCraAccess() {
      this.$acl.change(`${CRA}`);
      return this.$acl.check('userAccess');
    },
    clearFormName() {
      return this.formName ? this.formName.replace(/_/g, ' ') : '';
    },
    verified() {
      return this.verificationStatus === verificationStatus.VERIFIED;
    },
    approved() {
      return this.approvalStatus === approvalStatus.APPROVED;
    },
    verifyBtnText() {
      return this.verified ? 'Unverify' : 'Verify';
    },
    approvalBtnText() {
      return this.approved ? 'Unapprove' : 'Approve';
    },
  },
  methods: {
    openVerificationModal() {
      this.$refs.verificationModal.show();
    },
    openApprovalModal() {
      this.$refs.approvalModal.show();
    },
    verificationConfirmed({ verified }) {
      const status = verified ? verificationStatus.VERIFIED : verificationStatus.NOT_VERIFIED;
      this.$emit('verificationConfirmed', status);
    },
    approvalConfirmed({ approved }) {
      const status = approved ? approvalStatus.APPROVED : approvalStatus.NOT_APPROVED;
      this.$emit('approvalConfirmed', status);
    },
  },
};
</script>

<style scoped>
.APPROVED,
.VERIFIED {
  color: #48bf7a !important;
}
.NOT_VERIFIED,
.NOT_APPROVED {
  color: #f16559 !important;
}
.form-action-button {
  width: 100%;
  margin-top: 1px;
  margin-bottom: 1px;
}
dt {
  font-size: 10px;
  line-height: 1.6;
  text-transform: uppercase;
  color: #adaeb1;
}
dd {
  color: #666669;
  font-size: 14px;
  font-weight: 500;
}
.date {
  font-size: 12px;
  line-height: 1.67;
}
</style>
