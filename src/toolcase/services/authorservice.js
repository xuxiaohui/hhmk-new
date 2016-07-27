import {getParamObj,getHtmlName} from '../utils/urlutils';
import * as storageutil from '../utils/storageutil';
import {isWeiXinBrowser} from '../utils/bowerutil';
import * as http from '../utils/httputils'
import AccesslogService from './accesslogservice'

/**
 * 这里配置可匿名访问的html页面
 * @type {Array}
 */
let anonymousAuthority = [
  'history_mess'
]

/**
* 用户鉴权
* @param callback 登录后的回调函数
* @param anonymousAuthority 拥有匿名权限的模块进行免登录处理
*/
export function authenticate (callback) {

  let code = getParamObj('code');

  var tokenId = storageutil.getTokenId();

  var urlTokenId = getParamObj('tokenId');

  var htmlName = getHtmlName();

  if(urlTokenId){
    storageutil.setTokenId(urlTokenId);

    try {
      AccesslogService.getInstance().saveAccessLogs(urlTokenId);
    } finally {
      callback(urlTokenId);
    }

    //$a.tokenId = urlTokenId;
  } else {
    if(!tokenId) {
      if (!isWeiXinBrowser()) {
        try {
          AccesslogService.getInstance().saveAccessLogs(null);
        } finally {
          callback(null);
        }
        return;
      }
      if(typeof code == "undefined" || code == "undefined"){
        if($.inArray(htmlName, anonymousAuthority) >= 0){
          /*AccesslogService.getInstance().saveAccessLogs(null);
          callback(null);*/
          //$a.saveAccessLogs(null);
          try {
            AccesslogService.getInstance().saveAccessLogs(null);
          } finally {
            callback(null);
          }
        } else {
          alert("您尚未登陆系统");
        }
      } else {
        http.sendHttpRequest({
          method:'webchatLoginIn',
          code:code
        }).then(resp => {
          if (resp.resultCode == 0) {
            let rtid = resp.data.tokenId;
            storageutil.setTokenId(rtid);
            //$a.tokenId = rtid;
            //$a.saveAccessLogs(rtid);
            try {
              AccesslogService.getInstance().saveAccessLogs(rtid);
            } finally {
              callback(rtid);
            }
            //callback(rtid);

          } else {
            alert("获取tokenId出错:" + resp.reason);
          }
        });
      }

    } else {
      //$a.saveAccessLogs(tokenId);
      //$a.tokenId = tokenId;
      try {
        AccesslogService.getInstance().saveAccessLogs(rtid);
      } finally {
        callback(tokenId);
      }
      //callback(tokenId);
    }
  }
}
