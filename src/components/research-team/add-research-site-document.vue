<template>
  <div class="component">
    <b-container fluid class="pb-20 pt-13">
     <b-row class="mt-15" v-if="(canSysAdminAccess || canStudyAdminAccess)">
            <b-link :to="{name: 'research-site-details'}"><i class="fa fa-caret-left" aria-hidden="true"></i><span class="pl-5">Back to Site</span></b-link>
        </b-row>
    </b-container>
    <addViewSiteDocument :siteId="siteId" :isAdmin="isAdmin"></addViewSiteDocument>
  </div>
</template>
<script>
import { SYSTEM_ADMIN, STUDY_ADMIN, PI } from '@/constants/authRoles';
import addViewSiteDocument from "@/components/common/add-view-site-document"
import { mapGetters } from 'vuex';
import { AclRule } from 'vue-acl';

export default {
  name: "study-participant-documents",
  components: {
   addViewSiteDocument
  },
  data() {
    return {
      studyId: this.$route.params.studyId,
      siteId:this.$route.params.siteId,
      isAdmin:true,
    };
  },
  computed: {
    ...mapGetters(["token", "user"]),    
    userAccess() {
      return new AclRule(this.user.userRole).generate();
    },
    canSysAdminAccess() {
      this.$acl.change(`${SYSTEM_ADMIN}`);
      return this.$acl.check('userAccess');
    },
    canStudyAdminAccess() {
      this.$acl.change(`${STUDY_ADMIN}`);
      return this.$acl.check('userAccess');
    },
    canPiAccess() {
      this.$acl.change(`${PI}`);
      return this.$acl.check('userAccess');
    },
  },
  methods: {},
  mounted() {}
};
</script>

<style scoped lang="scss" src="../../../public/static/fonts.scss"></style>
<style scoped lang="scss">
.participant-breadcrumb {
  height: 35px;
  float: left;
  width: 226px;
  border-radius: 4px;
  border: solid 1px #e4e8eb;
  background-color: #f9f9fb;
}
.breadcrumb {
  height: 33px;
  padding: 5px 10px;
  background-color: #f9f9fb;
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 1rem;
  list-style: none;
  border-radius: 0.25rem;
}
.breadcrumb-item {
  color: #4a4a4a;
}
.h-link {
  color: #4c8ce4;
  cursor: pointer;
}
</style>