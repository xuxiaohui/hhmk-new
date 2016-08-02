import BaseCrtl from '../../toolcase/common/scripts/baseCrtl';
import {webchatActivityTicket} from '../../toolcase/services/ecshopservice';
import {getParamValue,getPipeParams} from '../../toolcase/utils/urlutils';
import ToastService from '../../toolcase/components/toast/toastservice';

let viewModel = null;
let activityId = getParamValue('activityId');

class EcshopHospitalListCrtl extends BaseCrtl {
  getauthen(){
    return 'anon';
  }

  initAvalon() {
    viewModel = avalon.define({
      $id: "C_Ecshop_ticket",
      finished:false,
      /**需要套传的参数**/
      pipeObj:getPipeParams(),
      /*我对医生的印象*/
      ticketList:[]
    });
  }

  invokeMain(tokenId) {
    this.initAvalon();
    ToastService.getInstance().showLoadingToast();
    let promise = webchatActivityTicket(tokenId,activityId);

    promise.fail(function() {
      alert("获取报名信息失败");
    });

    promise.done(function(resp) {
      if (resp.resultCode == 0) {
        viewModel.ticketList = resp.data.ticket;
      } else {
        alert(resp.reason);
      }
    }).always(()=>{
      ToastService.getInstance().hideLoadingToast();
    });
  }
}

new EcshopHospitalListCrtl().init();
