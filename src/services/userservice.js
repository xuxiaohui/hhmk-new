import * as http from '../utils/httputils'
/** 用户服务类 **/
/**
 * 获取用户的基本信息
 * @param  {[type]} tokenId [description]
 * @return {[type]}         [description]
 */
export function webchatGetUserInfo(tokenId) {
  return http.sendHttpRequest({
    method:'webchatGetUserInfo',
    tokenId:tokenId
  });
}
