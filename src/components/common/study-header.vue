<template>
  <div class="study-header">
    <nav class="navbar navbar-default navbar-fixed-top navbar-style">
      <div class="container">
        <!-- Brand and toggle get grouped for better mobile display -->
        <div class="navbar-header">
          <button
            type="button"
            class="navbar-toggle collapsed toggle-style"
            data-toggle="collapse"
            data-target="#bs-example-navbar-collapse-1"
            aria-expanded="false"
          >
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <!--<span class="navbar-brand mr-10 ml-20 cursor_pointer" v-on:click="goHome()"><i class="fa fa-home" aria-hidden="true"></i></span>-->
        </div>

        <!-- Collect the nav links, forms, and other content for toggling -->
        <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
          <ul class="nav navbar-nav">
            <li class :class="{'active_link': currentRouteIndex >= 0}">
              <router-link
                :class="{'disabled_items': currentRouteIndex < 0}"
                :to="{ name: 'study-design', params:{studyId: studyId}}"
              >
                <div class="module_number" v-if="currentRouteIndex == 0">1</div>
                <div class="module_tick" v-if="currentRouteIndex > 0">
                  <i class="fa fa-check" aria-hidden="true"></i>
                </div>
                <div class="module_name">Design</div>
              </router-link>
            </li>
            <li :class="{'active_link': currentRouteIndex >= 1}">
              <div class="line"></div>
            </li>
            <li
              class
              :class="{'active_link': currentRouteIndex >= 1, 'disabled': currentRouteIndex < 1, 'disabled_items': (!studyId || studyId <= 0)}"
            >
              <router-link
                :class="{'disabled_items': currentRouteIndex < 1}"
                :to="{ name: 'features-library', params:{studyId: studyId}}"
              >
                <div class="module_number" v-if="currentRouteIndex <= 1">2</div>
                <div class="module_tick" v-if="currentRouteIndex > 1">
                  <i class="fa fa-check" aria-hidden="true"></i>
                </div>
                <div class="module_name">Customize</div>
              </router-link>
            </li>
            <li :class="{'active_link': currentRouteIndex >= 2}">
              <div class="line"></div>
            </li>
            <li
              class
              :class="{'active_link': currentRouteIndex >= 2, 'disabled': currentRouteIndex < 2, 'disabled_items': (!studyId || studyId <= 0)}"
            >
              <router-link
                :class="{'disabled_items': currentRouteIndex < 2}"
                :to="{ name: 'study-summary', params:{studyId: studyId}}"
              >
                <div class="module_number" v-if="currentRouteIndex <= 2">3</div>
                <div class="module_tick" v-if="currentRouteIndex > 2">
                  <i class="fa fa-check" aria-hidden="true"></i>
                </div>
                <div class="module_name">Review</div>
              </router-link>
            </li>
            <li :class="{'active_link': currentRouteIndex >= 3, 'disabled': currentRouteIndex < 3}">
              <div class="line"></div>
            </li>
            <li
              class
              :class="{'active_link': currentRouteIndex >= 3, 'disabled': currentRouteIndex < 3, 'disabled_items': (!studyId || studyId <= 0)}"
            >
              <router-link
                :class="{'disabled_items': currentRouteIndex < 3}"
                :to="{ name: 'launch', params:{studyId: studyId}}"
              >
                <div class="module_number" v-if="currentRouteIndex <= 3">4</div>
                <div class="module_tick" v-if="currentRouteIndex > 3">
                  <i class="fa fa-check" aria-hidden="true"></i>
                </div>
                <div class="module_name">Launch</div>
              </router-link>
            </li>
            <li :class="{'active_link': currentRouteIndex >= 4, 'disabled': currentRouteIndex < 4}">
              <div class="line"></div>
            </li>
            <li
              class
              :class="{'active_link': currentRouteIndex >= 4, 'disabled': currentRouteIndex < 4, 'disabled_items': (!studyId || studyId <= 0)}"
            >
              <router-link
                :class="{'disabled_items': currentRouteIndex < 4}"
                :to="{ name: 'manage', params:{studyId: studyId}}"
              >
                <div class="module_number" v-if="currentRouteIndex <= 4">5</div>
                <div class="module_tick" v-if="currentRouteIndex > 4">
                  <i class="fa fa-check" aria-hidden="true"></i>
                </div>
                <div class="module_name">Manage</div>
              </router-link>
            </li>
          </ul>
          <ul class="save_exit_section">
            <button
              type="button"
              class="btn btn-default mr-30-xs save_exit_btn"
              v-if="currentRouteIndex < 4 && !disableSave"
              v-on:click="saveAndExitConfirmation()"
            >Exit to Studies List</button>
          </ul>
        </div>
        <!-- /.navbar-collapse -->
      </div>
      <!-- /.container-fluid -->
    </nav>
  </div>
</template>

<script>
import _ from "lodash";
import swal from "sweetalert2";

export default {
  name: "study-header",
  data() {
    return {
      currentRoute: "",
      disableSave: "",
      studyId: "",
      routes: ["design", "customize", "review", "launch", "manage"],
      currentRouteIndex: null
    };
  },
  mounted() {
    this.currentRoute = this.$router.currentRoute.path;
    this.disableSave = this.$router.currentRoute.name === "study-design";
    let routeIndex = null;
    let routeVal = null;
    _.forEach(this.routes, value => {
      routeIndex = this.currentRoute.indexOf(value);
      if (routeIndex >= 0) {
        routeVal = value;
      }
    });
    this.currentRouteIndex = this.routes.indexOf(routeVal);
    this.studyId = this.$route.params.studyId;
  },
  methods: {
    goHome() {
      this.$router.push({ name: "studies" });
    },
    saveAndExit() {
      const obj = { currentURL: window.location.href, routeName: null };
      this.$api.saveAndExitStudyFact(this.studyId, obj).then(() => {
        this.$router.push({ name: "studies" });
      });
    },
    saveAndExitConfirmation() {
      var self = this;
      swal({
        title:
          "Are you sure you want to exit? Please save your changes before proceeding.",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#b8c7ce",
        cancelButtonColor: "#f16559",
        confirmButtonText: "Cancel",
        cancelButtonText: "Exit"
      }).then(({ dismiss }) => {
        if (dismiss === "cancel") {
          self.saveAndExit();
        }
      });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
// Style for quick fixes bootstrap after migration (before redesign should be removed)

.navbar-style {
  position: fixed;
  right: 0;
  left: 0;
  top: 0;
  z-index: 1030;
}

.navbar > .container,
.navbar > .container-fluid {
  display: block;
}

.navbar-fixed-top .navbar-collapse {
  max-height: 340px;
  margin-right: 0;
  margin-left: 0;
}

.navbar-header {
  display: none;
}

@media (min-width: 768px) {
  .navbar-collapse.collapse {
    display: block !important;
    height: auto !important;
    padding-bottom: 0;
    overflow: visible !important;
  }
}

// END of style for quick fixes bootstrap after migration (before redesign should be removed)

.navbar {
  border: none !important;
}
.navbar-style {
  background-color: #34537d;
  min-height: 53px;
  margin-bottom: 20px;
  padding: 0;
}

.btn {
  border-radius: 25px;
}
.navbar-nav {
  float: none;
  display: inline-block;
  margin: -10px 0 0;
  li {
    position: relative;
    float: left;
  }
  a {
    line-height: 20px;
    position: relative;
    display: block;
    padding: 5px 0px;

    &:hover {
      text-decoration: none;
    }
  }
}
.disabled_items {
  cursor: not-allowed !important;
  pointer-events: none;
}
.line {
  border-top: 1px solid #668bbd;
  display: inline-block;
  min-width: 90px;
  margin-top: 15px;
}
.navbar-collapse {
  text-align: center;
}
.container {
  position: relative;
}
.save_exit_section {
  position: absolute;
  top: -13px;
  right: 0;
  .save_exit_btn {
    background-color: #2d3752;
    color: #fff;
    padding: 5px 25px 7px;
    margin-top: 10px;
    border-radius: 25px;
    border: none;
    font-size: 14px;
  }
}
.btn-default[disabled]:hover {
  background-color: #195877;
}
.module_number {
  font-size: 12px;
  color: #668bbd;
  border: 2px solid #668bbd;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  line-height: 19px;
  margin: auto;
}
.module_name {
  font-size: 12px;
  color: #668bbd;
  position: absolute;
  left: -38px;
  width: 100px;
}
.module_tick {
  padding-top: 1px;
  font-size: 12px;
  border-radius: 50%;
  width: 22px;
  height: 22px;
  margin: auto;
  line-height: 18px;
  background: #f16559;
  border-color: #f16559;
  color: #fff;
}
.active_link {
  .module_number {
    background: #f16559;
    border-color: #f16559;
    color: #fff;
  }
  .module_name {
    color: #fff;
  }
  .line {
    border-top: 1px solid #f16559;
  }
}
.toggle-style {
  float: right;
  border: none;
}
@media (max-width: 575px) {
}

@media (min-width: 576px) and (max-width: 767px) {
  .module_name {
    left: -5px;
  }
}

@media (min-width: 768px) and (max-width: 991px) {
  .container-width {
    width: 700px;
  }
}

@media (min-width: 992px) and (max-width: 1199px) {
  .container-width {
    width: 890px;
  }
}

@media (min-width: 1200px) {
  .container-width {
    width: 1090px;
  }
}
</style>
