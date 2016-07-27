/** 微信服务 **/
import * as http from '../utils/httputils';
export default class WeixinService {

  let weixinService = null;

  static getInstance(){
    if (!weixinService) {
      weixinService = new WeixinService();
    }
    return weixinService;
  }

  constructor(){

  }

  /**
   * 处理微信签名
   * @return {[type]} [description]
   */
  function weixinSignature() {
			var url = this.getSignatureUrl();

      let promise = http.sendHttpRequest({
        method:'webchatSignature',
        url:url
      });

      promse.done(resp => {
        var data = resp.data;
        wx.config({
          debug: wxsdk.debug,
          appId: data.appId,
          timestamp: data.timestamp,
          nonceStr: data.nonceStr,
          signature: data.signature,
          jsApiList: wxsdk.list
        });
      });
      return this;
  }

  /**
   * 分析出用于生成签名的链接
   * @return {[type]} [description]
   */
  function getSignatureUrl() {
    var link = window.location.href.split('#')[0];
		return link;
  }
}
