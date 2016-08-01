import {getTokenId} from '../../utils/storageutil';
import AccesslogService from '../../services/accesslogservice';
import * as authenservice from '../../services/authenservice';
import {getParamValue,getHtmlName} from '../../utils/urlutils';
/** 模版方法父类 **/
export default class BaseCrtl {

  constructor() {
    this.screenH = screen.height;
    this.screenW = screen.width;
  }

  /** 鉴权方式，tokenId(一定需要tokenId才能访问)，anon（可以匿名访问） **/
  getauthen(){
    return 'tokenId';
  }

  /** 保存访问日志信息 **/
  saveAccessLogs(tokenId){
    AccesslogService.getInstance().saveAccessLogs(tokenId);
  }

  /** 准确的说这里是一个抽象方法需要子类去重写的 **/
  invokeMain(tokenId){

  }

  /** 初始化方法 **/
  init(){
    /** 首先看缓存中有没有tokenId，如果有则从缓存中读取tokenId **/
    let tokenId = getTokenId();
    if (tokenId) {
      this.invokeMain(tokenId);
      this.saveAccessLogs(tokenId);
    } else {
      /** 调用微信鉴权模块获取tokenId **/
      let code = getParamValue('code');
      if (code && !(typeof code == "undefined" || code == "undefined")) {
        /** 如果有code的话就用code去微信获取权限信息 **/
        let promise = authenservice.authenticateFromWeixin(code);
        promise.done(resp => {
          if (resp.resultCode == 0) {
            let rtid = resp.data.tokenId;
            storageutil.setTokenId(rtid);
            try {
              AccesslogService.getInstance().saveAccessLogs(rtid);
            } finally {
              this.invokeMain(rtid);
            }
          } else {
            alert("获取tokenId出错:" + resp.reason);
          }
        });
        promse.fail(resp => {
          alert("获取微信信息失败");
        });
      } else {
        /** 如果缓存中也没有token并且也没有code的话就要看看是否可以匿名访问 **/
        if ('anon' == this.getauthen()) {
            this.invokeMain(null);
            this.saveAccessLogs(tokenId);
        } else {
           alert('您需要登陆才能访问');
        }
      }
    }
  }

  /** 初始化微信分享 **/
  initWeixinShare(){

  }
}
