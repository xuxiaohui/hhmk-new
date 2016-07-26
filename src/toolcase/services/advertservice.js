/** 广告服务 **/
import * as http from '../utils/httputils';

/**
 * 获取广告信息
 * @param  {[type]} tokenId [用户的tokenId信息]
 * @param  {[type]} adSet:1 [广告的类别]
 * @return {[type]}         [description]
 */
export function commonAdMessageList(tokenId,adSet=1){
  return http.sendHttpRequest({
    method:'commonAdMessageList',
    adSet:adSet
  });
}
