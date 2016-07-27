/** 记录访问日志 **/
import {serializeURL} from '../utils/urlutils';
import * as config from '../common/scripts/config';

export default class AccesslogService {

  static getInstance(){
    const accesslogService = new AccesslogService();
    return accesslogService;
  }

/**
 * 保存访问日志
 * @param  {[type]} tokenId   用户的权限信息
 * @param  {[type]} addParams 访问的参数信息
 * @return {[type]}           [description]
 */
  saveAccessLogs(tokenId,addParams) {

    var d = tokenId ? [{
				"headers" : {
					"appId": navigator.userAgent,
					"appType": 3,
					"serviceUrl": window.location.pathname,
					"inputParameter": serializeURL(),
					"tokenId": tokenId
				}
			}] : [{
				"headers" : {
					"appId": navigator.userAgent,
					"appType": 3,
					"serviceUrl": window.location.pathname,
					"inputParameter": serializeURL()
				}
			}];
			$.ajax({
				url: config.LOGSERVERURL,
				data: JSON.stringify(d),
				dataType: "json",
				type: "POST",
				crossDomain: true,
				complete:function(){
					"use strict";
					if (addParams && addParams.indexOf('close') >= 0) {
            console.log('关闭事件');
					}
				}
			});
  }
}
