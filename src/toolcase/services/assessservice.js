/** 评论相关的服务 **/
import * as http from '../utils/httputils';

/**
 * 获取评论列表
 * @param  {[type]} tokenId    [用户凭证]
 * @param  {[type]} activityId [对应活动的id]
 * @param  {[type]} startNum   [获取信息的起始位置]
 * @param  {[type]} getNum=10  [分页大小]
 * @return {[type]}            [description]
 */
export function webchatActivityAssessList(tokenId,activityId,startNum,getNum=10) {
  return http.sendHttpRequest({
    method:'webchatActivityAssessList',
    activityId:activityId,
    startNum:startNum,
    getNum:getNum,
    tokenId:tokenId
  });
}
