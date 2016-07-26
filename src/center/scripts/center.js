import * as authorservice from '../../services/authorservice';
import {webchatGetUserInfo} from '../../services/userservice';
let avalonVm = null;
avalon.ready(()=>{
    avalonVm = avalon.define({
     $id: "C_Center",
     finished: true,
     /*我对医生的印象*/
     data: {},
     allLabels: []
   });
   authorservice.authenticate((tokenId) => {
     webchatGetUserInfo(tokenId).then(resp => {
       if (resp.resultCode == 0) {
         avalonVm.data = resp.data;
         avalonVm.finished = true;
       } else {
         alert("读取个人信息出错");
       }
     });
     avalon.scan(document.body);
   });
});
