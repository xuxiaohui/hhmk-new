import * as authorservice from '../../toolcase/services/authorservice';
import {webchatActivityInfoPage} from '../../toolcase/services/ecshopservice';
import {commonAdMessageList} from '../../toolcase/services/advertservice';
import ToastService from '../../toolcase/components/toast/toastservice'
import {getPipeParams,getRetUrl} from '../../toolcase/utils/urlutils';
let mySwiper = null;
avalon.ready(()=>{
  ToastService.getInstance().showLoadingToast();

  let vm = avalon.define({
    $id: "C_Ecshop_index",
    finished:false,
    onsearch:false,
    /** 活动是否已经全部加在完毕 **/
    activityAllLoaded:false,
    /**需要套传的参数**/
    pipeObj:getPipeParams(),
    /** 广告列表 **/
    advertList:[],
    /** 活动的列表 **/
    activityList:[],
    /** 首页活动分类信息 **/
    activityPage:[],
    /** 每个分类所取的列表长度 **/
    toAdUrl:function(el) {
      if (el.adUrl) {
        window.location.href = getRetUrl(el.adUrl,vm.pipeObj.url);
      } else {
        return false;
      }
    },
    getTime:function(el,index){
      var dateStr = el.orderTime;
      if (dateStr) {
        if (index == 0) {
          return dateStr.substring(0, dateStr.indexOf(" "));
        } else if (index == 1) {
          return dateStr.substring(dateStr.indexOf(" ") + 1 , dateStr.length);
        }
      }
    }
  });

  authorservice.authenticate((tokenId) => {
    webchatActivityInfoPage(tokenId).then(resp => {
      if (resp.resultCode == 0) {
        vm.activityPage = resp.data.activityType;
        vm.finished = true;
      } else {
        alert(resp.reason);
      }
    }).always(function(){
      ToastService.getInstance().hideLoadingToast();
    });

    commonAdMessageList(tokenId).then(resp=>{
      if (resp.resultCode == 0) {
        vm.advertList = resp.data.adMessage;
        avalon.scan();
        setTimeout(function(){
          if (vm.advertList && vm.advertList.length > 1) {
            mySwiper = new Swiper('.swiper-container', {
              mode: 'horizontal',
              slidesPerView: 1,
              // 如果需要分页器
              pagination: '.swiper-pagination',
              loop:true,
              autoplay:3000
            });
          }
        }, 500);
      } else {
        alert(resp.reason);
      }
    });

    avalon.scan(document.body);
  });

});
