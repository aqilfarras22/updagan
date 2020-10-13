<template>
  <div class="edc-form-bar">
	<div class="row">
		<div class="col-md-2">
			<div class="heading">Form/Packet Name</div>
			<div class="value">{{ clearFormName() }}</div>
		</div>
		<div class="col-md-2">
			<div class="heading">Verification Status</div>
			<div class="value" :class="edcFormInfo.verificationStatus">{{ verificationStatusText[edcFormInfo.verificationStatus] }}</div>
			<div v-if="verified && edcFormInfo.verifiedOn" class="date value">
				({{ new Date(edcFormInfo.verifiedOn) | formatGMTDate }})
			</div>
		</div>
		<div class="col-md-2">
			<div class="heading">Approval Status</div>
			<div class="value" :class="edcFormInfo.approvalStatus">{{ approvalStatusText[edcFormInfo.approvalStatus] }}</div>
			<span v-if="approved && edcFormInfo.approvedOn" class="date value">
			({{ new Date(edcFormInfo.approvedOn) | formatGMTDate }})
			</span>
		</div>
	</div>
  </div>
</template>

<script>
import { AclRule } from 'vue-acl';
import { mapGetters } from 'vuex';
import {
  approvalStatusText,
  verificationStatusText,
  verificationStatus,
  approvalStatus,
} from '@/constants/form';

export default {
  name: 'form-info',
  components: {},
  props: {
    edcFormInfo: {
		type: Object,
		default: {}
	}
  },
  data() {
    return {
      approvalStatusText,
	  verificationStatusText,
	  verificationStatus
	};
  },
  computed: {
    ...mapGetters(['user']),
    userAccess() {
      return new AclRule(this.user.userRole).generate();
    }
  },
  methods: {
	clearFormName() {
    	return this.edcFormInfo.formName ? this.edcFormInfo.formName.replace(/_/g, ' ') : '';
	},
	verified() {
      	return this.edcFormInfo.verificationStatus === verificationStatus.VERIFIED;
    },
    approved() {
      	return this.edcFormInfo.approvalStatus === approvalStatus.APPROVED;
    }
  }
};
</script>

<style scoped lang="scss">
.edc-form-bar {
	height: 60px;
  background-color: #fff;
  padding: 10px 0px;
  -webkit-box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.06);
  margin-top: 15px;
  height: 75px;
  .heading {
    font-weight: 600;
  }
}
.date {
  font-size: 12px;
  line-height: 1.67;
}
.telehealth-call {
  .heading {
    font-size: 10px;
  }
  .value {
    font-size: 10px;
  }
}
</style>
