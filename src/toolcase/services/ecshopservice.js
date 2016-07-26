/** 商城信息处理累 **/
import * as http from '../utils/httputils';

/**
 * 获得商城首页的信息
 * @return {[type]} [description]
 */
export function webchatActivityInfoPage(tokenId,getNum=5) {
  return http.sendHttpRequest({
    method:'webchatActivityInfoPage',
    tokenId:tokenId,
    getNum:getNum
  });
}
