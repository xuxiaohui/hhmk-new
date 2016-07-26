import { clearParams } from './objectutils';
import * as config from '../common/scripts/config';

/**
 * 发送http请求
 * @param  {[type]} params      发送http参数
 * @param  {[type]} loadManager 加载事件
 * @return {[type]}             [description]
 */
export function sendHttpRequest(params) {
  params = clearParams(params)

  return $.ajax({
    url: config.BASEURL,
    data: params,
    dataType: 'json',
    type: 'post',
    timeout:config.TIMEOUT
  })
}
