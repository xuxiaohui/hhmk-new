import * as authenservice from '../../toolcase/services/authenservice';
import {commonNoticeList} from '../../toolcase/services/noticeservice';
import ToastService from '../../toolcase/components/toast/toastservice'

avalon.ready(()=>{
   ToastService.getInstance().showLoadingToast();
   let avalonVm = avalon.define({
      $id: 'C_history',
      data: [],
      href: function(url){
        location.href = url;
      }
   });
   authenservice.authenticate((tokenId) => {
     commonNoticeList(tokenId).then(resp => {
       if (resp.resultCode == 0) {
         avalonVm.data = resp.data.notice;
       } else {
         alert(resp.reason);
       }
       setTimeout(function(){
         ToastService.getInstance().hideLoadingToast();
       },2000);
     });

     setTimeout(function(){
       ToastService.getInstance().showSuccessToast();
     },5000);

     avalon.scan(document.body);
   });
});
