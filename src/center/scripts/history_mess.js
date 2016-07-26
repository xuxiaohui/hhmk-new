import * as authorservice from '../../services/authorservice';
import {commonNoticeList} from '../../services/noticeservice';
avalon.ready(()=>{
   let avalonVm = avalon.define({
      $id: 'C_history',
      data: [],
      href: function(url){
        location.href = url;
      }
   });
   authorservice.authenticate((tokenId) => {
     commonNoticeList(tokenId).then(resp => {
       if (resp.resultCode == 0) {
         avalonVm.data = resp.data.notice;
       } else {
         alert(resp.reason);
       }
     });
     avalon.scan(document.body);
   });
});
