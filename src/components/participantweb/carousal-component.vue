<template>
    <div>
  <div class="carousel">
    <ul class="slides">
      <input type="radio" v-on:change="img1Function" name="radio-buttons" id="img-1" checked />
      <li class="slide-container">
        <div class="slide-image">
                <div class="question_title">
                    <h2 class="heading-slide-one-web">Getting started with building your participant enrollment website</h2>
                </div> 
                <div class="body-container-web">
                    <div class="para-one-web">
                        <p class="title-slide-one-web">A step-by-step process to building and launching your participant enrollment website</p>
                    </div>
                    <div class="para-two-web">
                     This tutorial provides guidance on how to build and launch your customized participant enrollment website using THREAD’s self-guided step-by-step configurator. Once published, you will be able to easily screen and register participants for your study, including the ability to auto-invite participants.
                    </div>
                  <div class="cardboard-container">
                      <img class="cardboard-icon-web" src="static/img/participant-web-img/box-in.png">
                  </div>
                  <div class="home-icon-container-web">
                    <div class="home-icon-web">
                      <img src="static/img/participant-web-img/carousel-img.svg">
                    </div>
                  </div>
                </div>
                <div class="clearfix"></div>
                <div class="slide-btn-container text-center button-container">
                    <button v-on:click="nextfunction(true)" class="btn button-web btn-md btn-info btn-style ">Next</button>
                </div>
        </div>
        <div class="carousel-controls">
          <label for="img-2" class="next-slide">
            <span>&rsaquo;</span>
          </label>
        </div>
      </li>

      <!-- ---------------------------- slide 2 ------------------------ -->
      
      <input type="radio" v-on:change="img2Function" name="radio-buttons" id="img-2" />
      <li class="slide-container">
         <div class="slide-image">
                <div class="question_title_two">
                    <h2 class="heading-slide-three-web mb-20">Configure and build your participant enrollment website</h2>
                </div> 
                <div class="body-container-web-2">
                  <div class="row heading-slide-2">
                      Build your participant enrollment website in five easy steps:

                  </div>
                  <div class="row">
                    <div class="col-lg-1"></div>
                    <div class="icon-1-div-slide-2 align-content-icons">
                      <div class="number-icon-container icon-div">
                        1
                      </div>
                    </div>
                     <div class="icon-2-div-slide-2 align-content-icons"><div class="number-icon-container icon-div">
                        2
                      </div></div>
                      <div class="icon-3-div-slide-2 align-content-icons"><div class="number-icon-container icon-div">
                        3
                      </div></div>
                       <div class="icon-4-div-slide-2 align-content-icons"><div class="number-icon-container icon-div">
                        4
                      </div></div>
                        <div class="icon-5-div-slide-2 align-content-icons"><div class="number-icon-container icon-div">
                        5
                      </div></div>
                        <div class="col-lg-1"></div>
                  </div>
                  <div class="row">
                    <div class="slide-2-body-div-1 text-center">
                      <div class="slide-3-body-heading">Global Elements</div>
                      <div class="slide-3-body-content">Provide items that will remain on your site as enrollees move through your site, such as header, footer, logo, colors, etc.</div>
                     
                    </div>
                     <div class="horizontal-line-1-slide-2"></div>
                     <div class="slide-2-body-div-2 text-center">
                       <div class="slide-3-body-heading">Homepage</div>
                      <div class="slide-3-body-content">Customize the landing page, including a featured area with up to three callouts</div>
                      
                      </div>
                      <div class="horizontal-line-2-slide-2"></div>
                      <div class="slide-2-body-div-3 text-center">
                        <div class="slide-3-body-heading">Eligibility Screening</div>
                      <div class="slide-3-body-content">Provide eligibility questions to screen your potential participants</div>
                      
                      </div>
                      <div class="horizontal-line-3-slide-2"></div>
                       <div class="slide-2-body-div-4 text-center">
                         <div class="slide-3-body-heading">Agreement</div>
                      <div class="slide-3-body-content">Include content for the enrollee to agree to in order to participate in your study</div>
                     
                      </div>
                         <div class="horizontal-line-4-slide-2"></div>
                        <div class="slide-2-body-div-5 text-center"><div class="slide-3-body-heading">Registration</div>
                      <div class="slide-3-body-content">Configure what registration information your enrollee should fill out if they pass the eligibility requirements</div></div>
                  </div>
                   
                </div>
                <div class="clearfix"></div>
                <div class="slide-btn-container text-center button-container">
                        <button v-on:click="nextfunction(true)" class="btn button-web-slide-2 btn-md btn-info btn-style ">Next</button>
                </div>
        </div>
        <div class="carousel-controls">
          <label for="img-1" class="prev-slide">
            <span>&lsaquo;</span>
          </label>
          <label for="img-3" class="next-slide">
              <span>&rsaquo;</span>
          </label>
        </div>
      </li>

      <!-- ------------------------- slide 3 ---------------- -->

      <input type="radio" v-on:change="img3Function" name="radio-buttons" id="img-3" />
      <li class="slide-container">
         <div class="slide-image">
                <div class="question_title_two">
                    <h2 class="heading-slide-three-web">Preview and publish your participant enrollment website</h2>
                </div> 
                <div class="body-container-web-3">
                  <div class="row heading-slide-3">
                      Publishing your participant enrollment website

                  </div>
                  
                  <div class="row">
                    <div class="body-content-div-one-slide-3">
                      
                        <div class="slide-3-body-heading">Preview</div>
                        <div class="slide-3-body-content">Once you have completed building your website, you can preview it by clicking the Preview button in the top-right corner.</div>
                      
                      
                    </div>
                    <div class="body-content-div-two-slide-3">
                      <div class="">
                      <img class="cardboard-icon-web" src="static/img/participant-web-img/slide-3-image-1.png">
                  </div>
                    </div>
                    <div class="horizontal-line"></div>
                    <div class="body-content-div-three-slide-3">
                      <div class="slide-3-body-heading">Publish</div>
                      <div class="slide-3-body-content-google">When you are ready, click Publish in the top-right corner. In order to publish your website, you will need the following items:
                      </div>
                      <div class="slide-3-body-content-google1 mt-20">Your custom domain website address, along with access to your DNS provider
                      </div>
                      <div class="slide-3-body-content-google3 mt-20">
                        Your Google Analytics ID (optional)
                      </div>
                    </div>
                    <div class="body-content-div-four-slide-3">
                      <div class="">
                      <img class="cardboard-icon-web" src="static/img/participant-web-img/slide-3-image-2.png">
                  </div>
                    </div>
                    
                  </div>
                   
                </div>
                <div class="clearfix"></div>
                <div class="slide-btn-container text-center button-container">
                  <button v-on:click="nextfunction(true)" class="btn button-web-slide-3 btn-md btn-info btn-style ">Next</button>
                </div>
        </div>
        <div class="carousel-controls">
          <label for="img-2" class="prev-slide">
            <span>&lsaquo;</span>
          </label>
          <label for="img-4" class="next-slide">
            <span>&rsaquo;</span>
          </label>
        </div>
      </li>

      <!--  ------------------------------ slide 4 ----------- -->

      <input type="radio" v-on:change="img4Function" name="radio-buttons" id="img-4" />
      <li class="slide-container">
         <div class="slide-image">
                <div class="question_title_two">
                    <h2 class="heading-slide-three-web">Edit your participant enrollment website</h2>
                </div> 
                <div class="body-container-web-4">
                  <div class="row heading-slide-3">
                      Editing your participant enrollment website
                  </div>
                  <div class="">
                    <!-- <div class="col-lg-2"></div> -->
                    <div class="slide-4-content-left">
                        <div>To edit your website, click Edit in the section you wish to edit. Then click Publish to publish your changes. Any saved changes will immediately be made live. 
                        </div>
                    </div>
                    <!-- <div class="col-lg-5"> -->
                      <div class="slide-4-img-container ml-20">
                      <img class="cardboard-icon-web" src="static/img/participant-web-img/slide-4-img.png">
                  </div>
                    <!-- </div> -->
                   <div class="col-lg-2"></div>
                  </div>
                </div>
                <div class="clearfix"></div>
                <div class="slide-btn-container text-center button-container">
                    <button v-on:click="nextfunction(true)" class="btn button-web-slide-4 btn-md btn-info btn-style ">Next</button>
                  
                </div>
        </div>
        <div class="carousel-controls">
          <label for="img-3" class="prev-slide">
            <span>&lsaquo;</span>
          </label>
          <label for="img-5" class="next-slide">
            <span>&rsaquo;</span>
          </label>
        </div>
      </li>

      <!-- -------------------- slide 5 ------------------------- -->

      <input type="radio" v-on:change="img5Function" name="radio-buttons" id="img-5" />
      <li class="slide-container">
         <div class="slide-image">
                <div class="question_title_two">
                    <h2 class="heading-slide-three-web">You’re all set!</h2>
                </div> 
                <div class="body-container-web-5">
                  <div class="row heading-slide-3">
                      <div class="">
                      <div class="number-icon-container-slide-5">
                        <img class="thumb-icon-web" src="static/img/participant-web-img/slide-5-img-2.png">
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-lg-2"></div>
                    <div class="slide-5-content-left">
                      <div class="slide-5-body-heading mb-15 text-center">What’s next?</div>
                        <div class="slide-5-body-content text-center">Now that you’ve created your participant enrollment website, you’ll be ready to start sending potential participants to your site, once your study is live.  
                        </div>
                    </div>
                    <div class="horizontal-line-slide-5"></div>
                    <div class="slide-5-content-right">
                      <div class="slide-5-body-heading mb-15 text-center">Need Assistance?</div>
                      <div class="slide-5-body-content text-center">If you need help creating your website or just have questions, please feel free to browse our knowledge base or reach out to our 24/7 support team from the
<a href="https://thread.zendesk.com/hc/en-us/restricted?return_to=https%3A%2F%2Fthread.zendesk.com%2Fhc%2Fen-us" class="link-color">THREAD Support website.</a>

</div>
                    </div>
                   <div class="col-lg-2"></div>
                    
                  </div>
                    
                </div>
                
                <div class="clearfix"></div>
                <div class="slide-btn-container text-center button-container">
                        <button v-on:click="closeTutorial(false)" class="btn button-web-slide-5 btn-md btn-info btn-style ">Close</button>
                </div>
        </div>
        <div class="carousel-dots">
        <label for="img-1" :class="[img1 ? 'carousel-dot' : 'unselected-carousel-dot']" id="img-dot-1"></label>
        <label for="img-2" :class="[img2 ? 'carousel-dot' : 'unselected-carousel-dot']" id="img-dot-2"></label>
        <label for="img-3" :class="[img3 ? 'carousel-dot' : 'unselected-carousel-dot']" id="img-dot-3"></label>
        <label for="img-4" :class="[img4 ? 'carousel-dot' : 'unselected-carousel-dot']" id="img-dot-4"></label>
        <label for="img-5" :class="[img5 ? 'carousel-dot' : 'unselected-carousel-dot']" id="img-dot-5"></label>
      </div>
        <div class="carousel-controls">
          <label for="img-4" class="prev-slide">
            <span>&lsaquo;</span>
          </label>
        </div>
      </li>
      
    </ul>
  </div>
</div>
</template>


<script>
export default {
  name: "carousel component",
  data() {
    return {
      nextClick : false,
      closeCarousel: false,
      img1: true,
      img2: false,
      img3: false,
      img4: false,
      img5: false,
    };
  },
  methods: {
    img1Function(e) {
      if(e.target.checked) {
        this.img1 = true
        this.img2 = false
        this.img3 = false
        this.img4 = false
        this.img5 = false
      }
    },
    img2Function(e) {
      if(e.target.checked) {
        this.img2 = true
        this.img1 = false
        this.img3 = false
        this.img4 = false
        this.img5 = false
      }
    },
    img3Function(e) {
      if(e.target.checked) {
        this.img3 = true
        this.img2 = false
        this.img1 = false
        this.img4 = false
        this.img5 = false
      }
    },
    img4Function(e) {
      if(e.target.checked) {
        this.img4 = true
        this.img2 = false
        this.img3 = false
        this.img1 = false
        this.img5 = false
      }
    },
img5Function(e) {
      if(e.target.checked) {
        this.img5 = true
        this.img2 = false
        this.img3 = false
        this.img4 = false
        this.img1 = false
      }
    },




    closeTutorial(val) {
       this.$emit("cauroselActive", val);
      // this.closeCarousel = val;
    },
    skiptutorial(){
      console.log("skip tutorial");
    },
    nextfunction(nextval){
      this.nextClick = true;
      console.log("next clicked");
  
    }
  }
};
</script>
<style scoped>
.carousel {
    margin-left: 15%;
    margin-right: 15%;
    background-color: white !important;
    z-index: 1000;
    width: 954px;
}

ul.slides {
    height: 600px;
    padding: 0;
}

.slides * {
    user-select: none;
    -ms-user-select: none;
    -moz-user-select: none;
    -khtml-user-select: none;
    -webkit-user-select: none;
    -webkit-touch-callout: none;
    /* background-color: #fff; */
}

ul.slides input {
    display: none; 
}

.link-color {
  color: #d1dceb;
  text-decoration: underline;
}

.slide-container { 
    display: block; 
}

.slide-image {
    display: block;
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    opacity: 0;
    transition: all .7s ease-in-out;
}   

.slide-image img {
    width: auto;
    min-width: 100%;
}

.carousel-controls {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 999;
    font-size: 100px;
    line-height: 600px;
    color: transparent;
}
.slide-3-body-heading{
  font-family: RobotoBold;
  font-size: 16px;
  line-height: 24px;
  margin-bottom: 15px;
  color: #fff;
}
.slide-3-body-content {
  font-family: RobotoRegular;
  font-size: 14px;
  line-height: 20px;
  color: #d1dceb;
  width: 164px;
  height: 120px;
}
.slide-3-body-content-google {
  font-family: RobotoRegular;
  font-size: 14px;
  line-height: 20px;
  color: #d1dceb;
  width: 215px;
}
.slide-3-body-content-google1 {
  font-family: RobotoRegular;
  font-size: 14px;
  line-height: 20px;
  color: #d1dceb;
  width: 218px;
}
.slide-3-body-content-google3 {
  font-family: RobotoRegular;
  font-size: 14px;
  line-height: 20px;
  color: #d1dceb;
  width: 220px;
}
.carousel-controls label {
    display: none;
    position: absolute;
    padding: 0 20px;
    opacity: 0;
    transition: opacity .2s;
    cursor: pointer;
}

.slide-image:hover + .carousel-controls label{
    opacity: 0.5;
}

.carousel-controls label:hover {
    opacity: 1;
}

.carousel-controls .prev-slide {
    width: 20%;
    text-align: left;
    left: 0;
}

.carousel-controls .next-slide {
    width: 60%;
    text-align: right;
    right: 0;
}
.next-slide{
  width: 20%;
    text-align: right;
    right: 0;
    color: transparent;
}

.carousel-dots {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 6%;
    z-index: 999;
    text-align: center;
}
.carousel-dot{
      display: inline-block;
    border-radius: 50%;
    opacity: 1;
    margin: 10px 10px 8px 10px;
    width: 14px;
    height: 14px;
    background-color: #4c8ce3;
}

.unselected-carousel-dot {
    display: inline-block;
    border-radius: 50%;
    opacity: 1;
    margin: 10px;
    width: 10px;
    height: 10px;
    border: solid 2px #d3dee3;
}

.carousel-dots .carousel-dot {
   display: inline-block;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background-color: #4c8ce3;
    margin: 10px 10px 8px 10px;
    border: 1px solid #d3dee3;
    cursor: pointer;
}
.carousel-dots .unselected-carousel-dot {
   display: inline-block;
    border-radius: 50%;
    margin: 10px;
    cursor: pointer;
    width: 10px;
    height: 10px;
    border: solid 2px #d3dee3;
}

input:checked + .slide-container .slide-image {
    opacity: 1;
    transform: scale(1);
    transition: opacity 1s ease-in-out;
}

input:checked + .slide-container .carousel-controls label {
     display: block; 
}

input#img-1:checked ~ .carousel-dots label#img-dot-1,
input#img-2:checked ~ .carousel-dots label#img-dot-2,
input#img-3:checked ~ .carousel-dots label#img-dot-3,
input#img-4:checked ~ .carousel-dots label#img-dot-4,
input#img-5:checked ~ .carousel-dots label#img-dot-5,
input#img-6:checked ~ .carousel-dots label#img-dot-6 {
	opacity: 1;
}

#myCarousel {
  background-color: blue;
}
.container {
    width: 100px;
  height: 100px;
  position: relative;
  margin-left: 200px;
}
.carousel-indicators li {
  width: 0 !important;
  height: 0 !important;
}
.body-container-web {
  width: 954px;
  position: relative;
  height: 260px;
  background-color: #668bbd;
  top: 110px;
  color: #fff;
}
.body-container-web-3 {
  position: relative;
  height: 340px;
  background-color: #668bbd;
  top: 110px;
  bottom: 219px;
  color: #fff;
}
.body-container-web-4 {
  position: relative;
  height: 340px;
  background-color: #668bbd;
  top: 110px;
  color: #fff;
}
.body-container-web-5 {
  position: relative;
  height: 300px;
  background-color: #668bbd;
  top: 110px;
  bottom: 219px;
  color: #fff;
}
.number-icon-container-slide-5 {
  position: absolute;
  width: 60px;
  height: 60px;
  background-color: #f4ab37;
  top: 29px;
  left: 456px;
  border-radius: 50%;
  align-items: center;
  text-align: center;

}
.thumb-icon-web {
  width: 30.4px;
  height: 29px;
  object-fit: contain;
  position: absolute;
  top: 13px;
  left: 3px;
}
.slide-5-content-right {
  position: absolute;
  width: 315px;
  height: 139px;
  font-size: 14px;
  line-height: 1.43;
  color: #d1dceb;
  top: 94px;
  left: 563px;
}
.slide-5-content-left {
  position: absolute;
  width: 314px;
  height: 104px;
  font-size: 14px;
  line-height: 1.43;
  color: #d1dceb;
  top: 94px;
  left: 99px;
}
.slide-5-body-heading {
  font-family: RobotoBold;
  font-size: 18px;
  color: #fff;
}
.body-container-web-2 {
  position: relative;
  height: 300px;
  background-color: #668bbd;
  top: 110px;
  bottom: 219px;
  color: #fff;
}
.slide-2-body-div-1 {
  position: absolute;
  width: 155px;
  height: 166px;
  top: 127px;
  margin-left: 20px;
}
.slide-2-body-div-2 {
  position: absolute;
  width: 155px;
  height: 166px;
  top: 127px;
  left: 217px;
}
.slide-2-body-div-3 {
  position: absolute;
  height: 166px;
  top: 127px;
  left: 402px;
}
.horizontal-line {
  display: inline-block;
  width: 1px;
  height: 250px;
  border: 1px solid #99BBE9;;
  position: absolute;
  left: 460px;
  top: 73px;
}
.horizontal-line-slide-5 {
  display: inline-block;
  width: 1px;
  height: 145px;
  border: 1px solid #99BBE9;;
  position: absolute;
  left: 485px;
  top: 120px;
}
.horizontal-line-1-slide-2{
   display: inline-block;
  width: 1px;
  height: 155px;
  border: 1px solid #99BBE9;;
  position: absolute;
  left: 200px;
  top: 127px;
}
.horizontal-line-2-slide-2{
   display: inline-block;
  width: 1px;
 height: 155px;
  border: 1px solid #99BBE9;;
  position: absolute;
  left: 390px;
  top: 127px;
}
.horizontal-line-3-slide-2{
   display: inline-block;
  width: 1px;
  height: 155px;
  border: 1px solid #99BBE9;;
  position: absolute;
  left: 570px;
  top: 127px;
}
.horizontal-line-4-slide-2{
   display: inline-block;
  width: 1px;
  height: 155px;
  border: 1px solid #99BBE9;;
  position: absolute;
  left: 760px;
  top: 127px;
}
.slide-2-body-div-4 {
  position: absolute;
  width: 155px;
  height: 166px;
  top: 127px;
  left: 584px;
}
.slide-2-body-div-5 {
  position: absolute;
  width: 155px;
  height: 166px;
  top: 127px;
  left: 772px;
}
.heading-slide-2 {
  font-family: RobotoBold;
  font-size: 18px;
  font-weight: bold;
  line-height: 1.28;
  color: #ffffff;
  padding-top: 18px;
    padding-left: 223px;
    margin-bottom: 12px;
}
.heading-slide-3 {
  font-family: RobotoBold;
  font-size: 18px;
  font-weight: bold;
  line-height: 1.28;
  color: #ffffff;
  padding-top: 18px;
    padding-left: 271px;
    margin-bottom: 12px;
}
.slide-btn-container[data-v-dfe36104] {
    position: absolute;
    top: 442px;
    bottom: 98px;
    left: 416px;
    right: 386px;
    height: 45px !important;
}
.button-web {
    width: 152px !important;
    height: 40px !important;
    font-family: RobotoRegular;
    font-size: 14px;
    line-height: 1.43;
    color: #ffffff;
    border-radius: 25px !important;
    z-index: 1002;
    margin-top: 180px;
}
.button-web-slide-4 {
    width: 152px !important;
    height: 40px !important;
    font-family: RobotoRegular;
    font-size: 14px;
    line-height: 1.43;
    color: #ffffff;
    border-radius: 25px !important;
    z-index: 1002;
    margin-top: 140px;
}
.button-web-slide-5 {
    width: 152px !important;
    height: 40px !important;
    font-family: RobotoRegular;
    font-size: 14px;
    line-height: 1.43;
    color: #ffffff;
    border-radius: 25px !important;
    z-index: -1;
    margin-top: 140px;
}
.button-web-slide-2 {
  width: 152px !important;
    height: 40px !important;
    font-family: RobotoRegular;
    font-size: 14px;
    line-height: 1.43;
    color: #ffffff;
    border-radius: 25px !important;
    z-index: 1002;
    margin-top: 140px;
}
.button-web-slide-3 {
  width: 152px !important;
    height: 40px !important;
    font-family: RobotoRegular;
    font-size: 14px;
    line-height: 1.43;
    color: #ffffff;
    border-radius: 25px !important;
    z-index: 1002;
    margin-top: 140px;
}
.body-content-div-one-slide-3 {
  width: 176px;
  height: 145px;
  position: absolute;
  top: 73px;
  left: 82px;
}
.body-content-div-two-slide-3 {
  width: 164px;
  height: 164px;
  object-fit: contain;
  position: absolute;
  top: 83px;
  left: 280px;
}
.body-content-div-three-slide-3 {
  width: 212px;
  position: absolute;
  top: 73px;
  left: 496px;
}
.body-content-div-four-slide-3 {
 width: 164px;
  height: 164px;
  object-fit: contain;
  position: absolute;
  top: 83px;
  left: 727px;
}
.slide-4-content-left {
  position: absolute;
  width: 223px;
  height: 187px;
  font-family: RobotoRegular;
  font-size: 14px;
  line-height: 1.43;
  color: #d1dceb;
  top: 83px;
  left: 235px;
}
.slide-4-img-container {
  width: 246px;
  height: 246px;
  position: absolute;
  top: 56px;
  left: 475px;
}
.slide-4-img-container img {
  width: 260px !important;
  height: 260px;
  
}
.home-icon-web {
  width: 259.8px;
  height: 303.6px;
  object-fit: contain;
}
.home-icon-container-web {
  position: absolute;
  top: 92px;
  bottom: 184px;
  left: 620px;
  right: 56px;
  margin-top: -130px;
}
.para-one-web {
  position: absolute;
  top: 135px;
  bottom: 402px;
  left: 65px;
  right: 545px;
}
.para-two-web {
    margin-top: 85px;
    position: absolute;
    margin-left: 65px;
    width: 342px;
    height: 106px;
    opacity: 0.7;
    font-family: RobotoRegular;
    font-size: 16px;
    line-height: 1.33;
    color: #ffffff;
}

.heading-slide-one-web {
  text-align: center;
  height: 32px;
  font-family: RobotoRegular;
  font-size: 24px;
  font-weight: bold;
  line-height: 1.33;
  color: #666669;
}
.heading-slide-three-web {
  text-align: center;
  height: 32px;
  font-family: RobotoBold;
  font-size: 24px;
  font-weight: bold;
  line-height: 1.33;
  color: #666669;
  width: 791px;
}
.cardboard-icon-web {
  width: 200px !important;
  height: 200px;
  object-fit: contain;
  margin-left: -22px;
}
.cardboard-container {
  position: absolute;
  top: 178px;
  bottom: 251px;
  left: 457px;
  right: 319px;
  margin-top: -130px;
}
.title-slide-one-web {
    width: 387px;
    font-family: RobotoRegular;
    font-size: 18px;
    font-weight: bold;
    line-height: 1.28;
    color: #ffffff;
    margin-top: -110px;
}
.panel-default {
  border-color: #ddd;
  width: 954px;
  height: 580px;
  border-radius: 3px;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.2);
  background-color: #ffffff;
}
.panel {
  border-radius: 2px;
  margin-bottom: 10px;
}
.panel-body {
  padding: 16px;
  text-align: center;
  width: 100%;
  width: 954px;
  height: 580px;
}
.question_title {
    font-size: 16px;
    height: 32px;
    color: #666769;
    position: absolute;
    top: 33px;
    bottom: 515px;
    left: 120px;
}
.question_title_two {
  font-size: 16px;
  color: #666769;
  position: absolute;
  top: 33px;
  bottom: 515px;
  left: 82px;
}
.slide-one-parent-container {
  width: 954px;
  height: 580px;
  border-radius: 3px;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.2);
  background-color: #ffffff;
  position: relative;
}
.slide-two-parent-container {
  width: 954px;
  height: 580px;
  border-radius: 3px;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.2);
  background-color: rgb(45, 45, 116);
  position: relative;
}
.number-icon-container {
    width: 40px;
  height: 40px;
  background-color: #f4ab37;
  border-radius: 30px;
}
.align-content-icons {
    text-align: center;
    align-items: center;
}
.icon-div {
  align-self: center;
  font-size: 25px;
  font-weight: bolder;
  padding-top: 2px;
}
.icon-1-div-slide-2 {
  position: absolute;
  top: 66px;
  left: 86px;
}
.icon-2-div-slide-2 {
  position: absolute;
  top: 66px;
  left: 273px;
}
.icon-3-div-slide-2 {
  position: absolute;
  top: 66px;
  left: 457px;
}
.icon-4-div-slide-2 {
  position: absolute;
  top: 66px;
  left: 643px;
}
.icon-5-div-slide-2 {
  position: absolute;
  top: 66px;
  left: 828px;
}
.slide-one-container {
  width: 954px;
  height: 580px;
  border-radius: 3px;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.2);
  background-color: #ffffff;
}
.item {
  width: 954px !important;
  height: 580px !important;
  border-radius: 3px;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.2);
  background-color: #ffffff;
}
.carousel-inner {
  width: 954px !important;
  height: 580px !important;
  border-radius: 3px;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.2);
  background-color: #ffffff;
  z-index: 1001;
}
#myCarousel {
  width: 954px !important;
  height: 580px !important;
  border-radius: 3px;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.2);
  background-color: #ffffff;
}
.carousel-indicators {
   margin-left: 208px !important;
    margin-right: 18%;
    z-index: 1002;
}
.carousel-indicators li {
    display: inline-block;
    width: 14px !important;
    height: 14px !important;
    cursor: pointer;
    background-color: rgba(0,0,0,0);
    border: 1px solid rgb(161, 159, 159);
    border-radius: 10px;
    
   
}
.carousel-indicators .active {
    background-color: #4c8ce3;
}


input:checked + .slide-container .nav label { display: block; }

</style>

