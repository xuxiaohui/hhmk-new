import BaseCrtl from '../../toolcase/common/scripts/baseCrtl';
import {webchatActivityInfoPage} from '../../toolcase/services/ecshopservice';
import {commonAdMessageList} from '../../toolcase/services/advertservice';
import ToastService from '../../toolcase/components/toast/toastservice';
import DialogService from '../../toolcase/components/dialog/dialogservice';
import {getPipeParams,getRetUrl} from '../../toolcase/utils/urlutils';

class EcshopIndexCrtl extends BaseCrtl {

  initAvalon(){
    avalon.ready(()=>{

      this.viewModel = avalon.define({
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
        typePageSize:5,
        /** 每个分类所取的列表长度 **/
        toAdUrl:function(el) {
          if (el.adUrl) {
            window.location.href = getRetUrl(el.adUrl,vm.pipeObj.url);
          } else {
            return false;
          }
        },
        showAlert:function(){
          DialogService.getInstance().alertDialog('您好啊');
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
    });
  }

  getauthen(){
    return 'anon';
  }

  
  invokeMain(tokenId) {
    this.initAvalon();
    ToastService.getInstance().showLoadingToast();
    let pagePromise = webchatActivityInfoPage(tokenId,5);
    let adListPromise = commonAdMessageList(tokenId);
    $.when(pagePromise, adListPromise).done(()=>{
      ToastService.getInstance().hideLoadingToast();
    });
    pagePromise.done(resp => {
      if (resp.resultCode == 0) {
        this.viewModel.activityPage = resp.data.activityType;
        this.viewModel.finished = true;
      } else {
        alert(resp.reason);
      }
    }).fail((resp)=>{
      alert("获取分类信息出错");
    });

    adListPromise.done(resp=>{
      if (resp.resultCode == 0) {
        let that = this;
        that.viewModel.advertList = resp.data.adMessage;
        avalon.scan();
        setTimeout(function(){
          if (that.viewModel.advertList && that.viewModel.advertList.length > 1) {
            that.mySwiper = new Swiper('.swiper-container', {
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
    }).fail((resp)=>{
      alert("获取广告信息出错");
    });
    avalon.scan(document.body);
  }
}

new EcshopIndexCrtl().init();
