/** 商城信息服务 **/
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

/**
 * 获得活动的详细信息
 * @param  {[type]} tokenId    [用户凭证]
 * @param  {[type]} activityId [活动的id]
 * @return {[type]}            [description]
 */
export function webchatActivityInfo(tokenId,activityId) {
  return http.sendHttpRequest({
    method:'webchatActivityInfo',
    tokenId:tokenId,
    activityId:activityId
  });
}

/**
 * 获得活动商城的订单选项
 * @param  {[type]} tokenId    [用户凭证]
 * @param  {[type]} activityId [活动的ID]
 * @return {[type]}            [description]
 */
export function webchatActivityTicket(tokenId,activityId) {
  return http.sendHttpRequest({
    method:'webchatActivityTicket',
    tokenId:tokenId,
    activityId:activityId
  });
}
