<template>
  <div class="main_bg">
    <mainHeader></mainHeader>
    <sideMenu :studyData="{}"></sideMenu>
    <div class="has-sidemenu">
      <div class="container-fluid">
        <div class="row">
          <div class="col-lg-12">
            <div class="participant-header">
              <div class="row">
                <h3 class="white-color pb-15 pl-15">Care Study's Participants</h3>
                <div class="col-xs-12 col-sm-4 col-md-2 col-lg-2 mob-pl0">
                  <div class="form-group has-feedback">
                    <span class="fa fa-search form-control-feedback search-Icon"></span>
                    <input type="text" class="form-control br-30 search-pad" placeholder="Search...">
                  </div>
                </div>
                <div class="col-xs-6 col-sm-4 col-md-2 col-lg-2 mob-pl0">
                  <select class="form-control select-style br-30 input-bg">
                    <option>Sort</option>
                    <option>Registartion date</option>
                    <option>ID number ascending</option>
                    <option>ID number descending</option>
                  </select>
                </div>
                <div class="col-xs-6 col-sm-4 col-md-2 col-lg-2 ">
                  <select class="form-control select-style br-30 input-bg">
                    <option>Filters</option>
                    <option>Acitve</option>
                    <option>Deactivated</option>
                    <option>Partcipating</option>
                    <option>In other studies</option>
                  </select>
                </div>
                <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3  col-sm-offset-0 col-md-offset-3 col-lg-offset-3 mob-pl0 mob-pt15 align-right">
                  <span class="fa-stack fa-lg cursor_pointer " data-toggle="modal" data-target="#export-participant-modal">
              <i class="fa fa-circle fa-stack-2x icon-bg"></i>
              <i class="fa fa-sign-out fa-stack-1x font-size35 margin-right0 icon-color line-height40"></i>
            </span>
                </div>
              </div>
              <div class="row">
                <div class="col-md-12 mob-pl0">
                  <p class="white-color mar0">There are 3 participants in your study</p>
                </div>
              </div>
            </div>
            <div class="col-sm-12 col-md-12 col-lg-12 col-xs-12">
              <div class="table-column">
                <div class="table-column-content">
                  <div class="row padding_lr_15px">
                    <table class="table table-hover table-striped">
                      <thead>
                        <tr>
                          <th>ID number</th>
                          <th class="xs-none">Registration date</th>
                          <th class="xs-none">Status</th>
                          <th>View</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>4567</td>
                          <td class="xs-none">12/4/2016</td>
                          <td class="xs-none">John</td>
                          <td class="view-color" v-on:click="viewParticipant()">View/Edit</td>
                        </tr>
                        <tr>
                          <td>7878</td>
                          <td class="xs-none">12/4/2016</td>
                          <td class="xs-none">Mary</td>
                          <td class="view-color">View/Edit</td>
                        </tr>
                        <tr>
                          <td>8545</td>
                          <td class="xs-none">12/4/2016</td>
                          <td class="xs-none">Dooley</td>
                          <td class="view-color">View/Edit</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div id="export-participant-modal" class="modal modal-position fade" role="dialog">
      <div class="modal-dialog">

        <!-- Modal content-->
        <div class="modal-content col-lg-8 col-lg-offset-2">
          <button type="button" class="close close-style" data-dismiss="modal" v-on:click="downloadAgain">&times;</button>
          <h4 class="modal-text">Export Participant List</h4>
          <div class="modal-body modal-style">
            <p class="mb-40 modal-info">Download participant list in .csv format. If you have any filters applied, this will only download the participants
              that fit those filters. </p>
          </div>
          <div v-if="!downloadStarted">
            <div class="col-lg-12">
              <form>
                <div class="form-group mb-8">
                  <input type="password" v-validate="'required|min:8'" name="password" :class="{'input': true, 'is-danger': errors.has('password'), 'is-success': !errors.has('password') }"
                    class="form-control form-control-lg" v-model="user.password" placeholder="Enter password" required>
                  <span v-show="errors.has('password')" class="error-style">{{ errors.first('password') }}</span>
                </div>
                <router-link :to="{ name: 'forgotPassword'}">Forgot Password?</router-link>
                <div class="form-group mt-30">
                  <div v-if="errors.any()">
                    <button class="btn btn-lg btn-block btn-disabled" :disabled="errors.any()">Download</button>
                  </div>
                  <div v-if="!errors.any()">
                    <button type="button" class="btn btn-info btn-lg btn-block" v-on:click="download">Download</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div v-if="downloadStarted">
            <div class="download-style"><i class="fa fa-download font-size40" aria-hidden="true"></i><br>Download started!</div>
            <div class="form-group">
              <button class="btn btn-lg btn-block btn-info" v-on:click="downloadAgain">Download again</button>
            </div>
          </div>
          <div class="footer-close-style" v-on:click="downloadAgain" data-dismiss="modal">Close</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  // import jwt from 'jwt-decode';
  import mainHeader from '../common/main-header';
  import sideMenu from '../common/participant-sidemenu';

  export default {
    name: 'Participants',
    data() {
      return {
        user: {
          email: '',
          password: null,
        },
        downloadStarted: false,
      };
    },
    mounted() {

    },
    methods: {
      viewParticipant() {
        this.$router.push({ name: 'study-participant-details' });
      },
      loginUser() {
      },
      download() {
        this.downloadStarted = true;
      },
      downloadAgain() {
        this.downloadStarted = false;
        this.user.password = null;
        this.errors.clear();
      },
    },
    components: { mainHeader, sideMenu },
  };
</script>

<style scoped lang="scss">

// Style for quick fixes bootstrap after migration (before redesign should be removed)

body{
  color: #333;
}

.h2, h2 {
    font-size: 30px;
    margin: 20px 0 10px;
}

.h3, h3{
  font-size:24px;  
  color: #333;
}

.h4, h4 {
    font-size: 18px;
    margin: 10px 0;
}

.h5, h5 {
    font-size: 14px;
    margin: 10px 0;
}

.h6, h6 {
  font-size: 12px;
  margin: 10px 0;
  color: #333;
}

.btn{
  font-size: 14px;
}

.col-xs-12 {
    width: 100%;
}

.col-xs-1, .col-xs-2, .col-xs-3, .col-xs-4, .col-xs-5, .col-xs-6, .col-xs-7, .col-xs-8, .col-xs-9, .col-xs-10, .col-xs-11, .col-xs-12 {
    float: left;
    //flex: none;
    display: block;
}

.col-lg-1, .col-lg-2, .col-lg-3, .col-lg-4, .col-lg-5, .col-lg-6, .col-lg-7, .col-lg-8, .col-lg-9, .col-lg-10, .col-lg-11, .col-lg-12, .col-md-1, .col-md-2, .col-md-3, .col-md-4, .col-md-5, .col-md-6, .col-md-7, .col-md-8, .col-md-9, .col-md-10, .col-md-11, .col-md-12, .col-sm-1, .col-sm-2, .col-sm-3, .col-sm-4, .col-sm-5, .col-sm-6, .col-sm-7, .col-sm-8, .col-sm-9, .col-sm-10, .col-sm-11, .col-sm-12, .col-xs-1, .col-xs-2, .col-xs-3, .col-xs-4, .col-xs-5, .col-xs-6, .col-xs-7, .col-xs-8, .col-xs-9, .col-xs-10, .col-xs-11, .col-xs-12 {
    position: relative;
    min-height: 1px;
    padding-right: 15px;
    padding-left: 15px;
}

.col-xs-10 {
    width: 83.33333333%;
}

.panel-default {
    border-color: #ddd;
}

.panel {
    margin-bottom: 20px;
    background-color: #fff;
    border: 1px solid #ddd;    
    border-radius: 4px;
    box-shadow: 0 1px 1px rgba(0,0,0,.05);
}

.row{
  display: block;
  
  &:after{
  content: '';
    clear: both;
    display: block;
  }
}

.search-field{
  padding-right: 30px;
  background-image: url('/static/img/icon-search.gif');
  background-repeat: no-repeat;
  background-position: 97% 50%; 
}

@media (min-width: 768px){
  .col-sm-1, .col-sm-2, .col-sm-3, .col-sm-4, .col-sm-5, .col-sm-6, .col-sm-7, .col-sm-8, .col-sm-9, .col-sm-10, .col-sm-11, .col-sm-12 {
      float: left;      
      display: block;
  }
  .col-sm-12 {
      width: 100%;
  }
  .col-sm-10 {
    width: 83.33333333%;
  }
  .col-sm-4 {
    width: 33.33333333%;
    max-width: 33.33333333%;
  }
  .col-md-2{
    flex: none;
  }    
}


@media (min-width: 992px){
  .col-md-1, .col-md-2, .col-md-3, .col-md-4, .col-md-5, .col-md-6, .col-md-7, .col-md-8, .col-md-9, .col-md-10, .col-md-11, .col-md-12 {
      float: left;
      flex: none;
  }
  .col-md-2 {
    width: 16.66666667%;
  }
  .col-md-10 {
    width: 83.33333333%;
  }
  .col-md-12 {
      width: 100%;
  }    
}

@media (min-width: 1200px){
  .col-lg-1, .col-lg-2, .col-lg-3, .col-lg-4, .col-lg-5, .col-lg-6, .col-lg-7, .col-lg-8, .col-lg-9, .col-lg-10, .col-lg-11, .col-lg-12 {
    float: left;    
    display: block;
  }
  .col-lg-2 {
    width: 16.66666667%;
  }
  .col-lg-10 {
    width: 82.33333333%;
  }
  .col-lg-11 {
    width: 91.66666667%;
  }  
}

// END of style for quick fixes bootstrap after migration (before redesign should be removed) 

  .main-content {
    width: 100%;
  }

  .table-column-content {
    width: 100%;
    background-color: #F5F9FC;
    height: 75vh;
    color: #4a4a4a;
  }

  .input-bg {
    background: #195877;
    color: #fff;
  }

  .icon-bg {
    color: #ffffff;
  }

  .icon-color {
    color: #00BAF9;
  }


  .view-color {
    color: #00b1ff;
    cursor: pointer;
  }


  .footer-close-style {
    color: #00BAF9;
    margin-bottom: 15px;
    text-align: center;
    cursor: pointer;
  }

  .download-style {
    color: #00BAF9;
    text-align: center;
    font-size: 16px;
    padding-bottom: 20px;
  }

  .modal-text {
    color: #00BAF9;
    padding: 15px 0 0px 10px;
    font-size: 24px;
  }
  .modal-style {
    /*padding: 10px 40px 20px 20px;*/
    font-size: 16px;
  }

  .modal-info {
    color: #535456;
  }

  .link-color {
    color: #1d7fee;
  }

  .modal-position {
    top: 150px !important;
    right: 100px;
  }


  @media (max-width: 575px) {

    .xs-none {
      display: none;
    }
     .mob-pl0{
      padding-left: 0px;
    }
    .mob-pt15{
      padding-top: 15px;
    }
  }

  @media (min-width: 576px) and (max-width: 767px) {
    .mob-pl0{
      padding-left: 0px;
    }
    .mob-pt15{
      padding-top: 15px;
    }
  }

  @media (min-width: 768px) and (max-width: 991px) {

  }

  @media (min-width: 992px) and (max-width: 1199px) {

  }

  @media (min-width: 1200px) {
    .align-right {
      text-align: right;
    }
  }
</style>
