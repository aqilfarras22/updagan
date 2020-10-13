<template>
  <div class="component">
    <b-container fluid class="pb-20 pt-13">
      <nav aria-label="breadcrumb" class="participant-breadcrumb">
        <ol class="breadcrumb">
          <li class="breadcrumb-item">
            <a class="h-link">Participants</a>
          </li>
          <li class="breadcrumb-item">
            <span>Documents</span>
          </li>
        </ol>
      </nav>
    </b-container>
    <addViewSiteDocument :siteId="siteId" :isAdmin="isAdmin"></addViewSiteDocument>
  </div>
</template>
<script>
import addViewSiteDocument from "@/components/common/add-view-site-document"
import localStorageService from '@/services/localStorage';

export default {
  name: "study-participant-documents",
  components: {
   addViewSiteDocument
  },
  data() {
    return {
      studyId: this.$route.params.studyId,
      siteId:null,
      isAdmin:false,
    };
  },
  computed: {},
  methods: {
    getSiteId() {

      const user = localStorageService.getItem("userObj");

      this.siteId = user.siteIds[0];

    }
  },
  mounted() {
    this.getSiteId();
  }
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