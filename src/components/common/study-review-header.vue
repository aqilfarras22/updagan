<template>
  <ul class="nav nav-tabs" role="tablist">
    <li role="presentation" class="tab-style" :class="{'active-style': currentRoute === tab.route }" v-for="tab in tabList" v-on:click="changeRoute(tab)">
      <span class="tab_name">{{tab.name}}
        <span class="color_green" v-if="tab.index -1 < currentIndex"><i class="fa fa-check-circle" aria-hidden="true"></i></span>
      </span>
    </li>
  </ul>
</template>

<script>
  import _ from 'lodash';

  export default {
    name: 'study-review-header',
    data() {
      return {
        currentRoute: '',
        currentIndex: null,
        studyId: null,
        tabList: [
          { index: 1, name: 'Study Summary', route: 'study-summary' },
          { index: 2, name: 'Generate Prototype', route: 'generate-prototype' },
          { index: 3, name: 'Automated Documentation', route: 'documentation' },
          { index: 4, name: 'Approval', route: 'approval' },
        ],
      };
    },
    mounted() {
      this.studyId = this.$route.params.studyId;
      this.currentRoute = this.$router.currentRoute.name;
      if (this.currentRoute === 'study-approval-confirm') {
        this.currentRoute = 'study-summary';
      }
      this.currentIndex = _.findIndex(this.tabList, ['route', this.currentRoute]);
    },
    methods: {
      changeRoute(tab) {
        const currentRouteIndex = _.findIndex(this.tabList, ['route', this.currentRoute]);
        const nextRouteIndex = _.findIndex(this.tabList, ['route', tab.route]);
        if (currentRouteIndex > nextRouteIndex) {
          this.$router.push({ name: tab.route, params: { studyId: this.studyId } });
        }
      },
    },
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.active-style {
  font-weight: bold;
  color: #1f95f2 !important;
  .tab_name {
    border-bottom: 3px solid #1f95f2 !important;
  }
}
  .tab_name {
    padding: 12px 0;
    display: inline-block;
    margin: 0 20px;
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
    color: #4285F4 !important;
    background: transparent;
  }

  .nav-tabs > li > a::after {
    content: "";
    background: #4285F4;
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
  }
  ul.nav {
    white-space: nowrap;
    overflow-x: visible;
    overflow-y: hidden;
}
::-webkit-scrollbar {
    width: 0px;  /* remove scrollbar space */
    height: 0px;
    background: transparent;  /* optional: just make scrollbar invisible */
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
