import BaseCrtl from '../../toolcase/common/scripts/baseCrtl';
import {webchatActivityInfo} from '../../toolcase/services/ecshopservice';
import {webchatActivityAssessList} from '../../toolcase/services/assessservice';
import ToastService from '../../toolcase/components/toast/toastservice';
import {getPipeParams,getRetUrl,getParamValue} from '../../toolcase/utils/urlutils';
import {setTitle} from '../../toolcase/utils/pageutil';
let navOffsetY = null;
let viewModel = null;
let tokenId = null;
let pageSize = 10;
let heartTimer = null;
let activityId = getParamValue('ativityId');

class EcshopDetailCrtl extends BaseCrtl {
  initAvalon() {
    let that = this;
    avalon.ready(()=>{
      ToastService.getInstance().showLoadingToast();
      viewModel = avalon.define({
        $id: "C_Ecshop_detail",
        finished: false,
        /** 提醒倒计时,默认为10 **/
        countdown: 10,
        /**需要套传的参数**/
        pipeObj: getPipeParams(),
        tabIndex: 1,
        assessList:[],
        onLoad:false,
        assessAllLoad:false,
        /*我对医生的印象*/
        activityInfo: {},
        toCountDownUrl: function () {
          if (viewModel.countdown > 0)return;
          window.location.href = viewModel.nextUrl();
        },
        toggleTab: function (index) {
          viewModel.tabIndex = index;
          if (index == 1) {
            $("#detail-container").show();
            $("#comment-container").hide();
          }
          if (index == 2) {
            $("#detail-container").hide();
            $("#comment-container").show();
            if (viewModel.activityInfo.assessNum > 0 && viewModel.assessList.length <= 0) {
              //page.http.webchatActivityAssessList();
              that.getMoreAssessList();
            }
            //myScrollTop.scrollTo(0,margTop*(-1));
            $(".detail-container").css('marginTop',"0px");
            if ($(".detail-title-banner").hasClass("detail-title-banner-abs")) {
              $(".detail-title-banner").removeClass("detail-title-banner-abs");
              $(".detail-title-banner").css("top",0);
            }
            $.getScript(window.location.origin + '/lib/swipebox/js/jquery.swipebox.min.js');
          }
        },
        /** 下一个跳转链接 **/
        nextUrl: function () {
          /** 如果是实物商城的商品那么需要跳转到实物商品的购买页面 **/
          if (viewModel.activityInfo.activityBlock == 3) {
            if (viewModel.activityInfo.ticketId[0]) {
              return getRetUrl('ecshop_physical_order.html?ticketId=' + viewModel.activityInfo.ticketId[0], viewModel.pipeObj.url);
            }
            return '';
          } else {
            return getRetUrl('ecshop_hospital_list.html?activityId=' + viewModel.activityInfo.activityId, viewModel.pipeObj.url);
          }
        },

        toNextHref: function () {
          var activityInfo = viewModel.activityInfo;
          /** 如果是互动商城并且没有预约医院 **/
          if (!activityInfo.ticketId || activityInfo.ticketId.length < 1) return;
          if (activityInfo.reminid && activityInfo.reminid.reminidContent) {
            viewModel.showDeclare();
            var obj = viewModel;
            heartTimer = setInterval(function () {
              if (obj.countdown > 0) {
                obj.countdown = obj.countdown - 1;
              } else {
                if (heartTimer) {
                  clearInterval(heartTimer);
                  heartTimer = null;
                }
              }
            }, 1000);
          } else {
            window.location.href = viewModel.nextUrl();
          }
        },
        showImg:function(e,index,item){
          e.preventDefault();
          var imgArr = [];
          if (item.encgroup && item.encgroup.length > 0) {
            item.encgroup.forEach(function(el){
              imgArr.push({href:el.encUrlBig});
            });
          }
          $.swipebox(imgArr,{
            initialIndexOnArray:index
          });
        },
        showDeclare: function () {
          var hb = $('html, body');
          hb.css({
            'height': that.screenH + 'px',
            'overflow': 'hidden'
          });
          $("#declare-panel").show();
        },
        closeDeclare: function () {
          $("#declare-panel").hide();
          var hb = $('html, body');
          /*hb.css({
          'height': 'auto',
          'overflow': 'auto'
          });*/
          if (heartTimer) {
            clearInterval(heartTimer);
            heartTimer = null;
          }
          if (!$.isEmptyObject(viewModel.activityInfo.reminid) && viewModel.activityInfo.reminid.reminidSecond > 0) {
            viewModel.countdown = viewModel.activityInfo.reminid.reminidSecond;
          }
        }
      });
    });
  }

  /** 公共部分需要执行的代码 **/
  commonInit(){
    let that = this;

    setTimeout(function () {
      that.mySwiper = new Swiper('.swiper-container', {
        // 如果需要分页器
        pagination: '.swiper-pagination',
        loop: true,
        onSlideChangeEnd: function (swiper) {
          var picLength = viewModel.activityInfo.picture.length;
          var realIndex = (swiper.activeIndex % picLength) == 0 ? picLength : (swiper.activeIndex % picLength);
          $("#currentIndex").html(realIndex);
        }
      });
    }, 500);


    document.getElementById("wrapper").addEventListener('scroll', function () {
      if (!navOffsetY) {
        navOffsetY = $("#stickyPart").offset().top;
      }
      //console.log("navOffsetY:"+navOffsetY);
      if (!that.gtIOS6() || that.isSupportSticky()) {
        var bannerHeight = $(".detail-title-banner").height();
        if (document.getElementById("wrapper").scrollTop >= navOffsetY) {
          $("#stickyPart").addClass('sticky-fiexed');
          $(".detail-container").css('marginTop', bannerHeight + "px");
        } else {
          $("#stickyPart").removeClass('sticky-fiexed');
          $(".detail-container").css('marginTop', "0px");
        }
      }

      if (viewModel.tabIndex == 2 && !viewModel.assessAllLoad && !viewModel.onLoad) {
        var containerHeight = $("#wrapper").height();
        var top = $("#finished").offset().top;
        var barHeight = $("#finished").height();
        if ((top + barHeight) <= containerHeight) {
          that.getMoreAssessList();
        }
      }
      /** 防止滚动越界 **/
      var wrapperScrollHeight = document.getElementById("wrapper").scrollHeight;
      var offSetHeight = document.getElementById("wrapper").offsetHeight;
      var srollPosition = document.getElementById("wrapper").scrollTop;
      if (offSetHeight + srollPosition + 2 >= wrapperScrollHeight) {
        document.getElementById("wrapper").scrollTop = srollPosition -1;
      }
    });
  }

  gtIOS6() {
    var userAgent = window.navigator.userAgent;
    var ios = userAgent.match(/(iPad|iPhone|iPod)\s+OS\s([\d_\.]+)/);
    return ios && ios[2] && (parseInt(ios[2].replace(/_/g, '.'), 10) >= 6);
  }

  isSupportSticky() {
    var prefixTestList = ['', '-webkit-', '-ms-', '-moz-', '-o-'];
    var stickyText = '';
    for (var i = 0; i < prefixTestList.length; i++) {
      stickyText += 'position:' + prefixTestList[i] + 'sticky';
    }
    // 创建一个dom来检查
    var div = document.createElement('div');
    var body = document.body;
    div.style.cssText = 'display:none' + stickyText;
    body.appendChild(div);
    var isSupport = /sticky/i.test(window.getComputedStyle(div).position);
    body.removeChild(div);
    div = null;
    return isSupport;
  }

  invokeMain(_tokenId) {
    tokenId = _tokenId;
    this.initAvalon();
    let that = this;
    let activityId = getParamValue("ativityId");

    let infoPromise = webchatActivityInfo(_tokenId,activityId);

    infoPromise.done(resp => {
        if (resp.resultCode == 0) {
          if (!resp.data.contactsInfo) {
            resp.data.contactsInfo = {}
          }
          viewModel.activityInfo = resp.data;
          if (!$.isEmptyObject(resp.data.reminid) && resp.data.reminid.reminidSecond > 0) {
            viewModel.countdown = resp.data.reminid.reminidSecond;
          }
          setTitle(resp.data.activityName);
        } else {
          alert(resp.reason);
        }
        avalon.scan(document.body);
        that.commonInit();
    }).always(()=>{
      ToastService.getInstance().hideLoadingToast();
    });
    avalon.scan(document.body);
    //需要给评价的容器设置一个最小的高度,防止切换的时候页面跳跃
    let bannerHeight = $(".detail-title-banner").height();
    let containerHeight = $("#wrapper").height();
    $("#comment-container").css("minHeight",(containerHeight-bannerHeight) + "px");
  }

  getauthen(){
    return 'anon';
  }

  getMoreAssessList() {
    if (viewModel.assessAllLoad) {
      return;
    }
    if (viewModel.onLoad) {
      return;
    }
    viewModel.onLoad = true;
    ToastService.getInstance().showLoadingToast();
    /** 初始的列表长度 **/
    var startNum = 0;
    if (viewModel.assessList && viewModel.assessList.length > 0) {
      startNum = viewModel.assessList.length;
    }

    var promise = webchatActivityAssessList(tokenId,activityId,startNum);
    promise.fail(function () {
      //alert("操作失败");
    });

    promise.always(function (parameter) {
      ToastService.getInstance().hideLoadingToast();
      viewModel.onLoad = false;
    });

    promise.done(function (resp) {
      if (resp.resultCode == 0) {
        if (resp.data.assessGroup && resp.data.assessGroup.length > 0) {
          if (viewModel.assessList.length == startNum && resp.data.assessGroup.length > 0) {
            viewModel.assessList = viewModel.assessList.concat(resp.data.assessGroup);
          }
        }
        if (!resp.data.assessGroup || resp.data.assessGroup.length < pageSize) {
          viewModel.assessAllLoad = true;
        }
      } else {
        alert(resp.reason);
      }
    });
  }
}

new EcshopDetailCrtl().init();
