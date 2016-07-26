/**
 * 判断浏览器是不是微信浏览器
 * @return {Boolean} [description]
 */
export function isWeiXinBrowser() {
  let ua = navigator.userAgent.toLowerCase();
  if(ua.match(/MicroMessenger/i)=="micromessenger") {
    return true;
  }
  return false;
}
