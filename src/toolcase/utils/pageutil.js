/** 页面工具类 **/

/**
 * 微信端修改title的hacker代码
 * @param  {[string]} title [去要设置的title字符串]
 * @return {[type]}       [description]
 */
export function setTitle(title){
  var $body = $('body');
  document.title = title;
  // hack在微信等webview中无法修改document.title的情况
  var $iframe = $('<iframe src="/favicon.ico"></iframe>').on('load', function () {
    setTimeout(function () {
      $iframe.off('load').remove();
    }, 0)
  }).appendTo($body);
}
