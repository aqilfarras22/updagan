<template>
  <div id="wrapper">
    <!-- Sidebar -->
    <div id="sidebar-wrapper">
      <ul class="sidebar-nav">
        <!--<li class="sidebar-brand">
              <a href="#menu-toggle" id="menu-toggle" style="margin-top:20px;float:right;" > <i class="fa fa-bars " style="font-size:20px !Important;" aria-hidden="true"></i>
            </li>-->
        <li><i class="fa fa-bars" aria-hidden="true"></i> <span class="pl-10 display_none_xs">Dashboard</span></li>
        <li><i class="fa fa-user" aria-hidden="true"></i> <span class="pl-10 display_none_xs">Participants</span></li>
        <li><i class="fa fa-file-text" aria-hidden="true"></i> <span class="pl-10 display_none_xs">Documentation</span></li>
        <li><i class="fa fa-pencil-square-o" aria-hidden="true"></i> <span class="pl-10 display_none_xs">Modify Study</span></li>
        <li><i class="fa fa-cog" aria-hidden="true"></i> <span class="pl-10 display_none_xs">Study Settings</span></li>
      </ul>
    </div>
    <!-- /#sidebar-wrapper -->
    <!-- Page Content -->
  </div>
</template>

<script>
  export default {
    name: 'ParticipantSideMenu',
    data() {
      return {
      };
    },
    mounted() {
    },
    methods: {
    },
  };
</script>

<style scoped lang="scss">
  body {
    overflow-x: hidden;
 }

#wrapper {
  padding-left: 0;
  -webkit-transition: all 0.6s ease;
  -moz-transition: all 0.6s ease;
  -o-transition: all 0.6s ease;
  transition: all 0.6s ease;
}

#wrapper.toggled {
  padding-left: 200px;
}

#sidebar-wrapper {
  margin-top: 70px;
  z-index: 99;
  position: fixed;
  left: 250px;
  width: 0;
  height: 100%;
  margin-left: -250px;
  overflow-y: auto;
  background-color: rgba(30, 121, 199, 0.5) !important;
  -webkit-transition: all 0.5s ease;  
  transition: all 0.5s ease;
  border-right: 1px solid #e3e8eb; 
}

#wrapper.toggled #sidebar-wrapper {
  width: 0;
}

#page-content-wrapper {
  width: 100%;
  position: absolute;
  padding: 10px;
}

#wrapper.toggled #page-content-wrapper {
  position: absolute;
  margin-left:-250px;
}

/* Sidebar Styles */
.sidebar-nav {
  position: absolute;
  top: 20px;
  right:0px;
  width: 100%;
  margin: 0;
  padding: 0;
  list-style: none;
  font-size: 14px;
}

.sidebar-nav li {
  padding: 10px 25px;
  cursor: pointer;
}

.sidebar-nav li a {
  display: block;
  text-decoration: none;
  color: #fff;
}

.sidebar-nav li a:hover {
  text-decoration: none;
  color: #fff;
  background: #021620;
}

.sidebar-nav li a:active,
.sidebar-nav li a:focus {
  text-decoration: none;
}

.sidebar-nav > .sidebar-brand {
  height: 65px;
  font-size: 18px;
  line-height: 60px;
}

.sidebar-nav > .sidebar-brand a {
  color: #999999;
}

.sidebar-nav > .sidebar-brand a:hover {
  color: #fff;
  background: none;
}
.sidebar-nav {
  left: -5px;
}
.sr-only {
  position:absolute;
  width:1px;
  height:1px;
  padding:0;
  margin:-1px;
  overflow:hidden;
  clip:rect(0, 0, 0, 0);
  border:0
}
.sr-only-focusable:active,.sr-only-focusable:focus{
  position:static;
  width:auto;
  height:auto;
  margin:0;
  overflow:visible;
  clip:auto
}

@media(min-width:768px) {
  #wrapper {
    padding-left: 220px;
  }

  #wrapper.toggled {
      padding-left: 0;
  }

  #sidebar-wrapper {
    width: 200px;
  }

  #wrapper.toggled #sidebar-wrapper {
    width: 40px;
  }

  #wrapper.toggled span {
    visibility:hidden;
  }

  #wrapper.toggled i {
    text-align: center;
  }

  #page-content-wrapper {
    padding: 20px;
    position: relative;
  }

  #wrapper.toggled #page-content-wrapper {
    position: relative;
    margin-right: 0;
  }
}


@media(max-width:768px) {

  #wrapper.toggled #page-content-wrapper {
    position: absolute;
    margin-right:60px;
  }

  #wrapper.toggled {
    padding-right: 60px;
  }

  #wrapper {
    padding-left: 20px;
  }

  #wrapper.toggled {
    padding-left: 0;
  }

  #sidebar-wrapper {
    width: 50px;
  }

  #wrapper.toggled #sidebar-wrapper {
    width: 140px;
  }
      
  #wrapper.toggled span {
    visibility:visible;
    position:relative;
    left:70px;
    bottom:13px;
  }

  #wrapper span {
    visibility:hidden;
  }
  #wrapper.toggled i {
    text-align: center;
  } 
  
  #wrapper i {
    text-align: center;
  } 

  #wrapper.toggled #page-content-wrapper {
    position: relative;
    margin-right: 0;
  }
  .sidebar-nav li a:hover {
    background: none !important;
  }
}

</style>