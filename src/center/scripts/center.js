import * as authenservice from '../../toolcase/services/authenservice';
import {webchatGetUserInfo} from '../../toolcase/services/userservice';
import ToastService from '../../toolcase/components/toast/toastservice'

let avalonVm = null;
avalon.ready(()=>{
    ToastService.getInstance().showLoadingToast();
    avalonVm = avalon.define({
     $id: "C_Center",
     finished: true,
     /*我对医生的印象*/
     data: {},
     allLabels: []
   });
   authenservice.authenticate((tokenId) => {
     webchatGetUserInfo(tokenId).then(resp => {
       if (resp.resultCode == 0) {
         avalonVm.data = resp.data;
         avalonVm.finished = true;
       } else {
         alert("读取个人信息出错");
       }
     }).always(function(){
       ToastService.getInstance().hideLoadingToast();
     });
     avalon.scan(document.body);
   });
});
