<template>
  <div class="position_relative">
    <span class="icon_section left_icon" v-if="left" v-on:click="move('left')"><i class="fa fa-caret-left icon" aria-hidden="true"></i></span>
    <ul class="nav nav-tabs x-hidden" role="tablist" id="feature_menu_scroll">
      <li role="presentation" :class="{'active-style': currentRoute === feature.route}" class="tab-style cursor_pointer" v-for="feature in selectedFeatures"
        v-on:click="changeRoute(feature)">
        <span>{{feature.shortName}}</span>
        <i class="fa fa-check-circle color_green" aria-hidden="true" v-if="feature.status === 'completed'"></i>
      </li>
    </ul>
    <span class="icon_section right_icon" v-if="right" v-on:click="move('right')"><i class="fa fa-caret-right icon" aria-hidden="true"></i></span>
  </div>
</template>

<script>
import _ from 'lodash';
import services from '../services';

export default {
  name: 'study-features-header',
  data() {
    return {
      currentRoute: '',
      selectedFeatures: [],
      studyId: null,
      surveyType: null,
      currentIndex: null,
      scrollableSection: 1,
      temp: null,
      isMultipleConsent: true,
    };
  },
  mounted() {
    this.studyId = this.$route.params.studyId;
    this.currentRoute = this.$router.currentRoute.name;
    this.surveyType = this.$route.params.surveyType;
    if (
      [
        'surveys',
        'survey-details',
        'survey-instructions',
        'survey-questions',
        'survey-review',
        'survey-scheduler',
        'survey-as-template',
      ].indexOf(this.currentRoute) >= 0
    ) {
      if (this.surveyType == "EPRO")
        this.currentRoute = 'epros';
      else  
        this.currentRoute = 'surveys';
    } else if (
      ['epros', 
      'epro-details', 
      'epro-validate', 
      'epro-scheduler', 
      'epro-create'
      ].indexOf(this.currentRoute) >= 0
    ) {
      this.currentRoute = 'epros';
    } else if (['edros', 'edit-edro'].indexOf(this.currentRoute) >= 0) {
      this.currentRoute = 'edros';
    }
    this.getToggleFeatures();
    this.getFeatures();
    // this.getFeaturesStatus();
  },
  computed: {
    right() {
      return !(this.temp === this.scrollableSection || this.selectedFeatures.length < 10);
    },
    left() {
      return (
        this.scrollableSection !== 0 &&
        100 &&
        this.currentRoute !== 'branding' &&
        this.selectedFeatures.length > 8
      );
    },
  },
  methods: {
    move(direction) {
      this.temp = this.scrollableSection;
      const scrollableSection = window.document.getElementById('feature_menu_scroll');
      if (direction === 'left') {
        scrollableSection.scrollLeft -= 100;
        this.scrollableSection = scrollableSection.scrollLeft;
      } else if (direction === 'right') {
        scrollableSection.scrollLeft += 100;
        this.scrollableSection = scrollableSection.scrollLeft;
      }
    },
    changeRoute(feature) {
      this.$router.push({ name: feature.route, params: { studyId: this.studyId } });
    },
    getFeatures() {
      this.selectedFeatures = services.getSelectedFeatures();
      // if (this.selectedFeatures.length === 0) {
      this.$api.getLibraryFeaturesFact(this.studyId).then(response => {
        if (response.body) {
          this.selectedFeatures = response.body.studyLibraryFeatures;
          this.$store.dispatch('selectedFeaturesAction', this.selectedFeatures);
          const currentIndex = _.findIndex(this.selectedFeatures, ['route', this.currentRoute]);
          if (currentIndex >= 0) {
            this.currentIndex = this.selectedFeatures[currentIndex].index;
          }
        }
      });
      // }
    },
    getFeaturesStatus() {
      const that = this;

      if (that.isMultipleConsent) {
        that.$api.getFeaturesStateV2Fact(that.studyId).then(
          response => {
            if (response.body) {
              that.selectedFeaturesStatus = response.body.studyLibraryFeatures;
              _.forEach(that.selectedFeaturesStatus, feature => {
                const selectedIndex = _.findIndex(that.selectedFeatures, ['index', feature.index]);
                that.selectedFeatures[selectedIndex].active = true;
                that.selectedFeatures[selectedIndex].status = feature.status;
              });
              that.nonSelectedFeatures = _.cloneDeep(
                _.filter(that.selectedFeatures, o => !o.active && o.index > 5),
              ); // eslint-disable-line
              that.gotData = true;
            }
          },
          error => {
            toastr.error(error.message); // eslint-disable-line
          },
        );
      } else {
        that.$api.getFeaturesStateFact(that.studyId).then(
          response => {
            if (response.body) {
              that.selectedFeaturesStatus = response.body.studyLibraryFeatures;
              _.forEach(that.selectedFeaturesStatus, feature => {
                const selectedIndex = _.findIndex(that.selectedFeatures, ['index', feature.index]);
                that.selectedFeatures[selectedIndex].active = true;
                that.selectedFeatures[selectedIndex].status = feature.status;
              });
              that.nonSelectedFeatures = _.cloneDeep(
                _.filter(that.selectedFeatures, o => !o.active && o.index > 5),
              ); // eslint-disable-line
              that.gotData = true;
            }
          },
          error => {
            toastr.error(error.message); // eslint-disable-line
          },
        );
      }
    },
    getToggleFeatures() {
      const that = this;
      that.$api.getToggleFeaturesFact(that.studyId).then(
        response => {
          that.toggleFeatures = response.body.studyFeatures;
         
          // For Telehealth 2.0 Feature
          const isTelehealth = that.toggleFeatures.filter(x => x.featureKey == 'TELEHEALTH' && x.enabled == true); // eslint-disable-linedisable-line
          
          if ((isTelehealth == null || isTelehealth == undefined || isTelehealth == '') && isTelehealth.length == 0) { // eslint-disable-line
            try{
              that.features.splice(14, 1);
            }catch{
            }
          }

          // For Multiple Conset feature
          const isEconsent = that.toggleFeatures.filter(x => x.featureKey == 'ECONSENT'); // eslint-disable-line

          if ((isEconsent == null || isEconsent == undefined || isEconsent == '') && isEconsent.length == 0) { // eslint-disable-line
            that.selectedFeatures.splice(4, 1);
          } else {
            that.isMultipleConsent = false;
            that.selectedFeatures.splice(5, 1);
          }
          that.getFeaturesStatus();
        },
        error => {
          that.getFeaturesStatus();
          that.$toastr.error(error.body && error.body.message ?
            error.body.message : 'Error while getting features.');
        },
      );
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
a {
  text-decoration: none;
}
.position_relative {
  position: relative;
}

.icon_section {
  position: absolute;
  background-color: #fff;
  width: 25px;
  height: 96%;
  top: 0px;
  z-index: 9;
  cursor: pointer;
}
.left_icon {
  left: 16px;
  /*border-right: 1px solid #efefef;*/
  .icon {
    position: relative;
    top: 10px;
    left: 8px;
  }
}
.right_icon {
  right: 16px;
  /*border-left: 1px solid #efefef;*/
  .icon {
    position: relative;
    top: 10px;
    right: -10px;
  }
}
.navbar-style {
  background-color: #34537d;
}

.container-style {
  background-color: white;
}

.nav-tabs {
  border-bottom: 2px solid #ddd;
}

.x-hidden {
  overflow-x: hidden !important;
}

.active-style {
  font-weight: bold;
  border-bottom: 3px solid #1f95f2 !important;
  color: #4c8ce3 !important;
}

.nav-tabs > li.active > a,
.nav-tabs > li.active > a:focus,
.nav-tabs > li.active > a:hover {
  border-width: 0;
}

.nav-tabs > li > a {
  border: none;
  color: #666;
}

.nav-tabs > li.active > a,
.nav-tabs > li > a:hover {
  border: none;
  color: #4285f4 !important;
  background: transparent;
}

.nav-tabs > li > a::after {
  content: '';
  background: #4285f4;
  height: 2px;
  position: absolute;
  width: 100%;
  left: 0px;
  bottom: -1px;
  transition: all 250ms ease 0s;
  transform: scale(0);
}

.nav-tabs > li.active > a::after,
.nav-tabs > li:hover > a::after {
  transform: scale(1);
}

.tab-nav > li > a::after {
  background: #21527d none repeat scroll 0% 0%;
  color: #fff;
}

.tab-style {
  text-align: center;
  color: #959fa4;
  font-size: 12px;
  padding: 10px 0px 10px 0px;
  margin: 0 20px;
}

ul.nav {
  white-space: nowrap;
  overflow-x: visible;
  overflow-y: hidden;
  margin: 0 16px;
  display: block;
}

::-webkit-scrollbar {
  width: 0px;
  /* remove scrollbar space */
  height: 0px;
  background: transparent;
  /* optional: just make scrollbar invisible */
}

/* optional: show position indicator in red */

/*::-webkit-scrollbar-thumb {
    height: 0px;
}*/

ul.nav li {
  display: inline-block;
  float: none;
}

@media (max-width: 575px) {
}

@media (min-width: 576px) and (max-width: 767px) {
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
