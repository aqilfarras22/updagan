<template>
  <div>
    <SideMenuLink
      class="menu-item"
      faIcon="fa-bar-chart"
      :to="{ name: 'vis-recruitment', params: { studyId } }"
      title="Recruitment"
    />
    <SideMenuLink
      class="menu-item"
      faIcon="fa-bar-chart"
      :to="{ name: 'vis-econsent', params: { studyId } }"
      title="eConsent"
    />
    <SideMenuLink
      class="menu-item"
      faIcon="fa-bar-chart"
      :to="{ name: 'vis-withdrawal', params: { studyId } }"
      title="Withdrawal Participants"
    />
    <SideMenuLink
      class="menu-item"
      faIcon="fa-bar-chart"
      :to="{ name: 'vis-participant-status', params: { studyId } }"
      title="Participant Status"
    />
    <SideMenuLink
      class="menu-item"
      faIcon="fa-bar-chart"
      :to="{ name: 'vis-participant-completion', params: { studyId } }"
      title="Participant Completion"
    />
    <SideMenuLink
      class="menu-item"
      faIcon="fa-bar-chart"
      :to="{ name: 'vis-participant-compliance', params: { studyId } }"
      title="Participant Compliance"
    />
    <SideMenuLink
      class="menu-item"
      faIcon="fa-bar-chart"
      :to="{ name: 'vis-enrollment-sum', params: { studyId } }"
      title="Overall enrollment"
    />
    <SideMenuLink
      class="menu-item"
      faIcon="fa-bar-chart"
      :to="{ name: 'vis-datapoints', params: { studyId } }"
      title="Datapoints"
    />
    <SideMenuLink
      class="menu-item"
      faIcon="fa-bar-chart"
      :to="{ name: 'vis-data-queries', params: { studyId } }"
      title="Data Queries"
    />
    <SideMenuLink
      class="menu-item"
      faIcon="fa-bar-chart"
      :to="{ name: 'vis-compliance', params: { studyId } }"
      title="Compliance"
    />
  </div>
</template>

<script>
import SideMenuLink from "./side-menu-link"

export default {
  name: "SideMenu",
  components: {
    SideMenuLink
  },
  data() {
    return {
      studyId: this.$route.params.studyId,
    };
  },
  computed: {

  },
  mounted() {

  },
  methods: {
    
  }
};
</script>
<style scoped lang="scss" src="./styles/side-menu.scss" />
