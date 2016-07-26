import * as http from '../utils/httputils'
/** 通知公告 **/

/**
 * 获取我的通知公告列表
 * @param  {[type]} tokenId    对应用户的tokenId
 * @param  {[type]} hospitalId 要查询的医院的id
 * @return {[type]}            [description]
 */
export function commonNoticeList(params){

  return http.sendHttpRequest({
    method:'commonNoticeList',
    tokenId:params.tokenId,
    noticeId:params.lastNoticeId,
    hospitalId:params.hospitalId,
    getNum:params.getNum
  });
}
