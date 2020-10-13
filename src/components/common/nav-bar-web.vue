<template>
  <b-nav v-if="routes" class="nav-bar">
    <b-nav-item v-for="route in routes" exact :to="route.to" :key="route.label">{{ route.label }}</b-nav-item>
    <b-nav-item v-if="routes[routes.length - 1]">
      <a class="dropdown-toggle color_4c8ce4" data-toggle="dropdown">{{ routes[routes.length - 1].message }}</a>
      <div class="dropdown-menu custom-popover fs-12">
        <div class="arrow"></div>
        <div class="">
          <div class="overflow">
            <div class="row p-5">
              <div class="col-lg-3 col-md-3 col-sm-3 col-xs-3 p-0">
                <span>Global Element</span>
              </div>
              <div class="col-lg-9 col-md-9 col-sm-9 col-xs-9">
                Persons from your organization that provide admin oversight for this study.
              </div>
            </div>
            <div class="row p-5">
              <div class="col-lg-3 col-md-3 col-sm-3 col-xs-3 p-0">
                <span>Homepage</span>
              </div>
              <div class="col-lg-9 col-md-9 col-sm-9 col-xs-9">
                Persons from your organization or sponsor that provide specific role support for this study.
              </div>
            </div>
            <div class="row p-5">
              <div class="col-lg-3 col-md-3 col-sm-3 col-xs-3 p-0">
                <span>Eligiblity Screening </span>
              </div>
              <div class="col-lg-9 col-md-9 col-sm-9 col-xs-9">
                Sites that conduct your study. Includes all PI, Sub-I, and SC.
              </div>
            </div>
             <div class="row p-5">
              <div class="col-lg-3 col-md-3 col-sm-3 col-xs-3 p-0">
                <span>Agreement </span>
              </div>
              <div class="col-lg-9 col-md-9 col-sm-9 col-xs-9">
                Sites that conduct your study. Includes all PI, Sub-I, and SC.
              </div>
            </div>
            <div class="row p-5">
              <div class="col-lg-3 col-md-3 col-sm-3 col-xs-3 p-0">
                <span>Registration </span>
              </div>
              <div class="col-lg-9 col-md-9 col-sm-9 col-xs-9">
                Sites that conduct your study. Includes all PI, Sub-I, and SC.
              </div>
            </div>
          </div>
        </div>
      </div>
    </b-nav-item>
  </b-nav>
</template>

<script>
export default {
  name: 'nav-bar-web',
  props: {
    routes: {
      type: Array,
    },
    studyType: {
      type: String,
    },
  },
};
</script>

<style scoped lang="scss" src="./styles/nav-bar.scss" />
